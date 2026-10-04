# Capabilities

Capabilities are abstract operations that agents request. They separate canonical behavior from the tools, MCPs, plugins or CLIs that provide it.

Agents should request capabilities such as:

```text
documentation.lookup
repository.search
repository.semantic-analysis
browser.test
database.query
code.edit
command.execute
version-control.inspect
```

They should not hardcode provider names such as Context7, Serena, Playwright or DBHub in canonical behavior.

## Roles

- **Capability:** the canonical request and its expected semantics.
- **Capability Provider:** a harness-native implementation that supplies it.
- **Resolver:** selects an available provider and reports degradation or failure.
- **Profile:** bundles capabilities and constraints for a context.

Example:

```text
Canonical request: browser.test
Kilo provider: Playwright MCP
Future Claude provider: could differ
```

The canonical agent must not care which provider is selected. Provider availability, permissions and evidence remain visible to the workflow.
