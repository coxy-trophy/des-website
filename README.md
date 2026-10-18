# des-website

The website for [DEs-UI](https://github.com/coxy-trophy/des-ui), a sci-fi terminal
desktop for Linux.

It is one page, drawn in the desktop's own look (Signal): the same greys, the same
two typefaces, one accent. The desktop at the top is not a recording. It is the
interface rebuilt in React, with a terminal that answers, the launcher, the
settings, toasts and the lock screen.

## Run it

Use Node.js 22.12 or newer and pnpm 11.0.0 (pinned in `package.json`). Install
pnpm with your usual package-manager setup, or use `corepack enable` where available.
The dependency install must succeed before the build is meaningful. In a restricted
environment, use a writable pnpm store/cache and allow registry access; do not
replace missing Vite types with stubs or relax the TypeScript checks.

    pnpm install --frozen-lockfile
    pnpm dev        # http://localhost:5173
    pnpm build      # type-checks, then writes dist/

React 19, Vite 8 and TypeScript 7, with no other runtime dependencies. The styles
are plain CSS.

## Layout

- `src/components/desktop/` — the live desktop: `Desktop.tsx` (the frame and its
  state), `panels.tsx` (the side columns), `Globe.tsx` (a port of
  `shell/src/globe.rs`), `shell.ts` (the pretend shell and its files)
- `src/components/` — one file per section of the page
- `src/lib/data.ts` — the words: keys, features, what is not done, install steps
- `src/lib/accent.tsx` — the accent colour, which the whole page follows
- `src/styles/` — `base.css` (the Signal tokens), `site.css`, `desktop.css`
- `src/assets/shots/` — screenshots, copied from `des-ui/docs/screenshots/`

When DEs-UI changes, `src/lib/data.ts` and the screenshots are what to bring up to
date.

Pull requests run the same frozen dependency install and production build in a
read-only-permission CI workflow. Publishing runs separately after a push to main.

## Publishing

`.github/workflows/deploy.yml` builds the site and publishes it to GitHub Pages on
every push to `main`, once Pages is set to "GitHub Actions" in the repository's
settings. The build uses relative paths, so it works at a domain's root and under
`/des-website/` alike.

## Licence

MIT; see `LICENSE`. The typefaces, Chakra Petch and JetBrains Mono
(`src/assets/fonts/`), are under the SIL Open Font License.
