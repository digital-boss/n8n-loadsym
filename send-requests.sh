#!/usr/bin/env bash
cd sender
npx ts-node -r dotenv/config --experimental-specifier-resolution=node --esm src/index.ts ${@}
