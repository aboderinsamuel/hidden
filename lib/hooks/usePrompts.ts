"use client";

import { useState, useEffect } from "react";
import { Prompt } from "@/lib/types";
import { getAllPrompts } from "@/lib/promptData";
import { useAuth } from "@/components/AuthProvider";


 // Custom hook to manage prompts from Supabase
// Handles loading state and automatic refresh

export function usePrompts() {
  const { user } = useAuth();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPrompts = async () => {
    // Only fetch prompts if user is logged in
    if (!user) {
      console.log("[usePrompts] No user logged in, clearing prompts");
      setPrompts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log("[usePrompts] Fetching prompts for user:", user.id);
      const data = await getAllPrompts();
      console.log("[usePrompts] Loaded prompts:", data.length);
      setPrompts(data);
    } catch (err) {
      console.error("[usePrompts] Failed to load prompts:", err);
      setError("Failed to load prompts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrompts();

    // Refresh prompts when window regains focus
    const handleFocus = () => {
      if (user) {
        loadPrompts();
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]); // Re-run when user changes

  return { prompts, loading, error, refresh: loadPrompts };
}
