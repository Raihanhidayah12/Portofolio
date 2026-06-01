import React from 'react';
import { PAGE_BG } from './ui/layout';

const LoadingScreen = () => {
  return (
    <div className={`min-h-screen flex items-center justify-center ${PAGE_BG}`}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-zinc-800 border-t-sky-400 animate-spin" />
        <span className="font-mono text-xs uppercase tracking-widest text-zinc-600">
          Loading
        </span>
      </div>
    </div>
  );
};

export default LoadingScreen;
