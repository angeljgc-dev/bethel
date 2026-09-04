/* La coreografia de scroll.

   Solo corre cuando el cargador ya decidio que este aparato recibe movimiento,
   con el DOM puesto y la firma de la portada terminada. Todo lo que hay aqui
   quita o mueve cosas que el CSS ya pinto en su sitio: si este archivo no
   llega, la pagina es la misma, quieta.

   data-anima es la marca de que la coreografia esta puesta. La geometria que
   solo tiene sentido con ella (las secciones fijadas del umbral, la cortina que
   tapa la portada) cuelga de ese atributo y de ningun otro, asi que sin
   JavaScript no queda nada fijado ni recortado. */

type Gsap = typeof import("gsap").gsap;
type Scroll = typeof import("gsap/ScrollTrigger").ScrollTrigger;

/* La barra fija cambia de alto con el ancho de la pantalla, y de ese alto
   dependen todos los disparadores. Se lee del CSS, no se repite aqui. */
function altoDeLaBarra(): number {
  const valor = getComputedStyle(document.documentElement).getPropertyValue("--barra");
  return parseFloat(valor) || 64;
}

export function coreografia(gsap: Gsap, ScrollTrigger: Scroll): void {
  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    document.documentElement.dataset.anima = "";
    const barra = altoDeLaBarra();

    /* Portada a Llegar: la luz se va de la frase a la calle y la cortina verde
       sube. Tres cuentas que salieron de medir, no de gusto:

       - la frase NO se apaga. Mientras la portada esta fijada, el unico sitio
         por donde puede asomar Llegar es la franja que queda debajo de la
         portada, y esa franja mide lo que la portada esta por debajo de la
         pantalla: 116 px a 390x844. O sea que en los ultimos 116 px del pin
         Llegar todavia no tiene mas que su rotulo. Con la frase apagandose ahi,
         la medicion daba una parada con un solo texto en pantalla y el resto
         verde. La frase se queda entera, sobre su hoja de cal, y se va
         desplazandose cuando el pin suelta y Llegar ya ocupa la pantalla;
       - la tarjeta del horario y los botones si se apagan: su dato esta a la
         vez en la barra fija, que no se va a ninguna parte;
       - el recorrido es 55% de una pantalla y no 70%, porque cada viewport de
         transicion se paga en el presupuesto. */
    const portada = document.querySelector<HTMLElement>(".portada");
    if (portada) {
      /* La salida no empieza hasta que la portada entera se ha visto. En una
         pantalla alta eso es cuando su borde de arriba llega a la barra; en una
         baja, cuando su borde de abajo llega al final de la pantalla, que es
         mas tarde. Sin esta cuenta, en un telefono corto el segundo boton
         aparecia ya medio apagado y no llegaba a tener posicion de reposo. */
      const arranque = () => {
        const caja = portada.getBoundingClientRect();
        const arriba = caja.top + window.scrollY;
        const abajo = arriba + portada.offsetHeight;
        return Math.max(0, arriba - barra, abajo - window.innerHeight);
      };
      const salida = gsap.timeline({
        scrollTrigger: {
          trigger: ".portada",
          start: arranque,
          end: "+=55%",
          pin: true,
          scrub: true,
          anticipatePin: 1,
        },
      });
      salida
        .to(".luz", { xPercent: 26, yPercent: 22, scaleX: 1.5, skewX: -2, duration: 1, ease: "none" }, 0)
        .fromTo(
          ".cortina",
          { clipPath: "inset(100% 0 0 0)" },
          { clipPath: "inset(0% 0 0 0)", duration: 0.75, ease: "none" },
          0.25,
        )
        .to(".acciones", { autoAlpha: 0, y: -24, duration: 0.45, ease: "none" }, 0.55)
        .to(".datos", { autoAlpha: 0, y: -16, duration: 0.4, ease: "none" }, 0.58)
        .to(".luz", { opacity: 0, duration: 0.25, ease: "none" }, 0.75);

      /* Puntero fino: la sombra sigue al cursor tres grados a cada lado. Sin
         bucle propio y sin nada que seguir en tactil, donde el dedo tapa
         justamente lo que se moveria. */
      if (matchMedia("(pointer: fine)").matches) {
        const inclina = gsap.quickTo(".luz", "skewX", { duration: 0.8, ease: "power2.out" });
        window.addEventListener("pointermove", (e) => {
          if (document.documentElement.dataset.firma !== "lista") return;
          inclina(-6 + (e.clientX / window.innerWidth - 0.5) * 6);
        });
      }
    }

    /* El ojo de cerradura. Un solo disparador hace las tres cosas: fija el
       umbral entero bajo la barra, deja que su espaciador ponga el recorrido, y
       recorta el porton de 100 a 0 mientras dura.

       La primera version fijaba los dos paneles por separado con
       pinSpacing: false y escribia el alto de la pista a mano (200svh en el
       CSS). Salian dos espaciadores, tres disparadores sobre el mismo tramo y
       un numero magico que habia que mantener a mano de acuerdo con el
       recorrido. Con el pin en el contenedor y su espaciador, el recorrido es
       el alto del panel por definicion y no hay nada que cuadrar.

       Un solo clip-path animado, sin filtros y sin sombras dentro del recorte:
       es lo que la medicion con CPU 4x aguanto. */
    const umbral = document.querySelector<HTMLElement>(".umbral");
    if (umbral) {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".umbral",
            start: `top top+=${barra}`,
            end: () => "+=" + (window.innerHeight - barra),
            pin: true,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })
        .fromTo(
          ".umbral__porton",
          { clipPath: "circle(100% at 50% 50%)" },
          { clipPath: "circle(0% at 50% 50%)", ease: "none" },
        );
    }

    /* La linea de tiempo. La lista de tarjetas se recorre de lado mientras la
       seccion esta fijada. El recorrido dura exactamente lo que mide la pista,
       asi que un pixel de scroll es un pixel de tarjeta y la seccion no se come
       mas viewports de los que ocupa su contenido.

       El sol y el contador NO salen del avance del scroll: salen de la tarjeta
       que estas leyendo. Son dos escalas distintas y confundirlas se veia. Las
       seis tarjetas miden lo mismo y sus tramos no (el primero dura 20 minutos
       y el quinto 70), asi que repartir los 180 minutos a lo largo del
       desplazamiento ponia el contador en "minuto 144" con la tarjeta del
       minuto 85 al 95 delante, y el sol en el 80% del riel con la marca del 47%
       debajo. Lo que se hace es interpolar entre los anclajes reales: el
       desplazamiento al que cada tarjeta llega al borde de lectura, medido del
       DOM, contra el minuto en que empieza su tramo. Del mismo mapa salen las
       paradas del enganche, que asi caen en el borde de una tarjeta y no a
       media tarjeta. */
    const minutos = document.querySelector<HTMLElement>(".minutos");
    const pista = minutos?.querySelector<HTMLElement>(".pista");
    if (minutos && pista) {
      const total = Number(minutos.dataset.total) || 0;
      const paradas = (minutos.dataset.paradas || "")
        .split(",")
        .map(Number)
        .filter((n) => !Number.isNaN(n));
      const tarjetas = [...pista.querySelectorAll<HTMLElement>(".tramo")];
      const sol = minutos.querySelector<HTMLElement>(".riel__sol");
      const contador = minutos.querySelector<HTMLElement>("[data-minuto]");
      const viaje = () => Math.max(1, pista.scrollWidth - window.innerWidth + 20);

      /* El mapa de anclajes: avance del scroll contra minuto del culto. Las
         ultimas tarjetas se descubren por la derecha y su borde izquierdo nunca
         llega al de lectura, asi que no tienen anclaje propio; el ultimo punto
         del mapa es el final del recorrido con el minuto en que termina el
         culto. Se descarta ademas el anclaje que caiga a menos de media tarjeta
         del final: en una pantalla ancha caben dos tarjetas a la vez y ese
         anclaje quedaba a 40 px del ultimo, que como parada no es una parada. */
      let mapa = { x: [0, 1], y: [0, total] };
      const medirMapa = () => {
        const largo = viaje();
        const cero = tarjetas.length ? tarjetas[0].offsetLeft : 0;
        const paso = tarjetas.length > 1 ? tarjetas[1].offsetLeft - cero : largo;
        const tope = 1 - paso / 2 / largo;
        const x: number[] = [];
        const y: number[] = [];
        tarjetas.forEach((t, i) => {
          const avance = (t.offsetLeft - cero) / largo;
          if (avance < tope) {
            x.push(avance);
            y.push(paradas[i] ?? 0);
          }
        });
        x.push(1);
        y.push(total);
        mapa = { x, y };
      };
      const minutoEn = (avance: number) => {
        const { x, y } = mapa;
        let i = 1;
        while (i < x.length - 1 && avance > x[i]) i++;
        const ancho = x[i] - x[i - 1] || 1;
        const t = Math.min(1, Math.max(0, (avance - x[i - 1]) / ancho));
        return y[i - 1] + (y[i] - y[i - 1]) * t;
      };

      /* El enganche solo con puntero fino: con el dedo, forzar la parada pelea
         con el impulso del scroll del sistema. */
      const enganche = matchMedia("(pointer: fine)").matches
        ? {
            snapTo: (valor: number) =>
              mapa.x.reduce((cerca, p) => (Math.abs(p - valor) < Math.abs(cerca - valor) ? p : cerca), 0),
            duration: 0.2,
            delay: 0.05,
          }
        : undefined;

      gsap.to(pista, {
        x: () => -viaje(),
        ease: "none",
        scrollTrigger: {
          trigger: ".minutos",
          start: `top top+=${barra}`,
          end: () => "+=" + viaje(),
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
          snap: enganche,
          onRefresh: medirMapa,
          onUpdate: (self) => {
            const minuto = Math.round(minutoEn(self.progress));
            if (sol) sol.style.left = ((minuto / total) * 100).toFixed(3) + "%";
            if (contador) contador.textContent = String(minuto);
          },
        },
      });
    }
  });
}
