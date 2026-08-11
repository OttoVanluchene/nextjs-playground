import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Tiny Experiments",
    template: "%s | Tiny Experiments",
  },
  description:
    "A growing index of small experiments in the Next.js world — for learning, trying ideas, and keeping reusable patterns within reach.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full scrollbar-gutter-stable antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full">
        <ThemeProvider>
          <div className="flex flex-col min-h-screen">
            <SiteHeader />
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
