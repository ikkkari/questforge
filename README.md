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

- One page, seven numbered panels: Player Profile (I), Adventure Statistics (II), Forge a New Quest (III), Quest Board (IV), Chronicles (V), Adventurer's Streak (VI), Adventurer's Feedback (VII).
- A sticky jump bar between the header and the panels links to `#panel-profile`, `#panel-board`, `#panel-streak` and `#panel-feedback`.
- The Quest Board carries its own tools: a search field (`questSearch`) with a `/` hint, four filter tabs showing live counts, and list actions for overdue quests and completed quests.
- Nine inline handlers — `toggleSound()`, `addTask()`, four `setFilter()` calls, `rescheduleOverdue()`, `clearCompleted()`, `closeLevelUpModal()` — plus `oninput="setSearch(this.value)"` on the search field.
- Fonts (Cinzel, Inter) come from Google Fonts and load without blocking: `media="print"` swapped to `all` on load, with a `<noscript>` fallback, so a slow font CDN never delays the script.
- Every element the script touches has an ID (`taskInput`, `dueInput`, `questSearch`, `taskList`, `progressBar`, `levelUpModal`, …). The favicon is an inline SVG data URI.

## CSS — `style.css`

- Palette tokens at the top: obsidian `#111018`, iron `#1C1926`, silver `#A9A6B2`, gold `#D9B56D`, purple `#8054B8`, moon `#E8E2F0`, plus ember accents for the streak flame.
- Components: panels, level orb, gold-to-purple XP bar, difficulty badges, due-date chips, filter tabs and counts, inline editor, jump bar, search field, streak panel (flame, week grid, milestones), feedback form, toasts, back-to-top, level-up modal, rank ladder, achievement tiles.
- Breakpoints at 1240px, 1080px, 720px and 560px; a `prefers-reduced-motion` block disables transitions, the crest animation, smooth scrolling and confetti.

## JavaScript — `script.js`

- `renderTasks()` is the single render entry point; every action ends by calling it.
- Quests: add (with an optional due date), complete, delete, inline edit (name, difficulty and due date), filter by All / Today / In Progress / Completed, search by name, clear completed, and move every overdue quest to today in one click.
- Rewards: `DIFFICULTY` (easy 10 / medium 20 / hard 50 XP); 100 XP levels up and carries the remainder.
- Streak: `recordStreakDay()` credits one day per local calendar date, keeps the best run and a seven-day history, and pays the 3 / 7 / 14 / 30-day milestones (20 / 50 / 100 / 250 XP) once each through the same XP and level maths.
- Due dates: an optional `due` calendar day per quest. Dated quests sort soonest-first with undated quests last; chips read `2 days overdue`, `Due today` or `Due Nov 16`. The Today filter covers anything due today or earlier and still unfinished.
- Navigation: `initJumpBar()` marks the section under the reading line, `initBackToTop()` reveals the return control past 600px, `initSearchShortcut()` binds `/` and `Escape`.
- Feedback: `initFeedbackForm()` posts a urlencoded form to `/` with its form name and a honeypot, and only shows success when the response is ok.
- Adventurer name: `startRename()` / `saveName()` edit the name shown in the Player Profile. It lives on its own key, so renaming never disturbs quests, XP, level or the streak.
- Celebration: `playLevelUpSound()` (Web Audio, four notes), `triggerConfetti()` (canvas, 80 particles, ~3s), `showLevelUpModal()`.
- Progress display: `RANKS` and `ACHIEVEMENTS` are derived from `level`, `xp` and `quests` at render time — nothing extra is stored.

## LocalStorage

Six keys, read on load and written by `saveProgress()`, `saveStreak()` and the rename form:

| Key | Value |
| --- | --- |
| `quests` | `[{ name, difficulty, completed, due? }]` |
| `xp` | number, 0–99 |
| `level` | number, starts at 1 |
| `soundEnabled` | `"true"` / `"false"` |
| `playerName` | display name, up to 24 characters (defaults to "Dark Knight") |
| `streak` | `{ current, best, lastActivity, days[], claimed[], version }` |

`due` is optional, so journals saved before due dates existed keep working untouched. `streak` is created on the first completion; `days[]` holds the local dates with a credit, and `claimed[]` prevents a milestone paying twice.

Data is per browser and per origin — a new domain starts empty, and nothing is synced between devices. "Today" is whatever the device's local calendar says.

## Netlify deployment

- Static site, no build command needed beyond copying the three files into `deploy/`.
- `netlify.toml` sets `publish = "deploy"` and rebuilds that folder from source.
- `.github/workflows/deploy-netlify.yml` deploys on push to `main`/`master` via `netlify-cli@27`; needs `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID` repository secrets.
- The feedback form uses Netlify Forms: submissions appear under Forms → `adventurer-feedback` on the deployed site. The free plan covers 100 submissions per month. Off Netlify (or on a plain static server) the POST fails and the form shows its error state instead of a false success.
- Manual alternatives: drag `deploy/` or `questforge-netlify.zip` onto app.netlify.com/drop.

## Local-only files

`deploy/`, `questforge-netlify.zip` and `.netlify/` are in `.gitignore`. `artifacts/` (verification screenshots) and `*.bundle` files are working artefacts for handover — the site does not need them.
