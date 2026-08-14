#!/usr/bin/env python3
"""
Сбор частот Wordstat (Yandex Cloud Search API v2) для Remphone.

Нужны в окружении (или .env.wordstat в корне репо):
  YANDEX_WORDSTAT_API_KEY  — Api-Key из Yandex Cloud / AI Studio
  YANDEX_WORDSTAT_FOLDER_ID — folderId каталога

Usage:
  python seo/wordstat_fetch.py
  python seo/wordstat_fetch.py --phrases seo/wordstat/phrases.json
  python seo/wordstat_fetch.py --regions-tree   # справочник регионов (1 запрос)

Пишет отчёт: seo/reports/wordstat-YYYY-MM-DD.md + .json
"""
from __future__ import annotations

import argparse
import json
import os
import sys
import time
import urllib.error
import urllib.request
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
API_ROOT = "https://searchapi.api.cloud.yandex.net/v2/wordstat"


def load_dotenv_file(path: Path) -> None:
    if not path.is_file():
        return
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, val = line.partition("=")
        key = key.strip()
        val = val.strip().strip('"').strip("'")
        if key and key not in os.environ:
            os.environ[key] = val


def api_post(path: str, body: dict, api_key: str) -> dict:
    data = json.dumps(body).encode("utf-8")
    req = urllib.request.Request(
        f"{API_ROOT}{path}",
        data=data,
        headers={
            "Authorization": f"Api-Key {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        err = e.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"HTTP {e.code} {path}: {err[:500]}") from e


def top_requests(
    phrase: str,
    *,
    api_key: str,
    folder_id: str,
    regions: list[str],
    num_phrases: int = 15,
) -> dict:
    return api_post(
        "/topRequests",
        {
            "phrase": phrase,
            "numPhrases": num_phrases,
            "regions": regions,
            "folderId": folder_id,
        },
        api_key,
    )


def regions_tree(api_key: str, folder_id: str) -> dict:
    return api_post("/getRegionsTree", {"folderId": folder_id}, api_key)


def as_int(v) -> int:
    try:
        return int(v)
    except (TypeError, ValueError):
        return 0


def main() -> int:
    load_dotenv_file(ROOT / ".env.wordstat")
    load_dotenv_file(ROOT / ".env")

    parser = argparse.ArgumentParser(description="Remphone Wordstat fetch")
    parser.add_argument(
        "--phrases",
        default=str(ROOT / "seo" / "wordstat" / "phrases.json"),
        help="JSON with phrases + regions",
    )
    parser.add_argument("--regions-tree", action="store_true")
    parser.add_argument("--sleep", type=float, default=0.25, help="Pause between calls")
    args = parser.parse_args()

    api_key = (os.getenv("YANDEX_WORDSTAT_API_KEY") or os.getenv("YANDEX_AI_API_KEY") or "").strip()
    folder_id = (os.getenv("YANDEX_WORDSTAT_FOLDER_ID") or os.getenv("YANDEX_FOLDER_ID") or "").strip()
    if not api_key or not folder_id:
        print(
            "Задайте YANDEX_WORDSTAT_API_KEY и YANDEX_WORDSTAT_FOLDER_ID\n"
            "(см. seo/WORDSTAT.md). Можно положить в .env.wordstat",
            file=sys.stderr,
        )
        return 1

    if args.regions_tree:
        tree = regions_tree(api_key, folder_id)
        out = ROOT / "seo" / "reports" / "wordstat-regions-tree.json"
        out.write_text(json.dumps(tree, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"Wrote {out}")
        return 0

    cfg = json.loads(Path(args.phrases).read_text(encoding="utf-8"))
    phrases: list[str] = cfg["phrases"]
    regions_meta = cfg.get("regions") or []
    today = date.today().isoformat()
    rows: list[dict] = []

    for region in regions_meta:
        rid = str(region["id"])
        rname = region.get("name") or rid
        print(f"=== {rname} (id={rid}) ===")
        for phrase in phrases:
            try:
                raw = top_requests(
                    phrase, api_key=api_key, folder_id=folder_id, regions=[rid]
                )
            except Exception as e:
                print(f"  FAIL {phrase}: {e}", file=sys.stderr)
                rows.append(
                    {
                        "region_id": rid,
                        "region_name": rname,
                        "phrase": phrase,
                        "total_count": None,
                        "error": str(e)[:200],
                        "top": [],
                        "associations": [],
                    }
                )
                time.sleep(args.sleep)
                continue

            total = as_int(raw.get("totalCount"))
            top = [
                {"phrase": x.get("phrase"), "count": as_int(x.get("count"))}
                for x in (raw.get("results") or [])[:10]
            ]
            assoc = [
                {"phrase": x.get("phrase"), "count": as_int(x.get("count"))}
                for x in (raw.get("associations") or [])[:10]
            ]
            rows.append(
                {
                    "region_id": rid,
                    "region_name": rname,
                    "phrase": phrase,
                    "total_count": total,
                    "top": top,
                    "associations": assoc,
                }
            )
            print(f"  {total:>7}  {phrase}")
            time.sleep(args.sleep)

    reports = ROOT / "seo" / "reports"
    reports.mkdir(parents=True, exist_ok=True)
    json_path = reports / f"wordstat-{today}.json"
    md_path = reports / f"wordstat-{today}.md"

    json_path.write_text(
        json.dumps({"date": today, "rows": rows}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    # Markdown summary: sort by total within region
    lines = [
        f"# Wordstat Remphone — {today}",
        "",
        "Источник: Yandex Cloud Search API v2 `/wordstat/topRequests`.",
        "",
    ]
    for region in regions_meta:
        rid = str(region["id"])
        rname = region.get("name") or rid
        subset = [r for r in rows if r["region_id"] == rid and r.get("total_count") is not None]
        subset.sort(key=lambda r: r["total_count"] or 0, reverse=True)
        lines.append(f"## {rname}")
        lines.append("")
        lines.append("| Запрос | Частота (≈30 дн.) | Топ-1 похожий |")
        lines.append("|--------|-------------------|---------------|")
        for r in subset:
            top1 = r["top"][0]["phrase"] if r["top"] else "—"
            top1c = r["top"][0]["count"] if r["top"] else ""
            top_cell = f"{top1} ({top1c})" if top1c != "" else top1
            lines.append(f"| {r['phrase']} | {r['total_count']} | {top_cell} |")
        lines.append("")
        # associations highlight for top 5 phrases
        lines.append("### Ассоциации (для топ‑5 фраз по частоте)")
        lines.append("")
        for r in subset[:5]:
            if not r["associations"]:
                continue
            assoc_s = ", ".join(
                f"{a['phrase']} ({a['count']})" for a in r["associations"][:5]
            )
            lines.append(f"- **{r['phrase']}** → {assoc_s}")
        lines.append("")

    lines.append("## Что делать дальше")
    lines.append("")
    lines.append("1. Сверить с `seo/SEMANTICS.md` — закрытые кластеры vs нули.")
    lines.append("2. В бэклог волны B поднять фразы с частотой > 0 без посадочной.")
    lines.append("3. Не плодить model×city URL при низкой частоте.")
    lines.append("")

    md_path.write_text("\n".join(lines), encoding="utf-8")
    print(f"\nWrote {json_path}")
    print(f"Wrote {md_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
