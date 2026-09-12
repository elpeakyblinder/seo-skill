---
name: seo-production-guard
description: Audita e implementa SEO técnico en Astro y Next.js: metadatos por ruta, canonicals, previews sociales, JSON-LD, hreflang, robots y sitemaps. Úsala para corregir indexabilidad o enlaces compartidos; no sustituye investigación de palabras clave, estrategia editorial ni auditorías generales de seguridad.
license: CC-BY-NC-4.0
metadata:
  version: "0.1.0"
---

# SEO Production Guard

Entrega cambios de SEO comprobables en la respuesta del servidor y en los recursos publicados. Una compilación exitosa o una etiqueta presente no prueban que el destino sea correcto, rastreable o indexable.

## Selecciona el trabajo

- **Auditoría:** inspecciona, prioriza hallazgos y presenta evidencia. No conviertas una revisión en una implementación.
- **Implementación:** aplica los cambios pedidos sobre la arquitectura existente; valida las rutas afectadas.
- **Diagnóstico de previews:** sigue página → metadatos → imagen → respuesta al scraper → caché. No reconstruyas todo el SEO para arreglar un banner.
- **Indexación:** distingue descubrimiento, rastreo, renderizado, canonicalización e inclusión en el índice. Una solicitud de indexación no garantiza inclusión ni plazo.

Identifica framework y versión instalada, adaptador, modo estático/SSR, rutas, idiomas publicados y política de dominio. Reutiliza configuración y activos existentes. No cambies idiomas, branding, política de bots, URLs públicas o hosting por preferencia de la plantilla.

## Referencias bajo demanda

Lee únicamente las guías aplicables antes de implementar ese componente:

| Necesidad | Referencia |
| --- | --- |
| Metadata API, herencia y rutas Next.js | [Next.js](references/nextjs-seo-guide.md) |
| Layout, activos y rutas Astro | [Astro](references/astro-seo-guide.md) |
| Banners, iconos y diagnóstico social | [Open Graph](references/open-graph-banners.md) |
| Selección de entidades y serialización | [JSON-LD](references/structured-data-jsonld.md) |
| Robots, sitemaps, idiomas y entrega a consolas | [Indexación](references/indexing-sitemaps-llms.md) |

Las plantillas son puntos de integración: adapta rutas, tipos y fuentes de datos. Comprueba la documentación oficial enlazada cuando la versión instalada o el comportamiento del proveedor difieran; no declares compatibilidad con versiones que no has probado.

## Invariantes que evitan regresiones

### Dominio y URLs

- Usa una fuente de verdad para el origen público de producción, incluso cuando sea un subdominio de plataforma. Un dominio propio no es requisito para publicar.
- Distingue producción, preview y desarrollo. No uses el host efímero del deployment o un encabezado Host arbitrario como canonical de producción.
- Si falta el origen, continúa la inspección e identifica el dato pendiente. No publiques un dominio inventado ni ocultes una configuración inválida con un fallback ficticio.
- Conserva la política existente de trailing slash, base path y rutas localizadas. Canonicals, enlaces internos, alternates, redirecciones y sitemap deben concordar.
- Quita parámetros de seguimiento. Conserva parámetros que identifican contenido distinto cuando esa URL sea indexable: paginación, variantes o filtros no se descartan indiscriminadamente.
- Cada página indexable debe señalar su versión preferida real. No heredes el canonical de inicio en páginas interiores ni apuntes todas las páginas paginadas a la primera.
- En migraciones autorizadas, verifica redirecciones permanentes por ruta, ausencia de bucles y conservación de parámetros pertinentes. No redirijas previews necesarios para QA como si fueran dominios públicos antiguos.

### Metadatos y activos

- Comprueba títulos y descripciones contextuales, un único canonical efectivo y coherencia entre la página, Open Graph y Twitter Cards.
- Exige URL absoluta HTTPS para la imagen social emitida en producción. Las rutas relativas en el código son válidas si el framework las resuelve correctamente.
- Declara dimensiones, MIME y alt reales cuando estén disponibles. 1200 × 630 es una recomendación para banners, no una medida que deba inventarse para aprobar una prueba.
- Comprueba que la imagen existe, se descarga sin sesión ni desafío y devuelve contenido de imagen válido. Un HTTP 200 que contiene HTML no sirve.
- Reutiliza logos y recursos de marca. Crea iconos/PWA solo cuando el alcance lo requiera. Si falta un activo, usa uno existente adecuado o reporta la dependencia; no emitas enlaces rotos como solución terminada.
- Usa summary_large_image para banners panorámicos; respeta una tarjeta summary elegida deliberadamente.

### Rastreo y privacidad

- Conserva las exclusiones existentes hasta entender su propósito. No reemplaces robots.txt por Allow: / indiscriminadamente.
- noindex en HTML o X-Robots-Tag controla indexación; robots.txt controla rastreo. Google debe poder rastrear una página pública para leer su noindex.
- El contenido privado requiere control de acceso. No describas etiquetas SEO como protección de datos ni abras rutas privadas para que un bot lea noindex.
- Previews públicos deben conservar su exclusión de indexación; comprueba que no se filtra a producción. No introduzcas index, follow globalmente sobre restricciones existentes.
- Ofrece max-image-preview:large para contenido público cuando encaje con su política de previews. No promete presencia en Discover.
- llms.txt es opcional: no sustituye HTML accesible, robots o sitemap y no garantiza citas, indexación ni respuestas correctas de una IA.

### Idiomas y datos estructurados

- Emite hreflang solamente entre traducciones publicadas equivalentes, incluyendo la propia página y enlaces recíprocos. Respeta slugs traducidos y traducciones parciales.
- Cada traducción indexable mantiene su canonical correspondiente. Añade x-default cuando exista un fallback apropiado; no es requisito universal.
- No necesitas duplicar hreflang en HTML y sitemap. Si ambos existen, genera ambos desde el mismo mapa.
- Selecciona esquemas que describan contenido visible y verdadero. No inventes ratings, precios, direcciones, áreas de servicio, perfiles ni tipos de aplicación.
- Usa @id estable para relaciones; @graph es conveniente con varias entidades, pero no invalida otros JSON-LD correctos.
- Al insertar JSON-LD como HTML, serializa y escapa < mediante replace(/</g, "\\u003c"). Verifica que un texto con cierre de script no cree elementos HTML.
- Distingue validez Schema.org de elegibilidad para rich results; ninguna garantiza que Google los muestre.

## Verificación proporcional al alcance

Construye un inventario breve de rutas afectadas con URL esperada, indexabilidad, canonical, imagen y alternates. En sitios grandes muestrea cada plantilla y sus excepciones; indica cobertura real.

1. Ejecuta el build y las comprobaciones existentes que afecten a los cambios.
2. Inspecciona el HTML completo y los encabezados con GET, incluyendo redirecciones. No dependas solo de búsquedas de texto en código fuente o de HEAD.
3. Contrasta una portada y una ruta interior; añade ruta dinámica, traducción, noindex y 404 si existen y están dentro del alcance.
4. Descarga las imágenes y contrasta formato/dimensiones con las etiquetas. Para previews rotas prueba el User-Agent del scraper pertinente y examina caché, WAF y redirects; una simulación local no prueba acceso desde la red del proveedor.
5. Analiza JSON-LD como JSON y comprueba su correspondencia con contenido visible. Usa Schema.org Validator y, para funciones compatibles de Google, Rich Results Test.
6. Revisa sitemap y robots efectivos. El sitemap incluye URLs canónicas indexables, no redirects, errores, rutas privadas o alternates inexistentes. lastmod representa modificaciones reales o se omite.
7. Distingue evidencia local, build y producción. Si no se desplegó o no hay acceso, registra esa verificación pendiente sin afirmar éxito en producción.

## Entrega

En auditorías: hallazgo, impacto, ubicación, evidencia y corrección sugerida; separa problemas comprobados de hipótesis.

En implementaciones: cambios, rutas verificadas, resultados y pendientes concretos. Cuando corresponda a una publicación, entrega el sitemap absoluto y URLs prioritarias verificadas para Search Console/Bing, sin inventar dominios ni exigir indexar páginas legales por defecto. Ofrece guía de consolas si aporta valor; no impongas preguntas de cierre o expansión multilingüe.

No prometas rankings, previews infalibles, indexación inmediata ni validación externa que no hayas ejecutado.

© 2026 Guijosa Dev. [CC BY-NC 4.0](LICENSE). Permisos comerciales: devcharlying@gmail.com.
