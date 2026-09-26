import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
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
import { formatCurrency } from "@/lib/format";

export function WelcomeSection() {
  return (
    <section className="site-section site-split" id="about" aria-labelledby="about-heading">
      <Reveal className="section-heading">
        <h2 id="about-heading">Welcome</h2>
        <div className="prose-block">
          {welcome.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <h3>About us</h3>
        <div className="prose-block">
          <p>{aboutUs}</p>
        </div>
      </Reveal>
      <Reveal className="welcome-mark" delay={0.08}>
        <Image src="/original-logo.png" alt="" width={320} height={392} />
      </Reveal>
    </section>
  );
}

export function ServicesSection() {
  return (
    <div className="site-band">
      <section className="site-section" aria-labelledby="services-heading">
        {services.map((service, index) => (
          <Reveal className="section-heading" key={service.title}>
            {index === 0 ? <h2 id="services-heading">{service.title}</h2> : <h3>{service.title}</h3>}
            <div className="prose-block">
              <p>{service.body}</p>
            </div>
          </Reveal>
        ))}
        <div className="benefit-grid">
          {benefitLists.map((list) => (
            <Reveal key={list.title}>
              <h3 className="benefit-title">{list.title}</h3>
              <ul className="benefit-list">
                {list.items.map((item) => (
                  <li key={item.text}>
                    <Icon name={item.icon} size={22} />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}

export function RewardTableSection({ programme }: { programme: Programme }) {
  return (
    <section className="site-section" id="rewards" aria-labelledby="rewards-heading">
      <Reveal className="section-heading">
        <h2 id="rewards-heading">Instant reward table</h2>
        <div className="prose-block">
          <p>
            Buy {formatCurrency(programme.feeAmount)} of airtime and receive {formatCurrency(programme.selfAirtimeReward)} of
            airtime straight away. Each level below shows what you earn when it is full with {programme.requiredDownlines}{" "}
            downlines per member.
          </p>
        </div>
      </Reveal>
      <div className="table-scroll">
        <table className="reward-table">
          <caption className="sr-only">Rewards per level</caption>
          <thead>
            <tr>
              <th scope="col">Level</th>
              <th scope="col">Members</th>
              <th scope="col">Reward each</th>
              <th scope="col">Level total</th>
            </tr>
          </thead>
          <tbody>
            {programme.levels.map((level) => (
              <tr key={level.level}>
                <th scope="row">Level {level.level}</th>
                <td>{level.members.toLocaleString("en-GH")}</td>
                <td>
                  {formatCurrency(level.rewardPerMember)} {level.rewardType === "AIRTIME" ? "airtime" : "cash"}
                </td>
                <td>{formatCurrency(level.levelTotal)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row" colSpan={3}>
                Total over {programme.cycleDays / 7} weeks
              </th>
              <td>{targetSummary(programme)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}

export function PurposeSection({ programme }: { programme: Programme }) {
  return (
    <div className="site-band">
      <section className="site-section" aria-labelledby="purpose-heading">
        <h2 id="purpose-heading" className="sr-only">
          Our purpose
        </h2>
        <Stagger className="feature-grid">
          {purpose(programme).map((block) => (
            <StaggerItem key={block.title}>
              <article className="feature-card">
                <h3>{block.title}</h3>
                {block.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </section>
    </div>
  );
}

export function ValuesSection() {
  return (
    <div className="site-band site-band-dark">
      <section className="site-section" aria-labelledby="values-heading">
        <Reveal className="section-heading">
          <h2 id="values-heading">Our corporate values</h2>
        </Reveal>
        <Stagger className="feature-grid">
          {corporateValues.map((value) => (
            <StaggerItem key={value.text}>
              <article className="feature-card">
                <Icon className="feature-icon" name={value.icon} size={30} />
                <p className="feature-card-lead">{value.text}</p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </section>
    </div>
  );
}

export function HowItWorksSection({ programme }: { programme: Programme }) {
  const content = howItWorks(programme);
  return (
    <section className="site-section site-split" id="how-it-works" aria-labelledby="how-heading">
      <Reveal className="section-heading">
        <h2 id="how-heading">How it works</h2>
        <div className="prose-block">
          {content.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </Reveal>
      <div>
        {content.sections.map((section) => (
          <Reveal className="prose-block" key={section.title}>
            <h3>{section.title}</h3>
            <p>{section.body}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function StepsSection({ programme }: { programme: Programme }) {
  return (
    <div className="site-band">
      <section className="site-section" aria-labelledby="steps-heading">
        <Reveal className="section-heading">
          <h2 id="steps-heading">Step by step</h2>
        </Reveal>
        <Stagger className="feature-grid feature-grid-4">
          {steps(programme).map((step) => (
            <StaggerItem key={step.title}>
              <article className="feature-card">
                <Icon className="feature-icon" name={step.icon} size={30} />
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </section>
    </div>
  );
}

export function TermsSection({ programme }: { programme: Programme }) {
  return (
    <section className="site-section" id="terms" aria-labelledby="terms-heading">
      <Reveal className="section-heading">
        <h2 id="terms-heading">Terms and conditions for members</h2>
      </Reveal>
      <ol className="terms-list">
        {terms(programme).map((term) => (
          <li key={term}>{term}</li>
        ))}
      </ol>
      <Reveal className="section-heading">
        <h3>Anti-money laundering policy</h3>
        <div className="prose-block">
          {antiMoneyLaundering.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

export function FaqSection({ programme }: { programme: Programme }) {
  return (
    <div className="site-band">
      <section className="site-section" id="faq" aria-labelledby="faq-heading">
        <Reveal className="section-heading">
          <h2 id="faq-heading">Frequently asked questions</h2>
        </Reveal>
        <div className="faq-list">
          {faqs(programme).map((faq) => (
            <details className="faq-item" key={faq.question}>
              <summary>{faq.question}</summary>
              {faq.answer.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

export function JoinSection() {
  return (
    <section className="site-section join-section" aria-labelledby="join-heading">
      <Reveal className="section-heading">
        <h2 id="join-heading">Ready to join?</h2>
      </Reveal>
      <div className="join-actions">
        <Link className="submit-button" href="/onboarding">
          Create an account
        </Link>
        <Link className="small-button" href="/login">
          Log in
        </Link>
      </div>
    </section>
  );
}
