---
name: evidencias
description: Genera con el MCP de Playwright las evidencias de que una PR se ha comprobado de verdad, las deja en evidence/issue-<n>/ dentro de la rama y las commitea antes de aprobar. Úsala como qa del handoff, siempre, justo antes de aprobar y mergear una PR - y también cuando alguien pregunte qué se comprobó de una issue ya cerrada. No la uses para decidir si la PR está bien: eso es QA.md, esto es solo dejar constancia.
allowed-tools: Bash, Read, Grep, Glob, mcp__playwright__browser_navigate, mcp__playwright__browser_snapshot, mcp__playwright__browser_take_screenshot, mcp__playwright__browser_console_messages, mcp__playwright__browser_network_requests, mcp__playwright__browser_resize, mcp__playwright__browser_wait_for, mcp__playwright__browser_click, mcp__playwright__browser_type
arguments: [issue]
---

# Dejar evidencias antes de mergear

`QA.md` ya dice por qué existe esto, aunque lo diga para otra cosa: *el mensaje
desaparece al cerrar la sesión; la review queda*. Las evidencias son ese mismo
argumento llevado hasta el final. Una review dice «comprobado que la pantalla carga».
Dentro de un mes, cuando algo falle, nadie puede saber si eso fue verdad.

Esta skill deja en la rama, **antes de aprobar**, lo que se vio al comprobarlo.

El argumento `issue` es el número. Si no te lo han dado, sale de la PR:
`gh pr view <n> --json body,headRefName`.

## Antes de nada: esto no decide nada

Esta skill **no juzga la PR**. Eso está en `QA.md` y ya lo has hecho. Si la PR está mal,
no vengas aquí: los motivos van en la review y las evidencias del fallo también, **sin
commitear nada**. Volverás cuando el dev la arregle.

Evidencias solo de lo que va a entrar en `main`.

## La excepción que esto abre, dicha en voz alta

`QA.md` dice «en cuanto tocas la rama, dejas de ser quien revisa». Esta skill te hace
tocar la rama, así que la excepción se escribe entera o la próxima sesión leerá una de
las dos reglas y hará lo contrario:

> El qa puede commitear en la rama **exclusivamente dentro de `evidence/`**. Eso no es
> código, no cambia lo que se revisa y no toca nada de lo que el dev escribió. Si te ves
> editando cualquier otro fichero, has dejado de revisar: para y devuélvela con
> `CAMBIOS`.

Un `git diff` de tu commit que toque algo fuera de `evidence/` es un error tuyo, no una
mejora.

## Dos trampas del repositorio, antes de escribir un comando

Las dos te van a morder si vas directo, y las dos las pone tu propio hook.

**El HEAD suelto cuenta como `main`.** Has revisado con `git switch --detach
origin/issue-41-...`, como manda `QA.md`. El hook `no-commit-a-mano.sh` lee la rama con
`symbolic-ref`, que con el HEAD suelto no devuelve nombre, y entonces **trata el commit
como si fuera en `main` y lo deniega**. Hay que ponerse en la rama de verdad.

**Moverse y commitear en la misma orden también se deniega.** El hook es un `PreToolUse`:
decide antes de que nada corra, así que si el comando lleva un `git switch` dentro no
puede saber dónde caería el commit. Van en **llamadas separadas**. Nada de `&&`.

## El orden, que no es negociable

Empujar después de aprobar puede invalidar tu propia aprobación —GitHub descarta reviews
viejas cuando la rama cambia—, y entonces habrás aprobado una cosa y mergeado otra.

1. Revisas (`QA.md`). Decides que está bien.
2. Te pones en la rama de verdad.
3. Generas las evidencias.
4. Commiteas **solo** `evidence/` y empujas.
5. **Ahora** apruebas.
6. Mergeas.

## 1. Ponerte en la rama

Llamada propia, sin nada más pegado:

```bash
git fetch origin
git switch issue-41-pantalla-esperar
```

Comprueba que ha funcionado antes de seguir. Si esto devuelve vacío, el commit se te va a
denegar y ya sabes por qué:

```bash
git symbolic-ref --short -q HEAD
```

## 2. Generar las evidencias

La carpeta es `evidence/issue-<n>/`. Los nombres de fichero van en inglés y el contenido
en español, como todo aquí.

Lo que se recoge de cada pantalla que la issue toca:

| Fichero | Qué es | Por qué |
|---|---|---|
| `snapshot-<pantalla>.txt` | `browser_snapshot`, el árbol de accesibilidad en texto | **Es la evidencia de verdad.** Se diffea en git, se lee en la PR y dice qué *había*, no qué se veía. Una captura no se puede diffear. |
| `screenshot-<pantalla>-<ancho>.png` | `browser_take_screenshot` | Para el ojo, y para la charla. |
| `console.txt` | `browser_console_messages` | Un error de consola con la pantalla pintada correctamente es justo lo que una captura esconde. |
| `commands.txt` | Los comandos que ejecutaste y su salida | Tests, build, linter. Una PR sin interfaz **también deja evidencias**, y son éstas. |
| `README.md` | Qué comprobaste, cómo, y qué viste | Lo escribes tú, en español. Es el índice. |

**Dos anchos siempre.** «Participar funciona igual desde el móvil y desde el portátil» es
una decisión cerrada del README, así que una evidencia a un solo tamaño no demuestra lo
que la issue promete:

```
browser_resize   390 x 844     → móvil
browser_resize  1440 x 900     → portátil
```

**Lo que esto no sustituye.** La lluvia por Meet (issue #17) no se mide con Playwright:
depende del códec y de la CPU del ponente comprimiendo en directo. Un navegador headless
no ve nada de eso. Si la issue va de la lluvia, dilo en el `README.md` de la carpeta y no
finjas que una captura limpia demuestra algo.

## 3. Escribir el `README.md` de la carpeta

Es lo único que no genera la herramienta, y es lo que se leerá dentro de un mes:

```markdown
# Evidencias · issue #41

**PR:** #12 · **Rama:** `issue-41-pantalla-esperar` · **Fecha:** 11 de septiembre de 2026

## Qué pedía la issue
<una línea>

## Qué se comprobó
1. <paso> → <qué se vio> → `snapshot-esperar.txt`
2. ...

## Qué no se pudo comprobar
<lo que quedó fuera y por qué. Si está vacío, sospecha.>
```

Ese último apartado es el que da valor a los otros. Unas evidencias que no dicen dónde no
llegaron se leen como si lo cubrieran todo.

## 4. Commitear y empujar

Llamada aparte de la del `switch`, y **solo la carpeta**:

```bash
git add evidence/issue-41
git status --short
```

Mira ese `status` antes de commitear. Si aparece cualquier cosa fuera de
`evidence/issue-41`, para: o te has dejado algo abierto o has tocado lo que no debías.

```bash
git commit -m "test(evidencias): lo comprobado para la issue #41 antes de mergear"
git push
```

El tipo es `test` y el ámbito `evidencias`, en la forma que pide `CLAUDE.md`. El cuerpo no
hace falta: el `README.md` de la carpeta ya lo cuenta.

## 5. Aprobar, ahora sí

Enlaza la carpeta en la review para que quien lea la PR llegue a ella sin buscar:

```bash
gh pr review 12 --approve --body "Comprobado en móvil (390) y portátil (1440).
Evidencias en evidence/issue-41/ — snapshots, capturas, consola y comandos.
<lo que viste, en una o dos líneas>"
```

Y sigues con el merge y los mensajes que ya manda `QA.md`.

## Si la PR se devuelve

Las evidencias del fallo valen más que las del acierto, pero **no se commitean**: esa rama
vuelve al dev y un commit tuyo encima le crea un conflicto que tendrá que resolver antes
de arreglar nada.

Van pegadas en la review, que es donde el dev las tiene delante del código:

```bash
gh pr review 12 --request-changes --body "$(cat <<'EOF'
1. <qué está mal> · <cómo reproducirlo> · <qué esperabas>

Consola al cargar:
```
<pega aquí lo que devolvió browser_console_messages>
```
EOF
)"
```

## Lo que nunca haces

- **Commitear fuera de `evidence/`.** Es la única excepción que tienes y no da para más.
- **Generar las evidencias sin haber revisado.** Unas capturas bonitas de algo que no
  cumple la issue son peor que nada: parecen una comprobación.
- **Aprobar antes de empujar.** Invalidas tu propia review y acabas mergeando algo que no
  aprobaste.
- **Dejar `Qué no se pudo comprobar` vacío porque queda mejor.** Ahí es donde esto sirve
  para algo.
- **Pegar en la carpeta nada que venga de `.env`** ni de una cabecera de autorización. Una
  captura de una pantalla con un token dentro es un secreto commiteado, y el hook
  `pre-commit` no mira dentro de un PNG.
