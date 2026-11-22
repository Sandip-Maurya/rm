# Module 1 (Deep Dive): The Core Mental Model (React $\to$ Video)

> **Goal**: Build an unshakeable architectural intuition for how Remotion operates so you can critically analyze, debug, and direct AI coding agents producing programmatic motion graphics.

---

## 1. The Rendering Engine: Headless Chromium + FFmpeg

To understand why Remotion behaves the way it does, we must trace what happens from the moment you hit render to the moment you get an `.mp4` file.

```
+───────────────────────────────────────────────────────────────────────────────+
|                               Remotion CLI / API                              |
|   1. Spawns Webpack / Vite bundler to compile your React / TSX code.          |
|   2. Launches a pool of headless Chromium browser instances (Puppeteer).      |
+───────────────────────────────────────────────────────────────────────────────+
                                        │
           ┌────────────────────────────┼────────────────────────────┐
           ▼ (Thread 1)                 ▼ (Thread 2)                 ▼ (Thread 4)
  Chromium Worker #1           Chromium Worker #2           Chromium Worker #4
  Evaluates frames:            Evaluates frames:            Evaluates frames:
  [0, 1, 2, ... 45]            [46, 47, 48, ... 90]         [136, 137, ... 180]
           │                            │                            │
           └────────────────────────────┼────────────────────────────┘
                                        ▼ (Raw pixel buffer / PNG stream)
+───────────────────────────────────────────────────────────────────────────────+
|                                FFmpeg Process                                 |
|   Receives ordered pixel frames piped via stdin/pipes into an H.264/ProRes    |
|   video stream, muxes the audio track, and writes the output container.       |
+───────────────────────────────────────────────────────────────────────────────+
```

### Why Understanding This Pipeline Protects You From Bugs

1. **Parallel Execution & Non-Linear Evaluation**:
   Chromium Worker #4 might process frame `150` *before* Worker #1 processes frame `10`. If any logic in your components relies on state mutation (e.g., an external variable accumulating: `let counter = 0; counter += 1`), the output will be chaotic garbage.

2. **No Hardware Audio Playing During Render**:
   Chromium doesn't "play" audio through your speakers during rendering. Instead, Remotion computes audio volume, pitch, and panning mathematically frame-by-frame and tells FFmpeg to mux the audio file at the exact millisecond offsets.

3. **CPU Time $\neq$ Video Time**:
   Rendering a single 4K frame with heavy SVG graphs might take **300 milliseconds of actual CPU compute time**. But in the video, that frame represents only **33.3 milliseconds** ($1/30\text{th}$ of a second). Any browser feature that measures real-world wall-clock time (`Date.now()`, `performance.now()`, `requestAnimationFrame`, CSS transitions) will utterly fail.

---

## 2. Determinism: $f(\text{frame}) = \text{Visual State}$

In computer science, a **pure function** has no side-effects and always returns the same output for the same input.

Remotion turns your entire React component tree into a single pure mathematical function:

$$\text{Canvas}(\text{frame}, \text{props}) \longrightarrow \text{Pixels}$$

```
                ┌──────────────┐
  frame: 45 ───>│              │
                │ MyComponent  │ ───>  [Exact Visual Tree at 1.50s]
  props: {...} ─>│              │
                └──────────────┘
```

### The "Time Machine" Rule
At any moment in the Remotion Preview Studio, you can drag the timeline scrubber from frame `200` directly back to frame `14`.
* If your code is deterministic, frame `14` looks identical whether you scrubbed backward from `200` or played forward from `0`.
* If an AI agent wrote non-deterministic code, jumping backward will show missing elements, stuck animations, or broken state.

---

## 3. The 3-Tier Architecture in Detail

Let's dissect the 3 layers that make up every Remotion codebase.

```
Layer 1: Entry Point (Root)
  └── Layer 2: Metadata Wrapper (Composition)
        └── Layer 3: Canvas Implementation (Component)
```

### Layer 1: The Root (`src/Root.tsx`)
The Root component is registered with `registerRoot(RemotionRoot)`. It does not contain styling, animations, or UI. Its sole job is to declare which Compositions exist in your project.

### Layer 2: The Composition (`<Composition />`)
Think of `<Composition />` as the **Contract / Manifest** of a video.

```tsx
import { Composition } from "remotion";
import { z } from "zod";
import { CustomerGrowthChart, CustomerGrowthSchema } from "./CustomerGrowthChart";

<Composition
  id="CustomerGrowthChart"           // The CLI slug: `npx remotion render CustomerGrowthChart`
  component={CustomerGrowthChart}     // The visual component to render
  durationInFrames={180}              // Total video length (180 frames = 6s @ 30fps)
  fps={30}                            // Frame rate
  width={1920}                        // Resolution width
  height={1080}                       // Resolution height
  schema={CustomerGrowthSchema}       // Zod schema for validation & Studio UI controls
  defaultProps={{                     // Default data passed to component
    company: "Acme Analytics",
    dataPoints: [100, 250, 450, 800],
    highlightColor: "#38bdf8",
  }}
/>
```

#### Why `schema` & `defaultProps` are Vital:
1. **Studio Visual Editing**: When a `schema` is attached, Remotion Studio inspects the types and renders real-time interactive input fields, color pickers, and sliders directly in the UI panel.
2. **Headless CLI Overrides**: Remotion allows overriding props from the command line or via API:
```bash
# Render with different data without touching code!
npx remotion render CustomerGrowthChart out.mp4 --props='{"company": "BetaCorp", "dataPoints": [50, 90, 120, 300]}'
```
This is how modern automated video generation pipelines work: you build one reusable motion template, and a Python backend feeds different JSON props to generate hundreds of personalized videos.

### Layer 2b: Dynamic Video Dimensions & Durations (`calculateMetadata`)
What if your video length or dimensions depend on input props (e.g. an audio voiceover duration, or variable dataset size)? 

Instead of hardcoding `durationInFrames`, use `calculateMetadata`:

```tsx
import { CalculateMetadataFunction } from "remotion";

const calculateMetadata: CalculateMetadataFunction<CustomerGrowthProps> = async ({
  props,
  defaultProps,
}) => {
  // Example: compute video duration based on number of data points
  // 30 frames intro + 15 frames per point + 60 frames outro
  const computedFrames = 30 + props.dataPoints.length * 15 + 60;

  return {
    durationInFrames: computedFrames,
    // You can also dynamically override width, height, fps, or transform props!
  };
};

<Composition
  id="DynamicGrowthChart"
  component={CustomerGrowthChart}
  fps={30}
  width={1920}
  height={1080}
  calculateMetadata={calculateMetadata}
  schema={CustomerGrowthSchema}
  defaultProps={{ ... }}
/>
```

### Layer 3: Visual Components
This is where standard React skills come in: building layouts with flexbox, absolute positioning, SVG graphics, typography, and styling.

---

## 4. The Coordinate System & Safe Zones

In motion graphics, you don't design with scrolling pages in mind. You design within a **fixed 2D bounding box**.

```
(0,0) Top-Left ─────────────────────────── (1920, 0) Top-Right
  │                                                │
  │      ┌──────────────────────────────────┐      │
  │      │       TITLE SAFE MARGIN          │      │
  │      │   Keep text & vital infographics │      │
  │      │   inside the 90% boundary        │      │
  │      │                                  │      │
  │      └──────────────────────────────────┘      │
  │                                                │
(0, 1080) Bottom-Left ──────────────────── (1920, 1080) Bottom-Right
```

### Rules of Video Canvas Positioning:
1. **The Root Container Uses `<AbsoluteFill>`**:
   Instead of writing custom CSS (`position: absolute; width: 100%; height: 100%`), always use Remotion’s built-in `<AbsoluteFill>` component:
   ```tsx
   import { AbsoluteFill } from 'remotion';

   export const MyScene = () => {
     return (
       <AbsoluteFill style={{ backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center' }}>
         {/* Visual elements positioned here */}
       </AbsoluteFill>
     );
   };
   ```
   `<AbsoluteFill>` automatically sets `position: absolute; top: 0; left: 0; right: 0; bottom: 0; width: 100%; height: 100%; display: flex; flex-direction: column;`. It is the official foundational container for scenes in Remotion.
2. **Safe Zones for Vertical Video (9:16 - Reels / Shorts)**:
   In vertical formats (`1080x1920`), the top 250px and bottom 350px are covered by platform overlays (profile icons, like buttons, captions, audio tickers). 
   * **Rule for AI Prompts**: *"Keep all primary text, infographics, and charts vertically centered within `Y: 300px` to `Y: 1550px`."*

---

## 5. The Heartbeat: `useCurrentFrame()` & `useVideoConfig()`

Let's dissect what these hooks actually give you and how to use them idiomatically.

### `useCurrentFrame()`
When Chromium renders frame 72, `useCurrentFrame()` returns `72`.

```tsx
const frame = useCurrentFrame();
```

* **Local Time Scoping**: If a component is placed inside a `<Sequence from={30}>`, `useCurrentFrame()` inside that child component **automatically starts at 0** when the composition hits frame 30! (We explore `<Sequence>` in Module 3).

### `useVideoConfig()`
Exposes the properties defined on the parent `<Composition>`:
```tsx
const { fps, durationInFrames, width, height } = useVideoConfig();
```

#### Why use `useVideoConfig()` instead of hardcoding numbers?
* **Pacing by seconds**:
  Instead of guessing `frame === 45`, write `frame === 1.5 * fps`. If you later change the composition from 30 FPS to 60 FPS for extra smoothness, your animation timing stays identical!
* **Responsive Layouts**:
  Instead of hardcoding `left: 960` for the center of a 1920px screen, use `left: width / 2`. The same infographic template will cleanly scale between 1080p and 4K without manual redesign.

---

## 6. Real-World Code Comparison

Let's look at how a simple "Stat Card Entrance" looks when written with web anti-patterns vs. idiomatic Remotion.

### ❌ The Broken Web Approach (What naive AI generates):
```tsx
// BROKEN IN REMOTION
import React, { useState, useEffect } from 'react';

export const BadStatCard = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // 💥 BUG: Timers run on system clock, not video frame clock!
    setTimeout(() => {
      setVisible(true);
    }, 1000);
  }, []);

  return (
    <div style={{
      opacity: visible ? 1 : 0,
      // 💥 BUG: CSS transition cannot be locked to headless frame captures!
      transition: 'opacity 0.5s ease-in-out',
    }}>
      <h1>$1.2M ARR</h1>
    </div>
  );
};
```

### ✅ The Remotion Engine Approach (Deterministic Math):
```tsx
import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

export const GoodStatCard = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1 second mark in frames
  const startFrame = 1 * fps; // 30
  const endFrame = startFrame + (0.5 * fps); // 45 (0.5s duration)

  // Pure mathematical mapping: [30, 45] -> [0, 1]
  const opacity = interpolate(frame, [startFrame, endFrame], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Smooth slide-up: moves from 50px down up to 0px
  const translateY = interpolate(frame, [startFrame, endFrame], [50, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{
      opacity,
      transform: `translateY(${translateY}px)`,
    }}>
      <h1>$1.2M ARR</h1>
    </div>
  );
};
```

Notice what happened in the good approach:
1. Every property (`opacity`, `transform`) is a direct mathematical result of `frame`.
2. If you scrub directly to frame 40, `opacity` is precisely calculated ($10/15 \approx 0.66$).
3. Zero timers, zero side-effects, 100% deterministic.

---

## 7. Master Checklist for AI Prompting & Code Review

When you are reviewing code written by an AI agent or drafting a prompt, run through this mental checklist:

| Checklist Item | What to Look For / What to Specify |
| :--- | :--- |
| **No Time APIs** | Reject any code using `setTimeout`, `setInterval`, `requestAnimationFrame`, or `Date.now()`. |
| **No CSS Animations** | Reject any `transition: ...` or `@keyframes` in CSS. All movement must use inline styles or CSS transforms driven by `frame`. |
| **FPS Awareness** | Ensure frame thresholds use `fps` multiplier (`seconds * fps`) rather than raw magic numbers. |
| **Safe Coordinates** | Ensure elements have explicit positioning (`absolute` or bounded `flex`) within the `width` and `height` canvas. |
| **Data Contracts** | Check that `defaultProps` are defined on the `<Composition>` with a clear TypeScript `interface`. |

---

## Ready for Module 2?

In this deep dive, you've seen `interpolate` in action. In **Module 2: Animation Primitives & Math**, we will unpack:
* The exact mechanics of `interpolate` and its critical extrapolation modes.
* Why **Spring Physics (`spring`)** makes infographics look 10x more natural than linear interpolation.
* How to stagger elements (e.g., revealing 5 bullet points or 4 chart bars one by one).
