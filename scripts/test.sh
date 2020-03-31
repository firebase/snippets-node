set -e

# 0) Bootstrap
echo "Bootstrapping..."
npm run lerna-bootstrap

# 1) Run linter
echo "Linting..."
npm run lint

# 2) "Compile" the code
echo "Compiling..."
npm run lerna-compile

# 3) Run tests in emulator
npx firebase --project="test-snippets-node" emulators:exec --only firestore "npm run lerna-test"