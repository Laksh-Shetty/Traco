"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "../components/ui/button";
import Cards from "@/components/Cards";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, TrendingUp, ArrowUpRight } from "lucide-react";

const stats = [
  { value: "50K+", label: "Active Users", sub: "+18% MoM" },
  { value: "₹2Cr+", label: "Tracked Monthly", sub: "across all users" },
  { value: "4.9★", label: "App Rating", sub: "12K reviews" },
];

const steps = [
  { icon: "login-.png", number: "01", title: "Create Account", desc: "Sign up in under 60 seconds. Your first ₹1,000 practice balance is waiting." },
  { icon: "tracking.png", number: "02", title: "Track Expenses", desc: "Log manually or sync your bank. Every transaction categorized automatically." },
  { icon: "statistics.png", number: "03", title: "Get Insights", desc: "Weekly reports surface patterns you'd never notice on your own." },
];

const testimonials = [
  { initials: "SM", name: "Shreyash Mody", role: "Software Engineer", quote: "Traco completely changed how I look at my monthly spending. Saved over ₹2000 in just two months." },
  { initials: "CM", name: "Chintan Mehta", role: "Chartered Accountant", quote: "The interface is clean and precise. Bank sync saves me hours every week." },
  { initials: "VS", name: "Vraj Soni", role: "Entrepreneur", quote: "Finally, a finance app that doesn't feel like a chore. The goal-setting feature is exceptional." },
];

const ticker = ["SAVINGS +12.4%", "EXPENSES -8.2%", "BUDGET ON TRACK", "NET WORTH ↑", "GOALS 3/5", "CASHFLOW POSITIVE"];

// Theme tokens — all color decisions in one place
function t(dark) {
  return {
    bg:           dark ? "#050508"              : "#f4f5f9",
    fg:           dark ? "#ffffff"              : "#0a0a14",
    muted:        dark ? "rgba(255,255,255,0.45)": "rgba(10,10,20,0.55)",
    faint:        dark ? "rgba(255,255,255,0.22)": "rgba(10,10,20,0.3)",
    subtleHeading:dark ? "rgba(255,255,255,0.22)": "rgba(10,10,20,0.28)",
    cardBg:       dark ? "rgba(255,255,255,0.02)": "rgba(255,255,255,0.7)",
    cardBorder:   dark ? "rgba(34,113,240,0.13)" : "rgba(34,113,240,0.2)",
    cardHoverBg:  dark ? "rgba(34,113,240,0.05)" : "rgba(34,113,240,0.05)",
    cardHoverBorder: dark ? "rgba(34,113,240,0.4)": "rgba(34,113,240,0.45)",
    divider:      dark ? "rgba(255,255,255,0.06)": "rgba(10,10,20,0.08)",
    mockupBar:    dark ? "#0d0d14"              : "#e8eaf2",
    mockupBg:     dark ? "#0d0d14"              : "#ffffff",
    mockupBorder: dark ? "rgba(34,113,240,0.25)": "rgba(34,113,240,0.3)",
    tickerBg:     dark ? "rgba(0,0,0,0.5)"      : "rgba(240,242,255,0.9)",
    stepCardBg:   dark ? "rgba(255,255,255,0.01)": "rgba(255,255,255,0.6)",
    iconInvert:   dark ? "brightness-0 invert opacity-60" : "opacity-80",
    sectionBorder:dark ? "rgba(34,113,240,0.12)": "rgba(34,113,240,0.15)",
  };
}

function LineGrid() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{
      backgroundImage: "linear-gradient(rgba(34,113,240,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(34,113,240,0.07) 1px, transparent 1px)",
      backgroundSize: "64px 64px",
    }} />
  );
}

function GlowBlob({ style }) {
  return <div className="absolute rounded-full pointer-events-none blur-[120px]" style={style} />;
}

function Ticker({ dark }) {
  const tk = t(dark);
  return (
    <div className="w-full overflow-hidden border-y py-2.5" style={{ borderColor: "rgba(34,113,240,0.18)", background: tk.tickerBg, backdropFilter: "blur(8px)" }}>
      <motion.div className="flex gap-16 whitespace-nowrap" animate={{ x: ["0%", "-50%"] }} transition={{ duration: 22, ease: "linear", repeat: Infinity }}>
        {[...ticker, ...ticker].map((item, i) => (
          <span key={i} className="text-xs font-mono tracking-widest uppercase" style={{ color: "rgba(34,113,240,0.7)" }}>
            <span style={{ color: "#d006d4", marginRight: 8 }}>◆</span>{item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default function Home() {
  const heroRef = useRef(null);
  const imgRef = useRef(null);
  const [dark, setDark] = useState(true);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const imgOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.2]);

  useEffect(() => {
    const check = () => setDark(document.documentElement.classList.contains("dark"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const tk = t(dark);

  return (
    <div className="overflow-x-hidden" style={{ background: tk.bg, color: tk.fg, transition: "background 0.3s, color 0.3s" }}>

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center pt-28 pb-0 px-6 overflow-hidden">
        <LineGrid />
        <GlowBlob style={{ width: 700, height: 500, background: dark ? "rgba(34,113,240,0.13)" : "rgba(34,113,240,0.08)", top: -100, left: -200 }} />
        <GlowBlob style={{ width: 500, height: 400, background: dark ? "rgba(208,6,212,0.09)" : "rgba(208,6,212,0.06)", bottom: 100, right: -150 }} />

        <motion.div
          initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 text-center max-w-5xl mx-auto w-full"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-mono tracking-widest uppercase mb-10"
            style={{ border: "1px solid rgba(34,113,240,0.35)", background: "rgba(34,113,240,0.07)", color: "#4a8ff5" }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#2271f0" }} />
            Live · Smart personal finance
          </motion.div>

          <h1 className="font-black tracking-tighter leading-[0.88] mb-8">
            <motion.span
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="block text-6xl md:text-8xl lg:text-[110px]"
              style={{ fontFamily: "'Syne', system-ui, sans-serif", color: tk.fg }}
            >
              Money
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="block text-6xl md:text-8xl lg:text-[110px]"
              style={{ fontFamily: "'Syne', system-ui, sans-serif", background: "linear-gradient(90deg, #2271f0, #d006d4, #2271f0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", backgroundSize: "200% 100%" }}
            >
              Understood.
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-12 font-light"
            style={{ color: tk.muted }}
          >
            Track every rupee. Spot the patterns. Build wealth — one smart decision at a time.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          >
            <Link href="/Sign-up">
              <Button className="group flex items-center gap-2 rounded-full px-8 py-6 text-sm font-semibold text-white transition-all duration-200"
                style={{ background: "linear-gradient(90deg, #2271f0, #d006d4)", boxShadow: "0 0 32px rgba(34,113,240,0.35)" }}>
                Start for free
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/Sign-in">
              <Button variant="ghost" className="rounded-full px-8 py-6 text-sm font-medium transition-all"
                style={{ color: tk.muted, border: `1px solid ${tk.sectionBorder}`, background: "transparent" }}>
                Watch demo
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="flex items-center justify-center gap-10 md:gap-20 mb-20"
          >
            {stats.map((s, i) => (
              <div key={s.label} className="text-center relative">
                {i !== 0 && <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 md:-translate-x-10 h-8 w-px" style={{ background: tk.sectionBorder }} />}
                <div className="text-3xl md:text-4xl font-black mb-1" style={{ fontFamily: "'Syne', system-ui", color: tk.fg }}>{s.value}</div>
                <div className="text-xs uppercase tracking-widest" style={{ color: tk.muted }}>{s.label}</div>
                <div className="text-xs font-mono mt-0.5" style={{ color: "#2271f0" }}>{s.sub}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Dashboard mockup */}
        <motion.div style={{ y: imgY, opacity: imgOpacity }} className="relative z-10 w-full max-w-5xl mx-auto">
          <div className="relative">
            <div className="absolute -inset-px rounded-2xl" style={{ background: "linear-gradient(90deg, #2271f0, #d006d4, #2271f0)", opacity: 0.35, borderRadius: 16 }} />
            <div className="relative rounded-2xl overflow-hidden m-px" style={{ background: tk.mockupBg }}>
              <div className="flex items-center gap-2 px-4 h-9 border-b" style={{ background: tk.mockupBar, borderColor: tk.divider }}>
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                <span className="ml-3 text-xs font-mono" style={{ color: tk.faint }}>traco.app/dashboard</span>
              </div>
              <img ref={imgRef} className="w-full object-contain block" src="Her2.png" alt="Traco Dashboard" />
            </div>
            <div className="absolute -bottom-px left-0 right-0 h-40" style={{ background: `linear-gradient(to top, ${tk.bg}, transparent)` }} />
          </div>
        </motion.div>
      </section>

      <Ticker dark={dark} />

      {/* ── FEATURES ── */}
      <section className="py-28 px-6 relative overflow-hidden">
        <LineGrid />
        <GlowBlob style={{ width: 600, height: 400, background: dark ? "rgba(208,6,212,0.07)" : "rgba(208,6,212,0.05)", top: 0, right: -100 }} />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-16">
            <p className="text-xs font-mono tracking-[0.3em] mb-4 uppercase" style={{ color: "#2271f0" }}>— Features</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight" style={{ fontFamily: "'Syne', system-ui", color: tk.fg }}>
              Everything you need<br />
              <span style={{ color: tk.subtleHeading }}>nothing you don't.</span>
            </h2>
          </div>
          <Cards dark={dark} />
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-28 px-6 relative overflow-hidden" style={{ borderTop: `1px solid ${tk.sectionBorder}` }}>
        <LineGrid />
        <GlowBlob style={{ width: 700, height: 400, background: dark ? "rgba(34,113,240,0.08)" : "rgba(34,113,240,0.05)", top: "50%", left: -200, transform: "translateY(-50%)" }} />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
            <div>
              <p className="text-xs font-mono tracking-[0.3em] mb-4 uppercase" style={{ color: "#d006d4" }}>— Process</p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight" style={{ fontFamily: "'Syne', system-ui", color: tk.fg }}>
                Three steps.<br />Total clarity.
              </h2>
            </div>
            <p className="text-sm max-w-xs leading-relaxed md:text-right" style={{ color: tk.muted }}>
              Most people don't fail because they lack discipline. They fail because they lack visibility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x"
            style={{ border: `1px solid ${tk.cardBorder}`, borderRadius: 16, overflow: "hidden" }}>
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="group relative p-10 cursor-default transition-all duration-300"
                style={{ background: tk.stepCardBg, borderColor: tk.cardBorder }}
                onMouseEnter={e => e.currentTarget.style.background = tk.cardHoverBg}
                onMouseLeave={e => e.currentTarget.style.background = tk.stepCardBg}
              >
                <div className="font-mono font-black leading-none select-none absolute top-6 right-8"
                  style={{ fontSize: 80, color: "rgba(34,113,240,0.07)" }}>
                  {step.number}
                </div>
                <div className="relative z-10">
                  <div className="w-11 h-11 rounded-lg flex items-center justify-center mb-8 transition-all"
                    style={{ border: "1px solid rgba(34,113,240,0.25)", background: "rgba(34,113,240,0.08)" }}>
                    <img className={`h-5 w-5 ${dark ? "brightness-0 invert opacity-60" : "opacity-75"}`} src={step.icon} alt={step.title} />
                  </div>
                  <h3 className="text-lg font-bold mb-3 tracking-tight" style={{ color: tk.fg }}>{step.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: tk.muted }}>{step.desc}</p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: "linear-gradient(90deg, transparent, #2271f0, #d006d4, transparent)" }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-28 px-6 relative overflow-hidden" style={{ borderTop: `1px solid rgba(208,6,212,0.1)` }}>
        <LineGrid />
        <GlowBlob style={{ width: 600, height: 400, background: dark ? "rgba(208,6,212,0.07)" : "rgba(208,6,212,0.05)", bottom: 0, right: -100 }} />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="mb-16">
            <p className="text-xs font-mono tracking-[0.3em] mb-4 uppercase" style={{ color: "#2271f0" }}>— Social proof</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight" style={{ fontFamily: "'Syne', system-ui", color: tk.fg }}>
              Real people.<br />
              <span style={{ color: tk.subtleHeading }}>Real results.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t_item, i) => (
              <motion.div
                key={t_item.name}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="group relative rounded-2xl p-8 flex flex-col gap-6 transition-all duration-300"
                style={{ border: `1px solid ${tk.cardBorder}`, background: tk.cardBg }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = tk.cardHoverBorder; e.currentTarget.style.background = tk.cardHoverBg; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = tk.cardBorder; e.currentTarget.style.background = tk.cardBg; }}
              >
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, j) => <span key={j} className="text-amber-500 text-sm">★</span>)}
                </div>
                <p className="text-sm leading-relaxed flex-1 font-light" style={{ color: tk.muted }}>"{t_item.quote}"</p>
                <div className="flex items-center gap-3 pt-4" style={{ borderTop: `1px solid ${tk.divider}` }}>
                  <div className="h-9 w-9 rounded-full flex items-center justify-center text-white text-xs font-bold font-mono shrink-0"
                    style={{ background: "linear-gradient(135deg, #2271f0, #d006d4)" }}>
                    {t_item.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: tk.fg }}>{t_item.name}</p>
                    <p className="text-xs" style={{ color: tk.faint }}>{t_item.role}</p>
                  </div>
                </div>
                <ArrowUpRight size={15} className="absolute top-7 right-7 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#2271f0" }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-36 px-6 relative overflow-hidden" style={{ borderTop: `1px solid ${tk.sectionBorder}` }}>
        <LineGrid />
        <GlowBlob style={{ width: 900, height: 500, background: dark ? "rgba(34,113,240,0.1)" : "rgba(34,113,240,0.07)", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
        <GlowBlob style={{ width: 500, height: 300, background: dark ? "rgba(208,6,212,0.08)" : "rgba(208,6,212,0.05)", top: "50%", left: "50%", transform: "translate(-10%,-60%)" }} />
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, #2271f0, #d006d4, #2271f0, transparent)", opacity: 0.6 }} />
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, #2271f0, #d006d4, #2271f0, transparent)", opacity: 0.6 }} />

        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-mono tracking-widest uppercase mb-10"
            style={{ border: "1px solid rgba(34,113,240,0.3)", background: "rgba(34,113,240,0.06)", color: "#4a8ff5" }}>
            <TrendingUp size={11} />
            Free to start · No credit card
          </div>
          <h2 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[0.9]"
            style={{ fontFamily: "'Syne', system-ui", color: tk.fg }}>
            Your finances.<br />
            <span style={{ background: "linear-gradient(90deg, #2271f0, #d006d4, #2271f0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Finally clear.
            </span>
          </h2>
          <p className="text-base mb-12 max-w-md mx-auto leading-relaxed" style={{ color: tk.muted }}>
            Join thousands already using Traco to take back control of their money.
          </p>
          <Link href="/Sign-up">
            <Button className="group inline-flex items-center gap-3 font-bold rounded-full px-10 py-6 text-base transition-all text-white"
              style={{ background: "linear-gradient(90deg, #2271f0, #d006d4)", boxShadow: "0 0 60px rgba(34,113,240,0.3), 0 0 30px rgba(208,6,212,0.15)" }}>
              Start Free Trial
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}