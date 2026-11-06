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
export function useTranslation(text: string, lang: Lang, fallback = "") {
  const cleanText = text.trim();
  const curated = fallback.trim();
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
  text: string; lang: Lang; fallback?: string; className?: string;
}) {
  const value = useTranslation(text, lang, fallback);
  return <span className={className}>{value}</span>;
}
