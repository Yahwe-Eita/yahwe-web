import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { ContactSection } from "@/components/landing/contact-section";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingHeader } from "@/components/landing/landing-header";
import {
  FaqSection,
  HowItWorksSection,
  JoinSection,
  PurposeSection,
  RewardTableSection,
  ServicesSection,
  StepsSection,
  TermsSection,
  ValuesSection,
  WelcomeSection,
} from "@/components/landing/landing-sections";

export default function HomePage() {
  return (
    <>
      <main>
        <div className="landing-page" id="top">
          <div className="landing-shell">
            <LandingHeader />
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
        </div>
        <WelcomeSection />
        <ServicesSection />
        <RewardTableSection />
        <PurposeSection />
        <ValuesSection />
        <HowItWorksSection />
        <StepsSection />
        <TermsSection />
        <FaqSection />
        <ContactSection />
        <JoinSection />
      </main>
      <LandingFooter />
    </>
  );
}
