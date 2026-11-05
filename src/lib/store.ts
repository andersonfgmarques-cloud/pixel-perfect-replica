import { useEffect, useState, useCallback } from "react";
import { WORDS, LEVEL_ORDER, type Lang, type Level, type Word } from "./words";

export const DAILY_LIMIT = 10;
/** SRS intervals in days by box index. */
export const INTERVALS = [1, 3, 7, 14, 30, 90];
const DAY = 86400000;

export type Card = { box: number; due: number; learnedAt: number; correct: number; wrong: number };
export type State = {
  onboarded: boolean;
  lang: Lang;
  level: Level;
  accent: "en-GB" | "en-US";
  cards: Record<string, Card>;
  daily: { date: string; ids: string[] };
  favorites: string[];
  lists: { name: string; ids: string[] }[];
  streak: { last: string; count: number };
  xp: number;
  notify: boolean;
};

const KEY = "high5-state-v1";
export const today = (t = Date.now()) => new Date(t).toISOString().slice(0, 10);

const initial: State = {
  onboarded: false, lang: "es", level: "Beginner", accent: "en-US", cards: {},
  daily: { date: today(), ids: [] }, favorites: [], lists: [], streak: { last: "", count: 0 },
  xp: 0, notify: false,
};

function load(): State {
  try {
    const s = { ...initial, ...JSON.parse(localStorage.getItem(KEY) || "{}") } as State;
    if (s.daily.date !== today()) s.daily = { date: today(), ids: [] };
    return s;
  } catch { return initial; }
}

let current: State = initial;
const subs = new Set<(s: State) => void>();
export function setState(fn: (s: State) => State) {
  current = fn(current);
  localStorage.setItem(KEY, JSON.stringify(current));
  subs.forEach((f) => f(current));
}

export function useStore() {
  const [s, set] = useState<State | null>(null);
  useEffect(() => {
    current = load(); set(current);
    subs.add(set); return () => { subs.delete(set); };
  }, []);
  return s;
}

/** Pure SRS step: correct → next box, wrong → back to box 0. */
export function reviewCard(card: Card, correct: boolean, now = Date.now()): Card {
  const box = correct ? Math.min(card.box + 1, INTERVALS.length - 1) : 0;
  return { ...card, box, due: now + INTERVALS[box] * DAY,
    correct: card.correct + (correct ? 1 : 0), wrong: card.wrong + (correct ? 0 : 1) };
}

export const dueWords = (s: State, now = Date.now()) =>
  WORDS.filter((w) => s.cards[w.id] && s.cards[w.id].due <= now);

export function suggestNew(s: State, n: number): Word[] {
  const li = LEVEL_ORDER.indexOf(s.level);
  const pool = WORDS.filter((w) => !s.cards[w.id]);
  return [...pool].sort((a, b) =>
    Math.abs(LEVEL_ORDER.indexOf(a.level) - li) - Math.abs(LEVEL_ORDER.indexOf(b.level) - li))
    .slice(0, n);
}

export const remainingToday = (s: State) => Math.max(0, DAILY_LIMIT - s.daily.ids.length);

export function markLearned(ids: string[]) {
  setState((s) => {
    const now = Date.now();
    const cards = { ...s.cards };
    const fresh = ids.filter((id) => !cards[id]).slice(0, remainingToday(s));
    fresh.forEach((id) => { cards[id] = { box: 0, due: now + DAY, learnedAt: now, correct: 0, wrong: 0 }; });
    return { ...s, cards, daily: { ...s.daily, ids: [...s.daily.ids, ...fresh] } };
  });
}

export function recordResult(id: string, correct: boolean) {
  setState((s) => {
    const c = s.cards[id];
    return { ...s, xp: s.xp + (correct ? 10 : 0), cards: c ? { ...s.cards, [id]: reviewCard(c, correct) } : s.cards };
  });
}

export function bumpStreak() {
  setState((s) => {
    const t = today();
    if (s.streak.last === t) return s;
    const y = today(Date.now() - DAY);
    return { ...s, streak: { last: t, count: s.streak.last === y ? s.streak.count + 1 : 1 } };
  });
}

export function toggleFav(id: string) {
  setState((s) => ({ ...s, favorites: s.favorites.includes(id) ? s.favorites.filter((f) => f !== id) : [...s.favorites, id] }));
}

export const isHard = (c?: Card) => !!c && c.wrong > c.correct;

export function useSpeak(accent: string) {
  return useCallback((text: string, rate = 0.9) => {
    if (!("speechSynthesis" in window)) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = accent; u.rate = rate;
    const v = speechSynthesis.getVoices().find((v) => v.lang.replace("_", "-") === accent);
    if (v) u.voice = v;
    speechSynthesis.speak(u);
  }, [accent]);
}

export const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);
