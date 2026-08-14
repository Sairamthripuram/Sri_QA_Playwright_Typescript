# Playwright Automation with TypeScript — Landing Page

A landing page for Sri QA Automation Academy's "Playwright Automation with
TypeScript" course, split into standard HTML / CSS / JS files.

## Files

```
project/
├── index.html          ← page structure & content
├── style.css            ← all styling, including the light/dark theme
├── script.js            ← theme toggle, scroll animations, enroll form logic
└── .vscode/
    └── settings.json    ← Live Server config (optional)
```

## How to run it in VS Code

1. Open this folder in VS Code: `File > Open Folder...`
2. Install the **Live Server** extension (one-time):
   - Extensions panel (`Ctrl+Shift+X` / `Cmd+Shift+X`)
   - Search "Live Server" by Ritwick Dey → Install
3. Right-click `index.html` in the file explorer → **"Open with Live Server"**
4. Your browser opens `http://127.0.0.1:5500/index.html` with the page live.
   Saving any edit to any of the three files auto-refreshes the browser.

**Without Live Server:** just double-click `index.html` — it opens directly in
your default browser and loads `style.css` / `script.js` automatically since
they're in the same folder.

## What's on the page

- Light/dark theme toggle (sun/moon switch in the header)
- Hero section with an animated code-editor mockup
- Curriculum list styled like a passing test suite (11 modules)
- "Why choose us" feature cards, pricing, and contact section
- An **Enroll** modal (triggered by any "Enroll" / "Reserve your seat" button)
  that collects Name, Mobile, and Email, validates them, then opens WhatsApp
  with the details pre-filled so the visitor just taps Send.

## Hosting this on GitHub Pages

1. Push this whole folder to a GitHub repo.
2. In the repo: **Settings → Pages → Source: Deploy from a branch → main /
   (root) → Save**.
3. After about a minute, your page is live at:
   `https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/`

Because the CSS and JS are separate files referenced by relative path
(`style.css`, `script.js`), this works exactly the same whether you open it
locally or host it on GitHub Pages — no changes needed either way.

## Before going live — things to check

- [ ] Confirm the WhatsApp number is correct. It's set near the top of
      `script.js`:
      ```js
      const WHATSAPP_NUMBER = '918247564178';
      ```
      Change this to the number you want enrollment messages sent to
      (country code + number, no `+` or spaces).
- [ ] Batch start date is currently set to **26 August** — update if it
      changes. Search for "26 Aug" in `index.html`.
- [ ] Test the enroll flow yourself: click Enroll → fill the form → submit →
      confirm WhatsApp opens with the right message and number.
- [ ] Toggle between light and dark theme and confirm both look right on
      your actual content before sharing the link.

## No installs required to just view it

These three files need nothing beyond a web browser. Fonts load from Google
Fonts' CDN automatically; there's no npm, no React, no build tooling
involved.
