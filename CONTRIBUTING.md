# Contribuir a SEO Production Guard

Se aceptan correcciones, casos reproducibles, referencias, traducciones, documentación y revisiones de PR. Puedes participar sin acceso de escritura: crea un fork y abre una pull request hacia `main`.

Las issues y PR pueden escribirse en español o inglés.

## Elige el canal

| Necesidad | Canal |
| --- | --- |
| Instrucción ambigua, resultado incorrecto o enlace roto | [Issue](https://github.com/elpeakyblinder/seo-skill/issues/new/choose) con reproducción mínima |
| Nueva comprobación, framework o traducción | Issue de propuesta; una PR directa está bien para cambios pequeños |
| Corrección de texto sin cambio de comportamiento | PR breve |
| Credenciales, datos privados o una ruta explotable real | [SECURITY.md](SECURITY.md), sin detalles públicos |

## Preparar una pull request

1. Lee [SKILL.md](seo-production-guard/SKILL.md), [LICENSE](LICENSE) y esta guía.
2. Mantén la propuesta centrada en un problema. No conviertas el comportamiento de un proveedor, versión o proyecto en una regla universal sin evidencia suficiente.
3. Coloca decisiones compartidas y enrutamiento en `SKILL.md`; mueve implementación condicional a `seo-production-guard/references/`. El paquete instalable debe seguir funcionando al copiar únicamente `seo-production-guard/`.
4. Actualiza los documentos afectados. Si cambia comportamiento, añade una entrada bajo «Sin publicar» en [CHANGELOG.md](CHANGELOG.md). Sincroniza el README inglés cuando cambie su contenido equivalente.
5. Ejecuta las comprobaciones proporcionales al cambio y registra el resultado real. Una corrección ortográfica no necesita pruebas de integración.
6. Completa la plantilla de PR. El mantenedor decide qué se integra; abrir una PR no garantiza aceptación ni plazo de respuesta.

El mantenedor prepara los números de versión, etiquetas y releases, salvo coordinación expresa en la propuesta.

## Reglas para instrucciones y ejemplos

- Distingue requisitos de protocolos, recomendaciones de proveedores, convenciones del proyecto y observaciones empíricas.
- Enlaza documentación primaria y registra la fecha cuando el comportamiento pueda cambiar. No uses un artículo promocional como única prueba de una obligación técnica.
- Conserva el alcance solicitado por el usuario. Una auditoría no autoriza cambios, despliegues, envíos a consolas ni creación de activos.
- No incorpores dominios, nombres, idiomas, rutas, perfiles, ubicaciones, precios o calificaciones de un caso como valores predeterminados generales.
- No presentes `llms.txt`, datos estructurados, Search Console o una etiqueta concreta como garantía de indexación, ranking, previews o citas por IA.
- Los ejemplos deben indicar sus puntos de integración y evitar imports o archivos ficticios que parezcan incluidos en el paquete.
- No añadas instrucciones ocultas, manipulación para rastreadores, cloaking, enlaces encubiertos, exfiltración de datos ni acciones fuera del objetivo de la skill.
- No copies texto extenso de documentación de terceros. Resume lo necesario, enlaza la fuente y respeta su licencia.

## Evidencia proporcional

Para corregir comportamiento, incluye:

- solicitud o escenario mínimo;
- framework, versión, adaptador y entorno relevantes;
- ruta y HTML, encabezado o recurso observado;
- resultado esperado y fundamento;
- comandos o herramientas ejecutados, con fecha si se probó un servicio externo;
- límites de la comprobación y aquello que quedó pendiente.

Usa proyectos sintéticos o datos anonimizados. Una prueba local no acredita producción; un depurador social no demuestra el comportamiento de todas las plataformas; un validador de Schema.org no garantiza un rich result.

Al cambiar código incluido en una referencia, añade o actualiza una prueba observable cuando pueda ejecutarse de forma aislada. Antes de enviar la PR:

```bash
node --test tests/skill.test.mjs
```

Usa Node.js 22.13 o posterior; estas pruebas se verificaron con Node.js 24. También ejecuta `quick_validate.py` de skill-creator cuando esté disponible. Las pruebas del repositorio no sustituyen un build real de Astro o Next.js para cambios de integración.

Si utilizaste IA para preparar la aportación, revisa personalmente el resultado y declara las limitaciones relevantes. No adjuntes conversaciones completas, secretos o datos de clientes.

## Idiomas

`README.md` es la referencia en español y `README.en.md` su traducción. La skill instalable permanece en español. Para otra traducción, usa `README.<código>.md` y añade navegación solo cuando esté completa y revisada. Si no puedes sincronizar una traducción existente, indícalo en la PR.

## Autoría y licencia de aportaciones

Confirma en la PR que tienes los derechos necesarios y que aportas el material bajo CC BY-NC 4.0, la [licencia pública](LICENSE). Si existen derechos de un empleador o contenido de terceros, obtén permiso e identifícalo.

Conservas la autoría. La contribución no transfiere automáticamente copyright ni permisos comerciales adicionales a Guijosa Dev. Una incorporación comercial de material aportado por terceros requiere un acuerdo separado con sus titulares. Actualmente no existe un CLA comercial ni pago o reparto de ingresos automático.

## Convivencia

Expón razones concretas y trata a las personas con respeto. No se permiten acoso, discriminación, amenazas, spam o divulgación de datos privados. El mantenedor puede cerrar propuestas fuera de alcance o limitar interacciones abusivas. Para reportar conducta de forma privada, escribe a [devcharlying@gmail.com](mailto:devcharlying@gmail.com).
