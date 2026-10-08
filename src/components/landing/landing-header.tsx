"use client";

import { useState } from "react";
import { Icon } from "@/components/icon";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { ButtonLink } from "@/components/ui/button-link";
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
        <ButtonLink variant="secondary" href="/login">
          Login
        </ButtonLink>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <Button
          variant="menu"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
        >
          <Icon name="mingcute:menu-line" size={26} />
        </Button>
        <DialogContent className="landing-menu" aria-describedby={undefined}>
          <div className="landing-menu-header">
            <DialogTitle>Menu</DialogTitle>
            <DialogClose asChild>
              <Button variant="icon" aria-label="Close menu">
                <Icon name="mingcute:close-line" size={22} />
              </Button>
            </DialogClose>
          </div>
          <div className="landing-menu-links">
            {sections.map((section) => (
              <a key={section.href} href={section.href} onClick={() => setOpen(false)}>
                {section.label}
              </a>
            ))}
          </div>
          <ButtonGroup variant="menu">
            <ButtonLink variant="submit" href="/onboarding">
              Create an account
            </ButtonLink>
            <ButtonLink variant="small" href="/login">
              Login
            </ButtonLink>
          </ButtonGroup>
        </DialogContent>
      </Dialog>
    </nav>
  );
}
