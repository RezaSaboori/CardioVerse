#!/usr/bin/env bash
# Update CardioVerse from open-webui/open-webui upstream.
# Keeps your customizations; merge conflicts may need manual resolution.
# See docs/CARDIOVERSE_UPDATING.md for details.

set -e
cd "$(dirname "$0")/.."

echo "Fetching latest from Open WebUI (origin)..."
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
