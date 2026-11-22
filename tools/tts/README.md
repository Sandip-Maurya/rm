# Remotion TTS (kokoro-onnx)

Local, free English voiceover via [kokoro-onnx](https://github.com/thewh1teagle/kokoro-onnx).

## Locked voice profile

Reference sample: `public/audio/samples/sample-energy-blend-120.wav`

| Setting | Value |
| --- | --- |
| Voice | **75%** `am_channel_short` + **25%** `am_puck` (`--voice energy`) |
| Lang | `en-us` |
| Speed | **1.20** |
| Sentence pause | **0.20** |
| Clause pause | **0.09** |

Pack file: `voices/am_channel_short.npy`

## Setup (once)

```bash
cd tools/tts
uv sync
```

Download models into `models/` (gitignored):

- https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx
- https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin

## Generate

```bash
# Locked defaults (energy blend @ 1.20)
uv run python generate.py

# Custom text
uv run python generate.py --text "Hello from Remotion." --out out/hello.wav

# Pure channel pack (no puck blend)
uv run python generate.py --voice short --speed 1.02

# List voices
uv run python generate.py --list-voices
```

Outputs land in `tools/tts/out/` by default. Copy finished clips into `public/audio/` for Remotion `staticFile()`.
