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
       sube. Dos cuentas que salieron de medir, no de gusto:

       - el texto se apaga al final del recorrido, no al principio, para que no
         quede una pantalla de verde sin nada que leer entre la portada y
         Llegar; ese hueco median 300 px en Chromium y en Firefox y ahora no
         hay ni una parada sin texto;
       - el recorrido es 55% de una pantalla y no 70%, por lo mismo y porque
         cada viewport de transicion se paga en el presupuesto. */
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
        .to([".portada__texto", ".acciones"], { autoAlpha: 0, y: -24, duration: 0.45, ease: "none" }, 0.55)
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

    /* El ojo de cerradura. Los dos paneles se fijan sin espaciador propio (el
       alto de la pista ya lo pone el CSS con data-anima) y el porton se recorta
       de 100 a 0 en ese recorrido. Un solo clip-path animado, sin filtros y sin
       sombras dentro del recorte: es lo que la medicion con CPU 4x aguanto. */
    const umbral = document.querySelector<HTMLElement>(".umbral");
    if (umbral) {
      const tramo = {
        trigger: ".umbral",
        start: `top top+=${barra}`,
        end: "bottom bottom",
      };
      ScrollTrigger.create({ ...tramo, pin: ".umbral__adentro", pinSpacing: false });
      ScrollTrigger.create({ ...tramo, pin: ".umbral__porton", pinSpacing: false });
      gsap.fromTo(
        ".umbral__porton",
        { clipPath: "circle(100% at 50% 50%)" },
        {
          clipPath: "circle(0% at 50% 50%)",
          ease: "none",
          scrollTrigger: { ...tramo, scrub: true },
        },
      );
    }

    /* La linea de tiempo. La lista de tarjetas se recorre de lado mientras la
       seccion esta fijada, y el sol y el contador salen del mismo dato que las
       tarjetas: los minutos de cada tramo, que estan en el HTML. El recorrido
       dura exactamente lo que mide la pista, asi que un pixel de scroll es un
       pixel de tarjeta y la seccion no se come mas viewports de los que ocupa
       su contenido. */
    const minutos = document.querySelector<HTMLElement>(".minutos");
    const pista = minutos?.querySelector<HTMLElement>(".pista");
    if (minutos && pista) {
      const total = Number(minutos.dataset.total) || 0;
      const paradas = (minutos.dataset.paradas || "")
        .split(",")
        .map(Number)
        .filter((n) => !Number.isNaN(n));
      const sol = minutos.querySelector<HTMLElement>(".riel__sol");
      const contador = minutos.querySelector<HTMLElement>("[data-minuto]");
      const viaje = () => Math.max(1, pista.scrollWidth - window.innerWidth + 20);

      /* El enganche solo con puntero fino: con el dedo, forzar la parada pelea
         con el impulso del scroll del sistema. */
      const enganche = matchMedia("(pointer: fine)").matches
        ? { snapTo: paradas.map((m) => m / total), duration: 0.2, delay: 0.05 }
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
          onUpdate: (self) => {
            const minuto = Math.round(self.progress * total);
            if (sol) sol.style.left = (self.progress * 100).toFixed(3) + "%";
            if (contador) contador.textContent = String(minuto);
          },
        },
      });
    }
  });
}
