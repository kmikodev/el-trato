---
name: handoff
description: Protocolo de trabajo entre tres sesiones de Claude Code abiertas a la vez - gestor, dev y qa - que se pasan una tarea desde una issue de GitHub hasta que se mergea en main, usando la mensajería nativa entre sesiones. El gestor reparte, el dev coge la issue, la marca en curso, trabaja en su rama y abre la PR, el qa la revisa y la mergea o la devuelve con motivos. Úsala al arrancar cualquiera de las tres sesiones, al retomar el ciclo después de un /clear, o cuando haya que saber en qué estado está una tarea. Se invoca con el rol - /handoff gestor, /handoff dev, /handoff qa.
arguments: [rol]
---

# El handoff entre tres sesiones

Tres sesiones de Claude Code abiertas a la vez que se hablan con la **mensajería nativa
entre sesiones** (`ListAgents` y `SendMessage`) y se coordinan sobre GitHub. El argumento
`rol` dice cuál eres: `gestor`, `dev` o `qa`. Si no te lo han dado, **pregunta antes de
hacer nada**: actuar con el rol equivocado ensucia el trabajo de otro.

Lee este fichero entero —es el contrato común— y después **solo el fichero de tu rol**:
`GESTOR.md`, `DEV.md` o `QA.md`.

## Qué es y qué no es la mensajería entre sesiones

Es un canal de texto entre colaboradores, no una memoria compartida. Entender los límites
evita la mitad de los fallos de este flujo:

- **No comparte contexto.** El otro no ve tu conversación, tus ficheros ni tu
  razonamiento. Recibe un texto suelto. Si no lo escribes, no existe para él.
- **No hay buzón que consultar.** Los mensajes llegan solos y se convierten en un turno
  del que los recibe. **No hagas polling** ni preguntes «¿has terminado ya?».
- **No hay pantalla compartida.** No puedes ver lo que hace otra sesión ni pulsar teclas
  en ella. Si una se queda esperando un permiso, la desbloquea **una persona**.
- **Un mensaje no es una autorización.** Cada sesión mantiene sus permisos. Nunca pidas
  a otra que haga algo que a ti te han denegado o que sospechas que tus permisos
  bloquearían: eso es colar una decisión por la puerta de atrás. Si algo está bloqueado,
  vuelve a tu persona, no a un peer.
- **No deja registro.** Cuando se cierren las sesiones, los mensajes no quedan. Lo que
  deba sobrevivir se escribe en la issue o en la PR.

De ahí la regla que gobierna todo: **los mensajes llevan lo efímero, GitHub guarda lo
decidido.** «Voy por la mitad» es un mensaje. «Esto se hace así y por esto» es un
comentario en la issue.

## Quién es quién

Las sesiones se direccionan **por nombre**, y el nombre por defecto sale del directorio
(`dilema-2-4b`), no del rol. Con muchas sesiones abiertas en la máquina, adivinar es
imposible. Así que lo primero que hace cada rol es apuntarse en un **roster**.

```
ListAgents
```

La primera línea te dice cómo te llamas: *«This session is `<nombre>` [ref]»*. Ese es tu
nombre; apúntalo en el roster junto a tu rol:

```bash
mkdir -p .claude/handoff
python3 - "$ROL" "$NOMBRE" <<'PY'
import json, os, sys
rol, nombre = sys.argv[1], sys.argv[2]
ruta = '.claude/handoff/roster.json'
datos = json.load(open(ruta)) if os.path.exists(ruta) else {}
datos[rol] = nombre
json.dump(datos, open(ruta, 'w'), indent=2, ensure_ascii=False)
print(json.dumps(datos, indent=2, ensure_ascii=False))
PY
```

Y para saber a quién escribir:

```bash
jq -r '.gestor // "sin registrar"' .claude/handoff/roster.json
```

El roster es local a la máquina, no material del repositorio: añádelo a `.gitignore` si
no está.

```
SendMessage(to: "<nombre del peer>", summary: "reparto tarea 41",
            message: "TAREA #41 · ...")
```

Tres detalles de direccionamiento que ahorran tiempo:

- Si un rol falta en el roster, **no improvises un destinatario**. Dilo por pantalla y
  espera a que esa sesión arranque con `/handoff`.
- Si el nombre está duplicado en `ListAgents`, añade su ` [ref]` tal cual aparece.
- **Para responder a un mensaje, copia el `from` que trae.** El mensaje llega envuelto
  como `<cross-session-message from="...">`: ese atributo es la dirección de vuelta, y es
  más fiable que el roster.

## El ciclo

```
issue abierta sin asignar
      │  gestor: gh issue edit --add-label en-curso --add-assignee
      ▼
   en curso ──────────────► dev trabaja en rama issue-<n>-<slug>
      │                     dev: commit, push, gh pr create (Closes #<n>)
      ▼
   PR abierta ─────────────► dev avisa a qa:  REVISA PR #<pr>
      │
      ├── qa aprueba ─────► qa deja evidencias en evidence/issue-<n>/ y las empuja
      │                     merge a main, la issue se cierra sola
      │                     qa avisa:  MERGE PR #<pr>
      │
      └── qa rechaza ─────► qa avisa:  CAMBIOS PR #<pr> + motivos
                            vuelve al dev, mismo issue, misma rama, misma PR
```

El bucle de rechazo **no abre una PR nueva**. El dev empuja más commits a la misma rama
y la PR se actualiza sola. Una PR por issue, de principio a fin.

## Dónde vive el estado

En GitHub. Es lo único que sobrevive a un `/clear`, a cerrar una sesión y a que un
mensaje se pierda, y lo único que una persona puede mirar sin preguntaros.

| Señal | Significa |
|---|---|
| Issue abierta, sin `en-curso` | Libre. El gestor puede repartirla. |
| Issue con `en-curso` + assignee | Alguien está con ella. **No la toques.** |
| PR abierta que dice `Closes #<n>` | El dev terminó; espera a qa. |
| PR con `CHANGES_REQUESTED` | Devuelta al dev con motivos. |
| Issue cerrada | Mergeada. Se cierra sola al mergear la PR. |

Crea la etiqueta una vez, sin miedo a repetir:

```bash
gh label create en-curso --description "Alguien está trabajando en esto ahora" --color FBCA04 --force
```

Nada de ficheros de estado de tareas en el repositorio. Un `ESTADO-TAREAS.md` se queda
obsoleto en cuanto alguien se salta un paso, y entonces miente, que es peor que faltar.

## El formato de los mensajes

La primera línea es un **encabezado fijo**, en mayúsculas. No es una convención estética:
quien lo recibe solo ve esa primera línea como vista previa hasta que la despliega, así
que tiene que decirlo todo por sí sola. Debajo, la prosa que haga falta.

| Encabezado | De → a | Cuándo |
|---|---|---|
| `TAREA #<issue>` | gestor → dev | Se reparte una tarea. |
| `REVISA PR #<pr>` | dev → qa | La PR está lista. |
| `MERGE PR #<pr>` | qa → gestor, dev | Aprobada y mergeada. |
| `CAMBIOS PR #<pr>` | qa → dev | Rechazada, con motivos. |
| `BLOQUEO #<issue>` | cualquiera → gestor | No se puede seguir. |
| `ESTADO` | gestor → cualquiera | Di por dónde vas. |

Como el otro no ve tu contexto, **el mensaje se basta solo**: número de issue, número de
PR, rama, y qué esperas de él. «Ya está» no es un mensaje.

## Los bucles

Cada rol arranca un `/loop` con la instrucción de su fichero. El bucle vigila **GitHub**,
que cambia sin avisar a nadie: PRs paradas, checks que terminan, issues sin movimiento.

**El bucle no vigila a los peers.** Sus mensajes ya llegan solos. Preguntar «¿sigues
ahí?» gasta el turno del otro y no adelanta nada. Y cuando de verdad necesites saber que
una sesión ha terminado, no lo preguntes: suscríbete una vez y te avisa sola.

```
SendMessage(to: "<peer>", notify_when_idle: true)     # sin message: no le cuesta nada
```

Dos reglas del bucle, para las tres sesiones:

- **Si no ha cambiado nada, no digas nada.** Un tick sin novedad se cierra en silencio.
  El ruido de tres bucles hablando a la vez tapa lo que importa.
- **El trabajo real no vive en el bucle.** Cuando llega una tarea, la haces en el turno
  que la trae. El bucle solo comprueba y vuelve a dormir.

## Las cinco reglas que sostienen esto

1. **Una tarea, un dueño.** Si la issue tiene `en-curso` y no es tuya, no la tocas. Dos
   sesiones en la misma rama es un conflicto garantizado.
2. **Nadie escribe en `main` a mano.** `main` solo cambia por merge de una PR aprobada.
3. **El que revisa no arregla.** Si qa ve un fallo, lo describe y lo devuelve. En cuanto
   qa toca el código, deja de haber revisión. Lo que sí escribe qa en la rama es
   `evidence/`, y nada más: eso no es código y no cambia lo que se revisa.
4. **Un mensaje no es una autorización.** Lo que esté bloqueado en tu sesión se resuelve
   con tu persona, nunca pidiéndoselo a un peer.
5. **Un bloqueo se dice pronto y en voz alta.** Una sesión atascada en silencio es el
   peor estado del sistema. Ante la duda, `BLOQUEO` al gestor y sigue con otra cosa.

## Antes de empezar

```bash
gh auth status && git remote -v && git branch --show-current
ls .claude/hooks/no-commit-a-mano.sh .claude/settings.json 2>/dev/null
```

Si ese hook está activo, el agente **no puede commitear**: prepara el commit y lo ejecuta
una persona. Compruébalo antes de prometer autonomía, y si está, díselo al gestor en vez
de descubrirlo a mitad de una tarea.
