# Estado

El handoff entre sesiones: lo de hoy, no las reglas. Las reglas permanentes están en
`CLAUDE.md`, el concepto en `CONCEPTO.md`, el juego en `DILEMAS.md` y el sistema de diseño
en `DESIGN.md`. Este fichero se actualiza al cerrar cada fase y se lee al empezar cualquier
sesión.

**Actualizado:** 11 de septiembre de 2026, al cerrar la fase que publica el repositorio en
`kmikodev/el-trato` y monta encima el ciclo de tres sesiones.

## Dónde estamos

**Repositorio nuevo, arrancando de cero, con la aplicación ya elegida.** Se trae del
anterior lo que sobrevive y vale: el sistema de diseño, las quince pantallas, el juego
escrito con todos sus ataques, la herramienta (agentes, hooks, skill de cierre, MCP) y el
razonamiento de por qué es ésta.

**La aplicación es el trato**, el de repartir los 100 €. Eso ya no se rediscute.

**Sigue sin haber una línea de código de la aplicación.** Lo que sí hay ya es **la forma de
escribirla**: esta fase monta el ciclo de tres sesiones de Claude Code —gestor, dev y qa—
que se reparten una issue, la trabajan en una rama y la mergean por PR, hablándose con la
mensajería nativa entre sesiones y dejando en GitHub todo lo que deba sobrevivir. Está en la
skill `handoff`, con un fichero por rol. La regla que lo gobierna: **los mensajes llevan lo
efímero, GitHub guarda lo decidido.**

## Qué se trae decidido

- **El trato**, con su conversación de tres tiempos y la apuesta de persona o máquina al
  final.
- **La segunda votación partida en dos**, una antes de que el agente hable y otra después.
  El delta entre las dos es lo único atribuible al agente.
- **El sistema de diseño** de `DESIGN.md` y las quince pantallas de `mockups/`.
- **El stack**: Firebase Hosting, Firestore en modo nativo y Cloud Run, todo en
  `europe-southwest1`. Ojo: **la región de Firestore es permanente** y ya no se puede
  cambiar sin crear otro proyecto.

## Qué se decidió en esta fase

- **El ciclo de tres sesiones**, en la skill `handoff`. Una tarea, un dueño; `main` solo
  cambia por merge de una PR aprobada; el que revisa no arregla.
- **El hook `no-commit-a-mano.sh` se afloja fuera de `main`.** Sin eso el dev no puede
  commitear y el ciclo no cierra una sola vuelta. Deniega en `main`, con el HEAD suelto,
  fuera de un repositorio, y en los comandos compuestos que se mueven antes de commitear
  —`git switch main && git commit …` esquivaba la comprobación, porque un `PreToolUse`
  decide antes de que el comando corra y lee la rama de ahora, no la rama donde caerá el
  commit—. Se probó con once casos. **Lo que se pierde está dicho en `CLAUDE.md`:** sobre
  las ramas de trabajo esto ya no es una cerradura sino una señal, porque el agente puede
  fabricarse la excepción con un `checkout -b`. Lo que blindaría `main` de verdad es una
  regla de protección de rama en el servidor, y **no está puesta**.
- **El servidor MCP `playwright`** (`npx @playwright/mcp@0.0.80`), en `.mcp.json`, con sus
  permisos de lectura en `.claude/settings.json`. Sin credenciales.
- **La skill `claude-api`**, con lo que hace falta saber de la Messages API para cuando haya
  que llamarla.
- **El dev trabaja en un worktree propio**, no en una rama del árbol principal. No estaba en
  `DEV.md`, que dice `git switch -c`; se cambia porque aísla al dev del árbol de `main`,
  donde el trabajo se acumula sin commitear hasta que se cierra una fase. **El worktree
  tiene que nacer después del commit de cierre**, o se lleva dentro una copia vieja de
  `.claude/` y con ella el hook que deniega todos los commits.

## Qué bloquea

Por orden, y el primero manda sobre el resto:

1. **Si la contraparte es siempre la máquina.** Decide si hay emparejamiento, y sin
   emparejamiento no hay barrera, ni pagos cruzados, ni la mitad del esquema. No se puede
   escribir el modelo de datos antes de cerrar esto.
2. **El enunciado exacto**, con sus dos agujeros: la respuesta socialmente correcta que
   arrastra el ultimátum, y que la premisa acabe siendo un resultado de los libros en vez de
   algo sobre esta empresa.
3. **La cifra de la oferta.** Con un binario «mitad o menos» el pago no es computable, y
   pedir la cifra ablanda además el distintivo moral del botón. Las dos cosas se arreglan
   juntas o ninguna.
4. **El identificador de dispositivo.** Sin él no hay emparejamiento ni destape, y las
   maquetas ya lo presuponen.
5. **La sincronía**: dónde está el corte y qué pasa con el que no contesta.
6. **Si el dinero es real.**
7. **El presupuesto de horas**, que hay que fijar a mano: la estimación disponible pone el
   trato en unas 80 horas mixto y unas 55 siempre-máquina, pero los absolutos ya han fallado
   tres veces sobre el mismo trabajo (64, 19 y 16).
8. **Cuánto tarda de verdad el tiempo 2** en un móvil. Se mide con ocho personas y un
   formulario, sin una línea de código, y de ese número depende que el juego quepa.

## Lo siguiente

Cerrar el punto 1 y el punto 8, que son los dos que no dependen de nada más y desbloquean
el esquema de datos. Después, el esquema.

La primera tarea que entra en el ciclo es la **#39, la pantalla de esperar**, y entra
**recortada**: solo la primera barrera, la de pool, con el contador público sin nombres. La
segunda barrera y el plazo visible se quedan fuera porque dependen de la #30 y la #29, que
son `pregunta-abierta` y no las decide ni el gestor ni el dev.

Las issues ya están: **39 en `kmikodev/el-trato`**, migradas de las 40 abiertas del
repositorio anterior. Cayeron dos —la prueba del anclaje, que ya no tiene objeto con la
aplicación decidida, y la de elegir almacén de estado, que resolvió el stack— y se abrió una
nueva para el presupuesto, que había quedado cerrado con un número que esta aplicación no
cumple. **Las referencias cruzadas están reescritas a la numeración nueva**, tanto dentro de
las issues como en `DESIGN.md` y `DILEMAS.md`.

## Qué está roto ahora mismo

- **El repositorio anterior sigue en disco a medio desmontar.** En `../DILEMA` quedan
  cuatro documentos viejos y un árbol con todo marcado como borrado, porque los ficheros se
  movieron aquí. Si alguien commitea ahí sin mirar, deja el repositorio vacío y los tags
  `00-inicio` a `03-prototipado` apuntando a un historial que ya no se parece a nada. O se
  congela tal cual como archivo de cómo se decidió, o se devuelve a `f380e63`. No se puede
  dejar a medias.
- **Hay quince maquetas y ninguna es la pantalla de esperar.** El instrumento del ponente sí
  tiene el control de barrera, con «16 esperando · media 38 s»: la barrera está diseñada
  para quien la mira y no para quien la sufre.
- **Firestore no puede guardar un secreto dentro de un documento que empuja al cliente.**
  Las reglas evalúan a nivel de documento, no de campo, y el juego entero se sostiene sobre
  un secreto. Obliga a partir el esquema en público y reservado y a mediar cada turno por
  servidor. Es lo que dispara el coste de la fase de datos.
- **La lluvia no se ha medido por Meet.** Abre `mockups/trato-c1-lluvia.html` a pantalla
  completa, compártela con la cámara encendida y gente conectada, y usa la tecla `P` para el
  patrón de prueba. Hace falta un segundo ojo en otra máquina y otra red: lo que importa es
  lo que llega, no lo que se ve en la máquina del ponente. Los argumentos de `DESIGN.md` §5
  son razonamientos, no medidas.
- **El ensayo en seco tiene un control mal elegido** y sigue sin repetirse. El control fue
  «¿mañana o tarde?», que resultó tener una creencia compartida rica debajo, así que no
  prueba lo que se quería probar. Hace falta un nulo de verdad. Lo que sí quedó demostrado, y
  rige desde hoy: **la confianza que el agente se da a sí mismo no lleva señal sobre la
  calidad del dilema.** Dio 3 sobre 5 en los dos casos.
- **El ciclo de tres sesiones tiene poco que masticar.** De las 39 issues abiertas, casi
  todo lo que no está bloqueado es una **decisión humana** —`pregunta-abierta`— y no trabajo
  de dev. El ciclo funciona, pero no esperes caudal hasta que se cierren las decisiones del
  bloque de arriba.
- No hay código, así que no hay nada más que pueda estar fallando.
