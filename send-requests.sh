#!/usr/bin/env bash

declare -a background_pids=()  # Array to store background task PIDs

function send_log {
  curl -s http://localhost:5080/api/org1/stream1/_json -u 'root@example.com:Complexpass#123' -d "[$1]"
}

function start_task {
  local id=$1
  local duration=$2
  echo "New task: id=$id, duration=$duration"
  response=$(curl -s "http://localhost:5679/webhook/start-task?id=$id&duration=$duration")
  echo "Response for id=$id, duration=$duration:"
  echo "$response"
  echo "----------------------"
  send_log "$response"
}

function wait_for_background_tasks {
  echo "Waiting for background tasks to finish..."
  for pid in "${background_pids[@]}"; do
    echo "Waiting $pid"
    wait "$pid"
  done
  echo "All background tasks finished"
}

function send_requests {
  id=${1:-1}
  trap 'terminate=true' SIGINT

  while true; do
    duration=$((RANDOM % 2 + 5))
    pause=$((RANDOM % 2 + 0))
    
    start_task $id $duration &
    echo $!
    background_pids+=($!)  # Store the PID of the background task

    ((id++))
    echo "Waiting for $pause seconds before next request..."
    sleep $pause

    if [[ $terminate ]]; then
      break
    fi
  done

  wait_for_background_tasks
}

send_requests ${@}
