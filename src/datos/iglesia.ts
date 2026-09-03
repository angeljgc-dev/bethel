/* Datos de la iglesia.

   TODO ESTO ESTA INVENTADO. Son valores verosimiles para poder ver el sitio
   armado. Los reales los tiene que dictar la congregacion.

   El candado sigue puesto: mientras CONFIRMADO_POR_LA_IGLESIA sea false, el
   build de produccion FALLA. Se ve el sitio, no se puede publicar por accidente.
   Las preguntas para conseguir los datos estan en
   docs/PREGUNTAS-PARA-LA-IGLESIA.md, ordenadas por urgencia. */

export const CONFIRMADO_POR_LA_IGLESIA = false;

/* Lo que hay que sustituir. Lo lee el candado para decir exactamente que falta. */
export const INVENTADO = [
  "iglesia.nombreCompleto y direccion",
  "iglesia.whatsapp y telefonoVisible",
  "iglesia.comoLlegar (referencia, puerta, estacionamiento)",
  "cultos (dias, horas y duraciones)",
  "primeraVez (el minuto a minuto del culto)",
  "primeraVez.ofrenda (si se pasa canasta o no)",
  "ninos (protocolo, edades, responsables)",
  "liderazgo (nombres, funciones y fotos)",
  "predicas (la lista real de YouTube)",
  "historia",
];

export const IGLESIA = {
  marca: "Bethel",
  /* El nombre lleva la ciudad a proposito. Sin ancla geografica, la megaiglesia
     Bethel de California y su sello musical, con 14 y 6 millones de seguidores,
     sepultan cualquier busqueda de la palabra. No competimos por "Bethel":
     competimos por "iglesia cristiana en Matias Romero". */
  nombreCompleto: "Iglesia Cristiana Bethel",
  ciudad: "Matías Romero",
  estado: "Oaxaca",
  colonia: "Col. Centro",
  direccion: "Calle Hidalgo 148, Col. Centro",
  referencia: "a media cuadra del mercado, junto a la papelería",

  /* Solo digitos, con el 52 de Mexico al frente: formato de wa.me */
  whatsapp: "529721000000",
  telefonoVisible: "972 100 0000",
  horarioAtencion: "Lunes a viernes, de 9 a 2",
  quienContesta: "Hermana Lupita",

  historia:
    "Bethel empezó en 1998 en la sala de una casa, con nueve personas. " +
    "Hoy somos unas sesenta y seguimos en la misma colonia, a dos cuadras de donde empezamos.",
} as const;

export const COMO_LLEGAR = {
  puerta: "el portón verde con el letrero blanco",
  otraPuerta: "La puerta de al lado es de la casa del pastor y suele estar cerrada.",
  estacionamiento: "Se puede estacionar sobre la calle Hidalgo, caben unos ocho carros.",
  siSeLlena: "Si se llena, hay lugar sobre Morelos, a una cuadra.",
  distancia: "De ahí a la puerta hay como treinta metros.",
  llegarTarde: "Si llegas tarde, entra igual. El portón queda abierto todo el culto.",
  mapa: "https://maps.google.com/?q=Mat%C3%ADas+Romero+Oaxaca",
} as const;

export const CULTOS = [
  { dia: "Domingo", nombre: "Culto principal", hora: "10:00", fin: "11:45", minutos: 105, principal: true },
  { dia: "Miércoles", nombre: "Estudio bíblico", hora: "19:00", fin: "20:15", minutos: 75, principal: false },
  { dia: "Viernes", nombre: "Reunión de jóvenes", hora: "19:00", fin: "20:30", minutos: 90, principal: false },
] as const;

/* El minuto a minuto. Es lo que ninguno de los siete sitios analizados publica,
   y es lo que elimina la incertidumbre de quien nunca ha ido. */
export const PRIMERA_VEZ = {
  tramos: [
    { rango: "0 a 10", texto: "Llega la gente, hay música de fondo y alguien en la entrada te saluda y te dice dónde hay lugar." },
    { rango: "10 a 35", texto: "La banda toca cuatro o cinco canciones. Mucha gente canta de pie. Puedes quedarte sentado, nadie lo va a notar. La letra va en pantalla." },
    { rango: "35 a 40", texto: "Avisos de la semana y un saludo a quien está al lado. Un buenos días y ya." },
    { rango: "40 a 95", texto: "El pastor lee un pasaje de la Biblia y lo explica. Dura unos 45 minutos. Si no traes Biblia, el texto va en pantalla y hay ejemplares prestados." },
    { rango: "95 a 105", texto: "Una oración y una canción final. Al terminar la gente se queda platicando unos veinte minutos. Puedes quedarte o irte directo." },
  ],
  vestimenta:
    "Con lo que traes puesto. Vas a ver gente en playera y tenis y gente de camisa. " +
    "Nos vestimos de modo de no llamar la atención sobre nosotros mismos. Nadie revisa a nadie en la puerta.",
  senalar:
    "No. No pedimos que los visitantes se pongan de pie, ni que digan su nombre en voz alta, " +
    "ni levantamos la mano de quien viene por primera vez. Si quieres pasar desapercibido, se puede: " +
    "las filas de atrás casi siempre tienen lugar.",
  acompanar:
    "Si prefieres que alguien te acompañe, avísanos por WhatsApp y te esperamos en la puerta.",
  /* PREGUNTAR: si de verdad se pasa canasta. Decir que no cuando si es una
     mentira pequena que anula la credibilidad de las otras seis respuestas. */
  ofrenda:
    "No se espera nada de ti. A la mitad del culto se pasa una bolsa: pásala de largo, " +
    "es normal y nadie lo mira. No hay sobres con tu nombre, ni listas, ni cuotas, " +
    "y no se anuncia quién dio cuánto. Esta página tampoco recibe dinero de ninguna forma.",
  salir: "Si necesitas salir antes, sal. Nadie te va a detener ni te va a preguntar por qué.",
} as const;

export const NINOS = {
  edades: "de 3 a 11 años",
  salon: "el salón del fondo, pasando el patio",
  adultos: 3,
  protocolo:
    "Los dejas antes de entrar y te damos una etiqueta con un número. " +
    "Al niño solo se lo entregamos a quien traiga la otra mitad de esa etiqueta.",
  dosAdultos: "Nunca hay un solo adulto a solas con un grupo.",
  antecedentes: "Los que trabajan con niños son miembros de años y están a cargo de dos personas del liderazgo.",
  quedarse: "Si prefieres que tu hijo se quede contigo, también está bien. Aquí hay ruido de niños y a nadie le molesta.",
  /* Solo adultos responsables, con su autorizacion. NUNCA un menor. */
  responsables: [
    { nombre: "Rosa Martínez", funcion: "Encargada del salón de niños" },
    { nombre: "Daniel Cruz", funcion: "Apoyo y control de entrada y salida" },
  ],
} as const;

export const LIDERAZGO = [
  { nombre: "Pastor Efraín Jiménez", funcion: "Pastor", contexto: "Lleva veinte años en Bethel. Es de aquí, de Matías Romero." },
  { nombre: "Marisol Jiménez", funcion: "Co-pastora y ministerio de mujeres", contexto: "Coordina las reuniones de los martes." },
  { nombre: "Rosa Martínez", funcion: "Ministerio infantil", contexto: "Maestra de primaria, lleva ocho años con los niños de la iglesia." },
  { nombre: "Josué Ramírez", funcion: "Alabanza", contexto: "Dirige la banda. Toca desde los quince años." },
] as const;

/* El build las lee de la lista de reproduccion de YouTube que ya usan: siguen
   publicando donde ya publican y el sitio se entera solo. Estas son de muestra. */
export const PREDICAS = [
  { titulo: "Cuando el dinero no alcanza", fecha: "24 de agosto", predicador: "Pastor Efraín Jiménez", minutos: 42, id: "" },
  { titulo: "Lo que se hereda sin querer", fecha: "17 de agosto", predicador: "Pastor Efraín Jiménez", minutos: 38, id: "" },
  { titulo: "Perdonar cuando todavía duele", fecha: "10 de agosto", predicador: "Marisol Jiménez", minutos: 45, id: "" },
] as const;

/* La razon para creer que le va a servir. Se escribe en humano, nunca como cita
   de libro y capitulo. Se llena a mano cada semana; si esta vacio, la linea
   no sale de la invitacion. Va vacio a proposito: antes traia el titulo de una
   predica ya pasada y la invitacion prometia un tema viejo. */
export const PROXIMO_TEMA = "";
