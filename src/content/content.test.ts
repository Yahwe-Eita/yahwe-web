import { describe, expect, it } from "vitest";
import { faqs, howItWorks, steps, targetSummary, terms } from "@/content/landing";
import { onboardingSlides, prospectiveMemberTerms } from "@/content/onboarding";
import type { Programme } from "@/lib/api/types";
import { formatCurrency } from "@/lib/format";

function programme(overrides: Partial<Programme> = {}): Programme {
  return {
    feeAmount: "150.00",
    selfAirtimeReward: "30.00",
    airtimeReward: "15.00",
    cashReward: "15.00",
    depthLimit: 8,
    requiredDownlines: 3,
    minimumAge: 18,
    recruitWindowDays: 8,
    cycleDays: 56,
    targetCashEarnings: "147555.00",
    targetAirtimeEarnings: "75.00",
    levels: [
      { level: 1, members: 3, rewardPerMember: "15.00", rewardType: "AIRTIME", levelTotal: "45.00" },
      { level: 2, members: 9, rewardPerMember: "15.00", rewardType: "CASH", levelTotal: "135.00" },
    ],
    ...overrides,
  };
}

describe("programme-driven copy", () => {
  it("quotes the server's figures, not built-in ones", () => {
    const changed = programme({ feeAmount: "175.00", minimumAge: 21, recruitWindowDays: 10, requiredDownlines: 4 });
    const text = [...terms(changed), ...steps(changed).map((s) => s.body), ...faqs(changed).flatMap((f) => [f.question, ...f.answer])].join(" ");
    expect(text).toContain(formatCurrency("175.00"));
    expect(text).toContain("21");
    expect(text).toContain("10 days");
    expect(text).toContain("at least 4");
    expect(text).not.toMatch(/GH[C₵S]\s?150/);
    expect(text).not.toContain("8 days");
  });

  it("states the cycle target from the server totals", () => {
    const summary = targetSummary(programme());
    expect(summary).toContain(formatCurrency("147555.00"));
    expect(summary).toContain(formatCurrency("75.00"));
    expect(summary).toContain("8 weeks");
  });

  it("names reward levels from the level list", () => {
    const rewards = howItWorks(programme()).sections.find((s) => s.title === "Rewards");
    expect(rewards?.body).toContain("Level 1 rewards are airtime credit");
    expect(rewards?.body).toContain("Level 2 rewards come as Mobile Money cash");
  });

  it("shows new members the mobile app's onboarding terms", () => {
    const p = programme();
    const agreed = onboardingSlides(p).find((slide) => slide.title === "Terms and conditions");
    expect(agreed?.paragraphs).toEqual(["Every Prospective Member must:"]);
    expect(agreed?.list).toEqual(prospectiveMemberTerms(p));
    expect(agreed?.list).toHaveLength(10);
    expect(agreed?.closing?.[0]).toContain(targetSummary(p));
  });

  it("fills the onboarding terms from the server's figures", () => {
    const text = prospectiveMemberTerms(
      programme({ feeAmount: "175.00", minimumAge: 21, recruitWindowDays: 10, requiredDownlines: 4, cycleDays: 70 }),
    ).join(" ");
    expect(text).toContain("Be over 20 years");
    expect(text).toContain(`buy ${formatCurrency("175.00")} of Airtime`);
    expect(text).toContain("at least 4 people");
    expect(text).toContain("within 10 Days");
    expect(text).toContain("expires in 10 weeks");
    expect(text).not.toMatch(/GH[C₵S]\s?150/);
  });
});
