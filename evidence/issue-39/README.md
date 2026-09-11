# Evidencias · issue #39

**PR:** #40 · **Rama:** `issue-39-pantalla-esperar` · **Fecha:** 11 de septiembre de 2026

## Qué pedía la issue

Dibujar la pantalla de esperar, que no existía: había quince maquetas y el contador de la
barrera sólo lo veía el ponente en su instrumento. La barrera estaba diseñada para quien la
mira, no para quien la sufre.

## Qué se comprobó

1. **El diff de verdad, separado del ruido.** La vista de GitHub enseñaba 21 ficheros y
   +2787 porque `main` en el remoto todavía era el viejo y metía el cierre de fase dentro.
   `git diff main...issue-39-pantalla-esperar` da **3 ficheros y +320 −2**, que es lo que el
   dev dijo que había escrito → `commands.txt`.
2. **Que no hay valores inventados.** Los doce tokens que usa la pantalla
   (`--linea`, `--tinta`, `--e1..e4`, `.dato`, `.barra`, `.accion--inerte`, `.filete--suave`,
   `.cuerpo--menor`, `.etiqueta--viva`) existen todos en `shared/dilema.css` → `commands.txt`.
3. **La pantalla a 390×844**, que es el móvil → `screenshot-espera-390-inicio.png`,
   `snapshot-espera.txt`. No desborda a lo ancho y la fila de acción «ESPERANDO ···» se ve
   entera, que es justo donde el dev avisó de que una herramienta puede mentir. Se ve.
4. **Que cabe sin scroll, medido de las dos formas.** Con la barra de scroll clásica del
   escritorio sobran 18 px; ocultándola, que es como se comporta un móvil, `scrollHeight`
   es 844 **exacto** y no hay scroll. La afirmación de la PR es cierta en el aparato para el
   que está hecha → `commands.txt`.
5. **El contador, mirado 13 segundos y no en un fotograma.** Sube de 30 a 35, monótono, con
   huecos irregulares de 2 y 3 s, y la barra sigue al número exactamente (`n/40*100%`) →
   serie completa en `commands.txt`, y las dos capturas separadas nueve segundos
   (`screenshot-espera-390-inicio.png` → `screenshot-espera-390-nueve-segundos-despues.png`).
6. **El final.** Al llegar a 40 la barra queda al 100 %, y diez segundos después sigue en 40
   sin pasarse. La parada es la que la PR describe, no un desbordamiento.
7. **A 1440×900** no desborda en ninguna dirección y la pantalla queda centrada a 430 px →
   `screenshot-espera-1440.png`.
8. **El índice** → `screenshot-indice-1440.png`. Dieciséis tarjetas, y T2b «La espera» cae
   entre T2 y T3. El recuento del texto ya dice «dieciséis».
9. **La auditoría, ejecutada entera** → `screenshot-auditoria-1440.png`. Las 16 pantallas
   salen; `trato-02b-espera.html` pasa las seis reglas. El único fallo es
   `trato-c7-instrumento.html`, una pantalla preexistente, ya recogida en #41.
10. **Consola limpia** → `console.txt`. Cero mensajes en la pantalla nueva.

## Qué no se pudo comprobar

- **Que la pantalla haga lo que promete con datos reales.** Todo lo medido aquí es una
  maqueta: el contador es un `setTimeout` con números inventados, no hay backend ni pool.
  Que el número suba está comprobado; que suba *cuando alguien envía su oferta*, no, porque
  eso todavía no existe.
- **El fallo silencioso que la propia PR declara.** Si el pool no se llena, desde esta
  pantalla un número parado y un pool muerto se ven igual. No es comprobable aquí y depende
  de #29 y #30. Queda abierto a propósito.
- **El comportamiento con `prefers-reduced-motion`.** No se ha medido. Leyendo el código,
  con esa preferencia el contador **no arranca**: la pantalla se queda en un 24 fijo, y el
  número que sube es justamente lo único que esta pantalla tiene que hacer. Respetar la
  preferencia es correcto; que el resultado sea una pantalla sin su mecanismo es una
  decisión de producto que nadie ha tomado todavía. No bloquea y no es un fallo de la PR.
- **Un móvil de verdad.** Se ha emulado el viewport y se ha neutralizado la barra de scroll
  del escritorio, pero no se ha abierto en un teléfono físico. La lluvia por Meet (#17)
  tampoco se mide con esto y no se ha intentado.
- **Los tres anchos intermedios.** Sólo 390 y 1440, que es lo que pide el sistema.

## Nota de entorno, para quien repita esto

Las instrucciones de la PR dicen `python3 -m http.server 8000`. En esta máquina el 8000 lo
ocupaba otro proyecto y servía «⚽ Mi Liga FUTMONDO», no las maquetas. Se usó el **8811**.
Fijar un puerto en unos pasos de reproducción es frágil: conviene decir «un puerto libre».
