// ============================================================
// home.js
// Reemplaza la carga estática de testimonios por una carga
// dinámica desde data/testimonios.json usando fetch() nativo.
// Antes: los testimonios estaban escritos directamente en el
// JSX de app/page.tsx. Ahora viven en JSON y se pueden ampliar
// sin tocar el HTML.
// ============================================================

(function () {
  'use strict';

  function estrellas(cantidad) {
    return '★★★★★'.slice(0, cantidad);
  }

  function crearTarjetaTestimonio(t) {
    var card = document.createElement('div');
    card.className =
      'bg-white border border-gold/30 p-6 md:p-8 rounded-none flex flex-col justify-between transition-all duration-300 hover:border-gold hover:-translate-y-1 shadow-[0_4px_12px_rgba(0,0,0,0.01)]';

    var top = document.createElement('div');

    var stars = document.createElement('p');
    stars.className = 'text-gold text-xs sm:text-sm mb-3 md:mb-4 font-mono tracking-widest';
    stars.textContent = estrellas(t.estrellas || 5);
    top.appendChild(stars);

    var texto = document.createElement('p');
    texto.className = 'text-xs sm:text-sm md:text-base text-black/90 font-light mb-4 md:mb-6 leading-relaxed';
    texto.textContent = '"' + t.texto + '"';
    top.appendChild(texto);

    card.appendChild(top);

    var autor = document.createElement('p');
    autor.className = 'text-[9px] sm:text-[10px] tracking-wider text-gold uppercase font-medium';
    autor.textContent = '— ' + t.autor + ', ' + t.ciudad;
    card.appendChild(autor);

    return card;
  }

  function cargarTestimonios() {
    var container = document.getElementById('testimonios-container');
    if (!container) return;

    fetch('data/testimonios.json')
      .then(function (res) {
        if (!res.ok) throw new Error('No se pudo cargar testimonios.json');
        return res.json();
      })
      .then(function (data) {
        container.innerHTML = '';
        (data.testimonios || []).forEach(function (t) {
          container.appendChild(crearTarjetaTestimonio(t));
        });
      })
      .catch(function (err) {
        console.error('Error cargando testimonios:', err);
      });
  }

  document.addEventListener('DOMContentLoaded', cargarTestimonios);
})();
