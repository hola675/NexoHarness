# Kilo version-flexible preview policy

Status: implemented for in-memory K1 preview only. The historical K0 baseline is Kilo VS Code v7.8.8 on Windows, not a permanent minimum, maximum, or installed-version requirement.

- The adapter accepts an explicitly selected semantic version for Windows + VS Code; absent selection defaults to the historical research baseline for reproducibility, not compatibility.
- Preview candidates include the selected version as provenance. A different version has no inherited K0 source commit and receives VERSION_EVIDENCE_REQUIRED.
- Neither a matching baseline nor an arbitrary selected version proves runtime behavior. Both remain deploymentEligible=false.
- No version discovery, auto-upgrade, range compatibility, release installation, permission mapping, or certification is implied.
- Version-specific evidence must be collected independently for behavior, tool permissions, file loading, and extension configuration. Certification may later be defined per verified version/capability matrix without changing canonical entities.
- ADR 0007 continues to govern Windows + VS Code and target priority. This policy clarifies the version pin for preview and does not revise historical evidence.

Future: separate exact target identification, compatibility claims, evidence and installation gates before enabling generated files. Do not rewrite K0 historical observations.
