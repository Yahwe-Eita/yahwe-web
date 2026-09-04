import type { Metadata, Viewport } from "next";
import { ServiceWorkerRegistration } from "@/components/service-worker-registration";
import { ThemeInitializer } from "@/components/theme-initializer";
import { MotionProvider } from "@/components/motion/motion-provider";
import "./globals.css";

const description =
  "Manage your Yahwe-Eita referrals, progress, rewards, and transactions.";

export const metadata: Metadata = {
  applicationName: "Yahwe-Eita",
  title: {
    default: "Yahwe-Eita",
    template: "%s | Yahwe-Eita",
  },
  description,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Yahwe-Eita",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#315c35",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body>
        <ThemeInitializer />
        <ServiceWorkerRegistration />
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
