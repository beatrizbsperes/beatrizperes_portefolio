# beatrizbsperes.github.io

ePortfolio of **Beatriz Peres** — geospatial engineer and Earth observation researcher.

A single-page site built for fast scanning: profile, current research (MSc thesis on the spatial
and temporal transferability of geospatial foundation models, IRISA/Obelix), experience from
commercial LiDAR survey through to research code, a filterable project grid, technical skills,
education and credentials.

## Structure

| File | Contents |
|---|---|
| `index.html` | The whole site — hero, about, research, experience, projects, community, skills, education, contact |
| `styles.css` | Design tokens, layout and components; light and dark themes |
| `main.js` | Theme toggle, mobile nav, scroll-spy, scroll progress, project filter, reveal-on-scroll |
| `images/` | Figures, photographs and logos |
| `images/web/` | Web-sized copies of the large photographs (generated with `sips -Z 1200`) |
| `certificates/` | CV, certificates and coursework reports linked from the page |
| `this_is_me.md` | Master profile — the source all site copy is written from. Git-ignored, kept local |

Static HTML with no build step. Open `index.html` directly, or serve the folder:

```sh
python3 -m http.server 8000   # then visit http://localhost:8000
```

Published with GitHub Pages.

## Notes for editing

- **Content source.** Every claim on the page comes from `this_is_me.md`. Update that file first,
  then mirror the change into `index.html`.
- **Projects.** Each card is an `<article class="p-card" data-cat="...">`. The `data-cat` tokens
  (`ml`, `eo`, `scale`, `survey`, `risk`) drive the filter buttons — a card can carry several.
  Adding a card needs no JS change; the "All" count updates itself.
- **Theme.** Colours are CSS custom properties on `:root` and `:root[data-theme="dark"]`. The site
  follows the visitor's system preference until they use the toggle, which is remembered in
  `localStorage`.
- **Images.** Keep large photographs out of the page: resize into `images/web/` first
  (`sips -Z 1200 images/foo.jpg --out images/web/foo.jpg`).

Design: warm off-white paper, ink typography, terracotta accent with a deep teal for research
figures. Fraunces for display, Inter for text, JetBrains Mono for labels — via Google Fonts.
