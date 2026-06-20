import { Link } from "react-router-dom";

const posts = [
  { title: "Understanding R638: A Complete Guide to SA Food Safety Regulations", cat: "Regulations", date: "Jan 2025" },
  { title: "HACCP vs FSSC 22000: Which Certification Does Your Business Need?", cat: "Certifications", date: "Feb 2025" },
  { title: "The Real Cost of Non-Compliance: What a Failed Audit Means", cat: "Risk Management", date: "Mar 2025" },
];

export default function BlogPreviewSection() {
  return (
    <section className="py-16 md:py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10 md:mb-12 reveal">
          <div>
            <p className="label mb-4">Latest Insights</p>
            <h2 className="heading-lg">Food Safety Knowledge Hub</h2>
          </div>
          <Link to="/blog" className="hidden sm:inline-flex items-center gap-2 text-[#4A7C2F] text-sm font-semibold hover:underline">
            View All <span className="material-icon text-[14px]">arrow_forward</span>
          </Link>
        </div>
        <div className="border-t border-[#e0e0e0]">
          {posts.map((p, i) => (
            <Link key={p.title} to="/blog" className={`group flex flex-col lg:flex-row lg:items-center gap-1.5 md:gap-2 lg:gap-8 py-5 md:py-7 border-b border-[#eee] reveal reveal-delay-${i + 1}`}>
              <span className="text-[13px] text-[#999] font-medium uppercase tracking-wider w-28 shrink-0">{p.cat}</span>
              <h3 className="flex-1 text-[15px] md:text-base font-medium text-[#1a1a1e] group-hover:text-[#4A7C2F] transition-colors">{p.title}</h3>
              <span className="text-[13px] text-[#999] shrink-0 w-16 lg:text-right">{p.date}</span>
            </Link>
          ))}
        </div>
        <div className="mt-6 sm:hidden">
          <Link to="/blog" className="inline-flex items-center gap-2 text-[#4A7C2F] text-sm font-semibold hover:underline">
            View All <span className="material-icon text-[14px]">arrow_forward</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
