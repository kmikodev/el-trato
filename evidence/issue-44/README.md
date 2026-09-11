# Evidencias · issues #44 y #46

**PR:** #47 · **Rama:** `issue-44-reduced-motion-y-auditoria` · **Fecha:** 11 de septiembre de 2026

Las dos issues salieron de la revisión de la PR #40, donde no bloquearon el merge.

## Qué pedían

- **#44** — con `prefers-reduced-motion` la pantalla de esperar se quedaba clavada en 24: la
  preferencia de accesibilidad entregaba la peor versión de la pantalla justo a quien la
  necesita. Y un `@media` que repetía la regla base y no hacía nada.
- **#46** — la auditoría avanzaba sólo desde `onload`, sin `onerror` ni plazo. Si se rompía,
  la lista corta se leía igual que una completa: aprobar por omisión.

## Qué se comprobó

Montaje de cuatro servidores, para separar los casos en vez de confiar en uno solo:
`8811` la rama tal cual · `8812` con una pantalla borrada · `8813` un servidor que acepta y
no contesta nunca · `8814` una pantalla válida con el CSS embebido.

### #44

1. **Antes de medir, si era posible que algo se deslizara.** No hay ni una `transition` ni
   una `animation` ni un `@keyframes` en todo `shared/dilema.css` ni en la maqueta, así que
   la barra salta de ancho. Lo único que se movía era el parpadeo de los puntos → `commands.txt`.
2. **El contador con las dos preferencias**, tres tiros de cada: sube en ambos casos (32/32/32
   frente a 32/31/31, partiendo de 24). La diferencia de uno es el azar del intervalo, no la
   preferencia. **Puntos encendidos: 1 en modo normal, 0 con la preferencia** → `commands.txt`.
3. **Que el parpadeo normal no se rompió de paso**: la secuencia de los tres puntos muestreada
   cada 300 ms da `100 100 010 001 001 100 100 010`, tres estados, ciclando.
4. **El `@media` muerto ya no está.**

### #46

5. **Camino feliz** (`8811`): «16 de 16 revisadas», sin marca de incompleta, único fallo el de
   la #41 → `screenshot-auditoria-completa-1440.png`.
6. **Pantalla que no existe** (`8812`): sale pintada como fallo, la cadena llega a 16 y el
   recuento dice **«16 de 16 revisadas · 1 sin poder auditar»** →
   `screenshot-auditoria-con-pantalla-que-falta-1440.png`.
7. **Ni `onload` ni `onerror`** (`8813`, servidor mudo): termina igual a los 12 s, la fila dice
   «No ha contestado en 8 s», y **ninguna pantalla sale duplicada** — el cerrojo de `avanza()`
   impide que un `onload` tardío cuente dos veces.
8. **El plazo de 8 s**, que el dev dijo haberse inventado: medí la carga real de las dieciséis,
   sin caché. Mediana 8 ms, la más lenta 15 ms. **8 s son 533× la más lenta**, así que el
   número es defendible aunque se eligiera a ojo.

## Qué no se pudo comprobar

- **El falso negativo de `esMaqueta()` es real y está confirmado**, no descartado. Una maqueta
  válida con el CSS embebido en vez de enlazado (`8814`) sale como fallo con un texto que
  afirma que «lo más probable es que el fichero no exista», y el fichero existe. **No bloquea**
  porque falla en voz alta —se ve en el recuento y en la fila—, que es exactamente lo que la
  #46 pedía; lo flojo es el texto, que diagnostica una causa en vez de describir lo observado.
  Hoy las dieciséis enlazan el CSS, así que no afecta a nadie todavía.
- **Las evidencias de `prefers-reduced-motion` son textuales, no una captura.** El Chrome
  headless con el que se fuerza la preferencia no carga las webfonts y pinta la pantalla de
  forma engañosa —lo aprendimos en la revisión de la #40—, así que una captura de ese modo
  mentiría. Lo que se aporta es el volcado del DOM: el número del contador y el recuento de
  `class="on"`, que es lo que la issue pide y no depende de la tipografía.
- **Un móvil de verdad, y `prefers-reduced-motion` en un móvil de verdad.** Sólo emulación.
- **Que el plazo de 8 s sea suficiente en una red lenta.** Los 533× de margen son sobre un
  servidor local, que es el uso para el que está escrita la herramienta. Si alguna vez se
  sirve desde fuera, ese margen no dice nada.
- **Las seis reglas de `DESIGN.md` en sí mismas.** Se comprueba que la herramienta las aplica
  y que no se calla; si las reglas están bien calibradas es la #42 y no se juzga aquí.
