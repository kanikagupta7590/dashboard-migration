import { useState } from "react";
import {
  Camera, ImageIcon, ShieldCheck, Pencil, Crown, Layers, Briefcase, Trophy,
  Target as TargetIcon, Gauge, TrendingUp, RotateCcw, User,
} from "lucide-react";

type ResellerProfile = {
  name: string;
  logoUrl: string | null;
  bannerUrl: string | null;
  verified: boolean;
  membershipPlan: string;        // e.g. Free / Starter / Pro / Elite
  whiteLabelActive: boolean;
  partnerTier: string;           // Bronze / Silver / Gold / Platinum
  leaderboardRank: number | null;
  salesTarget: number | null;    // % of monthly target reached
  performance: number | null;    // 0..100
  conversion: number | null;     // %
  renewalScore: number | null;   // %
};

type ProfileHeroProps = {
  roleName?: string;      // e.g. "Reseller", "Author"
  accountLabel?: string;  // e.g. "Your Reseller Account"
  centerLabel?: string;   // e.g. "Reseller Center"
  bannerGradient?: string;
};

export function ResellerProfileHero({
  roleName = "Reseller",
  accountLabel,
  centerLabel,
  bannerGradient,
}: ProfileHeroProps = {}) {
  const EMPTY: ResellerProfile = {
    name: accountLabel ?? `Your ${roleName} Account`,
    logoUrl: null,
    bannerUrl: null,
    verified: false,
    membershipPlan: "—",
    whiteLabelActive: false,
    partnerTier: "—",
    leaderboardRank: null,
    salesTarget: null,
    performance: null,
    conversion: null,
    renewalScore: null,
  };
  const [profile, setProfile] = useState<ResellerProfile>(EMPTY);
  const [editing, setEditing] = useState(false);
  const defaultGradient =
    "linear-gradient(120deg, oklch(0.26 0.06 175), oklch(0.32 0.16 160), oklch(0.42 0.22 150))";
  const bannerBg = bannerGradient ?? defaultGradient;
  const centerText = centerLabel ?? `${roleName} Center`;

  function pickImage(field: "logoUrl" | "bannerUrl") {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => {
      const f = input.files?.[0];
      if (!f) return;
      setProfile((p) => ({ ...p, [field]: URL.createObjectURL(f) }));
    };
    input.click();
  }

  return (
    <section className="relative overflow-hidden rounded-3xl border border-border shadow-card bg-surface">
      <div
        className="relative h-36 md:h-44 w-full overflow-hidden"
        style={{
          background: profile.bannerUrl
            ? `center/cover no-repeat url(${profile.bannerUrl})`
            : bannerBg,
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <button
          onClick={() => pickImage("bannerUrl")}
          className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-lg bg-black/40 hover:bg-black/60 backdrop-blur border border-white/20 px-2.5 py-1.5 text-[11px] font-medium text-white transition"
        >
          <ImageIcon className="h-3.5 w-3.5" />
          {profile.bannerUrl ? "Change banner" : "Upload banner"}
        </button>
      </div>

      <div className="relative px-5 md:px-8 pb-5 -mt-12">
        <div className="flex items-end gap-4">
          <button
            onClick={() => pickImage("logoUrl")}
            className="relative h-24 w-24 shrink-0 rounded-2xl border-4 border-background bg-surface-2 overflow-hidden grid place-items-center shadow-card group"
            title={profile.logoUrl ? "Change logo" : "Upload logo"}
          >
            {profile.logoUrl ? (
              <img src={profile.logoUrl} alt="Reseller logo" className="h-full w-full object-cover" />
            ) : (
              <User className="h-8 w-8 text-muted-foreground" />
            )}
            <span className="absolute inset-x-0 bottom-0 grid place-items-center bg-black/60 text-white text-[10px] py-0.5 opacity-0 group-hover:opacity-100 transition">
              <Camera className="h-3 w-3" />
            </span>
          </button>

          <div className="min-w-0 flex-1 pb-1">
            <div className="flex items-center gap-2 flex-wrap">
              {editing ? (
                <input
                  autoFocus
                  value={profile.name}
                  onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                  onBlur={() => setEditing(false)}
                  onKeyDown={(e) => { if (e.key === "Enter") setEditing(false); }}
                  className="bg-surface-2 border border-border rounded-md px-2 py-1 text-lg font-bold outline-none focus:ring-2 focus:ring-ring"
                />
              ) : (
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{profile.name}</h1>
              )}
              <button
                onClick={() => setEditing((v) => !v)}
                className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-surface-2 hover:text-foreground transition"
                title="Edit reseller name"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>

              <Chip
                icon={ShieldCheck}
                label={profile.verified ? "Verified" : "Unverified"}
                tone={profile.verified ? "success" : "muted"}
                title="Verification Status"
                onClick={() => setProfile((p) => ({ ...p, verified: !p.verified }))}
              />
              <Chip icon={Crown}    label={`Plan · ${profile.membershipPlan}`}   tone="violet"  title="Membership Plan" />
              <Chip icon={Layers}   label={profile.whiteLabelActive ? "White-label ON" : "White-label OFF"} tone={profile.whiteLabelActive ? "success" : "muted"} title="White Label Status" />
              <Chip icon={Briefcase} label={`Tier · ${profile.partnerTier}`}    tone="cyan"    title="Partner Tier" />
              <Chip icon={Trophy}   label={profile.leaderboardRank == null ? "Rank · —" : `Rank · #${profile.leaderboardRank}`} tone="warning" title="Leaderboard Rank" />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {centerText} · Configure your profile, plan and white-label kit to get started.
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          <ScoreCard icon={TargetIcon} label="Sales Target"      value={profile.salesTarget}  suffix="%" tone="brand" />
          <ScoreCard icon={Gauge}      label="Performance Score" value={profile.performance}  suffix="%" tone="success" />
          <ScoreCard icon={TrendingUp} label="Conversion Score"  value={profile.conversion}   suffix="%" tone="cyan" />
          <ScoreCard icon={RotateCcw}  label="Renewal Score"     value={profile.renewalScore} suffix="%" tone="violet" />
        </div>
      </div>
    </section>
  );
}

function Chip({
  icon: Icon, label, tone, title, onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  tone: "success" | "muted" | "violet" | "cyan" | "warning";
  title?: string;
  onClick?: () => void;
}) {
  const cls = {
    success: "bg-success/15 text-success border-success/40",
    muted:   "bg-surface-2 text-muted-foreground border-border",
    violet:  "bg-[oklch(0.75_0.18_300)]/15 text-[oklch(0.78_0.18_300)] border-[oklch(0.75_0.18_300)]/30",
    cyan:    "bg-[oklch(0.78_0.16_210)]/15 text-[oklch(0.78_0.16_210)] border-[oklch(0.78_0.16_210)]/30",
    warning: "bg-warning/15 text-warning border-warning/40",
  }[tone];
  const Cmp: any = onClick ? "button" : "span";
  return (
    <Cmp
      onClick={onClick}
      title={title}
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold transition ${cls} ${onClick ? "hover:opacity-80" : ""}`}
    >
      <Icon className="h-3 w-3" />
      {label}
    </Cmp>
  );
}

function ScoreCard({
  icon: Icon, label, value, suffix, tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | null;
  suffix: string;
  tone: "brand" | "success" | "warning" | "violet" | "cyan";
}) {
  const toneText = {
    brand:   "text-brand",
    success: "text-success",
    warning: "text-warning",
    violet:  "text-[oklch(0.75_0.18_300)]",
    cyan:    "text-[oklch(0.78_0.16_210)]",
  }[tone];
  const display = value == null ? "—" : `${value}${suffix}`;
  const pct = value == null ? 0 : Math.max(0, Math.min(100, value));
  return (
    <div className="rounded-xl border border-border bg-surface p-3">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground">
        <Icon className={`h-3.5 w-3.5 ${toneText}`} />
        {label}
      </div>
      <div className="mt-1 text-lg font-bold">{display}</div>
      <div className="mt-2 h-1.5 rounded-full bg-surface-2 overflow-hidden">
        <div className={`h-full transition-all ${toneText}`} style={{ width: `${pct}%`, background: "currentColor" }} />
      </div>
    </div>
  );
}
