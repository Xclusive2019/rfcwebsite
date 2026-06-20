import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { supabase } from "../lib/supabase";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  published_at: string | null;
  read_time: string;
  pillar: string;
  featured: boolean;
}

function formatDate(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-ZA", { month: "long", year: "numeric" });
}

export default function BlogPage() {
  useScrollReveal();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [pillar, setPillar] = useState("All Pillars");

  useEffect(() => {
    supabase
      .from("blog_posts")
      .select("id,title,slug,excerpt,category,published_at,read_time,pillar,featured")
      .eq("published", true)
      .order("published_at", { ascending: false })
      .then(({ data }) => {
        setPosts((data as Post[]) ?? []);
        setLoading(false);
      });
  }, []);

  const cats = ["All", ...Array.from(new Set(posts.map((p) => p.category).filter(Boolean)))];
  const pillars = ["All Pillars", ...Array.from(new Set(posts.map((p) => p.pillar).filter(Boolean)))];

  const filtered = posts.filter((p) => {
    const mq = q === "" || p.title.toLowerCase().includes(q.toLowerCase()) || (p.excerpt ?? "").toLowerCase().includes(q.toLowerCase());
    const mc = cat === "All" || p.category === cat;
    const mp = pillar === "All Pillars" || p.pillar === pillar;
    return mq && mc && mp;
  });

  const featured = posts.filter((p) => p.featured);

  return (
    <div className="pt-24">
      {/* Header */}
      <section className="bg-[#0a0a0c] py-12 lg:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1920&q=80)" }}>
          <div className="absolute inset-0 bg-[#0a0a0c]/65" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0c]/80 via-[#0a0a0c]/40 to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-8 transition-colors">
            <span className="material-icon text-[16px]">arrow_back</span> Back to Home
          </Link>
          <p className="label text-white/30 mb-4">Expert Insights</p>
          <h1 className="heading-xl text-white max-w-2xl">Food Safety Knowledge Hub</h1>
        </div>
      </section>

      {/* Featured */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="label mb-8">Featured Articles</p>
          {loading ? (
            <div className="grid md:grid-cols-3 gap-px bg-[#e0e0e0]">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-8">
                  <div className="h-3 bg-gray-100 rounded animate-pulse w-20 mb-4" />
                  <div className="h-4 bg-gray-100 rounded animate-pulse mb-2" />
                  <div className="h-4 bg-gray-100 rounded animate-pulse w-4/5 mb-3" />
                  <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
                </div>
              ))}
            </div>
          ) : featured.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-px bg-[#e0e0e0]">
              {featured.map((p) => (
                <Link key={p.id} to={`/blog/${p.slug || p.id}`} className="group bg-white p-8 hover:bg-[#f8f8f7] transition-colors">
                  <span className="text-[13px] font-medium text-[#4A7C2F] uppercase tracking-wider">{p.category}</span>
                  <h3 className="text-lg font-semibold text-[#1a1a1e] mt-3 mb-3 leading-snug group-hover:text-[#4A7C2F] transition-colors">{p.title}</h3>
                  <p className="text-[15px] text-[#4a4a4e] leading-relaxed">{p.excerpt}</p>
                  <span className="text-[13px] text-[#999] mt-4 block">{formatDate(p.published_at)} &middot; {p.read_time}</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-[15px] text-[#999]">No featured articles yet.</p>
          )}
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 border-y border-[#e0e0e0] bg-[#f8f8f7]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            <div className="relative flex-1 max-w-sm">
              <span className="material-icon text-[16px] text-[#ccc] absolute left-3 top-1/2 -translate-y-1/2">search</span>
              <input type="text" placeholder="Search articles..." value={q} onChange={(e) => setQ(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#e0e0e0] text-base focus:outline-none focus:border-[#4A7C2F] transition-colors" />
            </div>
            <div className="flex items-center gap-2">
              <select value={cat} onChange={(e) => setCat(e.target.value)} className="px-4 py-2.5 bg-white border border-[#e0e0e0] text-base focus:outline-none focus:border-[#4A7C2F] cursor-pointer">
                {cats.map((c) => (<option key={c} value={c}>{c}</option>))}
              </select>
              <select value={pillar} onChange={(e) => setPillar(e.target.value)} className="px-4 py-2.5 bg-white border border-[#e0e0e0] text-base focus:outline-none focus:border-[#4A7C2F] cursor-pointer">
                {pillars.map((p) => (<option key={p} value={p}>{p}</option>))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Posts */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {!loading && <p className="label mb-8">{filtered.length} Articles</p>}
          <div className="border-t border-[#e0e0e0]">
            {loading ? (
              [...Array(6)].map((_, i) => (
                <div key={i} className="flex gap-8 py-6 border-b border-[#eee] animate-pulse">
                  <div className="h-3 bg-gray-100 rounded w-24 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-100 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
              ))
            ) : (
              filtered.map((p) => (
                <Link key={p.id} to={`/blog/${p.slug || p.id}`} className="group flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-8 py-6 border-b border-[#eee] hover:bg-[#f8f8f7] transition-colors px-2 -mx-2">
                  <span className="text-[13px] text-[#999] font-medium uppercase tracking-wider w-32 shrink-0">{p.category}</span>
                  <div className="flex-1">
                    <h3 className="text-[17px] font-medium text-[#1a1a1e] group-hover:text-[#4A7C2F] transition-colors">{p.title}</h3>
                    <p className="text-[15px] text-[#999] mt-1.5 hidden lg:block">{p.excerpt}</p>
                  </div>
                  <span className="text-[13px] text-[#999] w-16 text-right shrink-0">{p.read_time}</span>
                </Link>
              ))
            )}
          </div>
          {!loading && filtered.length === 0 && <div className="text-center py-16 text-[#999]">No articles found. Try adjusting your search.</div>}
        </div>
      </section>

      {/* Pillars */}
      <section className="py-20 bg-[#f8f8f7]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="heading-md mb-10">Content Pillars</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {pillars.filter((p) => p !== "All Pillars").map((pil) => (
              <button key={pil} onClick={() => setPillar(pillar === pil ? "All Pillars" : pil)}
                className={`text-left p-6 border transition-all ${pillar === pil ? "border-[#4A7C2F] bg-white" : "border-[#e0e0e0] bg-white hover:border-[#ccc]"}`}>
                <span className="text-[13px] text-[#999] font-medium">{posts.filter((p) => p.pillar === pil).length} articles</span>
                <p className="text-[15px] font-medium text-[#1a1a1e] mt-2">{pil}</p>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
