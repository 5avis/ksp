import json

import zcatalyst_sdk


def handler(context, basicio):
    client = zcatalyst_sdk.initialize()
    datastore = client.datastore()
    table = datastore.table("CaseMaster")

    query = (basicio.get_argument("query") or "").lower()
    rows = _get_all_rows(table)

    results = [
        row
        for row in rows
        if query in (row.get("BriefFacts") or "").lower()
    ]

    basicio.write(json.dumps({"results": results}))
    context.close()


def _get_all_rows(table):
    rows = []
    next_token = None
    more_records = True

    while more_records:
        page = table.get_paged_rows(next_token, max_rows=200)
        rows.extend(page.get("content", []))
        more_records = page.get("more_records", False)
        next_token = page.get("next_token")

    return rows
