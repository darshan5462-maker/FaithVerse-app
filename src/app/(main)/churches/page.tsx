"use client";

import React, { useState, useEffect } from "react";
import { Church, CheckCircle2, MapPin, Clock, Video, Globe, Phone, Mail } from "lucide-react";

export default function ChurchesPage() {
  const [churches, setChurches] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/churches")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.churches) {
          setChurches(data.churches);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredChurches = churches.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card bg-[#0d1527] p-6 rounded-3xl border border-white/10 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-[#d4af37] tracking-wider uppercase">
          <Church className="w-4 h-4 text-[#d4af37]" />
          <span>Global Church Connect</span>
        </div>
        <h1 className="text-2xl font-black text-white">
          Verified Churches & Sanctuaries
        </h1>
        <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
          Find Christ-centered local congregations, service times, live stream links, and community outreaches worldwide.
        </p>

        {/* Search */}
        <div className="pt-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by church name or city (e.g. Bengaluru, Mumbai, London)..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37]"
          />
        </div>
      </div>

      {/* Church Cards */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading verified churches...</div>
        ) : filteredChurches.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">No churches found matching &ldquo;{search}&rdquo;.</div>
        ) : (
          filteredChurches.map((church) => (
            <div
              key={church.id}
              className="glass-card bg-[#0d1527]/85 border border-white/10 rounded-2xl overflow-hidden shadow-lg hover:border-[#d4af37]/30 transition-all"
            >
              {/* Church Banner */}
              {church.bannerUrl && (
                <div className="h-32 w-full overflow-hidden relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={church.bannerUrl}
                    alt={church.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d1527] via-transparent to-transparent" />
                </div>
              )}

              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h2 className="text-base font-bold text-white">{church.name}</h2>
                      {church.isVerified && (
                        <span title="Verified Sanctuary">
                          <CheckCircle2 className="w-4 h-4 text-[#d4af37] fill-[#d4af37]/20" />
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400">{church.denomination}</span>
                  </div>

                  {church.liveStreamUrl && (
                    <a
                      href={church.liveStreamUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1.5 hover:bg-rose-500/30 transition-colors"
                    >
                      <Video className="w-3.5 h-3.5 text-rose-400" />
                      <span>Live Stream</span>
                    </a>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {church.description}
                </p>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 pt-2 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#d4af37] flex-shrink-0" />
                    <span className="truncate">{church.address}, {church.city}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#d4af37] flex-shrink-0" />
                    <span className="truncate">{church.serviceTimes}</span>
                  </div>
                  {church.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      <span>{church.phone}</span>
                    </div>
                  )}
                  {church.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      <span className="truncate">{church.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
