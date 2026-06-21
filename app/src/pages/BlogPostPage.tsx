import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Linkedin, Facebook, MessageCircle, Mail, Link2, Check } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../lib/supabase";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  pillar: string;
  published_at: string | null;
  read_time: string;
  author: string;
  content: string;
  cover_image: string;
  featured: boolean;
}

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" });
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

function ShareBar({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "";
  const eUrl = encodeURIComponent(url);
  const eTitle = encodeURIComponent(title);

  const links = [
    { name: "LinkedIn", Icon: Linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${eUrl}` },
    { name: "X", Icon: XIcon, href: `https://twitter.com/intent/tweet?url=${eUrl}&text=${eTitle}` },
    { name: "Facebook", Icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${eUrl}` },
    { name: "WhatsApp", Icon: MessageCircle, href: `https://wa.me/?text=${eTitle}%20${eUrl}` },
    { name: "Email", Icon: Mail, href: `mailto:?subject=${eTitle}&body=${eUrl}` },
  ];

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy link");
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[13px] text-[#999] font-medium uppercase tracking-wider mr-1">Share</span>
      {links.map(({ name, Icon, href }) => (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${name}`}
          title={`Share on ${name}`}
          className="w-9 h-9 inline-flex items-center justify-center rounded-full border border-[#e0e0e0] text-[#666] hover:border-[#4A7C2F] hover:text-[#4A7C2F] hover:bg-[#4A7C2F]/5 transition-colors"
        >
          <Icon className="w-[18px] h-[18px]" />
        </a>
      ))}
      <button
        type="button"
        onClick={copyLink}
        aria-label="Copy link"
        title="Copy link"
        className="w-9 h-9 inline-flex items-center justify-center rounded-full border border-[#e0e0e0] text-[#666] hover:border-[#4A7C2F] hover:text-[#4A7C2F] hover:bg-[#4A7C2F]/5 transition-colors"
      >
        {copied ? <Check className="w-[18px] h-[18px]" /> : <Link2 className="w-[18px] h-[18px]" />}
      </button>
    </div>
  );
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    // UUID pattern — some posts may not have a slug yet, fall back to id lookup
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);

    const query = isUuid
      ? supabase.from("blog_posts").select("*").eq("id", slug).eq("published", true).single()
      : supabase.from("blog_posts").select("*").eq("slug", slug).eq("published", true).single();

    query.then(({ data, error }) => {
      if (error || !data) {
        setLoading(false);
        return;
      }
      setPost(data as Post);
      setLoading(false);
    });
  }, [slug]);

  // Update document title and meta for SEO
  useEffect(() => {
    if (!post) return;
    document.title = `${post.title} | RFC Food Safety`;
    let desc = document.querySelector('meta[name="description"]');
    if (!desc) {
      desc = document.createElement("meta");
      desc.setAttribute("name", "description");
      document.head.appendChild(desc);
    }
    desc.setAttribute("content", post.excerpt ?? "");

    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement("meta");
      ogTitle.setAttribute("property", "og:title");
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute("content", post.title);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement("meta");
      ogDesc.setAttribute("property", "og:description");
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute("content", post.excerpt ?? "");

    if (post.cover_image) {
      let ogImg = document.querySelector('meta[property="og:image"]');
      if (!ogImg) {
        ogImg = document.createElement("meta");
        ogImg.setAttribute("property", "og:image");
        document.head.appendChild(ogImg);
      }
      ogImg.setAttribute("content", post.cover_image);
    }

    return () => {
      document.title = "RFC Food Safety";
    };
  }, [post]);

  if (loading) {
    return (
      <div className="pt-24 min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#4A7C2F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pt-24 min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <p className="text-[#999] text-lg">Article not found.</p>
        <Link to="/blog" className="inline-flex items-center gap-2 text-[#4A7C2F] text-sm font-semibold hover:underline">
          <span className="material-icon text-[16px]">arrow_back</span> Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <article className="pt-24 bg-white min-h-screen" itemScope itemType="https://schema.org/BlogPosting">
      {/* Hero / header */}
      <header className="bg-[#0a0a0c] py-12 lg:py-20 relative overflow-hidden">
        {post.cover_image && (
          <div className="absolute inset-0">
            <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/70 to-[#0a0a0c]/40" />
          </div>
        )}
        <div className="max-w-3xl mx-auto px-6 lg:px-8 relative z-10">
          <nav className="mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm" itemScope itemType="https://schema.org/BreadcrumbList">
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <Link to="/" className="text-white/40 hover:text-white transition-colors" itemProp="item">
                  <span itemProp="name">Home</span>
                </Link>
                <meta itemProp="position" content="1" />
              </li>
              <span className="text-white/20">/</span>
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <Link to="/blog" className="text-white/40 hover:text-white transition-colors" itemProp="item">
                  <span itemProp="name">Blog</span>
                </Link>
                <meta itemProp="position" content="2" />
              </li>
              <span className="text-white/20">/</span>
              <li className="text-white/60 truncate max-w-xs" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <span itemProp="name">{post.title}</span>
                <meta itemProp="position" content="3" />
              </li>
            </ol>
          </nav>

          {post.category && (
            <span className="inline-block text-[13px] font-medium text-[#4A7C2F] uppercase tracking-wider mb-4">
              {post.category}
            </span>
          )}
          <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-6" itemProp="headline">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-lg text-white/70 leading-relaxed mb-8" itemProp="description">
              {post.excerpt}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-4 text-sm text-white/50">
            {post.author && (
              <span itemProp="author" itemScope itemType="https://schema.org/Person">
                <span className="material-icon text-[15px] align-middle mr-1">person</span>
                <span itemProp="name">{post.author}</span>
              </span>
            )}
            {post.published_at && (
              <time dateTime={post.published_at} itemProp="datePublished">
                <span className="material-icon text-[15px] align-middle mr-1">calendar_today</span>
                {formatDate(post.published_at)}
              </time>
            )}
            {post.read_time && (
              <span>
                <span className="material-icon text-[15px] align-middle mr-1">schedule</span>
                {post.read_time}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-16">
        <div
          className="prose prose-lg max-w-none prose-headings:text-[#1a1a1e] prose-headings:font-bold prose-p:text-[#4a4a4e] prose-p:leading-relaxed prose-a:text-[#4A7C2F] prose-a:no-underline hover:prose-a:underline prose-strong:text-[#1a1a1e] prose-li:text-[#4a4a4e] prose-blockquote:border-l-[#4A7C2F] prose-blockquote:text-[#4a4a4e]"
          itemProp="articleBody"
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>

        {/* Share */}
        <div className="mt-12 pt-8 border-t border-[#e0e0e0]">
          <ShareBar title={post.title} />
        </div>

        {/* Footer / back */}
        <div className="mt-8 pt-8 border-t border-[#e0e0e0] flex items-center justify-between">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-[#4A7C2F] text-sm font-semibold hover:underline"
          >
            <span className="material-icon text-[16px]">arrow_back</span>
            Back to Blog
          </Link>
          {post.pillar && (
            <span className="text-[13px] text-[#999] font-medium">{post.pillar}</span>
          )}
        </div>
      </div>
    </article>
  );
}
