# Evaluations

> **Boundary note:** this document remains the TECHNICAL_NORMATIVE source for the Evaluation Kind and its methods/schema. [`docs/model/assurance-certification.md`](../model/assurance-certification.md) provides the organizational Assurance framing (Verification, Review, Certification) around it, including the Evaluation-Definition-versus-Run distinction; it does not alter the methods or schema defined here.

NexoHarness uses multiple forms of evidence:

- **Structural tests** check repository shape, metadata and static invariants.
- **Behavioral evals** check observed behavior against a requirement.
- **Adapter tests** check canonical-to-harness translation.
- **Integration tests** check components and harness boundaries together.
- **Regression tests** preserve behavior that was previously certified.

Every important behavioral rule should eventually have at least one eval. A rule without evidence of behavior is not considered fully certified. Evaluation results should be traceable to the version of the canonical source, adapter and profile under test.
