import React, { useMemo, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Download } from "lucide-react";
import { GlowCard, SecondaryButton, PrimaryButton } from "./ui/layout";
import { SITE } from "../config/site";
import { createWatermarkDataUrl } from "../utils/watermark";

export default function PhotoPreviewModal({ photo, onClose }) {
  if (!photo) return null;

  const handleDownload = async () => {
    try {
      const res = await fetch(photo.image_url);
      const blob = await res.blob();
      const img = await createImageBitmap(blob);

      const dpr = Math.max(1, window.devicePixelRatio || 1);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * dpr);
      canvas.height = Math.round(img.height * dpr);
      const ctx = canvas.getContext("2d");
      ctx.scale(dpr, dpr);

      // draw original image
      ctx.drawImage(img, 0, 0, img.width, img.height);

      // subtle diagonal watermark (centered)
      const year = new Date().getFullYear();
      const watermarkText = `© ${SITE.fullName} ${year}`.trim();
      const fontSize = Math.max(18, Math.floor(Math.min(img.width, img.height) / 20));
      ctx.font = `bold ${fontSize}px system-ui, Arial, sans-serif`;
      ctx.fillStyle = "rgba(255,255,255,0.20)"; // low opacity
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const cx = img.width / 2;
      const cy = img.height / 2;
      ctx.save();
      const angle = -Math.PI / 6; // -30deg
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      ctx.fillText(watermarkText, 0, 0);
      ctx.restore();

      // small unobtrusive credit (bottom-left) for accessibility on dark images
      const smallFont = Math.max(10, Math.floor(fontSize / 3));
      ctx.font = `${smallFont}px system-ui, Arial, sans-serif`;
      ctx.fillStyle = "rgba(255,255,255,0.65)";
      ctx.textAlign = "left";
      ctx.textBaseline = "bottom";
      const padding = Math.max(8, Math.floor(smallFont / 2));
      ctx.fillText(`${SITE.fullName}`, padding, img.height - padding);

      // export and download
      canvas.toBlob((outBlob) => {
        if (!outBlob) {
          alert("Gagal membuat file untuk diunduh.");
          return;
        }
        const safeTitle = (photo.title || "photo")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "_")
          .replace(/^_+|_+$/g, "");
        const imgName = `${safeTitle || "photo"}.jpg`;
        const urlOut = URL.createObjectURL(outBlob);
        const a = document.createElement("a");
        a.href = urlOut;
        a.download = imgName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(urlOut);
      }, "image/jpeg", 0.92);
    } catch (err) {
      console.error("Download failed", err);
      alert("Download failed. Cek console untuk detail.");
    }
  };

  if (typeof document === "undefined") return null;

  const portalRoot = document.getElementById("modal-root") || document.body;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] overflow-hidden bg-black/60 backdrop-blur-sm p-4 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="flex w-full h-full items-center justify-center relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-zinc-100 hover:text-white z-50 bg-black/40 hover:bg-black/50 rounded-full backdrop-blur-sm shadow-lg"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <GlowCard
          fill={false}
          glowProps={{ glowRadius: 20, fillOpacity: 0.28 }}
          wrapperClassName="w-full max-w-full sm:max-w-xl md:max-w-3xl lg:max-w-4xl mx-4 shadow-2xl"
          className="relative text-white overflow-visible rounded-lg"
          onClick={(e) => e.stopPropagation()}
        >

          <div className="p-3 md:p-4">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/2 flex items-center justify-center relative" onContextMenu={(e) => e.preventDefault()}>
                <img
                  src={photo.image_url}
                  alt={photo.title || "Photo"}
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                  onContextMenu={(e) => e.preventDefault()}
                  className="w-full h-auto max-h-[50vh] md:max-h-[60vh] object-contain rounded-sm border border-zinc-800"
                />
                <WatermarkOverlay siteName={SITE.fullName} />
              </div>

              <div className="w-full md:flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold mb-2">{photo.title}</h2>
                    {photo.category && (
                      <span className="inline-block text-xs uppercase tracking-wide bg-sky-700 text-white px-2 py-1 rounded-md">
                        {photo.category}
                      </span>
                    )}
                  </div>

                  <div className="hidden md:block">
                    <PrimaryButton onClick={handleDownload} className="!px-4 !py-2 inline-flex items-center">
                      <Download className="w-4 h-4 mr-2" /> Download
                    </PrimaryButton>
                  </div>
                </div>

                <div className="mt-4">
                  {photo.description ? (
                    <p className="text-zinc-300 leading-relaxed">{photo.description}</p>
                  ) : (
                    <p className="text-zinc-600 italic">No description provided.</p>
                  )}
                </div>

                <div className="mt-6 flex gap-3 md:hidden">
                  <PrimaryButton onClick={handleDownload} className="!px-4 !py-2 inline-flex items-center">
                    <Download className="w-4 h-4 mr-2" /> Download
                  </PrimaryButton>
                  <SecondaryButton onClick={onClose} className="!px-4 !py-2">Close</SecondaryButton>
                </div>

                <p className="mt-4 text-xs text-zinc-400">© {SITE.fullName} — Downloaded image includes an embedded watermark.</p>
              </div>
            </div>
          </div>
        </GlowCard>
      </div>
    </div>,
    portalRoot
  );
}

function WatermarkOverlay({ siteName }) {
  const [stamp, setStamp] = useState('');
  useEffect(() => {
    const now = new Date();
    const ts = now.toLocaleString();
    setStamp(`${siteName} • ${ts}`);
  }, [siteName]);

  const dataUrl = useMemo(() => {
    if (typeof document === 'undefined') return '';
    return createWatermarkDataUrl(stamp || siteName, { font: 'bold 18px system-ui, Arial', color: 'rgba(255,255,255,0.28)', padding: 26 });
  }, [stamp, siteName]);

  useEffect(() => {
    function handlePrintScreen(e) {
      // best-effort: briefly show a full-screen watermark overlay
      const overlay = document.createElement('div');
      overlay.style.position = 'fixed';
      overlay.style.inset = '0';
      overlay.style.zIndex = '999999';
      overlay.style.pointerEvents = 'none';
      overlay.style.backgroundImage = `url('${dataUrl}')`;
      overlay.style.backgroundRepeat = 'repeat';
      overlay.style.opacity = '0.36';
      document.body.appendChild(overlay);
      setTimeout(() => overlay.remove(), 900);
    }

    window.addEventListener('keyup', (e) => {
      // PrintScreen key code (PrtSc) handling — some browsers map to 'PrintScreen' key
      if (e.key === 'PrintScreen') handlePrintScreen(e);
    });

    return () => {
      window.removeEventListener('keyup', (e) => {});
    };
  }, [dataUrl]);

  if (!dataUrl) return null;
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage: `url('${dataUrl}')`,
        backgroundRepeat: 'repeat',
        backgroundSize: '180px 60px',
        opacity: 0.28,
        mixBlendMode: 'normal',
      }}
    />
  );
}
