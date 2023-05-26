set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# 0) Bootstrap
echo "Bootstrapping..."
npm run bootstrap

# 1) Run linter
echo "Linting..."
npm run lint

# 2) "Compile" the code
echo "Compiling..."
npm run compile

# 3) Run tests in emulator
export GCLOUD_PROJECT="firestore-snippets"
npm run test
