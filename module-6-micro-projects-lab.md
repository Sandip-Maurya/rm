# Module 6: Hands-On Micro-Projects & Motion Katas

> **Goal**: Reverse-engineer high-end motion graphics into 24 isolated, single-concept micro-units. For each kata, build the component, inspect it in the Remotion Preview Studio, and render an actual standalone `.mp4` video. If the motion is stiff or unnatural, iterate on the math until it looks professional.

---

## The Practice & Iteration Loop

For every exercise in this module, you follow this exact 4-step cadence:

```
[1. Isolate the Math] ──> [2. Preview in Studio] ──> [3. Render MP4] ──> [4. Visual Review & Iterate]
(Spring / Interpolate)      (Scrub & Test Frame 0)    (npx remotion render)  (Check Pacing, Jitter, Bounce)
```

### Quick Commands Reference
* **Launch Preview Studio**:
  ```bash
  bun dev
  ```
  *(Opens the visual player at `http://localhost:3000` with scrubbing, frame stepping, and zoom).*
* **Render a Specific Exercise to MP4**:
  ```bash
  npx remotion render <CompositionId> out/<CompositionId>.mp4
  ```

---

## Category A: Core Animation & Physics Primitives

### Kata 01: The "Apple-Style" Stat Card Pop-In
* **Concept**: Tuning spring parameters (`damping`, `mass`, `stiffness`) for an organic, tactile pop without rubbery oscillation.
* **Composition Specs**: `1920x1080`, 30 FPS, 90 frames (3 seconds).
* **Target Visual**: A dark glassmorphic metric card (`MRR: $84,200`) scales in from `0.8` to `1.0` with a subtle overshoot bounce, while translateY glides from `+40px` to `0px`.
* **The Math to Practice**:
  ```tsx
  const entrance = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.5, stiffness: 110 },
  });
  const scale = interpolate(entrance, [0, 1], [0.8, 1]);
  const translateY = interpolate(entrance, [0, 1], [40, 0]);
  ```
* **Iteration Check**: If it feels like jello, increase `damping` from 12 to 16. If it feels sluggish, decrease `mass` from 0.5 to 0.35.

---

### Kata 02: The Staggered Metric Cascade
* **Concept**: Time-offset indexing (`frame - (index * delay)`) across an array of sibling widgets.
* **Composition Specs**: `1920x1080`, 30 FPS, 120 frames (4 seconds).
* **Target Visual**: 4 KPI pill badges (`Users +18%`, `Churn 1.2%`, `NPS 74`, `LTV $480`) slide in one by one in a staircase rhythm.
* **The Math to Practice**:
  ```tsx
  const delay = index * 6; // 6-frame offset between each pill
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, mass: 0.6 },
  });
  ```
* **Iteration Check**: Ensure pills don't appear prematurely before their delay begins (negative frames must evaluate to 0).

---

### Kata 03: The Multi-Stage Keyframe Banner (Enter $\to$ Hold $\to$ Exit)
* **Concept**: Multi-point piecewise array interpolation with strict clamping.
* **Composition Specs**: `1920x1080`, 30 FPS, 150 frames (5 seconds).
* **Target Visual**: A breaking news lower-third banner slides in from the left (frames 0-20), holds steady with a pulsing red live dot (frames 20-120), and slides off to the right (frames 120-140).
* **The Math to Practice**:
  ```tsx
  const translateX = interpolate(
    frame,
    [0, 20, 120, 140],
    [-800, 0, 0, 800],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1) }
  );
  ```
* **Iteration Check**: Confirm that during frames 20 to 120, `translateX` is rock-solid at `0px` without drifting.

---

### Kata 04: The Anticipation & Snap Motion
* **Concept**: Applying Disney's 12 principles of animation in code: pulling backward slightly before firing forward.
* **Composition Specs**: `1920x1080`, 30 FPS, 90 frames (3 seconds).
* **Target Visual**: A launch button or pill badge pulls back by `-25px` (anticipation) over 10 frames, then rockets forward across the screen to `+600px` with a snappy ease-out.
* **The Math to Practice**:
  ```tsx
  const translateX = interpolate(
    frame,
    [0, 12, 35],
    [0, -25, 600],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  ```
* **Iteration Check**: Does the anticipation feel intentional or like a glitch? Adjust the pullback timing to be roughly 30% of the forward duration.

---

## Category B: Kinetic Typography & Text Animation

### Kata 05: The Modern Word-by-Word Kinetic Reveal
* **Concept**: Splitting sentences into space-delimited words and staggering translateY + opacity per word.
* **Composition Specs**: `1080x1920` (Vertical 9:16), 30 FPS, 120 frames (4 seconds).
* **Target Visual**: A bold 6-word hook (`"Stop Building Boring Dashboards Today"`) where each word pops up from a clipped baseline in rapid social-media cadence.
* **The Math to Practice**:
  ```tsx
  const words = text.split(" ");
  // Inside map:
  const wordSpring = spring({
    frame: frame - index * 4,
    fps,
    config: { damping: 13, mass: 0.5 },
  });
  ```
* **Iteration Check**: Ensure each word has `display: 'inline-block'` so CSS transforms apply correctly.

---

### Kata 06: The Masked Slide-Up Text (Clip-Path Reveal)
* **Concept**: Text emerging smoothly from an invisible boundary line using `overflow: hidden` containers.
* **Composition Specs**: `1920x1080`, 30 FPS, 90 frames (3 seconds).
* **Target Visual**: An elegant editorial title card where two lines of high-fashion serif typography slide upward from beneath an invisible horizontal floor.
* **The Math to Practice**:
  ```tsx
  <div style={{ overflow: 'hidden', height: 80 }}>
    <h1 style={{ transform: `translateY(${interpolate(frame, [0, 25], [100, 0], { extrapolate: 'clamp' })}%)` }}>
      Quarterly Executive Review
    </h1>
  </div>
  ```
* **Iteration Check**: Check that no descenders (like letters `g`, `y`, `p`) get clipped prematurely when seated at resting position.

---

### Kata 07: The Terminal Typewriter with Blinking Cursor
* **Concept**: String truncation based on frame velocity combined with a modulo cursor blink.
* **Composition Specs**: `1920x1080`, 30 FPS, 150 frames (5 seconds).
* **Target Visual**: A macOS terminal window typing `bun add remotion @remotion/core` character-by-character, followed by a blinking green block cursor.
* **The Math to Practice**:
  ```tsx
  const charsPerSecond = 18;
  const charsCount = Math.floor(frame * (charsPerSecond / fps));
  const textToShow = fullCommand.slice(0, charsCount);
  const cursorBlink = Math.floor(frame / 12) % 2 === 0;
  ```
* **Iteration Check**: Verify cursor stops moving once the string reaches full length and continues blinking in place.

---

### Kata 08: The Dynamic Highlighter / Scribble Accent
* **Concept**: Animating an SVG marker stroke or background highlighter box behind a specific keyword.
* **Composition Specs**: `1920x1080`, 30 FPS, 90 frames (3 seconds).
* **Target Visual**: A sentence appears; 15 frames later, a bright yellow fluorescent highlighter stroke sweeps horizontally behind the word `"10x Faster"`.
* **The Math to Practice**:
  ```tsx
  const highlightWidth = interpolate(frame, [25, 45], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  // width: `${highlightWidth}%`, position: 'absolute', zIndex: -1
  ```
* **Iteration Check**: Ensure the highlight sits visually *behind* the text layer so the typography remains crisp and readable.

---

## Category C: Information Graphics & Data Visualization

### Kata 09: The Smooth Metric Ticker / Rolling Counter
* **Concept**: Float interpolation with `Math.round()`, `Intl.NumberFormat`, and `overshootClamping: true`.
* **Composition Specs**: `1920x1080`, 30 FPS, 90 frames (3 seconds).
* **Target Visual**: A giant central metric ticking rapidly from `$0` up to `$4,850,230` with smooth deceleration and green profit pill icon.
* **The Math to Practice**:
  ```tsx
  const value = interpolate(frame, [0, 50], [0, 4850230], {
    easing: Easing.out(Easing.quad),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Math.round(value));
  ```
* **Iteration Check**: Confirm there is no decimal flicker during playback.

---

### Kata 10: The SVG Line Chart Draw-In
* **Concept**: SVG `strokeDasharray` and `strokeDashoffset` animating a multi-point vector line graph.
* **Composition Specs**: `1920x1080`, 30 FPS, 120 frames (4 seconds).
* **Target Visual**: An upward trending crypto or stock chart line drawing itself from left to right with a soft glowing linear gradient beneath it.
* **The Math to Practice**:
  ```tsx
  const pathLength = 1200; // Total length of the SVG bezier path
  const offset = interpolate(frame, [15, 65], [pathLength, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.2, 0.8, 0.2, 1),
  });
  // strokeDasharray={pathLength} strokeDashoffset={offset}
  ```
* **Iteration Check**: Verify the line starts completely invisible at frame 0-14 without any stray dots showing.

---

### Kata 11: The Pulsing Data-Point Callout
* **Concept**: Secondary ripple animations triggered when a primary animation finishes.
* **Composition Specs**: `1920x1080`, 30 FPS, 90 frames (3 seconds).
* **Target Visual**: Right as a graph reaches its peak (frame 45), a glowing blue dot pops up, emitting 2 expanding and fading radar rings.
* **The Math to Practice**:
  ```tsx
  const rippleFrame = frame - 45;
  const rippleScale = interpolate(rippleFrame, [0, 30], [1, 2.5], { extrapolateLeft: 'clamp' });
  const rippleOpacity = interpolate(rippleFrame, [0, 30], [0.8, 0], { extrapolateLeft: 'clamp' });
  ```
* **Iteration Check**: Ensure the ripple does not trigger before frame 45.

---

### Kata 12: The Staggered Bar Chart Comparison
* **Concept**: Bounded spring heights with synchronized metric labels at the top of each bar.
* **Composition Specs**: `1920x1080`, 30 FPS, 120 frames (4 seconds).
* **Target Visual**: 4 vertical comparison bars (`2023`, `2024`, `2025`, `2026`) growing upward from a base axis, each with an animated percentage label tracking its upward growth.
* **The Math to Practice**:
  ```tsx
  const growth = spring({
    frame: frame - index * 6,
    fps,
    config: { damping: 14, mass: 0.6, overshootClamping: true },
  });
  const barHeight = targetHeight * growth;
  ```
* **Iteration Check**: Ensure `overshootClamping: true` prevents bars from temporarily growing taller than their real data values.

---

### Kata 13: The Donut / Circular Progress Meter
* **Concept**: Circular SVG trigonometry with `strokeDashoffset` and a centered percentage readout.
* **Composition Specs**: `1080x1080` (Square 1:1), 30 FPS, 90 frames (3 seconds).
* **Target Visual**: A neon cyan ring filling around a circular dial from 0% to 84%, with the number in the center updating synchronously.
* **The Math to Practice**:
  ```tsx
  const circumference = 2 * Math.PI * 100; // Radius = 100
  const targetOffset = circumference * (1 - 0.84);
  const currentOffset = interpolate(frame, [10, 50], [circumference, targetOffset], {
    extrapolate: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  ```
* **Iteration Check**: Rotate the SVG by `-90deg` so the ring begins filling at the top (12 o'clock) instead of the right (3 o'clock).

---

### Kata 14: The Infographic Feature Matrix Table
* **Concept**: Grid layout with staggered checkmark vector drawing.
* **Composition Specs**: `1920x1080`, 30 FPS, 150 frames (5 seconds).
* **Target Visual**: A "Us vs. Competitors" 3-column table where feature rows reveal one by one, culminating in animated green SVG checkmarks drawing themselves.
* **The Math to Practice**:
  ```tsx
  // Checkmark SVG path draw-in:
  const checkProgress = interpolate(frame - rowDelay, [0, 15], [30, 0], { extrapolate: 'clamp' });
  ```
* **Iteration Check**: Rows must establish a clear reading rhythm (approx. 8 frames per row).

---

## Category D: Scene Transitions & Camera Motion

### Kata 15: The Seamless Slide & Push Transition
* **Concept**: Chaining scenes using modern `<TransitionSeries>` with `@remotion/transitions`.
* **Composition Specs**: `1920x1080`, 30 FPS, 120 frames (4 seconds).
* **Target Visual**: Scene 1 displays a stat; at frame 50, Scene 1 slides out smoothly while Scene 2 pushes in from the right over 15 frames using `slide({ direction: 'from-right' })`.
* **The Architecture to Practice**:
  ```tsx
  import { TransitionSeries, linearTiming } from '@remotion/transitions';
  import { slide } from '@remotion/transitions/slide';

  <TransitionSeries>
    <TransitionSeries.Sequence durationInFrames={60}>
      <SceneOne />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition
      presentation={slide({ direction: 'from-right' })}
      timing={linearTiming({ durationInFrames: 15 })}
    />
    <TransitionSeries.Sequence durationInFrames={75}>
      <SceneTwo />
    </TransitionSeries.Sequence>
  </TransitionSeries>
  ```
* **Iteration Check**: No black seam or gap should appear between the two scenes during the transition.

---

### Kata 16: The Dynamic Camera Zoom (Scale & Pan)
* **Concept**: Animating the root container's `transform: scale()` and `transformOrigin` to focus on a detail.
* **Composition Specs**: `1920x1080`, 30 FPS, 120 frames (4 seconds).
* **Target Visual**: A full 4-panel dashboard starts at 1.0x scale; at frame 40, the camera smoothly zooms in to 2.2x scale focusing directly on the top-right chart.
* **The Math to Practice**:
  ```tsx
  const zoom = interpolate(frame, [40, 75], [1.0, 2.2], {
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    extrapolate: 'clamp',
  });
  // style: { transform: `scale(${zoom})`, transformOrigin: '80% 20%' }
  ```
* **Iteration Check**: Ensure images and text retain vector crispness or sufficient resolution when zoomed.

---

### Kata 17: The Glassmorphic 3D Card Flip
* **Concept**: CSS 3D perspective transforms (`perspective: 1000px`, `rotateY`).
* **Composition Specs**: `1920x1080`, 30 FPS, 90 frames (3 seconds).
* **Target Visual**: A credit card or stat card rotates 180 degrees around its Y-axis, flipping from front face (summary) to back face (detailed breakdown).
* **The Math to Practice**:
  ```tsx
  const rotation = interpolate(frame, [15, 45], [0, 180], {
    easing: Easing.out(Easing.cubic),
    extrapolate: 'clamp',
  });
  // transform: `perspective(1000px) rotateY(${rotation}deg)`
  ```
* **Iteration Check**: Use `backface-visibility: hidden` so the reverse face doesn't show backwards text.

---

### Kata 18: The Screen Wipe / Color Slice
* **Concept**: An angled polygon or full-screen banner sweeping across the canvas as an editorial cut.
* **Composition Specs**: `1920x1080`, 30 FPS, 90 frames (3 seconds).
* **Target Visual**: A bold brand-color diagonal ribbon sweeps from bottom-left to top-right, wiping away Scene A to reveal Scene B underneath.
* **The Math to Practice**:
  ```tsx
  const wipeX = interpolate(frame, [25, 55], [-120, 120], { extrapolate: 'clamp' });
  // style: { transform: `translateX(${wipeX}%) skewX(-15deg)` }
  ```
* **Iteration Check**: Ensure the wipe sheet is wide enough (with skew) to cover the entire 1920x1080 viewport at its midpoint.

---

## Category E: UI & Product Motion (App Mockups)

### Kata 19: The Animated Cursor & Click Interaction
* **Concept**: Piecewise coordinate interpolation `[x1, y1] -> [x2, y2]` with spring scale depression.
* **Composition Specs**: `1920x1080`, 30 FPS, 120 frames (4 seconds).
* **Target Visual**: A crisp mouse cursor glides from bottom-right to hover over a "Confirm Order" button, clicks (button scales to 0.95 and bounces), and a success badge pops up.
* **The Math to Practice**:
  ```tsx
  const cursorX = interpolate(frame, [10, 40], [1200, 960], { easing: Easing.out(Easing.quad), extrapolate: 'clamp' });
  const cursorY = interpolate(frame, [10, 40], [800, 540], { easing: Easing.out(Easing.quad), extrapolate: 'clamp' });
  const clickScale = spring({ frame: frame - 45, fps, config: { damping: 10 } });
  ```
* **Iteration Check**: Ensure cursor movement decelerates naturally as it approaches the button target.

---

### Kata 20: The iOS-Style Notification Toast
* **Concept**: Spring entrance from top screen boundary, timed rest interval, and glide-away exit.
* **Composition Specs**: `1080x1920` (Vertical 9:16), 30 FPS, 120 frames (4 seconds).
* **Target Visual**: An iOS dynamic island pill expands downward (`translateY: -150px -> 80px`), displays a payment alert, holds for 2 seconds, and slides cleanly back into the notch.
* **The Math to Practice**:
  ```tsx
  const entrance = spring({ frame, fps, config: { damping: 14, mass: 0.5 } });
  const exit = interpolate(frame, [80, 100], [0, -250], { extrapolateLeft: 'clamp' });
  ```
* **Iteration Check**: Position strictly within the mobile safe zone.

---

### Kata 21: The Ambient Floating Badge (Continuous Sine Motion)
* **Concept**: Infinite periodic oscillation using trigonometric math: $\sin(\text{frame} \times \text{speed})$.
* **Composition Specs**: `1920x1080`, 30 FPS, 90 frames (3 seconds, looping).
* **Target Visual**: An infographic badge floats weightlessly with a continuous subtle vertical bob of $\pm 8\text{px}$ and a responsive soft drop-shadow.
* **The Math to Practice**:
  ```tsx
  const floatY = Math.sin((frame / fps) * Math.PI * 1.5) * 8;
  const shadowBlur = 20 + Math.sin((frame / fps) * Math.PI * 1.5) * 5;
  ```
* **Iteration Check**: Ensure that for a 90-frame looping composition, the sine wave completes exact integer cycles so the loop has zero visible jump.

---

## Category F: Sound & Audio-Reactive Elements

### Kata 22: The SFX-Synced Metric Cascade
* **Concept**: Aligning exact frame audio triggers (`<Audio>`) to the impact keyframes of spring animations.
* **Composition Specs**: `1920x1080`, 30 FPS, 90 frames (3 seconds).
* **Target Visual & Audio**: 3 metric checks land with spring impacts at frames 15, 30, and 45; each impact triggers an exact synchronized audio "pop/chime" SFX.
* **The Architecture to Practice**:
  ```tsx
  <Sequence from={15}><Audio src={staticFile("pop.mp3")} volume={0.6} /></Sequence>
  <Sequence from={30}><Audio src={staticFile("pop.mp3")} volume={0.6} /></Sequence>
  <Sequence from={45}><Audio src={staticFile("pop.mp3")} volume={0.8} /></Sequence>
  ```
* **Iteration Check**: Verify audio starts on the exact frame the visual element reaches maximum velocity or impact.

---

### Kata 23: The Audio Waveform Equalizer
* **Concept**: `@remotion/media-utils` sampling driving SVG frequency bars.
* **Composition Specs**: `1920x1080`, 30 FPS, 150 frames (5 seconds).
* **Target Visual**: A live neon equalizer bar visualizer dancing responsively to a beat or voiceover track.
* **The Architecture to Practice**:
  ```tsx
  const audioData = useAudioData(staticFile("beat.mp3"));
  const frequencies = visualizeAudio({ fps, frame, audioData, numberOfSamples: 24 });
  ```
* **Iteration Check**: Guard with `if (!audioData) return null;` so preview doesn't crash while analyzing audio buffer.

---

### Kata 24: The Full Video Promo Snippet (Cap-stone Micro-Ad)
* **Concept**: Combining kinetic typography, an animated line chart, audio ducking, and transitions into a finished 6-second teaser.
* **Composition Specs**: `1920x1080`, 30 FPS, 180 frames (6 seconds).
* **Target Visual & Audio**:
  1. Sec 0-2: Kinetic word-by-word problem statement.
  2. Sec 2-5: Line graph draws in with rolling ARR metric ticker and pop SFX.
  3. Sec 5-6: Outro logo card with brand swell.
  4. Music ducks down during the voiceover and swells back up during the outro.

---

## Summary & Next Step

This catalog is your motion design workshop. By working through these katas, you transition from knowing Remotion theory to having an eye for visual timing and the ability to review or prompt AI agents with surgical precision.

Let's now update our master index and move **AI Prompt Engineering & Best Practices** to **Module 7**!
