# Self-Improvement Policy

Task Observer supports evidence-driven improvement without autonomous promotion of behavioral changes.

## Allowed autonomous steps

```text
OBSERVE
→ MEASURE
→ AGGREGATE
→ DETECT
→ HYPOTHESIZE
→ PROPOSE
→ GENERATE CANDIDATE
→ RUN ISOLATED EVALS
→ COMPARE
```

These steps may produce structured evidence, hypotheses, candidate patches and candidate evaluations. They must not modify canonical behavior as a side effect.

## Forbidden autonomous promotion

The following transition is forbidden:

```text
candidate → canonical source
```

The promotion gate is:

```text
evidence
→ proposal
→ evaluation
→ regression comparison
→ independent review
→ explicit approval
→ promotion
```

Repeated observations can increase confidence, but they do not create authority. One failure must not automatically rewrite global behavior. Rejected candidates and their rationale should remain traceable for future evaluation.
