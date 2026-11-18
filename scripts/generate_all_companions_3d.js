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

// ----------------------------------------------------
// 1. EMBER — Baby Dragon (Fire / Epic)
// ----------------------------------------------------
function buildEmber() {
  const root = new THREE.Group();
  root.name = 'Ember';

  const redMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.6, metalness: 0.1 });
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.5, metalness: 0.2 });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x292524, roughness: 0.4, metalness: 0.3 });
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xeab308, emissiveIntensity: 0.3, roughness: 0.2 });
  const pupilMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
  const flameMat = new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0xea580c, emissiveIntensity: 0.6, roughness: 0.3 });

  // Body
  const body = new THREE.Group();
  body.name = 'Body';
  body.position.set(0, 0.42, 0);

  const torso = new THREE.Mesh(new THREE.SphereGeometry(0.36, 20, 18), redMat);
  torso.scale.set(0.9, 1.1, 0.95);
  torso.castShadow = true;
  body.add(torso);

  // Belly plates
  const belly = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), goldMat);
  belly.scale.set(0.7, 0.95, 0.5);
  belly.position.set(0, -0.02, 0.22);
  body.add(belly);

  // Head
  const head = new THREE.Group();
  head.name = 'Head';
  head.position.set(0, 0.88, 0.12);

  const cranium = new THREE.Mesh(new THREE.SphereGeometry(0.38, 20, 18), redMat);
  cranium.scale.set(1.05, 0.92, 1.1);
  cranium.castShadow = true;
  head.add(cranium);

  // Snout
  const snout = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.28, 16), redMat);
  snout.rotation.x = Math.PI / 2;
  snout.position.set(0, -0.1, 0.38);
  head.add(snout);

  // Nostrils
  const nL = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 8), darkMat);
  nL.position.set(-0.06, -0.06, 0.52);
  const nR = nL.clone();
  nR.position.x = 0.06;
  head.add(nL);
  head.add(nR);

  // Horns
  function createHorn(isRight) {
    const x = isRight ? 0.2 : -0.2;
    const horn = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.36, 12), darkMat);
    horn.rotation.x = -0.55;
    horn.rotation.z = isRight ? -0.25 : 0.25;
    horn.position.set(x, 0.32, -0.08);
    horn.castShadow = true;
    return horn;
  }
  head.add(createHorn(false));
  head.add(createHorn(true));

  // Eyes
  function createEye(isRight) {
    const x = isRight ? 0.22 : -0.22;
    const eyeG = new THREE.Group();
    const eyeball = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), eyeMat);
    eyeball.scale.set(0.7, 1.0, 0.3);
    eyeG.add(eyeball);
    const pupil = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.12, 8), pupilMat);
    pupil.position.set(0, 0, 0.03);
    eyeG.add(pupil);
    eyeG.position.set(x, 0.02, 0.32);
    eyeG.rotation.y = isRight ? 0.4 : -0.4;
    return eyeG;
  }
  head.add(createEye(false));
  head.add(createEye(true));
  root.add(head);

  // Wings
  function createWing(isRight) {
    const wingG = new THREE.Group();
    wingG.name = isRight ? 'Wing_R' : 'Wing_L';
    const x = isRight ? 0.24 : -0.24;

    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.03, 0.35, 8), redMat);
    arm.rotation.z = isRight ? 1.0 : -1.0;
    arm.position.set(isRight ? 0.12 : -0.12, 0.1, 0);
    wingG.add(arm);

    const membrane = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.4, 3), goldMat);
    membrane.rotation.z = isRight ? -0.8 : 0.8;
    membrane.position.set(isRight ? 0.25 : -0.25, 0.06, -0.04);
    membrane.scale.set(1.0, 1.0, 0.05);
    wingG.add(membrane);

    wingG.position.set(x, 0.52, -0.18);
    return wingG;
  }
  root.add(createWing(false));
  root.add(createWing(true));

  // Legs
  function createLeg(x, z) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.36, 10), redMat);
    leg.position.set(x, 0.18, z);
    const paw = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 8), darkMat);
    paw.scale.set(1, 0.5, 1.3);
    paw.position.set(0, -0.18, 0.04);
    leg.add(paw);
    leg.castShadow = true;
    return leg;
  }
  root.add(createLeg(-0.2, 0.14));
  root.add(createLeg(0.2, 0.14));
  root.add(createLeg(-0.22, -0.14));
  root.add(createLeg(0.22, -0.14));

  // Tail with flame tip
  const tail = new THREE.Group();
  tail.name = 'Tail';
  tail.position.set(0, 0.3, -0.25);

  const tailSeg1 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.32, 10), redMat);
  tailSeg1.rotation.x = -1.1;
  tailSeg1.position.set(0, 0.06, -0.12);
  tail.add(tailSeg1);

  const flameTip = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.3, 8), flameMat);
  flameTip.rotation.x = 1.6;
  flameTip.position.set(0, 0.15, -0.32);
  tail.add(flameTip);

  root.add(tail);
  root.add(body);

  // Animations
  const times = [0, 1.0, 2.0];
  const bodyTrack = new THREE.VectorKeyframeTrack('Body.scale', times, [1,1,1, 1.03,1.05,1.03, 1,1,1]);
  const tailTrack = new THREE.QuaternionKeyframeTrack('Tail.quaternion', times, [0,0,0,1, 0,0.12,0,0.99, 0,0,0,1]);
  const wingLTrack = new THREE.QuaternionKeyframeTrack('Wing_L.quaternion', times, [0,0,0,1, 0.08,0,0.12,0.99, 0,0,0,1]);
  const wingRTrack = new THREE.QuaternionKeyframeTrack('Wing_R.quaternion', times, [0,0,0,1, -0.08,0,-0.12,0.99, 0,0,0,1]);
  const idle = new THREE.AnimationClip('idle', 2.0, [bodyTrack, tailTrack, wingLTrack, wingRTrack]);

  const reactTimes = [0, 0.3, 0.6, 0.9, 1.2];
  const rootPos = new THREE.VectorKeyframeTrack('Ember.position', reactTimes, [0,0,0, 0,0.25,0, 0,0.32,0, 0,0.1,0, 0,0,0]);
  const spinTrack = new THREE.QuaternionKeyframeTrack('Ember.quaternion', reactTimes, [0,0,0,1, 0,0.707,0,0.707, 0,1,0,0, 0,-0.707,0,0.707, 0,0,0,1]);
  const react = new THREE.AnimationClip('react', 1.2, [rootPos, spinTrack]);

  return { root, animations: [idle, react] };
}

// ----------------------------------------------------
// 2. LUMI — Frost Wolf (Water / Legendary)
// ----------------------------------------------------
function buildLumi() {
  const root = new THREE.Group();
  root.name = 'Lumi';

  const furWhite = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.6, metalness: 0.05 });
  const iceCyan = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.35, roughness: 0.3, metalness: 0.2 });
  const darkBlue = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5, metalness: 0.1 });
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0x67e8f9, emissive: 0x38bdf8, emissiveIntensity: 0.4, roughness: 0.2 });

  // Body
  const body = new THREE.Group();
  body.name = 'Body';
  body.position.set(0, 0.44, 0);

  const torso = new THREE.Mesh(new THREE.SphereGeometry(0.35, 20, 18), furWhite);
  torso.scale.set(0.85, 1.1, 1.0);
  torso.castShadow = true;
  body.add(torso);

  // Chest Ice Collar Fluff
  const chest = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.35, 8), iceCyan);
  chest.rotation.x = -Math.PI / 2;
  chest.position.set(0, 0.08, 0.22);
  body.add(chest);

  // Head
  const head = new THREE.Group();
  head.name = 'Head';
  head.position.set(0, 0.9, 0.14);

  const cranium = new THREE.Mesh(new THREE.SphereGeometry(0.38, 20, 18), furWhite);
  cranium.scale.set(1.05, 0.95, 1.0);
  head.add(cranium);

  // Muzzle
  const muzzle = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.36, 16), furWhite);
  muzzle.rotation.x = Math.PI / 2;
  muzzle.position.set(0, -0.08, 0.34);
  head.add(muzzle);

  // Wolf Nose
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 10), darkBlue);
  nose.position.set(0, -0.04, 0.52);
  head.add(nose);

  // Ears
  function createEar(isRight) {
    const earG = new THREE.Group();
    const x = isRight ? 0.24 : -0.24;
    const outer = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.45, 4), furWhite);
    earG.add(outer);
    const inner = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.3, 4), iceCyan);
    inner.position.set(0, -0.03, 0.04);
    earG.add(inner);
    earG.position.set(x, 0.36, 0);
    earG.rotation.z = isRight ? -0.25 : 0.25;
    earG.rotation.x = -0.1;
    return earG;
  }
  head.add(createEar(false));
  head.add(createEar(true));

  // Eyes
  function createEye(isRight) {
    const x = isRight ? 0.2 : -0.2;
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.09, 14, 14), eyeMat);
    eye.scale.set(0.7, 1.0, 0.3);
    eye.position.set(x, 0.04, 0.3);
    eye.rotation.y = isRight ? 0.35 : -0.35;
    return eye;
  }
  head.add(createEye(false));
  head.add(createEye(true));
  root.add(head);

  // 4 Legs
  function createLeg(x, z) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.07, 0.4, 10), furWhite);
    leg.position.set(x, 0.2, z);
    const paw = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 8), darkBlue);
    paw.scale.set(1, 0.5, 1.2);
    paw.position.set(0, -0.2, 0.03);
    leg.add(paw);
    leg.castShadow = true;
    return leg;
  }
  root.add(createLeg(-0.18, 0.16));
  root.add(createLeg(0.18, 0.16));
  root.add(createLeg(-0.2, -0.16));
  root.add(createLeg(0.2, -0.16));

  // Bushy Frost Tail
  const tail = new THREE.Group();
  tail.name = 'Tail';
  tail.position.set(0, 0.32, -0.28);

  const tBase = new THREE.Mesh(new THREE.SphereGeometry(0.22, 14, 14), furWhite);
  tBase.scale.set(0.8, 1.2, 1.0);
  tBase.position.set(0, 0.1, -0.15);
  tail.add(tBase);

  const tTip = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.4, 14), iceCyan);
  tTip.rotation.x = -0.5;
  tTip.position.set(0, 0.3, -0.22);
  tail.add(tTip);

  root.add(tail);
  root.add(body);

  // Animations
  const times = [0, 1.0, 2.0];
  const bodyTrack = new THREE.VectorKeyframeTrack('Body.scale', times, [1,1,1, 1.02,1.04,1.02, 1,1,1]);
  const tailTrack = new THREE.QuaternionKeyframeTrack('Tail.quaternion', times, [0,0,0,1, 0,0.18,0,0.98, 0,0,0,1]);
  const idle = new THREE.AnimationClip('idle', 2.0, [bodyTrack, tailTrack]);

  const reactTimes = [0, 0.3, 0.6, 0.9, 1.2];
  const rootPos = new THREE.VectorKeyframeTrack('Lumi.position', reactTimes, [0,0,0, 0,0.3,0, 0,0.36,0, 0,0.15,0, 0,0,0]);
  const spinTrack = new THREE.QuaternionKeyframeTrack('Lumi.quaternion', reactTimes, [0,0,0,1, 0,0.707,0,0.707, 0,1,0,0, 0,-0.707,0,0.707, 0,0,0,1]);
  const react = new THREE.AnimationClip('react', 1.2, [rootPos, spinTrack]);

  return { root, animations: [idle, react] };
}

// ----------------------------------------------------
// 3. SOLAS — Solar Phoenix (Light / Mythical)
// ----------------------------------------------------
function buildSolas() {
  const root = new THREE.Group();
  root.name = 'Solas';

  const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4, metalness: 0.2 });
  const redMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.4, metalness: 0.15, emissive: 0xe11d48, emissiveIntensity: 0.2 });
  const sunMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xfde047, emissiveIntensity: 0.5, roughness: 0.2 });
  const beakMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.3 });

  // Body
  const body = new THREE.Group();
  body.name = 'Body';
  body.position.set(0, 0.5, 0);

  const torso = new THREE.Mesh(new THREE.SphereGeometry(0.34, 20, 18), goldMat);
  torso.scale.set(0.9, 1.15, 0.9);
  torso.castShadow = true;
  body.add(torso);

  const breast = new THREE.Mesh(new THREE.SphereGeometry(0.26, 16, 16), sunMat);
  breast.scale.set(0.7, 0.9, 0.6);
  breast.position.set(0, 0.05, 0.2);
  body.add(breast);

  // Head
  const head = new THREE.Group();
  head.name = 'Head';
  head.position.set(0, 0.95, 0.08);

  const cranium = new THREE.Mesh(new THREE.SphereGeometry(0.32, 20, 18), goldMat);
  head.add(cranium);

  // Beak
  const beak = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.22, 12), beakMat);
  beak.rotation.x = Math.PI / 2.2;
  beak.position.set(0, -0.06, 0.32);
  head.add(beak);

  // Crown Crest (3 solar flame plumes)
  function createCrestPlume(angleZ, scale) {
    const plume = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.35 * scale, 6), sunMat);
    plume.rotation.z = angleZ;
    plume.rotation.x = -0.3;
    plume.position.set(angleZ * 0.15, 0.32, -0.06);
    return plume;
  }
  head.add(createCrestPlume(0, 1.2));
  head.add(createCrestPlume(-0.35, 0.9));
  head.add(createCrestPlume(0.35, 0.9));

  // Eyes
  function createEye(isRight) {
    const x = isRight ? 0.18 : -0.18;
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.075, 12, 12), sunMat);
    eye.scale.set(0.6, 1.0, 0.3);
    eye.position.set(x, 0.04, 0.24);
    eye.rotation.y = isRight ? 0.4 : -0.4;
    return eye;
  }
  head.add(createEye(false));
  head.add(createEye(true));
  root.add(head);

  // Phoenix Wings
  function createWing(isRight) {
    const wingG = new THREE.Group();
    wingG.name = isRight ? 'Wing_R' : 'Wing_L';
    const x = isRight ? 0.22 : -0.22;

    const main = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.7, 4), redMat);
    main.rotation.z = isRight ? -1.2 : 1.2;
    main.rotation.y = isRight ? -0.2 : 0.2;
    main.scale.set(1.0, 1.0, 0.08);
    wingG.add(main);

    const featherGold = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.5, 4), goldMat);
    featherGold.position.set(isRight ? -0.08 : 0.08, -0.1, 0.02);
    featherGold.scale.set(1.0, 1.0, 0.08);
    wingG.add(featherGold);

    wingG.position.set(x, 0.55, -0.05);
    return wingG;
  }
  root.add(createWing(false));
  root.add(createWing(true));

  // Triple Solar Ribbon Tail
  const tail = new THREE.Group();
  tail.name = 'Tail';
  tail.position.set(0, 0.35, -0.2);

  function createRibbon(angleZ) {
    const r = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.8, 6), redMat);
    r.rotation.x = -1.2;
    r.rotation.z = angleZ;
    r.scale.set(1, 1, 0.1);
    r.position.set(angleZ * 0.18, -0.25, -0.25);
    return r;
  }
  tail.add(createRibbon(0));
  tail.add(createRibbon(-0.3));
  tail.add(createRibbon(0.3));

  root.add(tail);
  root.add(body);

  // Animations (Majestic Phoenix Hover)
  const times = [0, 1.2, 2.4];
  const rootHover = new THREE.VectorKeyframeTrack('Solas.position', times, [0,0,0, 0,0.12,0, 0,0,0]);
  const wingL = new THREE.QuaternionKeyframeTrack('Wing_L.quaternion', times, [0,0,0,1, 0.1,0,0.15,0.98, 0,0,0,1]);
  const wingR = new THREE.QuaternionKeyframeTrack('Wing_R.quaternion', times, [0,0,0,1, -0.1,0,-0.15,0.98, 0,0,0,1]);
  const idle = new THREE.AnimationClip('idle', 2.4, [rootHover, wingL, wingR]);

  const reactTimes = [0, 0.3, 0.6, 0.9, 1.2];
  const rootPos = new THREE.VectorKeyframeTrack('Solas.position', reactTimes, [0,0,0, 0,0.35,0, 0,0.45,0, 0,0.2,0, 0,0,0]);
  const spinTrack = new THREE.QuaternionKeyframeTrack('Solas.quaternion', reactTimes, [0,0,0,1, 0,0.707,0,0.707, 0,1,0,0, 0,-0.707,0,0.707, 0,0,0,1]);
  const react = new THREE.AnimationClip('react', 1.2, [rootPos, spinTrack]);

  return { root, animations: [idle, react] };
}

// ----------------------------------------------------
// 4. MOSSY — Forest Spirit (Earth / Uncommon)
// ----------------------------------------------------
function buildMossy() {
  const root = new THREE.Group();
  root.name = 'Mossy';

  const mossGreen = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.7, metalness: 0.05 });
  const lightGreen = new THREE.MeshStandardMaterial({ color: 0x86efac, roughness: 0.6 });
  const flowerPink = new THREE.MeshStandardMaterial({ color: 0xf472b6, emissive: 0xdb2777, emissiveIntensity: 0.3, roughness: 0.4 });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.3 });

  // Body / Head (Sprout pear-shape)
  const body = new THREE.Group();
  body.name = 'Body';
  body.position.set(0, 0.45, 0);

  const main = new THREE.Mesh(new THREE.SphereGeometry(0.42, 22, 20), mossGreen);
  main.scale.set(0.95, 1.15, 0.95);
  main.castShadow = true;
  body.add(main);

  // Eyes
  function createEye(isRight) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), darkMat);
    eye.position.set(isRight ? 0.16 : -0.16, 0.08, 0.38);
    const glint = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    glint.position.set(0.02, 0.02, 0.06);
    eye.add(glint);
    return eye;
  }
  body.add(createEye(false));
  body.add(createEye(true));

  // Flower on Head
  const flowerG = new THREE.Group();
  flowerG.name = 'Flower';
  flowerG.position.set(0, 0.52, 0);

  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.15, 8), lightGreen);
  flowerG.add(stem);

  for (let i = 0; i < 5; i++) {
    const angle = (i * Math.PI * 2) / 5;
    const petal = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), flowerPink);
    petal.scale.set(0.6, 1.2, 0.4);
    petal.position.set(Math.cos(angle) * 0.09, 0.1, Math.sin(angle) * 0.09);
    petal.rotation.z = Math.cos(angle) * 0.4;
    flowerG.add(petal);
  }
  body.add(flowerG);

  // Leaf Arms
  function createLeafArm(isRight) {
    const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.32, 4), lightGreen);
    leaf.rotation.z = isRight ? -1.1 : 1.1;
    leaf.rotation.x = 0.2;
    leaf.scale.set(1, 1, 0.2);
    leaf.position.set(isRight ? 0.4 : -0.4, -0.05, 0.08);
    return leaf;
  }
  body.add(createLeafArm(false));
  body.add(createLeafArm(true));

  root.add(body);

  // Animations
  const times = [0, 1.1, 2.2];
  const sway = new THREE.QuaternionKeyframeTrack('Body.quaternion', times, [0,0,0,1, 0,0,0.06,0.998, 0,0,0,1]);
  const flowerBounce = new THREE.VectorKeyframeTrack('Flower.scale', times, [1,1,1, 1.15,1.15,1.15, 1,1,1]);
  const idle = new THREE.AnimationClip('idle', 2.2, [sway, flowerBounce]);

  const reactTimes = [0, 0.3, 0.6, 0.9, 1.2];
  const rootPos = new THREE.VectorKeyframeTrack('Mossy.position', reactTimes, [0,0,0, 0,0.28,0, 0,0.38,0, 0,0.15,0, 0,0,0]);
  const spinTrack = new THREE.QuaternionKeyframeTrack('Mossy.quaternion', reactTimes, [0,0,0,1, 0,0.707,0,0.707, 0,1,0,0, 0,-0.707,0,0.707, 0,0,0,1]);
  const react = new THREE.AnimationClip('react', 1.2, [rootPos, spinTrack]);

  return { root, animations: [idle, react] };
}

// ----------------------------------------------------
// 5. BOO — Ghost Spirit (Shadow / Epic)
// ----------------------------------------------------
function buildBoo() {
  const root = new THREE.Group();
  root.name = 'Boo';

  const ghostMat = new THREE.MeshStandardMaterial({
    color: 0xc084fc,
    emissive: 0x9333ea,
    emissiveIntensity: 0.3,
    roughness: 0.3,
    transparent: true,
    opacity: 0.9
  });
  const haloMat = new THREE.MeshStandardMaterial({ color: 0xfde047, emissive: 0xeab308, emissiveIntensity: 0.7, roughness: 0.2 });
  const darkMat = new THREE.MeshBasicMaterial({ color: 0x1e1b4b });

  // Floating Body
  const body = new THREE.Group();
  body.name = 'Body';
  body.position.set(0, 0.55, 0);

  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.38, 22, 20), ghostMat);
  dome.scale.set(1.0, 1.15, 0.95);
  dome.castShadow = true;
  body.add(dome);

  // Wisp Skirt
  const skirt = new THREE.Mesh(new THREE.ConeGeometry(0.4, 0.45, 16), ghostMat);
  skirt.rotation.x = Math.PI;
  skirt.position.set(0, -0.3, 0);
  body.add(skirt);

  // Large Cute Eyes
  function createEye(isRight) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.085, 14, 14), darkMat);
    eye.scale.set(0.8, 1.1, 0.3);
    eye.position.set(isRight ? 0.16 : -0.16, 0.08, 0.34);
    return eye;
  }
  body.add(createEye(false));
  body.add(createEye(true));

  // Stubby Ghost Hands
  function createHand(isRight) {
    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 10), ghostMat);
    hand.scale.set(1.2, 0.8, 0.8);
    hand.position.set(isRight ? 0.38 : -0.38, -0.05, 0.18);
    return hand;
  }
  body.add(createHand(false));
  body.add(createHand(true));

  // Starlight Halo
  const halo = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.03, 8, 24), haloMat);
  halo.rotation.x = Math.PI / 2.2;
  halo.position.set(0, 0.52, 0);
  body.add(halo);

  root.add(body);

  // Animations (Floating Ghost Bob)
  const times = [0, 1.2, 2.4];
  const bob = new THREE.VectorKeyframeTrack('Body.position', times, [0,0.55,0, 0,0.68,0, 0,0.55,0]);
  const sway = new THREE.QuaternionKeyframeTrack('Body.quaternion', times, [0,0,0,1, 0,0.08,0,0.996, 0,0,0,1]);
  const idle = new THREE.AnimationClip('idle', 2.4, [bob, sway]);

  const reactTimes = [0, 0.3, 0.6, 0.9, 1.2];
  const rootPos = new THREE.VectorKeyframeTrack('Boo.position', reactTimes, [0,0,0, 0,0.35,0, 0,0.48,0, 0,0.2,0, 0,0,0]);
  const spinTrack = new THREE.QuaternionKeyframeTrack('Boo.quaternion', reactTimes, [0,0,0,1, 0,0.707,0,0.707, 0,1,0,0, 0,-0.707,0,0.707, 0,0,0,1]);
  const react = new THREE.AnimationClip('react', 1.2, [rootPos, spinTrack]);

  return { root, animations: [idle, react] };
}

// ----------------------------------------------------
// 6. OLLIE — Magical Owl (Light / Rare)
// ----------------------------------------------------
function buildOllie() {
  const root = new THREE.Group();
  root.name = 'Ollie';

  const navyMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.6, metalness: 0.1 });
  const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.65 });
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xfde047, emissive: 0xeab308, emissiveIntensity: 0.4, roughness: 0.3 });
  const beakMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3 });
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.4, roughness: 0.2 });

  // Body
  const body = new THREE.Group();
  body.name = 'Body';
  body.position.set(0, 0.46, 0);

  const torso = new THREE.Mesh(new THREE.SphereGeometry(0.38, 22, 20), navyMat);
  torso.scale.set(0.95, 1.15, 0.95);
  torso.castShadow = true;
  body.add(torso);

  // White Belly
  const belly = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 16), whiteMat);
  belly.scale.set(0.8, 1.0, 0.5);
  belly.position.set(0, -0.04, 0.22);
  body.add(belly);

  // Beak
  const beak = new THREE.Mesh(new THREE.ConeGeometry(0.065, 0.18, 8), beakMat);
  beak.rotation.x = Math.PI / 2.3;
  beak.position.set(0, 0.1, 0.36);
  body.add(beak);

  // Large Owl Eyes
  function createEye(isRight) {
    const eyeG = new THREE.Group();
    const rim = new THREE.Mesh(new THREE.RingGeometry(0.08, 0.13, 16), whiteMat);
    rim.position.set(0, 0, 0.01);
    eyeG.add(rim);
    const eyeball = new THREE.Mesh(new THREE.SphereGeometry(0.085, 14, 14), eyeMat);
    eyeball.scale.set(0.8, 0.8, 0.3);
    eyeG.add(eyeball);
    eyeG.position.set(isRight ? 0.16 : -0.16, 0.18, 0.32);
    return eyeG;
  }
  body.add(createEye(false));
  body.add(createEye(true));

  // Crescent Moon Emblem
  const moon = new THREE.Mesh(new THREE.RingGeometry(0.04, 0.08, 16, 1, 0, Math.PI * 1.5), goldMat);
  moon.position.set(0, 0.38, 0.3);
  body.add(moon);

  // Wings (Folded)
  function createWing(isRight) {
    const wing = new THREE.Mesh(new THREE.SphereGeometry(0.25, 14, 14), navyMat);
    wing.scale.set(0.3, 1.2, 0.7);
    wing.position.set(isRight ? 0.34 : -0.34, 0.02, 0.05);
    wing.rotation.z = isRight ? -0.2 : 0.2;
    return wing;
  }
  body.add(createWing(false));
  body.add(createWing(true));

  root.add(body);

  // Animations (Curious Owl Head Tilt & Breathing)
  const times = [0, 1.2, 2.4];
  const tilt = new THREE.QuaternionKeyframeTrack('Body.quaternion', times, [0,0,0,1, 0,0,0.06,0.998, 0,0,0,1]);
  const idle = new THREE.AnimationClip('idle', 2.4, [tilt]);

  const reactTimes = [0, 0.3, 0.6, 0.9, 1.2];
  const rootPos = new THREE.VectorKeyframeTrack('Ollie.position', reactTimes, [0,0,0, 0,0.25,0, 0,0.35,0, 0,0.12,0, 0,0,0]);
  const spinTrack = new THREE.QuaternionKeyframeTrack('Ollie.quaternion', reactTimes, [0,0,0,1, 0,0.707,0,0.707, 0,1,0,0, 0,-0.707,0,0.707, 0,0,0,1]);
  const react = new THREE.AnimationClip('react', 1.2, [rootPos, spinTrack]);

  return { root, animations: [idle, react] };
}

// ----------------------------------------------------
// 7. ZEPHYR — Wind Sprite (Wind / Common)
// ----------------------------------------------------
function buildZephyr() {
  const root = new THREE.Group();
  root.name = 'Zephyr';

  const tealMat = new THREE.MeshStandardMaterial({ color: 0x14b8a6, roughness: 0.4, metalness: 0.2 });
  const cyanMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.35, roughness: 0.3 });
  const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf0fdfa, roughness: 0.5 });
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2 });

  // Floating Body
  const body = new THREE.Group();
  body.name = 'Body';
  body.position.set(0, 0.52, 0);

  const cranium = new THREE.Mesh(new THREE.SphereGeometry(0.34, 20, 18), tealMat);
  body.add(cranium);

  // Breeze Crest (Flowing wind hair)
  const crest = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.5, 8), cyanMat);
  crest.rotation.x = -1.1;
  crest.position.set(0, 0.22, -0.22);
  body.add(crest);

  // Eyes
  function createEye(isRight) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.065, 12, 12), eyeMat);
    eye.position.set(isRight ? 0.14 : -0.14, 0.04, 0.3);
    const shine = new THREE.Mesh(new THREE.SphereGeometry(0.02, 6, 6), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    shine.position.set(0.015, 0.015, 0.05);
    eye.add(shine);
    return eye;
  }
  body.add(createEye(false));
  body.add(createEye(true));

  // Glider Wings
  function createWing(isRight) {
    const wingG = new THREE.Group();
    wingG.name = isRight ? 'Wing_R' : 'Wing_L';
    const wing = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.55, 4), cyanMat);
    wing.rotation.z = isRight ? -1.2 : 1.2;
    wing.scale.set(1, 1, 0.1);
    wingG.add(wing);
    wingG.position.set(isRight ? 0.25 : -0.25, 0.05, -0.05);
    return wingG;
  }
  body.add(createWing(false));
  body.add(createWing(true));

  // Whirlwind Tail
  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.45, 12), whiteMat);
  tail.rotation.x = Math.PI;
  tail.position.set(0, -0.34, 0);
  body.add(tail);

  root.add(body);

  // Animations (Hover & Wing Flutter)
  const times = [0, 1.0, 2.0];
  const hover = new THREE.VectorKeyframeTrack('Body.position', times, [0,0.52,0, 0,0.64,0, 0,0.52,0]);
  const wingL = new THREE.QuaternionKeyframeTrack('Wing_L.quaternion', times, [0,0,0,1, 0,0,0.15,0.98, 0,0,0,1]);
  const wingR = new THREE.QuaternionKeyframeTrack('Wing_R.quaternion', times, [0,0,0,1, 0,0,-0.15,0.98, 0,0,0,1]);
  const idle = new THREE.AnimationClip('idle', 2.0, [hover, wingL, wingR]);

  const reactTimes = [0, 0.3, 0.6, 0.9, 1.2];
  const rootPos = new THREE.VectorKeyframeTrack('Zephyr.position', reactTimes, [0,0,0, 0,0.3,0, 0,0.4,0, 0,0.15,0, 0,0,0]);
  const spinTrack = new THREE.QuaternionKeyframeTrack('Zephyr.quaternion', reactTimes, [0,0,0,1, 0,0.707,0,0.707, 0,1,0,0, 0,-0.707,0,0.707, 0,0,0,1]);
  const react = new THREE.AnimationClip('react', 1.2, [rootPos, spinTrack]);

  return { root, animations: [idle, react] };
}

// ----------------------------------------------------
// RUN ALL EXPORTS
// ----------------------------------------------------
async function runAll() {
  console.log('Generating 3D models for all companions...');

  const e = buildEmber();
  await exportGLB(e.root, e.animations, 'ember.glb');

  const l = buildLumi();
  await exportGLB(l.root, l.animations, 'lumi.glb');

  const s = buildSolas();
  await exportGLB(s.root, s.animations, 'solas.glb');

  const m = buildMossy();
  await exportGLB(m.root, m.animations, 'mossy.glb');

  const b = buildBoo();
  await exportGLB(b.root, b.animations, 'boo.glb');

  const o = buildOllie();
  await exportGLB(o.root, o.animations, 'ollie.glb');

  const z = buildZephyr();
  await exportGLB(z.root, z.animations, 'zephyr.glb');

  console.log('All companion 3D models generated successfully!');
}

runAll().catch(err => {
  console.error('Error generating companion 3D models:', err);
  process.exit(1);
});
