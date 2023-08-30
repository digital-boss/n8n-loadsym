# Usage

Prepare:
- `source ./autocomplete.sh` OR open shell in VSCode.

Deploy:
- `./manage.sh redeploy scale=4`
- `./compose.sh up -d balancer`
- Activate "Load Simulator" workflow from [UI](http://localhost:5678).

Start & watch:
- Open executions in Browser: http://localhost:5678/executions
- terminal 1: `./queue.sh`
- terminal 2: `./send-requests`

Stop:
- stop send requests by pressing Enter.
- stop watch queue by pressing Enter.

Analyze:
- Checkout logs: http://localhost:5080/web/logs?org_identifier=org1

# Openobserve

- https://openobserve.ai/docs/

## Ingest logs

- https://openobserve.ai/docs/ingestion/logs/curl/

Examples:

    curl http://localhost:5080/api/org1/stream1/_json -i -u 'root@example.com:Complexpass#123' -d '[{"author":{"x":"Prabhat Sharma"}}]'
    curl http://localhost:5080/api/default/quickstart1/_json -i -u 'root@example.com:Complexpass#123' --data-binary "@k8slog_json.json"

# Resources

- https://h3xagn.com/streaming-logs-using-rabbitmq/

