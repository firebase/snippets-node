set -e

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
find . -type f -name "*.js" -not -path "*node_modules*" \
  | xargs eslint

# Only run test suite when we can decode the service acct
if [ "$TRAVIS_SECURE_ENV_VARS" = false ]; then
  echo "Could not find secure environment variables, skipping integration tests."
else
  # Run all tests
  lerna run test
fi