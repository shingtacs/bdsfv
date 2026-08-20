"use client";

export default function ResultScreen({ imageUrl, onRestart }) {
  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center gap-6">
      <div className="w-full rounded-3xl overflow-hidden shadow-[0_16px_50px_rgba(74,59,92,0.25)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt="Your photobooth strip" className="w-full h-full" />
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        <a
          href={imageUrl}
          download="birthday-photobooth.png"
          className="px-6 py-3 rounded-full bg-plum text-cream font-body font-semibold text-sm shadow-md hover:bg-plum-light transition-colors"
        >
          Download photo
        </a>
        <button
          onClick={onRestart}
          className="px-6 py-3 rounded-full border-2 border-lavender-dark text-plum font-body font-semibold text-sm hover:bg-lavender-light/50 transition-colors"
        >
          Take another
        </button>
      </div>

      <p className="text-plum-light text-xs text-center max-w-xs">
        Save it to your phone and share it however you like 💛
      </p>
    </div>
  );
}
