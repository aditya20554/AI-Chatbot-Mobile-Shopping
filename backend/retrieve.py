# retrieve.py

def retrieve_phones(intent, phones):
    results = []

    for p in phones:
        # Filter by brand
        if intent.get("brand") and p["brand"].lower() != intent["brand"]:
            continue

        # Filter by compact
        if intent.get("compact") and not p.get("compact", False):
            continue

        # Filter by 5G
        if intent.get("5g") and not p.get("5g", False):
            continue

        # Filter by budget for variants
        if intent.get("budget"):
            # Keep only variants under budget
            variants_under_budget = [
                (r, s, price)
                for r, s, price in zip(
                    p["variants"]["ram"],
                    p["variants"]["storage"],
                    p["variants"]["price"]
                )
                if price <= intent["budget"]
            ]
            if not variants_under_budget:
                continue

            r_list, s_list, price_list = zip(*variants_under_budget)
            phone_copy = p.copy()
            phone_copy["variants"] = {
                "ram": list(r_list),
                "storage": list(s_list),
                "price": list(price_list)
            }
            results.append(phone_copy)
        else:
            # No budget filtering, include all variants
            results.append(p)

    return results
