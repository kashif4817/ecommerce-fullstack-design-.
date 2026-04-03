"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import {
  LayoutDashboard,
  Package,
  Tag,
  Bell,
  Search,
  Menu,
  X,
  ChevronLeft,
  ArrowLeft,
  Lock,
  ChevronDown,
  BookOpen,
  FolderTree,
} from "lucide-react";

const navItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: Package,
    children: [
      { name: "Catalog",    href: "/admin/products/catalog", icon: BookOpen },
    ],
  },
  {
    name: "Categories",
    href: "/admin/categories",
    icon: FolderTree,
  },
];

export default function AdminLayout({ children }) {
  const [isCollapsed,  setIsCollapsed]  = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  // track which parent menus are open
  const [openMenus, setOpenMenus] = useState({});

  const router   = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useAuth();
  const isUnlockRoute = pathname === "/admin/unlock";

  // Protect admin routes - redirect if not admin
  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Don't render content if not admin
  if (!user || user.role !== 'admin') {
    return null;
  }

  // auto-open parent if a child route is active
  useEffect(() => {
    const initial = {};
    navItems.forEach(item => {
      if (item.children && pathname.startsWith(item.href)) {
        initial[item.href] = true;
      }
    });
    setOpenMenus(initial);
  }, []);  // only on mount

  useEffect(() => setIsMobileOpen(false), [pathname]);

  const toggleMenu = (href) => {
    setOpenMenus(prev => ({ ...prev, [href]: !prev[href] }));
  };

  const handleLock = async () => {
    try { await fetch("/api/admin/pin", { method: "DELETE" }); } catch {}
    finally { router.replace("/admin/unlock"); router.refresh(); }
  };

  const isActive = (item) => {
    if (item.href === "/admin") return pathname === "/admin";
    return pathname.startsWith(item.href);
  };

  /* ── Single nav item (no children) ── */
  const NavItem = ({ item, mobile = false, depth = 0 }) => {
    const active   = isActive(item);
    const showLabel = !isCollapsed || mobile;

    return (
      <Link
        href={item.href}
        className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150
          ${depth > 0 ? "pl-9" : ""}
          ${active
            ? depth > 0
              ? "bg-zinc-800 text-white"
              : "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
            : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
          }`}
      >
        <item.icon
          size={depth > 0 ? 14 : 18}
          className={active ? "text-white" : "text-zinc-500 group-hover:text-zinc-300 transition-colors"}
        />
        {showLabel && <span className={depth > 0 ? "text-xs" : ""}>{item.name}</span>}
        {active && showLabel && depth === 0 && (
          <div className="absolute right-3 h-1.5 w-1.5 rounded-full bg-white/70" />
        )}
      </Link>
    );
  };

  /* ── Parent nav item (has children) ── */
  const NavParent = ({ item, mobile = false }) => {
    const active     = isActive(item);
    const isOpen     = openMenus[item.href] ?? false;
    const showLabel  = !isCollapsed || mobile;

    return (
      <div>
        {/* Parent row — clicking navigates AND toggles submenu */}
        <button
          onClick={() => {
            router.push(item.href);
            if (!isCollapsed || mobile) toggleMenu(item.href);
          }}
          className={`group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150
            ${active
              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
              : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
            }`}
        >
          <item.icon
            size={18}
            className={active ? "text-white" : "text-zinc-500 group-hover:text-zinc-300 transition-colors"}
          />
          {showLabel && (
            <>
              <span className="flex-1 text-left">{item.name}</span>
              <ChevronDown
                size={13}
                className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""} ${active ? "text-white/70" : "text-zinc-600"}`}
              />
            </>
          )}
        </button>

        {/* Children — only show when not collapsed (or mobile) */}
        {(isOpen && (!isCollapsed || mobile)) && (
          <div className="mt-0.5 space-y-0.5 ml-1 border-l border-zinc-800 pl-2">
            {item.children.map(child => (
              <NavItem key={child.href} item={child} mobile={mobile} depth={1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  /* ── Render a nav entry (parent or leaf) ── */
  const RenderNavEntry = ({ item, mobile = false }) =>
    item.children
      ? <NavParent key={item.href} item={item} mobile={mobile} />
      : <NavItem   key={item.href} item={item} mobile={mobile} />;

  /* ────────────────────────────────────────── */
  if (isUnlockRoute) {
    return <div className="min-h-screen bg-slate-50">{children}</div>;
  }

  const SIDEBAR_W  = isCollapsed ? "w-[68px]" : "w-[240px]";
  const SIDEBAR_PL = isCollapsed ? "lg:pl-[68px]" : "lg:pl-[240px]";

  return (
    <div className="min-h-screen bg-[#f0f2f5] text-zinc-900">

      {/* ═══════════ SIDEBAR (desktop) ═══════════ */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 hidden flex-col bg-[#151c2c] transition-all duration-300 lg:flex ${SIDEBAR_W}`}
      >
        {/* Brand */}
        <div className={`flex h-[64px] items-center border-b border-zinc-800 ${isCollapsed ? "justify-center px-2" : "px-5 justify-between"}`}>
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                  <path d="M3 6h18" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-white leading-tight">Ecommrace</p>
                <p className="text-[11px] text-zinc-500 leading-tight">Product Manager</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center justify-center w-7 h-7 rounded-md hover:bg-zinc-800 text-zinc-500 hover:text-white transition-colors"
          >
            <ChevronLeft size={16} className={`transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {!isCollapsed && (
            <p className="px-3 mb-3 text-[10px] font-semibold tracking-widest text-zinc-600 uppercase">
              Main Menu
            </p>
          )}
          {navItems.map(item => (
            <RenderNavEntry key={item.href} item={item} />
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-3 pb-5 space-y-1 border-t border-zinc-800 pt-3">
          <button
            onClick={handleLock}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-zinc-500 hover:bg-zinc-800 hover:text-amber-400 transition-all text-sm ${isCollapsed ? "justify-center" : ""}`}
          >
            <Lock size={18} />
            {!isCollapsed && <span>Lock Admin</span>}
          </button>
          <Link
            href="/"
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-zinc-500 hover:bg-zinc-800 hover:text-blue-400 transition-all text-sm ${isCollapsed ? "justify-center" : ""}`}
          >
            <ArrowLeft size={18} />
            {!isCollapsed && <span>Back to Store</span>}
          </Link>
        </div>
      </aside>

      {/* ═══════════ MAIN AREA ═══════════ */}
      <div className={`flex min-h-screen flex-col transition-all duration-300 ${SIDEBAR_PL}`}>

        {/* Header */}
        <header className="sticky top-0 z-40 h-[60px] border-b border-zinc-200 bg-white shadow-sm px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden text-zinc-600 hover:text-zinc-900 transition-colors"
            >
              <Menu size={22} />
            </button>
            <div className="relative hidden md:block w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={15} />
              <input
                type="text"
                placeholder="Search products, categories..."
                className="w-full h-9 pl-9 pr-4 bg-zinc-100 border border-transparent focus:border-zinc-300 focus:bg-white rounded-lg text-sm placeholder-zinc-400 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-5">
            <button className="relative text-zinc-500 hover:text-zinc-700 transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center">
                <span className="text-[9px] font-bold text-white">3</span>
              </span>
            </button>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="h-9 w-9 overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-white">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-zinc-900 leading-tight">Administrator</p>
                <p className="text-[11px] text-emerald-600 font-medium">● Online</p>
              </div>
              <ChevronDown size={14} className="text-zinc-400 hidden sm:block" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* ═══════════ MOBILE SIDEBAR ═══════════ */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="fixed inset-0 bg-zinc-950/70 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
          <nav className="fixed inset-y-0 left-0 w-[240px] bg-[#151c2c] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between h-[64px] px-5 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                    <path d="M3 6h18" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Ecommrace</p>
                  <p className="text-[11px] text-zinc-500">Product Manager</p>
                </div>
              </div>
              <button onClick={() => setIsMobileOpen(false)} className="text-zinc-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              <p className="px-3 mb-3 text-[10px] font-semibold tracking-widest text-zinc-600 uppercase">Main Menu</p>
              {navItems.map(item => (
                <RenderNavEntry key={item.href} item={item} mobile />
              ))}
            </div>

            <div className="px-3 pb-5 space-y-1 border-t border-zinc-800 pt-3">
              <button onClick={handleLock} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-zinc-500 hover:bg-zinc-800 hover:text-amber-400 transition-all text-sm">
                <Lock size={18} /><span>Lock Admin</span>
              </button>
              <Link href="/" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-zinc-500 hover:bg-zinc-800 hover:text-blue-400 transition-all text-sm">
                <ArrowLeft size={18} /><span>Back to Store</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}