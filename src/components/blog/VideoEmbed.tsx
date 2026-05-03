"use client";

import { useState } from "react";
import Image from "next/image";

type Props = {
  poster: string;
  label: string;
  /** Optional MP4 URL. When omitted, the player shows a "request walkthrough" CTA. */
  src?: string;
  /** Alt text for the poster image. */
  alt?: string;
};

export default function VideoEmbed({ poster, label, src, alt = "" }: Props) {
  const [playing, setPlaying] = useState(false);

  return (
    <figure className="relative w-full aspect-video overflow-hidden bg-bh-black border border-bh-steel/40 group">
      {playing && src ? (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={src}
          controls
          autoPlay
          poster={poster}
        />
      ) : (
        <>
          <Image
            src={poster}
            alt={alt}
            fill
            sizes="(min-width: 1024px) 800px, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          />
          {/* gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-black/25" />

          {/* play button */}
          <button
            type="button"
            onClick={() => {
              if (src) setPlaying(true);
            }}
            aria-label={src ? "Play video" : "Request walkthrough"}
            className="absolute inset-0 flex items-center justify-center cursor-pointer"
          >
            <span className="relative inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-bh-orange text-bh-white transition-transform duration-300 group-hover:scale-105">
              <span className="absolute inset-0 rounded-full bg-bh-orange/40 animate-ping" />
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
                className="relative ml-1"
              >
                <path d="M7 5v14l12-7z" />
              </svg>
            </span>
          </button>

          {/* label */}
          <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 text-bh-white">
            <p className="text-[11px] tracking-[0.2em] uppercase text-bh-steel/85 mb-1">
              {src ? "Watch" : "Walkthrough"}
            </p>
            <p className="text-[16px] md:text-[18px] tracking-[-0.01em] font-medium">
              {label}
            </p>
            {!src && (
              <p className="mt-1 text-[12px] tracking-[-0.005em] text-bh-steel/75">
                Available on request · email{" "}
                <a
                  href="mailto:services@buildhawk.com.au"
                  className="text-bh-orange hover:text-bh-white"
                >
                  services@buildhawk.com.au
                </a>
              </p>
            )}
          </div>
        </>
      )}
    </figure>
  );
}
