import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthContext";
import { LanguageProvider } from "@/components/providers/LanguageContext";
import { AudioPlayerProvider } from "@/components/providers/AudioPlayerContext";
import FloatingAudioPlayer from "@/components/audio/FloatingAudioPlayer";

export const metadata: Metadata = {
  title: "FaithVerse — Scroll with Purpose. Share with Love. Grow Together.",
  description:
    "A global, uplifting social platform open to everyone. Discover Bible teachings, worship music, testimonies, and purposeful community conversations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" className="dark">
      <body className="bg-[#090a0f] text-slate-100 antialiased min-h-screen selection:bg-[#e5b842]/20 selection:text-white">
        <LanguageProvider>
          <AuthProvider>
            <AudioPlayerProvider>
              {children}
              <FloatingAudioPlayer />
            </AudioPlayerProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
