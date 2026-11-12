# Questforge — The Dark Knight's Journal

A single-page quest tracker. Plain HTML, CSS and JavaScript — no build step, no dependencies.

```
index.html   markup and inline handlers
style.css    all styling (design tokens, layout, animations)
script.js    all behaviour and data
netlify.toml Netlify publish config
.github/workflows/deploy-netlify.yml   push-to-deploy
```

## HTML — `index.html`

- One page, five numbered panels: Player Profile (I), Adventure Statistics (II), Forge a New Quest (III), Quest Board (IV), Chronicles (V).
- Every element the script touches has an ID (`taskInput`, `taskList`, `progressBar`, `levelUpModal`, …).
- Seven inline handlers: `toggleSound()`, `addTask()`, three `setFilter()` calls, `clearCompleted()`, `closeLevelUpModal()`.
- Fonts (Cinzel, Inter) from Google Fonts; the favicon is an inline SVG data URI.

## CSS — `style.css`

- Palette tokens at the top: obsidian `#111018`, iron `#1C1926`, silver `#A9A6B2`, gold `#D9B56D`, purple `#8054B8`, moon `#E8E2F0`.
- Components: panels, level orb, gold-to-purple XP bar, difficulty badges, filter tabs, inline editor, level-up modal, rank ladder, achievement tiles.
- Breakpoints at 1080px, 720px and 560px; a `prefers-reduced-motion` block disables transitions, the crest animation and confetti.

## JavaScript — `script.js`

- `renderTasks()` is the single render entry point; every action ends by calling it.
- Quests: add, complete, delete, inline edit (name + difficulty), filter, clear completed.
- Rewards: `DIFFICULTY` (easy 10 / medium 20 / hard 50 XP); 100 XP levels up and carries the remainder.
- Celebration: `playLevelUpSound()` (Web Audio, four notes), `triggerConfetti()` (canvas, 80 particles, ~3s), `showLevelUpModal()`.
- Progress display: `RANKS` and `ACHIEVEMENTS` are derived from `level`, `xp` and `quests` at render time — nothing extra is stored.

## LocalStorage

Four keys, saved by `saveProgress()` and read on load:

| Key | Value |
| --- | --- |
| `quests` | `[{ name, difficulty, completed }]` |
| `xp` | number, 0–99 |
| `level` | number, starts at 1 |
| `soundEnabled` | `"true"` / `"false"` |

Data is per browser and per origin — a new domain starts empty. The quest shape is unchanged from the original app, so existing saves keep working.

## Netlify deployment

- Static site, no build command needed beyond copying the three files into `deploy/`.
- `netlify.toml` sets `publish = "deploy"` and rebuilds that folder from source.
- `.github/workflows/deploy-netlify.yml` deploys on push to `main`/`master` via `netlify-cli@27`; needs `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID` repository secrets.
- Manual alternatives: drag `deploy/` or `questforge-netlify.zip` onto app.netlify.com/drop.

## Ignored

`deploy/`, `questforge-netlify.zip`, `artifacts/` (verification screenshots) and `.netlify/` (local CLI state).
