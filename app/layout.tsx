import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const sans = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-plex-sans", display: "swap" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex-mono", display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-instrument", display: "swap" });

const description =
  "Suphawit Thammarat: ICT student at Mahidol University building tested full-stack and data projects. Looking for a frontend, full-stack or data internship.";

export const metadata: Metadata = {
  metadataBase: new URL("https://suphawit-portfolio.vercel.app"),
  title: "Suphawit Thammarat · Portfolio",
  description,
  openGraph: { title: "Suphawit Thammarat · Portfolio", description, type: "website" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f1ea" },
    { media: "(prefers-color-scheme: dark)", color: "#121316" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} ${serif.variable} antialiased`}>
      <body className="min-h-screen font-sans text-[16px] leading-relaxed">{children}</body>
    </html>
  );
}
