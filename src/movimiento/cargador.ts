/* El cargador de movimiento.

   Decide ANTES de pedir un solo byte. Si este aparato no va a recibir
   movimiento, GSAP no se descarga, no se ejecuta y no queda ni un
   requestAnimationFrame vivo: medido, GSAP cargado y sin una sola animacion
   sigue pidiendo cuadros (486 en dos segundos), asi que "cero animaciones" solo
   se cumple no cargandolo.

   La pagina completa, legible y navegable ya esta pintada por el CSS cuando
   este archivo corre. Lo que sigue es adorno, y el adorno se pide despues. */

/* Un solo umbral de aparato, no tres: ahorro de datos activo o dos gigas de
   memoria o menos. La velocidad de la red no entra, porque el movimiento no
   bloquea nada y una red lenta solo lo hace llegar tarde. */
function aparatoModesto(): boolean {
  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean };
    deviceMemory?: number;
  };
  if (nav.connection?.saveData === true) return true;
  return typeof nav.deviceMemory === "number" && nav.deviceMemory <= 2;
}

export function hayMovimiento(): boolean {
  if (!matchMedia("(prefers-reduced-motion: no-preference)").matches) return false;
  return !aparatoModesto();
}

function cuandoElDomEste(): Promise<void> {
  return new Promise((listo) => {
    if (document.readyState !== "loading") listo();
    else document.addEventListener("DOMContentLoaded", () => listo());
  });
}

/* El pin de ScrollTrigger mete la portada dentro de un espaciador, y mover un
   elemento en el DOM reinicia las animaciones CSS de todos sus descendientes.
   Por eso la coreografia espera a que la firma haya terminado: si no, GSAP al
   llegar volveria a esconder el titular y la pagina se soltaria al doble de
   tiempo. */
function cuandoLaFirmaTermine(): Promise<void> {
  return new Promise((listo) => {
    const raiz = document.documentElement;
    if (raiz.dataset.firma === "lista") {
      listo();
      return;
    }
    let acabo = false;
    const acabar = () => {
      if (acabo) return;
      acabo = true;
      vigia.disconnect();
      window.removeEventListener("scroll", alBajar);
      listo();
    };
    const vigia = new MutationObserver(() => {
      if (raiz.dataset.firma === "lista") acabar();
    });
    vigia.observe(raiz, { attributes: true, attributeFilter: ["data-firma"] });
    /* Si la persona empieza a bajar antes de que la firma termine, ya no hay
       nada que proteger: la portada quedo arriba y la coreografia tiene que
       estar puesta antes de que llegue a la primera transicion. */
    const alBajar = () => {
      if (window.scrollY > 80) acabar();
    };
    window.addEventListener("scroll", alBajar, { passive: true });
  });
}

/* El momento se pide MUCHO despues que la coreografia y con mas condiciones: es
   un contexto WebGL y un bucle de cuadros, o sea la pieza mas cara del sitio, y
   no lleva ni un dato encima.

   Tres puertas, en este orden:

   1. las mismas del movimiento (reducido, ahorro de datos, dos gigas o menos);
   2. que exista WebGL. Preguntarlo por el constructor no crea contexto ninguno;
   3. que el hueco exista en esta pagina.

   Y tres esperas: `load`, que es lo que garantiza que el LCP ya paso; el primer
   hueco de inactividad; y las fuentes, porque el shader se dimensiona con el
   alto del hueco y ese alto cambia cuando la letra definitiva llega. */
function cuandoNadaUrgente(): Promise<void> {
  return new Promise((listo) => {
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number })
      .requestIdleCallback;
    const seguir = () => (idle ? idle(() => listo(), { timeout: 2500 }) : setTimeout(listo, 400));
    if (document.readyState === "complete") seguir();
    else window.addEventListener("load", seguir, { once: true });
  });
}

function pedirElMomento(): void {
  if (!hayMovimiento()) return;
  if (typeof WebGLRenderingContext === "undefined") return;
  const hueco = document.querySelector<HTMLElement>("[data-momento]");
  if (!hueco) return;

  Promise.all([cuandoNadaUrgente(), document.fonts.ready])
    .then(() => import("./momento/polvo"))
    .then((mod) => mod.arrancarPolvo(hueco))
    .catch(() => {
      /* El fondo de CSS de la seccion ya esta puesto: no falta nada. */
    });
}

export function arrancarMovimiento(): void {
  if (!hayMovimiento()) return;

  pedirElMomento();

  Promise.all([
    import("gsap"),
    import("gsap/ScrollTrigger"),
    import("./coreografia"),
    cuandoElDomEste(),
    cuandoLaFirmaTermine(),
  ])
    .then(([modGsap, modScroll, modCoreografia]) => {
      const gsap = modGsap.gsap;
      const ScrollTrigger = modScroll.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);
      modCoreografia.coreografia(gsap);

      /* Las medidas del scroll se toman con las fuentes puestas: si se toman
         antes, cada bloque de texto cambia de alto al llegar la letra y los
         disparadores quedan corridos. */
      ScrollTrigger.refresh();
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    })
    .catch(() => {
      /* Sin GSAP la pagina ya esta completa: no hay nada que reponer. */
    });
}
