import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FaithVerse — Scroll with Purpose",
    short_name: "FaithVerse",
    description: "A global social media platform with a purpose: share God's Word, prayers, testimonies, and worship.",
    start_url: "/",
    display: "standalone",
    background_color: "#090a0f",
    theme_color: "#e5b842",
    orientation: "portrait",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
