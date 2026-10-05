# Validation Performance

These are initial pre-alpha budgets for the current repository. They are development guardrails, not permanent universal thresholds; changing them requires measured evidence and explicit review.

| Class | Use | Target | Hard budget |
|---|---|---:|---:|
| FAST / INNER LOOP | Core tests during active development | 60 seconds | 90 seconds |
| FULL VERIFY | Typecheck, repository and schema validation, integrity, tests, and diff check | 120 seconds | 180 seconds |
| SLOW / INTEGRATION | Future integration and target-specific validation | Separately scheduled | Defined when introduced |

The mandatory main and pull request CI validation job has a five-minute timeout. CI remains the fast mandatory development gate.

## Suite placement

A slow integration or target-specific suite must not be added silently to the developer inner loop. Future suites should be separated conceptually into unit / structural, integration, target-adapter, end-to-end, and certification work. Create directories only when actual tests need them.

## Local verify command

`npm run verify` measures the existing local gate once. It reports duration, target, hard budget, and status. Exceeding the target emits a warning; only exceeding the hard budget fails for performance. A failing gate remains a failure regardless of duration.

The core test target is 60 seconds with a 90-second hard budget. Full verify has a 120-second target and 180-second hard budget.

## Evidence for future improvement

Future Task Observer observations may consume validation duration, test-suite duration, test count, failure count, retry count when available, remediation count, repeated validation, and unnecessary duplicate work. No runtime telemetry is implemented by this document.

**FASTER != BETTER.** Timing must never automatically delete a failing test, skip required verification, weaken coverage, disable a gate, reduce review, or suppress errors solely to improve timing. Optimization must preserve required evidence.

```text
OBSERVE PERFORMANCE
→ IDENTIFY BOTTLENECK
→ HYPOTHESIS
→ OPTIMIZATION CANDIDATE
→ EVAL
→ REGRESSION COMPARISON
→ REVIEW
→ PROMOTION
```
