import os
import re

directory = r'c:\Users\Admin\Downloads\brigantine-main'

# Regex patterns to find and replace
replacements = [
    (r'opacity:\s*0\.[3456789]', 'opacity: 1'),
    (r'color:\s*rgba\(255,\s*255,\s*255,\s*0\.[3456789]\)', 'color: #ffffff'),
    (r'color:\s*rgba\(0,\s*18,\s*38,\s*0\.[3456789]\)', 'color: #001226'),
]

for filename in os.listdir(directory):
    if filename.endswith(".html"):
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = content
        for pattern, replacement in replacements:
            new_content = re.sub(pattern, replacement, new_content)
        
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {filename}")
        else:
            print(f"No changes for {filename}")
