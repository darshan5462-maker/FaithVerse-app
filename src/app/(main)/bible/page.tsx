"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Sparkles,
  HelpCircle,
  CheckCircle,
  XCircle,
  Copy,
  Check,
  Share2,
  Calendar,
  Bookmark,
} from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageContext";

export default function BibleLearningPage() {
  const { language, setLanguage, t } = useLanguage();
  const [dailyVerse, setDailyVerse] = useState<any>(null);
  const [books, setBooks] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [selectedBook, setSelectedBook] = useState("php");
  const [selectedChapter, setSelectedChapter] = useState(4);
  const [selectedLang, setSelectedLang] = useState<"en" | "kn" | "hi">("en");
  const [copied, setCopied] = useState(false);

  // Quiz state
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    fetch("/api/bible")
      .then((res) => res.json())
      .then((data) => {
        if (data.dailyVerse) setDailyVerse(data.dailyVerse);
        if (data.books) setBooks(data.books);
        if (data.quizzes) setQuizzes(data.quizzes);
      })
      .catch((err) => console.error(err));
  }, []);

  const getVerseText = () => {
    if (!dailyVerse) return "Loading...";
    if (selectedLang === "kn") return dailyVerse.textKannada;
    if (selectedLang === "hi") return dailyVerse.textHindi;
    return dailyVerse.textEnglish;
  };

  const handleCopy = () => {
    if (!dailyVerse) return;
    const text = `"${getVerseText()}" — ${dailyVerse.book} ${dailyVerse.chapter}:${dailyVerse.verse}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSelectQuizOption = (index: number) => {
    if (showAnswer) return;
    setSelectedOption(index);
    setShowAnswer(true);
    if (quizzes[currentQuizIndex]?.correctIndex === index) {
      setScore((s) => s + 1);
    }
  };

  const nextQuizQuestion = () => {
    setSelectedOption(null);
    setShowAnswer(false);
    setCurrentQuizIndex((idx) => (idx < quizzes.length - 1 ? idx + 1 : 0));
  };

  return (
    <div className="space-y-8">
      {/* 1. Multilingual Daily Verse Highlight */}
      <div className="glass-card bg-gradient-to-br from-[#0d1527] via-[#131e3a] to-[#1e1738] p-6 rounded-3xl border border-[#d4af37]/40 shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#d4af37] tracking-wider uppercase">
            <BookOpen className="w-4 h-4 text-[#d4af37]" />
            <span>Today&apos;s Living Word</span>
          </div>

          {/* Translation selector */}
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setSelectedLang("en")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                selectedLang === "en" ? "bg-[#d4af37] text-black font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              English
            </button>
            <button
              onClick={() => setSelectedLang("kn")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                selectedLang === "kn" ? "bg-[#d4af37] text-black font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              ಕನ್ನಡ
            </button>
            <button
              onClick={() => setSelectedLang("hi")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                selectedLang === "hi" ? "bg-[#d4af37] text-black font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              हिन्दी
            </button>
          </div>
        </div>

        {dailyVerse && (
          <>
            <div className="space-y-2">
              <span className="text-xs font-bold text-amber-300">
                {dailyVerse.book} {dailyVerse.chapter}:{dailyVerse.verse}
              </span>
              <p className="text-lg md:text-xl font-medium text-white italic leading-relaxed">
                &ldquo;{getVerseText()}&rdquo;
              </p>
            </div>

            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-1 text-xs text-slate-300">
              <span className="font-bold text-[#d4af37] block">Spiritual Reflection:</span>
              <p className="leading-relaxed">{dailyVerse.explanation}</p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400">
                Theme: <strong>{dailyVerse.theme}</strong>
              </span>

              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-slate-200 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied!" : "Copy Scripture Card"}</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* 2. Scripture Explorer & Chapter Reader */}
      <div className="glass-card bg-[#0d1527]/80 p-6 rounded-3xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Bookmark className="w-4 h-4 text-[#d4af37]" />
            <span>Scripture Book & Chapter Navigator</span>
          </div>
          <span className="text-xs text-slate-400">Old & New Testament</span>
        </div>

        {/* Books List */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
          {books.map((b) => (
            <button
              key={b.id}
              onClick={() => {
                setSelectedBook(b.id);
                setSelectedChapter(1);
              }}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                selectedBook === b.id
                  ? "bg-gradient-to-r from-[#d4af37] to-amber-500 text-black font-bold shadow-md"
                  : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5"
              }`}
            >
              {b.name} ({b.chapters} ch)
            </button>
          ))}
        </div>

        {/* Chapter Text Sample View */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3 text-sm text-slate-200 leading-relaxed font-serif">
          <h3 className="font-sans font-bold text-base text-amber-300">
            Philippians Chapter 4 (BSB)
          </h3>
          <p>
            <sup className="text-amber-400 font-bold mr-1">4</sup>
            Rejoice in the Lord always. I will say it again: Rejoice!
          </p>
          <p>
            <sup className="text-amber-400 font-bold mr-1">5</sup>
            Let your gentleness be evident to all. The Lord is near.
          </p>
          <p className="bg-[#d4af37]/10 p-2 rounded-lg border-l-2 border-[#d4af37]">
            <sup className="text-amber-400 font-bold mr-1">6</sup>
            Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.
          </p>
          <p>
            <sup className="text-amber-400 font-bold mr-1">7</sup>
            And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.
          </p>
        </div>
      </div>

      {/* 3. Interactive Scripture Quiz */}
      {quizzes.length > 0 && (
        <div className="glass-card bg-[#0d1527]/90 p-6 rounded-3xl border border-purple-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wide">
              <HelpCircle className="w-4 h-4 text-purple-400" />
              <span>Daily Scripture Quiz Challenge</span>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Score: {score} pts
            </span>
          </div>

          <p className="text-sm font-semibold text-white">
            {quizzes[currentQuizIndex]?.question}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {quizzes[currentQuizIndex]?.options.map((opt: string, idx: number) => {
              const isCorrect = quizzes[currentQuizIndex]?.correctIndex === idx;
              const isChosen = selectedOption === idx;

              let btnStyle = "bg-white/5 hover:bg-white/10 text-slate-200 border-white/10";
              if (showAnswer) {
                if (isCorrect) {
                  btnStyle = "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold";
                } else if (isChosen) {
                  btnStyle = "bg-rose-500/20 text-rose-300 border-rose-500/40";
                }
              }

              return (
                <button
                  key={idx}
                  disabled={showAnswer}
                  onClick={() => handleSelectQuizOption(idx)}
                  className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {showAnswer && isCorrect && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                  {showAnswer && isChosen && !isCorrect && <XCircle className="w-4 h-4 text-rose-400" />}
                </button>
              );
            })}
          </div>

          {showAnswer && (
            <div className="space-y-3 pt-2 animate-fade-in">
              <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-xs text-slate-300">
                <span className="font-semibold text-amber-300">Scripture Reference: </span>
                {quizzes[currentQuizIndex]?.scriptureRef} &mdash; {quizzes[currentQuizIndex]?.explanation}
              </div>

              <button
                onClick={nextQuizQuestion}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow transition-colors"
              >
                Next Question &rarr;
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
