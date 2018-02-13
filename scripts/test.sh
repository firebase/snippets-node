set -e

# Bootstrap everything
# lerna bootstrap

# Run linter
find . -type f -name "*.js" -not -path "*node_modules*" \
  | xargs ./node_modules/.bin/eslint

# Run all tests
lerna run test