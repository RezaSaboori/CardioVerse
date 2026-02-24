# Branding and display names (env)

You can control the app name and community/copyright text from a single `.env` file.

## Env variables

| Variable | Description | Default |
|----------|-------------|--------|
| `WEBUI_NAME` | Main app name (sidebar, tab title, auth pages, manifest, etc.) | `Open WebUI` |
| `COMMUNITY_NAME` | Line used for “Made by …”, “Share to …” (community/copyright) | `Open WebUI Community` |

## Where they are used

- **Backend:** Reads `WEBUI_NAME` and `COMMUNITY_NAME` from `.env` and exposes them in `/api/config` as `name` and `community_name`. The frontend uses these for all branding.
- **Frontend build:** `WEBUI_NAME` is passed into the Vite build so the initial HTML `<title>` and the default app name (before config loads) match your env. Set `WEBUI_NAME` (and optionally `VITE_WEBUI_NAME`) in `.env` before running `npm run build`.

## Examples

**Open WebUI (default):**
```env
WEBUI_NAME='Open WebUI'
COMMUNITY_NAME='Open WebUI Community'
```

**NCIBB ChatHub:**
```env
WEBUI_NAME='NCIBB ChatHub'
COMMUNITY_NAME='NCIBB ChatHub'
```

**CardioVerse:**
```env
WEBUI_NAME='CardioVerse'
COMMUNITY_NAME='CardioVerse'
```

Copy `.env.example` to `.env` and edit the “Branding” section. Restart the backend after changing env; rebuild the frontend if you change `WEBUI_NAME`.
