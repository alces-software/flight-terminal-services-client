#!/bin/bash

set -euo pipefail

REPO_ROOT=$(git rev-parse --show-toplevel)
MANAGE_ROOT="${REPO_ROOT}/manage"

source <( cat "${MANAGE_ROOT}/.env" \
    | grep -v '^ *#' \
    | sed '/^ *$/d' \
    | sed 's/^/export /'
)

yarn run start:server
