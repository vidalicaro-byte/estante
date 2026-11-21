#!/usr/bin/env bash
# The build prerenders pages with live data from Open Library, a third-party API that
# sometimes rate-limits or goes down for a few minutes. Retrying after a pause avoids
# red CI runs caused by that, without hiding real build errors: a genuine bug fails
# every attempt and the job still fails.
set -u

MAX_ATTEMPTS=3
PAUSE_SECONDS=45

for attempt in $(seq 1 "$MAX_ATTEMPTS"); do
  if npm run build; then
    exit 0
  fi
  if [ "$attempt" -lt "$MAX_ATTEMPTS" ]; then
    echo "::warning::Build failed (attempt $attempt of $MAX_ATTEMPTS). Retrying in ${PAUSE_SECONDS}s."
    sleep "$PAUSE_SECONDS"
  fi
done

echo "::error::Build failed after $MAX_ATTEMPTS attempts."
exit 1