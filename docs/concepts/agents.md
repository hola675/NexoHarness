# Agent Concept

Phase 0.0 does not define final production agents. It defines the contract an agent will need to satisfy.

An agent has:

- stable id
- responsibility
- triggers
- inputs
- output contract
- capabilities
- permissions
- constraints
- handoff behavior
- failure behavior
- verification expectations

## Planned roles

- **Primary/core agent:** owns a bounded central responsibility.
- **Specialist:** contributes focused domain expertise.
- **Reviewer:** independently checks work against requirements and evidence.
- **Remediator:** addresses diagnosed findings within bounded scope.
- **Verifier:** confirms the result and records evidence.

An agent is **not**:

- a skill
- a workflow
- a capability provider
- an MCP

Agents participate in workflows and use capabilities through an adapter-resolved provider. They must not silently expand their responsibility or bypass contracts.

## Role and authority

**Agent role != Agent authority.** Reviewer and remediator describe responsibilities, not permission levels. Authority is dimensional and separately declares whether source modification, delegation, command execution and external mutation are `none`, `scoped` or `allowed`. Skills and capability providers cannot expand those dimensions.
