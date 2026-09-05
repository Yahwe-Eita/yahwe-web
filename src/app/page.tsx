import Link from "next/link";
import { Logo } from "@/components/logo";
import { Reveal } from "@/components/motion/reveal";

export default function HomePage() {
  return (
    <main className="landing-page">
      <div className="landing-shell">
        <nav className="landing-nav" aria-label="Main navigation">
          <Logo />
        </nav>

        <section className="landing-hero">
          <Reveal className="landing-content">
            <div className="landing-dots" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </div>
            <h1>Create Account</h1>
            <div className="landing-actions">
              <Link className="button button-primary" href="/onboarding">
                CREATE AN ACCOUNT
              </Link>
              <Link className="button button-secondary" href="/login">
                LOGIN
              </Link>
            </div>
          </Reveal>

          <Reveal className="landing-visual" delay={0.08}>
            <div className="network-orbit network-orbit-outer" aria-hidden="true">
              <span className="network-node network-node-one">1</span>
              <span className="network-node network-node-two">2</span>
              <span className="network-node network-node-three">3</span>
            </div>
            <div className="network-orbit network-orbit-inner" aria-hidden="true" />
            <div className="network-center" aria-hidden="true">Y</div>
          </Reveal>
        </section>
      </div>
    </main>
  );
}
