"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import JSZip from "jszip";
import { rentalContractApi } from "@/lib/api/rental-contract";
import { toastError } from "@/components/ui/toast-provider";
import { getErrorMessage } from "@/lib/utils/error-message";

interface ContractPreviewProps {
  rentalId?: string;
  driverId?: string;
  vehicleId?: string;
  driverLabel?: string;
  vehicleLabel?: string;
  startDate?: string;
  endDate?: string;
  duration?: number;
  dailyRate?: number;
  rentalDuration?: string;
  rentalService?: string;
}

const ZOOM_MIN = 0.25;
const ZOOM_MAX = 2.5;
const ZOOM_STEP = 0.1;

const clampZoom = (value: number) =>
  Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Math.round(value * 100) / 100));

// docx-preview menulis lebar halaman memakai satuan pt (11900 twips = 595pt),
// jadi harus dikonversi ke px (96dpi) sebelum dipakai untuk hitung fit.
const toPx = (value: number, unit: string) => {
  switch (unit) {
    case "pt":
      return (value * 96) / 72;
    case "cm":
      return (value * 96) / 2.54;
    case "mm":
      return (value * 96) / 25.4;
    case "in":
      return value * 96;
    default:
      return value;
  }
};

const measureWidthPx = (el: HTMLElement) => {
  const inline = el.style.width;
  if (inline) {
    const value = parseFloat(inline);
    if (!Number.isNaN(value)) {
      const unit = inline.replace(/[-\d.]/g, "").trim();
      return toPx(value, unit);
    }
  }
  return el.offsetWidth;
};

const WORDPROCESSING_NS =
  "http://schemas.openxmlformats.org/wordprocessingml/2006/main";

const directChild = (parent: Element, localName: string): Element | null => {
  for (const child of Array.from(parent.children)) {
    if (child.localName === localName) return child;
  }
  return null;
};

// docx-preview hanya mendukung kolom dengan lebar sama dan mengabaikan
// `w:col w:w`/`w:space` pada `w:cols`. Template kontrak justru memakai trik
// "2 kolom" (kolom pertama sangat sempit) untuk membuat indent. Ambil offset
// kolom pertama supaya bisa dipindahkan ke indent kiri paragraf.
const columnOffset = (sectPr: Element): number => {
  const cols = directChild(sectPr, "cols");
  if (!cols) return 0;

  const colElements = Array.from(cols.children).filter(
    (child) => child.localName === "col",
  );
  if (colElements.length < 2) return 0;

  const first = colElements[0];
  const width = parseInt(
    first.getAttributeNS(WORDPROCESSING_NS, "w") ?? "0",
    10,
  );
  const space = parseInt(
    first.getAttributeNS(WORDPROCESSING_NS, "space") ?? "0",
    10,
  );
  const offset =
    (Number.isFinite(width) ? width : 0) + (Number.isFinite(space) ? space : 0);
  return offset > 0 ? offset : 0;
};

const addLeftIndent = (paragraph: Element, offset: number) => {
  let pPr = directChild(paragraph, "pPr");
  if (!pPr) {
    pPr = paragraph.ownerDocument.createElementNS(WORDPROCESSING_NS, "w:pPr");
    paragraph.insertBefore(pPr, paragraph.firstChild);
  }

  let ind = directChild(pPr, "ind");
  if (!ind) {
    ind = paragraph.ownerDocument.createElementNS(WORDPROCESSING_NS, "w:ind");
    pPr.appendChild(ind);
  }

  const current = parseInt(
    ind.getAttributeNS(WORDPROCESSING_NS, "left") ?? "0",
    10,
  );
  const left = (Number.isFinite(current) ? current : 0) + offset;
  ind.setAttributeNS(WORDPROCESSING_NS, "w:left", String(left));
};

const setParagraphAlignment = (paragraph: Element, value: string) => {
  let pPr = directChild(paragraph, "pPr");
  if (!pPr) {
    pPr = paragraph.ownerDocument.createElementNS(WORDPROCESSING_NS, "w:pPr");
    paragraph.insertBefore(pPr, paragraph.firstChild);
  }

  let jc = directChild(pPr, "jc");
  if (!jc) {
    jc = paragraph.ownerDocument.createElementNS(WORDPROCESSING_NS, "w:jc");
    pPr.appendChild(jc);
  }
  jc.setAttributeNS(WORDPROCESSING_NS, "w:val", value);
};

// `firstLine` menggeser baris pertama, bikin judul yang dirata-tengah jadi
// tidak pas di tengah.
const clearFirstLineIndent = (paragraph: Element) => {
  const pPr = directChild(paragraph, "pPr");
  const ind = pPr ? directChild(pPr, "ind") : null;
  if (!ind) return;

  for (const attribute of Array.from(ind.attributes)) {
    if (
      attribute.localName === "firstLine" ||
      attribute.localName === "hanging"
    ) {
      ind.removeAttributeNode(attribute);
    }
  }
};

const AYAT_LABEL_RE = /^ayat\s*\d+$/i;
const PASAL_HEADING_RE = /^pasal\s+\d+/i;
const PASAL_LABEL_RE = /^pasal\s+\d+$/i;

const paragraphText = (paragraph: Element): string => {
  const parts: string[] = [];
  for (const textNode of Array.from(
    paragraph.getElementsByTagNameNS(WORDPROCESSING_NS, "t"),
  )) {
    parts.push(textNode.textContent ?? "");
  }
  return parts.join("");
};

// Baris judul = pendek dan tidak diakhiri tanda titik, mis. "PASAL 5" atau
// "HAK DAN TANGGUNG JAWAB KEDUA PIHAK".
const isHeadingLine = (value: string) =>
  value.length > 0 && value.length < 80 && !/[.!?]$/.test(value);

const renamePasalLabelToAyat = (paragraph: Element) => {
  for (const textNode of Array.from(
    paragraph.getElementsByTagNameNS(WORDPROCESSING_NS, "t"),
  )) {
    const value = textNode.textContent ?? "";
    if (/pasal/i.test(value)) {
      textNode.textContent = value.replace(/pasal/i, "Ayat");
      return;
    }
  }
};

// Rapikan isi template khusus untuk preview:
//  1. "Ayat N" yang nyasar di ATAS judul pasal dipindah ke bawah judul
//     (sebelum paragraf isi pasal pertama), sesuai pola pasal lain.
//  2. Label keliru "Pasal N" (seharusnya "Ayat N") diperbaiki tulisannya.
const fixAyatPlacement = (body: Element) => {
  const nodes = Array.from(body.children);
  const isParagraph = (node: Element) => node.localName === "p";

  const nextContentIndex = (from: number) => {
    for (let index = from; index < nodes.length; index++) {
      const node = nodes[index];
      if (!isParagraph(node)) return index;
      if (paragraphText(node).trim() !== "") return index;
    }
    return -1;
  };

  for (let index = 0; index < nodes.length; index++) {
    const node = nodes[index];
    if (!isParagraph(node)) continue;

    const value = paragraphText(node).trim();

    if (AYAT_LABEL_RE.test(value)) {
      // Semua label ayat rata kiri.
      setParagraphAlignment(node, "left");

      const nextIndex = nextContentIndex(index + 1);
      if (nextIndex === -1) continue;

      const next = nodes[nextIndex];
      if (!isParagraph(next)) continue;
      if (!PASAL_HEADING_RE.test(paragraphText(next).trim())) continue;

      // Cari paragraf isi pertama setelah blok judul pasal.
      let bodyIndex = -1;
      for (let cursor = nextIndex; cursor < nodes.length; cursor++) {
        const candidate = nodes[cursor];
        if (!isParagraph(candidate)) {
          bodyIndex = cursor;
          break;
        }
        const candidateText = paragraphText(candidate).trim();
        if (candidateText === "") continue;
        if (cursor === nextIndex || isHeadingLine(candidateText)) continue;
        bodyIndex = cursor;
        break;
      }
      if (bodyIndex === -1) continue;

      body.insertBefore(node, nodes[bodyIndex]);
      continue;
    }

    if (PASAL_LABEL_RE.test(value)) {
      const nextIndex = nextContentIndex(index + 1);
      if (nextIndex === -1) continue;

      const next = nodes[nextIndex];
      if (!isParagraph(next)) continue;
      // Kalau baris berikutnya bukan judul, berarti ini label ayat yang salah tulis.
      if (isHeadingLine(paragraphText(next).trim())) continue;

      renamePasalLabelToAyat(node);
      setParagraphAlignment(node, "left");
    }
  }
};

// Judul pasal + sub-judulnya (mis. "PASAL 8" / "PELANGGARAN DARI PIHAK KEDUA")
// dirata-tengah, sisanya (label ayat & isi) tetap rata kiri.
const centerPasalHeadings = (body: Element) => {
  const nodes = Array.from(body.children);

  for (let index = 0; index < nodes.length; index++) {
    const node = nodes[index];
    if (node.localName !== "p") continue;
    if (!PASAL_HEADING_RE.test(paragraphText(node).trim())) continue;

    setParagraphAlignment(node, "center");
    clearFirstLineIndent(node);

    // Lanjutkan ke sub-judul pasal selama masih baris judul (bukan ayat/isi).
    for (let cursor = index + 1; cursor < nodes.length; cursor++) {
      const candidate = nodes[cursor];
      if (candidate.localName !== "p") break;

      const candidateText = paragraphText(candidate).trim();
      if (candidateText === "") break;
      if (AYAT_LABEL_RE.test(candidateText)) break;
      if (!isHeadingLine(candidateText)) break;

      setParagraphAlignment(candidate, "center");
      clearFirstLineIndent(candidate);
    }
  }
};

// Menyiapkan salinan .docx khusus untuk preview: hapus section break paragraf
// (penyebab halaman kosong), ratakan kolom dengan memindahkan offset kolom ke
// indent paragraf, dan rapikan posisi label "Ayat". Blob asli tetap dipakai
// untuk tombol unduh.
const normalizeDocxForPreview = async (
  buffer: ArrayBuffer,
): Promise<Uint8Array> => {
  const zip = await JSZip.loadAsync(buffer);
  const documentFile = zip.file("word/document.xml");
  if (!documentFile) return new Uint8Array(buffer);

  const xml = await documentFile.async("string");
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  const body = doc.getElementsByTagNameNS(WORDPROCESSING_NS, "body")[0];
  if (!body) return new Uint8Array(buffer);

  // Pindahkan label "Ayat" lebih dulu: setelah pindah, label berada di section
  // 1 kolom berikutnya sehingga tidak kena offset kolom (tetap rata kiri).
  fixAyatPlacement(body);

  const children = Array.from(body.children);
  const sectionBreaks: Element[] = [];
  let sectionStart = 0;

  for (let index = 0; index < children.length; index++) {
    const child = children[index];
    if (child.localName !== "p") continue;

    const pPr = directChild(child, "pPr");
    const sectPr = pPr ? directChild(pPr, "sectPr") : null;
    if (!sectPr) continue;

    const offset = columnOffset(sectPr);
    if (offset > 0) {
      for (let cursor = sectionStart; cursor <= index; cursor++) {
        const paragraph = children[cursor];
        if (paragraph.localName === "p") addLeftIndent(paragraph, offset);
      }
    }

    sectionBreaks.push(sectPr);
    sectionStart = index + 1;
  }

  for (const sectPr of sectionBreaks) {
    sectPr.parentNode?.removeChild(sectPr);
  }

  // Judul pasal rata tengah (offset kolom di atas membuat area judul tepat di
  // tengah halaman), label ayat & isi dibiarkan rata kiri.
  centerPasalHeadings(body);

  let output = new XMLSerializer().serializeToString(doc);
  if (!output.startsWith("<?xml")) {
    output = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r\n${output}`;
  }

  zip.file("word/document.xml", output);
  return zip.generateAsync({ type: "uint8array", compression: "DEFLATE" });
};

const ContractPreview = ({
  rentalId,
  driverId,
  vehicleId,
  driverLabel,
  vehicleLabel,
  startDate,
  endDate,
  duration,
  dailyRate,
  rentalDuration,
  rentalService,
}: ContractPreviewProps) => {
  const bodyRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  // Lebar halaman (px) dari dokumen yang dirender, dipakai untuk auto-fit.
  const pageWidthRef = useRef<number | null>(null);
  const urlRef = useRef<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [hasPreview, setHasPreview] = useState(false);
  // Nomor penanda untuk memicu ulang preview saat pengguna menekan "Coba lagi".
  const [retryToken, setRetryToken] = useState(0);
  // Nama file unduhan dari backend (ikut kode rental / rental_number).
  const [downloadName, setDownloadName] = useState("kontrak-sewa.docx");
  // Zoom dokumen preview (1 = 100%). Nilai awal = skala fit agar seluruh
  // halaman A4 langsung terlihat utuh di dalam kolom preview.
  const [zoom, setZoom] = useState(1);
  const [fitScale, setFitScale] = useState(1);

  // Hitung skala supaya lebar halaman pas di kontainer (tidak melebihi 100%).
  const computeFit = useCallback(() => {
    const container = scrollRef.current;
    const pageWidth = pageWidthRef.current;
    if (!container || !pageWidth) return;

    const styles = window.getComputedStyle(container);
    const available =
      container.clientWidth -
      (parseFloat(styles.paddingLeft) || 0) -
      (parseFloat(styles.paddingRight) || 0);
    if (available <= 0) return;

    const scale = clampZoom(Math.min(1, available / pageWidth));
    setFitScale(scale);
    setZoom(scale);
  }, []);

  const handleZoomOut = () => setZoom((value) => clampZoom(value - ZOOM_STEP));
  const handleZoomIn = () => setZoom((value) => clampZoom(value + ZOOM_STEP));
  // Kembalikan ke ukuran pas kontainer (bukan 100% mentah).
  const handleZoomReset = () => setZoom(fitScale);

  const isReady = Boolean(driverId && vehicleId && startDate && endDate);

  const releaseUrl = useCallback(() => {
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
    setPreviewUrl(null);
  }, []);

  useEffect(() => {
    if (!isReady) {
      releaseUrl();
      setHasPreview(false);
      setError("");
      if (bodyRef.current) bodyRef.current.innerHTML = "";
      return;
    }

    let cancelled = false;
    let createdUrl: string | null = null;
    let adopted = false;

    setLoading(true);
    setError("");

    const timer = window.setTimeout(async () => {
      try {
        const { blob, filename } = await rentalContractApi.getPreview({
          driver_id: driverId,
          vehicle_id: vehicleId,
          rental_id: rentalId,
          start_date: startDate,
          end_date: endDate,
          total_duration: duration,
          daily_rate: dailyRate,
          rental_duration: rentalDuration || undefined,
          rental_service: rentalService || undefined,
        });

        if (cancelled) return;

        const buffer = await blob.arrayBuffer();

        // Salinan khusus preview; kalau gagal, pakai buffer asli.
        let previewBuffer: ArrayBuffer | Uint8Array = buffer;
        try {
          previewBuffer = await normalizeDocxForPreview(buffer);
        } catch {
          previewBuffer = buffer;
        }

        const { renderAsync } = await import("docx-preview");
        if (cancelled || !bodyRef.current) return;

        bodyRef.current.innerHTML = "";
        // ignoreLastRenderedPageBreak: false → pakai page break yang tersimpan
        // di dokumen, bukan memaksa tiap section jadi halaman baru.
        await renderAsync(previewBuffer, bodyRef.current, undefined, {
          ignoreLastRenderedPageBreak: false,
        });

        if (cancelled || !bodyRef.current) return;

        // Simpan lebar halaman asli (px) untuk perhitungan auto-fit.
        const pageEl = bodyRef.current.querySelector<HTMLElement>("section.docx");
        const rawWidth = pageEl ? measureWidthPx(pageEl) : 0;
        pageWidthRef.current = rawWidth > 0 ? rawWidth : null;
        computeFit();

        createdUrl = URL.createObjectURL(blob);
        if (urlRef.current) URL.revokeObjectURL(urlRef.current);
        urlRef.current = createdUrl;
        adopted = true;
        setPreviewUrl(createdUrl);
        setDownloadName(filename);
        setHasPreview(true);
      } catch (err) {
        if (cancelled) return;
        setHasPreview(false);
        const message = getErrorMessage(
          err,
          "Gagal memuat preview kontrak. Silakan coba lagi.",
        );
        setError(message);
        toastError(message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 600);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      if (createdUrl && !adopted) URL.revokeObjectURL(createdUrl);
    };
  }, [
    isReady,
    retryToken,
    driverId,
    vehicleId,
    rentalId,
    startDate,
    endDate,
    duration,
    dailyRate,
    rentalDuration,
    rentalService,
    releaseUrl,
    computeFit,
  ]);

  useEffect(() => () => releaseUrl(), [releaseUrl]);

  // Hitung ulang skala fit saat ukuran kolom preview berubah (resize layar).
  // box: "border-box" supaya kemunculan scrollbar (yang mengubah clientWidth)
  // tidak memicu re-fit dan membatalkan zoom manual pengguna.
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => computeFit());
    observer.observe(container, { box: "border-box" });
    return () => observer.disconnect();
  }, [computeFit]);

  const handleRetry = () => {
    setError("");
    setHasPreview(false);
    setRetryToken((token) => token + 1);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-6 py-5 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-violet-500 text-xl">description</span>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white text-base">
              Preview Kontrak Sewa
            </h3>
            <p className="text-xs text-slate-400">
              {driverLabel && vehicleLabel
                ? `${driverLabel} • ${vehicleLabel}`
                : "Diperbarui otomatis mengikuti form"}
            </p>
          </div>
        </div>

        {hasPreview && previewUrl && (
          <a
            href={previewUrl}
            download={downloadName}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-900/50 transition-colors"
          >
            <span className="material-symbols-outlined text-base">download</span>
            Unduh
          </a>
        )}
      </div>

      {/* Toolbar zoom */}
      <div className="flex items-center justify-end gap-3 px-6 py-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={!hasPreview || zoom <= ZOOM_MIN}
            aria-label="Zoom out"
            title="Perkecil"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <span className="material-symbols-outlined text-lg">zoom_out</span>
          </button>

          <button
            type="button"
            onClick={handleZoomReset}
            disabled={!hasPreview || Math.abs(zoom - fitScale) < 0.001}
            title="Sesuaikan lebar halaman (fit)"
            className="min-w-[54px] px-2 py-1 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:hover:bg-transparent tabular-nums"
          >
            {Math.round(zoom * 100)}%
          </button>

          <button
            type="button"
            onClick={handleZoomIn}
            disabled={!hasPreview || zoom >= ZOOM_MAX}
            aria-label="Zoom in"
            title="Perbesar"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <span className="material-symbols-outlined text-lg">zoom_in</span>
          </button>
        </div>
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          className="h-[65vh] min-h-[420px] overflow-auto bg-slate-100 dark:bg-slate-950 p-4"
        >
          {!isReady ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-6">
              <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-slate-400 text-3xl">draft</span>
              </div>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                Belum ada preview
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-[240px]">
                Pilih driver, kendaraan, dan periode sewa untuk melihat isi kontrak
              </p>
            </div>
          ) : (
            <>
              <div
                ref={bodyRef}
                style={{ zoom }}
                className="contract-preview-canvas min-h-full"
              />

              {loading && (
                <div className="absolute inset-0 bg-white/70 dark:bg-slate-950/70 backdrop-blur-[1px] flex flex-col items-center justify-center gap-3">
                  <span className="material-symbols-outlined animate-spin text-violet-500 text-3xl">
                    progress_activity
                  </span>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Menyiapkan preview kontrak...
                  </p>
                </div>
              )}

              {!loading && error && (
                <div className="absolute inset-0 bg-white/90 dark:bg-slate-950/90 flex flex-col items-center justify-center gap-3 px-6 text-center">
                  <span className="material-symbols-outlined text-red-400 text-3xl">
                    error
                  </span>
                  <p className="text-sm text-red-500 dark:text-red-400 font-medium">{error}</p>
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    Coba lagi
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
        <p className="text-xs text-slate-400 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-base">info</span>
          Preview mengikuti data driver & kendaraan terpilih
        </p>
        <span
          className={`flex items-center gap-1.5 text-xs font-semibold ${
            hasPreview ? "text-emerald-500" : "text-slate-400"
          }`}
        >
          <span className="material-symbols-outlined text-base">
            {hasPreview ? "check_circle" : "radio_button_unchecked"}
          </span>
          {hasPreview ? "Siap diunduh" : "Menunggu data"}
        </span>
      </div>
    </div>
  );
};

export default ContractPreview;
