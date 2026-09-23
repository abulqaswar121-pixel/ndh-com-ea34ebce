import { useEffect, useState } from "react";
import { Minus, X } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Button } from "@/components/ui/button";

type Msg = { role: "user" | "assistant"; content: string };

const STORAGE_KEY = "ndh-support-chat";

const GREETING: Msg = {
  role: "assistant",
  content:
    "Hi, welcome to Najeeb Digital Hub. Ask me anything about hiring a delivery team, the Academy, or applying as talent.",
};

const CHIPS = [
  "Hire a team",
  "Join the Academy",
  "Apply as talent",
  "How does pricing work?",
];

export function SupportChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Msg[];
        if (Array.isArray(parsed) && parsed.length > 0) setMessages(parsed);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-30)));
    } catch {
      /* ignore */
    }
  }, [messages]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;

    setError(null);
    setInput("");
    const next = [...messages, { role: "user" as const, content: trimmed }];
    setMessages(next);
    setBusy(true);

    try {
      const res = await fetch("/api/public/support-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.filter((m, i) => !(i === 0 && m === GREETING)),
        }),
      });

      if (!res.ok || !res.body) {
        setError(
          (await res.text().catch(() => "")) ||
            "The assistant is unavailable right now. Please use the contact page.",
        );
        setBusy(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assistant = "";
      let started = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const data = line.slice(5).trim();
          if (!data || data === "[DONE]") continue;
          try {
            const json = JSON.parse(data);
            const delta: string | undefined = json.choices?.[0]?.delta?.content;
            if (!delta) continue;
            assistant += delta;
            if (!started) {
              started = true;
              setMessages((m) => [...m, { role: "assistant", content: assistant }]);
            } else {
              setMessages((m) => {
                const copy = [...m];
                copy[copy.length - 1] = { role: "assistant", content: assistant };
                return copy;
              });
            }
          } catch {
            /* ignore partial frames */
          }
        }
      }

      if (!started) {
        setError("No response received. Please try again.");
      }
    } catch {
      setError("Connection problem. Please check your network and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close support chat" : "Open support chat"}
        aria-expanded={open}
        className="ai-assistant-launcher"
      >
        {open ? (
          <X aria-hidden="true" />
        ) : (
          <>
            <span className="ai-assistant-orbit" aria-hidden="true" />
            <BrandMark />
            <span className="ai-assistant-status" aria-hidden="true" />
          </>
        )}
      </Button>

      {open && (
        <div
          role="dialog"
          aria-label="Najeeb Digital Hub support chat"
          className="ai-assistant-dialog"
        >
          <header className="ai-assistant-header">
            <BrandMark />
            <div className="ai-assistant-title">
              <p>NDH AI Assistant</p>
              <span><i aria-hidden="true" /> Online now</span>
            </div>
            <Button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Minimise chat"
              variant="ghost"
              size="icon-sm"
            >
              <Minus aria-hidden="true" />
            </Button>
          </header>

          <Conversation className="ai-assistant-conversation">
            <ConversationContent className="ai-assistant-messages">
              {messages.map((m, i) => (
                <Message from={m.role} key={`${m.role}-${i}`}>
                  <MessageContent>
                    <MessageResponse>{m.content}</MessageResponse>
                  </MessageContent>
                </Message>
              ))}

              {busy && <Shimmer className="text-sm">Thinking...</Shimmer>}

              {error && (
                <p className="ai-assistant-error">
                  {error} <a href="/contact">Contact the team</a>.
                </p>
              )}

              {messages.length <= 1 && !busy && (
                <div className="ai-assistant-chips">
                  {CHIPS.map((c) => (
                    <Button key={c} type="button" onClick={() => void send(c)} variant="outline" size="sm">
                      {c}
                    </Button>
                  ))}
                </div>
              )}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>

          <div className="ai-assistant-composer">
            <PromptInput
              onSubmit={(message) => void send(message.text)}
            >
              <PromptInputTextarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={1000}
              placeholder="Ask a question…"
              aria-label="Message"
              />
              <PromptInputFooter className="justify-end">
                <PromptInputSubmit status={busy ? "streaming" : "ready"} disabled={busy || input.trim().length === 0} />
              </PromptInputFooter>
            </PromptInput>
          </div>
        </div>
      )}
    </>
  );
}
