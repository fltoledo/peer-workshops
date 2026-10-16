# Peer Workshops

Sitio estático (Astro) para los peer workshops: un formato común, ediciones abiertas a la comunidad con distintas temáticas, y una propuesta in-company para empresas. En inglés, español y portugués.

## Correr en local

```bash
npm install
npm run dev
```

Abre en http://localhost:4321 (redirige a `/en/`, `/es/` o `/pt/` según el idioma del navegador).

## Estructura

- `src/config.ts`: nombre del sitio, link de newsletter, email y clave de Web3Forms.
- `src/i18n.ts`: idiomas, textos comunes (menú, pie, estados) y helpers de URLs.
- `src/views/`: cada página, con sus textos en los tres idiomas al principio del archivo.
- `src/pages/[lang]/`: rutas; solo conectan cada idioma con su vista.
- `src/content/series/`: una temática por archivo YAML (WOPR Latam, TAPIA…).
- `src/content/editions/`: una edición por archivo YAML.

### Agregar una edición

Copiá un archivo de `src/content/editions/` y cambiá los datos:

- `series`: nombre de un archivo de `series/` (sin `.yaml`).
- `country`: código ISO de dos letras (`UY`, `AR`, `BR`, `US`…). El nombre del país se traduce solo.
- `date` y `datePrecision` (`month` o `year`): la fecha se muestra en cada idioma.
- `theme`: el tema en `en`, `es` y `pt`.
- `status`: `planned` (anunciada), `open` (convocatoria abierta, con `applyUrl` y `applyDeadline`), `closed` o `past`.
- Si todavía no hay fecha, lugar o tema, dejá `date`, `city`, `country` o `theme` afuera: se muestra "a definir" en cada idioma.

Después de la edición podés sumar (ver el ejemplo comentado en `tapia-01.yaml`):

- `summary`: un resumen breve en los tres idiomas.
- `photos`: guardá las fotos en una carpeta con el nombre de la edición (por ejemplo `src/content/editions/tapia-01/`) y referencialas como `./tapia-01/foto.jpg`. Cada foto necesita `alt` (texto alternativo); `caption` es opcional. El sitio genera versiones AVIF y WebP en varios tamaños, así que cada visitante descarga solo lo que necesita. Para que el repositorio no crezca de más, conviene guardar los originales en JPEG de hasta 2560 px de lado (en Mac: `sips -Z 2560 -s format jpeg -s formatOptions 85 foto.jpg --out foto.jpg`).
- `participants`: `name` y, opcionales, `org`, `country` y `url`. Publicá solo a quienes dieron su consentimiento.
- `topics`: los temas tratados, con `presenter` opcional.

`alt`, `caption` y `title` aceptan un texto único o uno por idioma (`{ en: ..., es: ..., pt: ... }`). Los números de impacto del home salen de la cantidad de participantes y temas cargados (o de `participantCount` y `reportsPresented` si preferís poner solo el número).

### Agregar una temática

Creá un archivo en `src/content/series/` (por ejemplo `agentic-sdlc.yaml`) con `name`, `acronym`, `order`, `color`, `colorDark`, y `fullName`, `summary` y `about` en los tres idiomas.

### Cambiar textos

Cada página tiene un objeto `T` con `en`, `es` y `pt` al principio de su archivo en `src/views/`. Si agregás una clave en un idioma, agregala en los otros dos.

## Accesibilidad (WCAG 2.2 AA)

El sitio apunta a cumplir AA en modo claro y oscuro, en los tres idiomas. Al cambiar contenido o estilos:

- Todo color usado como texto necesita contraste de al menos 4.5:1 con su fondo. Por eso cada temática lleva dos colores: `color` (sobre fondo claro) y `colorDark` (sobre fondo oscuro). Podés comprobarlo en https://webaim.org/resources/contrastchecker/
- Mantené el orden de títulos (h1 → h2 → h3) sin saltear niveles.
- Las imágenes necesitan texto alternativo en cada idioma.

## Newsletter (Kit)

El pie de cada página tiene un formulario de suscripción. Para activarlo:

1. Creá una cuenta gratis en [Kit](https://kit.com) e importá tus suscriptores (CSV exportado de Mailchimp).
2. Hoy hay un solo formulario de Kit para los tres idiomas (`KIT_FORM` en `src/config.ts`). Si más adelante querés saber en qué idioma escribirle a cada persona, creá un formulario por idioma y poné cada URL en `NEWSLETTER.formActions`.
3. La URL de un formulario es la del atributo `action="..."` del `<form>` (en Kit: Publish → Embed → HTML).

Si las URLs quedan vacías, el pie muestra un enlace a `NEWSLETTER.fallbackUrl` (la lista anterior de Mailchimp).

## Formulario de contacto

Usa [Web3Forms](https://web3forms.com) (gratis). Pedí una clave con tu email y pegala en `web3formsKey` en `src/config.ts`. La clave es pública: solo sirve para mandarte mails a vos. Cada mensaje incluye el idioma desde el que se envió.

## Publicar en GitHub Pages

1. Creá un repo en GitHub (por ejemplo `peer-workshops`) y subí este proyecto a la rama `main`.
2. En el repo: Settings → Pages → Source: **GitHub Actions**.
3. Cada push a `main` publica el sitio (ver `.github/workflows/deploy.yml`).

### Dominio propio

Settings → Pages → Custom domain, y en tu proveedor de DNS un `CNAME` hacia `<usuario>.github.io`. Después activá "Enforce HTTPS".
