# Contributing to NexoHarness

NexoHarness is in its foundation phase. Keep contributions small, evidence-based and aligned with the canonical architecture.

## Before contributing

- Open an issue before large behavioral or architectural changes.
- Inspect the source-of-truth rules and preserve the canonical/adaptor boundary.
- Do not import third-party content without license and provenance review.
- Never include secrets or credentials.

## Changes

- Make the canonical source the only place where behavior is authored.
- Do not edit generated artifacts; regenerate them from canonical inputs.
- Add or update tests and evaluations for behavior changes.
- Record provenance for external adaptations.
- Avoid silent generated-file changes.
- Use Conventional Commits or another clearly structured commit format; preferred types include `feat`, `fix`, `docs`, `test`, `refactor`, `chore`, `ci`, `build` and `perf`.

## Validation

Before opening a change for review, run:

```text
npm run typecheck
npm run validate
npm test
git diff --check
```

Explain any unavailable or failing check in the change description. Independent review is expected for changes to rules, enforcement, permissions, adapters or promotion paths.

## Candidate and certified state

A candidate commit is validated work awaiting independent review. A certified phase tag is immutable and may only point to the exact independently reviewed and approved commit. `npm run phase:close` is a promotion command: it requires a clean, synchronized `main` branch and an explicit full approved SHA, then creates and pushes only the annotated tag. It cannot replace independent review.
