import Link from "next/link";
import { Logo } from "@/components/logo";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";

const benefits = [
  {
    title: "Invite with confidence",
    description: "Grow your network and keep every referral in one place.",
  },
  {
    title: "Track your progress",
    description: "See your level, active downlines, and remaining time clearly.",
  },
  {
    title: "Understand your rewards",
    description: "Review airtime, cash earnings, and transaction history.",
  },
];

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <nav className="nav" aria-label="Main navigation">
          <Logo />
          <Link className="button button-secondary" href="/login">
            Sign in
          </Link>
        </nav>

        <Reveal className="hero-content">
          <p className="eyebrow">Your network. Your progress.</p>
          <h1>Build your community and track every reward.</h1>
          <p className="hero-copy">
            A simple, secure way to manage referrals, follow your progress,
            and understand your earnings from any device.
          </p>
          <Link className="button button-primary" href="/onboarding">
            Get started
          </Link>
        </Reveal>
      </section>

      <section
        className="features"
        id="features"
        aria-labelledby="features-title"
      >
        <div className="section-heading">
          <p className="eyebrow">Everything in one place</p>
          <h2 id="features-title">Designed to stay clear and useful.</h2>
        </div>

        <Stagger className="feature-grid">
          {benefits.map((benefit, index) => (
            <StaggerItem key={benefit.title}>
              <article className="feature-card">
                <span className="feature-number" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </section>
    </main>
  );
}
