/* Animated open/close for the OTO FAQ accordion (native <details>). One item open at a time. */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animate(item, open) {
    var body = item.querySelector('.oto-faq__body');
    if (item._anim) item._anim.cancel();
    item.classList.toggle('is-open', open);
    if (reduce || !body.animate) {
      item.open = open;
      return;
    }
    var start = open ? 0 : body.offsetHeight;
    if (open) item.open = true;
    var end = open ? body.scrollHeight : 0;
    body.style.overflow = 'hidden';
    item._anim = body.animate(
      [
        { height: start + 'px', opacity: open ? 0 : 1 },
        { height: end + 'px', opacity: open ? 1 : 0 },
      ],
      { duration: 280, easing: 'cubic-bezier(.4,0,.2,1)' }
    );
    item._anim.onfinish = function () {
      item.open = open;
      body.style.overflow = '';
      item._anim = null;
    };
  }

  function init(list) {
    var items = Array.prototype.slice.call(list.querySelectorAll('.oto-faq__item'));
    items.forEach(function (item) {
      item.classList.toggle('is-open', item.open);
      item.querySelector('summary').addEventListener('click', function (event) {
        event.preventDefault();
        var willOpen = item._anim ? !item._willOpen : !item.open;
        item._willOpen = willOpen;
        if (willOpen) {
          items.forEach(function (other) {
            if (other !== item && (other.open || other._anim)) {
              other._willOpen = false;
              animate(other, false);
            }
          });
        }
        animate(item, willOpen);
      });
    });
  }

  document.querySelectorAll('[data-oto-faq]').forEach(init);
})();
