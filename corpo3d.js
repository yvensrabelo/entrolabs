// ENTROLABS — Corpo 3D (Z-Anatomy). Portado do visualizador do repositório plataforma-medicina.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

/* ============================== conjuntos ============================== */
const SETS = {
  esqueleto:      { label: 'Esqueleto',                 url: './models/za/esqueleto.glb',      color: '#e9e4d6', rough: .85, size: '1,1 MB' },
  articulacoes:   { label: 'Articulações e ligamentos', url: './models/za/articulacoes.glb',   color: '#cfd8dc', rough: .7,  size: '1,3 MB' },
  musculos:       { label: 'Músculos',                  url: './models/za/musculos.glb',       color: '#b8433a', rough: .6,  size: '3,8 MB' },
  insercoes:      { label: 'Inserções musculares',      url: './models/za/insercoes.glb',      color: '#e0b090', rough: .7,  size: '3,2 MB' },
  cardiovascular: { label: 'Cardiovascular',            url: './models/za/cardiovascular.glb', color: '#c0392b', rough: .5,  size: '4,6 MB' },
  nervoso:        { label: 'Nervoso e sentidos',        url: './models/za/nervoso.glb',        color: '#e3b23c', rough: .6,  size: '3 MB' },
  visceral:       { label: 'Vísceras',                  url: './models/za/visceral.glb',       color: '#d98c7a', rough: .55, size: '1,2 MB' },
  linfoide:       { label: 'Linfoide',                  url: './models/za/linfoide.glb',       color: '#6aa84f', rough: .6,  size: '0,3 MB' },
  regioes:        { label: 'Regiões do corpo (pele)',   url: './models/za/regioes.glb',        color: '#f1d9c4', rough: .8,  size: '0,7 MB', skin: true },
};
const PT = {
  'biceps brachii': 'bíceps braquial', 'triceps brachii': 'tríceps braquial', deltoid: 'deltoide', 'pectoralis major': 'peitoral maior',
  'pectoralis minor': 'peitoral menor', 'latissimus dorsi': 'latíssimo do dorso', trapezius: 'trapézio', 'gluteus maximus': 'glúteo máximo',
  'gluteus medius': 'glúteo médio', 'rectus femoris': 'reto femoral', 'vastus lateralis': 'vasto lateral', 'vastus medialis': 'vasto medial',
  sartorius: 'sartório', gastrocnemius: 'gastrocnêmio', soleus: 'sóleo', 'tibialis anterior': 'tibial anterior', 'rectus abdominis': 'reto do abdome',
  'external oblique': 'oblíquo externo', sternocleidomastoid: 'esternocleidomastóideo', masseter: 'masseter', temporalis: 'temporal', femur: 'fêmur',
  tibia: 'tíbia', fibula: 'fíbula', humerus: 'úmero', radius: 'rádio', ulna: 'ulna', clavicle: 'clavícula', scapula: 'escápula', sternum: 'esterno',
  skull: 'crânio', mandible: 'mandíbula', patella: 'patela', 'hip bone': 'osso do quadril', sacrum: 'sacro', rib: 'costela', vertebra: 'vértebra',
};
const HILITE = new THREE.Color('#0ea5e9');

function colorFor(setKey, lower) {
  if (setKey === 'musculos' && /tendon|aponeurosis|fascia|sheath|retinaculum/.test(lower)) return '#e8dcc8';
  if (setKey === 'articulacoes') { if (/cartilage|disc|meniscus|labrum/.test(lower)) return '#a9c7e8'; if (/ligament|membrane|capsule/.test(lower)) return '#d7dee3'; return '#cfd8dc'; }
  if (setKey === 'esqueleto') { if (/cartilage/.test(lower)) return '#b9d3e6'; if (/tooth|teeth|molar|incisor|canine|premolar/.test(lower)) return '#f6f3ea'; return '#e9e4d6'; }
  if (setKey === 'cardiovascular') { if (/vein|vena|sinus/.test(lower)) return '#3b5fc0'; if (/arter|aorta|trunk/.test(lower)) return '#c0392b'; return '#a83a3a'; }
  if (setKey === 'nervoso') {
    if (/retina|sclera|cornea|lens|iris|choroid|eyeball|vitreous/.test(lower)) return '#b9c4cc';
    if (/cochlea|labyrinth|tympan|ossicle|malleus|incus|stapes|auricle/.test(lower)) return '#c9b6a2';
    if (/nerve|plexus|ganglion|root|ramus|branch/.test(lower)) return '#f2d16b';
    return '#e3b23c';
  }
  if (setKey === 'visceral') {
    if (/lung|bronch|trache|larynx|pleura|alveol/.test(lower)) return '#e8a0a0';
    if (/liver|hepat/.test(lower)) return '#8b3a2e';
    if (/kidney|ureter|bladder|urethra|renal/.test(lower)) return '#a0522d';
    if (/stomach|colon|intestin|duoden|jejun|ile|rectum|append|caec|oesophag|esophag|anal/.test(lower)) return '#d98c7a';
    if (/pancrea/.test(lower)) return '#e8c98f';
    if (/spleen/.test(lower)) return '#7a3b4a';
    if (/thyroid|adrenal|suprarenal|pituitar|pineal/.test(lower)) return '#c98a6a';
    if (/uter|ovar|testis|testic|prostat|vagin|penis|scrot/.test(lower)) return '#c99aa8';
    return '#cfa08a';
  }
  return SETS[setKey].color;
}
function sideOf(raw) {
  if (/\.(l|ol)$/.test(raw)) return 'esquerdo';
  if (/\.(r|or)$/.test(raw)) return 'direito';
  const lower = raw.toLowerCase();
  if (/^left\b/.test(lower)) return 'esquerdo';
  if (/^right\b/.test(lower)) return 'direito';
  return '';
}

/* ============================== visualizador ============================== */
function createViewer(container, ui) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.02, 100);
  camera.position.set(0, 0.2, 4.2);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; controls.dampingFactor = 0.08;
  controls.minDistance = 0.1; controls.maxDistance = 8;

  scene.add(new THREE.HemisphereLight(0xffffff, 0xb0b8c0, 1.1));
  const key = new THREE.DirectionalLight(0xffffff, 1.4); key.position.set(2, 3, 4); scene.add(key);
  const fill = new THREE.DirectionalLight(0xffffff, 0.5); fill.position.set(-3, 1, -2); scene.add(fill);

  // Z-Anatomy: caixa do corpo medida no Blender (altura 0,317–1,708 m)
  const fr = { group: new THREE.Group(), center: new THREE.Vector3(0, 1.012, 0), scale: 3.2 / 1.391 };
  scene.add(fr.group);

  const clipPlane = new THREE.Plane(new THREE.Vector3(0, 0, -1), 10);
  renderer.localClippingEnabled = true;

  const meshes = [];
  const loaded = {};
  const visibleSets = {};
  let selected = null, isolated = false, meta = null, landmarks = [], allPins = false, selectedPin = null, lmHost = null;
  const pins = [];
  const pinGeo = new THREE.SphereGeometry(0.006, 12, 10);
  const tipGeo = new THREE.SphereGeometry(0.0022, 8, 6);
  const tipMat = new THREE.MeshBasicMaterial({ color: 0x0f766e, depthTest: false });
  const tipMatSel = new THREE.MeshBasicMaterial({ color: 0xd97706, depthTest: false });
  const lineMat = new THREE.LineBasicMaterial({ color: 0x0f766e, depthTest: false, transparent: true, opacity: 0.9 });
  const lineMatSel = new THREE.LineBasicMaterial({ color: 0xd97706, depthTest: false });
  const pinMat = new THREE.MeshStandardMaterial({ color: 0x0d9488, emissive: 0x0d9488, emissiveIntensity: 0.35, roughness: 0.4 });
  const pinMatSel = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xf59e0b, emissiveIntensity: 0.5, roughness: 0.4 });

  function resize() {
    const w = container.clientWidth, h = container.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(container); resize();
  (function frame() { controls.update(); renderer.render(scene, camera); requestAnimationFrame(frame); })();

  const draco = new DRACOLoader(); draco.setDecoderPath('./draco/');
  const loader = new GLTFLoader(); loader.setDRACOLoader(draco);
  const load = (url, onProgress) => new Promise((res, rej) => loader.load(url, res, onProgress, rej));

  async function ensureMeta() {
    if (meta) return meta;
    try { meta = await (await fetch('./models/za/meta.json')).json(); } catch { meta = {}; }
    try { landmarks = await (await fetch('./models/za/landmarks.json')).json(); } catch { landmarks = []; }
    return meta;
  }

  function addModel(gltf, setKey) {
    const set = SETS[setKey];
    gltf.scene.updateMatrixWorld(true);
    const list = [];
    gltf.scene.traverse((c) => { if (c.isMesh) list.push(c); });
    list.forEach((child) => {
      child.geometry = child.geometry.clone();
      child.geometry.applyMatrix4(child.matrixWorld);
      child.position.set(0, 0, 0); child.rotation.set(0, 0, 0); child.scale.set(1, 1, 1);
    });
    const setMeta = (meta && meta[setKey]) || {};
    const norm = (s) => s.replace(/\s/g, '_').replace(/[\[\]\.:\/]/g, '');
    const metaByNorm = {}; Object.keys(setMeta).forEach(k => { metaByNorm[norm(k)] = { raw: k, ...setMeta[k] }; });
    list.forEach((child) => {
      const rawNode = child.name || 'mesh';
      const m = metaByNorm[rawNode] || metaByNorm[rawNode.replace(/_\d+$/, '')] || null;
      if (!m) return;
      const raw = m.raw;
      const lower = m.base.toLowerCase();
      const colorHex = set.skin ? set.color : colorFor(setKey, lower);
      const mat = new THREE.MeshStandardMaterial({ color: new THREE.Color(colorHex), roughness: set.rough, metalness: 0, clippingPlanes: [clipPlane], clipShadows: true });
      if (set.skin) { mat.transparent = true; mat.opacity = 0.25; mat.depthWrite = false; }
      else if (setKey === 'musculos' && /fascia|sheath/.test(lower)) { mat.transparent = true; mat.opacity = 0.35; mat.depthWrite = false; }
      child.material = mat;
      child.geometry.translate(-fr.center.x, -fr.center.y, -fr.center.z);
      child.geometry.scale(fr.scale, fr.scale, fr.scale);
      child.geometry.computeVertexNormals();
      const side = sideOf(raw);
      const en = m.base.replace(/^(left|right)\s+/i, '');
      const pt = m.pt || (PT[en.toLowerCase()] ? PT[en.toLowerCase()].charAt(0).toUpperCase() + PT[en.toLowerCase()].slice(1) : null);
      const entry = { mesh: child, raw, set: setKey, side, en: en.charAt(0).toUpperCase() + en.slice(1), pt, la: m.la, ta2: m.ta2, def: m.def, path: m.path || [], variant: m.variant, base: mat.color.clone() };
      child.userData.entry = entry;
      child.visible = visibleSets[setKey] !== false;
      meshes.push(entry);
      fr.group.add(child);
    });
    attachPins(setKey);
  }

  function attachPins(setKey) {
    const hosts = meshes.filter(m => m.set === setKey);
    const boxes = hosts.map(h => { h.mesh.geometry.computeBoundingBox(); return h.mesh.geometry.boundingBox; });
    const toLocal = (p) => new THREE.Vector3((p[0] - fr.center.x) * fr.scale, (p[1] - fr.center.y) * fr.scale, (p[2] - fr.center.z) * fr.scale);
    const vol = (b) => { const sz = b.getSize(new THREE.Vector3()); return sz.x * sz.y * sz.z; };
    const nearest = (v) => { let best = null, bd = 1e9, bv = 1e9; boxes.forEach((b, i) => { const d = b.distanceToPoint(v); const inside = d < 0.004; if ((inside && (bd >= 0.004 || vol(b) < bv)) || (!inside && bd >= 0.004 && d < bd)) { bd = d; bv = vol(b); best = hosts[i]; } }); return [best, bd]; };
    const byName = {}; hosts.forEach(h => { const k = h.en.toLowerCase(); (byName[k] = byName[k] || []).push(h); });
    landmarks.filter(l => l.set === setKey).forEach(l => {
      const a = toLocal(l.a), b = toLocal(l.b);
      const [ha, da] = nearest(a), [hb, db] = nearest(b);
      let pos = da <= db ? a : b, host = da <= db ? ha : hb;
      const path = (l.path || []).slice().reverse();
      for (const folder of path) {
        const cands = byName[folder.toLowerCase().replace(/^\(|\)$/g, '')];
        if (cands && cands.length) {
          let best = cands[0], bd = 1e9;
          cands.forEach(c => { c.mesh.geometry.computeBoundingBox(); const d = c.mesh.geometry.boundingBox.distanceToPoint(pos); if (d < bd) { bd = d; best = c; } });
          host = best; break;
        }
      }
      if (!host || Math.min(da, db) > 0.15) return;
      const nearestVertex = (v) => { const pa = host.mesh.geometry.attributes.position; let bd = 1e9, bi = 0; for (let i = 0; i < pa.count; i++) { const dx = pa.getX(i) - v.x, dy = pa.getY(i) - v.y, dz = pa.getZ(i) - v.z; const d = dx * dx + dy * dy + dz * dz; if (d < bd) { bd = d; bi = i; } } return [Math.sqrt(bd), new THREE.Vector3(pa.getX(bi), pa.getY(bi), pa.getZ(bi))]; };
      const [sa, va] = nearestVertex(a), [sb, vb] = nearestVertex(b);
      if (Math.min(sa, sb) > 0.12) return;
      const tip = sa <= sb ? va : vb, head = sa <= sb ? b : a;
      const m = new THREE.Mesh(pinGeo, pinMat); m.position.copy(head); m.visible = false; m.renderOrder = 5;
      const tipMesh = new THREE.Mesh(tipGeo, tipMat); tipMesh.position.copy(tip); tipMesh.visible = false; tipMesh.renderOrder = 5;
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([tip, head]), lineMat); line.visible = false; line.renderOrder = 4;
      const data = { ...l, host, tip };
      m.userData.pin = data; tipMesh.userData.pin = data;
      pins.push({ mesh: m, tipMesh, line, data, host });
      host.pins = host.pins || []; host.pins.push(data);
      fr.group.add(m, tipMesh, line);
    });
  }
  function refreshPins() {
    pins.forEach(p => { const v = !!((allPins && visibleSets[p.data.set] !== false && p.host.mesh.visible) || (lmHost && p.host === lmHost)); p.mesh.visible = v; p.tipMesh.visible = v; p.line.visible = v; const sel = selectedPin === p.data; p.mesh.material = sel ? pinMatSel : pinMat; p.tipMesh.material = sel ? tipMatSel : tipMat; p.line.material = sel ? lineMatSel : lineMat; });
  }

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let downAt = null;
  renderer.domElement.addEventListener('pointerdown', (e) => { downAt = [e.clientX, e.clientY]; });
  renderer.domElement.addEventListener('click', (e) => {
    if (downAt) { const dx = e.clientX - downAt[0], dy = e.clientY - downAt[1]; downAt = null; if (dx * dx + dy * dy > 36) return; }
    const r = renderer.domElement.getBoundingClientRect();
    pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    pointer.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const visPins = pins.filter(p => p.mesh.visible).flatMap(p => [p.mesh, p.tipMesh]);
    const pinHit = raycaster.intersectObjects(visPins, false)[0];
    if (pinHit) { selectPin(pinHit.object.userData.pin); return; }
    const visible = meshes.filter(m => m.mesh.visible && !SETS[m.set].skin).map(m => m.mesh);
    const hits = raycaster.intersectObjects(visible, false);
    const hit = hits.find(h => clipPlane.distanceToPoint(h.point) >= 0);
    select(hit ? hit.object.userData.entry : null, { x: e.clientX - r.left, y: e.clientY - r.top });
  });

  // posição na tela do centro de uma estrutura (para o cartão flutuante)
  function screenPosOf(entry) {
    camera.updateMatrixWorld();
    const box = new THREE.Box3().setFromObject(entry.mesh);
    const c = box.getCenter(new THREE.Vector3()).project(camera);
    const r = renderer.domElement.getBoundingClientRect();
    return { x: (c.x + 1) / 2 * r.width, y: (1 - c.y) / 2 * r.height };
  }

  function select(entry, at) {
    if (selected) selected.mesh.material.color.copy(selected.base);
    selected = entry; selectedPin = null;
    if (selected && selected !== lmHost) selected.mesh.material.color.copy(HILITE);
    refreshPins();
    ui.onSelect(selected ? describe(selected) : null, selected ? (at || screenPosOf(selected)) : null);
  }
  function selectPin(data) {
    if (selected !== data.host) { if (selected) selected.mesh.material.color.copy(selected.base); selected = data.host; if (selected !== lmHost) selected.mesh.material.color.copy(HILITE); }
    selectedPin = data; refreshPins();
    ui.onSelect({ pin: true, en: data.name, pt: data.pt, la: data.la, ta2: data.ta2, def: data.def, variant: data.variant,
      hostName: data.host.pt || data.host.en, hostSide: data.host.side, set: SETS[data.set].label, path: data.path || [], pins: data.host.pins || [], entry: data.host });
  }
  function describe(e) {
    const sideLabel = e.side ? ` (${e.side})` : '';
    return {
      en: e.en + (e.side ? ` (${e.side === 'esquerdo' ? 'left' : 'right'})` : ''),
      pt: e.pt ? e.pt + sideLabel : null, la: e.la, ta2: e.ta2, def: e.def, path: e.path, variant: e.variant,
      set: SETS[e.set].label, pins: e.pins || [], entry: e,
    };
  }
  function focusOn(entry) {
    select(entry);
    const box = new THREE.Box3().setFromObject(entry.mesh);
    const c = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3()).length();
    const dir = camera.position.clone().sub(controls.target).normalize();
    controls.target.copy(c);
    camera.position.copy(c.clone().add(dir.multiplyScalar(Math.max(0.35, size * 2.2))));
    controls.update();
    ui.onSelect(describe(entry), screenPosOf(entry));
  }
  function applyVisibility() {
    meshes.forEach(m => { m.mesh.visible = lmHost ? (m === lmHost) : (visibleSets[m.set] !== false && (!isolated || m === selected) && !m.hiddenByTree && !m.hiddenByUser); });
    refreshPins();
  }

  return {
    SETS,
    async loadSet(key, onText) {
      if (loaded[key]) return;
      loaded[key] = true;
      await ensureMeta();
      const set = SETS[key];
      onText && onText(`Carregando ${set.label.toLowerCase()}…`);
      const g = await load(set.url, (ev) => ev.total && onText && onText(`${set.label} ${Math.round(ev.loaded / ev.total * 100)}%`));
      addModel(g, key);
      onText && onText('');
    },
    isLoaded(key) { return !!loaded[key]; },
    setVisible(key, on) { visibleSets[key] = on; applyVisibility(); },
    showBranch(setKey, pathPrefix) {
      isolated = false;
      meshes.forEach(m => { if (m.set !== setKey) return; m.hiddenByTree = pathPrefix.length > 0 && !pathPrefix.every((p, i) => m.path[i] === p); });
      applyVisibility();
    },
    clearBranch() { meshes.forEach(m => m.hiddenByTree = false); applyVisibility(); },
    tree(setKey) {
      const root = { name: SETS[setKey].label, children: {}, count: 0, items: [] };
      meshes.filter(m => m.set === setKey).forEach(m => {
        let node = root; node.count++;
        m.path.forEach(p => { node.children[p] = node.children[p] || { name: p, children: {}, count: 0, items: [] }; node = node.children[p]; node.count++; });
        node.items.push(m);
      });
      const sortItems = (n) => { n.items.sort((a, b) => (a.pt || a.en).localeCompare(b.pt || b.en, 'pt')); Object.values(n.children).forEach(sortItems); };
      sortItems(root);
      return root;
    },
    search(q) {
      q = q.toLowerCase().trim();
      if (q.length < 2) return [];
      const vis = meshes.filter(m => visibleSets[m.set] !== false);
      const score = (m) => {
        const en = m.en.toLowerCase(), pt = (m.pt || '').toLowerCase(), la = (m.la || '').toLowerCase();
        if (pt === q || en === q) return 0;
        if (pt.startsWith(q) || en.startsWith(q)) return 1;
        if (pt.includes(q) || en.includes(q) || la.includes(q)) return 2;
        return 9;
      };
      return vis.map(m => [score(m), m]).filter(x => x[0] < 9).sort((a, b) => a[0] - b[0]).slice(0, 40).map(x => x[1]);
    },
    focusOn,
    isolate() { if (!selected) return false; isolated = !isolated; applyVisibility(); return isolated; },
    isolated() { return isolated; },
    remove() {
      if (!selected) return;
      const e = selected; e.hiddenByUser = true; isolated = false;
      select(null); applyVisibility();
    },
    restoreHidden() { meshes.forEach(m => m.hiddenByUser = false); applyVisibility(); },
    hiddenCount() { return meshes.filter(m => m.hiddenByUser).length; },
    reset() {
      isolated = false; meshes.forEach(m => { m.hiddenByTree = false; m.hiddenByUser = false; }); applyVisibility(); select(null);
      controls.target.set(0, 0, 0); camera.position.set(0, 0.2, 4.2); clipPlane.constant = 10;
    },
    setClip(t) { clipPlane.constant = t >= 1 ? 10 : (t * 2 - 1) * 0.6; },
    setAllPins(on) { allPins = on; refreshPins(); },
    enterLandmarks(entry) {
      lmHost = entry; isolated = false;
      entry.mesh.material.color.copy(entry.base);
      selected = entry; selectedPin = null;
      applyVisibility();
      const box = new THREE.Box3().setFromObject(entry.mesh);
      const c = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3()).length();
      controls.target.copy(c);
      camera.position.copy(c.clone().add(new THREE.Vector3(0.15, 0.1, 1).normalize().multiplyScalar(Math.max(0.4, size * 1.8))));
      ui.onLandmarks && ui.onLandmarks(entry.pt || entry.en, entry.side);
      ui.onSelect(describe(entry));
    },
    exitLandmarks() {
      const h = lmHost; lmHost = null; selectedPin = null;
      if (h) h.mesh.material.color.copy(h.base);
      selected = null; applyVisibility();
      controls.target.set(0, 0, 0); camera.position.set(0, 0.2, 4.2);
      ui.onSelect(null); ui.onLandmarks && ui.onLandmarks(null);
    },
    inLandmarks() { return !!lmHost; },
    focusPin(data) {
      const p = pins.find(x => x.data === data); if (!p) return;
      selectPin(data);
      const dir = camera.position.clone().sub(controls.target).normalize();
      controls.target.copy(p.tipMesh.position);
      camera.position.copy(p.tipMesh.position.clone().add(dir.multiplyScalar(lmHost ? 0.3 : 0.45)));
    },
    pinCount() { return pins.length; },
    counts() { const c = {}; meshes.forEach(m => c[m.set] = (c[m.set] || 0) + 1); return c; },
  };
}

/* ============================== interface ============================== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (t) => String(t ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
const info = $('#info');

const viewer = createViewer($('#three'), {
  onLandmarks(name, side) {
    const bar = $('#lmBar');
    bar.hidden = !name;
    if (name) $('#lmName').textContent = name + (side ? ` (${side})` : '');
  },
  onSelect(d, at) {
    $('#isolate').disabled = !d;
    showPop(d, at);
    if (!d) { info.innerHTML = `<div class="info-empty">Toque numa estrutura do corpo, ou use a busca e a hierarquia.</div>`; return; }
    let h = `<div class="info"><div class="sys">${esc(d.set)}${d.pin ? ' · acidente ósseo' : ''}</div>`;
    h += `<h3>${esc(d.pt || d.en)}</h3><div class="sub">${[d.pt ? d.en : null, d.la].filter(Boolean).map(esc).join(' · ')}</div>`;
    h += `<div class="kv">`;
    if (d.pin) h += `<span>Pertence a</span><span>${esc(d.hostName)}${d.hostSide ? ' (' + d.hostSide + ')' : ''}</span>`;
    if (d.path && d.path.length) h += `<span>Hierarquia</span><span>${d.path.map(esc).join(' › ')}</span>`;
    if (d.ta2) h += `<span>TA2</span><span>${esc(d.ta2)}</span>`;
    if (d.variant) h += `<span>Nota</span><span>Variação anatômica: nem toda pessoa tem.</span>`;
    h += `</div>`;
    if (d.def) {
      const def = d.def.replace(/^[A-Z][A-Z\s\-,()]+\n+/, '').replace(/^\s*=+\s*([^=]+?)\s*=+\s*$/gm, '$1').replace(/\[Fig\.?\s*\d+\]/g, '').replace(/\n{3,}/g, '\n\n').trim();
      h += `<p class="def">${esc(def)}</p>`;
    }
    h += `<div class="links"><a href="https://en.wikipedia.org/wiki/${encodeURIComponent(d.en.replace(/\s\((left|right)\)$/, ''))}" target="_blank" rel="noopener">Wikipedia</a>${d.ta2 ? `<a href="https://ta2viewer.openanatomy.org/?id=${esc(d.ta2)}" target="_blank" rel="noopener">TA2 Viewer</a>` : ''}</div>`;
    if (!d.pt) h += `<p class="note">Sem nome em português na TA2 para este termo.</p>`;
    if (d.pins && d.pins.length && !d.pin && !viewer.inLandmarks()) h += `<button class="btn wide" id="btnLm">Ver acidentes ósseos (${d.pins.length})</button>`;
    if (d.pins && d.pins.length && viewer.inLandmarks()) {
      h += `<div class="sys" style="margin-top:8px">${d.pin ? 'Outros acidentes deste osso' : 'Acidentes ósseos'} (${d.pins.length})</div><div class="pinlist">` +
        d.pins.map((p, i) => `<button data-pin="${i}" class="${d.pin && p.name === d.en ? 'on' : ''}">${esc(p.pt || p.name)}</button>`).join('') + `</div>`;
    }
    h += `</div>`;
    info.innerHTML = h;
    const pinsRef = d.pins || [];
    $$('.pinlist button', info).forEach(b => b.addEventListener('click', () => viewer.focusPin(pinsRef[+b.dataset.pin])));
    const bl = $('#btnLm', info); if (bl) bl.addEventListener('click', () => viewer.enterLandmarks(d.entry));
    if (window.innerWidth <= 1000) info.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  },
});

// sistemas
const setsEl = $('#sets');
const DEFAULT_ON = ['esqueleto'];
Object.entries(SETS).forEach(([k, s]) => {
  const l = document.createElement('label');
  l.innerHTML = `<input type="checkbox" data-set="${k}" ${DEFAULT_ON.includes(k) ? 'checked' : ''}><i style="background:${s.color}"></i><span>${s.label}</span><small data-count="${k}">${s.size}</small>`;
  setsEl.appendChild(l);
});
function updateCounts() {
  const c = viewer.counts();
  Object.entries(c).forEach(([k, n]) => { const el = $(`small[data-count="${k}"]`); if (el) el.textContent = `${n}`; });
  const tot = Object.values(c).reduce((a, b) => a + b, 0);
  $('#total').textContent = tot ? `${tot} estruturas · ${viewer.pinCount()} acidentes` : '';
}
async function ensureSet(k) {
  const loaderEl = $('#loader'), txt = $('#loaderText');
  loaderEl.hidden = false;
  try { await viewer.loadSet(k, (t) => { txt.textContent = t; }); }
  catch (err) { txt.textContent = 'Erro ao carregar: ' + err.message; return; }
  loaderEl.hidden = true;
  updateCounts(); renderTreeSel();
}
setsEl.addEventListener('change', async (e) => {
  const k = e.target.dataset.set; if (!k) return;
  viewer.setVisible(k, e.target.checked);
  if (e.target.checked) await ensureSet(k); else renderTreeSel();
});

// cartão flutuante ao lado da estrutura clicada
const pop = $('#pop'), stage = $('.c3d-stage');
function showPop(d, at) {
  if (!d || !at || d.pin) { pop.hidden = true; return; }
  $('#popName', pop).textContent = d.pt || d.en;
  $('#popSub', pop).textContent = d.pt ? d.en : (d.la || '');
  $('#popIso', pop).textContent = viewer.isolated() ? 'Mostrar tudo' : 'Isolar';
  pop.hidden = false;
  const W = stage.clientWidth, H = stage.clientHeight, pw = pop.offsetWidth, ph = pop.offsetHeight;
  let x = at.x + 14, y = at.y - ph / 2;
  if (x + pw > W - 8) x = at.x - pw - 14;
  x = Math.max(8, x); y = Math.max(8, Math.min(H - ph - 8, y));
  pop.style.left = x + 'px'; pop.style.top = y + 'px';
}
$('#popIso').addEventListener('click', () => { const on = viewer.isolate(); $('#isolate').textContent = on ? 'Mostrar tudo' : 'Isolar seleção'; $('#popIso').textContent = on ? 'Mostrar tudo' : 'Isolar'; });
$('#popRem').addEventListener('click', () => { viewer.remove(); $('#isolate').textContent = 'Isolar seleção'; updateRestore(); });
$('#popClose').addEventListener('click', () => { pop.hidden = true; });
function updateRestore() { const n = viewer.hiddenCount(); const b = $('#restore'); b.hidden = n === 0; b.textContent = `Restaurar removidos (${n})`; }
$('#restore').addEventListener('click', () => { viewer.restoreHidden(); updateRestore(); });

// vista
$('#reset').addEventListener('click', () => { viewer.exitLandmarks(); viewer.reset(); $('#isolate').textContent = 'Isolar seleção'; $('#clip').value = 100; treePath = []; renderTree(); updateRestore(); });
$('#isolate').addEventListener('click', (e) => { const on = viewer.isolate(); e.target.textContent = on ? 'Mostrar tudo' : 'Isolar seleção'; $('#popIso').textContent = on ? 'Mostrar tudo' : 'Isolar'; });
$('#clip').addEventListener('input', (e) => viewer.setClip(e.target.value / 100));
$('#allPins').addEventListener('change', (e) => viewer.setAllPins(e.target.checked));
$('#lmBack').addEventListener('click', () => viewer.exitLandmarks());

// busca
const results = $('#results');
$('#search').addEventListener('input', (e) => {
  const list = viewer.search(e.target.value);
  results.innerHTML = list.map((m, i) => `<button data-i="${i}"><b>${esc(m.pt || m.en)}${m.side ? ' (' + m.side[0] + ')' : ''}</b><span>${esc(m.pt ? m.en : (m.la || ''))} · ${esc(SETS[m.set].label)}</span></button>`).join('');
  $$('button', results).forEach(b => b.addEventListener('click', () => { viewer.focusOn(list[+b.dataset.i]); results.innerHTML = ''; $('#search').value = ''; }));
});

// hierarquia
let treeSet = 'esqueleto', treePath = [];
const treeSel = $('#treeSet'), treeEl = $('#tree');
function renderTreeSel() {
  const loadedKeys = Object.keys(SETS).filter(k => viewer.isLoaded(k));
  treeSel.innerHTML = loadedKeys.map(k => `<option value="${k}" ${k === treeSet ? 'selected' : ''}>${SETS[k].label}</option>`).join('');
  if (!loadedKeys.includes(treeSet)) { treeSet = loadedKeys[0]; treePath = []; }
  renderTree();
}
function renderTree() {
  if (!treeSet) { treeEl.innerHTML = ''; return; }
  let node = viewer.tree(treeSet);
  treePath.forEach(p => { node = node.children[p] || node; });
  const crumbs = [`<button data-depth="0">${esc(SETS[treeSet].label)}</button>`, ...treePath.map((p, i) => `<button data-depth="${i + 1}">${esc(p)}</button>`)];
  const kids = Object.values(node.children).sort((a, b) => a.name.localeCompare(b.name, 'pt'));
  const items = node.items;
  treeEl.innerHTML = `<div class="crumbs">${crumbs.join(' › ')}</div>` +
    kids.map(k => `<button class="node" data-name="${esc(k.name)}"><span>${esc(k.name)}</span><small>${k.count} ›</small></button>`).join('') +
    (items.length ? `<div class="count">${items.length} estrutura(s) neste nível</div>` + items.map((m, i) => `<button class="leaf" data-i="${i}"><span>${esc(m.pt || m.en)}${m.side ? ` <small>(${m.side[0]})</small>` : ''}</span></button>`).join('') : '');
  $$('.crumbs button', treeEl).forEach(b => b.addEventListener('click', () => { treePath = treePath.slice(0, +b.dataset.depth); viewer.showBranch(treeSet, treePath); renderTree(); }));
  $$('.node', treeEl).forEach(b => b.addEventListener('click', () => { treePath = [...treePath, b.dataset.name]; viewer.showBranch(treeSet, treePath); renderTree(); }));
  $$('.leaf', treeEl).forEach(b => b.addEventListener('click', () => viewer.focusOn(items[+b.dataset.i])));
}
treeSel.addEventListener('change', () => { treeSet = treeSel.value; treePath = []; viewer.clearBranch(); renderTree(); });

// início
(async () => { for (const k of DEFAULT_ON) { viewer.setVisible(k, true); await ensureSet(k); } })();
