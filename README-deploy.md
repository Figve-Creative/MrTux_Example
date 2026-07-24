# Mr. Tux — Prototype Deploy Guide

This is a plain static site (HTML/CSS/JS, no build step) — Vercel needs zero
configuration. Pages: `index.html`, `collection.html`, `story.html`, `contact.html`,
plus `css/`, `js/`, and `img/` (real logo + photography pulled from the brand deck).

## You already have a repo (`MrTux_Example`) — push the update

The site has been rebuilt on the official brand system from the Figve Creative brand
proposal (Legacy Green / Tuxedo Ink / Ivory Cream / Cognac / Burgundy / Navy palette,
Fraunces + Newsreader + Space Mono type, the real "Mr. Tux" gentleman mark, and copy
pulled from the brand story, positioning, and voice & tone sections). To push this
version to the repo you already created:

```
cd "/Users/Cora/Library/Application Support/Claude/local-agent-mode-sessions/0af562c1-1721-4a98-bfe3-30b6fa6d1480/392efd79-b4cf-4b57-ab26-90af5f32587c/local_95e36353-e4ea-414b-9b0d-ad9d0fbfc4f0/outputs"
git add .
git commit -m "Rebuild on official brand system"
git push
```

If `git push` asks for credentials, log in with GitHub. Vercel will pick up the change
automatically within a minute or two if the project is already connected — no redeploy
click needed. If it doesn't auto-update, go to the project on vercel.com and click
**Redeploy**.

## Starting fresh (if you ever need to)

1. Create an empty GitHub repo.
2. From this folder: `git init && git add . && git commit -m "Mr. Tux prototype"
   && git branch -M main && git remote add origin <your-repo-url> && git push -u origin main`
3. On vercel.com → **Add New → Project** → import the repo → framework preset
   **Other** (static, no build command) → **Deploy**.

Or skip git entirely: vercel.com → **Add New → Project** → drag this whole folder in.

## After the meeting

- Replace the cropped brand-deck photography with real shop/product photography once
  it's shot — current images are placeholders pulled from the proposal deck.
- Swap in higher-resolution logo files if the agency has vector/print-ready versions
  (current logos were cropped from the PDF deck at deck resolution).
- If they like the direction: wire the contact form to actually send (Formspree or a
  Vercel serverless function), and build out the full collection/lookbook page.
