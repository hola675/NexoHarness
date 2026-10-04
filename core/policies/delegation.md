# Delegation Policy

Delegation transfers a bounded piece of work while preserving parent accountability.

## Required delegation fields

A delegation must specify at least:

- objective
- bounded scope
- relevant context or context artifact
- expected output
- completion condition

## Invariants

- Do not self-delegate.
- Prevent unbounded recursion.
- Avoid duplicate parallel implementation of the same change.
- Use specialists only when a trigger or task need justifies them.
- Delegating does not remove parent accountability for integration and reporting.
- Give the delegated agent the minimum useful context.
- Do not pass the entire conversation history by default.
- A failed or incomplete delegation must be visible to the parent workflow.

Exact harness task syntax is adapter-specific and does not belong in this canonical policy.
