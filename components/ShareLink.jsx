"use client";

import { useState } from "react";
import { shareConfig } from "@/lib/content";
import { useReveal } from "@/lib/useReveal";

export default function ShareLink() {
  const ref = useReveal();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}${shareConfig.photoboothPath}`
        : shareConfig.photoboothPath;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API unavailable — fall back to manual select via prompt
      window.prompt("Copy this link:", url);
    }
  };

  return (
    <section className="w-full max-w-xl mx-auto px-5 pt-4 pb-24">
      <div
        ref={ref}
        className="section-fade bg-gradient-to-br from-lavender-light to-peach-light rounded-3xl px-6 py-10 text-center shadow-[0_16px_50px_rgba(74,59,92,0.14)]"
      >
        <p className="text-3xl mb-3">📸</p>
        <h3 className="font-display text-2xl text-plum mb-2">
          One more thing
        </h3>
        <p className="text-plum-light text-sm max-w-xs mx-auto mb-6">
          {shareConfig.shareMessage}
        </p>
        <button
          onClick={handleCopy}
          className="px-6 py-3 rounded-full bg-plum text-cream font-body font-semibold text-sm shadow-md hover:bg-plum-light transition-colors"
        >
          {copied ? "Link copied ✓" : "Copy photobooth link"}
        </button>
      </div>
    </section>
  );
}
