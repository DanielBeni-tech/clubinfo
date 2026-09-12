const siteUrl = String(import.meta.env.VITE_SITE_URL ?? "").replace(/\/$/, "");
const ogImage = siteUrl ? `${siteUrl}/og-image.jpg` : "/og-image.jpg";

export const brandHeadLinks = [
  { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
  { rel: "icon", href: "/favicon.ico", sizes: "48x48" },
  { rel: "icon", href: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
  { rel: "icon", href: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
  { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
  { rel: "manifest", href: "/site.webmanifest" },
] as const;

export const brandSocialMeta = [
  { property: "og:site_name", content: "Club Informatique SUP'PTIC" },
  { property: "og:image", content: ogImage },
  { property: "og:image:alt", content: "Logo du Club Informatique SUP'PTIC" },
  { property: "og:image:type", content: "image/jpeg" },
  { property: "og:image:width", content: "1200" },
  { property: "og:image:height", content: "630" },
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:image", content: ogImage },
  { name: "twitter:image:alt", content: "Logo du Club Informatique SUP'PTIC" },
];
