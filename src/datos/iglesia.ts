/* Datos de la iglesia.

   Aqui esta TODO lo que cambia cuando la iglesia conteste. Ningun componente
   escribe una hora, una direccion ni un enlace: los lee de aqui.

   Parte ya es real y tiene fuente (nombre, direccion, telefono, correo, redes,
   horario y los siete servicios grabados). Lo que sigue siendo de muestra lleva
   la marca MUESTRA en su comentario y esta listado en INVENTADO, que es lo que
   el candado imprime cuando alguien intenta publicar.

   El candado sigue puesto: mientras CONFIRMADO_POR_LA_IGLESIA sea false, el
   build de produccion FALLA. Se ve el sitio, no se puede publicar por accidente.
   Las preguntas para conseguir los datos estan en
   docs/PREGUNTAS-PARA-LA-IGLESIA.md, ordenadas por urgencia. */

export const CONFIRMADO_POR_LA_IGLESIA = false;

/* Lo que falta. Lo lee el candado para decir exactamente que hay que conseguir.
   Va en el mismo orden de urgencia que las preguntas. */
export const INVENTADO = [
  "confirmar que el celular publicado recibe WhatsApp",
  "cual de los dos nombres se publica (IGLESIA.nombreCompleto)",
  "el responsable del aviso de privacidad",
  "COMO_LLEGAR: por donde se entra, como se ve la puerta, donde se estaciona",
  "COMO_LLEGAR.llegarTarde: confirmar que es cierto que se entra despues de las 10",
  "confirmar si el correo es betherlcasade o bethelcasade",
  "NINOS: si hay salon, edades, quien esta a cargo y como es la entrega",
  "PRIMERA_VEZ.tramos: el minuto a minuto real del domingo",
  "IGLESIA.historia y LIDERAZGO",
  "CULTOS: que es la reunion del martes y la del jueves, y cuanto duran",
  "PRIMERA_VEZ.ofrenda: como es de verdad en Casa Bethel",
  "PRIMERA_VEZ.vestimenta: como se viste la gente de verdad",
  "ATENCION: quien contesta el WhatsApp y en que horario",
];

export const IGLESIA = {
  /* Dos formas publicadas por la propia iglesia: "Iglesia Casa Bethel ACyM"
     (Facebook) y "Casa de Dios Bethel" (YouTube). Se usa la de Facebook, que es
     donde la gente del pueblo la encuentra, y se cambia aqui si prefieren la
     otra. No se mezclan las dos en la misma pagina. */
  marca: "Casa Bethel",
  nombreCompleto: "Iglesia Casa Bethel ACyM",
  denominacion: "ACyM",
  /* Una linea para quien no sabe que es la ACyM, en lenguaje de afuera. */
  denominacionExplicada:
    "Casa Bethel es una iglesia cristiana evangélica. Las siglas ACyM del nombre quieren decir " +
    "Alianza Cristiana y Misionera: es el grupo de iglesias al que pertenece, no un apellido.",
  /* La mision es de ellos, publicada en Facebook. Se cita en Quienes somos, no
     se usa de titular. */
  mision:
    "Nuestra misión es predicar el evangelio con el amor, paz y paciencia que Jesús tuvo.",

  ciudad: "Matías Romero",
  estado: "Oaxaca",
  colonia: "Los Robles Oriente",
  calle: "Callejón Ceiba",
  /* El callejon no tiene numero exterior publicado. Si lo hay, entra aqui y la
     placa de la puerta vuelve a llevar el numero en grande, que es lo que una
     persona busca en una fachada. */
  numero: "",
  cp: "70304",
  direccion: "Callejón Ceiba, Los Robles Oriente",

  /* Solo digitos, con el 52 de Mexico al frente: formato de wa.me */
  whatsapp: "529727276904",
  telefonoVisible: "972 727 6904",
  /* Asi esta escrito en su Facebook. Parece un dedazo y hay que confirmarlo:
     un correo mal escrito es un correo que nadie contesta. MUESTRA la grafia. */
  correo: "betherlcasade@gmail.com",

  facebook: "https://www.facebook.com/profile.php?id=61561747756518",
  youtube: "https://www.youtube.com/@CasaDeDiosBethel-w3l",
  tiktok: "https://www.tiktok.com/@casa.de.dios.beth3",
  sitio: "https://angeljgc-dev.github.io/bethel/",

  /* MUESTRA: vacia a proposito. La historia es la linea con mas peso emocional
     del sitio y la de antes estaba inventada. Mientras este vacia, Quienes
     somos abre con la denominacion explicada y con su mision. */
  historia: "",
} as const;

/* Como llegar. Los dos huecos caros del sitio: la entrada correcta es el miedo
   numero uno documentado, y un porton verde inventado es peor que un parrafo
   que falta. Vacio significa que esa linea no se pinta. */
export const COMO_LLEGAR = {
  /* MUESTRA: vacios hasta que la iglesia describa su puerta. */
  puerta: "",
  otraPuerta: "",
  estacionamiento: "",
  siSeLlena: "",
  distancia: "",
  /* La frase grande del cruce, la del panel verde. Decia "Cruzas el porton" y
     nadie ha dicho que la entrada sea un porton: es la misma invencion que
     `puerta`, escrita en el tipo mas grande de la pagina. Sale de aqui y
     mientras este vacia el panel se queda sin frase, que es decorado y no
     pierde ningun dato. Cuando la iglesia describa su puerta, aqui entra
     "Cruzas el porton verde", o lo que sea de verdad. MUESTRA: vacia. */
  cruce: "",
  /* MUESTRA: nadie ha confirmado que se pueda entrar tarde, y con tres horas de
     culto es la frase que mas peso carga en la pagina. Ademas viaja dentro del
     archivo de calendario, que es lo unico que sigue en el telefono de alguien
     una semana despues. Va en INVENTADO para que el candado la grite. */
  llegarTarde: "Si llegas tarde, entra igual.",
  /* El mapa apunta al pueblo mientras no haya un punto exacto que verificar. */
  mapa: "https://maps.google.com/?q=Callej%C3%B3n+Ceiba+Los+Robles+Oriente+Mat%C3%ADas+Romero+Oaxaca",
} as const;

/* Los cultos. La hora y la duracion en minutos son el unico origen: el fin lo
   deriva finDe() en lib/candado.ts, asi que cambiar aqui la hora cambia la
   barra, la portada, la invitacion y el archivo de calendario a la vez.

   minutos en null quiere decir que no sabemos cuanto dura: entonces no se
   publica hora de salida, solo la de entrada. */
export const CULTOS = [
  { dia: "Domingo", nombre: "Culto", hora: "10:00", minutos: 180, principal: true },
  /* MUESTRA lo que falta: que es cada una y cuanto dura. La hora si es real. */
  { dia: "Martes", nombre: "", hora: "18:00", minutos: null, principal: false },
  { dia: "Jueves", nombre: "", hora: "18:00", minutos: null, principal: false },
] as const;

/* El minuto a minuto. Es lo que ninguno de los siete sitios analizados publica,
   y es lo que elimina la incertidumbre de quien nunca ha ido.

   MUESTRA ENTERA. Los seis tramos son una estructura verosimil de un servicio
   de tres horas, puesta para que la iglesia tenga algo concreto que corregir.
   Lo unico medido es que los servicios grabados duran de 91 a 128 minutos y el
   culto dura 180, asi que hay entre 50 y 90 minutos que no estan en el video.

   desde y hasta son numeros, no texto, porque de ellos salen el riel, las
   marcas del sol y el contador. */
export const PRIMERA_VEZ = {
  tramos: [
    { desde: 0, hasta: 20, texto: "Llega la gente. Hay música y alguien en la entrada te saluda y te dice dónde hay lugar." },
    { desde: 20, hasta: 70, texto: "Se canta. Mucha gente canta de pie. Puedes quedarte sentado, nadie lo va a notar. La letra va en pantalla." },
    { desde: 70, hasta: 85, texto: "Avisos de la semana y un saludo a quien está al lado. Un buenos días y ya." },
    { desde: 85, hasta: 95, texto: "Un momento de oración. Puedes quedarte sentado y en silencio." },
    { desde: 95, hasta: 165, texto: "Se lee un pasaje de la Biblia y se explica. Es la parte más larga. Si no traes Biblia, el texto va en pantalla." },
    { desde: 165, hasta: 180, texto: "Una oración y una canción final. Al terminar la gente se queda platicando un rato. Puedes quedarte o irte directo." },
  ],
  /* MUESTRA: como se viste la gente de verdad. */
  vestimenta:
    "Lo que traes puesto. Vas a ver gente en playera y tenis y gente de camisa. " +
    "Nadie revisa a nadie en la puerta.",
  senalar:
    "No. No pedimos que los visitantes se pongan de pie, ni que digan su nombre en voz alta, " +
    "ni levantamos la mano de quien viene por primera vez. Si quieres pasar desapercibido, se puede: " +
    "las filas de atrás casi siempre tienen lugar.",
  acompanar:
    "Si prefieres que alguien te acompañe, avísanos por WhatsApp y te esperamos en la puerta.",
  /* MUESTRA: hay que confirmar como es la ofrenda aqui. Decir que si cuando es
     no, o al reves, anula la credibilidad de las otras seis respuestas. */
  ofrenda:
    "No se espera nada de ti. A la mitad del culto se pasa una bolsa: pásala de largo, " +
    "es normal y nadie lo mira. No hay sobres con tu nombre, ni listas, ni cuotas, " +
    "y no se anuncia quién dio cuánto. Esta página tampoco recibe dinero de ninguna forma.",
  salir: "Si necesitas salir antes, sal. Nadie te va a detener ni te va a preguntar por qué.",
} as const;

/* MUESTRA COMPLETA. Un protocolo infantil inventado es una promesa a un padre
   sobre sus hijos: mientras estos campos esten vacios, la seccion se publica
   reducida a lo que si es verdad. */
export const NINOS = {
  edades: "",
  salon: "",
  protocolo: "",
  dosAdultos: "",
  quedarse:
    "Aquí hay ruido de niños y a nadie le molesta. Si prefieres que se queden contigo, está bien.",
  aviso:
    "En esta página no publicamos fotos ni nombres de niños. Si quieres conocer el salón antes de traerlos, avísanos y te lo enseñamos.",
  responsables: [] as ReadonlyArray<{ nombre: string; funcion: string }>,
} as const;

/* MUESTRA: vacio. Sin nombres autorizados no se pinta la rejilla. */
export const LIDERAZGO: ReadonlyArray<{ nombre: string; funcion: string; contexto: string }> = [];

/* Los siete servicios publicados en su canal. Son grabaciones completas, de 91
   a 128 minutos, no sermones de 40: por eso la seccion lo dice antes de que
   alguien le de clic.

   Los titulos se acortan a su primera mitad, que es la imagen, y el subtitulo
   pasa al resumen. Los resumenes salen de la descripcion de cada video, en sus
   palabras, pasadas a lenguaje de afuera. */
export const PREDICAS = [
  {
    titulo: "Más allá de la barca",
    fecha: "12 de abril de 2026",
    minutos: 123,
    id: "YyfEsfxao7o",
    resumen:
      "Sobre Mateo 14:22-33: los discípulos que se quedaron en la barca por miedo al riesgo, y qué pasó cuando dejaron de mirar y se acercaron.",
  },
  {
    titulo: "El proceso de purificación",
    fecha: "8 de marzo de 2026",
    minutos: 128,
    id: "o94mNexEqZs",
    resumen:
      "Sobre Ester 2:12: que el propósito no llega de un día para otro, y que hay un tiempo de sanar heridas y dejar el enojo antes de que llegue.",
  },
  {
    titulo: "De la cueva al campo de batalla",
    fecha: "22 de febrero de 2026",
    minutos: 109,
    id: "158czO3Hufk",
    resumen:
      "Sobre Gedeón, en Jueces 6: un hombre escondido y con miedo, al que Dios llama valiente por lo que va a llegar a ser, no por lo que era.",
  },
  {
    titulo: "El favor de Dios",
    fecha: "1 de marzo de 2026",
    minutos: 91,
    id: "8M2bw1WeY74",
    resumen:
      "Sobre Nehemías 1: alguien que quiere reconstruir algo destruido, sin dinero y sin permiso, y cómo pidió antes de hablar.",
  },
  {
    titulo: "Todo o nada",
    fecha: "15 de febrero de 2026",
    minutos: 109,
    id: "D17E2AfXGoE",
    resumen:
      "Sobre Lucas 15:8-10: la mujer que perdió una moneda dentro de su propia casa, y qué cosas se pierden por descuido sin que uno se dé cuenta.",
  },
  {
    titulo: "El peligro de la caravana",
    fecha: "1 de febrero de 2026",
    minutos: 119,
    id: "SA0qET77PSQ",
    resumen: "Cuando la actividad desplaza a la presencia.",
  },
  {
    titulo: "Simón de Cirene",
    fecha: "8 de febrero de 2026",
    minutos: 116,
    id: "Tq-HElDb7-c",
    resumen: "El hombre que cargó la cruz de Jesús sin haberlo pedido, y lo que eso le dejó.",
  },
] as const;

/* Quien contesta y en que horario. MUESTRA vacio los dos: el sitio viejo decia
   "Contesta Hermana Lupita", que es tratamiento de adentro y ademas un nombre
   inventado. Mientras esten vacios, el cierre publica los tres contactos sin
   prometer a que hora contesta nadie. */
export const ATENCION = {
  quien: "",
  horario: "",
} as const;

/* El aviso de privacidad. Es obligatorio desde el 21 de marzo de 2025 aunque el
   sitio no tenga formularios, y sin responsable no cumple: por eso responsable
   esta en la lista de INVENTADO y no se rellena con nada.

   actualizado vacio quiere decir "todavia no se ha publicado": la pagina lo dice
   asi en vez de estampar la fecha de compilacion, que seria una fecha inventada
   distinta cada vez que alguien recompila. */
export const PRIVACIDAD = {
  responsable: "",
  domicilio: "",
  actualizado: "",
} as const;

/* La razon para creer que le va a servir. Se escribe en humano, nunca como cita
   de libro y capitulo. Se llena a mano cada semana; si esta vacio, la linea
   no sale de la invitacion y su resaltador se va con ella. */
export const PROXIMO_TEMA = "";
