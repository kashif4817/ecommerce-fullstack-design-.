"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  ChevronDown,
  Globe,
  Headphones,
  Heart,
  House,
  List,
  Menu,
  MessageSquare,
  Package,
  Search,
  ShoppingCart,
  User,
  X,
} from "lucide-react";

const mobilePrimaryLinks = [
  { icon: House, label: "Home", href: "/" },
  { icon: List, label: "Categories", href: "/products" },
  { icon: Heart, label: "Favorites", href: "#" },
  { icon: Package, label: "My orders", href: "#" },
];

const mobileSecondaryLinks = [
  { icon: Globe, label: "English | USD", href: "#" },
  { icon: Headphones, label: "Contact us", href: "#" },
  { icon: Building2, label: "About", href: "#" },
];

const mobileFooterLinks = [
  { label: "User agreement", href: "#" },
  { label: "Partnership", href: "#" },
  { label: "Privacy policy", href: "#" },
];

function DrawerLink({ href, icon: Icon, label, onClick }) {
  const content = (
    <span className="flex items-center gap-3 px-4 py-3 text-[15px] text-slate-800 transition-colors hover:bg-slate-50">
      <Icon size={18} className="text-slate-500" />
      <span>{label}</span>
    </span>
  );

  if (href.startsWith("/")) {
    return (
      <Link href={href} onClick={onClick}>
        {content}
      </Link>
    );
  }

  return (
    <a href={href} onClick={onClick}>
      {content}
    </a>
  );
}

function DrawerFooterLink({ href, label, onClick }) {
  if (href.startsWith("/")) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className="block px-4 py-3 text-[15px] text-slate-800 transition-colors hover:bg-slate-50"
      >
        {label}
      </Link>
    );
  }

  return (
    <a
      href={href}
      onClick={onClick}
      className="block px-4 py-3 text-[15px] text-slate-800 transition-colors hover:bg-slate-50"
    >
      {label}
    </a>
  );
}

export default function Navbar({ hideSearch = false }) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileMenuOpen]);

  const handleSearch = (event) => {
    event.preventDefault();

    const trimmed = searchTerm.trim();
    const target = trimmed
      ? `/products?search=${encodeURIComponent(trimmed)}`
      : "/products";

    router.push(target);
  };

  return (
    <>
      <nav className="w-full bg-white border-b border-gray-200 flex items-center">
        <div className="w-full max-w-[1180px] mx-auto px-3 sm:px-4 py-2.5 sm:py-0">
          <div className="flex items-center justify-between gap-3 sm:h-[86px]">
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-slate-100 hover:text-blue-500"
                aria-label="Open menu"
              >
                <Menu size={20} />
              </button>

              <Link href="/" className="flex items-center gap-2 shrink-0">
                <div className="bg-blue-500 p-1.5 sm:p-2 rounded-lg">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="sm:w-6 sm:h-6"
                  >
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                    <path d="M3 6h18" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                </div>
                <span className="text-lg sm:text-2xl font-bold text-blue-400">
                  Brand
                </span>
              </Link>
            </div>

            {!hideSearch && (
              <form
                onSubmit={handleSearch}
                className="hidden md:flex items-center border-2 border-blue-500 rounded-lg overflow-hidden flex-1 mx-6 lg:mx-8 max-w-[600px]"
              >
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search"
                  className="flex-1 px-4 py-2.5 outline-none text-gray-600 placeholder-gray-400 text-sm"
                />
                <div className="flex items-center gap-2 border-l border-blue-500 px-3 lg:px-4 py-2.5 bg-white shrink-0">
                  <span className="text-sm text-gray-700 whitespace-nowrap hidden lg:inline">
                    All category
                  </span>
                  <ChevronDown size={16} className="text-gray-500" />
                </div>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 lg:px-7 py-2.5 text-sm font-medium transition-colors shrink-0">
                  Search
                </button>
              </form>
            )}

            <div className="hidden md:flex items-center gap-6 shrink-0">
              {[
                { Icon: User, label: "Profile" },
                { Icon: MessageSquare, label: "Message" },
                { Icon: Heart, label: "Orders" },
                { Icon: ShoppingCart, label: "My cart" },
              ].map(({ Icon, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center cursor-pointer group"
                >
                  <Icon
                    size={20}
                    className="text-gray-400 group-hover:text-blue-500 transition-colors"
                  />
                  <span className="text-xs text-gray-400 mt-1 group-hover:text-blue-500 transition-colors">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 md:hidden">
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-slate-100 hover:text-blue-500"
                aria-label="Cart"
              >
                <ShoppingCart size={18} />
              </button>
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-slate-100 hover:text-blue-500"
                aria-label="Profile"
              >
                <User size={18} />
              </button>
            </div>
          </div>

          {!hideSearch && (
            <form onSubmit={handleSearch} className="md:hidden mt-2">
              <div className="relative">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search"
                  className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-10 text-sm text-slate-700 outline-none focus:border-blue-400"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-[11px] font-medium text-blue-600"
                >
                  Go
                </button>
              </div>
            </form>
          )}
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[80] md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute inset-0 bg-black/55"
          />

          <aside className="relative h-[100dvh] w-[280px] max-w-[calc(100vw-48px)] bg-white shadow-2xl">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-slate-300 transition-colors hover:bg-slate-100 hover:text-slate-500"
              aria-label="Close menu"
            >
              <X size={16} />
            </button>

            <div className="h-full overflow-y-auto">
              <div className="border-b border-slate-200 bg-slate-50 px-4 py-5">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-200 text-slate-500">
                    <User size={22} />
                  </div>
                </div>
                <div className="text-[15px] text-slate-900">
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    Sign in
                  </Link>
                  <span className="px-1.5 text-slate-400">|</span>
                  <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                    Register
                  </Link>
                </div>
              </div>

              <div className="py-2">
                {mobilePrimaryLinks.map((item) => (
                  <DrawerLink
                    key={item.label}
                    {...item}
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                ))}
              </div>

              <div className="mx-4 border-t border-slate-200" />

              <div className="py-2">
                {mobileSecondaryLinks.map((item) => (
                  <DrawerLink
                    key={item.label}
                    {...item}
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                ))}
              </div>

              <div className="mx-4 border-t border-slate-200" />

              <div className="py-2">
                {mobileFooterLinks.map((item) => (
                  <DrawerFooterLink
                    key={item.label}
                    {...item}
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                ))}
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
