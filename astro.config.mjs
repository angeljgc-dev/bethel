// @ts-check
import { defineConfig } from "astro/config";

export default defineConfig({
  /* GitHub Pages de proyecto: el sitio cuelga de /bethel, no de la raiz. Sin
     esto, todos los enlaces internos apuntarian a la raiz del dominio y darian
     404 en produccion aunque funcionen en local. */
  site: "https://angeljgc-dev.github.io",
  base: "/bethel",
  /* Astro no lee PORT del entorno por su cuenta. */
  server: { port: Number(process.env.PORT) || 4321 },
  /* Un solo archivo CSS: en 3G cada peticion extra cuesta una ida y vuelta
     completa, entre 300 y 500 ms. */
  build: { inlineStylesheets: "auto" },
});
