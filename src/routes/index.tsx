import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getAuthenticatedRole, devSetRole, EXISTING_LOGIN_URL } from "@/lib/auth-bridge";
import { ROLES, ROLE_ORDER, type RoleKey } from "@/lib/roles";
import roundLogoAsset from "@/assets/softwarevala-logo-round-v2.jpg.asset.json";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/")({
  // SSR-disabled so we can read the existing client-side auth without leaking.
  ssr: false,
  head: () => ({ meta: [{ title: "Software Vala — Redirecting…" }] }),
  component: RoleBridge,
});

function RoleBridge() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"detecting" | "no-role">("detecting");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const role = await getAuthenticatedRole();
      if (cancelled) return;
      if (role) {
        navigate({ to: "/dashboard/$role", params: { role }, replace: true });
      } else {
        setStatus("no-role");
      }
    })();
    return () => { cancelled = true; };
  }, [navigate]);

  if (status === "detecting") {
    return (
      <div className="min-h-screen grid place-items-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-4">
          <img src={roundLogoAsset.url} alt="Software Vala" className="h-14 w-14 rounded-full ring-2 ring-white/15 shadow-glow" />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Detecting your role…
          </div>
        </div>
      </div>
    );
  }

  // Not signed in — bounce to the existing login URL. While that loads,
  // show a small dev helper so you can preview any role during wiring.
  return <NotSignedIn onPick={(r) => {
    devSetRole(r);
    navigate({ to: "/dashboard/$role", params: { role: r }, replace: true });
  }} />;
}

function NotSignedIn({ onPick }: { onPick: (r: RoleKey) => void }) {
  useEffect(() => {
    // Redirect to existing auth after a beat so the dev helper is glance-able.
    const t = setTimeout(() => {
      // Comment this out while previewing dashboards.
      // window.location.href = EXISTING_LOGIN_URL;
    }, 0);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen grid place-items-center bg-background text-foreground p-6">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-card">
        <div className="flex items-center gap-3">
          <img src={roundLogoAsset.url} alt="" className="h-10 w-10 rounded-full ring-2 ring-white/15" />
          <div>
            <div className="text-sm font-semibold">Not signed in</div>
            <div className="text-[11px] text-muted-foreground">
              Sign in via your existing auth system to load your dashboard.
            </div>
          </div>
        </div>

        <a
          href={EXISTING_LOGIN_URL}
          className="mt-5 block w-full text-center rounded-lg bg-gradient-brand text-brand-foreground px-4 py-2.5 text-sm font-semibold shadow-glow"
        >
          Go to login
        </a>

        <div className="mt-6 pt-4 border-t border-border">
          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-2">
            Dev preview · pick a role
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {ROLE_ORDER.map((k) => (
              <button
                key={k}
                onClick={() => onPick(k)}
                className="rounded-lg bg-surface border border-border px-2 py-2 text-[11px] font-medium hover:bg-surface-2 transition"
                title={ROLES[k].title}
              >
                {ROLES[k].name.split(" ")[0]}
              </button>
            ))}
          </div>
          <p className="mt-3 text-[10px] text-muted-foreground leading-relaxed">
            This preview helper goes away once <code className="text-foreground/80">getAuthenticatedRole()</code> in
            <code className="text-foreground/80"> src/lib/auth-bridge.ts</code> is wired to your real auth.
          </p>
        </div>
      </div>
    </div>
  );
}
