/* Candado de publicacion.

   Lo provisional lleva bloqueo duro, no una nota al margen.
   Mientras los datos no esten confirmados por la congregacion, el build de
   produccion FALLA y dice exactamente que hay que sustituir.

   Motivo: son datos de una iglesia real. Publicar un horario inventado hace que
   alguien llegue a una puerta cerrada, y publicar un protocolo infantil que no
   es el suyo es peor todavia. Una nota en un archivo no impide que pase.

   En desarrollo no falla: avisa por consola y pinta una banda arriba. */

import { CONFIRMADO_POR_LA_IGLESIA, INVENTADO } from "../datos/iglesia";

export const datosSinConfirmar = () => !CONFIRMADO_POR_LA_IGLESIA;

export function revisarAntesDePublicar(): void {
  if (CONFIRMADO_POR_LA_IGLESIA) return;

  const mensaje =
    `\n  PUBLICACION BLOQUEADA\n\n` +
    `  Los datos de este sitio estan INVENTADOS para poder verlo armado.\n` +
    `  Antes de publicar hay que sustituirlos por los de la iglesia:\n\n` +
    INVENTADO.map((f) => `    - ${f}`).join("\n") +
    `\n\n  Estan en src/datos/iglesia.ts. Las preguntas para conseguirlos estan\n` +
    `  en docs/PREGUNTAS-PARA-LA-IGLESIA.md, ordenadas por urgencia.\n\n` +
    `  Cuando esten los de verdad, poner CONFIRMADO_POR_LA_IGLESIA = true.\n\n` +
    `  Para compilar igual (vista previa privada, NUNCA para publicar):\n` +
    `    BETHEL_PERMITIR_INVENTADOS=1 npm run build\n`;

  const permitido = process.env.BETHEL_PERMITIR_INVENTADOS === "1";
  if (import.meta.env.PROD && !permitido) throw new Error(mensaje);
  console.warn(mensaje);
}

/* -------------------------------------------------------------------- horas

   La hora de salida NO se escribe a mano en ninguna parte: sale de la hora de
   entrada mas los minutos que dura. Asi cambiar "10:00" por "10:30" en
   iglesia.ts mueve a la vez la barra, la portada, la invitacion, la linea de
   tiempo y el archivo de calendario, que era justo lo que antes se olvidaba en
   uno de los cinco.

   minutos en null quiere decir que no sabemos cuanto dura: no hay hora de
   salida que publicar y quien la pida recibe null, no una hora inventada. */
export function finDe(culto: { hora: string; minutos: number | null }): string | null {
  if (culto.minutos === null) return null;
  const [h, m] = culto.hora.split(":").map(Number);
  const total = (h * 60 + m + culto.minutos) % (24 * 60);
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

/* "180" se lee en la pagina como "tres horas", no como un numero de minutos. */
export function duracionEnHoras(minutos: number): string {
  const horas = minutos / 60;
  if (Number.isInteger(horas)) return horas === 1 ? "1 hora" : `${horas} horas`;
  return `${minutos} minutos`;
}

/* ---------------------------------------------------------------- WhatsApp */

/* La iglesia expone SU numero y la persona escribe cuando quiere. Eso invierte
   la asimetria: solo el 12% le da su telefono a una iglesia, pero usar el de
   ellos no le cuesta nada. Por eso no hay formulario. */
export function enlaceWhatsApp(numero: string, texto: string): string {
  return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
}

/* El mensaje de la barra y del cierre. Corto, sin promesas, y lo completa la
   persona. El sitio viejo mandaba "Hola, quiero saber mas de la iglesia", que
   pide y no dice nada. */
export function mensajeGeneral(marca: string): string {
  return `Hola. Vi la página de ${marca} y tengo una pregunta.`;
}

/* El de quien ya decidio venir y quiere que alguien lo reciba. */
export function mensajeVisita(marca: string): string {
  return `Hola. Vi la página de ${marca} y quiero ir el domingo. ¿Alguien me puede recibir en la puerta?`;
}

/* El de un padre o una madre que quiere ver el salon antes de dejar ahi a sus
   hijos. Va aparte del general porque la respuesta la da otra persona y porque
   mientras el protocolo de ninos siga sin confirmar, este mensaje ES la
   seccion: es lo unico que se puede prometer sin inventar nada. */
export function mensajeNinos(marca: string): string {
  return `Hola. Vi la página de ${marca}. Quiero conocer el salón de niños antes de llevar a mis hijos.`;
}

/* La invitacion de un miembro a un conocido. Las tres condiciones que documenta
   la investigacion estan las tres: alguien de confianza invita, se ofrece a
   acompanar, y hay una razon para creer que le sirve (el tema, escrito en
   humano, nunca como cita de libro y capitulo).

   El enlace va armado en el HTML por el build, asi que funciona sin JavaScript.
   La tarjeta visual la pinta WhatsApp desde og:image: cero bytes en el cliente. */
export function invitacion(opciones: {
  marca: string;
  ciudad: string;
  colonia: string;
  calle: string;
  hora: string;
  fin: string;
  tema?: string;
  sitio: string;
  /* El nombre de quien lo recibe. Es opcional a proposito: el enlace tiene que
     estar armado y completo en el HTML, sin JavaScript, y el nombre solo se le
     suma si la persona lo escribe. */
  nombre?: string;
}): string {
  return `https://wa.me/?text=${encodeURIComponent(textoDeInvitacion(opciones))}`;
}

/* El texto, aparte del enlace, porque la pagina lo imprime tal cual dentro de la
   tarjeta: lo que se ve es exactamente lo que se manda, no una version bonita. */
export function textoDeInvitacion(opciones: {
  marca: string;
  colonia: string;
  calle: string;
  hora: string;
  fin: string;
  tema?: string;
  sitio: string;
  nombre?: string;
}): string {
  return lineasDeInvitacion(opciones).join("\n");
}

export function lineasDeInvitacion(opciones: {
  marca: string;
  colonia: string;
  calle: string;
  hora: string;
  fin: string;
  tema?: string;
  sitio: string;
  nombre?: string;
}): string[] {
  const { marca, colonia, calle, hora, fin, tema, sitio, nombre } = opciones;
  const saludo = nombre ? `Hola, ${nombre}.` : "Hola.";
  /* "en el callejon Ceiba", no "en el callejon ceiba": lo que se pone en
     minusculas es la palabra generica, no el nombre propio de la calle. */
  const enLaCalle = calle.replace(/^(Callejón|Calle|Avenida|Av\.)/, (m) => m.toLowerCase());
  /* El permiso de irse antes va en la invitacion: con tres horas es la
     diferencia entre invitar y comprometer a alguien que no conoce a nadie. */
  const lineas = [
    `${saludo} Este domingo voy a ${marca}, aquí en ${colonia}.`,
    `Es de ${hora} a ${fin}, en el ${enLaCalle}. Puedes irte antes si necesitas.`,
    ``,
    `Si quieres paso por ti y entramos juntos. No tienes que hacer nada ni decir nada allá.`,
  ];
  if (tema) lineas.push(``, `Este domingo hablan de: ${tema}.`);
  lineas.push(``, `Dónde es y qué pasa exactamente, aquí: ${sitio}`);
  return lineas;
}

/* ---------------------------------------------------------------- calendario

   No hay conversion el mismo dia: la decision de ir se toma el sabado. Un
   archivo de calendario con la hora y la direccion es lo unico que sobrevive
   una semana en el telefono de alguien.

   El evento es SEMANAL, no un domingo suelto. En un sitio estatico el archivo
   se genera una sola vez, al compilar: un evento suelto quedaria en el domingo
   siguiente a la fecha de compilacion y caducaria en siete dias sin que nadie
   se entere. Con la repeticion, el archivo sigue siendo correcto en enero.

   La hora va sin zona a proposito. Asi el telefono la interpreta como hora
   local, que es exactamente lo que quiere quien vive en Matias Romero. */
export function archivoIcs(opciones: {
  titulo: string;
  direccion: string;
  hora: string;
  minutos: number;
  descripcion?: string;
}): string {
  const { titulo, direccion, hora, minutos, descripcion } = opciones;
  const [h, m] = hora.split(":").map(Number);

  /* primera ocurrencia: el domingo siguiente a la compilacion */
  const ahora = new Date();
  const dom = new Date(ahora);
  dom.setDate(ahora.getDate() + ((7 - ahora.getDay()) % 7 || 7));
  dom.setHours(h, m, 0, 0);
  const fin = new Date(dom.getTime() + minutos * 60000);

  const sello = (d: Date) =>
    [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, "0"),
      String(d.getDate()).padStart(2, "0"),
      "T",
      String(d.getHours()).padStart(2, "0"),
      String(d.getMinutes()).padStart(2, "0"),
      "00",
    ].join("");

  /* En un .ics la coma, el punto y coma y la barra invertida son separadores: si
     no se escapan, "Callejon Ceiba, Los Robles Oriente" llega partido en dos
     campos y la direccion se pierde a medias. */
  const limpio = (t: string) => t.replace(/([\\,;])/g, "\\$1").replace(/\n/g, "\\n");

  /* DTSTAMP es obligatorio en todo VEVENT segun el RFC 5545, y va en UTC con la
     Z al final. Google y Apple toleran que falte; Outlook y varios importadores
     de Android rechazan el evento o lo fechan mal. Es la fecha de compilacion,
     que es cuando este archivo se escribio de verdad. */
  const utc = (d: Date) =>
    [
      d.getUTCFullYear(),
      String(d.getUTCMonth() + 1).padStart(2, "0"),
      String(d.getUTCDate()).padStart(2, "0"),
      "T",
      String(d.getUTCHours()).padStart(2, "0"),
      String(d.getUTCMinutes()).padStart(2, "0"),
      String(d.getUTCSeconds()).padStart(2, "0"),
      "Z",
    ].join("");

  /* El aviso cae el dia anterior a las 20:00, que es cuando se decide ir. La
     cuenta sale de la hora del culto y no de un -PT14H escrito a mano: con el
     culto a las 11:30 el aviso sigue cayendo a las 20:00 del sabado. */
  const aviso = h * 60 + m + (24 - 20) * 60;

  const lineas = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Bethel//ES",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:bethel-culto-dominical@bethel`,
    `DTSTAMP:${utc(ahora)}`,
    `DTSTART:${sello(dom)}`,
    `DTEND:${sello(fin)}`,
    "RRULE:FREQ=WEEKLY;BYDAY=SU",
    `SUMMARY:${limpio(titulo)}`,
    `LOCATION:${limpio(direccion)}`,
    ...(descripcion ? [`DESCRIPTION:${limpio(descripcion)}`] : []),
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    `TRIGGER:-PT${Math.floor(aviso / 60)}H${aviso % 60}M`,
    `DESCRIPTION:${limpio(titulo)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  /* El archivo termina en CRLF, tambien la ultima linea: el RFC lo pide y varios
     validadores lo marcan. */
  return lineas.map(plegar).join("\r\n") + "\r\n";
}

/* El RFC 5545 limita cada linea a 75 OCTETOS, no a 75 caracteres: la direccion
   lleva tildes y una tilde en UTF-8 son dos octetos. La continuacion es CRLF
   mas un espacio, y el corte no puede caer en medio de un caracter, asi que se
   mide octeto a octeto sobre la cadena codificada y se corta por caracteres
   completos.

   Las dos lineas que se pasaban eran LOCATION (82 octetos) y DESCRIPTION (139),
   que son justo las dos que importan. */
export function plegar(linea: string): string {
  const octetos = (t: string) => new TextEncoder().encode(t).length;
  if (octetos(linea) <= 75) return linea;
  const trozos: string[] = [];
  let actual = "";
  let tope = 75;
  for (const caracter of linea) {
    if (octetos(actual + caracter) > tope) {
      trozos.push(actual);
      actual = "";
      /* Las continuaciones llevan un espacio delante, que tambien cuenta. */
      tope = 74;
    }
    actual += caracter;
  }
  if (actual) trozos.push(actual);
  return trozos.join("\r\n ");
}
