"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface ImageCarouselProps {
  images: string[];
  /** Number of thumbnails visible at once */
  visibleThumbnails?: number;
}

export default function ImageCarousel({
  images,
  visibleThumbnails = 4,
}: ImageCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [thumbStart, setThumbStart] = useState(0);

  const maxThumbStart = Math.max(0, images.length - visibleThumbnails);

  useEffect(() => {
    setThumbStart((s) => Math.min(Math.max(0, s), maxThumbStart));
  }, [maxThumbStart, images.length]);

  useEffect(() => {
    setSelectedIndex((i) =>
      Math.min(Math.max(0, i), Math.max(0, images.length - 1)),
    );
  }, [images.length]);

  /** Clamp for this render so a stale thumbStart never yields a negative window before effects run. */
  const windowStart = Math.min(Math.max(0, thumbStart), maxThumbStart);
  const thumbEnd = Math.min(windowStart + visibleThumbnails, images.length);
  const canScrollLeft = windowStart > 0;
  const canScrollRight = windowStart < maxThumbStart;

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={images[selectedIndex]}
          alt={`Product image ${selectedIndex + 1}`}
          className="object-contain w-60 h-60"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={selectedIndex === 0}
          loading="eager"
        />
      </div>

      {images.length > 1 && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setThumbStart((s) => Math.max(0, s - 1))}
            disabled={!canScrollLeft}
            aria-label="Previous thumbnails"
            className="shrink-0 rounded p-1 text-gray-600 enabled:hover:bg-gray-100 disabled:opacity-30"
          >
            <ChevronLeft />
          </button>

          <div className="flex flex-1 justify-center gap-2">
            {images.slice(windowStart, thumbEnd).map((src, i) => {
              const realIndex = windowStart + i;
              return (
                <button
                  key={src}
                  onClick={() => setSelectedIndex(realIndex)}
                  aria-label={`View image ${realIndex + 1}`}
                  className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 transition ${
                    realIndex === selectedIndex
                      ? "border-black"
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <Image
                    src={src}
                    alt={`Thumbnail ${realIndex + 1}`}
                    className="object-cover"
                    sizes="64px"
                    loading="lazy"
                  />
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setThumbStart((s) => Math.min(s + 1, maxThumbStart))}
            disabled={!canScrollRight}
            aria-label="Next thumbnails"
            className="shrink-0 rounded p-1 text-gray-600 enabled:hover:bg-gray-100 disabled:opacity-30"
          >
            <ChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}

function ChevronLeft() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
