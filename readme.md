source ./autocomplete.sh OR open shell in VSCode.

- ./manage.sh redeploy scale=3
- Activate "Load Simulator" workflow from UI.
- ./send-requests



# Openobserve

- https://openobserve.ai/docs/

## Ingest logs

- https://openobserve.ai/docs/ingestion/logs/curl/

Examples:

    curl http://localhost:5080/api/org1/stream1/_json -i -u 'root@example.com:Complexpass#123' -d '[{"author":{"x":"Prabhat Sharma"}}]'
    curl http://localhost:5080/api/default/quickstart1/_json -i -u 'root@example.com:Complexpass#123' --data-binary "@k8slog_json.json"

# Resources

- https://h3xagn.com/streaming-logs-using-rabbitmq/

