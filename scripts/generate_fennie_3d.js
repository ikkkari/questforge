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

function buildFennieModel() {
  const root = new THREE.Group();
  root.name = 'Fennie';

  // --- Materials ---
  const furOrange = new THREE.MeshStandardMaterial({
    color: 0xdf6222,
    roughness: 0.65,
    metalness: 0.05,
    name: 'Fur_Orange'
  });

  const furCream = new THREE.MeshStandardMaterial({
    color: 0xfff6ec,
    roughness: 0.75,
    metalness: 0.0,
    name: 'Fur_Cream'
  });

  const furDark = new THREE.MeshStandardMaterial({
    color: 0x2b1810,
    roughness: 0.55,
    metalness: 0.1,
    name: 'Fur_Dark'
  });

  const eyeDark = new THREE.MeshStandardMaterial({
    color: 0x181514,
    roughness: 0.2,
    metalness: 0.3,
    name: 'Eye_Dark'
  });

  const eyeIris = new THREE.MeshStandardMaterial({
    color: 0x38bdf8, // Wind / Cyan magical fantasy eyes
    roughness: 0.2,
    metalness: 0.2,
    emissive: 0x0ea5e9,
    emissiveIntensity: 0.35,
    name: 'Eye_Iris'
  });

  const eyeGloss = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    name: 'Eye_Gloss'
  });

  const windTeal = new THREE.MeshStandardMaterial({
    color: 0x2dd4bf,
    roughness: 0.3,
    metalness: 0.3,
    emissive: 0x14b8a6,
    emissiveIntensity: 0.4,
    name: 'Wind_Accent'
  });

  const goldAccent = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.35,
    metalness: 0.7,
    name: 'Gold_Accent'
  });

  // --- 1. BODY & CHEST ---
  const bodyGroup = new THREE.Group();
  bodyGroup.name = 'Body';
  bodyGroup.position.set(0, 0.45, 0);

  // Main torso
  const torsoGeo = new THREE.SphereGeometry(0.38, 20, 18);
  torsoGeo.scale(0.85, 1.15, 0.95);
  const torsoMesh = new THREE.Mesh(torsoGeo, furOrange);
  torsoMesh.castShadow = true;
  torsoMesh.receiveShadow = true;
  bodyGroup.add(torsoMesh);

  // Fluffy Chest Bib (Cream)
  const chestGeo = new THREE.SphereGeometry(0.32, 16, 16);
  chestGeo.scale(0.75, 1.0, 0.65);
  const chestMesh = new THREE.Mesh(chestGeo, furCream);
  chestMesh.position.set(0, 0.04, 0.22);
  bodyGroup.add(chestMesh);

  // Little wind pendant collar
  const collarGeo = new THREE.TorusGeometry(0.32, 0.035, 8, 24);
  collarGeo.rotateX(Math.PI / 2);
  const collarMesh = new THREE.Mesh(collarGeo, windTeal);
  collarMesh.position.set(0, 0.36, 0.05);
  bodyGroup.add(collarMesh);

  const pendantGeo = new THREE.OctahedronGeometry(0.065, 0);
  const pendantMesh = new THREE.Mesh(pendantGeo, goldAccent);
  pendantMesh.position.set(0, 0.32, 0.36);
  bodyGroup.add(pendantMesh);

  root.add(bodyGroup);

  // --- 2. HEAD & FACIAL FEATURES ---
  const headGroup = new THREE.Group();
  headGroup.name = 'Head';
  headGroup.position.set(0, 0.92, 0.12);

  // Main head sphere
  const craniumGeo = new THREE.SphereGeometry(0.42, 24, 20);
  craniumGeo.scale(1.08, 0.92, 1.0);
  const craniumMesh = new THREE.Mesh(craniumGeo, furOrange);
  craniumMesh.castShadow = true;
  headGroup.add(craniumMesh);

  // Cheek Fluffs (Left & Right)
  const cheekGeoL = new THREE.ConeGeometry(0.18, 0.35, 5);
  cheekGeoL.rotateZ(Math.PI / 2.8);
  cheekGeoL.rotateX(0.15);
  const cheekMeshL = new THREE.Mesh(cheekGeoL, furCream);
  cheekMeshL.position.set(-0.38, -0.12, 0.08);
  headGroup.add(cheekMeshL);

  const cheekGeoR = cheekGeoL.clone();
  cheekGeoR.rotateZ(-Math.PI / 1.4);
  const cheekMeshR = new THREE.Mesh(cheekGeoR, furCream);
  cheekMeshR.position.set(0.38, -0.12, 0.08);
  headGroup.add(cheekMeshR);

  // Snout (Muzzle)
  const snoutGeo = new THREE.ConeGeometry(0.22, 0.38, 16);
  snoutGeo.rotateX(Math.PI / 2);
  snoutGeo.scale(1.0, 0.75, 1.1);
  const snoutMesh = new THREE.Mesh(snoutGeo, furCream);
  snoutMesh.position.set(0, -0.1, 0.36);
  headGroup.add(snoutMesh);

  // Nose button
  const noseGeo = new THREE.SphereGeometry(0.055, 12, 12);
  noseGeo.scale(1.2, 0.8, 1.0);
  const noseMesh = new THREE.Mesh(noseGeo, furDark);
  noseMesh.position.set(0, -0.06, 0.56);
  headGroup.add(noseMesh);

  // Eyes (Left & Right)
  function createEye(isRight) {
    const eyeGroup = new THREE.Group();
    eyeGroup.name = isRight ? 'Eye_R' : 'Eye_L';
    const xMult = isRight ? 1 : -1;

    // Eye socket dark contour
    const backGeo = new THREE.SphereGeometry(0.11, 16, 16);
    backGeo.scale(0.85, 1.1, 0.35);
    const backMesh = new THREE.Mesh(backGeo, eyeDark);
    eyeGroup.add(backMesh);

    // Iris (Vibrant teal-blue fantasy glow)
    const irisGeo = new THREE.SphereGeometry(0.085, 16, 16);
    irisGeo.scale(0.8, 1.0, 0.3);
    const irisMesh = new THREE.Mesh(irisGeo, eyeIris);
    irisMesh.position.set(xMult * 0.015, -0.01, 0.04);
    eyeGroup.add(irisMesh);

    // Pupil
    const pupilGeo = new THREE.SphereGeometry(0.045, 12, 12);
    pupilGeo.scale(0.7, 0.9, 0.3);
    const pupilMesh = new THREE.Mesh(pupilGeo, eyeDark);
    pupilMesh.position.set(xMult * 0.015, -0.01, 0.07);
    eyeGroup.add(pupilMesh);

    // Specular Catchlights (2 glossy white highlights)
    const glint1 = new THREE.Mesh(new THREE.SphereGeometry(0.026, 8, 8), eyeGloss);
    glint1.position.set(xMult * 0.02 + 0.02, 0.03, 0.08);
    eyeGroup.add(glint1);

    const glint2 = new THREE.Mesh(new THREE.SphereGeometry(0.014, 8, 8), eyeGloss);
    glint2.position.set(xMult * 0.01 - 0.02, -0.03, 0.08);
    eyeGroup.add(glint2);

    eyeGroup.position.set(xMult * 0.22, 0.02, 0.32);
    eyeGroup.rotation.y = xMult * 0.35;
    eyeGroup.rotation.x = -0.08;
    return eyeGroup;
  }

  headGroup.add(createEye(false));
  headGroup.add(createEye(true));

  // Forehead Wind Rune Marking
  const runeGeo = new THREE.RingGeometry(0.02, 0.055, 6);
  runeGeo.rotateY(0);
  const runeMesh = new THREE.Mesh(runeGeo, windTeal);
  runeMesh.position.set(0, 0.22, 0.38);
  headGroup.add(runeMesh);

  // --- 3. EARS ---
  function createEar(isRight) {
    const earGroup = new THREE.Group();
    earGroup.name = isRight ? 'Ear_R' : 'Ear_L';
    const xMult = isRight ? 1 : -1;

    // Outer Ear
    const earGeo = new THREE.ConeGeometry(0.2, 0.52, 4);
    earGeo.scale(1.0, 1.0, 0.45);
    const earMesh = new THREE.Mesh(earGeo, furOrange);
    earMesh.castShadow = true;
    earGroup.add(earMesh);

    // Dark Tip
    const tipGeo = new THREE.ConeGeometry(0.12, 0.22, 4);
    tipGeo.scale(1.0, 1.0, 0.46);
    const tipMesh = new THREE.Mesh(tipGeo, furDark);
    tipMesh.position.set(0, 0.16, 0);
    earGroup.add(tipMesh);

    // Inner Ear Fluff (Cream)
    const innerGeo = new THREE.ConeGeometry(0.13, 0.35, 4);
    innerGeo.scale(0.85, 1.0, 0.25);
    const innerMesh = new THREE.Mesh(innerGeo, furCream);
    innerMesh.position.set(0, -0.04, 0.05);
    earGroup.add(innerMesh);

    earGroup.position.set(xMult * 0.28, 0.38, 0.04);
    earGroup.rotation.z = xMult * -0.38;
    earGroup.rotation.x = -0.15;
    earGroup.rotation.y = xMult * 0.22;
    return earGroup;
  }

  headGroup.add(createEar(false));
  headGroup.add(createEar(true));

  root.add(headGroup);

  // --- 4. LEGS & PAWS ---
  function createLeg(x, z, isBack) {
    const legGroup = new THREE.Group();
    legGroup.name = (x > 0 ? 'R_' : 'L_') + (isBack ? 'Hind' : 'Fore') + 'Leg';

    const height = isBack ? 0.38 : 0.42;
    const legGeo = new THREE.CylinderGeometry(0.085, 0.075, height, 12);
    const legMesh = new THREE.Mesh(legGeo, furOrange);
    legMesh.castShadow = true;
    legGroup.add(legMesh);

    // Dark Paw Sock
    const sockGeo = new THREE.CylinderGeometry(0.076, 0.078, height * 0.45, 12);
    const sockMesh = new THREE.Mesh(sockGeo, furDark);
    sockMesh.position.set(0, -height * 0.28, 0);
    legGroup.add(sockMesh);

    // Paw
    const pawGeo = new THREE.SphereGeometry(0.1, 12, 10);
    pawGeo.scale(1.0, 0.55, 1.25);
    const pawMesh = new THREE.Mesh(pawGeo, furDark);
    pawMesh.position.set(0, -height / 2, 0.04);
    legGroup.add(pawMesh);

    legGroup.position.set(x, height / 2, z);
    return legGroup;
  }

  root.add(createLeg(-0.2, 0.18, false));
  root.add(createLeg(0.2, 0.18, false));
  root.add(createLeg(-0.22, -0.16, true));
  root.add(createLeg(0.22, -0.16, true));

  // --- 5. BUSHY CURVED FOX TAIL ---
  const tailBase = new THREE.Group();
  tailBase.name = 'Tail';
  tailBase.position.set(0, 0.3, -0.28);

  // Base segment (orange)
  const t1Geo = new THREE.SphereGeometry(0.24, 16, 14);
  t1Geo.scale(0.85, 1.0, 1.2);
  const t1Mesh = new THREE.Mesh(t1Geo, furOrange);
  t1Mesh.position.set(0, 0, -0.14);
  t1Mesh.castShadow = true;
  tailBase.add(t1Mesh);

  // Mid segment (large bushy curve upward)
  const tailMid = new THREE.Group();
  tailMid.name = 'Tail_Mid';
  tailMid.position.set(0, 0.12, -0.32);

  const t2Geo = new THREE.SphereGeometry(0.34, 18, 16);
  t2Geo.scale(0.95, 1.35, 1.05);
  const t2Mesh = new THREE.Mesh(t2Geo, furOrange);
  t2Mesh.position.set(0, 0.18, -0.06);
  t2Mesh.rotation.x = -0.4;
  t2Mesh.castShadow = true;
  tailMid.add(t2Mesh);

  // Tip segment (distinctive fluffy white/cream tip)
  const tailTip = new THREE.Group();
  tailTip.name = 'Tail_Tip';
  tailTip.position.set(0, 0.44, -0.14);

  const t3Geo = new THREE.ConeGeometry(0.26, 0.52, 16);
  t3Geo.scale(0.9, 1.0, 0.9);
  t3Geo.rotateX(0.45);
  const t3Mesh = new THREE.Mesh(t3Geo, furCream);
  t3Mesh.position.set(0, 0.16, 0.08);
  t3Mesh.castShadow = true;
  tailTip.add(t3Mesh);

  tailMid.add(tailTip);
  tailBase.add(tailMid);
  root.add(tailBase);

  // --- 6. ANIMATION CLIPS ---
  // Clip 1: Idle Breathing & Tail Sway (2.5 seconds loop)
  const times = [0, 0.625, 1.25, 1.875, 2.5];

  // Body breathing scale track
  const bodyScaleTrack = new THREE.VectorKeyframeTrack(
    'Body.scale',
    times,
    [
      1.0, 1.0, 1.0,
      1.02, 1.04, 1.02,
      1.0, 1.0, 1.0,
      0.99, 0.98, 0.99,
      1.0, 1.0, 1.0
    ]
  );

  // Head subtle tilt track
  const headRotTrack = new THREE.QuaternionKeyframeTrack(
    'Head.quaternion',
    times,
    [
      0, 0, 0, 1,
      0.02, 0.03, 0.01, 0.999,
      0, 0, 0, 1,
      -0.02, -0.03, -0.01, 0.999,
      0, 0, 0, 1
    ]
  );

  // Tail gentle sway track
  const tailRotTrack = new THREE.QuaternionKeyframeTrack(
    'Tail.quaternion',
    times,
    [
      0, 0, 0, 1,
      0.02, 0.12, 0.04, 0.991,
      0, 0, 0, 1,
      -0.02, -0.12, -0.04, 0.991,
      0, 0, 0, 1
    ]
  );

  // Tail mid extra whip
  const tailMidTrack = new THREE.QuaternionKeyframeTrack(
    'Tail_Mid.quaternion',
    times,
    [
      0, 0, 0, 1,
      0.03, 0.08, 0.03, 0.993,
      0, 0, 0, 1,
      -0.03, -0.08, -0.03, 0.993,
      0, 0, 0, 1
    ]
  );

  const idleClip = new THREE.AnimationClip('idle', 2.5, [
    bodyScaleTrack,
    headRotTrack,
    tailRotTrack,
    tailMidTrack
  ]);

  // Clip 2: Playful Jump / Spin Reaction (1.2 seconds)
  const reactTimes = [0, 0.25, 0.5, 0.75, 1.0, 1.2];
  const rootPosTrack = new THREE.VectorKeyframeTrack(
    'Fennie.position',
    reactTimes,
    [
      0, 0, 0,
      0, 0.28, 0,
      0, 0.35, 0,
      0, 0.18, 0,
      0, 0, 0,
      0, 0, 0
    ]
  );

  // Full 360 degree joyful spin around Y
  const spinTrack = new THREE.QuaternionKeyframeTrack(
    'Fennie.quaternion',
    reactTimes,
    [
      0, 0, 0, 1,
      0, 0.7071, 0, 0.7071,     // 90 deg
      0, 1, 0, 0,               // 180 deg
      0, -0.7071, 0, 0.7071,    // 270 deg
      0, 0, 0, 1,               // 360 deg
      0, 0, 0, 1
    ]
  );

  const reactClip = new THREE.AnimationClip('react', 1.2, [
    rootPosTrack,
    spinTrack
  ]);

  return { root, animations: [idleClip, reactClip] };
}

// Export to GLB
const { root, animations } = buildFennieModel();
const exporter = new THREE.GLTFExporter();

exporter.parse(
  root,
  function (glbBuffer) {
    const outputPath = path.join(__dirname, '..', 'assets', 'models', 'fennie.glb');
    fs.writeFileSync(outputPath, Buffer.from(glbBuffer));
    console.log('Successfully generated ' + outputPath + ' (' + fs.statSync(outputPath).size + ' bytes)!');
  },
  {
    binary: true,
    animations: animations,
    embedImages: true
  }
);
