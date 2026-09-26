"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/logo";
import type { OnboardingSlide } from "@/content/onboarding";

export function Onboarding({ slides, minimumAge }: { slides: OnboardingSlide[]; minimumAge: number }) {
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
        <Link className="button button-secondary" href="/login">
          Log in
        </Link>
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
            <h1 className="auth-title" ref={heading} tabIndex={-1}>
              {slide.title}
            </h1>
            <div className="onboarding-copy">
              {slide.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {slide.list ? (
                <List className="onboarding-list">
                  {slide.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </List>
              ) : null}
            </div>
            {isLast ? (
              <>
                <label className="terms-check">
                  <input
                    type="checkbox"
                    checked={accepted}
                    onChange={(event) => setAccepted(event.target.checked)}
                  />
                  <span>I am {minimumAge} or older and I agree to these terms and conditions</span>
                </label>
                <a href="/#how-it-works" className="external-link" target="_blank" rel="noreferrer">
                  How it works
                  <span aria-hidden="true">↗</span>
                </a>
              </>
            ) : null}
          </motion.div>
        </AnimatePresence>
        <div className="onboarding-actions">
          {index > 0 ? (
            <button className="button button-secondary" type="button" onClick={() => go(index - 1)}>
              Back
            </button>
          ) : null}
          {isLast ? (
            <button
              className="button button-primary"
              type="button"
              disabled={!accepted}
              onClick={() => router.push("/sponsor")}
            >
              Get started
            </button>
          ) : (
            <button className="button button-primary" type="button" onClick={() => go(index + 1)}>
              Next
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
