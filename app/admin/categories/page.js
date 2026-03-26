"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
// import { createClient } from "@/lib/supabase/client";

import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Tag,
  ImageOff,
  Loader2,
  FolderTree,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import DeleteConfirmModal from "../_components/DeleteConfirmModal";

export default function CategoriesPage() {
//   const supabase = createClient();
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState("");
  const [deleting,   setDeleting]   = useState(null);
  const [error,      setError]      = useState("");
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  /* ── Fetch ── */
  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      const { data, error: dbErr } = await supabase
      .from("categories")
      .select(`
        id, name, slug, image_url, created_at,
        parent:parent_id ( id, name )
      `)
      .order("created_at", { ascending: false });

      if (!isMounted) return;

      if (!dbErr) {
        setCategories(data || []);
        setError("");
      } else {
        setError(dbErr.message);
      }
      setLoading(false);
    };

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  /* ── Delete ── */
  const handleDelete = async () => {
    if (!categoryToDelete) return;

    setError("");
    setDeleting(categoryToDelete.id);

    const { error: dbErr } = await supabase
      .from("categories")
      .delete()
      .eq("id", categoryToDelete.id);

    if (!dbErr) {
      setCategories((prev) => prev.filter((c) => c.id !== categoryToDelete.id));
      setCategoryToDelete(null);
    } else {
      setCategoryToDelete(null);
      setError(
        dbErr.code === "23503"
          ? "This category can't be deleted while products or sub-categories still reference it."
          : dbErr.message
      );
    }

    setDeleting(null);
  };

  /* ── Filter ── */
  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">

      {/* ── Page Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Categories</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            Manage your product categories
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm"
        >
          <Plus size={16} />
          Add Category
        </Link>
      </div>

      {/* ── Stats card ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-zinc-200 p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <Tag size={18} className="text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-zinc-900">{categories.length}</p>
            <p className="text-xs text-zinc-500">Total Categories</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center">
            <FolderTree size={18} className="text-purple-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-zinc-900">
              {categories.filter((c) => c.parent).length}
            </p>
            <p className="text-xs text-zinc-500">Sub-categories</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center">
            <Tag size={18} className="text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-zinc-900">
              {categories.filter((c) => !c.parent).length}
            </p>
            <p className="text-xs text-zinc-500">Top-level</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* ── Table Card ── */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">

        {/* Table toolbar */}
        <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={14} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search categories..."
              className="w-full h-9 pl-8 pr-3 bg-zinc-50 border border-zinc-200 rounded-lg text-sm placeholder-zinc-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none transition-all"
            />
          </div>
          <span className="text-sm text-zinc-400">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-zinc-400">
            <Loader2 size={24} className="animate-spin mr-2" />
            Loading categories...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
            <Tag size={40} className="mb-3 opacity-30" />
            <p className="text-sm font-medium">No categories found</p>
            <p className="text-xs mt-1">
              {search ? "Try a different search" : "Add your first category to get started"}
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                  Category
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                  Slug
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                  Parent
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                  Created
                </th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filtered.map((cat) => (
                <tr key={cat.id} className="hover:bg-zinc-50 transition-colors">
                  {/* Name + image */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg border border-zinc-200 overflow-hidden bg-zinc-100 shrink-0 flex items-center justify-center">
                        {cat.image_url ? (
                          <img
                            src={cat.image_url}
                            alt={cat.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <ImageOff size={14} className="text-zinc-400" />
                        )}
                      </div>
                      <span className="font-medium text-zinc-900">{cat.name}</span>
                    </div>
                  </td>

                  {/* Slug */}
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-xs bg-zinc-100 text-zinc-600 px-2 py-1 rounded">
                      {cat.slug}
                    </span>
                  </td>

                  {/* Parent */}
                  <td className="px-5 py-3.5 text-zinc-500">
                    {cat.parent ? (
                      <span className="flex items-center gap-1.5">
                        <FolderTree size={13} className="text-purple-500" />
                        {cat.parent.name}
                      </span>
                    ) : (
                      <span className="text-zinc-400 text-xs">—</span>
                    )}
                  </td>

                  {/* Date */}
                  <td className="px-5 py-3.5 text-zinc-400 text-xs">
                    {new Date(cat.created_at).toLocaleDateString("en-US", {
                      year: "numeric", month: "short", day: "numeric",
                    })}
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/categories/${cat.id}/edit`}
                        className="flex items-center gap-1.5 text-xs text-blue-600 border border-blue-200 hover:bg-blue-50 px-2.5 py-1.5 rounded-lg transition-colors"
                      >
                        <Pencil size={12} />
                        Edit
                      </Link>
                      <button
                        onClick={() => setCategoryToDelete(cat)}
                        disabled={deleting === cat.id}
                        className="flex items-center gap-1.5 text-xs text-red-500 border border-red-200 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {deleting === cat.id
                          ? <Loader2 size={12} className="animate-spin" />
                          : <Trash2 size={12} />
                        }
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {categoryToDelete && (
        <DeleteConfirmModal
          item={categoryToDelete}
          title="Delete Category"
          description={
            <>
              Are you sure you want to delete <strong>{categoryToDelete.name}</strong>?
              {" "}This will permanently remove the category. If products or
              sub-categories still use it, the delete may fail.
            </>
          }
          confirmLabel="Delete Category"
          saving={deleting === categoryToDelete.id}
          onConfirm={handleDelete}
          onClose={() => {
            if (deleting !== categoryToDelete.id) setCategoryToDelete(null);
          }}
        />
      )}
    </div>
  );
}
