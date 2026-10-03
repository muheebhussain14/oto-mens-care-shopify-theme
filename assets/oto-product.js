/* OTO product page: gallery thumbnails, variant select, quantity stepper and the mobile sticky buy bar. */
(function () {
  var root = document.querySelector('[data-oto-product]');
  if (!root) return;

  /* gallery */
  var main = root.querySelector('[data-oto-main]');
  root.querySelectorAll('[data-oto-thumb]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (!main) return;
      main.src = btn.dataset.src;
      main.srcset = btn.dataset.srcset;
      main.alt = btn.dataset.alt;
      root.querySelectorAll('[data-oto-thumb]').forEach(function (b) { b.setAttribute('aria-pressed', b === btn); });
    });
  });

  /* quantity */
  root.querySelectorAll('[data-oto-qty]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var input = root.querySelector('input[name="quantity"]');
      input.value = Math.max(1, (parseInt(input.value, 10) || 1) + parseInt(btn.dataset.otoQty, 10));
    });
  });

  /* variant select updates the price shown */
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
