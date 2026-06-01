import { DEFAULT_TECH_CATEGORY } from "../config/techCategories";
import { mapTechStack } from "./supabase/mappers";

/** Query & fallback untuk tabel `tech_stack`. */
export const TECH_STACK_PUBLIC_COLUMNS =
  "id, name, icon, order_index, is_published, category";

/** Fallback selaras data seed Supabase (order_index 1–6). */
export const FALLBACK_TECH_STACK = [
  {
    id: "fallback-1",
    name: "HTML",
    icon: "/html.svg",
    order_index: 1,
    is_published: true,
    category: "Development",
  },
  {
    id: "fallback-2",
    name: "CSS",
    icon: "/css.svg",
    order_index: 2,
    is_published: true,
    category: "Development",
  },
  {
    id: "fallback-3",
    name: "JavaScript",
    icon: "/javascript.svg",
    order_index: 3,
    is_published: true,
    category: "Development",
  },
  {
    id: "fallback-4",
    name: "Tailwind CSS",
    icon: "/tailwind.svg",
    order_index: 4,
    is_published: true,
    category: "Development",
  },
  {
    id: "fallback-5",
    name: "ReactJS",
    icon: "/reactjs.svg",
    order_index: 5,
    is_published: true,
    category: "Development",
  },
  {
    id: "fallback-6",
    name: "Vite",
    icon: "/vite.svg",
    order_index: 6,
    is_published: true,
    category: "Development",
  },
];

export { DEFAULT_TECH_CATEGORY };

/**
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {{ limit?: number }} [options]
 */
const TECH_STACK_LEGACY_COLUMNS = "id, name, icon, order_index, is_published";

function withDefaultCategory(rows) {
  return (rows ?? []).map((row) => ({
    ...row,
    category: row.category ?? DEFAULT_TECH_CATEGORY,
  }));
}

export async function fetchPublishedTechStack(supabase, { limit } = {}) {
  const run = (columns) => {
    let query = supabase
      .from("tech_stack")
      .select(columns)
      .eq("is_published", true)
      .order("order_index", { ascending: true });

    if (typeof limit === "number" && limit > 0) {
      query = query.limit(limit);
    }
    return query;
  };

  let { data, error } = await run(TECH_STACK_PUBLIC_COLUMNS);

  if (error?.message?.includes("category")) {
    const legacy = await run(TECH_STACK_LEGACY_COLUMNS);
    data = withDefaultCategory(legacy.data);
    error = legacy.error;
  } else {
    data = withDefaultCategory(data);
  }

  return { data: mapTechStack(data), error };
}

export function formatTechStackIndex(orderIndex) {
  const n = Number(orderIndex);
  if (!Number.isFinite(n) || n < 0) return "00";
  return String(Math.trunc(n)).padStart(2, "0");
}
