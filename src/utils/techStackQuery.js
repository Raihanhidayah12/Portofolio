/** Query & fallback untuk tabel `tech_stack` (kolom: name, icon, order_index, is_published). */

export const TECH_STACK_PUBLIC_COLUMNS = "id, name, icon, order_index, is_published";

/** Fallback selaras data seed Supabase (order_index 1–6). */
export const FALLBACK_TECH_STACK = [
  { id: "fallback-1", name: "HTML", icon: "/html.svg", order_index: 1, is_published: true },
  { id: "fallback-2", name: "CSS", icon: "/css.svg", order_index: 2, is_published: true },
  { id: "fallback-3", name: "JavaScript", icon: "/javascript.svg", order_index: 3, is_published: true },
  { id: "fallback-4", name: "Tailwind CSS", icon: "/tailwind.svg", order_index: 4, is_published: true },
  { id: "fallback-5", name: "ReactJS", icon: "/reactjs.svg", order_index: 5, is_published: true },
  { id: "fallback-6", name: "Vite", icon: "/vite.svg", order_index: 6, is_published: true },
];

/**
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {{ limit?: number }} [options]
 */
export async function fetchPublishedTechStack(supabase, { limit } = {}) {
  let query = supabase
    .from("tech_stack")
    .select(TECH_STACK_PUBLIC_COLUMNS)
    .eq("is_published", true)
    .order("order_index", { ascending: true });

  if (typeof limit === "number" && limit > 0) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  return { data: data ?? [], error };
}

export function formatTechStackIndex(orderIndex) {
  const n = Number(orderIndex);
  if (!Number.isFinite(n) || n < 0) return "00";
  return String(Math.trunc(n)).padStart(2, "0");
}
