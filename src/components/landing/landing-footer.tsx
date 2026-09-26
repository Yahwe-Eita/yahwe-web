import Image from "next/image";
import { Icon } from "@iconify/react";
import { socialLinks } from "@/content/landing";

export function LandingFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-credit">
        <span>Powered by</span>
        <Image src="/berth-logo.png" alt="Berth Engineering" width={128} height={36} />
      </div>
      <ul className="site-footer-social">
        {socialLinks.map((link) => (
          <li key={link.href}>
            <a href={link.href} target="_blank" rel="noreferrer">
              <Icon icon={link.icon} width="20" aria-hidden="true" />
              <span>{link.label}</span>
            </a>
          </li>
        ))}
      </ul>
      <div className="site-footer-bottom">
        <p>&copy; {new Date().getFullYear()} Yahwe-Eita. All rights reserved.</p>
        <a href="#top">
          Back to top <Icon icon="mingcute:arrow-up-line" width="16" aria-hidden="true" />
        </a>
      </div>
    </footer>
  );
}
