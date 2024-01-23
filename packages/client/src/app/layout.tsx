"use client";

import { SharedStateProvider } from '@/lib/shared-state';
import "@/styles/globals.css";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SharedStateProvider>
      <html lang="en" className='h-full'>
        <body className={`h-full bg-red-50 font-sans ${inter.variable}`}>{children}</body>
      </html>
    </SharedStateProvider>
  );
}
