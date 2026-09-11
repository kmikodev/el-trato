#!/usr/bin/env bash
# Stop · al terminar de responder
#
# ESTADO.md es el handoff entre sesiones. Si se ha trabajado despues de
# escribirlo, la siguiente sesion arranca creyendo cosas que ya no son verdad.
#
# La comparacion NO es contra el ultimo commit: cerrar-fase actualiza ESTADO.md y
# commitea despues, asi que el commit siempre seria mas nuevo y esto avisaria
# siempre. Se compara contra lo que hay sin commitear, que es el trabajo de hoy.
#
# Avisa, no bloquea: un hook de Stop que bloquea puede dejar la sesion dando
# vueltas sobre si misma, y eso sale mucho mas caro que un despiste.
set -uo pipefail

cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
[ -f ESTADO.md ] || exit 0
git rev-parse --git-dir >/dev/null 2>&1 || exit 0

mtime(){ stat -c %Y "$1" 2>/dev/null || stat -f %m "$1" 2>/dev/null; }

estado=$(mtime ESTADO.md) || exit 0
[ -n "$estado" ] || exit 0

reciente=0; cual=""
while IFS= read -r linea; do
  f=${linea:3}
  f=${f##* -> }                       # renombrados
  [ -f "$f" ] || continue
  case "$f" in ESTADO.md) continue ;; esac
  t=$(mtime "$f") || continue
  if [ -n "$t" ] && [ "$t" -gt "$reciente" ]; then reciente=$t; cual=$f; fi
done < <(git status --porcelain 2>/dev/null)

[ "$reciente" -gt "$estado" ] || exit 0

horas=$(( (reciente - estado) / 3600 ))
if [ "$horas" -ge 24 ]; then
  desfase="$(( horas / 24 )) dias"
elif [ "$horas" -ge 1 ]; then
  desfase="$horas horas"
else
  desfase="$(( (reciente - estado) / 60 )) minutos"
fi

echo "ESTADO.md se escribio $desfase antes del ultimo cambio sin commitear ($cual)." >&2
echo "Si lo que ha pasado en esta sesion le importa a la siguiente, actualizalo." >&2
exit 0
