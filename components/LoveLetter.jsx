"use client";

import { useState } from "react";
import { letter, site } from "@/lib/content";
import { useReveal } from "@/lib/useReveal";

export default function LoveLetter() {
  const ref = useReveal();
  const [unfolded, setUnfolded] = useState(false);

  return (
    <section className="w-full max-w-xl mx-auto px-5 py-20">
      <div ref={ref} className="section-fade">
        <div className="text-center mb-10">
          <p className="uppercase tracking-[0.3em] text-xs text-lavender-dark mb-3">
            for you
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-plum">
            A letter
          </h2>
        </div>

        <div
          className={`relative bg-white/95 border border-lavender-light shadow-[0_16px_50px_rgba(74,59,92,0.14)] rounded-md px-6 py-10 md:px-12 md:py-14 transition-all duration-700 ${
            unfolded ? "" : "cursor-pointer hover:shadow-[0_20px_60px_rgba(74,59,92,0.2)]"
          }`}
          onClick={() => !unfolded && setUnfolded(true)}
          role={!unfolded ? "button" : undefined}
          tabIndex={!unfolded ? 0 : undefined}
          onKeyDown={(e) => {
            if (!unfolded && (e.key === "Enter" || e.key === " ")) setUnfolded(true);
          }}
          aria-label={!unfolded ? "Open the letter" : undefined}
        >
          {!unfolded ? (
            <div className="flex flex-col items-center gap-3 py-10">
              <span className="text-3xl">✉️</span>
              <p className="font-display italic text-plum-light text-lg">
                Tap to read
              </p>
            </div>
          ) : (
            <div className="animate-pop-in">
              <p className="font-display italic text-xl text-plum mb-6">
                {letter.greeting}
              </p>
              <div className="flex flex-col gap-5">
                {letter.paragraphs.map((p, i) => (
                  <p key={i} className="font-body text-plum-light leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
              <p className="font-display italic text-lg text-plum mt-8">
                {letter.signoff},<br />
                {site.senderName}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
