"use client";

import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { cake, site } from "@/lib/content";
import { useReveal } from "@/lib/useReveal";

const MAX_VISIBLE_CANDLES = 12; // cap rendered candles so it stays tidy on small screens

export default function BirthdayCake() {
  const ref = useReveal();
  const candleTotal = Math.min(cake.candleCount, MAX_VISIBLE_CANDLES);
  const [lit, setLit] = useState(() => Array(candleTotal).fill(true));
  const [micActive, setMicActive] = useState(false);
  const [micError, setMicError] = useState(false);
  const audioCtxRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);

  const allOut = lit.every((v) => !v);

  const blowOutOne = () => {
    setLit((prev) => {
      const idx = prev.findIndex((v) => v);
      if (idx === -1) return prev;
      const next = [...prev];
      next[idx] = false;
      return next;
    });
  };

  const blowOutAll = () => setLit(Array(candleTotal).fill(false));

  useEffect(() => {
    if (allOut) {
      confetti({
        particleCount: 140,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#C8B6E2", "#FFD8B8", "#FF9EAA", "#E8C468"],
      });
      stopMic();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allOut]);

  const stopMic = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    setMicActive(false);
  };

  const startMicBlow = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContext();
      audioCtxRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);
      setMicActive(true);
      setMicError(false);

      let loudFrames = 0;

      const tick = () => {
        analyser.getByteFrequencyData(data);
        const avg = data.reduce((a, b) => a + b, 0) / data.length;

        if (avg > 42) {
          loudFrames += 1;
          if (loudFrames > 4) {
            blowOutOne();
            loudFrames = 0;
          }
        } else {
          loudFrames = 0;
        }

        rafRef.current = requestAnimationFrame(tick);
      };

      tick();
    } catch (err) {
      setMicError(true);
    }
  };

  useEffect(() => stopMic, []); // cleanup on unmount

  return (
    <section className="w-full max-w-xl mx-auto px-5 py-20">
      <div ref={ref} className="section-fade text-center">
        <p className="uppercase tracking-[0.3em] text-xs text-lavender-dark mb-3">
          happy birthday
        </p>
        <h2 className="font-display text-3xl md:text-4xl text-plum mb-3">
          Make a wish
        </h2>
        <p className="text-plum-light text-sm mb-10 max-w-sm mx-auto">
          {allOut ? "" : cake.wishPromptedMessage}
        </p>

        <div className="relative mx-auto w-full max-w-xs select-none" aria-hidden={false}>
          {/* candles */}
          <div className="flex justify-center gap-2 mb-1 flex-wrap px-4">
            {Array.from({ length: candleTotal }).map((_, i) => (
              <button
                key={i}
                onClick={() => setLit((prev) => {
                  const next = [...prev];
                  next[i] = false;
                  return next;
                })}
                aria-label={lit[i] ? "Blow out candle" : "Candle already out"}
                className="relative flex flex-col items-center w-3.5 h-14 focus-visible:outline-none"
              >
                {lit[i] && (
                  <span
                    className="w-2 h-3.5 rounded-full bg-gradient-to-t from-gold via-peach to-rose animate-flicker mb-0.5 shadow-[0_0_10px_rgba(232,196,104,0.8)]"
                    style={{ animationDelay: `${i * 90}ms` }}
                  />
                )}
                <span className="w-1 flex-1 bg-lavender-dark/70 rounded-sm" />
              </button>
            ))}
          </div>

          {/* cake body */}
          <div className="rounded-t-[2rem] rounded-b-lg bg-gradient-to-b from-peach-light to-peach overflow-hidden shadow-[0_16px_40px_rgba(74,59,92,0.2)]">
            <div className="h-6 bg-white/60 border-b-4 border-dashed border-white" />
            <div className="h-10 bg-gradient-to-b from-lavender-light to-lavender" />
            <div className="h-6 bg-white/50 border-b-4 border-dashed border-white" />
            <div className="h-10 bg-gradient-to-b from-rose/40 to-rose/60" />
          </div>
        </div>

        {!allOut ? (
          <div className="mt-10 flex flex-col items-center gap-3">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={blowOutOne}
                className="px-5 py-2.5 rounded-full bg-plum text-cream font-body font-semibold text-sm shadow-md hover:bg-plum-light transition-colors"
              >
                Tap to blow a candle
              </button>
              <button
                onClick={micActive ? stopMic : startMicBlow}
                className="px-5 py-2.5 rounded-full border-2 border-lavender-dark text-plum font-body font-semibold text-sm hover:bg-lavender-light/50 transition-colors"
              >
                {micActive ? "Listening… (tap to stop)" : "🎤 Actually blow"}
              </button>
              <button
                onClick={blowOutAll}
                className="text-plum-light text-sm underline underline-offset-4 hover:text-plum"
              >
                blow them all out
              </button>
            </div>
            {micError && (
              <p className="text-rose text-xs">
                Couldn't access your mic — try the tap button instead.
              </p>
            )}
          </div>
        ) : (
          <div className="mt-10 animate-pop-in max-w-sm mx-auto">
            <p className="font-display italic text-xl text-plum leading-relaxed">
              {cake.revealedMessage}
            </p>
            <p className="text-plum-light text-sm mt-4">
              — {site.senderName}, on your {site.birthdayMonthDay} 🎂
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
