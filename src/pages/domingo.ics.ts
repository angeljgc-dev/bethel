/* El archivo de calendario.

   No hay conversion el mismo dia: la decision de ir a una iglesia se toma el
   sabado, no cuando alguien lee la pagina. Un evento en el telefono con la hora
   y la direccion es lo unico de este sitio que sobrevive una semana. */

import type { APIRoute } from "astro";
import { IGLESIA, CULTOS } from "../datos/iglesia";
import { archivoIcs } from "../lib/candado";

export const GET: APIRoute = () => {
  const domingo = CULTOS.find((c) => c.principal)!;

  const cuerpo = archivoIcs({
    titulo: `${IGLESIA.nombreCompleto}, ${IGLESIA.ciudad}`,
    direccion: `${IGLESIA.direccion}, ${IGLESIA.ciudad}, ${IGLESIA.estado}`,
    hora: domingo.hora,
    minutos: domingo.minutos,
  });

  return new Response(cuerpo, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="bethel-domingo.ics"',
    },
  });
};
