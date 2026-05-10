import { motion } from "framer-motion";
import { ArrowRight, Zap, Shield, Sparkles } from "lucide-react";

export default function Hero({ dark, onScroll }) {
  const chips = [
    { s: "PRET", m: 10, sc: 6,  c: "#6366f1" },
    { s: "T1",   m: 20, sc: 8,  c: "#8b5cf6" },
    { s: "T2",   m: 5,  sc: 3,  c: "#06b6d4" },
    { s: "T3",   m: 5,  sc: 3,  c: "#10b981" },
    { s: "T4",   m: 20, sc: 20, c: "#f59e0b" },
    { s: "T5",   m: 20, sc: 20, c: "#f97316" },
  ];

  const pills = [
    { icon: <Zap size={11} />, label: "Instant Auto-detect", color: "#10b981" },
    { icon: <Shield size={11} />, label: "No Data Stored", color: "#6366f1" },
    { icon: <Sparkles size={11} />, label: "R22 Pattern", color: "#f59e0b" },
  ];

  return (
    <section
      style={{
        padding: "96px 20px 64px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient background glows */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        {/* Main centered glow */}
        <div style={{
          position: "absolute", top: "-5%", left: "50%",
          transform: "translateX(-50%)", width: 900, height: 500,
          background: dark
            ? "radial-gradient(ellipse, rgba(99,102,241,0.14) 0%, transparent 65%)"
            : "radial-gradient(ellipse, rgba(99,102,241,0.10) 0%, transparent 65%)",
        }} />
        {/* Floating orbs */}
        <div style={{
          position: "absolute", top: "15%", left: "8%",
          width: 240, height: 240, borderRadius: "50%",
          background: dark
            ? "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)",
          animation: "pulse-glow 5s ease-in-out infinite",
          filter: "blur(2px)",
        }} />
        <div style={{
          position: "absolute", top: "25%", right: "6%",
          width: 200, height: 200, borderRadius: "50%",
          background: dark
            ? "radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)",
          animation: "pulse-glow 6s ease-in-out infinite 2s",
          filter: "blur(2px)",
        }} />
        {/* Bottom accent */}
        <div style={{
          position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
          width: 600, height: 1,
          background: dark
            ? "linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent)"
            : "linear-gradient(90deg, transparent, rgba(99,102,241,0.2), transparent)",
        }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: "relative" }}
      >
        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.08 }}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 16px 6px 10px", borderRadius: 100,
            border: dark ? "1px solid rgba(99,102,241,0.35)" : "1px solid rgba(99,102,241,0.3)",
            background: dark ? "rgba(99,102,241,0.1)" : "rgba(99,102,241,0.07)",
            marginBottom: 28,
          }}
        >
          <div style={{
            width: 20, height: 20, borderRadius: 100,
            background: "linear-gradient(135deg, #6366f1, #4f46e5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 9, fontWeight: 900, color: "#fff", fontFamily: "var(--font-display)",
          }}>
            IQ
          </div>
          <span style={{ fontSize: 11, color: "#818cf8", fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase" }}>
            VFSTR Vadlamudi — R22 Revised Pattern
          </span>
        </motion.div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(32px, 5.5vw, 62px)", fontWeight: 900,
            color: dark ? "#fff" : "#0d0d1a",
            lineHeight: 1.05, margin: "0 0 20px",
          }}
        >
          Know Your Marks
          <br />
          <span className="hero-gradient-text">Before Results Drop</span>
        </h1>

        <p
          style={{
            fontSize: "clamp(15px, 2vw, 18px)",
            color: dark ? "rgba(255,255,255,0.48)" : "rgba(0,0,0,0.52)",
            maxWidth: 520, margin: "0 auto 40px", lineHeight: 1.75,
            fontWeight: 400,
          }}
        >
          Paste your marks from the VFSTR portal — subjects & scores are
          detected in seconds. Every module, every target, calculated precisely.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 40 }}>
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: "0 10px 40px rgba(99,102,241,0.5)" }}
            whileTap={{ scale: 0.97 }}
            onClick={onScroll}
            style={{
              padding: "14px 32px", borderRadius: 12,
              background: "linear-gradient(135deg, #6366f1, #4f46e5)",
              color: "#fff", fontWeight: 700, fontSize: 15, border: "none",
              cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8,
              boxShadow: "0 6px 28px rgba(99,102,241,0.4)",
              fontFamily: "var(--font-display)", letterSpacing: "-0.2px",
              transition: "all 0.2s",
            }}
          >
            Calculate Now <ArrowRight size={16} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={onScroll}
            style={{
              padding: "14px 24px", borderRadius: 12,
              background: "transparent",
              color: dark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.55)",
              fontWeight: 600, fontSize: 15,
              border: dark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(0,0,0,0.12)",
              cursor: "pointer", fontFamily: "var(--font-body)",
              transition: "all 0.2s",
            }}
          >
            Paste from Portal
          </motion.button>
        </div>

        {/* Trust pills */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: 56 }}
        >
          {pills.map((p, i) => (
            <div key={i} style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              padding: "5px 12px", borderRadius: 100,
              background: `${p.color}12`, border: `1px solid ${p.color}28`,
              fontSize: 11, fontWeight: 600, color: p.color,
            }}>
              {p.icon} {p.label}
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Formula chips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        style={{
          display: "flex", gap: 8, justifyContent: "center",
          flexWrap: "wrap", position: "relative",
        }}
      >
        <div style={{
          position: "absolute", inset: "-12px -20px",
          background: dark
            ? "radial-gradient(ellipse, rgba(99,102,241,0.06) 0%, transparent 70%)"
            : "radial-gradient(ellipse, rgba(99,102,241,0.04) 0%, transparent 70%)",
          borderRadius: 24, pointerEvents: "none",
        }} />
        {chips.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.38 + i * 0.07 }}
            style={{
              padding: "10px 16px", borderRadius: 13,
              background: dark ? "rgba(255,255,255,0.045)" : "rgba(255,255,255,0.9)",
              border: dark
                ? `1px solid rgba(255,255,255,0.09)`
                : `1px solid rgba(0,0,0,0.07)`,
              display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
              boxShadow: dark ? `0 0 0 1px ${t.c}22 inset` : `0 2px 10px rgba(0,0,0,0.07)`,
              backdropFilter: "blur(10px)",
              minWidth: 60,
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 900, color: t.c, fontFamily: "var(--font-display)", letterSpacing: "-0.3px" }}>{t.s}</span>
            <span style={{ fontSize: 10, color: dark ? "rgba(255,255,255,0.32)" : "rgba(0,0,0,0.38)", fontFamily: "var(--font-mono)", whiteSpace: "nowrap" }}>
              {t.m} → {t.sc}
            </span>
          </motion.div>
        ))}

        {/* Total chip */}
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.38 + chips.length * 0.07 }}
          style={{
            padding: "10px 16px", borderRadius: 13,
            background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(79,70,229,0.08))",
            border: "1px solid rgba(99,102,241,0.3)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            minWidth: 60,
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 900, color: "#6366f1", fontFamily: "var(--font-display)" }}>Σ 60</span>
          <span style={{ fontSize: 10, color: dark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)", fontFamily: "var(--font-mono)" }}>per mod</span>
        </motion.div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
        onClick={onScroll}
        style={{ marginTop: 44, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          style={{
            width: 28, height: 44, borderRadius: 14,
            border: dark ? "1.5px solid rgba(255,255,255,0.12)" : "1.5px solid rgba(0,0,0,0.12)",
            display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 8,
          }}
        >
          <div style={{
            width: 4, height: 8, borderRadius: 2,
            background: dark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)",
            animation: "float 2s ease-in-out infinite",
          }} />
        </motion.div>
      </motion.div>
    </section>
  );
}
