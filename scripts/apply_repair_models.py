"""Fill brand/service pages with the models we actually repair.

Source: data/site-pricebook.json (public layer of the master pricebook).
Does not create per-model URLs. Writes static HTML chips and a names-only JS catalog
for the homepage form datalist.

  python scripts/apply_repair_models.py
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parents[1]
PRICEBOOK = ROOT / "data" / "site-pricebook.json"
MODELS_JSON = ROOT / "data" / "repair-models.json"
MODELS_JS = ROOT / "repair-models.js"

START = "<!-- repair-models:start -->"
END = "<!-- repair-models:end -->"
DATALIST_START = "<!-- repair-models-datalist:start -->"
DATALIST_END = "<!-- repair-models-datalist:end -->"

FORM_BRAND = {
    "Apple": "iPhone",
    "Samsung": "Samsung",
    "Xiaomi": "Xiaomi",
    "Honor": "Honor",
    "Huawei": "Huawei",
}

IPHONE_ORDER = [
    "iPhone 17 Pro Max",
    "iPhone 17 Pro",
    "iPhone 17",
    "iPhone 17e",
    "iPhone 16 Pro Max",
    "iPhone 16 Pro",
    "iPhone 16 Plus",
    "iPhone 16",
    "iPhone 15 Pro Max",
    "iPhone 15 Pro",
    "iPhone 15 Plus",
    "iPhone 15",
    "iPhone 14 Pro Max",
    "iPhone 14 Pro",
    "iPhone 14 Plus",
    "iPhone 14",
    "iPhone 13 Pro Max",
    "iPhone 13 Pro",
    "iPhone 13 mini",
    "iPhone 13",
    "iPhone 12 Pro Max",
    "iPhone 12 Pro",
    "iPhone 12",
    "iPhone 11 Pro Max",
    "iPhone 11 Pro",
    "iPhone 11",
    "iPhone XS Max",
    "iPhone XS",
    "iPhone XR",
    "iPhone X",
    "iPhone SE 2022",
    "iPhone 8 Plus",
    "iPhone 8",
    "iPhone 7 Plus",
    "iPhone 7",
    "iPhone 6s Plus",
    "iPhone 6s",
    "iPhone 6 Plus",
    "iPhone 6",
]

NOTES = {
    "Apple": "В прайсе — от 6 до 17, включая SE, X/XS/XR и Pro. Другая модель — напишите, посчитаем.",
    "Samsung": "В прайсе — A51, A52, A54, S21, S22. Складные и другие Galaxy — после диагностики.",
    "Xiaomi": "В прайсе — Redmi 10, Note 10, Note 12 и POCO X5. Другая модель — напишите, посчитаем.",
    "Honor": "В прайсе — 50, 90 и X8. Другая модель Honor — напишите, посчитаем.",
    "Huawei": "В прайсе — Nova 9 и P40 Lite. Другая серия — напишите модель.",
}

HEADINGS = {
    "Apple": "Какие iPhone чиним",
    "Samsung": "Какие Galaxy чиним",
    "Xiaomi": "Какие Xiaomi чиним",
    "Honor": "Какие Honor чиним",
    "Huawei": "Какие Huawei чиним",
}

DISPLAY_CODES = ("display-original", "display-analog", "display-budget")
BATTERY_CODES = ("battery",)

# Pages that get a chip catalog. Second item filters by service code, or None = all models.
PAGE_BRANDS = {
    "brands/iphone.html": ("Apple", None),
    "brands/iphone-screen.html": ("Apple", DISPLAY_CODES),
    "brands/iphone-battery.html": ("Apple", BATTERY_CODES),
    "brands/samsung.html": ("Samsung", None),
    "brands/samsung-screen.html": ("Samsung", DISPLAY_CODES),
    "brands/samsung-battery.html": ("Samsung", BATTERY_CODES),
    "brands/xiaomi.html": ("Xiaomi", None),
    "brands/xiaomi-screen.html": ("Xiaomi", DISPLAY_CODES),
    "brands/xiaomi-battery.html": ("Xiaomi", BATTERY_CODES),
    "brands/honor.html": ("Honor", None),
    "brands/huawei.html": ("Huawei", None),
}


def sort_labels(brand: str, labels: list[str]) -> list[str]:
    if brand == "Apple":
        rank = {name: index for index, name in enumerate(IPHONE_ORDER)}
        return sorted(labels, key=lambda label: (rank.get(label, 900), label))
    return sorted(labels)


def load_brands(path: Path) -> dict[str, list[dict]]:
    payload = json.loads(path.read_text(encoding="utf-8"))
    out: dict[str, list[dict]] = {}
    for entry in payload.get("brands", []):
        brand = entry["brand"]
        models = []
        for model in entry.get("models", []):
            codes = {item.get("code") for item in model.get("services", [])}
            models.append({"label": model["label"], "codes": codes})
        out[brand] = models
    return out


def labels_for(brand: str, models: list[dict], codes: tuple[str, ...] | None) -> list[str]:
    picked = [
        model["label"]
        for model in models
        if codes is None or (model["codes"] & set(codes))
    ]
    return sort_labels(brand, picked)


def render_catalog(brand: str, models: list[str]) -> str:
    form_brand = FORM_BRAND[brand]
    chips = []
    for label in models:
        href = f"/?brand={quote(form_brand)}&model={quote(label)}#repair-flow"
        chips.append(
            f'<li><a class="model-chip" href="{href}">{label}</a></li>'
        )
    chip_html = "".join(chips)
    return (
        f"{START}\n"
        f'<div class="model-catalog">\n'
        f"  <h2>{HEADINGS[brand]}</h2>\n"
        f'  <p class="model-catalog-note">{NOTES[brand]}</p>\n'
        f'  <ul class="model-chip-list">{chip_html}</ul>\n'
        f"</div>\n"
        f"{END}"
    )


def upsert_block(html: str, block: str) -> str:
    pattern = re.compile(re.escape(START) + r".*?" + re.escape(END), re.DOTALL)
    if pattern.search(html):
        return pattern.sub(block, html)

    battery = re.compile(
        r"<h2>Какие модели обслуживаем</h2>\s*"
        r"<ul[\s\S]*?</ul>\s*"
        r"<p[^>]*>Это не полный список[\s\S]*?</p>",
        re.IGNORECASE,
    )
    if battery.search(html):
        return battery.sub(block, html, count=1)

    models_line = re.compile(
        r'<p style="margin-top:10px;opacity:\.85">Модели:.*?</p>\s*',
        re.IGNORECASE,
    )
    if models_line.search(html):
        return models_line.sub(block + "\n        ", html, count=1)

    subtitle = re.compile(
        r'(<p class="section-subtitle">[\s\S]*?</p>)',
        re.IGNORECASE,
    )
    if subtitle.search(html):
        return subtitle.sub(r"\1\n        " + block, html, count=1)

    hero_lead = re.compile(
        r'(<p class="page-hero-lead">[\s\S]*?</p>)',
        re.IGNORECASE,
    )
    if hero_lead.search(html):
        return hero_lead.sub(r"\1\n        " + block, html, count=1)

    hero_p = re.compile(
        r'(<h1[^>]*>[\s\S]*?</h1>\s*<p[^>]*>[\s\S]*?</p>)',
        re.IGNORECASE,
    )
    if hero_p.search(html):
        return hero_p.sub(r"\1\n        " + block, html, count=1)

    raise RuntimeError("No insertion point for model catalog")


def render_datalist(all_models: list[str]) -> str:
    options = "".join(f'<option value="{label}">' for label in all_models)
    return (
        f"{DATALIST_START}"
        f'<datalist id="repair-model-list">{options}</datalist>'
        f"{DATALIST_END}"
    )


def upsert_datalist(html: str, block: str) -> str:
    pattern = re.compile(
        re.escape(DATALIST_START) + r".*?" + re.escape(DATALIST_END),
        re.DOTALL,
    )
    if pattern.search(html):
        return pattern.sub(block, html)
    needle = 'id="flowModel"'
    idx = html.find(needle)
    if idx < 0:
        raise RuntimeError("flowModel input not found")
    close = html.find(">", idx)
    tag = html[html.rfind("<", 0, idx) : close + 1]
    if "list=" not in tag:
        updated = tag.replace(
            'id="flowModel"',
            'id="flowModel" list="repair-model-list"',
        )
        html = html.replace(tag, updated, 1)
    insert_at = html.find(">", html.find(needle)) + 1
    return html[:insert_at] + "\n                        " + block + html[insert_at:]


def write_catalog_files(brands: dict[str, list[dict]]) -> dict[str, list[str]]:
    form_map: dict[str, list[str]] = {}
    payload_brands = []
    for book_brand, models in brands.items():
        labels = labels_for(book_brand, models, None)
        form_brand = FORM_BRAND[book_brand]
        form_map[form_brand] = labels
        payload_brands.append(
            {
                "brand": book_brand,
                "formBrand": form_brand,
                "models": labels,
            }
        )
    payload = {
        "updatedAt": "2026-08-19",
        "source": "data/site-pricebook.json",
        "modelCount": sum(len(v) for v in form_map.values()),
        "brands": payload_brands,
    }
    MODELS_JSON.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
        newline="\n",
    )
    js_body = json.dumps(form_map, ensure_ascii=False, indent=2)
    MODELS_JS.write_text(
        "/* Names only, from the public site-pricebook. Regenerated by scripts/apply_repair_models.py */\n"
        f"window.REMPHONE_REPAIR_MODELS = {js_body};\n",
        encoding="utf-8",
        newline="\n",
    )
    return form_map


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--pricebook", type=Path, default=PRICEBOOK)
    parser.add_argument("--dry-run", action="store_true")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    brands = load_brands(args.pricebook)
    form_map = write_catalog_files(brands)

    for rel, (brand, codes) in PAGE_BRANDS.items():
        page = ROOT / rel
        labels = labels_for(brand, brands[brand], codes)
        block = render_catalog(brand, labels)
        html = page.read_text(encoding="utf-8")
        updated = upsert_block(html, block)
        updated = updated.replace("styles.css?v=design1", "styles.css?v=models1")
        if args.dry_run:
            print(f"DRY {rel} models={len(labels)}")
            continue
        page.write_text(updated, encoding="utf-8", newline="\n")
        print(f"OK  {rel} models={len(labels)}")

    index = ROOT / "index.html"
    all_models = [label for labels in form_map.values() for label in labels]
    html = index.read_text(encoding="utf-8")
    html = upsert_datalist(html, render_datalist(all_models))
    if "repair-models.js" not in html:
        html = html.replace(
            '<script src="script.js?v=design1"></script>',
            '<script src="repair-models.js"></script>\n<script src="script.js?v=models1"></script>',
            1,
        )
    else:
        html = html.replace("script.js?v=design1", "script.js?v=models1")
    if args.dry_run:
        print(f"DRY index.html datalist={len(all_models)}")
    else:
        index.write_text(html, encoding="utf-8", newline="\n")
        print(f"OK  index.html datalist={len(all_models)}")

    print(
        "brands="
        + ", ".join(
            f"{name}:{len(labels_for(name, models, None))}"
            for name, models in brands.items()
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
