# Estado

El handoff entre sesiones: lo de hoy, no las reglas. Las reglas permanentes están en
`CLAUDE.md`, el concepto en `CONCEPTO.md`, el juego en `DILEMAS.md` y el sistema de diseño
en `DESIGN.md`. Este fichero se actualiza al cerrar cada fase y se lee al empezar cualquier
sesión.

**Actualizado:** 11 de septiembre de 2026, al arrancar el repositorio.

## Dónde estamos

**Repositorio nuevo, arrancando de cero, con la aplicación ya elegida.** Se trae del
anterior lo que sobrevive y vale: el sistema de diseño, las quince pantallas, el juego
escrito con todos sus ataques, la herramienta (agentes, hooks, skill de cierre, MCP) y el
razonamiento de por qué es ésta.

**La aplicación es el trato**, el de repartir los 100 €. Eso ya no se rediscute.

**Sigue sin haber una línea de código de la aplicación.**

## Qué se trae decidido

- **El trato**, con su conversación de tres tiempos y la apuesta de persona o máquina al
  final.
- **La segunda votación partida en dos**, una antes de que el agente hable y otra después.
  El delta entre las dos es lo único atribuible al agente.
- **El sistema de diseño** de `DESIGN.md` y las quince pantallas de `mockups/`.
- **El stack**: Firebase Hosting, Firestore en modo nativo y Cloud Run, todo en
  `europe-southwest1`. Ojo: **la región de Firestore es permanente** y ya no se puede
  cambiar sin crear otro proyecto.

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

Cuando haya remoto, **hay que volver a crear las issues**: el repositorio anterior tenía
cuarenta y una y aquí no hay ninguna. La lista de lo que merece issue está en el bloque «qué
bloquea» de este fichero y al final de `CONCEPTO.md`.

## Qué está roto ahora mismo

- **No hay remoto ni issues.** El `.mcp.json` y la configuración de GitHub vienen del
  repositorio anterior y apuntan a `kmikodev/el-dilema`. Hay que decidir si este proyecto
  usa ese mismo remoto o uno nuevo, y hasta entonces el MCP de GitHub no sirve de nada aquí.
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
- No hay código, así que no hay nada más que pueda estar fallando.
