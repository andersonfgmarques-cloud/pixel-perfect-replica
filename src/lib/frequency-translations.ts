import type { Lang } from "./words";

export type FrequencyTranslation = {
  meaning: string;
  example: string;
};

export type FrequencyTranslationEntry = Partial<Record<Lang, FrequencyTranslation>>;

/**
 * Curated translations for the frequency dictionary.
 * Add entries only after checking the meaning, grammatical role and example context.
 * Keys are the Rank values from english-top-5000.csv.
 */
export const FREQUENCY_TRANSLATIONS: Record<number, FrequencyTranslationEntry> = {
  1: {
    "pt-BR": {
      meaning: "você; te; vocês — pronome usado para se dirigir à pessoa com quem se fala",
      example: "Posso ajudar você?",
    },
    es: {
      meaning: "tú; usted; ustedes — pronombre para dirigirse a la persona o personas con quienes se habla",
      example: "¿Puedo ayudarte?",
    },
    fr: {
      meaning: "tu; vous — pronom utilisé pour s’adresser à une ou plusieurs personnes",
      example: "Puis-je vous aider ?",
    },
    ru: {
      meaning: "ты; вы — местоимение для обращения к собеседнику или собеседникам",
      example: "Я могу вам помочь?",
    },
    ar: {
      meaning: "أنتَ؛ أنتِ؛ أنتم — ضمير لمخاطبة الشخص أو الأشخاص",
      example: "هل يمكنني مساعدتك؟",
    },
    hi: {
      meaning: "तुम; आप — जिससे बात की जा रही हो, उसके लिए सर्वनाम",
      example: "क्या मैं आपकी मदद कर सकता हूँ?",
    },
    tr: {
      meaning: "sen; siz — konuşulan kişiye veya kişilere hitap etmek için kullanılan zamir",
      example: "Size yardımcı olabilir miyim?",
    },
    id: {
      meaning: "kamu; Anda; kalian — kata ganti untuk orang yang diajak bicara",
      example: "Ada yang bisa saya bantu?",
    },
    vi: {
      meaning: "bạn; các bạn — đại từ dùng để gọi người đang giao tiếp với mình",
      example: "Tôi có thể giúp bạn không?",
    },
  },
};
