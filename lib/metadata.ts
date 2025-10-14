import type { Metadata } from "next";
import { getTitleForSlug, getDescriptionForSlug } from "./docs-utils";

/**
 * 📄 generatePageMetadata
 * 
 * Ez a függvény **automatikusan legenerálja a Next.js oldalhoz tartozó metaadatokat**
 * (pl. SEO `<title>` és `<meta description>`) a `docs/` mappában található 
 * MDX fájlok frontmatter mezői alapján.
 * 
 * 🔸 Használat:
 * - A Next.js `generateMetadata` API-ban hívjuk meg (page.tsx fájlban)
 * - Paraméterként megkapja a dinamikus route slugját (pl. ["app", "getting-started"])
 * - A slugot a rendszer a megfelelő MDX fájlhoz rendeli
 * - Kinyeri belőle a `title` és `description` mezőket a frontmatterből
 * 
 * 📌 Példa frontmatter:
 * ---
 * title: Getting Started
 * description: Első lépések az App Routerrel
 * ---
 * 
 * 🪄 Visszatérési érték:
 * - `Metadata` objektum, amit a Next.js automatikusan beépít a head részbe.
 * - Ha nincs title vagy description a frontmatterben,
 *   alapértelmezett értékeket használ (globális fallback).
 * 
 * ✅ Előny:
 * - Nem kell kézzel beállítani minden oldalon a SEO metaadatokat
 * - Automatikusan szinkronban marad a dokumentáció tartalmával
 */
export function generatePageMetadata(slugParts: string[]): Metadata {
    const title = getTitleForSlug(slugParts);
    const description = getDescriptionForSlug(slugParts);

    return {
        title: title ?? "Next.js Magyar Dokumentáció",
        description:
            description ??
            "Fedezd fel a Next.js hivatalos dokumentációját magyar nyelven — magyarázatokkal és példákkal.",
    };
}
