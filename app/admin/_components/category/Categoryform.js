"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
// import { createClient } from "@/lib/supabase/client";
import {
  ArrowLeft, Save, Loader2, ImagePlus, Tag, Link2, FolderTree, Trash2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import DeleteConfirmModal from "../DeleteConfirmModal";

function toSlug(str) {
  return str.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

// ─────────────────────────────────────────────────────────────
// Props:
//   initialData  →  existing category object (edit mode)
//                   undefined / null = new mode
// ─────────────────────────────────────────────────────────────
export default function CategoryForm({ initialData }) {
  const isEdit   = !!initialData;
  const router   = useRouter();

  const [form, setForm] = useState({
    name:      initialData?.name      ?? "",
    slug:      initialData?.slug      ?? "",
    parent_id: initialData?.parent_id ?? "",
    image_url: initialData?.image_url ?? "",
  });

  const [parents,    setParents]    = useState([]);
  const [saving,     setSaving]     = useState(false);
  const [deleting,   setDeleting]   = useState(false);
  const [error,      setError]      = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [slugEdited, setSlugEdited] = useState(isEdit); // in edit mode, don't auto-overwrite slug

  /* ── Load parent options (exclude self in edit mode) ── */
  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      let query = supabase
        .from("categories")
        .select("id, name")
        .is("parent_id", null)
        .order("name");

      // prevent a category from being its own parent
      if (isEdit && initialData?.id) {
        query = query.neq("id", initialData.id);
      }

      const { data } = await query;
      if (isMounted) setParents(data || []);
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [initialData?.id, isEdit]);

  /* ── Auto-slug from name (new mode only) ── */
  const handleNameChange = (val) => {
    setForm((prev) => ({
      ...prev,
      name: val,
      slug: slugEdited ? prev.slug : toSlug(val),
    }));
  };

  const handleSlugChange = (val) => {
    setSlugEdited(true);
    setForm((prev) => ({ ...prev, slug: toSlug(val) }));
  };

  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) return setError("Name is required.");
    if (!form.slug.trim()) return setError("Slug is required.");

    setSaving(true);

    const payload = {
      name:      form.name.trim(),
      slug:      form.slug.trim(),
      image_url: form.image_url.trim() || null,
      parent_id: form.parent_id        || null,
    };

    let dbErr;

    if (isEdit) {
      ({ error: dbErr } = await supabase
        .from("categories")
        .update(payload)
        .eq("id", initialData.id));
    } else {
      ({ error: dbErr } = await supabase
        .from("categories")
        .insert([payload]));
    }

    setSaving(false);

    if (dbErr) {
      setError(
        dbErr.code === "23505"
          ? "A category with this slug already exists."
          : dbErr.message
      );
      return;
    }

    router.push("/admin/categories");
    router.refresh();
  };

  const handleDelete = async () => {
    if (!initialData?.id) return;

    setError("");
    setDeleting(true);

    const { error: dbErr } = await supabase
      .from("categories")
      .delete()
      .eq("id", initialData.id);

    setDeleting(false);
    setShowDeleteModal(false);

    if (dbErr) {
      setError(
        dbErr.code === "23503"
          ? "This category can't be deleted while products or sub-categories still reference it."
          : dbErr.message
      );
      return;
    }

    router.push("/admin/categories");
    router.refresh();
  };

  const isBusy = saving || deleting;

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* ── Page Header ── */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/categories"
          className="flex items-center justify-center h-9 w-9 rounded-lg border border-zinc-200 hover:bg-zinc-100 transition-colors text-zinc-600"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">
            {isEdit ? "Edit Category" : "New Category"}
          </h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            {isEdit
              ? `Editing "${initialData.name}"`
              : "Add a new product category"}
          </p>
        </div>
      </div>

      {/* ── Form Card ── */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden"
      >
        {/* Card Header */}
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center gap-2">
          <Tag size={16} className="text-blue-600" />
          <h2 className="text-sm font-semibold text-zinc-800">
            Category Details
          </h2>
          {isEdit && (
            <span className="ml-auto text-xs bg-amber-100 text-amber-700 font-medium px-2 py-0.5 rounded-full">
              Editing
            </span>
          )}
        </div>

        <div className="px-6 py-6 space-y-5">

          {/* Error banner */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Name */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-sm font-medium text-zinc-700">
              <Tag size={13} className="text-zinc-400" />
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Electronics, Home Decor, Fashion..."
              className="w-full h-10 px-3.5 border border-zinc-200 rounded-lg text-sm placeholder-zinc-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none transition-all"
              required
            />
          </div>

          {/* Slug */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-sm font-medium text-zinc-700">
              <Link2 size={13} className="text-zinc-400" />
              Slug <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-zinc-400 select-none">
                /
              </span>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="auto-generated-from-name"
                className="w-full h-10 pl-6 pr-3.5 border border-zinc-200 rounded-lg text-sm font-mono placeholder-zinc-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none transition-all"
                required
              />
            </div>
            <p className="text-xs text-zinc-400">
              {isEdit
                ? "Changing the slug may break existing links to this category."
                : "Auto-generated from name. Only lowercase letters, numbers and hyphens."}
            </p>
          </div>

          {/* Parent Category */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-sm font-medium text-zinc-700">
              <FolderTree size={13} className="text-zinc-400" />
              Parent Category
              <span className="text-xs text-zinc-400 font-normal ml-1">(optional)</span>
            </label>
            <select
              value={form.parent_id}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, parent_id: e.target.value }))
              }
              className="w-full h-10 px-3.5 border border-zinc-200 rounded-lg text-sm text-zinc-700 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none transition-all"
            >
              <option value="">— None (top-level category) —</option>
              {parents.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Image URL */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-sm font-medium text-zinc-700">
              <ImagePlus size={13} className="text-zinc-400" />
              Image URL
              <span className="text-xs text-zinc-400 font-normal ml-1">(optional)</span>
            </label>
            <input
              type="url"
              value={form.image_url}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, image_url: e.target.value }))
              }
              placeholder="https://example.com/image.jpg"
              className="w-full h-10 px-3.5 border border-zinc-200 rounded-lg text-sm placeholder-zinc-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none transition-all"
            />

            {/* Live preview */}
            {form.image_url && (
              <div className="mt-2 flex items-center gap-3">
                <img
                  src={form.image_url}
                  alt="Preview"
                  onError={(e) => { e.target.style.display = "none"; }}
                  className="h-16 w-16 rounded-lg object-cover border border-zinc-200"
                />
                <p className="text-xs text-zinc-400">Image preview</p>
              </div>
            )}
          </div>
        </div>

        {/* Form Footer */}
        <div className="px-6 py-4 border-t border-zinc-100 bg-zinc-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/categories"
              className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
            >
              Cancel
            </Link>
            {isEdit && (
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                disabled={isBusy}
                className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50 transition-colors"
              >
                <Trash2 size={15} />
                Delete Category
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={isBusy}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors shadow-sm"
          >
            {saving ? (
              <><Loader2 size={15} className="animate-spin" /> Saving...</>
            ) : (
              <><Save size={15} /> {isEdit ? "Update Category" : "Save Category"}</>
            )}
          </button>
        </div>
      </form>

      {showDeleteModal && isEdit && (
        <DeleteConfirmModal
          item={initialData}
          title="Delete Category"
          description={
            <>
              Are you sure you want to delete <strong>{initialData.name}</strong>?
              {" "}This will permanently remove the category. If products or
              sub-categories still use it, the delete may fail.
            </>
          }
          confirmLabel="Delete Category"
          saving={deleting}
          onConfirm={handleDelete}
          onClose={() => {
            if (!deleting) setShowDeleteModal(false);
          }}
        />
      )}
    </div>
  );
}
