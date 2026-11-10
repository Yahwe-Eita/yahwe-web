import { Icon } from "@/components/icon";
import { PoweredBy } from "@/components/powered-by";

export function LandingFooter() {
  return (
    <footer className="site-footer">
      <PoweredBy onBrand />
      <div className="site-footer-bottom">
        <p>Yahwe-Eita. All rights reserved.</p>
        <a href="#top">
          Back to top <Icon name="mingcute:arrow-up-line" size={16} />
        </a>
      </div>
    </footer>
  );
}
