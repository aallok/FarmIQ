# scripts/speech_to_text.py
import os
import shutil
from pathlib import Path
from typing import Dict

def _whisper_cache_paths():
    home = Path.home()
    return [home / ".cache" / "whisper", home / ".cache" / "huggingface"]

def clear_cache():
    """
    Remove whisper/huggingface caches. Call this if a model download is corrupt.
    """
    for p in _whisper_cache_paths():
        if p.exists():
            print(f"[STT] Removing cache folder: {p}")
            try:
                shutil.rmtree(p)
            except Exception as e:
                print(f"[STT] Warning: failed to remove {p}: {e}")

def _load_whisper_model(preferred="small", fallback="tiny"):
    try:
        import whisper
    except Exception as e:
        raise RuntimeError("Whisper library not installed. Run: pip install openai-whisper") from e

    try:
        print(f"[STT] Loading Whisper model '{preferred}' ...")
        return whisper.load_model(preferred)
    except RuntimeError as e:
        # Typical: checksum mismatch or bad download
        print(f"[STT] Warning: failed to load '{preferred}': {e}")
        print("[STT] Deleting cache and retrying download...")
        clear_cache()
        try:
            return whisper.load_model(preferred)
        except Exception as e2:
            print(f"[STT] Retry failed: {e2}")
            print(f"[STT] Falling back to smaller model '{fallback}'")
            try:
                return whisper.load_model(fallback)
            except Exception as e3:
                raise RuntimeError(f"Failed to load Whisper models: {e3}") from e3

# Module-level model (loaded lazily)
_model = None
def _get_model():
    global _model
    if _model is None:
        # allow overriding via env vars for quick dev/test
        preferred = os.getenv("WHISPER_MODEL_PREFERRED", "small")
        fallback = os.getenv("WHISPER_MODEL_FALLBACK", "tiny")
        _model = _load_whisper_model(preferred=preferred, fallback=fallback)
    return _model

def transcribe_audio(audio_path: str) -> Dict[str, str]:
    """
    Transcribe audio file to text.
    Returns: {"text": str, "language": str}
    Raises RuntimeError on failure.
    """
    if not Path(audio_path).exists():
        raise RuntimeError(f"[STT] Audio file not found: {audio_path}")

    model = _get_model()
    print(f"[STT] Transcribing {audio_path} ...")
    try:
        result = model.transcribe(audio_path, language=None)  # autodetect language
    except Exception as e:
        raise RuntimeError(f"[STT] Transcription failed: {e}") from e

    # handle different possible result shapes
    text_value = result.get("text", "")
    if isinstance(text_value, list):
        text = " ".join(str(t) for t in text_value).strip()
    else:
        text = str(text_value).strip()

    # whisper different versions may return 'language' or 'language_code'
    lang_value = result.get("language", None) or result.get("language_code", "unknown")
    lang = str(lang_value).strip() if lang_value is not None else "unknown"
    return {"text": text, "language": lang}
