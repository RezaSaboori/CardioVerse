#!/usr/bin/env bash
# Update CardioVerse from your open-webui fork (origin = RezaSaboori/open-webui).
# Sync your fork with open-webui/open-webui first (GitHub "Sync fork" or upstream merge).
# Keeps your customizations; merge conflicts may need manual resolution.
# See docs/CARDIOVERSE_UPDATING.md for details.

set -e
cd "$(dirname "$0")/.."

echo "Fetching latest from your fork (origin)..."
git fetch origin

echo "Merging origin/main into current branch..."
if git merge origin/main; then
  echo "Merge completed. Push to CardioVerse with: git push cardio main"
else
  echo "Merge had conflicts. Resolve them, then:"
  echo "  git add . && git commit -m 'Merge upstream open-webui' && git push cardio main"
  echo "See docs/CARDIOVERSE_UPDATING.md for customized files to keep."
  exit 1
fi
