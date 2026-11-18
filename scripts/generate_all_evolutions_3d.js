const fs = require('fs');
const path = require('path');

global.window = global;
global.FileReader = class FileReader {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then(buf => {
      this.result = buf;
      if (this.onloadend) this.onloadend();
    });
  }
};

global.THREE = require('../assets/vendor/three.min.js');
require('../assets/vendor/GLTFExporter.js');

const THREE = global.THREE;
const exporter = new THREE.GLTFExporter();

function exportGLB(root, animations, filename) {
  return new Promise((resolve) => {
    exporter.parse(
      root,
      function (glbBuffer) {
        const outputPath = path.join(__dirname, '..', 'assets', 'models', filename);
        fs.writeFileSync(outputPath, Buffer.from(glbBuffer));
        console.log('Successfully generated ' + filename + ' (' + fs.statSync(outputPath).size + ' bytes)!');
        resolve(outputPath);
      },
      { binary: true, animations: animations, embedImages: true }
    );
  });
}

// Simple helper to create animations
function makeAnim(name, isStage3) {
  const t = [0, 1.2, 2.4];
  const bScale = new THREE.VectorKeyframeTrack('Body.scale', t, [1,1,1, 1.03,1.06,1.03, 1,1,1]);
  const idle = new THREE.AnimationClip('idle', 2.4, [bScale]);

  const rt = [0, 0.3, 0.6, 0.9, 1.2];
  const rPos = new THREE.VectorKeyframeTrack(name + '.position', rt, [0,0,0, 0,0.35,0, 0,0.45,0, 0,0.18,0, 0,0,0]);
  const spin = new THREE.QuaternionKeyframeTrack(name + '.quaternion', rt, [0,0,0,1, 0,0.707,0,0.707, 0,1,0,0, 0,-0.707,0,0.707, 0,0,0,1]);
  const react = new THREE.AnimationClip('react', 1.2, [rPos, spin]);

  return [idle, react];
}

// 1. EMBER
function makeEmberStage(stageNum) {
  const root = new THREE.Group();
  root.name = 'Ember_S' + stageNum;
  const isS3 = stageNum === 3;
  const scale = isS3 ? 1.35 : 1.18;

  const redMat = new THREE.MeshStandardMaterial({ color: isS3 ? 0x991b1b : 0xdc2626, roughness: 0.5, metalness: 0.2 });
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4, metalness: 0.4, emissive: 0xb45309, emissiveIntensity: 0.3 });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.3, metalness: 0.4 });
  const flameMat = new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0xea580c, emissiveIntensity: isS3 ? 0.9 : 0.6 });

  const body = new THREE.Group();
  body.name = 'Body';
  body.position.set(0, 0.45 * scale, 0);

  const torso = new THREE.Mesh(new THREE.SphereGeometry(0.38 * scale, 20, 18), redMat);
  torso.scale.set(0.9, 1.15, 0.95);
  body.add(torso);

  const belly = new THREE.Mesh(new THREE.SphereGeometry(0.32 * scale, 16, 16), goldMat);
  belly.scale.set(0.7, 0.95, 0.5);
  belly.position.set(0, -0.02, 0.24 * scale);
  body.add(belly);

  // Armored scale ridges on S3
  if (isS3) {
    const armor = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.4, 0.08), darkMat);
    armor.position.set(0, 0.1, 0.34 * scale);
    body.add(armor);
  }

  // Head
  const head = new THREE.Group();
  head.name = 'Head';
  head.position.set(0, 0.92 * scale, 0.14 * scale);

  const cranium = new THREE.Mesh(new THREE.SphereGeometry(0.4 * scale, 20, 18), redMat);
  cranium.scale.set(1.05, 0.92, 1.1);
  head.add(cranium);

  // Snout
  const snout = new THREE.Mesh(new THREE.CylinderGeometry(0.19 * scale, 0.24 * scale, 0.3 * scale, 16), redMat);
  snout.rotation.x = Math.PI / 2;
  snout.position.set(0, -0.1, 0.4 * scale);
  head.add(snout);

  // Quad horns on S2/S3
  const hornCount = isS3 ? 4 : 3;
  for (let i = 0; i < hornCount; i++) {
    const h = new THREE.Mesh(new THREE.ConeGeometry(0.08 * scale, 0.45 * scale, 10), isS3 ? goldMat : darkMat);
    h.rotation.x = -0.6;
    h.position.set((i - (hornCount - 1) / 2) * 0.22, 0.34 * scale, -0.08 * scale);
    head.add(h);
  }

  // Large dragon wings
  function addWing(isRight) {
    const w = new THREE.Mesh(new THREE.ConeGeometry(0.32 * scale, 0.8 * scale, 4), isS3 ? flameMat : goldMat);
    w.rotation.z = isRight ? -1.2 : 1.2;
    w.rotation.y = isRight ? -0.2 : 0.2;
    w.scale.set(1, 1, 0.08);
    w.position.set(isRight ? 0.38 * scale : -0.38 * scale, 0.6 * scale, -0.15 * scale);
    root.add(w);
  }
  addWing(false);
  addWing(true);

  // Tail
  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.18 * scale, 0.65 * scale, 10), flameMat);
  tail.rotation.x = 1.6;
  tail.position.set(0, 0.25 * scale, -0.45 * scale);
  root.add(tail);

  root.add(head);
  root.add(body);
  return { root, animations: makeAnim('Ember_S' + stageNum, isS3) };
}

// 2. LUMI
function makeLumiStage(stageNum) {
  const root = new THREE.Group();
  root.name = 'Lumi_S' + stageNum;
  const isS3 = stageNum === 3;
  const scale = isS3 ? 1.35 : 1.18;

  const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 });
  const iceMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: isS3 ? 0.7 : 0.45, roughness: 0.2 });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4 });

  const body = new THREE.Group();
  body.name = 'Body';
  body.position.set(0, 0.45 * scale, 0);

  const torso = new THREE.Mesh(new THREE.SphereGeometry(0.4 * scale, 20, 18), whiteMat);
  torso.scale.set(0.85, 1.15, 1.0);
  body.add(torso);

  // Ice Pauldrons on shoulders
  const pL = new THREE.Mesh(new THREE.OctahedronGeometry(0.18 * scale, 0), iceMat);
  pL.position.set(-0.35 * scale, 0.2 * scale, 0.1 * scale);
  const pR = pL.clone();
  pR.position.x = 0.35 * scale;
  body.add(pL);
  body.add(pR);

  // Head with Antler Horns on S3
  const head = new THREE.Group();
  head.name = 'Head';
  head.position.set(0, 0.95 * scale, 0.15 * scale);

  const cranium = new THREE.Mesh(new THREE.SphereGeometry(0.42 * scale, 20, 18), whiteMat);
  head.add(cranium);

  const muzzle = new THREE.Mesh(new THREE.ConeGeometry(0.22 * scale, 0.4 * scale, 16), whiteMat);
  muzzle.rotation.x = Math.PI / 2;
  muzzle.position.set(0, -0.08, 0.38 * scale);
  head.add(muzzle);

  if (isS3) {
    // Fenrir Ice Horns
    const hL = new THREE.Mesh(new THREE.ConeGeometry(0.1 * scale, 0.5 * scale, 6), iceMat);
    hL.rotation.z = -0.4;
    hL.rotation.x = -0.3;
    hL.position.set(-0.25 * scale, 0.45 * scale, -0.05 * scale);
    const hR = hL.clone();
    hR.rotation.z = 0.4;
    hR.position.x = 0.25 * scale;
    head.add(hL);
    head.add(hR);
  }

  // Triple Tails on S3, Double on S2
  const tailCount = isS3 ? 3 : 2;
  for (let i = 0; i < tailCount; i++) {
    const t = new THREE.Mesh(new THREE.ConeGeometry(0.18 * scale, 0.65 * scale, 12), iceMat);
    t.rotation.x = -0.5;
    t.rotation.y = (i - (tailCount - 1) / 2) * 0.4;
    t.position.set((i - (tailCount - 1) / 2) * 0.22, 0.4 * scale, -0.35 * scale);
    root.add(t);
  }

  root.add(head);
  root.add(body);
  return { root, animations: makeAnim('Lumi_S' + stageNum, isS3) };
}

// 3. SOLAS
function makeSolasStage(stageNum) {
  const root = new THREE.Group();
  root.name = 'Solas_S' + stageNum;
  const isS3 = stageNum === 3;
  const scale = isS3 ? 1.35 : 1.18;

  const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3, metalness: 0.3 });
  const redMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, emissive: 0xe11d48, emissiveIntensity: isS3 ? 0.7 : 0.4 });
  const sunMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xfde047, emissiveIntensity: isS3 ? 0.9 : 0.6 });

  const body = new THREE.Group();
  body.name = 'Body';
  body.position.set(0, 0.52 * scale, 0);

  const torso = new THREE.Mesh(new THREE.SphereGeometry(0.38 * scale, 20, 18), goldMat);
  body.add(torso);

  // Coronal Halo
  const halo = new THREE.Mesh(new THREE.TorusGeometry(0.48 * scale, 0.045 * scale, 8, 32), sunMat);
  halo.position.set(0, 0.3 * scale, -0.1 * scale);
  body.add(halo);

  const head = new THREE.Group();
  head.name = 'Head';
  head.position.set(0, 0.98 * scale, 0.1 * scale);
  head.add(new THREE.Mesh(new THREE.SphereGeometry(0.34 * scale, 20, 18), goldMat));

  // Crest plumes
  for (let i = 0; i < (isS3 ? 5 : 4); i++) {
    const p = new THREE.Mesh(new THREE.ConeGeometry(0.08 * scale, 0.45 * scale, 6), sunMat);
    p.rotation.z = (i - 2) * 0.25;
    p.position.set((i - 2) * 0.12, 0.38 * scale, -0.05);
    head.add(p);
  }

  // Giant Wings
  function addWing(isRight) {
    const w = new THREE.Mesh(new THREE.ConeGeometry(0.35 * scale, 0.9 * scale, 4), redMat);
    w.rotation.z = isRight ? -1.3 : 1.3;
    w.scale.set(1, 1, 0.08);
    w.position.set(isRight ? 0.35 * scale : -0.35 * scale, 0.6 * scale, -0.1 * scale);
    root.add(w);
  }
  addWing(false);
  addWing(true);

  // 5 to 7 Tail Streamers
  const ribbonCount = isS3 ? 7 : 5;
  for (let i = 0; i < ribbonCount; i++) {
    const r = new THREE.Mesh(new THREE.ConeGeometry(0.09 * scale, 0.95 * scale, 6), isS3 ? sunMat : redMat);
    r.rotation.x = -1.2;
    r.rotation.z = (i - (ribbonCount - 1) / 2) * 0.22;
    r.scale.set(1, 1, 0.08);
    r.position.set((i - (ribbonCount - 1) / 2) * 0.15, 0.35 * scale, -0.4 * scale);
    root.add(r);
  }

  root.add(head);
  root.add(body);
  return { root, animations: makeAnim('Solas_S' + stageNum, isS3) };
}

// 4. MOSSY
function makeMossyStage(stageNum) {
  const root = new THREE.Group();
  root.name = 'Mossy_S' + stageNum;
  const isS3 = stageNum === 3;
  const scale = isS3 ? 1.35 : 1.18;

  const mossMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.65 });
  const lightMat = new THREE.MeshStandardMaterial({ color: 0x4ade80, roughness: 0.5 });
  const blossomMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, emissive: 0xdb2777, emissiveIntensity: isS3 ? 0.7 : 0.4 });
  const gemMat = new THREE.MeshStandardMaterial({ color: 0x34d399, emissive: 0x10b981, emissiveIntensity: 0.8 });

  const body = new THREE.Group();
  body.name = 'Body';
  body.position.set(0, 0.48 * scale, 0);

  const main = new THREE.Mesh(new THREE.SphereGeometry(0.45 * scale, 22, 20), mossMat);
  main.scale.set(0.95, 1.15, 0.95);
  body.add(main);

  // Flower crown atop head
  const crownCount = isS3 ? 3 : 2;
  for (let i = 0; i < crownCount; i++) {
    const f = new THREE.Mesh(new THREE.SphereGeometry(0.14 * scale, 12, 10), blossomMat);
    f.position.set((i - (crownCount - 1) / 2) * 0.25, 0.55 * scale, 0);
    body.add(f);
  }

  if (isS3) {
    const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.12 * scale, 0), gemMat);
    gem.position.set(0, 0.1, 0.46 * scale);
    body.add(gem);
  }

  root.add(body);
  return { root, animations: makeAnim('Mossy_S' + stageNum, isS3) };
}

// 5. BOO
function makeBooStage(stageNum) {
  const root = new THREE.Group();
  root.name = 'Boo_S' + stageNum;
  const isS3 = stageNum === 3;
  const scale = isS3 ? 1.35 : 1.18;

  const ghostMat = new THREE.MeshStandardMaterial({ color: isS3 ? 0x7e22ce : 0xa855f7, emissive: 0x6b21a8, emissiveIntensity: 0.4, transparent: true, opacity: 0.9 });
  const haloMat = new THREE.MeshStandardMaterial({ color: 0xfde047, emissive: 0xeab308, emissiveIntensity: 0.8 });

  const body = new THREE.Group();
  body.name = 'Body';
  body.position.set(0, 0.55 * scale, 0);

  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.42 * scale, 22, 20), ghostMat);
  dome.scale.set(1.0, 1.15, 0.95);
  body.add(dome);

  // Triple Ring Halo on S3
  const haloRings = isS3 ? 3 : 2;
  for (let i = 0; i < haloRings; i++) {
    const h = new THREE.Mesh(new THREE.TorusGeometry((0.26 + i * 0.08) * scale, 0.025 * scale, 8, 24), haloMat);
    h.rotation.x = Math.PI / 2.2;
    h.position.set(0, (0.54 + i * 0.12) * scale, 0);
    body.add(h);
  }

  root.add(body);
  return { root, animations: makeAnim('Boo_S' + stageNum, isS3) };
}

// 6. OLLIE
function makeOllieStage(stageNum) {
  const root = new THREE.Group();
  root.name = 'Ollie_S' + stageNum;
  const isS3 = stageNum === 3;
  const scale = isS3 ? 1.35 : 1.18;

  const navyMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 });
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xfde047, emissive: 0xeab308, emissiveIntensity: isS3 ? 0.8 : 0.5 });
  const starMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.7 });

  const body = new THREE.Group();
  body.name = 'Body';
  body.position.set(0, 0.48 * scale, 0);

  const torso = new THREE.Mesh(new THREE.SphereGeometry(0.42 * scale, 22, 20), navyMat);
  torso.scale.set(0.95, 1.15, 0.95);
  body.add(torso);

  // Grand Crest Moon
  const moon = new THREE.Mesh(new THREE.RingGeometry(0.06 * scale, 0.12 * scale, 16), goldMat);
  moon.position.set(0, 0.42 * scale, 0.32 * scale);
  body.add(moon);

  // Cosmic Archon Wings on S3
  function addWing(isRight) {
    const w = new THREE.Mesh(new THREE.ConeGeometry(0.28 * scale, 0.8 * scale, 4), isS3 ? starMat : navyMat);
    w.rotation.z = isRight ? -1.2 : 1.2;
    w.scale.set(1, 1, 0.08);
    w.position.set(isRight ? 0.38 * scale : -0.38 * scale, 0.1, 0);
    body.add(w);
  }
  addWing(false);
  addWing(true);

  root.add(body);
  return { root, animations: makeAnim('Ollie_S' + stageNum, isS3) };
}

// 7. ZEPHYR
function makeZephyrStage(stageNum) {
  const root = new THREE.Group();
  root.name = 'Zephyr_S' + stageNum;
  const isS3 = stageNum === 3;
  const scale = isS3 ? 1.35 : 1.18;

  const tealMat = new THREE.MeshStandardMaterial({ color: 0x0d9488, roughness: 0.4 });
  const cyanMat = new THREE.MeshStandardMaterial({ color: 0x22d3ee, emissive: 0x06b6d4, emissiveIntensity: isS3 ? 0.8 : 0.5 });

  const body = new THREE.Group();
  body.name = 'Body';
  body.position.set(0, 0.52 * scale, 0);

  const cranium = new THREE.Mesh(new THREE.SphereGeometry(0.38 * scale, 20, 18), tealMat);
  body.add(cranium);

  // Quad or Triple Glider Wings
  const wingPairs = isS3 ? 3 : 2;
  for (let i = 0; i < wingPairs; i++) {
    const wL = new THREE.Mesh(new THREE.ConeGeometry(0.18 * scale, (0.6 + i * 0.15) * scale, 4), cyanMat);
    wL.rotation.z = 1.1 + i * 0.2;
    wL.scale.set(1, 1, 0.1);
    wL.position.set(-0.3 * scale, 0.05 - i * 0.12, -0.05);
    const wR = wL.clone();
    wR.rotation.z = -wL.rotation.z;
    wR.position.x = 0.3 * scale;
    body.add(wL);
    body.add(wR);
  }

  root.add(body);
  return { root, animations: makeAnim('Zephyr_S' + stageNum, isS3) };
}

async function run() {
  console.log('Generating Stage 2 & Stage 3 for all other companions...');

  const comps = [
    { name: 'ember', fn: makeEmberStage },
    { name: 'lumi', fn: makeLumiStage },
    { name: 'solas', fn: makeSolasStage },
    { name: 'mossy', fn: makeMossyStage },
    { name: 'boo', fn: makeBooStage },
    { name: 'ollie', fn: makeOllieStage },
    { name: 'zephyr', fn: makeZephyrStage }
  ];

  for (const c of comps) {
    const s2 = c.fn(2);
    await exportGLB(s2.root, s2.animations, c.name + '_stage2.glb');

    const s3 = c.fn(3);
    await exportGLB(s3.root, s3.animations, c.name + '_stage3.glb');
  }

  console.log('ALL Evolution GLB models successfully generated!');
}

run().catch(console.error);
