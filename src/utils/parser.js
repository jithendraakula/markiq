import { emptySubject } from "./marks";
import { TARGETS } from "./constants";

// ── Extract reg number ─────────────────────────────────────────────
export function extractRegNo(raw) {
  const lines = raw.split(/\r?\n/);

  for (const line of lines) {
    const t = line.trim();

    const m = t.match(/\b(\d{2,3}[A-Z]{1,3}\d{2}[A-Z0-9]\d{3,4})\b/);

    if (m) return m[1];

    const mb = t.match(/\[(\d{2,3}[A-Z]{1,3}\d{2}[A-Z0-9]\d{3,4})\]/);

    if (mb) return mb[1];
  }

  return "";
}

// ── Extract student name ───────────────────────────────────────────
export function extractStudentName(raw) {
  const lines = raw.split(/\r?\n/);

  const stopWords =
    /^(module|subject|target|marks|score|total|internal|semester|exam|sno|s\.no|roll|reg|branch|section|year|batch|course|grade|attendance|result|intra|academic|college|university|vfstr|vignan)/i;

  for (const line of lines) {
    const t = line.trim();

    const m = t.match(
      /([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,4})\s*\[[\w\d]+\]/
    );

    if (m) {
      const candidate = m[1].trim();

      if (
        !stopWords.test(candidate) &&
        candidate.split(" ").length >= 2
      ) {
        return candidate;
      }
    }
  }

  return "";
}

// ── VFSTR table parser ─────────────────────────────────────────────
export function parseVFSTRTable(raw) {
  const lines = raw.split(/\r?\n/).filter(l => l.trim());

  const looksLikeCode = c =>
    c.length >= 1 &&
    c.length <= 15 &&
    /^[\w&/\-\s]+$/.test(c) &&
    !/^(module|pret|t[1-5]|r22|review|\d+)$/i.test(c);

  let headerIdx = -1;
  let subjectNames = [];

  for (let i = 0; i < lines.length; i++) {
    const parts = lines[i].split("\t");

    if (parts.length < 3) continue;

    const allCols = parts.map(p => p.trim()).filter(Boolean);

    if (allCols.every(looksLikeCode) && allCols.length >= 3) {
      headerIdx = i;
      subjectNames = allCols;
      break;
    }
  }

  if (headerIdx === -1 || subjectNames.length === 0) {
    return null;
  }

  const result = [];

  subjectNames.forEach((name, idx) => {
    const subj = emptySubject(Date.now() + idx, name);

    result.push(subj);
  });

  return result.length ? result : null;
}

// ── Fallback parser ────────────────────────────────────────────────
export function parseTextFallback(raw) {
  const lines = raw
    .split(/\n/)
    .map(l => l.trim())
    .filter(Boolean);

  const subjects = [];

  let cur = null;

  const subjectRe = /^([A-Za-z][A-Za-z\s/&-]{2,40})$/;

  const numRe = /(\d+(?:\.\d+)?)/;

  const kw = {
    pret: /pre[\s-]?target|pret/i,
    t1: /target[\s-]?1|t[\s-]?1\b/i,
    t2: /target[\s-]?2|t[\s-]?2\b/i,
    t3: /target[\s-]?3|t[\s-]?3\b/i,
    t4: /target[\s-]?4|t[\s-]?4\b/i,
    t5: /target[\s-]?5|t[\s-]?5\b/i,
  };

  const modKw = /module[\s-]?([12])/i;

  let activeModule = "m1";

  for (const line of lines) {
    const modMatch = line.match(modKw);

    if (modMatch) {
      activeModule = modMatch[1] === "2" ? "m2" : "m1";

      continue;
    }

    const numMatch = line.match(numRe);

    const val = numMatch ? parseFloat(numMatch[1]) : null;

    const isKw = Object.values(kw).some(r => r.test(line));

    if (!numMatch && !isKw && subjectRe.test(line)) {
      cur = emptySubject(
        Date.now() + subjects.length,
        line
      );

      subjects.push(cur);

      activeModule = "m1";

      continue;
    }

    if (!cur) {
      cur = emptySubject(Date.now(), "Subject 1");

      subjects.push(cur);
    }

    if (val === null) continue;

    for (const [k, re] of Object.entries(kw)) {
      if (re.test(line) && cur[activeModule][k] === "") {
        const t = TARGETS.find(t => t.key === k);

        cur[activeModule][k] = String(
          Math.min(val, t.max)
        );

        break;
      }
    }
  }

  return subjects.length ? subjects : null;
}

// ── Unified parser ────────────────────────────────────────────────
export function parseText(raw) {
  const studentName = extractStudentName(raw);

  const regNo = extractRegNo(raw);

  if (raw.includes("\t")) {
    const tableResult = parseVFSTRTable(raw);

    if (tableResult) {
      return {
        subjects: tableResult,
        studentName,
        regNo,
      };
    }
  }

  const fallback = parseTextFallback(raw);

  if (fallback) {
    return {
      subjects: fallback,
      studentName,
      regNo,
    };
  }

  return null;
}