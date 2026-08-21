// ============================================================
// lineas.js
// Reemplaza LineasClient.tsx (React) por JavaScript puro.
// - Carga la composición de cada línea (Collares/Pulseras/Aretes)
//   desde data/lineas.json usando fetch()
// - Maneja el cambio de pestaña Contemporánea/Cultural
// - Renderiza las tarjetas de producto (equivalente a
//   components/ui/ProductCard.tsx)
// - Maneja el scroll horizontal de cada carrusel (flechas)
// ============================================================

(function () {
  'use strict';

  var descripciones = {
    contemporanea: '',
    cultural: ''
  };

  var lineasData = null;
  var activeLinea = 'contemporanea';

  function crearProductCard(p) {
    var link = document.createElement('a');
    link.href = 'producto.html?id=' + encodeURIComponent(p.id);
    link.className = 'snap-center w-full md:w-full flex-shrink-0 block';

    link.innerHTML =
      '<div class="bg-neutral-950 rounded-none p-5 text-white border border-gold/10 group cursor-pointer flex flex-col justify-between w-full min-w-[250px] sm:min-w-[0px] text-left transition-all duration-300 hover:border-gold/50 h-full">' +
        '<div>' +
          '<div class="aspect-square mb-4 rounded-none border border-gold/10 relative overflow-hidden bg-neutral-900">' +
            '<div class="absolute inset-3 border border-white/75 pointer-events-none z-10 transition-transform duration-500 ease-in-out group-hover:scale-[0.98]"></div>' +
            '<img src="' + p.imagen + '" alt="' + escapeHtml(p.nombre) + '" class="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out group-hover:opacity-0">' +
            '<img src="' + p.imagenHover + '" alt="' + escapeHtml(p.nombre) + ' detalle" class="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100">' +
            '<div class="absolute bottom-0 left-0 right-0 p-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out z-20">' +
              '<button class="w-full bg-black text-white text-xs tracking-widest font-medium py-3 uppercase border border-gold/30 hover:bg-gold hover:text-black hover:border-transparent transition-colors duration-300">Ver</button>' +
            '</div>' +
          '</div>' +
          '<h3 class="text-base font-serif font-bold mb-1 text-white tracking-wide uppercase">' + escapeHtml(p.nombre) + '</h3>' +
          '<p class="text-xs text-neutral-400 mb-3 leading-relaxed min-h-[32px]">' + escapeHtml(p.descripcionCorta) + '</p>' +
        '</div>' +
        '<p class="text-gold font-bold tracking-wider text-sm pt-2 border-t border-neutral-900">S/ ' + Number(p.precio).toFixed(2) + '</p>' +
      '</div>';

    return link;
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  function renderCategoria(containerId, productos) {
    var container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    (productos || []).forEach(function (p) {
      container.appendChild(crearProductCard(p));
    });
  }

  function renderLinea() {
    if (!lineasData) return;
    var linea = lineasData.lineas[activeLinea];
    if (!linea) return;

    var descEl = document.getElementById('linea-descripcion');
    if (descEl) descEl.textContent = linea.descripcion;

    renderCategoria('scroll-collares', linea.collares);
    renderCategoria('scroll-pulseras', linea.pulseras);
    renderCategoria('scroll-aretes', linea.aretes);
  }

  function setActiveTab(linea) {
    activeLinea = linea;

    document.querySelectorAll('.linea-tab').forEach(function (btn) {
      var isActive = btn.getAttribute('data-linea') === linea;
      if (isActive) {
        btn.classList.add('border-gold', 'text-gold', 'font-bold');
        btn.classList.remove('border-transparent', 'text-neutral-400', 'font-normal');
      } else {
        btn.classList.remove('border-gold', 'text-gold', 'font-bold');
        btn.classList.add('border-transparent', 'text-neutral-400', 'font-normal');
      }
    });

    renderLinea();
  }

  function initTabs() {
    document.querySelectorAll('.linea-tab').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setActiveTab(btn.getAttribute('data-linea'));
      });
    });
  }

  function initScrollArrows() {
    document.querySelectorAll('.scroll-arrow').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var targetId = btn.getAttribute('data-scroll-target');
        var dir = btn.getAttribute('data-scroll-dir');
        var el = document.getElementById(targetId);
        if (!el) return;
        var amount = el.clientWidth;
        el.scrollBy({
          left: dir === 'left' ? -amount : amount,
          behavior: 'smooth'
        });
      });
    });
  }

  function cargarLineas() {
    fetch('data/lineas.json')
      .then(function (res) {
        if (!res.ok) throw new Error('No se pudo cargar lineas.json');
        return res.json();
      })
      .then(function (data) {
        lineasData = data;
        renderLinea();
      })
      .catch(function (err) {
        console.error('Error cargando líneas:', err);
      });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initTabs();
    initScrollArrows();
    cargarLineas();
  });
})();
