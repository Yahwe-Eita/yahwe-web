import type { Programme } from "@/lib/api/types";
import { corporateValues, noGuarantee, purpose, targetSummary, terms, welcome } from "@/content/landing";

export interface OnboardingSlide {
  title: string;
  paragraphs: readonly string[];
  list?: readonly string[];
  ordered?: boolean;
}

export function onboardingSlides(p: Programme): OnboardingSlide[] {
  return [
    { title: "Welcome", paragraphs: welcome },
    { title: "Our purpose", paragraphs: [...purpose(p)[0].body, noGuarantee] },
    {
      title: "Our corporate values",
      paragraphs: [],
      list: corporateValues.map((value) => value.text),
    },
    {
      title: "Terms and conditions",
      paragraphs: [
        `If you introduce reliable friends and they do likewise, the target is ${targetSummary(p)}.`,
      ],
      list: terms(p),
      ordered: true,
    },
  ];
}
