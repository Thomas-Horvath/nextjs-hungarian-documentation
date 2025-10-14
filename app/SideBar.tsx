"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavNode } from "@/lib/getDocsNavTree";
import { useState } from "react";
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";

export default function Sidebar({ tree }: { tree: NavNode[] }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // 🧭 Kiválasztott dokumentáció típus (alapértelmezett: app)
  const [docType, setDocType] = useState<"app" | "pages">("app");

  // 📂 nyitott csomópontok állapota
  const [openNodes, setOpenNodes] = useState<Set<string>>(new Set());


  const toggleNode = (path: string) => {
    setOpenNodes((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  // 🪄 Szűrés a megfelelő dokumentációs részre
  const filteredTree = tree.filter(
    (node) =>
      node.title !== "App" && (
        node.path === "/docs/01-app" && docType === "app" ||
        node.path === "/docs/02-pages" && docType === "pages" ||
        (node.path !== "/docs/01-app" && node.path !== "/docs/02-pages")
      )
  );


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
                        pb-4 pl-4 pr-2
                        scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          {/* 📌 Dokumentáció választó */}
          <select
            value={docType}
            onChange={(e) => setDocType(e.target.value as "app" | "pages")}
            className="my-2 p-2 rounded w-4/6
                       text-sm
                       bg-[#222] border border-gray-700 focus:outline-none focus:ring-2
                       focus:ring-blue-500 text-white"
          >
            <option value="app">App Router</option>
            <option value="pages">Pages Router</option>
          </select>



          <SidebarTree
            nodes={filteredTree}
            pathname={pathname}
            level={0}
            openNodes={openNodes}
            toggleNode={toggleNode}
          />
        </div>
      </aside >

      {/* 📱 Teljes képernyős hamburger menü (mobil) */}
      {
        menuOpen && (
          <div
            className="fixed inset-0 z-40 flex flex-col lg:hidden bg-[#111111]"
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
            <div className="flex-1 lg:hidden overflow-y-auto
                            pb-4 pl-4 pr-2
                            scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value as "app" | "pages")}
                className="my-2 p-2 rounded w-4/6
                           text-sm
                           bg-[#222] border border-gray-700 focus:outline-none focus:ring-2
                           focus:ring-blue-500 text-white"
              >
                <option value="app">App Router</option>
                <option value="pages">Pages Router</option>
              </select>
              <SidebarTree
                nodes={filteredTree}
                pathname={pathname}
                level={0}
                onClickLink={() => setMenuOpen(false)}
                openNodes={openNodes}
                toggleNode={toggleNode}
              />
            </div>
          </div>
        )
      }
    </>
  );
}





function SidebarTree({
  nodes,
  pathname,
  level,
  onClickLink,
  openNodes,
  toggleNode,
}: {
  nodes: NavNode[];
  pathname: string;
  level: number;
  onClickLink?: () => void;
  openNodes: Set<string>;
  toggleNode: (path: string) => void;
}) {
  return (
    <ul className={`space-y-1 py-2 ${level > 0 ? "pl-3" : ""}`}>
      {nodes.map((node) => {
        const cleanPath = node.path
          ? node.path
            .split("/")
            .map((part) => part.replace(/^\d+-/, ""))
            .join("/")
          : null;

        const isActive = cleanPath === pathname;
        const hasChildren = node.children && node.children.length > 0;
        const isOpen =
          level === 0
            ? true // mindig nyitva a 0. szint
            : node.path && openNodes.has(node.path);



        let fontClasses = "";

        if (level === 0) {
          fontClasses = "font-bold text-blue-400 text-xl";
        } else if (level === 1) {
          fontClasses = "text-blue-400 font-bold text-lg";
        } else {
          fontClasses = "font-normal text-gray-300";
        }

        if (hasChildren && level >= 2) {
          fontClasses = "font-semibold text-blue-400"; // felülírja a korábbit
        }

        const linkClasses = [
          "flex justify-between items-center px-2 py-1 transition-colors duration-150 cursor-pointer",
          isActive
            ? "text-blue-400 bg-gray-800"
            : "text-blue-400 hover:text-white hover:bg-gray-800",
          fontClasses,
          hasChildren && level >= 2
            ? "border-l-2 border-blue-400 bg-[#1a1a1a] hover:bg-[#222]"
            : "",
        ].join(" ");



        return (
          <li key={node.path || node.title}>
            <div className={linkClasses}>
              {cleanPath ? (
                <Link
                  href={cleanPath}
                  className="flex-1"
                  onClick={(e) => {
                    if (hasChildren && level >= 1) {
                 
                      toggleNode(node.path!);
                    } else {
                      onClickLink?.(); // bezárja a mobil menüt
                    }
                  }}
                >
                  {node.title}
                </Link>
              ) : (
                <span className="flex-1">{node.title}</span>
              )}

              {hasChildren && level > 0 && (
                isOpen ? (
                  <ChevronDown size={16} className="ml-2 text-gray-400" />
                ) : (
                  <ChevronRight size={16} className="ml-2 text-gray-400" />
                )
              )}
            </div>

            {/* ha nyitva van, akkor mutatjuk a gyerekeket */}
            {hasChildren && isOpen && (
              <SidebarTree
                nodes={node.children!}
                pathname={pathname}
                level={level + 1}
                onClickLink={onClickLink}
                openNodes={openNodes}
                toggleNode={toggleNode}
              />
            )}
          </li>
        );
      })}
    </ul>

  );
}
