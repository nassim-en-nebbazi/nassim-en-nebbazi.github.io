(function () {
  var phrases = {
    en: ["Postdoctoral researcher in Mathematics", "ENS Rennes / Inria Rennes"],
    fr: ["Postdoctorant en mathématiques", "ENS Rennes / Inria Rennes"]
  };

  function start() {
    var el = document.getElementById('typed');
    if (!el) return;

    function lang() {
      return (window.siteLang && window.siteLang.get()) === 'fr' ? 'fr' : 'en';
    }

    var p = 0, i = 0, deleting = true, timer = null;

    function tick() {
      var full = phrases[lang()][p];
      i += deleting ? -1 : 1;
      if (i < 0) i = 0;
      el.textContent = full.slice(0, i);

      var delay = deleting ? 40 : 80;
      if (!deleting && i >= full.length) {
        delay = 2000;
        deleting = true;
      } else if (deleting && i === 0) {
        deleting = false;
        p = (p + 1) % phrases[lang()].length;
        delay = 400;
      }
      timer = setTimeout(tick, delay);
    }

    function restart(delay) {
      clearTimeout(timer);
      var full = phrases[lang()][p];
      el.textContent = full;
      i = full.length;
      deleting = true;
      timer = setTimeout(tick, delay);
    }

    restart(2000);

    if (window.siteLang) {
      window.siteLang.onChange(function () { restart(1500); });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
