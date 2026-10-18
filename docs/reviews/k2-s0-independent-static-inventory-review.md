# NEXOHARNESS K2-S0-R Independent Static Inventory Review

**Veredicto:** `FAIL` para aceptar K2-S0 como inventario completo y confiable de P01–P06, hasta corregir el hallazgo S0R-01.
**Candidato revisado:** `952a8e3e7be6139bb7eccd377a80e7440b343f93` (`research/k2-s0-static-inventory`).
**Baseline comparativo:** `2fb257e0b43b3b9b3852008ba06bc1737502523b`.
**Upstream fijado:** Kilo Code `v7.8.8`, `e2887f08e5a6394299c810ba508f358aaf4c5bc3`.
**Target:** Kilo Code VS Code, Windows.
**Fecha:** 2026-10-16.

## 1. Alcance, identidad e independencia

La auditoría fuente fue realizada por un agente interno de revisión con contexto aislado (`ses_ebb045c47ffeebw6wrOoo8ynSY`), que no escribió el inventario. El coordinador de esta sesión sí había participado anteriormente en la autoría de K2-S0; verificó de forma directa el hallazgo resultante y consolidó este informe. Por tanto, hubo una segunda pasada técnica sin contexto del autor, pero **no independencia humana u organizacional plena**. Este informe no sustituye la ratificación de Governance o de un revisor organizacional distinto.

La revisión fue estática y de solo lectura respecto del inventario candidato y del código upstream. No se ejecutó Kilo, pruebas K2, proveedor, modelo, MCP ni código de la extensión. No se generó evidencia `OBSERVED_LOCAL`.

## 2. Baseline y fuentes comprobados

- `HEAD` al inicio de la revisión: `952a8e3e7be6139bb7eccd377a80e7440b343f93`, rama `review/k2-s0-independent`, worktree limpio.
- El commit candidato existe localmente y su cambio respecto del padre contiene un único archivo: `research/kilo/k2-s0-static-inventory.md`.
- `git ls-remote` confirmó que `research/k2-s0-static-inventory` apunta a `952a8e3...`; `docs/k2-p0-probe-protocol` y `refs/pull/1/head` continúan en `2fb257e...`.
- GitHub API mostró PR #1 `open`, `draft: true`, `merged: false`, con head `2fb257e...`.
- El tag upstream `v7.8.8` y las referencias directas al objeto fuente corresponden a `e2887f08e5a6394299c810ba508f358aaf4c5bc3`. Las comprobaciones de código usaron ese SHA explícito.
- GitHub Actions no contiene ejecuciones para la rama `research/k2-s0-static-inventory` (`total_count: 0`). No se infiere CI passing.

Fuentes NexoHarness leídas: K1 `kilo-translation-contract.md`, K2-P0, capability matrix K0, source ledger, README de K0, informe histórico K2-P0-R, ADR 0007, governance-authority y source-of-truth. K1 §8 mantiene los requisitos P01–P06. K0 mantiene separados `findingState` y `evidenceConfidence`; Governance mantiene separados Authority, Permission, Capability y Provider. ADR 0007 conserva Windows + VS Code como superficie inicial.

## 3. Método de auditoría

Se leyó el inventario completo y se contrastaron las afirmaciones comprobables contra los blobs de Kilo fijados. La segunda pasada aislada informó una contradicción en S0-07; se verificó siguiendo tanto el descubrimiento de reglas como su integración en la carga de configuración. No se aceptaron nombres de símbolos o comentarios sin seguir el caller que los consume. Los hallazgos describen lo que el código demuestra, no el comportamiento de una extensión instalada.

## 4. Resultados por bloque S0-01–S0-07

| Bloque | Revisión | Estado para el inventario |
|---|---|---|
| **S0-01 Registro de herramientas** | La distinción entre claves internas del registro e IDs de `Tool.id`, filtros de disponibilidad, permisos compartidos por `write`/`edit`/`apply_patch`, shell ID `bash` y MCP IDs dinámicos queda acotada al commit. El inventario también declara que disponibilidad por turno requiere prueba. No se encontró otro error material en la revisión. | Aceptable como evidencia fuente; no demuestra disponibilidad en VS Code instalado. |
| **S0-02 Permisos** | Distingue acción, evaluación de patrón, composición de rulesets y resolución de permisos guardados/sesión. Atribuye `findLast` al evaluador y evita extrapolarlo a la precedencia de configuración. Los resultados reales y aprobaciones siguen pendientes. | Aceptable como descripción de fuente, con comportamiento efectivo sin validar. |
| **S0-03 Configuración** | El inventario diferencia nombres y orden de fuentes, merge, overlays de entorno, carga de agente y estado de sesión; no reduce la precedencia efectiva a una sola regla. Declara desconocida la configuración efectiva del target. | Aceptable como inventario fuente; precedencia efectiva requiere experimento. |
| **S0-04 Tool-call** | Separa prompt, tool disponible, respuesta del proveedor, permiso, ejecución y resultado; explica el backend CLI iniciado por la extensión y conserva F01 como bloqueo. | Aceptable como modelo de código; no demuestra una ruta de invocación disponible ni un efecto runtime. |
| **S0-05 Filesystem** | Limita las afirmaciones a los handlers concretos, distingue el hardening de lectura `.env`, el objeto leído, los controles externos/config y los límites de sandbox. No afirma contención universal. | Aceptable con las limitaciones indicadas; no es evidencia de aislamiento Windows. |
| **S0-06 Windows/globs** | Mantiene separados el matcher de permisos, los helpers de shell y la biblioteca glob de archivos. Los vectores se etiquetan como predicciones de función, no como resultado de Windows. | Aceptable como evidencia estática; aplicación efectiva requiere prueba. |
| **S0-07 Discovery/reload** | Contiene un error material sobre el loader de `.kilo/rules`/`.kilocode/rules`; véase S0R-01. El resto mantiene sin demostrar inclusión efectiva en prompt y reload en VS Code. | **No aceptable sin corrección factual**; la existencia del loader sí está demostrada por source. |

## 5. Matriz de cobertura P01–P06

| Probe | Evidencia estática validada | Hallazgos | Campos pendientes | Aptitud de investigación |
|---|---|---|---|---|
| **P01** | Nombres de archivos, fuentes, funciones de merge/evaluación y distinción entre ruleset y approvals. | La fuente no fija por sí sola la precedencia del estado/configuración efectiva de una extensión. | Orden efectivo por campo, agente activo, trust, UI/session overrides y reload. | Parcial; fuente útil para planificar, no un resultado de precedencia del target. |
| **P02** | IDs y mappings principales, argumentos de tools relevantes, acciones y ruta de decisión en source. | La disponibilidad por cliente/modelo y la emisión de llamadas son condiciones runtime. | Llamada real, argumento emitido, efectos, alias disponibles en esa instancia y MCP particular. | Parcial; usable para completar datos estáticos tras corrección, no para enforcement probado. |
| **P03** | API de permiso y scopes de sesión/global identificados. | La API no demuestra qué activa la interfaz de VS Code. | Exposición de UI y cambio real de aprobación. | Parcial, compatible con inspección de UI; semántica de autoaprobación sigue pendiente. |
| **P04** | Comprobaciones específicas por handler y límites explícitos de `.env`, externo y filesystem. | El error de discovery de reglas afecta P05, no altera directamente estos checks. | Symlink/junction, paths efectivos, sandbox y side effects Windows. | Parcial; ninguna garantía general de aislamiento. |
| **P05** | Config y Markdown; además, un loader explícito de reglas fue omitido y se niega en S0-07. | S0R-01 contradice el código de `RulesMigrator` y su incorporación en `loadLegacyConfigs`. | Prompt inclusion observada, trust y reload en la extensión concreta, preservación real. | **Parcial, con error factual que impide aceptar este inventario como completo para P05.** |
| **P06** | Matchers distintos y semántica estática de wildcard descritos, con vectores candidatos. | No se afirma resultado en Windows. | Entradas efectivas que reciben los handlers, path canonicalization por operación y resultados en sistema operativo. | Parcial y correctamente no presentado como observación. |

## 6. Hallazgo clasificado

### S0R-01 — Se omite y niega el loader de reglas `.kilo/rules`

- **Severidad:** `MAJOR` para la completitud de S0-07/P05.
- **Confianza:** 97/100.
- **Ubicación candidata:** `research/kilo/k2-s0-static-inventory.md:223`; la omisión también afecta la disposición P05 en la tabla de la sección 11.
- **Afirmación revisada:** “The inspected source loaders ... do not provide a verified separate `.kilo/rules/**` loader in those paths”; por ello deja el estado en `UNKNOWN`.
- **Evidencia upstream fijada:** [`rules-migrator.ts` L11-L15](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/opencode/src/kilocode/rules-migrator.ts#L11-L15) declara `.kilo/rules` y `.kilocode/rules`; [L50-L113](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/opencode/src/kilocode/rules-migrator.ts#L50-L113) implementa descubrimiento global/proyecto y reglas por modo; [L116-L149](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/opencode/src/kilocode/rules-migrator.ts#L116-L149) retorna paths en `MigrationResult.instructions`. El caller [`KilocodeConfig.loadLegacyConfigs` L388-L403](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/opencode/src/kilocode/config/config.ts#L388-L403) añade esas rutas a `result.instructions`. La ruta de configuración del proyecto invoca ese loader en [`Config.loadInstanceState` L569-L590](https://github.com/Kilo-Org/kilocode/blob/e2887f08e5a6394299c810ba508f358aaf4c5bc3/packages/opencode/src/config/config.ts#L569-L590).
- **Descripción:** el release fijado sí tiene un descubridor para `.kilo/rules/*.md`, `.kilocode/rules/*.md`, directorios globales y directorios por modo. Convierte los paths hallados a entradas `instructions`; no es por ello un motor de reglas/permiso. La evidencia estática confirma la ruta de descubrimiento e integración en el objeto de config, no que una instalación Windows + VS Code particular tenga archivos, trust adecuado o los incorpore efectivamente al prompt.
- **Consecuencia:** el inventario no puede utilizarse como evidencia completa de discovery para P05 hasta corregir el falso negativo. Un vector futuro podría omitir un source soportado por el código o clasificar incorrectamente su mecanismo como inexistente/unknown.
- **Corrección mínima recomendada:** cambiar la afirmación de S0-07 a `SUPPORTED / VERIFIED_SOURCE` para descubrimiento e integración a `instructions`; describir roots, patrón directo `.md` y mode-specific si se necesita. Mantener `NEEDS_PROBE`/`UNKNOWN` para prompt inclusion, trust y reload en el target instalado. Actualizar la fila P05 de la matriz. No cambiar K2-P0 en esta revisión.
- **Impacto:** bloquea aceptar S0 como inventario completo para P05; no demuestra ni niega behavior efectivo del runtime. No afecta F01 y no cierra F02.

No se identificaron otros hallazgos materiales en los bloques S0-01–S0-06 dentro de esta revisión. Esta ausencia de hallazgos adicionales no equivale a certificación ni a comprobación exhaustiva de todas las rutas del upstream.

## 7. Provenance y licencia

La fuente está fijada al commit que el inventario declara; el tag upstream apunta al SHA citado. El `LICENSE` del release es MIT; el documento enlaza y resume sin copiar código sustancial. No se encontró evidencia de que el inventario haya incorporado código fuente upstream de forma impropia.

## 8. F01 y F02

- **R2-F01:** permanece abierto. La descripción del recorrido fuente no aporta un provider/modelo autorizado ni un método sin credenciales que ejercite el camino real de VS Code.
- **R2-F02:** parcialmente atendido por los datos de IDs, schemas, funciones y matchers; no resuelto para resultados target/Windows. S0R-01 es una corrección estática necesaria para P05 antes de reutilizar el inventario como evidencia completa.
- Ni el resultado `PASS` de las pruebas del repositorio ni el inventario fuente equivalen a validación runtime `OBSERVED_LOCAL`.

## 9. Limitaciones y veredicto

**`FAIL`** para aceptar este SHA como inventario estático completo y confiable de P01–P06, debido a S0R-01, error directo en el bloque de discovery que contradice el loader fuente. El resto del documento es conservador respecto a la separación de fuente y comportamiento, y F01/F02 siguen siendo límites legítimos, no defectos de este inventario por sí solos.

La condición para una nueva evaluación es una revisión documental acotada que corrija S0-07/P05 y preserve la incertidumbre sobre la carga efectiva en VS Code. No se debe modificar el candidato revisado en el lugar ni transformar esta recomendación en autorización de probe.

## 10. Validación y siguiente gate

- **Código upstream ejecutado:** ninguno. No se ejecutó Kilo ni ningún probe.
- **CI del branch S0:** no hay ejecuciones registradas para `research/k2-s0-static-inventory` (`total_count: 0`).
- **PR #1:** abierta, draft, no merged; su head permanece en `2fb257e0b43b3b9b3852008ba06bc1737502523b`.
- `npm run verify:core`: pasó; typecheck y validación de repositorio correctos, 13 Kinds/13 fixtures válidos/13 inválidos, integridad canónica de 8 entidades y 162 pruebas aprobadas (0 fallidas, omitidas o canceladas).
- `git diff --check`: pasó tras retirar whitespace final del informe.

El siguiente gate es corregir sólo el hallazgo S0R-01 en un cambio documental trazable y pedir una nueva revisión estática. F01 requiere una decisión de Governance separada. Ninguna parte de este informe aprueba K2-P0, autoriza K2-P1, cambia K1, altera el protocolo o certifica Kilo.
