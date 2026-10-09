/* lang.js — sélecteur de langue FR / EN partagé par toutes les pages du site.
   Le choix est mémorisé dans le navigateur (localStorage) : il reste
   actif quand on change de page. Langue par défaut : anglais. */
(function () {
  var KEY = 'site-lang';
  var listeners = [];

  function read() {
    try {
      var v = localStorage.getItem(KEY);
      if (v === 'fr' || v === 'en') return v;
    } catch (e) {}
    return 'en';
  }

  var current = read();

  // Appliqué tout de suite (script placé dans <head>) : pas de « flash » de la mauvaise langue
  document.documentElement.setAttribute('data-lang', current);
  document.documentElement.lang = current;

  // CSS : on masque la langue qui n'est pas active
  var style = document.createElement('style');
  style.textContent =
    'html[data-lang="en"] [lang="fr"], html[data-lang="fr"] [lang="en"] { display: none !important; }' +
    'body { position: relative; }' +
    '.lang-switch { position: absolute; top: 12px; right: 20px; font-size: 12pt; }' +
    '.lang-switch button { background: none; border: none; font: inherit; color: #00e; cursor: pointer; padding: 0 4px; }' +
    '.lang-switch button:hover { text-decoration: underline; }' +
    '.lang-switch button[aria-pressed="true"] { color: #000; font-weight: bold; cursor: default; text-decoration: none; }' +
    '.lang-switch span { color: #666; }' +
    '@media (max-width: 600px) { .lang-switch { right: 15px; } }';
  document.head.appendChild(style);

  function apply(lang) {
    current = lang;
    document.documentElement.setAttribute('data-lang', lang);
    document.documentElement.lang = lang;
    var btns = document.querySelectorAll('.lang-switch button');
    for (var i = 0; i < btns.length; i++) {
      btns[i].setAttribute('aria-pressed', btns[i].getAttribute('data-lang') === lang ? 'true' : 'false');
    }
  }

  function notify(lang) {
    for (var i = 0; i < listeners.length; i++) listeners[i](lang);
  }

  function set(lang) {
    try { localStorage.setItem(KEY, lang); } catch (e) {}
    apply(lang);
    notify(lang);
  }

  // Création du sélecteur en haut à droite
  document.addEventListener('DOMContentLoaded', function () {
    var box = document.createElement('div');
    box.className = 'lang-switch';
    box.setAttribute('role', 'group');
    box.setAttribute('aria-label', 'Language / Langue');
    box.innerHTML =
      '<button type="button" data-lang="fr">FR</button>' +
      '<span>|</span>' +
      '<button type="button" data-lang="en">EN</button>';
    box.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (b) set(b.getAttribute('data-lang'));
    });
    document.body.insertBefore(box, document.body.firstChild);
    apply(current);
  });

  // Si la langue est changée dans un autre onglet, on suit
  window.addEventListener('storage', function (e) {
    if (e.key === KEY && (e.newValue === 'fr' || e.newValue === 'en')) {
      apply(e.newValue);
      notify(e.newValue);
    }
  });

  // Petite API pour les scripts des pages (ex. : effet machine à écrire)
  window.siteLang = {
    get: function () { return current; },
    set: set,
    onChange: function (cb) { listeners.push(cb); }
  };
})();
