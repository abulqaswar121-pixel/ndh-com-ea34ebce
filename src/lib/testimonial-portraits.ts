import ahmad from "@/assets/testimonials/ahmad-tijjani.webp";
import najeeb from "@/assets/testimonials/najeeb-ahmad.webp";
import muhsin from "@/assets/testimonials/muhsin-musa.webp";
import chidi from "@/assets/testimonials/chidi-okafor.webp";
import fatoumata from "@/assets/testimonials/fatoumata-diallo.webp";
import sarah from "@/assets/testimonials/sarah-jenkins.webp";
import amina from "@/assets/testimonials/amina-yusuf.webp";
import tariq from "@/assets/testimonials/tariq-mahmoud.webp";
import kwesi from "@/assets/testimonials/kwesi-mensah.webp";
import zainab from "@/assets/testimonials/zainab-malik.webp";

const portraits: Record<string, string> = {
  "dr ahmad muhammad tijjani": ahmad,
  "ahmad muhammad tijjani": ahmad,
  "najeeb ahmad": najeeb,
  "muhsin musa": muhsin,
  "chidi okafor": chidi,
  "fatoumata diallo": fatoumata,
  "sarah jenkins": sarah,
  "amina yusuf": amina,
  "tariq mahmoud": tariq,
  "kwesi mensah": kwesi,
  "zainab malik": zainab,
};

export function testimonialPortrait(authorName: string, storedUrl?: string | null) {
  if (storedUrl) return storedUrl;
  const key = authorName
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return portraits[key] ?? null;
}
