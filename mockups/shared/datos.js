/* ============================================================
   Datos de EL TRATO.

   El enunciado no está cerrado (issue #1), pero estos datos NO
   son inventados: salieron del ensayo en seco del 11/09/2026.
   Las 37 ofertas las escribió una sala simulada que no sabía que
   alguien iba a buscar una premisa; los grupos, la premisa y el
   contraargumento los sacó otro agente leyéndolas en frío.
   Está contado en DILEMAS.md.
   ============================================================ */

const OFERTAS = [
  "La mitad. Es que no tengo ningún argumento para quedarme más, me ha tocado repartir de casualidad",
  "60 para mi y 40 para ti. Son 40 euros que hace 10 minutos no tenias, no me seas rencoroso jaja",
  "50/50 tío que somos compañeros",
  "70-30. Te lo digo como se lo digo a un cliente: ahora mismo tus opciones son 30 o 0, no 30 o 50",
  "mitad, siguiente",
  "Si te ofrezco menos te vas a picar, lo vas a rechazar por orgullo y nos quedamos los dos a dos velas",
  "55 y 45. Casi la mitad, va, que la diferencia es un menú del día",
  "la gente no se enfada por el dinero se enfada por sentirse tonta. La mitad y tan amigos",
  "45 para ti. Me quedo 5 de más por haber tenido que pensarlo yo",
  "50. no le veo mas vueltas",
  "30 para ti. Es dinero que te cae del cielo en mitad de una charla, acepta",
  "La mitad, porque esto se va a proyectar en una pantalla y no quiero ser el del 80-20",
  "es lo que haría si te tuviera delante, y de hecho te tengo delante solo que no te veo",
  "65/35. Si lo rechazas habrás pagado 35 euros por darme una lección y sinceramente no me conoces tanto",
  "mitad!!! que son 100 euros no una hipoteca",
  "Mitad. El que reparte no debería cobrar comisión por repartir",
  "49 para ti, 51 para mí. Un euro. Si me rechazas por un euro te invito yo a la caña",
  "50/50 y ya está, no me quiero pasar el minuto haciendo cálculos",
  "Con 40 sales a cenar, con 0 te quedas en casa contándole a tu pareja que rechazaste 40 por principios",
  "La mitad, gracias",
  "50 y 50. Si alguien rechaza esto que levante la mano en el meet porque quiero conocerlo",
  "me quedo 60. total esto es un juego y lo suyo es jugar no?",
  "cualquier otra cosa me obliga a explicarte por qué valgo más que tú y no tengo forma de acabar esa frase",
  "80-20 a ver qué pasa. Bueno... 20 es poco. No puedo editarlo ya, perdona quien seas",
  "Perdona pero no me queda claro si el otro ve cuánto me quedo yo, eso cambia todo. Pongo mitad mientras",
  "Acepto lo que me ofrezcan, a mi 20 euros ya me valen",
  "35 para ti. Y lo hago aposta porque quiero ver si alguien dice que no",
  "50-50. Negociar me cuesta más energía de la que valen los 10 euros que podría sacar",
  "el que dice que no por dignidad se va a casa con la dignidad intacta y la cartera igual de vacía",
  "mitad. no soy tan interesante como para complicarlo",
  "58/42, que 42 suena a cifra pensada y las cifras pensadas se aceptan mejor que los números redondos",
  "La mitad, que luego nos vemos las caras en la oficina aunque no sepa quién eres jajaja",
  "Mitad. Y si el dinero es de verdad lo dono, así que tú decides si lo rechazas",
  "Menos, 25 para el otro. Es una oferta, no un acuerdo. Aceptar 25 es racional y rechazarlo es caro",
  "50 para ti. En serio, dale a aceptar, que quiero seguir viendo la charla",
  "le dejo 45. casi ni se nota y me llevo 55, que pa una vez que reparto yo",
  "la pregunta de verdad no es cuánto ofrezco sino por qué me han dejado elegir a mí"
];

/* Los seis grupos que sacó el analista en frío. Cuatro de los seis
   tienen gente de los dos bandos dentro: no reproducen el binario. */
const ESTRATEGIAS = [
  { n:8, nombre:"No merece el esfuerzo de pensarlo",
    cita:"Negociar me cuesta más energía de la que valen los 10 euros que podría sacar" },
  { n:7, nombre:"¿Me da derecho haber sido yo el que reparte?",
    cita:"El que reparte no debería cobrar comisión por repartir" },
  { n:7, nombre:"Rechazar te sale caro",
    cita:"Ahora mismo tus opciones son 30 o 0, no 30 o 50. Los 50 ya no existen" },
  { n:6, nombre:"No están jugando a este juego",
    cita:"Lo hago aposta porque quiero ver si alguien dice que no" },
  { n:5, nombre:"Lo que importa es cómo se lo va a tomar",
    cita:"Si te ofrezco menos te vas a picar y nos quedamos los dos a dos velas" },
  { n:4, nombre:"Aquí no hay anónimos",
    cita:"Te tengo delante solo que no te veo" }
];

const PREMISA = ["EL OTRO NO", "TIENE ARGUMENTOS.", "SÓLO TIENE", "UN BOTÓN."];
