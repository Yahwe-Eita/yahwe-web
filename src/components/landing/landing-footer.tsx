import Image from "next/image";
import { Icon } from "@/components/icon";

export function LandingFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-credit">
        <span>Powered by</span>
        <Image src="/synergista-dark.png" alt="Synergista Ltd" width={80} height={65} />
      </div>
      <div className="site-footer-bottom">
        <p>Yahwe-Eita. All rights reserved.</p>
        <a href="#top">
          Back to top <Icon name="mingcute:arrow-up-line" size={16} />
        </a>
      </div>
    </footer>
  );
}
