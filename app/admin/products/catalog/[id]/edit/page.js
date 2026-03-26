import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ProductForm from "@/app/admin/_components/product-form/ProductForm";

export default async function EditProductPage({ params }) {
  const { id } = await params;

  const { data: product, error } = await supabase
    .from("products")
    .select(`
      id, name, slug, description, category_id, supplier_id,
      base_price, original_price, stock, is_in_stock, price_negotiable,
      product_type, material, design, customization, protection, warranty,
      is_featured, is_deal, is_recommended, images
    `)
    .eq("id", id)
    .single();

  if (error || !product) notFound();

  // normalise images: DB stores string[] of URLs, form expects { url, uploading, error }
  const normalised = {
    ...product,
    images: (product.images ?? []).map(url => ({ url, uploading: false, error: "", localPreview: url })),
  };

  return <ProductForm initialData={normalised} />;
}