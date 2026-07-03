import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Zap, Code, Megaphone, Search, Share2, ShoppingCart, Rocket,
  CheckCircle2, Star, Phone, Mail, MapPin, MessageCircle,
  Facebook, Linkedin, Instagram, Github, ArrowRight, ArrowUpRight, Sparkles, Users, Calendar, Shield, Menu, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { submitLead, getPublicAgencyInfo } from "@/lib/api.functions";
import { useQuery } from "@tanstack/react-query";
import { useTrackContactClick } from "@/components/TrackingScripts";
import portfolioEcommerce from "@/assets/portfolio-ecommerce.jpg";
import portfolioRestaurant from "@/assets/portfolio-restaurant.jpg";
import portfolioAds from "@/assets/portfolio-ads.jpg";
import portfolioSeo from "@/assets/portfolio-seo.jpg";
import portfolioBaustTeaBar from "@/assets/portfolio-baust-tea-bar.png";
import portfolioAlRahbar from "@/assets/portfolio-al-rahbar.png";
import portfolioFishEco from "@/assets/portfolio-fish-ecophysiology.png";

const ICONS: Record<string, any> = { Code, Megaphone, Search, Share2, ShoppingCart, Rocket };

type ContentMap = Record<string, Record<string, any>>;
type TeamMember = { id: string; name: string; role: string; bio: string | null; photo_url: string | null; facebook_url: string | null; linkedin_url: string | null; twitter_url: string | null; instagram_url: string | null; github_url: string | null };
type PricingPkg = { id: string; name: string; price: string; features: string[]; is_popular: boolean; cta_label: string | null; sort_order: number };
const SiteCtx = createContext<{ content: ContentMap; team: TeamMember[]; packages: PricingPkg[] }>({ content: {}, team: [], packages: [] });
const useC = () => {
  const { content } = useContext(SiteCtx);
  return (section: string, key: string, fallback = "") => content?.[section]?.[key] ?? fallback;
};
const useTeam = () => useContext(SiteCtx).team;
const usePackages = () => useContext(SiteCtx).packages;

function useCountUp(end: number, duration = 1500) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const hasRun = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !hasRun.current) {
          hasRun.current = true;
          const start = performance.now();
          const step = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setCount(Math.round(eased * end));
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      });
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [end, duration]);
  return { count, ref };
}

const SERVICES = [
  { name: "Website Development", description: "Custom, fast, conversion-focused websites", icon: "Code" },
  { name: "Facebook Ads Management", description: "ROI-driven campaigns that actually convert", icon: "Megaphone" },
  { name: "SEO Service", description: "Rank higher, get found, grow organically", icon: "Search" },
  { name: "Social Media Management", description: "Consistent content that builds your brand", icon: "Share2" },
  { name: "E-commerce Solutions", description: "Online stores built to sell 24/7", icon: "ShoppingCart" },
  { name: "Business Digitalization", description: "Take your offline business fully online", icon: "Rocket" },
];

const PORTFOLIO = [
  { img: portfolioBaustTeaBar, title: "BAUST Tea Bar", category: "Website", result: "Live Restaurant Ordering", url: "https://baust-tea-bar-2-g7xe.vercel.app/" },
  { img: portfolioAlRahbar, title: "Al Rahbar — White Rose Umrah & Hajj", category: "Website", result: "Hajj & Umrah Booking Platform", url: "https://www.al-rahbar.com/" },
  { img: portfolioFishEco, title: "Laboratory of Fish Ecophysiology", category: "Website", result: "Academic Research Lab Site", url: "https://ecofishhub.vercel.app/" },
  { img: portfolioEcommerce, title: "Fashion E-commerce Store", category: "Website", result: "3x Sales in 60 Days" },
  { img: portfolioRestaurant, title: "Restaurant Brand Site", category: "Website", result: "+250% Online Orders" },
  { img: portfolioAds, title: "Facebook Ads Campaign", category: "Ads", result: "4.8x ROAS Achieved" },
  { img: portfolioSeo, title: "SaaS SEO Growth", category: "SEO", result: "Top 3 Google Rankings" },
];

const PRICING = [
  { name: "Starter", price: "৳46,000", popular: false, features: ["5-page custom website", "Mobile responsive", "Basic SEO setup", "1 month support", "Contact form"] },
  { name: "Growth", price: "৳80,000", popular: true, features: ["10-page website", "Advanced SEO", "Facebook Ads setup", "Content calendar", "3 months support", "Analytics dashboard"] },
  { name: "Dominator", price: "৳1,90,000", popular: false, features: ["Full e-commerce site", "SEO + Ads + Social", "Custom branding", "6 months management", "Priority support", "Conversion optimization"] },
];

const TESTIMONIALS = [
  { name: "Rashed Khan", business: "Owner, Khan Apparels", quote: "Truvion Tech transformed our online presence. Sales tripled within 2 months!" },
  { name: "Sumaiya Akter", business: "Founder, Bloom Café", quote: "Their ads team is phenomenal. Best ROI we've ever seen from any agency." },
  { name: "Imran Hossain", business: "CEO, TechMart BD", quote: "Professional, fast, and they actually deliver results. Highly recommended." },
];

const WHY_US = [
  { icon: Calendar, title: "30-Day Launch Guarantee", text: "From kickoff to live in 30 days. We respect deadlines." },
  { icon: Users, title: "5-Member Expert Team", text: "Designers, developers, marketers — all in-house." },
  { icon: MapPin, title: "Bangladesh Market Specialists", text: "We know the local audience and what converts here." },
  { icon: Shield, title: "50% Advance, Zero Risk", text: "Pay half upfront, the rest when you're satisfied." },
];

export default function LandingPage() {
  const { data } = useQuery({
    queryKey: ["public-agency-info"],
    queryFn: () => getPublicAgencyInfo(),
  });
  const content = (data?.content ?? {}) as ContentMap;
  const team = (data?.team ?? []) as TeamMember[];
  const packages = (data?.packages ?? []) as PricingPkg[];
  return (
    <SiteCtx.Provider value={{ content, team, packages }}>
    <div className="min-h-screen bg-background text-foreground">
      <IntroLoader />
      <Navbar />
      <Hero />
      <Services />
      <WhyChooseUs />
      <Portfolio />
      <Team />
      <Pricing />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
    </SiteCtx.Provider>
  );
}

function Reveal({ children, className = "", stagger = false, as: As = "div" }: { children: React.ReactNode; className?: string; stagger?: boolean; as?: any }) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add("in-view");
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <As ref={ref} className={`${stagger ? "reveal-stagger" : "reveal"} ${className}`}>
      {children}
    </As>
  );
}

function IntroLoader() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDone(true), 2200);
    document.body.style.overflow = "hidden";
    const r = setTimeout(() => { document.body.style.overflow = ""; }, 2700);
    return () => { clearTimeout(t); clearTimeout(r); document.body.style.overflow = ""; };
  }, []);
  if (done) return null;
  const letters = "TRUVION".split("");
  return (
    <div
      className="fixed inset-0 z-[999] grid place-items-center bg-background"
      style={{ animation: "intro-out 0.6s ease-in-out 2.1s forwards" }}
    >
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-primary to-transparent origin-left"
           style={{ animation: "intro-bar 1.6s cubic-bezier(0.77,0,0.18,1) both" }} />
      <div className="relative flex flex-col items-center gap-4">
        <div className="flex items-center gap-1 md:gap-2" style={{ perspective: "1000px" }}>
          {letters.map((l, i) => (
            <span
              key={i}
              className="font-display text-5xl md:text-7xl font-bold text-gradient-gold inline-block"
              style={{
                animation: `intro-letter 0.9s cubic-bezier(0.22,1,0.36,1) ${i * 0.08}s both`,
                transformOrigin: "bottom center",
              }}
            >
              {l}
            </span>
          ))}
          <span
            className="font-display text-5xl md:text-7xl font-bold text-foreground inline-block ml-2"
            style={{ animation: `intro-letter 0.9s cubic-bezier(0.22,1,0.36,1) ${letters.length * 0.08}s both` }}
          >
            .
          </span>
        </div>
        <div
          className="text-xs md:text-sm tracking-[0.4em] uppercase text-muted-foreground"
          style={{ animation: "fade-up 0.6s ease-out 0.9s both" }}
        >
          Bangladesh's #1 Digital Agency
        </div>
      </div>
    </div>
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const left = [
    { label: "Home", href: "#home" },
    { label: "Services", href: "#services" },
    { label: "About", href: "#why" },
    { label: "Team", href: "#team" },
  ];
  const right = [
    { label: "Portfolio", href: "#portfolio" },
    { label: "Pricing", href: "#pricing" },
    { label: "Contact", href: "#contact" },
  ];
  const c = useC();
  const logoUrl = c("branding", "logo_url", "");
  const logoText = c("branding", "logo_text", "Truvion");
  const logoAccent = c("branding", "logo_accent", "Tech");
  const allLinks = [...left, ...right];
  return (
    <header className={`fixed top-0 inset-x-0 z-50 flex justify-center px-3 transition-all ${scrolled ? "pt-3" : "pt-5"}`}>
      <div className="relative flex w-full max-w-5xl items-center justify-between rounded-full bg-white text-zinc-900 border border-zinc-200 shadow-2xl pl-2 pr-2 md:pl-4 md:pr-4 py-2 md:py-2.5">
        {/* Left links */}
        <div className="hidden md:flex items-center gap-6 px-4">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--color-primary)]" />
            <a href="#home" className="text-xs font-medium text-zinc-900 hover:text-primary transition-colors">Home</a>
          </div>
          {left.slice(1).map(l => (
            <a key={l.href} href={l.href} className="text-xs font-medium text-zinc-600 hover:text-zinc-900 transition-colors">{l.label}</a>
          ))}
        </div>

        {/* Center logo bubble */}
        <a href="#home" className="mx-1 md:mx-2 flex min-w-0 shrink-0 items-center gap-2 md:gap-3 bg-white text-zinc-900 border border-zinc-200 rounded-full px-3 md:px-5 py-1.5 md:py-2">
          {logoUrl ? (
            <img src={logoUrl} alt={`${logoText} logo`} className="h-6 md:h-7 max-w-[110px] md:max-w-[160px] object-contain" />
          ) : (
            <>
              <span className="grid place-items-center h-6 w-6 rounded-lg bg-primary text-primary-foreground">
                <Zap className="h-4 w-4" />
              </span>
              <span className="text-[12px] md:text-[13px] font-semibold tracking-tight text-zinc-900 truncate">{logoText}</span>
              {logoAccent && <span className="text-zinc-400 font-light">/</span>}
              {logoAccent && <span className="hidden sm:inline text-[13px] font-semibold text-zinc-500 tracking-tight">{logoAccent}</span>}
            </>
          )}
        </a>

        {/* Right links */}
        <div className="hidden md:flex items-center gap-6 px-4">
          {right.map(l => (
            <a key={l.href} href={l.href} className="text-xs font-medium text-zinc-600 hover:text-zinc-900 transition-colors">{l.label}</a>
          ))}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(v => !v)}
          className="md:hidden grid place-items-center h-9 w-9 shrink-0 rounded-full bg-zinc-900 text-white ml-1"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden absolute top-full mt-2 left-3 right-3 rounded-2xl bg-white text-zinc-900 border border-zinc-200 shadow-2xl p-3 flex flex-col">
          {allLinks.map(l => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="px-3 py-2.5 text-sm font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}

function Hero() {
  const c = useC();
  return (
    <section id="home" className="relative pt-32 pb-24 overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      {/* animated gradient orbs */}
      <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-primary/20 blur-[100px] animate-blob" />
      <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-primary/15 blur-[80px] animate-blob [animation-delay:-2s]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-primary/10 blur-[60px] animate-blob [animation-delay:-4s]" />
      <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        <div className="animate-fade-up">
          <Badge className="bg-primary/10 text-primary border-primary/30 mb-6">
            <Sparkles className="h-3 w-3 mr-1" /> {c("hero", "eyebrow", "Bangladesh's #1 Digital Agency")}
          </Badge>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05]">
            {c("hero", "headline", "We Build Brands That Dominate Digitally")}
          </h1>
          <p className="mt-3 text-sm font-medium text-zinc-400 tracking-wide">
            {c("hero", "tagline", "Top Creative Agency in Bangladesh for Branding & UI/UX Design")}
          </p>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl">
            {c("hero", "subheadline", "Bangladesh's fastest-growing digital agency — websites, ads, SEO & more, built to convert from day one.")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#portfolio"><Button size="lg" variant="outline" className="border-primary/40 hover:border-primary">{c("hero", "cta_secondary", "View Our Work")}</Button></a>
            <a href="#contact"><Button size="lg" className="font-semibold">{c("hero", "cta_primary", "Get Free Consultation")} <ArrowRight className="ml-2 h-4 w-4" /></Button></a>
          </div>
          <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-md pl-2 pr-5 py-2">
            <div className="flex -space-x-2">
              {["#f59e0b", "#ef4444", "#10b981", "#3b82f6"].map((c) => (
                <div key={c} className="h-8 w-8 rounded-full border-2 border-background" style={{ background: c }} />
              ))}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-xs font-semibold">{c("hero", "social_proof", "10+ Happy Clients")}</span>
            </div>
          </div>
        </div>
        <div className="relative h-[440px] hidden lg:block">
          <StatCard className="top-4 left-0 animate-float" label="Happy Clients" value="10+" />
          <StatCard className="top-32 right-4 [animation-delay:0.8s] animate-float" label="ROI Average" value="3x" />
          <StatCard className="bottom-4 left-20 [animation-delay:1.6s] animate-float" label="Launch Time" value="30 Days" />
          <div className="absolute inset-0 m-auto h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        </div>
      </div>
    </section>
  );
}

function AnimatedNumber({ value, suffix = "" }: { value: string; suffix?: string }) {
  const numeric = parseInt(value.replace(/\D/g, ""), 10);
  const isNumeric = !isNaN(numeric) && numeric > 0;
  const { count, ref } = useCountUp(isNumeric ? numeric : 0, 1800);
  if (!isNumeric) return <span ref={ref}>{value}</span>;
  return (
    <span ref={ref}>
      {count}{suffix}
      {value.replace(/[\d\s]/g, "")}
    </span>
  );
}

function StatCard({ label, value, className = "" }: { label: string; value: string; className?: string }) {
  return (
    <Card className={`absolute p-5 bg-card/80 backdrop-blur-md border-border w-48 ${className}`} style={{ boxShadow: "var(--shadow-card)" }}>
      <div className="text-3xl font-bold text-gradient-gold font-display"><AnimatedNumber value={value} suffix="+" /></div>
      <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{label}</div>
    </Card>
  );
}

function Section({ id, eyebrow, title, subtitle, children }: any) {
  return (
    <section id={id} className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <Reveal className="text-center max-w-2xl mx-auto mb-14">
          {eyebrow && <Badge variant="outline" className="border-primary/40 text-primary mb-3">{eyebrow}</Badge>}
          <h2 className="text-4xl md:text-5xl font-bold">{title}</h2>
          {subtitle && <p className="mt-4 text-muted-foreground">{subtitle}</p>}
        </Reveal>
        {children}
      </div>
    </section>
  );
}

function Services() {
  return (
    <Section id="services" eyebrow="What We Do" title="Services Built to Convert" subtitle="Everything you need to win online — under one roof.">
      <Reveal stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {SERVICES.map((s, idx) => {
          const Icon = ICONS[s.icon] ?? Sparkles;
          return (
            <a key={s.name} href="#contact" className="group relative block">
              {/* gradient glow border */}
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-primary/40 via-primary/0 to-primary/30 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500" />
              <Card className="relative h-full p-7 bg-card border-border rounded-2xl overflow-hidden transition-all duration-500 group-hover:-translate-y-1 group-hover:border-primary/50 group-hover:shadow-[0_20px_60px_-20px_var(--color-primary)]">
                {/* shine sweep */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
                  <div className="absolute top-0 -left-1/2 h-full w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 opacity-0 group-hover:opacity-100"
                       style={{ animation: "shine 1.2s ease-in-out" }} />
                </div>
                {/* big translucent number */}
                <div className="absolute right-5 bottom-2 text-7xl font-display font-bold text-primary/5 group-hover:text-primary/10 transition-colors select-none">
                  {String(idx + 1).padStart(2, "0")}
                </div>

                <div className="relative flex items-start justify-between mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-2xl bg-primary/30 blur-xl opacity-0 group-hover:opacity-70 transition-opacity" />
                    <div className="relative grid place-items-center h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 text-primary transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                      <Icon className="h-7 w-7" />
                    </div>
                  </div>
                  <div className="h-10 w-10 rounded-full border border-border grid place-items-center transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary group-hover:-rotate-45">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>
                <h3 className="relative text-xl font-semibold mb-2 transition-colors group-hover:text-primary">{s.name}</h3>
                <p className="relative text-sm text-muted-foreground">{s.description}</p>
                <div className="relative mt-5 h-px bg-gradient-to-r from-primary/40 via-primary/10 to-transparent scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
              </Card>
            </a>
          );
        })}
      </Reveal>
    </Section>
  );
}

function WhyChooseUs() {
  return (
    <Section id="why" eyebrow="Why Truvion" title="Built Different. On Purpose.">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <Reveal stagger className="grid sm:grid-cols-2 gap-5">
          {WHY_US.map(w => (
            <Card key={w.title} className="p-6 bg-card border-border tilt-card">
              <w.icon className="h-7 w-7 text-primary mb-3" />
              <h3 className="font-semibold mb-1">{w.title}</h3>
              <p className="text-sm text-muted-foreground">{w.text}</p>
            </Card>
          ))}
        </Reveal>
        <Reveal className="relative h-80">
          <div className="absolute inset-0 rounded-3xl bg-grid opacity-60" />
          <div className="absolute inset-8 rounded-2xl border border-primary/30 grid place-items-center" style={{ background: "var(--gradient-hero)" }}>
            <div className="text-center">
              <div className="text-6xl font-bold text-gradient-gold font-display"><AnimatedNumber value="100" suffix="%" /></div>
              <div className="mt-2 text-muted-foreground">Results-Focused</div>
            </div>
          </div>
          <div className="absolute -bottom-4 -right-4 h-32 w-32 rounded-full bg-primary/30 blur-2xl" />
        </Reveal>
      </div>
    </Section>
  );
}

function Portfolio() {
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Website", "Ads", "SEO"];
  const items = PORTFOLIO.filter(p => filter === "All" || p.category === filter);
  return (
    <Section id="portfolio" eyebrow="Case Studies" title="Real Brands. Real Results.">
      <div className="flex justify-center gap-2 mb-10 flex-wrap">
        {filters.map(f => (
          <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)} className={filter === f ? "" : "border-border transition-all duration-300 hover:scale-105"}>{f}</Button>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 gap-6">
        {items.map((p, i) => (
          <div key={p.title} className="animate-scale-in-up" style={{ animationDelay: `${i * 0.08}s` }}>
            <Card className="overflow-hidden hover-glow bg-card border-border group tilt-card">
              {(p as any).url ? (
                <a href={(p as any).url} target="_blank" rel="noopener noreferrer" className="block">
                  <div className="aspect-[16/10] overflow-hidden bg-muted">
                    <img src={p.img} alt={p.title} loading="lazy" width={1280} height={832} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider">{p.category} · Live Site ↗</div>
                      <h3 className="font-semibold mt-1">{p.title}</h3>
                    </div>
                    <Badge className="bg-primary/15 text-primary border-primary/30">{p.result}</Badge>
                  </div>
                </a>
              ) : (<>
              <div className="aspect-[16/10] overflow-hidden bg-muted">
                <img src={p.img} alt={p.title} loading="lazy" width={1280} height={832} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5 flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">{p.category}</div>
                  <h3 className="font-semibold mt-1">{p.title}</h3>
                </div>
                <Badge className="bg-primary/15 text-primary border-primary/30">{p.result}</Badge>
              </div>
              </>)}
            </Card>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Pricing() {
  const dbPkgs = usePackages();
  const items = dbPkgs.length > 0
    ? dbPkgs.map(p => ({ name: p.name, price: p.price, features: p.features ?? [], popular: p.is_popular, cta: p.cta_label }))
    : PRICING.map(p => ({ ...p, cta: null as string | null }));
  return (
    <Section id="pricing" eyebrow="Pricing" title="Simple, Honest Pricing" subtitle="No hidden fees. 50% advance, the rest on delivery.">
      <Reveal stagger className="grid md:grid-cols-3 gap-6">
        {items.map(p => (
          <Card key={p.name} className={`p-8 border bg-card relative tilt-card transition-transform duration-500 hover:-translate-y-2 ${p.popular ? "border-primary shadow-[0_0_40px_-10px_var(--color-primary)] md:-translate-y-3" : "border-border"}`}>
            {p.popular && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">Most Popular</Badge>}
            <div className="text-sm text-muted-foreground uppercase tracking-wider">{p.name}</div>
            <div className="mt-3 text-4xl font-bold text-gradient-gold font-display">{p.price}</div>
            <ul className="mt-6 space-y-3">
              {p.features.map(f => (
                <li key={f} className="flex gap-2 text-sm"><CheckCircle2 className="h-5 w-5 text-primary shrink-0" /> <span>{f}</span></li>
              ))}
            </ul>
            <a href="#contact" className="block mt-8"><Button className="w-full font-semibold" variant={p.popular ? "default" : "outline"}>{p.cta || `Choose ${p.name}`}</Button></a>
          </Card>
        ))}
      </Reveal>
    </Section>
  );
}

function Testimonials() {
  return (
    <Section id="testimonials" eyebrow="Testimonials" title="What Clients Say">
      <Reveal stagger className="grid md:grid-cols-3 gap-6">
        {TESTIMONIALS.map(t => (
          <Card key={t.name} className="p-6 bg-card border-border tilt-card">
            <div className="flex gap-1 mb-3 text-primary">{[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}</div>
            <p className="text-sm leading-relaxed">"{t.quote}"</p>
            <div className="mt-5 pt-4 border-t border-border">
              <div className="font-semibold">{t.name}</div>
              <div className="text-xs text-muted-foreground">{t.business}</div>
            </div>
          </Card>
        ))}
      </Reveal>
    </Section>
  );
}

function Contact() {
  const submit = useServerFn(submitLead);
  const trackClick = useTrackContactClick();
  const [loading, setLoading] = useState(false);
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    try {
      await submit({ data: {
        name: String(fd.get("name") || ""),
        email: String(fd.get("email") || ""),
        phone: String(fd.get("phone") || ""),
        business_type: String(fd.get("business_type") || ""),
        message: String(fd.get("message") || ""),
        service_interested: String(fd.get("service_interested") || ""),
      } });
      toast.success("Thanks! We'll be in touch within 24 hours.");
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
    } finally { setLoading(false); }
  }
  return (
    <Section id="contact" eyebrow="Contact" title="Ready to Grow Your Business?" subtitle="Tell us about your project. We reply within one business day.">
      <div className="grid lg:grid-cols-2 gap-10">
        <Reveal as={Card} className="p-7 bg-card border-border">
          <form onSubmit={onSubmit} className="grid gap-4">
            <div className="grid sm:grid-cols-2 gap-4 animate-slide-up-fade">
              <Field name="name" label="Your Name" required />
              <Field name="email" label="Email" type="email" required />
            </div>
            <div className="grid sm:grid-cols-2 gap-4 animate-slide-up-fade [animation-delay:0.1s]">
              <Field name="phone" label="Phone / WhatsApp" required />
              <div>
                <Label className="mb-2 block">Business Type</Label>
                <Select name="business_type">
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {["E-commerce", "Restaurant", "Service Business", "SaaS / Tech", "Education", "Other"].map(x => <SelectItem key={x} value={x}>{x}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="animate-slide-up-fade [animation-delay:0.2s]">
              <Label className="mb-2 block">Service Interested</Label>
              <Select name="service_interested">
                <SelectTrigger><SelectValue placeholder="Select a service" /></SelectTrigger>
                <SelectContent>
                  {SERVICES.map(s => <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="animate-slide-up-fade [animation-delay:0.3s]">
              <Label className="mb-2 block">Message</Label>
              <Textarea name="message" rows={4} placeholder="Tell us about your project…" />
            </div>
            <Button type="submit" disabled={loading} size="lg" className="font-semibold animate-slide-up-fade [animation-delay:0.4s]">
              {loading ? "Sending…" : "Send Message"} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </Reveal>
        <Reveal stagger className="space-y-4">
          <a href="https://wa.me/8801797838961" target="_blank" rel="noreferrer" onClick={() => trackClick("whatsapp")}>
            <Card className="p-6 bg-card border-border hover-glow flex items-center gap-4">
              <div className="grid place-items-center h-12 w-12 rounded-xl bg-primary text-primary-foreground animate-pulse-ring"><MessageCircle className="h-6 w-6" /></div>
              <div>
                <div className="font-semibold">Chat on WhatsApp</div>
                <div className="text-sm text-muted-foreground">Fastest way to reach us</div>
              </div>
            </Card>
          </a>
          <a href="mailto:rayhan.kpkp@gmail.com" onClick={() => trackClick("email")}>
            <InfoLine icon={Mail} label="Email" value="rayhan.kpkp@gmail.com" />
          </a>
          <a href="tel:+8801797838961" onClick={() => trackClick("phone")}>
            <InfoLine icon={Phone} label="Phone" value="+880 1797 838961" />
          </a>
          <InfoLine icon={MapPin} label="Location" value="Dhaka, Bangladesh" />
        </Reveal>
      </div>
    </Section>
  );
}

function Field({ name, label, type = "text", required }: any) {
  return (
    <div>
      <Label htmlFor={name} className="mb-2 block">{label}</Label>
      <Input id={name} name={name} type={type} required={required} />
    </div>
  );
}

function InfoLine({ icon: Icon, label, value }: any) {
  return (
    <Card className="p-5 bg-card border-border flex items-center gap-4">
      <div className="grid place-items-center h-10 w-10 rounded-lg bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div>
      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="font-medium">{value}</div>
      </div>
    </Card>
  );
}

function Footer() {
  return <FooterCmp />;
}

function TeamSection() {
  const c = useC();
  const team = useTeam();
  if (!team || team.length === 0) return null;
  // Rank by role: CEO / Founder / Co-Founder / Chairman first
  const rank = (role: string = "") => {
    const r = role.toLowerCase();
    if (r.includes("ceo") || r.includes("chief executive")) return 0;
    if (r.includes("founder") && !r.includes("co")) return 1;
    if (r.includes("co-founder") || r.includes("cofounder")) return 2;
    if (r.includes("chairman") || r.includes("chair")) return 3;
    if (r.includes("cto") || r.includes("coo") || r.includes("cmo") || r.includes("cfo")) return 4;
    if (r.includes("director") || r.includes("head")) return 5;
    if (r.includes("manager") || r.includes("lead")) return 6;
    return 9;
  };
  const sorted = [...team].sort((a, b) => rank(a.role) - rank(b.role));
  const [leader, ...rest] = sorted;
  const renderSocials = (m: TeamMember, cls = "") => (
    <div className={`flex justify-center gap-2 ${cls}`}>
      {m.facebook_url && <a href={m.facebook_url} target="_blank" rel="noreferrer" aria-label={`${m.name} on Facebook`} className="h-8 w-8 grid place-items-center rounded-lg border border-border hover:border-primary hover:text-primary"><Facebook className="h-4 w-4" aria-hidden="true" /></a>}
      {m.linkedin_url && <a href={m.linkedin_url} target="_blank" rel="noreferrer" aria-label={`${m.name} on LinkedIn`} className="h-8 w-8 grid place-items-center rounded-lg border border-border hover:border-primary hover:text-primary"><Linkedin className="h-4 w-4" aria-hidden="true" /></a>}
      {m.instagram_url && <a href={m.instagram_url} target="_blank" rel="noreferrer" aria-label={`${m.name} on Instagram`} className="h-8 w-8 grid place-items-center rounded-lg border border-border hover:border-primary hover:text-primary"><Instagram className="h-4 w-4" aria-hidden="true" /></a>}
      {m.github_url && <a href={m.github_url} target="_blank" rel="noreferrer" aria-label={`${m.name} on GitHub`} className="h-8 w-8 grid place-items-center rounded-lg border border-border hover:border-primary hover:text-primary"><Github className="h-4 w-4" aria-hidden="true" /></a>}
    </div>
  );
  return (
    <Section id="team" eyebrow="Our People" title={c("team", "title", "Meet Our Team")} subtitle={c("team", "subtitle", "The people behind Truvion Tech.")}>
      {/* Featured leader (CEO / Founder) on top */}
      {leader && (
        <Reveal className="mb-10 flex justify-center">
          <Card className="relative w-full max-w-2xl p-8 bg-card border-2 border-primary/40 tilt-card text-center overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
            <div className="mx-auto h-32 w-32 rounded-full overflow-hidden bg-primary/10 border-4 border-primary/50 mb-5 shadow-lg">
              {leader.photo_url ? (
                <img src={leader.photo_url} alt={leader.name} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full grid place-items-center text-4xl font-bold text-primary">{leader.name?.[0] ?? "?"}</div>
              )}
            </div>
            <div className="text-2xl font-bold">{leader.name}</div>
            <div className="mt-2 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest shadow-md">
              <Sparkles className="h-3.5 w-3.5" /> {leader.role}
            </div>
            {leader.bio && <p className="text-sm text-muted-foreground mt-4 max-w-lg mx-auto">{leader.bio}</p>}
            {renderSocials(leader, "mt-5")}
          </Card>
        </Reveal>
      )}
      {rest.length > 0 && (
        <Reveal stagger className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {rest.map(m => (
            <Card key={m.id} className="p-6 bg-card border-border tilt-card text-center">
              <div className="mx-auto h-24 w-24 rounded-full overflow-hidden bg-primary/10 border-2 border-primary/30 mb-4">
                {m.photo_url ? (
                  <img src={m.photo_url} alt={m.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full grid place-items-center text-2xl font-bold text-primary">{m.name?.[0] ?? "?"}</div>
                )}
              </div>
              <div className="font-semibold">{m.name}</div>
              <div className="mt-2 inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-wider border border-primary/20">
                {m.role}
              </div>
              {m.bio && <p className="text-sm text-muted-foreground mt-3">{m.bio}</p>}
              {renderSocials(m, "mt-4")}
            </Card>
          ))}
        </Reveal>
      )}
    </Section>
  );
}

function Team() { return <TeamSection />; }

function FooterCmp() {
  const c = useC();
  const logoUrl = c("branding", "logo_url", "");
  const main = c("branding", "footer_brand_main", "Truvion");
  const accent = c("branding", "footer_brand_accent", "Tech");
  const email = c("footer", "contact_email", "hello@truviontech.com");
  const phone = c("footer", "contact_phone", "+880 1XXX XXXXXX");
  const address = c("footer", "contact_address", "Dhaka, Bangladesh");
  const contactTitle = c("footer", "contact_title", "Contact");
  const linksTitle = c("footer", "quick_links_title", "Quick Links");
  const links: [string, string][] = [1, 2, 3, 4]
    .map((i) => [c("footer", `link${i}_label`, ""), c("footer", `link${i}_href`, "")] as [string, string])
    .filter(([l, h]) => l && h);
  const socials: { Icon: any; label: string; href: string }[] = [
    { Icon: Facebook, label: "Facebook", href: c("footer", "facebook_url", "") },
    { Icon: Linkedin, label: "LinkedIn", href: c("footer", "linkedin_url", "") },
    { Icon: Instagram, label: "Instagram", href: c("footer", "instagram_url", "") },
  ].filter(s => s.href);
  const copyright = c("footer", "copyright", "© 2025 Truvion Tech. All Rights Reserved.");
  return (
    <footer className="border-t border-border mt-10">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          {logoUrl ? (
            <img src={logoUrl} alt={`${main} logo`} className="h-10 max-w-[200px] object-contain" />
          ) : (
            <div className="flex items-center gap-2 font-display font-bold text-lg">
              <span className="grid place-items-center h-9 w-9 rounded-lg bg-primary text-primary-foreground"><Zap className="h-5 w-5" /></span>
              {main} <span className="text-primary">{accent}</span>
            </div>
          )}
          <p className="mt-3 text-sm text-muted-foreground max-w-sm">{c("footer", "tagline", "Building Bangladesh's Digital Future — one brand at a time.")}</p>
          <div className="mt-5 flex gap-2">
            {socials.map(({ Icon, label, href }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer noopener" aria-label={`${main} ${accent} on ${label}`} className="grid place-items-center h-9 w-9 rounded-lg border border-border hover:border-primary hover:text-primary transition-colors"><Icon className="h-4 w-4" aria-hidden="true" /></a>
            ))}
          </div>
        </div>
        <FooterCol title={linksTitle} items={links} />
        <FooterCol title={contactTitle} items={[
          [email, `mailto:${email}`],
          [phone, `tel:${phone.replace(/\s+/g, "")}`],
          [address, "#"],
        ]} />
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        {copyright} · <Link to="/auth" className="hover:text-primary">Admin</Link>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: [string, string][] }) {
  return (
    <div>
      <div className="font-semibold mb-3">{title}</div>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {items.map(([label, href]) => <li key={label}><a href={href} className="hover:text-primary transition-colors">{label}</a></li>)}
      </ul>
    </div>
  );
}