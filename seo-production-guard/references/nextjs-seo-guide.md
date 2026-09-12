# Next.js App Router

Comprueba la versión instalada y el adaptador antes de copiar firmas de APIs. Integra estos módulos en las convenciones existentes del proyecto. Los imports de contenido que se mencionan son puntos de integración, no dependencias incluidas en la skill.

## Origen público

Configura SITE_URL con el origen estable real en build y runtime. Puede ser un subdominio público de plataforma. Puedes conservar NEXT_PUBLIC_SITE_URL si ya se usa; no necesitas exponerlo al cliente únicamente para generar metadatos.

Ejemplo src/lib/site.ts para sitios en la raíz del host:

```typescript
export function normalizeSiteUrl(value: string): URL {
  const raw = value.trim();
  if (!raw) throw new Error("SITE_URL vacío");
  const url = new URL(/^https?:\/\//i.test(raw) ? raw : "https://" + raw);
  if (
    url.protocol !== "https:" || url.username || url.password ||
    url.pathname !== "/" || url.search || url.hash
  ) {
    throw new Error("SITE_URL debe ser un origen HTTPS sin ruta, credenciales ni parámetros");
  }
  return url;
}

export function getSiteUrl(): URL {
  const configured = process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL;
  if (!configured) throw new Error("Configura el origen público real en SITE_URL");
  return normalizeSiteUrl(configured);
}
```

Si falta el dato, reporta la configuración necesaria antes de introducir este helper en un flujo de build existente. No uses un host inventado ni captures el error para publicar un canonical incorrecto. Para sitios bajo basePath adapta composición y pruebas a esa ruta base; este ejemplo no la infiere.

No uses VERCEL_URL/CF_PAGES_URL de preview como origen estable. Una variable de producción verificada puede servir como fuente si el proyecto la utiliza expresamente. El estado de preview debe venir de la configuración del deployment, no de asumir que todo subdominio es temporal.

## Layout frente a página

Mantén metadataBase y campos realmente comunes en el layout. El canonical, og:url, título y descripción específicos se calculan por página. Next.js hereda campos y reemplaza objetos anidados como openGraph de forma superficial: reutiliza un constructor completo o combina explícitamente los campos requeridos.

```typescript
// app/layout.tsx: export de metadata; conserva el componente existente.
import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
};
```

Ejemplo src/lib/page-metadata.ts; recibe el canonical absoluto ya calculado con la política de rutas del proyecto:

```typescript
import type { Metadata } from "next";

export function buildPageMetadata(input: {
  title: string;
  description: string;
  canonicalUrl: string;
  siteName: string;
  ogLocale: string;
  image: { url: string; width: number; height: number; type: string; alt: string };
  languages?: Record<string, string>;
}): Metadata {
  return {
    title: input.title,
    description: input.description,
    alternates: {
      canonical: input.canonicalUrl,
      ...(input.languages ? { languages: input.languages } : {}),
    },
    openGraph: {
      type: "website",
      title: input.title,
      description: input.description,
      url: input.canonicalUrl,
      siteName: input.siteName,
      locale: input.ogLocale,
      images: [input.image],
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [{ url: input.image.url, alt: input.image.alt }],
    },
  };
}
```

Llama al constructor desde metadata o generateMetadata de cada página usando su contenido real. Para artículos cambia og:type y sus propiedades pertinentes. No emitas un conjunto languages vacío ni alternates hacia páginas no publicadas. Conserva robots restrictivos del entorno y de rutas privadas; este helper no los sobrescribe.

Para rutas dinámicas, carga el registro real, usa su slug canónico y llama notFound() si no existe. Comparte la fuente con el contenido de la página. Las firmas de params dependen de la versión: consulta la documentación correspondiente.

## Imágenes

Usa un archivo social existente o opengraph-image.tsx con ImageResponse según la necesidad. Para generación, exporta size, contentType y alt; usa generateImageMetadata cuando necesites metadatos variables compatibles con tu versión. Verifica tipografías y activos disponibles en el runtime real.

La convención de archivos tiene prioridad sobre metadatos configurados. Evita mantener simultáneamente una imagen OG generada y una twitter:image estática obsoleta: comparte la fuente o configura twitter-image explícitamente. Descargar el endpoint es parte de la validación, no basta con que aparezca su URL.

## Noindex y previews

Para HTML puede usarse robots: { index: false } por ruta o X-Robots-Tag: noindex. Para recursos no HTML usa encabezados. Integra rutas realmente existentes en la configuración de headers/middleware; no reemplaces reglas actuales.

Configura la exclusión de previews según el proveedor y comprueba GET en preview y producción. No añadas Disallow a una página pública que necesita ser rastreada para procesar noindex. La autenticación de contenido privado permanece obligatoria.

## Sitemap desde registros publicados

Ejemplo src/lib/sitemap-entries.ts; adapta la consulta CMS/repositorio en app/sitemap.ts para pasar únicamente páginas publicadas indexables. Las URLs y el mapa de idiomas deben provenir del mismo inventario que los metadatos.

```typescript
import type { MetadataRoute } from "next";

export function buildSitemapEntries(pages: {
  canonicalUrl: string;
  updatedAt?: string;
  languages?: Record<string, string>;
}[]): MetadataRoute.Sitemap {
  return pages.map((page) => ({
    url: page.canonicalUrl,
    ...(page.updatedAt ? { lastModified: page.updatedAt } : {}),
    ...(page.languages ? { alternates: { languages: page.languages } } : {}),
  }));
}
```

Verifica fechas y URLs antes de pasar datos. No añadas new Date() como fecha universal. Configura robots.ts para conservar la política real y referenciar el sitemap absoluto. Ver [indexación](indexing-sitemaps-llms.md).

## OpenNext y comprobación

Con @opennextjs/cloudflare utiliza el runtime Node.js de Next.js compatible con el adaptador; no selecciones Edge por el hecho de ejecutarse en Workers. Revisa la configuración actual del adaptador, variables de build/runtime y disponibilidad de recursos en su preview. No modifiques Wrangler o migres hosting como efecto secundario de una corrección SEO.

Comprueba homepage y ruta interior con canonicals distintos. En versiones con streaming de metadatos, inspecciona la respuesta completa y el comportamiento para bots limitados a HTML; no concluyas que faltan metadatos mirando únicamente el primer fragmento.

## Fuentes

- [Next.js generateMetadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata).
- [Imágenes de metadatos](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image).
- [Sitemap](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap).
- [OpenNext Cloudflare](https://opennext.js.org/cloudflare).
