// ============================================================
// common.js
// Lógica compartida en TODAS las páginas del sitio:
//  - Apertura/cierre del menú lateral móvil (antes manejado con
//    useState de React en SiteHeader.tsx)
//  - Resaltado del enlace de navegación activo (antes usePathname())
//  - Año dinámico del copyright en el footer
// No usa AJAX ni jQuery: solo DOM API nativa.
// ============================================================

(function () {
  'use strict';

  function initMobileMenu() {
    var toggleBtn = document.getElementById('menu-toggle-btn');
    var overlay = document.getElementById('menu-overlay');
    var aside = document.getElementById('menu-aside');
    var iconMenu = document.getElementById('icon-menu');
    var iconClose = document.getElementById('icon-close');

    if (!toggleBtn || !overlay || !aside) return;

    var isOpen = false;

    function setOpen(open) {
      isOpen = open;

      if (open) {
        overlay.classList.remove('opacity-0', 'pointer-events-none');
        overlay.classList.add('opacity-100', 'pointer-events-auto');
        aside.classList.remove('-translate-x-full');
        aside.classList.add('translate-x-0');
        iconMenu.classList.add('hidden');
        iconClose.classList.remove('hidden');
      } else {
        overlay.classList.add('opacity-0', 'pointer-events-none');
        overlay.classList.remove('opacity-100', 'pointer-events-auto');
        aside.classList.add('-translate-x-full');
        aside.classList.remove('translate-x-0');
        iconMenu.classList.remove('hidden');
        iconClose.classList.add('hidden');
      }
    }

    toggleBtn.addEventListener('click', function () {
      setOpen(!isOpen);
    });

    overlay.addEventListener('click', function () {
      setOpen(false);
    });

    aside.querySelectorAll('.nav-link-mobile, a').forEach(function (link) {
      link.addEventListener('click', function () {
        setOpen(false);
      });
    });
  }

  function initActiveNavLink() {
    var currentPage = document.body.getAttribute('data-page');
    if (!currentPage) return;

    document.querySelectorAll('.nav-link').forEach(function (link) {
      if (link.getAttribute('data-nav') === currentPage) {
        link.classList.add('text-gold', 'border-gold');
        link.classList.remove('text-black', 'border-transparent');
      }
    });

    document.querySelectorAll('.nav-link-mobile').forEach(function (link) {
      if (link.getAttribute('data-nav') === currentPage) {
        link.classList.add('text-gold');
        link.classList.remove('text-black');
      }
    });
  }

  function initFooterYear() {
    var yearEl = document.getElementById('copyright-year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
    initActiveNavLink();
    initFooterYear();
  });
})();
