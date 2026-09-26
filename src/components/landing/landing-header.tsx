"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/icon";
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
          <Icon name="mingcute:menu-line" size={26} />
        </button>
        <DialogContent className="landing-menu" aria-describedby={undefined}>
          <div className="landing-menu-header">
            <DialogTitle>Menu</DialogTitle>
            <DialogClose className="icon-button" aria-label="Close menu">
              <Icon name="mingcute:close-line" size={22} />
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
