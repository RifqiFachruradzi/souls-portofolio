import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// `@designcodeio/threeui` resolves to the registered ThreeUI sources vendored in src/shaders,
// so the configured `import { DarkSoulsHoloCard } from "@designcodeio/threeui"` usage works as written.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: "@designcodeio/threeui/style.css", replacement: fileURLToPath(new URL("./src/shaders/threeui.css", import.meta.url)) },
      { find: /^@designcodeio\/threeui$/, replacement: fileURLToPath(new URL("./src/shaders/index.ts", import.meta.url)) },
    ],
  },
});
