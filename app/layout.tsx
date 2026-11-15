import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, IBM_Plex_Mono } from "next/font/google";
import { MotionObserver } from "@/components/Motion";
import "./globals.css";

const sans = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-jakarta", display: "swap" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex-mono", display: "swap" });

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
    { media: "(prefers-color-scheme: light)", color: "#eef4fc" },
    { media: "(prefers-color-scheme: dark)", color: "#0a1124" },
  ],
};

// Turns animations on before first paint, unless the visitor prefers reduced motion.
// If the client bundle never runs (MotionObserver sets __motionReady), it turns them off again so nothing stays hidden.
const motionScript = `(function(){try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;var d=document.documentElement;d.classList.add('motion');setTimeout(function(){if(!window.__motionReady)d.classList.remove('motion')},4000)}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionScript }} />
      </head>
      <body className="min-h-screen font-sans text-[16px] leading-relaxed">
        {children}
        <MotionObserver />
      </body>
    </html>
  );
}
