def handle_knowledge_query(text):
    text = text.lower()

    if "ois vs eis" in text or "ois and eis" in text:
        return {
            "reply": (
                "OIS (Optical Image Stabilization) uses hardware to physically stabilize the camera lens, "
                "resulting in better low-light photos. "
                "EIS (Electronic Image Stabilization) uses software to stabilize videos, "
                "which is more common in budget phones."
            )
        }

    return None
