# Release v1.0.0-202511181919

**Tag:** `v1.0.0-202511181919`
**Date:** 2025-11-18
**Source:** `main` (synced from `feature/claude-haiku-impl`)

## Summary

This release is a snapshot of the `feature/claude-haiku-impl` branch and includes:

- Complete i18n integration for screens (EN/TR)
- E2E and unit test improvements and mocks
- iOS widget and watch app implementation guidance
- 10 comprehensive implementation guides and troubleshooting docs
- Final UI screen and hook fixes

## Important Commits (recent)

- `91db8d5` chore: Sync local changes — finalize screens, hooks, tests, and configs
- `464f4ec` docs: Add remaining implementation guides (Days 4-8, Troubleshooting, Index)
- `ddb9953` chore: Add final screen improvements and i18n translations
- `aa8ef0a` feat: Restore AuraScanScreen.tsx

## Notes for Release

- The `main` branch was force-updated to match `feature/claude-haiku-impl` as part of the release workflow. If you have a local `main` branch based on the prior remote state, reset it:

```powershell
git fetch origin
git checkout main
git reset --hard origin/main
```

- CI/CD: Trigger your pipeline or GitHub Actions workflow (if configured) for the new tag.

## How to create a GitHub Release (if you want an official GitHub release page)

If you have GitHub CLI (`gh`) installed and authenticated:

```bash
gh release create v1.0.0-202511181919 \\
  --title "v1.0.0-202511181919" \\
  --notes-file RELEASE_NOTES_v1.0.0-202511181919.md
```

Or with curl (use a personal access token with `repo` scope):

```bash
API_TOKEN=ghp_xxx
curl -X POST -H "Authorization: token $API_TOKEN" \\
  -d '{"tag_name":"v1.0.0-202511181919","name":"v1.0.0-202511181919","body":"Release notes file attached in repository."}' \\
  https://api.github.com/repos/kazimincii/Astro-lab/releases
```

## Post-release checklist

- [ ] Trigger CI/CD pipelines for production
- [ ] Verify TestFlight/production EAS build
- [ ] Notify the team (Slack/email) with release notes and rollback instructions
- [ ] Monitor errors and user feedback

---

Maintained by: Team Lead
