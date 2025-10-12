"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavNode } from "@/lib/getDocsNavTree";

export default function Sidebar({ tree }: { tree: NavNode[] }) {
  const pathname = usePathname();
  return <SidebarTree nodes={tree} pathname={pathname} level={0} />;
}

function SidebarTree({
  nodes,
  pathname,
  level,
}: {
  nodes: NavNode[];
  pathname: string;
  level: number;
}) {
  return (
    <ul className={`space-y-1 ${level > 0 ? "pl-3" : ""}`}>
      {nodes.map((node) => {
        const cleanPath = node.path
          ? node.path
              .split("/")
              .map((part) => part.replace(/^\d+-/, ""))
              .join("/")
          : null;
        const isActive = cleanPath === pathname;

        const linkClasses = [
          "block px-2 py-1 transition-colors duration-150",
          isActive
            ? "text-blue-400 bg-gray-800"
            : "text-gray-300 hover:text-white hover:bg-gray-800",
          level === 0
            ? "font-bold text-white text-xl  mt-3 mb-1"
            : level === 1 
            ? "text-white font-bold text-lg"
            : "font-normal text-sm",
        ].join(" ");

        return (
          <li key={node.path || node.title}>
            {cleanPath? (
              <Link href={cleanPath} className={linkClasses}>
                {node.title}
              </Link>
            ) : (
              <span className="font-bold text-gray-400 text-sm">
                {node.title}
              </span>
            )}

            {node.children && node.children.length > 0 && (
              <SidebarTree
                nodes={node.children}
                pathname={pathname}
                level={level + 1}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}
