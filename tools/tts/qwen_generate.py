"""
Generate voiceover WAV files using Qwen/Qwen3-TTS on Hugging Face ZeroGPU.

Reads HF_TOKEN from the repository root .env (or environment) so HF Pro
priority queue and ZeroGPU quota are used automatically.
"""

from __future__ import annotations

import argparse
import os
import shutil
from pathlib import Path

import soundfile as sf
from dotenv import load_dotenv
from gradio_client import Client, handle_file

ROOT = Path(__file__).resolve().parent
REPO_ROOT = ROOT.parent.parent
DEFAULT_OUT = ROOT / "out" / "qwen-sample.wav"
DEFAULT_SPACE = "Qwen/Qwen3-TTS"

CUSTOM_SPEAKERS = [
    "Aiden",
    "Dylan",
    "Eric",
    "Ono_anna",
    "Ryan",
    "Serena",
    "Sohee",
    "Uncle_fu",
    "Vivian",
]

SAMPLE_TEXT = (
    "Every growing app hits the same wall: one database, too much traffic. "
    "Let's add a Redis cache and a message queue to scale it cleanly."
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Generate TTS audio via Qwen/Qwen3-TTS on Hugging Face ZeroGPU"
    )
    parser.add_argument("--text", default=SAMPLE_TEXT, help="Text to speak")
    parser.add_argument(
        "--mode",
        choices=["custom", "design", "clone"],
        default="custom",
        help="TTS mode: custom (preset speaker + instruct), design (voice description), or clone",
    )
    parser.add_argument(
        "--speaker",
        default="Ryan",
        choices=CUSTOM_SPEAKERS,
        help="Preset speaker for custom mode (default: Ryan)",
    )
    parser.add_argument(
        "--instruct",
        default="Confident and energetic technology trainer speaking naturally to a YouTube and Insta audience. Clear and conversational pacing with crisp pronunciation and emphasis on numbers, important words/phrases.",
        help="Style instruction (custom mode) or voice description (design mode)",
    )
    parser.add_argument("--language", default="English", help="Language (default: English)")
    parser.add_argument(
        "--model-size",
        default="1.7B",
        choices=["0.6B", "1.7B"],
        help="Qwen3-TTS model size (default: 1.7B)",
    )
    parser.add_argument("--ref-audio", type=Path, help="Reference audio path (clone mode)")
    parser.add_argument("--ref-text", default="", help="Reference transcript (clone mode)")
    parser.add_argument("--xvector-only", action="store_true", help="Use x-vector only in clone mode")
    parser.add_argument("--space", default=DEFAULT_SPACE, help="HF Space ID (default: Qwen/Qwen3-TTS)")
    parser.add_argument("--out", type=Path, default=DEFAULT_OUT, help="Output WAV file path")
    parser.add_argument("--fps", type=int, default=30, help="Target Remotion FPS for frame count printout")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    load_dotenv(REPO_ROOT / ".env")
    token = os.getenv("HF_TOKEN")
    if not token:
        raise RuntimeError(
            f"HF_TOKEN not found in environment or {REPO_ROOT / '.env'}. "
            "Add HF_TOKEN=hf_... to .env first."
        )

    print(f"Connecting to {args.space} (HF token loaded)...")
    client = Client(args.space, token=token)

    if args.mode == "custom":
        print(f"Generating [custom] speaker={args.speaker}, model={args.model_size}...")
        audio_path, status = client.predict(
            text=args.text,
            language=args.language,
            speaker=args.speaker,
            instruct=args.instruct,
            model_size=args.model_size,
            api_name="/generate_custom_voice",
        )
    elif args.mode == "design":
        print(f"Generating [design]...")
        audio_path, status = client.predict(
            text=args.text,
            language=args.language,
            voice_description=args.instruct,
            api_name="/generate_voice_design",
        )
    else:
        if not args.ref_audio or not args.ref_audio.exists():
            raise FileNotFoundError("Provide an existing --ref-audio file for clone mode.")
        if not args.ref_text:
            raise ValueError("Provide --ref-text matching --ref-audio for clone mode.")
        print(f"Generating [clone] ref={args.ref_audio.name}, model={args.model_size}...")
        audio_path, status = client.predict(
            ref_audio=handle_file(str(args.ref_audio)),
            ref_text=args.ref_text,
            target_text=args.text,
            language=args.language,
            use_xvector_only=args.xvector_only,
            model_size=args.model_size,
            api_name="/generate_voice_clone",
        )

    args.out.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(audio_path, args.out)

    info = sf.info(str(args.out))
    duration = info.duration
    frames = round(duration * args.fps)

    print(f"Status: {status}")
    print(f"Saved:  {args.out}")
    print(f"Specs:  {info.samplerate} Hz | {duration:.2f}s | {frames} frames @ {args.fps}fps")


if __name__ == "__main__":
    main()
