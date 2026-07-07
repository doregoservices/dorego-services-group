#!/usr/bin/env python3
"""
Script pour créer une version standalone de index.html
avec le CSS et le JS intégrés directement dans le fichier.
Cela permet d'ouvrir le site dans un navigateur sans serveur.
"""

import os
import re

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PUBLIC_DIR = os.path.join(BASE_DIR, 'public')

def read_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(path, content):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

# Lire le HTML original
html_path = os.path.join(PUBLIC_DIR, 'index.html')
html = read_file(html_path)

# Injecter le CSS
css_path = os.path.join(PUBLIC_DIR, 'css', 'style.css')
css = read_file(css_path)
html = html.replace(
    '<link rel="stylesheet" href="css/style.css">',
    f'<style>{css}</style>'
)

# Injecter les JS
js_main_path = os.path.join(PUBLIC_DIR, 'js', 'main.js')
js_lang_path = os.path.join(PUBLIC_DIR, 'js', 'lang.js')
js_main = read_file(js_main_path)
js_lang = read_file(js_lang_path)

html = html.replace(
    '<script src="js/lang.js"></script>',
    f'<script>{js_lang}</script>'
)
html = html.replace(
    '<script src="js/main.js"></script>',
    f'<script>{js_main}</script>'
)

# Supprimer les liens Google Fonts (optionnel, mais si pas de connexion ça bloque pas)
# On les garde, car les navigateurs utilisent les polices de fallback si pas de connexion

# Sauvegarder le fichier standalone
standalone_path = os.path.join(PUBLIC_DIR, 'index-standalone.html')
write_file(standalone_path, html)

print(f"✅ Version standalone créée : {standalone_path}")
print("Tu peux maintenant ouvrir ce fichier dans ton navigateur pour voir le design.")
