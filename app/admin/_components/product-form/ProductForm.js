/* ─────────────────────────────────────────────────────────────
   ProductForm.jsx  — main orchestrator
   
   File structure:
     ProductForm.jsx          ← this file (state, submit, layout)
     ProductFormUI.jsx        ← shared constants + primitive components
     ProductFormSidebar.jsx   ← right-hand preview + checklist
     TabBasic.jsx             ← Tab 1: name, slug, description, category
     TabPricing.jsx           ← Tab 2: prices, stock, warranty, toggles
     TabDetails.jsx           ← Tab 3: type, material, design, protection
     TabMedia.jsx             ← Tab 4: image_url + images[] uploads
     TabMeta.jsx              ← Tab 5: visibility flags + deal timer
───────────────────────────────────────────────────────────── */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Save, Loader2, Trash2,
  Package, DollarSign, Settings2, ImagePlus, BarChart2, AlertCircle,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import DeleteConfirmModal from "../DeleteConfirmModal";

import { EMPTY_FORM }        from "./ProductFormUI";
import TabBasic              from "./TabBasic";
import TabPricing            from "./TabPricing";
import TabDetails            from "./TabDetails";
import TabMedia              from "./TabMedia";
import TabMeta               from "./TabMeta";
import ProductFormSidebar    from "./ProductFormSidebar";

/* ── Tab config with Lucide icon components ── */
const TABS = [
  { id: "basic",   label: "Basic Info", Icon: Package     },
  { id: "pricing", label: "Pricing",    Icon: DollarSign  },
  { id: "details", label: "Details",    Icon: Settings2   },
  { id: "media",   label: "Media",      Icon: ImagePlus   },
  { id: "meta",    label: "Visibility", Icon: BarChart2   },
];

/* ════════════════════════════════════════════════════════════ */
export default function ProductForm({ initialData }) {
  const isEdit = !!initialData;
  const router = useRouter();

  /* ── active tab ── */
  const [activeTab, setActiveTab] = useState("basic");

  /* ── form state ── */
  const [form, setForm] = useState(() => {
    if (!initialData) return EMPTY_FORM;
    return {
      ...EMPTY_FORM,
      name:             initialData.name             ?? "",
      slug:             initialData.slug             ?? "",
      description:      initialData.description      ?? "",
      category_id:      initialData.category_id      ?? "",
      supplier_id:      initialData.supplier_id      ?? "",
      base_price:       initialData.base_price       ?? "",
      original_price:   initialData.original_price   ?? "",
      stock:            initialData.stock            ?? "0",
      is_in_stock:      initialData.is_in_stock      ?? true,
      price_negotiable: initialData.price_negotiable ?? false,
      product_type:     initialData.product_type     ?? "",
      material:         initialData.material         ?? "",
      design:           initialData.design           ?? "",
      customization:    initialData.customization    ?? "",
      protection:       initialData.protection       ?? "",
      warranty:         initialData.warranty         ?? "",
      is_featured:      initialData.is_featured      ?? false,
      is_deal:          initialData.is_deal          ?? false,
      is_recommended:   initialData.is_recommended   ?? false,
      images:           (initialData.images ?? []).map(url =>
        typeof url === "string" ? { url, uploading: false, error: "" } : url
      ),
      image_url:        initialData.image_url        ?? "",
      deal_starts_at:   initialData.deal_starts_at   ?? "",
      deal_ends_at:     initialData.deal_ends_at     ?? "",
    };
  });

  /* ── dropdowns ── */
  const [categories, setCategories] = useState([]);
  const [suppliers,  setSuppliers]  = useState([]);

  /* ── ui ── */
  const [saving,          setSaving]          = useState(false);
  const [deleting,        setDeleting]        = useState(false);
  const [error,           setError]           = useState("");
  const [tabErrors,       setTabErrors]       = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [slugEdited,      setSlugEdited]      = useState(isEdit);

  /* ── load dropdowns ── */
  useEffect(() => {
    let ok = true;
    (async () => {
      const [{ data: cats }, { data: sups }] = await Promise.all([
        supabase.from("categories").select("id, name").order("name"),
        supabase.from("suppliers").select("id, name").order("name"),
      ]);
      if (!ok) return;
      setCategories(cats || []);
      setSuppliers(sups  || []);
    })();
    return () => { ok = false; };
  }, []);

  /* ── validation ── */
  const validate = () => {
    const errs = {};

    if (!form.name.trim())  errs.basic   = "Product name is required.";
    if (!form.slug.trim())  errs.basic   = errs.basic ?? "Slug is required.";

    // price required UNLESS negotiable
    if (!form.price_negotiable) {
      if (!form.base_price && form.base_price !== 0)
        errs.pricing = "Base price is required.";
      else if (isNaN(Number(form.base_price)) || Number(form.base_price) < 0)
        errs.pricing = "Enter a valid price.";
    }

    // deal dates
    if (form.is_deal && form.deal_ends_at && form.deal_starts_at) {
      if (new Date(form.deal_ends_at) <= new Date(form.deal_starts_at))
        errs.meta = "Deal end date must be after start date.";
    }

    return errs;
  };

  /* ── submit ── */
  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError("");

    const errs = validate();
    if (Object.keys(errs).length) {
      setTabErrors(errs);
      const firstErrTab = TABS.find(t => errs[t.id]);
      if (firstErrTab) setActiveTab(firstErrTab.id);
      return;
    }
    setTabErrors({});

    // block if images still uploading
    if (form.images.some(img => img.uploading) || form._primaryUploading) {
      setError("Please wait — some images are still uploading.");
      return;
    }

    setSaving(true);

    const uploadedImages = form.images
      .filter(img => img.url && !img.uploading && !img.error)
      .map(img => img.url);

    const payload = {
      name:             form.name.trim(),
      slug:             form.slug.trim(),
      description:      form.description.trim() || null,
      category_id:      form.category_id        || null,
      supplier_id:      form.supplier_id        || null,
      base_price:       form.price_negotiable ? 0 : Number(form.base_price),
      original_price:   form.original_price ? Number(form.original_price) : null,
      stock:            Number(form.stock) || 0,
      is_in_stock:      form.is_in_stock,
      price_negotiable: form.price_negotiable,
      product_type:     form.product_type.trim()   || null,
      material:         form.material.trim()       || null,
      design:           form.design.trim()         || null,
      customization:    form.customization.trim()  || null,
      protection:       form.protection.trim()     || null,
      warranty:         form.warranty.trim()       || null,
      is_featured:      form.is_featured,
      is_deal:          form.is_deal,
      is_recommended:   form.is_recommended,
      images:           uploadedImages,
      image_url:        form.image_url.trim() || null,
      deal_starts_at:   form.is_deal && form.deal_starts_at ? form.deal_starts_at : null,
      deal_ends_at:     form.is_deal && form.deal_ends_at   ? form.deal_ends_at   : null,
      updated_at:       new Date().toISOString(),
    };

    let dbErr;
    if (isEdit) {
      ({ error: dbErr } = await supabase.from("products").update(payload).eq("id", initialData.id));
    } else {
      ({ error: dbErr } = await supabase.from("products").insert([payload]));
    }

    setSaving(false);

    if (dbErr) {
      setError(
        dbErr.code === "23505"
          ? "A product with this slug already exists."
          : dbErr.message
      );
      return;
    }

    router.push("/admin/products/catalog");
    router.refresh();
  };

  /* ── delete ── */
  const handleDelete = async () => {
    if (!initialData?.id) return;
    setError("");
    setDeleting(true);

    const { error: dbErr } = await supabase
      .from("products")
      .delete()
      .eq("id", initialData.id);

    setDeleting(false);
    setShowDeleteModal(false);

    if (dbErr) { setError(dbErr.message); return; }

    router.push("/admin/products/catalog");
    router.refresh();
  };

  const isBusy = saving || deleting;

  /* ── current tab index ── */
  const tabIdx = TABS.findIndex(t => t.id === activeTab);

  /* ════════════════════ RENDER ══════════════════════════ */
  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* ── Page Header ── */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products/catalog"
          className="flex items-center justify-center h-9 w-9 rounded-lg border border-zinc-200 hover:bg-zinc-100 transition-colors text-zinc-600"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">
            {isEdit ? "Edit Product" : "New Product"}
          </h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            {isEdit
              ? `Editing "${initialData.name}"`
              : "Add a new product to your catalog"}
          </p>
        </div>
      </div>

      {/* ── Global error ── */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle size={15} className="shrink-0" />
          {error}
        </div>
      )}

      {/* ── Main layout ── */}
      <div className="flex gap-6 items-start">

        {/* ── Left: Tab form card ── */}
        <div className="flex-1 min-w-0 bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">

          {/* Tab bar */}
          <div className="border-b border-zinc-100 px-4 flex gap-1 bg-zinc-50/60 overflow-x-auto">
            {TABS.map(tab => {
              const { Icon } = tab;
              const hasErr = !!tabErrors[tab.id];
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    relative flex items-center gap-2 px-4 py-3.5 text-sm font-medium
                    transition-colors border-b-2 -mb-px whitespace-nowrap shrink-0
                    ${activeTab === tab.id
                      ? "text-blue-600 border-blue-600"
                      : "text-zinc-500 border-transparent hover:text-zinc-800 hover:border-zinc-300"
                    }
                  `}
                >
                  <Icon size={14} />
                  {tab.label}
                  {hasErr && (
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 absolute top-3 right-1.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          <div className="px-6 py-6">
            {activeTab === "basic" && (
              <TabBasic
                form={form}
                setForm={setForm}
                categories={categories}
                suppliers={suppliers}
                slugEdited={slugEdited}
                setSlugEdited={setSlugEdited}
                tabErrors={tabErrors}
              />
            )}
            {activeTab === "pricing" && (
              <TabPricing
                form={form}
                setForm={setForm}
                tabErrors={tabErrors}
              />
            )}
            {activeTab === "details" && (
              <TabDetails form={form} setForm={setForm} />
            )}
            {activeTab === "media" && (
              <TabMedia form={form} setForm={setForm} />
            )}
            {activeTab === "meta" && (
              <TabMeta
                form={form}
                setForm={setForm}
                tabErrors={tabErrors}
              />
            )}
          </div>

          {/* ── Footer nav ── */}
          <div className="px-6 py-4 border-t border-zinc-100 bg-zinc-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/admin/products/catalog"
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
                  Delete Product
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {tabIdx > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveTab(TABS[tabIdx - 1].id)}
                  className="text-sm text-zinc-500 hover:text-zinc-800 px-3 py-2 rounded-lg hover:bg-zinc-100 transition-colors"
                >
                  ← Back
                </button>
              )}

              {tabIdx < TABS.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setActiveTab(TABS[tabIdx + 1].id)}
                  className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-900 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
                >
                  Next →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isBusy}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors shadow-sm"
                >
                  {saving ? (
                    <><Loader2 size={15} className="animate-spin" /> Saving...</>
                  ) : (
                    <><Save size={15} /> {isEdit ? "Update Product" : "Save Product"}</>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Right sidebar ── */}
        <ProductFormSidebar
          form={form}
          categories={categories}
          isEdit={isEdit}
        />
      </div>

      {/* ── Delete modal ── */}
      {showDeleteModal && isEdit && (
        <DeleteConfirmModal
          item={initialData}
          title="Delete Product"
          description={
            <>
              Are you sure you want to delete{" "}
              <strong>{initialData.name}</strong>? This action cannot be undone.
            </>
          }
          confirmLabel="Delete Product"
          saving={deleting}
          onConfirm={handleDelete}
          onClose={() => { if (!deleting) setShowDeleteModal(false); }}
        />
      )}
    </div>
  );
}