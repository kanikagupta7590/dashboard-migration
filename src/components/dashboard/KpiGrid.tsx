import { ArrowDownRight, MoreVertical } from "lucide-react";
import type { Kpi } from "@/lib/roles";

const toneStyle: Record<Kpi["tone"], { bg: string; fg: string; ring: string }> = {
  brand:   { bg: "bg-brand/15", fg: "text-[oklch(0.72_0.2_265)]", ring: "hover:border-[oklch(0.62_0.22_265)]/60" },
  success: { bg: "bg-success/15", fg: "text-success", ring: "hover:border-success/60" },
  warning: { bg: "bg-warning/15", fg: "text-warning", ring: "hover:border-warning/60" },
  danger:  { bg: "bg-destructive/15", fg: "text-destructive", ring: "hover:border-destructive/60" },
  violet:  { bg: "bg-[oklch(0.65_0.22_320)]/15", fg: "text-[oklch(0.78_0.2_320)]", ring: "hover:border-[oklch(0.65_0.22_320)]/60" },
  cyan:    { bg: "bg-[oklch(0.7_0.16_210)]/15", fg: "text-[oklch(0.78_0.15_210)]", ring: "hover:border-[oklch(0.7_0.16_210)]/60" },
};

export function KpiGrid({ items, onOpen }: { items: Kpi[]; onOpen: (k: string) => void }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4">
      {items.map((k) => {
        const t = toneStyle[k.tone];
        return (
          <button
            key={k.key}
            onClick={() => onOpen(k.key)}
            className={`group text-left rounded-2xl bg-card border border-border p-4 transition-all hover:-translate-y-0.5 shadow-card ${t.ring}`}
          >
            <div className="flex items-start justify-between">
              <div className={`grid h-9 w-9 place-items-center rounded-xl ${t.bg}`}>
                <k.icon className={`h-4 w-4 ${t.fg}`} />
              </div>
              <span className="opacity-0 group-hover:opacity-100 transition text-muted-foreground">
                <MoreVertical className="h-3.5 w-3.5" />
              </span>
            </div>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-2xl font-black tracking-tight text-foreground/40">—</span>
              {k.unit === "%" && <span className="text-sm font-bold text-foreground/30">%</span>}
            </div>
            <div className="mt-0.5 flex items-center justify-between">
              <div className="text-xs text-muted-foreground">{k.label}</div>
              <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-muted-foreground">
                <ArrowDownRight className="h-3 w-3 opacity-50" />
                no data
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
