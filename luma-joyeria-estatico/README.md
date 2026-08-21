# LUMA Joyería — Versión Estática (HTML + CSS + JavaScript + JSON)

Esta es la migración completa de tu sitio (originalmente Next.js/React) a un sitio
**100% estático**: solo HTML, CSS, JavaScript vanilla y JSON. No requiere Node.js,
build step, servidor backend ni base de datos.

## ⚠️ Aclaración importante sobre el pedido original

Tu instrucción original hablaba de "eliminar AJAX y jQuery". Al revisar el proyecto
que subiste, encontré que en realidad estaba construido con **Next.js 16 + React 19 +
TypeScript + Tailwind CSS**, sin ningún uso de AJAX ni jQuery. Como confirmaste que
lo que necesitabas era convertir todo el sitio React/Next.js en HTML+CSS+JS+JSON
puro, eso es exactamente lo que se hizo aquí.

## Cómo abrir el sitio

Como el sitio usa `fetch()` para cargar los archivos `.json` (tal como pediste),
los navegadores **bloquean `fetch()` de archivos locales por CORS cuando abres el
`index.html` con doble clic** (protocolo `file://`). Esto no es un límite de este
sitio: es una restricción de seguridad de todos los navegadores para cualquier
sitio estático que use `fetch()`.

Para verlo correctamente tienes dos opciones:

**Opción A — Cualquier hosting estático (recomendado para producción)**
Sube la carpeta completa a Netlify, Vercel (como sitio estático), GitHub Pages,
Cloudflare Pages, o cualquier hosting compartido. Funciona sin configuración
adicional.

**Opción B — Servidor local de un solo comando (para probarlo en tu PC)**
Desde la carpeta del sitio, ejecuta uno de estos comandos y abre la URL que indique:

```bash
python3 -m http.server 8080
# luego abre http://localhost:8080

# o, si tienes Node.js:
npx serve
```

## Estructura de archivos

```
index.html          Página de inicio
lineas.html          Líneas (Contemporánea / Cultural) con pestañas y carruseles
producto.html         Detalle de producto (antes era /productos/[id], ahora usa ?id=)
nosotros.html         Página Nosotros
impacto.html          Página Impacto (no enlazada en el menú, igual que en el original)
contacto.html         Página Contacto

css/styles.css         CSS compilado (equivalente exacto a los estilos Tailwind originales)
js/common.js           Menú móvil, enlace activo, año del footer (en todas las páginas)
js/home.js              Carga los testimonios desde JSON (página de inicio)
js/lineas.js             Pestañas, tarjetas de producto y carrusel (página Líneas)
js/producto.js            Carga el detalle de un producto según ?id= de la URL

data/lineas.json         Cada línea (Contemporánea/Cultural) con sus Collares, Pulseras y Aretes
data/productos.json      Ficha completa de cada producto (para la página de detalle)
data/testimonios.json    Testimonios de clientas — agrega objetos aquí para sumar más

images/                  Todas las imágenes y el video del sitio
```

## Cómo agregar más testimonios

Abre `data/testimonios.json` y agrega un objeto al arreglo `"testimonios"`:

```json
{
  "estrellas": 5,
  "texto": "Aquí el testimonio de la clienta.",
  "autor": "Nombre",
  "ciudad": "Ciudad"
}
```

Se mostrará automáticamente en la página de inicio, sin tocar el HTML ni el JS.

## Cómo agregar/editar productos de una línea

Edita `data/lineas.json` (para que aparezca en las tarjetas de `lineas.html`) y
`data/productos.json` (para que tenga página de detalle propia). El campo `"id"`
debe coincidir exactamente entre ambos archivos y con el `productId` que uses
en los enlaces `producto.html?id=...`.

## Cambios estrictamente necesarios para que funcione sin servidor

Siguiendo tu instrucción de no cambiar nada salvo lo imprescindible, estos son los
únicos cambios de comportamiento respecto al original, y por qué fueron necesarios:

1. **Rutas de producto**: antes `/productos/collar-reyna` (ruteo dinámico de
   Next.js, requiere servidor). Ahora `producto.html?id=collar-reyna` (funciona
   como archivo estático puro).
2. **Enlaces internos**: pasaron de rutas sin extensión (`/lineas`) a archivos
   `.html` (`lineas.html`), ya que no hay servidor que reescriba URLs.
3. Todo lo demás — diseño, colores, tipografías, textos, tamaños, espacios,
   animaciones, comportamiento de menús/pestañas/carruseles/zoom — se mantuvo
   idéntico al original.

## Nota sobre imágenes rotas ya existentes en el original

El código original ya tenía referencias a imágenes que no existen en el proyecto
(por ejemplo `/images/premio-1.jpg` en Nosotros, o los productos de la Línea
Cultural en `/images/productos/...`). Esta migración **preserva esas mismas rutas
tal cual**, para no alterar el comportamiento original — incluyendo que los 3
productos de la Línea Cultural (Collar Ancestral, Pulsera Tradición, Arete Raíces)
no tienen ficha de detalle (mostrarán "Producto No Encontrado"), exactamente
como en el proyecto Next.js original.
