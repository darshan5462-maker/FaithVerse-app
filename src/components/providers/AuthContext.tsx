"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CurrentUser {
  id: string;
  email: string;
  username: string;
  fullName: string;
  role: "GUEST" | "USER" | "MODERATOR" | "ADMIN" | "SUPER_ADMIN";
  avatarUrl: string;
  bannerUrl?: string;
  bio?: string;
  location?: string;
  religion?: string;
  website?: string;
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
    id: "rachel-demo-id",
    email: "rachel@worshipmusic.org",
    username: "rachel_worship",
    fullName: "Rachel Vance",
    role: "USER",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    bio: "Worship leader & songwriter. Creating music that brings heaven near.",
    isVerified: true,
  },
  {
    id: "priya-demo-id",
    email: "priya.grace@gmail.com",
    username: "priya_grace",
    fullName: "Priya Sharma",
    role: "USER",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    bio: "Living by grace in Bengaluru. Sharing daily joy & reflections.",
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

interface RegisterPayload {
  fullName: string;
  username: string;
  email: string;
  password: string;
  religion?: string;
}

interface AuthContextType {
  user: CurrentUser | null;
  role: "GUEST" | "USER" | "MODERATOR" | "ADMIN" | "SUPER_ADMIN";
  isAdminOrMod: boolean;
  login: (demoUsername: string) => void;
  loginWithCredentials: (emailOrUsername: string, password: string) => Promise<{ success: boolean; error?: string }>;
  registerAccount: (payload: RegisterPayload) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchUser: (targetUsername: string) => void;
  updateUserProfile: (updatedFields: Partial<CurrentUser>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: "GUEST",
  isAdminOrMod: false,
  login: () => {},
  loginWithCredentials: async () => ({ success: false }),
  registerAccount: async () => ({ success: false }),
  logout: () => {},
  switchUser: () => {},
  updateUserProfile: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("faithverse_active_user");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUser(parsed);
      } catch {
        setUser(null);
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

  // Real database authentication via /api/auth/login
  const loginWithCredentials = async (emailOrUsername: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrUsername, password }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem("faithverse_active_user", JSON.stringify(data.user));
        return { success: true };
      }
      return { success: false, error: data.error || "Failed to sign in" };
    } catch (err: any) {
      return { success: false, error: err.message || "Network error signing in" };
    }
  };

  // Real database user creation via /api/auth/register
  const registerAccount = async (payload: RegisterPayload) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem("faithverse_active_user", JSON.stringify(data.user));
        return { success: true };
      }
      return { success: false, error: data.error || "Failed to create account" };
    } catch (err: any) {
      return { success: false, error: err.message || "Network error registering account" };
    }
  };

  const updateUserProfile = (updatedFields: Partial<CurrentUser>) => {
    if (!user) return;
    const merged = { ...user, ...updatedFields };
    setUser(merged);
    localStorage.setItem("faithverse_active_user", JSON.stringify(merged));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("faithverse_active_user");
  };

  const role = user ? user.role : "GUEST";
  const isAdminOrMod = role === "ADMIN" || role === "SUPER_ADMIN" || role === "MODERATOR";

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAdminOrMod,
        login,
        loginWithCredentials,
        registerAccount,
        logout,
        switchUser,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
