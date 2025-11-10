import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";
import { SearchPalette } from "@/components/SearchPalette";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "closedNote",
  description: "",
};

// Disable caching for the entire app - makes it behave like incognito mode
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </head>
      <body>
        <ThemeProvider>
          <AuthProvider>
            {children}
            {/* Global search palette overlay */}
            <SearchPalette />
          </AuthProvider>
        </ThemeProvider>
        {/* Vercel Web Analytics */}
        <Analytics />
      </body>
    </html>
  );
}
