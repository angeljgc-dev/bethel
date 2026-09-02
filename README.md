# Iglesia Cristiana Bethel · Matías Romero, Oaxaca

### 👉 Ver la página: **https://angeljgc-dev.github.io/bethel/**

Sitio de una sola página. Pesa **12 KB comprimido**, en clave oscura, y todo su JavaScript son
**1,082 bytes en línea**: ningún archivo aparte, ninguna biblioteca.

> ### Esto es un borrador para que la iglesia lo revise
>
> **Los horarios, la dirección, los nombres y las prédicas que aparecen están inventados.** Son
> valores verosímiles, puestos ahí para poder ver la página armada y opinar sobre ella. Ninguno es
> un dato real de Bethel.
>
> La página lo dice ella misma en una banda roja arriba, y además está marcada para **no salir en
> Google** mientras siga así: una dirección inventada en un resultado de búsqueda manda a alguien a
> una puerta cerrada.

## Cómo dar retroalimentación

1. Abre https://angeljgc-dev.github.io/bethel/ en el teléfono, que es donde la va a ver casi todo
   el mundo.
2. Lee **[docs/PREGUNTAS-PARA-LA-IGLESIA.md](docs/PREGUNTAS-PARA-LA-IGLESIA.md)**: son las
   preguntas cuyas respuestas sustituyen a los datos inventados, ordenadas por urgencia.
3. Cualquier cosa que esté mal, sobre o falte, dila tal cual. La página está hecha para cambiar.

**Lo más importante que hay que corregir primero:** la página afirma que a la mitad del culto se
pasa una bolsa y que se puede pasar de largo. **Si en Bethel no es así, hay que decirlo.** Afirmar
"no se pide dinero" cuando sí se pide es una mentira pequeña que anula la credibilidad de las otras
seis respuestas.

## Qué hace este sitio, y qué no

No es un aparato de captación. Está medido que solo el **37%** de quienes buscan una congregación
busca información en línea, mientras que el **85%** asiste a un servicio y el **68%** habla con
amigos. La gente no llega a una iglesia por internet.

Este sitio es el **filtro de verificación**: corre después de que alguien invitó a un conocido y
antes de que ese conocido se atreva a ir. Su trabajo es **quitar miedo**.

Por eso la pieza más importante no es la portada, es la sección **"Esto es lo que va a pasar"**,
con el culto desglosado minuto a minuto. De siete sitios de iglesias que se analizaron, dos
anuncian que responderán las preguntas del visitante nuevo y luego no las responden.

Y por eso existe **"Invita a alguien"**: un botón que arma el mensaje de WhatsApp con horario,
dirección y el tema de la próxima prédica. El sitio no convence al desconocido, **arma al miembro
para que lo invite**.

## Decisiones que valen la pena explicar

**Casi cero JavaScript.** Astro sin islas. Ese kilobyte en línea hace dos cosas, y la página
funciona sin las dos: marca el documento como "ligero" cuando el aparato tiene poca memoria o el
ahorro de datos activado, y da la entrada de las secciones en los navegadores que todavía no traen
línea de tiempo de scroll en CSS. El estado base en la hoja de estilos es el **visible**: si el
script no llega, no corre o está desactivado, se ve todo igual.

**El cuerpo del texto no descarga fuente.** Una sola fuente web con acentos españoles pesa entre
19 y 43 KB: más que el HTML, el CSS y todo lo demás juntos, entre tres y cinco veces. En Android
la pila del sistema es Roboto, que esta congregación ya lee todos los días.

**Contraste con piso de 7:1, no de 4.5.** La capacidad de usar un sitio web cae 0.8% por año entre
los 25 y los 60 años, así que alguien de 60 tiene 28% menos capacidad que alguien de 25. Esta
congregación envejece. Cuerpo de 18 px mínimo.

**El mapa es una imagen con enlace, no un embebido.** Un iframe de Google Maps pesa más que uno de
YouTube, y quien busca el mapa quiere llegar, no navegar.

**Las prédicas no llevan reproductor incrustado.** Un iframe de YouTube son 583 KB de red y 2.24 MB
descomprimidos, incluidos 1.6 MB de JavaScript que hay que ejecutar. Es 3.3 veces el presupuesto
completo de la página, en una sola sección.

**Hay un archivo de calendario.** No hay conversión el mismo día: la decisión de ir se toma el
sábado. Un evento en el teléfono con la hora y la dirección es lo único de este sitio que
sobrevive una semana.

## El concepto visual

La propuesta original era una vidriera. Se descartó: la vidriera es de tradición católica y
anglicana, con edificio de piedra, y dibujarla en un templo pentecostal de block y lámina es la
misma mentira que una foto de banco.

Lo que ese edificio sí tiene es **celosía**, el block de ventilación calado por el que entra la
luz. Misma técnica de geometría plana en SVG, material honesto. Cincuenta y cuatro rombos y un solo
degradado, todo dentro del kilobyte.

El sitio va en **clave oscura**: azul de noche, cian y violeta. El muro de celosía ocupa la mitad
derecha de la portada, la franja de luz lo atraviesa y **cae sobre el bloque de horario y
dirección**, que es el único elemento de la página con halo. El elemento más bonito señala el dato
más útil.

Las tarjetas son de vidrio esmerilado con **opacidad del 86%**, y esa cifra no es estética: con esa
opacidad el fondo que pasa por detrás aporta solo el 14% del color, así que el contraste del texto
deja de depender de lo que haya debajo. Vidrio sin esa precaución es contraste no auditable, que es
justo lo que un piso de 7:1 prohíbe. En aparatos modestos el vidrio pasa a superficie sólida y el
desenfoque desaparece.

**El movimiento tiene un límite medido.** Los dos resplandores del fondo se animan solo con
`translate3d` y `scale`, que la GPU compone sin repintar, y se detienen solos con poca memoria o con
ahorro de datos. La franja de luz de la portada **no se anima nunca**: con la CPU estrangulada seis
veces, una capa con mezcla sube el primer pintado de 264 a 501 ms.

## Lo que no lleva, a propósito

- **Nada de dinero.** Ni donativos, ni diezmos, ni "apóyanos".
- **Ningún formulario.** Solo el 12% de la gente le da su teléfono a una iglesia. El botón de
  WhatsApp expone el número de ellos, y así el visitante usa un dato en vez de entregar el suyo.
  El sitio no recoge nada.
- **Ninguna foto ni nombre de menor**, tampoco en nombres de archivo ni en texto alternativo.
- **Nada de jerga.** Ni célula, ni unción, ni avivamiento. Quien nunca ha ido no la entiende y se
  siente fuera justo cuando queremos que entre.

## Antes de publicar

El build de producción **falla a propósito** mientras los datos sigan inventados:

```bash
npm run build
# PUBLICACION BLOQUEADA
# Los datos de este sitio estan INVENTADOS para poder verlo armado.
```

Para verlo sin publicarlo:

```bash
BETHEL_PERMITIR_INVENTADOS=1 npm run build
```

Cuando la iglesia conteste, se sustituyen los datos en `src/datos/iglesia.ts` y se pone
`CONFIRMADO_POR_LA_IGLESIA = true`. Las preguntas están en
[docs/PREGUNTAS-PARA-LA-IGLESIA.md](docs/PREGUNTAS-PARA-LA-IGLESIA.md), ordenadas por urgencia.

Al poner esa bandera en `true` desaparecen solos la banda de aviso y el `noindex`, y el sitio
queda listo para que Google lo indexe.

## Sobre el nombre

`bethel.com` es una megaiglesia de California con 14 millones de seguidores, y su sello musical
tiene 6 millones de suscriptores en YouTube: entre las dos saturan la búsqueda global de la
palabra. `bethel.org.mx` ya está tomado por otra iglesia en la Ciudad de México, y hay al menos
cinco congregaciones Bethel en el país.

Por eso el dominio, el título y el H1 llevan **Matías Romero**. No se compite por "Bethel": se
compite por "iglesia cristiana en Matías Romero". El perfil de Google Business importa más que
este sitio para el descubrimiento local.

## Cómo correr

```bash
npm install
npm run dev
```

## Cómo se publica

Cada push a `main` compila el sitio y lo sube a GitHub Pages
(`.github/workflows/publicar.yml`). El flujo levanta el candado a propósito, porque esta versión
está en línea **para revisarse**, no para atender gente. La banda de aviso y el `noindex` no
dependen de esa variable sino de `CONFIRMADO_POR_LA_IGLESIA`, así que siguen puestos hasta que los
datos sean los de verdad.

## Documentación

- **[Preguntas para la iglesia](docs/PREGUNTAS-PARA-LA-IGLESIA.md)** · lo que hay que contestar
  para poder publicar, en orden de urgencia
- [Hallazgos](docs/HALLAZGOS.md) · 14 hechos verificados con fuente que sostienen cada decisión
