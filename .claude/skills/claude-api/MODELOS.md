# Modelos: qué IDs existen y cuál elegir

Verificado el **2026-09-11** contra `platform.claude.com/docs` y contra la unión
`Model` que exporta `@anthropic-ai/sdk@0.125.0`. Los precios y las fechas de retirada
cambian: si la decisión depende de un precio exacto, confírmalo antes de escribirlo en
un presupuesto.

## Regla primera: no inventes un model ID

Un ID inventado no falla en tiempo de compilación —el tipo `Model` termina en
`(string & {})`, así que TypeScript acepta cualquier string— y revienta en runtime con
un `404 not_found_error`. Antes de escribir un ID que no esté en esta tabla:

```ts
const { data } = await client.models.list({ limit: 100 });
```

O mira la unión real instalada, que es la fuente de verdad más cercana al cliente:

```bash
grep -o "export type Model = [^;]*" node_modules/@anthropic-ai/sdk/resources/messages/messages.d.mts
```

## Los dos que te interesan

| | **Haiku 4.5** | **Sonnet 5** |
|---|---|---|
| ID | `claude-haiku-4-5-20251001` | `claude-sonnet-5` |
| Alias | `claude-haiku-4-5` | — (no tiene) |
| Release | 15-oct-2025 | 30-jun-2026 |
| Retirada | no antes de oct-2026 | no antes de jun-2027 |
| Contexto | 200K | 1M |
| Salida máx. | 64K | 128K (300K en Batch con beta header) |
| Thinking | extended manual (`enabled` + `budget_tokens`) | adaptive, activo por defecto |
| `output_config.effort` | no soportado | sí (por defecto `high`) |
| Vision / tools / citations | sí / sí / sí | sí / sí / sí |
| Input | $1 / MTok | $2 / MTok |
| Output | $5 / MTok | $10 / MTok |
| Cache write 5m / 1h | $1.25 / $2 | $2.50 / $4 |
| Cache read | $0.10 | $0.20 |
| Knowledge cutoff | feb-2025 | ene-2026 |

Sonnet 5 cuesta **el doble por input y el doble por output** que Haiku 4.5. No es «diez
veces más caro»: la diferencia real entre los dos es pequeña comparada con la que hay
hasta Opus o Fable, y eso cambia el cálculo de cuándo merece la pena bajar a Haiku.

## Los otros, como referencia de precio

| Modelo | ID | Input | Output | Contexto |
|---|---|---|---|---|
| Opus 5 | `claude-opus-5` | $5 | $25 | 1M |
| Fable 5.1 | `claude-fable-5-1` | $10 | $50 | 1M |

Fable 5.1 (1-sep-2026) es el más capaz y el más caro. Su *cache read* es la excepción
del catálogo: $0.25/MTok, un 2.5% del input en vez del 10% habitual, así que en cargas
muy cacheadas la distancia con Sonnet se estrecha más de lo que sugiere el precio base.

## Cómo elegir entre Haiku y Sonnet

No elijas por «calidad» en abstracto. Elige por **cuánto razonamiento encadenado exige
la tarea**:

- **Haiku 4.5** — clasificar, extraer campos de un texto, etiquetar, reformular,
  enrutar, validar formato, resumir algo corto. Tareas donde el acierto se comprueba en
  un vistazo y el volumen importa más que la profundidad. Es donde vive el grueso de una
  integración bien diseñada.
- **Sonnet 5** — sintetizar varias fuentes, agrupar sin categorías dadas de antemano,
  escribir algo que alguien va a leer entero, decidir con criterio entre opciones,
  cualquier cosa con herramientas encadenadas o con un contexto que no cabe en 200K.

El patrón que casi siempre gana: **Haiku hace el trabajo por unidad, Sonnet hace la
síntesis final**. Cuarenta clasificaciones con Haiku y una agregación con Sonnet cuesta
una fracción de cuarenta llamadas a Sonnet, y suele ser mejor, porque la tarea unitaria
es estrecha y la de síntesis es la que de verdad pide criterio.

Si dudas: **empieza por Haiku y mide**. Subir de modelo es cambiar un string; bajarlo
después de haber construido encima del comportamiento de Sonnet, no.

## Trampas por modelo

**Sonnet 5 y los parámetros de sampling.** Rechaza con `400` los valores no-default de
`temperature`, `top_p` y `top_k`. Si arrastras un `temperature: 0` de una integración
vieja, la llamada falla. Quítalo.

**Sonnet 5 y el thinking manual.** `thinking: { type: 'enabled', budget_tokens }`
—el modo de Haiku— devuelve `400` en Sonnet 5. Ahí se usa `adaptive`, o se desactiva
con `disabled`, que solo se permite con `effort` ≤ `high`.

**Haiku 4.5 y `effort`.** No soporta `output_config.effort`. Su control de
razonamiento es `thinking.budget_tokens` y nada más.

**Haiku 4.5 y el contexto.** 200K y no hay beta header que lo suba. Si el prompt puede
crecer con el uso —un historial, un corpus que se acumula— cuenta tokens antes con
`client.messages.countTokens()` en vez de descubrirlo con un `400` en producción.

**Los IDs sin fecha no son punteros móviles.** Desde la generación 4.6, `claude-sonnet-5`
es un *snapshot fijo*, no un alias a «el último Sonnet». Anthropic no reescribe los pesos
de un ID existente: cuando hay modelo nuevo, hay ID nuevo. La consecuencia práctica es
que **no necesitas pinnear por fecha para tener reproducibilidad** en los modelos nuevos,
pero tampoco vas a recibir mejoras gratis. En Haiku 4.5, que es de la generación
anterior, `claude-haiku-4-5` sí es un puntero de conveniencia al último snapshot con
fecha de esa línea.

## Coste: la cuenta que de verdad importa

```ts
const PRECIOS = {
  'claude-haiku-4-5-20251001': { input: 1, output: 5, cacheWrite5m: 1.25, cacheRead: 0.10 },
  'claude-sonnet-5':           { input: 2, output: 10, cacheWrite5m: 2.50, cacheRead: 0.20 },
} as const;

export function costeUSD(model: keyof typeof PRECIOS, usage: Anthropic.Usage): number {
  const p = PRECIOS[model];
  const porMillon = (tokens: number, precio: number) => (tokens / 1_000_000) * precio;
  return (
    porMillon(usage.input_tokens, p.input) +
    porMillon(usage.output_tokens, p.output) +
    porMillon(usage.cache_creation_input_tokens ?? 0, p.cacheWrite5m) +
    porMillon(usage.cache_read_input_tokens ?? 0, p.cacheRead)
  );
}
```

Dos cosas que se olvidan al hacer esta cuenta:

1. **Los tokens de thinking son tokens de output** y se cobran como tales. En un modelo
   con adaptive thinking activo por defecto, el output real puede ser varias veces el
   texto que ves. `usage.output_tokens_details.thinking_tokens` te dice cuántos fueron.
2. **`input_tokens` no incluye los cacheados.** Los tokens leídos de caché aparecen
   aparte en `cache_read_input_tokens`. Sumar solo `input_tokens` infravalora el
   prompt real y sobrevalora el ahorro.

El Batch API aplica un **50% de descuento** sobre input y output. Si el trabajo tolera
esperar, es la palanca de coste más grande que hay, más que cambiar de modelo.
