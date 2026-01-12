# # intent_nlp.py
# import spacy
# import re

# nlp = spacy.load("en_core_web_sm")

# BRANDS = ["samsung", "google", "oneplus", "realme", "vivo", "xiaomi", "motorola", "nokia", "oppo", "apple"]

# def parse_intent(text):
#     text_lower = text.lower()
#     doc = nlp(text_lower)

#     budget = None
#     # Extract numbers after 'under' or 'below'
#     for i, token in enumerate(doc):
#         if token.text in ["under", "below"]:
#             if i + 1 < len(doc):
#                 num = re.sub(r"[^\d]", "", doc[i+1].text)
#                 if num.isdigit():
#                     budget = int(num)

#     brand = None
#     for token in doc:
#         if token.text in BRANDS:
#             brand = token.text

#     features = {
#         "camera": "camera" in text_lower,
#         "compact": "compact" in text_lower or "one hand" in text_lower,
#         "compare": "compare" in text_lower,
#         "5g": "5g" in text_lower
#     }

#     return {
#         "budget": budget,
#         "brand": brand,
#         **features
#     }
# intent_nlp.py
import spacy
import re

nlp = spacy.load("en_core_web_sm")

BRANDS = [
    "samsung", "google", "oneplus", "realme",
    "vivo", "xiaomi", "motorola", "nokia",
    "oppo", "apple"
]

def parse_intent(text):
    text_lower = text.lower()
    doc = nlp(text_lower)

    intent = {
        "budget": None,
        "brand": None,
        "camera": False,
        "battery": False,
        "compact": False,
        "compare": False,
        "5g": False,
        "best": False,
        "explain": False,
        "follow_up": False,
        "compare_models": []
    }

    # 💰 Budget extraction (under / below)
    for i, token in enumerate(doc):
        if token.text in ["under", "below", "around"]:
            if i + 1 < len(doc):
                num = re.sub(r"[^\d]", "", doc[i+1].text)
                if num.isdigit():
                    intent["budget"] = int(num)

    # 🏷 Brand detection
    for token in doc:
        if token.text in BRANDS:
            intent["brand"] = token.text

    # 🔍 Feature detection
    intent["camera"] = "camera" in text_lower
    intent["battery"] = "battery" in text_lower or "mah" in text_lower
    intent["compact"] = "compact" in text_lower or "one hand" in text_lower
    intent["compare"] = "compare" in text_lower or "vs" in text_lower
    intent["5g"] = "5g" in text_lower

    # ⭐ Recommendation intent
    intent["best"] = any(
        word in text_lower
        for word in ["best", "recommend", "top", "suggest"]
    )

    # 📘 Knowledge / explanation queries
    intent["explain"] = any(
        phrase in text_lower
        for phrase in ["explain", "what is", "difference between", "ois vs eis"]
    )

    # 🔁 Follow-up queries
    intent["follow_up"] = any(
        phrase in text_lower
        for phrase in ["i like this", "tell me more", "details", "this phone"]
    )

    # ⚖ Compare specific models (Pixel vs OnePlus)
    if intent["compare"]:
        for ent in doc.ents:
            if ent.label_ in ["ORG", "PRODUCT"]:
                intent["compare_models"].append(ent.text.lower())

    return intent
