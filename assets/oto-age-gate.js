/* OTO age gate: shown once per visitor (remembered in localStorage), keeps focus inside the dialog. */
(function () {
  var gate = document.querySelector('[data-oto-age]');
  if (!gate) return;
  var KEY = 'oto-age-ok';
  var days = parseInt(gate.dataset.days, 10) || 30;
  var storage = {
    get: function () { try { return localStorage.getItem(KEY); } catch (e) { return null; } },
    set: function (v) { try { localStorage.setItem(KEY, v); } catch (e) {} },
  };
  var until = parseInt(storage.get(), 10);
  if (until && until > Date.now()) return;

  var yes = gate.querySelector('[data-oto-age-yes]');
  var focusables = gate.querySelectorAll('button, a[href]');
  var opener = document.activeElement;
  gate.hidden = false;
  document.documentElement.classList.add('oto-age-open');
  yes.focus();

  yes.addEventListener('click', function () {
    storage.set(String(Date.now() + days * 86400000));
    gate.hidden = true;
    document.documentElement.classList.remove('oto-age-open');
    if (opener && opener.focus) opener.focus();
  });

  gate.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var first = focusables[0], last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
})();
