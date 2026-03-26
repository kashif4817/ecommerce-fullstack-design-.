/* ─────────────────────────────────────────────────────────────
   ProductFormSidebar.jsx
   Right-hand preview + completion checklist sidebar
───────────────────────────────────────────────────────────── */
"use client";

import { ImagePlus, Package } from "lucide-react";
import { Badge, CheckItem } from "./ProductFormUI";

export default function ProductFormSidebar({ form, categories, isEdit }) {
  /* best available preview image */
  const previewImage =
    form._primaryPreview ||
    form.image_url ||
    form.images?.find(img => img.localPreview || img.url)?.localPreview ||
    form.images?.find(img => img.url)?.url ||
    null;

  const base     = Number(form.base_price);
  const original = Number(form.original_price);
  const hasDisc  = form.original_price && original > base;

  const galleryUploaded = form.images?.filter(i => i.url && !i.uploading).length ?? 0;
  const galleryPending  = form.images?.filter(i => i.uploading).length ?? 0;

  return (
    <div className="w-64 shrink-0 space-y-4">

      {/* ── Product preview card ── */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-zinc-100 flex items-center gap-2">
          <Package size={14} className="text-blue-600" />
          <h3 className="text-xs font-semibold text-zinc-700">Product Preview</h3>
          {isEdit && (
            <span className="ml-auto text-xs bg-amber-100 text-amber-700 font-medium px-2 py-0.5 rounded-full">
              Editing
            </span>
          )}
        </div>

        <div className="p-4 space-y-3">
          {/* Thumbnail */}
          <div className="h-36 w-full rounded-lg bg-zinc-100 border border-zinc-200 overflow-hidden flex items-center justify-center relative">
            {previewImage ? (
              <img
                src={previewImage}
                alt="preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <ImagePlus size={24} className="text-zinc-300" />
            )}
            {form.image_url && (
              <span className="absolute bottom-1.5 right-1.5 text-[10px] font-medium bg-green-500/90 text-white px-1.5 py-0.5 rounded">
                Primary set ✓
              </span>
            )}
          </div>

          {/* Name + price */}
          <div>
            <p className="text-sm font-semibold text-zinc-900 truncate">
              {form.name || (
                <span className="text-zinc-400 font-normal italic">Product name</span>
              )}
            </p>

            {form.price_negotiable ? (
              <p className="text-sm font-bold text-blue-600 mt-1">Price: Negotiable</p>
            ) : form.base_price ? (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-bold text-zinc-900">
                  PKR {Number(form.base_price).toLocaleString()}
                </span>
                {hasDisc && (
                  <span className="text-xs text-zinc-400 line-through">
                    PKR {Number(form.original_price).toLocaleString()}
                  </span>
                )}
              </div>
            ) : null}

            {form.category_id && (
              <p className="text-xs text-zinc-400 mt-1">
                {categories.find(c => c.id === form.category_id)?.name}
              </p>
            )}
          </div>

          {/* Gallery count */}
          {(galleryUploaded > 0 || galleryPending > 0) && (
            <p className="text-xs text-zinc-400">
              {galleryUploaded} gallery image{galleryUploaded !== 1 ? "s" : ""}
              {galleryPending > 0 && (
                <span className="text-amber-500"> · {galleryPending} uploading…</span>
              )}
            </p>
          )}

          {/* Badges */}
          <div className="flex flex-wrap gap-1.5">
            {form.is_in_stock      && <Badge label="In Stock"    color="green"  />}
            {form.is_featured      && <Badge label="Featured"    color="amber"  />}
            {form.is_deal          && <Badge label="Deal"        color="red"    />}
            {form.is_recommended   && <Badge label="Recommended" color="purple" />}
            {form.price_negotiable && <Badge label="Negotiable"  color="blue"   />}
          </div>

          {/* Deal countdown preview */}
          {form.is_deal && form.deal_ends_at && (
            <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-2.5 py-2 font-medium">
              ⏱ Deal ends{" "}
              {new Date(form.deal_ends_at).toLocaleDateString("en-US", {
                month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Completion checklist ── */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-zinc-100">
          <h3 className="text-xs font-semibold text-zinc-700">Completion</h3>
        </div>
        <div className="p-4 space-y-2">
          <CheckItem label="Name & slug"     done={!!(form.name && form.slug)} />
          <CheckItem label="Category"        done={!!form.category_id} />
          <CheckItem label="Supplier"        done={!!form.supplier_id} />
          <CheckItem label="Description"     done={!!form.description} />
          <CheckItem label="Primary image"   done={!!form.image_url} />
          <CheckItem label="Gallery images"  done={galleryUploaded > 0} />
          <CheckItem label="Base price"      done={!!form.base_price || form.price_negotiable} />
          <CheckItem label="Stock set"       done={form.stock !== ""} />
          <CheckItem label="Details filled"  done={!!(form.product_type || form.material)} />
          <CheckItem label="Deal dates set"  done={!form.is_deal || !!form.deal_ends_at} />
        </div>
      </div>
    </div>
  );
}