# R2-C — Governance, Contracts & Approval Semantics Diagnostic

## A. Alcance y evidencia

- **Baseline:** `257127ee9843e0a6f8c23a2c659860cc12cc71a1`; rama `main`, igual a `origin/main`, árbol limpio antes de iniciar.
- **Autorización:** R2 solo para investigar y documentar. R1 tiene cierre arquitectónico interno aprobado, sin tag. R2-A y R2-B son diagnósticos terminados. No hay autorización R3 ni de implementación.
- **Exclusiones:** no se modifican schemas, Policies, Directives, ADRs, código, pruebas ni roadmap; no se crean entidades, enums, estados, almacenamiento ni runtime. Este archivo es el único cambio autorizado.
- **Fuentes revisadas:** Directives `core-directive.md`, `execution-protocol.md`; Policies `precedence.md`, `delegation.md`, `scope-control.md`, `completion.md`, `evidence.md`, `self-improvement.md`; los seis schemas especificados; conceptos de Agents, Contracts, Workflows y Evaluations; modelos de Governance/Authority, Workforce, Work Lifecycle, Operations/Orchestration, Assurance/Certification, Learning/Evolution, Evaluation Quality y Canonical Information; validadores `references.ts` y `canonical-integrity.ts`; `tests/integrity.test.ts`, fixtures de schemas; registros de revisión R1, R2-A y R2-B. Las fuentes conceptuales se usan como evidencia de intención, nunca como prueba de comportamiento implementado.
- **Método y límites:** se leyeron las fuentes locales y se contrastaron reglas, schema y validador. La cobertura del índice MCP informó `metadata_changed` para las rutas solicitadas; por ello las afirmaciones siguientes se basan en lectura directa del árbol local, no en una suposición de completitud del grafo.

### Matriz de responsabilidades

| Concepto | Dueño de responsabilidad | Autoridad | Contrato actual | Estado de implementación |
| --- | --- | --- | --- | --- |
| Governance | Función que gobierna decisiones, excepciones y transiciones protegidas ([governance-authority.md](../model/governance-authority.md#L107-L156)). | Fuente de decisiones explícitas y acotadas; cuando falta autoridad se bloquea, escala o solicita aprobación. No hay actor concreto universal. | No existe contrato/schema de decisión ni registro de aprobación. | Límites conceptuales documentados; máquina de decisión y almacenamiento no implementados. |
| Assignment | Representa una unidad acotada de trabajo y sus criterios ([work-lifecycle.md](../model/work-lifecycle.md#L110-L122)). | La autoridad se determina por Governance, alcance e instrucciones aplicables; Assignment/responsabilidad no concede por sí sola permisos. | No hay schema de Assignment; sus campos son conceptuales. | Modelo conceptual; sin entidad runtime NexoHarness validada. |
| Agent | Ejecuta una responsabilidad declarada ([agents.md](../concepts/agents.md#L7-L21)). | Campo dimensional del schema: sourceModification, delegation, commandExecution, externalMutation. No es permiso de runtime. | Agent requiere responsabilidad, autoridad, triggers, capabilities y constraints; handoff es opcional texto libre. Inputs/output Contract no son campos ([agent.schema.json](../../core/schemas/agent.schema.json#L12-L34)). | Validación schema canónica presente; no hay Agent de producción en `agents/` y no hay runtime de ejecución aquí. |
| Contract Definition | Define forma y restricciones del artefacto ([contracts.md](../concepts/contracts.md#L16-L45)). | No asigna autoridad ni determina routing. | `purpose`, `artifactType`, `requiredEnvelopeFields`, `payload` son requeridos; `payload.requiredFields` y `allowedStatuses` son opcionales ([contract.schema.json](../../core/schemas/contract.schema.json#L12-L28)). | Schema y validación de definiciones implementados. Listas requeridas pueden estar vacías; el payload puede omitir ambas listas. |
| Contract Instance | Productor entrega una instancia; consumidor la recibe dentro del handoff. Workflow determina el siguiente paso ([contracts.md](../concepts/contracts.md#L39-L45)). | Ninguna autoridad de aprobación implícita en un estado de handoff. | No existe schema ni validador de instancias. | Solo concepto; serialización, validación y almacenamiento no implementados. |
| Workflow | Coordina pasos, transiciones y routing; no crea autoridad ([workflows.md](../concepts/workflows.md)). | Su autoridad queda limitada por Policies, Assignment e instrucciones superiores. | Schema requiere `entryStep` y `steps`; pasos tienen `id` y `action`, con `next`/`agent` opcionales ([workflow.schema.json](../../core/schemas/workflow.schema.json#L12-L47)). | Definiciones se validan; no se ejecuta una máquina de workflow ni se comprueba semánticamente el routing aquí. |
| Reviewer | Responsabilidad de revisión independiente y evidencia; no es aprobación ([agents.md](../concepts/agents.md#L23-L31), [assurance-certification.md](../model/assurance-certification.md#L65-L83)). | No obtiene autoridad de decisión por el título/rol. | Sin entidad o contrato de review en el schema de Agent; reportes aparecen como contratos planificados. | Separación normativa documentada; no hay registro/runtime de Review gobernada. |
| Approver | La autoridad de Governance toma o concede la decisión requerida; aprobación V1 se orienta a humana ([governance-authority.md](../model/governance-authority.md#L124-L148), [learning-evolution.md](../model/learning-evolution.md#L129-L137)). | Explícita, acotada y trazable; la identidad/competencia exacta del actor queda sin diseñar. | `requiresExplicitApproval: true` es una obligación constante; no prueba una decisión ([improvement-proposal.schema.json](../../core/schemas/improvement-proposal.schema.json#L12-L23)). | Sin actor, registro, UI, validator ni flujo de aprobación implementados. |
| Promotion | Responsable de ejecutar una transición canónica ya aprobada, dentro de la autoridad correspondiente. | Requiere Governance y aprobación explícita cuando aplica; es distinta de release ([governance-authority.md](../model/governance-authority.md#L198-L202)). | No es Kind ni estado de `ImprovementProposal`; phase-close certifica fase y no implementa promotion de propuestas. | No hay motor general de promoción de candidatos; publicación/release tiene controles separados. |

### Matriz de transiciones gobernadas

| Transición | Condición/documento | Evidencia y bloqueo | Estado técnico observado |
| --- | --- | --- | --- |
| Request → Assignment | Intake/Classify produce representación acotada; el Assignment es conceptual ([work-lifecycle.md](../model/work-lifecycle.md#L86-L116)). | Objetivo, alcance, restricciones, criterios de aceptación y autoridad suficiente; incertidumbre debe permanecer visible. | No hay schema/instancia de Assignment. |
| Agent produce → Contract Instance | Contract Definition fija forma; productor y consumidor completan/usan la instancia. | Campos de handoff y resultado esperados por la definición; handoff correcto no está respaldado por validador de instancias. | Solo se valida el schema de definición. |
| Contract Instance → siguiente paso | Workflow posee routing/transiciones; Contract no los decide ([contracts.md](../concepts/contracts.md#L39-L45)). | Estado READY indica handoff preparado; no completion PASS ni aprobación. | Definiciones Workflow validadas, sin ejecución. |
| Delegator → delegated work | Delegation Policy exige objetivo, alcance, contexto, output y condición de completion ([delegation.md](../../core/policies/delegation.md#L17-L42)). | `child authority <= delegated authority <= parent/Assignment authority`; falta de autoridad bloquea/escala ([governance-authority.md](../model/governance-authority.md#L113-L122), [#L213-L219](../model/governance-authority.md#L213-L219)). | Reglas instruccionales; no existe motor/contrato de asignación que las haga cumplir automáticamente. |
| Evidence → Proposal | Learning/Evolution describe evidencia, diagnóstico e hipótesis; propuesta pide cambio ([learning-evolution.md](../model/learning-evolution.md#L19-L39), [#L87-L99](../model/learning-evolution.md#L87-L99)). | La propuesta debe poder rastrearse a soporte; referencias resolubles y suficiencia de evidencia no equivalen a aprobación. | Schema de propuesta valida estructura; no hay producer/store/resolver de runtime. |
| Proposal → Candidate → Evaluation/comparison | Candidate es aislado; evaluación compara contra baseline cuando procede ([learning-evolution.md](../model/learning-evolution.md#L101-L127)). | Criterios adecuados y evidencia fresca; fallo/invalidación no se convierte en PASS. | Evaluation Definition schema existe; no hay evaluación/propuesta/candidate runtime general. |
| Evaluation → Independent Review | Assurance separa evaluación y review; revisión independiente aplica según riesgo/Governance ([assurance-certification.md](../model/assurance-certification.md#L65-L95)). | Revisor distinto del implementador cuando se requiere independencia. Review favorable es evidencia/recomendación, no decisión. | Sin registro de Review conectado a una propuesta. |
| Review → Explicit Approval | Governance exige decisión explícita, acotada y trazable cuando procede ([governance-authority.md](../model/governance-authority.md#L124-L148)). | Actor con autoridad, alcance y evidencia; falta de autoridad implica bloquear/escalar. | No hay representación de aprobación en el schema/validator; humano es dirección V1, actor aún no especificado. |
| Approval → Promotion | La aprobación autoriza una transición; promotion ejecuta cambio canónico ([governance-authority.md](../model/governance-authority.md#L128-L145), [learning-evolution.md](../model/learning-evolution.md#L129-L137)). | Promover solo el candidate/scope aprobados, preservando historia; release continúa siendo otra frontera. | Sin motor genérico de promotion o decision record. |

## B. Hallazgos

### R2C-01 — Taxonomía de tamaño frente a autoridad de aprobación

- **Fuentes:** [learning-evolution.md](../model/learning-evolution.md#L193-L202); [governance-authority.md](../model/governance-authority.md#L140-L148); [assurance-certification.md](../model/assurance-certification.md#L186-L188).
- **Hechos comprobados:** `LOCAL | BOUNDED | STRUCTURAL | CONSTITUTIONAL` se declara tamaño de cambio conceptual, sin enum técnico. Las fuentes dicen expresamente que tamaño no es autoridad de aprobación, no fijan correlación ni taxonomía de aprobaciones; no se aceptan A0–A3.
- **Inferencia:** el tamaño puede ayudar a caracterizar impacto/riesgo, pero de estos documentos no se deriva qué actor ni nivel de review requiere una categoría.
- **Riesgo/severidad:** medio, ambigüedad futura de gobernanza; no bloquea el diagnóstico ni evidencia una concesión indebida actual.
- **Consecuencia V1:** decisiones protegidas siguen requiriendo autoridad y aprobación explícita; no se puede automatizar el mapeo por tamaño.
- **Disposición propuesta:** `KEEP` para vocabulario como dimensión conceptual separada; decisión pendiente sobre si definir un criterio de aprobación independiente o vincularlo a tipos de cambio protegidos.
- **Alternativas (hipótesis):** reglas por tipo de cambio protegido; criterio contextual por impacto/riesgo; mantener decisión explícita sin taxonomía. Ninguna queda seleccionada.
- **Fase propuesta:** decisión de Governance antes de implementar approval automático (R3 o posterior, con autorización).

### R2C-02 — Inputs/output Contract de Agent

- **Fuentes:** [agents.md](../concepts/agents.md#L7-L21); [agent.schema.json](../../core/schemas/agent.schema.json#L12-L34); [workforce.md](../model/workforce.md#L58-L80); [operations-orchestration.md](../model/operations-orchestration.md#L50-L78).
- **Hechos comprobados:** concepto menciona `inputs` y output Contract, pero los marca como expectativas conceptuales. El schema no tiene esos campos; `handoff` opcional es un string no vacío. Workflow puede referir Agent; Assignment y Work Unit asignan responsabilidad de forma conceptual, pero no tienen schema aquí.
- **Inferencia:** `handoff` orienta conducta/handoff, pero no puede tipar ni validar el contenido de input/output. La relación podría corresponder a Workflow/Assignment, aunque aún no existe un modelo técnico elegido.
- **Riesgo/severidad:** medio, una definición de Agent no expresa por sí sola un handoff verificable.
- **Consecuencia V1:** no afirmar que los Contracts esperados están vinculados automáticamente a Agents; handoffs tipados requieren decisión de dueño/relación primero.
- **Disposición propuesta:** `REFINE` la expectativa conceptual solo tras decidir propietario y consumidor; no se recomienda añadir campos al Agent anticipadamente.
- **Alternativas (hipótesis):** relación en Workflow/Assignment; campos en Agent si son invariantes de rol; conservar descripción libre para V1 mínima. Sin decisión definitiva.
- **Fase propuesta:** decisión de modelo antes de cualquier cambio schema de R3.

### R2C-03 — Contract Definition frente a validación de Contract Instance

- **Fuentes:** [contracts.md](../concepts/contracts.md#L16-L45); [contract.schema.json](../../core/schemas/contract.schema.json#L12-L28); [canonical-integrity.ts](../../tools/validate/canonical-integrity.ts#L100-L121), [#L146-L200](../../tools/validate/canonical-integrity.ts#L146-L200); [references.ts](../../tools/validate/references.ts#L24-L41).
- **Hechos comprobados:** `Contract` es definición canónica. Schema requiere propósito/tipo/lista de envelope/payload; `requiredFields` y `allowedStatuses` son opcionales, y todas las listas refieren a `$defs/stringList` o `completionStatusList` que no tienen `minItems`. La definición puede por tanto declarar listas vacías o no declarar restricciones de payload. El validator descubre entidades canónicas, valida schema, unicidad y referencias declaradas; no define parser/validator de Contract Instances. `canonical-integrity` comprueba referencias de entidades del índice canónico, no valores runtime.
- **Inferencia:** que una lista esté vacía es schema-válido, pero su utilidad depende del handoff y consumidores esperados; no es defecto universal. No hay evidencia de instancia runtime que incumpla un contrato.
- **Riesgo/severidad:** medio, contrato formal no garantiza por sí solo un handoff útil o válido.
- **Consecuencia V1:** solo pueden reclamarse definiciones estructuralmente válidas; no afirmar validación de instancia, transición correcta ni routing.
- **Disposición propuesta:** `NO CHANGE` durante este diagnóstico; antes de implementar, decidir qué validador consume definiciones y qué evidencia prueba handoff correcto.
- **Alternativas:** validación de campos en productor, validador de instancia separado o gate de workflow que consuma schema/criterios. No se selecciona modelo.
- **Fase propuesta:** diseño de contrato runtime después de R2-D y autorización de implementación.

### R2C-04 — Derechos de decisión y trazabilidad de Governance

- **Fuentes:** [governance-authority.md](../model/governance-authority.md#L107-L148), [#L213-L227](../model/governance-authority.md#L213-L227); [precedence.md](../../core/policies/precedence.md#L19-L52); [completion.md](../../core/policies/completion.md#L19-L35); [evidence.md](../../core/policies/evidence.md#L17-L38).
- **Hechos comprobados:** se diferencia responsabilidad, autoridad, capability y permiso runtime; review/verificación/evaluación no son aprobación. Se exige rastrear decisiones relevantes a decisión, alcance, fuente de autoridad, evidencia y aprobación donde aplique. Sin autoridad: bloquear, escalar o pedir aprobación. Las fuentes describen categorías funcionales (solicitar, ejecutar, verificar, revisar, aprobar, promover), pero no establecen identidad/rol universal para el aprobador ni almacenamiento. Policies citadas tienen `metadata.status: draft`; su existencia describe reglas, pero no prueba enforcement runtime.
- **Inferencia:** el modelo es coherente en límites, pero una implementación futura necesitará poder resolver quién tiene autoridad y conservar evidencia de decisión para cada transición protegida.
- **Riesgo/severidad:** medio, trazabilidad y actor aprobador permanecen no ejecutables; no se observó contradicción normativa que impida continuar R2.
- **Consecuencia V1:** aprobación humana es dirección conceptual; no hay base para atribuir autoridad automáticamente a Role, Agent, proveedor o permiso de entorno.
- **Disposición propuesta:** `KEEP` las distinciones y `REFINE` identidad/registro solo con decisión aprobada.
- **Alternativas:** registro externo de aprobación vinculada a revisión; evento de gobernanza mantenido fuera de schema canónico; mantener proceso manual documentado. Hipótesis, no diseño aceptado.
- **Fase propuesta:** decisión de Gobernanza antes de contratos runtime o automatización.

### R2C-05 — Review, Approval y Promotion

- **Fuentes:** [assurance-certification.md](../model/assurance-certification.md#L65-L123); [learning-evolution.md](../model/learning-evolution.md#L129-L137), [#L219-L226](../model/learning-evolution.md#L219-L226); [self-improvement.md](../../core/policies/self-improvement.md#L17-L57); [improvement-proposal.schema.json](../../core/schemas/improvement-proposal.schema.json#L12-L23).
- **Hechos comprobados:** el ciclo conceptual separa evidencia, proposal/candidate, evaluación/comparación, review independiente, aprobación explícita y promotion. Evaluación/review no autorizan; aprobación permite transición, promotion la ejecuta; canonical promotion no es release. Proposal schema no tiene estado de aprobación/promoción; `requiresExplicitApproval` siempre es `true`.
- **Inferencia:** el vocabulario es consistente, mientras la trazabilidad técnica de las transiciones no existe. El nombre constante evita ambigüedad sobre que la aprobación es requerida, pero no modela resultado ni actor.
- **Riesgo/severidad:** alto para cualquier automatización futura que infiera decisión a partir de PASS/review o de metadata status; riesgo actual mitigado por ausencia de runtime de propuestas/promotion.
- **Consecuencia V1:** una revisión favorable no permite merge/promotion protegida por sí sola; se necesita autorización explícita y luego acción separada autorizada.
- **Disposición propuesta:** `KEEP` las fronteras; decidir registro/transición antes de automatizar.
- **Alternativas:** decisión manual con evidencia externa; futura representación de decisión independiente del Proposal; workflow que consuma evidencia explícita. Sin state machine diseñado.
- **Fase propuesta:** gobernanza y diseño de implementación tras R2; R2-C no autoriza implementarlo.

### R2C-06 — Alcance de delegación y límites de autoridad

- **Fuentes:** [delegation.md](../../core/policies/delegation.md#L17-L42); [governance-authority.md](../model/governance-authority.md#L113-L122), [#L213-L219](../model/governance-authority.md#L213-L219); [operations-orchestration.md](../model/operations-orchestration.md#L72-L80); [workforce.md](../model/workforce.md#L58-L72).
- **Hechos comprobados:** delegación requiere objetivo, alcance acotado, contexto, output y condición de completion; retiene accountability del padre. El modelo expresa `child <= delegated <= parent/Assignment authority`. Role expresa responsabilidad organizacional, Agent identidad técnica, Assignment responsabilidad temporal, Contract forma de datos y Permission la posibilidad efectiva en entorno.
- **Inferencia:** delegar exitosamente trabajo no da autorización implícita para cambiar fuente canónica; la autoridad específica para la acción sigue requiriendo grant aplicable y permiso runtime.
- **Riesgo/severidad:** bajo en la semántica documentada; enforcement automático de estos límites no está demostrado.
- **Consecuencia V1:** las asignaciones delegadas deben quedar acotadas y reportadas al padre; no inferir permisos por Role/Capability/Agent.
- **Disposición propuesta:** `KEEP`; diferir validación automática de autoridad.
- **Alternativas:** contrato de delegación runtime o comprobación por workflow son opciones futuras, no aprobadas.
- **Fase propuesta:** decisiones de runtime/Identity en R2-D y eventual R3 autorizado.

### R2C-07 — Completion frente a estado READY de handoff

- **Fuentes:** [contracts.md](../concepts/contracts.md#L28-L45); [completion.md](../../core/policies/completion.md#L19-L35); [work-lifecycle.md](../model/work-lifecycle.md#L118-L130); [assurance-certification.md](../model/assurance-certification.md#L170-L184).
- **Hechos comprobados:** resolución R1-G distingue Intake READY conceptual, Contract Instance READY preterminal y completion terminal del Assignment (`PASS | FAIL | BLOCKED | INCOMPLETE | ESCALATION_REQUIRED`). La definición Contract puede limitar `allowedStatuses`; la policy requiere evidencia para PASS. Handoff no implica aprobación.
- **Inferencia:** no hay contradicción nueva en las fuentes consultadas; la ambigüedad solo reaparecería si un consumidor conflara ámbitos de estado.
- **Riesgo/severidad:** bajo, históricamente resuelto y sin nueva evidencia contradictoria.
- **Consecuencia V1:** conservar los tres ámbitos y no tratar READY como completion PASS ni gate de promotion.
- **Disposición propuesta:** `KEEP` resolución R1-G; no reabrirla.
- **Alternativas:** no aplica sin evidencia nueva.
- **Fase propuesta:** no requiere resolución en R2-C.

### R2C-08 — ImprovementProposal con lista vacía de evidencia

- **Fuentes:** [improvement-proposal.schema.json](../../core/schemas/improvement-proposal.schema.json#L12-L23); [common.schema.json](../../core/schemas/common.schema.json#L92-L121); [learning-evolution.md](../model/learning-evolution.md#L87-L99), [#L129-L137](../model/learning-evolution.md#L129-L137); [references.ts](../../tools/validate/references.ts#L24-L41); [R2-B](r2-b-observation-proposal-lifecycle-diagnostic.md#L83-L91), [#L160-L162](r2-b-observation-proposal-lifecycle-diagnostic.md#L160-L162).
- **Hechos comprobados:** `observationRefs` es requerido como propiedad, pero `$defs/refList` ([common.schema.json](../../core/schemas/common.schema.json#L81-L90)) no tiene `minItems`, por lo que `[]` pasa validación estructural. El modelo dice que toda propuesta apunta a evidencia de soporte y que no debe haber propuestas huérfanas. Puede haber fuentes de evidencia aparte de Observations a nivel conceptual; el schema no tiene otro campo de evidencia explícito. No existe runtime producer/store o resolver que demuestre casos reales de propuesta sin Observation. El validador actual declara regla de tipo Observation para cada valor presente, pero no resuelve referencias runtime.
- **Inferencia:** la regla conceptual exige soporte rastreable, pero no prueba necesariamente que cada propuesta requiera una Observation en particular si existe otra evidencia legítima; la suficiencia, resolución y frescura del soporte son distintas verificaciones. La vaciedad es una brecha futura confirmada, no una violación en producción.
- **Riesgo/severidad:** medio/alto antes de habilitar propuestas o promotion runtime; actualmente gap de contrato diferido, no incidente observado.
- **Consecuencia V1:** no permitir que `SCHEMA VALID` equivalga a semánticamente completa, evidencia verificada o aprobada. Previo a promotion futura se necesitaría evidencia identificable, relevante, accesible y evaluada para el alcance aprobado; esta es una condición diagnóstica mínima, no contrato nuevo.
- **Disposición propuesta:** `REFINE` obligación/fuente de evidencia en una decisión futura, preservando R2B-05 y sin cambiar schema ahora.
- **Alternativas:** exigir una o más Observations; permitir otras fuentes tipadas; o poner suficiencia de evidencia en un gate de evaluación/promotion. No se decide cuál.
- **Fase propuesta:** resolver antes del primer producer o gate de promoción de propuestas, después de decidir identidad/referencias en R2-D y con autorización de R3.

## C. Síntesis

### CONFIRMED

- La separación entre responsabilidad, autoridad, permission runtime, capability, review, evaluation, approval y promotion está expresamente documentada.
- Contract es definición canónica; Contract Instance es runtime; Workflow coordina transiciones y Agent asume responsabilidad.
- Los schemas/validadores actuales validan entidades y referencias canónicas declaradas, no Contract Instances, Assignment, Review, Approval ni Promotion runtime.
- `READY` de handoff es preterminal; no equivale a completion PASS. Proposal `requiresExplicitApproval: true` declara obligación, no resultado.
- `observationRefs: []` es schema-válido pese a la obligación conceptual de soporte trazable; no se observó instancia runtime que la incumpla.

### INFERRED

- Los vacíos de representación podrían permitir un futuro runtime incompleto si productor/gate asume que schema PASS prueba suficiencia, identidad de decisión o autorización.
- Hacer ejecutables los límites probablemente requiere vínculos/evidencia trazable entre Assignment, actor, contrato, revisión, decisión y candidato, pero esta auditoría no prescribe entidades ni campos.

### CONSISTENT

- El principio rector —Contracts estructuran datos, Agents asumen responsabilidades, Workflows coordinan y Governance autoriza— concuerda con Policies, schemas y modelos revisados.
- No se encontró contradicción normativa material que impida completar el diagnóstico.

### AMBIGUOUS

- Quién es el actor autorizado para aprobar en cada clase de cambio, cómo se vincula su autoridad al cambio, y dónde queda el decision record.
- Si Contracts de handoff tienen listas mínimas obligatorias dependientes del tipo de artifact y quién valida la instancia.
- Si el agente debe declarar contratos propios o recibir relaciones por Workflow/Assignment.
- Qué significa una Proposal sustentada por evidencia distinta de Observation y qué gate establece suficiencia/resolución/frescura.

### IMPLEMENTATION DEFERRED

- Runtime de Assignment, Contract Instance, Review, Approval, Candidate y Promotion; validación de instancia y resolución runtime de referencias. La distinción `metadata.status` vs decisión de Proposal, ya señalada por R2-B, permanece abierta y no se renombra ni resuelve aquí.

### DECISION REQUIRED

- Mantener tamaño de cambio separado de los requisitos de autoridad/review/evidencia; decidir si se necesita una política independiente para mapearlos.
- Propietario de referencias Agent ↔ Contract y validador de handoffs.
- Identidad/autoridad del aprobador y forma del registro de decisión antes de implementar promoción.
- Evidencia admitida y criterio mínimo de suficiencia previo a una futura promoción.

## D. No-go decisions

Antes de implementar contratos runtime, aprobación o promoción automática, se necesitan decisiones explícitas sobre: (1) qué cambios quedan protegidos y qué autoridad puede aprobarlos; (2) si review independiente es obligatoria y evidencia requerida por clase/riesgo; (3) identidad, alcance, vigencia y trazabilidad de aprobaciones; (4) quién produce/consume instancias y quién valida campos/estados/referencias; (5) cómo se relacionan Agent, Assignment y Contracts; (6) significado y ubicación de estados de Proposal sin sobrecargar `metadata.status`; (7) fuentes, resolución, frescura y suficiencia de evidencia, incluida R2B-05; (8) qué significa promotion respecto de merge/publicación y cómo preservar historia. Ninguna decisión se toma en este registro.

## E. Disposición y límites

- **Hallazgos bloqueantes:** ninguno para completar R2-C. Hay decisiones necesarias antes de implementar runtime o automatizar decisiones; no son blockers de esta auditoría.
- **Propuestas de disposición:** R2C-01 `KEEP`; R2C-02 `REFINE` tras decisión; R2C-03 `NO CHANGE` por ahora; R2C-04 `KEEP`/`REFINE`; R2C-05 `KEEP`; R2C-06 `KEEP`; R2C-07 `KEEP`; R2C-08 `REFINE` en fase futura. Son recomendaciones diagnósticas, no cambios aprobados.
- **Técnica/roadmap:** ningún schema, Policy, ADR, validator, test, adapter, runtime, artifact productivo o roadmap fue cambiado. No se elimina ni oculta el gap R2B-05.
- **Validación fresca:** `npm run typecheck` PASS; `npm run validate` PASS (repository, 13 schemas con 13 fixtures válidos y 13 inválidos, canonical integrity de 8 entidades); `npm test` PASS (162/162, 0 fallos); `git diff --check` PASS; `npm run verify:core` PASS (typecheck, validación, 162/162 tests y `git diff --check`). La suite también confirmó que los enlaces Markdown resuelven.
- **Límites/exclusiones:** `git status` mostró solamente este registro nuevo antes de commit; no cambió ningún archivo protegido, roadmap ni artifact productivo. La verificación de schemas y policies de aceptación es de integridad del árbol/versionado y validación ejecutable, no un mecanismo adicional de comparación de permisos.

**R2-C verdict:** diagnóstico completado sin contradicción normativa material. Los hallazgos y decisiones pendientes no conceden permiso para implementarlos; cualquier R3 requerirá autorización separada.
