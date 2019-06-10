#!/usr/bin/env bash
set -e

# 0) Bootstrap
echo "Bootstrapping..."
npm run lerna-bootstrap

# 1) Pull request
if [ -z "$TRAVIS_PULL_REQUEST" ]; then
  echo "TRAVIS_PULL_REQUEST: unset, setting to false"
  TRAVIS_PULL_REQUEST=false
else
  echo "TRAVIS_PULL_REQUEST: $TRAVIS_PULL_REQUEST"
fi

# 2) Secure env variables
if [ -z "$TRAVIS_SECURE_ENV_VARS" ]; then
  echo "TRAVIS_SECURE_ENV_VARS: unset, setting to false"
  TRAVIS_SECURE_ENV_VARS=false
else
  echo "TRAVIS_SECURE_ENV_VARS: $TRAVIS_SECURE_ENV_VARS"
fi

# Run linter
echo "Linting..."
npm run lint

# Only run test suite when we can decode the service acct
if [ "$TRAVIS_SECURE_ENV_VARS" = false ]; then
  echo "Could not find secure environment variables, skipping integration tests."
else
  # Decode secure stuff
  openssl aes-256-cbc -K $encrypted_001d217edcb2_key -iv $encrypted_001d217edcb2_iv -in service-account.json.enc -out service-account.json -d

  # Run all tests
  npm run lerna-test
fi
