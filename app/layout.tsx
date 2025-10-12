import "./global.css";
import type { Metadata } from "next";
import SideBarWrapper from "./SideBarWrapper";


export const metadata: Metadata = {
  title: {
    default: "Next.js Magyar Dokumentáció",
    template: "%s | Next.js Magyar Dokumentáció",
  },
  description:
    "Fedezd fel a Next.js hivatalos dokumentációját magyar nyelven — fordítás, magyarázatok és példák egy helyen.",
  metadataBase: new URL("https://nextjs-docs-hu.vercel.app"), 
  openGraph: {
    title: "Next.js Magyar Dokumentáció",
    description:
      "A Next.js hivatalos dokumentáció magyar fordítása. Könnyen érthető útmutatók kezdőknek és haladóknak.",
    url: "https://nextjs-docs-hu.vercel.app",
    siteName: "Next.js Magyar Dokumentáció",
    locale: "hu_HU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Next.js Magyar Dokumentáció",
    description:
      "A Next.js hivatalos dokumentáció magyar fordítása — fordítás, magyarázatok és példák egy helyen.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};


export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <html lang="hu">
      <body className="min-w-[350px] overflow-hidden h-screen font-sans bg-black text-gray-200">
        <div className="flex flex-col lg:flex-row h-full">
          {/* SIDEBAR */}
          <SideBarWrapper />

          {/* MAIN CONTENT */}
          <main className=" lg:flex-1 overflow-y-auto">
            <div className="w-full mx-auto">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
