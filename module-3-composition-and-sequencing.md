# Module 3: Composition, Sequencing & Time Architecture

> **Goal**: Master Remotion’s timeline architecture—specifically **`<Sequence>`**, **`<Series>`**, and the critical distinction between **Relative Time vs. Absolute Time**—so you can architect complex multi-scene infographic videos and guide AI agents to write modular, reusable scene components.

---

## 1. The Multi-Scene Problem

In a 30-second infographic video, you rarely have a single continuous screen. Instead, you have distinct narrative sections:
1. **Hook / Title Scene** (0s – 4s)
2. **Problem Statement & Data Metric** (4s – 12s)
3. **Comparison / Bar Chart** (12s – 22s)
4. **Call to Action / Outro** (22s – 30s)

If you try to write all of this inside one giant component tracking frame `0` through `900`, your code becomes an unmaintainable tangle of conditionals (`if (frame >= 120 && frame < 360) ...`).

Remotion solves this with two foundational structural components:
* **`<Sequence>`**: Shifts and isolates time for individual elements or overlapping tracks.
* **`<Series>`**: Automatically plays scenes back-to-back without manual math.

---

## 2. `<Sequence>`: Localizing Time

`<Sequence>` is the timeline workhorse of Remotion. It takes two primary props:
* `from`: The frame in the parent timeline where this sequence begins.
* `durationInFrames` (optional): How many frames this sequence stays visible. If omitted, it plays until the end of the composition.

```tsx
import { Sequence } from 'remotion';
import { TitleCard } from './TitleCard';
import { ChartScene } from './ChartScene';

export const MyVideo = () => {
  return (
    <>
      {/* Visible from Frame 0 to Frame 90 (3 seconds @ 30fps) */}
      <Sequence from={0} durationInFrames={90}>
        <TitleCard title="Q3 Performance" />
      </Sequence>

      {/* Starts at Frame 75 (15-frame crossfade overlap!) and runs for 150 frames */}
      <Sequence from={75} durationInFrames={150}>
        <ChartScene />
      </Sequence>
    </>
  );
};
```

### The Magic of Local Time (Time Scoping)

Here is the single most important concept regarding `<Sequence>`:

> **When a component is rendered inside `<Sequence from={120}>`, calling `useCurrentFrame()` inside that child component returns `0` at frame 120!**

```
Parent Timeline:
Frame:     0 ─── 30 ─── 60 ─── 90 ─── 120 ─── 150 ─── 180 ─── 210
                                       │
Child Sequence (<Sequence from={120}>):
Local Frame:                           0 ───── 30 ──── 60 ──── 90
```

### Why this is a Superpower:
* You can develop `ChartScene` in complete isolation! 
* Inside `ChartScene`, its entrance animation can simply animate from frame `0` to `20`. 
* You don't need to know or care whether `ChartScene` will be placed at 2 seconds, 10 seconds, or 50 seconds in the final edit. It always starts its own internal clock at `frame 0`.

---

## 3. Relative Time vs. Absolute Time

Occasionally, you need a child component to know where it is in the **overall master video** (for example, a global progress bar or persistent timecode watermark).

Remotion provides two different frame hooks:

| Hook | What it Returns | Typical Use Case |
| :--- | :--- | :--- |
| **`useCurrentFrame()`** | **Relative frame** (scoped to the nearest enclosing `<Sequence>`). | 98% of your code: entrance/exit animations, springs, chart drawing, text reveals. |
| **`useCurrentFrame()` at Composition level** | Or passing the master frame via props. | Global progress bars, overall video watermarks, background music controllers. |

> **AI Hallucination Alert**:
> Naive AI agents often forget that `<Sequence>` resets the local frame clock. They will write:
> ```tsx
> <Sequence from={100} durationInFrames={60}>
>   {/* 💥 BUG: The child will wait for frame 100, which locally never occurs! */}
>   <ChildComponent />
> </Sequence>
> 
> // Inside ChildComponent:
> const frame = useCurrentFrame();
> const opacity = interpolate(frame, [100, 120], [0, 1]); // Never animates because local frame only goes 0-60!
> ```
> **The Fix**: The child should animate from `[0, 20]`.

---

## 4. Layout & Stacking with `<Sequence>`

A `<Sequence>` wraps its children in a `<div>`. By default, it takes up `position: absolute; width: 100%; height: 100%`.

### Overlapping Layers (Video Tracks)
Because sequences can overlap in time, you can use them like video tracks or layers in After Effects:

```tsx
export const SceneWithHUD = () => {
  return (
    <>
      {/* Layer 1: Background video (runs entire 300 frames) */}
      <Sequence from={0} durationInFrames={300}>
        <AnimatedBackground />
      </Sequence>

      {/* Layer 2: Main infographic card (comes in at 1s, lasts 4s) */}
      <Sequence from={30} durationInFrames={120}>
        <StatCard />
      </Sequence>

      {/* Layer 3: Sound Effect audio trigger (fires exactly at frame 30) */}
      <Sequence from={30}>
        <Audio src={staticFile("whoosh.mp3")} />
      </Sequence>
    </>
  );
};
```

---

## 5. `<Series>`: Automatic Timeline Sequencing

While `<Sequence>` is great for overlapping layers, what if you have 4 scenes that must play **one after another in strict sequence**?

With `<Sequence>`, you have to calculate cumulative frame additions by hand:
* Scene 1: `from={0}`, `duration={90}`
* Scene 2: `from={90}`, `duration={120}`
* Scene 3: `from={210}`, `duration={60}` (90 + 120)
* Scene 4: `from={270}`, `duration={90}` (210 + 60)

If you change the length of Scene 1 by 15 frames, you have to recalculate the `from` offset of every single subsequent scene!

### Enter `<Series>`:
`<Series>` automatically stitches scenes end-to-end like train cars.

```tsx
import { Series } from 'remotion';

export const ExplainerVideo = () => {
  return (
    <Series>
      <Series.Sequence durationInFrames={90}>
        <IntroScene />
      </Series.Sequence>

      <Series.Sequence durationInFrames={120}>
        <ChartScene />
      </Series.Sequence>

      <Series.Sequence durationInFrames={60}>
        <StatHighlightScene />
      </Series.Sequence>

      <Series.Sequence durationInFrames={90}>
        <OutroScene />
      </Series.Sequence>
    </Series>
  );
};
```

If you edit `<IntroScene />` from `90` to `100` frames, every following scene automatically ripples forward by 10 frames without you touching any code!

### Overlapping Transitions in `<Series>`:
What if you want a 15-frame cross-dissolve or slide transition between Scene 1 and Scene 2? You can pass an `offset` prop:

```tsx
<Series>
  <Series.Sequence durationInFrames={90}>
    <SceneA />
  </Series.Sequence>

  {/* Starts 15 frames BEFORE SceneA finishes, allowing smooth blend/crossfade! */}
  <Series.Sequence durationInFrames={90} offset={-15}>
    <SceneB />
  </Series.Sequence>
</Series>
```

---

## 6. Architecting Modular Infographic Components

When designing infographic videos with AI agents, the best architectural pattern is **Component Independence**.

Each visual infographic should be completely self-contained and accept standard animation control props:

```tsx
interface InfographicWidgetProps {
  title: string;
  value: string;
  delay?: number;       // Frame offset for entrance (for staggering)
  duration?: number;    // Animation entrance duration
}

export const MetricBadge: React.FC<InfographicWidgetProps> = ({
  title,
  value,
  delay = 0,
  duration = 20,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring triggered at (frame - delay)
  const entrance = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, mass: 0.6 },
  });

  return (
    <div
      style={{
        opacity: entrance,
        transform: `scale(${entrance}) translateY(${(1 - entrance) * 30}px)`,
        background: '#1e293b',
        padding: '24px 32px',
        borderRadius: 16,
        border: '1px solid #334155',
      }}
    >
      <div style={{ color: '#94a3b8', fontSize: 16 }}>{title}</div>
      <div style={{ color: '#f8fafc', fontSize: 42, fontWeight: 'bold' }}>{value}</div>
    </div>
  );
};
```

---

## 7. How to Prompt AI Agents for Sequences & Series

Here is the exact vocabulary and structure to use when prompting AI agents for multi-scene video scripts:

### 🎯 High-Precision Multi-Scene Prompt Template:
> *"Build a multi-scene Remotion composition named `ProductTearDown` (1920x1080, 30 FPS, total 450 frames / 15 seconds).
> 
> Structure the timeline using `<Series>` for linear scene progression:
> 1. `<Series.Sequence durationInFrames={90}>`: `IntroHero` component.
> 2. `<Series.Sequence durationInFrames={180}>`: `FeatureShowcase` component.
> 3. `<Series.Sequence durationInFrames={120}>`: `PricingMatrix` component.
> 4. `<Series.Sequence durationInFrames={60}>`: `CallToAction` component.
> 
> Critical Implementation Rules:
> - Each scene component must assume its local `useCurrentFrame()` starts at `0`.
> - Do not reference global absolute frame indices inside individual scenes.
> - Animate entrances within frames 0-25 using `spring()`.
> - Animate scene exits within the final 15 frames of each scene's duration using `interpolate()` with `extrapolate: 'clamp'`."*

---

## Review Checklist for Module 3

| Check | Requirement |
| :--- | :--- |
| **Local Frame Independence** | Does each scene component start its animation at `frame = 0` rather than assuming it runs at frame 150+? |
| **Series vs. Sequence** | Are linear back-to-back scenes organized with `<Series>` rather than manual, brittle frame arithmetic? |
| **Layer Ordering** | Are background videos, graphics layers, and SFX placed in the correct visual stacking order? |
| **Total Duration Match** | Does the sum of all `<Series.Sequence>` durations (minus any negative offsets) equal the `durationInFrames` of the parent `<Composition>`? |

---

*Ready for **Module 4: Infographics & Data Visualization** (Dynamic Counters, SVG Path Animations & Kinetic Typography)?*
