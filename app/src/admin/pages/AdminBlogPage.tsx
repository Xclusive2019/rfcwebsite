import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { toast } from "sonner";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: string | null;
  pillar: string | null;
  read_time: string | null;
  featured: boolean;
  published: boolean;
  published_at: string | null;
  created_at: string;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ ids: string[]; label: string } | null>(null);

  useEffect(() => {
    supabase
      .from("blog_posts")
      .select("id,slug,title,category,pillar,read_time,featured,published,published_at,created_at")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setPosts((data as BlogPost[]) ?? []);
        setLoading(false);
      });
  }, []);

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selected.size === posts.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(posts.map((p) => p.id)));
    }
  }

  async function togglePublished(post: BlogPost) {
    setToggling(post.id);
    const newPublished = !post.published;
    const { error } = await supabase
      .from("blog_posts")
      .update({
        published: newPublished,
        published_at: newPublished && !post.published_at ? new Date().toISOString() : post.published_at,
      })
      .eq("id", post.id);
    if (error) {
      toast.error("Failed to update post");
    } else {
      setPosts((prev) =>
        prev.map((p) => p.id === post.id ? { ...p, published: newPublished } : p)
      );
      toast.success(newPublished ? "Post published" : "Post unpublished");
    }
    setToggling(null);
  }

  async function toggleFeatured(post: BlogPost) {
    setToggling(`feat-${post.id}`);
    const { error } = await supabase
      .from("blog_posts")
      .update({ featured: !post.featured })
      .eq("id", post.id);
    if (error) {
      toast.error("Failed to update post");
    } else {
      setPosts((prev) =>
        prev.map((p) => p.id === post.id ? { ...p, featured: !p.featured } : p)
      );
    }
    setToggling(null);
  }

  function requestDelete(ids: string[], label: string) {
    setConfirmDelete({ ids, label });
  }

  async function confirmAndDelete() {
    if (!confirmDelete) return;
    const { ids } = confirmDelete;
    const isBulk = ids.length > 1;
    if (isBulk) setBulkDeleting(true);

    const { error } = await supabase.from("blog_posts").delete().in("id", ids);
    if (error) {
      toast.error("Failed to delete post(s)");
    } else {
      setPosts((prev) => prev.filter((p) => !ids.includes(p.id)));
      setSelected((prev) => {
        const next = new Set(prev);
        ids.forEach((id) => next.delete(id));
        return next;
      });
      toast.success(isBulk ? `${ids.length} posts deleted` : "Post deleted");
    }

    setBulkDeleting(false);
    setConfirmDelete(null);
  }

  const allSelected = posts.length > 0 && selected.size === posts.length;
  const someSelected = selected.size > 0 && !allSelected;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
        <div className="flex items-center gap-3">
          {selected.size > 0 && (
            <button
              onClick={() =>
                requestDelete(
                  Array.from(selected),
                  `${selected.size} selected post${selected.size > 1 ? "s" : ""}`
                )
              }
              disabled={bulkDeleting}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
            >
              <span className="material-icon text-[18px]">delete</span>
              Delete {selected.size} selected
            </button>
          )}
          <Link
            to="/admin/blog/new"
            className="flex items-center gap-2 bg-[#4A7C2F] hover:bg-[#3d6827] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
          >
            <span className="material-icon text-[18px]">add</span>
            New Post
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-[#4A7C2F] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm mb-4">No blog posts yet</p>
            <Link to="/admin/blog/new" className="text-[#4A7C2F] text-sm hover:underline">
              Create your first post
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-5 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => { if (el) el.indeterminate = someSelected; }}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-[#4A7C2F] cursor-pointer accent-[#4A7C2F]"
                  />
                </th>
                <th className="text-left px-5 py-3">Title</th>
                <th className="text-left px-5 py-3">Category</th>
                <th className="text-left px-5 py-3">Pillar</th>
                <th className="text-left px-5 py-3">Read</th>
                <th className="text-left px-5 py-3">Featured</th>
                <th className="text-left px-5 py-3">Published</th>
                <th className="text-left px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {posts.map((p) => (
                <tr
                  key={p.id}
                  className={`hover:bg-gray-50 ${selected.has(p.id) ? "bg-green-50" : ""}`}
                >
                  <td className="px-5 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(p.id)}
                      onChange={() => toggleSelect(p.id)}
                      className="w-4 h-4 rounded border-gray-300 cursor-pointer accent-[#4A7C2F]"
                    />
                  </td>
                  <td className="px-5 py-3">
                    <div className="font-medium text-gray-900 max-w-xs truncate">{p.title}</div>
                    <div className="text-xs text-gray-400 font-mono">{p.slug}</div>
                  </td>
                  <td className="px-5 py-3 text-gray-600">{p.category ?? "—"}</td>
                  <td className="px-5 py-3 text-gray-500 text-xs max-w-[140px] truncate">{p.pillar ?? "—"}</td>
                  <td className="px-5 py-3 text-gray-600">{p.read_time ?? "—"}</td>
                  <td className="px-5 py-3">
                    <button
                      disabled={toggling === `feat-${p.id}`}
                      onClick={() => toggleFeatured(p)}
                      className={`text-xs font-medium px-2 py-0.5 rounded-full transition-colors ${
                        p.featured ? "bg-[#C9A227]/20 text-[#a07c10]" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {p.featured ? "Featured" : "No"}
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <button
                      disabled={toggling === p.id}
                      onClick={() => togglePublished(p)}
                      className={`text-xs font-medium px-2 py-0.5 rounded-full transition-colors ${
                        p.published ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {p.published ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Link
                        to={`/admin/blog/${p.id}`}
                        className="text-xs text-[#4A7C2F] hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => requestDelete([p.id], `"${p.title}"`)}
                        className="text-xs text-gray-400 hover:text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Confirmation dialog */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4">
            <h2 className="text-base font-semibold text-gray-900 mb-2">Delete {confirmDelete.label}?</h2>
            <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmAndDelete}
                disabled={bulkDeleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-lg transition-colors"
              >
                {bulkDeleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
