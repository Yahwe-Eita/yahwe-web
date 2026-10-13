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
import { ScrollTable } from "@/components/ui/scroll-table";
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
  targetSummary,
  terms,
  welcome,
} from "@/content/landing";
import type { Programme } from "@/lib/api/types";
import { currencySymbol, formatAmount, formatCurrency } from "@/lib/format";

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

export function RewardTableSection({ programme }: { programme: Programme }) {
  const [direct, ...deeper] = programme.levels;
  const depth = programme.levels.length;
  return (
    <Section id="rewards" aria-labelledby="rewards-heading">
      <SectionHeading>
        <h2 id="rewards-heading">Yahwe-eita instant reward table</h2>
        <Prose>
          <p>Factoring: Subscriber top-up credit</p>
        </Prose>
      </SectionHeading>
      <ScrollTable className="reward-table" caption="Rewards per week and level">
        <thead>
          <tr>
            <th scope="col" className="reward-credit">
              {formatCurrency(programme.feeAmount)} top-up credit
            </th>
            {deeper.map((level) => (
              <th scope="col" key={level.level}>
                WK/L{level.level}
              </th>
            ))}
            <th scope="col">Total</th>
          </tr>
          <tr>
            <th scope="col">{programme.requiredDownlines} downlines</th>
            {deeper.map((level) => (
              <th scope="col" key={level.level}>
                {currencySymbol}
              </th>
            ))}
            <th scope="col">{currencySymbol}</th>
          </tr>
          <tr>
            <th scope="col">
              K1 WK/L1{" "}
              <span className="reward-credit">{formatCurrency(programme.selfAirtimeReward)} instant credit plus</span>
            </th>
            {deeper.map((level) => (
              <th scope="col" key={level.level}>
                K{level.level}
              </th>
            ))}
            <td />
          </tr>
        </thead>
        <tbody>
          {programme.levels.map((row, index) => (
            <tr key={row.level}>
              <th scope="row">
                <div className="reward-row-label">
                  <span>
                  {index === 0 ? "" : `K${row.level} `}({formatCurrency(row.rewardPerMember)} ×{" "}
                  {row.members.toLocaleString("en-GH")})
                </span>
                  <span className="reward-credit">{formatAmount(direct.levelTotal)}</span>
                </div>
              </th>
              {deeper.map((column, columnIndex) => {
                if (columnIndex < depth - 1 - index) {
                  return (
                    <td className="reward-cash" key={column.level}>
                      {formatAmount(column.levelTotal)}
                    </td>
                  );
                }
                if (index === depth - 1 && columnIndex === 0) {
                  return (
                    <td className="reward-credit" key={column.level}>
                      New starters
                    </td>
                  );
                }
                return <td className="reward-empty" key={column.level} />;
              })}
              {index === 0 ? (
                <td className="reward-cash">{formatAmount(programme.targetCashEarnings)}</td>
              ) : (
                <td className="reward-empty" />
              )}
            </tr>
          ))}
        </tbody>
      </ScrollTable>
      <p className="reward-summary">{targetSummary(programme)}</p>
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
