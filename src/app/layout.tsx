import type { Metadata, Viewport } from "next";
import { MotionProvider } from "@/components/motion/motion-provider";
import { Preloader } from "@/components/preloader";
import { ServiceWorkerRegistration } from "@/components/service-worker-registration";
import { ThemeInitializer } from "@/components/theme-initializer";
import { themeBootScript } from "@/lib/theme";
import { QueryProvider } from "@/providers/query-provider";
import "./globals.css";

export const metadata: Metadata = {
  applicationName: "Yahwe-Eita",
  title: { default: "Yahwe-Eita", template: "%s | Yahwe-Eita" },
  description: "Manage your Yahwe-Eita referrals, progress, rewards, and transactions.",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Yahwe-Eita" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#315c35" },
    { media: "(prefers-color-scheme: dark)", color: "#101512" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body>
        <Preloader year={new Date().getFullYear()} />
        <ThemeInitializer />
        <ServiceWorkerRegistration />
        <QueryProvider>
          <MotionProvider>{children}</MotionProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
