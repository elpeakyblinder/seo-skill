# Publicar SEO Production Guard

Guía del mantenedor para revisar y publicar el repositorio y la skill instalable.

## Antes de publicar

- Lee la skill, las referencias, ambos README, la licencia y el changelog.
- Confirma que el paquete `seo-production-guard/` es autocontenido y no incluye secretos, rutas locales, datos privados o identidad de proyectos usada como valor predeterminado.
- Revisa los derechos y licencias de textos, ejemplos y recursos de terceros. La revisión técnica no acredita su titularidad.
- Conserva CC BY-NC 4.0 salvo una decisión expresa y revisada; los acuerdos comerciales se gestionan por separado.
- No publiques afirmaciones de compatibilidad, producción, ranking o previews que no tengan evidencia fechada.

## Validación local

1. Ejecuta:

   ```bash
   node --test tests/skill.test.mjs
   ```

2. Ejecuta `quick_validate.py seo-production-guard` con la herramienta skill-creator cuando sus dependencias estén disponibles.
3. Revisa que `VERSION`, `metadata.version`, ambos README y `CHANGELOG.md` coincidan.
4. Comprueba los enlaces relativos, la ausencia de emojis en ambos README y el renderizado Markdown de tablas y bloques.
5. Si cambió una integración, valida en un proyecto aislado con la versión y el adaptador declarados. Registra lo que no se ejecutó.

## Publicación en GitHub

El repositorio previsto es [elpeakyblinder/seo-skill](https://github.com/elpeakyblinder/seo-skill). Sube el contenido de esta carpeta a su raíz, incluida `.github/`. No añadas una carpeta exterior que oculte el README.

Antes de crear una release:

- revisa el diff completo y el estado del repositorio;
- crea un commit con alcance claro;
- crea una etiqueta nueva para la versión;
- usa la entrada correspondiente del changelog como base de las notas;
- no muevas ni reutilices una etiqueta publicada.

La versión sigue `MAYOR.MENOR.PARCHE`: parches para correcciones acotadas, versiones menores para capacidades o alcance nuevos y versiones mayores para cambios incompatibles. Mientras sea `0.x`, documenta expresamente los cambios importantes de alcance.

## Comprobar distribución

Después del push, comprueba la detección remota:

```bash
pnpm dlx skills add elpeakyblinder/seo-skill --list
```

Instala después en un proyecto temporal y confirma que las referencias acompañan a `SKILL.md`:

```bash
pnpm dlx skills add elpeakyblinder/seo-skill --skill seo-production-guard
```

La detección del CLI no demuestra que un agente aplique bien las instrucciones. Antes de anunciar que está probada en un agente, ejecuta una tarea aislada, registra agente/modelo, versión, fecha, solicitud, resultado y efectos.

Publicar en GitHub no registra automáticamente la skill en catálogos de agentes.

## Contribuciones y ajustes del repositorio

Verifica que Issues esté habilitado y que el selector muestre las plantillas. Abre una PR de prueba en borrador para revisar el checklist. Si quieres exigir revisión antes de integrar, configura protección de `main` y bloquea force pushes o borrados según tus necesidades. Los archivos de `.github/` no cambian esos ajustes por sí solos.

La licencia pública de una contribución no concede automáticamente permisos comerciales adicionales. Antes de incluir aportaciones de terceros en una edición comercial, acuerda por escrito los derechos necesarios con sus titulares.

Esta guía prepara los archivos locales; no ejecuta pushes, crea releases ni modifica la configuración remota.
