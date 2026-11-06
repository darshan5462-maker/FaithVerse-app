"use client";

import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Users, Video, Clock, Check, Sparkles } from "lucide-react";
import { useAuth } from "@/components/providers/AuthContext";
import { formatNumberCompact } from "@/lib/utils";

export default function EventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/events?userId=${user?.id || ""}`);
      const data = await res.json();
      if (data.success && data.events) {
        setEvents(data.events);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [user?.id]);

  const handleRSVP = async (eventId: string) => {
    if (!user) {
      alert("Please sign in or switch to an active persona to RSVP.");
      return;
    }

    // Optimistic toggle
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === eventId) {
          const nextRegistered = !e.isRegistered;
          return {
            ...e,
            isRegistered: nextRegistered,
            registrationsCount: nextRegistered
              ? e.registrationsCount + 1
              : Math.max(0, e.registrationsCount - 1),
          };
        }
        return e;
      })
    );

    try {
      await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, userId: user.id }),
      });
    } catch {
      fetchEvents();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pro-card p-5 sm:p-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#e5b842] tracking-wider uppercase">
          <Calendar className="w-4 h-4 text-[#e5b842]" />
          <span>Christian Gatherings & Summits</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Upcoming Global Events</h1>
        <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
          Worship nights, youth retreats, conferences, and charity drives. Attend in person or join worldwide live streams.
        </p>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading events calendar...</div>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className="pro-card overflow-hidden hover:border-white/[0.14] transition-all flex flex-col md:flex-row"
            >
              {/* Event Banner */}
              {event.bannerUrl && (
                <div className="w-full md:w-56 h-48 md:h-auto bg-black flex-shrink-0 relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={event.bannerUrl}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-black/70 backdrop-blur-md text-[#e5b842] border border-[#e5b842]/30">
                    {event.category.replace("_", " ")}
                  </div>
                </div>
              )}

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-[#e5b842] font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {new Date(event.startDate).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <h2 className="text-base font-bold text-white">{event.title}</h2>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {event.description}
                  </p>
                </div>

                <div className="space-y-2 pt-3 border-t border-white/[0.06] text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span>{event.location}</span>
                  </div>

                  {event.isOnline && event.streamUrl && (
                    <div className="flex items-center gap-2 text-purple-300">
                      <Video className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      <span>Online Global Virtual Stage Available</span>
                    </div>
                  )}
                </div>

                {/* RSVP Action */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#e5b842]" />
                    <strong>{formatNumberCompact(event.registrationsCount)}</strong> attending
                  </span>

                  <button
                    onClick={() => handleRSVP(event.id)}
                    className={`py-2 px-4 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      event.isRegistered
                        ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                        : "bg-white text-black hover:bg-slate-200"
                    }`}
                  >
                    {event.isRegistered && <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />}
                    <span>{event.isRegistered ? "You're Registered" : "RSVP / Attend"}</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
