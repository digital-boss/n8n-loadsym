#!/usr/bin/env bash
docker compose -f docker/docker-compose.yaml --env-file=docker/provision/postgres/postgres.env ${@}
