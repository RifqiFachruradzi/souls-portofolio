import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

// The sandboxed scene views (holo-scene.html) fetch the card document from an opaque origin, so
// the landing pages need CORS headers; vercel.json sets the same header in production.
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
});
