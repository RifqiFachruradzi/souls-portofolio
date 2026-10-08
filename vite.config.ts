import { fileURLToPath, URL } from "node:url";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

// `@designcodeio/threeui` resolves to the registered ThreeUI sources vendored in src/shaders,
// so the configured `import { DarkSoulsHoloCard } from "@designcodeio/threeui"` usage works as written.
// The sandboxed shrine background fetches the card document from an opaque origin, so the
// landing pages need CORS headers; vercel.json sets the same header in production.
function landingPageCors(): Plugin {
  return {
    name: "landing-page-cors",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.startsWith("/landing-pages/")) res.setHeader("Access-Control-Allow-Origin", "*");
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.startsWith("/landing-pages/")) res.setHeader("Access-Control-Allow-Origin", "*");
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), landingPageCors()],
  resolve: {
    alias: [
      { find: "@designcodeio/threeui/style.css", replacement: fileURLToPath(new URL("./src/shaders/threeui.css", import.meta.url)) },
      { find: /^@designcodeio\/threeui$/, replacement: fileURLToPath(new URL("./src/shaders/index.ts", import.meta.url)) },
    ],
  },
});
