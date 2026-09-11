# La superficie HTTP

Lo que sigue es la spec en prosa: endpoints, forma exacta de cada cuerpo, eventos de
streaming y errores. Los nombres de campo y los literales de `type` están sacados de los
tipos de `@anthropic-ai/sdk@0.125.0`, que es lo que de verdad manda el cliente, no de una
transcripción de los docs. Si escribes una integración sin SDK, esto es tu contrato.

Docs vivos: `https://platform.claude.com/docs/en/api/overview`.

## Lo mínimo

```
POST https://api.anthropic.com/v1/messages
x-api-key: sk-ant-...
anthropic-version: 2023-06-01
content-type: application/json
```

`anthropic-version: 2023-06-01` es **obligatorio** y sigue siendo el valor vigente. No es
un residuo histórico: es la versión del contrato, y omitirlo da `400`.

Autenticación: `x-api-key` con una API key. `Authorization: Bearer <token>` es la vía
alternativa para tokens de acceso de vida corta (OAuth). Elige una; no mandes las dos.

Headers opcionales:

- `anthropic-beta: beta-uno,beta-dos` — features en beta, separadas por comas.
- `anthropic-workspace-id: wrkspc_...` — obligatorio si la key abarca varios workspaces.

## Endpoints

| Método | Ruta | Para qué |
|---|---|---|
| POST | `/v1/messages` | La llamada. Todo lo demás es periferia. |
| POST | `/v1/messages/count_tokens` | Contar tokens sin generar ni pagar. |
| POST | `/v1/messages/batches` | Crear un lote asíncrono (50% de descuento). |
| GET | `/v1/messages/batches` | Listar lotes (`after_id`, `before_id`, `limit`). |
| GET | `/v1/messages/batches/{id}` | Estado de un lote. |
| GET | `/v1/messages/batches/{id}/results` | Resultados en JSONL, una línea por petición. |
| POST | `/v1/messages/batches/{id}/cancel` | Cancelar un lote en curso. |
| POST | `/v1/files` | Subir un fichero (`multipart/form-data`). |
| GET | `/v1/files` · `/v1/files/{id}` | Listar · metadatos. |
| GET | `/v1/models` · `/v1/models/{id}` | Catálogo de modelos y sus capacidades. |

`GET /v1/models` devuelve, por modelo, un objeto `capabilities` con
`structured_outputs`, `thinking` (y sus tipos `adaptive` / `enabled`), `effort`,
`image_input`, `pdf_input`, `citations`, `batch`, `code_execution`. **Es la forma
programática de no adivinar qué soporta cada modelo**, mejor que una tabla copiada a
mano que envejece.

## POST /v1/messages — el cuerpo

Obligatorios: `model`, `messages`, `max_tokens`.

```jsonc
{
  "model": "claude-sonnet-5",
  "max_tokens": 1024,
  "messages": [{ "role": "user", "content": "..." }],

  "system": "string o array de TextBlockParam",
  "temperature": 0.0,          // 0–1
  "top_p": 0.9,                // 0–1
  "top_k": 40,
  "stop_sequences": ["FIN"],
  "stream": false,
  "metadata": { "user_id": "hash-opaco" },

  "tools": [ /* ... */ ],
  "tool_choice": { "type": "auto" },

  "thinking": { "type": "adaptive", "display": "summarized" },
  "output_config": {
    "effort": "high",
    "format": { "type": "json_schema", "schema": { /* ... */ } }
  },

  "cache_control": { "type": "ephemeral", "ttl": "5m" },
  "service_tier": "auto",      // o "standard_only"
  "inference_geo": "...",      // pista de región
  "container": null,
  "workspace_id": "...",
  "user_profile_id": "..."
}
```

Cuatro avisos sobre este cuerpo:

- **`max_tokens` no tiene default.** Es un tope duro de salida, no un objetivo: si el
  modelo lo alcanza, la respuesta se corta a media frase y `stop_reason` vale
  `max_tokens`.
- **`metadata.user_id` debe ser opaco.** Un hash estable, no un email ni un nombre.
- **`temperature` y compañía no son universales.** Sonnet 5 rechaza con `400` cualquier
  valor no-default de `temperature`, `top_p` o `top_k`.
- **`messages` alterna `user` y `assistant`.** El rol `system` también se acepta en el
  array, pero las instrucciones globales van en el campo `system` de primer nivel, que
  es lo que se cachea bien.

### Bloques de contenido que puedes enviar

`content` es un string —atajo para un único bloque de texto— o un array de bloques. Los
que se mandan:

```jsonc
{ "type": "text", "text": "...", "cache_control": {...}, "citations": [...] }

{ "type": "image", "source": { "type": "base64", "media_type": "image/png", "data": "..." } }
{ "type": "image", "source": { "type": "url", "url": "https://..." } }
{ "type": "image", "source": { "type": "file", "file_id": "file_..." } }

{ "type": "document",
  "source": { "type": "base64", "media_type": "application/pdf", "data": "..." },
  "title": "...", "context": "...", "citations": { "enabled": true } }

{ "type": "tool_use", "id": "toolu_...", "name": "...", "input": {...} }
{ "type": "tool_result", "tool_use_id": "toolu_...", "content": "...", "is_error": false }

{ "type": "thinking", "thinking": "...", "signature": "..." }
{ "type": "redacted_thinking", "data": "..." }

{ "type": "search_result", "source": "...", "title": "...", "content": [ {"type":"text","text":"..."} ] }
```

`media_type` de imagen: `image/jpeg`, `image/png`, `image/gif`, `image/webp`. El
`source` de un documento admite además `text` (texto plano), `content` (bloques) y
`url`.

Los bloques `thinking` y `redacted_thinking` que devuelve el modelo **se reenvían tal
cual**, con su `signature` intacta. Editarlos o tirarlos rompe la continuidad del
razonamiento entre turnos y, en algunos modelos, da error.

### La respuesta

```jsonc
{
  "type": "message",
  "id": "msg_...",
  "model": "claude-sonnet-5",
  "role": "assistant",
  "content": [ /* bloques */ ],
  "stop_reason": "end_turn",
  "stop_sequence": null,
  "stop_details": null,
  "container": null,
  "usage": {
    "input_tokens": 50,
    "output_tokens": 503,
    "cache_creation_input_tokens": 1000,
    "cache_read_input_tokens": 100000,
    "cache_creation": { "ephemeral_5m_input_tokens": 900, "ephemeral_1h_input_tokens": 100 },
    "output_tokens_details": { "thinking_tokens": 220 },
    "server_tool_use": { "web_search_requests": 0, "web_fetch_requests": 0 },
    "service_tier": "standard",
    "inference_geo": null
  }
}
```

`stop_reason` tiene **siete** valores: `end_turn`, `max_tokens`, `stop_sequence`,
`tool_use`, `pause_turn`, `refusal`, `model_context_window_exceeded`. Un `switch` que
solo contemple los cuatro clásicos se traga los otros tres en silencio.

Bloques que puede devolver `content`: `text`, `thinking`, `redacted_thinking`,
`tool_use`, `server_tool_use`, `web_search_tool_result`, `web_fetch_tool_result`,
`code_execution_tool_result`, `bash_code_execution_tool_result`,
`text_editor_code_execution_tool_result`, `tool_search_tool_result`,
`container_upload`.

## Streaming (SSE)

Con `"stream": true` la respuesta es `text/event-stream`. El orden es siempre el mismo:

```
message_start          → el Message con content: []
  content_block_start  → { index, content_block }
  content_block_delta  → { index, delta }   ×N
  content_block_stop   → { index }
  … (se repite por cada bloque)
message_delta          → { delta: { stop_reason, stop_sequence }, usage }
message_stop
```

Intercalados, en cualquier momento: `ping` (keep-alive, ignóralo) y `error` (fallo a
mitad de stream, típicamente `overloaded_error`).

Variantes de `content_block_delta`:

| `delta.type` | Campo |
|---|---|
| `text_delta` | `text` |
| `input_json_delta` | `partial_json` — JSON **parcial** del input de una tool |
| `thinking_delta` | `thinking` |
| `signature_delta` | `signature` — llega justo antes del `content_block_stop` del bloque de thinking |
| `citations_delta` | `citations` |

**`partial_json` no es JSON válido hasta el `content_block_stop`.** Acumúlalo como
string y parsea al final; intentar `JSON.parse` en cada delta es el bug clásico del
streaming de tools.

Los contadores de `usage` en `message_delta` son **acumulados**, no incrementales.

### Sin SDK, a pelo

```ts
const res = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'x-api-key': process.env.ANTHROPIC_API_KEY!,
    'anthropic-version': '2023-06-01',
    'content-type': 'application/json',
  },
  body: JSON.stringify({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    messages: [{ role: 'user', content: 'Hola' }],
    stream: true,
  }),
});

if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);

const reader = res.body!.pipeThrough(new TextDecoderStream()).getReader();
let buffer = '';

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  buffer += value;

  const partes = buffer.split('\n\n');
  buffer = partes.pop() ?? '';           // el último trozo puede estar a medias

  for (const parte of partes) {
    const linea = parte.split('\n').find((l) => l.startsWith('data: '));
    if (!linea) continue;
    const evento = JSON.parse(linea.slice(6));
    if (evento.type === 'content_block_delta' && evento.delta.type === 'text_delta') {
      process.stdout.write(evento.delta.text);
    }
  }
}
```

Lo que rompe las implementaciones caseras es siempre lo mismo: **un chunk de red no es
un evento SSE**. Un evento puede partirse entre dos chunks y un chunk puede traer tres
eventos. Por eso hay un `buffer` y por eso el último trozo se devuelve al buffer en vez
de parsearse.

## Tools

Definición de una tool propia:

```jsonc
{
  "name": "buscar_dilema",             // ^[a-zA-Z0-9_-]{1,128}$
  "description": "Qué hace, cuándo usarla y qué devuelve.",
  "input_schema": { "type": "object", "properties": {...}, "required": [...] },
  "strict": true,
  "cache_control": { "type": "ephemeral" }
}
```

`tool_choice`: `{"type":"auto"}` (default), `{"type":"any"}`, `{"type":"tool","name":"x"}`,
`{"type":"none"}`. Los tres primeros admiten `"disable_parallel_tool_use": true`.

El ciclo: pides con `tools` → responde con `stop_reason: "tool_use"` y uno o más bloques
`tool_use` → ejecutas → mandas un turno de `user` con **un `tool_result` por cada
`tool_use`**, casados por `tool_use_id` → responde. Si falta un `tool_result`, es `400`.

Un fallo de tu herramienta va como `"is_error": true` con el mensaje en `content`. No es
un error de la API: es información para el modelo, que puede reintentar con otros
argumentos.

### Tools de servidor

Las ejecuta Anthropic; no devuelves `tool_result`. Se declaran por `type` versionado, y
**la versión es parte del nombre**: usar la de otro modelo da `400`. Literales vigentes:

```
web_search_20250305 · web_search_20260209 · web_search_20260318
web_fetch_20250910 · web_fetch_20260209 · web_fetch_20260309 · web_fetch_20260318
code_execution_20250522 · code_execution_20250825 · code_execution_20260120 · code_execution_20260521
bash_20250124
text_editor_20250124 · text_editor_20250429 · text_editor_20250728
tool_search_tool_bm25_20251119 · tool_search_tool_regex_20251119
memory_20250818
computer_toolset_20260801 · browser_toolset_20260801
```

Su consumo aparece en `usage.server_tool_use` y **se factura aparte** de los tokens.

## Structured outputs

Ya no es un truco con tools: es `output_config.format`.

```jsonc
"output_config": {
  "format": {
    "type": "json_schema",
    "schema": {
      "type": "object",
      "properties": { "etiqueta": { "type": "string" } },
      "required": ["etiqueta"],
      "additionalProperties": false
    }
  }
}
```

No lleva beta header. La respuesta es un único bloque `text` con JSON válido contra el
esquema.

El subconjunto de JSON Schema soportado incluye `anyOf`, `allOf`, `$ref`, `enum`,
`const` y los formatos de string (`date`, `date-time`, `email`, `uuid`). **No** soporta
esquemas recursivos ni restricciones numéricas o de longitud (`minimum`, `maximum`,
`minLength`). Si las necesitas, valida tú después: el esquema garantiza la *forma*, no
el *rango*.

## Prompt caching

```jsonc
{ "type": "ephemeral", "ttl": "5m" }   // o "1h"
```

Va en un bloque concreto —de `tools`, de `system` o de `messages`— y marca un
*breakpoint*: **se cachea todo lo que hay desde el principio del prompt hasta ese punto**.
De ahí la regla que lo gobierna todo: **lo estable primero, lo variable después**.
Tools, luego system, luego historial, y al final el turno nuevo. Un solo token que
cambie antes del breakpoint invalida la caché entera.

Mínimos para que la caché se active (por debajo, se ignora en silencio):

| Modelos | Mínimo |
|---|---|
| Fable 5.1, Opus 5, Sonnet 5 | 512 tokens |
| Opus 4.8, Sonnet 4.6, Sonnet 4.5 | 1.024 |
| Opus 4.7 | 2.048 |
| Opus 4.6, Opus 4.5, **Haiku 4.5** | 4.096 |

Que Haiku 4.5 pida 4.096 tokens es la trampa práctica: el modelo barato, donde más
tienta cachear un system prompt mediano, es justo el que más exige para hacerlo.

Escribir en caché a 5m cuesta 1.25× el input; a 1h, 2×. Leer cuesta 0.1× (con la
excepción de Fable 5.1, que lee a 0.025×). Cambiar las tools, el ajuste de thinking o el
nivel de `effort` **invalida la caché**.

Verifica siempre contra `usage.cache_read_input_tokens`: si es 0 cuando esperabas un
acierto, el breakpoint está mal puesto o no llegas al mínimo.

## Batches

```jsonc
POST /v1/messages/batches
{
  "requests": [
    { "custom_id": "resp-001",           // ^[a-zA-Z0-9_-]{1,64}$, único en el lote
      "params": { "model": "...", "max_tokens": 512, "messages": [...] } }
  ]
}
```

Límites: 100.000 peticiones o 256 MB por lote. Sin `stream: true`. Suele acabar en menos
de una hora, con tope de 24; los resultados viven 29 días.

El estado se consulta con `GET /v1/messages/batches/{id}`: `processing_status` pasa de
`in_progress` a `ended`, y `request_counts` desglosa `processing`, `succeeded`,
`errored`, `canceled`, `expired`. Los resultados llegan como JSONL, **sin orden
garantizado**: `custom_id` es tu única forma de recasarlos.

## Errores

```jsonc
{ "type": "error", "error": { "type": "invalid_request_error", "message": "..." } }
```

| HTTP | `error.type` | Qué pasó |
|---|---|---|
| 400 | `invalid_request_error` | El cuerpo. Léete el `message`, suele ser literal. |
| 401 | `authentication_error` | Key inválida, revocada o caducada. |
| 402 | `billing_error` | Problema de facturación. |
| 403 | `permission_error` | La key no alcanza a ese recurso o workspace. |
| 404 | `not_found_error` | Casi siempre un **model ID mal escrito**. |
| 409 | `conflict_error` | Modificación concurrente. |
| 413 | `request_too_large` | 32 MB en Messages, 256 MB en Batch, 500 MB en Files. |
| 429 | `rate_limit_error` | Rate limit *o* tope de gasto. |
| 500 | `api_error` | Fallo interno. |
| 504 | `timeout_error` | Se agotó el tiempo. |
| 529 | `overloaded_error` | API saturada. Reintenta con backoff. |

El ID de petición viene en el header `request-id: req_...`. Guárdalo en los logs: sin él
no hay soporte posible.

**Los dos 429 no son el mismo error.** El de rate limit trae header `retry-after` en
segundos y se resuelve esperando. El de tope de gasto **no trae `retry-after`** y lleva
`error.details.error_code: "enforced_spend_limit_reached"`: reintentarlo no arregla
nada, porque no se levanta hasta el mes siguiente. Distínguelos antes de meterlos en la
misma política de reintento.

## Rate limits

Cada respuesta trae el estado de tus límites:

```
anthropic-ratelimit-requests-limit / -remaining / -reset
anthropic-ratelimit-tokens-limit / -remaining / -reset
anthropic-ratelimit-input-tokens-limit / -remaining / -reset
anthropic-ratelimit-output-tokens-limit / -remaining / -reset
retry-after
```

Los `-reset` son timestamps RFC3339, no segundos. Los `-remaining` de tokens vienen
redondeados al millar.

Se limita por RPM (peticiones), ITPM (tokens de input **no cacheados**) y OTPM (tokens
de output), y cada modelo tiene sus cupos. Que los tokens leídos de caché no cuenten
para el ITPM en la mayoría de modelos convierte el caching en una palanca de *throughput*,
no solo de coste. Los Batches tienen límites propios, aparte de estos.
