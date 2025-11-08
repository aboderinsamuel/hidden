"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { PromptModel } from "@/lib/types";
import { savePrompt } from "@/lib/promptData";
import { useAuth } from "./AuthProvider";

export function PromptForm() {
  const router = useRouter();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [model, setModel] = useState<PromptModel>("gpt-4");
  const [collection, setCollection] = useState("");
  const [tags, setTags] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!user) {
      router.push("/login");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const id = crypto.randomUUID();
      const tagArray = tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
      const now = new Date().toISOString();

      const newPrompt = {
        id,
        title,
        content,
        model,
        collection: collection.trim() || "uncategorized",
        tags: tagArray.length > 0 ? tagArray : undefined,
        createdAt: now,
        updatedAt: now,
      };

      await savePrompt(newPrompt);
      router.push("/");
    } catch (err) {
      setError("Failed to save prompt. Please try again.");
      console.error("Error saving prompt:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6">
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Title
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Prompt body
          </label>
          <textarea
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            placeholder="Enter your prompt here..."
            className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 font-mono text-sm focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600 transition-colors resize-y"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Collection (tag)
            </label>
            <input
              type="text"
              required
              value={collection}
              onChange={(e) => setCollection(e.target.value)}
              placeholder="e.g. development"
              className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Model
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value as PromptModel)}
              className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600 transition-colors"
            >
              <option value="gpt-4">GPT-4</option>
              <option value="gpt-3.5">GPT-3.5</option>
              <option value="claude-3">Claude 3</option>
              <option value="gemini-pro">Gemini Pro</option>
              <option value="mistral">Mistral</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Additional tags
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="tag1, tag2, tag3"
            className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600 transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="w-full px-4 py-3 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-neutral-200 dark:text-neutral-900 text-white font-medium rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? "Saving..." : "Save prompt"}
        </button>
      </form>
    </div>
  );
}
