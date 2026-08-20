"use client";

import { gridLayouts } from "@/lib/gridLayouts";
import GridPreview from "@/components/photobooth/GridPreview";

export default function GridPicker({ onSelect, onBack }) {
  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center gap-6">
      <p className="text-plum-light text-xs uppercase tracking-widest text-center">
        choose a layout
      </p>

      <div className="grid grid-cols-3 gap-3 w-full">
        {gridLayouts.map((layout) => (
          <button
            key={layout.id}
            onClick={() => onSelect(layout)}
            className="flex flex-col items-center gap-2 p-2.5 rounded-2xl bg-white/70 border-2 border-transparent hover:border-plum hover:bg-white transition-colors"
          >
            <GridPreview layout={layout} className="rounded-lg" />
            <span className="text-xs text-plum font-body font-medium text-center leading-tight">
              {layout.name}
            </span>
            <span className="text-[10px] text-plum-light">
              {layout.count} photos
            </span>
          </button>
        ))}
      </div>

      <button
        onClick={onBack}
        className="px-6 py-3 rounded-full border-2 border-lavender-dark text-plum font-body font-semibold text-sm hover:bg-lavender-light/50 transition-colors"
      >
        Back
      </button>
    </div>
  );
}
