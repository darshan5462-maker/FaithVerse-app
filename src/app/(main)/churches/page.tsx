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
      <div className="pro-card p-5 sm:p-6 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#e5b842] tracking-wider uppercase">
          <Church className="w-4 h-4 text-[#e5b842]" />
          <span>Global Church Connect</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
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
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#e5b842]/40 transition-colors"
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
              className="pro-card overflow-hidden hover:border-white/[0.14] transition-all"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090a0f] via-transparent to-transparent" />
                </div>
              )}

              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h2 className="text-base font-bold text-white">{church.name}</h2>
                      {church.isVerified && (
                        <span title="Verified Sanctuary">
                          <CheckCircle2 className="w-4 h-4 text-[#e5b842] fill-[#e5b842]/20" />
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
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-500/10 text-rose-300 border border-rose-500/20 flex items-center gap-1.5 hover:bg-rose-500/20 transition-colors"
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400 pt-3 border-t border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#e5b842] flex-shrink-0" />
                    <span className="truncate">{church.address}, {church.city}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#e5b842] flex-shrink-0" />
                    <span className="truncate">{church.serviceTimes}</span>
                  </div>
                  {church.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>{church.phone}</span>
                    </div>
                  )}
                  {church.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
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
