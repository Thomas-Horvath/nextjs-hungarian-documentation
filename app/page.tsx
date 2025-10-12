import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center relative
                     min-h-screen px-6
                     bg-black text-white">
      <div className="w-full max-w-2xl space-y-6 text-center">
        <div
          className="absolute inset-0
                     bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)]
                     pointer-events-none
                     bg-[size:40px_40px]"
        />

        {/* Logó vagy cím */}
        <div className="flex flex-col items-center justify-center
                        font-extrabold  sm:text-6xl lg:text-8xl text-5xl tracking-tight">
          <h1>Next.js</h1>
          <p className="my-4 font-extrabold  uppercase
                         bg-clip-text bg-contain bg-no-repeat
                         text-transparent"

            style={{ backgroundImage: "url('/hungary-flag.svg')", backgroundSize: "100% auto", backgroundPosition: "center 2px", }}
          >
            Magyar
          </p>






          <h2>Dokumentáció</h2>
        </div>

        <p className="text-lg text-gray-600 dark:text-gray-400">
          A Next.js hivatalos dokumentációjának magyar fordítása — tanulj, építs, alkoss.
        </p>

        <div className="flex flex-col sm:flex-row justify-center mt-8 gap-4">
          <Link
            href="/docs/app"
            className="px-5 py-3
                       font-medium text-base
                       bg-btn hover:bg-white/80 ring ring-white/30 text-black
                       duration-200 transition-colors"
          >
            App Router
          </Link>
          <Link
            href="/docs/pages"
            className="px-5 py-3
                       font-medium text-base
                       bg-[transparent] hover:bg-white/30 ring ring-white/30 text-white
                       duration-200 transition-colors
                       }"
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
