// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  // GitHub Pages serves this repository under /pixel-perfect-replica/.
  base: "/pixel-perfect-replica/",
  tanstackStart: {
    // TanStack Start also needs the base path for client hydration.
    router: { basepath: "/pixel-perfect-replica" },
    server: { entry: "server" },
    // Generate static HTML so GitHub Pages can host the app without a Node server.
    prerender: {
      enabled: true,
      autoSubfolderIndex: true,
      autoStaticPathsDiscovery: true,
      crawlLinks: true,
      failOnError: true,
    },
  },
});
