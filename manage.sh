#!/usr/bin/env bash

# === Helper Functions

function scaleTo {
  echo "Current function: ${FUNCNAME[0]}"
  local scale=${1:-1}
  eval "INSTANCE_NUM=$scale ./compose.sh --profile replicated up -d --scale n8n-webhook=$scale --scale n8n-webhook-proxy=$scale --scale n8n-worker=$scale --no-recreate"
}

# === Actions

function up {
  echo "Current function: ${FUNCNAME[0]}"
  eval "./compose.sh up -d"
}

function down {
  echo "Current function: ${FUNCNAME[0]}"
  eval "./compose.sh --profile replicated down"
  eval "./compose.sh down"
}

function getCurrentScale {
  echo $(docker ps --filter "name=docker-n8n-worker-*" --format '{{.Names}}' | sort -r | head -n 1 | rev | cut -d'-' -f1 | rev)
}

function scale {
  echo "Current function: ${FUNCNAME[0]}"
  local scale=${1:-1}
  local currentScale=$(getCurrentScale)
  currentScale=${currentScale:-0}
  echo "Current scale: $currentScale"
  if [ "$currentScale" -lt "$scale" ]; then
    echo "Upscale to $scale"
    for ((i = currentScale + 1; i <= scale; i++)); do
      scaleTo $i
    done
  else
    echo "Downscale to $scale"
    scaleTo $scale
  fi
}

function ps {
  docker ps --filter "name=docker-*" --format '{{.Names}}' | sort
}

function echoInstanceFor {
  docker exec $1 sh -c 'echo $INSTANCE_TYPE $INSTANCE_NUM'
}

function echoInstance {
  list=$(docker ps --filter "name=docker-n8n-*" --format '{{.Names}}' | sort)
  while IFS= read -r line; do
    echo "$line: $(echoInstanceFor $line)"
  done <<<"$list"
}

function clean {
  docker volume rm \
    docker_n8n \
    docker_postgres \
    docker_openobserve \
    docker_redis
}

function create_owner {
  login_response=$(curl -I -X GET http://localhost:5678/rest/login)
  echo $login_response
  cookie_value=$(echo "$login_response" | grep -oP 'Set-Cookie: \K[^;]*')
  curl -X POST http://localhost:5678/rest/owner/setup \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -H "Cookie: $cookie_value" \
    -d '{
      "email": "a@a.aa",
      "firstName": "owner",
      "lastName": "owner",
      "password": "1234567A"
    }'
}

function import_wf {
  docker exec docker-n8n-main-1 n8n import:credentials --input=/data/creds/creds.json
  docker exec docker-n8n-main-1 n8n import:workflow --separate --input=/data/workflows
}

function wait_n8n {
  local url="http://localhost:5678/rest/login"
  local wait_msg="n8n is starting up. Please wait"
  while true; do
    response=$(curl -s -X GET $url)

    if [ $? -ne 0 ] || [ "$response" = "$wait_msg" ]; then
      echo "waiting for n8n"
      sleep 1
    else
      sleep 1
      return
    fi
  done
}

# === Combined tasks

function deploy {
  local "${@}"
  local scale=${scale:-0}
  up
  wait_n8n
  import_wf
  create_owner
  if [ -n $scale ]; then
    scale $scale
  fi
  ps
  echoInstance
}

function redeploy {
  scale 0
  down
  clean
  deploy ${@}
}

# redeploy service
function rs {
  local service=$1
  ./compose.sh down $1
  docker volume rm docker_$1
  ./compose.sh up -d $1
}

# === Entry point

function run {
  local action=$1
  $action ${@:2}
}

run ${@}
