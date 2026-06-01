import React from 'react';
import { Home, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PAGE_BG, PrimaryButton, SecondaryButton, GlowLink } from '../components/ui/layout';

export default function NotFoundPage() {
  return (
    <div className={`min-h-screen flex items-center justify-center px-4 ${PAGE_BG}`}>
      <div className="max-w-md text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-sky-500/90 mb-4">
          Error 404
        </p>
        <h1 className="text-8xl font-bold text-zinc-800 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-zinc-200 mb-3">
          Halaman tidak ditemukan
        </h2>
        <p className="text-zinc-500 text-sm mb-8 leading-relaxed">
          Halaman yang Anda cari mungkin telah dipindahkan, dihapus, atau tidak pernah ada.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <SecondaryButton type="button" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </SecondaryButton>
          <GlowLink to="/" variant="primary">
            <Home className="w-4 h-4" />
            Beranda
          </GlowLink>
        </div>
      </div>
    </div>
  );
}
