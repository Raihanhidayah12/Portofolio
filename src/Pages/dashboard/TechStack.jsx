import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import { mapTechStack, techStackToDb, resolveTechStackIcon } from "../../utils/supabase/mappers";
import { Boxes, Plus, Trash2, Upload, Pencil } from "lucide-react";
import {
  DashboardCard,
  DashboardPageIcon,
  inputClass,
  PrimaryButton,
  SecondaryButton,
  GlowButton,
} from "../../components/ui/layout";

const emptyForm = {
  name: "",
  icon: "",
  order_index: 0,
  is_published: true,
};

export default function TechStackAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("tech_stack")
      .select("*")
      .order("order_index", { ascending: true });
    if (error) console.error(error);
    setItems(mapTechStack(data));
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setFile(null);
    setPreview(null);
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      icon: item.icon,
      order_index: item.order_index,
      is_published: item.is_published,
    });
    setPreview(item.icon);
    setFile(null);
  };

  const uploadIcon = async () => {
    if (!file) return form.icon;
    const fileName = `stack-${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("tech-stack-icons").upload(fileName, file);
    if (error) throw error;
    const { data } = supabase.storage.from("tech-stack-icons").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return alert("Nama teknologi wajib diisi");
    setSaving(true);
    try {
      let iconUrl = form.icon;
      if (file) iconUrl = await uploadIcon();
      if (!iconUrl) {
        alert("Upload icon atau isi path icon (contoh: /reactjs.svg)");
        setSaving(false);
        return;
      }
      iconUrl = resolveTechStackIcon(iconUrl);

      const payload = techStackToDb({
        name: form.name.trim(),
        icon: iconUrl,
        order_index: form.order_index,
        is_published: form.is_published,
      });

      if (editingId) {
        await supabase.from("tech_stack").update(payload).eq("id", editingId);
      } else {
        await supabase.from("tech_stack").insert(payload);
      }
      resetForm();
      fetchItems();
    } catch (err) {
      alert(err.message || "Gagal menyimpan");
    }
    setSaving(false);
  };

  const deleteItem = async (id) => {
    if (!confirm("Hapus item tech stack ini?")) return;
    await supabase.from("tech_stack").delete().eq("id", id);
    if (editingId === id) resetForm();
    fetchItems();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <DashboardPageIcon>
          <Boxes className="w-4 h-4" />
        </DashboardPageIcon>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-100">Tech Stack</h1>
          <p className="text-zinc-600 text-xs font-mono uppercase tracking-wider">
            {loading ? "Loading..." : `${items.length} technologies`}
          </p>
        </div>
      </div>

      <DashboardCard>
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
            {editingId ? <Pencil className="w-4 h-4 text-sky-400" /> : <Plus className="w-4 h-4 text-sky-400" />}
            {editingId ? "Edit Technology" : "Add Technology"}
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block space-y-1.5">
              <span className="text-xs text-gray-400">Name</span>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="ReactJS"
                className={`${inputClass} px-3 py-2 text-sm`}
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs text-gray-400">Order</span>
              <input
                type="number"
                value={form.order_index}
                onChange={(e) => setForm((f) => ({ ...f, order_index: e.target.value }))}
                className={`${inputClass} px-3 py-2 text-sm`}
              />
            </label>
          </div>

          <label className="block space-y-1.5">
            <span className="text-xs text-gray-400">Icon path atau URL</span>
            <input
              value={form.icon}
              onChange={(e) => {
                setForm((f) => ({ ...f, icon: e.target.value }));
                if (!file) setPreview(resolveTechStackIcon(e.target.value));
              }}
              placeholder="/reactjs.svg"
              className={`${inputClass} px-3 py-2 text-sm`}
            />
          </label>

          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_published}
                onChange={(e) => setForm((f) => ({ ...f, is_published: e.target.checked }))}
                className="rounded"
              />
              Published (tampil di website)
            </label>
            <label className="flex items-center gap-2 px-3 py-2 border border-zinc-800 text-sm text-zinc-400 cursor-pointer hover:border-sky-500/30">
              <Upload className="w-4 h-4" />
              Upload icon
              <input
                type="file"
                accept="image/*,.svg"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  setFile(f);
                  setPreview(URL.createObjectURL(f));
                }}
              />
            </label>
          </div>

          {preview && (
            <div className="flex items-center gap-3 p-3 border border-zinc-800 bg-zinc-900/50 w-fit">
              <img src={preview} alt="" className="w-12 h-12 object-contain" />
              <span className="text-xs text-gray-400">Preview</span>
            </div>
          )}

          <div className="flex gap-2">
            <PrimaryButton type="submit" disabled={saving}>
              {saving ? "Saving..." : editingId ? "Update" : "Add"}
            </PrimaryButton>
            {editingId && (
              <SecondaryButton type="button" onClick={resetForm}>
                Cancel
              </SecondaryButton>
            )}
          </div>
        </form>
      </DashboardCard>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <DashboardCard key={item.id}>
            <div className="p-4 flex flex-col items-center gap-2 text-center">
              <img src={item.icon} alt={item.name} className="w-14 h-14 object-contain" />
              <p className="text-sm font-medium text-zinc-100">{item.name}</p>
              <p className="text-[10px] text-gray-500">Order: {item.order_index}</p>
              {!item.is_published && (
                <span className="text-[10px] text-amber-400">Draft</span>
              )}
              <div className="flex gap-2 mt-2 w-full">
                <GlowButton
                  type="button"
                  variant="ghost"
                  onClick={() => startEdit(item)}
                  wrapperClassName="flex-1"
                  className="w-full flex-1 !py-1.5 !text-xs !text-zinc-400"
                >
                  Edit
                </GlowButton>
                <GlowButton
                  type="button"
                  variant="ghost"
                  onClick={() => deleteItem(item.id)}
                  wrapperClassName="flex-1"
                  className="w-full flex-1 !py-1.5 !text-xs !text-red-300"
                >
                  <Trash2 className="w-3 h-3" /> Del
                </GlowButton>
              </div>
            </div>
          </DashboardCard>
        ))}
      </div>
    </div>
  );
}
