# Zodiak Web

Sitio one-page en Next.js para Zodiak Climb.

## Requisitos

- Node.js 20+
- npm 10+

## Variables de entorno

Copia `.env.example` a `.env` y completa:

- `TURSO_URL`, `TURSO_TOKEN`: base de datos Turso
- `ADMIN_PASSWORD`: contraseña para acceder al CMS
- `ADMIN_SESSION_SECRET`: mínimo 32 caracteres aleatorios (firma de sesión)
- `BLOB_READ_WRITE_TOKEN`: token de Vercel Blob para subida de imágenes

## Desarrollo

```bash
npm install
npm run migrate   # una vez, crea tablas en Turso
npm run seed      # una vez, carga contenido inicial desde content/
npm run dev
```

## Build

```bash
npm run build
npm start
```

## Admin CMS

El contenido del sitio se edita desde un CMS protegido por contraseña.

**Acceso:** `/admin`

1. Ir a `/admin/login`
2. Ingresar la contraseña configurada en `ADMIN_PASSWORD`
3. En el panel izquierdo se listan: Site, Story, Products, FAQ, Gallery, About

**Uso:**

- Los cambios se guardan automáticamente al editar (autosave)
- Imágenes: botón "Upload image" → se suben a Vercel Blob y se inserta la URL en el campo activo
- Cada documento tiene su propio editor con campos específicos

**Nota:** El área `/admin` no se indexa en buscadores (robots.txt).

## Contenido (fallback)

Si el CMS no tiene datos, se usan los archivos en `content/`:

- `content/site.es.json`
- `content/products.es.json`
- `content/faq.es.json`
- `content/gallery.json`
- `content/about.md`

## Nota de despliegue

El proyecto está listo para desplegar en Vercel como app Next.js estándar. Configurar las variables de entorno en el dashboard de Vercel.
