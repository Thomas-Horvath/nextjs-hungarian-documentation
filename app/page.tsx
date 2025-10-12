// app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-6 bg-black text-white">
      <div className="w-full max-w-2xl space-y-6 text-center">
        {/* Logó vagy cím */}
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl leading-[80px]">
          🇭🇺  Next.js Magyar Dokumentáció
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-400 ">
          A Next.js hivatalos dokumentációjának magyar fordítása — tanulj, építs, alkoss.
        </p>

        <div className="flex flex-col sm:flex-row justify-center mt-8 gap-4">
          <Link
            href="/docs/app"
            className="px-5 py-3
                       font-medium text-base
                       bg-btn  hover:bg-white/80 
                       text-black
                       ring ring-white/30
                       duration-200 transition-colors"
          >
            App Router
          </Link>
          <Link
            href="/docs/pages"
            className="px-5 py-3
                       font-medium text-base
                       bg-[transparent] 
                       hover:bg-white/30 text-white
                       ring ring-white/30
}
                       duration-200 transition-colors"
          >
            Pages Router
          </Link>
        </div>

        <footer className="mt-12 text-sm text-gray-500 dark:text-gray-400">
          Készült Next.js-szel · Fordítás: <strong>Thomas Horvath</strong>
        </footer>
      </div>
    </main>
  );
}
