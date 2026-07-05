#!/usr/bin/env bash
set -euo pipefail

if [ -z "${GOATCOUNTER_TOKEN:-}" ]; then
  echo "Error: GOATCOUNTER_TOKEN is not set." >&2
  exit 1
fi

# 使用最简单的纯相对路径，彻底避开绝对路径冲突
SITE_URL=$(node -e "console.log(require('./scripts/goatcounter-config.json').site)")

curl --silent --show-error \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${GOATCOUNTER_TOKEN}" \
  --get \
  --data-urlencode "path_by_name=true" \
  --data-urlencode "limit=100" \
  $(node -e "require('./scripts/goatcounter-config.json').pages.forEach(p => process.stdout.write(' --data-urlencode include_paths=' + JSON.stringify(p.path)))") \
  "${SITE_URL}/api/v0/stats/hits" \
  > "./scripts/goatcounter-raw.json"

echo "Success! Saved to ./scripts/goatcounter-raw.json"
