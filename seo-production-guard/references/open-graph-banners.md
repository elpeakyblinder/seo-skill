# Open Graph, Twitter Cards y activos

## Configuración fiable

Emite og:title, og:type, og:url y og:image; añade descripción y nombre del sitio coherentes con el contenido. Usa una URL de imagen absoluta HTTPS en producción. Resuelve rutas de código con metadataBase en Next.js o new URL en Astro.

Las propiedades estructuradas de imagen (width, height, type, secure_url) son opcionales en Open Graph. Esta skill recomienda dimensiones y MIME reales para reducir ambigüedad, junto con alt descriptivo. secure_url ofrece una alternativa HTTPS; si og:image ya es HTTPS no es un requisito universal adicional.

Para un banner panorámico, 1200 × 630 y summary_large_image son valores iniciales razonables. Conserva imágenes adecuadas con otras medidas y declara su tamaño real. Selecciona PNG/JPEG para compatibilidad amplia o WebP cuando se haya comprobado con las plataformas objetivo. Un objetivo de peso menor de 300 KB es una optimización, no un límite universal de aceptación.

En X existen fallbacks a Open Graph para algunos campos. Puedes declarar twitter:title, description, image y image:alt explícitamente para controlar el resultado. No atribuyas las reglas de X a WhatsApp o LinkedIn.

## Diagnóstico cuando la tarjeta falla

1. Haz GET a la página sin sesión con el User-Agent relevante. Inspecciona metadatos completos, status y cadena de redirecciones.
2. Resuelve la URL elegida de imagen y haz GET. Descarta respuestas HTML disfrazadas de 200, autenticación, enlaces firmados caducados, protección anti-hotlink y desafíos WAF.
3. Compara Content-Type y dimensiones decodificadas con los metadatos. Comprueba que el recurso se sirve también después del build/despliegue.
4. Revisa etiquetas duplicadas o imágenes múltiples: el orden y la selección del consumidor importan.
5. Si el recurso cambió, considera caché del CDN y del scraper. Usa un nombre versionado de imagen cuando corresponda; no cambies el canonical para purgar una tarjeta.
6. Verifica mediante [Meta Sharing Debugger](https://developers.facebook.com/tools/debug/) o [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) cuando haya acceso. Reporta qué herramienta se ejecutó realmente.

Una redirección no implica por sí sola un fallo: verifica su destino y límites del consumidor. No prometas forma, tamaño ni actualización instantánea de la tarjeta; la plataforma decide el renderizado.

## Marca y archivos

Busca primero activos existentes. Respeta geometría, colores y nombre oficial; usa el contenido de la página para decidir entre portada editorial, captura y banner de marca. No fuerces un logo como única imagen representativa de todos los artículos.

| Activo | Recomendación | Cuándo |
| --- | --- | --- |
| Banner | 1200 × 630; texto alejado de bordes y legible en tamaño pequeño | Preview social |
| Apple touch icon | PNG 180 × 180, fondo opaco | Si se necesita icono de inicio iOS |
| Favicon | SVG o ICO multiresolución con declaración correcta | Identidad del sitio |
| Iconos PWA | Tamaños y propósito del manifest existente | Solo si hay PWA en alcance |

ImageResponse es apropiado para banners por página/idioma; un recurso estático es suficiente si no cambia. Inspecciona visualmente el resultado: textos largos, acentos, fuentes, recortes y logo. No añadas enlaces a manifest o iconos inexistentes.

Si no puedes crear un activo necesario, entrega solo su ficha pendiente: ruta propuesta, dimensiones, formato y contenido. Mantén un fallback existente válido cuando sea posible.

## Fuentes

- [Open Graph Protocol](https://ogp.me/): propiedades básicas y estructuradas.
- [Next.js: imágenes de metadatos](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image).
- [Google Discover](https://developers.google.com/search/docs/appearance/google-discover): criterios propios de imágenes grandes, diferentes de la tarjeta social.
