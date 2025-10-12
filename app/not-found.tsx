// app/not-found.tsx
import Link from "next/link";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Az oldal nem található | Next.js Magyar Dokumentáció",
  description:
    "A keresett oldal nem található. Lépj vissza a főoldalra vagy böngészd a dokumentációt.",
  robots: {
    index: false,
    follow: false,
  },
};


export default function NotFoundPage() {
  return (
    <main className="flex flex-col items-center justify-center
                     min-h-screen px-6
                     dark:bg-black text-gray-100">
      <div className="max-w-lg space-y-6 text-center">
        <h1 className="text-6xl font-extrabold tracking-tight">404</h1>
        <h2 className="text-2xl font-semibold">Az oldal nem található</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Úgy tűnik, a keresett oldal nem létezik vagy áthelyezésre került.
        </p>

        <div className="flex flex-col sm:flex-row justify-center mt-6 gap-4">
          <Link
            href="/"
            className="px-5 py-3
                       font-medium text-base
                       bg-btn hover:bg-white/80 ring ring-white/30 text-black
                       duration-200 transition-colors"
          >
            Vissza a főoldalra
          </Link>

          <Link
            href="/docs/app"
            className="px-5 py-3
                       font-medium text-base
                       bg-[transparent] hover:bg-white/30 ring ring-white/30 text-white
                       duration-200 transition-colors"
          >
            Ugrás a dokumentációhoz
          </Link>
        </div>
      </div>
    </main>
  );
}
