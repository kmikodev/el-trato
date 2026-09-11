# Sistema de diseño

Esto se escribe **antes** de dibujar nada. Si las diez pantallas salen antes que el
sistema, salen diez pantallas sin sistema y luego se justifica el desastre a posteriori.

Lo que hay aquí decide **cómo se ve** la aplicación. No decide qué hace —eso está en
`CONCEPTO.md`— ni con qué se construye: estas maquetas son HTML y CSS sin framework
porque son maquetas, y **eso no eligió el stack**: ése se decidió aparte y por otros
motivos, y está en el README.

---

## 0. Lo que manda sobre todo lo demás: el medio

La charla es en remoto. La vista común no se ve: se ve **una grabación en directo de la
vista común**, hecha por el encoder de Meet, a un bitrate que el propio Meet decide y
que baja cuando hay movimiento. Todo lo demás en este documento está subordinado a eso.

Cinco reglas, y ninguna es negociable por motivos estéticos:

**Nada de líneas de 1px.** Un píxel de alto sobre negro sobrevive al códec sólo si
tiene suerte. El filete mínimo es **3px** en la vista común y **2px** en los separadores
secundarios. En móvil, 2px mínimo.

**Nada de degradados amplios sobre negro.** H.264 cuantiza por bloques: un degradado
largo y oscuro se convierte en escalones sucios. No hay viñetas, ni halos, ni
`text-shadow` de brillo. El aspecto de fósforo sale **del tono**, no del resplandor. Si
hace falta desvanecer algo, se desvanece **por pasos discretos y por glifo** —que es
justo lo que hace la lluvia— nunca con un `linear-gradient` de 400px.

**Cuerpo de texto más grande de lo normal.** El mínimo absoluto en la vista común es
**17px sobre un lienzo de 1600 de ancho**, y sólo para etiquetas en mayúsculas; el
cuerpo que hay que leer empieza en **26px**. En móvil, 19px de cuerpo y 13px de
etiqueta. Lo que en una web sería «grande» aquí es el punto de partida.

**El área de verde saturado se mantiene pequeña.** El submuestreo de croma 4:2:0 guarda
el color a la mitad de resolución. Un `#00FF41` sobre negro es casi todo croma: en
grandes superficies se emborrona por los bordes. Por eso el fósforo son filetes, cifras
y etiquetas de dos palabras, nunca un fondo ni un párrafo.

**La lluvia baja al 10% en cuanto haya algo que leer.** Y no sólo de opacidad: también
de densidad y de fotogramas. Un píxel que se mueve cuesta bitrate aunque esté al 10%, y
ese bitrate se lo quita al texto que la sala está intentando leer. Ver §5.

Y una consecuencia de todo lo anterior que conviene decir en voz alta: **el fotograma
del momento grande tiene que estar quieto**. La premisa compartida aparece sobre la
imagen más estática de toda la charla, porque es la que más nitidez necesita.

### Zona segura

Meet recorta y ajusta. En la vista común, **el 4% de cada lado no lleva contenido
crítico**. El titular de la premisa empieza en ese margen, no antes.

---

## 1. Color

Cinco colores. Cuatro los ve la sala; el quinto no lo ve nunca.

| papel | valor | contraste sobre el fondo | dónde |
|---|---|---|---|
| fondo | `#050705` | — | el fondo, y nada más |
| tinta | `#D8FFE3` | 18,6:1 | **todo** el texto que hay que leer |
| fósforo | `#00FF41` | 14,8:1 | acento: filetes activos, cifras, etiquetas cortas, la cabeza de la lluvia |
| línea | `#1F7A34` | **3,7:1** | filetes secundarios, estados inactivos, lo ya pasado |
| ámbar | `#FFB000` | 11,0:1 | sólo el instrumento del ponente |

El número que manda es el **3,7:1** de la línea. Pasa el 3:1 que se le pide a un
elemento no textual y no llega al 4,5:1 que se le pide a un cuerpo de texto. No es un
gusto: **`#1F7A34` no puede llevar nunca una frase que alguien tenga que leer.** Lleva
rayas y estados inactivos.

De ahí sale la consecuencia que ordena todo lo demás, y que apareció dibujando: como en
esta paleta **no hay un medio tono legible**, el texto secundario no puede bajar de
color. Así que **baja de tamaño**. Un pie de foto, una aclaración o una cita de apoyo van
en tinta, más pequeños; nunca en verde apagado. Es la regla de §3 aplicada al color:
la jerarquía no está hecha de tonos.

Las tres primeras versiones de estas maquetas incumplían esto en cinco sitios. Se ve a
simple vista en cuanto se busca, y no se ve en absoluto mientras se dibuja.

El fósforo tiene contraste de sobra y aun así está racionado, por el motivo del croma
de §0. La regla operativa: **fósforo sí en cifras y en etiquetas de hasta tres
palabras; fósforo nunca en una frase.** «QUIEN LO VENDE» puede ir en fósforo. «El coste
de equivocarse no lo paga quien decide» va en tinta, siempre.

### El ámbar y la pestaña equivocada

El ámbar es el único color fuera de la familia verde, y está reservado al instrumento
del ponente, que el público no ve. De ahí sale una regla que vale más como salvavidas
que como decisión de color:

> **La vista común no usa ámbar nunca. El instrumento no usa fósforo nunca.**

Si en la pantalla compartida aparece algo ámbar, es que se ha compartido la pestaña
equivocada, y se ve de un vistazo sin tener que leer nada. Con cuarenta personas
mirando, ese medio segundo vale.

---

## 2. Tipografía

Dos monoespaciadas de Google Fonts. Ninguna de las dos es JetBrains Mono ni Space Mono.

### Martian Mono — los momentos grandes

[Martian Mono](https://fonts.google.com/specimen/Martian+Mono) es variable en dos ejes,
`wdth` de 75 a 112,5 y `wght` de 100 a 800, y está dibujada para titular, no para
código. Se elige por tres cosas concretas:

- **Es ancha de verdad**, y en el eje. El titular de la premisa se ensancha subiendo
  `wdth` a 112,5, no metiendo `letter-spacing`, que en una monoespaciada rompe la
  retícula que es justamente lo que la hace parecer una monoespaciada.
- **Separa los caracteres lo bastante** como para que el submuestreo de croma no funda
  una letra con la siguiente a 100px sobre negro.
- **No tiene detalles finos que el códec pueda borrar**: terminaciones cortadas rectas,
  astas gruesas, contraformas grandes.

Se usa a peso 700. Nunca para cuerpo de texto: a 26px es ilegible por ancha, y ése es
exactamente el motivo por el que sirve a 100px.

### IBM Plex Mono — interfaz y datos

[IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono) para todo lo que se
lee: justificaciones, citas, cuerpo, etiquetas, campos.

- **Altura de x alta** respecto a la caja, que es lo que decide si un texto sobrevive a
  una reducción de resolución.
- **`1`, `l`, `I` y `0`, `O` inequívocos**, que importa porque en pantalla van a
  aparecer recuentos.
- **Trae los pesos 500 y 600**, que es lo que hace falta aquí: sobre fondo oscuro, el
  texto claro florece y aparenta menos peso del que tiene. **El cuerpo va a 500, nunca a
  400.** Las etiquetas, a 600.

### Por qué no las otras dos

Además de estar excluidas por encargo: JetBrains Mono y Space Mono son la tipografía
por defecto de «esto es una terminal». El sistema ya dice eso con el color y con la
lluvia. Decirlo otra vez con la letra es decirlo dos veces.

### Escala

Todo en la vista común se mide en `--u`, que es `min(1vw, 1.7778vh)`: la centésima
parte del ancho de un lienzo 16:9 encajado en la ventana. Así la maqueta escala igual
en el portátil del ponente, en el navegador de un asistente y en el recorte de Meet.
La columna «@1600» es lo que mide en píxeles sobre un lienzo de 1600×900.

**Vista común**

| papel | tamaño | @1600 | fuente |
|---|---|---|---|
| momento | `6,2u` | 99px | Martian 700, `wdth` 112,5 |
| dato | `9u` | 144px | Martian 700 |
| titular | `2,6u` | 42px | Martian 700, `wdth` 100 |
| cuerpo | `1,65u` | 26px | Plex 500 |
| cita literal | `1,5u` | 24px | Plex 500 |
| etiqueta | `1,05u` | 17px | Plex 600, mayúsculas, `+0,18em` |

**Móvil** (referencia 390 de ancho, en píxeles fijos)

| papel | tamaño | fuente |
|---|---|---|
| pregunta | 30px | Martian 700 |
| dato | 56px | Martian 700 |
| postura | 26px | Martian 700 |
| cuerpo | 19px | Plex 500 |
| etiqueta | 13px | Plex 600, mayúsculas, `+0,18em` |

Nada por debajo de esos mínimos. Si algo no cabe, se corta el texto, no el cuerpo.

**Medida de línea:** el cuerpo no pasa de 62 caracteres por línea en la vista común.
Más ancho y el ojo se pierde al volver, que a cuatro metros de un portátil es peor que
en papel.

**Saltos de línea del momento grande:** se ponen a mano. La premisa compartida no se
deja partir por el navegador; se decide dónde rompe y se escribe así.

---

## 3. Jerarquía: filete, tamaño y espacio

**La jerarquía la marcan el filete, el tamaño y el espacio. Nunca una caja con borde y
fondo.**

No es una preferencia. Una caja sobre negro necesita o un borde fino —prohibido en
§0— o un fondo distinto del negro, que en 4:2:0 se convierte en bloques y además tapa
la lluvia, que es la única cosa de esta pantalla que la sala ha escrito. El filete
consigue lo mismo, sobrevive al códec y no tapa nada.

El vocabulario completo es de tres piezas:

**El filete.** Una raya corta y gruesa. `5px` de fósforo para lo activo y lo elegido,
`3px` de fósforo para lo estructural, `2px` de línea para separar iguales entre sí.
Va encima o a la izquierda de lo que marca, nunca rodeándolo.

**El tamaño.** El salto entre niveles es grande: de 26px a 42px a 99px. Saltos
pequeños no sobreviven a la compresión; un texto que es «un poco más grande» que otro
llega a Meet como un texto del mismo tamaño.

**El espacio.** Es el que hace el trabajo de verdad. La escala en móvil es 8 · 16 · 24 ·
40 · 64 · 104; en la vista común, `0,6u · 1,2u · 2u · 3,4u · 5,5u`. El momento grande
no es grande porque la letra mida 99px: es grande porque alrededor no hay nada.

**Estados**, con el mismo vocabulario: elegido = filete de 5px en fósforo y texto en
tinta; disponible = filete de 2px en línea y texto en tinta; inactivo o ya pasado =
todo en línea. No hay relleno, ni opacidad al 50%, ni gris.

**Zonas de toque en móvil:** 64px de alto como mínimo, y la fila entera es tocable, no
sólo el texto.

---

## 4. La cita literal

Es un componente de primera clase, no un adorno, y el motivo está en `CONCEPTO.md`: lo
único que una tabla de reglas no puede falsificar es la cita textual. Si en pantalla
aparecen las frases tal y como se escribieron, el agente ha tenido que leerlas, y eso
lo verifica todo el mundo empezando por quien la escribió.

Se dibuja con **filete de 3px en fósforo a la izquierda**, texto en tinta, sin comillas
tipográficas grandes ni cursiva, y con la etiqueta `LITERAL, DE LA SALA` encima. Se
respeta lo escrito: si hay una falta, se queda. Corregirla destruye lo único que la
cita demuestra.

---

## 5. La lluvia

Es la vista común, no un fondo decorativo, y va acoplada a datos reales: **cada columna
es la justificación de una persona**, entera, con el primer carácter en fósforo. Donde
empieza una frase empieza una persona, y eso se ve sin leer nada.

**Desciende entera, no se revela sobre una retícula.** La primera versión hacía lo
clásico: fijar los glifos en una cuadrícula y pasarles por encima una cabeza brillante.
Se descartó al medirla, por una razón de tamaño y otra de códec.

- **De tamaño:** una justificación de noventa caracteres en vertical necesita unos
  2.800px. En 16:9 no caben, así que la retícula fija la cortaba por la mitad —mostraba
  veintitrés caracteres y el resto no existía—. Desplazando la frase entera, pasa toda
  por delante del que mira.
- **De códec:** resulta que el desplazamiento uniforme es lo **barato** para un encoder,
  porque es exactamente lo que sabe hacer la compensación de movimiento: un vector y ya.
  Lo caro es el parpadeo por glifo, que no se puede predecir desde el fotograma anterior.
  Es decir, que la versión legible es además la que mejor sobrevive a Meet. No suele
  salir así.

**Tampoco se usa el truco clásico del rastro.** El Matrix de manual pinta un rectángulo
negro semitransparente encima cada fotograma, lo que deja un fantasma de contraste
bajísimo por toda la pantalla: cuesta bitrate, no aporta información y ensucia el texto
que hay al lado. Aquí **el lienzo se borra entero** cada fotograma. Lo único que se
atenúa son los tres glifos de cada borde, en pasos discretos, para que las frases no
aparezcan y desaparezcan de golpe. No es un degradado: son letras.

Dos modos, y sólo dos:

| | protagonista | fondo |
|---|---|---|
| opacidad | 100% | **10%** |
| columnas | una por respuesta | un tercio |
| fotogramas | 60/s | 12/s |
| velocidad | 38–78 px/s | 26–52 px/s |
| cuándo | cuando la lluvia *es* lo que se lee | **siempre que haya algo que leer** |

El paso a `fondo` lo decide el ponente desde su instrumento, y no es sólo opacidad: la
densidad y los fotogramas bajan con ella, porque el problema no era el brillo. Un píxel
que se mueve cuesta bitrate aunque esté al 10%, y ese bitrate se lo está quitando al
texto que la sala intenta leer.

**Medir antes de construir.** Que la lluvia sobreviva al códec de Meet es la issue #16 y
está sin resolver: lo de arriba son argumentos, no medidas. Por eso las siete pantallas
de la vista común son HTML autónomo que se abre a pantalla completa y se comparte —se
mide con la maqueta, no con la aplicación—, y cada una lleva un patrón de prueba que se
enciende con la tecla **`P`**: fotogramas por segundo, filetes de 1 a 5px y la escala
tipográfica completa. Se comparte, se mira el Meet del otro lado, y se decide qué grosor
y qué cuerpo aguantan de verdad.

## 6. Los dos momentos y sus dos formatos

Sólo hay dos formatos, y no se mezclan.

**Móvil, 390×844.** Es donde se juega. Una sola cosa por pantalla, la acción abajo y
grande, y nunca hace falta hacer zoom ni girar el teléfono. Funciona igual en el
portátil porque es la misma página: el ancho se limita, no se rediseña.

**Vista común, 16:9.** Es lo que el ponente comparte y lo que cada asistente puede abrir
aparte. Densidad baja a propósito: si en una pantalla hay dos ideas, hay dos pantallas.

**El móvil** (oferta → persuasión → juicio → destape → segunda → tercera): que jugar
cueste menos que no jugar, y que el resultado se entienda sin releer las reglas. El
destape devuelve tres datos y ni uno más.

**La vista común** (sin clasificar → estrategias → premisa → contraargumento → el
marcador → el movimiento): que se vea que el material lo escribió la sala. De ahí que las
ofertas aparezcan primero en bruto y cayendo: es la prueba de que existían antes de que
la máquina las tocara.

---

## 7. Lo que este sistema no decide

Por la regla primera del repositorio. Todo esto sigue abierto y la maqueta **no lo
cierra**, aunque haya tenido que dibujar algo para poder existir:

- **El enunciado** (issue #1). La forma del juego está elegida; las palabras exactas no,
  y el abogado del diablo le ha encontrado dos agujeros que siguen abiertos —la respuesta
  socialmente correcta y la ambientación—. Cada pantalla lleva una franja que lo dice.
- **Si el dinero es real.** Las pantallas dicen «100 €» porque hay que dibujar algo. Que
  se paguen o no cambia el comportamiento por completo y no está decidido.
- **El límite de longitud de la persuasión.** El contador de la T2 marca un número para
  poder dibujar un contador. Ese número es un marcador de maqueta.
- **Las cifras del juego.** Los porcentajes de acierto, las medias y los euros de las
  pantallas C5 y C6 son inventados: ese juego todavía no se ha jugado con nadie. Lo que
  **no** es inventado es el contenido de C1 a C4, que salió del ensayo a ciegas.
- **El identificador de dispositivo** (issue #2). Aquí ha cambiado algo y hay que decirlo:
  el instrumento **ya presupone** emparejamiento e identidad, porque sin ellos no hay
  barrera que controlar ni destape que entregar. En la versión anterior de estas maquetas
  se evitó a propósito dibujar nada que lo presupusiera. Ya no se puede: el juego lo
  necesita, así que #2 pasó de decisión de esquema a bloqueante.
- ~~**El stack.**~~ Ya no. HTML plano era el material de una maqueta y no eligió
  plataforma, pero la plataforma se eligió después por su cuenta: Firebase Hosting,
  Firestore y Cloud Run. Lo que sigue abierto de ahí es el dominio.

## 8. Dónde vive esto

`mockups/index.html` es la hoja de contactos: las quince pantallas a la vez, en marcos,
cada una abrible por separado. Los tokens de este documento están en
`mockups/shared/dilema.css` y son la única fuente de valores; si un valor no está ahí,
es que alguien lo ha inventado en una pantalla suelta.

Estas maquetas son **la entrada de la fase de prototipado en OpenPencil, no su
sustituto**: son lo que se lleva al editor.
