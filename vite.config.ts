import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";

export default defineConfig({
  server: {
    port: 8080,
    host: "127.0.0.1",
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tailwindcss(),
    tanstackStart({
      srcDirectory: "src",
      server: { entry: "server" },
    }),
    viteReact(),
    nitro(),
    {
      name: "club-brand-icons",
      transformIndexHtml(html) {
        if (html.includes("/favicon.svg")) return html;
        return html.replace(
          /<head>/i,
          `<head>
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="icon" href="/favicon.ico" sizes="48x48" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
    <meta property="og:site_name" content="Club Informatique SUP'PTIC" />
    <meta property="og:image" content="/og-image.jpg" />
    <meta name="twitter:image" content="/og-image.jpg" />`,
        );
      },
    },
  ],
});
