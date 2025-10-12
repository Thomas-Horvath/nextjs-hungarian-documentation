import fs from "fs";
import path from "path";
import { compileMDX } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/lib/mdxComponents";
import remarkGfm from "remark-gfm";
import type { Metadata } from "next";
import { Check, X as Cross, Info, AlertTriangle } from "lucide-react";
import type { LucideProps } from "lucide-react";

export async function generateMetadata(
  { params }: { params: Promise<{ slug?: string[] }> },

): Promise<Metadata> {
  const { slug } = await params;
  const slugParts = slug ?? [];
  const originalSlug = restoreOriginalSlug(slugParts);
  const filePath = resolveDocFile(originalSlug);

  if (!filePath) {
    return {
      title: "Oldal nem található",
    };
  }

  // Frontmatter kiolvasása a fájlból
  const source = fs.readFileSync(filePath, "utf8");
  const match = source.match(/^---([\s\S]*?)---/);

  let pageTitle: string | undefined = undefined;
  let pageDescription: string | undefined = undefined;

  if (match) {
    const fm = match[1];
    const titleMatch = fm.match(/title:\s*(.*)/);
    const descMatch = fm.match(/description:\s*(.*)/);

    if (titleMatch) pageTitle = titleMatch[1].trim();
    if (descMatch) pageDescription = descMatch[1].trim();
  }

  return {
    title: pageTitle ?? "Next.js Magyar Dokumentáció",
    description:
      pageDescription ??
      "Fedezd fel a Next.js hivatalos dokumentációját magyar nyelven — magyarázatokkal és példákkal.",
  };
}


export interface DocFrontmatter {
  title?: string;
  description?: string;
  source?: string;
  related?: {
    title?: string;
    description?: string;
    links?: string[];
  };
}

export default async function DocsSlugPage({
  params
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const slugParts = slug ?? [];


  const isAppSection = slugParts[0] === "app";
  const isPagesSection = slugParts[0] === "pages";


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

  //  URL-ben megtisztított slug
  const originalSlug = restoreOriginalSlug(slugParts);

  const filePath = resolveDocFile(originalSlug);

  if (!filePath) {
    return <div>404 - Az oldal nem található.</div>;
  }




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



  // Ha van `source` mező → betöltjük a hivatkozott fájlt is
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

  }


  return (
    <main className="max-w-[1200px] mx-auto px-6 lg:px-12 py-8 prose prose-h1:text-4xl prose-h2:text-2xl prose-h3:text-xl
                     prose-headings:font-bold prose-invert
                     hover:prose-a:text-blue-300 prose-a:text-blue-400 prose-headings:text-gray-100
                     prose-p:text-gray-300">
      {frontmatter?.title && <h1>{frontmatter.title}</h1>}
      {frontmatter?.description && <p>{frontmatter.description}</p>}
      {content}
      {extraContent && (
        <div className="mt-8 pt-6 border-t border-gray-700">
          {extraContent}
        </div>
      )}



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

}

// 🧭 fájlkeresés az eredeti számozott slug alapján
function resolveDocFile(slug: string[]) {
  const baseDir = path.join(process.cwd(), "docs");
  if (slug.length === 0) {
    const index = path.join(baseDir, "index.mdx");
    if (fs.existsSync(index)) return index;
  }

  const indexInDir = path.join(baseDir, ...slug, "index.mdx");
  if (fs.existsSync(indexInDir)) return indexInDir;

  const file = path.join(baseDir, ...slug) + ".mdx";
  if (fs.existsSync(file)) return file;

  return null;
};




function restoreOriginalSourcePath(source: string) {
  const segments = source.split("/");
  const restoredSegments = restoreOriginalSlug(segments);
  const baseDir = path.join(process.cwd(), "docs");

  const filePath = path.join(baseDir, ...restoredSegments) + ".mdx";
  if (fs.existsSync(filePath)) {
    return filePath;
  }

  // 🟡 ha nincs közvetlen mdx fájl → nézzük meg, van-e index.mdx az adott mappában
  const indexPath = path.join(baseDir, ...restoredSegments, "index.mdx");
  if (fs.existsSync(indexPath)) {
    return indexPath;
  }

  return filePath; // fallback
}






// 🧹 URL → fájlnév visszaalakító (hozzáteszi a sorszámot)
function restoreOriginalSlug(cleaned: string[]) {
  const baseDir = path.join(process.cwd(), "docs");

  let currentPath = baseDir;
  const result: string[] = [];

  cleaned.forEach((segment, index) => {
    const entries = fs.readdirSync(currentPath);

    // Ha ez az utolsó szegmens, fájlt is keresünk
    if (index === cleaned.length - 1) {
      // 1️⃣ Először fájlt keresünk (pl. "01-telepites.mdx")
      const fileMatch = entries.find(
        (e) =>
          e.endsWith(".mdx") &&
          e.replace(/^\d+-/, "").replace(/\.mdx$/, "") === segment
      );

      if (fileMatch) {
        result.push(fileMatch.replace(/\.mdx$/, "")); // fájlnév kiterjesztés nélkül
        return;
      }

      // 2️⃣ Ha nincs fájl, próbáljuk mappaként (index.mdx lehet benne)
      const dirMatch = entries.find(
        (e) =>
          fs.statSync(path.join(currentPath, e)).isDirectory() &&
          e.replace(/^\d+-/, "") === segment
      );
      if (dirMatch) {
        result.push(dirMatch);
        currentPath = path.join(currentPath, dirMatch);
      } else {
        result.push(segment);
        currentPath = path.join(currentPath, segment);
      }
    } else {
      // 🔹 Köztes szegmenseknél mappát keresünk
      const dirMatch = entries.find(
        (e) =>
          fs.statSync(path.join(currentPath, e)).isDirectory() &&
          e.replace(/^\d+-/, "") === segment
      );
      if (dirMatch) {
        result.push(dirMatch);
        currentPath = path.join(currentPath, dirMatch);
      } else {
        result.push(segment);
        currentPath = path.join(currentPath, segment);
      }
    }
  });

  return result;
};


function resolveRelatedLinks(links: string[]): { title: string; href: string }[] {
  const result: { title: string; href: string }[] = [];

  for (const link of links) {
    const filePath = restoreOriginalSourcePath(link);
    if (fs.existsSync(filePath)) {
      const source = fs.readFileSync(filePath, "utf8");
      const frontmatter = source.match(/^---([\s\S]*?)---/);
      let title = link.split("/").pop() || "";

      // próbáljuk kiolvasni a title-t frontmatterből
      if (frontmatter) {
        const titleMatch = frontmatter[1].match(/title:\s*(.*)/);
        if (titleMatch) {
          title = titleMatch[1].trim();
        }
      }

      // a href a cleaned slug alapján (pl. /docs/app/getting-started/installation)
      const href = `/docs/${link}`;

      result.push({ title, href });
    }
  }

  return result;
}
