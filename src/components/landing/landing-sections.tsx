import Image from "next/image";
import { Reveal, StaggerItem } from "@/components/motion/reveal";
import { Band } from "@/components/ui/band";
import { ButtonGroup } from "@/components/ui/button-group";
import { ButtonLink } from "@/components/ui/button-link";
import { FeatureCard } from "@/components/ui/feature-card";
import { Grid } from "@/components/ui/grid";
import { IconListItem } from "@/components/ui/icon-list-item";
import { Paragraphs } from "@/components/ui/paragraphs";
import { Prose } from "@/components/ui/prose";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import {
  aboutUs,
  antiMoneyLaundering,
  benefitLists,
  corporateValues,
  faqs,
  howItWorks,
  purpose,
  services,
  steps,
  terms,
  welcome,
} from "@/content/landing";
import type { Programme } from "@/lib/api/types";

export function WelcomeSection() {
  return (
    <Section variant="split" id="about" aria-labelledby="about-heading">
      <SectionHeading>
        <h2 id="about-heading">Welcome</h2>
        <Prose>
          <Paragraphs items={welcome} />
        </Prose>
        <h3>About us</h3>
        <Prose>
          <p>{aboutUs}</p>
        </Prose>
      </SectionHeading>
      <Reveal className="welcome-mark" delay={0.08}>
        <Image src="/original-logo.png" alt="" width={320} height={392} />
      </Reveal>
    </Section>
  );
}

export function ServicesSection() {
  return (
    <Band>
      <Section aria-labelledby="services-heading">
        {services.map((service, index) => (
          <SectionHeading key={service.title}>
            {index === 0 ? <h2 id="services-heading">{service.title}</h2> : <h3>{service.title}</h3>}
            <Prose>
              <p>{service.body}</p>
            </Prose>
          </SectionHeading>
        ))}
        <div className="benefit-grid">
          {benefitLists.map((list) => (
            <Reveal key={list.title}>
              <h3 className="benefit-title">{list.title}</h3>
              <ul className="benefit-list">
                {list.items.map((item) => (
                  <IconListItem key={item.text} icon={item.icon}>
                    {item.text}
                  </IconListItem>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </Section>
    </Band>
  );
}

export function RewardTableSection() {
  return (
    <Section id="rewards" aria-labelledby="rewards-heading">
      <SectionHeading>
        <h2 id="rewards-heading">Yahwe-eita instant reward table</h2>
      </SectionHeading>
      <Image
        className="reward-table"
        src="/reward-table.jpeg"
        alt="Yahwe-eita instant reward table 26, with terms and conditions"
        width={1404}
        height={1069}
        sizes="(max-width: 72rem) 100vw, 72rem"
      />
    </Section>
  );
}

export function PurposeSection({ programme }: { programme: Programme }) {
  return (
    <Band>
      <Section aria-labelledby="purpose-heading">
        <VisuallyHidden as="h2" id="purpose-heading">
          Our purpose
        </VisuallyHidden>
        <Grid variant="feature" stagger>
          {purpose(programme).map((block) => (
            <StaggerItem key={block.title}>
              <FeatureCard title={block.title}>
                <Paragraphs items={block.body} />
              </FeatureCard>
            </StaggerItem>
          ))}
        </Grid>
      </Section>
    </Band>
  );
}

export function ValuesSection() {
  return (
    <Band dark>
      <Section aria-labelledby="values-heading">
        <SectionHeading>
          <h2 id="values-heading">Our corporate values</h2>
        </SectionHeading>
        <Grid variant="feature" stagger>
          {corporateValues.map((value) => (
            <StaggerItem key={value.text}>
              <FeatureCard icon={value.icon} lead={value.text} />
            </StaggerItem>
          ))}
        </Grid>
      </Section>
    </Band>
  );
}

export function HowItWorksSection({ programme }: { programme: Programme }) {
  const content = howItWorks(programme);
  return (
    <Section variant="split" id="how-it-works" aria-labelledby="how-heading">
      <SectionHeading>
        <h2 id="how-heading">How it works</h2>
        <Prose>
          <Paragraphs items={content.intro} />
        </Prose>
      </SectionHeading>
      <div>
        {content.sections.map((section) => (
          <Prose animate key={section.title}>
            <h3>{section.title}</h3>
            <p>{section.body}</p>
          </Prose>
        ))}
      </div>
    </Section>
  );
}

export function StepsSection({ programme }: { programme: Programme }) {
  return (
    <Band>
      <Section id="features" aria-labelledby="steps-heading">
        <SectionHeading>
          <h2 id="steps-heading">Step by step</h2>
        </SectionHeading>
        <Grid variant="feature-4" stagger>
          {steps(programme).map((step) => (
            <StaggerItem key={step.title}>
              <FeatureCard icon={step.icon} title={step.title}>
                <p>{step.body}</p>
              </FeatureCard>
            </StaggerItem>
          ))}
        </Grid>
      </Section>
    </Band>
  );
}

export function TermsSection({ programme }: { programme: Programme }) {
  return (
    <Section id="terms" aria-labelledby="terms-heading">
      <SectionHeading>
        <h2 id="terms-heading">Terms and conditions for members</h2>
      </SectionHeading>
      <ol className="terms-list">
        {terms(programme).map((term) => (
          <li key={term}>{term}</li>
        ))}
      </ol>
      <SectionHeading>
        <h3>Anti-money laundering policy</h3>
        <Prose>
          <Paragraphs items={antiMoneyLaundering} />
        </Prose>
      </SectionHeading>
    </Section>
  );
}

export function FaqSection({ programme }: { programme: Programme }) {
  return (
    <Band>
      <Section id="faq" aria-labelledby="faq-heading">
        <SectionHeading>
          <h2 id="faq-heading">Frequently asked questions</h2>
        </SectionHeading>
        <div className="faq-list">
          {faqs(programme).map((faq) => (
            <details className="faq-item" key={faq.question}>
              <summary>{faq.question}</summary>
              <Paragraphs items={faq.answer} />
            </details>
          ))}
        </div>
      </Section>
    </Band>
  );
}

export function JoinSection() {
  return (
    <Section variant="join" aria-labelledby="join-heading">
      <SectionHeading>
        <h2 id="join-heading">Ready to join?</h2>
      </SectionHeading>
      <ButtonGroup variant="join">
        <ButtonLink variant="submit" href="/onboarding">
          Create an account
        </ButtonLink>
        <ButtonLink variant="small" href="/login">
          Login
        </ButtonLink>
      </ButtonGroup>
    </Section>
  );
}
