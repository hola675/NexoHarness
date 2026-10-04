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
- Use conventional commits or another clearly structured commit format.

## Validation

Before opening a change for review, run:

```text
npm run typecheck
npm run validate
npm test
git diff --check
```

Explain any unavailable or failing check in the change description. Independent review is expected for changes to rules, enforcement, permissions, adapters or promotion paths.
