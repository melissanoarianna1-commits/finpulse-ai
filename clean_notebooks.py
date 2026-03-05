"""
Run this script to clean Colab widget metadata from notebooks
so they render properly on GitHub.

Usage: python3 clean_notebooks.py
"""
import json
import glob
import os

def clean_notebook(path):
    with open(path, 'r') as f:
        nb = json.load(f)

    changed = False

    # Remove widgets metadata that breaks GitHub rendering
    if 'metadata' in nb:
        if 'widgets' in nb['metadata']:
            del nb['metadata']['widgets']
            changed = True

    # Clean cell metadata
    for cell in nb.get('cells', []):
        if 'metadata' in cell:
            if 'widgets' in cell['metadata']:
                del cell['metadata']['widgets']
                changed = True

    if changed:
        with open(path, 'w') as f:
            json.dump(nb, f, indent=1)
        print(f'  ✅ Cleaned: {path}')
    else:
        print(f'  ⏭️  Already clean: {path}')

if __name__ == '__main__':
    notebooks = glob.glob('notebooks/*.ipynb')
    if not notebooks:
        print('No notebooks found. Run from the repo root directory.')
    else:
        print(f'Found {len(notebooks)} notebooks:')
        for nb in sorted(notebooks):
            clean_notebook(nb)
        print('\nDone! Now run: git add . && git commit -m "Clean notebooks" && git push')
