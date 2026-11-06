"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  HelpCircle,
  CheckCircle,
  XCircle,
  Copy,
  Check,
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
    <div className="space-y-6">
      {/* 1. Multilingual Daily Verse Highlight */}
      <div className="bg-[#11141d] p-6 rounded-2xl border border-white/[0.08] space-y-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <BookOpen className="w-4 h-4 text-[#e5b842]" />
            <span>Daily Scripture</span>
          </div>

          {/* Translation selector */}
          <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-xl border border-white/[0.08] text-xs">
            <button
              onClick={() => setSelectedLang("en")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                selectedLang === "en" ? "bg-white text-black font-semibold shadow-sm" : "text-slate-400 hover:text-white"
              }`}
            >
              English
            </button>
            <button
              onClick={() => setSelectedLang("kn")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                selectedLang === "kn" ? "bg-white text-black font-semibold shadow-sm" : "text-slate-400 hover:text-white"
              }`}
            >
              ಕನ್ನಡ
            </button>
            <button
              onClick={() => setSelectedLang("hi")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                selectedLang === "hi" ? "bg-white text-black font-semibold shadow-sm" : "text-slate-400 hover:text-white"
              }`}
            >
              हिन्दी
            </button>
          </div>
        </div>

        {dailyVerse && (
          <>
            <div className="space-y-2">
              <span className="text-xs font-semibold text-[#e5b842]">
                {dailyVerse.book} {dailyVerse.chapter}:{dailyVerse.verse}
              </span>
              <p className="text-base sm:text-lg font-medium text-white italic leading-relaxed">
                &ldquo;{getVerseText()}&rdquo;
              </p>
            </div>

            <div className="bg-white/[0.02] p-4 rounded-xl border border-white/[0.04] space-y-1 text-xs text-slate-300">
              <span className="font-semibold text-white block">Reflection:</span>
              <p className="leading-relaxed text-slate-400">{dailyVerse.explanation}</p>
            </div>

            <div className="flex items-center justify-between pt-2 text-xs">
              <span className="text-slate-400">
                Theme: <strong className="text-slate-200">{dailyVerse.theme}</strong>
              </span>

              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 transition-colors border border-white/[0.06]"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy Scripture"}</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* 2. Scripture Explorer & Chapter Reader */}
      <div className="bg-[#11141d] p-6 rounded-2xl border border-white/[0.08] space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Bookmark className="w-4 h-4 text-[#e5b842]" />
            <span>Scripture Reader</span>
          </div>
          <span className="text-xs text-slate-500">Old & New Testament</span>
        </div>

        {/* Books List */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs">
          {books.map((b) => (
            <button
              key={b.id}
              onClick={() => {
                setSelectedBook(b.id);
                setSelectedChapter(1);
              }}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                selectedBook === b.id
                  ? "bg-white text-black font-semibold shadow-sm"
                  : "bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/[0.06]"
              }`}
            >
              {b.name} ({b.chapters})
            </button>
          ))}
        </div>

        {/* Chapter Text Sample View */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-3 text-sm text-slate-200 leading-relaxed font-serif">
          <h3 className="font-sans font-bold text-sm text-white">
            Philippians Chapter 4 (BSB)
          </h3>
          <p>
            <sup className="text-slate-500 font-bold mr-1">4</sup>
            Rejoice in the Lord always. I will say it again: Rejoice!
          </p>
          <p>
            <sup className="text-slate-500 font-bold mr-1">5</sup>
            Let your gentleness be evident to all. The Lord is near.
          </p>
          <p className="bg-white/[0.04] p-3 rounded-lg border-l-2 border-[#e5b842]">
            <sup className="text-[#e5b842] font-bold mr-1">6</sup>
            Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.
          </p>
          <p>
            <sup className="text-slate-500 font-bold mr-1">7</sup>
            And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.
          </p>
        </div>
      </div>

      {/* 3. Interactive Scripture Quiz */}
      {quizzes.length > 0 && (
        <div className="bg-[#11141d] p-6 rounded-2xl border border-white/[0.08] space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <HelpCircle className="w-4 h-4 text-[#e5b842]" />
              <span>Scripture Quiz Challenge</span>
            </div>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-white/[0.06] text-slate-300 border border-white/[0.08]">
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

              let btnStyle = "bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border-white/[0.08]";
              if (showAnswer) {
                if (isCorrect) {
                  btnStyle = "bg-emerald-500/15 text-emerald-300 border-emerald-500/30 font-semibold";
                } else if (isChosen) {
                  btnStyle = "bg-rose-500/15 text-rose-300 border-rose-500/30";
                }
              }

              return (
                <button
                  key={idx}
                  disabled={showAnswer}
                  onClick={() => handleSelectQuizOption(idx)}
                  className={`p-3 rounded-xl border text-left flex items-center justify-between transition-colors ${btnStyle}`}
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
              <div className="p-3 bg-white/[0.02] rounded-xl border border-white/[0.04] text-xs text-slate-300">
                <span className="font-semibold text-white">Reference: </span>
                {quizzes[currentQuizIndex]?.scriptureRef} &mdash; {quizzes[currentQuizIndex]?.explanation}
              </div>

              <button
                onClick={nextQuizQuestion}
                className="py-2 px-4 rounded-xl text-xs font-semibold bg-white text-black hover:bg-slate-200 transition-colors shadow-sm"
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
