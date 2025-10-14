"use client";

import { useEffect } from "react";
import Prism from "prismjs";

// ha más nyelveket is akarsz, importáld őket:
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-json";

export default function PrismHighlighter() {
  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return null;
}
