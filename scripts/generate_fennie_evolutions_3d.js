const fs = require('fs');
const path = require('path');

// Polyfills for Node environment
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
  return new Promise((resolve, reject) => {
    exporter.parse(
      root,
      function (glbBuffer) {
        const outputPath = path.join(__dirname, '..', 'assets', 'models', filename);
        fs.writeFileSync(outputPath, Buffer.from(glbBuffer));
        console.log('Successfully generated ' + filename + ' (' + fs.statSync(outputPath).size + ' bytes)!');
        resolve(outputPath);
      },
      {
        binary: true,
        animations: animations,
        embedImages: true
      }
    );
  });
}

// ====================================================
// FENNIE STAGE 2: GALE FENNIE
// Visual changes:
// - Larger, sleeker, more athletic fox frame (scale 1.18x)
// - Glowing aerodynamic wind-feather crests behind the ears
// - Dual sculpted bushy wind tails swaying gracefully in tandem
// - Golden wind torc collar with floating wind crystal
// - Glowing teal markings along flanks and front paws
// ====================================================
function buildGaleFennie() {
  const root = new THREE.Group();
  root.name = 'GaleFennie';

  const furOrange = new THREE.MeshStandardMaterial({ color: 0xe35b1c, roughness: 0.55, metalness: 0.1 });
  const furCream = new THREE.MeshStandardMaterial({ color: 0xfff8ee, roughness: 0.65 });
  const furDark = new THREE.MeshStandardMaterial({ color: 0x24140d, roughness: 0.45, metalness: 0.15 });
  const windCyan = new THREE.MeshStandardMaterial({
    color: 0x22d3ee,
    emissive: 0x06b6d4,
    emissiveIntensity: 0.45,
    roughness: 0.25,
    metalness: 0.3
  });
  const goldAccent = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3, metalness: 0.8 });
  const eyeIris = new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x0891b2, emissiveIntensity: 0.5, roughness: 0.2 });
  const eyeDark = new THREE.MeshBasicMaterial({ color: 0x111111 });
  const eyeGloss = new THREE.MeshBasicMaterial({ color: 0xffffff });

  // Body
  const body = new THREE.Group();
  body.name = 'Body';
  body.position.set(0, 0.48, 0);

  const torso = new THREE.Mesh(new THREE.SphereGeometry(0.42, 22, 20), furOrange);
  torso.scale.set(0.85, 1.2, 0.95);
  torso.castShadow = true;
  body.add(torso);

  // Sculpted Chest Fluff
  const chest = new THREE.Mesh(new THREE.ConeGeometry(0.32, 0.5, 12), furCream);
  chest.rotation.x = -Math.PI / 2.2;
  chest.position.set(0, 0.08, 0.26);
  body.add(chest);

  // Wind Torc Collar
  const torc = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.045, 8, 28), goldAccent);
  torc.rotation.x = Math.PI / 2;
  torc.position.set(0, 0.4, 0.06);
  body.add(torc);

  const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.09, 0), windCyan);
  crystal.position.set(0, 0.34, 0.42);
  body.add(crystal);

  // Flank Wind Feathers
  function createFlankWing(isRight) {
    const w = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.38, 4), windCyan);
    w.rotation.z = isRight ? -1.1 : 1.1;
    w.rotation.y = isRight ? 0.3 : -0.3;
    w.scale.set(1, 1, 0.15);
    w.position.set(isRight ? 0.36 : -0.36, 0.1, -0.05);
    return w;
  }
  body.add(createFlankWing(false));
  body.add(createFlankWing(true));

  // Head
  const head = new THREE.Group();
  head.name = 'Head';
  head.position.set(0, 1.02, 0.14);

  const cranium = new THREE.Mesh(new THREE.SphereGeometry(0.44, 24, 22), furOrange);
  cranium.scale.set(1.06, 0.94, 1.0);
  head.add(cranium);

  // Muzzle
  const muzzle = new THREE.Mesh(new THREE.ConeGeometry(0.23, 0.42, 16), furCream);
  muzzle.rotation.x = Math.PI / 2;
  muzzle.position.set(0, -0.09, 0.4);
  head.add(muzzle);

  // Nose
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), furDark);
  nose.position.set(0, -0.05, 0.62);
  head.add(nose);

  // Eyes with Wind Glow
  function createEye(isRight) {
    const eyeG = new THREE.Group();
    const x = isRight ? 0.23 : -0.23;

    const back = new THREE.Mesh(new THREE.SphereGeometry(0.115, 16, 16), furDark);
    back.scale.set(0.85, 1.15, 0.35);
    eyeG.add(back);

    const iris = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 16), eyeIris);
    iris.scale.set(0.8, 1.0, 0.3);
    iris.position.set(0, 0, 0.04);
    eyeG.add(iris);

    const glint1 = new THREE.Mesh(new THREE.SphereGeometry(0.028, 8, 8), eyeGloss);
    glint1.position.set(0.02, 0.03, 0.08);
    eyeG.add(glint1);

    eyeG.position.set(x, 0.03, 0.34);
    eyeG.rotation.y = isRight ? 0.35 : -0.35;
    return eyeG;
  }
  head.add(createEye(false));
  head.add(createEye(true));

  // Forehead Gale Crest
  const rune = new THREE.Mesh(new THREE.RingGeometry(0.03, 0.07, 8), windCyan);
  rune.position.set(0, 0.26, 0.4);
  head.add(rune);

  // Ears with Wind Feathers
  function createGaleEar(isRight) {
    const earG = new THREE.Group();
    const x = isRight ? 0.3 : -0.3;

    const outer = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.58, 4), furOrange);
    outer.scale.set(1.0, 1.0, 0.4);
    earG.add(outer);

    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.25, 4), furDark);
    tip.position.set(0, 0.18, 0);
    earG.add(tip);

    // Wind Feather Crest extending behind ear
    const windFeather = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.38, 4), windCyan);
    windFeather.rotation.x = -0.6;
    windFeather.position.set(0, 0.08, -0.15);
    earG.add(windFeather);

    earG.position.set(x, 0.42, 0.04);
    earG.rotation.z = isRight ? -0.35 : 0.35;
    earG.rotation.x = -0.15;
    return earG;
  }
  head.add(createGaleEar(false));
  head.add(createGaleEar(true));
  root.add(head);

  // 4 Athletic Legs
  function createLeg(x, z) {
    const legG = new THREE.Group();
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.46, 12), furOrange);
    legG.add(leg);

    const sock = new THREE.Mesh(new THREE.CylinderGeometry(0.082, 0.084, 0.2, 12), furDark);
    sock.position.set(0, -0.13, 0);
    legG.add(sock);

    const paw = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 10), furDark);
    paw.scale.set(1, 0.5, 1.25);
    paw.position.set(0, -0.23, 0.04);
    legG.add(paw);

    legG.position.set(x, 0.23, z);
    return legG;
  }
  root.add(createLeg(-0.21, 0.2));
  root.add(createLeg(0.21, 0.2));
  root.add(createLeg(-0.23, -0.18));
  root.add(createLeg(0.23, -0.18));

  // --- DUAL BUSHY WIND TAILS ---
  function createDualTail(isRight) {
    const tailG = new THREE.Group();
    tailG.name = isRight ? 'Tail_R' : 'Tail_L';
    const angleX = isRight ? 0.15 : -0.15;

    const t1 = new THREE.Mesh(new THREE.SphereGeometry(0.26, 16, 14), furOrange);
    t1.scale.set(0.85, 1.1, 1.25);
    t1.position.set(0, 0, -0.15);
    tailG.add(t1);

    const t2 = new THREE.Mesh(new THREE.SphereGeometry(0.34, 18, 16), furOrange);
    t2.scale.set(0.9, 1.35, 1.1);
    t2.position.set(isRight ? 0.08 : -0.08, 0.24, -0.32);
    tailG.add(t2);

    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.52, 16), furCream);
    tip.rotation.x = 0.5;
    tip.position.set(isRight ? 0.12 : -0.12, 0.55, -0.34);
    tailG.add(tip);

    // Cyan Wind Wisp
    const wisp = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.35, 8), windCyan);
    wisp.rotation.x = 0.6;
    wisp.position.set(isRight ? 0.15 : -0.15, 0.72, -0.32);
    tailG.add(wisp);

    tailG.position.set(isRight ? 0.14 : -0.14, 0.34, -0.3);
    tailG.rotation.y = isRight ? 0.25 : -0.25;
    return tailG;
  }
  root.add(createDualTail(false));
  root.add(createDualTail(true));
  root.add(body);

  // Animations (Dual Tail Sway & Proud Stance)
  const times = [0, 1.25, 2.5];
  const bodyTrack = new THREE.VectorKeyframeTrack('Body.scale', times, [1,1,1, 1.02,1.05,1.02, 1,1,1]);
  const tailL = new THREE.QuaternionKeyframeTrack('Tail_L.quaternion', times, [0,0,0,1, 0.05,0.15,0.05,0.98, 0,0,0,1]);
  const tailR = new THREE.QuaternionKeyframeTrack('Tail_R.quaternion', times, [0,0,0,1, -0.05,-0.15,-0.05,0.98, 0,0,0,1]);
  const idle = new THREE.AnimationClip('idle', 2.5, [bodyTrack, tailL, tailR]);

  const reactTimes = [0, 0.3, 0.6, 0.9, 1.2];
  const rootPos = new THREE.VectorKeyframeTrack('GaleFennie.position', reactTimes, [0,0,0, 0,0.32,0, 0,0.42,0, 0,0.18,0, 0,0,0]);
  const spinTrack = new THREE.QuaternionKeyframeTrack('GaleFennie.quaternion', reactTimes, [0,0,0,1, 0,0.707,0,0.707, 0,1,0,0, 0,-0.707,0,0.707, 0,0,0,1]);
  const react = new THREE.AnimationClip('react', 1.2, [rootPos, spinTrack]);

  return { root, animations: [idle, react] };
}

// ====================================================
// FENNIE STAGE 3: TEMPEST FENNIE (CELESTIAL KITSUNE)
// Visual changes:
// - Grand mythical kitsune physique (scale 1.35x)
// - TRIPLE majestic spirit tails crowned with cyan/gold celestial auras
// - Forehead radiant star-crown crest
// - Floating celestial wind vortex mantle surrounding the neck
// - Glowing crystalline paws and ears
// ====================================================
function buildTempestFennie() {
  const root = new THREE.Group();
  root.name = 'TempestFennie';

  const furGoldenOrange = new THREE.MeshStandardMaterial({
    color: 0xe65100,
    roughness: 0.45,
    metalness: 0.2,
    emissive: 0x9a3412,
    emissiveIntensity: 0.2
  });
  const furPureCream = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
  const furMidnight = new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.35, metalness: 0.3 });
  const celestialGold = new THREE.MeshStandardMaterial({
    color: 0xfef08a,
    emissive: 0xfacc15,
    emissiveIntensity: 0.6,
    roughness: 0.2,
    metalness: 0.5
  });
  const tempestTeal = new THREE.MeshStandardMaterial({
    color: 0x22d3ee,
    emissive: 0x06b6d4,
    emissiveIntensity: 0.65,
    roughness: 0.15,
    metalness: 0.4
  });

  // Body
  const body = new THREE.Group();
  body.name = 'Body';
  body.position.set(0, 0.54, 0);

  const torso = new THREE.Mesh(new THREE.SphereGeometry(0.48, 24, 22), furGoldenOrange);
  torso.scale.set(0.88, 1.22, 0.96);
  torso.castShadow = true;
  body.add(torso);

  // Celestial Chest Ruff
  const chest = new THREE.Mesh(new THREE.ConeGeometry(0.38, 0.58, 16), furPureCream);
  chest.rotation.x = -Math.PI / 2.1;
  chest.position.set(0, 0.1, 0.3);
  body.add(chest);

  // Floating Celestial Vortex Mantle
  const vortex = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.065, 8, 32), tempestTeal);
  vortex.rotation.x = Math.PI / 2.1;
  vortex.position.set(0, 0.46, 0.08);
  body.add(vortex);

  const orbGold = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 16), celestialGold);
  orbGold.position.set(0, 0.4, 0.52);
  body.add(orbGold);

  // Head
  const head = new THREE.Group();
  head.name = 'Head';
  head.position.set(0, 1.15, 0.16);

  const cranium = new THREE.Mesh(new THREE.SphereGeometry(0.48, 24, 24), furGoldenOrange);
  cranium.scale.set(1.05, 0.95, 1.0);
  head.add(cranium);

  // Snout
  const muzzle = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.45, 16), furPureCream);
  muzzle.rotation.x = Math.PI / 2;
  muzzle.position.set(0, -0.09, 0.44);
  head.add(muzzle);

  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.065, 12, 12), furMidnight);
  nose.position.set(0, -0.05, 0.68);
  head.add(nose);

  // Eyes (Celestial Star-Iris)
  function createEye(isRight) {
    const eyeG = new THREE.Group();
    const x = isRight ? 0.25 : -0.25;

    const back = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), furMidnight);
    back.scale.set(0.85, 1.15, 0.35);
    eyeG.add(back);

    const iris = new THREE.Mesh(new THREE.SphereGeometry(0.095, 16, 16), celestialGold);
    iris.scale.set(0.8, 1.0, 0.3);
    iris.position.set(0, 0, 0.04);
    eyeG.add(iris);

    const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 10), tempestTeal);
    pupil.position.set(0, 0, 0.07);
    eyeG.add(pupil);

    eyeG.position.set(x, 0.04, 0.36);
    eyeG.rotation.y = isRight ? 0.35 : -0.35;
    return eyeG;
  }
  head.add(createEye(false));
  head.add(createEye(true));

  // Crown Star Crest
  const starCrown = new THREE.Mesh(new THREE.OctahedronGeometry(0.12, 0), celestialGold);
  starCrown.position.set(0, 0.32, 0.44);
  head.add(starCrown);

  // Grand Kitsune Ears
  function createTempestEar(isRight) {
    const earG = new THREE.Group();
    const x = isRight ? 0.32 : -0.32;

    const outer = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.65, 4), furGoldenOrange);
    outer.scale.set(1.0, 1.0, 0.4);
    earG.add(outer);

    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.28, 4), celestialGold);
    tip.position.set(0, 0.22, 0);
    earG.add(tip);

    const feather = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.48, 4), tempestTeal);
    feather.rotation.x = -0.7;
    feather.position.set(0, 0.1, -0.18);
    earG.add(feather);

    earG.position.set(x, 0.46, 0.04);
    earG.rotation.z = isRight ? -0.38 : 0.38;
    earG.rotation.x = -0.18;
    return earG;
  }
  head.add(createTempestEar(false));
  head.add(createTempestEar(true));
  root.add(head);

  // 4 Legs with Crystalline Paws
  function createLeg(x, z) {
    const legG = new THREE.Group();
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.09, 0.52, 12), furGoldenOrange);
    legG.add(leg);

    const paw = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 10), tempestTeal);
    paw.scale.set(1, 0.5, 1.3);
    paw.position.set(0, -0.26, 0.04);
    legG.add(paw);

    legG.position.set(x, 0.26, z);
    return legG;
  }
  root.add(createLeg(-0.24, 0.22));
  root.add(createLeg(0.24, 0.22));
  root.add(createLeg(-0.26, -0.2));
  root.add(createLeg(0.26, -0.2));

  // --- TRIPLE CELESTIAL SPIRIT TAILS ---
  function createTripleTail(offsetAngle, name) {
    const tailG = new THREE.Group();
    tailG.name = name;

    const t1 = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 14), furGoldenOrange);
    t1.scale.set(0.85, 1.15, 1.3);
    t1.position.set(0, 0, -0.18);
    tailG.add(t1);

    const t2 = new THREE.Mesh(new THREE.SphereGeometry(0.38, 18, 16), furGoldenOrange);
    t2.scale.set(0.95, 1.45, 1.15);
    t2.position.set(0, 0.28, -0.36);
    tailG.add(t2);

    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.26, 0.6, 16), furPureCream);
    tip.rotation.x = 0.5;
    tip.position.set(0, 0.65, -0.38);
    tailG.add(tip);

    const aura = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.45, 8), tempestTeal);
    aura.rotation.x = 0.6;
    aura.position.set(0, 0.85, -0.35);
    tailG.add(aura);

    tailG.position.set(offsetAngle * 0.2, 0.38, -0.32);
    tailG.rotation.y = offsetAngle * 0.35;
    return tailG;
  }

  root.add(createTripleTail(-1, 'Tail_L'));
  root.add(createTripleTail(0, 'Tail_C'));
  root.add(createTripleTail(1, 'Tail_R'));
  root.add(body);

  // Animations (Triple Tail Swaying Celestial Symphony)
  const times = [0, 1.4, 2.8];
  const bodyTrack = new THREE.VectorKeyframeTrack('Body.scale', times, [1,1,1, 1.03,1.06,1.03, 1,1,1]);
  const tailL = new THREE.QuaternionKeyframeTrack('Tail_L.quaternion', times, [0,0,0,1, 0.05,0.2,0.05,0.97, 0,0,0,1]);
  const tailC = new THREE.QuaternionKeyframeTrack('Tail_C.quaternion', times, [0,0,0,1, 0.12,0,0,0.99, 0,0,0,1]);
  const tailR = new THREE.QuaternionKeyframeTrack('Tail_R.quaternion', times, [0,0,0,1, -0.05,-0.2,-0.05,0.97, 0,0,0,1]);
  const idle = new THREE.AnimationClip('idle', 2.8, [bodyTrack, tailL, tailC, tailR]);

  const reactTimes = [0, 0.3, 0.6, 0.9, 1.2];
  const rootPos = new THREE.VectorKeyframeTrack('TempestFennie.position', reactTimes, [0,0,0, 0,0.38,0, 0,0.5,0, 0,0.2,0, 0,0,0]);
  const spinTrack = new THREE.QuaternionKeyframeTrack('TempestFennie.quaternion', reactTimes, [0,0,0,1, 0,0.707,0,0.707, 0,1,0,0, 0,-0.707,0,0.707, 0,0,0,1]);
  const react = new THREE.AnimationClip('react', 1.2, [rootPos, spinTrack]);

  return { root, animations: [idle, react] };
}

// ----------------------------------------------------
// RUN ALL EXPORTS FOR FENNIE EVOLUTIONS
// ----------------------------------------------------
async function run() {
  console.log('Generating Fennie Evolution models...');

  const g = buildGaleFennie();
  await exportGLB(g.root, g.animations, 'fennie_stage2.glb');

  const t = buildTempestFennie();
  await exportGLB(t.root, t.animations, 'fennie_stage3.glb');

  console.log('Fennie Stage 2 (Gale) & Stage 3 (Tempest) models generated successfully!');
}

run().catch(err => {
  console.error('Error generating Fennie evolution models:', err);
  process.exit(1);
});
