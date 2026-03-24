"""Azure Functions v2 API for the Climate Quest dashboard.

This API is intentionally lightweight so it can be paired with an Azure Static Web App.
It returns climate dashboard data as JSON and supports basic period filters for demo use.
"""

from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict

import azure.functions as func

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)

BASE_DIR = Path(__file__).resolve().parent.parent
SAMPLE_DATA_PATH = BASE_DIR / "data" / "sample_dashboard.json"

PERIOD_MULTIPLIERS = {
    "7d": 0.32,
    "30d": 1.0,
    "90d": 2.75,
}


def load_seed_data() -> Dict[str, Any]:
    with SAMPLE_DATA_PATH.open("r", encoding="utf-8") as file:
        return json.load(file)


def scaled_value(value: int | float, multiplier: float) -> int:
    return round(value * multiplier)


def build_period_payload(period: str) -> Dict[str, Any]:
    seed = load_seed_data()
    multiplier = PERIOD_MULTIPLIERS.get(period, 1.0)

    if period == "30d":
        seed["meta"]["source"] = "azure-function"
        seed["meta"]["period"] = period
        seed["meta"]["generated_at"] = datetime.now(timezone.utc).isoformat()
        return seed

    payload = seed.copy()
    payload["meta"] = {
        **seed["meta"],
        "source": "azure-function",
        "period": period,
        "generated_at": datetime.now(timezone.utc).isoformat(),
    }

    summary = dict(seed["summary"])
    summary["points"] = scaled_value(summary["points"], multiplier)
    summary["co2_avoided_kg"] = scaled_value(summary["co2_avoided_kg"], multiplier)
    summary["water_saved_liters"] = scaled_value(summary["water_saved_liters"], multiplier)
    summary["trees_equivalent"] = max(1, scaled_value(summary["trees_equivalent"], multiplier))
    summary["community_rank"] = 18 if period == "90d" else 41
    summary["mission_progress"] = {
        **summary["mission_progress"],
        "current": 28 if period == "7d" else 100,
        "target": 100,
        "remaining": 72 if period == "7d" else 0,
        "percentage": 28 if period == "7d" else 100,
        "next_reward": "Eco Guardian Badge" if period == "7d" else "Planet Steward Badge",
    }
    payload["summary"] = summary

    payload["trends"] = [
        {
            **item,
            "co2_avoided_kg": scaled_value(item["co2_avoided_kg"], multiplier),
            "points": scaled_value(item["points"], multiplier),
        }
        for item in seed["trends"]
    ]

    payload["categories"] = [
        {**item, "value": scaled_value(item["value"], multiplier)} for item in seed["categories"]
    ]

    return payload


@app.route(route="dashboard", methods=["GET"])
def dashboard(req: func.HttpRequest) -> func.HttpResponse:
    period = req.params.get("period", "30d").lower().strip()
    payload = build_period_payload(period)

    return func.HttpResponse(
        json.dumps(payload),
        mimetype="application/json",
        status_code=200,
        headers={
            "Cache-Control": "no-store",
            "Access-Control-Allow-Origin": "*",
        },
    )
