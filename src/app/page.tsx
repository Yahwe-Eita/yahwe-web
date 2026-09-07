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
            <p className="landing-eyebrow">Welcome to Yahwe-Eita</p>
            <h1>Be Forwardly and Upwardly Mobile, in your Finances</h1>
            <p className="landing-copy">
              Join your community, build your network, and keep track of your
              progress in one simple place.
            </p>
            <div className="landing-actions">
              <Link className="button button-primary" href="/onboarding">
                Create an account
              </Link>
              <Link className="button button-secondary" href="/login">
                Log in
              </Link>
            </div>
            <p className="landing-note">Already a member? Log in to continue where you left off.</p>
          </Reveal>
        </section>
      </div>
    </main>
  );
}
