import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface NavNode {
  title: string;
  path?: string;
  children?: NavNode[];
}

export function getDocsNavTree(): NavNode[] {
  const rootDir = path.join(process.cwd(), "docs");

  const nodes: NavNode[] = [];

  // 🏠 1. — Gyökér index.mdx kezelése
  const rootIndex = path.join(rootDir, "index.mdx");
  if (fs.existsSync(rootIndex)) {
    const source = fs.readFileSync(rootIndex, "utf8");
    const { data } = matter(source);
    const title = data.title || "Bevezetés"; // alapértelmezett cím
    nodes.push({
      title,
      path: "/docs",
    });
  }

  // 📂 2. — Mappák bejárása
  nodes.push(...walk(rootDir));

  return nodes;
}

// 📁 Rekurzív fájlbejárás
function walk(dir: string, baseRoute = "/docs"): NavNode[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  // rendezés szám előtag alapján (01-, 02- stb.)
  entries.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

  const nodes: NavNode[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const slugName = entry.name.replace(/\.mdx$/, "");
    const displayName = slugName.replace(/^\d+[-_]?/, "");

    // 📂 Mappa
    if (entry.isDirectory()) {
      const children = walk(fullPath, `${baseRoute}/${entry.name}`);
      const indexFile = path.join(fullPath, "index.mdx");
      let title = formatTitle(displayName);
      let pathUrl: string | undefined;

      if (fs.existsSync(indexFile)) {
        const src = fs.readFileSync(indexFile, "utf8");
        const { data } = matter(src);
        title = data.title || formatTitle(displayName);
        pathUrl = `${baseRoute}/${entry.name}`;
      }

      nodes.push({
        title,
        path: pathUrl,
        children,
      });
    }

    // 📄 Fájl (nem index)
    else if (entry.isFile() && entry.name.endsWith(".mdx") && entry.name !== "index.mdx") {
      const source = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(source);
      const title = data.title || formatTitle(displayName);
      const pathUrl = `${baseRoute}/${slugName}`;
      nodes.push({ title, path: pathUrl });
    }
  }

  return nodes;
}

function formatTitle(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, " ");
}
