# Contexto de origen: Next.js en Vercel y Cloudflare

Licita y [Míralo](https://miralo.lol) motivaron patrones de la [skill](../seo-production-guard/SKILL.md). Estas notas no certifican el estado actual de sus despliegues.

Las lecciones conservadas son normalizar hosts sin protocolo, distinguir origen estable y preview, comprobar endpoints de imágenes, separar noindex de autenticación y escapar JSON-LD al insertarlo como HTML.

Durante la preparación de 0.1.0 se retiraron enlaces a rutas privadas de Windows y garantías no verificadas. No se repitieron pruebas de producción, indexación o tarjetas sociales.

Para implementaciones usa la [guía Next.js](../seo-production-guard/references/nextjs-seo-guide.md). OpenNext utiliza el runtime Node.js de Next.js; ejecutar en Workers no implica seleccionar Edge.

Una reproducción futura debe registrar versiones, entorno, URLs y respuestas sin publicar credenciales o datos privados.
