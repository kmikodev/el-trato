# el trato

Qué aplicación se construye, por qué es ésta y no otra, y qué queda sin decidir.
El README resume; aquí está el razonamiento, que es lo que se cuenta en la charla.

## Qué hace

Hay **100 € en la mesa** y los reparte uno de los dos. En cuatro tiempos:

1. **La oferta** *(móvil, un minuto)*. Eliges cuánto le das al otro y escribes lo que le
   dirías para que lo acepte. Eso que escribes no es una opinión: es **un intento de
   persuasión**, y es material mucho mejor para el agente que una postura, porque la
   retórica se agrupa sola.
2. **La respuesta.** Tu contraparte acepta, o **contraoferta** con su propia cifra y su
   propio argumento, respondiendo a lo que tú escribiste. Y no sabes si es una persona de la
   llamada o la máquina.
3. **Cierras o te plantas.** Si te plantas y no lo acepta, cero los dos. Después apuestas:
   ¿era persona o máquina?
4. **El destape**, sólo para ti: cuánto cobras, quién era, y si acertaste.

Y entonces empieza la aplicación de verdad, en la vista común de 16:9. El agente **no cuenta
votos**. Lee los cuarenta intentos de persuasión y hace cuatro cosas seguidas:

1. Extrae el argumento que hay detrás de cada frase.
2. Los agrupa en estrategias **que nadie definió de antemano**.
3. Localiza la premisa que la mayoría comparte sin darse cuenta de que la comparte.
4. Escribe el contraargumento que ataca esa premisa.

Más tres cifras que sólo existen porque hubo juego: cuántos acertasteis si era persona o
máquina, a quién le fue mejor, y **qué aceptó la máquina que una persona rechazó**. Y luego
se reparte otra vez, y el movimiento se mide en euros en vez de en gente que cambia de bando.

## Por qué ésta

Hubo cinco candidatas y ganó **el dilema**: una pregunta de opinión con dos posturas
defendibles, cuarenta justificaciones, y el agente buscando la premisa compartida. Las otras
cuatro cayeron por razones concretas. **El oráculo** (cuarenta conversaciones privadas en
paralelo) desperdicia la simultaneidad y premia abandonar la charla diez minutos. **El
tribunal** (cuatro agentes deliberando sobre el caso de un asistente) convierte a treinta y
nueve personas en espectadores. **El Turing invertido** (la sala vota qué texto es de la
máquina) no tiene agente, tiene una generación, y se rompe justo con cuarenta porque votar
exige leer y no caben cuarenta textos en una pantalla. **La sala contra el agente** es la más
divertida y por eso mismo se lleva la atención y no tiene cómo devolverla.

Tres evaluadores independientes eligieron el dilema **por tres razones distintas**: que es
la única cuyo bucle termina solo, que el patrón es fan-in —cuarenta líneas entran, una
llamada sale—, y que lo que aparece en la pantalla común lo escribe la sala.

**Y entonces cambió de forma.** El dilema de opinión se convirtió en el trato, con dinero en
medio y una contraparte que puede ser humana o máquina. Lo que se gana está en `DILEMAS.md`
entero; lo que importa aquí son las tres cosas que justifican el cambio:

- **El material es mejor.** Un intento de persuasión se agrupa mejor que una opinión.
- **El «Turing invertido» vuelve por la puerta de atrás y ahora sí funciona.** La restricción
  que lo mató —votar exige leer cuarenta textos— no aplica: cada uno lee **uno solo**, el
  suyo, en su móvil, y adivina en privado.
- **El contrafactual que el análisis necesitaba cae gratis.** El ensayo en seco pidió una
  sola cosa para subir su confianza: saber qué aceptarían ellos desde la otra silla. El
  tiempo 2 del juego produce ese dato sin añadir nada, y no se vio venir.

## Lo que costó el cambio, dicho entero

El juego pasó por `producto`, `viabilidad` y `charla` en paralelo, en frío y sin verse entre
ellos, con una instrucción explícita: no juzgar si les gustaba, sino **si sobrevive a que la
independencia entre asistentes ya no exista**. Porque debajo de las tres razones de la
elección original había un supuesto que nadie escribió porque era el agua: que la interacción
de cada asistente es independiente de la de los demás. El emparejamiento lo rompe.

**El marcador fue dos adelante con reservas y un no.** Está entero en `DILEMAS.md`. Lo que
hay que tener presente mientras se construye:

- **El bucle que terminaba solo está muerto y no lo sustituye nada.** No es reparable por
  diseño: no se puede conversar con un desconocido y terminar sin depender de él.
- **El fan-in está muerto**, pero lo que protegía se recompra barato: las llamadas se hacen
  desde Cloud Run y no desde cuarenta navegadores, con concurrencia alta, una instancia
  mínima durante la charla, reintentos con backoff e idempotencia por turno.
- **La degradación está muerta y no se recompra**, por una razón precisa: *el trato elimina
  la posibilidad de precomputar. Una negociación no se puede precomputar.* Si el modelo cae
  **antes** de empezar sí hay repliegue —se saltan los tiempos 2 y 3 y se analiza el corpus
  de persuasión del tiempo 1—. El fallo a mitad no tiene ninguno, y mitad es cuando hay carga.
- **La verificabilidad personal, en cambio, mejora.** Antes comprobabas uno-entre-cuarenta
  que te habían leído. Ahora lo compruebas en cinco segundos y de forma adversarial: no
  compruebas que te entendió, compruebas que te ganó.
- **Cambia quién calla.** El eje ya no es técnico contra no técnico: es quién está dispuesto
  a que se proyecte, en cita literal, lo que le escribió a un compañero para bajarle a 30 €.

## Dos hallazgos técnicos que mandan sobre el esquema

**Firestore evalúa las reglas a nivel de documento, no de campo.** Si el cliente puede leer
el documento, lee todos sus campos. El juego se sostiene sobre un secreto —«no lo sabes»— y
el stack elegido empuja el estado al navegador. Así que el esquema tiene que partirse en
**documento público y documento reservado**, y entre cada turno humano hace falta **un paso
de copia saneada por servidor**: A escribe, el servidor copia sin la identidad, B lee. Es lo
que convierte la fase de datos de cuatro horas en veinte.

**En emparejamiento mixto, la latencia delata.** La máquina contesta en 2-3 segundos y una
persona tarda entre 40 y 120, así que «¿persona o máquina?» se responde con un cronómetro en
vez de leyendo, y eso **infla el porcentaje de acierto**, que es la cifra estrella de la
vista común. El arreglo es retener todas las respuestas del tiempo 2 y **liberarlas de golpe**
cuando el ponente corta, lo cual arregla de paso el ritmo de la espera. El precio: la máquina
deja de servir para rellenar huecos deprisa, porque cada hueco cuesta el mismo reloj que uno
humano.

Y un dato que ordena lo demás, para no defenderse de objeciones que nadie ha hecho: **a
cuarenta usuarios ninguna pieza del stack se acerca a un límite.** Todo lo que puede fallar
aquí son fallos de coordinación, de secreto y de reloj humano. Ninguno es de capacidad.

## Lo que ya se aprendió sin escribir código

**El riesgo central es un fallo que suena bien.** Como el enunciado es el único estímulo del
sistema —en remoto no hay pasillo ni conversación lateral—, la premisa que encuentre el
agente puede ser verdadera y circular: el eco del marco del propio ponente. No falla
ruidosamente, falla sonando profundo, y es indistinguible del éxito sin un contrafactual
delante. De ahí que el piloto con personas reales sea condición de supervivencia y no una
mejora opcional.

**Y hay prueba empírica de eso, hecha en una tarde.** Se hizo un ensayo en seco y, en
paralelo, un control con un dilema escrito a propósito para ser flojo. El control devolvió
posturas, premisa, excepciones citadas y autocrítica de calidad comparable. De ahí sale la
única regla operativa que rige desde hoy:

> **La confianza que el agente se da a sí mismo no lleva información sobre la calidad del
> dilema.** Dio 3 sobre 5 en los dos casos. No se puede usar su propio número como control
> de calidad, ni en el ensayo ni en directo.

El control estaba mal elegido, y eso también está escrito: «¿mañana o tarde?» resultó tener
una creencia compartida rica debajo. Hace falta repetirlo con un nulo de verdad.

**El agente no pasa la prueba del `if` disfrazado por sí solo.** Lo único que una tabla de
reglas no puede falsificar es **la cita literal**: si el agente cita textualmente frases del
público, ha tenido que leerlas, y eso lo ve todo el mundo empezando por quien las escribió.
Para la contraparte, el equivalente es la **contraoferta**: para contestar hay que haber
leído el argumento del otro y darle la vuelta con sus palabras. Un umbral no puede.

**La moderación va en la salida, no en la entrada.** Una línea inocua puede ser una inyección
contra el agente que la resume, y entonces la ofensa llega lavada, en tipografía grande, en
la pantalla compartida.

**Y el ataque barato en remoto no es escribir una barbaridad, es el volumen.** Quien más
escribe más pesa en la premisa compartida, y no hay coste social ninguno en mandar cuarenta
líneas desde una consola del navegador.

## Lo que queda pendiente

Ninguna de estas está decidida. Se nombran como lo que son.

**Bloquean antes de construir.**

- **Si la contraparte es siempre la máquina.** Decide si hay emparejamiento, y con ello la
  mitad del esquema. Es lo primero.
- **El enunciado exacto**, con sus dos agujeros: la respuesta socialmente correcta, y que la
  premisa esté en los libros en vez de ser sobre esta empresa. Quién lo escribe y quién lo
  valida.
- **La cifra de la oferta**, porque con un binario el pago no es computable.
- **Identidad por dispositivo.** Deduplicar, emparejar las dos votaciones, limitar el
  volumen y sostener el destape. Un identificador aleatorio en el navegador, sin login ni
  dato personal, las cubre. Queda sin resolver que móvil y portátil son dos identificadores
  para la misma persona, y que por tanto alguien puede emparejarse consigo mismo.
- **La sincronía**: dónde está el corte y qué pasa con el que no contesta.
- **Si el dinero es real.**
- **Si hay piloto con personas reales.** Diez o quince personas y el enunciado exacto, sin
  escribir una línea de código. Es lo único que distingue un hallazgo de un eco, y ahora
  además hay que cronometrar el arco.
- **El presupuesto de horas.**

**Sobre el agente.**

- La coletilla del enunciado: «para que lo acepte» produce el material rico y a la vez
  contamina la premisa, porque instruye modo persuasión. La alternativa separa persuadir de
  justificar y probablemente da frases más pobres. Cabe lanzar las dos mitades de la sala
  con enunciados distintos y comparar.
- Enseñar **por qué** la máquina rechaza, citando la frase de quien ofreció.
- Cuál es la línea base contra la que se compara el agente en directo, si es que se compara.
- Si el análisis se ejecuta dos veces con encuadres distintos y se enseñan las dos salidas.
- Qué hace el agente por debajo de un umbral mínimo de respuestas.
- Repetir el control con un nulo de verdad.

**Sobre la interfaz y el guion.**

- **La pantalla de esperar no existe.** Hay quince maquetas y ninguna cubre el estado en el
  que el instrumento del ponente dice «16 esperando · media 38 s». La barrera está diseñada
  para quien la mira y no para quien la sufre.
- Si la vista común debe existir en un solo sitio. El screen share llega con segundos de
  retraso y comprimido mientras el navegador local va en vivo, así que el ponente narra un
  fotograma que nadie más está mirando.
- Si la lluvia sobrevive al códec de Meet y a competir por CPU con el encoder. Se mide antes
  de construirla, no después.
- Qué se hace con el destape, que es privado por diseño y público en el chat de Meet treinta
  segundos después, y publican los que ganan.
- En qué minuto entra el público, cómo se coloca el replay de la deliberación, y quién opera
  el corte de barrera mientras el ponente habla.
- Anonimato o trazabilidad, y si la sesión se graba.

**Sobre la plataforma.**

- El dominio, que es lo único con plazo externo real.
