/* El momento: el polvo en la luz de una sala.

   Este archivo es un modulo aparte y se pide con import() cuando la pagina ya
   solto el LCP y el navegador esta ocioso. Si no llega, o si el aparato no lo
   aguanta, lo que queda es el fondo de CSS de la seccion: la misma luz entrando
   por la misma celosia, quieta. No hay texto de carga, no hay indicador y no hay
   mensaje de error, porque no falta nada que decir.

   Reglas que estan puestas en codigo y no en un comentario:

   - un solo contexto WebGL y un solo programa, con tres uniforms;
   - el bucle solo corre mientras el canvas esta en pantalla, y se para al salir;
   - con puntero grueso el avance NO sigue al scroll: se abre solo, una vez, en
     seis segundos. Con el dedo encima, seguir al scroll significa que la mano
     tapa lo que se mueve;
   - la resolucion se recorta a 1.5 de densidad. Un telefono de 3x pintando este
     shader a pantalla completa es nueve veces mas pixeles que a 1x, y el shader
     es el mismo. */

import fuente from "./polvo.frag?raw";

/* El quad. Dos triangulos que cubren la pantalla en coordenadas de recorte: no
   hay camara, no hay matrices y no hay nada que transformar. */
const VERTICE = `
attribute vec2 posicion;
void main() { gl_Position = vec4(posicion, 0.0, 1.0); }
`;

function compilar(gl: WebGLRenderingContext, tipo: number, codigo: string): WebGLShader | null {
  const s = gl.createShader(tipo);
  if (!s) return null;
  gl.shaderSource(s, codigo);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    gl.deleteShader(s);
    return null;
  }
  return s;
}

export function arrancarPolvo(hueco: HTMLElement): () => void {
  const lienzo = document.createElement("canvas");
  /* El canvas es decorado: lo que cuenta esta seccion esta en texto, debajo. */
  lienzo.setAttribute("aria-hidden", "true");

  const gl = (lienzo.getContext("webgl", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "low-power",
    /* El fondo lo pinta el shader entero en cada cuadro: no hay nada que
       conservar entre cuadros y conservarlo cuesta memoria. */
    preserveDrawingBuffer: false,
  }) ||
    lienzo.getContext("experimental-webgl")) as WebGLRenderingContext | null;
  if (!gl) return () => {};

  const vs = compilar(gl, gl.VERTEX_SHADER, VERTICE);
  const fs = compilar(gl, gl.FRAGMENT_SHADER, fuente);
  const programa = vs && fs ? gl.createProgram() : null;
  if (!vs || !fs || !programa) return () => {};
  gl.attachShader(programa, vs);
  gl.attachShader(programa, fs);
  gl.linkProgram(programa);
  if (!gl.getProgramParameter(programa, gl.LINK_STATUS)) return () => {};
  gl.useProgram(programa);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const attr = gl.getAttribLocation(programa, "posicion");
  gl.enableVertexAttribArray(attr);
  gl.vertexAttribPointer(attr, 2, gl.FLOAT, false, 0, 0);

  const uTam = gl.getUniformLocation(programa, "u_tam");
  const uTiempo = gl.getUniformLocation(programa, "u_tiempo");
  const uAvance = gl.getUniformLocation(programa, "u_avance");
  const uInclina = gl.getUniformLocation(programa, "u_inclina");

  hueco.appendChild(lienzo);

  let ancho = 0;
  let alto = 0;
  const medir = () => {
    const densidad = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = Math.max(1, Math.round(hueco.clientWidth * densidad));
    const h = Math.max(1, Math.round(hueco.clientHeight * densidad));
    if (w === ancho && h === alto) return;
    ancho = w;
    alto = h;
    lienzo.width = w;
    lienzo.height = h;
    gl.viewport(0, 0, w, h);
    gl.uniform2f(uTam, w, h);
  };
  medir();

  /* ------------------------------------------------------------- el avance

     De nueve motas a sesenta. Con puntero fino lo manda el scroll: cuanto de la
     seccion ha pasado por la pantalla. Con puntero grueso lo manda el tiempo,
     una sola vez, porque en tactil no sigue al scroll. */
  const tactil = !matchMedia("(pointer: fine)").matches;
  let avance = tactil ? 0 : 0.5;
  let abriendoDesde = 0;

  const avanceDelScroll = () => {
    const caja = hueco.getBoundingClientRect();
    const recorrido = caja.height + window.innerHeight;
    if (recorrido <= 0) return 0;
    const pasado = window.innerHeight - caja.top;
    return Math.min(1, Math.max(0, pasado / recorrido));
  };
  const alBajar = () => {
    avance = avanceDelScroll();
  };
  if (!tactil) {
    avance = avanceDelScroll();
    window.addEventListener("scroll", alBajar, { passive: true });
  }

  /* La inclinacion del haz sigue al cursor tres grados a cada lado. Sin bucle
     propio: solo escribe un numero que el cuadro siguiente ya lee. */
  let inclina = 0;
  const alMover = (e: PointerEvent) => {
    inclina = (e.clientX / window.innerWidth - 0.5) * 2;
  };
  if (!tactil) window.addEventListener("pointermove", alMover, { passive: true });

  /* --------------------------------------------------------------- el bucle

     Solo mientras el canvas esta en pantalla. Al salir se cancela el cuadro
     pendiente, asi que fuera de la seccion el contador de rAF queda en cero. */
  let cuadro = 0;
  let arranco = 0;
  const pinta = (t: number) => {
    cuadro = requestAnimationFrame(pinta);
    if (!arranco) arranco = t;
    const segundos = (t - arranco) / 1000;
    medir();
    if (tactil) {
      if (!abriendoDesde) abriendoDesde = t;
      avance = Math.min(1, (t - abriendoDesde) / 6000);
    }
    gl.uniform1f(uTiempo, segundos);
    gl.uniform1f(uAvance, avance);
    gl.uniform1f(uInclina, inclina);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const vigia = new IntersectionObserver(
    (entradas) => {
      const dentro = entradas.some((e) => e.isIntersecting);
      if (dentro && !cuadro) cuadro = requestAnimationFrame(pinta);
      if (!dentro && cuadro) {
        cancelAnimationFrame(cuadro);
        cuadro = 0;
      }
    },
    { rootMargin: "0px" },
  );
  vigia.observe(hueco);

  return () => {
    if (cuadro) cancelAnimationFrame(cuadro);
    cuadro = 0;
    vigia.disconnect();
    window.removeEventListener("scroll", alBajar);
    window.removeEventListener("pointermove", alMover);
    /* Devolver el contexto no es cortesia: un contexto WebGL vivo cuenta en el
       limite del navegador y en la medicion de movimiento reducido. */
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    lienzo.remove();
  };
}
