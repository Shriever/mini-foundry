#!/usr/bin/env bash
set -euo pipefail

set -a

. "config/dev.env"
set +a

exec "$@"