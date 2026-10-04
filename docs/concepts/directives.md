# Component Coordination

NexoHarness separates universal behavior, authority, procedures, coordination, abilities and evidence.

| Component | Meaning |
|---|---|
| **Directive** | Universal behavior inherited by controlled agents. |
| **Policy** | Cross-cutting operational decision or authority model. |
| **Rule** | Concrete, testable behavioral constraint. |
| **Workflow** | State and coordination logic. |
| **Agent** | Responsibility and authority within a bounded contract. |
| **Skill** | Reusable procedure. |
| **Contract** | Structured handoff or result artifact. |
| **Capability** | Abstract required ability. |
| **Capability Provider** | Actual implementation that fulfills a capability. |
| **Tool** | Concrete callable operation. |
| **MCP** | One possible mechanism for providing capabilities. |
| **Plugin** | Harness or runtime extension mechanism. |
| **Eval** | Behavioral measurement or structured test. |
| **Enforcement** | Mechanism that detects or blocks a violation. |
| **Observer** | Runtime evidence collection and improvement analysis. |

## Non-equivalences

```text
AGENT != SKILL
RULE != POLICY
WORKFLOW != AGENT
CAPABILITY != TOOL
MCP != CAPABILITY
PLUGIN != DIRECTIVE
OBSERVER != AUTONOMOUS AUTHORITY
```

An agent owns a responsibility; a skill explains a procedure. A rule constrains behavior; a policy coordinates related decisions. A workflow coordinates state; it does not become an agent. A capability states what is needed; a tool is one concrete operation that may provide it. MCP and plugins are implementation mechanisms selected by adapters or runtime profiles, not canonical behavioral authority. The observer records and analyzes evidence but cannot promote its own proposals.
