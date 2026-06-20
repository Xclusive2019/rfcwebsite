import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { supabase, extractErrorMessage } from "../lib/supabase";

type Product = {
  code: string;
  name: string;
  pack: string;
  unit: string;
  qtyPerCarton: number;
  price: number; // price each, excl. VAT
  imageUrl: string | null;
  dataSheetUrl: string | null;
  dataSheetIsPdf: boolean;
};

interface ProductRow {
  code: string;
  name: string;
  pack: string;
  unit: string;
  qty_per_carton: number;
  price: number | string;
  image_url: string | null;
  data_sheet_url: string | null;
  data_sheet_is_pdf: boolean;
}

function mapRow(row: ProductRow): Product {
  return {
    code: row.code,
    name: row.name,
    pack: row.pack,
    unit: row.unit,
    qtyPerCarton: row.qty_per_carton,
    price: typeof row.price === "string" ? parseFloat(row.price) : row.price,
    imageUrl: row.image_url,
    dataSheetUrl: row.data_sheet_url,
    dataSheetIsPdf: row.data_sheet_is_pdf,
  };
}

const packIcons: Record<string, string> = {
  Aerosol: "sanitizer",
  Cartridge: "colorize",
  Tin: "inventory_2",
  Tube: "science",
  Bucket: "delete",
  Drum: "propane_tank",
};

const formatPrice = (value: number) =>
  "R" + value.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// `null` = a general/bulk enquiry (no specific product attached).
type QuoteTarget = Product | null;

function QuoteDialog({ product, onClose }: { product: QuoteTarget; onClose: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("submit-quote", {
        body: {
          name,
          email,
          phone,
          company,
          productCode: product?.code,
          productName: product?.name,
          productPack: product ? `${product.pack} (${product.unit})` : undefined,
          unitPrice: product?.price,
          quantity: quantity ? Number(quantity) : undefined,
          message,
        },
      });

      if (error) {
        throw new Error(await extractErrorMessage(error));
      }
      if (data && data.success === false) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      toast.success("Quote request sent — our team will be in touch shortly.");
      setSubmitted(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send quote request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 p-6 border-b border-[#e8e8e8]">
          <div>
            <p className="label mb-1">Request a Quote</p>
            <h2 className="text-lg font-semibold text-[#1a1a1e] leading-snug">
              {product ? product.name : "Bulk / Custom Enquiry"}
            </h2>
            {product && (
              <p className="text-[15px] text-[#999] mt-1">
                {product.code} · {product.pack} ({product.unit}) · {formatPrice(product.price)} ea. excl. VAT
              </p>
            )}
          </div>
          <button onClick={onClose} className="text-[#999] hover:text-[#1a1a1e] shrink-0" aria-label="Close">
            <span className="material-icon text-[22px]">close</span>
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center">
            <div className="w-14 h-14 bg-[#e8f5e9] flex items-center justify-center mx-auto mb-5">
              <span className="material-icon text-[26px] text-[#4A7C2F]">check_circle</span>
            </div>
            <h3 className="text-base font-semibold text-[#1a1a1e] mb-2">Quote request received</h3>
            <p className="text-[15px] text-[#4a4a4e] mb-6">
              Thanks {name.split(" ")[0]}. Our team will get back to you at <strong>{email}</strong> with pricing and availability.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-[#4A7C2F] text-white text-sm font-semibold hover:bg-[#3d6a27] transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[12px] font-medium text-[#999] uppercase tracking-wider mb-2">Full Name *</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 border border-[#e0e0e0] text-base focus:outline-none focus:border-[#4A7C2F] transition-colors" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-[#999] uppercase tracking-wider mb-2">Email *</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border border-[#e0e0e0] text-base focus:outline-none focus:border-[#4A7C2F] transition-colors" placeholder="you@company.com" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[12px] font-medium text-[#999] uppercase tracking-wider mb-2">Phone</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-3 border border-[#e0e0e0] text-base focus:outline-none focus:border-[#4A7C2F] transition-colors" placeholder="+27 XX XXX XXXX" />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-[#999] uppercase tracking-wider mb-2">Company</label>
                <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} className="w-full px-4 py-3 border border-[#e0e0e0] text-base focus:outline-none focus:border-[#4A7C2F] transition-colors" placeholder="Your company" />
              </div>
            </div>
            <div>
              <label className="block text-[12px] font-medium text-[#999] uppercase tracking-wider mb-2">
                Quantity {product ? "(units)" : "Required"}
              </label>
              <input type="number" min={1} value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-full px-4 py-3 border border-[#e0e0e0] text-base focus:outline-none focus:border-[#4A7C2F] transition-colors" placeholder="e.g. 12" />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-[#999] uppercase tracking-wider mb-2">
                {product ? "Notes (optional)" : "What do you need? *"}
              </label>
              <textarea rows={3} required={!product} value={message} onChange={(e) => setMessage(e.target.value)} className="w-full px-4 py-3 border border-[#e0e0e0] text-base focus:outline-none focus:border-[#4A7C2F] resize-none transition-colors" placeholder={product ? "Delivery address, timelines, anything else…" : "List the products and quantities you'd like a quote for…"} />
            </div>
            <button type="submit" disabled={submitting} className="w-full py-4 bg-[#4A7C2F] text-white text-sm font-semibold hover:bg-[#3d6a27] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              <span className="material-icon text-[16px]">request_quote</span>
              {submitting ? "Sending…" : "Send Quote Request"}
            </button>
            <p className="text-[12px] text-[#999] text-center">
              Prices exclude VAT and are subject to change. We'll confirm final pricing and availability.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ShopPage() {
  useScrollReveal();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [activePack, setActivePack] = useState("All");
  const [quoteFor, setQuoteFor] = useState<QuoteTarget>(null);
  const [quoteOpen, setQuoteOpen] = useState(false);

  useEffect(() => {
    supabase
      .from("products")
      .select("code, name, pack, unit, qty_per_carton, price, image_url, data_sheet_url, data_sheet_is_pdf")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        setProducts((data ?? []).map((r) => mapRow(r as ProductRow)));
        setLoading(false);
      });
  }, []);

  const openQuote = (product: QuoteTarget) => {
    setQuoteFor(product);
    setQuoteOpen(true);
  };

  const packs = useMemo(
    () => ["All", ...Array.from(new Set(products.map((p) => p.pack).filter(Boolean)))],
    [products]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const matchesPack = activePack === "All" || p.pack === activePack;
      const matchesQuery = !q || p.name.toLowerCase().includes(q) || p.code.includes(q);
      return matchesPack && matchesQuery;
    });
  }, [products, query, activePack]);

  return (
    <main className="pt-24 min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-[#1a1a1e] py-12 md:py-16 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(/spanjaard-food-grade-banner.jpg)" }}
        >
          <div className="absolute inset-0 bg-[#1a1a1e]/70" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1e]/85 via-[#1a1a1e]/50 to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <p className="label text-white/50 mb-4 reveal">Shop</p>
          <h1 className="heading-lg text-white max-w-2xl reveal">Food Grade Lubricants</h1>
          <p className="mt-3 inline-flex items-center gap-2 text-[#9bc472] text-sm font-semibold reveal">
            <span className="material-icon text-[16px]">verified</span>
            NSF Certified Range
          </p>
          <p className="mt-6 text-white/60 text-base max-w-xl leading-relaxed reveal">
            RFC supplies a complete range of NSF-certified, food-grade lubricants, greases and sprays for
            food and beverage production environments. Browse the range below and request a quote on any item.
          </p>
          <div className="mt-8 flex items-center gap-4 reveal">
            <span className="text-[12px] uppercase tracking-[0.15em] text-white/40">Distributor of</span>
            <a
              href="https://www.spanjaard.biz/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex bg-white px-4 py-2.5 hover:opacity-90 transition-opacity"
            >
              <img src="/spanjaard-logo.png" alt="Spanjaard" className="h-7 w-auto" />
            </a>
          </div>
        </div>
      </section>

      {/* Controls */}
      <section className="py-10 md:py-14 bg-[#f8f8f7] border-b border-[#e8e8e8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="relative w-full lg:max-w-sm">
              <span className="material-icon text-[18px] text-[#999] absolute left-3 top-1/2 -translate-y-1/2">search</span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or item code…"
                className="w-full pl-10 pr-4 py-3 text-base bg-white border border-[#e0e0e0] focus:border-[#4A7C2F] focus:outline-none transition-colors"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {packs.map((pack) => (
                <button
                  key={pack}
                  onClick={() => setActivePack(pack)}
                  className={`px-4 py-2 text-[13px] font-medium border transition-colors ${
                    activePack === pack
                      ? "bg-[#4A7C2F] text-white border-[#4A7C2F]"
                      : "bg-white text-[#4a4a4e] border-[#e0e0e0] hover:border-[#4A7C2F] hover:text-[#4A7C2F]"
                  }`}
                >
                  {pack}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Product grid */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="heading-md">The Range</h2>
            {!loading && (
              <span className="text-[15px] text-[#999]">{filtered.length} product{filtered.length !== 1 ? "s" : ""}</span>
            )}
          </div>

          {loading ? (
            <div className="py-20 flex justify-center">
              <div className="w-8 h-8 border-2 border-[#4A7C2F] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center text-[#999]">
              <span className="material-icon text-[40px] mb-3 block">search_off</span>
              No products match your search.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#e0e0e0] border border-[#e0e0e0]">
              {filtered.map((product) => (
                <div key={product.code} className="bg-white p-6 md:p-7 flex flex-col">
                  {/* Image */}
                  <div className="relative mb-5 bg-[#f8f8f7] h-44 flex items-center justify-center overflow-hidden">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-contain p-3"
                      />
                    ) : (
                      <span className="material-icon text-[#cfcfcf] text-[44px]">
                        {packIcons[product.pack] || "inventory_2"}
                      </span>
                    )}
                    <span className="absolute top-2 right-2 text-[12px] font-mono text-[#aaa] bg-white/80 px-1.5 py-0.5">
                      {product.code}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-[#1a1a1e] leading-snug mb-3">
                    {product.name}
                  </h3>

                  <div className="flex flex-wrap gap-1.5 mb-5">
                    <span className="px-2 py-0.5 text-[12px] font-medium bg-[#f0f4ec] text-[#4A7C2F]">{product.pack}</span>
                    <span className="px-2 py-0.5 text-[12px] font-medium bg-[#f8f8f7] text-[#666]">{product.unit}</span>
                    <span className="px-2 py-0.5 text-[12px] font-medium bg-[#f8f8f7] text-[#666]">{product.qtyPerCarton} / carton</span>
                  </div>

                  {product.dataSheetUrl && (
                    <a
                      href={product.dataSheetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mb-5 text-[12px] font-medium text-[#4A7C2F] hover:text-[#3d6a27] transition-colors"
                    >
                      <span className="material-icon text-[15px]">
                        {product.dataSheetIsPdf ? "description" : "open_in_new"}
                      </span>
                      {product.dataSheetIsPdf ? "Data Sheet (PDF)" : "Product Details"}
                    </a>
                  )}

                  <div className="mt-auto">
                    <div className="flex items-baseline gap-1.5 mb-4">
                      <span className="text-xl font-bold text-[#1a1a1e]">{formatPrice(product.price)}</span>
                      <span className="text-[12px] text-[#999]">ea. excl. VAT</span>
                    </div>
                    <button
                      onClick={() => openQuote(product)}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#4A7C2F] text-white text-[13px] font-semibold hover:bg-[#3d6a27] transition-colors"
                    >
                      <span className="material-icon text-[16px]">request_quote</span>
                      Get a Quote
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <p className="mt-8 text-[12px] text-[#999] leading-relaxed max-w-3xl">
            Products are supplied in conjunction with{" "}
            <a href="https://www.spanjaard.biz/" target="_blank" rel="noopener noreferrer" className="text-[#4A7C2F] hover:underline">Spanjaard</a>.
            Technical data sheets link to Spanjaard's published documentation. Prices exclude VAT and are subject to
            change without prior notice. All goods remain the property of RFC (Pty) Ltd until paid for in full.
            Payment terms as per agreement.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#4A7C2F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Need a bulk order or a custom quote?</h3>
            <p className="text-white/60 text-[15px]">Our team is ready to help with pricing, availability and delivery.</p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <button
              onClick={() => openQuote(null)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#1a1a1e] text-sm font-semibold hover:bg-[#f0f0f0] transition-colors"
            >
              <span className="material-icon text-[16px]">request_quote</span>
              Request a Quote
            </button>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 border border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {quoteOpen && <QuoteDialog product={quoteFor} onClose={() => setQuoteOpen(false)} />}
    </main>
  );
}
