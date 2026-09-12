# JSON-LD: contenido verdadero y relaciones

## Elegir entidades

Describe lo visible en la página. Una página de un producto, su software y un caso de estudio pueden ser entidades distintas; no les asignes el mismo tipo automáticamente.

| Tipo | Aplicación |
| --- | --- |
| WebSite | Identidad estable del sitio |
| WebPage | Página concreta |
| ProfilePage | Página cuyo foco principal es una persona u organización |
| Person / Organization | Autor o entidad real; sameAs solo para perfiles confirmados |
| Article / CreativeWork | Contenido editorial o caso de estudio según corresponda |
| SoftwareApplication | Aplicación real; plataforma, categoría y prestaciones comprobadas |
| BreadcrumbList | Jerarquía real de navegación |
| LocalBusiness / subtipo | Negocio que encaja con el tipo; ubicación y servicio reales |
| FAQPage | Preguntas/respuestas visibles; no prometer rich results generales |

Google restringe los resultados enriquecidos FAQ a sitios gubernamentales y de salud reconocidos. No inventes reseñas o precios para satisfacer requisitos de rich results. Evita valores predeterminados como país MX, radio de 50 km o precio $$ sin evidencia del negocio.

## Composición explícita

Ejemplo de módulo src/lib/jsonld.ts. Los helpers de entidades retornan nodos; buildGraph retorna el documento JSON-LD completo. Un nodo aislado con su propio @context también puede ser válido; no reescribas marcado correcto solo para imponer @graph.

```typescript
export type JsonLdNode = Record<string, unknown>;

export function buildGraph(nodes: JsonLdNode[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}

export function serializeJsonLd(data: unknown): string {
  const json = JSON.stringify(data);
  if (json === undefined) throw new Error("JSON-LD debe ser serializable");
  return json.replace(/</g, "\\u003c");
}

export function buildPageNodes(input: {
  siteUrl: string;
  canonicalUrl: string;
  siteName: string;
  title: string;
  description: string;
  language: string;
}): JsonLdNode[] {
  const websiteId = new URL("#website", input.siteUrl).href;
  const webpageId = new URL("#webpage", input.canonicalUrl).href;
  return [
    {
      "@type": "WebSite",
      "@id": websiteId,
      url: input.siteUrl,
      name: input.siteName,
    },
    {
      "@type": "WebPage",
      "@id": webpageId,
      url: input.canonicalUrl,
      name: input.title,
      description: input.description,
      inLanguage: input.language,
      isPartOf: { "@id": websiteId },
    },
  ];
}

export function buildBreadcrumbNode(
  canonicalUrl: string,
  items: { name: string; url: string }[],
): JsonLdNode {
  return {
    "@type": "BreadcrumbList",
    "@id": new URL("#breadcrumb", canonicalUrl).href,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
```

Antes de llamar a estos helpers, resuelve las URLs según la política del proyecto y confirma que son absolutas. Los IDs del sitio permanecen estables entre páginas; los de página usan su canonical. Enlaza author, publisher, about o mainEntity solo cuando esa relación sea cierta. No cambies el nombre o descripción de WebSite por los de cada artículo.

En React/Next.js:

```tsx
import { serializeJsonLd } from "@/lib/jsonld";

export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
```

En Astro utiliza el mismo serializador antes de set:html. No insertes JSON.stringify sin escape en ninguno de los dos frameworks.

## Validar

- Analiza el documento emitido con JSON.parse; confirma @context, URLs e IDs coherentes.
- Prueba un título que contenga </script><script>alert(1)</script>: tras serializar, no debe contener < literal, y JSON.parse debe recuperar el texto original.
- Comprueba entidades contra el contenido visible y ausencia de datos personales inventados.
- [Schema.org Validator](https://validator.schema.org/) revisa vocabulario y estructura; [Rich Results Test](https://search.google.com/test/rich-results) revisa funciones admitidas por Google. Registra por separado ambos resultados.

Fuentes: [políticas de datos estructurados de Google](https://developers.google.com/search/docs/appearance/structured-data/sd-policies), [cambios en FAQ](https://developers.google.com/search/blog/2023/08/howto-faq-changes), [Next.js JSON-LD](https://nextjs.org/docs/app/guides/json-ld).
