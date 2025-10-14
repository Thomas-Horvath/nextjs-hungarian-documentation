/**
 * 📄 DocsSlugPage (dinamikus dokumentációs oldal)
 *
 * Ez az oldal felelős egy konkrét dokumentációs oldal (MDX fájl) betöltéséért és megjelenítéséért
 * a `/docs/[...slug]` útvonal alapján.
 *
 * 🧭 Fő funkciói:
 * - A slug alapján betölti a megfelelő MDX fájlt a `docs/` könyvtárból
 * - Feldolgozza a frontmatter metaadatokat (title, description, related, stb.)
 * - Megjeleníti az oldalt React komponensekkel
 * - Breadcrumb navigációt generál a felhasználónak
 * - Kezeli az „AppOnly” és „PagesOnly” MDX komponenseket (App/Pages Router specifikus tartalom)
 * - Feldolgozza a `related.links` mezőt és linkkártyákat renderel
 *
 * 📌 Példa URL:
 * /docs/app/getting-started
 *
 * Ehhez a rendszer betölti:
 * /docs/01-app/01-getting-started.mdx
 *
 * 🧾 Példa frontmatter a fájl tetején:
 * ---
 * title: Getting Started
 * description: Első lépések az App Routerrel
 * related:
 *   title: Kapcsolódó oldalak
 *   links:
 *     - app/routing
 *     - app/layout
 * ---
 *
 * ✨ Használt eszközök:
 * - fs (Node.js) → fájlok olvasására
 * - compileMDX (next-mdx-remote/rsc) → MDX → React konvertálásra
 * - remarkGfm → GitHub-stílusú markdown támogatásra
 * - mdxComponents → egyedi MDX komponensek támogatása (pl. Image)
 * - Lucide ikonok → jelölésekhez
 * - Breadcrumb logika → címek frontmatterből
 * - Related linkek → belső hivatkozások feldolgozása
 *
 * 📦 Adatfolyam röviden:
 * 1️⃣  A dinamikus route kap egy `slug` paramétert
 * 2️⃣  A `resolveDocFile` + `restoreOriginalSlug` alapján megtaláljuk a fájlt
 * 3️⃣  A fájlt beolvassuk → MDX-re fordítjuk → frontmatter és content szétválik
 * 4️⃣  Rendereljük az oldalt tartalommal, extra tartalommal és kapcsolódó linkekkel
 * 5️⃣  A breadcrumb-hoz a `getTitleForSlug` adja vissza a címeket
 */


import fs from "fs";
import { compileMDX } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/lib/mdxComponents";
import remarkGfm from "remark-gfm";
import type { Metadata } from "next";
import { Check, X as Cross, Info, AlertTriangle } from "lucide-react";
import type { LucideProps } from "lucide-react";
import Link from "next/link";
import {
  resolveDocFile,
  restoreOriginalSlug,
  restoreOriginalSourcePath,
  getTitleForSlug,
  resolveRelatedLinks,
} from "@/lib/docs-utils";
import { generatePageMetadata } from "@/lib/metadata";




/**
 * 📜 DocFrontmatter
 *
 * Meghatározza az MDX fájlok elején található frontmatter mezők típusát.
 * Ezek a mezők metaadatként szolgálnak az oldalhoz.
 */
export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  return generatePageMetadata(slug ?? []);
};

/**
 * 📜 DocFrontmatter
 *
 * Meghatározza az MDX fájlok elején található frontmatter mezők típusát.
 * Ezek a mezők metaadatként szolgálnak az oldalhoz.
 */
export interface DocFrontmatter {
  title?: string;
  description?: string;
  source?: string;
  related?: {
    title?: string;
    description?: string;
    links?: string[];
  };
};




/**
 * 🧭 DocsSlugPage
 *
 * Ez maga az oldal, ami a dinamikus `slug` alapján rendereli
 * a dokumentáció tartalmát.
 */
export default async function DocsSlugPage({
  params
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const slugParts = slug ?? [];
  // 🪄 Megfelelő fájl kikeresése a slug alapján
  const filePath = resolveDocFile(restoreOriginalSlug(slugParts));
  if (!filePath) {
    return <div>404 - Az oldal nem található.</div>;
  }





  // *---------------
  // 🧭 Ellenőrizzük, melyik dokumentációs részben vagyunk (App vagy Pages Router)
  const isAppSection = slugParts[0] === "app";
  const isPagesSection = slugParts[0] === "pages";

  /**
 * 🧩 Komponensek, amiket az MDX fájlban lehet használni
 * - AppOnly és PagesOnly → szekciók feltételes megjelenítéséhez
 * - Image → saját MDX képképernyő
 * - Lucide ikonok → figyelmeztetés, infó, jelölés, stb.
 */
  const components = {
    AppOnly: ({ children }: { children: React.ReactNode }) => {
      if (!isAppSection) return null;
      return <>{children}</>;
    },
    PagesOnly: ({ children }: { children: React.ReactNode }) => {
      if (!isPagesSection) return null;
      return <>{children}</>;
    },
    Image: mdxComponents.Image, // ← a képes komponensed megmaradhat központilag

    Check: (props: LucideProps) => <Check {...props} />,
    Cross: (props: LucideProps) => <Cross {...props} />,
    Info: (props: LucideProps) => <Info {...props} />,
    Alert: (props: LucideProps) => <AlertTriangle {...props} />,
  };

  const source = fs.readFileSync(filePath, "utf8");
  const { content, frontmatter } = await compileMDX<DocFrontmatter>({
    source,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
    components,
  });

  /**
   * 🧩 Extra tartalom betöltése, ha van `source` mező a frontmatterben
   * 
   * Ez lehetővé teszi, hogy egy MDX oldal másik fájl tartalmát is beemelje.
   * Hasznos közös részek, sablonok vagy példák újrahasznosításához.
   */
  let extraContent = null;
  if (frontmatter?.source) {
    const refPath = restoreOriginalSourcePath(frontmatter.source);
    if (fs.existsSync(refPath)) {
      const refSource = fs.readFileSync(refPath, "utf8");
      const { content: refContent } = await compileMDX({
        source: refSource,
        options: {
          parseFrontmatter: true,
          mdxOptions: { remarkPlugins: [remarkGfm] },
        },
        components,
      });
      extraContent = refContent;
    }
  };





  return (
    <main className="max-w-[1200px] mx-auto px-6 lg:px-12 py-8 prose prose-h1:text-4xl prose-h2:text-2xl prose-h3:text-xl
                     prose-headings:font-bold prose-invert
                     hover:prose-a:text-blue-300 prose-a:text-blue-400 prose-headings:text-gray-100
                     prose-p:text-gray-300">

      {/* Breadcrumb navigáció */}
      <nav className="mt-12 lg:mt-6 mb-6 text-sm text-gray-400">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <a href="/docs" className="hover:text-blue-400">Next.js Docs</a>
          </li>
          {slugParts.map((_, index) => {
            const currentSlug = slugParts.slice(0, index + 1);
            const href = `/docs/${currentSlug.join("/")}`;
            const title = getTitleForSlug(currentSlug) ?? currentSlug.at(-1);

            return (
              <li key={href} className="flex items-center">
                <span className="mx-1">›</span>
                {index === slugParts.length - 1 ? (
                  <span className="text-blue-400">{title}</span>
                ) : (
                  <Link href={href} className="hover:text-blue-400">{title}</Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Oldalcím és leírás */}
      {frontmatter?.title && <h1>{frontmatter.title}</h1>}
      {frontmatter?.description && <p>{frontmatter.description}</p>}

      {/* 📖 MDX tartalom renderelése */}
      {content}

      {/* 🧩 Extra tartalom renderelése, ha van */}
      {extraContent && (
        <div className="mt-2 pt-6 border-t border-gray-700">
          {extraContent}
        </div>
      )}

      {/* 🔗 Kapcsolódó oldalak blokk */}
      {frontmatter?.related?.links && frontmatter.related.links.length > 0 && (
        <section className="mt-12">
          {frontmatter.related.title && (
            <h2 className="mb-2 text-2xl font-bold text-gray-100">
              {frontmatter.related.title}
            </h2>
          )}
          {frontmatter.related.description && (
            <p className="mb-4 text-gray-400">{frontmatter.related.description}</p>
          )}

          {(() => {
            const links = resolveRelatedLinks(frontmatter.related.links);

            // ha csak egy link van, egy kártya széltében
            if (links.length === 1) {
              const link = links[0];
              return (
                <a
                  href={link.href}
                  className="inline-block
                             p-6 rounded-lg
                             bg-gray-900 border border-gray-800 hover:bg-gray-800
                             transition"
                >
                  <h3 className="text-lg font-semibold text-blue-400 hover:text-blue-300">
                    {link.title}
                  </h3>
                </a>
              );
            }

            //  ha több link van, gridben rendezzük
            if (links.length > 1) { }
            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="block
                               p-4 rounded-lg
                               bg-gray-900 border border-gray-800 hover:bg-gray-800
                               transition"
                  >
                    <h3 className="text-lg font-semibold text-blue-400 hover:text-blue-300">
                      {link.title}
                    </h3>
                  </a>
                ))}
              </div>
            );
          })()}
        </section>
      )}
    </main>
  );
};
