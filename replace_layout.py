import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html') and not f.startswith('layout')]

header_pattern = re.compile(r'<header>.*?</header>', re.DOTALL)
footer_pattern = re.compile(r'<footer class="site-footer">.*?</footer>', re.DOTALL)
whatsapp_pattern = re.compile(r'<!-- WhatsApp Floating Button -->.*?</a>', re.DOTALL)

navbar_placeholder = '<div id="navbar-placeholder"></div>'
footer_placeholder = '<div id="footer-placeholder"></div>'

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Skip files that don't have the standard header/footer we expect, or if they are in layout/
    if filepath.startswith('layout/'): continue

    new_content = header_pattern.sub(navbar_placeholder, content)
    new_content = footer_pattern.sub(footer_placeholder, new_content)
    new_content = whatsapp_pattern.sub('', new_content)  # Removed since it's in footer now

    # A check to ensure we only replace if it had a header/footer
    if content != new_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")
    else:
        print(f"Skipped {filepath} - Header/Footer pattern not found exactly as expected.")

print("Finished processing HTML files.")
