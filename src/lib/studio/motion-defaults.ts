import type { StudioBrandId } from "./kits";
import type { MotionMusicTrack } from "./motion-audio";
import parentPhoto from "@/assets/covers/hero-gateway-1280.webp";
import academyPhoto from "@/assets/covers/academy-1280.webp";
import agencyPhoto from "@/assets/covers/agency-1280.webp";
import farmfundPhoto from "@/assets/covers/agricapital-1280.webp";
import shoposPhoto from "@/assets/covers/estore-1280.webp";
import schoolosPhoto from "@/assets/covers/schooldesk-1280.webp";
import mallPhoto from "@/assets/covers/mall-1280.webp";
import cloudPhoto from "@/assets/covers/cloud-1280.webp";
import expressPhoto from "@/assets/covers/express-1280.webp";
import payPhoto from "@/assets/covers/pay-1280.webp";
import travelPhoto from "@/assets/covers/travel-1280.webp";
import healthPhoto from "@/assets/covers/ihospital-1280.webp";
import foundationPhoto from "@/assets/covers/foundation-1280.webp";

const PHOTOS: Record<StudioBrandId, string> = {
  parent: parentPhoto,
  academy: academyPhoto,
  agency: agencyPhoto,
  farmfund: farmfundPhoto,
  shopos: shoposPhoto,
  schoolos: schoolosPhoto,
  mall: mallPhoto,
  cloud: cloudPhoto,
  express: expressPhoto,
  pay: payPhoto,
  travel: travelPhoto,
  health: healthPhoto,
  foundation: foundationPhoto,
  other: parentPhoto,
};

const MUSIC: Record<StudioBrandId, MotionMusicTrack> = {
  parent: "uplift",
  academy: "bright",
  agency: "assured",
  farmfund: "organic",
  shopos: "bright",
  schoolos: "steady",
  mall: "uplift",
  cloud: "assured",
  express: "uplift",
  pay: "steady",
  travel: "bright",
  health: "organic",
  foundation: "organic",
  other: "uplift",
};

export function motionDefaults(id: StudioBrandId): { photoUrl: string; music: MotionMusicTrack } {
  return { photoUrl: PHOTOS[id] ?? parentPhoto, music: MUSIC[id] ?? "uplift" };
}
