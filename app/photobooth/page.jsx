"use client";

import { useState } from "react";
import GridPicker from "@/components/photobooth/GridPicker";
import CameraCapture from "@/components/photobooth/CameraCapture";
import FilterPicker from "@/components/photobooth/FilterPicker";
import FrameChooser from "@/components/photobooth/FrameChooser";
import ResultScreen from "@/components/photobooth/ResultScreen";
import { composePhotoGrid } from "@/lib/composePhoto";
import { site } from "@/lib/content";
import { filters as filterOptions } from "@/lib/filters";
import { gridLayouts } from "@/lib/gridLayouts";

export default function PhotoboothPage() {
  const [step, setStep] = useState("intro");
  const [layout, setLayout] = useState(gridLayouts[0]);
  const [photos, setPhotos] = useState([]);
  const [filter, setFilter] = useState(filterOptions[0]);
  const [resultUrl, setResultUrl] = useState(null);
  const [busy, setBusy] = useState(false);

  const handleLayoutSelect = (chosenLayout) => {
    setLayout(chosenLayout);
    setPhotos([]);
    setStep("capture");
  };

  const handleCaptureComplete = (shots) => {
    setPhotos(shots);
    setStep("filter");
  };

  const handleFilterComplete = (chosenFilter) => {
    setFilter(chosenFilter);
    setStep("frame");
  };

  const handleFrameComplete = async (frame) => {
    setBusy(true);
    try {
      const url = await composePhotoGrid(photos, filter.css, frame, layout);
      setResultUrl(url);
      setStep("result");
    } finally {
      setBusy(false);
    }
  };

  const restart = () => {
    setPhotos([]);
    setFilter(filterOptions[0]);
    setResultUrl(null);
    setStep("intro");
  };

  return (
    <main className="min-h-[100dvh] px-5 py-14 flex flex-col items-center">
      <header className="text-center mb-10">
        <p className="uppercase tracking-[0.3em] text-xs text-lavender-dark mb-3">
          {site.boyfriendName}'s birthday
        </p>
        <h1 className="font-display text-3xl md:text-4xl text-plum">
          Photobooth
        </h1>
        {step === "intro" && (
          <p className="text-plum-light text-sm mt-3 max-w-xs mx-auto">
            Pick a layout, take a few quick photos, then add a filter and a
            frame before downloading your strip.
          </p>
        )}
      </header>

      {step === "intro" && (
        <button
          onClick={() => setStep("grid")}
          className="px-7 py-3.5 rounded-full bg-plum text-cream font-body font-semibold text-sm shadow-md hover:bg-plum-light transition-colors"
        >
          Start photobooth
        </button>
      )}

      {step === "grid" && (
        <GridPicker onSelect={handleLayoutSelect} onBack={() => setStep("intro")} />
      )}

      {step === "capture" && (
        <CameraCapture layout={layout} onComplete={handleCaptureComplete} />
      )}

      {step === "filter" && (
        <FilterPicker
          photos={photos}
          layout={layout}
          onComplete={handleFilterComplete}
          onBack={() => setStep("capture")}
        />
      )}

      {step === "frame" && (
        <FrameChooser
          onComplete={handleFrameComplete}
          onBack={() => setStep("filter")}
          busy={busy}
        />
      )}

      {step === "result" && resultUrl && (
        <ResultScreen imageUrl={resultUrl} onRestart={restart} />
      )}

      {/* progress dots */}
      {step !== "intro" && step !== "result" && (
        <div className="flex gap-2 mt-10">
          {["grid", "capture", "filter", "frame"].map((s) => (
            <span
              key={s}
              className={`w-2 h-2 rounded-full transition-colors ${
                s === step ? "bg-plum" : "bg-lavender-light"
              }`}
            />
          ))}
        </div>
      )}
    </main>
  );
}
