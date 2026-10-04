# Evidence Policy

Evidence requirements are proportional to the claim, risk and workflow. Evidence must be fresh: generated against the current relevant state. Successful tests from before a change are not proof after the change.

## Evidence classes

- **E0 — Assertion only:** a statement without independent supporting observation.
- **E1 — Static inspection:** direct inspection of files, structure, configuration or output.
- **E2 — Automated check:** deterministic tests, typecheck, build, lint or schema validation.
- **E3 — Runtime or behavioral verification:** execution, rendered behavior or equivalent observed result.
- **E4 — Independent verification:** confirmation by a separate reviewer or verification path.

Higher classes are not automatically required for every task. The required class is determined by the claim and applicable policy.

## Examples

- Documentation typo: E1 may be enough.
- Compiler fix: E2 is required.
- Interactive UI behavior: E3 may be required.
- Security-sensitive change: E2 or E3 plus independent review may be required.

When evidence is unavailable, the result must be reported as `BLOCKED`, `INCOMPLETE` or `ESCALATION_REQUIRED` rather than promoted to a stronger claim.
