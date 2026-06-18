import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import { mapJourney, journeyToDb } from "../../utils/supabase/mappers";
import { GraduationCap, Briefcase, Users, Plus, Trash2, Pencil, X, Route } from "lucide-react";
import {
  DashboardCard,
  DashboardPageIcon,
  inputClass,
  PrimaryButton,
  SecondaryButton,
  GlowButton,
} from "../../components/ui/layout";

const TYPES = [
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "organization", label: "Organization", icon: Users },
];

const emptyForm = {
  period: "",
  title: "",
  org: "",
  description: "",
  type: "education",
  order_index: 0,
};

export default function JourneyAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("journey")
      .select("*")
      .order("type")
      .order("order_index", { ascending: true });
    setItems(mapJourney(data));
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (item) => {
    setForm({
      period: item.period,
      title: item.title,
      org: item.org,
      description: item.description || "",
      type: item.type,
      order_index: item.order_index || 0,
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    if (editingId) {
      await supabase
        .from("journey")
        .update(journeyToDb(form))
        .eq("id", editingId);
    } else {
      await supabase.from("journey").insert(journeyToDb(form));
    }

    resetForm();
    setSaving(false);
    fetchItems();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this item?")) return;
    await supabase.from("journey").delete().eq("id", id);
    fetchItems();
  };

  const grouped = TYPES.map((type) => ({
    ...type,
    items: items.filter((i) => i.type === type.id),
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <DashboardPageIcon>
            <Route className="w-4 h-4" />
          </DashboardPageIcon>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-100">Journey</h1>
            <p className="text-zinc-600 text-xs font-mono uppercase tracking-wider">
              {loading ? "Loading..." : `${items.length} items total`}
            </p>
          </div>
        </div>

        <PrimaryButton
          type="button"
          onClick={() => { resetForm(); setShowForm(true); }}
          className="shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </PrimaryButton>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={resetForm} />
          <div className="relative z-10 w-full max-w-lg border border-zinc-800 bg-zinc-950">
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
              <h2 className="text-base font-semibold text-white">
                {editingId ? "Edit Journey" : "Add Journey"}
              </h2>
              <SecondaryButton type="button" onClick={resetForm} className="!p-1 !text-gray-500 hover:!text-white">
                <X className="w-5 h-5" />
              </SecondaryButton>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {/* Type selector */}
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] text-sky-500/80 uppercase tracking-widest">Type</label>
                <div className="flex gap-2">
                  {TYPES.map((t) => {
                    const Icon = t.icon;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, type: t.id }))}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium border transition-colors ${
                          form.type === t.id
                            ? "border-sky-500/50 bg-sky-500/10 text-sky-300"
                            : "border-zinc-800 text-zinc-500 hover:border-zinc-700"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] text-sky-500/80 uppercase tracking-widest">Period</label>
                  <input
                    value={form.period}
                    onChange={(e) => setForm((f) => ({ ...f, period: e.target.value }))}
                    placeholder="e.g. 2024 - 2024"
                    required
                    className={`${inputClass} px-4 py-2.5 text-sm`}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] text-sky-500/80 uppercase tracking-widest">Order</label>
                  <input
                    type="number"
                    value={form.order_index}
                    onChange={(e) => setForm((f) => ({ ...f, order_index: Number(e.target.value) }))}
                    className={`${inputClass} px-4 py-2.5 text-sm`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-[10px] text-sky-500/80 uppercase tracking-widest">Title</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Frontend Developer Intern"
                  required
                  className={`${inputClass} px-4 py-2.5 text-sm`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-[10px] text-sky-500/80 uppercase tracking-widest">Organization / Company</label>
                <input
                  value={form.org}
                  onChange={(e) => setForm((f) => ({ ...f, org: e.target.value }))}
                  placeholder="e.g. Universitas Brawijaya"
                  required
                  className={`${inputClass} px-4 py-2.5 text-sm`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-[10px] text-sky-500/80 uppercase tracking-widest">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Brief description of your role and achievements..."
                  rows={3}
                  className={`${inputClass} px-4 py-2.5 text-sm resize-none min-h-[80px]`}
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <SecondaryButton type="button" onClick={resetForm} className="!text-gray-400">
                  Cancel
                </SecondaryButton>
                <PrimaryButton type="submit" disabled={saving}>
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  <span>{saving ? "Saving..." : editingId ? "Update" : "Add Item"}</span>
                </PrimaryButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grouped items */}
      {loading ? (
        <div className="space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-white/5 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {grouped.map(({ id, label, icon: Icon, items: groupItems }) => (
            <div key={id}>
              <div className="flex items-center gap-2 mb-4">
                <Icon className="w-4 h-4 text-sky-400" />
                <h2 className="text-sm font-semibold text-zinc-200">{label}</h2>
                <span className="font-mono text-[10px] text-zinc-600">({groupItems.length})</span>
              </div>

              {groupItems.length === 0 ? (
                <DashboardCard>
                  <div className="p-8 text-center">
                    <Icon className="w-6 h-6 text-zinc-700 mx-auto mb-2" />
                    <p className="text-zinc-600 text-xs">No {label.toLowerCase()} items yet.</p>
                  </div>
                </DashboardCard>
              ) : (
                <div className="space-y-2">
                  {groupItems.map((item) => (
                    <DashboardCard key={item.id}>
                      <div className="flex items-center gap-4 p-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-[10px] uppercase tracking-widest text-sky-500/80">
                              {item.period}
                            </span>
                            <span className="text-zinc-700">·</span>
                            <span className="text-xs text-zinc-500">#{item.order_index}</span>
                          </div>
                          <h3 className="text-sm font-semibold text-zinc-100 truncate">{item.title}</h3>
                          <p className="text-xs text-zinc-500 truncate">{item.org}</p>
                          {item.description && (
                            <p className="text-xs text-zinc-600 mt-1 line-clamp-1">{item.description}</p>
                          )}
                        </div>

                        <div className="flex gap-1.5 shrink-0">
                          <GlowButton
                            variant="ghost"
                            type="button"
                            onClick={() => handleEdit(item)}
                            className="!px-3 !py-1.5 !text-sky-400 hover:!text-sky-300"
                          >
                            <Pencil className="w-3 h-3" />
                          </GlowButton>
                          <GlowButton
                            variant="ghost"
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            className="!px-3 !py-1.5 !text-red-400 hover:!text-red-300"
                          >
                            <Trash2 className="w-3 h-3" />
                          </GlowButton>
                        </div>
                      </div>
                    </DashboardCard>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
