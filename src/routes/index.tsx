import { createFileRoute } from "@tanstack/react-router";
import High5App from "@/components/high5/App";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "High5 Vocabulary — Learn 10 English words a day" },
      { name: "description", content: "Learn English vocabulary with pictures, native audio, games and spaced repetition. Translations in 8 languages." },
      { property: "og:title", content: "High5 Vocabulary" },
      { property: "og:description", content: "Learn 10 English words a day with pictures, audio, games and spaced repetition." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: High5App,
});
