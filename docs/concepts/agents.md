# Agent Concept

> **Boundary note:** this document remains the TECHNICAL_NORMATIVE source for the `Agent` Kind. [`docs/model/workforce.md`](../model/workforce.md) owns the organizational Workforce (Divisions, Roles, Competencies, Work Units) and the Agent creation gate. An organizational Role is not an Agent: a Role may be represented by an Agent only when an executable identity adds value.

Phase 0.0 does not define final production agents. It defines the contract an agent will need to satisfy. `agents/` currently contains no production Agent.

An agent has:

- stable id
- responsibility
- triggers
- inputs *(conceptual contract expectation; not a field in `core/schemas/agent.schema.json`)*
- output contract *(conceptual contract expectation; the schema carries only an optional free-text `handoff`)*
- capabilities *(Capability references — needs and relationships, not grants)*
- authority *(dimensional: `sourceModification`, `delegation`, `commandExecution`, `externalMutation`; this is canonical authority, not runtime permission)*
- constraints
- handoff behavior
- failure behavior
- verification expectations

Authority is the canonical field; runtime Permission — what an environment actually allows — remains separate and is never carried by an Agent definition.

## Execution responsibility archetypes

The following are execution responsibility archetypes — ways an actor participates in an Assignment. They are not the organizational Workforce, not permanent Workforce Roles, and not required Agent entities (see [`docs/model/workforce.md`](../model/workforce.md)):

- **Primary/core:** holds the primary responsibility for a bounded Assignment or central execution responsibility.
- **Specialist:** contributes focused expertise to an Assignment; a temporary responsibility or a property of a specialized Role.
- **Reviewer:** independently checks work against requirements and evidence; a review responsibility, not approval authority.
- **Remediator:** addresses diagnosed findings within bounded scope; a temporary responsibility.
- **Verifier:** confirms the result and records evidence; verification is not review.

An agent is **not**:

- a skill
- a workflow
- a capability provider
- an MCP

Agents participate in workflows and use capabilities through an adapter-resolved provider. They must not silently expand their responsibility or bypass contracts.

## Role and authority

**Agent role != Agent authority.** Reviewer and remediator describe responsibilities, not permission levels. Authority is dimensional and separately declares whether source modification, delegation, command execution and external mutation are `none`, `scoped` or `allowed`. Skills and capability providers cannot expand those dimensions.
