# Kilo Desktop K2: installation preflight (no writes)

Status: implemented **read-only preflight**, not an installer. No Windows Kilo Desktop runtime verification or independent review.

This phase adds a deterministic integrity and safety report for an offline candidate bundle. It does not discover installed Kilo, choose install paths, write files, create backups, uninstall, rollback, grant permissions, or modify configuration.

Example on Windows PowerShell, after generating a JSON candidate from a real canonical skill:

```powershell
npm run kilo:preview -- --client desktop --version X.Y.Z --skill REAL-SKILL-ID > candidate.json
npm run kilo:preflight -- --bundle candidate.json
```

The second command reads only the explicitly named JSON file and prints a report. Every proposed file has action BLOCKED and installEligible=false. It checks manifest and file hashes, path format, duplicates, target identity, and evidence warnings. The report is not a safety certification: no runtime behavior, permissions, trust state, or filesystem destination is inspected.

## Gates before enabling a writer

1. Probe Desktop Windows installed version and exact project/global skill discovery paths in a disposable environment; record provenance and permissions.
2. Determine whether files are loaded automatically, what constitutes trusted skill content, and how approval and auto-approval modes affect command execution.
3. Design an explicit user-approved installation transaction with destination allowlist, symlink and traversal defenses, backup, conflict detection, atomic write, rollback and uninstall manifest.
4. Test the transaction against synthetic Windows fixtures, then independently review and certify each relevant target capability.
5. Keep all generated artifacts under canonical control; never hand-edit dist/.

Do not interpret a successful preflight as permission to copy files into Kilo directories.
