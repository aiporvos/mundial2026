#!/usr/bin/env python3
"""Download sticker images from figusdelmundial.com to public/figuritas/"""

import json
import os
import time
import urllib.request
import urllib.error
from pathlib import Path

DATA_FILE = Path(__file__).parent.parent / "figusdelmundial_images.json"
OUT_DIR = Path(__file__).parent.parent / "public" / "figuritas"
BASE_URL = "https://figusdelmundial.com"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Referer": "https://figusdelmundial.com/",
    "Accept": "image/webp,image/avif,image/*,*/*;q=0.8",
}


def safe_filename(code: str) -> str:
    """Convert sticker code to safe filename."""
    return code.replace("::", "_").replace("/", "-").replace(" ", "_") + ".webp"


def download(url: str, dest: Path) -> bool:
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = resp.read()
        if len(data) < 500:
            print(f"  SKIP (too small): {url}")
            return False
        dest.write_bytes(data)
        return True
    except urllib.error.HTTPError as e:
        print(f"  HTTP {e.code}: {url}")
        return False
    except Exception as e:
        print(f"  ERROR {e}: {url}")
        return False


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    data = json.loads(DATA_FILE.read_text())

    total = len(data)
    ok = skip = fail = 0

    for i, item in enumerate(data, 1):
        code = item.get("code") or ""
        src = item.get("src") or ""
        if not code or not src:
            skip += 1
            continue

        filename = safe_filename(code)
        dest = OUT_DIR / filename

        if dest.exists() and dest.stat().st_size > 500:
            skip += 1
            if i % 100 == 0:
                print(f"[{i}/{total}] {skip} skipped (already downloaded)")
            continue

        # Build URL with cache-busting version param
        url = src + "?v=20260520c"
        print(f"[{i}/{total}] {code} → {filename}")

        if download(url, dest):
            ok += 1
        else:
            fail += 1

        # Polite delay: 50ms between requests
        time.sleep(0.05)

    print(f"\nDone: {ok} downloaded, {skip} skipped, {fail} failed")
    print(f"Images saved to: {OUT_DIR}")


if __name__ == "__main__":
    main()
