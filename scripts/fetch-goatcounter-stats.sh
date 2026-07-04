#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
CONFIG_FILE="$ROOT_DIR/scripts/goatcounter-config.json"
OUTPUT_FILE="$ROOT_DIR/scripts/goatcounter-raw.json"

if ! command -v node >/dev/null 2>&1; then
  echo "Error: node is required." >&2
  exit 1
fi

if ! command -v curl >/dev/null 2>&1; then
  echo "Error: curl is required." >&2
  exit 1
fi

if [ -z "${GOATCOUNTER_TOKEN:-}" ]; then
  echo "Error: GOATCOUNTER_TOKEN is not set." >&2
  echo "Usage: GOATCOUNTER_TOKEN='medicalimaging2026' bash scripts/fetch-goatcounter-stats.sh" >&2
  exit 1
fi

SITE_URL="$(node -e "const c=require('$CONFIG_FILE'); console.log(c.site)")"

QUERY_STRING="$(node <<'NODE'
const fs = require('fs');
const path = require('path');
const configPath = path.resolve(process.cwd(), 'scripts/goatcounter-config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const parts = ['path_by_name=true', 'limit=100'];
for (const p of config.pages) {
  parts.push('include_paths=' + encodeURIComponent(p.path));
}
process.stdout.write(parts.join('&'));
NODE
)"

curl --silent --show-error \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${GOATCOUNTER_TOKEN}" \
  "${SITE_URL}/api/v0/stats/hits?${QUERY_STRING}" \
  > "$OUTPUT_FILE"

echo "Saved raw GoatCounter response to: $OUTPUT_FILE"
