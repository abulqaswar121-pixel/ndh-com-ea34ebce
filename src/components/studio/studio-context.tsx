import { createContext, useContext } from "react";
import type { BrandKit, StudioBrandId } from "@/lib/studio/kits";
import type { CampaignCopy, StudioGoal, StudioTone } from "@/lib/studio/copywriter";
import type { Holiday } from "@/lib/studio/holidays";

export type StudioTab = "captions" | "flyer" | "motion" | "calendar" | "archive" | "newsroom";

export type StudioValue = {
  scope: "admin" | "staff";
  /** True when the viewer is signed in with a staff role. */
  isStaff: boolean;
  brandId: StudioBrandId;
  setBrandId: (id: StudioBrandId) => void;
  brand: BrandKit;
  topic: string;
  setTopic: (value: string) => void;
  goal: StudioGoal;
  setGoal: (value: StudioGoal) => void;
  tone: StudioTone;
  setTone: (value: StudioTone) => void;
  offer: string;
  setOffer: (value: string) => void;
  holiday: Holiday | null;
  setHoliday: (holiday: Holiday | null) => void;
  campaign: CampaignCopy;
  tab: StudioTab;
  setTab: (tab: StudioTab) => void;
  /** Ask the archive panel to reload after a save. */
  archiveVersion: number;
  bumpArchive: () => void;
  notify: (message: string, kind?: "success" | "error") => void;
};

export const StudioContext = createContext<StudioValue | null>(null);

export function useStudio(): StudioValue {
  const value = useContext(StudioContext);
  if (!value) throw new Error("useStudio must be used inside <StudioApp>.");
  return value;
}
