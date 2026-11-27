import { describe, expect, it } from "vitest";
import { statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { blackFridayMotionItems, deleteArchiveItem, listArchiveItems } from "./archive";

const publicFile = (name: string) =>
  fileURLToPath(new URL(`../../../public/black-friday/${name}`, import.meta.url));

/** The required mapping from the brief: business → cover photo → music preset. */
const EXPECTED: { id: string; photo: string; music: string; offer: boolean }[] = [
  { id: "academy", photo: "academy-1280", music: "bright", offer: true },
  { id: "agency", photo: "agency-1280", music: "assured", offer: true },
  { id: "shopos", photo: "estore-1280", music: "bright", offer: true },
  { id: "schoolos", photo: "schooldesk-1280", music: "steady", offer: true },
  { id: "farmfund", photo: "agricapital-1280", music: "organic", offer: false },
];

describe("Black Friday motion drop", () => {
  const items = blackFridayMotionItems();

  it("ships exactly the five active businesses, in order", () => {
    expect(items.map((item) => item.id)).toEqual(EXPECTED.map((entry) => `bf-${entry.id}`));
    expect(items.map((item) => item.brandName)).toEqual([
      "NDH Academy",
      "NDH Agency",
      "NDH ShopOS",
      "NDH SchoolOS",
      "NDH FarmFund",
    ]);
  });

  it.each(EXPECTED)("$id carries its own cover photo and music preset", (entry) => {
    const item = items.find((candidate) => candidate.id === `bf-${entry.id}`);
    expect(item).toBeDefined();
    expect(item?.assets?.photo).toContain(entry.photo);
    expect(item?.assets?.music).toBe(entry.music);
    expect(item?.assets?.duration).toBe(8);
    expect(item?.assets?.volume).toBeGreaterThan(0);
  });

  it("points at real MP4 files whose recorded sizes match the archive record", () => {
    for (const entry of EXPECTED) {
      const item = items.find((candidate) => candidate.id === `bf-${entry.id}`);
      expect(item?.src).toBe(`/black-friday/${entry.id}.mp4`);
      expect(item?.mime).toBe("video/mp4");
      expect(item?.extension).toBe("mp4");
      expect(item?.kind).toBe("motion");
      const size = statSync(publicFile(`${entry.id}.mp4`)).size;
      expect(item?.size).toBe(size);
      expect(size).toBeGreaterThan(200_000);
    }
  });

  it("keeps a real preview thumbnail on disk for every clip", () => {
    for (const entry of EXPECTED) {
      const item = items.find((candidate) => candidate.id === `bf-${entry.id}`);
      expect(item?.thumb).toBe(`/black-friday/${entry.id}.jpg`);
      expect(statSync(publicFile(`${entry.id}.jpg`)).size).toBeGreaterThan(20_000);
    }
  });

  it("gives every clip a caption for Status, Instagram and LinkedIn", () => {
    for (const item of items) {
      const captions = item.captions;
      expect(captions).toBeDefined();
      for (const body of [captions!.whatsapp, captions!.instagram, captions!.linkedin]) {
        expect(body.length).toBeGreaterThan(120);
        expect(body).toContain("ndhnet.com");
      }
      expect(captions!.instagram).toMatch(/#\w+/);
      expect(captions!.linkedin).not.toMatch(/🔥|🎉/);
      expect(item.caption).toContain("WHATSAPP STATUS");
      expect(item.caption).toContain("INSTAGRAM");
      expect(item.caption).toContain("LINKEDIN");
    }
  });

  it("sells a real offer for the four discount brands", () => {
    const offers = ["40% off", "30% off", "two months free", "setup fee is waived"];
    for (const [index, entry] of EXPECTED.entries()) {
      if (!entry.offer) continue;
      expect(items[index].captions!.whatsapp.toLowerCase()).toContain(offers[index]);
    }
  });

  it("frames FarmFund as a seasonal window with no discount", () => {
    const farmfund = items.find((item) => item.id === "bf-farmfund")!;
    const copy = [
      farmfund.title,
      farmfund.captions!.whatsapp,
      farmfund.captions!.instagram,
      farmfund.captions!.linkedin,
      farmfund.meta ?? "",
    ]
      .join(" ")
      .toLowerCase();
    expect(copy).toContain("window");
    // No percentage saving, no naira figure, no "deal" — and the copy says so out loud.
    expect(copy).not.toMatch(/%\s*off|\d+\s*%|₦|\bdeal\b/);
    expect(copy).toContain("no discount");
    expect(farmfund.meta?.toLowerCase()).toContain("no discount");
  });

  it("lists the drop at the top of the archive", async () => {
    const listed = await listArchiveItems();
    expect(listed.slice(0, 5).map((item) => item.id)).toEqual(
      EXPECTED.map((entry) => `bf-${entry.id}`),
    );
    expect(listed.every((item) => item.seed)).toBe(true);
  });

  it("can hide a seeded clip without touching the files", async () => {
    await expect(deleteArchiveItem("bf-academy")).resolves.toBeUndefined();
  });
});
