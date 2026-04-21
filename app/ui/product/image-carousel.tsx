"use client";

import Image from "next/image";
import { useState } from "react";

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

  const thumbEnd = Math.min(thumbStart + visibleThumbnails, images.length);
  const canScrollLeft = thumbStart > 0;
  const canScrollRight = thumbEnd < images.length;

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={images[selectedIndex]}
          alt={`Product image ${selectedIndex + 1}`}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={selectedIndex === 0}
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
            {images.slice(thumbStart, thumbEnd).map((src, i) => {
              const realIndex = thumbStart + i;
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
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </button>
              );
            })}
          </div>

          <button
            onClick={() =>
              setThumbStart((s) =>
                Math.min(s + 1, images.length - visibleThumbnails),
              )
            }
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
