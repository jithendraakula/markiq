// ── Dynamically load an external script (cached) ──────────────────
export function loadScript(src) {
  return new Promise((res, rej) => {
    if (document.querySelector(`script[src="${src}"]`)) return res();
    const s = document.createElement("script");
    s.src = src;
    s.onload = res;
    s.onerror = rej;
    document.head.appendChild(s);
  });
}

// ── OCR an image file using Tesseract.js ──────────────────────────
export async function ocrImage(file, onProgress) {
  await loadScript("https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js");
  const { createWorker } = window.Tesseract;
  const worker = await createWorker("eng", 1, {
    logger: m => {
      if (m.status === "recognizing text")
        onProgress(Math.round(m.progress * 100));
    },
  });
  const url = URL.createObjectURL(file);
  const { data: { text } } = await worker.recognize(url);
  await worker.terminate();
  URL.revokeObjectURL(url);
  return text;
}

// ── Extract structured text from a PDF using pdf.js ───────────────
// Improved: uses tighter y-clustering, lower xRange threshold for
// portal PDFs, and joins short fragments on same y-row as plain text.
export async function extractPDFText(file, onProgress) {
  await loadScript("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js");
  const pdfjsLib = window.pdfjsLib;
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

  const buf = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
  const allLines = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const vp = page.getViewport({ scale: 1.5 }); // higher scale = better text position accuracy
    const content = await page.getTextContent();

    // Group items by y-position — cluster within 5pt
    const rowMap = {};
    for (const item of content.items) {
      const str = item.str.trim();
      if (!str) continue;
      // Use scale-adjusted y, rounded to 5pt bands
      const y = Math.round((vp.height - item.transform[5] * 1.5) / 5) * 5;
      if (!rowMap[y]) rowMap[y] = [];
      rowMap[y].push({ x: item.transform[4] * 1.5, str });
    }

    // Sort rows top-to-bottom, process each
    const sortedYs = Object.keys(rowMap).map(Number).sort((a, b) => a - b);
    for (const y of sortedYs) {
      const items = rowMap[y].sort((a, b) => a.x - b.x);
      const strs = items.map(it => it.str);

      if (items.length > 1) {
        const xRange = items[items.length - 1].x - items[0].x;
        // Portal tables often have cols ~40px apart
        if (xRange > 40) {
          allLines.push(strs.join("\t"));
          continue;
        }
      }
      allLines.push(strs.join(" "));
    }
    onProgress(Math.round((i / pdf.numPages) * 100));
  }

  const raw = allLines.join("\n");

  // Post-process: merge lines that look like split subject codes
  // e.g. "MA" on one line, "3251" on next → "MA3251"
  const lines = raw.split("\n");
  const merged = [];
  for (let j = 0; j < lines.length; j++) {
    const cur = lines[j].trim();
    const next = j + 1 < lines.length ? lines[j + 1].trim() : "";
    // If current is short code fragment AND next continues it (no tabs), merge
    if (
      /^[A-Z]{1,3}\d{0,2}$/.test(cur) &&
      /^\d{3,5}$/.test(next)
    ) {
      merged.push(cur + next);
      j++;
    } else {
      merged.push(cur);
    }
  }

  return merged.join("\n");
}
