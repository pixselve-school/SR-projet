import { SharedStateProvider } from "@/lib/shared-state";
import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { Metadata } from "next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Viper Vortex",
  description:
    "Collect points by eating food and other players. If your head touches another player, you will explode and die.",
  category: "Game",
  applicationName: "Viper Vortex",
  robots: "index, follow",
  authors: [
    {
      name: "Mael KERICHARD",
      url: "https://mael.app",
    },
    {
      name: "Cody ADAM",
      url: "https://codya.dev",
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SharedStateProvider>
      <html lang="en" className="h-full">
        <body className={`h-full font-sans ${inter.variable}`}>{children}</body>
      </html>
    </SharedStateProvider>
  );
}
