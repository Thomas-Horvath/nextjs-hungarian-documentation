import fs from "fs";
import path from "path";

/**
 * 📂 resolveDocFile
 *
 * Ez a függvény egy megadott slug (URL útvonal darabjai) alapján megkeresi a hozzá
 * tartozó MDX fájlt a `docs/` könyvtárban.
 *
 * 🧭 Keresési sorrend:
 *  1. `/docs/index.mdx` — ha a slug üres (root dokumentáció)
 *  2. `/docs/[...slug]/index.mdx` — ha a slug egy mappára mutat
 *  3. `/docs/[...slug].mdx` — ha a slug konkrét fájlnévre mutat
 *
 * 📦 Visszatérési érték:
 *  - string (fájlrendszer útvonal), ha a fájl megtalálható
 *  - `null`, ha nem található semmi
 *
 * ✅ Használat:
 *  - Breadcrumbhoz
 *  - Metadata generáláshoz
 *  - Oldaltartalom betöltéséhez
 */
export function resolveDocFile(slug: string[]) {
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
}




/**
 * 🔄 restoreOriginalSlug
 *
 * Ez a függvény visszaalakítja a "megtisztított" slugot az eredeti,
 * fájlrendszerbeli névre, beleértve az MDX fájlnevek elején található sorszámokat is.
 *
 * Példa:
 * - URL slug: ["app", "getting-started"]
 * - Fájlrendszer: ["01-app", "01-getting-started"]
 *
 * 🧭 Lépések:
 *  - Beolvassa az aktuális mappa tartalmát
 *  - Megkeresi a megfelelő mappát vagy fájlt, amelynek neve sorszám + slug
 *  - A találatot fokozatosan építi fel (rekurzió nélkül, iteratívan)
 *
 * 📦 Visszatérési érték:
 *  - string[] — az eredeti fájlrendszerbeli slug (sorszámokkal)
 */

export function restoreOriginalSlug(cleaned: string[]) {
  const baseDir = path.join(process.cwd(), "docs");
  let currentPath = baseDir;
  const result: string[] = [];

  cleaned.forEach((segment, index) => {
    const entries = fs.readdirSync(currentPath);

    const dirMatch = entries.find(
      (e) =>
        fs.statSync(path.join(currentPath, e)).isDirectory() &&
        e.replace(/^\d+-/, "") === segment
    );

    const fileMatch = entries.find(
      (e) =>
        e.endsWith(".mdx") &&
        e.replace(/^\d+-/, "").replace(/\.mdx$/, "") === segment
    );
    // ha az utolsó slug egy fájlra mutat, azt használjuk
    if (index === cleaned.length - 1 && fileMatch) {
      result.push(fileMatch.replace(/\.mdx$/, ""));
      return;
    }

    // egyébként mappát próbálunk találni
    if (dirMatch) {
      result.push(dirMatch);
      currentPath = path.join(currentPath, dirMatch);
    } else {
      result.push(segment);
      currentPath = path.join(currentPath, segment);
    }
  });

  return result;
}

/**
 * 🧭 getTitleForSlug
 *
 * Megadott slughoz tartozó MDX fájlból kiolvassa a frontmatter `title` mezőjét.
 *
 * 🧾 Példa frontmatter:
 * ---
 * title: Getting Started
 * description: Első lépések az App Routerrel
 * ---
 *
 * 📦 Visszatérési érték:
 *  - string — a `title` értéke
 *  - `null` — ha a fájl nem található, vagy nincs `title`
 *
 * ✅ Használat:
 *  - Breadcrumb címekhez
 *  - Metaadat generáláshoz
 */
export function getTitleForSlug(slugParts: string[]): string | null {
  const filePath = resolveDocFile(restoreOriginalSlug(slugParts));
  if (!filePath) return null;

  const source = fs.readFileSync(filePath, "utf8");
  const match = source.match(/^---([\s\S]*?)---/);
  if (match) {
    const titleMatch = match[1].match(/title:\s*(.*)/);
    if (titleMatch) return titleMatch[1].trim();
  }
  return null;
};


/**
 * 📝 getDescriptionForSlug
 *
 * Megadott slughoz tartozó MDX fájlból kiolvassa a frontmatter `description` mezőjét.
 * 
 * 📦 Visszatérési érték:
 *  - string — a `description` értéke
 *  - `null` — ha a fájl nem található vagy nincs description
 *
 * ✅ Használat:
 *  - Metadata generálásnál
 *  - SEO optimalizálásnál
 */
export function getDescriptionForSlug(slugParts: string[]): string | null {
  const filePath = resolveDocFile(restoreOriginalSlug(slugParts));
  if (!filePath) return null;

  const source = fs.readFileSync(filePath, "utf8");
  const match = source.match(/^---([\s\S]*?)---/);
  if (match) {
    const descMatch = match[1].match(/description:\s*(.*)/);
    if (descMatch) return descMatch[1].trim();
  }
  return null;
};

/**
 * 📎 restoreOriginalSourcePath
 *
 * A frontmatter `source` mező értékét (pl. "app/telepites") átalakítja
 * abszolút fájlrendszerbeli elérési úttá.
 *
 * 🧭 Keresési logika:
 *  - Megpróbálja `source.mdx`-ként
 *  - Ha nem található, próbálja `source/index.mdx`-ként
 *
 * 📦 Visszatérési érték:
 *  - string — fájl elérési út
 *  - fallbackként visszaadja az első próbált útvonalat
 *
 * ✅ Használat:
 *  - Több MDX fájl összefűzéséhez
 *  - Reusable content (pl. közös szekciók) beillesztéséhez
 */
export function restoreOriginalSourcePath(source: string) {
  const segments = source.split("/");
  const restoredSegments = restoreOriginalSlug(segments);
  const baseDir = path.join(process.cwd(), "docs");

  const filePath = path.join(baseDir, ...restoredSegments) + ".mdx";
  if (fs.existsSync(filePath)) return filePath;

  const indexPath = path.join(baseDir, ...restoredSegments, "index.mdx");
  if (fs.existsSync(indexPath)) return indexPath;

  return filePath;
};


/**
 * 🔗 resolveRelatedLinks
 *
 * Egy MDX oldal frontmatter `related.links` mezőjében megadott hivatkozásokat feldolgozza:
 *  - Megkeresi az adott fájlt
 *  - Kiolvassa a `title` mezőt (ha van)
 *  - Összeállít egy tömböt link objektumokkal
 *
 * 🧾 Példa:
 * related:
 *   links:
 *     - app/getting-started
 *     - app/routing
 *
 * 📦 Visszatérési érték:
 *  - Array<{ title: string; href: string }>
 * 
 * ✅ Használat:
 *  - Oldalak végén „Kapcsolódó témák” blokk generálásához
 */
export function resolveRelatedLinks(links: string[]) {
  const result: { title: string; href: string }[] = [];

  for (const link of links) {
    const filePath = restoreOriginalSourcePath(link);
    if (fs.existsSync(filePath)) {
      const source = fs.readFileSync(filePath, "utf8");
      const frontmatter = source.match(/^---([\s\S]*?)---/);
      let title = link.split("/").pop() || "";

      if (frontmatter) {
        const titleMatch = frontmatter[1].match(/title:\s*(.*)/);
        if (titleMatch) title = titleMatch[1].trim();
      }

      result.push({ title, href: `/docs/${link}` });
    }
  }

  return result;
};
