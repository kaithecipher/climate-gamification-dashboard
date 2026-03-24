import json
import logging

import azure.functions as func

from ..shared.climate_engine import get_dashboard_payload


def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info("GetDashboardData function processed a request.")

    payload = get_dashboard_payload()
    return func.HttpResponse(
        body=json.dumps(payload),
        mimetype="application/json",
        status_code=200,
        headers={
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "no-store"
        }
    )
