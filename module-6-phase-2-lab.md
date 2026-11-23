# Module 6 Phase 2: Advanced Motion, Data & Camera Lab

> **Goal**: Deepen advanced motion engineering across **Category B (Kinetic Typography)**, **Category C (Data Visualization)**, and **Category D (Camera & Scene Transitions)** with 12 high-fidelity practice exercises (Practices 25–36). Master complex mathematical curves, 3D CSS spatial setups, SVG path transformations, and frame-accurate timing.

---

## The Practice & Iteration Loop

Follow the exact 4-step workflow established in Phase 1:

```
[1. Isolate the Math] ──> [2. Preview in Studio] ──> [3. Render MP4] ──> [4. Visual Review & Iterate]
(Spring / Trig / SVG)     (Scrub & Test Frame 0)    (bun run remotion:render) (Check Pacing, Jitter, Clipping)
```

### Quick Commands Reference
* **Launch Preview Studio**:
  ```bash
  bun run remotion:studio
  ```
* **Render a Specific Exercise to MP4**:
  ```bash
  bun run remotion:render <CompositionId> out/<CompositionId>.mp4
  ```

---

## 📐 Video Typography & Spatial Scale Reference (1080p Canvas)

| Role in Composition | Dimensions / Font Size | Recommended Line Height / Spacing | Usage |
| :--- | :--- | :--- | :--- |
| **Hero Title / Hook** | `96px` – `130px` | `1.1` (tight tracking `-2px`) | Split-flap boards, kinetic wave titles |
| **Code Editor Body** | `28px` – `34px` | `1.6` (monospace) | Syntax highlighted explainer cards |
| **Chart Axis & Data Values** | `24px` – `36px` | `1.2` (tabular numbers) | Speedometer labels, tooltip values |
| **Rank Card / List Items** | `32px` – `44px` | `1.3` | Dynamic leaderboard rankings |
| **Subtitle / Karaoke Pill** | `48px` – `64px` | `1.4` (bold sans-serif) | Spoken word captions, dynamic pill track |
| **3D Stage Depth** | `perspective: 1200px` | `transformStyle: 'preserve-3d'` | Isometric rooms, 3D cube transitions |

---

## Category B: Advanced Kinetic Typography & Text Effects

### Practice 25: The 3D Split-Flap / Departure Board Character Roll
* **Concept**: 3D spatial rotation along the X-axis (`rotateX`) simulating an analog airport departure board flipping through characters.
* **Composition Specs**: `1920x1080`, 30 FPS, 120 frames (4 seconds).
* **Target Visual**: A split-flap sign with 8 dark charcoal tiles (`"DEPARTED"` $\to$ `"BOARDING"`). Each flap is split into a top half and a bottom half, flipping downwards with mechanical tick rhythm and subtle shadow drops.
* **The Math to Practice**:
  ```tsx
  // Stagger per column flap:
  const colDelay = index * 4;
  const flapFrame = Math.max(0, frame - colDelay);
  // Half-revolution flip (0 -> 180deg):
  const flipProgress = interpolate(flapFrame, [0, 16], [0, 180], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  // Top flap perspective rotation:
  // transform: `perspective(600px) rotateX(-${flipProgress}deg)`
  ```
* **Iteration Check**: Verify `backface-visibility: hidden` is applied and that top and bottom flap halves have identical seam alignments without a gap.

---

### Practice 26: The Code Syntax Highlighter with Staggered Line Reveal
* **Concept**: Staggered vertical line cascade with keyword syntax coloring and a scanning active-line highlight border.
* **Composition Specs**: `1920x1080`, 30 FPS, 150 frames (5 seconds).
* **Target Visual**: A sleek dark code window (`VS Code / JetBrains` aesthetic with traffic-light window controls) typing out a TypeScript Remotion function. Lines 1 to 6 reveal sequentially, while a luminous vertical accent bar slides smoothly to follow the currently rendering line.
* **The Math to Practice**:
  ```tsx
  const lineDelay = index * 12;
  const lineSpring = spring({
    frame: frame - lineDelay,
    fps,
    config: { damping: 14, mass: 0.5 },
  });
  const lineOpacity = lineSpring;
  const lineTranslateX = interpolate(lineSpring, [0, 1], [-20, 0]);

  // Active line indicator indicator tracking (e.g. line 0 to line 5):
  const activeLineIndex = Math.min(5, Math.floor(frame / 12));
  const indicatorY = interpolate(frame, [0, 60], [0, 5 * lineHeight], {
    easing: Easing.out(Easing.cubic),
    extrapolate: 'clamp',
  });
  ```
* **Iteration Check**: Check that indentation whitespace is preserved (`fontFamily: 'monospace'`, `whiteSpace: 'pre'`) and typography scale is easily readable on mobile screens (`>= 28px`).

---

### Practice 27: The Kinetic Text Wave & Character Physics
* **Concept**: Combining a continuous mathematical sine-wave carrier with an initial damped spring entrance.
* **Composition Specs**: `1920x1080`, 30 FPS, 120 frames (4 seconds).
* **Target Visual**: A headline (`"SUPERCHARGED"`) where each individual character pops up from scale 0 with an aggressive spring, and upon settling, continues an organic ambient undulating ocean wave motion.
* **The Math to Practice**:
  ```tsx
  const charDelay = index * 3;
  // Entrance spring:
  const entrance = spring({
    frame: frame - charDelay,
    fps,
    config: { damping: 12, mass: 0.4, stiffness: 120 },
  });
  
  // Continuous ambient sine wave (after entrance settles):
  const waveFrequency = 0.12;
  const waveAmplitude = 12; // 12px vertical float
  const waveY = Math.sin((frame - charDelay) * waveFrequency) * waveAmplitude;
  
  // Blend entrance into ambient wave:
  const translateY = interpolate(entrance, [0, 1], [60, 0]) + (entrance >= 0.95 ? waveY : 0);
  const scale = entrance;
  ```
* **Iteration Check**: Does the transition from spring entrance to sine wave feel seamless, or does it hitch? Ensure `entrance >= 0.95` smoothly blends in.

---

### Practice 28: Dynamic Subtitle / Karaoke Pill Tracker
* **Concept**: Real-time bounding highlight tracking across spaced text tokens matching speech cadence.
* **Composition Specs**: `1080x1920` (Vertical 9:16), 30 FPS, 120 frames (4 seconds).
* **Target Visual**: A 2-line quote (`"Build videos programmatically with React and code"`). Inactive words stay muted at 40% white opacity. A glowing purple rounded pill smoothly glides and morphs its width and X-position to wrap around the active spoken word in real-time.
* **The Math to Practice**:
  ```tsx
  // Word timing definitions:
  const wordTimestamps = [
    { text: "Build", start: 10, end: 22 },
    { text: "videos", start: 23, end: 40 },
    { text: "programmatically", start: 41, end: 68 },
    { text: "with", start: 69, end: 78 },
    { text: "React", start: 79, end: 95 },
  ];
  // Calculate active word index and highlight pill interpolation:
  const activeWord = wordTimestamps.find(w => frame >= w.start && frame <= w.end);
  ```
* **Iteration Check**: Verify the pill transitions smoothly between words without jumping or snapping awkwardly.

---

## Category C: Advanced Data Visualization & Real-Time Infographics

### Practice 29: Multi-Series Curved Area Chart with Fill Gradient & Scanning Crosshair
* **Concept**: Dual SVG cubic bezier curves (`M ... C ...`), linear gradient fills, and an animated vertical scanning crosshair displaying real-time coordinate tooltips.
* **Composition Specs**: `1920x1080`, 30 FPS, 150 frames (5 seconds).
* **Target Visual**: An enterprise dashboard card showing two financial metrics (`Revenue` vs `Expenses`). Both lines draw in from left to right. Once drawn (frame 45), a vertical neon cyan crosshair sweeps across the data points, popping up metric floating tooltips (`$1.2M`, `$840K`) at intersecting coordinates.
* **The Math to Practice**:
  ```tsx
  const pathLength = 1600;
  const drawProgress = interpolate(frame, [10, 50], [pathLength, 0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolate: 'clamp',
  });
  
  // Scanning crosshair X position:
  const crosshairX = interpolate(frame, [60, 130], [200, 1400], {
    easing: Easing.inOut(Easing.quad),
    extrapolate: 'clamp',
  });
  ```
* **Iteration Check**: Confirm SVG gradient fills fade in smoothly without clipping outside the chart boundary box.

---

### Practice 30: The Gauge / Speedometer Radial Dial with Inertial Needle
* **Concept**: Polar coordinate mathematics (`cos`/`sin`), radial tick marks, and angular needle rotation with spring damping and recoil.
* **Composition Specs**: `1080x1080` (Square 1:1), 30 FPS, 90 frames (3 seconds).
* **Target Visual**: A circular automotive/performance dial (`0` to `100`). The needle starts at `-120deg` (zero), rockets to `+105deg` (score 94) with realistic inertia overshoot, and vibrates slightly before resting, while a digital counter in the center ticks up synchronously.
* **The Math to Practice**:
  ```tsx
  const needleSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 9, mass: 0.6, stiffness: 85 }, // Slight overshoot bounce
  });
  const angle = interpolate(needleSpring, [0, 1], [-120, 105]);
  
  // Radial tick calculation:
  // x = cx + r * Math.cos(angleInRad)
  // y = cy + r * Math.sin(angleInRad)
  ```
* **Iteration Check**: Ensure the needle anchor point (`transformOrigin: 'bottom center'` or SVG center pivot) does not drift off the central hub.

---

### Practice 31: The Interactive Leaderboard / Rank Swap Animation
* **Concept**: Layout spring interpolation with dynamic coordinate delta calculation when array items swap positions.
* **Composition Specs**: `1920x1080`, 30 FPS, 120 frames (4 seconds).
* **Target Visual**: A top 4 leaderboard (`#1 Alpha`, `#2 Bravo`, `#3 Charlie`, `#4 Delta`). At frame 45, `#2 Bravo` scores points, accelerating upwards, while `#1 Alpha` drops down to 2nd place. The cards smoothly glide past each other with z-index elevation and score count updates.
* **The Math to Practice**:
  ```tsx
  const swapProgress = spring({
    frame: frame - 45,
    fps,
    config: { damping: 14, mass: 0.7, stiffness: 100 },
  });
  const cardHeightWithGap = 120; // 100px height + 20px gap
  const bravoY = interpolate(swapProgress, [0, 1], [cardHeightWithGap, 0]);
  const alphaY = interpolate(swapProgress, [0, 1], [0, cardHeightWithGap]);
  ```
* **Iteration Check**: Give the moving card a higher `zIndex: 10` and an elevated drop-shadow during the swap so it clearly passes over the descending card.

---

### Practice 32: The Interactive Heatmap Matrix Grid Reveal
* **Concept**: 2D coordinate grid indexing, Manhattan distance wave timing, and numeric color-intensity interpolation.
* **Composition Specs**: `1920x1080`, 30 FPS, 120 frames (4 seconds).
* **Target Visual**: A 7-row by 16-column contribution/density matrix (112 rectangular cells). A diagonal wave of energy sweeps from top-left `(0, 0)` to bottom-right `(6, 15)`. Each cell scales in from 0 and lights up with an emerald green luminosity matching its data density value.
* **The Math to Practice**:
  ```tsx
  // Manhattan distance diagonal delay:
  const delay = (rowIndex + colIndex) * 2;
  const cellSpring = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, mass: 0.3 },
  });
  const scale = cellSpring;
  // Intensity color map: 0 (dark navy) to 4 (bright emerald green #10b981)
  ```
* **Iteration Check**: Make sure cells with 0 intensity still render visible dark placeholders rather than disappearing completely.

---

## Category D: Advanced Transitions & 2.5D / 3D Camera Systems

### Practice 33: The Parallax Multi-Plane Camera Pan
* **Concept**: Multi-depth coordinate transforms simulating optical focal separation and parallax depth of field.
* **Composition Specs**: `1920x1080`, 30 FPS, 120 frames (4 seconds).
* **Target Visual**: A horizontal camera pan across a cinematic space. The background star/grid plane glides slowly (`-80px`), the midground feature cards move at normal speed (`-350px`), and a foreground floating glass badge blurs and races past (`-750px`), producing intense cinematic depth.
* **The Math to Practice**:
  ```tsx
  const pan = interpolate(frame, [15, 105], [0, 1], {
    easing: Easing.inOut(Easing.cubic),
    extrapolate: 'clamp',
  });
  const bgTranslateX = interpolate(pan, [0, 1], [0, -80]);
  const midTranslateX = interpolate(pan, [0, 1], [0, -350]);
  const foreTranslateX = interpolate(pan, [0, 1], [0, -750]);
  ```
* **Iteration Check**: Apply a subtle `filter: blur(4px)` to the foreground layer to emulate camera macro depth-of-field.

---

### Practice 34: The Continuous Zoom-Through / Infinite Dive Transition
* **Concept**: Non-linear exponential camera scale and alpha thresholding to pass *through* an object into the next scene.
* **Composition Specs**: `1920x1080`, 30 FPS, 120 frames (4 seconds).
* **Target Visual**: Scene A presents a sleek smartphone mockup displaying a chart. At frame 50, the camera dives straight into the screen of the phone: the frame expands exponentially until the screen pixels fill the entire viewport, seamlessly revealing Scene B (the full-screen dashboard) without any visible cut.
* **The Math to Practice**:
  ```tsx
  // Exponential zoom from 1.0x to 15.0x:
  const zoomProgress = interpolate(frame, [45, 80], [0, 1], {
    easing: Easing.in(Easing.exp),
    extrapolate: 'clamp',
  });
  const cameraScale = interpolate(zoomProgress, [0, 1], [1, 15]);
  const sceneAOpacity = interpolate(frame, [72, 80], [1, 0], { extrapolate: 'clamp' });
  const sceneBOpacity = interpolate(frame, [74, 82], [0, 1], { extrapolate: 'clamp' });
  ```
* **Iteration Check**: Center the camera `transformOrigin` exactly on the target anchor point so the zoom doesn't drift sideways off-target.

---

### Practice 35: The 3D Cube / Isometric Room Rotation
* **Concept**: True 3D spatial geometry in CSS with `transformStyle: 'preserve-3d'` and dynamic surface lighting.
* **Composition Specs**: `1920x1080`, 30 FPS, 120 frames (4 seconds).
* **Target Visual**: An isometric 3D stage holding View 1. At frame 45, the entire stage rotates 90 degrees around its Y-axis in 3D perspective to present View 2 on its adjacent face, with realistic directional face shading darkening the exiting face.
* **The Math to Practice**:
  ```tsx
  const rotateSpring = spring({
    frame: frame - 40,
    fps,
    config: { damping: 14, mass: 0.8, stiffness: 80 },
  });
  const cubeAngle = interpolate(rotateSpring, [0, 1], [0, -90]);
  
  // Front Face: transform: `translateZ(${cubeSize / 2}px)`
  // Right Face: transform: `rotateY(90deg) translateZ(${cubeSize / 2}px)`
  // Container: transform: `perspective(1200px) rotateX(15deg) rotateY(${cubeAngle}deg)`
  ```
* **Iteration Check**: Ensure container has `transformStyle: 'preserve-3d'` and child faces have appropriate `translateZ` equal to half the container width (`width / 2`).

---

### Practice 36: The Glitch & RGB Split Flash Cut
* **Concept**: Chromatic aberration (splitting red and cyan channels with CSS blend modes) and deterministic pseudorandom slice displacement.
* **Composition Specs**: `1920x1080`, 30 FPS, 90 frames (3 seconds).
* **Target Visual**: Scene 1 plays until frame 40; for 8 frames, a high-frequency cybernetic glitch tears the image horizontally with red/cyan pixel separation and scanline noise, snapping immediately into Scene 2 on frame 48.
* **The Math to Practice**:
  ```tsx
  const isGlitchFrame = frame >= 40 && frame <= 48;
  // Deterministic pseudo-random jitter based on frame:
  const seed = Math.sin(frame * 9999);
  const redShiftX = isGlitchFrame ? (seed * 18) : 0;
  const cyanShiftX = isGlitchFrame ? (-seed * 18) : 0;
  
  // RGB Split with mix-blend-mode: screen:
  // Red Layer: style: { transform: `translateX(${redShiftX}px)`, filter: 'url(#red-channel)' }
  // Cyan Layer: style: { transform: `translateX(${cyanShiftX}px)`, filter: 'url(#cyan-channel)' }
  ```
* **Iteration Check**: Ensure the glitch duration is punchy and short (6 to 10 frames max). Anything longer strains the viewer's eyes and loses momentum.

---

## 🚀 Execution Checklist for Phase 2

When you build each component in `src/practices/`:
- [ ] Create `Practice25DepartureBoard.tsx` through `Practice36GlitchCut.tsx`.
- [ ] Register each composition in [Root.tsx](file:///c:/Users/skmpa/learn/rm/src/Root.tsx) with clear IDs (`Practice25`, `Practice26`, etc.).
- [ ] Inspect each animation in Remotion Studio at `frame 0` (clean entrance) and scrub to verify curve deceleration.
- [ ] Render the output video with `bun run remotion:render <CompositionId> out/<CompositionId>.mp4`.
