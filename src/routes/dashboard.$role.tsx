import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
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
};
import { RESELLER_CENTER_ORDER, type CenterKey } from "@/lib/reseller-extras";

export const Route = createFileRoute("/dashboard/$role")({
  beforeLoad: ({ params }) => {
    if (!isRoleKey(params.role)) {
      throw redirect({ to: "/" });
    }
  },
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
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const cfg = ROLES[role as RoleKey];

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

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar role={cfg} activeModule={activeModule} onSelectModule={setActiveModule} />
      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar role={cfg} onSwitchRole={switchRole} onOpenAIChat={() => setActiveModule("ai-chat")} onOpenModule={(k) => setActiveModule(k)} />
        <main className="flex-1 px-4 md:px-6 py-5 space-y-5 overflow-x-hidden">
          {isAIChat ? (
            <AIChatWorkspace onBack={() => setActiveModule(null)} />
          ) : isPricing ? (
            <ResellerPricingWorkspace onBack={() => setActiveModule(null)} />
          ) : isCenter && role === "reseller" ? (
            <ResellerCenterPage centerKey={centerMatch as CenterKey} onBack={() => setActiveModule(null)} />
          ) : activeModule === "ai" && role === "vendor" ? (
            <AISuitePage onBack={() => setActiveModule(null)} />
          ) : activeModule === "ai" && role === "reseller" ? (
            <ResellerAISuitePage onBack={() => setActiveModule(null)} />
          ) : activeModule ? (
            role === "reseller"
              ? <ResellerModulePage role={cfg} moduleKey={activeModule} onBack={() => setActiveModule(null)} />
              : <ModulePage role={cfg} moduleKey={activeModule} onBack={() => setActiveModule(null)} />
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
              <KpiGrid items={cfg.kpis} onOpen={(k) => setActiveModule(k)} />
              <ContentRows role={cfg} onOpen={(k) => setActiveModule(k)} />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
