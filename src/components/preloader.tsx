"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/** Shortest time the splash stays up, so a fast load does not flash it. */
const MINIMUM_VISIBLE_MS = 600;
const FADE_MS = 300;

/** Styles live here, not in globals.css, so the splash also works on the cached offline page. */
const styles = `
.preloader {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  grid-template-rows: 1fr auto;
  place-items: center;
  padding: 2rem 1rem max(1.5rem, env(safe-area-inset-bottom));
  background: var(--background, #f8faf7);
  color: var(--muted, #5f6f62);
  font-family: Arial, Helvetica, sans-serif;
  transition: opacity ${FADE_MS}ms ease, visibility ${FADE_MS}ms ease;
  animation: preloader-timeout ${FADE_MS}ms ease 3s forwards;
}
.preloader-logo {
  width: min(200px, 45vw);
  height: auto;
}
.preloader-copyright {
  margin: 0;
  font-size: 0.8rem;
  text-align: center;
}
.preloader-done {
  opacity: 0;
  visibility: hidden;
}
@keyframes preloader-timeout {
  to {
    opacity: 0;
    visibility: hidden;
  }
}
@media (prefers-reduced-motion: reduce) {
  .preloader {
    transition: none;
  }
}
`;

export function Preloader({ year }: { year: number }) {
  const [state, setState] = useState<"visible" | "fading" | "gone">("visible");

  useEffect(() => {
    let fadeTimer = 0;
    let removeTimer = 0;

    function dismiss() {
      const wait = Math.max(0, MINIMUM_VISIBLE_MS - performance.now());
      fadeTimer = window.setTimeout(() => {
        setState("fading");
        removeTimer = window.setTimeout(() => setState("gone"), FADE_MS);
      }, wait);
    }

    if (document.readyState === "complete") {
      fadeTimer = window.setTimeout(dismiss, 0);
    } else {
      window.addEventListener("load", dismiss, { once: true });
    }

    return () => {
      window.removeEventListener("load", dismiss);
      window.clearTimeout(fadeTimer);
      window.clearTimeout(removeTimer);
    };
  }, []);

  if (state === "gone") return null;

  return (
    <div className={`preloader${state === "fading" ? " preloader-done" : ""}`} role="status" aria-label="Loading Yahwe-Eita">
      <style>{styles}</style>
      <Image
        className="preloader-logo"
        src="/splash-logo.png"
        alt=""
        width={400}
        height={491}
        loading="eager"
        fetchPriority="high"
        unoptimized
      />
      <p className="preloader-copyright">&copy; {year} Yahwe-Eita. All rights reserved.</p>
    </div>
  );
}
