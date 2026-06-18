import { createFileRoute } from "@tanstack/react-router";
import teacher from "@/assets/teacher.png";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GMS — GEN-Zcience | Coming Soon | geethmunasinghe.lk" },
      { name: "description", content: "GMS GEN-Zcience by Geeth Munasinghe — a new era of science learning is arriving. Coming soon to geethmunasinghe.lk" },
      { property: "og:title", content: "GMS GEN-Zcience — Coming Soon" },
      { property: "og:description", content: "A new era of science learning is arriving at geethmunasinghe.lk" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Rajdhani:wght@400;600;700&display=swap",
      },
    ],
  }),
  component: ComingSoon,
});

type Settings = { enabled: boolean; endsAt: string; redirectUrl: string };

function useCountdown() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [loadError, setLoadError] = useState(false);

  // Fetch settings from API on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/countdown');
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        }
      } catch (error) {
        console.error('Failed to fetch countdown settings:', error);
        setLoadError(true);
        // Fallback to localStorage if API fails
        try {
          const raw = localStorage.getItem('gms_countdown_settings_v1');
          if (raw) setSettings(JSON.parse(raw));
        } catch {}
      }
    };

    fetchSettings();
  }, []);

  // Update time every second
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!settings || !settings.enabled || !settings.endsAt) return null;
  const end = new Date(settings.endsAt).getTime();
  if (isNaN(end)) return null;
  const diff = end - now;

  if (diff <= 0) {
    // Immediate redirect when time is up
    if (settings.redirectUrl) {
      window.location.replace(settings.redirectUrl);
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  }

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { days, hours, minutes, seconds, done: false };
}

function CountdownBox() {
  const cd = useCountdown();
  if (!cd || cd.done) return null;
  
  const Unit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="min-w-[80px] rounded-lg border-2 border-neon-cyan/60 bg-background/70 px-4 py-3 backdrop-blur-md sm:min-w-[100px] lg:min-w-[120px] shadow-[0_0_20px_oklch(0.88_0.18_200/0.4)]">
        <span className="font-display text-3xl sm:text-5xl lg:text-6xl font-black tabular-nums text-neon-cyan">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="mt-2 font-display text-xs sm:text-sm lg:text-base tracking-[0.4em] text-neon-cyan/80">
        {label}
      </span>
    </div>
  );

  return (
    <div className="mt-6 flex items-end justify-center gap-3 sm:gap-5 lg:gap-6 lg:justify-start animate-pulse-glow">
      <Unit value={cd.days} label="DAYS" />
      <Unit value={cd.hours} label="HRS" />
      <Unit value={cd.minutes} label="MIN" />
      <Unit value={cd.seconds} label="SEC" />
    </div>
  );
}

function ComingSoon() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Background gradients */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-neon-violet/30 blur-[140px]" />
        <div className="absolute -bottom-40 -right-20 h-[700px] w-[700px] rounded-full bg-neon-magenta/25 blur-[160px]" />
        <div className="absolute top-1/3 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-neon-cyan/15 blur-[120px]" />
      </div>

      {/* Grid floor */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.88 0.18 200 / 0.35) 1px, transparent 1px), linear-gradient(90deg, oklch(0.72 0.32 340 / 0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          transform: "perspective(700px) rotateX(60deg)",
          transformOrigin: "bottom",
          maskImage: "linear-gradient(to top, black, transparent)",
        }}
      />

      {/* Scanline */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute inset-x-0 h-40 bg-gradient-to-b from-transparent via-neon-cyan/40 to-transparent animate-scan" />
      </div>

      {/* Content */}
      <section className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 py-16 lg:flex-row lg:justify-between lg:gap-12">
        {/* Left text */}
        <div className="relative z-20 text-center lg:text-left">
          <p className="font-display text-sm tracking-[0.5em] text-neon-cyan animate-flicker">
            GEETHMUNASINGHE.LK
          </p>

          {/* Countdown appears FIRST - bigger and prominently displayed */}
          <CountdownBox />

          {/* "COMING SOON" title - smaller when countdown is active */}
          <div>
            <h1 className="mt-6 font-display leading-[0.85] font-black tracking-tighter animate-pulse-glow">
              {useCountdown() ? (
                <>
                  <span className="block bg-gradient-to-br from-neon-cyan via-neon-violet to-neon-magenta bg-clip-text text-transparent text-5xl sm:text-6xl lg:text-7xl xl:text-8xl">
                    COMING
                  </span>
                  <span className="block bg-gradient-to-tr from-neon-magenta via-neon-violet to-neon-cyan bg-clip-text text-transparent text-5xl sm:text-6xl lg:text-7xl xl:text-8xl">
                    SOON
                  </span>
                </>
              ) : (
                <>
                  <span className="block bg-gradient-to-br from-neon-cyan via-neon-violet to-neon-magenta bg-clip-text text-transparent text-[20vw] sm:text-[14vw] lg:text-[10rem] xl:text-[12rem]">
                    COMING
                  </span>
                  <span className="block bg-gradient-to-tr from-neon-magenta via-neon-violet to-neon-cyan bg-clip-text text-transparent text-[20vw] sm:text-[14vw] lg:text-[10rem] xl:text-[12rem]">
                    SOON
                  </span>
                </>
              )}
            </h1>
          </div>

          <div className="mt-8 flex flex-col items-center gap-4 lg:items-start">
            <div className="inline-flex items-center gap-3 rounded-full border border-neon-cyan/40 bg-background/40 px-5 py-2 backdrop-blur-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-neon-magenta shadow-[0_0_12px_currentColor]" />
              <span className="font-display text-xs tracking-[0.35em] text-foreground/90">
                GMS · GEN-ZCIENCE
              </span>
            </div>
            <p className="max-w-md font-body text-base text-foreground/70 sm:text-lg">
              A new era of science learning is loading. Built for the Gen-Z mind by
              <span className="text-neon-cyan"> Geeth Munasinghe</span>.
            </p>
          </div>
        </div>

        {/* Teacher figure */}
        <div className="relative mt-12 lg:mt-0 lg:flex-shrink-0">
          {/* Deep background glow */}
          <div className="pointer-events-none absolute -inset-32 z-0">
            <div className="absolute inset-0 rounded-full bg-neon-cyan/10 blur-[100px]" />
            <div className="absolute inset-0 rounded-full bg-neon-magenta/10 blur-[120px]" style={{ animationDelay: '-5s' }} />
          </div>

          {/* Swirling mist layers behind */}
          <div className="pointer-events-none absolute -inset-16 z-0 overflow-visible">
            <div className="absolute -top-8 -left-8 h-40 w-56 animate-mist rounded-[40%_60%_70%_30%/40%_50%_60%_50%] bg-neon-cyan/25 blur-2xl" />
            <div className="absolute -top-4 -right-6 h-36 w-48 animate-mist rounded-[60%_40%_30%_70%/50%_60%_40%_50%] bg-neon-magenta/20 blur-2xl" style={{ animationDelay: '-6s' }} />
            <div className="absolute top-1/3 -left-12 h-32 w-44 animate-mist rounded-[30%_70%_60%_40%/50%_40%_60%_50%] bg-neon-violet/20 blur-2xl" style={{ animationDelay: '-12s' }} />
            <div className="absolute top-1/2 -right-10 h-28 w-40 animate-mist rounded-[70%_30%_40%_60%/40%_50%_60%_40%] bg-neon-cyan/18 blur-2xl" style={{ animationDelay: '-3s' }} />
            <div className="absolute -bottom-4 left-1/4 h-24 w-52 animate-mist rounded-[50%_50%_40%_60%/60%_40%_50%_50%] bg-neon-magenta/22 blur-2xl" style={{ animationDelay: '-9s' }} />
          </div>

          {/* Glow halo behind figure */}
          <div className="absolute inset-x-10 bottom-10 top-10 z-0 rounded-full bg-gradient-to-t from-neon-magenta/60 via-neon-violet/40 to-neon-cyan/30 blur-3xl" />

          {/* Floating orbs around teacher */}
          <div className="pointer-events-none absolute inset-0 z-20">
            <div className="absolute -top-6 left-[15%] h-3 w-3 animate-float rounded-full bg-neon-cyan shadow-[0_0_16px_oklch(0.88_0.18_200)]" style={{ animationDelay: '-1s' }} />
            <div className="absolute top-[10%] -right-5 h-2 w-2 animate-float rounded-full bg-neon-magenta shadow-[0_0_12px_oklch(0.72_0.32_340)]" style={{ animationDelay: '-3s' }} />
            <div className="absolute top-[35%] -left-8 h-2.5 w-2.5 animate-float rounded-full bg-neon-violet shadow-[0_0_14px_oklch(0.65_0.28_295)]" style={{ animationDelay: '-5s' }} />
            <div className="absolute top-[60%] -right-6 h-3 w-3 animate-float rounded-full bg-neon-cyan/80 shadow-[0_0_16px_oklch(0.88_0.18_200)]" style={{ animationDelay: '-2s' }} />
            <div className="absolute bottom-[20%] -left-5 h-2 w-2 animate-float rounded-full bg-neon-magenta/70 shadow-[0_0_10px_oklch(0.72_0.32_340)]" style={{ animationDelay: '-4s' }} />
            <div className="absolute -bottom-4 right-[20%] h-2.5 w-2.5 animate-float rounded-full bg-neon-violet/80 shadow-[0_0_12px_oklch(0.65_0.28_295)]" style={{ animationDelay: '-6s' }} />
            {/* Extra decorative elements */}
            <div className="absolute top-[5%] left-1/2 h-1.5 w-1.5 animate-float rounded-full bg-neon-cyan/60 shadow-[0_0_8px_oklch(0.88_0.18_200)]" style={{ animationDelay: '-7s' }} />
            <div className="absolute bottom-[35%] right-[5%] h-1.5 w-1.5 animate-float rounded-full bg-neon-magenta/50 shadow-[0_0_8px_oklch(0.72_0.32_340)]" style={{ animationDelay: '-8s' }} />
            <div className="absolute top-[75%] left-[8%] h-2 w-2 animate-float rounded-full bg-neon-violet/60 shadow-[0_0_10px_oklch(0.65_0.28_295)]" style={{ animationDelay: '-9s' }} />
            {/* Small ring elements */}
            <div className="absolute top-[15%] -left-3 h-5 w-5 animate-float rounded-full border border-neon-cyan/40" style={{ animationDelay: '-2.5s' }} />
            <div className="absolute bottom-[15%] -right-4 h-6 w-6 animate-float rounded-full border border-neon-magenta/30" style={{ animationDelay: '-4.5s' }} />
            {/* Hexagon / diamond shapes */}
            <div className="absolute top-[25%] right-[2%] h-4 w-4 animate-float rotate-45 border border-neon-cyan/30" style={{ animationDelay: '-1.5s' }} />
            <div className="absolute bottom-[40%] left-[2%] h-3 w-3 animate-float rotate-45 border border-neon-magenta/25" style={{ animationDelay: '-3.5s' }} />
          </div>

          {/* Teacher name box / pedestal */}
          <div className="relative z-10 flex flex-col items-center">
            <img
              src={teacher}
              alt="Geeth Munasinghe"
              className="relative z-10 h-[60vh] w-auto animate-float object-contain drop-shadow-[0_0_45px_oklch(0.72_0.32_340/0.6)] sm:h-[70vh] lg:h-[85vh]"
            />

            {/* Name card box under teacher - replaces the floating look */}
            <div className="relative z-20 -mt-6 w-full max-w-xs rounded-xl border border-neon-cyan/30 bg-background/60 px-6 py-4 backdrop-blur-md shadow-[0_0_30px_oklch(0.65_0.28_295/0.25)]">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-neon-cyan/10 via-transparent to-neon-magenta/10" />
              <p className="relative z-10 text-center font-display text-lg tracking-[0.2em] text-foreground">
                <span className="text-neon-cyan">GEETH</span>{' '}
                <span className="text-neon-magenta">MUNASINGHE</span>
              </p>
              <p className="relative z-10 mt-1 text-center font-body text-xs tracking-[0.3em] text-foreground/60">
                FOUNDER · SCIENCE EDUCATOR
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer tag */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 z-30 -translate-x-1/2 text-center">
        <p className="font-display text-[10px] tracking-[0.6em] text-foreground/40">
          STAY CURIOUS · STAY GEN-Z
        </p>
      </div>

      {/* Contact Us button */}
      <a
        href="https://wa.me/94762657277"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border border-neon-cyan/40 bg-background/70 px-5 py-3 backdrop-blur-md shadow-[0_0_20px_oklch(0.88_0.18_200/0.2)] transition-all duration-300 hover:border-neon-cyan/70 hover:bg-background/90 hover:shadow-[0_0_30px_oklch(0.88_0.18_200/0.4)] hover:scale-105"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neon-cyan" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        <span className="font-display text-sm tracking-[0.15em] text-foreground">CONTACT US</span>
      </a>
    </main>
  );
}
