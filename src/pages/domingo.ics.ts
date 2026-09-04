/* El archivo de calendario.

   No hay conversion el mismo dia: la decision de ir a una iglesia se toma el
   sabado, no cuando alguien lee la pagina. Un evento en el telefono con la hora
   y la direccion es lo unico de este sitio que sobrevive una semana. */

import type { APIRoute } from "astro";
import { IGLESIA, CULTOS, COMO_LLEGAR } from "../datos/iglesia";
import { archivoIcs, finDe } from "../lib/candado";

export const GET: APIRoute = () => {
  const domingo = CULTOS.find((c) => c.principal)!;
  const fin = finDe(domingo);

  /* La descripcion lleva los dos permisos que mas quitan miedo el domingo por la
     manana: llegar tarde y salir antes. Es lo unico del sitio que sigue en el
     telefono de alguien una semana despues, asi que ahi es donde tienen que
     estar. */
  const descripcion =
    `De ${domingo.hora} a ${fin}. ${COMO_LLEGAR.llegarTarde} ` +
    `Y si necesitas salir antes, sal. Más: ${IGLESIA.sitio}`;

  const cuerpo = archivoIcs({
    titulo: `${IGLESIA.marca}, ${domingo.dia.toLowerCase()}`,
    direccion: `${IGLESIA.direccion}, ${IGLESIA.ciudad}, ${IGLESIA.estado}, CP ${IGLESIA.cp}`,
    hora: domingo.hora,
    minutos: domingo.minutos,
    descripcion,
  });

  return new Response(cuerpo, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="bethel-domingo.ics"',
    },
  });
};
