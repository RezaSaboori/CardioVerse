# Updating CardioVerse from Open WebUI upstream

CardioVerse is a customized branch of [open-webui/open-webui](https://github.com/open-webui/open-webui). Since you use your **fork** [RezaSaboori/open-webui](https://github.com/RezaSaboori/open-webui) as the source (no direct access to the original repo), you sync the fork first, then pull into CardioVerse.

## Remotes

| Remote     | URL                                               | Use |
|------------|---------------------------------------------------|-----|
| `origin`   | `https://github.com/RezaSaboori/open-webui.git`   | Your fork — **pull updates into CardioVerse from here** |
| `upstream` | `git@github.com:open-webui/open-webui.git`        | Original Open WebUI — **sync your fork from this** (on GitHub or via git) |
| `cardio`   | `https://github.com/RezaSaboori/CardioVerse.git`  | CardioVerse repo — push/pull your customized branch |

## Two-step update

### Step 1: Sync your fork with Open WebUI

Get the latest from the original repo into [RezaSaboori/open-webui](https://github.com/RezaSaboori/open-webui):

- **On GitHub:** Open your fork → click **“Sync fork”** → **“Update branch”** (if the button is there).
- **Or in a clone of your fork:**  
  `git fetch upstream && git checkout main && git merge upstream/main && git push origin main`

You only need to do this when you want to pull new Open WebUI changes into CardioVerse.

### Step 2: Pull updates into CardioVerse (this repo)

From the **CardioVerse** repo root:

```bash
# 1. Fetch latest from your fork
git fetch origin

# 2. Merge your fork’s main into your current branch (keeps your commits on top)
git merge origin/main

# 3. If there are conflicts, resolve them (see below), then:
#    git add . && git commit -m "Merge upstream open-webui"

# 4. Push your updated branch to CardioVerse
git push cardio main
```

Or use the helper script (it uses `origin` = your fork):

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

To keep a linear history with your customizations replayed on top of latest from your fork:

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

1. **Sync your fork** with [open-webui/open-webui](https://github.com/open-webui/open-webui) (GitHub “Sync fork” or `git fetch upstream && git merge upstream/main && git push` in your fork clone).
2. **Pull into CardioVerse:** `git fetch origin && git merge origin/main`
3. **Resolve conflicts** in the customized files list above (keep CardioVerse when in doubt).
4. **Push:** `git push cardio main`

This way you stay in sync with Open WebUI via your fork while keeping CardioVerse branding and behavior.
