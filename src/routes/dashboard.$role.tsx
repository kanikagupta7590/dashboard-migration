import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { Hero } from "@/components/dashboard/Hero";
import { VendorSliderHero } from "@/components/dashboard/VendorSliderHero";
import { ResellerHero } from "@/components/dashboard/ResellerHero";
import { AuthorHero } from "@/components/dashboard/AuthorHero";
import { ResellerProfileHero } from "@/components/dashboard/ResellerProfileHero";
import { KpiGrid } from "@/components/dashboard/KpiGrid";
import { ContentRows } from "@/components/dashboard/ContentRows";
import { ModulePage } from "@/components/dashboard/ModulePage";
import { ResellerModulePage } from "@/components/dashboard/ResellerModulePage";
import { ResellerCenterPage } from "@/components/dashboard/ResellerCenterPage";
import { AIChatWorkspace } from "@/components/dashboard/AIChatWorkspace";
import { AISuitePage } from "@/components/dashboard/AISuitePage";
import { ResellerAISuitePage } from "@/components/dashboard/ResellerAISuitePage";
import { ResellerPricingWorkspace } from "@/components/dashboard/ResellerPricingWorkspace";
import { Breadcrumbs } from "@/components/dashboard/Breadcrumbs";
import { KpiToolbar, type KpiSort, type KpiTone } from "@/components/dashboard/KpiToolbar";
import { ModuleBoundary } from "@/components/dashboard/ModuleBoundary";
import { ROLES, isRoleKey, type RoleKey } from "@/lib/roles";

const ROLE_BANNER_GRADIENTS: Record<RoleKey, string> = {
  reseller:   "linear-gradient(120deg, oklch(0.26 0.06 175), oklch(0.32 0.16 160), oklch(0.42 0.22 150))",
  author:     "linear-gradient(120deg, oklch(0.24 0.08 275), oklch(0.32 0.16 265), oklch(0.42 0.20 255))",
  vendor:     "linear-gradient(120deg, oklch(0.24 0.06 210), oklch(0.32 0.14 200), oklch(0.42 0.18 195))",
  affiliate:  "linear-gradient(120deg, oklch(0.24 0.08 310), oklch(0.32 0.16 300), oklch(0.42 0.20 295))",
  influencer: "linear-gradient(120deg, oklch(0.26 0.08 350), oklch(0.34 0.18 350), oklch(0.44 0.20 20))",
  franchise:  "linear-gradient(120deg, oklch(0.26 0.06 60),  oklch(0.34 0.14 65),  oklch(0.44 0.18 55))",
  seo:        "linear-gradient(120deg, oklch(0.24 0.06 215), oklch(0.32 0.14 210), oklch(0.42 0.18 205))",
  admin:      "linear-gradient(120deg, oklch(0.22 0.03 250), oklch(0.30 0.06 245), oklch(0.40 0.08 245))",
  developer:        "linear-gradient(120deg, oklch(0.24 0.05 260), oklch(0.32 0.14 250), oklch(0.42 0.18 235))",
  "dev-manager":    "linear-gradient(120deg, oklch(0.24 0.06 220), oklch(0.32 0.14 210), oklch(0.42 0.18 195))",
  "promise-tracker":"linear-gradient(120deg, oklch(0.26 0.06 325), oklch(0.34 0.16 335), oklch(0.44 0.20 350))",
};
import { RESELLER_CENTER_ORDER, type CenterKey } from "@/lib/reseller-extras";

const dashboardSearchSchema = z.object({
  kpiTone: fallback(z.string(), "all").default("all"),
  kpiSort: fallback(z.string(), "default").default("default"),
});

export const Route = createFileRoute("/dashboard/$role")({
  beforeLoad: ({ params }) => {
    if (!isRoleKey(params.role)) {
      throw redirect({ to: "/" });
    }
  },
  validateSearch: zodValidator(dashboardSearchSchema),
  head: ({ params }) => {
    const cfg = isRoleKey(params.role) ? ROLES[params.role] : null;
    return {
      meta: [
        { title: cfg ? `${cfg.title} — Software Vala` : "Dashboard — Software Vala" },
        { name: "description", content: cfg ? `${cfg.title}. ${cfg.tagline}.` : "Software Vala workspace." },
      ],
    };
  },
  component: DashboardPage,
});

function DashboardPage() {
  const { role } = Route.useParams();
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const cfg = ROLES[role as RoleKey];
  const kpiTone = search.kpiTone as KpiTone;
  const kpiSort = search.kpiSort as KpiSort;
  const setKpiTone = (t: KpiTone) =>
    navigate({
      to: "/dashboard/$role",
      params: { role },
      search: (prev) => ({ ...prev, kpiTone: t }),
      replace: true,
    });
  const setKpiSort = (s: KpiSort) =>
    navigate({
      to: "/dashboard/$role",
      params: { role },
      search: (prev) => ({ ...prev, kpiSort: s }),
      replace: true,
    });

  function switchRole(next: RoleKey) {
    setActiveModule(null);
    navigate({ to: "/dashboard/$role", params: { role: next } });
  }

  const isAIChat = activeModule === "ai-chat";
  const isPricing = activeModule === "pricing" && role === "reseller";
  const centerMatch = activeModule?.startsWith("center:")
    ? (activeModule.slice("center:".length) as CenterKey)
    : null;
  const isCenter =
    centerMatch && (RESELLER_CENTER_ORDER as readonly string[]).includes(centerMatch);

  const availableTones = useMemo<KpiTone[]>(() => {
    const set = new Set<KpiTone>(cfg.kpis.map((k) => k.tone));
    return ["all", ...Array.from(set)];
  }, [cfg.kpis]);

  const filteredKpis = useMemo(() => {
    let list = kpiTone === "all" ? cfg.kpis : cfg.kpis.filter((k) => k.tone === kpiTone);
    switch (kpiSort) {
      case "label_asc":  list = [...list].sort((a, b) => a.label.localeCompare(b.label)); break;
      case "label_desc": list = [...list].sort((a, b) => b.label.localeCompare(a.label)); break;
      case "tone":       list = [...list].sort((a, b) => a.tone.localeCompare(b.tone)); break;
      default: break;
    }
    return list;
  }, [cfg.kpis, kpiTone, kpiSort]);

  const activeLabel = (() => {
    if (isAIChat) return "AI Chat";
    if (isPricing) return "Pricing Engine";
    if (isCenter) return `${centerMatch} Center`;
    if (activeModule) return cfg.modules.find((m) => m.key === activeModule)?.label ?? activeModule;
    return null;
  })();

  const crumbs = activeLabel
    ? [{ label: "Home", onClick: () => setActiveModule(null) }, { label: cfg.name, onClick: () => setActiveModule(null) }, { label: activeLabel }]
    : [{ label: "Home" }, { label: cfg.name }];

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar role={cfg} activeModule={activeModule} onSelectModule={setActiveModule} />
      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar role={cfg} onSwitchRole={switchRole} onOpenAIChat={() => setActiveModule("ai-chat")} onOpenModule={(k) => setActiveModule(k)} />
        <main className="flex-1 px-4 md:px-6 py-5 space-y-5 overflow-x-hidden">
          <Breadcrumbs items={crumbs} />
          {isAIChat ? (
            <ModuleBoundary onReset={() => setActiveModule(null)}><AIChatWorkspace onBack={() => setActiveModule(null)} /></ModuleBoundary>
          ) : isPricing ? (
            <ModuleBoundary onReset={() => setActiveModule(null)}><ResellerPricingWorkspace onBack={() => setActiveModule(null)} /></ModuleBoundary>
          ) : isCenter && role === "reseller" ? (
            <ModuleBoundary onReset={() => setActiveModule(null)}><ResellerCenterPage centerKey={centerMatch as CenterKey} onBack={() => setActiveModule(null)} /></ModuleBoundary>
          ) : activeModule === "ai" && role === "vendor" ? (
            <ModuleBoundary onReset={() => setActiveModule(null)}><AISuitePage onBack={() => setActiveModule(null)} /></ModuleBoundary>
          ) : activeModule === "ai" && role === "reseller" ? (
            <ModuleBoundary onReset={() => setActiveModule(null)}><ResellerAISuitePage onBack={() => setActiveModule(null)} /></ModuleBoundary>
          ) : activeModule ? (
            <ModuleBoundary onReset={() => setActiveModule(null)}>
              {role === "reseller"
                ? <ResellerModulePage role={cfg} moduleKey={activeModule} onBack={() => setActiveModule(null)} />
                : <ModulePage role={cfg} moduleKey={activeModule} onBack={() => setActiveModule(null)} />}
            </ModuleBoundary>
          ) : (
            <>
              <ResellerProfileHero
                roleName={cfg.name}
                accountLabel={`Your ${cfg.name} Account`}
                centerLabel={`${cfg.name} Center`}
                bannerGradient={ROLE_BANNER_GRADIENTS[role as RoleKey]}
              />
              {role === "reseller" ? (
                <ResellerHero />
              ) : role === "vendor" ? (
                <VendorSliderHero role={cfg} onCta={() => setActiveModule(cfg.modules[0]?.key ?? null)} />
              ) : role === "author" ? (
                <AuthorHero role={cfg} onCta={() => setActiveModule(cfg.modules[0]?.key ?? null)} />
              ) : (
                <Hero role={cfg} onCta={() => setActiveModule(cfg.modules[0]?.key ?? null)} onAnalytics={() => setActiveModule(cfg.modules.find(m => /analytic|report|insight/i.test(m.label))?.key ?? cfg.modules[0]?.key ?? null)} />
              )}
              <KpiToolbar
                tones={availableTones}
                tone={kpiTone}
                onToneChange={setKpiTone}
                sort={kpiSort}
                onSortChange={setKpiSort}
              />
              <KpiGrid items={filteredKpis} onOpen={(k) => setActiveModule(k)} />
              <ContentRows role={cfg} onOpen={(k) => setActiveModule(k)} />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
