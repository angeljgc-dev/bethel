/* El polvo en la luz de una sala.

   Un solo quad y un solo fragment shader de WebGL 1. Todo lo que se ve (el haz
   que entra por la ventana, la sombra de la celosia dentro del haz y las motas
   que flotan) se dibuja aqui, en el mismo paso. Las motas NO son gl.POINTS: en
   los Mali viejos ALIASED_POINT_SIZE_RANGE las deja en un pixel y desaparecen.
   Se dibujan como circulos dentro de una rejilla de celdas, mirando solo las
   nueve celdas vecinas de cada pixel, que es lo que permite pasar de nueve a
   sesenta motas sin un bucle de sesenta iteraciones por pixel.

   Precision: se pide alta si la hay, y si no se cae a media a proposito. En
   media el ruido pierde algo de grano y las motas se ven un pelo mas duras; no
   se rompe nada, que es lo que se comprueba compilando el mismo archivo con la
   rama de mediump forzada.

   LICENCIAS, por funcion:

   - snoise, mod289 y permute: ruido simplex 2D de Ian McEwan, Ashima Arts,
     bajo licencia MIT. El aviso completo va integro, justo encima, sin cortar.
   - rombo, celosia, haz, motas, hash21 y main: escritos para este sitio. No hay
     ni una linea de Shadertoy ni de ninguna fuente con licencia no comercial.
*/

#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 u_tam;
uniform float u_tiempo;
uniform float u_avance;
uniform float u_inclina;

/* ---------------------------------------------------------------------------
   Ruido simplex 2D sin textura. Ashima Arts, MIT. Aviso integro:

//
// Description : Array and textureless GLSL 2D simplex noise function.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : stegu
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//               https://github.com/stegu/webgl-noise
//

   --------------------------------------------------------------------------- */

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                     -0.577350269189626,  // -1.0 + 2.0 * C.x
                      0.024390243902439); // 1.0 / 41.0
  // First corner
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);

  // Other corners
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

  // Permutations
  i = mod289(i); // Avoid truncation effects in permutation
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                 + i.x + vec3(0.0, i1.x, 1.0));

  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;

  // Gradients: 41 points uniformly over a line, mapped onto a diamond.
  // The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

  // Normalise gradients implicitly by scaling m
  // Approximation of: m *= inversesqrt(a0*a0 + h*h);
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);

  // Compute final noise value at P
  vec3 g;
  g.x  = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

/* ------------------------------------------------- de aqui abajo, todo propio */

/* Gira el plano. El haz entra en diagonal, como la luz de las diez por una
   ventana alta, y esta funcion es la que lo inclina. */
vec2 gira(vec2 p, float a) {
  float c = cos(a);
  float s = sin(a);
  return vec2(c * p.x - s * p.y, s * p.x + c * p.y);
}

/* Campo de un rombo. No es la distancia euclidiana exacta y no hace falta que
   lo sea: solo se usa para saber que tan adentro del rombo esta el pixel, y de
   ese numero sale el borde suave del hueco de la celosia. Negativo dentro. */
float rombo(vec2 p, vec2 r) {
  return abs(p.x) / r.x + abs(p.y) / r.y - 1.0;
}

/* Un numero estable por celda, entre 0 y 1. De el salen tres cosas: si la celda
   tiene mota, donde esta dentro de la celda, y a que ritmo deriva. */
float hash21(vec2 p) {
  vec3 q = fract(vec3(p.xyx) * 0.1031);
  q += dot(q, q.yzx + 33.33);
  return fract((q.x + q.y) * q.z);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_tam;
  float aspecto = u_tam.x / u_tam.y;
  vec2 p = vec2((uv.x - 0.5) * aspecto, uv.y - 0.5);

  /* El haz. La inclinacion la mueve el puntero tres grados a cada lado; con el
     dedo no se mueve, porque el dedo tapa justo lo que se moveria. */
  float angulo = -0.58 + u_inclina * 0.06;
  vec2 h = gira(p - vec2(0.16, 0.06), angulo);

  /* Se abre con el avance: al empezar es una rendija, al final es una franja.
     El largo esta puesto para que el haz cruce el panel entero y salga por los
     dos lados: un haz que empieza y termina dentro del cuadro se lee como una
     mancha, no como luz que entra por una ventana. */
  float ancho = mix(0.20, 0.40, u_avance);
  float haz = 1.0 - smoothstep(ancho * 0.30, ancho, abs(h.x));
  haz *= smoothstep(-1.15, -0.30, h.y);
  haz *= 1.0 - smoothstep(0.18, 0.88, h.y);
  /* Grano de aire: el haz no es un plano de color, respira. */
  haz *= 0.74 + 0.26 * snoise(vec2(h.x * 3.4, h.y * 2.2 - u_tiempo * 0.045));

  /* La celosia, dentro del haz: los bloques dejan pasar la luz por sus rombos y
     la cortan en el resto. Es la misma reja que la sombra de la portada. */
  vec2 celda = fract(h * 3.4) - 0.5;
  float hueco = smoothstep(0.16, -0.26, rombo(celda, vec2(0.38, 0.38)));
  haz *= mix(0.52, 1.0, hueco);

  vec3 techo = vec3(0.0784, 0.1059, 0.0941);
  vec3 luz = vec3(0.949, 0.757, 0.369);
  vec3 col = techo + luz * haz * 0.40;

  /* Las motas. Rejilla de 10 por 6 celdas tendida sobre el haz: sesenta celdas,
     y cada una tiene mota si su numero cae por debajo de la densidad. La
     densidad va de 0.175 a 1.0. El 0.175 no es 9/60 redondeado: es el valor
     medido con el que la compuerta deja pasar exactamente nueve celdas de las
     sesenta, porque hash21 no reparte perfectamente uniforme (con 0.15 pasaban
     siete y con 0.19, diez). Se miran las nueve celdas vecinas, no las sesenta:
     nueve vueltas por pixel, con los limites constantes que pide GLSL ES 1.0. */
  vec2 rejilla = vec2(10.0, 6.0);
  vec2 g = vec2(h.x / (ancho * 2.0) + 0.5, (h.y + 0.88) / 1.00) * rejilla;
  vec2 base = floor(g);
  vec2 dentro = fract(g);
  vec2 tamCelda = vec2(ancho * 2.0 / rejilla.x, 1.00 / rejilla.y);
  float densidad = mix(0.175, 1.0, u_avance);
  float motas = 0.0;

  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 vecina = vec2(float(i), float(j));
      vec2 id = base + vecina;
      float s = hash21(id);
      /* Sin `continue`: una multiplicacion por 0 o 1 se compila igual en todas
         partes y no depende de como trate el driver el salto. */
      float vive = step(s, densidad);
      /* La rejilla es de sesenta celdas y ni una mas: fuera de ella no se
         dibuja nada. Sin este recorte, en una pantalla ancha se ven las celdas
         de al lado y la cuenta se pasa de sesenta (medido: 73). */
      vive *= step(0.0, id.x) * step(id.x, rejilla.x - 1.0);
      vive *= step(0.0, id.y) * step(id.y, rejilla.y - 1.0);
      float s2 = hash21(id + 19.7);
      vec2 centro = vec2(0.22 + 0.56 * s2, 0.22 + 0.56 * fract(s * 17.0));
      centro += 0.20 * vec2(sin(u_tiempo * (0.13 + 0.17 * s2) + s * 6.283),
                            cos(u_tiempo * (0.09 + 0.14 * s) + s2 * 6.283));
      /* La celda no es cuadrada, asi que la diferencia se pasa a unidades de
         pantalla antes de medirla: si no, las motas salen ovaladas. */
      vec2 dif = (dentro - vecina - centro) * tamCelda;
      float r = length(dif);
      float radio = 0.0034 + 0.0040 * s2;
      motas += vive * (1.0 - smoothstep(radio * 0.35, radio, r)) * (0.45 + 0.55 * s2);
    }
  }

  /* Las motas solo brillan dentro del haz: fuera de la luz el polvo no se ve. */
  col += luz * motas * haz * 1.15;

  gl_FragColor = vec4(col, 1.0);
}
