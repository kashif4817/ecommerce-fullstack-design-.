
'use server'

import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

// ─── CREATE PRODUCT ───────────────────────────────
export async function createProduct(formData) {
  const productPayload = {
    name: formData.name,
    slug: formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    description: formData.description,
    category_id: formData.category_id || null,
    supplier_id: formData.supplier_id || null,
    base_price: parseFloat(formData.base_price),
    original_price: formData.original_price ? parseFloat(formData.original_price) : null,
    product_type: formData.product_type || null,
    material: formData.material || null,
    design: formData.design || null,
    customization: formData.customization || null,
    protection: formData.protection || null,
    warranty: formData.warranty || null,
    price_negotiable: formData.price_negotiable ?? false,
    stock: parseInt(formData.stock) || 0,
    is_in_stock: formData.is_in_stock ?? true,
    is_featured: formData.is_featured ?? false,
    is_deal: formData.is_deal ?? false,
    is_recommended: formData.is_recommended ?? false,
  }

  const { data: product, error } = await supabase
    .from('products')
    .insert(productPayload)
    .select()
    .single()

  if (error) return { success: false, error: error.message }

  // Insert pricing tiers
  if (formData.pricing_tiers?.length) {
    await supabase.from('product_pricing_tiers').insert(
      formData.pricing_tiers.map((t, i) => ({
        product_id: product.id,
        min_qty: parseInt(t.min_qty),
        max_qty: t.max_qty ? parseInt(t.max_qty) : null,
        price: parseFloat(t.price),
        sort_order: i,
      }))
    )
  }

  // Insert attributes (specs table)
  if (formData.attributes?.length) {
    await supabase.from('product_attributes').insert(
      formData.attributes.map((a, i) => ({
        product_id: product.id,
        attribute_name: a.name,
        attribute_value: a.value,
        sort_order: i,
      }))
    )
  }

  // Insert features (checklist)
  if (formData.features?.length) {
    await supabase.from('product_features').insert(
      formData.features.map((f, i) => ({
        product_id: product.id,
        feature: f,
        sort_order: i,
      }))
    )
  }

  // Insert images (URLs from Supabase Storage)
  if (formData.images?.length) {
    await supabase.from('product_images').insert(
      formData.images.map((url, i) => ({
        product_id: product.id,
        image_url: url,
        is_primary: i === 0,
        sort_order: i,
      }))
    )
  }

  revalidatePath('/admin/products')
  return { success: true, data: product }
}

// ─── UPDATE PRODUCT ───────────────────────────────
export async function updateProduct(id, formData) {
  const { error } = await supabase
    .from('products')
    .update({
      name: formData.name,
      description: formData.description,
      category_id: formData.category_id || null,
      supplier_id: formData.supplier_id || null,
      base_price: parseFloat(formData.base_price),
      original_price: formData.original_price ? parseFloat(formData.original_price) : null,
      product_type: formData.product_type || null,
      material: formData.material || null,
      design: formData.design || null,
      customization: formData.customization || null,
      protection: formData.protection || null,
      warranty: formData.warranty || null,
      price_negotiable: formData.price_negotiable ?? false,
      stock: parseInt(formData.stock) || 0,
      is_in_stock: formData.is_in_stock ?? true,
      is_featured: formData.is_featured ?? false,
      is_deal: formData.is_deal ?? false,
      is_recommended: formData.is_recommended ?? false,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) return { success: false, error: error.message }

  // Replace related data (delete then re-insert is cleanest for these)
  await Promise.all([
    supabase.from('product_pricing_tiers').delete().eq('product_id', id),
    supabase.from('product_attributes').delete().eq('product_id', id),
    supabase.from('product_features').delete().eq('product_id', id),
    supabase.from('product_images').delete().eq('product_id', id),
  ])

  if (formData.pricing_tiers?.length) {
    await supabase.from('product_pricing_tiers').insert(
      formData.pricing_tiers.map((t, i) => ({
        product_id: id,
        min_qty: parseInt(t.min_qty),
        max_qty: t.max_qty ? parseInt(t.max_qty) : null,
        price: parseFloat(t.price),
        sort_order: i,
      }))
    )
  }

  if (formData.attributes?.length) {
    await supabase.from('product_attributes').insert(
      formData.attributes.map((a, i) => ({
        product_id: id,
        attribute_name: a.name,
        attribute_value: a.value,
        sort_order: i,
      }))
    )
  }

  if (formData.features?.length) {
    await supabase.from('product_features').insert(
      formData.features.map((f, i) => ({
        product_id: id,
        feature: f,
        sort_order: i,
      }))
    )
  }

  if (formData.images?.length) {
    await supabase.from('product_images').insert(
      formData.images.map((url, i) => ({
        product_id: id,
        image_url: url,
        is_primary: i === 0,
        sort_order: i,
      }))
    )
  }

  revalidatePath('/admin/products')
  return { success: true }
}

// ─── DELETE PRODUCT ───────────────────────────────
export async function deleteProduct(id) {
  // Cascade deletes handle related rows automatically (set in schema)
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/products')
  return { success: true }
}

// ─── UPLOAD IMAGE TO SUPABASE STORAGE ────────────
export async function uploadProductImage(file, productId) {
  const ext = file.name.split('.').pop()
  const path = `${productId}/${Date.now()}.${ext}`
  const { error } = await supabase.storage
    .from('product-images')
    .upload(path, file)
  if (error) return { success: false, error: error.message }
  const { data } = supabase.storage.from('product-images').getPublicUrl(path)
  return { success: true, url: data.publicUrl }
}
