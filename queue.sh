#!/usr/bin/env bash
cd queue
source .env
npx ts-node -r dotenv/config --experimental-specifier-resolution=node --esm src/index.ts ${@}
