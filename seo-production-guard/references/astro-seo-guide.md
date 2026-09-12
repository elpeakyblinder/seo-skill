# Astro

Inspecciona astro.config, versión, adaptador y rutas antes de modificar el layout. Conserva site, base, trailingSlash, i18n e integraciones existentes cuando sean correctos.

## Configuración

site representa el origen público estable. Configúralo con un dato real; si se obtiene del entorno, valida su presencia en build y normaliza el protocolo. No sustituyas site por el host de preview.

Configura @astrojs/sitemap solo si se necesita. Revisa su salida: la integración no descubre automáticamente todas las rutas SSR dinámicas. Enumera las páginas publicadas o usa un endpoint conectado a la fuente de contenido. Filtra noindex/borradores y verifica que base y trailingSlash coincidan con los canonicals. Una política de slash aplicada solo en el head no configura redirecciones.

## Componente SEO independiente

Ejemplo src/components/Seo.astro para integrar dentro del head existente. No reemplaza el layout, branding, idiomas ni manifiesto del proyecto. Requiere el módulo src/lib/jsonld.ts de [JSON-LD](structured-data-jsonld.md).

El llamador entrega canonicalUrl desde la misma fuente de rutas usada en enlaces/sitemap: debe ser absoluto, preferido y conservar los parámetros con identidad propia. No se fuerza un slash ni se eliminan todas las queries dentro del componente.

```astro
---
import { serializeJsonLd } from "../lib/jsonld";

interface Props {
  title: string;
  description: string;
  canonicalUrl: string;
  siteName: string;
  ogLocale: string;
  image?: {
    url: string;
    width: number;
    height: number;
    type: string;
    alt: string;
  };
  alternates?: { language: string; url: string }[];
  structuredData?: Record<string, unknown>;
  robots?: string;
}

const {
  title, description, canonicalUrl, siteName, ogLocale,
  image, alternates = [], structuredData, robots,
} = Astro.props;

const canonical = new URL(canonicalUrl);
const imageUrl = image ? new URL(image.url, canonical).href : undefined;
---

<title>{title}</title>
<meta name="description" content={description} />
<link rel="canonical" href={canonical.href} />
{robots && <meta name="robots" content={robots} />}
{alternates.map((alternate) => (
  <link rel="alternate" hreflang={alternate.language} href={alternate.url} />
))}
<meta property="og:type" content="website" />
<meta property="og:url" content={canonical.href} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:site_name" content={siteName} />
<meta property="og:locale" content={ogLocale} />
{image && imageUrl && (
  <>
    <meta property="og:image" content={imageUrl} />
    <meta property="og:image:type" content={image.type} />
    <meta property="og:image:width" content={String(image.width)} />
    <meta property="og:image:height" content={String(image.height)} />
    <meta property="og:image:alt" content={image.alt} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content={imageUrl} />
    <meta name="twitter:image:alt" content={image.alt} />
  </>
)}
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
{structuredData && (
  <script type="application/ld+json" set:html={serializeJsonLd(structuredData)} />
)}
```

Adapta og:type a artículos cuando corresponda. Este ejemplo omite imagen si no existe: para una tarea que requiere banner eso sigue siendo un pendiente, no una validación completa. Evita duplicar title/canonical/robots del layout previo. El layout mantiene html lang con el idioma real.

Para varias traducciones, construye alternates desde las versiones publicadas del mismo contenido y añade la propia. Si usas x-default, apunta al fallback real. No crees automáticamente es/en/fr.

## Imágenes con astro:assets

getImage recibe width (singular) para una transformación. Si se redimensiona deliberadamente a 1200 × 630, confirma el recorte visual; en otros casos conserva la relación original y usa las dimensiones reales del resultado.

```astro
---
import { getImage } from "astro:assets";
import cover from "../assets/cover.png";

// Integra el import real del proyecto; este archivo no lo proporciona la skill.
const banner = await getImage({
  src: cover,
  width: 1200,
  format: "png",
});
const socialImage = {
  url: banner.src,
  width: Number(banner.attributes.width),
  height: Number(banner.attributes.height),
  type: "image/png",
  alt: "Descripción de la portada real",
};
---
```

Pasa socialImage al componente; confirma números válidos, URL final y Content-Type descargando el resultado. En SSR/adaptadores verifica el servicio de imágenes realmente disponible. No asumas que Sharp funciona igual en cualquier runtime.

## Comprobaciones específicas

Prueba una ruta interior y una traducción con y sin slash según la política real, además de una URL inexistente. Verifica que ninguna emite entidades del autor de esta skill, nombres de ejemplo, alternates inventados ni MIME fijo incorrecto.

## Fuentes

- [Astro configuración](https://docs.astro.build/en/reference/configuration-reference/).
- [Astro imágenes](https://docs.astro.build/en/guides/images/).
- [Astro sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/).
- [Directivas de plantilla](https://docs.astro.build/en/reference/directives-reference/).
