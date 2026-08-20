"""Apply curated site «от» prices into brand HTML pages.

Workflow:
  1. Update local master pricebook / Excel as needed (internal).
  2. When owner approves public numbers, edit data/site-price-orientir.json.
  3. Run this script to rewrite static tables on brand pages.
  4. Deploy HTML when ready.

Does not fetch live JSON in the browser. Site prices stay static until the next apply.
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_ORIENTIR = ROOT / "data" / "site-price-orientir.json"

START = "<!-- site-price-orientir:start -->"
END = "<!-- site-price-orientir:end -->"


def fmt_price(value: int) -> str:
    return f"от {value}₽"


def render_block(heading: str, rows: list[dict]) -> str:
    body = "".join(
        f"<tr><td>{row['label']}</td><td>{fmt_price(int(row['priceFrom']))}</td></tr>"
        for row in rows
    )
    return (
        f"{START}\n"
        f"            <h2>{heading}</h2>\n"
        f"            <table style=\"width:100%;margin:16px 0 28px;border-collapse:collapse\">\n"
        f"                <thead><tr><th align=\"left\">Работы</th>"
        f"<th align=\"left\">Цена</th></tr></thead>\n"
        f"                <tbody>{body}</tbody>\n"
        f"            </table>\n"
        f"            {END}"
    )


def replace_or_insert(html: str, block: str) -> str:
    pattern = re.compile(
        re.escape(START) + r".*?" + re.escape(END),
        re.DOTALL,
    )
    if pattern.search(html):
        html = pattern.sub(block, html)
    else:
        dynamic = re.compile(
            r"<h2>Ориентир цен[^<]*</h2>\s*"
            r"(?:<div\b[^>]*data-pricebook-brand\b[^>]*>[\s\S]*?</div>\s*)?"
            r"(?:<table\b[\s\S]*?</table>\s*)?",
            re.IGNORECASE,
        )
        if not dynamic.search(html):
            raise RuntimeError("Could not find orientir anchor in page")
        html = dynamic.sub(block + "\n            ", html, count=1)

    # Remove leftover live wrappers from earlier experiments.
    html = re.sub(
        r"\s*<div\b[^>]*data-pricebook-brand\b[^>]*>[\s\S]*?</div>",
        "",
        html,
        flags=re.IGNORECASE,
    )
    return html


def apply_brand(page: Path, heading: str, rows: list[dict], dry_run: bool) -> None:
    html = page.read_text(encoding="utf-8")
    block = render_block(heading, rows)
    updated = replace_or_insert(html, block)
    # Drop live pricebook script if present.
    updated = re.sub(
        r'\s*<script src="\.\./pricebook-table\.js"></script>',
        "",
        updated,
    )
    if dry_run:
        print(f"DRY {page.relative_to(ROOT)} rows={len(rows)}")
        return
    page.write_text(updated, encoding="utf-8", newline="\n")
    print(f"OK  {page.relative_to(ROOT)} rows={len(rows)}")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--orientir", type=Path, default=DEFAULT_ORIENTIR)
    parser.add_argument("--dry-run", action="store_true")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    payload = json.loads(args.orientir.read_text(encoding="utf-8"))
    for brand, entry in payload["brands"].items():
        page = ROOT / entry["page"]
        if not page.exists():
            raise FileNotFoundError(page)
        apply_brand(page, entry["heading"], entry["rows"], args.dry_run)
    print(f"orientir updatedAt={payload.get('updatedAt')}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
