# Module 7: Full-Scale Capstone Video Projects Lab (Refined)

> **Goal**: Combine the 52 motion primitives from Phases 1–3 into **6 cohesive, production-grade videos (15s–25s)**. Every project is designed around a **single unified visual language**, a **word-counted Qwen3-TTS voiceover script**, and a **beat-by-beat choreography table** so audio, camera, and motion lock together naturally.

---

## 🎙️ Voice-First Production Pipeline (Qwen3-TTS + Remotion)

In real motion design, **audio dictates pacing**. At a natural explainer pace (~145–155 words per minute), a **20-second video holds ~45–52 words** and a **25-second video holds ~58–65 words**. Trying to cram more than that forces animations to rush before the viewer can read.

```
[1. Word-Counted Script] ──> [2. Qwen3-TTS (.wav)] ──> [3. Measure Frames] ──> [4. Beat Sync & Ducking]
  (~150 WPM, clear beats)     (tools/tts/qwen_generate.py)  (duration * 30 fps)    (BGM 12% under voice + SFX)
```

### Standard Audio Setup per Project
1. Generate voiceover directly into the project (or `public/audio/`):
   ```bash
   uv --directory tools\tts run qwen_generate.py \
     --speaker Ryan \
     --instruct "Clear, confident, modern tech explainer narrator with crisp pacing." \
     --text "<SCRIPT>" \
     --out src/projects/<project-dir>/audio/voiceover.wav
   ```
2. Use the printed `frames @ 30fps` output to set `BEAT_FRAMES` in `constants.ts` (plus ~15–20 frames of breathing room at the start/end).
3. Layer `<Audio>` with volume ducking (BGM drops from `0.35` to `0.10` while voiceover plays) and subtle SFX (`whoosh`, `pop`, `click`) on spring peaks.

---

## 📋 The 6 Refined Capstone Blueprints

---

### Project 1: "PulseFlow" — SaaS Product Launch Reel (20s)
* **Aesthetic & Inspiration**: Linear / Raycast / Stripe dark glassmorphism (`#09090B` obsidian, `#6366F1` indigo, `#22D3EE` cyan, crisp `1px` `rgba(255,255,255,0.1)` borders).
* **Specs**: `1920x1080` (16:9), 30 FPS, ~600 frames.
* **Why this works**: Every scene shares the same dark obsidian glass UI system—no clashing styles.
* **Voiceover Script (~48 words, ~19s)**:
  > *"Deployments shouldn't take half your afternoon. Meet PulseFlow—automated pipelines built for speed. Watch build times drop by ten X with real-time observability, zero-config rollbacks, and instant edge previews. Ship your next release in one click."*

| Beat | Time | Spoken Cue | Visual & Camera Choreography | Techniques Combined |
| :--- | :--- | :--- | :--- | :--- |
| **1. Hook** | 0–4s | *"Deployments shouldn't take half your afternoon."* | Bold kinetic word reveal (`Practice 05`); a red strike-through line slices across `"half your afternoon"` as a subtle constellation mesh drifts behind. | Kinetic reveal, SVG stroke accent, Constellation Canvas (`Practice 42`) |
| **2. Product** | 4–10s | *"Meet PulseFlow—automated pipelines built for speed."* | `<TransitionSeries>` slide-up into a 3D WebGL tilted glass dashboard frame (`Practice 37`) with a diagonal specular glare sweep (`Practice 50`) revealing the live pipeline UI. | `<TransitionSeries>`, 3D WebGL (`@remotion/three`), Glass glare sweep |
| **3. Proof** | 10–16s | *"Watch build times drop by ten X with real-time observability..."* | Camera zooms into the dashboard's metric panel (`Practice 16`). A dual-series SVG area chart draws in (`Practice 29`) while the hero counter rolls to `10.4x` (`Practice 09`). | Camera zoom/pan, SVG Bezier area chart, Rolling number ticker |
| **4. CTA** | 16–20s | *"Ship your next release in one click."* | Cursor glides smoothly to the `"Deploy Now"` pill (`Practice 19`), executes anticipation press (`0.94x`), and triggers a deterministic confetti burst (`Practice 41`). | Cursor path + click spring, Deterministic Canvas confetti |

---

### Project 2: "Scaling a Bottleneck" — Continuous-Canvas DevOps Flow Explainer (25s) ⭐
* **Aesthetic & Inspiration**: ByteByteGo meets Vercel dark blueprint (`#0B1120` subtle dot-grid canvas, `#1E293B` glass nodes, `#38BDF8` sky, `#F43F5E` alert coral, `#10B981` healthy emerald).
* **Specs**: `1920x1080` (16:9), 30 FPS, ~750 frames.
* **Core Architectural Pattern**: **Zero scene cuts.** Everything lives on a **single persistent 2D world canvas** wrapped in a `<CameraRig>` (`x`, `y`, `scale`). As the narrator talks, new nodes spring into the topology, SVG connectors draw dynamically, inactive nodes dim to `0.45` opacity, and a **marching-ants dashed `<FocusBox />`** glides/resizes to lock onto whichever component is being discussed.
* **Voiceover Script (~62 words, ~24s)**:
  > *"Every growing app starts simple: a client, an API server, and one database. When traffic spikes, that database bottlenecks—latency hits four hundred eighty milliseconds. First, we add a Redis cache in front to absorb repeated reads. Next, we introduce a Kafka queue so heavy jobs run asynchronously. Result? Latency drops to eighteen milliseconds."*

| Beat | Time | Spoken Cue | Visual, Focus & Camera Choreography | Techniques Combined |
| :--- | :--- | :--- | :--- | :--- |
| **1. Baseline** | 0–5s | *"Every growing app starts simple: a client, an API server, and one database."* | Camera at `1.0x` centered. 3 nodes (`Client`, `API`, `Postgres DB`) pop in with staggered springs (`Practice 02`); SVG arrows draw left-to-right; steady blue data packets flow. | Staggered springs, SVG path draw-in, Traveling pulse packets (`Practice 47`) |
| **2. Bottleneck** | 5–10s | *"When traffic spikes, that database bottlenecks—latency hits 480ms."* | Packet rate triples. **Camera zooms to `1.45x` onto `Postgres DB`**. Marching-ants dashed `<FocusBox />` locks around `Postgres` in coral red; `Client` & `API` dim to `0.45`; latency pill spikes to `480ms`. | `<CameraRig>` zoom/pan (`Practice 16`), Marching-ants SVG `<FocusBox />`, Counter ticker |
| **3. Add Cache** | 10–16s | *"First, we add a Redis cache in front to absorb repeated reads."* | Camera pans/zooms (`1.3x`) to upper-center. `Redis Cache` node springs into place; a new dashed curved connector draws from `API` $\leftrightarrow$ `Redis`; `<FocusBox />` glides to `Redis` with `"Cache Hit: 92%"` badge. | Dynamic topology insertion, Animated `<FocusBox />` transition, Highlight arrow |
| **4. Add Queue** | 16–21s | *"Next, we introduce a Kafka queue so heavy jobs run asynchronously."* | Camera pans right (`1.25x`). `Kafka Queue` + `Worker Pool` stagger in; async dashed edges draw from `API` $\to$ `Kafka` $\to$ `Workers` with glowing amber pulse packets. | Staggered node cluster, Multi-branch packet routing |
| **5. Resolution** | 21–25s | *"Result? Latency drops to eighteen milliseconds."* | Camera smoothly pulls back to `1.0x` revealing the full healthy architecture. `<FocusBox />` fades; global latency counter drops `480ms` $\to$ `18ms` with an emerald checkmark draw-in (`Practice 14`). | Full-canvas pull-back, Emerald status checkmarks, Metric drop counter |

* **Key Reusable Components to Build**:
  * `CameraRig.tsx`: Interpolates `{ x, y, scale }` smoothly between beat keyframes.
  * `FocusBox.tsx`: Animated marching-ants dashed SVG rectangle (`strokeDashoffset` loop) that interpolates its `[x, y, width, height, color]` to frame the active node.
  * `ArchitectureNode.tsx`: Unified node card with icon, title, subtitle, live status badge, and dimmed/focused states.
  * `FlowEdge.tsx`: Bezier SVG connector supporting progressive draw-in, dashed/solid styles, directional arrowhead, and animated pulse packets.

---

### Project 3: "Async Bottleneck Fix" — Developer Code-to-Runtime Explainer (22s)
* **Aesthetic & Inspiration**: Fireship / Supabase high-contrast dev dark (`#0D1117`, `#F43F5E` error coral, `#10B981` emerald, JetBrains Mono).
* **Specs**: `1920x1080` (16:9), 30 FPS, ~660 frames.
* **Why this works**: Fixes the narrative jump—instead of a random car speedometer, the zoom-dive lands on a **parallel execution throughput gauge & async timeline**.
* **Voiceover Script (~53 words, ~21s)**:
  > *"Sequential awaits are silently killing your API response times. Look at this loop—each request blocks the next. Swap it for Promise dot all, and every call fires in parallel. Same data, zero extra infrastructure, and your endpoint throughput jumps straight to ninety-nine percent."*

| Beat | Time | Spoken Cue | Visual & Camera Choreography | Techniques Combined |
| :--- | :--- | :--- | :--- | :--- |
| **1. Crash Hook** | 0–5s | *"Sequential awaits are silently killing your API response times."* | Retro CRT terminal (`Practice 51`) with subtle scanlines shows sequential `await` waterfall bars timing out (`2,400ms`), ending in a crisp 7-frame RGB glitch cut (`Practice 36`). | CRT scanlines & flicker, RGB split glitch cut |
| **2. Code Fix** | 5–12s | *"Look at this loop... Swap it for Promise.all..."* | Dark VS Code window reveals lines sequentially (`Practice 26`). Active-line highlight glides to the `for...await` line (red highlight), then crossfades to `await Promise.all(...)` (emerald highlight). | Syntax-highlighted staggered reveal, Active-line tracker |
| **3. Dive** | 12–16s | *"...and every call fires in parallel."* | Camera performs an exponential zoom dive (`Practice 34`) straight into `Promise.all([ ... ])`, seamlessly crossfading into 4 parallel execution lanes firing simultaneously. | Exponential zoom-through, Parallel spring bars |
| **4. Score** | 16–22s | *"...throughput jumps straight to ninety-nine percent."* | Radial performance gauge (`Practice 30`) sweeps from `24` to `99` with realistic needle inertia overshoot and glowing emerald arc. | Polar radial gauge, Inertial needle spring |

---

### Project 4: "2026 Dev Rewind" — Vertical Mobile Data Story (18s)
* **Aesthetic & Inspiration**: Spotify Wrapped / Duolingo vibrant dark neon (`#0F0720`, `#A855F7` violet, `#EC4899` hot pink, `#FACC15` gold).
* **Specs**: `1080x1920` (9:16 Vertical), 30 FPS, ~540 frames (respecting top/bottom mobile safe zones).
* **Voiceover Script (~44 words, ~17s)**:
  > *"Your twenty twenty-six developer rewind is in. You shipped code on three hundred twelve days, and TypeScript officially overtook React as your number-one tool. Here's your year in motion—let's see what you build next."*

| Beat | Time | Spoken Cue | Visual & Camera Choreography | Techniques Combined |
| :--- | :--- | :--- | :--- | :--- |
| **1. Hook** | 0–4s | *"Your 2026 developer rewind is in."* | Energetic kinetic text wave (`Practice 27`) + animated karaoke pill tracking each spoken word (`Practice 28`) over a dark violet canvas. | Kinetic character wave, Karaoke word pill tracker |
| **2. Pulse** | 4–8s | *"You shipped code on 312 days..."* | Central audio-reactive particle orb (`Practice 43`) pulses directly to the voiceover's frequency spectrum while `312 DAYS` ticks up in the center. | `visualizeAudio` Canvas particle orb, Metric counter |
| **3. Rank Swap** | 8–13s | *"...and TypeScript officially overtook React..."* | Top-4 stack leaderboard (`React`, `TypeScript`, `Python`, `Rust`). `TypeScript` surges in score and smoothly swaps Y-positions above `React` with z-index elevation (`Practice 31`). | Layout spring rank swap, Z-index card elevation |
| **4. Heatmap** | 13–18s | *"Here's your year in motion—let's see what you build next."* | A 7x20 contribution heatmap matrix ripples in along a diagonal Manhattan-distance wave (`Practice 32`), topped with a final `TOP 1% BUILDER` badge pop. | 2D Manhattan wave heatmap, Spring badge pop |

---

### Project 5: "Nexus-4 Benchmark" — AI Model Keynote Reveal (22s)
* **Aesthetic & Inspiration**: Apple Intelligence / Google DeepMind obsidian (`#050507`, iridescent cyan-violet gradients, ultra-clean geometric sans).
* **Specs**: `1920x1080` (16:9), 30 FPS, ~660 frames.
* **Voiceover Script (~52 words, ~21s)**:
  > *"Introducing Nexus Four—engineered for reasoning at scale. On complex coding and math benchmarks, Nexus Four outperforms prior-generation models across every tier, delivering ninety-four percent accuracy at half the latency. Intelligence, distilled."*

| Beat | Time | Spoken Cue | Visual & Camera Choreography | Techniques Combined |
| :--- | :--- | :--- | :--- | :--- |
| **1. Ambient AI** | 0–5s | *"Introducing Nexus Four—engineered for reasoning at scale."* | 3 overlapping Simplex noise glowing ribbons (`Practice 46`) undulate smoothly behind a clean masked typography reveal (`Practice 06`). | Simplex noise ribbons, Masked slide-up text |
| **2. Stage Shift** | 5–10s | *"On complex coding and math benchmarks..."* | 3D isometric stage rotates 90 degrees around its Y-axis (`Practice 35`) with directional face shading, transitioning from the title face into the benchmark arena. | 3D CSS `preserve-3d` stage rotation |
| **3. 3D Bars** | 10–17s | *"...outperforms prior-generation models... 94% accuracy..."* | 4 extruded 3D WebGL data pillars (`Practice 40`) rise from a reflective grid floor plane casting soft shadows, with floating `94%` callout badges above the winning bar. | 3D WebGL extruded bars + shadows, Staggered callouts |
| **4. Outro** | 17–22s | *"...at half the latency. Intelligence, distilled."* | Multi-plane parallax pan (`Practice 33`) glides across summary KPI cards with subtle foreground depth-of-field blur before locking onto the final mark. | 3-plane optical parallax pan, Foreground blur |

---

### Project 6: "AutoBrief" — Data-Driven Parametric Video Engine (15s)
* **Aesthetic & Inspiration**: Clean B2B SaaS executive summary (`#0F172A` slate, dynamic `brandColor` injected from JSON props).
* **Specs**: `1920x1080` (16:9), 30 FPS, **dynamic `durationInFrames` via `calculateMetadata`**.
* **Why this is a true capstone**: Zero hardcoded text, numbers, or path strings. Any JSON payload generates a valid, properly timed video via CLI:
  ```bash
  bun run remotion:render AutoBrief out/acme-q4.mp4 --props=./data/acme-q4.json
  ```
* **Typed Zod Schema**:
  ```tsx
  export const AutoBriefSchema = z.object({
    companyName: z.string(),
    periodLabel: z.string(),
    brandColor: z.string(),
    headlineMetric: z.object({ label: z.string(), value: z.number(), suffix: z.string() }),
    trendPoints: z.array(z.number()).min(4).max(12),
    highlights: z.array(z.string()).min(2).max(4),
  });
  ```
* **Skills Combined**:
  * Zod schema validation & Remotion Studio visual prop editing
  * `calculateMetadata` computing total duration from `highlights.length` (or audio file length)
  * Algorithmic SVG smooth Bezier path builder from arbitrary `trendPoints: number[]`
  * Dynamic WCAG-safe accent tinting from `brandColor`

---

## 🛠️ Recommended Build Order

1. **Start with Project 2 ("Scaling a Bottleneck" DevOps Explainer)** — It directly exercises your custom continuous-canvas + active-focus requirement and pairs naturally with Qwen3-TTS narration.
2. **Next, Project 1 ("PulseFlow" SaaS Launch)** or **Project 3 ("Async Bottleneck Fix")** — Deepens WebGL + Code + `<TransitionSeries>` orchestration.
3. **Then Project 4 (Vertical Mobile)**, **Project 5 (3D AI Keynote)**, and **Project 6 (Parametric Engine)**.
