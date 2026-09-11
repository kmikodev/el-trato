# El SDK de TypeScript

Todo lo de este fichero está extraído de los `.d.mts` de **`@anthropic-ai/sdk@0.125.0`**
(publicado el 2026-09-10), no de la memoria. Si tu `package.json` fija una versión
anterior, los nombres pueden no coincidir: comprueba con

```bash
npm view @anthropic-ai/sdk version
grep -o "export interface MessageCreateParamsBase {[^}]*}" node_modules/@anthropic-ai/sdk/resources/messages/messages.d.mts
```

## Instalación y runtimes

```bash
npm install @anthropic-ai/sdk
```

TypeScript >= 5.0. Runtimes soportados: **Node.js 20 LTS o superior**, Deno >= 1.28,
Bun >= 1.0, Cloudflare Workers, Vercel Edge Runtime, Nitro >= 2.6, Jest >= 28 con
entorno `node`. React Native no está soportado. El navegador está **desactivado a
propósito** para que no publiques tu API key en un bundle; se abre con
`dangerouslyAllowBrowser: true`, y el nombre de la opción es la advertencia.

`zod` es una *peer dependency* opcional (`^3.25.0 || ^4.0.0`): solo la necesitas si usas
los helpers de structured outputs.

## El cliente

```ts
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();
```

Sin argumentos ya funciona: lee `ANTHROPIC_API_KEY` y `ANTHROPIC_BASE_URL` del entorno.
Los defaults que importan:

| Opción | Default |
|---|---|
| `apiKey` | `process.env.ANTHROPIC_API_KEY` |
| `baseURL` | `process.env.ANTHROPIC_BASE_URL` ?? `https://api.anthropic.com` |
| `timeout` | **10 minutos** |
| `maxRetries` | **2** |
| `dangerouslyAllowBrowser` | `false` |

El resto de opciones del constructor: `authToken`, `credentials`, `config`, `profile`,
`webhookKey`, `fetch`, `fetchOptions`, `middleware`, `defaultHeaders`, `defaultQuery`,
`logLevel`, `logger`.

Ese timeout de 10 minutos es un **suelo**: en llamadas no-streaming con un `max_tokens`
alto, el SDK lo escala hacia arriba en proporción a los tokens pedidos.

**Y es una trampa en serverless.** Una Lambda o un Edge Function se corta mucho antes, y
como los timeouts se reintentan por defecto, el peor caso es `timeout × (maxRetries + 1)`.
En cualquier entorno con límite de ejecución, fíjalo tú:

```ts
const client = new Anthropic({ timeout: 60_000, maxRetries: 3 });
```

Recursos colgando del cliente: `messages`, `models`, `files`, `skills`, `completions`
(legacy) y `beta`.

## Una llamada

```ts
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const message = await client.messages.create({
  model: 'claude-haiku-4-5-20251001',
  max_tokens: 1024,
  system: 'Respondes en una frase.',
  messages: [{ role: 'user', content: '¿Qué es un dilema falso?' }],
});

const texto = message.content
  .filter((b): b is Anthropic.TextBlock => b.type === 'text')
  .map((b) => b.text)
  .join('');
```

`content` es un **array de bloques heterogéneos**, no un string. Es el error de
integración más repetido: `message.content[0].text` funciona hasta el día en que el
modelo emite un `thinking` block primero, o un `tool_use`, y entonces devuelve
`undefined` en producción. Filtra siempre por `type`.

`max_tokens` es **obligatorio**. No tiene default.

### Los tipos que vas a escribir

Todos cuelgan del namespace `Anthropic`, y también se pueden importar sueltos:

```ts
import type {
  Message, MessageParam, MessageCreateParams, Model, StopReason, Usage,
  ContentBlock, ContentBlockParam, TextBlock, ToolUseBlock,
  Tool, ToolChoice, ToolResultBlockParam,
  RawMessageStreamEvent, CacheControlEphemeral, OutputConfig,
} from '@anthropic-ai/sdk/resources/messages';
```

Distinción que confunde: los tipos **sin** `Param` son lo que la API *devuelve*
(`TextBlock`, `ToolUseBlock`); los que acaban en **`Param`** son lo que tú *envías*
(`TextBlockParam`, `ToolResultBlockParam`). `ContentBlock` ⊂ respuesta,
`ContentBlockParam` ⊂ petición.

### `stop_reason`: los siete valores

```ts
type StopReason =
  | 'end_turn' | 'max_tokens' | 'stop_sequence' | 'tool_use'
  | 'pause_turn' | 'refusal' | 'model_context_window_exceeded';
```

Tratar `max_tokens` como éxito es cómo se cuelan respuestas truncadas en una base de
datos. Y si nunca has visto `pause_turn` ni `model_context_window_exceeded`, tu
`switch` sin `default` los ignora en silencio. Comprueba `stop_reason` **siempre** antes
de usar el contenido.

## Streaming

Dos formas. Usa la segunda salvo que necesites los eventos crudos.

**Cruda** — `stream: true` devuelve un `Stream<RawMessageStreamEvent>` iterable:

```ts
const stream = await client.messages.create({
  model: 'claude-sonnet-5',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'Cuenta hasta diez.' }],
  stream: true,
});

for await (const event of stream) {
  if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
    process.stdout.write(event.delta.text);
  }
}
```

**Helper** — `client.messages.stream()` acumula el mensaje por ti y expone eventos con
nombre:

```ts
const stream = client.messages.stream({
  model: 'claude-sonnet-5',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'Cuenta hasta diez.' }],
});

stream.on('text', (delta) => process.stdout.write(delta));

const final = await stream.finalMessage();
console.log(final.usage.output_tokens);
```

Los eventos del helper, con su firma exacta:

| Evento | Argumentos |
|---|---|
| `connect` | — |
| `streamEvent` | `(event, snapshot)` — el evento crudo + el mensaje acumulado |
| `text` | `(textDelta, textSnapshot)` |
| `thinking` | `(thinkingDelta, thinkingSnapshot)` |
| `signature` | `(signature)` |
| `citation` | `(citation, citationsSnapshot)` |
| `inputJson` | `(partialJson, jsonSnapshot)` — tool input parcial |
| `contentBlock` | `(content)` — al cerrarse cada bloque |
| `message` | `(message)` |
| `finalMessage` | `(message)` |
| `error` | `(error)` |
| `abort` | `(error)` |
| `end` | — |

Métodos: `finalMessage()`, `finalText()`, `done()`, `abort()`, `withResponse()`,
`toReadableStream()`, y `emitted(evento)` para esperar a uno concreto.

**Cancelar.** `stream.abort()`, o un `AbortSignal` por request:

```ts
const ac = new AbortController();
const stream = client.messages.stream({ /* ... */ }, { signal: ac.signal });
setTimeout(() => ac.abort(), 5_000);
```

Si el cliente HTTP se desconecta y tú no abortas, sigues pagando los tokens que el
modelo genera. En un endpoint que hace de proxy hacia el navegador, engancha el abort al
cierre de la conexión entrante.

### Reenviar el stream al navegador

```ts
// Route handler (Next.js App Router, Hono, cualquier cosa que devuelva Response)
export async function POST(req: Request) {
  const { prompt } = await req.json();

  const stream = client.messages.stream({
    model: 'claude-sonnet-5',
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
  }, { signal: req.signal });

  return new Response(stream.toReadableStream(), {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
```

Pasar `req.signal` es lo que hace que cerrar la pestaña deje de costar dinero.

## Structured outputs

Es un parámetro de primera clase, no un truco con tools. `output_config.format` acepta
un JSON Schema, y `client.messages.parse()` te devuelve el objeto ya parseado y tipado
en `parsed_output`.

```ts
import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import * as z from 'zod';

const Postura = z.object({
  etiqueta: z.string(),
  argumento: z.string(),
  premisa_implicita: z.string(),
  respuestas: z.array(z.number().int()),
});

const client = new Anthropic();

const message = await client.messages.parse({
  model: 'claude-sonnet-5',
  max_tokens: 2048,
  messages: [{ role: 'user', content: justificaciones.join('\n') }],
  output_config: { format: zodOutputFormat(z.object({ posturas: z.array(Postura) })) },
});

message.parsed_output?.posturas.forEach((p) => console.log(p.etiqueta));
//                     ^ tipado, inferido del esquema de zod
```

Sin zod, con JSON Schema literal:

```ts
import { jsonSchemaOutputFormat } from '@anthropic-ai/sdk/helpers/json-schema';

output_config: {
  format: jsonSchemaOutputFormat({
    type: 'object',
    properties: { etiqueta: { type: 'string' } },
    required: ['etiqueta'],
    additionalProperties: false,
  }),
}
```

Y a pelo, sin helpers ni parseo automático:

```ts
output_config: { format: { type: 'json_schema', schema: { /* ... */ } } }
```

`parsed_output` es `T | null`. Es `null` si el modelo paró antes de completar el JSON
—típicamente por `max_tokens`—, así que compruébalo en vez de usar `!`.

`output_config` también lleva `effort` (`'low' | 'medium' | 'high' | 'xhigh' | 'max'`),
que gobierna cuánto razona el modelo en los que soportan adaptive thinking.

## Tool use

Una tool es nombre, descripción y JSON Schema de entrada:

```ts
const tools: Anthropic.Tool[] = [
  {
    name: 'buscar_dilema',
    description: 'Busca dilemas anteriores por tema. Devuelve hasta 5 resultados.',
    input_schema: {
      type: 'object',
      properties: { tema: { type: 'string', description: 'Tema a buscar' } },
      required: ['tema'],
    },
    strict: true,
  },
];
```

`description` es el prompt de la tool: es lo que decide si el modelo la llama bien o
mal, y merece más cuidado que el nombre. `strict: true` fuerza que el input generado se
ajuste al esquema. Otros campos de `Tool`: `cache_control`, `defer_loading`,
`input_examples`, `allowed_callers`, `eager_input_streaming`.

`tool_choice`: `{ type: 'auto' }` (por defecto), `{ type: 'any' }` (obligatorio usar
alguna), `{ type: 'tool', name }` (esa), `{ type: 'none' }`. Los tres primeros aceptan
`disable_parallel_tool_use`.

### El bucle, a mano

```ts
async function conversar(pregunta: string) {
  const messages: Anthropic.MessageParam[] = [{ role: 'user', content: pregunta }];

  for (let vuelta = 0; vuelta < 10; vuelta++) {
    const res = await client.messages.create({
      model: 'claude-sonnet-5',
      max_tokens: 2048,
      tools,
      messages,
    });

    messages.push({ role: 'assistant', content: res.content });

    if (res.stop_reason !== 'tool_use') return res;

    const usos = res.content.filter(
      (b): b is Anthropic.ToolUseBlock => b.type === 'tool_use',
    );

    const resultados: Anthropic.ToolResultBlockParam[] = await Promise.all(
      usos.map(async (uso) => {
        try {
          return {
            type: 'tool_result' as const,
            tool_use_id: uso.id,
            content: JSON.stringify(await ejecutar(uso.name, uso.input)),
          };
        } catch (e) {
          return {
            type: 'tool_result' as const,
            tool_use_id: uso.id,
            content: e instanceof Error ? e.message : 'error desconocido',
            is_error: true,
          };
        }
      }),
    );

    messages.push({ role: 'user', content: resultados });
  }

  throw new Error('El bucle de tools no convergió en 10 vueltas.');
}
```

Cuatro cosas que este bucle hace bien y que casi todas las implementaciones caseras
hacen mal:

1. **Devuelve `res.content` entero** al historial, no solo el texto. Si tiras los bloques
   `thinking`, el modelo pierde su propio razonamiento entre vueltas.
2. **Un `tool_result` por cada `tool_use`**, en el mismo turno de `user`. Si falta uno,
   la API responde `400`.
3. **Los errores vuelven como `is_error: true`**, no como excepción que mata el proceso.
   El modelo puede corregirse; un `throw` no le da la oportunidad.
4. **Tiene tope de vueltas.** Un bucle agéntico sin límite es una factura sin límite.

### El bucle, con el helper

Está en `beta` a día de hoy:

```ts
import { betaZodTool } from '@anthropic-ai/sdk/helpers/beta/zod';
import * as z from 'zod';

const runner = client.beta.messages.toolRunner({
  model: 'claude-sonnet-5',
  max_tokens: 2048,
  messages: [{ role: 'user', content: pregunta }],
  tools: [
    betaZodTool({
      name: 'buscar_dilema',
      description: 'Busca dilemas anteriores por tema.',
      inputSchema: z.object({ tema: z.string() }),
      run: async ({ tema }) => JSON.stringify(await buscar(tema)),
    }),
  ],
});

for await (const message of runner) {
  // cada vuelta del bucle; el runner ejecuta las tools y reinyecta los resultados
}
```

## Errores y reintentos

Jerarquía exacta de clases exportadas:

```
AnthropicError
├── APIError
│   ├── APIUserAbortError
│   ├── APIConnectionError
│   │   └── APIConnectionTimeoutError
│   ├── BadRequestError          400
│   ├── AuthenticationError      401
│   ├── PermissionDeniedError    403
│   ├── NotFoundError            404
│   ├── ConflictError            409
│   ├── UnprocessableEntityError 422
│   ├── RateLimitError           429
│   └── InternalServerError      5xx
└── RetryableError
```

```ts
try {
  await client.messages.create({ /* ... */ });
} catch (err) {
  if (err instanceof Anthropic.RateLimitError) {
    // ya se reintentó maxRetries veces; aquí toca encolar o degradar
  } else if (err instanceof Anthropic.APIConnectionTimeoutError) {
    // el timeout de 10 min por defecto, o el que hayas fijado
  } else if (err instanceof Anthropic.APIError) {
    console.error(err.status, err.type, err.error, err.requestID);
  }
  throw err;
}
```

Campos de `APIError`: `status`, `headers`, `error`, `type`, **`requestID`** y
`workspaceID`. Ojo al *casing*: es `requestID`, no `request_id` ni `requestId`.

**El request ID es lo único que sirve para abrir un ticket.** Lóguealo siempre, también
en las respuestas correctas raras, donde se saca del header:

```ts
const { data, response } = await client.messages.create(params).withResponse();
console.log(response.headers.get('request-id'));
```

El SDK ya reintenta con backoff exponencial: errores de conexión, timeouts, `408`,
`409`, `429` y `5xx`. No envuelvas las llamadas en tu propio `retry` sin bajar antes
`maxRetries` a `0`, o multiplicarás los intentos sin darte cuenta (3 × 3 = 9 llamadas
por una).

Ajuste por llamada, sin tocar el cliente:

```ts
await client.messages.create(params, { maxRetries: 5, timeout: 30_000 });
```

## Contar tokens antes de gastar

```ts
const { input_tokens } = await client.messages.countTokens({
  model: 'claude-haiku-4-5-20251001',
  messages,
  tools,
});
```

Es gratis y es la única forma honesta de saber si un prompt cabe antes de mandarlo.
Cuenta también el system prompt y las definiciones de tools, que es justo lo que la
gente olvida al estimar a ojo.

## Batch: la mitad de precio

```ts
const batch = await client.messages.batches.create({
  requests: respuestas.map((r) => ({
    custom_id: r.id,
    params: {
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      messages: [{ role: 'user', content: r.texto }],
    },
  })),
});

// más tarde
const hecho = await client.messages.batches.retrieve(batch.id);
if (hecho.processing_status === 'ended') {
  for await (const item of await client.messages.batches.results(batch.id)) {
    if (item.result.type === 'succeeded') guardar(item.custom_id, item.result.message);
  }
}
```

Métodos: `create`, `retrieve`, `list`, `cancel`, `delete`, `results`. **`custom_id` es
tu única forma de volver a casar cada resultado con su entrada**: los resultados no
llegan en orden.

## Ficheros, modelos, paginación

```ts
import { toFile } from '@anthropic-ai/sdk';

await client.files.upload({ file: await toFile(buffer, 'corpus.pdf') });
await client.files.list();            // PagePromise, iterable con for await
await client.files.retrieveMetadata(id);
await client.files.download(id);      // devuelve Response
await client.files.delete(id);

await client.models.list({ limit: 100 });
await client.models.retrieve('claude-sonnet-5');
```

Todo lo que devuelve `PagePromise` se pagina solo:

```ts
for await (const modelo of client.models.list()) console.log(modelo.id);
```

## Beta

Las features en beta viven bajo `client.beta.*`, que acepta un array `betas` en el body
y lo traduce al header `anthropic-beta` por ti:

```ts
await client.beta.messages.create({
  model: 'claude-sonnet-5',
  max_tokens: 1024,
  messages,
  betas: ['output-300k-2026-03-24'],
});
```

Para una beta que aún no tenga soporte en el SDK, el header a pelo por request:

```ts
await client.messages.create(params, {
  headers: { 'anthropic-beta': 'una-beta,otra-beta' },
});
```

## Bedrock y Vertex

Paquetes aparte, misma superficie de `messages`:

```bash
npm install @anthropic-ai/bedrock-sdk    # AWS Bedrock
npm install @anthropic-ai/vertex-sdk     # Google Vertex AI
```

```ts
import AnthropicBedrock, { AnthropicBedrockMantle } from '@anthropic-ai/bedrock-sdk';
import AnthropicVertex from '@anthropic-ai/vertex-sdk';

const bedrock = new AnthropicBedrock({ awsRegion: 'eu-central-1' });
const vertex = new AnthropicVertex({ projectId: 'mi-proyecto', region: 'europe-west1' });
```

El paquete de Bedrock exporta dos clientes: `AnthropicBedrock` (el default, sobre
`bedrock-runtime`) y `AnthropicBedrockMantle`. Comprueba cuál pide tu cuenta antes de
elegir; no son intercambiables.

Cambian la autenticación (credenciales de la nube, no `x-api-key`) y **los model IDs**,
que llevan prefijo de proveedor: `anthropic.claude-sonnet-5` en Bedrock,
`claude-sonnet-5` en Vertex. No copies IDs entre proveedores.
