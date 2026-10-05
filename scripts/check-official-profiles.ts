/** Read-only domain regression checks: npx tsx scripts/check-official-profiles.ts */
import assert from "node:assert/strict";
import { Sprout } from "lucide-react";
import { ACADEMY_SCHOOLS, ACADEMY_SNAPSHOT, BUSINESS_PROFILES } from "../src/lib/business-profiles";
import {
  SUBSIDIARIES,
  ECOSYSTEM_METRICS,
  filterSubsidiaries,
  getSubsidiary,
  subsidiaryHref,
} from "../src/lib/ecosystem";
import { en, fr, ar } from "../src/lib/i18n/dictionary";
import { NDH_BRIEF } from "../src/lib/chat-brief";
import { classifyIntent, respond, type OmniMessage } from "../src/lib/omni-hub/engine";

assert.equal(SUBSIDIARIES.length, 7);
assert.deepEqual(
  SUBSIDIARIES.filter((item) => item.state === "coming").map((item) => item.id),
  ["schooldesk", "travel", "ihospital"],
);
assert.equal(getSubsidiary("agricapital").icon, Sprout);
assert.equal(ACADEMY_SNAPSHOT.courses, 60);
assert.equal(ACADEMY_SCHOOLS.length, 6);
assert.deepEqual(
  ACADEMY_SCHOOLS.map((school) => school.name),
  [
    "AI Engineering",
    "Design & Brand",
    "Media & Video",
    "Writing & Content",
    "Marketing & Growth",
    "Business & Operations",
  ],
);
assert.deepEqual(
  ECOSYSTEM_METRICS.map((metric) => metric.value),
  [7, 4, 3, 60, 6, 10],
);
assert.equal(filterSubsidiaries("agriculture")[0].id, "agricapital");
assert.equal(filterSubsidiaries("commerce")[0].id, "estore");
assert.equal(filterSubsidiaries("infrastructure").length, 3);
for (const locale of [en, fr, ar]) {
  assert.deepEqual(Object.keys(locale).sort(), Object.keys(en).sort(), "Complete locale keys");
  assert.equal(locale["eco.agricapital.name"], "NDH AgriCapital");
  assert.match(locale["eco.academy.tagline"]!, /60/);
  assert.ok(
    !Object.values(locale).some((text) =>
      /195|99\.9|30 practical|30 cours|NDH Venture/.test(text!),
    ),
  );
}
for (const item of SUBSIDIARIES) {
  const profile = BUSINESS_PROFILES[item.id];
  assert.equal(en[`eco.${item.id}.tagline`], profile.tagline);
  assert.ok(NDH_BRIEF.includes(profile.description));
  if (item.state === "coming") assert.equal(subsidiaryHref(item), "");
}
assert.equal(subsidiaryHref(getSubsidiary("academy")), "https://academy.ndh.com.ng");
assert.equal(subsidiaryHref(getSubsidiary("agency")), "https://agency.ndh.com.ng");
assert.equal(subsidiaryHref(getSubsidiary("estore")), "https://estore.ndh.com.ng");

const cases = [
  ["I want to invest in a livestock farm cycle", "agricapital"],
  ["How do crop harvest payouts work?", "agricapital"],
  ["I manage feeding logs and operational expenses on a farm", "agricapital"],
  ["How is equity calculated from the shared contribution ledger?", "agricapital"],
  ["Tell me about NDH Venture", "agricapital"],
  ["What is AgriVest?", "agricapital"],
  ["I fund farms via Paystack and direct transfer", "agricapital"],
  ["Je veux investir dans une ferme", "agricapital"],
  ["أريد الاستثمار في تربية المواشي", "agricapital"],
  ["I need funding for my startup app idea", "contact"],
  ["I want to sell physical products internationally", "estore"],
  ["Can I onboard as a merchant and manage inventory?", "estore"],
  ["How do shipping routes and vendor payouts work?", "estore"],
  ["Does eStore offer Flutterwave checkout?", "estore"],
  ["Je veux ouvrir une boutique", "estore"],
  ["أريد إدارة متجر وبيع المنتجات", "estore"],
  ["How many Academy courses and schools are there?", "academy"],
  ["I want to learn AI engineering", "academy"],
  ["Verify my certificate", "academy"],
  ["أريد التحقق من شهادة", "academy"],
  ["What is the PM confidential isolation layer?", "agency"],
  ["Can Agency clients and talents communicate directly?", "agency"],
  ["SchoolDesk school management and report cards", "schooldesk"],
  ["Can I enrol my school on SchoolDesk now?", "schooldesk"],
  ["I need a flight booking and visa advice", "travel"],
  ["Can iHospital book a telemedicine consultation?", "ihospital"],
  ["أحتاج إلى حجز طيران", "travel"],
  ["Je cherche une clinique", "ihospital"],
] as const;
for (const [text, expected] of cases) {
  assert.equal(classifyIntent(text).intent, expected, text);
  const reply = respond({ messages: [{ role: "user", content: text }] });
  assert.equal(reply.intent, expected, text);
  assert.ok(
    reply.cards.every((card) => Boolean(card.href)),
    `No empty links: ${text}`,
  );
  if (["schooldesk", "travel", "ihospital"].includes(expected)) {
    assert.match(reply.text, /Coming Soon/);
    assert.ok(reply.cards.every((card) => card.href === "/contact"));
    assert.ok(reply.cards.every((card) => !card.external));
  }
  console.log(`PASS ${expected}: ${text}`);
}
const verify = respond({ messages: [{ role: "user", content: "Verify my certificate" }] });
assert.ok(verify.cards.some((card) => card.href === "/verify"));
assert.match(verify.text, /cryptographically/);
const farm = respond({
  messages: [{ role: "user", content: "I fund farms via Paystack and direct transfer" }],
});
assert.equal(farm.owner, "agricapital");
assert.equal(farm.cards.length, 1, "Payment methods are not a second eStore need");
assert.match(farm.text, /not guaranteed/);
const agency = respond({
  messages: [{ role: "user", content: "Can Agency clients and talents communicate directly?" }],
});
assert.match(agency.text, /never communicate directly/);
const mixed = respond({ messages: [{ role: "user", content: "Compare Academy and SchoolDesk" }] });
assert.equal(mixed.cards.length, 2);
assert.ok(mixed.cards.some((card) => card.href === "/contact" && /Coming Soon/.test(card.body!)));
const multiNeed = respond({
  messages: [{ role: "user", content: "I need a website and a course for my staff" }],
});
assert.ok(multiNeed.cards.some((card) => card.title === "NDH Agency"));
assert.ok(multiNeed.cards.some((card) => card.title === "NDH Academy"));
const first = respond({ messages: [{ role: "user", content: "Tell me about AgriCapital" }] });
const thread: OmniMessage[] = [
  { role: "user", content: "Tell me about AgriCapital" },
  { role: "assistant", content: first.text },
  { role: "user", content: "What about payouts?" },
];
assert.equal(respond({ messages: thread }).owner, "agricapital");
console.log(
  "PASS verified scope, EN/FR/AR parity, official URLs, pipeline safety, verification, mixed needs and continuity",
);
