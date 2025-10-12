"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavNode } from "@/lib/getDocsNavTree";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Sidebar({ tree }: { tree: NavNode[] }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      {/* 🧭 Fix header mobilon */}
      <div className="fixed flex items-center justify-between left-0 lg:hidden top-0 z-50
                      px-4 py-3 w-full
                      bg-[#111111] border-b border-gray-800">
        <Link href={"/"}>
          <h2 className="flex items-baseline text-2xl font-extrabold tracking-tight">
            Next<span className="ml-1 text-base text-blue-400">.js</span> 15
          </h2>
        </Link>
        <button
          className="p-2"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Menü megnyitása"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* 🖥️ Sidebar (desktopon fixen) */}
      <aside
        className={`flex-col hidden lg:flex overflow-hidden
                    lg:w-[450px]
                    bg-[#111111] border-gray-800 border-r text-white`}
      >
        <div className="px-6 py-4 border-b border-gray-800">
          <Link href={"/"}>
            <h2 className="flex items-baseline text-5xl font-extrabold tracking-tight">
              Next
              <span className="ml-1 text-lg text-blue-400">.js</span>
              &nbsp; 15
            </h2>
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto
                        pb-4 pl-4
                        scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          <SidebarTree
            nodes={tree}
            pathname={pathname}
            level={0}
          />
        </div>
      </aside>

      {/* 📱 Teljes képernyős hamburger menü (mobil) */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 flex flex-col bg-[#111111]"
        >
          {/* Header a menü tetején */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
            <Link href={"/"} onClick={() => setMenuOpen(false)}>
              <h2 className="flex items-baseline text-2xl font-extrabold tracking-tight">
                Next<span className="ml-1 text-base text-blue-400">.js</span> 15
              </h2>
            </Link>
            <button
              className="p-2"
              onClick={() => setMenuOpen(false)}
              aria-label="Menü bezárása"
            >
              <X size={28} />
            </button>
          </div>

          {/* Menü tartalom */}
          <div className="flex-1 overflow-y-auto
                          pb-4 pl-4
                          scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            <SidebarTree
              nodes={tree}
              pathname={pathname}
              level={0}
              onClickLink={() => setMenuOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}





function SidebarTree({
  nodes,
  pathname,
  level,
  onClickLink,
}: {
  nodes: NavNode[];
  pathname: string;
  level: number;
  onClickLink?: () => void;
}) {
  return (



    <ul className={`space-y-1 py-4 ${level > 0 ? "pl-3" : ""}`}>
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
              : "font-normal text-sm mb-1",
        ].join(" ");

        return (
          <li key={node.path || node.title}>
            {cleanPath && (
              <Link href={cleanPath} className={linkClasses} onClick={onClickLink} >
                {node.title}
              </Link>
            )}

            {node.children && node.children.length > 0 && (
              <SidebarTree
                nodes={node.children}
                pathname={pathname}
                level={level + 1}
                onClickLink={onClickLink}
              />
            )}
          </li>
        );
      })}
    </ul>

  );
}
