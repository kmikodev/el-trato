---
name: claude-api
description: Conocimiento completo de la Messages API de Claude para escribir integraciones en TypeScript - model IDs vigentes de Haiku y Sonnet con sus precios y límites, esquema exacto del request y la respuesta, streaming SSE, tool use, structured outputs, prompt caching, batches, errores y rate limits. Úsala al escribir, revisar o depurar cualquier código que llame a la API de Claude (con @anthropic-ai/sdk o con fetch a pelo), al elegir entre Haiku y Sonnet, al estimar coste de tokens, y siempre que aparezcan model IDs, headers anthropic-version o anthropic-beta, o errores 400, 429 y 529.
---

# La Messages API de Claude, desde TypeScript

Esta skill es una **hoja de datos**, no una decisión de arquitectura: describe cómo
funciona la API. Que este proyecto la use, y con qué stack, es una decisión aparte.

Todo lo que hay aquí se verificó el **2026-09-11** contra `platform.claude.com/docs` y
contra los tipos de `@anthropic-ai/sdk@0.125.0`. Cuando los docs y los tipos del paquete
se contradecían, mandan los tipos: es lo que se ejecuta.

## Regla primera: no inventes identificadores

Model IDs, literales de `type`, nombres de campo y versiones de tools **no se deducen por
patrón**. `claude-haiku-4-6` parece razonable y no existe; `web_fetch_20250305` parece
razonable y el string real es `web_fetch_20250910`. Nada de eso falla al compilar —el
tipo `Model` acaba en `(string & {})`— y todo revienta en runtime.

Si no está en estos ficheros, compruébalo antes de escribirlo:

```bash
npm view @anthropic-ai/sdk version
grep -o "export type Model = [^;]*" node_modules/@anthropic-ai/sdk/resources/messages/messages.d.mts
grep -o "export interface MessageCreateParamsBase {[^}]*}" node_modules/@anthropic-ai/sdk/resources/messages/messages.d.mts
```

Y en caliente, `GET /v1/models` devuelve el catálogo con las capacidades de cada modelo
(`structured_outputs`, `thinking`, `effort`, `pdf_input`…). Es mejor fuente que cualquier
tabla, incluida la de esta skill.

## Dónde está cada cosa

| Fichero | Léelo cuando |
|---|---|
| `MODELOS.md` | Elegir entre Haiku y Sonnet, estimar coste, o necesitar un model ID exacto, su contexto, su salida máxima o sus trampas por modelo. |
| `TYPESCRIPT.md` | Escribir código con `@anthropic-ai/sdk`: cliente y defaults, tipos, streaming, tool use, structured outputs, errores, batches, ficheros. |
| `HTTP.md` | Integrar sin SDK, depurar un `400`, o necesitar la forma exacta de un bloque, un evento SSE, un header o un código de error. |
| `PATRONES.md` | Llevar la integración a producción: concurrencia, reintentos, coste, trazabilidad, seguridad de tools, tests, streaming en serverless. |

No hace falta leerlos enteros ni leerlos todos. Para una llamada simple basta el
quickstart de abajo.

## Quickstart

```bash
npm install @anthropic-ai/sdk
export ANTHROPIC_API_KEY=sk-ant-...
```

```ts
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const message = await client.messages.create({
  model: 'claude-haiku-4-5-20251001',
  max_tokens: 1024,
  system: 'Respondes en una frase.',
  messages: [{ role: 'user', content: '¿Qué es una premisa implícita?' }],
});

const texto = message.content
  .filter((b): b is Anthropic.TextBlock => b.type === 'text')
  .map((b) => b.text)
  .join('');
```

## Los seis errores que se repiten

Casi todos los bugs de integración que verás son uno de estos:

1. **Tratar `content` como un string.** Es un array de bloques heterogéneos.
   `message.content[0].text` funciona hasta que el modelo emite un `thinking` o un
   `tool_use` primero. Filtra por `type`, siempre.
2. **Ignorar `stop_reason`.** Tiene siete valores, no cuatro. `max_tokens` significa
   respuesta truncada, y guardarla como si fuera buena es cómo se corrompe una tabla.
3. **Olvidar que `max_tokens` es obligatorio** y que es un tope duro, no un objetivo.
4. **Reintentar encima de los reintentos del SDK.** Ya reintenta `429` y `5xx` dos veces
   por defecto. Tu `retry` encima multiplica: 3 × 3 = 9 llamadas facturadas.
5. **Devolver menos `tool_result` que `tool_use` recibidos.** Uno por cada uno, casados
   por `tool_use_id`, en el mismo turno de `user`. Si falta uno, es `400`.
6. **Poner lo variable antes de lo estable en el prompt.** El caching cachea desde el
   principio hasta el breakpoint: un token que cambie antes lo invalida todo.

## El reflejo de coste

Antes de escribir una integración que llame a Sonnet N veces, pregúntate si la tarea
unitaria la hace Haiku. El patrón que casi siempre gana es **N llamadas a Haiku para el
trabajo por unidad y una a Sonnet para la síntesis**. Y si el trabajo tolera esperar, el
Batch API descuenta el 50%, que es más de lo que ahorra cualquier cambio de modelo.

`client.messages.countTokens()` es gratis y resuelve en una línea la discusión sobre si
un prompt cabe.
