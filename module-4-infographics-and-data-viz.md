# Module 4: Infographics & Data Visualization

> **Goal**: Master the core visual techniques for building high-impact data-driven videos—**dynamic number rollups**, **animated SVG charts (lines, rings, bars)**, and **kinetic typography (word/character reveals)**—and learn how to prompt AI coding agents to construct them reliably.

---

## 1. Dynamic Number Counters & Rollups

One of the most frequent requirements in infographic videos is a number ticking up rapidly and decelerating into a final value (e.g., `$0` ticking up smoothly to `$1,250,000`).

### The Math: Smooth Rollup with Formatting

To make a number counter feel satisfying:
1. Use `interpolate()` with an ease-out curve (or `spring()` with `overshootClamping: true`).
2. Round the number to an integer (or fixed decimals) on every frame.
3. Apply locale currency or thousand-separator formatting (`Intl.NumberFormat`).

```tsx
import { useCurrentFrame, interpolate, Easing } from 'remotion';

interface AnimatedCounterProps {
  fromValue?: number;
  toValue: number;
  durationInFrames?: number;
  prefix?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  fromValue = 0,
  toValue,
  durationInFrames = 45, // 1.5 seconds at 30fps
  prefix = "$",
}) => {
  const frame = useCurrentFrame();

  // Interpolate raw float number
  const rawValue = interpolate(frame, [0, durationInFrames], [fromValue, toValue], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Format to standard thousand separators: 1250000 -> "1,250,000"
  const formattedNumber = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(Math.round(rawValue));

  return (
    <div style={{ fontSize: 72, fontWeight: 800, fontFamily: 'sans-serif', color: '#38bdf8' }}>
      {prefix}{formattedNumber}
    </div>
  );
};
```

> **Why `overshootClamping: true` matters for numbers:**
> If an AI agent uses `spring()` without overshoot clamping on a financial metric, the number might tick from `$0` up to `$1,080,000` before bouncing back to `$1,000,000`. For financial reports, showing an inflated number even for 3 frames looks like a bug.

---

## 2. SVG Mechanics: The "Stroke Dashoffset" Superpower

In motion graphics, the standard way to animate line charts, progress circles, signature strokes, or icon outlines is the **SVG Stroke Dashoffset technique**.

### The Concept
An SVG line or path can be drawn with dashed strokes. If you make the dash length equal to the **entire length of the path**, and then offset it by that same length, the line is completely invisible.

As `frame` progresses, you interpolate the offset down to `0`, making the line appear as if it is being smoothly drawn by an invisible pen!

```
Offset = Length  ──> [                 ] (Completely hidden)
Offset = Length/2 ──> [========         ] (Half drawn)
Offset = 0       ──> [=================] (Fully drawn)
```

### Animating a Circular Progress Ring

```tsx
import { useCurrentFrame, interpolate, Easing } from 'remotion';

export const ProgressRing = ({ percentage = 75 }: { percentage?: number }) => {
  const frame = useCurrentFrame();
  const radius = 90;
  const circumference = 2 * Math.PI * radius; // ~565.48px

  // Target offset based on percentage (e.g., 75% filled)
  const targetOffset = circumference - (percentage / 100) * circumference;

  // Animate offset from full circumference down to targetOffset
  const strokeDashoffset = interpolate(frame, [10, 50], [circumference, targetOffset], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <svg width={240} height={240} viewBox="0 0 240 240">
      {/* Background Track Circle */}
      <circle
        cx={120}
        cy={120}
        r={radius}
        fill="transparent"
        stroke="#1e293b"
        strokeWidth={16}
      />
      {/* Animated Foreground Progress Circle */}
      <circle
        cx={120}
        cy={120}
        r={radius}
        fill="transparent"
        stroke="#3b82f6"
        strokeWidth={16}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        style={{
          transform: 'rotate(-90deg)', // Start at 12 o'clock instead of 3 o'clock
          transformOrigin: '50% 50%',
        }}
      />
    </svg>
  );
};
```

---

## 3. Animated Line Graphs & Area Charts

When rendering a time-series line chart (e.g., revenue over 6 months), use an SVG `<path>` with standard Bézier control points (`M ... C ...`).

### Key Technique for AI Agents:
1. Provide the AI agent with the dataset (e.g., `[20, 45, 30, 80, 65, 120]`).
2. Have the agent generate the SVG path coordinate string.
3. Compute path length (or approximate it) and animate `strokeDashoffset` from `pathLength` to `0`.
4. Stagger the appearance of data point dots (circles) so each dot pops in with `spring()` right as the drawing line passes through it!

```tsx
// Staggering dot appearance right after the line reaches it:
const dotScale = spring({
  frame: frame - (pointIndex * 8) - 15, // Delay until line draws past
  fps,
  config: { damping: 10, mass: 0.5 },
});
```

---

## 4. Animated Bar Charts

Bar charts are the backbone of comparison infographics. Unlike line charts, bar charts look best when animated with **spring physics** and **staggering**.

```tsx
interface BarData {
  label: string;
  value: number;
}

export const AnimatedBarChart = ({ data }: { data: BarData[] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const maxValue = Math.max(...data.map(d => d.value));
  const chartHeight = 300;

  return (
    <div style={{ display: 'flex', gap: 32, alignItems: 'flex-end', height: chartHeight }}>
      {data.map((item, index) => {
        // Stagger each bar by 5 frames
        const progress = spring({
          frame: frame - index * 5,
          fps,
          config: { damping: 14, mass: 0.6, overshootClamping: true },
        });

        const barHeight = (item.value / maxValue) * chartHeight * progress;

        return (
          <div key={item.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ color: '#fff', marginBottom: 8, opacity: progress }}>
              {Math.round(item.value * progress)}
            </span>
            <div
              style={{
                width: 60,
                height: `${barHeight}px`,
                backgroundColor: '#38bdf8',
                borderRadius: '8px 8px 0 0',
              }}
            />
            <span style={{ color: '#94a3b8', marginTop: 12 }}>{item.label}</span>
          </div>
        );
      })}
    </div>
  );
};
```

---

## 5. Kinetic Typography: High-Impact Text Reveals

In informational videos, static text feels boring. Professional motion designers use **word-by-word** or **character-by-character** reveals.

### Word-by-Word Kinetic Reveal (The Modern Social Video Look)

Instead of fading an entire sentence in at once, split the sentence into words and stagger each word’s entrance:

```tsx
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export const KineticTitle = ({ text }: { text: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
      {words.map((word, i) => {
        // Stagger: 3 frames between each word
        const entrance = spring({
          frame: frame - i * 3,
          fps,
          config: { damping: 12, mass: 0.5 },
        });

        // Slide up by 30px and fade in
        const translateY = (1 - entrance) * 30;

        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              fontSize: 64,
              fontWeight: 900,
              color: '#ffffff',
              opacity: entrance,
              transform: `translateY(${translateY}px)`,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};
```

### The Typewriter Effect (Character Reveal)
For code editors, terminal displays, or retro titles, reveal characters by truncating the string based on `frame`:

```tsx
export const TypewriterText = ({ text, charsPerSecond = 20 }: { text: string; charsPerSecond?: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const totalCharsToShow = Math.floor(frame * (charsPerSecond / fps));
  const visibleText = text.slice(0, Math.min(totalCharsToShow, text.length));

  // Blinking cursor: toggles every 15 frames (0.5s)
  const showCursor = Math.floor(frame / 15) % 2 === 0;

  return (
    <div style={{ fontFamily: 'monospace', fontSize: 32, color: '#22c55e' }}>
      {visibleText}
      {showCursor && <span style={{ opacity: 0.8 }}>_</span>}
    </div>
  );
};
```

---

## 6. CSS Frameworks & Animations: Tailwind Best Practices

If you use Tailwind CSS in Remotion (via `@remotion/tailwind` or Tailwind v4):

### The Golden Rule of Tailwind in Remotion:
* **Allowed & Recommended**: Layout, typography, borders, background colors, flexbox, and grid utilities (`flex`, `grid`, `text-white`, `bg-slate-900`, `rounded-xl`, `border-cyan-500/20`).
* **Strictly Forbidden**: Any Tailwind animation class (`animate-spin`, `animate-bounce`, `animate-pulse`, `transition-all`, `duration-500`).
* **Why**: Tailwind CSS animations use CSS keyframes and browser system clocks. During parallel headless rendering, Chromium will drop frames or render empty/stuck states. Always drive transforms and opacities using inline styles powered by `useCurrentFrame()` and `interpolate()` / `spring()`.

---

## 7. How to Prompt AI Agents for Infographics

When you want an AI agent to build a data visual, follow this specification formula:

### 🎯 High-Precision Infographic Prompt:
> *"Create an infographic scene component named `QuarterlyMetrics` displaying a comparison bar chart:
> 1. Input Props: `data: Array<{ quarter: string; revenue: number }>`
> 2. Visual layout: Centered card container (1200px width), dark glassmorphic styling (`rgba(255,255,255,0.05)`, border `1px solid rgba(255,255,255,0.1)`).
> 3. Bars animation:
>    - Use `spring()` with `damping: 14`, `mass: 0.6`, `overshootClamping: true`.
>    - Stagger each bar entrance by `index * 6` frames.
> 4. Dynamic Metric Counter:
>    - Above each bar, display its value ticking up using `interpolate()` with `Easing.out(Easing.cubic)`.
>    - Format values with `Intl.NumberFormat('en-US', { notation: 'compact' })` (e.g., $1.2M).
> 5. Typography:
>    - Add a kinetic header at the top revealing word-by-word with 3-frame staggering."*

---

## Review Checklist for Module 4

| Check | Requirement |
| :--- | :--- |
| **Number Formatting** | Are dynamic numbers rounded with `Math.round()` to prevent long ugly decimals (`$123.4982749`) during interpolation? |
| **No Inaccurate Overshoot** | Do metric counters and chart heights use `overshootClamping: true` to avoid displaying false peak numbers? |
| **SVG Coordinate Scaling**| Does every `<svg>` have an explicit `viewBox` and dimensions to scale cleanly? |
| **Word Separation** | Are kinetic typography words rendered as `display: inline-block` so CSS `transform: translateY` applies properly? |

---

*Up next: **Module 5: Assets, Media & Audio Synchronization** (`staticFile()`, `delayRender`, audio ducking, and SFX timing)!*
