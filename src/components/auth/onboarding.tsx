"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Logo } from "@/components/logo";
import { onboardingSlides } from "@/content/onboarding";

export function Onboarding() {
  const [index, setIndex] = useState(0);
  const [accepted, setAccepted] = useState(false);
  const slide = onboardingSlides[index];
  const isLast = index === onboardingSlides.length - 1;

  return (
    <main className="onboarding-page">
      <header className="onboarding-header">
        <Logo />
        <Link className="button button-secondary" href="/login">
          Sign in
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
            <p className="eyebrow">
              Step {index + 1} of {onboardingSlides.length}
            </p>
            <h1 className="auth-title">{slide.title}</h1>
            <div className="onboarding-copy">
              {slide.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            {isLast ? (
              <label className="terms-check">
                <input
                  type="checkbox"
                  checked={accepted}
                  onChange={(event) => setAccepted(event.target.checked)}
                />
                <span>I have read and agree to these terms and conditions.</span>
              </label>
            ) : null}
          </motion.div>
        </AnimatePresence>
        <div className="onboarding-actions">
          <button
            className="button button-quiet"
            type="button"
            disabled={index === 0}
            onClick={() => setIndex(index - 1)}
          >
            Previous
          </button>
          {isLast ? (
            <Link
              className={`button button-primary ${!accepted ? "link-disabled" : ""}`}
              href={accepted ? "/sponsor" : "#"}
              aria-disabled={!accepted}
            >
              Create account
            </Link>
          ) : (
            <button
              className="button button-primary"
              type="button"
              onClick={() => setIndex(index + 1)}
            >
              Next
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
