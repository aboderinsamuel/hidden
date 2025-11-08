import Link from "next/link";
import { Header } from "@/components/Header";
import { Layout } from "@/components/Layout";

export const metadata = {
  title: "Documentation | closedNote",
  description: "Project overview, architecture, and demo for closedNote.",
};

export default function DocsPage() {
  return (
    <Layout header={<Header promptCount={0} />} sidebar={null}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="font-serif-title text-4xl sm:text-5xl font-normal text-neutral-900 dark:text-neutral-100 mb-3">
            Documentation
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Everything about why closedNote exists, how it works, and a quick
            demo.
          </p>
        </div>

        <section className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>Why I built this</h2>
          <p>
            I created closedNote to have a fast, focused place to store and
            refine prompts I repeatedly use for coding, writing, research, and
            communication. Instead of losing great prompts in scattered chats or
            documents, closedNote provides a lightweight notebook with tagging,
            collections, and instant retrieval, optimized for everyday use.
          </p>

          <h2>How it works (schematics)</h2>
          <ul>
            <li>
              <strong>Next.js App Router</strong>: server-side rendered pages
              for performance, with client components for interactivity.
            </li>
            <li>
              <strong>Auth</strong>: session managed via the app&#39;s{" "}
              <code>AuthProvider</code> and Supabase (see{" "}
              <code>SUPABASE_SETUP.md</code>). Unauthenticated users can still
              browse the marketing pages.
            </li>
            <li>
              <strong>Data</strong>: prompts are loaded via hooks in{" "}
              <code>lib/hooks/usePrompts.ts</code>
              and grouped/filtered by helpers in <code>lib/promptData.ts</code>.
            </li>
            <li>
              <strong>UI</strong>: TailwindCSS components. The header exposes a
              global search and a mobile-friendly layout with an off-canvas
              sidebar for navigation.
            </li>
          </ul>

          <div className="my-6 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 p-4">
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
              High-level flow
            </p>
            <ol className="text-sm text-neutral-700 dark:text-neutral-300 list-decimal pl-5 space-y-1">
              <li>User signs in → session stored by Supabase.</li>
              <li>
                Prompts fetched by <code>usePrompts()</code> → cached in memory.
              </li>
              <li>
                Search across pages/tags/prompts via the global palette
                (Ctrl/Cmd+K).
              </li>
              <li>Create/Edit/Delete prompts with optimistic UI updates.</li>
            </ol>
          </div>

          <h2>Demo video</h2>
          <p>
            Watch a short walkthrough of closedNote in action. Replace the video
            URL with your own if needed.
          </p>
          <div className="aspect-video w-full overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-black">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/VIDEO_ID?rel=0"
              title="closedNote demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>

          <h3 className="mt-8">Links</h3>
          <ul>
            <li>
              <Link
                href="/"
                className="underline decoration-yellow-400 underline-offset-4"
              >
                Go to prompts
              </Link>
            </li>
            <li>
              <Link
                href="/prompts/new"
                className="underline decoration-yellow-400 underline-offset-4"
              >
                Create a new prompt
              </Link>
            </li>
            <li>
              <Link
                href="/settings"
                className="underline decoration-yellow-400 underline-offset-4"
              >
                Settings
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </Layout>
  );
}
