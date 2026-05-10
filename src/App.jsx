import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";

import Navbar            from "./components/Navbar";
import Hero              from "./components/Hero";
import MethodBar         from "./components/MethodBar";
import PastePanel        from "./components/PastePanel";
import UploadPanel       from "./components/UploadPanel";
import DetectedPreview   from "./components/DetectedPreview";
import SubjectCountModal from "./components/SubjectCountModal";
import SubjectRow, { SubjectHintBanner } from "./components/SubjectRow";
import SummaryPanel      from "./components/SummaryPanel";
import ExportBar         from "./components/ExportBar";
import EmptyState        from "./components/EmptyState";
import FormulaReference  from "./components/FormulaReference";

import { emptySubject } from "./utils/marks";

export default function App() {
  const [dark, setDark]               = useState(true);
  const [subjects, setSubjects]       = useState([]);
  const [showModal, setShowModal]     = useState(false);
  const [method, setMethod]           = useState("paste");
  const [studentName, setStudentName] = useState("");
  const [regNo, setRegNo]             = useState("");
  const [preview, setPreview]         = useState(null);
  const [hintDismissed, setHintDismissed] = useState(false);
  const [openBreakdownId, setOpenBreakdownId] = useState(null);

  const calcRef  = useRef(null);
  const applyRef = useRef(null);

  // Smooth theme transition
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("theme-transitioning");
    if (dark) {
      root.setAttribute("data-theme", "dark");
      root.style.colorScheme = "dark";
    } else {
      root.setAttribute("data-theme", "light");
      root.style.colorScheme = "light";
    }
    document.body.style.background = dark ? "#07070e" : "#f0f0f8";
    document.body.style.color      = dark ? "#ffffff" : "#0d0d1a";
    const t = setTimeout(() => root.classList.remove("theme-transitioning"), 400);
    return () => clearTimeout(t);
  }, [dark]);

  function updateSubject(id, mod, key, val) {
    setSubjects(prev =>
      prev.map(s => {
        if (s.id !== id) return s;
        if (mod === "name") return { ...s, name: val };
        return { ...s, [mod]: { ...s[mod], [key]: val } };
      })
    );
  }

  function addSubject() {
    setSubjects(prev => [...prev, emptySubject(Date.now(), "")]);
  }

  function removeSubject(id) {
    setSubjects(prev => prev.filter(s => s.id !== id));
  }

  function onDetected(result) {
    setPreview(result.subjects);
    if (result.studentName) setStudentName(result.studentName);
    if (result.regNo)       setRegNo(result.regNo);
  }

  function applyPreview(subs) {
    setSubjects(subs.map((s, i) => ({ ...s, id: s.id || Date.now() + i })));
    setPreview(null);
    setTimeout(() => calcRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  }

  function handleModalConfirm(n) {
    setSubjects(Array.from({ length: n }, (_, i) => emptySubject(Date.now() + i, "")));
    setShowModal(false);
    setTimeout(() => calcRef.current?.scrollIntoView({ behavior: "smooth" }), 150);
  }

  const bg        = dark ? "#07070e" : "#f0f0f8";
  const text      = dark ? "#fff"    : "#0d0d1a";
  const borderCol = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)";
  const inputBg   = dark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.95)";
  const labelCol  = dark ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.45)";
  const showInputSection = subjects.length === 0 || preview != null;

  return (
    <div style={{
      minHeight: "100vh", background: bg, color: text,
      fontFamily: "'DM Sans','Cabinet Grotesk',sans-serif",
      transition: "background 0.35s cubic-bezier(.4,0,.2,1), color 0.35s",
    }}>

      <AnimatePresence>
        {showModal && <SubjectCountModal dark={dark} onConfirm={handleModalConfirm} />}
      </AnimatePresence>

      <Navbar dark={dark} setDark={setDark} onCalc={() => calcRef.current?.scrollIntoView({ behavior: "smooth" })} />
      <Hero dark={dark} onScroll={() => calcRef.current?.scrollIntoView({ behavior: "smooth" })} />

      <section ref={calcRef} style={{ maxWidth: 980, margin: "0 auto", padding: "0 20px 80px" }}>

        {/* Student info */}
        <div style={{ display: "flex", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
          <div style={{ flex: "2 1 220px" }}>
            <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: labelCol, letterSpacing: "0.7px", textTransform: "uppercase", marginBottom: 6 }}>
              Student Name
            </label>
            <input
              value={studentName} onChange={e => setStudentName(e.target.value)}
              placeholder="Auto-detected or type here…"
              style={{ padding: "10px 14px", borderRadius: 10, border: `1px solid ${borderCol}`, background: inputBg, color: text, fontSize: 14, fontFamily: "inherit", outline: "none", width: "100%", transition: "background 0.3s, border 0.3s, color 0.3s" }}
            />
          </div>
          <div style={{ flex: "1 1 140px" }}>
            <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: labelCol, letterSpacing: "0.7px", textTransform: "uppercase", marginBottom: 6 }}>
              Reg No.
            </label>
            <input
              value={regNo} onChange={e => setRegNo(e.target.value)}
              placeholder="e.g. 241FA04508"
              style={{ padding: "10px 14px", borderRadius: 10, border: `1px solid ${borderCol}`, background: inputBg, color: text, fontSize: 14, fontFamily: "'JetBrains Mono',monospace", outline: "none", width: "100%", transition: "background 0.3s, border 0.3s, color 0.3s", letterSpacing: "0.5px" }}
            />
          </div>
        </div>

        {/* Input panel */}
        {showInputSection ? (
          <>
            <MethodBar method={method} setMethod={setMethod} dark={dark} />
            {method === "paste" && <PastePanel dark={dark} onDetected={onDetected} />}
            {method === "upload" && <UploadPanel dark={dark} onDetected={onDetected} />}
            {method === "manual" && subjects.length === 0 && (
              <div style={{ marginBottom: 16 }}>
                <button
                  onClick={() => setSubjects([emptySubject(Date.now(), "")])}
                  style={{ padding: "9px 18px", borderRadius: 8, background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)", color: "#6366f1", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 6 }}
                >
                  + Start with blank subject
                </button>
              </div>
            )}
          </>
        ) : (
          <div style={{ marginBottom: 16 }}>
            <button
              onClick={() => { setSubjects([]); setPreview(null); setMethod("paste"); }}
              style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid rgba(99,102,241,0.25)", background: "rgba(99,102,241,0.07)", color: "#6366f1", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              ← Enter new marks
            </button>
          </div>
        )}

        <AnimatePresence>
          {preview && (
            <DetectedPreview subjects={preview} dark={dark} onConfirm={applyPreview} onDiscard={() => setPreview(null)} applyRef={applyRef} />
          )}
        </AnimatePresence>

        <SummaryPanel subjects={subjects} dark={dark} onSubjectClick={id => setOpenBreakdownId(id)} />

        <AnimatePresence>
          {subjects.length === 0 ? (
            <EmptyState key="empty" dark={dark} onAdd={addSubject} />
          ) : (
            <>
              <SubjectHintBanner dark={dark} dismissed={hintDismissed} onDismiss={() => setHintDismissed(true)} />
              {subjects.map((s, i) => (
                <SubjectRow
                  key={s.id} subj={s} idx={i} dark={dark}
                  onChange={(mod, key, val) => updateSubject(s.id, mod, key, val)}
                  onRemove={() => removeSubject(s.id)}
                  openBreakdown={openBreakdownId === s.id}
                  onBreakdownOpened={() => setOpenBreakdownId(null)}
                />
              ))}
            </>
          )}
        </AnimatePresence>

        {subjects.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
            onClick={addSubject}
            style={{ width: "100%", padding: "11px", borderRadius: 11, border: dark ? "2px dashed rgba(99,102,241,0.28)" : "2px dashed rgba(99,102,241,0.3)", background: "transparent", color: "#6366f1", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 4, transition: "all 0.2s" }}
          >
            <Plus size={15} /> Add Subject
          </motion.button>
        )}

        <ExportBar subjects={subjects} studentName={studentName} regNo={regNo} dark={dark} />
        <FormulaReference dark={dark} />

        <div style={{ marginTop: 16, textAlign: "center" }}>
          <button
            onClick={() => setShowModal(true)}
            style={{ padding: "7px 16px", borderRadius: 8, border: `1px solid ${borderCol}`, background: "transparent", color: dark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.35)", fontSize: 12, cursor: "pointer", fontFamily: "inherit", transition: "all 0.25s" }}
          >
            ↺ Change number of subjects
          </button>
        </div>
      </section>

      <footer style={{ borderTop: `1px solid ${borderCol}`, padding: "28px 20px", background: dark ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.02)" }}>
        <div style={{ maxWidth: 980, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 8 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontSize: 14, fontWeight: 700, color: dark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.55)", fontFamily: "'Sora',sans-serif" }}>
              VFSTR MarkIQ
            </span>
          </div>
          <p style={{ fontSize: 11, color: dark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.3)", margin: "0 0 8px" }}>
            R22 Revised Pattern · 100% Free · No API · No Data Sent · Runs entirely in your browser
          </p>
          <p style={{ fontSize: 12, color: dark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.4)", margin: 0 }}>
            Built with ♥ by <span style={{ fontWeight: 700, color: "#6366f1" }}>Jithendra Akula</span>
          </p>
        </div>
      </footer>
    </div>
  );

}

