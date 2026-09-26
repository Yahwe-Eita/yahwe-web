import Link from "next/link";
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
import { getProgramme } from "@/lib/server/programme";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const programme = await getProgramme();
  return (
    <>
      <main id="main-content">
        <div className="landing-page" id="top">
          <div className="landing-shell">
            <LandingHeader />
            <section className="landing-hero" aria-labelledby="hero-heading">
              <div className="landing-content reveal">
                <h1 id="hero-heading">Be forwardly and upwardly mobile in your finances</h1>
                <p className="landing-copy">
                  Join your community, build your network, and keep track of your progress in one place.
                </p>
                <div className="landing-actions">
                  <Link className="button button-primary" href="/onboarding">
                    Create an account
                  </Link>
                  <Link className="button button-secondary" href="/login">
                    Log in
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>
        <WelcomeSection />
        <ServicesSection />
        <RewardTableSection programme={programme} />
        <PurposeSection programme={programme} />
        <ValuesSection />
        <HowItWorksSection programme={programme} />
        <StepsSection programme={programme} />
        <TermsSection programme={programme} />
        <FaqSection programme={programme} />
        <ContactSection />
        <JoinSection />
      </main>
      <LandingFooter />
    </>
  );
}
