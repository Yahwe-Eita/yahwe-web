import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
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
  terms,
  welcome,
} from "@/content/landing";

export function WelcomeSection() {
  return (
    <section className="site-section site-split" id="about">
      <Reveal className="section-heading">
        <h2>Welcome</h2>
        <div className="prose-block">
          {welcome.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <h3>About Us</h3>
        <div className="prose-block">
          <p>{aboutUs}</p>
        </div>
      </Reveal>
      <Reveal className="welcome-mark" delay={0.08}>
        <Image src="/original-logo.png" alt="" width={320} height={320} />
      </Reveal>
    </section>
  );
}

export function ServicesSection() {
  return (
    <div className="site-band">
      <section className="site-section">
        {services.map((service, index) => (
          <Reveal className="section-heading" key={service.title}>
            {index === 0 ? <h2>{service.title}</h2> : <h3>{service.title}</h3>}
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
                    <Icon icon={item.icon} width="22" aria-hidden="true" />
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

export function RewardTableSection() {
  return (
    <section className="site-section" id="rewards">
      <Reveal className="section-heading">
        <h2>Yahwe-eita Instant Reward Table</h2>
      </Reveal>
      <Reveal className="reward-table">
        <Image
          src="/updated-chart.jpeg"
          alt="Yahwe-eita instant reward table by week and level"
          width={1404}
          height={1069}
          sizes="(max-width: 72rem) 100vw, 72rem"
        />
      </Reveal>
    </section>
  );
}

export function PurposeSection() {
  return (
    <div className="site-band">
      <section className="site-section">
        <Stagger className="feature-grid">
          {purpose.map((block) => (
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
      <section className="site-section">
        <Reveal className="section-heading">
          <h2>Our Corporate Values</h2>
        </Reveal>
        <Stagger className="feature-grid">
          {corporateValues.map((value) => (
            <StaggerItem key={value.text}>
              <article className="feature-card">
                <Icon className="feature-icon" icon={value.icon} width="30" aria-hidden="true" />
                <p className="feature-card-lead">{value.text}</p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </section>
    </div>
  );
}

export function HowItWorksSection() {
  return (
    <section className="site-section site-split" id="how-it-works">
      <Reveal className="section-heading">
        <h2>How It Works</h2>
        <div className="prose-block">
          {howItWorks.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </Reveal>
      <div>
        {howItWorks.sections.map((section) => (
          <Reveal className="prose-block" key={section.title}>
            <h3>{section.title}</h3>
            <p>{section.body}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function StepsSection() {
  return (
    <div className="site-band">
      <section className="site-section">
        <Reveal className="section-heading">
          <h2>Step-by-step</h2>
        </Reveal>
        <Stagger className="feature-grid feature-grid-4">
          {steps.map((step) => (
            <StaggerItem key={step.title}>
              <article className="feature-card">
                <Icon className="feature-icon" icon={step.icon} width="30" aria-hidden="true" />
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

export function TermsSection() {
  return (
    <section className="site-section" id="terms">
      <Reveal className="section-heading">
        <h2>Terms and Conditions for Members</h2>
      </Reveal>
      <ol className="terms-list">
        {terms.map((term) => (
          <li key={term}>{term}</li>
        ))}
      </ol>
      <Reveal className="section-heading">
        <h3>Anti-Money Laundering Policy</h3>
        <div className="prose-block">
          {antiMoneyLaundering.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

export function FaqSection() {
  return (
    <div className="site-band">
      <section className="site-section" id="faq">
        <Reveal className="section-heading">
          <h2>Frequently Asked Questions</h2>
        </Reveal>
        <div className="faq-list">
          {faqs.map((faq) => (
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
    <section className="site-section join-section">
      <Reveal className="section-heading">
        <h2>Ready to join?</h2>
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
