/* OTO product page: quantity stepper, variant select (price + gallery media) and the mobile sticky buy bar.
   The gallery itself (thumbnails, prev/next, zoom) is Dawn's <media-gallery>, so we only tell it which media to show. */
(function () {
  var root = document.querySelector('[data-oto-product]');
  if (!root) return;

  /* quantity */
  root.querySelectorAll('[data-oto-qty]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var input = root.querySelector('input[name="quantity"]');
      input.value = Math.max(1, (parseInt(input.value, 10) || 1) + parseInt(btn.dataset.otoQty, 10));
    });
  });

  /* variant select: update the price, the pill and the gallery */
  var select = root.querySelector('[data-oto-variant]');
  if (select) {
    select.addEventListener('change', function () {
      var opt = select.options[select.selectedIndex];
      var now = root.querySelector('.oto-price__now');
      var was = root.querySelector('.oto-price__was');
      if (now) now.textContent = opt.dataset.price;
      if (was) {
        was.textContent = opt.dataset.compare;
        was.hidden = !opt.dataset.compare;
      }
      var sticky = document.querySelector('[data-oto-sticky-price]');
      if (sticky) sticky.textContent = opt.dataset.price;

      var gallery = root.querySelector('media-gallery');
      var sectionId = gallery && gallery.id.replace('MediaGallery-', '');
      if (gallery && opt.dataset.mediaId && typeof gallery.setActiveMedia === 'function') {
        gallery.setActiveMedia(sectionId + '-' + opt.dataset.mediaId, true);
      }
    });
  }

  /* sticky buy bar: shows once the main buy box has scrolled out of view (mobile only via CSS) */
  var bar = document.querySelector('[data-oto-sticky]');
  var form = root.querySelector('.oto-pdp__buy');
  if (bar && form && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      var show = !entries[0].isIntersecting && entries[0].boundingClientRect.top < 0;
      bar.classList.toggle('is-visible', show);
      bar.setAttribute('aria-hidden', !show);
      bar.querySelector('button').tabIndex = show ? 0 : -1;
    }).observe(form);
  }
})();
