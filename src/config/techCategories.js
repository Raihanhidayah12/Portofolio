/** Kategori tech stack — selaras kolom `category` di Supabase. */

export const TECH_CATEGORIES = [
  { id: "Frontend Development", label: "Frontend Development", description: "HTML, CSS, framework UI, & library frontend" },
  { id: "Backend Development", label: "Backend Development", description: "Runtime, framework, & API server" },
  { id: "Database Management", label: "Database Management", description: "SQL, NoSQL, & ORM" },
  { id: "Mobile Development", label: "Mobile Development", description: "Flutter, React Native, & mobile SDK" },
  { id: "Design", label: "Design", description: "UI/UX, grafis, & prototyping" },
  { id: "Cloud & Backend Services", label: "Cloud & Backend Services", description: "BaaS, hosting, & layanan cloud" },
  { id: "Tools & DevOps", label: "Tools & DevOps", description: "CI/CD, version control, & tooling" },
];

export const DEFAULT_TECH_CATEGORY = "Frontend Development";

const CATEGORY_IDS = new Set(TECH_CATEGORIES.map((c) => c.id));

export function normalizeTechCategory(value) {
  if (value && CATEGORY_IDS.has(value)) return value;
  return DEFAULT_TECH_CATEGORY;
}

export function getTechCategoryLabel(categoryId) {
  return TECH_CATEGORIES.find((c) => c.id === categoryId)?.label ?? categoryId;
}

/** Urutan tab: All → kategori yang punya item */
export function getActiveTechCategories(techStacks) {
  const used = new Set((techStacks ?? []).map((t) => normalizeTechCategory(t.category)));
  return TECH_CATEGORIES.filter((c) => used.has(c.id));
}

export function groupTechStacksByCategory(techStacks) {
  const groups = Object.fromEntries(TECH_CATEGORIES.map((c) => [c.id, []]));
  for (const item of techStacks ?? []) {
    const key = normalizeTechCategory(item.category);
    groups[key].push(item);
  }
  return groups;
}
