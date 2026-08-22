"""Build public price calculator data for price-calculator.html.

Only client-facing fields: brand, model, service label, final price.
No Moba cost, markup, margin, or internal statuses.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
INPUT_JSON = ROOT / "data" / "full-phone-pricebook.json"
OUTPUT_JS = ROOT / "price-calculator-data.js"

BRAND_ORDER = ["Apple", "Samsung", "Xiaomi", "Honor", "Huawei"]
SERVICE_ORDER = [
    "Дисплей эконом / Copy",
    "Дисплей аналог",
    "Дисплей Original",
    "АКБ",
    "Шлейф зарядки",
    "Задняя камера",
    "Передняя камера",
    "Стекло камеры",
    "Слуховой динамик",
    "Корпус",
    "Задняя крышка",
    "Кнопка Home",
    "Кнопка блокировки",
]
SERVICE_LABELS = {
    "Дисплей эконом / Copy": "Экран (эконом)",
    "Дисплей аналог": "Экран (аналог)",
    "Дисплей Original": "Экран (оригинал)",
    "АКБ": "Батарея",
    "Шлейф зарядки": "Разъём зарядки",
    "Задняя камера": "Задняя камера",
    "Передняя камера": "Передняя камера",
    "Стекло камеры": "Стекло камеры",
    "Слуховой динамик": "Динамик",
    "Корпус": "Корпус",
    "Задняя крышка": "Задняя крышка",
    "Кнопка Home": "Кнопка Home",
    "Кнопка блокировки": "Кнопка блокировки",
}
PUBLISHABLE_STATUSES = {
    "calculated_from_moba_mean_markup",
    "confirmed_partner",
}


def sort_key(row: dict) -> tuple[int, int, str, int, str]:
    brand_index = BRAND_ORDER.index(row["brand"]) if row["brand"] in BRAND_ORDER else 99
    service_index = SERVICE_ORDER.index(row["service"]) if row["service"] in SERVICE_ORDER else 99
    return (brand_index, int(row["release_year"]), row["model"], service_index, row["service"])


def public_price(row: dict) -> int | None:
    status = row.get("price_status")
    price = row.get("final_repair_price_rub")
    if status in PUBLISHABLE_STATUSES and price:
        return int(price)
    return None


def build_payload(input_json: Path) -> dict:
    payload = json.loads(input_json.read_text(encoding="utf-8"))
    rows = []
    priced = 0
    for row in sorted(payload["rows"], key=sort_key):
        price = public_price(row)
        if price:
            priced += 1
        rows.append(
            {
                "brand": row["brand"],
                "model": row["model"],
                "year": row["release_year"],
                "service": row["service"],
                "serviceLabel": SERVICE_LABELS.get(row["service"], row["service"]),
                "price": price,
            }
        )
    models = len({(row["brand"], row["model"]) for row in rows})
    return {
        "generatedAt": payload["summary"]["generated_at"],
        "modelCount": models,
        "rowCount": len(rows),
        "pricedRowCount": priced,
        "brandOrder": BRAND_ORDER,
        "serviceOrder": SERVICE_ORDER,
        "serviceLabels": SERVICE_LABELS,
        "rows": rows,
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input-json", type=Path, default=INPUT_JSON)
    parser.add_argument("--output-js", type=Path, default=OUTPUT_JS)
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    payload = build_payload(args.input_json)
    args.output_js.write_text(
        "window.REMPHONE_PRICE_CALCULATOR = "
        + json.dumps(payload, ensure_ascii=False, separators=(",", ":"))
        + ";\n",
        encoding="utf-8",
    )
    print(f"models={payload['modelCount']}")
    print(f"rows={payload['rowCount']}")
    print(f"priced={payload['pricedRowCount']}")
    print(f"JS: {args.output_js}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
