import { Sun, Moon, Calculator } from "lucide-react";
import { motion } from "framer-motion";

function Logo() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="34" height="34" rx="10" fill="url(#logoGrad)" />
      {/* IQ text */}
      <text x="17" y="23" fontFamily="system-ui, sans-serif" fontSize="15" fontWeight="900" textAnchor="middle" fill="white">IQ</text>
      {/* Green dot accent */}
      <circle cx="27" cy="8" r="4" fill="#10b981" />
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="34" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366f1"/>
          <stop offset="1" stopColor="#4338ca"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Navbar({ dark, setDark, onCalc }) {
  const bg = dark ? "rgba(7,7,14,0.88)" : "rgba(240,240,248,0.92)";
  const border = dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";

  return (
    <nav
      className="glass"
      style={{
        position: "sticky", top: 0, zIndex: 50,
        background: bg,
        borderBottom: `1px solid ${border}`,
        transition: "background 0.35s, border-color 0.35s",
      }}
    >
      <div style={{
        maxWidth: 1160, margin: "0 auto", padding: "0 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 62,
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <Logo />
          <div>
            <span style={{
              fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 17,
              color: dark ? "#fff" : "#0d0d1a", letterSpacing: "-0.6px",
              display: "block", lineHeight: 1.1,
            }}>
              VFSTR <span style={{ color: "#6366f1" }}>MarkIQ</span>
            </span>
            <span style={{ fontSize: 9.5, fontWeight: 600, color: dark ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.35)", letterSpacing: "0.6px", textTransform: "uppercase" }}>
              Internal Marks Calculator
            </span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {/* Free badge */}
          <div style={{
            padding: "4px 10px", borderRadius: 100,
            background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)",
            fontSize: 10, fontWeight: 700, color: "#10b981", letterSpacing: "0.3px",
            display: "flex", alignItems: "center", gap: 5,
          }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#10b981", animation: "pulse-glow 2s infinite" }} />

            FREE · OFFLINE · SAFE

          </div>

          <button
            onClick={onCalc}
            style={{
              padding: "6px 14px", borderRadius: 8,
              border: dark ? "1px solid rgba(255,255,255,0.09)" : "1px solid rgba(0,0,0,0.1)",
              background: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
              color: dark ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.6)",
              fontSize: 13, fontWeight: 500, cursor: "pointer",
              fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6,
            }}
          >
            <Calculator size={13} /> Calculator
          </button>

          {/* Theme toggle — pill with smooth animation */}
          <motion.button
            onClick={() => setDark(d => !d)}


            style={{
              width: 60, height: 32, borderRadius: 100, border: "none",
              background: dark
                ? "linear-gradient(135deg, #1a1a3e, #2a2a5e)"
                : "linear-gradient(135deg, #dde0ff, #c4caff)",
              cursor: "pointer", position: "relative",
              display: "flex", alignItems: "center",
              padding: "3px 4px",
              boxShadow: dark ? "inset 0 1px 4px rgba(0,0,0,0.6)" : "inset 0 1px 4px rgba(0,0,0,0.12)",
            }}
            title={dark ? "Switch to light mode" : "Switch to dark mode"}
          >
            <motion.div

              animate={{ x: dark ? 28 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
              style={{
                width: 26, height: 26, borderRadius: 100,
                background: dark
                  ? "linear-gradient(135deg, #6366f1, #4f46e5)"
                  : "linear-gradient(135deg, #fff, #f0f0ff)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: dark ? "0 2px 8px rgba(0,0,0,0.4)" : "0 2px 6px rgba(0,0,0,0.2)",
              }}
            >
              {dark
                ? <Moon size={13} color="#c4caff" />
                : <Sun size={13} color="#f59e0b" />}
            </motion.div>
          </motion.button>
        </div>
      </div>
    </nav>
  );
}
