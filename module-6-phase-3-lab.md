# Module 6 Phase 3: Advanced Graphics, Particle Physics & 3D WebGL Lab

> **Goal**: Expand beyond standard DOM elements into **HTML5 Canvas simulations, mathematical & algorithmic generative art, 3D WebGL scenes with Three.js, and custom GLSL fragment shaders**. This phase covers Practices 37 through 52 across 4 advanced technical pillars.

---

## 🏛️ The 4 Advanced Pillars

```
                                  ADVANCED REMOTION LAB (PHASE 3)
                                                │
         ┌──────────────────────┬───────────────┴───────────────┬──────────────────────┐
         │                      │                               │                      │
    Category G             Category H                      Category I             Category J
3D Space & WebGL       HTML5 Canvas API &              Algorithmic Math &      Media, Shaders &
(Three.js / Meshes)    Particle Physics                Generative Vectors      Pixel FX
(Practices 37-40)      (Practices 41-44)               (Practices 45-48)       (Practices 49-52)
```

---

## The Golden Rules for Advanced Remotion Graphics

1. **Strict Frame Determinism**: 
   * Never use `Math.random()` inside the render loop without a deterministic seed.
   * State must be a pure mathematical function of `frame`: $S(t) = f(\text{frame})$. Scrubbing backwards must yield the exact same pixel state as scrubbing forwards.
2. **Offscreen Canvas & Context Clearing**:
   * For HTML5 `<canvas>`, always clear the context (`ctx.clearRect(0, 0, width, height)`) at the start of each frame before redrawing.
3. **Canvas / WebGL Dimensions Match Composition**:
   * Always match the `<canvas>` internal buffer dimensions (`width={1920}` `height={1080}`) to the composition canvas; avoid letting CSS scale an undersized canvas.

---

## Category G: 3D Graphics & Spatial Rendering (WebGL / Three.js)

### Practice 37: The Revolving 3D Device Mockup (Procedural / GLTF Mesh)
* **Concept**: Rendering true 3D geometry in Remotion using `@remotion/three` and `three`, animating camera orbit and studio lighting.
* **Composition Specs**: `1920x1080`, 30 FPS, 120 frames (4 seconds).
* **Target Visual**: A sleek metallic smartphone or tablet chassis revolving smoothly in 3D space (`rotateY: -30deg -> +30deg`). Dynamic directional light casts realistic specular highlights across the glass and beveled aluminum edges.
* **The Math / Architecture to Practice**:
  ```tsx
  import { ThreeCanvas } from '@remotion/three';
  import * as THREE from 'three';

  // Inside Three.js scene:
  const rotationY = interpolate(frame, [0, 120], [-Math.PI / 6, Math.PI / 6], {
    easing: Easing.inOut(Easing.sin),
  });
  // <mesh rotation={[0.2, rotationY, 0]}>
  //   <boxGeometry args={[4, 7, 0.3]} />
  //   <meshStandardMaterial metalness={0.8} roughness={0.2} color="#1e293b" />
  // </mesh>
  ```
* **Iteration Check**: Verify lighting is set up with both ambient light (`intensity={0.6}`) and at least one directional point light to reveal material depth.

---

### Practice 38: The 3D Floating Geometry Cluster with Spring Oscillation
* **Concept**: Multiple procedural 3D meshes (icosahedron, torus, sphere) interacting in 3D coordinate space with independent spring entrances and harmonic float.
* **Composition Specs**: `1920x1080`, 30 FPS, 120 frames (4 seconds).
* **Target Visual**: 5 iridescent glass/chrome abstract geometric shapes floating in front of dark typography. Each shape pops in with a staggered spring scale and drifts with slow continuous sine-wave rotation on all 3 axes.
* **The Math / Architecture to Practice**:
  ```tsx
  const entrance = spring({ frame: frame - index * 6, fps, config: { damping: 12, mass: 0.5 } });
  const floatY = Math.sin(frame * 0.05 + index) * 0.4;
  const rotX = frame * 0.02 + index;
  // position={[x, y + floatY, z]} scale={entrance}
  ```
* **Iteration Check**: Does the depth sorting work properly? Verify meshes occlude one another naturally based on true Z-depth.

---

### Practice 39: 3D Camera Fly-Through / Tunnel Effect
* **Concept**: Driving a Three.js perspective camera down a 3D spline curve or coordinate path through consecutive geometric gates.
* **Composition Specs**: `1920x1080`, 30 FPS, 150 frames (5 seconds).
* **Target Visual**: An infinite cyber tunnel of glowing neon square frames. The camera accelerates forward down the Z-axis, passing through ring after ring with a subtle bank/roll as it curves.
* **The Math / Architecture to Practice**:
  ```tsx
  const cameraZ = interpolate(frame, [0, 150], [50, -150], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolate: 'clamp',
  });
  const cameraRoll = Math.sin(frame * 0.04) * 0.1;
  // camera.position.set(0, 0, cameraZ);
  // camera.rotation.z = cameraRoll;
  ```
* **Iteration Check**: Ensure nearest rings smoothly fade to 0 opacity before clipping harshly against the camera's near-plane (`camera.near`).

---

### Practice 40: 3D Extruded Data Bar / Terrain Elevation
* **Concept**: Animating 3D mesh scale along the Y-axis with floor shadows and ground plane grid.
* **Composition Specs**: `1920x1080`, 30 FPS, 120 frames (4 seconds).
* **Target Visual**: An isometric 3D bar chart sitting on a dark grid floor plane. Four 3D pillars with bevels rise out of the ground with spring damping, casting soft drop-shadows onto the grid plane beneath them.
* **The Math / Architecture to Practice**:
  ```tsx
  const heightProgress = spring({
    frame: frame - index * 8,
    fps,
    config: { damping: 14, mass: 0.7, overshootClamping: true },
  });
  const currentHeight = targetHeight * heightProgress;
  // Scale Y and adjust position Y so it grows upward from base:
  // position={[x, currentHeight / 2, z]}
  // scale={[1, currentHeight, 1]}
  ```
* **Iteration Check**: Verify the base of each bar remains pinned to `Y = 0` (the floor) as it expands.

---

## Category H: HTML5 Canvas API & Particle Physics (Simulations)

### Practice 41: Deterministic Physics Confetti & Gravity Engine
* **Concept**: Simulating 300+ physical particles with mass, air drag, angular velocity, and gravity using pure deterministic frame evaluation.
* **Composition Specs**: `1920x1080`, 30 FPS, 90 frames (3 seconds).
* **Target Visual**: A celebration explosion bursting upward from the center `(960, 540)` at frame 15, arcing into the air, and drifting down under gravity with fluttering 2D rotations and air resistance.
* **The Math to Practice**:
  ```tsx
  // Pure deterministic physics per particle i:
  const t = Math.max(0, (frame - 15) / fps); // time in seconds
  const vx = p.initialVx * Math.pow(p.drag, t * fps);
  const vy = p.initialVy + 0.5 * GRAVITY * t * t;
  const x = p.startX + p.initialVx * t * 60;
  const y = p.startY + p.initialVy * t * 60 + 0.5 * GRAVITY * t * t * 60;
  const rotation = p.initialAngle + p.angularVelocity * t;
  ```
* **Iteration Check**: Scrub backward and forward in Studio; confirm confetti positions are 100% reproducible without random jitter on rewinds.

---

### Practice 42: Interactive Constellation / Proximity Mesh
* **Concept**: Drawing dynamic edge connections between moving nodes on an HTML5 2D canvas based on Euclidean distance thresholds.
* **Composition Specs**: `1920x1080`, 30 FPS, 120 frames (4 seconds).
* **Target Visual**: 80 glowing cyan nodes gently floating in space. Whenever any two nodes come within `160px` of each other, an edge line draws between them with opacity inversely proportional to distance ($1 - \frac{d}{160}$).
* **The Math to Practice**:
  ```tsx
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dist = Math.hypot(dx, dy);
      if (dist < maxDistance) {
        const alpha = (1 - dist / maxDistance) * 0.8;
        ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }
  }
  ```
* **Iteration Check**: Optimize node count (60–100) so render time remains instantaneous at 30 FPS without frame lag.

---

### Practice 43: Audio-Driven Particle Orb / Frequency Visualizer
* **Concept**: Utilizing `@remotion/media-utils` audio spectrum frequencies to modulate particle radius, velocity, and color dispersion.
* **Composition Specs**: `1080x1080` (Square 1:1), 30 FPS, 150 frames (5 seconds).
* **Target Visual**: A pulsating glowing circular particle orb. High bass beats push the particles outward into explosive ripples, while treble frequencies modulate color hue (purple $\to$ hot magenta $\to$ cyan).
* **The Math to Practice**:
  ```tsx
  // Audio frequency evaluation:
  const audioData = visualizeAudio({
    fps,
    frame,
    audioSrc: staticFile('beat.mp3'),
    numberOfSamples: 32,
  });
  const bass = audioData[2]; // Low frequency energy (0 to 1)
  const orbRadius = interpolate(bass, [0, 1], [150, 320]);
  ```
* **Iteration Check**: Provide a fallback audio-simulation sine wave if no audio file is provided so the composition renders standalone.

---

### Practice 44: Fluid Smoke / Ink Trail Dissolve
* **Concept**: Particle emitters with aging lifespan, opacity dissipation, and pseudo-noise velocity deflection.
* **Composition Specs**: `1920x1080`, 30 FPS, 120 frames (4 seconds).
* **Target Visual**: A glowing cursor or logo moves along an infinity path, leaving behind a curling, dissipating smoke trail of glowing particles that expand, fade, and dissolve into the dark background.
* **The Math to Practice**:
  ```tsx
  // Particle life cycle:
  const age = frame - p.spawnFrame;
  const life = Math.max(0, 1 - age / p.maxLife);
  const size = p.initialSize * (1 + (1 - life) * 2);
  const opacity = life * 0.7;
  ```
* **Iteration Check**: Ensure particles older than `maxLife` are culled from processing so canvas render loops stay lightweight.

---

## Category I: Algorithmic Math & Generative Vector Graphics

### Practice 45: Complex SVG Path Morphing (Shape Shifting)
* **Concept**: Interpolating between different topological SVG path shapes using point-matching algorithms or path sampling.
* **Composition Specs**: `1080x1080` (Square 1:1), 30 FPS, 120 frames (4 seconds).
* **Target Visual**: A minimal geometric icon smoothly morphs: Circle $\to$ Hexagon $\to$ Lightning Bolt $\to$ Checkmark, with fluid elastic ease between transitions.
* **The Math to Practice**:
  ```tsx
  // Interpolating path coordinates:
  // samplePathPoints(svgA, numPoints) -> samplePathPoints(svgB, numPoints)
  const progress = interpolate(frame, [15, 45], [0, 1], {
    easing: Easing.bezier(0.2, 0.8, 0.2, 1),
    extrapolate: 'clamp',
  });
  // Lerp point positions: x = pA.x + (pB.x - pA.x) * progress
  ```
* **Iteration Check**: Ensure equal point distributions so path transitions do not twist or fold awkwardly in on themselves.

---

### Practice 46: Generative Perlin / Simplex Noise Waveforms
* **Concept**: Procedural 2D/3D simplex noise sampling driving multi-layered organic ribbons or glowing fluid audio bands.
* **Composition Specs**: `1920x1080`, 30 FPS, 120 frames (4 seconds).
* **Target Visual**: 3 overlapping glowing gradient ribbons (Siri / Apple Intelligence aesthetic) undulating across the screen with organic, silky, non-repeating fluid motion.
* **The Math to Practice**:
  ```tsx
  // Procedural wave point generation:
  for (let x = 0; x <= width; x += step) {
    const noiseVal = simplex2D(x * 0.003 + frame * 0.02, layerIndex * 10);
    const y = centerY + noiseVal * amplitude;
    points.push([x, y]);
  }
  // Render via SVG smooth bezier path
  ```
* **Iteration Check**: Verify the wave wraps smoothly at screen edges without hard clipping or sudden jumps.

---

### Practice 47: Procedural Network Graph / Neural Architecture
* **Concept**: Dynamically drawing an unfolding network topology (e.g. Transformer / Neural Net layers) with pulse packets traveling along synapses.
* **Composition Specs**: `1920x1080`, 30 FPS, 150 frames (5 seconds).
* **Target Visual**: Input nodes, hidden layers, and output nodes reveal from left to right. Once nodes lock in place, glowing energy packets travel along connecting lines from layer to layer, lighting up downstream nodes upon arrival.
* **The Math to Practice**:
  ```tsx
  // Synapse pulse position between Node A and Node B:
  const pulseProgress = ((frame - nodeA.activatedFrame) * speed) % 1;
  const pulseX = nodeA.x + (nodeB.x - nodeA.x) * pulseProgress;
  const pulseY = nodeA.y + (nodeB.y - nodeA.y) * pulseProgress;
  ```
* **Iteration Check**: Ensure energy pulses only trigger *after* the source node's entrance animation has fully settled.

---

### Practice 48: Mathematical Function Plotter (Lissajous & Strange Attractor)
* **Concept**: Parametric equations ($x(t), y(t)$) drawing glowing mathematical curves frame-by-frame with a luminous trailing head.
* **Composition Specs**: `1080x1080` (Square 1:1), 30 FPS, 120 frames (4 seconds).
* **Target Visual**: A brilliant Lissajous figure ($x = A \sin(at + \delta), y = B \sin(bt)$) drawing itself continuously with harmonic frequency shifts, featuring a glowing particle head that leads the path.
* **The Math to Practice**:
  ```tsx
  const delta = (frame / fps) * Math.PI * 0.5;
  const x = centerX + radius * Math.sin(3 * t + delta);
  const y = centerY + radius * Math.sin(4 * t);
  ```
* **Iteration Check**: Use an SVG `polyline` or canvas trail with fading point opacity to produce an electric neon glow.

---

## Category J: Dynamic Media, Shaders & Advanced Pixel Manipulation

### Practice 49: Custom GLSL Fragment Shader / Liquid Chrome Iridescence
* **Concept**: Executing a custom WebGL fragment shader with `time = frame / fps` to create dynamic procedural iridescent surfaces.
* **Composition Specs**: `1920x1080`, 30 FPS, 120 frames (4 seconds).
* **Target Visual**: A hypnotic background of shimmering liquid mercury and rainbow oil-slick sheen, with specular light ripples responding continuously to time.
* **The Math / Architecture to Practice**:
  ```glsl
  // GLSL Fragment Shader:
  uniform float u_time;
  uniform vec2 u_resolution;
  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float wave = sin(uv.x * 6.0 + u_time * 2.0) + cos(uv.y * 6.0 + u_time * 1.5);
    vec3 col = 0.5 + 0.5 * cos(u_time + uv.xyx + vec3(0.0, 2.0, 4.0));
    gl_FragColor = vec4(col, 1.0);
  }
  ```
* **Iteration Check**: Verify shader compiles cleanly and maintains 60/30 FPS render times without GPU stalls.

---

### Practice 50: Dynamic Screen Replacement & Glass Glare
* **Concept**: Nesting an interactive Remotion sub-composition or video inside a 3D transformed device screen with dynamic moving light reflections.
* **Composition Specs**: `1920x1080`, 30 FPS, 120 frames (4 seconds).
* **Target Visual**: A laptop chassis rotates into view. On its screen, an inner Remotion composition plays in perfect perspective, while an angled translucent white glare sweep glides across the glass screen.
* **The Math to Practice**:
  ```tsx
  // Diagonal glass glare sweep:
  const glareX = interpolate(frame, [30, 75], [-150, 250], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolate: 'clamp',
  });
  // style: { transform: `translateX(${glareX}%) skewX(-30deg)`, background: 'linear-gradient(...)' }
  ```
* **Iteration Check**: Set `mixBlendMode: 'overlay'` or `'screen'` with `pointerEvents: 'none'` so the glare highlights the content without washing out colors.

---

### Practice 51: Retro CRT Monitor / Scanlines & Barrel Distortion
* **Concept**: Simulating vintage display optics: SVG displacement / CSS barrel curvature, scanlines, and RGB phosphor pixel grid.
* **Composition Specs**: `1920x1080`, 30 FPS, 90 frames (3 seconds).
* **Target Visual**: A retro hacker terminal displaying boot logs. The screen has slight spherical barrel distortion, horizontal scanlines scrolling down, subtle phosphor flicker, and chromatic edge bleeding.
* **The Math to Practice**:
  ```tsx
  // Scanline vertical roll:
  const scanlineY = (frame * 2.5) % 8;
  const flicker = 0.96 + Math.sin(frame * 123) * 0.04;
  // vignette radial gradient + repeating-linear-gradient for scanlines
  ```
* **Iteration Check**: Keep the scanline opacity subtle (10–18%) so text remains fully legible.

---

### Practice 52: Dynamic Motion Blur & Velocity-Aware Ghost Trails
* **Concept**: Simulating realistic camera shutter angle / motion blur by sampling velocity ($\Delta x$) and rendering multi-sample ghost frames.
* **Composition Specs**: `1920x1080`, 30 FPS, 90 frames (3 seconds).
* **Target Visual**: A card or logo rockets across the screen from left to right at high speed. As its velocity peaks, it develops directional motion blur with trailing transparent silhouettes, which snap back into a razor-sharp resting state as it decelerates.
* **The Math to Practice**:
  ```tsx
  // Calculate instantaneous velocity:
  const currentX = getPositionX(frame);
  const prevX = getPositionX(frame - 0.5);
  const velocity = Math.abs(currentX - prevX);
  const blurAmount = Math.min(24, velocity * 0.8);
  // style: { filter: `blur(${blurAmount}px)` }
  ```
* **Iteration Check**: Verify that when the element stops moving (`velocity === 0`), `blurAmount` is strictly `0px` with no residual softness.

---

## 🚀 Execution Checklist for Phase 3

When building each component in `src/practices/`:
- [ ] Create `Practice37DeviceMockup.tsx` through `Practice52MotionBlur.tsx`.
- [ ] For Three.js exercises (37–40), install `@remotion/three` and `three` if not already present.
- [ ] For Canvas exercises (41–44), ensure pure deterministic frame math without unseeded `Math.random()`.
- [ ] Register each composition in [Root.tsx](file:///c:/Users/skmpa/learn/rm/src/Root.tsx).
- [ ] Test in Studio (`bun run remotion:studio`) and render with `bun run remotion:render <CompositionId> out/<CompositionId>.mp4`.
