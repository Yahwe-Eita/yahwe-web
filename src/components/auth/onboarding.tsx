"use client";

import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/logo";
import { AuthTitle } from "@/components/ui/auth-title";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { ButtonLink } from "@/components/ui/button-link";
import { Checkbox } from "@/components/ui/checkbox";
import { ExternalLink } from "@/components/ui/external-link";
import { Paragraphs } from "@/components/ui/paragraphs";
import type { OnboardingSlide } from "@/content/onboarding";

export function Onboarding({ slides }: { slides: OnboardingSlide[] }) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [accepted, setAccepted] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);
  const slide = slides[index];
  const isLast = index === slides.length - 1;

  useEffect(() => {
    if (moved.current) heading.current?.focus();
  }, [index]);

  function go(next: number) {
    moved.current = true;
    setIndex(next);
  }

  const List = slide.ordered ? "ol" : "ul";

  return (
    <main className="onboarding-page">
      <header className="onboarding-header">
        <Logo />
        <ButtonLink variant="secondary" href="/login">
          Login
        </ButtonLink>
      </header>
      <section className="onboarding-card" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.18 }}
          >
            <AuthTitle ref={heading} tabIndex={-1}>
              {slide.title}
            </AuthTitle>
            <div className="onboarding-copy">
              <Paragraphs items={slide.paragraphs} />
              {slide.list ? (
                <List className="onboarding-list">
                  {slide.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </List>
              ) : null}
              {slide.closing ? <Paragraphs items={slide.closing} /> : null}
            </div>
            {isLast ? (
              <>
                <Checkbox checked={accepted} onChange={(event) => setAccepted(event.target.checked)}>
                  I agree to the{" "}
                  <ExternalLink href="/#terms">
                    Terms and Conditions
                  </ExternalLink>
                </Checkbox>
                <ExternalLink href="/#how-it-works" arrow>
                  Learn how it works
                </ExternalLink>
              </>
            ) : null}
          </motion.div>
        </AnimatePresence>
        <ButtonGroup variant="onboarding">
          {index > 0 ? (
            <Button variant="secondary" onClick={() => go(index - 1)}>
              Back
            </Button>
          ) : null}
          {isLast ? (
            <Button
              variant="primary"
              disabled={!accepted}
              onClick={() => router.push("/sponsor")}
            >
              Get started
            </Button>
          ) : (
            <>
              <Button variant="secondary" onClick={() => go(slides.length - 1)}>
                Skip to terms
              </Button>
              <Button variant="primary" onClick={() => go(index + 1)}>
                Next
              </Button>
            </>
          )}
        </ButtonGroup>
      </section>
    </main>
  );
}
