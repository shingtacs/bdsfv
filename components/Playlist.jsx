"use client";

import { useState } from "react";
import { playlist } from "@/lib/content";
import { useReveal } from "@/lib/useReveal";

export default function Playlist() {
  const ref = useReveal();
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <section className="w-full max-w-xl mx-auto px-5 py-20">
      <div ref={ref} className="section-fade">
        <div className="text-center mb-10">
          <p className="uppercase tracking-[0.3em] text-xs text-lavender-dark mb-3">
            our mixtape
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-plum">
            {playlist.title}
          </h2>
          <p className="text-plum-light mt-2 text-sm">{playlist.subtitle}</p>
        </div>

        {playlist.spotifyEmbedUrl ? (
          <div className="rounded-2xl overflow-hidden shadow-[0_12px_40px_rgba(74,59,92,0.15)]">
            <iframe
              src={playlist.spotifyEmbedUrl}
              width="100%"
              height="352"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="Spotify playlist"
            />
          </div>
        ) : (
          <div className="bg-white/90 rounded-2xl shadow-[0_12px_40px_rgba(74,59,92,0.14)] px-2 py-3 md:px-4 md:py-4">
            {/* cassette-tape flourish */}
            <div className="flex items-center justify-center gap-3 py-4 mb-2 border-b border-lavender-light/70">
              <div className="w-8 h-8 rounded-full border-4 border-plum-light/30" />
              <span className="font-display italic text-plum-light text-sm">
                side A
              </span>
              <div className="w-8 h-8 rounded-full border-4 border-plum-light/30" />
            </div>

            <ul className="flex flex-col">
              {playlist.songs.map((song, i) => {
                const isActive = activeIndex === i;
                const Wrapper = song.spotifyUrl ? "a" : "div";
                const wrapperProps = song.spotifyUrl
                  ? { href: song.spotifyUrl, target: "_blank", rel: "noopener noreferrer" }
                  : {};

                return (
                  <li key={song.title}>
                    <Wrapper
                      {...wrapperProps}
                      onClick={() => setActiveIndex(i)}
                      className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-colors cursor-pointer ${
                        isActive ? "bg-peach-light" : "hover:bg-lavender-light/40"
                      }`}
                    >
                      <span className="font-display italic text-plum-light w-5 text-center shrink-0">
                        {i + 1}
                      </span>
                      <span className="flex-1 min-w-0">
                        <p className="font-body font-semibold text-plum truncate">
                          {song.title}
                        </p>
                        <p className="text-plum-light text-sm truncate">
                          {song.artist}
                        </p>
                      </span>
                      <span className="text-lavender-dark text-lg shrink-0">
                        {isActive ? "♫" : "♪"}
                      </span>
                    </Wrapper>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
