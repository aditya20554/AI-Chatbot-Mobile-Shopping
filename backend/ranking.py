# ranking.py

def score_phone(phone, intent):
    """
    Score phone based on intent
    """
    score = 0

    # Camera preference
    if intent.get("camera"):
        score += phone["camera"]["rear_mp"] * 0.4

    # Battery preference
    if "battery" in intent.get("keywords", []):
        score += phone["battery"] * 0.002

    # Compact bonus
    if intent.get("compact") and phone["compact"]:
        score += 10

    # 5G bonus
    if intent.get("5g") and phone["5g"]:
        score += 5

    # RAM bonus (best variant)
    score += max(phone["variants"]["ram"]) * 1.5

    return round(score, 2)
