"use client";

import { useEffect, useState } from "react";
import { logSupabaseHealth } from "@/lib/supabase-health-check";
import { supabase } from "@/lib/supabase";

export default function DebugPage() {
  const [healthCheck, setHealthCheck] = useState<any>(null);
  const [testResult, setTestResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    logSupabaseHealth().then(setHealthCheck);
  }, []);

  const testSignup = async () => {
    setLoading(true);
    setTestResult("Testing signup...");

    try {
      const testEmail = `test-${Date.now()}@example.com`;
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: "test123456",
      });

      if (error) {
        setTestResult(`❌ Signup failed: ${error.message}`);
      } else {
        setTestResult(`✅ Signup successful! User ID: ${data.user?.id}`);
      }
    } catch (err) {
      setTestResult(
        `❌ Error: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    setLoading(true);
    setTestResult("Testing connection...");

    try {
      const { data, error } = await supabase
        .from("users")
        .select("count")
        .limit(0);

      if (error) {
        setTestResult(`❌ Connection failed: ${error.message}`);
      } else {
        setTestResult(`✅ Connection successful!`);
      }
    } catch (err) {
      setTestResult(
        `❌ Error: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-neutral-900 dark:text-neutral-100">
          🔍 Supabase Debug Console
        </h1>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          <div className="space-y-2 font-mono text-sm">
            <p>
              <span className="text-neutral-600 dark:text-neutral-400">
                NEXT_PUBLIC_SUPABASE_URL:
              </span>{" "}
              <span className="text-green-600 dark:text-green-400">
                {process.env.NEXT_PUBLIC_SUPABASE_URL || "❌ Not set"}
              </span>
            </p>
            <p>
              <span className="text-neutral-600 dark:text-neutral-400">
                NEXT_PUBLIC_SUPABASE_ANON_KEY:
              </span>{" "}
              <span className="text-green-600 dark:text-green-400">
                {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
                  ? "✅ Set"
                  : "❌ Not set"}
              </span>
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Health Check Results</h2>
          {healthCheck ? (
            <div className="space-y-2">
              <p>
                {healthCheck.envVarsConfigured ? "✅" : "❌"} Environment
                Variables
              </p>
              <p>{healthCheck.urlFormat ? "✅" : "❌"} URL Format</p>
              <p>
                {healthCheck.connectionTest ? "✅" : "❌"} Database Connection
              </p>
              <p>{healthCheck.authReady ? "✅" : "❌"} Auth Service</p>
              {healthCheck.errors.length > 0 && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-md">
                  <p className="font-semibold text-red-700 dark:text-red-400 mb-2">
                    Errors:
                  </p>
                  <ul className="list-disc list-inside text-sm text-red-600 dark:text-red-400">
                    {healthCheck.errors.map((err: string, i: number) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p className="text-neutral-500">Loading...</p>
          )}
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Manual Tests</h2>
          <div className="space-x-4 mb-4">
            <button
              onClick={testConnection}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              Test Database Connection
            </button>
            <button
              onClick={testSignup}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              Test Signup
            </button>
          </div>
          {testResult && (
            <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-md font-mono text-sm">
              {testResult}
            </div>
          )}
        </div>

        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <h3 className="font-semibold text-yellow-800 dark:text-yellow-400 mb-2">
            Common Issues:
          </h3>
          <ul className="list-disc list-inside text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
            <li>Check if your Supabase project is active and not paused</li>
            <li>
              Verify email confirmation is disabled in Supabase Auth settings
              (for testing)
            </li>
            <li>
              Make sure Row Level Security (RLS) policies allow user creation
            </li>
            <li>Check browser console for CORS or network errors</li>
            <li>Verify your internet connection is stable</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
