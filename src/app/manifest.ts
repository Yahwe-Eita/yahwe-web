import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Yahwe-Eita",
    short_name: "Yahwe-Eita",
    description:
      "Manage your Yahwe-Eita referrals, progress, rewards, and transactions.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8faf7",
    theme_color: "#315c35",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
