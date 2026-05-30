#!/usr/bin/env python3
"""
Ethereal Mages NFT Generator
Generates 10,000 unique 8x8 pixel mage NFTs with trait-based rarity system.

Rarity tiers:
- Common    (~50%)
- Uncommon  (~25%)
- Rare      (~15%)
- Epic      (~7%)
- Legendary (~3%)
"""

import json
import os
import random
import hashlib
from PIL import Image

# PICO-8 color palette (16 colors)
PALETTE = {
    "black":      (0, 0, 0),
    "dark_blue":  (29, 43, 83),
    "dark_purple":(126, 37, 83),
    "dark_green": (0, 135, 81),
    "brown":      (171, 82, 54),
    "dark_gray":  (95, 87, 79),
    "light_gray": (194, 195, 199),
    "white":      (255, 241, 232),
    "red":        (255, 0, 77),
    "orange":     (255, 163, 0),
    "yellow":     (255, 255, 39),
    "green":      (0, 231, 86),
    "blue":       (41, 173, 255),
    "lavender":   (131, 118, 156),
    "pink":       (255, 119, 168),
    "peach":      (255, 204, 170),
}
P = PALETTE
_ = None  # transparent (use background)

# ============================================================
# TRAIT DEFINITIONS with rarity weights
# ============================================================

BACKGROUNDS = {
    # name: (color, weight, rarity_label)
    "Dark Blue":    (P["dark_blue"],   30, "Common"),
    "Black":        (P["black"],       20, "Common"),
    "Dark Green":   (P["dark_green"],  12, "Uncommon"),
    "Dark Purple":  (P["dark_purple"], 12, "Uncommon"),
    "Brown":        (P["brown"],        8, "Rare"),
    "Dark Gray":    (P["dark_gray"],    8, "Rare"),
    "Red":          (P["red"],          4, "Epic"),
    "Blue":         (P["blue"],         3, "Epic"),
    "Orange":       (P["orange"],       2, "Legendary"),
    "Green":        (P["green"],        1, "Legendary"),
}

# Skin colors for the wizard face
SKINS = {
    "Peach":       (P["peach"],       30, "Common"),
    "Light Gray":  (P["light_gray"],  20, "Common"),
    "White":       (P["white"],       15, "Uncommon"),
    "Green":       (P["green"],       10, "Uncommon"),
    "Brown":       (P["brown"],        8, "Rare"),
    "Lavender":    (P["lavender"],     7, "Rare"),
    "Blue":        (P["blue"],         5, "Epic"),
    "Pink":        (P["pink"],         3, "Epic"),
    "Yellow":      (P["yellow"],       1, "Legendary"),
    "Red":         (P["red"],          1, "Legendary"),
}

# Hat colors
HATS = {
    "Purple":     (P["dark_purple"], 25, "Common"),
    "Blue":       (P["dark_blue"],   25, "Common"),
    "Dark Green": (P["dark_green"],  15, "Uncommon"),
    "Brown":      (P["brown"],       10, "Uncommon"),
    "Red":        (P["red"],          8, "Rare"),
    "Dark Gray":  (P["dark_gray"],    7, "Rare"),
    "Orange":     (P["orange"],       4, "Epic"),
    "Pink":       (P["pink"],         3, "Epic"),
    "Yellow":     (P["yellow"],       2, "Legendary"),
    "White":      (P["white"],        1, "Legendary"),
}

# Eye colors
EYES = {
    "Black":      (P["black"],       30, "Common"),
    "Dark Blue":  (P["dark_blue"],   20, "Common"),
    "White":      (P["white"],       15, "Uncommon"),
    "Green":      (P["green"],       10, "Uncommon"),
    "Red":        (P["red"],          8, "Rare"),
    "Blue":       (P["blue"],         7, "Rare"),
    "Yellow":     (P["yellow"],       4, "Epic"),
    "Orange":     (P["orange"],       3, "Epic"),
    "Pink":       (P["pink"],         2, "Legendary"),
    "Lavender":   (P["lavender"],     1, "Legendary"),
}

# Beard styles
BEARDS = {
    "None":        (None,             30, "Common"),
    "White Short":  (P["white"],      20, "Common"),
    "Gray Short":   (P["light_gray"], 15, "Uncommon"),
    "Brown Short":  (P["brown"],      10, "Uncommon"),
    "White Long":   (P["white"],       8, "Rare"),
    "Gray Long":    (P["light_gray"],  7, "Rare"),
    "Orange Long":  (P["orange"],      4, "Epic"),
    "Green Long":   (P["green"],       3, "Epic"),
    "Yellow Long":  (P["yellow"],      2, "Legendary"),
    "Pink Long":    (P["pink"],        1, "Legendary"),
}

# Robe colors
ROBES = {
    "Purple":     (P["dark_purple"], 25, "Common"),
    "Blue":       (P["dark_blue"],   25, "Common"),
    "Dark Green": (P["dark_green"],  15, "Uncommon"),
    "Brown":      (P["brown"],       10, "Uncommon"),
    "Red":        (P["red"],          8, "Rare"),
    "Dark Gray":  (P["dark_gray"],    7, "Rare"),
    "Orange":     (P["orange"],       4, "Epic"),
    "Lavender":   (P["lavender"],     3, "Epic"),
    "White":      (P["white"],        2, "Legendary"),
    "Yellow":     (P["yellow"],       1, "Legendary"),
}

# Staff/accessory
STAFFS = {
    "None":       (None,             40, "Common"),
    "Wood":       (P["brown"],       20, "Common"),
    "Iron":       (P["light_gray"],  12, "Uncommon"),
    "Green":      (P["green"],        8, "Uncommon"),
    "Red Crystal":(P["red"],          7, "Rare"),
    "Blue Crystal":(P["blue"],        5, "Rare"),
    "Gold":       (P["yellow"],       4, "Epic"),
    "Pink":       (P["pink"],         2, "Epic"),
    "White":      (P["white"],        1, "Legendary"),
    "Orange":     (P["orange"],       1, "Legendary"),
}


def pick_trait(trait_dict):
    """Weighted random selection from trait dict."""
    names = list(trait_dict.keys())
    weights = [trait_dict[n][1] for n in names]
    chosen = random.choices(names, weights=weights, k=1)[0]
    color, weight, rarity = trait_dict[chosen]
    return chosen, color, rarity


def render_wizard(bg_color, skin_color, hat_color, eye_color,
                  beard_name, beard_color, robe_color,
                  staff_name, staff_color):
    """Render an 8x8 wizard pixel art and return as PIL Image."""
    # Initialize grid with background
    grid = [[bg_color for _ in range(8)] for _ in range(8)]
    B = bg_color
    K = P["black"]

    # Row 0: Hat tip (pointed)
    #   . . . H . . . .
    grid[0][3] = hat_color

    # Row 1: Hat wider
    #   . . H H H . . .
    grid[1][2] = hat_color
    grid[1][3] = hat_color
    grid[1][4] = hat_color

    # Row 2: Hat brim + face top
    #   . H H H H H . .
    grid[2][1] = hat_color
    grid[2][2] = hat_color
    grid[2][3] = hat_color
    grid[2][4] = hat_color
    grid[2][5] = hat_color

    # Row 3: Face with eyes
    #   . K S E S E K .
    grid[3][1] = K
    grid[3][2] = skin_color
    grid[3][3] = eye_color
    grid[3][4] = skin_color
    grid[3][5] = eye_color
    grid[3][6] = K

    # Row 4: Face / beard
    if "Long" in beard_name:
        #   . K S B B S K .
        grid[4][1] = K
        grid[4][2] = skin_color
        grid[4][3] = beard_color
        grid[4][4] = beard_color
        grid[4][5] = skin_color
        grid[4][6] = K
    elif beard_color is not None:
        #   . K S B S S K .
        grid[4][1] = K
        grid[4][2] = skin_color
        grid[4][3] = beard_color
        grid[4][4] = skin_color
        grid[4][5] = skin_color
        grid[4][6] = K
    else:
        #   . K S S S S K .
        grid[4][1] = K
        grid[4][2] = skin_color
        grid[4][3] = skin_color
        grid[4][4] = skin_color
        grid[4][5] = skin_color
        grid[4][6] = K

    # Row 5: Beard long extension or robe top
    if "Long" in beard_name:
        #   . . K B B K . .
        grid[5][2] = K
        grid[5][3] = beard_color
        grid[5][4] = beard_color
        grid[5][5] = K
    else:
        #   . . K R R K . .
        grid[5][2] = K
        grid[5][3] = robe_color
        grid[5][4] = robe_color
        grid[5][5] = K

    # Row 6: Robe body
    #   . K R R R R K .
    grid[6][1] = K
    grid[6][2] = robe_color
    grid[6][3] = robe_color
    grid[6][4] = robe_color
    grid[6][5] = robe_color
    grid[6][6] = K

    # Row 7: Robe bottom / feet
    #   . . K R R K . .
    grid[7][2] = K
    grid[7][3] = robe_color
    grid[7][4] = robe_color
    grid[7][5] = K

    # Staff overlay (on left side)
    if staff_color is not None:
        grid[2][0] = staff_color
        grid[3][0] = staff_color
        grid[4][0] = staff_color
        grid[5][0] = staff_color
        grid[6][0] = staff_color
        # Crystal/orb on top
        grid[1][0] = staff_color

    # Create image
    img = Image.new('RGB', (8, 8))
    for r in range(8):
        for c in range(8):
            img.putpixel((c, r), grid[r][c])
    return img


def calculate_rarity_score(traits):
    """Calculate overall rarity score based on trait rarities."""
    scores = {"Common": 1, "Uncommon": 2, "Rare": 3, "Epic": 4, "Legendary": 5}
    total = sum(scores.get(t["rarity"], 1) for t in traits.values())
    return total


def get_overall_rarity(score, num_traits=7):
    """Map total rarity score to an overall rarity label."""
    avg = score / num_traits
    if avg >= 4.0:
        return "Legendary"
    elif avg >= 3.0:
        return "Epic"
    elif avg >= 2.2:
        return "Rare"
    elif avg >= 1.5:
        return "Uncommon"
    else:
        return "Common"


def generate_collection(count=10000, output_dir="public/wizards", seed=42):
    """Generate the full wizard collection."""
    random.seed(seed)
    os.makedirs(output_dir, exist_ok=True)

    metadata_list = []
    seen_hashes = set()
    generated = 0
    attempts = 0

    while generated < count:
        attempts += 1
        if attempts > count * 10:
            print(f"Warning: Could not generate {count} unique wizards. Generated {generated}.")
            break

        # Pick traits
        bg_name, bg_color, bg_rarity = pick_trait(BACKGROUNDS)
        skin_name, skin_color, skin_rarity = pick_trait(SKINS)
        hat_name, hat_color, hat_rarity = pick_trait(HATS)
        eye_name, eye_color, eye_rarity = pick_trait(EYES)
        beard_name, beard_color, beard_rarity = pick_trait(BEARDS)
        robe_name, robe_color, robe_rarity = pick_trait(ROBES)
        staff_name, staff_color, staff_rarity = pick_trait(STAFFS)

        # Create a unique hash to avoid duplicates
        trait_key = f"{bg_name}|{skin_name}|{hat_name}|{eye_name}|{beard_name}|{robe_name}|{staff_name}"
        trait_hash = hashlib.md5(trait_key.encode()).hexdigest()

        if trait_hash in seen_hashes:
            continue

        seen_hashes.add(trait_hash)

        # Render image
        img = render_wizard(bg_color, skin_color, hat_color, eye_color,
                           beard_name, beard_color, robe_color,
                           staff_name, staff_color)

        # Save 8x8 original
        token_id = generated
        img.save(os.path.join(output_dir, f"{token_id}.png"))

        # Also save a scaled version (256x256) for preview
        preview = img.resize((256, 256), Image.NEAREST)
        preview.save(os.path.join(output_dir, f"{token_id}_preview.png"))

        # Build traits dict
        traits = {
            "Background": {"value": bg_name, "rarity": bg_rarity},
            "Skin": {"value": skin_name, "rarity": skin_rarity},
            "Hat": {"value": hat_name, "rarity": hat_rarity},
            "Eyes": {"value": eye_name, "rarity": eye_rarity},
            "Beard": {"value": beard_name, "rarity": beard_rarity},
            "Robe": {"value": robe_name, "rarity": robe_rarity},
            "Staff": {"value": staff_name, "rarity": staff_rarity},
        }

        rarity_score = calculate_rarity_score(traits)
        overall_rarity = get_overall_rarity(rarity_score)

        # ERC-721 metadata format
        metadata = {
            "name": f"Ethereal Mage #{token_id}",
            "description": f"A unique 8x8 pixel mage. Rarity: {overall_rarity}",
            "image": f"wizards/{token_id}.png",
            "attributes": [
                {"trait_type": k, "value": v["value"]} for k, v in traits.items()
            ] + [
                {"trait_type": "Rarity Score", "value": rarity_score, "display_type": "number"},
                {"trait_type": "Overall Rarity", "value": overall_rarity},
            ],
        }
        metadata_list.append(metadata)

        # Save individual metadata
        with open(os.path.join(output_dir, f"{token_id}.json"), "w") as f:
            json.dump(metadata, f, indent=2)

        generated += 1
        if generated % 1000 == 0:
            print(f"Generated {generated}/{count} wizards...")

    # Save collection metadata
    with open(os.path.join(output_dir, "collection.json"), "w") as f:
        json.dump({
            "name": "Ethereal Mages",
            "description": "A collection of 10,000 unique 8x8 pixel mage NFTs on Ethereum",
            "total_supply": count,
            "free_mint": 8888,
            "paid_mint_price": "0.0001 ETH",
            "items": metadata_list,
        }, f, indent=2)

    # Print rarity distribution
    from collections import Counter
    rarity_counts = Counter()
    for m in metadata_list:
        for attr in m["attributes"]:
            if attr["trait_type"] == "Overall Rarity":
                rarity_counts[attr["value"]] += 1

    print(f"\nGenerated {generated} unique wizards!")
    print("\nOverall Rarity Distribution:")
    for rarity in ["Common", "Uncommon", "Rare", "Epic", "Legendary"]:
        c = rarity_counts.get(rarity, 0)
        pct = c / generated * 100 if generated > 0 else 0
        print(f"  {rarity}: {c} ({pct:.1f}%)")


if __name__ == "__main__":
    import sys
    count = int(sys.argv[1]) if len(sys.argv) > 1 else 10000
    output_dir = sys.argv[2] if len(sys.argv) > 2 else "public/wizards"
    generate_collection(count=count, output_dir=output_dir)
