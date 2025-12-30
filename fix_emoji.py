#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import codecs

# Read the file with UTF-8 encoding
with codecs.open('api_analytics_dashboard.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace corrupted emoji sequences with proper emojis
replacements = {
    'âš ï¸': '⚠️',    # Warning emoji
    '📄Ÿ': '📄',      # Document emoji  
    '📄Ÿ"‹': '📋',   # Clipboard emoji
    'ð"§': '🔧',      # Wrench emoji
    'ð"': '🔒',       # Lock emoji
    'ð"Š': '📊',      # Chart emoji
}

for old, new in replacements.items():
    content = content.replace(old, new)

# Write back with UTF-8 encoding
with codecs.open('api_analytics_dashboard.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ All emoji encoding issues fixed!")
print("Fixed replacements:")
for old, new in replacements.items():
    print(f"  {old} → {new}")
