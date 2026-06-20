import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { toast } from "sonner";

interface Product {
  id: string;
  code: string;
  name: string;
  pack: string;
  unit: string;
  qty_per_carton: number;
  price: number;
  category: string;
  image_url: string | null;
  data_sheet_url: string | null;
  data_sheet_is_pdf: boolean;
  is_active: boolean;
  sort_order: number;
}

type ProductForm = Omit<Product, "id" | "image_url" | "data_sheet_url"> & {
  image_url: string;
  data_sheet_url: string;
};

const PACK_OPTIONS = ["Aerosol", "Cartridge", "Tin", "Tube", "Bucket", "Drum"];

const emptyForm: ProductForm = {
  code: "",
  name: "",
  pack: "Aerosol",
  unit: "",
  qty_per_carton: 1,
  price: 0,
  category: "Food Grade (NSF Certified)",
  image_url: "",
  data_sheet_url: "",
  data_sheet_is_pdf: false,
  is_active: true,
  sort_order: 0,
};

const formatPrice = (value: number) =>
  "R" + value.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | "new" | null>(null);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true });
    setProducts(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleActive(p: Product) {
    const { error } = await supabase.from("products").update({ is_active: !p.is_active }).eq("id", p.id);
    if (error) {
      toast.error("Failed to update");
      return;
    }
    setProducts((prev) => prev.map((x) => (x.id === p.id ? { ...x, is_active: !x.is_active } : x)));
  }

  async function handleDelete(p: Product) {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    const { error } = await supabase.from("products").delete().eq("id", p.id);
    if (error) {
      toast.error("Failed to delete product");
      return;
    }
    toast.success("Product deleted");
    setProducts((prev) => prev.filter((x) => x.id !== p.id));
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shop Products</h1>
          <p className="text-sm text-gray-400 mt-1">{products.length} products · manage the food-grade lubricant range</p>
        </div>
        <button
          onClick={() => setEditing("new")}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#4A7C2F] hover:bg-[#3d6827] text-white text-sm font-medium rounded-lg transition-colors"
        >
          <span className="material-icon text-[18px]">add</span>
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-[#4A7C2F] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-400 py-16 text-sm">No products yet — add your first one.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="text-left px-5 py-3 w-16" />
                <th className="text-left px-5 py-3">Code</th>
                <th className="text-left px-5 py-3">Name</th>
                <th className="text-left px-5 py-3">Pack</th>
                <th className="text-right px-5 py-3">Price</th>
                <th className="text-center px-5 py-3">Active</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((p) => (
                <tr key={p.id} className={`hover:bg-gray-50 ${!p.is_active ? "opacity-50" : ""}`}>
                  <td className="px-5 py-2">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name} className="w-10 h-10 object-contain bg-gray-50 rounded" />
                    ) : (
                      <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                        <span className="material-icon text-gray-300 text-[18px]">image</span>
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-gray-500">{p.code}</td>
                  <td className="px-5 py-3 font-medium text-gray-900 max-w-xs truncate">{p.name}</td>
                  <td className="px-5 py-3 text-gray-600">{p.pack} · {p.unit}</td>
                  <td className="px-5 py-3 text-right text-gray-900">{formatPrice(Number(p.price))}</td>
                  <td className="px-5 py-3 text-center">
                    <button
                      onClick={() => toggleActive(p)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${p.is_active ? "bg-[#4A7C2F]" : "bg-gray-300"}`}
                      title={p.is_active ? "Visible in shop" : "Hidden from shop"}
                    >
                      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${p.is_active ? "translate-x-[18px]" : "translate-x-1"}`} />
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <button onClick={() => setEditing(p)} className="text-[#4A7C2F] hover:underline text-xs font-medium">Edit</button>
                      <button onClick={() => handleDelete(p)} className="text-red-500 hover:underline text-xs font-medium">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editing && (
        <ProductEditor
          product={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
          }}
        />
      )}
    </div>
  );
}

function ProductEditor({
  product,
  onClose,
  onSaved,
}: {
  product: Product | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<ProductForm>(
    product
      ? { ...product, image_url: product.image_url ?? "", data_sheet_url: product.data_sheet_url ?? "" }
      : emptyForm
  );
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  function set<K extends keyof ProductForm>(key: K, value: ProductForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleImageUpload(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5 MB");
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("product-images").upload(path, file, { upsert: false });
    if (uploadError) {
      toast.error("Image upload failed: " + uploadError.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    set("image_url", data.publicUrl);
    toast.success("Image uploaded");
    setUploading(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.code.trim() || !form.name.trim()) {
      toast.error("Item code and name are required");
      return;
    }
    setSaving(true);
    const payload = {
      code: form.code.trim(),
      name: form.name.trim(),
      pack: form.pack,
      unit: form.unit.trim(),
      qty_per_carton: Number(form.qty_per_carton) || 1,
      price: Number(form.price) || 0,
      category: form.category.trim() || "Food Grade (NSF Certified)",
      image_url: form.image_url.trim() || null,
      data_sheet_url: form.data_sheet_url.trim() || null,
      data_sheet_is_pdf: form.data_sheet_is_pdf,
      is_active: form.is_active,
      sort_order: Number(form.sort_order) || 0,
    };

    let error;
    if (product) {
      ({ error } = await supabase.from("products").update(payload).eq("id", product.id));
    } else {
      ({ error } = await supabase.from("products").insert(payload));
    }
    setSaving(false);

    if (error) {
      toast.error(error.message.includes("duplicate") ? "That item code already exists" : "Failed to save product");
      return;
    }
    toast.success(product ? "Product updated" : "Product added");
    onSaved();
  }

  const inputCls =
    "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#4A7C2F] transition-colors";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white">
          <h2 className="font-semibold text-gray-900">{product ? "Edit product" : "Add product"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <span className="material-icon text-xl">close</span>
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-5">
          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Product image</label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                {form.image_url ? (
                  <img src={form.image_url} alt="" className="w-full h-full object-contain p-1" />
                ) : (
                  <span className="material-icon text-gray-300 text-[28px]">image</span>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <label className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm cursor-pointer transition-colors">
                  <span className="material-icon text-[16px]">upload</span>
                  {uploading ? "Uploading…" : "Upload image"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploading}
                    onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                  />
                </label>
                <input
                  type="text"
                  value={form.image_url}
                  onChange={(e) => set("image_url", e.target.value)}
                  placeholder="…or paste an image URL (e.g. /products/x.jpg)"
                  className={inputCls}
                />
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Item code *</label>
              <input type="text" required value={form.code} onChange={(e) => set("code", e.target.value)} className={inputCls} placeholder="e.g. 50310404" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (excl. VAT) *</label>
              <input type="number" step="0.01" min="0" required value={form.price} onChange={(e) => set("price", Number(e.target.value))} className={inputCls} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Name *</label>
            <input type="text" required value={form.name} onChange={(e) => set("name", e.target.value)} className={inputCls} placeholder="e.g. Belt Dressing FG 400ml (EDP)" />
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Pack</label>
              <select value={form.pack} onChange={(e) => set("pack", e.target.value)} className={inputCls}>
                {PACK_OPTIONS.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Unit</label>
              <input type="text" value={form.unit} onChange={(e) => set("unit", e.target.value)} className={inputCls} placeholder="e.g. 400ml" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Qty / carton</label>
              <input type="number" min="1" value={form.qty_per_carton} onChange={(e) => set("qty_per_carton", Number(e.target.value))} className={inputCls} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Data sheet URL</label>
            <input type="url" value={form.data_sheet_url} onChange={(e) => set("data_sheet_url", e.target.value)} className={inputCls} placeholder="https://www.spanjaard.biz/…/TDS.pdf" />
            <label className="flex items-center gap-2 mt-2 cursor-pointer">
              <input type="checkbox" checked={form.data_sheet_is_pdf} onChange={(e) => set("data_sheet_is_pdf", e.target.checked)} className="w-4 h-4 accent-[#4A7C2F]" />
              <span className="text-sm text-gray-600">This link is a downloadable PDF data sheet (otherwise shown as "Product Details")</span>
            </label>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Sort order</label>
              <input type="number" value={form.sort_order} onChange={(e) => set("sort_order", Number(e.target.value))} className={inputCls} />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer pb-2">
                <input type="checkbox" checked={form.is_active} onChange={(e) => set("is_active", e.target.checked)} className="w-4 h-4 accent-[#4A7C2F]" />
                <span className="text-sm text-gray-600">Visible in shop</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-5 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving || uploading} className="px-5 py-2.5 bg-[#4A7C2F] hover:bg-[#3d6827] disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors">
              {saving ? "Saving…" : product ? "Save changes" : "Add product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
