from catalyst_wrapper import init_catalyst_client


if __name__ == "__main__":
    client = init_catalyst_client()
    datastore = client.datastore()
    victim_table = datastore.get_table_instance("victim")
    rows = victim_table.get_all_rows()
    print(f"Fetched {len(rows)} victim records")
    for row in rows:
        print(row)
