def build_comparison(phones, intent=None):
    """
    Build comparison for frontend table.
    - Phones have 'variants' dict with ram[], storage[], price[].
    - Filter by RAM+Storage if intent specifies.
    - If no RAM/Storage, filter price by budget if intent has budget.
    """
    comparison = {
        "models": [],
        "display": [],
        "battery": [],
        "rear_camera": [],
        "front_camera": [],
        "5g": [],
        "price": []
    }

    for p in phones:
        comparison["models"].append(f"{p['brand']} {p['model']}")
        comparison["display"].append(p["display"])
        comparison["battery"].append(p["battery"])
        comparison["rear_camera"].append(p["camera"]["rear_mp"])
        comparison["front_camera"].append(p["camera"]["front_mp"])
        comparison["5g"].append(p["5g"])

        filtered_prices = []

        ram_list = p["variants"].get("ram", [])
        storage_list = p["variants"].get("storage", [])
        price_list = p["variants"].get("price", [])

        # Make a list of variant tuples: (ram, storage, price)
        variant_tuples = list(zip(ram_list, storage_list, price_list))

        if intent:
            # Filter by RAM + Storage if specified
            ram_filter = intent.get("ram")
            storage_filter = intent.get("storage")
            budget_filter = intent.get("budget")

            for ram, storage, price in variant_tuples:
                if ram_filter and storage_filter:
                    if ram == ram_filter and storage == storage_filter:
                        filtered_prices.append(price)
                else:
                    # No RAM/Storage filter → filter by budget if exists
                    if not budget_filter or price <= budget_filter:
                        filtered_prices.append(price)
        else:
            # No intent → include all prices
            filtered_prices = [price for _, _, price in variant_tuples]

        # Join as string for frontend table
        comparison["price"].append(", ".join(str(pr) for pr in filtered_prices))
    print(comparison)
    return comparison
