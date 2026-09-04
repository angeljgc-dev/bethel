// @ts-check
import { defineConfig, fontProviders } from "astro/config";

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

  /* Dos fuentes, dos archivos, servidas desde el mismo dominio: sin peticion a
     fonts.googleapis.com no hay dos conexiones nuevas antes del primer texto.
     Solo el subconjunto latino y solo los pesos que se usan; el resto lo
     sintetiza el navegador.

     Las metricas de respaldo (size-adjust, ascent-override, descent-override)
     son obligatorias: sin ellas el salto de las fuentes medido antes de fijar
     las metricas fue de 0.059 y 0.083 de CLS. Para el cuerpo las genera Astro contra Arial,
     que es la referencia que se pidio. Para el titular la referencia es
     Georgia, que no esta en la tabla de metricas de Astro, asi que su respaldo
     se declara a mano en estilos/base.css con las dos familias medidas. */
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Fraunces",
      cssVariable: "--fuente-titular",
      weights: [600],
      styles: ["normal"],
      subsets: ["latin"],
      /* Sin respaldo automatico: el del titular va medido a mano contra
         Georgia, en base.css. */
      fallbacks: [],
    },
    {
      provider: fontProviders.google(),
      name: "Atkinson Hyperlegible",
      cssVariable: "--fuente-cuerpo",
      weights: [400],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["Arial", "Helvetica", "sans-serif"],
      optimizedFallbacks: true,
    },
  ],
});
