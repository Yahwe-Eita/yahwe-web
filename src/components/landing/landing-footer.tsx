import Image from "next/image";
import { Icon } from "@/components/icon";

export function LandingFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-credit">
        <Image src="/synergista-dark.png" alt="Synergista Culture Ltd logo" width={40} height={40} />
        <span>Powered by Synergista Culture Ltd</span>
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
