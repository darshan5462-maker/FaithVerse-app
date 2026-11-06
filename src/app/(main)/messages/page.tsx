"use client";

import React, { useState } from "react";
import { MessageCircle, Send, CheckCheck, Shield, Phone, Video, Search, User } from "lucide-react";
import { useAuth } from "@/components/providers/AuthContext";

interface ChatContact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
}

const SAMPLE_CONTACTS: ChatContact[] = [
  {
    id: "c1",
    name: "Pastor John Mathew",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    lastMessage: "Praying for you and your family this week! Let me know if you need anything.",
    time: "10:45 AM",
    unread: 1,
  },
  {
    id: "c2",
    name: "Rachel Vance",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    lastMessage: "Here is the chord chart for the new song! 🎵",
    time: "Yesterday",
    unread: 0,
  },
  {
    id: "c3",
    name: "FaithVerse Community Team",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    lastMessage: "Welcome to FaithVerse! We are delighted to grow together.",
    time: "Oct 28",
    unread: 0,
  },
];

export default function MessagesPage() {
  const { user } = useAuth();
  const [activeContact, setActiveContact] = useState<ChatContact>(SAMPLE_CONTACTS[0]);
  const [messages, setMessages] = useState<any[]>([
    { id: "m1", sender: "them", text: "Hello! Welcome to our fellowship chat.", time: "10:30 AM" },
    { id: "m2", sender: "me", text: "Thank you Pastor! Grateful for this blessed space.", time: "10:32 AM" },
    { id: "m3", sender: "them", text: "Praying for you and your family this week! Let me know if you need anything.", time: "10:45 AM" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg = {
      id: Date.now().toString(),
      sender: "me",
      text: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages([...messages, newMsg]);
    setInput("");

    // Simulated reply after 1.5 seconds
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "them",
          text: "Amen! Standing with you in faith and love.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 1500);
  };

  return (
    <div className="pro-card shadow-2xl overflow-hidden flex flex-col md:flex-row h-[78vh] min-h-[550px]">
      {/* Left Contacts List */}
      <div className="w-full md:w-80 border-r border-white/[0.08] flex flex-col bg-[#07090f]/60">
        <div className="p-4 border-b border-white/[0.08] space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-[#e5b842]" />
              Conversations
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Online
            </span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search chats..."
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#e5b842]/40 transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-white/[0.04]">
          {SAMPLE_CONTACTS.map((c) => (
            <div
              key={c.id}
              onClick={() => setActiveContact(c)}
              className={`p-3.5 flex items-center gap-3 cursor-pointer transition-colors ${
                activeContact.id === c.id
                  ? "bg-white/[0.06] border-l-2 border-[#e5b842]"
                  : "hover:bg-white/[0.03]"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.avatar} alt={c.name} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-white truncate">{c.name}</h4>
                  <span className="text-[10px] text-slate-500">{c.time}</span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">{c.lastMessage}</p>
              </div>
              {c.unread > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#e5b842] text-black text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                  {c.unread}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right Chat Thread */}
      <div className="flex-1 flex flex-col justify-between bg-transparent">
        {/* Active Header */}
        <div className="p-3.5 px-5 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeContact.avatar}
              alt={activeContact.name}
              className="w-8 h-8 rounded-full object-cover border border-white/[0.12]"
            />
            <div>
              <h3 className="text-xs font-bold text-white">{activeContact.name}</h3>
              <p className="text-[10px] text-slate-400">Encrypted Direct Message</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400">
            <button
              onClick={() => alert("Voice call initiated.")}
              className="p-2 rounded-lg hover:bg-white/[0.05] text-slate-300 hover:text-white transition-colors"
            >
              <Phone className="w-4 h-4" />
            </button>
            <button
              onClick={() => alert("Video call initiated.")}
              className="p-2 rounded-lg hover:bg-white/[0.05] text-slate-300 hover:text-white transition-colors"
            >
              <Video className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {/* Privacy Note */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-2 text-[11px] text-slate-400 text-center flex items-center justify-center gap-2 max-w-sm mx-auto">
            <Shield className="w-3.5 h-3.5 text-[#e5b842]" />
            <span>Messages are confidential between participants.</span>
          </div>

          {messages.map((m) => {
            const isMe = m.sender === "me";
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[75%] p-3 rounded-2xl text-xs leading-relaxed ${
                    isMe
                      ? "bg-white text-black font-medium rounded-tr-none shadow-sm"
                      : "bg-white/[0.07] text-white rounded-tl-none border border-white/[0.06]"
                  }`}
                >
                  <p>{m.text}</p>
                </div>
                <div className="flex items-center gap-1 text-[9px] text-slate-500 mt-1 px-1">
                  <span>{m.time}</span>
                  {isMe && <CheckCheck className="w-3 h-3 text-[#e5b842]" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 border-t border-white/[0.08] flex items-center gap-2 bg-white/[0.02]">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Message ${activeContact.name.split(" ")[0]}...`}
            className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#e5b842]/40 transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-2 rounded-xl bg-white text-black font-semibold disabled:opacity-30 hover:bg-slate-200 transition-all shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
