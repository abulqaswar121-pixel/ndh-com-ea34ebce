/**
 * Omni-Hub consultant endpoint.
 *
 * Two modes, one protocol:
 *  1. `engine` — no model key configured (or upstream failed). The deterministic
 *     routing engine answers instantly, streamed as OpenAI-style SSE frames.
 *  2. `model`  — a key is present. The engine's routing decision, recommended
 *     courses and price bands are passed to the model as grounding, so the
 *     prose can be richer (and in the visitor's language) without ever
 *     inventing a subsidiary, a course or a price.
 *
 * Frames are emitted as `data: {...}\n\n`. The first frame carries the
 * structured payload the UI renders as cards and chips:
 *   { "omnihub": { cards, chips, qualification, intent } }
 * Text then arrives as `{ choices: [{ delta: { content } }] }` for
 * compatibility with the existing streaming reader.
 */
import { createFileRoute } from "@tanstack/react-router";
import { NDH_BRIEF } from "@/lib/chat-brief";
import { respond, type OmniMessage } from "@/lib/omni-hub/engine";
import { REGIONS, type RegionId } from "@/lib/region";
import { LOCALES, type LocaleId } from "@/lib/i18n/dictionary";

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 14;
const buckets = new Map<string, { count: number; reset: number }>();

function rateLimited(key: string) {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || now > bucket.reset) {
    buckets.set(key, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  bucket.count += 1;
  return bucket.count > MAX_PER_WINDOW;
}

const encoder = new TextEncoder();

function textFrame(content: string) {
  return encoder.encode(`data: ${JSON.stringify({ choices: [{ delta: { content } }] })}\n\n`);
}

function metaFrame(payload: unknown) {
  return encoder.encode(`data: ${JSON.stringify({ omnihub: payload })}\n\n`);
}

const DONE = encoder.encode("data: [DONE]\n\n");

/** Stream the engine's answer with light pacing so it reads like typing. */
function engineStream(text: string, payload: unknown): ReadableStream<Uint8Array> {
  const chunks = text.match(/[\s\S]{1,28}/g) ?? [];
  let index = 0;
  return new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(metaFrame(payload));
    },
    async pull(controller) {
      if (index >= chunks.length) {
        controller.enqueue(DONE);
        controller.close();
        return;
      }
      controller.enqueue(textFrame(chunks[index]));
      index += 1;
      // Small pause between chunks; keeps the perceived behaviour consistent
      // with a model response. Edge runtimes allow awaited timers here.
      await new Promise((resolve) => setTimeout(resolve, 16));
    },
  });
}

function isRegion(value: unknown): value is RegionId {
  return typeof value === "string" && REGIONS.some((item) => item.id === value);
}

function isLocale(value: unknown): value is LocaleId {
  return typeof value === "string" && LOCALES.some((item) => item.id === value);
}

export const Route = createFileRoute("/api/public/omni-hub")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const ip =
          request.headers.get("cf-connecting-ip") ??
          request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
          "anon";

        if (rateLimited(ip)) {
          return new Response("Too many messages. Please wait a moment.", { status: 429 });
        }

        let body: {
          messages?: (OmniMessage & { qualificationId?: string })[];
          region?: string;
          locale?: string;
        };
        try {
          body = (await request.json()) as typeof body;
        } catch {
          return new Response("Invalid request", { status: 400 });
        }

        const incoming = Array.isArray(body.messages) ? body.messages : [];
        const messages: OmniMessage[] = incoming
          .filter(
            (message) =>
              message &&
              (message.role === "user" || message.role === "assistant") &&
              typeof message.content === "string" &&
              message.content.trim().length > 0,
          )
          .slice(-12)
          .map((message) => {
            const qualificationId = message.qualificationId;
            return {
              role: message.role,
              content: message.content.slice(0, 1500),
              // Carried forward so the next turn knows which question it answers.
              ...(message.role === "assistant" &&
              typeof qualificationId === "string" &&
              ["interest", "experience", "timeline", "contact"].includes(qualificationId)
                ? { qualificationId: qualificationId as OmniMessage["qualificationId"] }
                : {}),
            };
          });

        if (messages.length === 0) {
          return new Response("No message provided", { status: 400 });
        }

        const region: RegionId | undefined = isRegion(body.region) ? body.region : undefined;
        const locale: LocaleId = isLocale(body.locale) ? body.locale : "en";

        // The routing brain — always runs, in both modes.
        const reply = respond({ messages, region });

        const payload = {
          intent: reply.intent,
          confidence: reply.confidence,
          owner: reply.owner ?? null,
          cards: reply.cards,
          chips: reply.chips,
          qualification: reply.qualification ?? null,
          facts: reply.profile.facts,
        };

        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) {
          return new Response(engineStream(reply.text, payload), {
            headers: {
              "Content-Type": "text/event-stream",
              "Cache-Control": "no-cache",
              "x-ndh-mode": "engine",
            },
          });
        }

        const grounding = [
          "ROUTING DECISION (follow it, do not change the route or the recommendation):",
          `Intent: ${reply.intent}. Route the person to the NDH business named in the routing card.`,
          reply.cards.length
            ? `Cards already rendered to the user (do not repeat their contents, refer to them naturally): ${reply.cards
                .map((card) => `${card.title} -> ${card.href}`)
                .join("; ")}`
            : "No cards rendered for this turn.",
          reply.qualification
            ? `Ask this next question in your own words: ${reply.qualification.prompt}`
            : "No qualifying question is needed this turn.",
          reply.profile.facts.length
            ? `Facts collected so far: ${reply.profile.facts.join(" · ")}`
            : "No facts collected yet.",
          `Conversation length: ${messages.filter((message) => message.role === "user").length} visitor turn(s).`,
          "If the visitor is answering a question you asked, acknowledge it briefly and continue the thread - do not restart.",
          region ? `Visitor region (auto-detected): ${region}.` : "Visitor region: unknown.",
          `Reply language: ${locale}. Write the whole reply in that language.`,
          "Never quote prices, figures, timelines, client names or statistics - the parent site publishes no prices. Point to the page that owns the number instead.",
          "Keep it under 120 words, warm and direct. No markdown headings, no emojis.",
          "",
          "DRAFT ANSWER FROM THE ROUTING ENGINE (you may improve the wording, keep the substance):",
          reply.text,
        ].join("\n");

        let upstream: Response;
        try {
          upstream = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "google/gemini-3.7-flash",
              stream: true,
              messages: [{ role: "system", content: `${NDH_BRIEF}\n\n${grounding}` }, ...messages],
            }),
          });
        } catch {
          return new Response(engineStream(reply.text, payload), {
            headers: {
              "Content-Type": "text/event-stream",
              "Cache-Control": "no-cache",
              "x-ndh-mode": "engine",
            },
          });
        }

        if (!upstream.ok || !upstream.body) {
          // Any upstream problem degrades to the deterministic answer rather
          // than an error state — the visitor still gets routed correctly.
          return new Response(engineStream(reply.text, payload), {
            headers: {
              "Content-Type": "text/event-stream",
              "Cache-Control": "no-cache",
              "x-ndh-mode": "engine",
            },
          });
        }

        const upstreamReader = upstream.body.getReader();
        const stream = new ReadableStream<Uint8Array>({
          start(controller) {
            controller.enqueue(metaFrame(payload));
          },
          async pull(controller) {
            const { done, value } = await upstreamReader.read();
            if (done) {
              controller.enqueue(DONE);
              controller.close();
              return;
            }
            controller.enqueue(value);
          },
          cancel() {
            void upstreamReader.cancel();
          },
        });

        return new Response(stream, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "x-ndh-mode": "model",
          },
        });
      },
    },
  },
});
