# Mr. Tux — Prototype Deploy Guide

This is a plain static site (HTML/CSS/JS, no build step) — that means Vercel needs zero
configuration. Four files matter: `index.html`, `collection.html`, `story.html`,
`contact.html`, plus the `css/` and `js/` folders.

## Fastest path: GitHub → Vercel (recommended, ~5 min)

1. Create a new empty repo on GitHub (e.g. `mrtux-prototype`).
2. On your computer, in the folder with these files, run:
   ```
   git init
   git add .
   git commit -m "Mr. Tux prototype"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/mrtux-prototype.git
   git push -u origin main
   ```
3. Go to vercel.com → **Add New → Project** → Import the `mrtux-prototype` repo.
4. Framework preset: choose **Other** (or leave auto-detected — it's static, no build
   command needed, no output directory needed).
5. Click **Deploy**. You'll get a live `https://mrtux-prototype.vercel.app` link in
   under a minute.

## Even faster: drag-and-drop (no GitHub needed, ~2 min)

1. Go to vercel.com → **Add New → Project**.
2. Look for the "deploy without git" / drag-and-drop option, and drag this whole
   folder in.
3. Vercel deploys it instantly and gives you a live URL.

## After the meeting

- Swap the Unsplash placeholder photos for real shop photography — that's the single
  biggest visual upgrade available.
- Drop in the real logo (currently text-based "MR. TUX" wordmark).
- If they like the direction, next step is wiring the contact form to actually send
  (e.g. via Formspree, or a Vercel serverless function) and connecting real inventory
  photos per style category.
