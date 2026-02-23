# CardioVerse customization patches

This folder holds a reference patch of the CardioVerse customizations (branding, config, UI) on top of Open WebUI. Use it to re-apply changes on a fresh clone or another branch if needed.

- **Apply:** `git apply patches/0001-CardioVerse-custom-branding-config-and-UI.patch` (from repo root)
- **Regenerate** after merging upstream: `git format-patch -1 <your-last-cardioverse-commit> -o patches`

See [../docs/CARDIOVERSE_UPDATING.md](../docs/CARDIOVERSE_UPDATING.md) for the full update workflow.
