# CLAUDE.md

Notes for working in this repo, learned while integrating a new blog post.

## Adding a new blog post

Each post lives in `src/blog/<slug>/index.mdx` (slug = folder name = URL route). Conventions to follow, based on existing posts:

- **Title**: first line, plain `# Title` — no markdown link, even if the source draft has one (e.g. a link to the originating chat share). Keep the link, if any, as a small `*Original conversation: [...]*` line at the bottom instead.
- **Date**: `<date>DD MMM YYYY</date>` right after the title. Required — `scripts/refreshBlogRegistry.js` throws if it's missing or unparseable.
- **Raw source markdown**: if a plain `.md` draft was provided, keep it alongside `index.mdx` in the same folder (e.g. `<slug>/<slug>.md`) rather than deleting it — matches the pattern in `spring-loaded-dinosaurs/`.
- **Headings referenced by an in-page TOC**: MDX here has no `rehype-slug`, so `## Heading` does **not** get an auto `id`. Any heading a TOC/anchor link points to must be written explicitly as `<h2 id="some-slug">Heading</h2>` (see `sort-of-perpetual-motion-machine/index.mdx` for prior art). Headings nobody links to can stay as plain `##`/`###`.
- **Tables**: there's no `remark-gfm`, so pipe-table syntax does not render. Use Mantine's `<Table striped highlightOnHover withBorder withColumnBorders>` with raw `<thead>/<tbody>/<tr>/<td>` JSX instead, and `import { Table } from '@mantine/core';` at the top of the file.
- **Code/diagram fenced blocks**: always give the fence a language tag, even for ASCII diagrams or pseudocode with no real grammar — e.g. ` ```txt `. Untagged ` ``` ` blocks render as plain unstyled text; only `pre`/`code` elements with a `language-*` class pick up the dark Prism theme (`src/components/BlogShell/prism-vsc-dark-plus.css`) via the highlight worker (`src/highlight-worker.js`). The worker only has `json`, `python`, `yaml`, `bash` (and core `markup`) actually tokenized — other tags like `txt` still get the dark-box styling via the CSS class selector, they just won't have colored tokens (Prism silently no-ops on unknown languages rather than erroring).

## After adding/editing a post

Run these from the repo root (needs `node_modules` installed — see below):

```bash
node scripts/refreshBlogRegistry.js   # rewrites src/components/BlogShell/blog-registry.js from every src/blog/**/index.mdx
node scripts/generateRssFeed.js       # rewrites public/rss.xml and public/sitemap.xml from the registry
```

Then regenerate PDFs (requires the dev server running on localhost:3000 and Python + Playwright):

```bash
pip install playwright
python -m playwright install chromium
python scripts/generate_blog_pdfs.py
```

`generate_blog_pdfs.py` skips any slug that already has a PDF in `public/pdfs/`, so it's safe/cheap to rerun — it only generates what's missing, then rebuilds `all-blog-pdfs.zip` and `public/pdfs/index.html`.

Note: on Windows, `python scripts/generate_blog_pdfs.py` can crash with `UnicodeEncodeError` on the ✓/✗ characters the script prints, because the console defaults to cp1252. Run with `PYTHONIOENCODING=utf-8` prefixed.

## Local dev environment

- Package manager is `bun` (see `bun.lock`), not npm/yarn — use `bun install` / `bun run start`.
- Dev server: `bun run start` → `craco start` on port 3000 (see `.claude/launch.json`, name `website`).
- If `node_modules` is missing/incomplete, a first `bun install` can spuriously fail with `EBUSY`/`ENOENT` "failed copying files from cache" errors if run twice concurrently (e.g. once in background, once foreground) — they collide over the same cache. Let one finish, then a clean rerun of `bun install` succeeds fast (it becomes an incremental install).
- `python`/`pip` work directly; `python3` is a Windows Store stub that fails with "Python was not found" — use `python`.

## Deploy

Pushing to `main` triggers the "Deploy to Firebase Hosting on merge" GitHub Action, which builds and deploys to `ad-absurdum.me` automatically — no manual deploy step needed. It's a client-rendered SPA, so `curl`ing a route just returns the shell HTML; verify a specific post is live by loading it in a real/headless browser and checking rendered text, not by grepping the raw HTTP response.
