/* ============ Growth Editing — script ============ */
(() => {
  'use strict';

  const STORE = 'https://payhip.com/GrowthEditing';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  let visIO;

  /* ---------- Produits ----------
     Ajoute `url` sur un produit pour le lier à sa page Payhip précise
     (sinon le bouton mène à la boutique). */
  const PRODUCTS = [
    { id: 'choisir',         name: 'Choisir',         box: 'Choisir',           cat: 'interfaces' },
    { id: 'miniature-pop',   name: 'Miniature POP',   box: 'Miniature POP',     cat: 'phares' },
    { id: 'objectif-paper',  name: 'Objectif paper',  box: 'Objectif paper',    cat: 'interfaces' },
    { id: 'item-popup',      name: 'Item Popup',      box: 'Item Popup',        cat: 'phares' },
    { id: 'folder-secret',   name: 'Folder Top Secret', box: 'Folder Top Secret', cat: 'interfaces' },
    { id: 'spotify-musique', name: 'Spotify Musique', box: 'Spotify Effect',    cat: 'interfaces' },
    { id: 'transition-game', name: 'Transition Game', box: 'Transition Game',   cat: 'effets' },
    { id: 'item-claim',      name: 'Item Claim',      box: 'Item Claim',        cat: 'phares' },
    { id: 'item-pop-2',      name: '2 item pop',      box: '2 Item Pop',        cat: 'effets' },
    { id: 'app-objectif',    name: 'APP Objectif',    box: 'APP – Objectif',    cat: 'interfaces' },
    { id: 'searchbar',       name: 'Searchbar',       box: 'Searchbar',         cat: 'interfaces' },
    { id: 'retournement',    name: 'Retournement',    box: 'Retournement',      cat: 'phares' },
    { id: 'depliage',        name: 'Dépliage',        box: 'Dépliage',          cat: 'effets' },
    { id: 'particle-item',   name: 'Particle to Item', box: 'Particle to Item', cat: 'phares' },
    { id: 'texte-transition', name: 'Texte transition', box: 'Texte transition', cat: 'effets' },
  ].map(p => ({ price: '3,00 €', url: STORE, ...p }));

  /* ---------- Scènes animées (HTML/CSS, aucune image externe) ---------- */
  const rnd = (a, b) => a + Math.random() * (b - a);
  const particles = () => {
    let out = '';
    const N = 34;
    for (let i = 0; i < N; i++) {
      const ang = (i / N) * Math.PI * 2, r = 1.2 + (i % 3) * .28;
      const sa = rnd(0, Math.PI * 2), sr = rnd(3.6, 5.2);
      out += `<i class="p" style="--tx:${(Math.cos(ang) * r).toFixed(2)}em;--ty:${(Math.sin(ang) * r).toFixed(2)}em;--sx:${(Math.cos(sa) * sr * 1.3).toFixed(2)}em;--sy:${(Math.sin(sa) * sr).toFixed(2)}em;--dl:${(i * .02).toFixed(2)}s"></i>`;
    }
    return out;
  };
  const letters = w => [...w].map((c, i) => `<i style="--i:${i}">${c}</i>`).join('');

  const SCENES = {
    'choisir': () => `<div class="sc sc-choisir"><div class="orb"></div><div class="selector"><b>◀</b><div class="opts"><i>Option 1</i><i>Option 2</i><i>Option 3</i></div><b>▶</b></div><div class="cursor"></div></div>`,
    'miniature-pop': () => `<div class="sc sc-thumb"><div class="thumb"><i>TOP 10</i><u></u></div></div>`,
    'objectif-paper': () => `<div class="sc sc-note"><div class="note"><b>Objectif</b><span>Écris ton<br>texte ici</span></div></div>`,
    'item-popup': () => `<div class="sc sc-popup"><div class="card"><div class="gem"></div><div class="pr">$9</div><div class="t">Objet rare</div><div class="s">Débloqué !</div><div class="ok">OK</div></div></div>`,
    'folder-secret': () => `<div class="sc sc-folder"><div class="back"></div><div class="paper"><b>TEXTE</b><i>TOP SECRET</i></div><div class="front"></div></div>`,
    'spotify-musique': () => `<div class="sc sc-player"><div class="pl"></div><div class="cover"></div><div class="tt"></div><div class="tt"></div><div class="eq"><i></i><i></i><i></i><i></i></div><div class="bar"></div><div class="ctl"><i></i><i></i><i></i></div></div>`,
    'transition-game': () => `<div class="sc sc-wipe"><div class="panel"></div><div class="lvl">LEVEL 2</div></div>`,
    'item-claim': () => `<div class="sc sc-claim"><div class="lab">RÉCOMPENSE</div><div class="row"><i style="--i:0"></i><i style="--i:1"></i><i style="--i:2"></i><i style="--i:3"></i></div><div class="btn2">CLAIM</div></div>`,
    'item-pop-2': () => `<div class="sc sc-pop2"><div class="spark"></div><div class="row"><i style="--i:0"></i><i style="--i:2"></i></div></div>`,
    'app-objectif': () => `<div class="sc sc-app"><div class="pnl"></div><div class="r"><u style="--i:1"></u>Objectif 1</div><div class="r"><u style="--i:2"></u>Objectif 2</div><div class="r"><u style="--i:3"></u>Objectif 3</div></div>`,
    'searchbar': () => `<div class="sc sc-search"><div class="bar"><div class="mag"></div><div class="type">MOGRT PRO</div></div></div>`,
    'retournement': () => `<div class="sc sc-flip"><div class="c"><i class="a"></i><i class="b">GE</i></div></div>`,
    'depliage': () => `<div class="sc sc-fold"><div class="u">DÉPLIE<div class="u"><div class="u"></div></div></div></div>`,
    'particle-item': () => `<div class="sc sc-part">${particles()}<div class="core"></div></div>`,
    'texte-transition': () => `<div class="sc sc-text"><div class="lbl">ROUND 1</div><div class="word">${letters('ESCAPE')}</div></div>`,
  };
  const scene = id => SCENES[id]();

  /* ---------- Boîte 3D rouge ---------- */
  // Réduit la taille du titre quand un mot est trop long pour la face de la boîte
  const fitTitle = t => Math.min(1.32, 14 / Math.max(...t.split(/\s+/).map(w => w.length))).toFixed(2);
  const boxHTML = (title, sceneHTML) => `
    <div class="box"><div class="box-in">
      <div class="f f-front"><div class="box-title" style="font-size:${fitTitle(title)}em">${title}</div>${sceneHTML}</div>
      <div class="f f-left"><b>MOGRT</b></div>
      <div class="f f-right"></div>
      <div class="f f-top"></div>
      <div class="f f-back"></div>
    </div></div>`;

  /* ---------- Rendu ---------- */
  // Boutique
  const grid = $('#shopGrid');
  grid.innerHTML = PRODUCTS.map((p, i) => `
    <article class="pcard reveal" style="--d:${(i % 5) * .07}s">
      <div class="boxwrap">${boxHTML(p.box, scene(p.id))}</div>
      <h4><span>MOGRT – ${p.name}</span></h4>
      <div class="price">${p.price}</div>
      <a class="buy" href="${p.url}" target="_blank" rel="noopener">Acheter <span class="arr">→</span></a>
    </article>`).join('');

  // Marquee
  const words = PRODUCTS.map((p, i) => `<span class="${i % 3 === 0 ? 'f' : ''}">${p.name}</span><span class="f">✦</span>`).join('');
  $('#marquee').innerHTML = words + words;

  // Compteurs
  const N = PRODUCTS.length;
  $('#heroCount').textContent = `${N} mogrts`;
  $('#featCount').textContent = N;
  $('#bigNum').dataset.to = N;

  // Mosaïque (feature 3)
  $('#mosaic').innerHTML = ['item-popup', 'retournement', 'spotify-musique', 'item-claim']
    .map(id => `<div class="m">${scene(id)}</div>`).join('');

  // Boîte héro : le titre et l'animation changent toutes les 4,5 s
  const hero = $('#heroBox');
  let hi = 0;
  const setHero = () => {
    const p = PRODUCTS[hi];
    hero.innerHTML = boxHTML(p.box, scene(p.id));
    hero.firstElementChild.classList.add('vis');
  };
  setHero();
  if (!reduce) {
    setInterval(() => {
      hi = (hi + 1) % PRODUCTS.length;
      const front = $('.f-front', hero);
      front.style.transition = 'opacity .35s'; front.style.opacity = 0;
      setTimeout(() => { setHero(); const f = $('.f-front', hero); f.style.opacity = 0; requestAnimationFrame(() => { f.style.transition = 'opacity .35s'; f.style.opacity = 1; }); }, 360);
    }, 4600);
  }

  // Carrousel "Contenu inclus"
  const track = $('#carTrack');
  const renderCar = cat => {
    track.innerHTML = PRODUCTS.filter(p => p.cat === cat).map(p => `
      <article class="vcard">
        <span class="live">APERÇU</span>
        <div class="stage dark" data-vis>${scene(p.id)}</div>
        <h4>${p.name}</h4>
      </article>`).join('');
    track.scrollTo({ left: 0 });
    observeVis();
  };
  renderCar('phares');
  $('#tabs').addEventListener('click', e => {
    const b = e.target.closest('.tab'); if (!b || b.classList.contains('on')) return;
    $$('.tab').forEach(t => t.classList.toggle('on', t === b));
    track.classList.add('swap');
    setTimeout(() => { renderCar(b.dataset.cat); track.classList.remove('swap'); }, 320);
  });

  // Drag horizontal (souris)
  (() => {
    let down = false, sx = 0, sl = 0, moved = 0;
    track.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; sx = e.clientX; sl = track.scrollLeft; moved = 0; track.classList.add('drag'); });
    addEventListener('pointermove', e => { if (!down) return; const dx = e.clientX - sx; moved = Math.abs(dx); track.scrollLeft = sl - dx; });
    addEventListener('pointerup', () => { if (!down) return; down = false; track.classList.remove('drag'); });
  })();

  /* ---------- Animations pausées hors écran ---------- */
  function observeVis() {
    if (!('IntersectionObserver' in window)) { $$('[data-vis],.box').forEach(el => el.classList.add('vis')); return; }
    visIO = visIO || new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('vis', e.isIntersecting)), { rootMargin: '120px' });
    $$('[data-vis],.box').forEach(el => visIO.observe(el));
  }
  observeVis();

  /* ---------- Apparition au scroll ---------- */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12, rootMargin: '0px 0px -40px 0px' });
    $$('.reveal').forEach(el => io.observe(el));
  } else $$('.reveal').forEach(el => el.classList.add('in'));

  /* ---------- Compteur ---------- */
  const num = $('#bigNum');
  new IntersectionObserver(([e], o) => {
    if (!e.isIntersecting) return; o.disconnect();
    const to = +num.dataset.to; if (reduce) { num.textContent = to; return; }
    const t0 = performance.now();
    const step = t => { const k = Math.min(1, (t - t0) / 1400); num.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }, { threshold: .5 }).observe(num);

  /* ---------- Barre de progression ---------- */
  const bar = $('#progress');
  const onScroll = () => { const h = document.documentElement; bar.style.transform = `scaleX(${h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)})`; };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- Tilt 3D + spotlight + magnétique (souris) ---------- */
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (fine && !reduce) {
    $$('[data-tilt]').forEach(el => {
      const k = +el.dataset.tilt || 6;
      el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; el.style.setProperty('--ry', (x * k * 2).toFixed(2) + 'deg'); el.style.setProperty('--rx', (-y * k * 2).toFixed(2) + 'deg'); });
      el.addEventListener('pointerleave', () => { el.style.setProperty('--ry', '0deg'); el.style.setProperty('--rx', '0deg'); });
    });
    $$('.pcard').forEach(c => {
      const bi = $('.box-in', c);
      c.addEventListener('pointermove', e => {
        const r = c.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        c.style.setProperty('--mx', (x * 100) + '%'); c.style.setProperty('--my', (y * 100) + '%');
        c.classList.add('tilting');
        bi.style.setProperty('--ry', (24 + (x - .5) * 50).toFixed(1) + 'deg'); bi.style.setProperty('--rx', (-6 - (y - .5) * 30).toFixed(1) + 'deg');
      });
      c.addEventListener('pointerleave', () => { c.classList.remove('tilting'); bi.style.removeProperty('--ry'); bi.style.removeProperty('--rx'); });
    });
    $$('.magnetic').forEach(b => {
      b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${((e.clientX - r.left) / r.width - .5) * 14}px,${((e.clientY - r.top) / r.height - .5) * 10 - 2}px)`; });
      b.addEventListener('pointerleave', () => { b.style.transform = ''; });
    });
  }

  /* ---------- FAQ ---------- */
  const faq = $('#faq');
  $('#helpBtn').addEventListener('click', () => faq.showModal ? faq.showModal() : faq.setAttribute('open', ''));
  $('#faqClose').addEventListener('click', () => faq.close());
  faq.addEventListener('click', e => { if (e.target === faq) faq.close(); });

  $('#year').textContent = new Date().getFullYear();

  /* ---------- Particules de fond ---------- */
  const cv = $('#fx');
  if (!reduce && cv.getContext) {
    const ctx = cv.getContext('2d'); let W, H, dots = [], raf;
    const size = () => { const d = Math.min(devicePixelRatio || 1, 2); W = cv.width = innerWidth * d; H = cv.height = innerHeight * d; dots = Array.from({ length: Math.round(innerWidth / 26) }, () => ({ x: Math.random() * W, y: Math.random() * H, r: rnd(.6, 2.2) * d, v: rnd(.15, .55) * d, a: rnd(.15, .6), p: rnd(0, 6.28) })); };
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of dots) {
        p.y -= p.v; p.p += .012; if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
        ctx.globalAlpha = p.a * (.6 + .4 * Math.sin(p.p));
        ctx.fillStyle = '#b9a6ff'; ctx.shadowColor = '#7c4dff'; ctx.shadowBlur = 12;
        ctx.beginPath(); ctx.arc(p.x + Math.sin(p.p) * 10, p.y, p.r, 0, 6.283); ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    size(); draw();
    addEventListener('resize', size);
    document.addEventListener('visibilitychange', () => { cancelAnimationFrame(raf); if (!document.hidden) draw(); });
  }
})();
