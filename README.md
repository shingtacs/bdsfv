# 💌 A Birthday Surprise, for him

A mobile-friendly Next.js site built around one flow:

**Home** → looks like a phone notification ("You've got a new message"). Tapping it
opens the surprise.

**`/surprise`** → a photo timeline, a love letter, a playlist, and an interactive
birthday cake he can blow the candles out on (tap, or actually blow into the mic).
At the bottom there's a "copy link" button for a **photobooth page** his friends
can use.

**`/photobooth`** → friends pick a photo layout (classic strip, 2×2 grid, side
by side, etc.), take that many photos in a row — tapping any individual photo
afterward retakes just that one — then pick a filter, pick a frame, and
download a shareable grid photo.

---

## 1. Personalize it

Open **`lib/content.js`** — that's the only file you need to touch to make this
yours. It has his name, your name, the birthday date, the timeline captions,
the letter text, and the playlist.

- **Photos:** drop your real photos into `public/photos/` (any name), then
  update the `image` path for each timeline entry in `lib/content.js`.
- **Playlist:** either fill in the `songs` array (title/artist/optional Spotify
  link), or — easier — paste a Spotify playlist embed URL into
  `spotifyEmbedUrl` and it'll show a real embedded player instead. To get that
  URL: open your playlist on open.spotify.com → Share → Embed playlist → copy
  the `src` from the embed code.
- **Cake candles:** `cake.candleCount` in `lib/content.js` (caps at 12 rendered
  candles so it stays tidy on small screens, but the number itself is up to you).

## 2. Photo layouts

The layout options friends pick from (Classic Strip, 2×2 Grid, Side by Side,
etc.) live in `lib/gridLayouts.js`. Each one just defines how many photos it
needs and where each sits as a fraction of the frame — add, remove, or resize
entries there if you want different arrangements.

## 3. Frame designs (for the photobooth)

Right now `/photobooth` ships with three placeholder frames drawn with code
(Polaroid, Pastel Scallop, Confetti Dots) so it's fully working out of the box.

When you have real frame artwork:

1. Export it as a **square transparent PNG**, ideally 1000×1000px (matching
   `CANVAS_SIZE` in `lib/frames.js`), with the design around the edges and a
   transparent center where photos show through.
2. Drop it in `public/frames/`.
3. Add an entry to the `frames` array in `lib/frames.js`:
   ```js
   {
     id: "custom-1",
     name: "Your Frame Name",
     type: "image",
     src: "/frames/your-file.png",
   }
   ```
   It'll appear in the frame picker automatically.

## 4. Run it locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`. The photobooth needs camera access, which
browsers only allow over `https://` or `localhost` — both are fine for
testing.

## 5. Deploy it (so the link actually works for him and his friends)

The easiest option is [Vercel](https://vercel.com):

1. Push this project to a GitHub repo (or use `vercel` CLI directly from this
   folder).
2. Import it at vercel.com → New Project → select the repo.
3. Deploy. You'll get a URL like `https://your-project.vercel.app`.

That's the link you send him for the notification/surprise, and the
"copy photobooth link" button on the surprise page will automatically point
friends to `https://your-project.vercel.app/photobooth`.

## Notes

- Everything is mobile-first and works on desktop too.
- The mic-based "blow out candles" feature needs microphone permission; the
  tap-to-blow button always works as a fallback.
- No backend, database, or API keys are required — it's a fully static/client
  experience.
