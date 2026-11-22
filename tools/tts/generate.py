"""
Generate voiceover WAV files with kokoro-onnx.

Locked default (sample-energy-blend-120):
  75% am_channel_short + 25% am_puck @ speed 1.20, pauses 0.20 / 0.09
"""

from __future__ import annotations

import argparse
from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

ROOT = Path(__file__).resolve().parent
MODELS = ROOT / "models"
VOICES_DIR = ROOT / "voices"
DEFAULT_MODEL = MODELS / "kokoro-v1.0.onnx"
DEFAULT_VOICES = MODELS / "voices-v1.0.bin"
DEFAULT_VOICE_PACK = VOICES_DIR / "am_channel_short.npy"
DEFAULT_OUT = ROOT / "out"

# Locked from A/B: sample-energy-blend-120.wav
DEFAULT_VOICE = "energy"
DEFAULT_LANG = "en-us"
DEFAULT_SPEED = 1.20
DEFAULT_SENTENCE_PAUSE = 0.20
DEFAULT_CLAUSE_PAUSE = 0.09
BLEND_CHANNEL = 0.75
BLEND_PUCK = 0.25

SAMPLE_TEXT = (
    "Python 3.15 just dropped, and here are the top three game-changing "
    "features you need to know!"
)

VOICE_ALIASES = {
    # Locked energetic blend (default)
    "energy": "blend_channel_puck",
    "blend": "blend_channel_puck",
    "locked": "blend_channel_puck",
    # Pure channel pack
    "short": "pack_channel_short",
    "channel": "pack_channel_short",
    "inno": "pack_channel_short",
    "cloned": "pack_channel_short",
    # Stock
    "michael": "am_michael",
    "fenrir": "am_fenrir",
    "puck": "am_puck",
    "adam": "am_adam",
    "bella": "af_bella",
    "heart": "af_heart",
}


def load_channel_pack() -> np.ndarray:
    if not DEFAULT_VOICE_PACK.exists():
        raise FileNotFoundError(
            f"Channel voice pack missing at {DEFAULT_VOICE_PACK}. "
            "Copy from vdo/rm/scripts/tts/voices/am_channel_short.npy"
        )
    return np.load(str(DEFAULT_VOICE_PACK)).astype(np.float32)


def resolve_voice(kokoro: Kokoro, voice_key: str, voice_pack: Path | None):
    """Resolve alias, stock name, or .npy pack into a kokoro voice target."""
    if voice_pack is not None:
        if not voice_pack.exists():
            raise FileNotFoundError(f"Voice pack not found: {voice_pack}")
        style = np.load(str(voice_pack)).astype(np.float32)
        return style, f"inno-pack ({voice_pack.name})"

    key = voice_key.lower().strip()
    resolved = VOICE_ALIASES.get(key, voice_key)

    if resolved == "blend_channel_puck":
        channel = load_channel_pack()
        puck = kokoro.get_voice_style("am_puck")
        style = BLEND_CHANNEL * channel + BLEND_PUCK * puck
        label = (
            f"energy blend ({int(BLEND_CHANNEL * 100)}% channel + "
            f"{int(BLEND_PUCK * 100)}% puck)"
        )
        return style, label

    if resolved == "pack_channel_short":
        return load_channel_pack(), "am_channel_short (inno-kokoro)"

    return resolved, resolved


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate TTS audio with Kokoro ONNX")
    parser.add_argument("--text", default=SAMPLE_TEXT, help="Text to speak")
    parser.add_argument(
        "--voice",
        default=DEFAULT_VOICE,
        help="Alias or stock voice (default: energy = 75% channel + 25% puck)",
    )
    parser.add_argument(
        "--voice-pack",
        type=Path,
        default=None,
        help="Optional .npy inno-kokoro pack (overrides --voice)",
    )
    parser.add_argument("--lang", default=DEFAULT_LANG, help="Language tag")
    parser.add_argument(
        "--speed",
        type=float,
        default=DEFAULT_SPEED,
        help=f"Speech speed 0.5–2.0 (default: {DEFAULT_SPEED})",
    )
    parser.add_argument(
        "--sentence-pause",
        type=float,
        default=DEFAULT_SENTENCE_PAUSE,
        help=f"Pause after sentences (default: {DEFAULT_SENTENCE_PAUSE})",
    )
    parser.add_argument(
        "--clause-pause",
        type=float,
        default=DEFAULT_CLAUSE_PAUSE,
        help=f"Pause after clauses (default: {DEFAULT_CLAUSE_PAUSE})",
    )
    parser.add_argument(
        "--out",
        type=Path,
        default=DEFAULT_OUT / "sample-locked.wav",
        help="Output WAV path",
    )
    parser.add_argument("--model", type=Path, default=DEFAULT_MODEL)
    parser.add_argument("--voices", type=Path, default=DEFAULT_VOICES)
    parser.add_argument(
        "--list-voices",
        action="store_true",
        help="Print available stock voices and exit",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()

    if not args.model.exists() or not args.voices.exists():
        raise SystemExit(
            "Missing model files. Expected:\n"
            f"  {args.model}\n"
            f"  {args.voices}\n"
            "Download from:\n"
            "  https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0"
        )

    kokoro = Kokoro(str(args.model), str(args.voices))

    if args.list_voices:
        print("Aliases: energy (locked), short, channel, puck, michael, fenrir, bella, …")
        for name in sorted(kokoro.get_voices()):
            print(name)
        return

    voice_target, voice_label = resolve_voice(kokoro, args.voice, args.voice_pack)

    samples, sample_rate = kokoro.create(
        args.text,
        voice=voice_target,
        speed=args.speed,
        lang=args.lang,
        sentence_pause=args.sentence_pause,
        clause_pause=args.clause_pause,
    )

    args.out.parent.mkdir(parents=True, exist_ok=True)
    sf.write(str(args.out), samples, sample_rate)
    duration = len(samples) / sample_rate
    print(f"Wrote {args.out}")
    print(f"voice={voice_label} speed={args.speed} lang={args.lang}")
    print(
        f"pauses sentence={args.sentence_pause} clause={args.clause_pause} "
        f"duration={duration:.2f}s sample_rate={sample_rate}"
    )


if __name__ == "__main__":
    main()
