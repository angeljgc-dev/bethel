# Iglesia Casa Bethel ACyM · Matías Romero, Oaxaca

### 👉 Ver la página: **https://angeljgc-dev.github.io/bethel/**

Sitio de una sola página para una iglesia real. Pesa **98 KB en total** con todo lo que carga
después (tipografía, animación y la pieza de luz), y **15 KB** antes del primer pintado.

> ### Esto es un borrador para que la iglesia lo revise
>
> **Lo que ya es real y tiene fuente:** el nombre, la dirección (Callejón Ceiba, Los Robles
> Oriente), el celular publicado, el horario (domingos de 10:00 a 13:00; martes y jueves a las
> 18:00) y las siete prédicas enlazadas al canal de YouTube de la iglesia.
>
> **Lo que sigue siendo de muestra:** por dónde se entra y cómo es la puerta, qué pasa adentro
> minuto a minuto, cómo funciona el salón de niños, quién es quién, y si el celular recibe
> WhatsApp. La página lo dice ella misma en una banda arriba, y está marcada para **no salir en
> Google** hasta que la iglesia lo confirme.

## Cómo dar retroalimentación

1. Abre https://angeljgc-dev.github.io/bethel/ en el teléfono, que es donde la va a ver casi todo
   el mundo.
2. Lee **[docs/PREGUNTAS-PARA-LA-IGLESIA.md](docs/PREGUNTAS-PARA-LA-IGLESIA.md)**: empieza con lo
   que ya sabemos, para que solo haya que confirmar o corregir, y sigue con lo que falta, en
   orden de urgencia. Las tres primeras preguntas bloquean el sitio: si el celular recibe
   WhatsApp, qué nombre se publica, y quién firma el aviso de privacidad.
3. Cualquier cosa que esté mal, sobre o falte, dila tal cual. La página está hecha para cambiar.

**Lo más importante que hay que corregir primero:** la página afirma que a la mitad del culto se
pasa una bolsa y que se puede pasar de largo. **Si en Casa Bethel no es así, hay que decirlo.**
Afirmar "no se pide dinero" cuando sí se pide es una mentira pequeña que anula la credibilidad de
las otras seis respuestas.

## Qué hace este sitio, y qué no

No es un aparato de captación. Está medido que solo el **37%** de quienes buscan una congregación
busca información en línea, mientras que el **85%** asiste a un servicio y el **68%** habla con
amigos. La gente no llega a una iglesia por internet.

Este sitio es el **filtro de verificación**: corre después de que alguien invitó a un conocido y
antes de que ese conocido se atreva a ir. Su trabajo es **quitar miedo**.

Por eso la página se lee como un domingo, en orden: llegar, entrar, qué pasa adentro, qué hago con
mis hijos, qué se oye, a quién vas a ver. Las siete preguntas de quien nunca ha venido están
contestadas con el dato, no con la promesa del dato. Y al final cambia de lector: **"Invita a
alguien"** arma el mensaje de WhatsApp con el horario, la dirección y el enlace, para que quien ya
va pueda invitar con un toque.

## El concepto visual

Es un muro encalado a las diez de la mañana de un domingo. La luz entra por la **celosía**, el
block calado que estos edificios sí tienen, recorre la pared y se queda quieta sobre la hora y la
dirección: el elemento más bonito de la página señala el dato más útil. Al bajar, esa misma luz se
encoge hasta el hueco donde irá la foto de la fachada, se cruza un portón para entrar, y en
"Quiénes somos" se convierte en el polvo que flota en el haz de luz de una sala, con motas que
pasan de nueve a sesenta con el desplazamiento: las personas con las que empezó y las que hay hoy.

Nada de eso toca los datos. La hora, la dirección, los botones y el texto están en su sitio desde
el primer pintado; lo que se mueve es lo que hay alrededor.

## Decisiones que valen la pena explicar

**Todo el contenido existe sin JavaScript.** Los 140 textos, los enlaces de WhatsApp, el mapa y el
calendario están en el HTML. El JavaScript hace la página espectacular; no la hace existir. Medido
con el navegador sin JavaScript: cero textos ocultos.

**Con "reducir movimiento" no se carga ni un byte de animación.** Ni la biblioteca de movimiento,
ni la coreografía, ni la pieza de luz. Cero animaciones, cero llamadas de cuadro, cero contextos
de dibujo. No se apagan: no se piden.

**Contraste con piso de 7:1, no de 4.5.** La capacidad de usar un sitio web cae 0.8% por año
entre los 25 y los 60 años, y esta congregación envejece. Los 126 textos de la página, medidos
sobre su fondo real (incluida la luz que pasa por detrás), están por encima de 7:1; el par más
ajustado da 7.13. Cuerpo y notas a 18 px como mínimo; todo lo que se toca mide 44 px o más.

**Tipografía propia, con métricas de respaldo.** Fraunces para titulares y Atkinson Hyperlegible
para el cuerpo (29 KB en dos archivos, licencia SIL Open Font License). Hasta que llegan, Georgia y
Arial ocupan exactamente el mismo espacio, así que el texto no salta: desplazamiento acumulado de
cero.

**La pieza de luz pesa 5 KB y se carga cuando la página ya se lee.** Es un programa de dibujo
escrito a mano, sin bibliotecas 3D (la más común pesa 179 KB). Se detiene cuando sale de pantalla y
no se pide en teléfonos con poca memoria o con ahorro de datos activado.

**Las prédicas se enlazan, no se incrustan.** Un reproductor de YouTube pesa 583 KB y ejecuta 1.6
MB de código; un enlace pesa nada. Son servicios completos, de unas dos horas, y así se dice.

**Hay un archivo de calendario.** No hay conversión el mismo día: la decisión de ir se toma el
sábado. El evento se repite cada domingo, así que sigue siendo correcto en enero.

**Ningún formulario, ninguna foto que no sea de la iglesia.** Solo el 12% de la gente le da su
teléfono a una iglesia: el sitio expone el número de ellos y no recoge nada. El campo de nombre en
"Invita a alguien" solo arma el mensaje en el teléfono de la persona; no manda nada a ningún lado.
No hay fotos de banco haciéndose pasar por la congregación, ni fotos ni nombres de menores. Los
huecos de foto son piezas terminadas que reciben la foto real cuando la iglesia la mande.

## Medido, no estimado

Chrome con la CPU frenada cuatro veces y red 4G lenta (150 ms de ida y vuelta, 1.6 Mbps), a
390 × 844, con la banda de borrador puesta, mediana de cinco corridas:

| | Medido | Tope |
|---|---|---|
| Primer pintado del elemento más grande | 904 ms | 2,500 ms |
| Salto de contenido | 0 | 0.1 |
| Respuesta al toque, mediana | 104 ms | 200 ms |
| Peso antes del primer pintado | 15 KB | 150 KB |
| Peso total con todo lo diferido | 98 KB | 600 KB |
| Desplazamiento con CPU frenada, mediana | 4.2 ms por cuadro | 20 ms |
| Contraste, 126 textos sobre fondo real | ninguno bajo 7:1 | 7:1 |
| Con "reducir movimiento" | 0 animaciones, 0 descargas de movimiento | 0 |
| Sin JavaScript | 0 textos ocultos de 140 | 0 |
| Teclado | 28 paradas, todas con foco visible | |
| Anchos de 320 a 1440 | sin desbordar | |

## Antes de publicar

El build de producción **falla a propósito** mientras queden datos de muestra:

```bash
npm run build
# PUBLICACION BLOQUEADA
```

Para verlo sin publicarlo:

```bash
BETHEL_PERMITIR_INVENTADOS=1 npm run build
```

Cuando la iglesia conteste, se sustituyen los datos en `src/datos/iglesia.ts` (un solo archivo:
cambiar la hora ahí cambia la barra, la portada, la invitación y el calendario a la vez) y se pone
`CONFIRMADO_POR_LA_IGLESIA = true`. Con esa bandera desaparecen solos la banda de aviso y el
`noindex`.

## Cómo se publica

Cada push a `main` compila el sitio y lo sube a GitHub Pages
(`.github/workflows/publicar.yml`). El flujo levanta el candado a propósito, porque esta versión
está en línea **para revisarse**, no para atender gente. La banda y el `noindex` no dependen de esa
variable sino de `CONFIRMADO_POR_LA_IGLESIA`, así que siguen puestos hasta que los datos sean los
de verdad.

## Sobre el nombre

`bethel.com` es una megaiglesia de California con 14 millones de seguidores, y su sello musical
tiene 6 millones de suscriptores en YouTube: entre las dos saturan la búsqueda global de la
palabra. `bethel.org.mx` ya está tomado por otra iglesia en la Ciudad de México.

Por eso el título y el H1 llevan **Matías Romero**. No se compite por "Bethel": se compite por
"iglesia cristiana en Matías Romero". El perfil de Google Business importa más que este sitio para
el descubrimiento local, y es una de las tareas de la lista.

## Cómo correr

```bash
npm install
npm run dev
```

## Licencias

- Tipografía: Fraunces y Atkinson Hyperlegible, SIL Open Font License 1.1. El texto de la
  licencia y los avisos de cada familia están en `public/fuentes/LICENCIAS.txt`.
- Movimiento: GSAP y ScrollTrigger, licencia estándar de GSAP, sin condición de pago ni de
  atribución.
- La pieza de luz está escrita a mano; el ruido que usa es el de Ashima Arts, licencia MIT, con su
  aviso íntegro dentro del archivo.

## Documentación

- **[Preguntas para la iglesia](docs/PREGUNTAS-PARA-LA-IGLESIA.md)** · lo que ya sabemos y lo que
  falta, en orden de urgencia
- [Hallazgos](docs/HALLAZGOS.md) · 14 hechos verificados con fuente que sostienen cada decisión
