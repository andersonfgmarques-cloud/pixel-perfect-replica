import { useEffect, useState } from "react";
import type { Lang } from "./words";

const CACHE_PREFIX = "high5-translation-v1:";
const ERROR_TEXT: Record<Lang, string> = {
  "pt-BR": "Tradução temporariamente indisponível",
  es: "Traducción temporalmente no disponible",
  fr: "Traduction temporairement indisponible",
  it: "Traduzione temporaneamente non disponibile",
  ru: "Перевод временно недоступен",
  ar: "الترجمة غير متاحة مؤقتًا",
  hi: "अनुवाद अभी उपलब्ध नहीं है",
  tr: "Çeviri geçici olarak kullanılamıyor",
  id: "Terjemahan sementara tidak tersedia",
  vi: "Bản dịch hiện tạm thời không khả dụng",
};

function cacheKey(text: string, lang: Lang) {
  return CACHE_PREFIX + lang + ":" + text.trim().toLowerCase();
}

/** Curated translations take priority; missing entries use the free MyMemory endpoint and are cached locally. */
export function useTranslation(text: string | null | undefined, lang: Lang, fallback: string | null | undefined = "") {
  // Data from older cached dictionaries may omit optional text fields. Never let
  // an absent translation/example crash the entire route during React render.
  const cleanText = typeof text === "string" ? text.trim() : "";
  const curated = typeof fallback === "string" ? fallback.trim() : "";
  const [value, setValue] = useState(curated);

  useEffect(() => {
    if (!cleanText) { setValue(""); return; }
    if (curated) { setValue(curated); return; }

    let active = true;
    const key = cacheKey(cleanText, lang);
    try {
      const cached = localStorage.getItem(key);
      if (cached) { setValue(cached); return () => { active = false; }; }
    } catch { /* Local cache is optional. */ }

    setValue("");
    const params = new URLSearchParams({ q: cleanText, langpair: `en|${lang}` });
    fetch(`https://api.mymemory.translated.net/get?${params.toString()}`)
      .then(async (response) => {
        if (!response.ok) throw new Error(`Translation request failed: ${response.status}`);
        return response.json();
      })
      .then((data: { responseStatus?: number; responseData?: { translatedText?: string } }) => {
        const translated = data.responseData?.translatedText?.trim();
        if (data.responseStatus !== 200 || !translated || translated.toLowerCase() === cleanText.toLowerCase()) {
          throw new Error("No usable translation returned");
        }
        if (!active) return;
        setValue(translated);
        try { localStorage.setItem(key, translated); } catch { /* Cache is optional. */ }
      })
      .catch(() => { if (active) setValue(ERROR_TEXT[lang]); });

    return () => { active = false; };
  }, [cleanText, lang, curated]);

  return value || "…";
}

export function TranslationText({ text, lang, fallback = "", className = "" }: {
  text: string | null | undefined; lang: Lang; fallback?: string | null; className?: string;
}) {
  const value = useTranslation(text, lang, fallback);
  return <span className={className}>{value}</span>;
}

type PronunciationEntry = { w: string; ipa?: string };
let pronunciationIndex: Promise<Map<string, string>> | null = null;

function loadPronunciationIndex() {
  if (!pronunciationIndex) {
    pronunciationIndex = fetch("/pixel-perfect-replica/data/english-top-5000.json")
      .then((response) => {
        if (!response.ok) throw new Error("Pronunciation dictionary unavailable");
        return response.json();
      })
      .then((data: { items?: PronunciationEntry[] }) => new Map(
        (data.items ?? []).filter((item) => item.ipa).map((item) => [item.w.toLowerCase(), item.ipa as string]),
      ));
  }
  return pronunciationIndex;
}

export function useIpa(word: string) {
  const [ipa, setIpa] = useState("");
  useEffect(() => {
    let active = true;
    loadPronunciationIndex()
      .then((index) => { if (active) setIpa(index.get(word.toLowerCase()) ?? ""); })
      .catch(() => { if (active) setIpa(""); });
    return () => { active = false; };
  }, [word]);
  return ipa;
}

export function PronunciationHint({ word }: { word: string }) {
  const ipa = useIpa(word);
  return ipa ? <span className="text-sm text-muted-foreground">/{ipa}/</span> : null;
}
