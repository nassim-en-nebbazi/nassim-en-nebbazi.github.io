const phrases = {
  en: [
    "Postdoctoral researcher in Mathematics",
    "ENS Rennes / Inria Rennes"
  ],
  fr: [
    "Chercheur postdoctoral en mathématiques",
    "ENS Rennes / Inria Rennes"
  ]
};

const el = document.getElementById('typed');

if (el) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const getLang = () => (window.siteLang ? window.siteLang.get() : 'en');

  let p = 0;                       // indice de la phrase en cours
  let i = 0;                       // nombre de caractères affichés
  let deleting = true;
  let timer = null;

  function tick() {
    const full = phrases[getLang()][p];
    i += deleting ? -1 : 1;
    el.textContent = full.slice(0, i);

    let delay = deleting ? 40 : 80;

    if (!deleting && i === full.length) {
      delay = 2000;                // pause quand la phrase est complète
      deleting = true;
    } else if (deleting && i === 0) {
      deleting = false;
      p = (p + 1) % phrases[getLang()].length;
      delay = 400;
    }
    timer = setTimeout(tick, delay);
  }

  // Affiche la phrase courante dans la langue active, puis relance l'animation
  function restart(delay) {
    clearTimeout(timer);
    const full = phrases[getLang()][p];
    el.textContent = full;
    i = full.length;
    deleting = true;
    if (!reduced) timer = setTimeout(tick, delay);
  }

  restart(2000);

  // Changement de langue (bouton FR/EN ou autre onglet) : on traduit tout de suite
  if (window.siteLang) {
    window.siteLang.onChange(() => restart(1200));
  }
}
