# Remotion Mastery: Crash Course for Motion Graphics & AI Prompting

A concept-first crash course designed for developers transitioning from Python/general programming to programmatic video generation with Remotion. 

Focus: **Mental models, video architecture, animation math, and prompt engineering for AI coding agents.**

---

## Course Progress & Index

| Module | Title | Status | Key Concepts & Outcomes |
| :--- | :--- | :---: | :--- |
| **[Module 0](./module-0-react-ts-refresher.md)** | **React & TypeScript Refresher for Video** | ✅ Completed | JSX mental model, props & interfaces, Python-to-TS analogies, functional thinking, avoiding state pitfall. |
| **[Module 1](./module-1-core-mental-model.md)** | **The Core Mental Model (React $\to$ Video)** | ✅ Completed | Deterministic frame rendering, headless Chromium + FFmpeg, Composition hierarchy, `useCurrentFrame()`, $f(\text{frame}) = \text{Visual State}$. |
| **[Module 2](./module-2-animation-primitives.md)** | **Animation Primitives & Math** | ✅ Completed | `interpolate()` ranges & extrapolation, spring physics vs linear lerp, easing curves, staggering, motion pacing. |
| **[Module 3](./module-3-composition-and-sequencing.md)** | **Composition, Sequencing & Time Architecture** | ✅ Completed | `<Sequence>` and relative time, `<Series>` chaining, modular infographic component architecture, parameterized timing props. |
| **[Module 4](./module-4-infographics-and-data-viz.md)** | **Infographics & Data Visualization** | ✅ Completed | Dynamic number counters, SVG path animations (`strokeDashoffset`), animated charts/bars, kinetic typography & text reveals. |
| **[Module 5](./module-5-media-assets-and-audio.md)** | **Assets, Media & Audio Synchronization** | ✅ Completed | `staticFile()`, asset preloading (`delayRender`/`continueRender`), SFX sync, audio ducking, waveform visualization fundamentals. |
| **[Module 6](./module-6-micro-projects-lab.md)** | **Hands-On Micro-Projects & Motion Katas** | ⏳ In Progress | 24 isolated visual katas across 6 categories (Animation, Typography, Charts, Transitions, UI, Audio) with real MP4 renders. |
| **[Module 7](./module-7-ai-prompting-and-best-practices.md)** | **AI Prompt Engineering & Code Review** | ⏳ Planned | Motion design prompt scaffolds, reviewing AI-generated Remotion code, spotting anti-patterns, parameterization via `inputProps`. |

---

## Module Breakdown & Details

### [Module 0: React & TypeScript Refresher (The Video Perspective)](./module-0-react-ts-refresher.md)
* Python vs. TypeScript Mental Translation.
* JSX as Programmatic Canvas (`React.createElement`).
* Props & Component Decomposition.
* Functional Purity for Video (Strict elimination of timers, state-based animations, and CSS transitions).

### [Module 1: The Core Mental Model (React $\to$ Video)](./module-1-core-mental-model.md)
* Headless Chromium parallel workers + FFmpeg pipeline.
* Determinism: $f(\text{frame}, \text{props}) \to \text{Visual State}$.
* The 3-Tier Hierarchy: Root $\to$ Composition $\to$ Component.
* Safe Zones, Resolution Standards, and $Frames = Seconds \times FPS$.

### [Module 2: The Animation Primitives (Math & Interpolation)](./module-2-animation-primitives.md)
* `interpolate()` piecewise mapping & why `{ extrapolate: 'clamp' }` is mandatory.
* `spring()` physics parameters (`damping`, `mass`, `stiffness`, `overshootClamping`).
* Motion Graphics Staggering: `frame - (index * delay)`.

### [Module 3: Composition, Sequencing & Time Architecture](./module-3-composition-and-sequencing.md)
* `<Sequence>` and relative local time scoping.
* `<Series>` automatic linear chaining without manual math.
* Negative offsets for seamless crossfade and slide transitions.

### [Module 4: Infographics & Data Visualization](./module-4-infographics-and-data-viz.md)
* Dynamic Number Rollups with `Intl.NumberFormat`.
* SVG `strokeDasharray` and `strokeDashoffset` for line drawings & circular progress dials.
* Animated Bar Charts with bounded springs.
* Kinetic Typography: Word-by-word reveals and typewriter effects.

### [Module 5: Assets, Media & Audio Synchronization](./module-5-media-assets-and-audio.md)
* Asset handling via `public/` and `staticFile()`.
* Asynchronous preloading with `delayRender()` and `continueRender()`.
* Frame-precise sound effect synchronization.
* Audio Ducking: Animating background music volume around speech.

### [Module 6: Hands-On Micro-Projects & Motion Katas](./module-6-micro-projects-lab.md)
* **Category A (Animation & Physics)**: Apple-style stat cards, cascades, multi-stage banners, anticipation motion.
* **Category B (Typography)**: Kinetic word reveals, masked text, terminal typewriter, dynamic highlighter.
* **Category C (Infographics & Data)**: Rolling counters, line chart draw-ins, pulsing callouts, bar comparisons, circular dials, feature matrices.
* **Category D (Transitions & Camera)**: Push transitions, dynamic camera zoom, 3D card flips, screen wipes.
* **Category E (UI & Product Motion)**: Cursor click interactions, notification toasts, ambient floating badges.
* **Category F (Sound & Audio)**: SFX-synced cascades, audio waveform equalizers, full promo teaser.

### [Module 7: AI Prompt Engineering & Code Review](./module-7-ai-prompting-and-best-practices.md)
* Declarative motion design prompt templates for LLMs.
* The 10-point code review checklist for AI-generated Remotion code.
* Automation, batch rendering, and dynamic `inputProps`.

---
*Created as a living index. Updated as modules complete.*
