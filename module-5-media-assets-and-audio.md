# Module 5: Assets, Media & Audio Synchronization

> **Goal**: Master how Remotion handles external assets (images, fonts, remote APIs) without breaking deterministic rendering, and learn the programmatic audio pipeline: **syncing sound effects (SFX)**, **audio ducking**, and **waveform visualization**.

---

## 1. Asset Handling: The `staticFile()` Rule

In standard web React or Vite apps, people often import local assets like this:
```tsx
// ⚠️ Can cause path issues during headless rendering / SSR
import logo from './assets/logo.png';
```

Remotion uses a specialized directory called `public/` and a built-in helper: **`staticFile()`**.

### How `staticFile()` Works
Any file placed inside the `public/` directory (e.g., `public/images/logo.png` or `public/audio/whoosh.mp3`) is served via a local HTTP server during preview and bundled automatically during rendering.

```tsx
import { Img, staticFile } from 'remotion';

export const BrandHeader = () => {
  return (
    <Img
      src={staticFile("images/logo.png")}
      style={{ width: 120, height: 120 }}
    />
  );
};
```

### `<Img>` vs standard `<img>`:
Always use Remotion’s `<Img>` component rather than the HTML `<img>` tag:
* Remotion's `<Img>` pauses the frame capture until the image is fully decoded into memory.
* Standard `<img>` can cause blank or half-rendered images if the browser takes a screenshot before the JPEG decodes.

---

## 2. Asynchronous Data & Fonts: `delayRender()` and `continueRender()`

What if your video needs to fetch data from a REST API or load custom Google Fonts before rendering starts?

### The Race Condition Problem:
If Chromium starts capturing Frame 0 before your web font finishes downloading or your API returns:
* Frame 0 to 15 will render with standard fallback fonts (Times New Roman).
* Frame 16 suddenly switches to the downloaded font! The resulting video has an ugly visual glitch.

### The Solution: Remotion's Render Locks
Remotion solves this with two functions:
1. `delayRender()`: Tells Chromium *"Hold on, do not take screenshots yet!"* Returns a lock ID handle.
2. `continueRender(handle)`: Releases the lock once your assets are ready.

```tsx
import { useEffect, useState } from 'react';
import { delayRender, continueRender, cancelRender } from 'remotion';

export const RemoteDataScene = () => {
  const [data, setData] = useState(null);
  const [handle] = useState(() => delayRender("Fetching Q3 financial metrics"));

  useEffect(() => {
    fetch("https://api.mycompany.com/v1/q3-report")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        continueRender(handle); // Release lock! Rendering can now safely start.
      })
      .catch((err) => {
        cancelRender(err); // Abort render with clear error log
      });
  }, [handle]);

  if (!data) return null;

  return <div>Loaded {data.revenue}</div>;
};
```

> **For Fonts:**
> Use Remotion’s `@remotion/google-fonts` package (e.g., `loadFont()` from `@remotion/google-fonts/Inter`). It automatically wraps `delayRender()` under the hood so fonts are 100% loaded before Frame 0 renders.

---

## 3. Audio in Remotion: `<Audio />`

Just like video components, audio in Remotion is declared in JSX using the `<Audio />` component:

```tsx
import { Audio, staticFile } from 'remotion';

export const SoundTrack = () => {
  return <Audio src={staticFile("audio/background-beat.mp3")} />;
};
```

### How Remotion Processes Audio:
* Chromium does **not** record audio via virtual speaker loopback.
* Remotion reads the audio file's waveform and metadata.
* When rendering, Remotion gives FFmpeg the exact millisecond timestamps and volume curves to mix the final audio tracks directly into the `.mp4` file.

---

## 4. Syncing Sound Effects (SFX) to Animations

The hallmark of a great infographic video is **haptic audio feedback**:
* A subtle *"pop"* sound when a stat badge scales in.
* A *"whoosh"* sound when a slide transitions.
* A soft *"tick"* sound as numbers count up.

### The Sequence Trigger Pattern
To play a sound effect at an exact moment, wrap `<Audio />` in a `<Sequence>` at the keyframe:

```tsx
import { Sequence, Audio, staticFile } from 'remotion';
import { MetricBadge } from './MetricBadge';

export const StatScene = () => {
  return (
    <>
      {/* Visual Badge pops in at Frame 20 */}
      <Sequence from={20}>
        <MetricBadge title="Growth" value="+142%" />
      </Sequence>

      {/* Pop sound effect triggers exactly at Frame 20 */}
      <Sequence from={20}>
        <Audio src={staticFile("audio/pop.mp3")} volume={0.6} />
      </Sequence>
    </>
  );
};
```

---

## 5. Audio Ducking (Music Fading During Voiceovers)

**Audio Ducking** is an essential audio engineering technique: when a voiceover is speaking, the background music volume automatically lowers (ducks) to 15-20%, and smoothly ramps back up to 80% when the voice stops.

### Remotion Volume Ramping with `interpolate()`
Because the `volume` prop on `<Audio />` can take a function `(frame) => number`, you can animate volume mathematically:

```tsx
import { Audio, staticFile, useCurrentFrame, interpolate } from 'remotion';

export const BackgroundMusic = () => {
  const frame = useCurrentFrame();

  // Voiceover speaks between Frame 30 (1s) and Frame 150 (5s)
  const volume = interpolate(
    frame,
    [0,  30,  45,  135, 150], // Keyframe timestamps
    [0.8, 0.8, 0.15, 0.15, 0.8], // Volume levels (80% -> 15% -> 80%)
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <Audio
      src={staticFile("audio/lofi-track.mp3")}
      volume={volume}
    />
  );
};
```

---

## 6. Audio Visualization Fundamentals (`@remotion/media-utils`)

Remotion has first-class support for audio reactive graphics: creating visualizers that pulse, bounce, or draw equalizer bars driven by the audio track.

### The Architecture:
1. `useAudioData(src)`: Analyzes the audio file and extracts frequency spectrums.
2. `visualizeAudio({ frame, fps, numberOfSamples })`: Returns an array of frequency values (0.0 to 1.0) for the current frame.

```tsx
import { useCurrentFrame, useVideoConfig, staticFile } from 'remotion';
import { useAudioData, visualizeAudio } from '@remotion/media-utils';

export const AudioWaveform = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const audioSrc = staticFile("audio/beat.mp3");
  const audioData = useAudioData(audioSrc);

  if (!audioData) return null;

  // Extract 16 frequency bands for the current frame
  const frequencies = visualizeAudio({
    fps,
    frame,
    audioData,
    numberOfSamples: 16,
  });

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', height: 100 }}>
      {frequencies.map((frequency, i) => (
        <div
          key={i}
          style={{
            width: 12,
            height: `${frequency * 100}%`,
            backgroundColor: '#38bdf8',
            borderRadius: 6,
          }}
        />
      ))}
    </div>
  );
};
```

---

## 7. How to Prompt AI Agents for Assets & Audio

When directing an AI agent to handle media and audio, use these strict constraints:

### 🎯 High-Precision Media & Audio Prompt:
> *"Implement media and sound effects for the `FinancialSummary` scene:
> 1. Assets:
>    - Load the company logo using `<Img src={staticFile('images/logo.svg')} />`.
>    - Load the Inter font using `@remotion/google-fonts/Inter` to prevent FOUT (flash of unstyled text).
> 2. Sound Effects Sync:
>    - At frame 15 (when the main stat card enters), trigger `<Audio src={staticFile('sfx/whoosh.mp3')} volume={0.5} />` inside a `<Sequence from={15}>`.
>    - At frame 45 (when the success badge pops), trigger `<Audio src={staticFile('sfx/chime.mp3')} volume={0.7} />` inside a `<Sequence from={45}>`.
> 3. Background Music Ducking:
>    - Play `audio/background.mp3` throughout the video.
>    - Use `interpolate()` on the volume prop to duck volume from 0.7 down to 0.15 during the voiceover (frames 30 to 210), with 15-frame fade ramps."*

---

## Review Checklist for Module 5

| Check | Requirement |
| :--- | :--- |
| **Asset URLs** | Are all local images and audio wrapped in `staticFile("path")`? |
| **Image Tags** | Is Remotion's `<Img />` used instead of raw HTML `<img>`? |
| **Font & API Locks** | Are remote API calls or custom fonts guarded by `delayRender()` and `continueRender()`? |
| **Audio Timing** | Are one-shot SFX placed inside `<Sequence from={targetFrame}>` rather than relying on delayed JS timers? |
| **Volume Clamping** | Are volume interpolations clamped between `0` and `1`? |

---

*Final step: **Module 6: AI Prompt Engineering & Code Review** (Putting it all together into production workflows and building automated video pipelines)!*
