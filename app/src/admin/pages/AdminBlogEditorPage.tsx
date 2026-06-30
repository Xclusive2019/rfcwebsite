import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { toast } from "sonner";

const PILLARS = [
  "R638 & COA Compliance",
  "HACCP Implementation",
  "FSSC 22000",
  "Food Defence & Culture",
  "Audience-Specific",
];

const CATEGORIES = [
  "Regulations", "Certifications", "Risk Management", "HACCP", "FSSC 22000",
  "Small Business", "Auditing", "Export", "Food Safety Culture", "Technology",
  "Allergens", "Pest Control",
];

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

interface FormData {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  pillar: string;
  read_time: string;
  featured: boolean;
  published: boolean;
  author: string;
  content: string;
  cover_image: string;
  video_url: string;
}

const empty: FormData = {
  title: "",
  slug: "",
  excerpt: "",
  category: "",
  pillar: "",
  read_time: "",
  featured: false,
  published: false,
  author: "RFC Team",
  content: "",
  cover_image: "",
  video_url: "",
};

export default function AdminBlogEditorPage() {
  const { id } = useParams<{ id?: string }>();
  const isNew = !id;
  const navigate = useNavigate();

  const [form, setForm] = useState<FormData>(empty);
  const [originalPublishedAt, setOriginalPublishedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!id) return;
    supabase
      .from("blog_posts")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          toast.error("Post not found");
          navigate("/admin/blog");
          return;
        }
        setForm({
          title: data.title ?? "",
          slug: data.slug ?? "",
          excerpt: data.excerpt ?? "",
          category: data.category ?? "",
          pillar: data.pillar ?? "",
          read_time: data.read_time ?? "",
          featured: data.featured ?? false,
          published: data.published ?? false,
          author: data.author ?? "RFC Team",
          content: data.content ?? "",
          cover_image: data.cover_image ?? "",
          video_url: data.video_url ?? "",
        });
        setOriginalPublishedAt(data.published_at ?? null);
        setLoading(false);
      });
  }, [id, navigate]);

  function set<K extends keyof FormData>(key: K, val: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  function handleTitleChange(val: string) {
    setForm((prev) => ({
      ...prev,
      title: val,
      slug: isNew ? slugify(val) : prev.slug,
    }));
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

    const { error: uploadError } = await supabase.storage
      .from("blog-images")
      .upload(path, file, { upsert: false });

    if (uploadError) {
      toast.error("Image upload failed: " + uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("blog-images").getPublicUrl(path);
    set("cover_image", data.publicUrl);
    toast.success("Image uploaded");
    setUploading(false);
  }

  async function handleRemoveImage() {
    const url = form.cover_image;
    set("cover_image", "");

    // Best-effort delete from storage (extract path from URL)
    try {
      const urlObj = new URL(url);
      const parts = urlObj.pathname.split("/blog-images/");
      if (parts[1]) {
        await supabase.storage.from("blog-images").remove([parts[1]]);
      }
    } catch {
      // If URL parsing fails, just clear the field — don't block the user
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.slug.trim()) {
      toast.error("Title and slug are required");
      return;
    }

    setSaving(true);
    const now = new Date().toISOString();
    const payload = {
      ...form,
      updated_at: now,
      published_at: form.published && !originalPublishedAt ? now : originalPublishedAt,
    };

    let error;
    if (isNew) {
      ({ error } = await supabase.from("blog_posts").insert({ ...payload, created_at: now }));
    } else {
      ({ error } = await supabase.from("blog_posts").update(payload).eq("id", id));
    }

    setSaving(false);
    if (error) {
      toast.error(error.message.includes("duplicate") ? "A post with this slug already exists" : "Failed to save post");
    } else {
      toast.success(isNew ? "Post created" : "Post saved");
      navigate("/admin/blog");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#4A7C2F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/admin/blog" className="text-gray-400 hover:text-gray-600">
          <span className="material-icon text-xl">arrow_back</span>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{isNew ? "New Post" : "Edit Post"}</h1>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Post Details</h2>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#4A7C2F] transition-colors"
              placeholder="Post title"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug *</label>
            <input
              type="text"
              required
              value={form.slug}
              onChange={(e) => set("slug", slugify(e.target.value))}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-[#4A7C2F] transition-colors"
              placeholder="post-url-slug"
            />
          </div>

          {/* Cover image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Cover Image</label>
            {form.cover_image ? (
              <div className="relative w-full rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                <img
                  src={form.cover_image}
                  alt="Cover"
                  className="w-full max-h-56 object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition-colors"
                  title="Remove image"
                >
                  <span className="material-icon text-[18px]">close</span>
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file) handleImageUpload(file);
                }}
                className="flex flex-col items-center justify-center gap-2 w-full h-36 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-[#4A7C2F] hover:bg-green-50/30 transition-colors"
              >
                {uploading ? (
                  <div className="w-6 h-6 border-2 border-[#4A7C2F] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span className="material-icon text-3xl text-gray-300">add_photo_alternate</span>
                    <p className="text-sm text-gray-400">Click or drag & drop to upload</p>
                    <p className="text-xs text-gray-300">JPG, PNG, WebP — max 5 MB</p>
                  </>
                )}
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file);
                e.target.value = "";
              }}
            />
            {/* Manual URL fallback */}
            <input
              type="url"
              value={form.cover_image}
              onChange={(e) => set("cover_image", e.target.value)}
              className="mt-2 w-full border border-gray-200 rounded-lg px-4 py-2 text-xs font-mono text-gray-500 focus:outline-none focus:border-[#4A7C2F] transition-colors"
              placeholder="Or paste an image URL…"
            />
          </div>

          {/* Video URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">YouTube / Video URL</label>
            <input
              type="url"
              value={form.video_url}
              onChange={(e) => set("video_url", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#4A7C2F] transition-colors"
              placeholder="https://www.youtube.com/watch?v=..."
            />
            <p className="mt-1.5 text-xs text-gray-400">
              Optional. Paste a YouTube link to show a video player on the article page.
            </p>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Excerpt</label>
            <textarea
              rows={3}
              value={form.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm resize-none focus:outline-none focus:border-[#4A7C2F] transition-colors"
              placeholder="Short description shown in blog listing…"
            />
          </div>

          {/* Meta row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-[#4A7C2F] transition-colors"
              >
                <option value="">Select category</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Content Pillar</label>
              <select
                value={form.pillar}
                onChange={(e) => set("pillar", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-[#4A7C2F] transition-colors"
              >
                <option value="">Select pillar</option>
                {PILLARS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Read Time</label>
              <input
                type="text"
                value={form.read_time}
                onChange={(e) => set("read_time", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#4A7C2F] transition-colors"
                placeholder="e.g. 8 min"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Author</label>
              <input
                type="text"
                value={form.author}
                onChange={(e) => set("author", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#4A7C2F] transition-colors"
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => set("featured", e.target.checked)}
                className="w-4 h-4 accent-[#C9A227]"
              />
              <span className="text-sm text-gray-700">Featured post</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => set("published", e.target.checked)}
                className="w-4 h-4 accent-[#4A7C2F]"
              />
              <span className="text-sm text-gray-700">Published</span>
            </label>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Content (Markdown)</label>
          <textarea
            rows={24}
            value={form.content}
            onChange={(e) => set("content", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-mono resize-y focus:outline-none focus:border-[#4A7C2F] transition-colors"
            placeholder="Write your post content in Markdown…"
          />
        </div>

        {/* Save */}
        <div className="flex gap-3 justify-end">
          <Link
            to="/admin/blog"
            className="px-5 py-2.5 border border-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving || uploading}
            className="px-6 py-2.5 bg-[#4A7C2F] hover:bg-[#3d6827] disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {saving ? "Saving…" : isNew ? "Create Post" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
