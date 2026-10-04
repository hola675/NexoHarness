# Terminology

The following vocabulary is canonical and platform-neutral.

| Term | Definition |
|---|---|
| Harness | The host environment that executes agent behavior and exposes capabilities. |
| Directive | Universal behavior inherited by controlled agents. |
| Core Directive | The canonical universal behavioral constitution for NexoHarness-controlled agents. |
| Adapter | A translator from canonical definitions to a harness-native representation. |
| Agent | A bounded actor with a responsibility, inputs, outputs, capabilities and constraints. |
| Core Agent | A primary agent responsible for a central phase or responsibility. |
| Specialist Agent | An agent focused on a narrow domain or capability. |
| Skill | Reusable procedural knowledge that can support one or more agents. |
| Rule | A behavioral invariant that can be validated or enforced. |
| Policy | A set of related rules governing decisions or permissions. |
| Workflow | An explicit coordination and state-transition model. |
| Contract | A structured agreement for inputs, outputs or handoffs. |
| Artifact | A traceable document, result or generated output. |
| Capability | An abstract operation an agent may request. |
| Capability Provider | A harness-native implementation that supplies a capability. |
| Tool | A concrete callable operation exposed by a provider or harness. |
| MCP | One possible mechanism for providing capabilities. |
| Plugin | A harness or runtime extension mechanism. |
| Profile | A named bundle of capabilities and constraints for a context. |
| Enforcement | Mechanisms that detect, prevent or block violations. |
| Gate | A condition that must pass before a transition or action proceeds. |
| Evaluation | A check of structure, behavior, integration or regression. |
| Eval | Short form for an evaluation used in canonical filenames and identifiers. |
| Behavioral Evaluation | An evaluation of observed agent behavior against an expectation. |
| Structural Test | A test of repository shape, metadata or static invariants. |
| Integration Test | A test of multiple components or a harness boundary together. |
| Observation | A recorded fact about an execution or outcome. |
| Signal | A structured measurement emitted during execution. |
| Task Observer | The bounded subsystem that aggregates signals and proposes reviewed improvements. |
| Observer | The runtime evidence collection and improvement-analysis role; it has no autonomous promotion authority. |
| Improvement Proposal | A candidate change derived from observations and prepared for evaluation. |
| Canonical Source | The authoritative, harness-neutral definitions from which outputs are generated. |
| Generated Artifact | An output produced from canonical source and not edited manually. |
| Distribution | A packaged set of generated artifacts for installation or use. |
| Promotion | Explicit approval and movement of a candidate into canonical behavior. |
| Regression | A previously satisfied behavior that fails after a change. |
| Provenance | Recorded origin, license, attribution and adaptation history. |
