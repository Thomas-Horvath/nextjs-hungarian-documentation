import { getDocsNavTree } from "@/lib/getDocsNavTree";
import Sidebar from "./SideBar";
import "./global.css";
import type { Metadata } from "next";
import Link from "next/link";


export const metadata: Metadata = {
  title: {
    default: "Next.js Magyar Dokumentáció",
    template: "%s | Next.js Magyar Dokumentáció",
  },
  description:
    "Fedezd fel a Next.js hivatalos dokumentációját magyar nyelven — fordítás, magyarázatok és példák egy helyen.",
  metadataBase: new URL("https://nextjs-docs-hu.vercel.app"), // 🌐 ezt állítsd be a saját domainre
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
  const navTree = getDocsNavTree();

  return (
    <html lang="hu">
      <body className="overflow-hidden h-screen font-sans bg-black text-gray-200">
        <div className="flex h-full">
          {/* SIDEBAR */}
          <aside className="flex flex-col overflow-hidden
                            w-[450px]
                            bg-[#111111] border-gray-800 border-r text-white">
            <Link href={"/"} className="px-6 py-4 border-b border-gray-800">
              <h2 className="flex items-baseline text-5xl font-extrabold tracking-tight">
                Next
                <span className="ml-1 text-lg text-blue-400">.js</span>
                &nbsp; 15
              </h2>
            </Link>
            <div className="flex-1 overflow-y-auto
                            pl-4
                            scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
              <Sidebar tree={navTree} />
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <main className="flex-1 overflow-y-auto">
            <div className="w-full mx-auto">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
