// ────────────────────────────────────────────────────────────────
// FRAME DESIGNS
// Right now these are simple placeholder frames drawn with code
// (type: "css"). Once you have real frame artwork, drop a
// transparent PNG (square, e.g. 1000x1000) into /public/frames/
// and add an entry below with type: "image". It'll show up in the
// picker automatically — no other code needs to change.
// ────────────────────────────────────────────────────────────────

export const CANVAS_SIZE = 1000;

export const frames = [
  {
    id: "none",
    name: "No frame",
    type: "none",
  },
  {
    id: "polaroid",
    name: "Polaroid",
    type: "css",
    swatch: "linear-gradient(#fff 70%, #fff 70%)",
  },
  {
    id: "scallop",
    name: "Pastel Scallop",
    type: "css",
    swatch: "linear-gradient(135deg, #C8B6E2, #FFD8B8)",
  },
  {
    id: "confetti",
    name: "Confetti Dots",
    type: "css",
    swatch: "radial-gradient(circle, #FF9EAA 15%, transparent 16%) 0 0/16px 16px, #FFF8F0",
  },

  // Example of how to register your own artwork once it's ready:
  // {
  //   id: "custom-1",
  //   name: "Custom Frame",
  //   type: "image",
  //   src: "/frames/frame-1.png",
  //   swatch: "url(/frames/frame-1-thumb.png)",
  // },
];
