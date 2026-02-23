# Updating CardioVerse from Open WebUI upstream

CardioVerse is a customized branch of [open-webui/open-webui](https://github.com/open-webui/open-webui). This guide explains how to pull the latest Open WebUI changes while keeping CardioVerse customizations.

## Remotes

| Remote   | URL                                      | Use |
|----------|------------------------------------------|-----|
| `origin` | `git@github.com:open-webui/open-webui.git` | Upstream Open WebUI (pull updates) |
| `cardio` | `https://github.com/RezaSaboori/CardioVerse.git` | Your CardioVerse repo (push/pull your branch) |

## Quick update (merge upstream into CardioVerse)

From the repo root:

```bash
# 1. Fetch latest from Open WebUI
git fetch origin

# 2. Merge upstream main into your current branch (keeps your commits on top)
git merge origin/main

# 3. If there are conflicts, resolve them (see below), then:
#    git add . && git commit -m "Merge upstream open-webui"

# 4. Push your updated branch to CardioVerse
git push cardio main
```

Or use the helper script:

```bash
./scripts/update-from-open-webui.sh
```

## Resolving merge conflicts

When you merge `origin/main`, conflicts may appear in files that both upstream and CardioVerse changed. **CardioVerse-customized files** (where you usually want to keep *your* version) are:

### Backend & config
- `backend/open_webui/env.py`
- `backend/start.sh`

### Branding assets (backend)
- `backend/open_webui/static/apple-touch-icon.png`
- `backend/open_webui/static/favicon-96x96.png`
- `backend/open_webui/static/favicon-dark.png`
- `backend/open_webui/static/favicon.ico`
- `backend/open_webui/static/favicon.png`
- `backend/open_webui/static/favicon.svg`
- `backend/open_webui/static/logo.png`
- `backend/open_webui/static/splash-dark.png`
- `backend/open_webui/static/splash.png`
- `backend/open_webui/static/web-app-manifest-192x192.png`
- `backend/open_webui/static/web-app-manifest-512x512.png`

### Frontend (CardioVerse UI)
- `src/app.html`
- `src/lib/apis/index.ts`
- `src/lib/constants.ts`
- `src/lib/i18n/index.ts`
- `src/routes/+layout.svelte`
- `vite.config.ts`

### Static assets (frontend)
- `static/favicon.png`
- `static/static/apple-touch-icon.png`
- `static/static/favicon-96x96.png`
- `static/static/favicon-dark.png`
- `static/static/favicon.ico`
- `static/static/favicon.png`
- `static/static/favicon.svg`
- `static/static/logo.png`
- `static/static/splash-dark.png`
- `static/static/splash.png`
- `static/static/web-app-manifest-192x192.png`
- `static/static/web-app-manifest-512x512.png`

### Lockfile (often accept upstream)
- `package-lock.json` — you can often take upstream’s version, then run `npm install` and commit if needed.

For conflicts in the **CardioVerse-customized** files above, prefer keeping your CardioVerse version unless you intentionally want to adopt an upstream change (e.g. a security fix). For other files, prefer upstream’s version unless you have local changes.

After resolving:

```bash
git add .
git commit -m "Merge upstream open-webui (resolve conflicts, keep CardioVerse customizations)"
git push cardio main
```

## Optional: rebase instead of merge

To keep a linear history with your customizations replayed on top of latest upstream:

```bash
git fetch origin
git rebase origin/main
# resolve any conflicts, then: git add . && git rebase --continue
git push cardio main
```

If you had already pushed this branch to `cardio`, use a force push after rebase: `git push --force-with-lease cardio main`.

## Re-applying CardioVerse customizations from patch

If you ever want to apply the CardioVerse diff on a fresh clone or another branch, a reference patch is in `patches/` (e.g. `0001-CardioVerse-custom-branding-config-and-UI.patch`). From repo root:

```bash
git apply patches/0001-CardioVerse-custom-branding-config-and-UI.patch
# resolve any conflicts, then commit
```

(Regenerate the patch with `git format-patch -1 <commit> -o patches` after big upstream merges if you want it to reflect the latest customizations.)

## Summary

1. **Pull updates:** `git fetch origin && git merge origin/main`
2. **Resolve conflicts** in the customized files list above (keep CardioVerse when in doubt).
3. **Push:** `git push cardio main`

This way you stay in sync with [Open WebUI](https://github.com/open-webui/open-webui) while keeping CardioVerse branding and behavior.
