// ENTROLABS — Corpo humano: partes e sistemas (SVG 2D, sem dependências)

const SYSTEMS = {
  esqueletico:    { nome: 'Esquelético',    cor: '#64748b', fill: '#e2e8f0' },
  nervoso:        { nome: 'Nervoso',        cor: '#7c3aed', fill: '#ede9fe' },
  respiratorio:   { nome: 'Respiratório',   cor: '#0284c7', fill: '#e0f2fe' },
  cardiovascular: { nome: 'Cardiovascular', cor: '#e11d48', fill: '#ffe4e6' },
  digestivo:      { nome: 'Digestivo',      cor: '#d97706', fill: '#fef3c7' },
  urinario:       { nome: 'Urinário',       cor: '#0d9488', fill: '#ccfbf1' },
  endocrino:      { nome: 'Endócrino',      cor: '#db2777', fill: '#fce7f3' },
};

// ---------- geometria auxiliar ----------
const M = (x) => 400 - x;                       // espelha no eixo central (x = 200)
const smooth = (pts) => {                       // polilinha -> curva suave por pontos médios
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i], [x1, y1] = pts[i + 1];
    d += ` Q${x0},${y0} ${(x0 + x1) / 2},${(y0 + y1) / 2}`;
  }
  const l = pts[pts.length - 1];
  return d + ` L${l[0]},${l[1]}`;
};
const mirrorPath = (d) => d.replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (_, x, y) => `${M(+x)},${y}`);

// silhueta (metade esquerda do observador, depois espelhada)
const half = [
  [182, 122], [182, 158], [150, 168], [118, 186], [104, 204], [92, 262], [80, 330], [66, 400], [58, 462],
  [50, 500], [44, 528], [62, 536], [80, 512], [90, 470], [98, 400], [108, 342], [120, 262], [124, 300],
  [126, 360], [122, 410], [112, 452], [110, 500], [116, 560], [118, 620], [122, 700], [124, 770], [110, 806],
  [128, 818], [162, 812], [166, 770], [170, 700], [172, 620], [178, 560], [190, 500], [200, 470],
];
const bodyPath = smooth(half) + ' ' + smooth([...half].reverse().map(([x, y]) => [M(x), y])).replace(/^M/, 'L') + ' Z';

// ---------- partes do corpo ----------
// Cada parte: id, nome, sistema, forma (svg interno), rótulo [x,y], texto.
const PARTS = [
  // --- esquelético ---
  { id: 'cranio', nome: 'Crânio', sys: 'esqueletico', label: [258, 60],
    svg: `<ellipse cx="200" cy="70" rx="36" ry="42"/><path d="M176,98 Q200,126 224,98" fill="none"/>`,
    fn: 'Protege o encéfalo e forma a estrutura da face. É composto por 22 ossos, quase todos fundidos por suturas.',
    fato: 'O único osso móvel do crânio é a mandíbula.' },
  { id: 'coluna', nome: 'Coluna vertebral', sys: 'esqueletico', label: [258, 300],
    svg: Array.from({ length: 22 }, (_, i) => `<rect x="193" y="${130 + i * 14.5}" width="14" height="10" rx="2"/>`).join(''),
    fn: 'Sustenta o tronco, permite os movimentos do corpo e protege a medula espinhal. Tem 33 vértebras: 7 cervicais, 12 torácicas, 5 lombares, 5 sacrais e 4 coccígeas.',
    fato: 'Somos até 1 cm mais altos de manhã: os discos entre as vértebras se comprimem ao longo do dia.' },
  { id: 'costelas', nome: 'Caixa torácica', sys: 'esqueletico', label: [100, 236],
    svg: [0, 1, 2, 3, 4, 5, 6].map(i => { const y = 196 + i * 19; return `<path d="M200,${y} C170,${y + 2} 142,${y + 14} 138,${y + 34} C150,${y + 40} 176,${y + 40} 196,${y + 30}" fill="none"/><path d="M200,${y} C230,${y + 2} 258,${y + 14} 262,${y + 34} C250,${y + 40} 224,${y + 40} 204,${y + 30}" fill="none"/>`; }).join('') +
         `<path d="M200,190 L200,318" fill="none"/><path d="M200,178 L128,192" fill="none"/><path d="M200,178 L272,192" fill="none"/>`,
    fn: '12 pares de costelas ligados à coluna e, na frente, ao esterno. Protegem coração e pulmões e se movem na respiração.',
    fato: 'As clavículas (as barras acima) são os ossos mais fraturados do corpo humano.' },
  { id: 'pelve', nome: 'Pelve', sys: 'esqueletico', label: [258, 452],
    svg: `<path d="M200,430 C176,420 150,424 144,446 C140,464 158,480 176,486 L200,478 Z"/><path d="M200,430 C224,420 250,424 256,446 C260,464 242,480 224,486 L200,478 Z"/>`,
    fn: 'Anel ósseo formado pelos ossos do quadril e pelo sacro. Transfere o peso do tronco para as pernas e protege bexiga, reto e órgãos reprodutores.',
    fato: 'A pelve feminina é mais larga e rasa, adaptação ao parto.' },
  { id: 'braco-osso', nome: 'Ossos do braço', sys: 'esqueletico', label: [30, 280],
    svg: `<path d="M118,196 L90,330" fill="none" stroke-width="6"/><path d="M90,330 L60,468" fill="none" stroke-width="4"/><path d="M96,334 L70,470" fill="none" stroke-width="3"/>
          ${mirrorPath('<path d="M118,196 L90,330" fill="none" stroke-width="6"/><path d="M90,330 L60,468" fill="none" stroke-width="4"/><path d="M96,334 L70,470" fill="none" stroke-width="3"/>')}`,
    fn: 'Úmero no braço; rádio e ulna no antebraço. O rádio gira sobre a ulna, o que permite virar a palma da mão para cima e para baixo.',
    fato: 'A mão tem 27 ossos. As duas mãos somam mais de um quarto de todos os ossos do corpo.' },
  { id: 'perna-osso', nome: 'Ossos da perna', sys: 'esqueletico', label: [258, 640],
    svg: `<path d="M172,478 L150,624" fill="none" stroke-width="8"/><path d="M150,624 L142,780" fill="none" stroke-width="6"/><path d="M158,628 L152,782" fill="none" stroke-width="3"/><circle cx="150" cy="622" r="7"/>
          ${mirrorPath('<path d="M172,478 L150,624" fill="none" stroke-width="8"/><path d="M150,624 L142,780" fill="none" stroke-width="6"/><path d="M158,628 L152,782" fill="none" stroke-width="3"/><circle cx="150" cy="622" r="7"/>')}`,
    fn: 'Fêmur na coxa; tíbia e fíbula na perna; patela no joelho. O fêmur suporta várias vezes o peso do corpo ao correr.',
    fato: 'O fêmur é o osso mais longo e mais forte do corpo, cerca de um quarto da altura da pessoa.' },

  // --- nervoso ---
  { id: 'cerebro', nome: 'Encéfalo', sys: 'nervoso', label: [258, 40],
    svg: `<path d="M168,74 C162,50 180,36 200,38 C222,34 240,50 232,74 C236,90 216,100 200,96 C184,100 164,90 168,74 Z"/>
          <path d="M200,40 L200,94 M178,52 C186,60 184,72 176,80 M222,52 C214,60 216,72 224,80 M186,88 C196,82 204,82 214,88" fill="none" stroke-width="1"/>`,
    fn: 'Centro de controle do corpo: pensamento, memória, linguagem, emoção, movimento e regulação de funções vitais como respiração e batimentos.',
    fato: 'Pesa cerca de 1,4 kg (2 % do corpo) mas consome cerca de 20 % da energia.' },
  { id: 'medula', nome: 'Medula espinhal e nervos', sys: 'nervoso', label: [100, 372],
    svg: `<path d="M200,100 L200,440" fill="none" stroke-width="4"/>
          <path d="M200,186 L120,205 L92,330 L64,462 M200,186 L280,205 L308,330 L336,462" fill="none" stroke-width="1.5"/>
          <path d="M200,440 L166,480 L150,624 L146,780 M200,440 L234,480 L250,624 L254,780" fill="none" stroke-width="1.5"/>
          <path d="M200,150 L176,150 M200,200 L176,200 M200,250 L172,250 M200,300 L172,300 M200,350 L174,350 M200,400 L176,400 M200,150 L224,150 M200,200 L224,200 M200,250 L228,250 M200,300 L228,300 M200,350 L226,350 M200,400 L224,400" fill="none" stroke-width="1"/>`,
    fn: 'A medula leva sinais entre o encéfalo e o corpo e comanda reflexos sozinha. Dela saem 31 pares de nervos que chegam a todos os músculos e à pele.',
    fato: 'Um reflexo como tirar a mão do fogo é resolvido na medula antes de o cérebro "saber".' },

  // --- respiratório ---
  { id: 'traqueia', nome: 'Traqueia e brônquios', sys: 'respiratorio', label: [258, 150],
    svg: `<path d="M200,128 L200,218" fill="none" stroke-width="8"/><path d="M200,218 L176,244 M200,218 L224,244" fill="none" stroke-width="5"/>
          <path d="M194,140 L206,140 M194,152 L206,152 M194,164 L206,164 M194,176 L206,176 M194,188 L206,188 M194,200 L206,200" fill="none" stroke-width="1" stroke="#fff"/>`,
    fn: 'Tubo reforçado por anéis de cartilagem que leva o ar da laringe aos pulmões, dividindo-se nos dois brônquios.',
    fato: 'Os anéis em C mantêm a traqueia aberta mesmo quando o pescoço se dobra.' },
  { id: 'pulmoes', nome: 'Pulmões', sys: 'respiratorio', label: [100, 300],
    svg: `<path d="M186,222 C156,222 136,262 136,300 C136,326 146,334 176,332 L186,326 Z"/>
          <path d="M214,222 C244,222 264,262 264,300 C264,326 254,334 224,332 L214,326 L214,290 C220,282 222,270 214,262 Z"/>`,
    fn: 'Onde o oxigênio do ar passa para o sangue e o gás carbônico sai. Têm cerca de 300 milhões de alvéolos, sacos microscópicos cercados de capilares.',
    fato: 'Abertos, os alvéolos cobririam uma área próxima à de uma quadra de tênis. O pulmão esquerdo é menor para dar espaço ao coração.' },

  // --- cardiovascular ---
  { id: 'coracao', nome: 'Coração', sys: 'cardiovascular', label: [258, 262],
    svg: `<path d="M210,250 C220,232 250,240 246,266 C242,290 222,306 210,316 C198,306 178,290 174,266 C170,240 200,232 210,250 Z"/>
          <path d="M204,236 L198,224 M214,236 L220,224" fill="none" stroke-width="3"/>`,
    fn: 'Bomba muscular com quatro câmaras. O lado direito manda sangue aos pulmões; o esquerdo, ao resto do corpo. Bate cerca de 100 mil vezes por dia.',
    fato: 'Em uma vida, o coração bombeia sangue suficiente para encher cerca de 3 piscinas olímpicas.' },
  { id: 'vasos', nome: 'Artérias e veias', sys: 'cardiovascular', label: [100, 520],
    svg: `<path d="M210,236 C210,200 236,196 236,236 L236,440 C236,470 224,480 224,520 L232,700 L236,790" fill="none" stroke-width="4"/>
          <path d="M236,206 L286,206 L310,330 L332,462 M218,206 L114,206 L88,330 L66,462" fill="none" stroke-width="2.5"/>
          <path d="M236,440 C210,470 176,480 176,520 L168,700 L164,790" fill="none" stroke-width="3"/>
          <path d="M190,236 L190,440 C190,470 200,480 200,520 M190,236 C190,214 176,210 148,210" fill="none" stroke-width="3" stroke="#2563eb"/>`,
    fn: 'Artérias levam sangue do coração para os tecidos; veias trazem de volta. Entre elas, capilares finíssimos fazem a troca de oxigênio e nutrientes.',
    fato: 'Todos os vasos de um adulto enfileirados dariam cerca de 100 mil km, mais de duas voltas na Terra.' },

  // --- digestivo ---
  { id: 'esofago', nome: 'Esôfago', sys: 'digestivo', label: [100, 190],
    svg: `<path d="M194,128 C190,170 192,220 206,320" fill="none" stroke-width="5"/>`,
    fn: 'Tubo muscular de cerca de 25 cm que leva o alimento da garganta ao estômago por ondas de contração (peristaltismo).',
    fato: 'Por causa do peristaltismo, dá para engolir mesmo de cabeça para baixo.' },
  { id: 'figado', nome: 'Fígado', sys: 'digestivo', label: [100, 350],
    svg: `<path d="M138,326 C134,356 160,378 204,372 L216,344 C210,334 190,326 138,326 Z"/>`,
    fn: 'Maior órgão interno. Produz a bile, armazena glicose e vitaminas, fabrica proteínas do sangue e neutraliza toxinas e medicamentos.',
    fato: 'É o único órgão que se regenera: pode recompor o tamanho original a partir de um quarto de si.' },
  { id: 'estomago', nome: 'Estômago', sys: 'digestivo', label: [258, 342],
    svg: `<path d="M214,318 C246,312 268,338 258,364 C248,388 222,386 212,370 C206,356 208,334 214,318 Z"/>`,
    fn: 'Bolsa muscular que mistura o alimento com ácido clorídrico e enzimas, começando a digestão das proteínas.',
    fato: 'O ácido do estômago dissolveria metal; a parede é protegida por muco renovado a cada poucos dias.' },
  { id: 'intestinos', nome: 'Intestinos', sys: 'digestivo', label: [258, 410],
    svg: `<path d="M158,448 L158,392 Q158,380 170,380 L232,380 Q244,380 244,392 L244,448" fill="none" stroke-width="12"/>
          <path d="M170,398 C180,388 190,408 200,398 C210,388 220,408 230,398 M168,416 C178,406 188,426 198,416 C208,406 218,426 228,416 M170,434 C180,424 190,444 200,434 C210,424 220,444 230,434" fill="none" stroke-width="7"/>`,
    fn: 'Intestino delgado (cerca de 6 m) absorve os nutrientes. Intestino grosso absorve água e forma as fezes, com ajuda de trilhões de bactérias.',
    fato: 'A superfície interna do intestino delgado, com suas vilosidades, chega a cerca de 30 m².' },

  // --- urinário ---
  { id: 'rins', nome: 'Rins', sys: 'urinario', label: [100, 400],
    svg: `<path d="M164,372 C150,372 148,392 152,404 C156,418 170,420 176,410 C182,398 178,372 164,372 Z"/><path d="M236,372 C250,372 252,392 248,404 C244,418 230,420 224,410 C218,398 222,372 236,372 Z"/>
          <path d="M172,410 C180,430 194,440 198,456 M228,410 C220,430 206,440 202,456" fill="none" stroke-width="2"/>`,
    fn: 'Filtram cerca de 180 litros de sangue por dia, removendo ureia e excesso de sal e água. Regulam a pressão arterial e produzem hormônios.',
    fato: 'Cada rim tem cerca de 1 milhão de néfrons, as unidades de filtração. Dá para viver bem com um só.' },
  { id: 'bexiga', nome: 'Bexiga', sys: 'urinario', label: [258, 476],
    svg: `<ellipse cx="200" cy="464" rx="17" ry="13"/>`,
    fn: 'Reservatório muscular que armazena a urina vinda dos rins pelos ureteres e a elimina pela uretra.',
    fato: 'A vontade de urinar surge com cerca de 150 a 250 mL; a capacidade máxima passa de 500 mL.' },

  // --- endócrino ---
  { id: 'tireoide', nome: 'Tireoide', sys: 'endocrino', label: [100, 150],
    svg: `<path d="M186,150 C180,142 178,160 186,166 L200,160 L214,166 C222,160 220,142 214,150 L200,156 Z"/>`,
    fn: 'Glândula em forma de borboleta no pescoço. Seus hormônios (T3 e T4) regulam o ritmo do metabolismo de todas as células.',
    fato: 'Precisa de iodo para funcionar; por isso o sal de cozinha é iodado no Brasil.' },
  { id: 'adrenais', nome: 'Glândulas adrenais', sys: 'endocrino', label: [258, 368],
    svg: `<path d="M158,366 L172,360 L178,372 Z"/><path d="M242,366 L228,360 L222,372 Z"/>`,
    fn: 'Sobre cada rim. Produzem adrenalina (resposta de luta ou fuga) e cortisol (estresse, glicemia, inflamação).',
    fato: 'A adrenalina acelera o coração e dilata as pupilas em segundos.' },
  { id: 'pancreas', nome: 'Pâncreas', sys: 'endocrino', label: [100, 380],
    svg: `<path d="M172,364 C196,356 232,360 250,352 C254,360 244,372 228,374 C204,376 184,378 172,364 Z"/>`,
    fn: 'Produz insulina e glucagon, que controlam a glicose no sangue, e enzimas digestivas lançadas no intestino.',
    fato: 'Quando as células que produzem insulina falham, surge o diabetes tipo 1.' },
];

// ---------- montagem do SVG ----------
const figure = document.getElementById('figure');
const svgNS = 'http://www.w3.org/2000/svg';
const zOrder = ['esqueletico', 'nervoso', 'urinario', 'endocrino', 'digestivo', 'respiratorio', 'cardiovascular'];
const ordered = [...PARTS].sort((a, b) => zOrder.indexOf(a.sys) - zOrder.indexOf(b.sys));

figure.innerHTML = `
<svg viewBox="0 0 400 840" xmlns="${svgNS}" role="img" aria-label="Corpo humano com partes clicáveis">
  <ellipse class="body-outline" cx="200" cy="72" rx="46" ry="54"/>
  <path class="body-outline" d="${bodyPath}"/>
  <g id="parts-layer">
    ${ordered.map(p => `<g class="part" data-id="${p.id}" data-sys="${p.sys}" style="--c:${SYSTEMS[p.sys].cor}">
      <g class="shape" fill="${SYSTEMS[p.sys].fill}" stroke="${SYSTEMS[p.sys].cor}">${p.svg}</g>
    </g>`).join('')}
  </g>
  <g id="label-layer" pointer-events="none"></g>
</svg>`;

const svg = figure.querySelector('svg');
const labelLayer = svg.querySelector('#label-layer');
const partEls = new Map([...svg.querySelectorAll('.part')].map(el => [el.dataset.id, el]));

// ---------- estado ----------
let currentSys = 'todos';
let currentPart = null;

function showLabel(p) {
  labelLayer.innerHTML = '';
  if (!p) return;
  const [x, y] = p.label;
  const t = document.createElementNS(svgNS, 'text');
  t.setAttribute('class', 'label'); t.setAttribute('x', x); t.setAttribute('y', y);
  t.setAttribute('text-anchor', x > 200 ? 'start' : 'end');
  t.textContent = p.nome;
  labelLayer.appendChild(t);
  const bb = t.getBBox();
  const r = document.createElementNS(svgNS, 'rect');
  r.setAttribute('class', 'label-bg'); r.setAttribute('rx', 4);
  r.setAttribute('x', bb.x - 6); r.setAttribute('y', bb.y - 3); r.setAttribute('width', bb.width + 12); r.setAttribute('height', bb.height + 6);
  labelLayer.insertBefore(r, t);
}

function render() {
  for (const p of PARTS) {
    const el = partEls.get(p.id);
    const visible = currentSys === 'todos' || p.sys === currentSys;
    el.classList.toggle('hidden', !visible);
    el.classList.toggle('on', currentPart === p.id);
    el.classList.toggle('dim', currentPart !== null && currentPart !== p.id && visible);
  }
  document.querySelectorAll('#systems .chip').forEach(c => c.classList.toggle('on', c.dataset.sys === currentSys));
  document.querySelectorAll('#parts li').forEach(li => {
    const p = PARTS.find(q => q.id === li.dataset.id);
    li.hidden = !(currentSys === 'todos' || p.sys === currentSys);
    li.querySelector('button').classList.toggle('on', currentPart === p.id);
  });
  const p = PARTS.find(q => q.id === currentPart);
  showLabel(p || null);
  renderInfo(p || null);
  document.getElementById('hint').textContent = p ? '' : 'Toque em uma parte do corpo';
}

function renderInfo(p) {
  const box = document.getElementById('info');
  if (!p) { box.innerHTML = `<div class="info-empty">Selecione uma parte para ver o que ela faz.</div>`; return; }
  const s = SYSTEMS[p.sys];
  box.innerHTML = `<div class="info" style="--c:${s.cor}">
    <div class="sys"><span class="dot"></span>Sistema ${s.nome.toLowerCase()}</div>
    <h3>${p.nome}</h3>
    <p>${p.fn}</p>
    <div class="fact"><b>Curiosidade.</b> ${p.fato}</div>
  </div>`;
}

// ---------- controles ----------
const sysBox = document.getElementById('systems');
const chip = (sys, nome, cor) => {
  const b = document.createElement('button');
  b.className = 'chip'; b.dataset.sys = sys; b.style.setProperty('--c', cor);
  b.innerHTML = `<span class="dot"></span>${nome}`;
  b.addEventListener('click', () => {
    currentSys = sys;
    if (currentPart && sys !== 'todos' && PARTS.find(p => p.id === currentPart).sys !== sys) currentPart = null;
    render();
  });
  sysBox.appendChild(b);
};
chip('todos', 'Todos', '#111827');
for (const [k, s] of Object.entries(SYSTEMS)) chip(k, s.nome, s.cor);

const list = document.getElementById('parts');
for (const p of PARTS) {
  const li = document.createElement('li'); li.dataset.id = p.id;
  const b = document.createElement('button'); b.style.setProperty('--c', SYSTEMS[p.sys].cor);
  b.innerHTML = `<span class="dot"></span>${p.nome}`;
  b.addEventListener('click', () => { currentPart = p.id; render(); });
  li.appendChild(b); list.appendChild(li);
}

svg.addEventListener('click', (e) => {
  const g = e.target.closest('.part');
  currentPart = g ? (g.dataset.id === currentPart ? null : g.dataset.id) : null;
  render();
  if (g && window.innerWidth <= 900) document.getElementById('info').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});
svg.addEventListener('mouseover', (e) => {
  const g = e.target.closest('.part');
  if (g && !currentPart) showLabel(PARTS.find(p => p.id === g.dataset.id));
});
svg.addEventListener('mouseleave', () => { if (!currentPart) showLabel(null); });

render();
