"use client";

import { useState } from "react";
import { filters } from "@/lib/filters";
import GridPreview from "@/components/photobooth/GridPreview";

export default function FilterPicker({ photos, layout, onComplete, onBack }) {
  const [selected, setSelected] = useState(filters[0]);

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center gap-6">
      <div className="w-full rounded-3xl overflow-hidden shadow-[0_16px_50px_rgba(74,59,92,0.2)] bg-white p-1.5">
        <GridPreview layout={layout} photos={photos} filterCss={selected.css} />
      </div>

      <div className="w-full">
        <p className="text-plum-light text-xs uppercase tracking-widest text-center mb-3">
          choose a filter
        </p>
        <div className="flex gap-3 overflow-x-auto pb-2 px-1 justify-center flex-wrap">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelected(f)}
              className={`flex flex-col items-center gap-1.5 shrink-0 ${
                selected.id === f.id ? "" : "opacity-70"
              }`}
            >
              <span
                className={`w-14 h-14 rounded-xl overflow-hidden border-2 ${
                  selected.id === f.id ? "border-plum" : "border-transparent"
                }`}
              >
                {photos[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photos[0]}
                    alt=""
                    className="w-full h-full object-cover"
                    style={{ filter: f.css }}
                  />
                )}
              </span>
              <span className="text-xs text-plum-light">{f.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-full border-2 border-lavender-dark text-plum font-body font-semibold text-sm hover:bg-lavender-light/50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={() => onComplete(selected)}
          className="px-6 py-3 rounded-full bg-plum text-cream font-body font-semibold text-sm shadow-md hover:bg-plum-light transition-colors"
        >
          Next: choose a frame
        </button>
      </div>
    </div>
  );
}
