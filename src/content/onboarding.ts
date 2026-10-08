import type { Programme } from "@/lib/api/types";
import { corporateValues, noGuarantee, targetSummary, welcome } from "@/content/landing";
import { formatCurrency } from "@/lib/format";

export interface OnboardingSlide {
  title: string;
  paragraphs: readonly string[];
  list?: readonly string[];
  ordered?: boolean;
  closing?: readonly string[];
}

/** The checklist a prospective member agrees to before signing up; worded as in the mobile app. */
export function prospectiveMemberTerms(p: Programme) {
  const weeks = p.cycleDays / 7;
  const fee = formatCurrency(p.feeAmount);
  return [
    `Be over ${p.minimumAge - 1} years, an MTN subscriber and must be introduced by an existing affiliate member in good standing.`,
    `Have an Android or iOS phone or tab with the Momo wallet and with enough money to buy ${fee} of Airtime or Data credit.`,
    `Register and purchase ${fee} of MTN Mobile Airtime credit.`,
    `Must also introduce at least ${p.requiredDownlines} people to join the scheme within ${p.recruitWindowDays} Days after registration to stay as a benefiting Member.`,
    "Understand that members earn their Rewards only after fulfilling their individual responsibilities as in Point 4.",
    `Only click on the "I AGREE TO TERMS" icon when they have understood How It Works; that their registration and entry expires in ${weeks} weeks, after which they may restart for a new cycle. (You may click on How It Works for re-direction to the website for further explanation.)`,
    "Understand that it takes good relationships and constant reminders on every member's part to earn the cash, one registration at a time.",
    "Understand that every reward is received as INSTANTLY as your Downlines Register and buy their credit.",
    `Understand that YAHWE-EITA HAS A TERMINAL POINT OF ONLY ${weeks} WEEKS.`,
    "YAHWE-EITA DOES NOT MOBILIZE OR KEEP MONEY FOR ITS MEMBERS. ALL REWARDS ARE RECEIVED INSTANTLY ON YOUR PHONE. YAHWE-EITA SIMPLY RETAILS AIRTIME AND DATA CREDIT.",
  ];
}

export function onboardingSlides(p: Programme): OnboardingSlide[] {
  const weeks = p.cycleDays / 7;
  return [
    { title: "Welcome", paragraphs: welcome },
    {
      title: "Our purpose",
      paragraphs: [
        "Is to modernize and digitize the Ghanaian culture of voluntarily Giving (for example, to help out-door a newly born, or to bereaved friends and associates in raising funds to bury their dead).",
        "It is a rewarding system to the network of Givers and Receivers that is routed through the Mobile phone Airtime and Data that we buy.",
        `Yahwe-eita thus offers affiliate members an exciting opportunity to earn some supplementary income together with their reliable relations and friends in cycles of ${weeks}-week periods by way of sharing their mobile phone Airtime credit with their uplines.`,
        noGuarantee,
      ],
    },
    {
      title: "Our corporate values",
      paragraphs: [],
      list: corporateValues.map((value) => value.text),
    },
    {
      title: "Terms and conditions",
      paragraphs: ["Every Prospective Member must:"],
      list: prospectiveMemberTerms(p),
      ordered: true,
      closing: [
        `We are confident that if you introduce very reliable friends and they also do likewise, you'd earn day by day, the targeted amount of ${targetSummary(p)} from the get-go.`,
        "We wish you every Success.",
        "Yahwe-eita Team.",
      ],
    },
  ];
}
