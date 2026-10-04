# Versioning and Release Governance

NexoHarness uses two distinct version systems.

## Phase certification tags

Phase certification tags use:

```text
phase-<phase>-certified
```

Examples:

- `phase-0.1-certified`
- `phase-0.1.5-certified`
- `phase-0.2-certified`
- `phase-1.0-certified`

A certified tag points to the exact commit that completed the phase, passed fresh validation, received independent review and was explicitly approved for promotion.

Certified tags are immutable. Never delete and recreate, force-push, move or reuse a certified tag for another SHA. The exact independently reviewed commit must be the exact commit certified by the tag.

Phase 0.1 is the one-time bootstrap exception: `phase-0.1-certified` was annotated and pushed before release automation existed. No historical `phase-0.0-certified` or `phase-0.0.5-certified` tags are created; those phases remain documented as pre-certification baseline phases.

## Product versions

SemVer is reserved for actual distributable product versions. Examples include:

- `v0.1.0-alpha.1`
- `v0.1.0-beta.1`
- `v0.1.0-rc.1`
- `v1.0.0`

Phase numbers are roadmap and certification milestones; they are not automatically product versions.

## Commits

Contributions use Conventional Commits with a meaningful type and scope:

```text
feat(schema): add canonical capability model
fix(validation): reject unresolved references
docs(versioning): define certification semantics
test(release): reject mismatched approved SHA
ci(github): add canonical validation workflow
```

Common types are `feat`, `fix`, `docs`, `test`, `refactor`, `chore`, `ci`, `build` and `perf`. Messages such as `update`, `changes` and `fix stuff` are not useful project history. No heavy commit-lint framework is required in pre-alpha.

## Signatures

Certified phase tags must be annotated. Signed tags are recommended when local signing is configured, but unsigned tags remain acceptable during pre-alpha. NexoHarness does not configure personal GPG or SSH keys and does not change global Git configuration.

Before stable `v1.0.0` certification, the project must explicitly decide and implement release-signing policy.

## Promotion command

`npm run phase:close -- --phase <phase> --title <title> --approved-sha <full-sha>` is a promotion command. It validates a clean, synchronized `main` worktree and the exact approved commit, runs fresh validation, creates an annotated certification tag and pushes only that tag.

It never edits source, creates commits, amends history, merges branches, force-pushes or moves an existing tag. Independent review remains required before promotion.

## Bootstrap release backfill

The Phase 0.1 tag predates release automation. After this workflow is present on `main`, use the GitHub Actions **Release** workflow's manual dispatch with `tag=phase-0.1-certified`. The workflow requires the existing tag, checks out and validates that tagged commit, and refuses to overwrite an existing GitHub Release. It does not recreate or move the tag.

## Release classification

- `phase-*-certified` creates a GitHub pre-release.
- SemVer tags containing `-alpha`, `-beta` or `-rc` create GitHub pre-releases.
- Stable `vMAJOR.MINOR.PATCH` tags create normal GitHub Releases.

NexoHarness does not publish npm packages or external artifacts in this phase. Release automation validates before publishing and refuses to overwrite an existing GitHub Release.

## Supply chain and governance follow-ups

CI uses official GitHub Actions for checkout and Node setup. These are CI infrastructure dependencies, not canonical runtime dependencies. Exact action pinning is a future CI hardening item.

Branch protection is intentionally not automated yet. It is a follow-up candidate after Phase 0.1.5 certification.
