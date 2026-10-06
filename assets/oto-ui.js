/* OTO UI: smooth closing animation for the search popup (Dawn's details-modal closes instantly). */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function patch() {
    var Modal = customElements.get('details-modal');
    if (!Modal || Modal.__otoPatched) return;
    var close = Modal.prototype.close;
    Modal.prototype.close = function (focusToggle) {
      var self = this;
      var popup = this.querySelector('.search-modal');
      if (!popup || reduce || !this.isOpen() || popup.classList.contains('is-closing')) return close.call(this, focusToggle);
      popup.classList.add('is-closing');
      var finish = function () {
        popup.classList.remove('is-closing');
        close.call(self, focusToggle);
      };
      popup.addEventListener('animationend', finish, { once: true });
      window.setTimeout(function () { if (popup.classList.contains('is-closing')) finish(); }, 400);
    };
    Modal.__otoPatched = true;
  }

  if (customElements.get('details-modal')) patch();
  else customElements.whenDefined('details-modal').then(patch);
})();
