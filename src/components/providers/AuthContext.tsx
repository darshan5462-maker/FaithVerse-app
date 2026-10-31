"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CurrentUser {
  id: string;
  email: string;
  username: string;
  fullName: string;
  role: "GUEST" | "USER" | "MODERATOR" | "ADMIN" | "SUPER_ADMIN";
  avatarUrl: string;
  bio?: string;
  isVerified?: boolean;
}

export const DEMO_USERS: CurrentUser[] = [
  {
    id: "admin-demo-id",
    email: "admin@faithverse.org",
    username: "faithverse_admin",
    fullName: "FaithVerse Admin",
    role: "SUPER_ADMIN",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    bio: "Chief Moderation & Community Guardian at FaithVerse.",
    isVerified: true,
  },
  {
    id: "mod-demo-id",
    email: "moderator@faithverse.org",
    username: "sarah_mod",
    fullName: "Sarah Jenkins",
    role: "MODERATOR",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    bio: "Community Moderator. Ensuring uplifting and respectful conversations.",
    isVerified: true,
  },
  {
    id: "pastor-demo-id",
    email: "pastor.john@gracechurch.org",
    username: "pastor_john",
    fullName: "Pastor John Mathew",
    role: "USER",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    bio: "Lead Pastor at Grace Fellowship. Encouraging believers worldwide.",
    isVerified: true,
  },
  {
    id: "david-demo-id",
    email: "david.seeker@gmail.com",
    username: "david_seeker",
    fullName: "David Chen",
    role: "USER",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    bio: "Tech enthusiast discovering ancient wisdom and faith.",
    isVerified: false,
  },
];

interface AuthContextType {
  user: CurrentUser | null;
  role: "GUEST" | "USER" | "MODERATOR" | "ADMIN" | "SUPER_ADMIN";
  isAdminOrMod: boolean;
  login: (demoUsername: string) => void;
  logout: () => void;
  switchUser: (targetUsername: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: DEMO_USERS[0],
  role: "SUPER_ADMIN",
  isAdminOrMod: true,
  login: () => {},
  logout: () => {},
  switchUser: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(DEMO_USERS[0]); // default to admin for seamless evaluation

  useEffect(() => {
    const saved = localStorage.getItem("faithverse_active_user");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUser(parsed);
      } catch {
        // fallback
      }
    }
  }, []);

  const switchUser = (targetUsername: string) => {
    if (targetUsername === "guest") {
      setUser(null);
      localStorage.removeItem("faithverse_active_user");
      return;
    }
    const found = DEMO_USERS.find((u) => u.username === targetUsername);
    if (found) {
      setUser(found);
      localStorage.setItem("faithverse_active_user", JSON.stringify(found));
    }
  };

  const login = (demoUsername: string) => {
    switchUser(demoUsername);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("faithverse_active_user");
  };

  const role = user ? user.role : "GUEST";
  const isAdminOrMod = role === "ADMIN" || role === "SUPER_ADMIN" || role === "MODERATOR";

  return (
    <AuthContext.Provider value={{ user, role, isAdminOrMod, login, logout, switchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
