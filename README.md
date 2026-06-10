# AFSA Interactive Toolkit

An interactive companion to the **Agroecological Food System Assessment (AFSA) Guidebook and Toolbox** for CAT landscape-level transformation. Built for fellow organizations taking a landscape approach to food-system transformation — it turns the guidebook into a hands-on, explorable knowledge product with a complete worked example.

**Live:** https://afsa-toolkit.vercel.app

---

## What it is

AFSA is a participatory methodology grounded in the **13 principles of agroecology**. This site walks practitioners through the whole method:

> 13 field tools → score the 13 principles → radar "health compass" → low scores seed a causal loop diagram → most-connected node = leverage point → community visioning

Every tool and every score is illustrated with **Khetlapur**, a *fictional composite landscape* (a rainfed eastern-India-style watershed cluster) assembled purely for learning. It is not a real place.

## Pages

| Route | What it does |
|-------|--------------|
| `/` | Hero + the six-step synthesis chain |
| `/framework` | Interactive explorer of the 13 principles (rubric anchors, Khetlapur scores) + tool×principle triangulation matrix |
| `/journey` | Phase timeline (Pre-phase → Scoping → Diagnosing → Visioning) + stratified-sampling calculator |
| `/tools/[slug]` | 14 tool pages on a shared template, each with a Khetlapur interactive and a printable field template |
| `/resources` | Field templates index, external links, credits |

The two centrepieces are `/tools/scorecard` (live-updating 13-axis radar) and `/tools/causal-loop` (clickable causal loop diagram with a pulsing leverage point).

## Tech

- **Next.js 16** (App Router) as a **static export** (`output: "export"`) — no backend, deployable anywhere
- **Tailwind CSS v4** with the official CAT brand palette as design tokens (`app/globals.css`)
- **TypeScript**, fonts Figtree (display) + Inter (body)
- All interactives are hand-built SVG/React — no chart library

## Architecture — where to make changes

All content lives in plain data files under `data/`. **To edit content you almost never touch a component.**

```
data/
  principles.ts   # the 13 agroecology principles (rubric anchors, clusters, tool links)
  phases.ts       # the 4 phases (objectives, tool ordering, colour coding)
  tools.ts        # all 14 tools (purpose, method, discussion, print-template columns)
  khetlapur.ts    # the entire worked-example dataset (scores, stakeholders, CLD, etc.)

components/
  PrinciplesExplorer.tsx, ToolMatrix.tsx, ToolInteractive.tsx (registry), ...
  interactives/   # one component per tool's hands-on demo

app/
  page.tsx, framework/, journey/, resources/, tools/[slug]/
```

### Common edits
- **Change a Khetlapur number/quote** → edit `data/khetlapur.ts`
- **Reword a tool's method or add a discussion prompt** → edit `data/tools.ts`
- **Adjust a principle's rubric** → edit `data/principles.ts`
- **Add a new interactive** → create `components/interactives/Foo.tsx`, register it in `components/ToolInteractive.tsx`, reference its id from the tool's `interactive` field in `data/tools.ts`

### Translation (Hindi / Bangla / Nepali)
Content is fully separated from layout, so a translation is a copy of the `data/` files with strings swapped — no component changes required.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export → ./out
```

> Note: this project uses Next.js 16. See `AGENTS.md` — check `node_modules/next/dist/docs/` for the version's conventions rather than assuming older APIs.

## Credits

Interactive companion to the AFSA Guidebook developed by **Anshuman Das and Divya Veluguri**, adapted from Welthungerhilfe's Food System Transformation Framework, with input from WHH, WASSAN, Pragati, LI-BIRD (Nepal), ANSAB (Nepal), FIVDB (Bangladesh), WAVE Foundation (Bangladesh) and community members. Supported by Welthungerhilfe.

The worked example "Khetlapur" is fictional and created for learning purposes only.
