// ============================================================
// producto.js
// Reemplaza ProductDetailClient.tsx (React) + la "base de datos"
// que antes vivía embebida en app/productos/[id]/page.tsx.
// Ahora los datos vienen de data/productos.json vía fetch().
//
// Como el sitio ya no tiene un servidor Next.js que resuelva
// rutas dinámicas (/productos/[id]), el id del producto se lee
// como parámetro de consulta: producto.html?id=slug-del-producto
// ============================================================

(function () {
  'use strict';

  var quantity = 1;
  var currentProduct = null;
  var activeImageIndex = 0;

  function getProductIdFromUrl() {
    var params = new URLSearchParams(window.location.search);
    return params.get('id');
  }

  function showNotFound() {
    document.getElementById('producto-no-encontrado').classList.remove('hidden');
    document.getElementById('producto-detalle').classList.add('hidden');
    document.getElementById('page-title').textContent = 'Producto | LUMA Joyería';
  }

  function formatPricePEN(price) {
    return 'S/ ' + Number(price).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function renderThumbnails() {
    var container = document.getElementById('miniaturas-container');
    container.innerHTML = '';
    var thumbnails = currentProduct.images.slice(0, 4);

    thumbnails.forEach(function (img, idx) {
      var btn = document.createElement('button');
      btn.className =
        'w-16 h-16 md:w-20 md:h-20 border-2 rounded-none transition-all flex-shrink-0 snap-start flex items-center justify-center bg-black ' +
        (idx === activeImageIndex ? 'border-gold bg-gold/10' : 'border-gold/20 hover:border-gold/50');

      var thumbImg = document.createElement('img');
      thumbImg.src = img;
      thumbImg.alt = currentProduct.name + ' ' + (idx + 1);
      thumbImg.className = 'w-full h-full object-contain';
      btn.appendChild(thumbImg);

      btn.addEventListener('click', function () {
        activeImageIndex = idx;
        renderMainImage();
        renderThumbnails();
      });

      container.appendChild(btn);
    });
  }

  function renderMainImage() {
    var primaryImage = currentProduct.images[activeImageIndex] || 'images/placeholder.jpg';
    var img = document.getElementById('imagen-principal');
    img.src = primaryImage;
    img.alt = currentProduct.name;
    img.style.transform = '';
  }

  function initZoom() {
    var container = document.getElementById('imagen-container');
    var img = document.getElementById('imagen-principal');

    container.addEventListener('mousemove', function (e) {
      var rect = container.getBoundingClientRect();
      var x = ((e.clientX - rect.left) / rect.width) * 100;
      var y = ((e.clientY - rect.top) / rect.height) * 100;
      img.style.transform = 'scale(1.5) translate(' + (x - 50) * 0.15 + 'px, ' + (y - 50) * 0.15 + 'px)';
    });

    container.addEventListener('mouseleave', function () {
      img.style.transform = '';
    });
  }

  function renderMaterials() {
    var wrapper = document.getElementById('materiales-wrapper');
    var container = document.getElementById('materiales-container');
    container.innerHTML = '';

    if (!currentProduct.materials || currentProduct.materials.length === 0) {
      wrapper.classList.add('hidden');
      return;
    }
    wrapper.classList.remove('hidden');

    currentProduct.materials.forEach(function (material) {
      var span = document.createElement('span');
      span.className = 'inline-block px-3 py-1.5 md:px-4 md:py-2 bg-black text-cream text-[11px] md:text-xs font-medium tracking-wide border border-gold/30 rounded-none';
      span.textContent = material;
      container.appendChild(span);
    });
  }

  function updateQuantityDisplay() {
    document.getElementById('cantidad-valor').textContent = quantity;
  }

  function initQuantitySelector() {
    document.getElementById('btn-restar').addEventListener('click', function () {
      quantity = Math.max(1, quantity - 1);
      updateQuantityDisplay();
    });
    document.getElementById('btn-sumar').addEventListener('click', function () {
      quantity = quantity + 1;
      updateQuantityDisplay();
    });
  }

  function initBuyButton() {
    document.getElementById('btn-comprar-whatsapp').addEventListener('click', function () {
      var message =
        'Hola, me interesa el producto "' + currentProduct.name + '" (' + currentProduct.line + ') - ' +
        formatPricePEN(currentProduct.price) + '. Cantidad: ' + quantity;
      var whatsappUrl = 'https://wa.me/51924505903?text=' + encodeURIComponent(message);
      window.open(whatsappUrl, '_blank');
    });
  }

  function renderProduct() {
    document.getElementById('page-title').textContent = currentProduct.name + ' | LUMA Joyería';
    document.getElementById('page-description').setAttribute('content', currentProduct.description);

    document.getElementById('breadcrumb-nombre').textContent = currentProduct.name;
    document.getElementById('producto-linea').textContent = currentProduct.line;
    document.getElementById('producto-nombre').textContent = currentProduct.name;
    document.getElementById('producto-precio').textContent = formatPricePEN(currentProduct.price);
    document.getElementById('producto-descripcion').textContent = currentProduct.description;

    renderMainImage();
    renderThumbnails();
    renderMaterials();

    document.getElementById('producto-detalle').classList.remove('hidden');
    document.getElementById('producto-no-encontrado').classList.add('hidden');
  }

  function init() {
    var id = getProductIdFromUrl();

    if (!id) {
      showNotFound();
      return;
    }

    fetch('data/productos.json')
      .then(function (res) {
        if (!res.ok) throw new Error('No se pudo cargar productos.json');
        return res.json();
      })
      .then(function (data) {
        var product = data[id];
        if (!product) {
          showNotFound();
          return;
        }
        currentProduct = product;
        renderProduct();
        initZoom();
        initQuantitySelector();
        initBuyButton();
      })
      .catch(function (err) {
        console.error('Error cargando producto:', err);
        showNotFound();
      });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
