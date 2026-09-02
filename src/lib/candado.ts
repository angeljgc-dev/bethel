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

/* ---------------------------------------------------------------- WhatsApp */

/* La iglesia expone SU numero y la persona escribe cuando quiere. Eso invierte
   la asimetria: solo el 12% le da su telefono a una iglesia, pero usar el de
   ellos no le cuesta nada. Por eso no hay formulario. */
export function enlaceWhatsApp(numero: string, texto: string): string {
  return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
}

/* La invitacion de un miembro a un conocido. Las tres condiciones que documenta
   la investigacion estan las tres: alguien de confianza invita, se ofrece a
   acompanar, y hay una razon para creer que le sirve (el tema, escrito en
   humano, nunca como cita de libro y capitulo).

   El enlace va armado en el HTML por el build, asi que funciona sin JavaScript.
   La tarjeta visual la pinta WhatsApp desde og:image: cero bytes en el cliente. */
export function invitacion(opciones: {
  ciudad: string;
  colonia: string;
  hora: string;
  fin: string;
  tema?: string;
  sitio: string;
}): string {
  const { colonia, hora, fin, tema, sitio } = opciones;
  const lineas = [
    `Hola. Este domingo voy a la iglesia Bethel, aquí en ${colonia}.`,
    `Empieza a las ${hora} y salimos como a las ${fin}.`,
    ``,
    `Si quieres paso por ti y entramos juntos. No tienes que hacer nada ni decir nada allá.`,
  ];
  if (tema) lineas.push(``, `Este domingo hablan de: ${tema}.`);
  lineas.push(``, `Dónde es y qué pasa exactamente, aquí: ${sitio}`);
  return `https://wa.me/?text=${encodeURIComponent(lineas.join("\n"))}`;
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
}): string {
  const { titulo, direccion, hora, minutos } = opciones;
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

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Bethel//ES",
    "BEGIN:VEVENT",
    `UID:bethel-culto-dominical@bethel`,
    `DTSTART:${sello(dom)}`,
    `DTEND:${sello(fin)}`,
    "RRULE:FREQ=WEEKLY;BYDAY=SU",
    `SUMMARY:${titulo}`,
    `LOCATION:${direccion}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
