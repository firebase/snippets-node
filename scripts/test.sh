set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# 0) Bootstrap
echo "Bootstrapping..."
npm run lerna-bootstrap

# 1) Run linter
echo "Linting..."
npm run lint

# 2) Run tests in emulator
source ${DIR}/set-credentials.sh
npx firebase --project="firestore-snippets" emulators:exec --only firestore "npm run lerna-test"
