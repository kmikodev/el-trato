#!/usr/bin/env bash
# PreToolUse · Bash · git commit
#
# En este repositorio una fase se cierra con un acto deliberado, no con un commit
# suelto a mitad de trabajo. Eso está escrito en CLAUDE.md, pero lo escrito se
# olvida: este hook hace que la regla se ejecute siempre.
#
# NO tiene vía de escape para el agente, y es a propósito. Cualquier excepción
# (una marca en el comando, un fichero centinela, una variable) puede fabricársela
# él mismo con otro Bash, así que no sería una cerradura sino un adorno. La única
# excepción que queda fuera de su alcance es una persona: la skill prepara el
# commit y lo ejecuta el humano.
set -uo pipefail

entrada=$(cat)
comando=$(printf '%s' "$entrada" | jq -r '.tool_input.command // ""' 2>/dev/null || printf '')

# El filtro fino ya está en settings.json ("if"), pero no dependemos de él.
case "$comando" in
  *"git commit"*) ;;
  *) exit 0 ;;
esac

cat <<'JSON'
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "En este repositorio no se commitea a mano: una fase se cierra con la skill cerrar-fase, y el commit final lo ejecuta la persona, no el agente. Termina el trabajo, deja el arbol como quieres que quede, y usa /cerrar-fase. La skill dejara escrito el comando exacto para que lo ejecute quien esta delante. Esto no es un permiso que se pueda pedir: el hook deniega siempre."
  }
}
JSON
exit 0
