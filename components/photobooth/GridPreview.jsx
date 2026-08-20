"use client";

export default function GridPreview({ layout, photos = [], filterCss = "none", className = "" }) {
  return (
    <div
      className={`relative w-full aspect-square overflow-hidden ${className}`}
      style={{ filter: filterCss }}
    >
      {layout.cells.map((cell, i) => (
        <div
          key={i}
          className="absolute p-[3px]"
          style={{
            left: `${cell.x * 100}%`,
            top: `${cell.y * 100}%`,
            width: `${cell.w * 100}%`,
            height: `${cell.h * 100}%`,
          }}
        >
          <div className="w-full h-full rounded-md overflow-hidden bg-lavender-light/50">
            {photos[i] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photos[i]} alt="" className="w-full h-full object-cover" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
