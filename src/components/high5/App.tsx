import { useEffect, useMemo, useState } from "react";
import {
  Volume2, Home, BookOpen, Gamepad2, BarChart3, Heart, Mic, Check, X, Flame, Star, ArrowLeft, Search, Plus, Bell, RotateCcw,
} from "lucide-react";
import { WORDS, CATEGORIES, LANGS, LANG_NAMES, LEVEL_ORDER, wordById, type Word, type Level, type Lang } from "@/lib/words";
import { FREQUENCY_TRANSLATIONS } from "@/lib/frequency-translations";
import { TranslationText, PronunciationHint, useTranslation } from "@/lib/translation";
import {
  useStore, setState, DAILY_LIMIT, dueWords, suggestNew, remainingToday, markLearned, recordResult, bumpStreak,
  toggleFav, isHard, useSpeak, shuffle, type State,
} from "@/lib/store";

type Mode = "choice" | "listen" | "translate" | "type" | "speak";
type View =
  | { name: "home" } | { name: "words" } | { name: "games" } | { name: "progress" }
  | { name: "lesson" } | { name: "practice"; mode: Mode | "mixed"; ids: string[]; title: string; review?: boolean }
  | { name: "memory" } | { name: "word"; id: string } | { name: "frequency-word"; item: FrequencyWord };

export default function High5App() {
  const s = useStore();
  const [view, setView] = useState<View>({ name: "home" });
  if (!s) return <div className="min-h-screen bg-background" />;
  if (!s.onboarded) return <Onboarding />;
  const go = (v: View) => { setView(v); window.scrollTo(0, 0); };
  const tab = ["home", "words", "games", "progress"].includes(view.name);
  return (
    <div className="mx-auto min-h-screen max-w-md bg-background pb-24">
      {view.name === "home" && <HomeView s={s} go={go} />}
      {view.name === "words" && <WordsView s={s} go={go} />}
      {view.name === "games" && <GamesView s={s} go={go} />}
      {view.name === "progress" && <ProgressView s={s} />}
      {view.name === "lesson" && <Lesson s={s} done={() => go({ name: "home" })} />}
      {view.name === "practice" && <Practice s={s} {...view} done={() => go({ name: view.review ? "home" : "games" })} />}
      {view.name === "memory" && <Memory s={s} done={() => go({ name: "games" })} />}
      {view.name === "word" && <WordDetail s={s} id={view.id} back={() => go({ name: "words" })} />}
      {view.name === "frequency-word" && <FrequencyWordDetail s={s} item={view.item} back={() => go({ name: "words" })} />}
      {tab && (
        <nav className="fixed inset-x-0 bottom-0 z-10 mx-auto flex max-w-md justify-around border-t bg-card py-2">
          {([["home", Home, "Home"], ["words", BookOpen, "Words"], ["games", Gamepad2, "Games"], ["progress", BarChart3, "Progress"]] as const).map(([n, I, l]) => (
            <button key={n} onClick={() => go({ name: n } as View)}
              className={`flex flex-col items-center gap-0.5 px-4 py-1 text-xs font-medium ${view.name === n ? "text-primary" : "text-muted-foreground"}`}>
              <I className="h-5 w-5" />{l}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}

/* ---------- shared ---------- */
const Btn = ({ v = "primary", className = "", ...p }: React.ButtonHTMLAttributes<HTMLButtonElement> & { v?: "primary" | "accent" | "ghost" }) => (
  <button {...p} className={`rounded-2xl px-5 py-3.5 font-display font-bold transition disabled:opacity-40 ${
    v === "primary" ? "btn-pop bg-primary text-primary-foreground" : v === "accent" ? "bg-sun text-accent-foreground shadow-soft" : "bg-muted text-foreground"} ${className}`} />
);
const Header = ({ title, back }: { title: string; back?: () => void }) => (
  <div className="flex items-center gap-3 px-5 pb-3 pt-6">
    {back && <button onClick={back} aria-label="Back" className="rounded-full bg-muted p-2"><ArrowLeft className="h-5 w-5" /></button>}
    <h1 className="text-2xl font-extrabold">{title}</h1>
  </div>
);
const Pic = ({ w, size = "text-7xl" }: { w: Word; size?: string }) => <span className={`${size} leading-none`} role="img" aria-label={w.word}>{w.image}</span>;
const SpeakBtn = ({ s, text, big }: { s: State; text: string; big?: boolean }) => {
  const speak = useSpeak(s.accent);
  return <button onClick={() => speak(text)} aria-label="Play pronunciation"
    className={`rounded-full bg-secondary text-secondary-foreground ${big ? "p-5" : "p-2.5"}`}><Volume2 className={big ? "h-8 w-8" : "h-5 w-5"} /></button>;
};

/* ---------- onboarding ---------- */
function Onboarding() {
  const [step, setStep] = useState(0);
  const [lang, setLang] = useState<Lang>("pt-BR");
  const [level, setLevel] = useState<Level>("Beginner");
  const [accent, setAccent] = useState<State["accent"]>("en-US");
  const opt = (on: boolean) => `w-full rounded-2xl border-2 p-4 text-left font-semibold ${on ? "border-primary bg-secondary" : "border-border bg-card"}`;
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 py-10">
      <div className="mb-8 text-center"><img src={`/pixel-perfect-replica/icon-512.png`} alt="" width={80} height={80} className="mx-auto mb-3 rounded-3xl" />
        <h1 className="text-3xl font-extrabold">High5 Vocabulary</h1>
        <p className="text-muted-foreground">10 new English words a day.</p></div>
      <div className="flex-1 space-y-3 animate-pop" key={step}>
        {step === 0 && <><h2 className="text-xl font-bold">Your native language</h2>
          {LANGS.map((l) => <button key={l} className={opt(lang === l)} onClick={() => setLang(l)}>{LANG_NAMES[l]}</button>)}</>}
        {step === 1 && <><h2 className="text-xl font-bold">Your English level</h2>
          {LEVEL_ORDER.map((l) => <button key={l} className={opt(level === l)} onClick={() => setLevel(l)}>{l}</button>)}</>}
        {step === 2 && <><h2 className="text-xl font-bold">Pronunciation</h2>
          <button className={opt(accent === "en-US")} onClick={() => setAccent("en-US")}>🇺🇸 American English</button>
          <button className={opt(accent === "en-GB")} onClick={() => setAccent("en-GB")}>🇬🇧 British English</button></>}
      </div>
      <Btn className="mt-6 w-full" onClick={() => step < 2 ? setStep(step + 1) : setState((s) => ({ ...s, lang, level, accent, onboarded: true }))}>
        {step < 2 ? "Continue" : "Start learning"}</Btn>
    </div>
  );
}

/* ---------- home ---------- */
function HomeView({ s, go }: { s: State; go: (v: View) => void }) {
  const learned = s.daily.ids.length;
  const due = dueWords(s);
  const total = Object.keys(s.cards).length;
  useEffect(() => {
    if (s.notify && "Notification" in window && Notification.permission === "granted") {
      const k = "high5-notified"; if (localStorage.getItem(k) === s.daily.date) return;
      localStorage.setItem(k, s.daily.date);
      const w = WORDS[Math.floor(Math.random() * WORDS.length)];
      new Notification(`Word of the day: ${w.word} ${w.image}`, { body: w.example, icon: `/pixel-perfect-replica/icon-512.png` });
    }
  }, [s.notify, s.daily.date]);
  return (
    <div className="space-y-5 px-5 pt-6">
      <div className="flex items-center justify-between">
        <div><p className="text-sm text-muted-foreground">Welcome back</p><h1 className="text-2xl font-extrabold">Let's learn!</h1></div>
        <div className="flex gap-2 font-display font-bold">
          <span className="flex items-center gap-1 rounded-full bg-card px-3 py-1.5 shadow-soft"><Flame className="h-4 w-4 text-accent" />{s.streak.count}</span>
          <span className="flex items-center gap-1 rounded-full bg-card px-3 py-1.5 shadow-soft"><Star className="h-4 w-4 text-warning" />{s.xp}</span>
        </div>
      </div>
      <div className="rounded-3xl bg-hero p-6 text-primary-foreground shadow-soft">
        <p className="text-sm opacity-80">Today's words</p>
        <p className="font-display text-5xl font-extrabold">{learned}<span className="text-2xl opacity-70">/{DAILY_LIMIT}</span></p>
        <div className="my-4 h-3 overflow-hidden rounded-full bg-primary-foreground/20">
          <div className="h-full rounded-full bg-warning transition-all" style={{ width: `${(learned / DAILY_LIMIT) * 100}%` }} />
        </div>
        <Btn v="accent" className="w-full text-lg" disabled={remainingToday(s) === 0} onClick={() => go({ name: "lesson" })}>
          {remainingToday(s) === 0 ? "Done for today 🎉" : "Learn Today's Words"}</Btn>
      </div>
      <button onClick={() => due.length && go({ name: "practice", mode: "mixed", ids: due.map((w) => w.id).slice(0, 15), title: "Review", review: true })}
        className="flex w-full items-center gap-4 rounded-3xl bg-card p-5 text-left shadow-soft">
        <div className="rounded-2xl bg-secondary p-3"><RotateCcw className="h-6 w-6 text-primary" /></div>
        <div className="flex-1"><p className="font-display font-bold">Smart Review</p>
          <p className="text-sm text-muted-foreground">{due.length ? `${due.length} words ready to refresh` : "Nothing to review — great memory!"}</p></div>
      </button>
      <div className="grid grid-cols-2 gap-3">
        <Stat label="Words learned" value={total} /><Stat label="Level" value={s.level} />
      </div>
      <button onClick={() => go({ name: "games" })} className="w-full rounded-3xl bg-card p-5 text-left shadow-soft">
        <p className="font-display font-bold">🎮 Games & activities</p><p className="text-sm text-muted-foreground">Quiz, listening, typing, memory…</p>
      </button>
    </div>
  );
}
const Stat = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="rounded-3xl bg-card p-4 shadow-soft"><p className="text-xs text-muted-foreground">{label}</p><p className="font-display text-2xl font-extrabold">{value}</p></div>
);

/* ---------- lesson ---------- */
function Lesson({ s, done }: { s: State; done: () => void }) {
  const [picked, setPicked] = useState<string[] | null>(null);
  const [i, setI] = useState(0);
  const [phase, setPhase] = useState<"see" | "type" | "speak">("see");
  const [quiz, setQuiz] = useState(false);
  const suggestions = useMemo(() => suggestNew(s, 30), []); // eslint-disable-line react-hooks/exhaustive-deps
  const [sel, setSel] = useState<string[]>(() => suggestions.slice(0, remainingToday(s)).map((w) => w.id));
  const speak = useSpeak(s.accent);

  if (!picked) {
    const max = remainingToday(s);
    return (
      <div><Header title="Choose your words" back={done} />
        <p className="px-5 pb-3 text-sm text-muted-foreground">Pick up to {max} new words. Tap to toggle.</p>
        <div className="grid grid-cols-3 gap-2 px-5">
          {suggestions.map((w) => {
            const on = sel.includes(w.id);
            return <button key={w.id} onClick={() => setSel(on ? sel.filter((x) => x !== w.id) : sel.length < max ? [...sel, w.id] : sel)}
              className={`rounded-2xl border-2 p-3 text-center ${on ? "border-primary bg-secondary" : "border-transparent bg-card"}`}>
              <Pic w={w} size="text-4xl" /><p className="mt-1 text-sm font-semibold">{w.word}</p></button>;
          })}
        </div>
        <div className="sticky bottom-0 bg-background p-5"><Btn className="w-full" disabled={!sel.length} onClick={() => { setPicked(sel); speak(wordById(sel[0])!.word); }}>Start with {sel.length} words</Btn></div>
      </div>
    );
  }
  if (quiz) return <Practice s={s} mode="mixed" ids={picked} title="Reinforcement quiz" done={done} onFinish={() => { markLearned(picked); bumpStreak(); }} />;

  const w = wordById(picked[i])!;
  const next = () => {
    if (phase === "see") return setPhase("type");
    if (phase === "type") return setPhase("speak");
    setPhase("see");
    if (i + 1 < picked.length) { setI(i + 1); speak(wordById(picked[i + 1])!.word); } else setQuiz(true);
  };
  return (
    <div className="flex min-h-screen flex-col">
      <Header title={`Word ${i + 1} of ${picked.length}`} back={done} />
      <div className="mx-5 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full bg-primary transition-all" style={{ width: `${((i + 1) / picked.length) * 100}%` }} /></div>
      <div key={w.id + phase} className="flex flex-1 flex-col items-center gap-4 px-5 py-8 text-center animate-pop">
        <div className="rounded-[2rem] bg-card p-8 shadow-soft"><Pic w={w} size="text-9xl" /></div>
        {phase === "see" && <>
          <div className="flex flex-col items-center gap-1"><div className="flex items-center gap-3"><h2 className="text-4xl font-extrabold">{w.word}</h2><SpeakBtn s={s} text={w.word} /></div><PronunciationHint word={w.word} /></div>
          <p className="text-sm text-muted-foreground">{w.pos} · {w.level}</p>
          <p className="text-xl font-semibold text-primary"><TranslationText text={w.word} lang={s.lang} fallback={w.tr[s.lang]} /></p>
          <button onClick={() => speak(w.example)} className="rounded-2xl bg-muted px-4 py-3 italic">“{w.example}” <Volume2 className="inline h-4 w-4" /></button>
        </>}
        {phase === "type" && <TypeBox w={w} s={s} onDone={() => next()} />}
        {phase === "speak" && <SpeakBox w={w} s={s} onDone={() => next()} />}
      </div>
      {phase === "see" && <div className="p-5"><Btn className="w-full" onClick={next}>Got it — write it</Btn></div>}
    </div>
  );
}

function TypeBox({ w, s, onDone }: { w: Word; s: State; onDone: (ok: boolean) => void }) {
  const [v, setV] = useState(""); const [res, setRes] = useState<null | boolean>(null);
  const check = () => { const ok = v.trim().toLowerCase() === w.word.toLowerCase(); setRes(ok); setTimeout(() => onDone(ok), ok ? 700 : 1600); };
  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-center gap-2"><p className="font-semibold">Write the word</p><SpeakBtn s={s} text={w.word} /></div><PronunciationHint word={w.word} />
      <p className="text-sm text-muted-foreground"><TranslationText text={w.word} lang={s.lang} fallback={w.tr[s.lang]} /> · {w.word.length} letters</p><PronunciationHint word={w.word} />
      <input autoFocus value={v} onChange={(e) => setV(e.target.value)} onKeyDown={(e) => e.key === "Enter" && res === null && check()}
        autoCapitalize="none" autoCorrect="off" spellCheck={false}
        className={`w-full rounded-2xl border-2 bg-card p-4 text-center font-display text-2xl outline-none ${res === null ? "border-border focus:border-primary" : res ? "border-success" : "border-destructive"}`} />
      {res === false && <p className="font-semibold text-destructive">Correct: {w.word}</p>}
      <Btn className="w-full" disabled={!v || res !== null} onClick={check}>Check</Btn>
    </div>
  );
}

function SpeakBox({ w, s, onDone }: { w: Word; s: State; onDone: (ok: boolean) => void }) {
  const [msg, setMsg] = useState(""); const [ok, setOk] = useState<null | boolean>(null);
  const SR = typeof window !== "undefined" ? ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition) : null;
  const listen = () => {
    if (!SR) return setMsg("Speech recognition isn't supported on this browser.");
    const r = new SR(); r.lang = s.accent; r.maxAlternatives = 5; setMsg("Listening…");
    r.onresult = (e: any) => {
      const alts = Array.from(e.results[0]).map((a: any) => a.transcript.toLowerCase().trim());
      const good = alts.some((a) => a.includes(w.word.toLowerCase()));
      setOk(good); setMsg(good ? "Great pronunciation! 🎉" : `We heard “${alts[0]}”. Try again!`);
      if (good) setTimeout(() => onDone(true), 900);
    };
    r.onerror = () => setMsg("Couldn't hear you. Try again."); r.start();
  };
  return (
    <div className="w-full space-y-3">
      <div className="flex flex-col items-center gap-1"><div className="flex items-center justify-center gap-2"><h2 className="text-3xl font-extrabold">{w.word}</h2><SpeakBtn s={s} text={w.word} /></div><PronunciationHint word={w.word} /></div>
      <p className="text-muted-foreground">Say it out loud (optional)</p>
      <button onClick={listen} aria-label="Speak" className="mx-auto block rounded-full bg-sun p-6 text-accent-foreground shadow-soft"><Mic className="h-10 w-10" /></button>
      <p className={`min-h-6 font-semibold ${ok ? "text-success" : ok === false ? "text-destructive" : ""}`}>{msg}</p>
      <Btn v="ghost" className="w-full" onClick={() => onDone(false)}>Skip</Btn>
    </div>
  );
}

/* ---------- practice engine ---------- */
function Practice({ s, mode, ids, title, done, onFinish }: { s: State; mode: Mode | "mixed"; ids: string[]; title: string; done: () => void; onFinish?: () => void; review?: boolean }) {
  const qs = useMemo(() => shuffle(ids).map((id) => ({
    w: wordById(id)!, m: mode === "mixed" ? shuffle(["choice", "listen", "translate", "type"] as Mode[])[0] : mode,
  })), []); // eslint-disable-line react-hooks/exhaustive-deps
  const [i, setI] = useState(0);
  const [log, setLog] = useState<{ id: string; ok: boolean }[]>([]);
  const answer = (ok: boolean) => {
    recordResult(qs[i].w.id, ok);
    const nl = [...log, { id: qs[i].w.id, ok }]; setLog(nl);
    setTimeout(() => { if (i + 1 >= qs.length) { onFinish?.(); bumpStreak(); } setI(i + 1); }, 50);
  };
  if (!qs.length) return <div><Header title={title} back={done} /><p className="px-5 text-muted-foreground">Learn some words first to unlock this activity.</p></div>;
  if (i >= qs.length) return <Results s={s} log={log} done={done} />;
  const q = qs[i];
  return (
    <div className="flex min-h-screen flex-col">
      <Header title={title} back={done} />
      <div className="mx-5 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full bg-primary transition-all" style={{ width: `${(i / qs.length) * 100}%` }} /></div>
      <div key={i} className="flex flex-1 flex-col items-center gap-5 px-5 py-8 text-center animate-pop">
        {q.m === "type" ? <><div className="rounded-[2rem] bg-card p-6 shadow-soft"><Pic w={q.w} /></div><TypeBox w={q.w} s={s} onDone={answer} /></>
          : q.m === "speak" ? <><div className="rounded-[2rem] bg-card p-6 shadow-soft"><Pic w={q.w} /></div><SpeakBox w={q.w} s={s} onDone={answer} /></>
          : <Choice s={s} w={q.w} m={q.m} onDone={answer} />}
      </div>
    </div>
  );
}

function Choice({ s, w, m, onDone }: { s: State; w: Word; m: Mode; onDone: (ok: boolean) => void }) {
  const speak = useSpeak(s.accent);
  const opts = useMemo(() => shuffle([w, ...shuffle(WORDS.filter((x) => x.id !== w.id)).slice(0, 3)]), [w]);
  const [pick, setPick] = useState<string | null>(null);
  useEffect(() => { if (m === "listen") setTimeout(() => speak(w.word), 300); }, [w, m, speak]);
  const choose = (o: Word) => { if (pick) return; setPick(o.id); speak(w.word); setTimeout(() => onDone(o.id === w.id), 1100); };
  return (
    <>
      {m === "choice" && <><p className="font-semibold text-muted-foreground">What is this?</p><div className="rounded-[2rem] bg-card p-8 shadow-soft"><Pic w={w} size="text-8xl" /></div><div className="flex items-center gap-2"><SpeakBtn s={s} text={w.word} /><PronunciationHint word={w.word} /></div><p className="text-sm text-primary"><TranslationText text={w.word} lang={s.lang} fallback={w.tr[s.lang]} /></p></>}
      {m === "listen" && <><p className="font-semibold text-muted-foreground">Listen and choose</p><SpeakBtn s={s} text={w.word} big /><PronunciationHint word={w.word} /><p className="text-sm text-primary"><TranslationText text={w.word} lang={s.lang} fallback={w.tr[s.lang]} /></p></>}
      {m === "translate" && <><p className="font-semibold text-muted-foreground">Which word means…</p><h2 className="text-3xl font-extrabold text-primary"><TranslationText text={w.word} lang={s.lang} fallback={w.tr[s.lang]} /></h2></>}
      <div className={`grid w-full gap-3 ${m === "listen" ? "grid-cols-2" : "grid-cols-1"}`}>
        {opts.map((o) => {
          const st = !pick ? "border-border bg-card" : o.id === w.id ? "border-success bg-success/15" : o.id === pick ? "border-destructive bg-destructive/10" : "border-border bg-card opacity-50";
          return <button key={o.id} onClick={() => choose(o)} className={`flex items-center justify-center gap-3 rounded-2xl border-2 p-4 font-display text-lg font-bold ${st}`}>
            {m === "listen" && <Pic w={o} size="text-4xl" />}{m !== "listen" && o.word}{m === "listen" && <span className="sr-only">{o.word}</span>}
          </button>;
        })}
      </div>
    </>
  );
}

function Results({ s, log, done }: { s: State; log: { id: string; ok: boolean }[]; done: () => void }) {
  const right = log.filter((l) => l.ok).length; const pct = Math.round((right / log.length) * 100);
  return (
    <div className="px-5 py-10 text-center animate-pop">
      <p className="text-6xl">{pct >= 80 ? "🏆" : pct >= 50 ? "👏" : "💪"}</p>
      <h1 className="mt-3 text-3xl font-extrabold">Lesson complete!</h1>
      <div className="my-6 grid grid-cols-3 gap-3">
        <Stat label="Correct" value={<span className="text-success">{right}</span>} />
        <Stat label="Mistakes" value={<span className="text-destructive">{log.length - right}</span>} />
        <Stat label="Score" value={`${pct}%`} />
      </div>
      <div className="space-y-2 text-left">
        {log.map((l, k) => { const w = wordById(l.id)!; return (
          <div key={k} className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-soft"><Pic w={w} size="text-2xl" />
            <span className="flex-1 font-semibold">{w.word}</span><span className="text-sm text-muted-foreground"><TranslationText text={w.word} lang={s.lang} fallback={w.tr[s.lang]} /></span>
            {l.ok ? <Check className="h-5 w-5 text-success" /> : <X className="h-5 w-5 text-destructive" />}</div>); })}
      </div>
      <Btn className="mt-6 w-full" onClick={done}>Continue</Btn>
    </div>
  );
}

/* ---------- memory game ---------- */
function Memory({ s, done }: { s: State; done: () => void }) {
  const pool = Object.keys(s.cards).length >= 6 ? WORDS.filter((w) => s.cards[w.id]) : WORDS;
  const [cards] = useState(() => shuffle(shuffle(pool).slice(0, 6).flatMap((w) => [{ k: w.id + "i", id: w.id, t: w.image }, { k: w.id + "w", id: w.id, t: w.word }])));
  const [open, setOpen] = useState<number[]>([]); const [found, setFound] = useState<string[]>([]); const [moves, setMoves] = useState(0);
  const speak = useSpeak(s.accent);
  const flip = (n: number) => {
    if (open.length === 2 || open.includes(n) || found.includes(cards[n].id)) return;
    const o = [...open, n]; setOpen(o);
    if (o.length === 2) { setMoves(moves + 1);
      if (cards[o[0]].id === cards[o[1]].id) { setFound([...found, cards[n].id]); speak(wordById(cards[n].id)!.word); setOpen([]); }
      else setTimeout(() => setOpen([]), 800); }
  };
  const win = found.length === 6;
  return (
    <div><Header title="Memory match" back={done} />
      <p className="px-5 pb-3 text-sm text-muted-foreground">Match each picture with its word · {moves} moves</p>
      <div className="grid grid-cols-3 gap-3 px-5">
        {cards.map((c, n) => { const show = open.includes(n) || found.includes(c.id); return (
          <button key={c.k} onClick={() => flip(n)} className={`flex aspect-square items-center justify-center rounded-2xl p-2 font-display font-bold transition ${show ? found.includes(c.id) ? "bg-success/20" : "bg-card shadow-soft" : "bg-hero text-primary-foreground"}`}>
            {show ? <span className={c.t.length <= 4 ? "text-4xl" : "text-base"}>{c.t}</span> : "?"}</button>); })}
      </div>
      {found.length > 0 && <div className="space-y-2 px-5 pt-4">
        <p className="text-sm font-semibold text-muted-foreground">Matched words · {LANG_NAMES[s.lang]}</p>
        {found.map((id) => {
          const word = wordById(id)!;
          return <div key={id} className="flex items-center justify-between rounded-xl bg-card p-3 text-sm">
            <span className="font-semibold">{word.word}</span>
            <span className="text-muted-foreground"><TranslationText text={word.word} lang={s.lang} fallback={word.tr[s.lang]} /></span>
          </div>;
        })}
      </div>}
      {win && <div className="p-5 text-center animate-pop"><p className="text-2xl font-extrabold">🎉 Solved in {moves} moves!</p><Btn className="mt-3 w-full" onClick={done}>Back to games</Btn></div>}
    </div>
  );
}

/* ---------- games ---------- */
function GamesView({ s, go }: { s: State; go: (v: View) => void }) {
  const learned = Object.keys(s.cards);
  const ids = (learned.length >= 4 ? shuffle(learned) : shuffle(WORDS.map((w) => w.id))).slice(0, 10);
  const games: [string, string, string, () => void][] = [
    ["❓", "Vocabulary Quiz", "Picture → word", () => go({ name: "practice", mode: "choice", ids, title: "Vocabulary Quiz" })],
    ["🎧", "Listening Practice", "Hear it, pick it", () => go({ name: "practice", mode: "listen", ids, title: "Listening" })],
    ["⌨️", "Typing Practice", "Spell it right", () => go({ name: "practice", mode: "type", ids, title: "Typing" })],
    ["🌍", "Meaning Match", "Translation → word", () => go({ name: "practice", mode: "translate", ids, title: "Meaning Match" })],
    ["🎤", "Pronunciation", "Speak and get feedback", () => go({ name: "practice", mode: "speak", ids, title: "Pronunciation" })],
    ["🧠", "Memory Match", "Pairs of pictures & words", () => go({ name: "memory" })],
    ["🔀", "Mixed Challenge", "A bit of everything", () => go({ name: "practice", mode: "mixed", ids, title: "Mixed Challenge" })],
  ];
  return (
    <div><Header title="Games & activities" />
      {learned.length < 4 && <p className="px-5 pb-3 text-sm text-muted-foreground">Tip: learn words first — games will then use your own words.</p>}
      <div className="grid grid-cols-2 gap-3 px-5">
        {games.map(([i, t, d, f]) => <button key={t} onClick={f} className="rounded-3xl bg-card p-4 text-left shadow-soft transition active:scale-95">
          <p className="text-4xl">{i}</p><p className="mt-2 font-display font-bold">{t}</p><p className="text-xs text-muted-foreground">{d}</p></button>)}
      </div>
    </div>
  );
}

/* ---------- words / dictionary ---------- */
type FrequencyWord = {
  r: number; w: string; ipa: string; pos: string; meaning: string;
  example: string; lemma: string; count: number; forms: string; tags: string;
};

function WordsView({ s, go }: { s: State; go: (v: View) => void }) {
  const [q, setQ] = useState(""); const [cat, setCat] = useState("all"); const [lvl, setLvl] = useState("all");
  const [filter, setFilter] = useState<"all" | "learned" | "fav" | "hard" | string>("all");
  const [frequency, setFrequency] = useState<FrequencyWord[]>([]);
  const [frequencyStatus, setFrequencyStatus] = useState<"loading" | "ready" | "error">("loading");
  const [showAllFrequency, setShowAllFrequency] = useState(false);
  useEffect(() => {
    let active = true;
    fetch("/pixel-perfect-replica/data/english-top-5000.json")
      .then((response) => { if (!response.ok) throw new Error("Could not load vocabulary"); return response.json(); })
      .then((data: { items?: FrequencyWord[] }) => {
        if (!active) return;
        setFrequency(Array.isArray(data.items) ? data.items : []);
        setFrequencyStatus("ready");
      })
      .catch(() => { if (active) setFrequencyStatus("error"); });
    return () => { active = false; };
  }, []);
  const list = s.lists.find((l) => l.name === filter);
  const res = WORDS.filter((w) => (cat === "all" || w.category === cat) && (lvl === "all" || w.level === lvl)
    && (!q || w.word.includes(q.toLowerCase()) || w.tr[s.lang].toLowerCase().includes(q.toLowerCase()))
    && (filter === "all" || (filter === "learned" && s.cards[w.id]) || (filter === "fav" && s.favorites.includes(w.id))
      || (filter === "hard" && isHard(s.cards[w.id])) || (list && list.ids.includes(w.id))));
  const frequencyResults = useMemo(() => {
    const term = q.trim().toLowerCase();
    return frequency.filter((item) => !term || item.w.toLowerCase().includes(term)
      || item.meaning.toLowerCase().includes(term) || item.lemma.toLowerCase().includes(term));
  }, [frequency, q]);
  const visibleFrequency = showAllFrequency || q.trim() ? frequencyResults.slice(0, 100) : frequencyResults.slice(0, 30);
  const chip = (on: boolean) => `shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold ${on ? "bg-primary text-primary-foreground" : "bg-card"}`;
  const newList = () => { const n = prompt("List name"); if (n && !s.lists.some((l) => l.name === n)) setState((x) => ({ ...x, lists: [...x.lists, { name: n, ids: [] }] })); };
  return (
    <div><Header title="My dictionary" />
      <div className="space-y-3 px-5">
        <div className="flex items-center gap-2 rounded-2xl bg-card px-4 shadow-soft"><Search className="h-4 w-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search in English or your language" className="w-full bg-transparent py-3 outline-none" /></div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {[[ "all", "All" ], [ "learned", "Learned" ], [ "fav", "♥ Favorites" ], [ "hard", "Difficult" ], ...s.lists.map((l) => [l.name, `📂 ${l.name}`])].map(([k, l]) =>
            <button key={k} className={chip(filter === k)} onClick={() => setFilter(k)}>{l}</button>)}
          <button className={chip(false)} onClick={newList} aria-label="New list"><Plus className="h-4 w-4" /></button>
        </div>
        <div className="flex gap-2">
          <select value={cat} onChange={(e) => setCat(e.target.value)} className="flex-1 rounded-xl bg-card p-2 text-sm">
            <option value="all">All categories</option>{CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}</select>
          <select value={lvl} onChange={(e) => setLvl(e.target.value)} className="flex-1 rounded-xl bg-card p-2 text-sm">
            <option value="all">All levels</option>{LEVEL_ORDER.map((l) => <option key={l}>{l}</option>)}</select>
        </div>
        <p className="text-xs text-muted-foreground">{res.length} words in your study list</p>
        <div className="space-y-2">
          {res.map((w) => <button key={w.id} onClick={() => go({ name: "word", id: w.id })} className="flex w-full items-center gap-3 rounded-2xl bg-card p-3 text-left shadow-soft">
            <Pic w={w} size="text-3xl" /><div className="flex-1"><p className="font-semibold">{w.word}</p><p className="text-sm text-muted-foreground"><TranslationText text={w.word} lang={s.lang} fallback={w.tr[s.lang]} /></p></div>
            {s.cards[w.id] && <Check className="h-4 w-4 text-success" />}{s.favorites.includes(w.id) && <Heart className="h-4 w-4 fill-accent text-accent" />}</button>)}
        </div>
        <div className="pt-2">
          {frequencyStatus === "loading" && <p className="rounded-2xl bg-card p-4 text-sm text-muted-foreground">Loading frequency vocabulary…</p>}
          {frequencyStatus === "error" && <p className="rounded-2xl bg-card p-4 text-sm text-destructive">Could not load the frequency list. Please refresh the app.</p>}
          {frequencyStatus === "ready" && <>
            <div className="space-y-2">
              {visibleFrequency.map((item) => {
                const kind = item.pos.toLowerCase();
                const icon = kind.includes("pronoun") ? "👤" : kind.includes("verb") ? "⚡"
                  : kind.includes("noun") ? "📘" : kind.includes("adjective") ? "🎨"
                  : kind.includes("adverb") ? "💬" : kind.includes("preposition") ? "📍"
                  : kind.includes("article") || kind.includes("determiner") ? "🔤" : "📖";
                return <button key={item.r} onClick={() => go({ name: "frequency-word", item })}
                  className="flex w-full items-center gap-3 rounded-3xl bg-card p-4 text-left shadow-soft transition active:scale-[0.99]">
                  <span className="text-3xl leading-none" role="img" aria-label={item.pos}>{icon}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">{item.w}</span>
                    <span className="block truncate text-sm text-muted-foreground"><TranslationText text={item.w} lang={s.lang} fallback={(FREQUENCY_TRANSLATIONS[item.r]?.[s.lang]?.meaning ?? WORDS.find((word) => word.word.toLowerCase() === item.w.toLowerCase())?.tr[s.lang] ?? "").split(" — ")[0]} /></span>
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">#{item.r}</span>
                </button>;
              })}
            </div>
            {!q.trim() && !showAllFrequency && frequencyResults.length > 30 && <button onClick={() => setShowAllFrequency(true)} className="mt-3 w-full rounded-2xl bg-secondary px-4 py-3 text-sm font-bold">Show more frequency words</button>}
          </>}
        </div>
      </div>
    </div>
  );
}

function FrequencyWordDetail({ s, item, back }: { s: State; item: FrequencyWord; back: () => void }) {
  const fav = s.favorites.includes("frequency-" + item.r);
  const kind = item.pos.toLowerCase();
  const icon = kind.includes("pronoun") ? "👤" : kind.includes("verb") ? "⚡" : kind.includes("noun") ? "📘" : kind.includes("adjective") ? "🎨" : kind.includes("adverb") ? "💬" : kind.includes("preposition") ? "📍" : kind.includes("article") || kind.includes("determiner") ? "🔤" : "📖";
  const knownWord = WORDS.find((word) => word.word.toLowerCase() === item.w.toLowerCase());
  const translations = FREQUENCY_TRANSLATIONS[item.r] ?? {};
  const example = item.w.toLowerCase() === "you" ? "Can I help you?" : item.example;
  const exampleTranslation = useTranslation(example, s.lang, translations[s.lang]?.example ?? "");
  const selectedTranslation = useTranslation(item.w, s.lang, translations[s.lang]?.meaning ?? knownWord?.tr[s.lang] ?? "");
  const speak = useSpeak(s.accent);
  return (<div><Header title={item.w} back={back} /><div className="space-y-4 px-5 text-center">
    <div className="rounded-[2rem] bg-card p-8 shadow-soft"><div className="flex min-h-32 items-center justify-center"><span className="text-9xl leading-none" role="img" aria-label={item.pos}>{icon}</span></div></div>
    <div className="flex justify-center gap-3"><SpeakBtn s={s} text={item.w} /><button onClick={() => toggleFav("frequency-" + item.r)} aria-label="Favorite" className="rounded-full bg-secondary p-2.5"><Heart className={"h-5 w-5 " + (fav ? "fill-accent text-accent" : "")} /></button></div>
    <p className="text-sm text-muted-foreground">{item.pos}{item.ipa ? " · " + item.ipa : ""}</p>
    {example && <div className="w-full rounded-2xl bg-muted px-4 py-3"><button onClick={() => speak(example)} className="italic">“{example}” <Volume2 className="inline h-4 w-4" /></button>{<p className="mt-1 text-sm not-italic text-muted-foreground">{exampleTranslation}</p>}</div>}
    <div className="grid grid-cols-2 gap-2 text-left">
      <div className="col-span-2 rounded-xl bg-secondary p-3">
        <p className="text-xs text-muted-foreground">{LANG_NAMES[s.lang]} · seu idioma</p>
        <p className="font-semibold">{selectedTranslation}</p>
      </div>
      {(["pt-BR", "es", "fr", "it"] as const).filter((language) => language !== s.lang).map((language) => {
        const translation = translations[language]?.meaning ?? knownWord?.tr[language] ?? "";
        return <div key={language} className="rounded-xl bg-card p-3">
          <p className="text-xs text-muted-foreground">{LANG_NAMES[language]}</p>
          <p className="font-semibold"><TranslationText text={item.w} lang={language} fallback={translation} /></p>
        </div>;
      })}
    </div>
  </div></div>);
}
function WordDetail({ s, id, back }: { s: State; id: string; back: () => void }) {
  const w = wordById(id)!; const c = s.cards[id]; const speak = useSpeak(s.accent); const fav = s.favorites.includes(id);
  const cat = CATEGORIES.find((x) => x.id === w.category)!;
  return (
    <div><Header title={w.word} back={back} />
      <div className="space-y-4 px-5 text-center">
        <div className="rounded-[2rem] bg-card p-8 shadow-soft"><Pic w={w} size="text-9xl" /></div>
        <div className="flex flex-col items-center gap-2"><div className="flex justify-center gap-3"><SpeakBtn s={s} text={w.word} />
          <button onClick={() => toggleFav(id)} aria-label="Favorite" className="rounded-full bg-secondary p-2.5"><Heart className={`h-5 w-5 ${fav ? "fill-accent text-accent" : ""}`} /></button></div><PronunciationHint word={w.word} /></div>
        <p className="text-sm text-muted-foreground">{w.pos} · {w.level} · {cat.icon} {cat.name}</p>
        <div className="w-full rounded-2xl bg-muted px-4 py-3"><button onClick={() => speak(w.example)} className="italic">“{w.example}” <Volume2 className="inline h-4 w-4" /></button><p className="mt-1 text-sm text-muted-foreground"><TranslationText text={w.example} lang={s.lang} /></p></div>
        <div className="grid grid-cols-2 gap-2 text-left">
          {([...new Set<Lang>([s.lang, "pt-BR", "es", "fr", "it"])]).map((language) => {
            const translation = w.tr[language]?.trim() || "";
            return <div key={language} className={`rounded-xl p-3 ${language === s.lang ? "bg-secondary" : "bg-card"}`}>
              <p className="text-xs text-muted-foreground">{LANG_NAMES[language]}</p>
              <p className="font-semibold"><TranslationText text={w.word} lang={language} fallback={translation} /></p>
            </div>;
          })}
        </div>
        {c && <p className="text-sm text-muted-foreground">Next review: {new Date(c.due).toLocaleDateString()} · ✓{c.correct} ✗{c.wrong}</p>}
        {s.lists.length > 0 && <div className="flex flex-wrap justify-center gap-2">{s.lists.map((l) => { const on = l.ids.includes(id); return (
          <button key={l.name} onClick={() => setState((x) => ({ ...x, lists: x.lists.map((y) => y.name === l.name ? { ...y, ids: on ? y.ids.filter((z) => z !== id) : [...y.ids, id] } : y) }))}
            className={`rounded-full px-3 py-1.5 text-sm font-semibold ${on ? "bg-primary text-primary-foreground" : "bg-muted"}`}>{on ? "✓" : "+"} {l.name}</button>); })}</div>}
      </div>
    </div>
  );
}

/* ---------- progress & settings ---------- */
function ProgressView({ s }: { s: State }) {
  const learned = WORDS.filter((w) => s.cards[w.id]).sort((a, b) => s.cards[b.id].learnedAt - s.cards[a.id].learnedAt);
  const mastered = learned.filter((w) => s.cards[w.id].box >= 3).length;
  const hard = learned.filter((w) => isHard(s.cards[w.id]));
  const enableNotify = async () => {
    if (!("Notification" in window)) return alert("Notifications aren't supported on this device.");
    const p = await Notification.requestPermission(); setState((x) => ({ ...x, notify: p === "granted" }));
  };
  const sel = "w-full rounded-xl bg-card p-3";
  return (
    <div><Header title="Progress" />
      <div className="space-y-4 px-5">
        <div className="grid grid-cols-2 gap-3">
          <Stat label="Words learned" value={learned.length} /><Stat label="Mastered" value={mastered} />
          <Stat label="Day streak" value={`🔥 ${s.streak.count}`} /><Stat label="XP" value={`⭐ ${s.xp}`} />
        </div>
        <div className="rounded-3xl bg-card p-4 shadow-soft"><p className="mb-2 font-display font-bold">By category</p>
          {CATEGORIES.map((c) => { const all = WORDS.filter((w) => w.category === c.id); const n = all.filter((w) => s.cards[w.id]).length; return (
            <div key={c.id} className="flex items-center gap-2 py-1 text-sm"><span className="w-32 truncate">{c.icon} {c.name}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted"><div className="h-full bg-primary" style={{ width: `${(n / all.length) * 100}%` }} /></div>
              <span className="w-8 text-right text-muted-foreground">{n}/{all.length}</span></div>); })}
        </div>
        {hard.length > 0 && <div className="rounded-3xl bg-card p-4 shadow-soft"><p className="mb-2 font-display font-bold">Difficult words</p>
          <div className="flex flex-wrap gap-2">{hard.map((w) => <span key={w.id} className="rounded-full bg-destructive/10 px-3 py-1 text-sm">{w.image} {w.word}</span>)}</div></div>}
        <div className="rounded-3xl bg-card p-4 shadow-soft"><p className="mb-2 font-display font-bold">History</p>
          {learned.length ? learned.slice(0, 30).map((w) => <div key={w.id} className="flex justify-between py-1 text-sm"><span>{w.image} {w.word}</span>
            <span className="text-muted-foreground">{new Date(s.cards[w.id].learnedAt).toLocaleDateString()}</span></div>) : <p className="text-sm text-muted-foreground">No words yet.</p>}
        </div>
        <div className="space-y-3 rounded-3xl bg-card p-4 shadow-soft"><p className="font-display font-bold">Settings</p>
          <label className="block text-sm">Native language<select className={sel} value={s.lang} onChange={(e) => setState((x) => ({ ...x, lang: e.target.value as Lang }))}>
            {LANGS.map((l) => <option key={l} value={l}>{LANG_NAMES[l]}</option>)}</select></label>
          <label className="block text-sm">Level<select className={sel} value={s.level} onChange={(e) => setState((x) => ({ ...x, level: e.target.value as Level }))}>
            {LEVEL_ORDER.map((l) => <option key={l}>{l}</option>)}</select></label>
          <label className="block text-sm">Pronunciation<select className={sel} value={s.accent} onChange={(e) => setState((x) => ({ ...x, accent: e.target.value as State["accent"] }))}>
            <option value="en-US">American English</option><option value="en-GB">British English</option></select></label>
          <Btn v="ghost" className="flex w-full items-center justify-center gap-2" onClick={enableNotify}><Bell className="h-4 w-4" />{s.notify ? "Daily word notifications on" : "Enable daily word notifications"}</Btn>
        </div>
      </div>
    </div>
  );
}
