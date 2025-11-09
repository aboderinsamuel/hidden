"use client";

import { useState, useEffect } from "react";
import { Prompt } from "@/lib/types";
import { getAllPrompts } from "@/lib/promptData";


 // Custom hook to manage prompts from Supabase
// Handles loading state and automatic refresh

export function usePrompts() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPrompts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllPrompts();
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
      loadPrompts();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  return { prompts, loading, error, refresh: loadPrompts };
}
