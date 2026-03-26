import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import CategoryForm from "@/app/admin/_components/category/Categoryform";

export default async function EditCategoryPage({ params }) {
  const { id } = await params;

  const { data: category, error } = await supabase
    .from("categories")
    .select("id, name, slug, parent_id, image_url")
    .eq("id", id)
    .single();

  // If category doesn't exist, show 404
  if (error || !category) notFound();

  return <CategoryForm initialData={category} />;
}
