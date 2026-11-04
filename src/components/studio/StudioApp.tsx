import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  BellRing,
  CalendarHeart,
  Check,
  ChevronLeft,
  Film,
  ImageIcon,
  LayoutGrid,
  Megaphone,
  PenLine,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { NdhFamilySymbol } from "@/components/NdhFamilySymbol";
import { STUDIO_KITS, getKit, type StudioBrandId } from "@/lib/studio/kits";
import {
  GOAL_LABEL,
  TONE_LABEL,
  buildCampaign,
  holidayBrief,
  type StudioGoal,
  type StudioTone,
} from "@/lib/studio/copywriter";
import { activeReminders, countdownLabel, type Holiday } from "@/lib/studio/holidays";
import { writeCaptionHistory, archiveId } from "@/lib/studio/archive";
import { StudioContext, type StudioTab, type StudioValue } from "./studio-context";
import { CaptionPanel } from "./CaptionPanel";
import { FlyerPanel } from "./FlyerPanel";
import { MotionPanel } from "./MotionPanel";
import { CalendarPanel } from "./CalendarPanel";
import { ArchivePanel } from "./ArchivePanel";
import { NewsroomPanel } from "./NewsroomPanel";

const GOALS: StudioGoal[] = ["promo", "launch", "info", "holiday", "milestone"];
const TONES: StudioTone[] = ["bold", "warm", "professional"];

const TABS: { id: StudioTab; label: string; icon: typeof PenLine }[] = [
  { id: "captions", label: "Captions", icon: PenLine },
  { id: "flyer", label: "Flyer & infographic", icon: ImageIcon },
  { id: "motion", label: "Motion clip", icon: Film },
  { id: "calendar", label: "Holiday calendar", icon: CalendarHeart },
  { id: "archive", label: "Media archive", icon: LayoutGrid },
  { id: "newsroom", label: "Newsroom", icon: Megaphone },
];

/**
 * The NDH AI Social Media & Content Studio.
 *
 * One workspace for every NDH business: pick the business to load its brand
 * kit, write a short brief, then export captions, flyers, infographics and
 * motion clips without leaving the portal.
 */
export function StudioApp({ scope }: { scope: "admin" | "staff" }) {
  const { roles, loading, user } = useAuth();
  const isStaff = roles.some((role) => role === "admin" || role === "pm" || role === "talent");
  const isAdmin = roles.includes("admin");

  const [brandId, setBrandId] = useState<StudioBrandId>("parent");
  const [topic, setTopicState] = useState("One family of twelve businesses, five live today");
  /** Once the editor types a brief, switching brands leaves it untouched. */
  const [topicEdited, setTopicEdited] = useState(false);
  const setTopic = useCallback((value: string) => {
    setTopicEdited(true);
    setTopicState(value);
  }, []);
  const [goal, setGoal] = useState<StudioGoal>("launch");
  const [tone, setTone] = useState<StudioTone>("bold");
  const [offer, setOffer] = useState("");
  const [holiday, setHoliday] = useState<Holiday | null>(null);
  const [tab, setTab] = useState<StudioTab>("captions");
  const [archiveVersion, setArchiveVersion] = useState(0);

  const brand = useMemo(() => getKit(brandId), [brandId]);

  // A fresh brand starts from its own first campaign idea until the editor types.
  useEffect(() => {
    if (topicEdited) return;
    setTopicState(brand.offerIdeas[0]);
  }, [brand.offerIdeas, topicEdited]);
  const reminders = useMemo(() => activeReminders(), []);

  const campaign = useMemo(
    () => buildCampaign({ brand, topic, goal, tone, offer, holiday }),
    [brand, topic, goal, tone, offer, holiday],
  );

  const notify = useCallback((message: string, kind: "success" | "error" = "success") => {
    if (kind === "error") toast.error(message);
    else toast.success(message);
  }, []);

  const bumpArchive = useCallback(() => setArchiveVersion((value) => value + 1), []);

  // Keep a lightweight caption history so a good post can be recovered later.
  useEffect(() => {
    if (!topic.trim()) return;
    const timeout = setTimeout(() => {
      writeCaptionHistory({
        id: archiveId(),
        brandId: brand.id,
        brandName: brand.name,
        topic: topic.trim(),
        createdAt: Date.now(),
        cards: campaign.captions.map((card) => ({ label: card.label, body: card.body })),
      });
    }, 2500);
    return () => clearTimeout(timeout);
  }, [brand.id, brand.name, topic, campaign.captions]);

  function runHolidayCampaign(next: Holiday) {
    const brief = holidayBrief(brand, next, tone);
    setHoliday(next);
    setTopic(brief.topic);
    setGoal(brief.goal);
    setOffer(brief.offer ?? "");
    setTab("captions");
    notify(`${next.name} campaign drafted for ${brand.name}`);
  }

  const value: StudioValue = {
    scope,
    isStaff,
    brandId,
    setBrandId,
    brand,
    topic,
    setTopic,
    goal,
    setGoal,
    tone,
    setTone,
    offer,
    setOffer,
    holiday,
    setHoliday,
    campaign,
    tab,
    setTab,
    archiveVersion,
    bumpArchive,
    notify,
  };

  return (
    <StudioContext.Provider value={value}>
      <div className="studio">
        <header className="studio-top">
          <div className="studio-top-inner">
            <Link to="/" className="studio-brand" aria-label="Najeeb Digital Hub home">
              <NdhFamilySymbol />
              <span>
                <strong>NAJEEB DIGITAL HUB</strong>
                <small>Content Studio</small>
              </span>
            </Link>
            <div className="studio-top-actions">
              <span className={`studio-role${isStaff ? " is-staff" : ""}`}>
                <ShieldCheck size={14} aria-hidden="true" />
                {loading
                  ? "Checking access…"
                  : isStaff
                    ? isAdmin
                      ? "Admin access"
                      : "Staff access"
                    : "Preview mode"}
              </span>
              <Link to="/businesses" className="studio-back">
                <ChevronLeft size={15} /> Directory
              </Link>
            </div>
          </div>

          <div className="studio-top-intro">
            <div>
              <p className="studio-eyebrow">
                <Sparkles size={13} aria-hidden="true" /> AI Social Media &amp; Content Studio
              </p>
              <h1>Plan, design and publish for every NDH business.</h1>
            </div>
            <p className="studio-top-note">
              Captions in three formats, flyers at 1080×1080 and 1080×1920, and 5–15 second motion
              cards — all carrying the right brand kit, logo watermark and public address.
            </p>
          </div>
        </header>

        {!loading && !user ? (
          <div className="studio-gate">
            <div>
              <strong>You are viewing the studio in preview mode.</strong>
              <p>
                Everything here works and downloads normally. Sign in with a staff account to
                publish announcements to the public newsroom.
              </p>
            </div>
            <Link to="/login" className="studio-gate-link">
              Sign in <ShieldCheck size={15} />
            </Link>
          </div>
        ) : null}

        {reminders.length > 0 ? (
          <div className="studio-reminder">
            <BellRing size={18} aria-hidden="true" />
            <div>
              <strong>
                {reminders[0].emoji} {reminders[0].name} is{" "}
                {countdownLabel(reminders[0].days).toLowerCase()}
              </strong>
              <span>
                Smart reminder · {reminders.length} holiday
                {reminders.length > 1 ? "s" : ""} inside the 5-day window. Draft the campaign now.
              </span>
            </div>
            <button type="button" onClick={() => runHolidayCampaign(reminders[0])}>
              Generate holiday campaign
            </button>
          </div>
        ) : null}

        <div className="studio-body">
          {/* --------------------------------------------------- brand selector */}
          <section className="studio-panel studio-brandbar" aria-label="Business selector">
            <div className="studio-brandbar-main">
              <label className="studio-label" htmlFor="studio-business">
                Posting as
              </label>
              <select
                id="studio-business"
                className="studio-select"
                value={brandId}
                onChange={(event) => setBrandId(event.target.value as StudioBrandId)}
              >
                {STUDIO_KITS.map((kit) => (
                  <option key={kit.id} value={kit.id}>
                    {kit.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="studio-brandbar-kit">
              <span className="studio-swatches" aria-hidden="true">
                {[brand.colors.bg, brand.colors.accent, brand.colors.accent2].map((color) => (
                  <i key={color} style={{ background: color }} />
                ))}
              </span>
              <div>
                <strong>{brand.name}</strong>
                <span className="studio-brandbar-url">{brand.url.replace(/^https?:\/\//, "")}</span>
              </div>
              <span className="studio-kit-check">
                <Check size={13} aria-hidden="true" /> Logo watermark loaded
              </span>
            </div>
          </section>

          {/* ----------------------------------------------------------- brief */}
          <section className="studio-panel studio-brief">
            <div className="studio-brief-head">
              <h2>Campaign brief</h2>
              {holiday ? (
                <button
                  type="button"
                  className="studio-chip is-active"
                  onClick={() => setHoliday(null)}
                >
                  {holiday.emoji} {holiday.name} ✕
                </button>
              ) : (
                <span className="studio-hint">One brief powers every format below.</span>
              )}
            </div>

            <label className="studio-field">
              <span>What are you posting about?</span>
              <textarea
                value={topic}
                rows={2}
                maxLength={220}
                placeholder="e.g. NDH ShopOS now includes payment links for WhatsApp sellers"
                onChange={(event) => setTopic(event.target.value)}
              />
            </label>

            <div className="studio-field-row">
              <div className="studio-field">
                <span>Goal</span>
                <div className="studio-chips">
                  {GOALS.map((item) => (
                    <button
                      key={item}
                      type="button"
                      className={goal === item ? "is-active" : undefined}
                      aria-pressed={goal === item}
                      onClick={() => setGoal(item)}
                    >
                      {GOAL_LABEL[item]}
                    </button>
                  ))}
                </div>
              </div>
              <div className="studio-field">
                <span>Tone</span>
                <div className="studio-chips">
                  {TONES.map((item) => (
                    <button
                      key={item}
                      type="button"
                      className={tone === item ? "is-active" : undefined}
                      aria-pressed={tone === item}
                      onClick={() => setTone(item)}
                    >
                      {TONE_LABEL[item]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <label className="studio-field">
              <span>Offer or price line (optional)</span>
              <input
                value={offer}
                maxLength={80}
                placeholder="e.g. 20% off all annual plans until Friday"
                onChange={(event) => setOffer(event.target.value)}
              />
            </label>
          </section>

          {/* ------------------------------------------------------------ tabs */}
          <nav className="studio-tabs" aria-label="Studio tools">
            {TABS.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={tab === item.id ? "is-active" : undefined}
                  aria-current={tab === item.id ? "page" : undefined}
                  onClick={() => setTab(item.id)}
                >
                  <Icon size={15} aria-hidden="true" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="studio-stage">
            {tab === "captions" ? <CaptionPanel /> : null}
            {tab === "flyer" ? <FlyerPanel /> : null}
            {tab === "motion" ? <MotionPanel /> : null}
            {tab === "calendar" ? <CalendarPanel onGenerate={runHolidayCampaign} /> : null}
            {tab === "archive" ? <ArchivePanel /> : null}
            {tab === "newsroom" ? <NewsroomPanel /> : null}
          </div>
        </div>
      </div>
    </StudioContext.Provider>
  );
}
