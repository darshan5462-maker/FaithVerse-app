import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const BIBLE_BOOKS = [
  { id: "gen", name: "Genesis", testament: "OT", chapters: 50 },
  { id: "psa", name: "Psalms", testament: "OT", chapters: 150 },
  { id: "pro", name: "Proverbs", testament: "OT", chapters: 31 },
  { id: "isa", name: "Isaiah", testament: "OT", chapters: 66 },
  { id: "mat", name: "Matthew", testament: "NT", chapters: 28 },
  { id: "jhn", name: "John", testament: "NT", chapters: 21 },
  { id: "rom", name: "Romans", testament: "NT", chapters: 16 },
  { id: "php", name: "Philippians", testament: "NT", chapters: 4 },
  { id: "rev", name: "Revelation", testament: "NT", chapters: 22 },
];

export const BIBLE_QUIZ_QUESTIONS = [
  {
    id: "q1",
    question: "Where did Jesus deliver the famous Beatitudes ('Blessed are the peacemakers...')?",
    options: ["Mount of Olives", "Sermon on the Mount", "Sea of Galilee shore", "Garden of Gethsemane"],
    correctIndex: 1,
    scriptureRef: "Matthew 5:1-12",
    explanation: "Jesus went up on a mountainside and sat down to teach His disciples the Beatitudes.",
  },
  {
    id: "q2",
    question: "According to 1 Corinthians 13, which of these is the greatest?",
    options: ["Faith", "Hope", "Love", "Knowledge"],
    correctIndex: 2,
    scriptureRef: "1 Corinthians 13:13",
    explanation: "'And now these three remain: faith, hope and love. But the greatest of these is love.'",
  },
  {
    id: "q3",
    question: "What is the Hebrew meaning of the name 'Emmanuel'?",
    options: ["God with us", "Prince of Peace", "The Lord our Healer", "Mighty Counselor"],
    correctIndex: 0,
    scriptureRef: "Matthew 1:23 / Isaiah 7:14",
    explanation: "'The virgin will conceive and give birth to a son, and they will call him Immanuel' (which means 'God with us').",
  },
];

export async function GET() {
  try {
    const todayStr = new Date().toISOString().split("T")[0];
    let verse = await prisma.dailyVerse.findUnique({
      where: { dateString: todayStr },
    });

    if (!verse) {
      verse = await prisma.dailyVerse.findFirst({
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json({
      success: true,
      dailyVerse: verse,
      books: BIBLE_BOOKS,
      quizzes: BIBLE_QUIZ_QUESTIONS,
    });
  } catch (error: any) {
    console.error("Error fetching Bible data:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
