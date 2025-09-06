# text_to_speech.py
"""
Text-to-Speech using gTTS (local).
Supports many Indian languages (hi, ta, te, kn, ml, mr, bn, gu, pa...).
"""

from gtts import gTTS
from pathlib import Path

def synthesize_speech(text: str, lang: str = "en", output_file: str = "reply.mp3") -> str:
    """
    Convert text to speech and save as MP3.
    Returns the path to the output file.
    """
    print(f"[TTS] Synthesizing speech in {lang} -> {output_file}")
    tts = gTTS(text=text, lang=lang)
    out_path = Path(output_file).absolute()
    tts.save(out_path)
    return str(out_path)
