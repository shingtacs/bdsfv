"use client";

import { useEffect, useRef, useState } from "react";

const COUNTDOWN_SECONDS = 3;

export default function CameraCapture({ layout, onComplete }) {
  const shotCount = layout.count;

  const videoRef = useRef(null);
  const captureCanvasRef = useRef(null);
  const streamRef = useRef(null);

  const [photos, setPhotos] = useState(Array(shotCount).fill(null));
  const [status, setStatus] = useState("idle"); // idle | starting | ready | error
  const [count, setCount] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeIndex, setActiveIndex] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  const startCamera = async () => {
    setStatus("starting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1080 }, height: { ideal: 1080 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setStatus("ready");
    } catch (err) {
      setErrorMsg(
        "Couldn't access your camera. Please allow camera access and reload the page."
      );
      setStatus("error");
    }
  };

  const captureFrame = () => {
    const video = videoRef.current;
    const canvas = captureCanvasRef.current;
    if (!video || !canvas) return null;

    const size = Math.min(video.videoWidth, video.videoHeight);
    if (!size) return null;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    const sx = (video.videoWidth - size) / 2;
    const sy = (video.videoHeight - size) / 2;

    // mirror for a natural selfie-style capture
    ctx.save();
    ctx.translate(size, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, sx, sy, size, size, 0, 0, size, size);
    ctx.restore();

    return canvas.toDataURL("image/jpeg", 0.92);
  };

  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  const countdownOnce = () => {
    return new Promise((resolve) => {
      let n = COUNTDOWN_SECONDS;
      setCount(n);
      const interval = setInterval(() => {
        n -= 1;
        if (n <= 0) {
          clearInterval(interval);
          setCount(null);
          resolve();
        } else {
          setCount(n);
        }
      }, 700);
    });
  };

  // Captures one or more slots, in order. Used both for "start" (all slots)
  // and for a single-tile retake (just [index]).
  const runCapture = async (indices) => {
    if (isCapturing) return;
    setIsCapturing(true);
    setStatus("ready");

    for (const idx of indices) {
      setActiveIndex(idx);
      await countdownOnce();
      const frame = captureFrame();
      if (frame) {
        setPhotos((prev) => {
          const next = [...prev];
          next[idx] = frame;
          return next;
        });
      }
      await wait(300);
    }

    setActiveIndex(null);
    setIsCapturing(false);
  };

  const startAll = () => runCapture(Array.from({ length: shotCount }, (_, i) => i));
  const retakeAll = () => {
    setPhotos(Array(shotCount).fill(null));
    runCapture(Array.from({ length: shotCount }, (_, i) => i));
  };
  const retakeOne = (i) => {
    if (isCapturing || !photos[i]) return;
    runCapture([i]);
  };

  const allDone = photos.every(Boolean);

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center gap-5">
      <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-plum shadow-[0_16px_50px_rgba(74,59,92,0.25)]">
        <video
          ref={videoRef}
          playsInline
          muted
          className="w-full h-full object-cover [transform:scaleX(-1)]"
        />
        {status === "starting" && (
          <div className="absolute inset-0 flex items-center justify-center text-cream/80 text-sm">
            starting camera…
          </div>
        )}
        {status === "error" && (
          <div className="absolute inset-0 flex items-center justify-center text-center px-6 text-cream/90 text-sm">
            {errorMsg}
          </div>
        )}
        {count !== null && (
          <div className="absolute inset-0 flex items-center justify-center bg-plum/30">
            <span className="text-cream font-display text-7xl drop-shadow-lg">
              {count}
            </span>
          </div>
        )}
      </div>

      <canvas ref={captureCanvasRef} className="hidden" />

      {/* per-shot thumbnail strip — tap any filled thumbnail to retake just that one */}
      <div className="w-full flex gap-2.5 overflow-x-auto pb-1 px-1 justify-center flex-wrap">
        {Array.from({ length: shotCount }).map((_, i) => {
          const filled = !!photos[i];
          const isActive = activeIndex === i;

          return (
            <button
              key={i}
              onClick={() => retakeOne(i)}
              disabled={!filled || isCapturing}
              aria-label={filled ? `Retake photo ${i + 1}` : `Photo ${i + 1} not taken yet`}
              className={`group relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-colors ${
                isActive
                  ? "border-rose"
                  : filled
                  ? "border-lavender-dark cursor-pointer"
                  : "border-dashed border-lavender-light/70"
              }`}
            >
              {filled ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photos[i]} alt="" className="w-full h-full object-cover" />
                  <span className="absolute inset-0 bg-plum/0 group-hover:bg-plum/55 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="text-cream text-[10px] font-body font-semibold">
                      Retake
                    </span>
                  </span>
                  <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-white/90 flex items-center justify-center text-[9px] leading-none shadow-sm">
                    ↻
                  </span>
                </>
              ) : (
                <span className="w-full h-full flex items-center justify-center bg-lavender-light/25 text-plum-light text-xs font-body">
                  {i + 1}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {status === "error" ? (
        <button
          onClick={startCamera}
          className="px-6 py-3 rounded-full bg-plum text-cream font-body font-semibold text-sm"
        >
          Try again
        </button>
      ) : !allDone ? (
        <button
          onClick={startAll}
          disabled={isCapturing || status === "starting"}
          className="px-7 py-3 rounded-full bg-plum text-cream font-body font-semibold text-sm shadow-md disabled:opacity-50 hover:bg-plum-light transition-colors"
        >
          {isCapturing ? "Capturing…" : `Start (${shotCount} photos)`}
        </button>
      ) : (
        <div className="flex gap-3">
          <button
            onClick={retakeAll}
            disabled={isCapturing}
            className="px-6 py-3 rounded-full border-2 border-lavender-dark text-plum font-body font-semibold text-sm hover:bg-lavender-light/50 transition-colors disabled:opacity-50"
          >
            Retake all
          </button>
          <button
            onClick={() => onComplete(photos)}
            disabled={isCapturing}
            className="px-6 py-3 rounded-full bg-plum text-cream font-body font-semibold text-sm shadow-md hover:bg-plum-light transition-colors disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      <p className="text-plum-light text-xs text-center max-w-xs">
        {allDone
          ? "Tap any photo above to retake just that one."
          : `We'll take ${shotCount} photos in a row with a ${COUNTDOWN_SECONDS}-second countdown between each.`}
      </p>
    </div>
  );
}
