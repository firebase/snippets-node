#!/usr/bin/env bash
set -e

CWD="$(pwd)"

if [[ -z $CI ]]; then
  echo "CI is unset, assuming local testing."
else
  echo "CI=${CI}, setting GOOGLE_APPLICATION_CREDENTIALS"
  export GOOGLE_APPLICATION_CREDENTIALS="${CWD}/scripts/service-account.json"
fi

echo "Application Default Credentials: ${GOOGLE_APPLICATION_CREDENTIALS}"