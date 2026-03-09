import os
import re

files_with_bg = [
    ("wide-gap.html", "wide-gap-e1705483040266.webp", "Wide Gap Heat Exchangers"),
    ("brazed-plate-heat-exchangers.html", "BRAZED-e1705483209163.webp", "Brazed Plate Heat Exchangers"),
    ("fusion-bonded-plate-heat-exchangers.html", "alfanova-e1705483625625.webp", "Fusion Bonded Plate Heat Exchangers"),
    ("alfacond.html", "alfacond.webp", "AlfaCond Heat Exchangers"),
    ("alfavap.html", "alfavap.webp", "AlfaVap Heat Exchangers")
]

other_pages = [
    "industrial-line.html",
    "industrial-semi-welded-line.html",
    "m-line.html"
]

all_pages = [f[0] for f in files_with_bg] + other_pages

for fname, img, title in files_with_bg:
    with open(fname, "r", encoding="utf-8") as f:
        content = f.read()

    # Regex to find the hero section
    hero_pattern = re.compile(
        r'<section class="hero-3d-bg" style="background: url\(\'.*?\'\) center/cover no-repeat;">.*?</section>',
        re.DOTALL
    )
    
    new_hero = f"""<section class="hero-3d-bg" style="display: flex; align-items: center; justify-content: center; padding: 6rem 10%; background: var(--primary);">
        <div class="hero-content-3d" style="display: flex; flex-wrap: wrap; align-items: center; gap: 4rem; z-index: 2; position:relative; width:100%;">
            <div class="hero-text-container" style="flex: 1; min-width: 300px; text-align: left;">
                <h1 class="reveal" style="font-size: clamp(2.5rem, 5vw, 4.5rem); font-weight: 900; text-transform: uppercase; letter-spacing: -2px; line-height: 1.1; color: var(--white); margin: 0;">{"<br>".join(title.split(" Heat ", 1)) if " Heat " in title else title}</h1>
            </div>
            <div class="hero-image-container reveal" style="flex: 1; min-width: 300px;">
                <img src="{img}" alt="{title}" style="width: 100%; border-radius: 20px; box-shadow: var(--shadow-lg);">
            </div>
        </div>
    </section>"""
    
    content = hero_pattern.sub(new_hero, content)

    # For existing text inside the new pages, if there are any <p> tags with white text, fix them. But wait, I'm fixing the global CSS.
    with open(fname, "w", encoding="utf-8") as f:
        f.write(content)

# Now fix the CSS visibility in all 8 pages
for fname in all_pages:
    with open(fname, "r", encoding="utf-8") as f:
        content = f.read()
        
    # the font visibility issue:
    # Adding color: var(--primary); to .layered-section
    content = content.replace(
        ".layered-section {\n            padding: 5rem 10%;\n            position: relative;\n            overflow: hidden;\n        }",
        ".layered-section {\n            padding: 5rem 10%;\n            position: relative;\n            overflow: hidden;\n            color: var(--primary);\n        }"
    )

    with open(fname, "w", encoding="utf-8") as f:
        f.write(content)

print("Formatting applied successfully.")
