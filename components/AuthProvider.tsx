"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/lib/types";
import {
  getCurrentUser,
  logoutUser,
  registerUser,
  authenticateUser,
  onAuthStateChange,
} from "@/lib/auth";
import { logSupabaseHealth } from "@/lib/supabase-health-check";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
  signup: (
    email: string,
    password: string,
    displayName?: string
  ) => Promise<
    | { ok: true; needsEmailConfirmation?: boolean }
    | { ok: false; error: string }
  >;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Run health check in development
    if (process.env.NODE_ENV === "development") {
      logSupabaseHealth().catch(console.error);
    }

    let mounted = true;

    // Simple initialization - no session persistence to manage
    const initializeAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (mounted) {
          console.log("[AuthProvider] Initial user:", currentUser);
          setUser(currentUser);
        }
      } catch (error) {
        console.error("[AuthProvider] Error initializing auth:", error);
        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen to auth state changes
    const unsubscribe = onAuthStateChange((updatedUser) => {
      if (mounted) {
        console.log("[AuthProvider] Auth state changed:", updatedUser);
        setUser(updatedUser);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    console.log("[AuthProvider] Attempting login for:", email);
    const res = await authenticateUser(email, password);
    console.log("[AuthProvider] Login result:", res);
    if (res.ok) {
      const currentUser = await getCurrentUser();
      console.log("[AuthProvider] User after login:", currentUser);
      setUser(currentUser);
    }
    return res;
  };

  const signup = async (
    email: string,
    password: string,
    displayName?: string
  ) => {
    const res = await registerUser(email, password, displayName);
    if (res.ok && !res.needsEmailConfirmation) {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    }
    return res;
  };

  const logout = async () => {
    console.log("[AuthProvider] Logout requested");

    try {
      // Clear user state immediately for instant UI feedback
      setUser(null);
      
      // Sign out from Supabase (simple, no cache to manage)
      await logoutUser();

      console.log("[AuthProvider] Logout complete, redirecting...");

      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = "/login";
      }
    } catch (err) {
      console.error("[AuthProvider] Logout failed:", err);
      // Still clear state and redirect even if there's an error
      setUser(null);
      if (typeof window !== 'undefined') {
        window.location.href = "/login";
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
