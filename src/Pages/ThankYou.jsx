import React from "react";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { PAGE_BG } from "../components/ui/layout";

const ThankYouPage = () => {
  return (
    <div className={`min-h-screen flex items-center justify-center px-4 ${PAGE_BG}`}>
      <div className="max-w-md text-center border border-zinc-800 bg-zinc-950/80 p-10">
        <CheckCircle className="w-14 h-14 text-sky-400 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-zinc-100 mb-3">Thank You!</h1>
        <p className="text-zinc-500 text-sm mb-8 leading-relaxed">
          Your message has been received. I&apos;ll get back to you as soon as possible.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center bg-sky-500 px-8 py-3 text-sm font-semibold text-zinc-950 hover:bg-sky-400"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default ThankYouPage;
