"use client";

import { useEffect, useState } from "react";
import { SparkleBackground } from "./SparkleBackground";
import { InfinityLogo } from "./InfinityLogo";

interface LayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
}

export function Layout({ children, header, sidebar }: LayoutProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Listen for a global event to toggle the sidebar from the Header
  useEffect(() => {
    const handler = () => setMobileSidebarOpen((v) => !v);
    window.addEventListener("toggle-sidebar", handler as EventListener);
    return () =>
      window.removeEventListener("toggle-sidebar", handler as EventListener);
  }, []);

  const closeMobileSidebar = () => setMobileSidebarOpen(false);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 relative">
      <SparkleBackground />
      {header}
      <div className="flex-1 flex">
        {/* Desktop sidebar */}
        {sidebar ? <div className="hidden md:block">{sidebar}</div> : null}
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
      {/* Mobile sidebar drawer */}
      {sidebar ? (
        <div
          className={`md:hidden fixed inset-0 z-50 transition-opacity ${
            mobileSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <div
            className="absolute inset-0 bg-black/40"
            onClick={closeMobileSidebar}
          />
          <div
            className={`absolute inset-y-0 left-0 w-72 max-w-[85%] bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 shadow-xl transform transition-transform ${
              mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="p-3 border-b border-neutral-200 dark:border-neutral-800 flex justify-end">
              <button
                aria-label="Close menu"
                onClick={closeMobileSidebar}
                className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="h-[calc(100%-56px)] overflow-y-auto">{sidebar}</div>
          </div>
        </div>
      ) : null}
      <InfinityLogo />
    </div>
  );
}
