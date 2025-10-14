import Image, { ImageProps } from "next/image";
import React from "react";
const CDN_PREFIX = process.env.NEXT_PUBLIC_CDN_URL || "";


/**
 * 🌄 MDXImageProps
 * 
 * Ez a típus a képek MDX-komponenséhez készült.
 * Az alap `ImageProps`-ot (amit a Next.js Image komponens használ) 
 * egészítjük ki két extra mezővel:
 * 
 * - `srcLight` → világos módhoz használt kép
 * - `srcDark` → sötét módhoz használt kép
 */
interface MDXImageProps extends Partial<ImageProps> {
  srcLight?: string;
  srcDark?: string;
};

/**
 * 🧾 StaticLike típus
 * 
 * Ez a típus azt írja le, milyen formában érkezhet hozzánk a kép.
 * A kép lehet:
 * - egyszerű URL (string)
 * - vagy importált statikus kép (pl. import img from "./kep.png")
 *   — ilyen esetben az `img.default.src` vagy `img.src` mezőben van az URL.
 */
type StaticLike =
  | string
  | {
    default?: { src?: string };
    src?: string;
  };



/**
* 🪄 normalizeSrc
* 
* Ez a segédfüggvény bármilyen képformátumból előállít egy
* **megbízható, használható URL-t**, amit a <Image> komponens megért.
* 
* 🧭 Lépések:
* 1. Ha nincs semmi, üres stringet ad vissza
* 2. Ha sima URL (string), akkor:
*    - ha `http`-val kezdődik → simán visszaadjuk
*    - ha nem → hozzáfűzzük a `CDN_PREFIX`-et (CDN-es eléréshez)
* 3. Ha `default.src` mező van → azt használjuk
* 4. Ha `src` mező van → azt használjuk
*/
function normalizeSrc(src?: StaticLike): string {
  if (!src) return "";
  if (typeof src === "string") {
    if (src.startsWith("http")) return src;
    return `${CDN_PREFIX}${src}`;
  }
  // ha default-ban van
  if (src.default && src.default.src) return src.default.src;
  // ha sima StaticImport
  if (src.src) return src.src;
  return "";
};


/**
 * 🖼️ mdxComponents
 * 
 * Ez az objektum tartalmazza azokat a React komponenseket,
 * amelyeket MDX fájlokban közvetlenül használhatunk.
 * 
 * Példa MDX fájlban:
 * ```mdx
 * # Kép példa
 * <Image src="/hero.png" alt="Hero kép" />
 * ```
 * 
 * 🧭 Hogyan működik:
 * - Az MDX fájlban használt `<Image>` hivatkozás **erre a komponensre mutat**.
 * - A komponens eldönti, hogy `srcLight` vagy `srcDark` képet használjon.
 * - A `normalizeSrc` segítségével mindig helyes URL-t állít elő.
 * - A Next.js `<Image>` komponens gondoskodik az optimalizálásról.
 */
export const mdxComponents: Record<
  string,
  React.ComponentType<{ children?: React.ReactNode } | MDXImageProps>
> = {
  Image: (props: MDXImageProps) => {
    const { alt, srcLight, srcDark, width, height, ...rest } = props;
    const resolvedSrc = normalizeSrc(srcLight || props.src);
    const resolvedDark = normalizeSrc(srcDark);

    return (
      <div className="my-4">
        <Image
          alt={alt ?? ""}
          src={(resolvedDark || resolvedSrc || "") as string}
          width={Number(width) || 800}
          height={Number(height) || 600}
          className="rounded-lg shadow-sm"
          {...rest}
        />
      </div>
    );
  },
};