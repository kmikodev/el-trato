---
name: cerrar-fase
description: Ejecuta el ritual de cerrar una fase del proyecto - comprueba que el árbol está en condiciones, hace el commit único de la fase, crea el tag anotado y exige que el README y el ESTADO reflejen la fase que acaba. Úsalo cuando el usuario diga que una fase está terminada, que cierra fase, o pida commitear el trabajo acumulado. Es la única vía por la que se commitea en este repositorio.
allowed-tools: Bash, Read, Grep, Glob
arguments: [fase]
---

# Cerrar una fase

En este repositorio no se commitea durante una fase: el trabajo se acumula y la
fase se cierra con **un único commit y un tag anotado**. Esta skill es la única
vía por la que eso ocurre.

El argumento `fase` es el nombre completo del tag, en formato `NN-nombre` con el
número a dos dígitos: `/cerrar-fase 03-datos`. Si no te lo han dado, mira
`git tag -l` para ver por cuál va la cuenta y propón el siguiente.

**Si en cualquier paso algo no cuadra, párate y pregunta.** No arregles el
problema por tu cuenta, no sigas «asumiendo que era intencionado» y desde luego
no hagas `push`. Cerrar mal una fase ensucia el historial, y aquí el historial es
material de la charla.

---

## Paso 1 — Situarse

```bash
git rev-parse --show-toplevel && git branch --show-current && git status --short
```

Párate y pregunta si: no estás en un repositorio, la rama no es `main`, o hay un
rebase o merge a medias.

## Paso 2 — Comprobar que hay una fase que cerrar

Si `git status --short` no devuelve nada, **no hay nada que cerrar**. Díselo al
usuario y termina. No inventes un commit vacío.

Revisa también los ficheros sin trackear uno por uno. Un fichero nuevo que nadie
esperaba suele ser basura de una prueba, no trabajo de la fase.

## Paso 3 — Comprobar que no se cuela ningún secreto

Este paso no se salta nunca.

```bash
git status --short --untracked-files=all | grep -Ei '\.env|secret|credential|\.pem$|\.key$|token' || echo "sin candidatos evidentes"
```

Si aparece cualquier cosa parecida a un secreto, **para y avisa**. No lo añadas
al commit ni lo muevas de sitio sin decirlo. Confirma además que `.env` sigue
ignorado:

```bash
git check-ignore -v .env
```

## Paso 4 — Enseñar qué se va a commitear

```bash
git add -A && git status --short && git diff --cached --stat
```

Resume en prosa qué cambió en esta fase: qué se construyó, qué se probó y qué se
descartó. Ese resumen es el borrador del cuerpo del commit, así que escríbelo
pensando en alguien que lo va a leer proyectado en una pantalla.

Enseña el resumen al usuario y espera su confirmación antes del paso siguiente.

## Paso 5 — El README

```bash
git diff --cached --name-only | grep -q '^README.md$' && echo "README actualizado" || echo "README SIN TOCAR"
```

Si sale `README SIN TOCAR`, **recuérdaselo al usuario antes de commitear**: el
README es donde vive lo que ya está decidido, y una fase cerrada casi siempre
decide algo. Pregúntale si quiere actualizarlo ahora o si de verdad esta fase no
cambió nada de lo decidido. Ambas respuestas son válidas; lo que no vale es no
haberlo mirado.

## Paso 6 — El estado

```bash
git diff --cached --name-only | grep -q '^ESTADO.md$' && echo "ESTADO actualizado" || echo "ESTADO SIN TOCAR"
```

Aquí, a diferencia del README, **no hay dos respuestas válidas**. `CLAUDE.md` dice
que toda sesión empieza leyendo `ESTADO.md` y que cerrar una fase incluye
actualizarlo. Si sale `ESTADO SIN TOCAR`, párate y actualízalo antes de commitear:
una fase que termina sin mover el estado deja a la siguiente sesión leyendo la
anterior y creyéndosela, que es peor que no tener el fichero.

No basta con que aparezca en el diff. Léelo y comprueba que dice lo de hoy: en qué
fase estamos ahora, qué se decidió en la que acaba, qué bloquea, qué es lo siguiente
y qué está roto. Si se tocó pero sigue describiendo la fase anterior, cuenta como no
tocado.

## Paso 7 — El commit

Conventional Commits con el asunto en español, y cuerpo narrativo explicando la
decisión de la fase: qué se probó, qué falló y por qué se acabó donde se acabó.

```bash
git commit -F - << 'EOF'
tipo(ámbito): qué quedó hecho en esta fase

Cuerpo en español. La decisión, no el listado de ficheros.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
```

## Paso 8 — El tag anotado

Comprueba primero que no existe:

```bash
git tag -l "<fase>"
```

Si ya existe, **para y pregunta**: reetiquetar reescribe la historia de la charla.
Comprueba también que no haya una rama con ese nombre (`git branch --list "<fase>"`):
un tag y una rama homónimos hacen ambiguo el `checkout`.

```bash
git tag -a "<fase>" -m "Resumen de qué quedó funcionando al final de esta fase."
```

El mensaje del tag no repite el del commit: describe **el estado alcanzado**, para
que quien salte a ese tag durante la charla sepa qué se encuentra.

## Paso 9 — Cerrar el círculo

```bash
git log --oneline -3 && git tag -n9
```

Enseña el resultado y termina recordando dos cosas:

- **No se ha hecho `push`.** Aquí no se publica sin pedirlo. Si el usuario lo
  quiere, necesita también `git push --follow-tags` para que el tag suba.
- Si hay issues de GitHub que esta fase resuelve, es el momento de cerrarlas.
  Puedes listarlas con `gh issue list --state open` y confirmar cuáles antes de
  tocar ninguna.
