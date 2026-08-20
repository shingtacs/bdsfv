"use client";

import { useState } from "react";
import { frames } from "@/lib/frames";

export default function FrameChooser({ onComplete, onBack, busy }) {
  const [selected, setSelected] = useState(frames[0]);

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center gap-6">
      <p className="text-plum-light text-xs uppercase tracking-widest text-center">
        choose a frame
      </p>

      <div className="grid grid-cols-2 gap-4 w-full">
        {frames.map((frame) => (
          <button
            key={frame.id}
            onClick={() => setSelected(frame)}
            className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-colors ${
              selected.id === frame.id
                ? "border-plum bg-white"
                : "border-transparent bg-white/60 hover:bg-white/90"
            }`}
          >
            <span
              className="w-full aspect-square rounded-xl border border-lavender-light"
              style={{
                background:
                  frame.type === "image"
                    ? `center/cover no-repeat ${frame.swatch || "#eee"}`
                    : frame.swatch || "#FFF8F0",
              }}
            />
            <span className="text-sm text-plum font-body font-medium">
              {frame.name}
            </span>
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          disabled={busy}
          className="px-6 py-3 rounded-full border-2 border-lavender-dark text-plum font-body font-semibold text-sm hover:bg-lavender-light/50 transition-colors disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={() => onComplete(selected)}
          disabled={busy}
          className="px-6 py-3 rounded-full bg-plum text-cream font-body font-semibold text-sm shadow-md hover:bg-plum-light transition-colors disabled:opacity-50"
        >
          {busy ? "Creating…" : "Create photo"}
        </button>
      </div>
    </div>
  );
}
