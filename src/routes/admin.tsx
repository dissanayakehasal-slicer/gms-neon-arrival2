import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const PASSWORD = "gen-zcience321";
const STORAGE_KEY = "gms_countdown_settings_v1";

type Settings = {
  enabled: boolean;
  endsAt: string; // ISO string from datetime-local
  redirectUrl: string;
};

const defaults: Settings = { enabled: false, endsAt: "", redirectUrl: "" };

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin · GMS" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  pendingComponent: () => (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <p className="font-display text-sm tracking-[0.3em] text-neon-cyan">LOADING…</p>
    </main>
  ),
  component: AdminPage,
});

function AdminPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [settings, setSettings] = useState<Settings>(defaults);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch settings from API on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/countdown');
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
        // Fallback to localStorage if API fails
        try {
          const raw = localStorage.getItem('gms_countdown_settings_v1');
          if (raw) setSettings({ ...defaults, ...JSON.parse(raw) });
        } catch {}
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (pw === PASSWORD) {
      setUnlocked(true);
      setError("");
    } else {
      setError("Incorrect password.");
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    try {
      const response = await fetch('/api/countdown', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        // Also save to localStorage as fallback
        localStorage.setItem('gms_countdown_settings_v1', JSON.stringify(settings));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } else {
        setError('Failed to save settings');
      }
    } catch (error) {
      console.error('Save error:', error);
      // Fallback: save to localStorage only
      localStorage.setItem('gms_countdown_settings_v1', JSON.stringify(settings));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }

  function handleClear() {
    const cleared: Settings = { enabled: false, endsAt: "", redirectUrl: "" };
    setSettings(cleared);
    localStorage.removeItem('gms_countdown_settings_v1');
    
    // Also clear from database
    fetch('/api/countdown', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cleared),
    }).catch(error => console.error('Clear error:', error));
  }

  if (!unlocked) {
    return (
      <main className="relative flex min-h-screen items-center justify-center bg-background px-4">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-neon-violet/20 blur-[140px]" />
          <div className="absolute -bottom-40 -right-20 h-[500px] w-[500px] rounded-full bg-neon-magenta/20 blur-[160px]" />
        </div>
        <form
          onSubmit={handleLogin}
          className="relative z-10 w-full max-w-sm rounded-2xl border border-neon-cyan/30 bg-background/70 p-8 backdrop-blur-md shadow-[0_0_40px_oklch(0.65_0.28_295/0.3)]"
        >
          <h1 className="font-display text-2xl font-bold tracking-[0.2em] text-foreground">
            <span className="text-neon-cyan">ADMIN</span>{" "}
            <span className="text-neon-magenta">ACCESS</span>
          </h1>
          <p className="mt-2 font-body text-sm text-foreground/60">
            Enter password to continue.
          </p>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            autoFocus
            placeholder="Password"
            className="mt-6 w-full rounded-md border border-neon-cyan/30 bg-background/60 px-4 py-3 font-body text-foreground outline-none focus:border-neon-cyan/70"
          />
          {error && (
            <p className="mt-3 font-body text-sm text-destructive">{error}</p>
          )}
          <button
            type="submit"
            className="mt-6 w-full rounded-md bg-gradient-to-r from-neon-cyan to-neon-magenta px-4 py-3 font-display text-sm font-bold tracking-[0.2em] text-background transition hover:opacity-90"
          >
            UNLOCK
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-background px-4 py-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-neon-violet/15 blur-[140px]" />
        <div className="absolute -bottom-40 -right-20 h-[500px] w-[500px] rounded-full bg-neon-magenta/15 blur-[160px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-2xl">
        <header className="mb-8">
          <p className="font-display text-xs tracking-[0.5em] text-neon-cyan">
            GEETHMUNASINGHE.LK
          </p>
          <h1 className="mt-2 font-display text-4xl font-black tracking-tight text-foreground">
            Admin Console
          </h1>
          <p className="mt-1 font-body text-sm text-foreground/60">
            Control the countdown shown on the home page.
          </p>
        </header>

        <form
          onSubmit={handleSave}
          className="space-y-6 rounded-2xl border border-neon-cyan/30 bg-background/70 p-8 backdrop-blur-md"
        >
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={settings.enabled}
              onChange={(e) =>
                setSettings({ ...settings, enabled: e.target.checked })
              }
              className="mt-1 h-5 w-5 cursor-pointer accent-neon-magenta"
            />
            <span>
              <span className="block font-display text-sm font-bold tracking-[0.15em] text-foreground">
                SHOW COUNTDOWN ON HOME PAGE
              </span>
              <span className="mt-1 block font-body text-xs text-foreground/60">
                When ticked, visitors will see the countdown timer.
              </span>
            </span>
          </label>

          <div>
            <label className="block font-display text-xs tracking-[0.2em] text-foreground/80">
              COUNTDOWN ENDS AT
            </label>
            <input
              type="datetime-local"
              value={settings.endsAt}
              onChange={(e) =>
                setSettings({ ...settings, endsAt: e.target.value })
              }
              className="mt-2 w-full rounded-md border border-neon-cyan/30 bg-background/60 px-4 py-3 font-body text-foreground outline-none focus:border-neon-cyan/70"
            />
          </div>

          <div>
            <label className="block font-display text-xs tracking-[0.2em] text-foreground/80">
              REDIRECT URL WHEN COUNTDOWN ENDS
            </label>
            <input
              type="url"
              placeholder="https://example.com"
              value={settings.redirectUrl}
              onChange={(e) =>
                setSettings({ ...settings, redirectUrl: e.target.value })
              }
              className="mt-2 w-full rounded-md border border-neon-cyan/30 bg-background/60 px-4 py-3 font-body text-foreground outline-none focus:border-neon-cyan/70"
            />
            <p className="mt-1 font-body text-xs text-foreground/50">
              Visitors will be redirected here with no delay the moment the timer hits zero.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="rounded-md bg-gradient-to-r from-neon-cyan to-neon-magenta px-6 py-3 font-display text-sm font-bold tracking-[0.2em] text-background transition hover:opacity-90"
            >
              SAVE
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="rounded-md border border-neon-magenta/40 px-6 py-3 font-display text-sm font-bold tracking-[0.2em] text-foreground transition hover:bg-neon-magenta/10"
            >
              CLEAR
            </button>
            {saved && (
              <span className="font-body text-sm text-neon-cyan">Saved.</span>
            )}
          </div>
        </form>

        <p className="mt-6 font-body text-xs text-foreground/40">
          Settings are stored in this browser only.
        </p>
      </div>
    </main>
  );
}