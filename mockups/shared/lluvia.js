/* ============================================================
   La lluvia — acoplada a datos reales.
   Cada columna es la justificación de una persona, entera y
   descendiendo: el primer carácter en fósforo marca dónde empieza
   cada frase, o sea, dónde empieza cada persona.

   DOS COSAS QUE LA MAQUETA CORRIGIÓ, y las dos van en DESIGN.md §5:

   1. Revelar la frase sobre una retícula fija no vale: una frase de
      noventa caracteres en vertical necesita 2.800px y en 16:9 se
      cortaba por la mitad. Se desplaza entera.

   2. No se usa el truco clásico de pintar un rectángulo negro
      semitransparente encima cada fotograma. Deja un rastro fantasma
      de contraste bajísimo por toda la pantalla, que cuesta bitrate y
      ensucia el texto de al lado. Aquí se borra el lienzo entero.
      Y el desplazamiento uniforme resulta ser lo BARATO para un
      encoder —es exactamente lo que la compensación de movimiento
      sabe hacer—, mientras que el parpadeo por glifo es lo caro.
   ============================================================ */

(function (global) {
  "use strict";

  var COLOR = { fondo:"#050705", tinta:"#D8FFE3", fosforo:"#00FF41", linea:"#1F7A34" };

  // entrada y salida por los bordes, en pasos discretos por glifo
  var BORDE = [.22, .48, .74];

  var MODOS = {
    protagonista: { alfa:1,   fps:60, densidad:1,    cuerpo:.0165, paso:[38, 78] },
    fondo:        { alfa:.10, fps:12, densidad:.334, cuerpo:.0130, paso:[26, 52] }
  };

  function azar(a, b) { return a + Math.random() * (b - a); }

  function Lluvia(lienzo, opciones) {
    this.lienzo = lienzo;
    this.ctx = lienzo.getContext("2d", { alpha:true });
    this.frases = (opciones.frases || []).slice();
    this.modo = MODOS[opciones.modo] || MODOS.protagonista;
    this.siguiente = 0;

    // dentro de la hoja de contactos hay diez marcos a la vez: se baja el coste
    this.enMarco = global.self !== global.top;

    this.medir();
    this.arrancar();
  }

  Lluvia.prototype.medir = function () {
    var dpr = Math.min(global.devicePixelRatio || 1, 2);
    var caja = this.lienzo.getBoundingClientRect();
    this.an = Math.max(1, Math.round(caja.width));
    this.al = Math.max(1, Math.round(caja.height));
    this.lienzo.width  = this.an * dpr;
    this.lienzo.height = this.al * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    this.cuerpo = Math.max(11, Math.round(this.an * this.modo.cuerpo));
    this.fila = Math.round(this.cuerpo * 1.18);
    this.ctx.font = "500 " + this.cuerpo + "px 'IBM Plex Mono', ui-monospace, monospace";
    this.ctx.textBaseline = "top";

    var ancho = this.ctx.measureText("M").width || this.cuerpo * .6;
    var maximo = Math.max(1, Math.floor(this.an / (ancho * 1.9)));
    var quiere = Math.round(this.frases.length * this.modo.densidad);
    if (this.enMarco) quiere = Math.ceil(quiere / 2);

    this.nCols = Math.max(1, Math.min(quiere, maximo));
    this.paso = this.an / this.nCols;

    this.cols = [];
    for (var i = 0; i < this.nCols; i++) this.cols.push(this.nuevaColumna(i, true));
  };

  Lluvia.prototype.nuevaColumna = function (i, inicial) {
    var frase = this.frases.length ? this.frases[this.siguiente++ % this.frases.length] : "";
    var alto = frase.length * this.fila;
    return {
      x: Math.round(i * this.paso + this.paso * .22),
      frase: frase,
      // y = dónde está el primer carácter. Arranca por encima del marco.
      y: inicial ? azar(-alto, this.al) : -alto - azar(0, this.al * .9),
      velocidad: azar(this.modo.paso[0], this.modo.paso[1])   // píxeles por segundo
    };
  };

  Lluvia.prototype.arrancar = function () {
    var self = this, previo = 0, deuda = 0;
    var intervalo = 1000 / (this.enMarco ? Math.min(this.modo.fps, 24) : this.modo.fps);

    function bucle(ahora) {
      self.raf = global.requestAnimationFrame(bucle);
      if (!previo) previo = ahora;
      var dt = ahora - previo;
      previo = ahora;
      deuda += dt;
      if (deuda < intervalo) return;
      var paso = Math.min(deuda, 100);
      deuda = 0;
      self.avanzar(paso);
      self.pintar();
      if (self.alContar) self.alContar(paso);
    }
    this.raf = global.requestAnimationFrame(bucle);
  };

  Lluvia.prototype.avanzar = function (dt) {
    for (var i = 0; i < this.cols.length; i++) {
      var c = this.cols[i];
      c.y += (c.velocidad * dt) / 1000;
      // cuando el primer carácter sale por abajo, la frase entera ya pasó
      if (c.y > this.al) this.cols[i] = this.nuevaColumna(i, false);
    }
  };

  Lluvia.prototype.pintar = function () {
    var ctx = this.ctx;
    ctx.clearRect(0, 0, this.an, this.al);          // se borra entero: sin rastro fantasma
    var borde = BORDE.length * this.fila;

    for (var i = 0; i < this.cols.length; i++) {
      var c = this.cols[i];

      // se salta de golpe la parte de la frase que aún está por encima del marco
      var j0 = Math.max(0, Math.ceil((-this.fila - c.y) / this.fila));

      for (var j = j0; j < c.frase.length; j++) {
        var y = c.y + j * this.fila;
        if (y > this.al) break;                     // y lo de debajo ya no cabe

        var ch = c.frase.charAt(j);
        if (ch === " ") continue;

        var alfa = 1;
        if (y < borde)               alfa = BORDE[Math.max(0, Math.floor(y / this.fila))] || 1;
        else if (y > this.al - borde) alfa = BORDE[Math.max(0, Math.floor((this.al - y) / this.fila))] || 1;

        ctx.globalAlpha = this.modo.alfa * alfa;
        // el primer carácter en fósforo: marca dónde empieza cada persona
        ctx.fillStyle = j === 0 ? COLOR.fosforo : COLOR.tinta;
        ctx.fillText(ch, c.x, y);
      }
    }
    ctx.globalAlpha = 1;
  };

  Lluvia.prototype.rehacer = function () { this.medir(); };

  /* --- arranque: <canvas class="lluvia" data-modo="fondo|protagonista"> --- */
  global.Lluvia = {
    iniciar: function (selector, frases) {
      var lienzo = document.querySelector(selector || ".lluvia");
      if (!lienzo) return null;
      var ll = new Lluvia(lienzo, {
        modo: lienzo.dataset.modo || "protagonista",
        frases: frases
      });
      // antes de que cargue la webfont, measureText devuelve las métricas de la
      // fuente de reserva y las columnas salen mal repartidas
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () { ll.rehacer(); });
      }
      var espera;
      global.addEventListener("resize", function () {
        clearTimeout(espera);
        espera = setTimeout(function () { ll.rehacer(); }, 150);
      });
      return ll;
    }
  };
})(window);


/* ============================================================
   Patrón de prueba (tecla P) — instrumental para la issue #17.
   Filetes de 1 a 5px, la escala tipográfica y los fotogramas por
   segundo, para mirar el Meet del otro lado y decidir qué aguanta.
   No forma parte de la aplicación.
   ============================================================ */
(function () {
  "use strict";
  document.addEventListener("keydown", function (e) {
    if (e.key !== "p" && e.key !== "P") return;
    var caja = document.getElementById("patron");
    if (!caja) {
      caja = document.createElement("div");
      caja.id = "patron";
      caja.innerHTML =
        '<div class="etiqueta">PATRÓN DE PRUEBA · #17</div>' +
        '<div><b id="patron-fps">--</b> fps</div>' +
        '<div style="margin-top:.6em">' +
        [1,2,3,4,5].map(function (p) {
          return '<span style="font-size:.9em">' + p + 'px</span>' +
                 '<i class="r" style="height:' + p + 'px"></i>';
        }).join("") + "</div>" +
        '<div style="margin-top:.6em;line-height:1.3">' +
        '<div style="font-size:calc(1.05*var(--u))">17px etiqueta</div>' +
        '<div style="font-size:calc(1.65*var(--u))">26px cuerpo</div>' +
        '<div style="font-size:calc(2.6*var(--u));font-family:var(--display)">42px titular</div>' +
        "</div>" +
        '<div style="margin-top:.6em"><b>#00FF41</b> <span class="apagado">#1F7A34</span></div>';
      (document.querySelector(".escenario") || document.body).appendChild(caja);

      var n = 0, t0 = performance.now();
      (function contar() {
        n++;
        var t = performance.now();
        if (t - t0 > 500) {
          var s = document.getElementById("patron-fps");
          if (s) s.textContent = Math.round((n * 1000) / (t - t0));
          n = 0; t0 = t;
        }
        requestAnimationFrame(contar);
      })();
    }
    caja.classList.toggle("visible");
  });
})();
