# run_pipeline.py
"""
Run full pipeline: Speech → Text → Chatbot → Speech
Usage:
    python run_pipeline.py audio_samples/farmer_audio.wav
"""

import sys
from scripts.speech_to_text import transcribe_audio
from scripts.chatbot import get_response
from scripts.text_to_speech import synthesize_speech

def run(audio_file):
    # 1. Speech to Text
    stt_res = transcribe_audio(audio_file)
    text, lang = stt_res["text"], stt_res["language"]
    print(f"[Pipeline] Transcript: {text} (lang={lang})")

    # 2. Chatbot response
    answer = get_response(text, lang=lang)
    print(f"[Pipeline] Answer: {answer}")

    # 3. Text to Speech
    out_file = synthesize_speech(answer, lang=lang, output_file="reply.mp3")
    print(f"[Pipeline] Reply audio saved: {out_file}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python run_pipeline.py <audio_file>")
        sys.exit(1)
    run(sys.argv[1])
