"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { Logo } from "@/components/logo";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";

const sections = [
  { href: "#about", label: "About" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#terms", label: "Terms" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
] as const;

export function LandingHeader() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="landing-nav" aria-label="Main navigation">
      <Logo />
      <div className="landing-links">
        {sections.map((section) => (
          <a key={section.href} href={section.href}>
            {section.label}
          </a>
        ))}
        <Link className="button button-secondary" href="/login">
          Log in
        </Link>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <button
          className="landing-menu-button"
          type="button"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
        >
          <Icon icon="mingcute:menu-line" width="26" aria-hidden="true" />
        </button>
        <DialogContent className="landing-menu" aria-describedby={undefined}>
          <div className="landing-menu-header">
            <DialogTitle>Menu</DialogTitle>
            <DialogClose className="icon-button" aria-label="Close menu">
              <Icon icon="mingcute:close-line" width="22" aria-hidden="true" />
            </DialogClose>
          </div>
          <div className="landing-menu-links">
            {sections.map((section) => (
              <a key={section.href} href={section.href} onClick={() => setOpen(false)}>
                {section.label}
              </a>
            ))}
          </div>
          <div className="landing-menu-actions">
            <Link className="submit-button" href="/onboarding">
              Create an account
            </Link>
            <Link className="small-button" href="/login">
              Log in
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </nav>
  );
}
