# chatbot.py
"""
Simple chatbot placeholder.
Replace with OpenAI API / Hugging Face pipeline later.
"""

def get_response(user_text: str, lang: str = "en") -> str:
    """
    Given input text (English or translated), return chatbot answer.
    """
    print(f"[Chatbot] Received text: {user_text} (lang={lang})")
    
    # Demo rules (replace with real LLM):
    if "water" in user_text.lower():
        return "You should water your crop early morning and evening."
    elif "fertilizer" in user_text.lower():
        return "Use organic fertilizer to improve soil health."
    else:
        return "This is a demo response. Replace with LLM call later."
