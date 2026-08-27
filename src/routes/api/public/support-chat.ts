import { createFileRoute } from "@tanstack/react-router";
import { NDH_BRIEF } from "@/lib/chat-brief";

type Msg = { role: "user" | "assistant"; content: string };

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 12;
const buckets = new Map<string, { count: number; reset: number }>();

function rateLimited(key: string) {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || now > b.reset) {
    buckets.set(key, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  b.count += 1;
  return b.count > MAX_PER_WINDOW;
}

export const Route = createFileRoute("/api/public/support-chat")({
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

        let body: { messages?: Msg[] };
        try {
          body = (await request.json()) as { messages?: Msg[] };
        } catch {
          return new Response("Invalid request", { status: 400 });
        }

        const incoming = Array.isArray(body.messages) ? body.messages : [];
        const messages = incoming
          .filter(
            (m) =>
              m &&
              (m.role === "user" || m.role === "assistant") &&
              typeof m.content === "string" &&
              m.content.trim().length > 0,
          )
          .slice(-12)
          .map((m) => ({ role: m.role, content: m.content.slice(0, 1500) }));

        if (messages.length === 0) {
          return new Response("No message provided", { status: 400 });
        }

        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) {
          return new Response("Assistant unavailable", { status: 503 });
        }

        const upstream = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-3.7-flash",
            stream: true,
            messages: [{ role: "system", content: NDH_BRIEF }, ...messages],
          }),
        });

        if (!upstream.ok || !upstream.body) {
          const status = upstream.status === 429 || upstream.status === 402 ? upstream.status : 502;
          return new Response(
            status === 429
              ? "The assistant is busy right now. Please try again shortly."
              : "The assistant is unavailable right now.",
            { status },
          );
        }

        return new Response(upstream.body, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
          },
        });
      },
    },
  },
});
