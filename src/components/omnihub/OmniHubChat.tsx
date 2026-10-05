import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, Bot, LoaderCircle, Minus, RotateCcw, Send, Sparkles, X } from "lucide-react";
import assistantAvatar from "@/assets/ndh-ai-assistant.png";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/lib/preferences";
import { OPEN_ASSISTANT_EVENT } from "@/lib/omni-hub/events";

type OmniCard = {
  kind: "route" | "course" | "summary";
  href: string;
  title: string;
  body?: string;
  meta?: string;
  cta: string;
  external?: boolean;
};

type OmniQualification = { id: string; prompt: string; options: string[] };

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  cards?: OmniCard[];
  chips?: string[];
  qualification?: OmniQualification | null;
};

type AvatarState = "idle" | "thinking" | "typing" | "routing";

const STORAGE_KEY = "ndh-omni-hub-chat";
const GREETING_ID = "greeting";

/**
 * Quick actions map a short label to the sentence actually sent upstream. They
 * cover the whole family — learning, commerce, schools, delivery and venture
 * backing — rather than any single business.
 */
const QUICK_ACTIONS: { labelKey: string; prompt: string }[] = [
  { labelKey: "chat.chip.family", prompt: "What does NDH do?" },
  {
    labelKey: "chat.chip.learn",
    prompt: "I want to learn a digital skill. Which course should I take?",
  },
  {
    labelKey: "chat.chip.store",
    prompt: "I am looking for ready-made products or templates to buy.",
  },
  { labelKey: "chat.chip.school", prompt: "I run a school and need management software." },
  { labelKey: "chat.chip.hire", prompt: "I would like a team to build something for me." },
  { labelKey: "chat.chip.early", prompt: "I have an idea and I am looking for backing." },
];

function newId() {
  return Math.random().toString(36).slice(2, 10);
}

function readStoredMessages(): ChatMessage[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ChatMessage[];
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch {
    /* unreadable storage is not a reason to break the chat */
  }
  return null;
}

export function OmniHubChat() {
  const { t, locale, region } = usePreferences();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [avatarState, setAvatarState] = useState<AvatarState>("idle");
  const [mode, setMode] = useState<"engine" | "model" | null>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  /** Latest transcript, so `send` never closes over a stale array. */
  const messagesSnapshot = useRef<ChatMessage[]>([]);

  const greeting = useMemo<ChatMessage>(
    () => ({ id: GREETING_ID, role: "assistant", content: t("chat.greeting") }),
    [t],
  );

  useEffect(() => {
    messagesSnapshot.current = messages;
  }, [messages]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      setError(null);
      setInput("");
      const history = messagesSnapshot.current;
      const withGreeting = history.length === 0 ? [greeting] : history;
      const nextHistory: ChatMessage[] = [
        ...withGreeting,
        { id: newId(), role: "user", content: trimmed },
      ];
      const assistantId = newId();

      setMessages([...nextHistory, { id: assistantId, role: "assistant", content: "" }]);
      setBusy(true);
      setAvatarState("thinking");

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const response = await fetch("/api/public/omni-hub", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            locale,
            // Auto-detected; sharpens the answer without ever being a control.
            region,
            // The greeting is UI chrome, not part of the conversation.
            messages: nextHistory
              .filter((message) => message.id !== GREETING_ID && message.content.trim().length > 0)
              .map((message) => ({
                role: message.role,
                content: message.content,
                ...(message.qualification ? { qualificationId: message.qualification.id } : {}),
              })),
          }),
        });

        if (!response.ok || !response.body) {
          setError((await response.text().catch(() => "")) || t("chat.error"));
          setMessages((current) => current.filter((message) => message.id !== assistantId));
          setAvatarState("idle");
          return;
        }

        setMode((response.headers.get("x-ndh-mode") as "engine" | "model" | null) ?? null);
        setAvatarState("routing");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let assistant = "";
        let started = false;

        const patch = (fields: Partial<ChatMessage>) => {
          setMessages((current) =>
            current.map((message) =>
              message.id === assistantId ? { ...message, ...fields } : message,
            ),
          );
        };

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

            let frame: {
              omnihub?: {
                cards?: OmniCard[];
                chips?: string[];
                qualification?: OmniQualification | null;
              };
              choices?: { delta?: { content?: string } }[];
            };
            try {
              frame = JSON.parse(data);
            } catch {
              continue;
            }

            if (frame.omnihub) {
              patch({
                cards: frame.omnihub.cards ?? [],
                chips: frame.omnihub.chips ?? [],
                qualification: frame.omnihub.qualification ?? null,
              });
              continue;
            }

            const delta = frame.choices?.[0]?.delta?.content;
            if (!delta) continue;
            assistant += delta;
            started = true;
            setAvatarState("typing");
            patch({ content: assistant });
          }
        }

        if (!started) patch({ content: t("chat.error") });
      } catch (caught) {
        if ((caught as Error)?.name === "AbortError") return;
        setError(t("chat.error"));
        setMessages((current) => current.filter((message) => message.id !== assistantId));
      } finally {
        setBusy(false);
        setAvatarState("idle");
      }
    },
    [greeting, locale, region, t],
  );

  /* Restore this tab's conversation once, after hydration. */
  useEffect(() => {
    const stored = readStoredMessages();
    if (stored) {
      setMessages(stored);
      messagesSnapshot.current = stored;
    }
  }, []);

  useEffect(() => {
    if (messages.length === 0) return;
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-24)));
    } catch {
      /* ignore */
    }
  }, [messages]);

  /* Let any page element open the consultant — e.g. the hero call to action. */
  useEffect(() => {
    const onOpen = (event: Event) => {
      const detail = (event as CustomEvent<{ prompt?: string }>).detail;
      setOpen(true);
      if (detail?.prompt) void send(detail.prompt);
    };
    window.addEventListener(OPEN_ASSISTANT_EVENT, onOpen as EventListener);
    return () => window.removeEventListener(OPEN_ASSISTANT_EVENT, onOpen as EventListener);
  }, [send]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const node = messagesRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages, busy, open, avatarState]);

  useEffect(() => () => abortRef.current?.abort(), []);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void send(input);
  }

  function reset() {
    abortRef.current?.abort();
    setMessages([]);
    messagesSnapshot.current = [];
    setError(null);
    setMode(null);
    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }

  const conversation = messages.length === 0 ? [greeting] : messages;
  const lastAssistant = [...conversation].reverse().find((message) => message.role === "assistant");
  const stateLabel =
    avatarState === "thinking"
      ? t("chat.status.thinking")
      : avatarState === "typing"
        ? t("chat.status.typing")
        : avatarState === "routing"
          ? t("chat.status.routing")
          : t("chat.status.online");

  return (
    <>
      <Button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? t("chat.launcher.close") : t("chat.launcher.open")}
        aria-expanded={open}
        className={`ai-assistant-launcher is-${avatarState}`}
      >
        {open ? (
          <X aria-hidden="true" />
        ) : (
          <>
            <span className="ai-assistant-orbit" aria-hidden="true" />
            <img
              className="ai-assistant-avatar"
              src={assistantAvatar}
              alt=""
              width={816}
              height={816}
            />
            <span className="ai-assistant-status" aria-hidden="true" />
          </>
        )}
      </Button>

      {open && (
        <div role="dialog" aria-label={t("chat.title")} className="ai-assistant-dialog gw-chat">
          <header className="ai-assistant-header">
            <span className={`gw-chat-avatar is-${avatarState}`}>
              <img src={assistantAvatar} alt="" width={816} height={816} />
              <i aria-hidden="true" />
            </span>
            <div className="ai-assistant-title">
              <p>{t("chat.title")}</p>
              <span>
                <i aria-hidden="true" /> {stateLabel}
                <em className="gw-chat-mode">
                  {mode === "model"
                    ? t("chat.mode.live")
                    : mode === "engine"
                      ? t("chat.mode.engine")
                      : t("chat.subtitle")}
                </em>
              </span>
            </div>
            <div className="gw-chat-header-actions">
              {messages.length > 0 ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={t("chat.reset")}
                  onClick={reset}
                >
                  <RotateCcw aria-hidden="true" />
                </Button>
              ) : null}
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={t("chat.launcher.close")}
                onClick={() => setOpen(false)}
              >
                <Minus aria-hidden="true" />
              </Button>
            </div>
          </header>

          <div
            ref={messagesRef}
            role="log"
            aria-live="polite"
            className="ai-assistant-conversation ai-assistant-messages"
          >
            {conversation.map((message) => (
              <div className={`ai-assistant-message is-${message.role}`} key={message.id}>
                {message.content ? <p>{message.content}</p> : null}

                {message.cards && message.cards.length > 0 ? (
                  <div className="gw-chat-cards">
                    {message.cards.map((card) => (
                      <a
                        className={`gw-chat-card kind-${card.kind}`}
                        key={`${card.kind}-${card.href}-${card.title}`}
                        href={card.href}
                        {...(card.external ? { rel: "noreferrer" } : {})}
                      >
                        <span className="gw-chat-card-kind">
                          {card.kind === "course" ? (
                            <Sparkles size={12} aria-hidden="true" />
                          ) : (
                            <Bot size={12} aria-hidden="true" />
                          )}
                          {card.kind === "route"
                            ? t("chat.route.suggested")
                            : card.kind === "course"
                              ? t("chat.recommend.title")
                              : t("chat.summary.title")}
                        </span>
                        <strong>{card.title}</strong>
                        {card.body ? <small>{card.body}</small> : null}
                        {card.meta ? (
                          <small className="gw-chat-card-meta">{card.meta}</small>
                        ) : null}
                        <span className="gw-chat-card-cta">
                          {card.cta} <ArrowUpRight size={13} aria-hidden="true" />
                        </span>
                      </a>
                    ))}
                  </div>
                ) : null}

                {message.qualification && message.id === lastAssistant?.id ? (
                  <div className="gw-chat-qualify">
                    <p className="gw-chat-qualify-title">{t("chat.qualify.title")}</p>
                    <p>{message.qualification.prompt}</p>
                    <div className="gw-chat-qualify-options">
                      {message.qualification.options.map((option) => (
                        <Button
                          key={option}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => void send(option)}
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            ))}

            {busy && avatarState === "thinking" ? (
              <p className="ai-assistant-thinking">
                <LoaderCircle aria-hidden="true" /> {t("chat.thinking")}
              </p>
            ) : null}

            {error ? (
              <p className="ai-assistant-error">
                {error} <a href="/contact">{t("chat.contactTeam")}</a>.
              </p>
            ) : null}

            {messages.length === 0 && !busy ? (
              <div className="gw-chat-starters">
                <p className="gw-chat-starters-label">{t("chat.quickLabel")}</p>
                <div className="ai-assistant-chips">
                  {QUICK_ACTIONS.map((action) => (
                    <Button
                      key={action.labelKey}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => void send(action.prompt)}
                    >
                      {t(action.labelKey as never)}
                    </Button>
                  ))}
                </div>
              </div>
            ) : null}

            {messages.length > 0 &&
            !busy &&
            lastAssistant?.chips &&
            lastAssistant.chips.length > 0 ? (
              <div className="ai-assistant-chips gw-chat-followups">
                {lastAssistant.chips.map((chip) => (
                  <Button
                    key={chip}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => void send(chip)}
                  >
                    {chip}
                  </Button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="ai-assistant-composer">
            <form onSubmit={submit}>
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                maxLength={1000}
                placeholder={t("chat.placeholder")}
                aria-label={t("chat.placeholder")}
                rows={1}
              />
              <Button
                type="submit"
                size="icon-sm"
                aria-label={t("chat.send")}
                disabled={busy || input.trim().length === 0}
              >
                {busy ? (
                  <LoaderCircle className="animate-spin" aria-hidden="true" />
                ) : (
                  <Send aria-hidden="true" />
                )}
              </Button>
            </form>
            <p className="gw-chat-footnote">
              {mode === "engine" ? t("chat.offlineNotice") : t("chat.handoff")}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
