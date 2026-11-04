import { useCallback, useEffect, useState } from "react";
import {
  Copy,
  Download,
  FileText,
  Film,
  ImageIcon,
  LayoutGrid,
  Loader2,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { copyText } from "@/lib/clipboard";
import {
  clearArchive,
  deleteArchiveItem,
  downloadBlob,
  filenameFor,
  listArchiveItems,
  readCaptionHistory,
  removeCaptionHistory,
  type ArchiveItem,
  type CaptionHistoryEntry,
} from "@/lib/studio/archive";
import { useStudio } from "./studio-context";

const KIND_LABEL: Record<ArchiveItem["kind"], string> = {
  flyer: "Flyer",
  motion: "Motion",
  caption: "Caption",
};

const KIND_ICON: Record<ArchiveItem["kind"], typeof ImageIcon> = {
  flyer: ImageIcon,
  motion: Film,
  caption: FileText,
};

/** Everything the team has generated, ready to re-download or re-use. */
export function ArchivePanel() {
  const { archiveVersion, notify } = useStudio();
  const [items, setItems] = useState<ArchiveItem[]>([]);
  const [captions, setCaptions] = useState<CaptionHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | ArchiveItem["kind"]>("all");

  const load = useCallback(async () => {
    setLoading(true);
    const [media, history] = await Promise.all([
      listArchiveItems(),
      Promise.resolve(readCaptionHistory()),
    ]);
    setItems(media);
    setCaptions(history);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load, archiveVersion]);

  const visible = items.filter((item) => filter === "all" || item.kind === filter);

  async function handleDelete(item: ArchiveItem) {
    await deleteArchiveItem(item.id);
    setItems((current) => current.filter((entry) => entry.id !== item.id));
    notify("Removed from the archive");
  }

  async function handleDownload(item: ArchiveItem) {
    if (!item.blob) return;
    downloadBlob(item.blob, filenameFor(item.brandName, item.kind, item.extension));
    notify("Download started");
  }

  return (
    <section className="studio-panel">
      <div className="studio-panel-head">
        <div>
          <p className="studio-eyebrow">
            <LayoutGrid size={13} aria-hidden="true" /> Media archive &amp; post history
          </p>
          <h2>Re-use what already worked</h2>
          <p className="studio-panel-lead">
            Flyers, motion clips and caption sets stay on this device so a successful post can be
            downloaded again instead of rebuilt.
          </p>
        </div>
        <button type="button" className="studio-btn is-quiet" onClick={() => void load()}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <div className="studio-tabs is-sub">
        {(["all", "flyer", "motion"] as const).map((item) => (
          <button
            key={item}
            type="button"
            className={filter === item ? "is-active" : undefined}
            onClick={() => setFilter(item)}
          >
            {item === "all" ? "All media" : `${KIND_LABEL[item]}s`}
            <span>
              {item === "all" ? items.length : items.filter((entry) => entry.kind === item).length}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <p className="studio-empty">
          <Loader2 size={16} className="spin" /> Loading the archive…
        </p>
      ) : visible.length === 0 ? (
        <p className="studio-empty">
          Nothing saved yet. Generate a flyer or motion clip and choose “Save to archive”.
        </p>
      ) : (
        <div className="studio-archive-grid">
          {visible.map((item) => {
            const Icon = KIND_ICON[item.kind];
            return (
              <article className="studio-archive-card" key={item.id}>
                <div className="studio-archive-thumb">
                  {item.thumb ? (
                    <img src={item.thumb} alt="" loading="lazy" decoding="async" />
                  ) : (
                    <span className="studio-archive-blank">
                      <Icon size={22} />
                    </span>
                  )}
                  <span className="studio-tag is-solid">{KIND_LABEL[item.kind]}</span>
                </div>
                <div className="studio-archive-body">
                  <strong>{item.title}</strong>
                  <small>{item.brandName}</small>
                  <small className="studio-archive-meta">
                    {item.meta ??
                      `${item.extension.toUpperCase()} · ${Math.round(item.size / 1024)} KB`}
                    {" · "}
                    {new Date(item.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    })}
                  </small>
                </div>
                <div className="studio-archive-actions">
                  <button
                    type="button"
                    className="studio-btn is-icon"
                    aria-label="Download"
                    onClick={() => void handleDownload(item)}
                  >
                    <Download size={14} />
                  </button>
                  {item.caption ? (
                    <button
                      type="button"
                      className="studio-btn is-icon"
                      aria-label="Copy caption"
                      onClick={async () => {
                        const ok = await copyText(item.caption ?? "");
                        notify(
                          ok ? "Caption copied" : "Copy blocked by the browser",
                          ok ? "success" : "error",
                        );
                      }}
                    >
                      <Copy size={14} />
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className="studio-btn is-icon is-danger"
                    aria-label="Delete"
                    onClick={() => void handleDelete(item)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div className="studio-archive-captions">
        <div className="studio-panel-head is-tight">
          <h3>Caption history</h3>
          <button
            type="button"
            className="studio-btn is-quiet is-small"
            onClick={async () => {
              await clearArchive();
              setItems([]);
              notify("Media archive cleared");
            }}
          >
            <Trash2 size={13} /> Clear media
          </button>
        </div>

        {captions.length === 0 ? (
          <p className="studio-empty">Caption drafts you generate will be listed here.</p>
        ) : (
          <ul className="studio-caption-history">
            {captions.slice(0, 12).map((entry) => (
              <li key={entry.id}>
                <div>
                  <strong>{entry.topic}</strong>
                  <small>
                    {entry.brandName} ·{" "}
                    {new Date(entry.createdAt).toLocaleString("en-GB", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </small>
                </div>
                <div className="studio-history-actions">
                  <button
                    type="button"
                    className="studio-btn is-icon"
                    aria-label="Copy first caption"
                    onClick={async () => {
                      const ok = await copyText(entry.cards[0]?.body ?? "");
                      notify(ok ? "Caption copied" : "Copy blocked", ok ? "success" : "error");
                    }}
                  >
                    <Copy size={14} />
                  </button>
                  <button
                    type="button"
                    className="studio-btn is-icon is-danger"
                    aria-label="Remove"
                    onClick={() => setCaptions(removeCaptionHistory(entry.id))}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
