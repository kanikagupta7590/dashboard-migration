import { Home, Compass, Layers, FolderOpen, Settings, LifeBuoy, LogOut, Sparkles, Calculator } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import logoAsset from "@/assets/softwarevala-logo-round-v2.jpg.asset.json";
import type { RoleConfig } from "@/lib/roles";
import { signOut } from "@/lib/auth-bridge";
import { cn } from "@/lib/utils";
import { RESELLER_CENTER_ORDER, RESELLER_CENTERS } from "@/lib/reseller-extras";

type Props = {
  role: RoleConfig;
  activeModule: string | null;
  onSelectModule: (key: string | null) => void;
};

export function Sidebar({ role, activeModule, onSelectModule }: Props) {
  const navigate = useNavigate();
  async function handleLogout() {
    await signOut();
    navigate({ to: "/", replace: true });
  }

  const isReseller = role.key === "reseller";

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground border-r border-border">
      <div className="px-5 pt-5 pb-4 border-b border-border">
        <div className="flex items-center gap-2.5">
          <img
            src={logoAsset.url}
            alt="Software Vala"
            className="h-10 w-10 rounded-full object-cover ring-2 ring-[oklch(0.45_0.2_260)]/60 shadow-sm"
          />
          <div className="min-w-0">
            <div className="text-sm font-bold tracking-tight leading-tight truncate">
              Software Vala<span className="text-[oklch(0.55_0.22_25)]">™</span>
            </div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground truncate">
              {role.title}
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4 space-y-6">
        <Section title="Menu">
          <NavItem icon={Home} label="Dashboard" active={activeModule === null} onClick={() => onSelectModule(null)} />
          {isReseller && (
            <NavItem icon={Calculator} label="Pricing Engine" active={activeModule === "pricing"} onClick={() => onSelectModule("pricing")} accent />
          )}
          <NavItem icon={Sparkles} label="AI Chat" active={activeModule === "ai-chat"} onClick={() => onSelectModule("ai-chat")} accent />
          <NavItem icon={Compass} label="Explore" />
          <NavItem icon={Layers} label="Marketplace" />
          <NavItem icon={FolderOpen} label="Library" />
        </Section>

        <Section title={`${role.name} Modules`}>
          {role.modules.map((m) => (
            <NavItem
              key={m.key}
              icon={m.icon}
              label={m.label}
              active={activeModule === m.key}
              onClick={() => onSelectModule(m.key)}
            />
          ))}
        </Section>

        {isReseller && (
          <Section title="Reseller Centers">
            {RESELLER_CENTER_ORDER.map((k) => {
              const c = RESELLER_CENTERS[k];
              const key = `center:${k}`;
              return (
                <NavItem
                  key={k}
                  icon={c.icon}
                  label={c.label}
                  active={activeModule === key}
                  onClick={() => onSelectModule(key)}
                />
              );
            })}
          </Section>
        )}

        <Section title="Account">
          <NavItem icon={Settings} label="Settings" />
          <NavItem icon={LifeBuoy} label="Support" />
          <NavItem icon={LogOut} label="Logout" onClick={handleLogout} />
        </Section>
      </nav>

      <div className="m-3 rounded-xl bg-gradient-brand p-4 text-brand-foreground shadow-glow">
        <div className="text-xs uppercase tracking-wider opacity-80">Upgrade</div>
        <div className="mt-1 font-semibold">Go Pro</div>
        <p className="mt-1 text-xs opacity-80">Unlock advanced analytics & AI tools.</p>
        <button className="mt-3 w-full rounded-lg bg-white/15 hover:bg-white/25 transition text-xs font-medium py-2">
          Upgrade now
        </button>
      </div>
    </aside>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="px-3 pb-2 text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">{title}</div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function NavItem({
  icon: Icon, label, active, onClick, accent,
}: { icon: any; label: string; active?: boolean; onClick?: () => void; accent?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
        active
          ? "bg-brand text-brand-foreground shadow-glow"
          : accent
            ? "text-foreground bg-brand/10 hover:bg-brand/20"
            : "text-sidebar-foreground/80 hover:bg-white/5 hover:text-foreground"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="truncate">{label}</span>
      {accent && !active && <Sparkles className="ml-auto h-3 w-3 text-[oklch(0.78_0.18_290)]" />}
      {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white" />}
    </button>
  );
}
