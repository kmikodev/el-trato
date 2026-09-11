# El trato

Qué se lanza en la charla. **Nada de esto está cerrado todavía** —es la issue #1— pero
la forma ya no es una pregunta de opinión: es un juego con dinero en medio, una
contraparte que puede ser humana o máquina, y un resultado personal que se gana o se
pierde.

## El juego, en cuatro tiempos

### 1 · La oferta *(móvil, un minuto)*

> **Hay 100 € en la mesa. Los repartes tú.**
>
> Tu contraparte sólo puede aceptar o rechazar. Si acepta, cobráis los dos lo que hayas
> dicho. Si rechaza, no cobra ninguno de los dos.
>
> **LA MITAD** · **MENOS DE LA MITAD**
>
> Y escribe lo que le dirías para que lo acepte.

Eso que escribe no es una opinión: es un **intento de persuasión**. Es material mucho
mejor para el agente que una postura, porque la retórica se agrupa sola.

### 2 · El juicio *(móvil, un minuto)*

Te llega **la oferta de otro**: una cifra y su argumento. Dos botones, aceptar o
rechazar. Y una tercera cosa, que es donde está la gracia:

> **¿Esto lo ha escrito una persona o la máquina?**

No lo sabes. Puede ser cualquiera de los dos.

### 3 · El destape *(móvil, personal)*

Tres líneas, sólo para ti:

- Cobras **X €**, o cero.
- Tu contraparte era **una persona** / **la máquina**.
- **Acertaste** / **fallaste**.

### 4 · La vista común *(16:9, el fan-in de siempre)*

Aquí entra la aplicación que ya estaba diseñada, con los cuatro pasos intactos: el
agente lee los cuarenta argumentos, agrupa las estrategias que nadie definió, nombra la
premisa que casi todos compartís sin saberlo y escribe el contraargumento.

Más tres cifras que sólo existen porque hubo juego:

- **Cuántos acertasteis** si era persona o máquina. Si sale cerca del azar, ése es el
  momento de la charla y no hace falta añadirle nada.
- **A quién le fue mejor**, a los que negociaron contra una persona o contra la máquina.
- **Qué aceptó la máquina que una persona rechazó.** Aquí está enterrada la mejor
  posibilidad: si la máquina acepta el 10 % porque diez es más que cero, entonces *los
  que más cobrasteis no fue por convencer mejor: fue porque os tocó la máquina*.

Y luego la segunda vuelta: **¿cuánto ofrecerías ahora?** El movimiento ya no se mide en
gente que cambia de bando, se mide en euros.

## La máquina que hace de contraparte

Haiku para las contrapartes: son cuarenta llamadas cortas y simultáneas, y ahí mandan la
latencia y el coste, no la capacidad. Para el análisis final, que es una sola llamada
larga, hace falta algo mayor.

Pero el modelo no es sólo una cuestión de factura, **es el mando del juego**: si la
máquina se nota demasiado, no hay tensión; si no se nota nada, no hay juego tampoco.
De ahí una posibilidad que no cuesta nada y que mediría algo de verdad delante de la
sala: **que la mitad de las contrapartes máquina sean Haiku y la otra mitad Sonnet**, y
enseñar los dos porcentajes de acierto por separado. Es un experimento real, en directo,
con n≈40, y se cuenta en una línea.

## Lo que este cambio se lleva por delante

Cinco cosas, y ninguna es cosmética. Van aquí para que se decidan, no para darlas por
resueltas.

**1 · Ya no es sólo fan-in.** Son cuarenta llamadas cortas en paralelo y luego una
larga. El pico de concurrencia cae ahora sobre el modelo, que es exactamente lo que
`viabilidad` quería evitar cuando eligió esta aplicación. Con Haiku y prompts cortos es
asumible, pero contradice un argumento escrito en `CONCEPTO.md` y hay que decirlo.

**2 · El identificador de dispositivo (#2) pasa de conveniente a imprescindible.** Hay
que emparejar, entregarte la oferta de otro y devolverte un resultado tuyo. Sin
identificador no hay juego, así que #2 deja de ser una decisión de esquema y pasa a
bloquear.

**3 · Aparece un problema de sincronía que antes no existía.** El tiempo 2 no puede
empezar hasta que haya ofertas que repartir, así que los rápidos esperan a los lentos.
Hace falta un corte, y un plan para el que no contesta: si veinte personas no ofertan,
veinte personas se quedan sin nada que juzgar. La respuesta probable es que la máquina
rellene los huecos, lo cual es elegante y a la vez es hacer trampa, y hay que decidirlo.

**4 · ¿El dinero es real?** Es la decisión más importante que queda abierta y cambia el
comportamiento por completo. Cuarenta personas por hasta 100 € no es un presupuesto
razonable. Las salidas plausibles: un bote único que se sortea entre los que cobraron,
un premio simbólico, o dinero ficticio y asumir que la gente juega distinto. No es lo
mismo, y la literatura del ultimátum dice que no es lo mismo.

**5 · El «Turing invertido» ha vuelto por la puerta de atrás, y ahora sí funciona.**
Fue una de las cuatro candidatas descartadas en la fase 02, y se descartó por una razón
concreta: votar exigía leer, y no se pueden enseñar cuarenta textos en una pantalla. Aquí
cada uno lee **uno solo**, el suyo, en su móvil, y adivina en privado. La restricción que
lo mató no aplica a esta forma. Que una idea descartada vuelva por otro camino y
sobreviva es, en sí mismo, material de la charla.

## Por qué se abandonaron los dilemas de opinión

Se escribieron ocho candidatos de opinión antes de esto —la prioridad, el que no rinde,
el error en público o en privado, el recién llegado, el brillante difícil— y el criterio
que se usó para juzgarlos sigue valiendo para juzgar el enunciado de arriba:

1. **Dos posturas defendibles de verdad**, que partan la sala, no un 90/10.
2. **Sin respuesta socialmente correcta**, o salen cuarenta frases iguales.
3. **Todo el mundo tiene experiencia directa**, técnicos y no técnicos.
4. **Sin coste profesional por contestar honestamente**: es una charla interna y tu jefe
   lee lo que escribes.
5. **La postura no se adivina con el cargo**, o el agrupamiento reproduce el organigrama.
6. **Tiene que haber más de una premisa compartida posible.** Si sólo se te ocurre una,
   la has metido tú en la pregunta y que el agente la encuentre no demuestra nada.
7. **La premisa tiene que ser atacable**, no sólo nombrable.
8. **Se contesta en una frase y desde lo vivido.**

El juego los cumple los ocho, y cumple mejor que cualquiera de ellos el 6: hay al menos
cuatro supuestos compartidos distintos enterrados ahí —que la contraparte decide con la
cabeza, que lo que hay que justificar es el reparto, que el otro quiere dinero, que hay
algo de lo que convencerle— y cuál sale no lo decide quien escribe el enunciado.

Lo que el juego **no** cumple, y los dilemas de opinión sí: se construía en una tarde.
Esto no.

---

# El ensayo en seco, y qué salió

Hecho el 11 de septiembre de 2026, antes de escribir una línea de la aplicación. Un
agente escribió 37 respuestas al enunciado **sin saber que otro iba a buscar una premisa
compartida**; otro agente distinto las leyó en frío e hizo los cuatro pasos, con permiso
explícito para contestar «aquí no hay nada». En paralelo se hizo lo mismo con un dilema
deliberadamente flojo como control.

La sala simulada salió **22 a la mitad y 15 a menos**: parte la sala de sobra, que era el
criterio 1.

## Lo que encontró

La premisa que nombró, sobre 33 de las 37:

> **EL OTRO NO TIENE ARGUMENTOS. SÓLO TIENE UN BOTÓN.**

Y el hallazgo detrás es mejor que la frase: los dos bandos modelan al desconocido de
forma **opuesta y coincidente**. Quien ofrece menos lo trata como una calculadora que
debe llegar a la conclusión que le conviene; quien ofrece la mitad lo trata como un
temperamento que conviene no encender. Ninguno de los dos le concede una razón que
pudiera contestarles. Cuando alguien anticipa un rechazo lo nombra siempre como defecto
del que rechaza —orgullo, rencor, principios, dignidad, picarse—, nunca como un
desacuerdo con contenido.

El contraargumento que escribió no ataca a ningún bando, sino a la contradicción entre
los dos: veintidós reparten mitad *porque creen que el otro sí dirá que no*, y quince
reparten treinta *porque creen que ese no es una estupidez*. **No pueden tener razón los
dos sobre las mismas 37 personas.**

## Lo que se puso de pega él solo, y que vale más

Se dio **3 sobre 5** de confianza, y la razón es exactamente el riesgo que `CONCEPTO.md`
nombra como central del proyecto:

> El enunciado dice «escribe lo que le dirías **para que lo acepte**». Eso instruye modo
> persuasión, y el modo persuasión produce mecánicamente frases que le dicen al otro lo
> que tiene que concluir. Parte del hallazgo es un artefacto del enunciado.

Es decir: **el eco del marco del ponente, cazado en directo y por la propia máquina**,
sin que nadie se lo preguntara. Esto es material de la charla de primer orden, y cambia
la conversación: el riesgo deja de ser teórico y pasa a tener una causa concreta y una
medida.

Lo que según él sobrevive al descuento es el *tono*, y el argumento es bueno: persuadir
no obliga a llamar rabieta al desacuerdo, y una frase como *«sé que 30 es poco y tendrías
razón en rechazarlo, pero te lo pido»* costaba lo mismo de escribir y **no la escribió
nadie**.

## Lo que pidió para estar seguro, y que el juego ya tiene

Una sola cosa, y barata: **saber qué aceptarían ellos**. Sólo hay un dato desde esa silla
en las 37. Si la sala entera aceptase cualquier cosa, la premisa se cae —no estarían
despreciando el no, estarían describiendo bien un no que no existe—. Si media sala
dijese «yo rechazo 20», la premisa sube de 3 a 5, porque estarían negando en el otro
justo lo que ellos harían.

**El tiempo 2 del juego produce exactamente ese dato.** Aceptar o rechazar una oferta
real es responder desde esa silla. El contrafactual que el análisis necesita no hay que
añadirlo: ya estaba en el juego, por otro motivo. Es el mejor argumento a favor de haber
cambiado de una pregunta de opinión a un juego, y no se vio venir.

## Y que la elección no estaba forzada

Ofreció una segunda premisa igual de defendible —«estos 100 € no son de nadie, y por eso
nadie pelea», sostenida por trece respuestas explícitas— y explicó por qué la descartó:
su contraargumento ataca al ejercicio en vez de a la sala, así que acaba en «vuestro
dilema era falso», que es cierto y no mueve a nadie en la segunda votación.

Que hubiera dos y que descartara una por su efecto en la sala es lo que dice que el
criterio 6 se cumple: **cuál sale no lo decidió quien escribió el enunciado.**

## Lo que queda tocado

- **Ocho de las 37 no contenían argumento ninguno** («mitad, siguiente»). Con ésas se
  está infiriendo de un silencio. Un minuto desde el móvil y delante de compañeros
  selecciona respuestas cortas y jocosas, y eso es un dato sobre el formato, no sobre la
  gente.
- **Hay que decidir la coletilla del enunciado.** «Para que lo acepte» es lo que produce
  el material rico y a la vez lo que contamina la premisa. La alternativa que propuso
  —«escribe por qué tu reparto es el correcto»— separa persuadir de justificar, pero
  probablemente da frases más pobres. Puede que haya que lanzar las dos mitades de la
  sala con enunciados distintos y comparar, que es una forma de contrafactual que cabe
  en la misma charla.

---

# El ataque, y qué sobrevive

Veredicto del abogado del diablo sobre el juego: **no sobrevive en la forma escrita
arriba.** Sobrevive una variante. Lo que sigue es lo que hay que resolver antes de
escribir una línea de código, ordenado por lo que duele.

## 1 · El ultimátum tiene respuesta socialmente correcta, y está en el primer botón

Es la objeción principal y es de enunciado, no de ejecución. El criterio 2 se incumple
**por inspección**: el juego del ultimátum es famoso precisamente porque la gente ofrece
la mitad. En una charla interna, donde el criterio 4 dice que tu jefe lee lo que
escribes y donde `DESIGN.md` §4 convierte la cita literal en componente de primera
clase, «MENOS DE LA MITAD» no es una postura: es **una etiqueta moral que te pones tú
solo**, y el binario la convierte en distintivo en vez de en número.

Si sale 34/6, entonces: un solo grupo de estrategias, todos los argumentos diciendo la
misma nobleza con otras palabras, casi ningún rechazo, y la cifra estrella —qué aceptó
la máquina que una persona rechazó— calculada sobre dos o tres ofertas bajas.

Al fallar el 2 arrastra el 1 (no parte la sala) y el 4 (sí hay coste profesional).

**Lo que hay en contra de esta objeción:** la sala simulada de este mismo ensayo salió
**22/15**, no 34/6, y varias respuestas modelaron explícitamente la vergüenza —«no quiero
ser el del 80-20 porque esto se proyecta»—. Es un dato real, pero débil: al simulador se
le pidió que repartiera «como saldría de verdad» y no se le cargó el riesgo profesional.
Esto **lo decide el piloto**, no la discusión.

## 2 · «Menos de la mitad» no tiene cifra, y el pago no es computable

Agujero directo. El tiempo 1 recoge un binario, pero el tiempo 2 entrega «una cifra» y
el tiempo 3 paga «X €». O el número lo inventa la aplicación —y entonces se te paga por
un reparto que no elegiste y el juez juzga un número que nadie propuso— o falta un input
que no está en el diseño.

Lo bueno: **el arreglo obvio, pedir la cifra, ablanda también el distintivo moral del
punto 1.** Las dos cosas se arreglan juntas o ninguna.

## 3 · La viga maestra que nadie enunció

Los tres evaluadores de la fase 02 dieron tres razones distintas, y eso se celebró como
prueba de que no había un único punto de fallo. Debajo de las tres había un supuesto que
nadie escribió porque era el agua: **la interacción de cada asistente es independiente de
la de los demás.**

`producto` eligió por verificabilidad personal —sólo tiene sentido si lo que ves depende
sólo de lo que escribiste—. `viabilidad` eligió por fan-in y por degradación —el camino
de escritura es trivial *porque no hay coordinación*—. `charla` eligió porque la mitad no
técnica produce el material igual de bien —cierto si el bucle es escribir y listo—.

El juego sustituye la independencia por un emparejamiento con barrera. **Las tres razones
quedan dañadas y dos muertas**: el fan-in, y el bucle que terminaba solo, que ahora
termina cuando termina el último de cuarenta. La diversidad de razones no protegió de
nada, porque el cambio no atacó los razonamientos: atacó el objeto.

## 4 · La contraparte no pasa la prueba del `if` disfrazado

El analista final sí la pasa. La contraparte no, y es la que se lleva el presupuesto y el
riesgo nuevos. Sustituye Haiku por treinta líneas escritas a mano la noche antes y una
regla «acepto cualquier cosa mayor que cero»: **nadie lo nota, y las líneas humanas
pasarían mejor el test de persona o máquina que las de Haiku.** Encima, la cifra que este
documento identificaba como su mejor momento —la máquina acepta el 10 % porque diez es
más que cero— es un hallazgo sobre un umbral presentado como hallazgo sobre un agente.

Y durante la construcción hay un incentivo vivo a hacerla **más tonta**, porque una
contraparte determinista es más rápida, más barata y más consistente. Es la primera vez
en este proyecto que la restricción del README y la calidad de la demo apuntan en
direcciones opuestas.

**Arreglo mínimo:** a quien la máquina rechaza, enseñarle *por qué*, citando su propia
frase. Es lo único de todo el tiempo 2 que una tabla no puede falsificar.

## 5 · La segunda votación deja de medir al agente

Entre la primera oferta y la segunda pasan cuatro cosas: te rechazan o no, descubres que
era una máquina, ves tres estadísticas que dicen que los que cobraron fue por suerte, y
*luego* el agente habla. Si alguien sube su oferta es por el refuerzo económico recibido
en privado dos minutos antes, que es la señal conductual más potente que existe.

La frase con la que cierra la charla pasa de comprobable a indefendible, y hay gente
técnica en la sala que lo va a decir en el chat.

**Arreglo barato, y es el mejor de todo el informe:** partir la segunda votación en dos,
una justo después del destape —antes de que el agente hable— y otra después de la
premisa. **El delta entre las dos es el único efecto atribuible al agente.** Cuesta una
pantalla y convierte el problema en el mejor momento metodológico de la charla.

## 6 · El destape es público treinta segundos después

La privacidad del tiempo 3 es ficticia: el chat de Meet se llena de «me ha tocado la
máquina y he acertado». Publican los que ganan, no los que pierden. Dos minutos más tarde
la vista común dice «acertasteis el 47 %» y la muestra vivida de la sala dice que casi
todos acertaron. El ponente tiene que defender el número de su aplicación contra la
experiencia de la sala, sin poder auditar ninguna de las dos.

## 7 · La premisa deja de ser sobre esta empresa y pasa a estar en los libros

Los ocho dilemas de opinión eran sobre el trabajo: la premisa habría sido *cómo piensa
esta gente*. La del ultimátum va a ser un resultado clásico y googleable, y alguien de la
mitad técnica lo va a reconocer en voz alta. Ambientarlo en algo con forma de trabajo lo
arregla y reintroduce el coste profesional del punto 1. Hay que elegir a sabiendas.

## Y la pregunta directa: ¿es la misma aplicación?

**No.** Es una aplicación nueva que ningún evaluador ha visto y que se está colando por
la ventana. Comparte el tiempo 4 entero con la que ganó, y el material que produce es
mejor —un intento de persuasión se agrupa mejor que una opinión—. Pero cambia el patrón
de carga, cambia el modelo de estado de una tabla append-only a un esquema con
emparejamiento, asignación, pagos y barrera —lo que duplica el alcance de la fase 03, que
es la siguiente—, cambia el bucle de una interacción a cuatro acopladas, y daña las tres
razones por las que se eligió.

> La forma correcta de meterla no es discutirla: es volver a pasarla por `producto`,
> `viabilidad` y `charla` como quinta candidata, en frío, contra la que ganó. La
> deliberación de la fase 02 es material de la charla precisamente porque se hizo así.
> Saltársela ahora es el único movimiento de este proyecto que no se puede enseñar en
> pantalla.

## Las dos alternativas aburridas

**A · Contrapartes pregrabadas.** El piloto que `CONCEPTO.md` ya declara condición de
supervivencia no sólo valida el enunciado: **produce el corpus**. Quince personas juegan
el tiempo 1 una semana antes. El día de la charla cada asistente recibe una oferta del
banco, mitad humanas de verdad y mitad de la máquina. Desaparecen la barrera, la
sincronía, los jueces sin material y los proponentes sin juez; cada llamada al modelo
vuelve a ser independiente; y vuelve la degradación que ganó la fase 02. Se pierde
negociar contra alguien que está en la llamada, que es la tensión principal y la anécdota
que más se contaría al salir.

**B · El dilema de opinión tal cual, más una sola cosa:** que una de las cuarenta
justificaciones que caen en la lluvia la haya escrito la máquina, y que la sala vote
cuál. Cero emparejamiento, cero dinero, cero identidad nueva, cero barrera, `DESIGN.md`
intacto, segunda votación limpia, y el Turing invertido vuelve por la misma puerta de
atrás. Se pierde el dinero y se pierde «qué aceptó la máquina que una persona rechazó»
—que, según el punto 4, era un hallazgo sobre un umbral—.

---

# El control, y por qué es el resultado más incómodo

Al mismo analista, con el mismo encargo palabra por palabra y el mismo permiso explícito
para decir «aquí no hay nada», se le dio un dilema escrito **a propósito para que fuera
flojo**: «¿se trabaja mejor por la mañana o por la tarde?».

Devolvió cinco posturas emergentes que cortan en perpendicular a las dos opciones, con
recuentos que suman 37 y citas literales. Devolvió una premisa —**MI MEJOR HORA ES
SIEMPRE LA MISMA**, sobre 33 de 37— con sus cuatro excepciones citadas una a una.
Devolvió un contraargumento que usa dos contradicciones internas de la propia sala y
acaba en una consecuencia concreta: *mientras lo llaméis «yo soy de mañana», nadie va a
mover la daily de las 9:15*. Se dio **3 sobre 5**. Avisó de que el formato de un minuto
fabrica frases categóricas. Y ofreció una segunda premisa, explicando por qué no la
elegía.

Es decir: **el mismo número de confianza, la misma estructura, el mismo tipo de
autocrítica y una calidad comparable que el dilema bueno.** Y el contraargumento del
control, honestamente, termina mejor.

## Lo que esto demuestra y lo que no

**No demuestra** que la máquina fabrique profundidad de la nada, porque **el control
estaba mal elegido y es culpa de quien lo diseñó.** «¿Mañana o tarde?» es una pregunta
floja encima de una creencia compartida que sí existe y que además es rica. Falla el
criterio 6 y ninguno de los otros. Un control de verdad necesita material **sin sustrato
común ninguno**, y eso no es lo que se hizo aquí.

**Sí demuestra**, y esto es operativo y sirve desde hoy:

> La confianza que el agente se da a sí mismo no lleva información sobre la calidad del
> dilema. Dio 3 sobre 5 en los dos casos. **No se puede usar su propio número como
> control de calidad**, ni en el ensayo ni en directo.

Y deja una lectura optimista que tampoco se puede descartar con estos datos: que la
aplicación funciona sobre material bastante más pobre de lo previsto, lo cual sería una
buena noticia sobre su robustez. **Con este experimento no se puede distinguir una
lectura de la otra**, que es exactamente lo que `CONCEPTO.md` decía cuando escribió que el
fallo es indistinguible del éxito sin un contrafactual delante. Ahora hay una prueba
empírica de esa frase, hecha en una tarde y sin código.

## Lo que sigue de aquí

- **Repetir el control con un nulo de verdad**: 37 respuestas a algo sin creencia
  compartida debajo. Si de ahí sale una premisa con 3 sobre 5, la conclusión es la mala y
  hay que saberlo antes de la charla, no durante.
- **Llevar el contrafactual a la sala** en vez de confiar en que se note. Enseñar dos
  salidas y dejar que el público juzgue cuál está mejor sostenida convierte el riesgo en
  el contenido, que es la única defensa que no depende de tener suerte.
- **No prometer en el guion que la premisa es verdadera.** Prometer que es *comprobable*:
  ahí están las 37 frases, ahí están los recuentos, ahí están las excepciones citadas.
  Eso sí se sostiene delante de gente técnica.

---

# La conversación pasa a tres tiempos

Cambio del 11/09/2026, después del ataque. La partida deja de ser una tirada y pasa a ser
un intercambio corto y acotado:

1. **Ofreces** una cifra y escribes lo que le dirías.
2. **Te contesta:** acepta, o **contraoferta** con su propia cifra y su propio argumento.
3. **Cierras o te plantas.** Si te plantas y no lo acepta, cero los dos.

Tres mensajes, dos de ellos suyos. Y la apuesta de persona o máquina se hace al final,
con los dos leídos.

## Lo que esto arregla, y es la objeción más fea que había

La objeción 4 del abogado del diablo decía que **la contraparte no pasa la prueba del
`if` disfrazado**: con una sola tirada, «acepto cualquier cosa mayor que cero» produce
exactamente la misma partida, nadie lo nota, y encima treinta líneas escritas a mano la
noche antes pasarían mejor por humanas que Haiku. Tenía razón.

Una contraoferta no se falsifica así. Para contestar *«ya, y las tuyas son 55 o 0; yo
también sé contar»* hay que haber leído el argumento del otro y darle la vuelta con sus
propias palabras. Un umbral no puede. Una tabla de treinta respuestas escritas de
antemano tampoco, porque no sabe qué le van a escribir.

**Es la primera vez en este proyecto que un cambio pedido por gusto arregla un problema
de fondo.** Conviene no confundirse: lo arregla por casualidad, no por diseño.

Y da una pantalla nueva en la vista común —`trato-c5b`— que es de las mejores que hay:
enseñar el hilo completo que más gente confundió con una persona, y señalar que lo que
delata que no lo era es justo lo que lo hacía convincente.

## Lo que esto empeora, y hay que decirlo

**La barrera se dobla.** Ya no hay un punto de sincronía, hay dos: nadie puede contestar
hasta que haya ofertas, y nadie puede cerrar hasta que haya contraofertas. El problema
que el abogado del diablo describía como «veinticuatro pasan y dieciséis se quedan en
esperando» ocurre ahora dos veces, y la segunda con gente que ya ha invertido dos minutos.

**Y mata la alternativa de las contrapartes pregrabadas.** Una oferta humana guardada del
piloto sirve para una tirada; no sirve para conversar, porque no puede responder a lo que
tú escribas. Así que la salida más limpia que había para el problema de sincronía deja de
estar disponible, y el empuje hacia **que la contraparte sea siempre la máquina** es mucho
más fuerte.

Si se acaba ahí, la pregunta del juego cambia: ya no es «¿era una persona o la máquina?»
sino otra cosa que hay que decidir. **Eso sigue abierto y es ahora lo primero que hay que
resolver del juego.**

---

# La tercera revisión: el juego pasa por los evaluadores

Hecha el 11 de septiembre de 2026, al abrir la fase 04. Paga la deuda de proceso que el
abogado del diablo había señalado: el trato se decidió en directo y sólo lo atacó él, así
que no es la misma aplicación que ganó la fase 02 y se estaba colando por la ventana.

Se lanzó a `producto`, `viabilidad` y `charla` **en paralelo, en frío y sin verse entre
ellos**, con una instrucción explícita: *no juzgáis si os gusta, juzgáis si sobrevive a que
la independencia entre asistentes ya no exista.* A cada uno se le devolvió **su propia razón
de la fase 02** y se le pidió que dijera si seguía en pie y, si no, qué la sustituía. Y se
les pasó la alternativa aburrida —el dilema de opinión más un texto escrito por la máquina
en la lluvia— para que tuvieran contra qué comparar.

El orden importó y se cuenta: **los evaluadores fueron primero y las diez issues se abrieron
mientras corrían.** Abrir las issues antes habría puesto el marco del abogado del diablo en
GitHub, y es lo que habrían leído después.

## El marcador

| | veredicto | elige hoy |
|---|---|---|
| `producto` | adelante con reservas | **el trato**, salvo si la contraparte es siempre la máquina |
| `charla` | adelante con reservas | **el trato** |
| `viabilidad` | **no** en la forma escrita | **la alternativa aburrida** |

## Las tres razones de la fase 02, una por una

El abogado del diablo dictaminó que dos de las tres estaban muertas. El recuento real es más
raro, y está peor repartido que un simple dos a uno.

**`producto` parte la suya en dos, y una mitad mejora.** La **verificabilidad personal no
sólo sobrevive: sube de resolución.** Antes comprobabas uno-entre-cuarenta que te habían
leído, buscando tu frase en una pantalla comprimida por Meet. Ahora lo compruebas en cinco
segundos, en tu mano, y encima de forma adversarial: no compruebas que te entendió,
compruebas que te ganó. Pero **el bucle que terminaba solo está muerto y no lo sustituye
nada**, y no es reparable por diseño: no se puede tener a la vez una conversación con un
desconocido y un bucle que termina sin depender de él.

**`viabilidad` mata las dos suyas, y sólo una se puede recomprar.** El **fan-in está muerto**
—ya no entran cuarenta líneas y sale una llamada, entran cuarenta y salen ochenta cortas más
una larga— pero lo que protegía cuesta unas 6 horas: las llamadas se hacen desde Cloud Run y
no desde cuarenta navegadores, con concurrencia alta, una instancia mínima durante la charla,
reintentos con backoff e idempotencia por turno. La **degradación está muerta y no se
recompra**, y la razón es más precisa que «si el modelo cae no hay agente»:

> El trato elimina la posibilidad de precomputar. **Una negociación no se puede precomputar.**

Con un matiz que le hace al abogado del diablo, porque exageraba: si el modelo está caído
**antes** de empezar, sí hay repliegue —se saltan los tiempos 2 y 3 y se corre la experiencia
de la fase 02 sobre el corpus de persuasión del tiempo 1—. Lo que no tiene repliegue es el
fallo **a mitad**, que es justo cuando está la carga.

**`charla` dice que la suya sigue en pie, pero cambia de enunciado, y el cambio incomoda.**
Ya no es «la mitad no técnica produce el material igual de bien». Es que **el eje que decide
quién calla deja de ser el perfil y pasa a ser la exposición**: quién está dispuesto a que se
proyecte, en cita literal y con su falta de ortografía respetada por `DESIGN.md` §4, lo que
le escribió a un compañero para bajarle a 30 €. Eso correlaciona con antigüedad, no con ser
técnico, y para una aplicación cuyo producto es *la premisa compartida* es peor contaminación
que la que se temía. El dato ya está medido: **8 de las 37 respuestas del ensayo no traían
argumento**, y eso fue con una sala simulada, sin jefe y sin riesgo.

## Los tres pivotan sobre la misma decisión, y apuntan en direcciones opuestas

Sin haberse visto, los tres nombran **si la contraparte es siempre la máquina** como la
decisión de la que depende su veredicto. `producto` añade que está mal clasificada: figura
junto a decisiones de esquema y no es de esquema, es el interruptor que enciende o apaga la
única ventaja del juego.

Y se contradicen:

- **`viabilidad` firma el trato si es siempre la máquina.** Vuelve la independencia,
  desaparecen las dos barreras, y el coste baja de unas 80 horas a unas 55.
- **`producto` retira su voto si es siempre la máquina.** Lo que queda —cuarenta
  negociaciones privadas contra un bot más un fan-in al final— está muy cerca de **el
  oráculo**, que ya perdió la fase 02 por desperdiciar la simultaneidad. *Pagar el rediseño
  entero del estado para acabar en una candidata descartada es el peor resultado posible.*
- **`viabilidad` tampoco firma la mixta**, y por algo que no estaba escrito en ningún sitio:
  **en emparejamiento mixto, la latencia delata.** La máquina contesta en 2-3 segundos y una
  persona tarda entre 40 y 120, así que «¿persona o máquina?» se responde con un cronómetro
  en vez de leyendo. No sólo estropea la gracia: **infla el porcentaje de acierto**, que es
  la cifra estrella de la vista común.

### La coincidencia que sí hubo, y llegó por dos caminos

**Retener todas las respuestas del tiempo 2 y liberarlas de golpe cuando el ponente corta.**
`charla` lo pide por ritmo, para que la espera sea honesta; `viabilidad` lo pide para matar
el artefacto de latencia. Arregla las dos cosas a la vez. El precio es que la máquina deja de
servir para rellenar huecos deprisa, porque cada hueco rellenado cuesta el mismo reloj de
pared que uno humano.

Trae además un detalle de guion que nace de una decisión técnica: con liberación en bloque
**los cuarenta móviles se mueven antes que la voz del ponente**, porque Firestore llega en
milisegundos y el screen share de Meet llega con segundos. El ponente tiene que pulsar antes
de decirlo.

## Lo que no había visto nadie, ni el abogado del diablo

**Firestore evalúa las reglas de seguridad a nivel de documento, no de campo.** Si el cliente
puede leer el documento, lee todos sus campos.

Todo el juego se sostiene sobre un secreto —«no lo sabes»— y el stack ya elegido empuja el
estado al navegador. Así que el esquema tiene que partirse en **documento público y documento
reservado**, y entre cada turno humano hace falta **un paso de copia saneada por servidor**:
A escribe, el servidor copia sin la identidad, B lee. Son 80 saltos mediados con entrega al
menos una vez, cada uno necesitando idempotencia por identificador de turno.

En la fase 02 no había mediación ninguna: escribías tu frase y todo el mundo podía leerla,
porque no había nada que ocultar. La alternativa aburrida también tiene un secreto —cuál de
las cuarenta la escribió la máquina— pero es **un** booleano sobre **un** documento, y se
resuelve no metiéndolo en Firestore hasta el destape. **Cuarenta secretos vivos no es lo
mismo que uno.**

Esto es lo que convierte la fase de datos de 4 horas en 20 con varianza alta, y es la fila de
tabla que resume el argumento entero.

## Las horas, y el coste

| fase | el trato | la alternativa |
|---|---|---|
| datos | **20 h** | 4 h |
| agente | **22 h** | 12 h |
| interfaz | **26 h** | 18 h |
| despliegue + ensayo | **12 h** | 8 h |
| **total** | **80 h** | **42 h** |

El absoluto no es de fiar y `viabilidad` lo dice él mismo: tres ejecuciones del mismo
evaluador sobre el mismo trabajo nominal dieron 64, 19 y 16, y su 80 está por encima de las
tres porque cuenta cuatro cosas que ninguna de aquellas nombró. **Lo que sostiene la
comparación es la razón: entre 1,7× y 1,9×.**

El dinero, en cambio, queda zanjado y deja de ser un criterio: **una sesión completa cuesta
entre 1 y 3 €**, y el proyecto entero menos de 20. La versión tonta del agente cuesta 0,17 $
y la lista 0,35 $; la diferencia se paga con las 38 horas, no con la factura.

> La decisión de coste de este proyecto no es el modelo, es **si el dinero es real**. Si los
> 100 € lo son, cuarenta personas por hasta 100 € son hasta 4.000 € de exposición: tres
> órdenes de magnitud por encima de todo lo técnico junto.

Y un dato que ordena lo demás, para que no se defienda el trato contestando a una objeción
que nadie ha hecho: **a cuarenta usuarios ninguna pieza del stack se acerca a un límite.**
Todo lo que falla aquí son fallos de coordinación, de secreto y de reloj humano. Ninguno es
de capacidad.

## Qué se decidió con los tres veredictos delante

**El presupuesto de horas queda por debajo de 50** (#3, cerrada). Y eso colisiona con las dos
formas del trato a la vez, porque en la contabilidad de `viabilidad` el mixto son ~80 h y el
siempre-máquina ~55: **por debajo de 50 sólo entra la alternativa aburrida.** Lo que no se
puede hacer es tratar ese 50 como una medida: los absolutos ya han fallado tres veces. Lo que
sí se sostiene es la razón de 1,7×–1,9× y la asimetría de la fila de datos, 4 horas contra 20
con varianza alta.

**La fase 04 no es el esquema de datos.** Es corta y sirve para cerrar lo que los tres
evaluadores condicionan: si la contraparte es siempre la máquina (#30), el presupuesto (#3,
ya cerrado) y **cuánto tarda de verdad el tiempo 2**, que `charla` y `viabilidad` piden por
separado y se mide con ocho personas y un formulario, sin una línea de código. El esquema
pasa a la 05.

Escribir hoy el esquema sería escribirlo a ciegas: **#30 decide si hay emparejamiento**, y si
no hay emparejamiento no hay barrera, ni pagos cruzados, ni la mitad del esquema.
