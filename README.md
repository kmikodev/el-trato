# el trato

Una aplicación que se usa **una sola vez**: durante una charla interna de dos horas, en
remoto por Google Meet, por unas cuarenta personas a la vez, cada una en su casa y en su
propia red.

Hay **100 € en la mesa y los reparte uno de los dos**. El otro puede aceptar, rechazar o
contraofertar. Y no sabes si al otro lado hay una persona de la llamada o la máquina.

Lo que hace la aplicación no es contar votos. El agente lee **lo que cada uno le escribió a
su contraparte para convencerla**, agrupa las estrategias que nadie definió de antemano,
nombra la premisa que casi todos comparten sin darse cuenta, y escribe el contraargumento
que la ataca. Después se vuelve a repartir, y el movimiento se mide en euros.

La tesis, que alguien tiene que poder repetir al salir: *cuarenta personas regatearon con
alguien que no sabían si era humano; la máquina leyó lo que escribieron, les dijo qué creían
todos sobre el otro sin haberlo dicho, y entonces repartieron distinto.*

El juego entero, con sus cuatro tiempos y todo lo que se le ha atacado, está en
`DILEMAS.md`. El razonamiento de por qué es ésta y no otra, en `CONCEPTO.md`. El sistema de
diseño que gobierna las pantallas, en `DESIGN.md`. Dónde estamos hoy, en `ESTADO.md`.

## Lo que está decidido

- **La charla es en remoto, por Google Meet.** No hay sala, ni proyector, ni wifi
  compartido: cada asistente en su casa, con su red, con Meet en un portátil.
- **La aplicación es el trato**, en la forma de arriba.
- **La conversación tiene tres tiempos**: ofreces y escribes lo que le dirías; te aceptan o
  te contraofertan con su cifra y su argumento; cierras o te plantas. Y la apuesta de
  persona o máquina se hace al final, con los dos leídos.
- **La segunda votación se pregunta dos veces**, una antes de que el agente hable y otra
  después. El delta entre las dos es lo único que se le puede atribuir al agente, y sin
  partirlo la frase con la que cierra la charla no se sostiene.
- **El sistema de diseño**, en `DESIGN.md`: cinco colores, dos monoespaciadas y las reglas
  que impone ver esto por Meet comprimido, que mandan sobre lo demás.
- **Quince pantallas dibujadas** en `mockups/`, en HTML estático, gobernadas por `DESIGN.md`.
- La vista común vive en dos sitios a la vez: el ponente la comparte y además cada asistente
  puede abrirla en su navegador.
- Esa vista común es una lluvia tipo Matrix **acoplada a datos reales**, no un fondo
  decorativo.
- Tiene que haber **un agente que razone de verdad**, no un `if` disfrazado.
- **Despliegue serverless en Google Cloud, con dominio propio.** El front en Firebase
  Hosting, el estado en Firestore en modo nativo y el análisis del agente en Cloud Run. Todo
  en `europe-southwest1` (Madrid), que es **la región permanente** de la base de datos: no
  se puede cambiar sin crear otro proyecto.

## Lo que no está decidido

Lo que bloquea antes de construir:

- **Si la contraparte es siempre la máquina.** Es la primera y no es una decisión de
  esquema: decide si hay emparejamiento, y sin emparejamiento no hay barrera, ni pagos
  cruzados, ni la mitad del modelo de datos. Si se acaba ahí, la pregunta «¿persona o
  máquina?» tiene que cambiar y con ella media charla.
- **El enunciado exacto.** La forma está elegida; las palabras no, y tiene dos agujeros: que
  el ultimátum arrastra una respuesta socialmente correcta —«la mitad»—, y que la premisa
  que produce está en los libros en vez de ser sobre esta empresa.
- **La cifra de la oferta.** Un binario «mitad o menos» no da un número con el que pagar, y
  pedir la cifra ablanda además el distintivo moral del botón.
- **El identificador de dispositivo.** Sin él no hay emparejamiento ni destape. Las maquetas
  ya lo presuponen.
- **La sincronía.** Hay dos puntos en los que unos esperan a otros, y hay que decidir dónde
  está el corte y qué pasa con el que no contesta.
- **Si el dinero es real**, quién lo paga y cuánto. Es la decisión que más cambia el
  comportamiento, y la única de coste que importa: lo técnico entero cuesta menos de 20 €.
- **El presupuesto de horas.** La estimación disponible pone el trato en unas 80 horas en su
  forma mixta y unas 55 si la contraparte es siempre la máquina. Ese absoluto no es de fiar
  —tres estimaciones del mismo trabajo dieron 64, 19 y 16—, así que el número hay que
  fijarlo a mano y no leerlo de ahí.
- **Cuánto tarda de verdad el tiempo 2** en un móvil. De ese número depende que el juego
  quepa en la charla, y se mide con ocho personas y un formulario.

Abiertos también el dominio —lo único con plazo externo real— y buena parte del guion. La
lista completa se mantiene al final de `CONCEPTO.md` y en `DILEMAS.md`.

## Estado

Repositorio nuevo, con la aplicación ya elegida y dibujada entera. **No hay una línea de
código.** `ESTADO.md` dice dónde estamos y qué es lo siguiente.
