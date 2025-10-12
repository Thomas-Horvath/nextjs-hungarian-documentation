import Image, { ImageProps } from "next/image";

import React from "react";

const CDN_PREFIX = process.env.NEXT_PUBLIC_CDN_URL || "";

interface MDXImageProps extends Partial<ImageProps> {
  srcLight?: string;
  srcDark?: string;
}

function normalizeSrc(src?: string | any): string {
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
}
// MDX komponens mapping típusosítva
export const mdxComponents = {
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