# Indexación, idiomas y entrega

## Elige el control según el objetivo

| Objetivo | Mecanismo | Comprobación |
| --- | --- | --- |
| Página pública indexable | Acceso, enlaces rastreables, canonical coherente | HTML y status correctos, sin noindex accidental |
| Pública fuera de resultados | Meta robots noindex o X-Robots-Tag: noindex | Rastreo permitido para que el bot lea la directiva |
| Contenido privado | Autenticación/autorización | No entrega contenido a visitantes no autorizados |
| Reducir rastreo | Disallow en robots.txt | No confundir con eliminación del índice |
| Preview | Restricción del hosting o noindex por entorno | No indexable; producción conserva su política |

No abras datos privados para permitir leer un noindex. Si una página pública ya indexada está bloqueada en robots.txt, evalúa permitir su rastreo para que pueda procesarse noindex. Las eliminaciones urgentes y cambios de acceso requieren su propio flujo autorizado.

Meta robots y X-Robots-Tag son alternativas válidas; el encabezado también sirve para PDF y otros recursos no HTML. Un HTTP 404/410 real debe conservarse en contenido inexistente: no redirijas cualquier URL desconocida al inicio.

## Robots y bots de IA

Inspecciona robots.txt antes de editar. Conserva grupos específicos, exclusiones y elección del propietario. Una regla específica para un bot puede desplazar la genérica: revisa sus restricciones efectivas.

Para un sitio enteramente público sin exclusiones, esta es una plantilla mínima; sustituye el host antes de publicar:

```text
User-agent: *
Allow: /

Sitemap: https://example.com/sitemap.xml
```

Permitir OAI-SearchBot facilita que el contenido pueda aparecer en búsquedas de ChatGPT; no garantiza selección. No hace falta un grupo redundante si ya lo permite la política general. Distingue bots de búsqueda, entrenamiento y acceso solicitado por usuarios; no cambies su política en bloque. Comprueba también WAF y autenticación.

llms.txt es una propuesta para facilitar acceso de agentes a información. Úsalo opcionalmente si el proyecto lo pide o mantiene documentación para agentes. Incluye resumen y enlaces públicos exactos, mantenidos desde fuentes reales. No publiques secretos, promesas de precios desactualizadas ni instrucciones de manipulación para buscadores. No lo presentes como requisito de indexación o método para evitar alucinaciones.

## Sitemap

Genera desde el inventario real de rutas/contenido cuando ayude a mantenerlo actualizado; un archivo estático correcto es suficiente para un sitio pequeño.

- Solo URLs absolutas canónicas que se desean indexar; excluye borradores, noindex, privados, redirects y errores.
- lastmod indica la última modificación significativa y verificable; omítelo si no hay fecha fiable. No uses la fecha actual en todas las entradas.
- Google ignora priority y changefreq.
- Usa XML válido, escapado y UTF-8. Divide al superar 50,000 URLs o 50 MB sin comprimir por sitemap.
- Referencia el destino real en robots.txt. Un enlace rel=sitemap en HTML es opcional.
- En Astro comprueba el contenido generado por @astrojs/sitemap; rutas SSR/dinámicas pueden requerir enumeración explícita. En Next.js deriva sitemap.ts de la misma fuente que las rutas.

## Traducciones parciales

Construye un mapa por contenido equivalente, no el producto cartesiano entre slugs e idiomas. Por ejemplo, un artículo solo traducido a es/en no debe apuntar a una versión francesa inexistente.

Cada grupo incluye la propia URL y referencias recíprocas entre traducciones indexables. Usa códigos de idioma/región admitidos por Google; x-default es un fallback opcional apropiado, no un idioma.

HTML, encabezados HTTP y sitemap son métodos equivalentes para hreflang. Elige el más mantenible. Si se usan varios, reutiliza el mismo mapa y comprueba que coinciden. Traduce títulos, descripciones, alt y nombres de breadcrumbs; no traduzcas IDs estables de una misma entidad sin motivo.

## Entrega a Search Console y Bing

Si hay origen público verificado, entrega sitemap absoluto y una selección de páginas públicas importantes. Si solo se probó localmente, indica qué falta comprobar en producción.

Para una propiedad de dominio de Google, usa verificación DNS si el usuario tiene acceso; para un prefijo de URL, utiliza uno de sus métodos admitidos. Una variable de entorno de verificación solo funciona si el código emite el token correcto.

El envío de sitemap y la inspección de URL permiten solicitar rastreo; no garantizan indexación ni un plazo de 24–48 horas. No afirmes que se enviaron sin haber ejecutado esa acción.

## Fuentes

- [Google: noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing).
- [Google: sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).
- [Google: versiones localizadas](https://developers.google.com/search/docs/specialty/international/localized-versions).
- [OpenAI: publishers](https://help.openai.com/en/articles/12627856).
- [Propuesta llms.txt](https://llmstxt.org/).
- [Search Console](https://search.google.com/search-console) y [Bing Webmaster Tools](https://www.bing.com/webmasters).
