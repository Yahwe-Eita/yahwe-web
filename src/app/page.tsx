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
import { Reveal } from "@/components/motion/reveal";
import { ButtonGroup } from "@/components/ui/button-group";
import { ButtonLink } from "@/components/ui/button-link";
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
              <Reveal className="landing-content">
                <h1 id="hero-heading">Be forwardly and upwardly mobile in your finances</h1>
                <p className="landing-copy">
                  Join your community, build your network, and keep track of your progress in one place.
                </p>
                <ButtonGroup variant="hero">
                  <ButtonLink variant="primary" href="/onboarding">
                    Create an account
                  </ButtonLink>
                  <ButtonLink variant="secondary" href="/login">
                    Login
                  </ButtonLink>
                </ButtonGroup>
              </Reveal>
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
