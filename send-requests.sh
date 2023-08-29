#!/usr/bin/env bash

send_requests() {
  id=${1:-1}
  while true; do
    duration=$((RANDOM % 2 + 5))
    pause=$((RANDOM % 2 + 1))

    echo "New task: id=$id, duration=$duration"
    curl "http://localhost:5678/webhook/start-task?id=$id&duration=$duration"
    ((id++))
    echo "Waiting for $pause seconds before next request..."
    # sleep $pause
  done
}

trap "echo 'Terminating...'; exit" SIGINT # Trap CTRL+C and exit gracefully

send_requests ${@}
