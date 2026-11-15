import type { Metadata } from "next";
import { Instrument_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/shell";
import { getTodayCount } from "@/lib/practice";

export const dynamic = "force-dynamic";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Bandwork — IELTS practice",
  description: "Daily IELTS drills: copy essays, paraphrase, find synonyms, dictation and shadowing.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const todayCount = await getTodayCount();
  return (
    <html
      lang="en"
      className={`${instrumentSans.variable} ${instrumentSerif.variable}`}
    >
      <body className="antialiased">
        <AppShell todayCount={todayCount}>{children}</AppShell>
      </body>
    </html>
  );
}
