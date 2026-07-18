import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import type { RoleConfig } from "@/lib/roles";

export type HeroSlide = {
  eyebrow: string;
  title: string;
  sub: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  gradient: string;
  accent: string;
};

import { BookOpen, TrendingUp, Award, Users } from "lucide-react";

const AUTHOR_SLIDES: HeroSlide[] = [
  {
    eyebrow: "Author Studio",
    title: "Publish your next bestseller",
    sub: "Ship products, chapters and updates from one focused writing workspace.",
    icon: BookOpen,
    gradient: "linear-gradient(120deg, oklch(0.24 0.08 275), oklch(0.32 0.16 265), oklch(0.42 0.20 255))",
    accent: "oklch(0.78 0.18 285)",
  },
  {
    eyebrow: "Reader Growth",
    title: "Turn followers into loyal readers",
    sub: "Track engagement, followers and reviews across every launch in real time.",
    icon: Users,
    gradient: "linear-gradient(120deg, oklch(0.22 0.10 300), oklch(0.32 0.18 290), oklch(0.44 0.22 320))",
    accent: "oklch(0.80 0.18 320)",
  },
  {
    eyebrow: "Revenue Insights",
    title: "Grow royalties every month",
    sub: "Sales, refunds and payouts unified — know exactly what to write next.",
    icon: TrendingUp,
    gradient: "linear-gradient(120deg, oklch(0.24 0.10 200), oklch(0.32 0.16 210), oklch(0.44 0.22 230))",
    accent: "oklch(0.80 0.18 210)",
  },
  {
    eyebrow: "Achievements",
    title: "Level up your author journey",
    sub: "Unlock trophies, badges and certificates as your catalogue grows.",
    icon: Award,
    gradient: "linear-gradient(120deg, oklch(0.26 0.08 55), oklch(0.34 0.16 45), oklch(0.46 0.20 30))",
    accent: "oklch(0.82 0.18 60)",
  },
];

export function AuthorHero({ role, onCta }: { role: RoleConfig; onCta?: () => void }) {
  return <SlidingHero role={role} onCta={onCta} slides={AUTHOR_SLIDES} />;
}

export function SlidingHero({
  role,
  onCta,
  slides,
}: {
  role: RoleConfig;
  onCta?: () => void;
  slides: HeroSlide[];
}) {
  const SLIDES = slides;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((v) => (v + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, [paused]);

  const s = SLIDES[i];
  const Icon = s.icon;

  return (
    <section
      className="relative overflow-hidden rounded-3xl border border-border shadow-card"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative min-h-[340px] md:min-h-[380px]" style={{ background: s.gradient, transition: "background 700ms ease" }}>
        <div
          className="absolute inset-0 opacity-60 pointer-events-none"
          style={{
            background:
              `radial-gradient(700px 240px at 85% 15%, color-mix(in oklab, ${s.accent} 45%, transparent), transparent),` +
              ` radial-gradient(500px 240px at 5% 100%, oklch(1 0 0 / 0.08), transparent)`,
            transition: "background 700ms ease",
          }}
        />
        <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.9' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

        <div key={i} className="relative h-full p-6 md:p-10 flex flex-col justify-center text-white animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] w-fit">
            <Sparkles className="h-3 w-3" style={{ color: s.accent }} />
            {s.eyebrow}
          </div>
          <div className="mt-3 flex items-start gap-4 max-w-3xl">
            <div className="hidden md:grid h-12 w-12 place-items-center rounded-2xl bg-white/10 border border-white/15 shrink-0">
              <Icon className="h-6 w-6" style={{ color: s.accent }} />
            </div>
            <div className="min-w-0">
              <h2 className="text-2xl md:text-4xl font-black tracking-tight leading-[1.1]">{s.title}</h2>
              <p className="mt-2 text-sm md:text-base text-white/75 max-w-xl">{s.sub}</p>
            </div>
          </div>
          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={onCta}
              className="inline-flex items-center gap-2 rounded-xl bg-white text-black px-4 py-2 text-sm font-semibold shadow-glow hover:opacity-95 transition"
            >
              {role.banner.cta}
            </button>
            <span className="text-[11px] text-white/60 uppercase tracking-wider">
              {i + 1} / {SLIDES.length}
            </span>
          </div>
        </div>

        {/* Controls */}
        <button
          aria-label="Previous slide"
          onClick={() => setI((v) => (v - 1 + SLIDES.length) % SLIDES.length)}
          className="absolute left-3 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-black/40 hover:bg-black/60 border border-white/20 text-white backdrop-blur transition"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          aria-label="Next slide"
          onClick={() => setI((v) => (v + 1) % SLIDES.length)}
          className="absolute right-3 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-black/40 hover:bg-black/60 border border-white/20 text-white backdrop-blur transition"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => setI(idx)}
              className={
                "h-1.5 rounded-full transition-all " +
                (idx === i ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70")
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}