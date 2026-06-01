import { useMemo, useState } from "react";
import {
  getActiveTechCategories,
  getTechCategoryLabel,
  normalizeTechCategory,
} from "../config/techCategories";
import TechStackLoop from "./TechStackLoop";

const TAB_ALL = "all";

export default function TechStackCategories({ techStacks }) {
  const categories = useMemo(() => getActiveTechCategories(techStacks), [techStacks]);
  const [active, setActive] = useState(TAB_ALL);

  const filtered = useMemo(() => {
    if (active === TAB_ALL) return techStacks ?? [];
    return (techStacks ?? []).filter(
      (item) => normalizeTechCategory(item.category) === active
    );
  }, [techStacks, active]);

  if (!techStacks?.length) {
    return (
      <p className="text-center text-zinc-500 text-sm py-6">
        Belum ada tech stack. Tambah dari Dashboard → Tech Stack.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      <div
        className="flex flex-wrap justify-center gap-2 px-2"
        role="tablist"
        aria-label="Tech categories"
      >
        <CategoryTab
          active={active === TAB_ALL}
          onClick={() => setActive(TAB_ALL)}
          label="Semua"
        />
        {categories.map((cat) => (
          <CategoryTab
            key={cat.id}
            active={active === cat.id}
            onClick={() => setActive(cat.id)}
            label={cat.label}
          />
        ))}
      </div>

      {active !== TAB_ALL && (
        <p className="text-center font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">
          {getTechCategoryLabel(active)}
        </p>
      )}

      <TechStackLoop techStacks={filtered} />
    </div>
  );
}

function CategoryTab({ active, onClick, label }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`px-3 py-1.5 font-mono text-[10px] sm:text-xs uppercase tracking-wider border transition-colors ${
        active
          ? "border-sky-500/50 bg-sky-500/10 text-sky-300"
          : "border-zinc-800 bg-zinc-950/60 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
      }`}
    >
      {label}
    </button>
  );
}
