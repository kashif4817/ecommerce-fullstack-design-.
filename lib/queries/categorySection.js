/* ─────────────────────────────────────────────────────────────
   lib/queries/categorySection.js
   Fetch functions for category section components.
   Used by React Query on the client.
───────────────────────────────────────────────────────────── */

import { supabase } from "@/lib/supabase";

/**
 * Fetch up to 8 products for a parent category slug.
 * Walks: parent slug → parent id → child category ids → products
 */
export async function fetchProductsByParentSlug(parentSlug, limit = 8) {
  // 1. Get parent category id
  const { data: parent, error: pErr } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", parentSlug)
    .single();

  if (pErr || !parent) return [];

  // 2. Get all child category ids under this parent
  const { data: children } = await supabase
    .from("categories")
    .select("id")
    .eq("parent_id", parent.id);

  const childIds = (children || []).map((c) => c.id);

  // Include parent itself in case products are directly under it
  const allIds = [parent.id, ...childIds];

  // 3. Fetch products in any of those categories
  const { data: products, error: prodErr } = await supabase
    .from("products")
    .select("id, name, base_price, image_url, images, category_id, slug")
    .in("category_id", allIds)
    .eq("is_in_stock", true)
    .order("units_sold", { ascending: false })
    .limit(limit);

  if (prodErr) return [];
  return products || [];
}

/**
 * Fetch products by a specific category id (for "Source now" page).
 * Used with React Query + Next.js cache.
 */
export async function fetchProductsByCategoryId(categoryId, limit = 24) {
  const { data, error } = await supabase
    .from("products")
    .select(`
      id, name, slug, base_price, original_price,
      image_url, images, is_in_stock, stock,
      rating, review_count, units_sold,
      categories ( id, name, slug )
    `)
    .eq("category_id", categoryId)
    .eq("is_in_stock", true)
    .order("units_sold", { ascending: false })
    .limit(limit);

  if (error) return [];
  return data || [];
}

/**
 * Fetch a parent category + all its children (for the browse page).
 */
export async function fetchCategoryWithChildren(parentSlug) {
  const { data: parent } = await supabase
    .from("categories")
    .select("id, name, slug, image_url")
    .eq("slug", parentSlug)
    .single();

  if (!parent) return null;

  const { data: children } = await supabase
    .from("categories")
    .select("id, name, slug, image_url")
    .eq("parent_id", parent.id)
    .order("name");

  return { ...parent, children: children || [] };
}