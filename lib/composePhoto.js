import { CANVAS_SIZE } from "@/lib/frames";
import { site } from "@/lib/content";

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function drawCover(ctx, img, x, y, w, h) {
  const imgRatio = img.width / img.height;
  const boxRatio = w / h;
  let sx, sy, sw, sh;

  if (imgRatio > boxRatio) {
    sh = img.height;
    sw = sh * boxRatio;
    sx = (img.width - sw) / 2;
    sy = 0;
  } else {
    sw = img.width;
    sh = sw / boxRatio;
    sx = 0;
    sy = (img.height - sh) / 2;
  }

  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

function drawFrameDecoration(ctx, frame, size) {
  ctx.filter = "none";

  if (frame.id === "polaroid") {
    // bottom caption strip
    const stripHeight = size * 0.12;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, size - stripHeight, size, stripHeight);
    ctx.fillStyle = "#4A3B5C";
    ctx.font = `italic 500 ${size * 0.035}px Georgia, serif`;
    ctx.textAlign = "center";
    ctx.fillText(
      `Happy Birthday, ${site.boyfriendName}! 🎉`,
      size / 2,
      size - stripHeight / 2 + size * 0.012
    );
    // thin outer border
    ctx.strokeStyle = "#EDE6F5";
    ctx.lineWidth = size * 0.015;
    ctx.strokeRect(0, 0, size, size);
  }

  if (frame.id === "scallop") {
    const borderWidth = size * 0.035;
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, "#C8B6E2");
    gradient.addColorStop(1, "#FFD8B8");
    ctx.strokeStyle = gradient;
    ctx.lineWidth = borderWidth;
    ctx.strokeRect(borderWidth / 2, borderWidth / 2, size - borderWidth, size - borderWidth);

    // corner dots
    ctx.fillStyle = "#FF9EAA";
    const r = size * 0.014;
    const pad = borderWidth * 1.4;
    [
      [pad, pad],
      [size - pad, pad],
      [pad, size - pad],
      [size - pad, size - pad],
    ].forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  if (frame.id === "confetti") {
    const borderWidth = size * 0.05;
    ctx.fillStyle = "#FFF8F0";
    // top/bottom/left/right bands
    ctx.fillRect(0, 0, size, borderWidth);
    ctx.fillRect(0, size - borderWidth, size, borderWidth);
    ctx.fillRect(0, 0, borderWidth, size);
    ctx.fillRect(size - borderWidth, 0, borderWidth, size);

    const colors = ["#FF9EAA", "#C8B6E2", "#FFD8B8", "#E8C468"];
    let seed = 42;
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    for (let i = 0; i < 60; i++) {
      const alongTop = i % 2 === 0;
      const pos = rand() * size;
      const thickness = borderWidth * (0.25 + rand() * 0.35);
      const cx = alongTop ? pos : rand() < 0.5 ? thickness : size - thickness;
      const cy = alongTop ? (rand() < 0.5 ? thickness : size - thickness) : pos;
      ctx.fillStyle = colors[i % colors.length];
      ctx.beginPath();
      ctx.arc(cx, cy, thickness * 0.28, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

/**
 * photos: array of dataURLs, matching layout.cells length
 * filterCss: CSS filter string, e.g. "grayscale(1)"
 * frame: object from lib/frames.js
 * layout: object from lib/gridLayouts.js — defines cell positions as
 *         fractions (0–1) of the grid area
 * returns: dataURL (image/png) of the composed grid
 */
export async function composePhotoGrid(photos, filterCss, frame, layout) {
  const size = CANVAS_SIZE;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  // base background
  ctx.fillStyle = "#FFF8F0";
  ctx.fillRect(0, 0, size, size);

  const outerPad = frame.id === "confetti" ? size * 0.07 : size * 0.04;
  const bottomPad = frame.id === "polaroid" ? size * 0.16 : outerPad;
  const gap = size * 0.018;

  const gridArea = {
    x: outerPad,
    y: outerPad,
    w: size - outerPad * 2,
    h: size - outerPad - bottomPad,
  };

  const loaded = await Promise.all(photos.map((src) => loadImage(src)));

  ctx.save();
  ctx.filter = filterCss;

  layout.cells.forEach((cell, i) => {
    const img = loaded[i];
    if (!img) return;
    const x = gridArea.x + cell.x * gridArea.w + gap / 2;
    const y = gridArea.y + cell.y * gridArea.h + gap / 2;
    const w = cell.w * gridArea.w - gap;
    const h = cell.h * gridArea.h - gap;
    drawCover(ctx, img, x, y, w, h);
  });

  ctx.restore();

  if (frame.type === "css") {
    drawFrameDecoration(ctx, frame, size);
  } else if (frame.type === "image" && frame.src) {
    try {
      const overlay = await loadImage(frame.src);
      ctx.drawImage(overlay, 0, 0, size, size);
    } catch {
      // frame artwork not added yet — silently skip, grid still renders
    }
  }

  return canvas.toDataURL("image/png");
}
