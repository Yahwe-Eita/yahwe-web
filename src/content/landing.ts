import type { IconName } from "@/components/icon";
import type { Programme } from "@/lib/api/types";
import { formatCurrency } from "@/lib/format";

const WHATSAPP_NUMBER = "233542828173";

export const contact = {
  whatsappDisplay: `0${WHATSAPP_NUMBER.slice(3)}`,
  whatsappUrl: `https://wa.me/${WHATSAPP_NUMBER}`,
  email: "info.yahwe1to3@gmail.com",
} as const;

export const welcome = [
  "Congratulations on your decision to join Yahwe-eita Culture Ventures, a registered company.",
  "Yahwe-eita Culture is a Multi-Level Network Marketing concept designed to drive sales of goods and services online. The concept is a membership affiliate programme that is designed essentially to reward loyal customers of a chosen brand, via a simple referral and compensation formula. Yahwe-eita is MTN/Smart Phones exclusive.",
] as const;

export const noGuarantee =
  "Yahwe-eita is not a get-rich-quick guarantee. It takes persuasion, communication, consistency and genuine salescraft to succeed.";

export const corporateValues = [
  { icon: "mingcute:star-line", text: "Rewarding outstanding performance" },
  {
    icon: "mingcute:group-line",
    text: "Decent self-application in the Social Media space and in seeking beneficial relationships.",
  },
  {
    icon: "mingcute:thumb-up-2-line",
    text: "Teamwork, Loyalty and Trust in building solid relationships and networks.",
  },
  {
    icon: "mingcute:shield-line",
    text: "Strict adherence to the highest ethical and professional standards.",
  },
  { icon: "mingcute:heart-line", text: "Genuine contentment in helping others to succeed." },
] as const satisfies readonly { icon: IconName; text: string }[];

export const aboutUs =
  "Yahwe-eita operates a membership affiliate programme that is designed essentially to reward loyal customers of a brand, via a simple referral and compensation formula. Yahwe-eita is headed by a marketing researcher and supported by an experienced team of young professionals in the fields of IT, Project Management and Accountancy.";

export const services = [
  {
    title: "Our Services",
    body: "Marketing is a Peoples’ Science that studies the way different people react to different marketing strategies at a given time. Yahwe-eita Culture undertakes marketing research periodically and makes some of its findings functional. Yahwe-eita is presently focused on driving the sales of Mobile Phone Airtime and Data Credit. It has adopted the Value-Exchange Trade-Off (VETO) concept, in a value chain of multiples through effective Word-of-Mouth referral marketing that rewards referrers. The entity is researching into adding the sales and marketing of Consumer goods and services like Life Assurance products, Fashion and its accessories to its portfolio of products.",
  },
  {
    title: "Word-of-Mouth Marketing",
    body: "The Yahwe-eita module is premised on the time-tested human habit of social networking by word-of-mouth recommendations. Recommendation is an important tool to marketers because it indicates a strong preference by customers that may lead to sales. It also signals strong probability that a satisfied customer would also tell others about a brand. Consumers naturally, are wary of the unfamiliar, thus word-of-mouth recommendations especially, from a friendly or trusted voice, help in making purchasing decisions easier.",
  },
  {
    title: "Benefits",
    body: "Word-of-Mouth recommendation is the most powerful and cost-effective form of marketing and advertising, especially through today’s social media platforms. It is reckoned to be the primary force behind some 40-60% of all purchasing decisions.",
  },
] as const;

export const benefitLists = [
  {
    title: "The Yahwe-eita module is designed to make the practice of word-of-mouth referrals",
    items: [
      { icon: "mingcute:thumb-up-2-line", text: "A great consumer experience" },
      { icon: "mingcute:gift-line", text: "Rewarding customer loyalty" },
      { icon: "mingcute:cash-line", text: "Earning residual income" },
      { icon: "mingcute:earth-line", text: "Facilitating beneficial societal bonding" },
    ],
  },
  {
    title: "The Yahwe-eita module benefits the retailer in",
    items: [
      {
        icon: "mingcute:rocket-line",
        text: "Driving sales of goods and services faster than conventional advertising",
      },
      { icon: "mingcute:volume-line", text: "Making the brand “a Talking Brand”" },
      { icon: "mingcute:trending-up-line", text: "Shortening the shelf life of products" },
      { icon: "mingcute:coin-line", text: "Reducing advertising spend" },
    ],
  },
] as const satisfies readonly { title: string; items: readonly { icon: IconName; text: string }[] }[];

export function purpose(p: Programme) {
  return [
    {
      title: "Our Motivation",
      body: [
        "We aim to modernize and digitize the Ghanaian culture of voluntarily Giving (for example, to help out-door a newly born, or to bereaved friends and associates in raising funds to bury their dead). It is a rewarding system to the network of Givers and Receivers that is routed through the Mobile phone airtime that we buy.",
        "We are driven by the endless opportunities that ICT presents and the conviction that Africans especially, can rethink and re-programme some of their customs and social practices to help reduce poverty.",
        "We are convinced that the individual and his network of associates, relatives and friends could learn how to support each other financially, in a systematic, transparent fashion using the mobile device.",
      ],
    },
    {
      title: "Our Vision",
      body: [
        "To continuously apply fresh thinking in the ICT space to provide sustainable solutions for poverty reduction and in making real impact in the lives of affiliate members.",
      ],
    },
    {
      title: "Our Mission",
      body: [
        `Yahwe-eita is offering an exciting opportunity to individuals who comply with our Terms and Conditions to earn some residual income together with their reliable relations, associates and friends in cycles of ${p.cycleDays / 7}-week periods. Member affiliates achieve this goal by sharing their Airtime Credit with others and vice versa.`,
        "By this vehicle Yahwe-eita hopes to help ease the financial burden on members with the residual income that they earn. The reality that members who support each other succeed, helps them to bond firmly. Yahwe-eita will introduce other essential products and services in the near future. We on the back of this, hope to meet our stakeholders and shareholders expectations.",
        noGuarantee,
      ],
    },
  ];
}

export function howItWorks(p: Programme) {
  const cashLevels = p.levels.filter((level) => level.rewardType === "CASH");
  const airtimeLevels = p.levels.filter((level) => level.rewardType === "AIRTIME");
  const range = (levels: typeof p.levels) =>
    levels.length === 1
      ? `Level ${levels[0].level}`
      : `Levels ${levels[0].level} to ${levels[levels.length - 1].level}`;

  return {
    intro: [
      "Information and Communications Technology (ICT) is an industry of growth. Mobile Phone Airtime and Data Credit is the life blood of telephony communication; and Yahwe-eita Culture has been established to help ease its retailing and essentially reward those who buy from us and recommend others to do same.",
      "The Yahwe-eita concept is simple and rewarding.",
    ],
    sections: [
      {
        title: "The Networking",
        body: `Members are required to introduce ${p.requiredDownlines} trusted friends or associates who must also register within ${p.recruitWindowDays} days as their downlines. Any additional downlines are registered under the member, who receives the rewards accordingly.`,
      },
      {
        title: "Rewards",
        body: `All rewards are instant. Every member receives ${formatCurrency(p.selfAirtimeReward)} of airtime on joining. ${airtimeLevels.length ? `${range(airtimeLevels)} rewards are airtime credit` : ""}${airtimeLevels.length && cashLevels.length ? " and " : ""}${cashLevels.length ? `${range(cashLevels)} rewards come as Mobile Money cash` : ""}. Register at least one downline within ${p.recruitWindowDays} days to qualify for the next level.`,
      },
    ],
  };
}

export function steps(p: Programme): { icon: IconName; title: string; body: string }[] {
  return [
    {
      icon: "mingcute:user-add-line",
      title: "Create an account",
      body: `You must be ${p.minimumAge} or older, an MTN subscriber, and introduced by an existing member in good standing.`,
    },
    {
      icon: "mingcute:bank-card-line",
      title: "Buy airtime",
      body: `Have an Android or Apple phone with an MTN Mobile Money wallet and ${formatCurrency(p.feeAmount)} to buy airtime credit.`,
    },
    {
      icon: "mingcute:group-line",
      title: "Invite friends and associates",
      body: `Introduce at least ${p.requiredDownlines} people within ${p.recruitWindowDays} days of registering to stay a benefiting member.`,
    },
    {
      icon: "mingcute:wallet-4-line",
      title: "Start earning",
      body: "Members earn their rewards only after fulfilling their individual responsibilities as stated.",
    },
  ];
}

/** The one set of member terms, shown on the landing page and agreed to in onboarding. */
export function terms(p: Programme) {
  const weeks = p.cycleDays / 7;
  return [
    "Yahwe-eita offers a membership affiliate programme that is designed to drive the sales of goods and services online, and essentially rewards loyal customers of a brand, via a simple referral and compensation formula.",
    `The Member shall assume full responsibility for the correctness and validity of all information provided for the registration and for the payment of the product. Only adults aged ${p.minimumAge} or over may register.`,
    "A Prospecting Member must be introduced by an existing member who has taken him/her through the Yahwe-eita concept or has visited the Yahwe-eita website and understood its workings, and agrees with all of its Terms and Conditions.",
    `Every Prospect must agree to introduce at least ${p.requiredDownlines} new Prospects to join the affiliation within ${p.recruitWindowDays} days from the day of registration to continue the genealogy of his/her line and to stay as a valid member.`,
    "The Prospect must agree that he/she would share their Airtime credit with their up-lines just as his/her downlines would do, and therefore would start earning rewards only after honouring Point 4 as programmed.",
    `The Prospect must have an Android or Apple phone or tablet with an MTN Mobile Money wallet and enough money to buy ${formatCurrency(p.feeAmount)} of airtime credit when registering.`,
    "Every Reward is received INSTANTLY from the app as your Downlines register and buy their credit.",
    "YAHWE-EITA DOES NOT MOBILIZE OR KEEP MONEY FOR ITS MEMBERS; ALL REWARDS ARE INSTANTLY DONE ON THE APP. YAHWE-EITA CULTURE provides no guarantees or claims for success of any individual member or group.",
    `Every membership has a terminal cycle of ${weeks} weeks from the registration date. It is however renewable for additional ${weeks}-week cycles.`,
    "Yahwe-eita does not offer refunds to members who register and fail to introduce others.",
    `Members are not permitted to register more than once with the same particulars within the ${weeks}-week period. The system will reject the application.`,
    "As a money-making venture, Members may pay their Income Tax on their earnings as the GRA may demand.",
    "Members agree upon joining not to hold YAHWE-EITA CULTURE responsible for any failure of service technically or otherwise caused by any Authority or third party vendor involved as a Partner with us. Members also agree to bring no damages to the business name of YAHWE-EITA CULTURE and by the dissemination of defamatory, obscene or false information. Any member who is not cooperative or civil online or makes any false representation may have his/her membership terminated at the discretion of the Administrator.",
  ];
}

export const antiMoneyLaundering = [
  "Yahwe-eita would conduct due diligence on members to ensure that they comply with all regulations and applicable laws to prevent any activity of money laundering. This includes and not limited to the verification of member’s Government-issued photo ID and other relevant documentation when necessary.",
  "In the event that Yahwe-eita receives, during its request for documentation, any deceptive documentation, contact details or other false information, Yahwe-eita will take the necessary precautions to deal with the offending member and their accounts. Yahwe-eita has the right to report such crimes to the relevant authorities, and as such the person(s) could be subjected to criminal investigation. Yahwe-eita Culture will not entertain any person or group suspected of directly or indirectly laundering money through its platform.",
] as const;

export function targetSummary(p: Programme) {
  return `${formatCurrency(p.targetCashEarnings)} plus ${formatCurrency(p.targetAirtimeEarnings)} of airtime in ${p.cycleDays / 7} weeks`;
}

export function faqs(p: Programme) {
  const direct = p.levels.find((level) => level.level === 1);
  return [
    {
      question: `What happens if I introduce only one or two downlines within the ${p.recruitWindowDays}-day period?`,
      answer: [
        `You grow on only one or two legs instead of ${p.requiredDownlines}, so you cannot reach the full target of ${targetSummary(p)}.`,
      ],
    },
    {
      question: `Can I introduce more than ${p.requiredDownlines} people in the ${p.recruitWindowDays} days?`,
      answer: [
        `Yes. You may introduce as many people as you like, within and beyond the ${p.recruitWindowDays} days. Additional downlines are placed on the next level behind yours.`,
        `One, two or ${p.requiredDownlines} referrals within ${p.recruitWindowDays} days qualifies you to continue to the next level. Give any additional referrals your phone number as their referral code in the app.`,
        `When they enter your phone number, the app finds your profile and credits you through your latest downline in the cycle. You can add downlines any time in the ${p.cycleDays / 7}-week cycle and benefit from them.`,
        `Note: if you do not introduce at least one downline in the ${p.recruitWindowDays}-day period, your membership ends.${direct ? ` Every direct downline you introduce earns you ${formatCurrency(direct.rewardPerMember)} of ${direct.rewardType === "AIRTIME" ? "airtime" : "cash"}.` : ""}`,
      ],
    },
    {
      question: "Can I check my downlines to see my progress?",
      answer: [
        "Yes. Log in with your email and password at any time to see your downlines and your progress on your dashboard.",
      ],
    },
    {
      question: `Can I register again after my ${p.cycleDays / 7}-week cycle has ended?`,
      answer: ["Yes, once your cycle has ended. Let the Administrator know you intend to."],
    },
  ];
}

export const socialLinks = [
  {
    label: "Berth Global on Instagram",
    href: "https://www.instagram.com/berthglobal/",
    icon: "mingcute:instagram-line",
  },
  { label: "Berth Global on X", href: "https://x.com/berthglobal", icon: "mingcute:social-x-line" },
  {
    label: "Berth Engineering on LinkedIn",
    href: "https://www.linkedin.com/company/berth-engineering/",
    icon: "mingcute:linkedin-line",
  },
] as const satisfies readonly { label: string; href: string; icon: IconName }[];
