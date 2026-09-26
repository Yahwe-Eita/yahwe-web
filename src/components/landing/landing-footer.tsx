import Image from "next/image";
import { Icon } from "@/components/icon";
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
            <a href={link.href} target="_blank" rel="noreferrer" aria-label={link.label}>
              <Icon name={link.icon} size={22} />
            </a>
          </li>
        ))}
      </ul>
      <div className="site-footer-bottom">
        <p>Yahwe-Eita. All rights reserved.</p>
        <a href="#top">
          Back to top <Icon name="mingcute:arrow-up-line" size={16} />
        </a>
      </div>
    </footer>
  );
}
