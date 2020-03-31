#!/usr/bin/env bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

if [[ -z $CI ]]; then
  echo "CI is unset, assuming local testing."
else
  echo "CI=${CI}, setting GOOGLE_APPLICATION_CREDENTIALS"
  export GOOGLE_APPLICATION_CREDENTIALS="${DIR}/service-account.json"
fi

echo "Application Default Credentials: ${GOOGLE_APPLICATION_CREDENTIALS}"