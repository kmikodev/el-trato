#!/usr/bin/env bash
# PreToolUse · Bash · git commit
#
# En este repositorio `main` no se toca a mano: cambia por merge de una PR
# aprobada, o por el commit único con el que se cierra una fase, y ese lo
# ejecuta una persona. Eso está escrito en CLAUDE.md, pero lo escrito se
# olvida: este hook hace que la regla se ejecute siempre.
#
# Fuera de `main` sí deja pasar, y es una decisión tomada a sabiendas: el ciclo
# de handoff necesita que el dev commitee en su rama `issue-<n>-<slug>` para
# poder abrir la PR. Conviene decir en voz alta lo que eso cuesta: el agente
# puede fabricarse él mismo la excepción con un `checkout -b`, así que sobre las
# ramas de trabajo esto ya no es una cerradura sino una señal. La cerradura
# se aprieta donde importa: `main`, que es lo que queda en el historial que se
# lee en la charla.
#
# Y un límite que conviene no olvidar al enseñar esto: un `PreToolUse` decide
# **antes** de que el comando corra, así que lee la rama de ahora y no la rama
# en la que el commit acabará cayendo. Por eso hay dos comprobaciones y no una.
# Aun así esto no es una demostración de nada: sobre una shell arbitraria
# siempre hay otra forma de llegar (un script, un `eval`, un worktree). Lo que
# de verdad blinda `main` es una regla de protección de rama en el servidor;
# esto de aquí es la señal que se ve antes, en la propia sesión.
set -uo pipefail

deniega() {
  # El motivo viaja dentro de un JSON, así que se escapa con jq y no a mano.
  jq -n --arg motivo "$1" '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: $motivo
    }
  }'
  exit 0
}

entrada=$(cat)
comando=$(printf '%s' "$entrada" | jq -r '.tool_input.command // ""' 2>/dev/null || printf '')

# El filtro fino ya está en settings.json ("if"), pero no dependemos de él.
# Ojo con la forma de escribirlo: `git -C otro/repo commit` no contiene la
# subcadena "git commit", así que una sola alternativa dejaba pasar el caso más
# obvio de commitear en un sitio que no es éste.
case "$comando" in
  *"git commit"*|*"git -C "*commit*|*"--git-dir"*commit*|*"GIT_DIR"*commit*) ;;
  *) exit 0 ;;
esac

# Primera comprobación: que el comando no se mueva antes de commitear.
# Cambiar de rama, cambiar de directorio o apuntar a otro repositorio dentro de
# la misma orden deja ciega a la comprobación de abajo. No se intenta adivinar
# dónde acaba el commit: se deniega y se obliga a que vaya en su propia llamada,
# que además lo deja legible en pantalla, y aquí eso cuenta.
case "$comando" in
  *"git switch"*|*"git checkout"*|*"git worktree"*|*"git -C"*|*"--git-dir"*|*"GIT_DIR"*|*"cd "*)
    deniega "Este comando se mueve antes de commitear (cambia de rama, de directorio o de repositorio), y un PreToolUse decide antes de que nada corra: no puedo saber en que rama caeria el commit. Separalo en dos llamadas, primero el cambio y despues el commit a secas. Asi la comprobacion ve la rama de verdad, y de paso el comando se lee en pantalla."
    ;;
esac

# Segunda comprobación: en qué rama estamos.
# `symbolic-ref` y no `rev-parse --abbrev-ref`: el primero sabe decir el nombre de
# una rama recién creada que todavía no tiene ningún commit, y el segundo no.
# Si no devuelve nombre —HEAD suelto, o no estamos en un repositorio— se trata
# como `main`: si no se sabe dónde cae el commit, no cae.
rama=$(git symbolic-ref --short -q HEAD 2>/dev/null) || rama=main
[ -n "$rama" ] || rama=main

case "$rama" in
  main|HEAD) ;;
  *) exit 0 ;;
esac

deniega "Estas en main (o con el HEAD suelto), y ahi no se commitea a mano: main solo cambia por merge de una PR aprobada o por el commit de cierre de fase, que ejecuta la persona con la skill cerrar-fase. Si esto es trabajo de una issue, cambia a la rama issue-<n>-<slug> y commitea alli, que fuera de main el hook deja pasar. Si es el cierre de una fase, deja el arbol como quieres que quede y usa /cerrar-fase. Esto no es un permiso que se pueda pedir: en main el hook deniega siempre."
