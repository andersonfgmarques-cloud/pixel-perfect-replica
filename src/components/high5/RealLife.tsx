import { useMemo, useState } from "react";
import { ArrowLeft, Volume2, Play, Pause, ChevronUp, ChevronDown, CheckCircle2, RotateCcw, Clapperboard, Captions } from "lucide-react";
import { LANG_NAMES, type Lang } from "@/lib/words";
import { useSpeak } from "@/lib/store";
import { useTranslation } from "@/lib/translation";

type Line = { speaker: string; en: string; ipa: string; translations: Partial<Record<Lang, string>> };
type Scene = {
  id: string; category: string; title: string; level: string; duration: string;
  emoji: string; setting: string; gradient: string; video?: string; lines: Line[];
  question: string; options: string[]; answer: number; explanation: string;
};

const SCENES: Scene[] = [
  {
    id: "coffee-shop", category: "Daily life", title: "Ordering a coffee", level: "A1", duration: "35 sec",
    emoji: "☕", setting: "A cosy coffee shop", gradient: "from-amber-950 via-orange-900 to-stone-950",
    lines: [
      { speaker: "BARISTA", en: "Good morning! What can I get you?", ipa: "/ɡʊd ˈmɔːnɪŋ | wɒt kən aɪ ɡet juː/", translations: { "pt-BR": "Bom dia! O que vai querer?", es: "¡Buenos días! ¿Qué le pongo?", fr: "Bonjour ! Que puis-je vous servir ?", it: "Buongiorno! Cosa posso servirle?" } },
      { speaker: "YOU", en: "A coffee with milk, please.", ipa: "/ə ˈkɒfi wɪð mɪlk pliːz/", translations: { "pt-BR": "Um café com leite, por favor.", es: "Un café con leche, por favor.", fr: "Un café au lait, s'il vous plaît.", it: "Un caffè con latte, per favore." } },
      { speaker: "BARISTA", en: "Sure. Anything else?", ipa: "/ʃɔː | ˈeniθɪŋ els/", translations: { "pt-BR": "Claro. Mais alguma coisa?", es: "Claro. ¿Algo más?", fr: "Bien sûr. Autre chose ?", it: "Certo. Altro?" } },
      { speaker: "YOU", en: "That's all, thanks.", ipa: "/ðæts ɔːl | θæŋks/", translations: { "pt-BR": "Só isso, obrigado.", es: "Eso es todo, gracias.", fr: "Ce sera tout, merci.", it: "Tutto qui, grazie." } }
    ],
    question: "What does the customer order?", options: ["A tea", "A latte", "A sandwich"], answer: 1,
    explanation: "“A latte” é um café preparado com leite."
  },
  {
    id: "directions", category: "Travel", title: "Asking for directions", level: "A1", duration: "40 sec",
    emoji: "🗺️", setting: "On a city street", gradient: "from-sky-950 via-blue-900 to-slate-950",
    lines: [
      { speaker: "YOU", en: "Excuse me, where is the train station?", ipa: "/ɪkˈskjuːz miː | weər ɪz ðə treɪn ˈsteɪʃən/", translations: { "pt-BR": "Com licença, onde fica a estação de trem?", es: "Disculpe, ¿dónde está la estación de tren?", fr: "Excusez-moi, où est la gare ?", it: "Mi scusi, dov'è la stazione?" } },
      { speaker: "LOCAL", en: "Go straight and turn left.", ipa: "/ɡəʊ streɪt ən tɜːn left/", translations: { "pt-BR": "Siga em frente e vire à esquerda.", es: "Siga recto y gire a la izquierda.", fr: "Allez tout droit et tournez à gauche.", it: "Vada dritto e giri a sinistra." } },
      { speaker: "YOU", en: "Is it far from here?", ipa: "/ɪz ɪt fɑː frəm hɪə/", translations: { "pt-BR": "É longe daqui?", es: "¿Está lejos de aquí?", fr: "Est-ce loin d'ici ?", it: "È lontano da qui?" } },
      { speaker: "LOCAL", en: "No, about five minutes on foot.", ipa: "/nəʊ | əˈbaʊt faɪv ˈmɪnɪts ɒn fʊt/", translations: { "pt-BR": "Não, cerca de cinco minutos a pé.", es: "No, unos cinco minutos a pie.", fr: "Non, environ cinq minutes à pied.", it: "No, circa cinque minuti a piedi." } }
    ],
    question: "How long does it take to get there?", options: ["Five minutes on foot", "Twenty minutes by bus", "One hour"], answer: 0,
    explanation: "“On foot” significa “a pé”."
  },
  {
    id: "work", category: "Work", title: "Meeting a colleague", level: "A2", duration: "30 sec",
    emoji: "💼", setting: "At the office", gradient: "from-indigo-950 via-violet-900 to-slate-950",
    lines: [
      { speaker: "COLLEAGUE", en: "Hi! Are you new here?", ipa: "/haɪ | ɑː juː njuː hɪə/", translations: { "pt-BR": "Oi! Você é novo por aqui?", es: "¡Hola! ¿Eres nuevo aquí?", fr: "Salut ! Tu es nouveau ici ?", it: "Ciao! Sei nuovo qui?" } },
      { speaker: "YOU", en: "Yes, it's my first day.", ipa: "/jes | ɪts maɪ fɜːst deɪ/", translations: { "pt-BR": "Sim, é meu primeiro dia.", es: "Sí, es mi primer día.", fr: "Oui, c'est mon premier jour.", it: "Sì, è il mio primo giorno." } },
      { speaker: "COLLEAGUE", en: "Welcome to the team!", ipa: "/ˈwelkəm tə ðə tiːm/", translations: { "pt-BR": "Bem-vindo à equipe!", es: "¡Bienvenido al equipo!", fr: "Bienvenue dans l'équipe !", it: "Benvenuto nel team!" } }
    ],
    question: "Is it the person's first day?", options: ["No, the second day", "Yes, the first day", "We don't know"], answer: 1,
    explanation: "“It's my first day” significa “É meu primeiro dia”."
  }
];

export default function RealLife({ lang, accent, back }: { lang: Lang; accent: "en-GB" | "en-US"; back: () => void }) {
  const speak = useSpeak(accent);
  const [index, setIndex] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(true);
  const [quiz, setQuiz] = useState(false);
  const [choice, setChoice] = useState<number | null>(null);
  const [completed, setCompleted] = useState<string[]>([]);
  const scene = SCENES[index];
  const line = scene.lines[lineIndex];
  const translatedQuestion = useTranslation(scene.question, lang);
  const translatedExplanation = useTranslation(scene.explanation, lang);
  const translation = line.translations[lang] || "";
  const translatedLine = useTranslation(line.en, lang, translation);
  const progress = useMemo(() => Math.round(((lineIndex + 1) / scene.lines.length) * 100), [lineIndex, scene.lines.length]);
  const moveScene = (direction: number) => {
    setIndex((current) => (current + direction + SCENES.length) % SCENES.length);
    setLineIndex(0); setQuiz(false); setChoice(null);
  };
  const finish = () => {
    setCompleted((old) => old.includes(scene.id) ? old : [...old, scene.id]);
    setQuiz(false); setChoice(null);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="flex items-center justify-between px-5 pb-3 pt-6">
        <button onClick={back} aria-label="Back" className="rounded-full bg-muted p-2"><ArrowLeft className="h-5 w-5" /></button>
        <div className="text-center"><p className="text-xs font-bold uppercase tracking-widest text-primary">HIGH5</p><h1 className="text-lg font-extrabold">Real Life</h1></div>
        <span className="text-xs text-muted-foreground">{index + 1}/{SCENES.length}</span>
      </div>

      <div className="relative mx-3 overflow-hidden rounded-[2rem] shadow-soft">
        <div className={`relative flex min-h-[66vh] flex-col justify-between bg-gradient-to-br ${scene.gradient} p-5 text-white`}>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
          <div className="relative flex items-center justify-between">
            <span className="rounded-full bg-black/30 px-3 py-1 text-xs font-bold">{scene.category} · {scene.level}</span>
            <span className="flex items-center gap-1 rounded-full bg-black/30 px-3 py-1 text-xs"><Clapperboard className="h-3 w-3" /> {scene.duration}</span>
          </div>

          <div className="relative py-8 text-center">
            <div className="mb-4 text-8xl drop-shadow-lg">{scene.emoji}</div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">{scene.setting}</p>
            <h2 className="mt-2 text-3xl font-extrabold">{scene.title}</h2>
            <p className="mt-3 text-xs text-white/55">Short scene · Everyday English</p>
          </div>

          <div className="relative space-y-3">
            {!quiz ? <>
              <div className="rounded-2xl bg-black/55 p-4 backdrop-blur">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-extrabold tracking-widest text-amber-200">{line.speaker}</span>
                  <button onClick={() => speak(line.en)} className="rounded-full bg-white/15 p-2" aria-label="Listen to this line"><Volume2 className="h-5 w-5" /></button>
                </div>
                <p className="text-xl font-bold leading-snug">{line.en}</p>
                <p className="mt-2 text-sm text-white/75">{line.ipa}</p>
                {showTranslation && <p className="mt-2 border-t border-white/15 pt-2 text-sm font-medium text-amber-100">{translatedLine}</p>}
              </div>
              <div className="flex items-center justify-between">
                <button onClick={() => setShowTranslation((v) => !v)} className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs font-semibold"><Captions className="h-4 w-4" /> {showTranslation ? "Hide translation" : "Show translation"}</button>
                <span className="text-xs text-white/70">{lineIndex + 1} / {scene.lines.length}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/20"><div className="h-full bg-amber-300 transition-all" style={{ width: progress + "%" }} /></div>
              <div className="flex gap-2">
                <button disabled={lineIndex === 0} onClick={() => setLineIndex((v) => v - 1)} className="flex-1 rounded-xl bg-white/10 py-3 text-sm font-bold disabled:opacity-30">Previous</button>
                <button onClick={() => lineIndex + 1 < scene.lines.length ? setLineIndex((v) => v + 1) : setQuiz(true)} className="flex-1 rounded-xl bg-amber-300 py-3 text-sm font-extrabold text-slate-950">{lineIndex + 1 === scene.lines.length ? "Take the quiz" : "Next line"}</button>
              </div>
              <button onClick={() => speak(line.en, 0.65)} className="w-full rounded-xl border border-white/20 py-2 text-xs font-semibold"><RotateCcw className="mr-1 inline h-3 w-3" /> Repeat slowly</button>
            </> : <div className="rounded-2xl bg-black/60 p-4 backdrop-blur">
              <p className="text-xs font-bold uppercase tracking-widest text-amber-200">Quick check</p>
              <p className="mt-2 text-lg font-extrabold">{translatedQuestion}</p>
              <div className="mt-4 space-y-2">{scene.options.map((option, i) => <button key={option} onClick={() => setChoice(i)} className={`w-full rounded-xl border p-3 text-left text-sm font-semibold ${choice === i ? "border-amber-300 bg-amber-300/20" : "border-white/20 bg-white/5"}`}>{option}</button>)}</div>
              {choice !== null && <div className="mt-3 rounded-xl bg-white/10 p-3 text-sm"><p className="font-bold">{choice === scene.answer ? "Correct! Great job." : "Not quite. Try to remember the dialogue."}</p><p className="mt-1 text-white/75">{translatedExplanation}</p></div>}
              <button disabled={choice === null} onClick={finish} className="mt-4 w-full rounded-xl bg-amber-300 py-3 font-extrabold text-slate-950 disabled:opacity-40">Finish scene</button>
            </div>}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-5 pt-4">
        <div><p className="text-sm font-bold">{scene.title}</p><p className="text-xs text-muted-foreground">{LANG_NAMES[lang]} · {completed.length} completed</p></div>
        <div className="flex gap-2">
          <button onClick={() => moveScene(-1)} aria-label="Previous scene" className="rounded-full bg-card p-3"><ChevronUp className="h-5 w-5" /></button>
          <button onClick={() => moveScene(1)} aria-label="Next scene" className="rounded-full bg-card p-3"><ChevronDown className="h-5 w-5" /></button>
          {completed.includes(scene.id) && <CheckCircle2 className="h-6 w-6 text-success" />}
        </div>
      </div>
      <p className="px-5 pt-2 text-xs text-muted-foreground">Pronunciation is shown in IPA. Audio uses the voice available on your device; availability varies by browser.</p>
    </div>
  );
}
