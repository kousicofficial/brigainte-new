import os
import re

def remove_services_mentions(directory):
    for filename in os.listdir(directory):
        if filename.endswith(".html"):
            filepath = os.path.join(directory, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            # 1. Remove <a> tags that link to services.html or other service pages
            # and any button/link that says "Service & Support"
            patterns = [
                r'<a[^>]*href="services\.html"[^>]*>.*?</a>',
                r'<a[^>]*href="decanter-centrifuge-service\.html"[^>]*>.*?</a>',
                r'<a[^>]*href="gasketed-plate-heat-exchanger-services\.html"[^>]*>.*?</a>',
                r'<a[^>]*href="compabloc-welded-phe-services\.html"[^>]*>.*?</a>',
                r'<a[^>]*>Service & Support</a>',
                r'<a[^>]*>Services & Support</a>',
                r'<a[^>]*>Service support</a>',
                r'Service & Support',
                r'Services & Support'
            ]
            
            new_content = content
            for pattern in patterns:
                new_content = re.sub(pattern, '', new_content, flags=re.IGNORECASE)

            # Cleanup empty lines or orphaned connectors if any (basic)
            new_content = re.sub(r'<li>\s*</li>', '', new_content)
            
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated {filename}")

if __name__ == "__main__":
    remove_services_mentions('.')
