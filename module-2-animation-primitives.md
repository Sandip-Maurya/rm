# Module 2: Animation Primitives & Math

> **Goal**: Master the two foundational animation engines of Remotion—**`interpolate`** and **`spring`**—so you understand how motion graphics are calculated, how to avoid jitter, and how to instruct AI agents to create fluid, professional infographics.

---

## 1. The Two Pillars of Remotion Motion

In traditional CSS/Web animation, you specify durations and curves like `transition: all 0.3s ease-out`. In Remotion, everything is math. 

Remotion gives you two primary functions to generate animation values:

| Primitive | Mathematical Model | Best For | Visual Personality |
| :--- | :--- | :--- | :--- |
| **`interpolate()`** | Piecewise linear mapping with easing curves | Precise timing, progress bars, rotations, opacity fades, multi-stage sequences | Controlled, predictable, exact start and end frames |
| **`spring()`** | Real-world physical simulation (Hooke's Law + damping) | Pop-ins, UI bounces, stat card entries, badge reveals | Organic, lively, professional, "Apple-style" fluidity |

---

## 2. Deep Dive: `interpolate()`

At its simplest, `interpolate` maps an input range (typically the current frame) to an output range (such as opacity, pixels, or degrees).

### The Basic Signature
```tsx
const value = interpolate(
  frame,               // 1. Current frame input
  [inputMin, inputMax], // 2. Frame boundary range
  [outputMin, outputMax], // 3. Value boundary range
  options?             // 4. Clamping and Easing options (CRITICAL)
);
```

### Python Mental Model
If you were writing this in Python, it would look like linear interpolation:
```python
def lerp(frame: float, in_min: float, in_max: float, out_min: float, out_max: float) -> float:
    # Normalized progress between 0.0 and 1.0
    progress = (frame - in_min) / (in_max - in_min)
    return out_min + progress * (out_max - out_min)
```

---

## 3. The Extrapolation Trap (Why `clamp` is Mandatory)

By default, linear math **does not stop** when `frame` goes beyond `inputMax` or below `inputMin`. It keeps going infinitely!

### What happens without clamping:
Suppose you want an element to fade in from opacity `0` to `1` between frame `0` and frame `30`:
```tsx
// ⚠️ DANGEROUS: Default extrapolation is 'extend'
const opacity = interpolate(frame, [0, 30], [0, 1]);
```
* At frame `0` $\to$ opacity is `0`
* At frame `30` $\to$ opacity is `1`
* At frame `60` $\to$ opacity becomes `2.0`! (Invalid CSS, or breaks other math)
* At frame `-10` $\to$ opacity becomes `-0.33`!

If you interpolate `translateY` to slide an element onto the screen from `50px` to `0px`, without clamping, at frame 60 it will keep drifting upward to `-50px`, `-100px`, and slide right off the top of the video!

### The Golden Rule: Always Clamp!
```tsx
const opacity = interpolate(frame, [0, 30], [0, 1], {
  extrapolateLeft: 'clamp',   // If frame < 0, lock to 0
  extrapolateRight: 'clamp',  // If frame > 30, lock to 1
});
```

> **AI Review Check**:
> When an AI agent writes `interpolate()`, check immediately if it passed `{ extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }` (or the shortcut `extrapolate: 'clamp'`). If omitted, elements will often drift, flicker, or overshoot across scenes.

---

## 4. Multi-Stage Keyframing with `interpolate`

You are not limited to just two numbers. You can define complete multi-stage animation paths in a single `interpolate` call.

### Example: Infographic Card (Enter $\to$ Hold $\to$ Exit)
Suppose a stat card should:
1. **Enter** (Frames 0 to 20): Fade in from 0 to 1.
2. **Hold** (Frames 20 to 100): Stay visible at 1.
3. **Exit** (Frames 100 to 120): Fade out to 0.

```tsx
const opacity = interpolate(
  frame,
  [0, 20, 100, 120],  // Keyframe timeline
  [0,  1,   1,   0],  // Values at each keyframe
  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
);
```

This single line replaces complex nested conditions or multiple state toggles!

---

## 5. Easing Curves in `interpolate`

Linear motion feels robotic and stiff. In video design, objects should accelerate and decelerate smoothly. Remotion includes built-in easing functions from `remotion`:

```tsx
import { interpolate, Easing } from 'remotion';

const slideY = interpolate(frame, [0, 30], [100, 0], {
  easing: Easing.bezier(0.16, 1, 0.3, 1), // Apple / iOS smooth ease-out
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
});
```

Common Easing Types:
* `Easing.ease`: Standard ease in/out.
* `Easing.out(Easing.quad)`: Starts fast, decelerates gracefully to a stop (ideal for incoming infographics).
* `Easing.in(Easing.quad)`: Starts slow, accelerates away (ideal for exit animations).
* `Easing.bezier(x1, y1, x2, y2)`: Custom cubic Bézier curves (compatible with CSS curve generators like cubic-bezier.com).

---

## 6. Deep Dive: `spring()` Physics

While `interpolate` with easing is good, **spring physics** is the secret sauce that makes professional motion graphics feel tactile, organic, and premium.

Instead of specifying a duration in frames, you describe the **physical properties** of a spring, and Remotion computes the exact oscillation trajectory frame-by-frame.

```tsx
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';

const frame = useCurrentFrame();
const { fps } = useVideoConfig();

const entrance = spring({
  frame,
  fps,
  config: {
    damping: 12,    // Friction: Controls how fast oscillation settles
    mass: 0.5,      // Weight: Lower mass = faster, snappier reaction
    stiffness: 100, // Tension: Higher = stiffer, faster snap
    overshootClamping: false, // Set true to prevent bouncing past the target
  },
});
```

### The 4 Spring Parameters Explained:

```
                  High Stiffness / Low Mass
                         ┌──┐
                        │  │  ▲ Over-shoot (Bounce)
            Target ─────┼──┼──┼───────────── Settle
                        │  │  │  ▼
                       │    │
                      │      │
      Start ─────────┘        └──────────────
```

1. **`damping`** (Default: `10`):
   * Represents **friction** or air resistance.
   * Low damping (e.g., `5`) $\to$ Lots of springy, bouncy oscillations before stopping.
   * High damping (e.g., `20` or higher) $\to$ Zero bounce; slides smoothly to a halt (critically damped).

2. **`mass`** (Default: `1`):
   * The **heaviness** of the object.
   * Low mass (`0.2` - `0.5`) $\to$ Ultra-snappy, quick, nimble UI animations.
   * Heavy mass (`2.0` - `5.0`) $\to$ Sluggish, majestic, heavy movement (good for huge title cards).

3. **`stiffness`** (Default: `100`):
   * How tight the spring coil is.
   * Higher stiffness pulls the object to its destination faster.

4. **`overshootClamping`** (Default: `false`):
   * When `true`, the object stops immediately when it reaches its target (`1.0`) without oscillating back and forth.
   * Great for progress bars and metric counters where you want natural deceleration without bouncing past the target value!

### Spring Output is Always `0.0` to `1.0`!
By default, `spring()` evaluates from `0` to `1`. You can then map that `0` to `1` value to any CSS property using scale or multiplication:

```tsx
// Scale up from 0% to 100%
const scale = entrance; // 0 -> 1 (with subtle bounce to ~1.05)

// Slide up from 100px to 0px
const translateY = (1 - entrance) * 100;

// Combine into visual transform
const style = {
  transform: `translateY(${translateY}px) scale(${scale})`,
  opacity: entrance, // Opacity is clamped automatically
};
```

---

## 7. Motion Graphics Techniques: Staggering

One of the most important principles in motion graphics is **Staggering** (animating elements in a sequence rather than having everything pop up simultaneously).

### Without Stagger:
All 4 bars of a chart pop in at Frame 0 $\to$ Chaotic, overwhelming for the viewer.

### With Stagger:
* Bar 1 enters at Frame 0
* Bar 2 enters at Frame 5
* Bar 3 enters at Frame 10
* Bar 4 enters at Frame 15
$\to$ Cohesive, rhythmic, and easy to follow.

### The Math of Staggering:
In Remotion, you stagger simply by **subtracting a delay from `frame`**:

```tsx
const Bar = ({ index, value }: { index: number; value: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Each bar starts 6 frames after the previous one
  const delay = index * 6;

  const progress = spring({
    frame: frame - delay, // Negative frame values evaluate safely to 0!
    fps,
    config: { damping: 14, mass: 0.6 },
  });

  return (
    <div
      style={{
        height: `${value * progress}px`,
        width: 40,
        backgroundColor: '#3b82f6',
      }}
    />
  );
};
```

---

## 8. Summary & Prompting Guide for Module 2

When prompting an AI agent to build animations, don't say *"animate the card nicely"*. Give them concrete physics and timing instructions.

### Effective Agent Prompting Formulas:
* **For Snappy UI Pop-ins**:
  > *"Animate the metric card using `spring()` with `damping: 12`, `mass: 0.5`, and `stiffness: 120`. Apply this spring to `scale` (from 0.8 to 1) and `opacity` (from 0 to 1)."*
* **For Staggered Lists / Charts**:
  > *"Render the 5 data points as a bar chart. Stagger their entrances by `index * 5` frames using `spring()`. Clamp overshoots on the bar heights using `overshootClamping: true` so the bars don't bounce past their real values."*
* **For Multi-stage Timelines**:
  > *"Use `interpolate()` with `extrapolate: 'clamp'` to fade the title in between frames 0-20, hold from 20-90, and fade out from 90-110."*

---

## Review Checklist for Module 2

| Check | Requirement |
| :--- | :--- |
| **Clamping** | Does every `interpolate()` call specify `{ extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }`? |
| **Spring FPS** | Did the agent pass `fps` from `useVideoConfig()` to `spring({ frame, fps })`? |
| **No Negative Breaks**| When using `frame - delay` in `spring()`, is the physics configured so negative frames remain at `0`? |
| **Appropriate Physics**| Are progress bars and charts using `overshootClamping: true` to prevent false data readings? |

---

*Next up is **Module 3: Composition, Sequencing & Time Architecture** (`<Sequence>`, `<Series>`, and relative time)!*
