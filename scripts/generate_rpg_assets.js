const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'assets', 'items');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const assets = {};

// 1. APPRENTICE SPELLBLADE (Common Weapon)
assets['apprentice_spellblade.svg'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <filter id="bladeGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <linearGradient id="bladeLight" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="35%" stop-color="#e0f2fe" />
      <stop offset="70%" stop-color="#94a3b8" />
      <stop offset="100%" stop-color="#475569" />
    </linearGradient>
    <linearGradient id="bladeDark" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#cbd5e1" />
      <stop offset="50%" stop-color="#475569" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
    <linearGradient id="runeRays" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0284c7" />
      <stop offset="50%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#bae6fd" />
    </linearGradient>
    <linearGradient id="crossguardSteel" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc" />
      <stop offset="40%" stop-color="#64748b" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
    <linearGradient id="goldHilt" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="50%" stop-color="#eab308" />
      <stop offset="100%" stop-color="#713f12" />
    </linearGradient>
    <radialGradient id="gemGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#e0f2fe" />
      <stop offset="40%" stop-color="#38bdf8" />
      <stop offset="85%" stop-color="#0369a1" />
      <stop offset="100%" stop-color="#0c4a6e" />
    </radialGradient>
    <radialGradient id="auraSoft" cx="60%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.35" />
      <stop offset="60%" stop-color="#0284c7" stop-opacity="0.1" />
      <stop offset="100%" stop-color="#0284c7" stop-opacity="0" />
    </radialGradient>
  </defs>

  <!-- Ambient magical aura -->
  <circle cx="70" cy="58" r="48" fill="url(#auraSoft)" />

  <!-- Blade Upper Bevel (Lit) -->
  <path d="M 46 82 L 109 19 Q 112 16 111 21 L 50 86 Z" fill="url(#bladeLight)" />
  
  <!-- Blade Lower Bevel (Shadow) -->
  <path d="M 50 86 L 111 21 Q 110 25 107 27 L 46 88 Z" fill="url(#bladeDark)" />
  
  <!-- Central Fuller & Arcane Conduit -->
  <path d="M 48 84 L 105 27" stroke="url(#runeRays)" stroke-width="2.5" stroke-linecap="round" filter="url(#bladeGlow)" />
  <path d="M 50 82 L 98 34" stroke="#ffffff" stroke-width="1" stroke-linecap="round" opacity="0.8" />
  
  <!-- Crossguard -->
  <path d="M 33 73 C 38 78, 48 84, 57 97 C 55 99, 52 98, 49 94 C 44 87, 36 82, 30 79 C 28 77, 30 72, 33 73 Z" fill="url(#crossguardSteel)" stroke="#1e293b" stroke-width="0.8" />
  <path d="M 57 73 C 52 78, 42 84, 33 97 C 35 99, 38 98, 41 94 C 46 87, 54 82, 60 79 C 62 77, 60 72, 57 73 Z" fill="url(#crossguardSteel)" stroke="#1e293b" stroke-width="0.8" />
  
  <!-- Crossguard Gold Mount -->
  <circle cx="45" cy="85" r="7" fill="url(#goldHilt)" stroke="#451a03" stroke-width="0.8" />
  
  <!-- Embedded Sapphire Gem -->
  <circle cx="45" cy="85" r="4.5" fill="url(#gemGlow)" stroke="#0284c7" stroke-width="0.5" filter="url(#bladeGlow)" />
  <circle cx="43.5" cy="83.5" r="1.2" fill="#ffffff" />
  
  <!-- Leather Wrapped Grip -->
  <path d="M 42 88 L 26 104 L 23 101 L 39 85 Z" fill="#451a03" />
  <!-- Wire wraps -->
  <line x1="39" y1="88" x2="42" y2="91" stroke="url(#goldHilt)" stroke-width="1.2" />
  <line x1="34" y1="93" x2="37" y2="96" stroke="url(#goldHilt)" stroke-width="1.2" />
  <line x1="29" y1="98" x2="32" y2="101" stroke="url(#goldHilt)" stroke-width="1.2" />
  <line x1="24" y1="103" x2="27" y2="106" stroke="url(#goldHilt)" stroke-width="1.2" />

  <!-- Pommel -->
  <circle cx="21" cy="107" r="5.5" fill="url(#crossguardSteel)" stroke="#0f172a" stroke-width="1" />
  <circle cx="21" cy="107" r="2.5" fill="url(#goldHilt)" />
  <circle cx="19.5" cy="105.5" r="1" fill="#ffffff" opacity="0.8" />

  <!-- Spark glints -->
  <path d="M 112 16 L 114 20 L 118 22 L 114 24 L 112 28 L 110 24 L 106 22 L 110 20 Z" fill="#e0f2fe" filter="url(#bladeGlow)" opacity="0.85" />
  <circle cx="86" cy="40" r="1.2" fill="#38bdf8" />
  <circle cx="95" cy="30" r="1.6" fill="#bae6fd" />
</svg>`;

// 2. SHADOWFANG DAGGER (Rare Weapon)
assets['shadow_dagger.svg'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <filter id="shadowMist" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="3.5" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <linearGradient id="obsidianBlade" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#475569" />
      <stop offset="40%" stop-color="#1e1b4b" />
      <stop offset="80%" stop-color="#090514" />
      <stop offset="100%" stop-color="#3b0764" />
    </linearGradient>
    <linearGradient id="purpleEdge" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f5d0fe" />
      <stop offset="45%" stop-color="#c084fc" />
      <stop offset="80%" stop-color="#7e22ce" />
      <stop offset="100%" stop-color="#3b0764" />
    </linearGradient>
    <linearGradient id="darkMetal" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#94a3b8" />
      <stop offset="50%" stop-color="#334155" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
    <radialGradient id="voidAura" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#a855f7" stop-opacity="0.35" />
      <stop offset="70%" stop-color="#581c87" stop-opacity="0.1" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>
  </defs>

  <!-- Ambient shadow aura -->
  <circle cx="68" cy="56" r="46" fill="url(#voidAura)" />

  <!-- Shadow Mist Trails -->
  <path d="M 60 70 Q 75 50 100 24 Q 108 16 112 20 Q 94 48 76 74 Z" fill="url(#purpleEdge)" opacity="0.35" filter="url(#shadowMist)" />

  <!-- Curved Blade Body -->
  <path d="M 44 80 Q 64 68 84 46 Q 98 30 110 18 C 104 28 92 46 76 66 Q 62 82 46 86 Z" fill="url(#obsidianBlade)" stroke="#581c87" stroke-width="0.8" />
  
  <!-- Serrated Curved Cutting Edge -->
  <path d="M 46 86 Q 62 82 76 66 C 92 46 104 28 110 18 C 102 34 88 56 70 76 Q 58 88 44 80 Z" fill="url(#purpleEdge)" />
  
  <!-- Spine Blood Groove & Runes -->
  <path d="M 48 78 Q 66 64 88 40 Q 98 28 104 22" fill="none" stroke="#e879f9" stroke-width="1.2" stroke-linecap="round" filter="url(#shadowMist)" />
  
  <!-- Serrated Jagged Hooks on back -->
  <path d="M 52 72 L 56 70 L 53 66 L 59 65 L 56 61 L 63 60" fill="none" stroke="#c084fc" stroke-width="1.5" />

  <!-- Dragon Wing Crossguard -->
  <path d="M 32 74 C 38 72 44 76 46 86 C 42 86 38 82 32 82 C 28 82 26 78 32 74 Z" fill="url(#darkMetal)" stroke="#1e1b4b" stroke-width="0.8" />
  <path d="M 44 86 C 46 94 42 100 38 102 C 38 98 42 94 42 88 Z" fill="url(#darkMetal)" stroke="#1e1b4b" stroke-width="0.8" />

  <!-- Amethyst Core Gem -->
  <polygon points="41,83 45,79 49,83 45,87" fill="#f0abfc" stroke="#86198f" stroke-width="0.8" filter="url(#shadowMist)" />

  <!-- Dagger Hilt & Wraps -->
  <path d="M 38 88 L 24 102 L 20 98 L 34 84 Z" fill="#0f172a" />
  <line x1="35" y1="87" x2="38" y2="90" stroke="#a855f7" stroke-width="1" />
  <line x1="30" y1="92" x2="33" y2="95" stroke="#a855f7" stroke-width="1" />
  <line x1="25" y1="97" x2="28" y2="100" stroke="#a855f7" stroke-width="1" />

  <!-- Curved Skull / Fang Pommel -->
  <path d="M 18 100 C 14 104 16 112 22 110 C 26 108 24 102 18 100 Z" fill="url(#darkMetal)" stroke="#581c87" stroke-width="0.8" />
  <circle cx="20" cy="105" r="1.5" fill="#f43f5e" />
</svg>`;

// 3. VOID REAVER BLADE (Epic Weapon)
assets['void_slayer.svg'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <filter id="voidGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="4" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <linearGradient id="cosmicVoid" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#020617" />
      <stop offset="30%" stop-color="#1e1b4b" />
      <stop offset="70%" stop-color="#4c1d95" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
    <linearGradient id="celestialGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="40%" stop-color="#fbbf24" />
      <stop offset="70%" stop-color="#b45309" />
      <stop offset="100%" stop-color="#451a03" />
    </linearGradient>
    <linearGradient id="riftNeon" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#6366f1" />
      <stop offset="50%" stop-color="#a855f7" />
      <stop offset="100%" stop-color="#f43f5e" />
    </linearGradient>
    <radialGradient id="novaCore" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="30%" stop-color="#e879f9" />
      <stop offset="70%" stop-color="#6366f1" />
      <stop offset="100%" stop-color="#1e1b4b" stop-opacity="0" />
    </radialGradient>
  </defs>

  <!-- Cosmic Singularity Halo -->
  <circle cx="70" cy="56" r="50" fill="url(#novaCore)" opacity="0.4" filter="url(#voidGlow)" />

  <!-- Greatsword Broad Blade Silhouette -->
  <path d="M 40 84 L 106 18 L 114 26 L 48 92 Z" fill="url(#cosmicVoid)" stroke="url(#celestialGold)" stroke-width="1.2" />

  <!-- Split Cleaving Blade Edges -->
  <path d="M 42 82 L 106 18 L 102 24 L 46 86 Z" fill="url(#riftNeon)" opacity="0.9" />
  <path d="M 46 88 L 108 26 L 114 26 L 50 90 Z" fill="#312e81" />

  <!-- Central Star-Forged Rift (Void Crack) -->
  <path d="M 46 84 Q 60 74 70 60 Q 82 52 92 38 L 106 20 Q 94 36 82 48 Q 72 62 48 86 Z" fill="url(#riftNeon)" filter="url(#voidGlow)" />
  <path d="M 54 78 Q 74 58 98 28" stroke="#ffffff" stroke-width="1.2" stroke-linecap="round" />

  <!-- Celestial Arcane Runes Along Fuller -->
  <circle cx="62" cy="70" r="1.5" fill="#fbcfe8" />
  <circle cx="74" cy="58" r="2" fill="#e0e7ff" />
  <circle cx="86" cy="46" r="2.2" fill="#ffffff" filter="url(#voidGlow)" />
  <circle cx="98" cy="34" r="1.8" fill="#fbcfe8" />

  <!-- Massive Solar Guard with Winged Filigree -->
  <path d="M 28 72 C 38 76 46 82 56 96 C 52 98 46 96 42 90 C 36 84 28 80 24 78 C 22 74 26 72 28 72 Z" fill="url(#celestialGold)" stroke="#451a03" stroke-width="1" />
  <path d="M 58 72 C 54 80 48 88 40 96 C 40 92 44 86 48 80 C 52 76 56 72 58 72 Z" fill="url(#celestialGold)" stroke="#451a03" stroke-width="1" />

  <!-- Floating Void Singularity at Guard -->
  <circle cx="44" cy="84" r="7" fill="#020617" stroke="url(#celestialGold)" stroke-width="1.2" />
  <circle cx="44" cy="84" r="4.5" fill="url(#riftNeon)" filter="url(#voidGlow)" />
  <circle cx="44" cy="84" r="1.5" fill="#ffffff" />

  <!-- Two-Handed Bastard Grip -->
  <path d="M 40 88 L 22 106 L 17 101 L 35 83 Z" fill="#18181b" />
  <line x1="37" y1="87" x2="41" y2="91" stroke="url(#celestialGold)" stroke-width="1.4" />
  <line x1="31" y1="93" x2="35" y2="97" stroke="url(#celestialGold)" stroke-width="1.4" />
  <line x1="25" y1="99" x2="29" y2="103" stroke="url(#celestialGold)" stroke-width="1.4" />

  <!-- Heavy Solar Pommel -->
  <polygon points="17,105 21,113 13,117 9,109" fill="url(#celestialGold)" stroke="#451a03" stroke-width="1" />
  <circle cx="15" cy="111" r="2" fill="#6366f1" />

  <!-- Stellar Sparks -->
  <path d="M 108 14 L 111 18 L 115 19 L 111 21 L 108 25 L 106 21 L 102 19 L 106 18 Z" fill="#ffffff" filter="url(#voidGlow)" />
</svg>`;

// 4. INITIATE ROBES (Common Armor)
assets['initiate_robes.svg'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <linearGradient id="robeFabric" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#312e81" />
      <stop offset="40%" stop-color="#1e1b4b" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
    <linearGradient id="silverTrim" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#94a3b8" />
      <stop offset="50%" stop-color="#f8fafc" />
      <stop offset="100%" stop-color="#cbd5e1" />
    </linearGradient>
    <linearGradient id="cowlShadow" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1e1b4b" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
    <linearGradient id="leatherBelt" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#78350f" />
      <stop offset="50%" stop-color="#92400e" />
      <stop offset="100%" stop-color="#451a03" />
    </linearGradient>
  </defs>

  <!-- Cowl Collar Backdrop -->
  <path d="M 44 26 C 54 22 74 22 84 26 L 88 40 C 78 46 50 46 40 40 Z" fill="url(#cowlShadow)" stroke="url(#silverTrim)" stroke-width="1" />

  <!-- Shoulder Mantle -->
  <path d="M 44 26 L 24 42 C 22 56 26 68 34 76 L 42 66 L 42 108 L 86 108 L 86 66 L 94 76 C 102 68 106 56 104 42 L 84 26 Z" fill="url(#robeFabric)" stroke="#1e1b4b" stroke-width="1.2" />

  <!-- Chest Lapel & Drapes -->
  <path d="M 46 36 L 64 68 L 82 36" fill="none" stroke="url(#silverTrim)" stroke-width="1.8" />
  <path d="M 52 38 L 64 62 L 76 38" fill="#1e1b4b" />

  <!-- Silver Arcane Sigil Embroidery on Chest -->
  <circle cx="64" cy="50" r="4.5" fill="none" stroke="url(#silverTrim)" stroke-width="1" />
  <path d="M 64 43 L 64 57 M 57 50 L 71 50" stroke="url(#silverTrim)" stroke-width="0.8" />

  <!-- Sturdy Leather Belt -->
  <rect x="40" y="74" width="48" height="8" rx="2" fill="url(#leatherBelt)" stroke="#451a03" stroke-width="0.8" />
  
  <!-- Silver Buckle -->
  <rect x="60" y="72" width="8" height="12" rx="1.5" fill="none" stroke="url(#silverTrim)" stroke-width="1.6" />
  <rect x="63" y="76" width="2" height="4" fill="url(#silverTrim)" />

  <!-- Hanging Belt Sash & Arcane Tassels -->
  <path d="M 54 82 L 52 106 L 58 106 L 60 82 Z" fill="#312e81" stroke="url(#silverTrim)" stroke-width="0.8" />
  
  <!-- Lower Skirt Fold Highlights -->
  <line x1="50" y1="84" x2="48" y2="108" stroke="#4338ca" stroke-width="1.2" opacity="0.6" />
  <line x1="78" y1="84" x2="80" y2="108" stroke="#4338ca" stroke-width="1.2" opacity="0.6" />

  <!-- Potion Vial on Belt Loop -->
  <rect x="74" y="76" width="5" height="10" rx="2" fill="#0284c7" stroke="url(#silverTrim)" stroke-width="0.6" />
  <circle cx="76.5" cy="82" r="1.2" fill="#bae6fd" />
</svg>`;

// 5. RUNIC BATTLEPLATE (Rare Armor)
assets['runic_mail.svg'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <filter id="runeCyanGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2.5" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <linearGradient id="plateSteel" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#94a3b8" />
      <stop offset="35%" stop-color="#475569" />
      <stop offset="80%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
    <linearGradient id="brassTrim" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fde047" />
      <stop offset="50%" stop-color="#ca8a04" />
      <stop offset="100%" stop-color="#713f12" />
    </linearGradient>
    <linearGradient id="cyanRune" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#a5f3fc" />
      <stop offset="50%" stop-color="#06b6d4" />
      <stop offset="100%" stop-color="#0891b2" />
    </linearGradient>
  </defs>

  <!-- Neck Gorget & Chainmail Collar -->
  <path d="M 48 24 C 58 20 70 20 80 24 L 84 34 L 44 34 Z" fill="#1e293b" stroke="url(#brassTrim)" stroke-width="1" />

  <!-- Pauldrons (Shoulder Guards) -->
  <path d="M 42 28 C 30 28 20 38 18 52 C 24 54 36 50 40 44 Z" fill="url(#plateSteel)" stroke="url(#brassTrim)" stroke-width="1.2" />
  <path d="M 86 28 C 98 28 108 38 110 52 C 104 54 92 50 88 44 Z" fill="url(#plateSteel)" stroke="url(#brassTrim)" stroke-width="1.2" />
  <!-- Pauldron Plate Layers -->
  <path d="M 18 52 C 20 62 26 68 32 70 C 34 62 38 56 40 52 Z" fill="#334155" stroke="#0f172a" stroke-width="0.8" />
  <path d="M 110 52 C 108 62 102 68 96 70 C 94 62 90 56 88 52 Z" fill="#334155" stroke="#0f172a" stroke-width="0.8" />

  <!-- Main Breastplate (Solid Steel Torso) -->
  <path d="M 44 34 L 84 34 L 92 68 C 92 84 80 96 64 104 C 48 96 36 84 36 68 Z" fill="url(#plateSteel)" stroke="#0f172a" stroke-width="1.4" />
  
  <!-- Center Ridge (Sternum Deflection Peak) -->
  <line x1="64" y1="34" x2="64" y2="98" stroke="#cbd5e1" stroke-width="1.8" stroke-linecap="round" />

  <!-- Runic Inscriptions on Left & Right Chest -->
  <path d="M 52 46 L 58 52 L 52 58 M 55 48 L 48 56" fill="none" stroke="url(#cyanRune)" stroke-width="1.8" stroke-linecap="round" filter="url(#runeCyanGlow)" />
  <path d="M 76 46 L 70 52 L 76 58 M 73 48 L 80 56" fill="none" stroke="url(#cyanRune)" stroke-width="1.8" stroke-linecap="round" filter="url(#runeCyanGlow)" />
  
  <!-- Core Ward Rune (Solar Diamond) -->
  <polygon points="64,62 70,68 64,74 58,68" fill="none" stroke="url(#cyanRune)" stroke-width="1.8" filter="url(#runeCyanGlow)" />
  <circle cx="64" cy="68" r="1.5" fill="#ffffff" />

  <!-- Abdominal Plaque Articulations -->
  <path d="M 44 78 Q 64 86 84 78" fill="none" stroke="url(#brassTrim)" stroke-width="1.2" />
  <path d="M 46 86 Q 64 94 82 86" fill="none" stroke="url(#brassTrim)" stroke-width="1.2" />
  <path d="M 50 94 Q 64 102 78 94" fill="none" stroke="url(#brassTrim)" stroke-width="1.2" />

  <!-- Rivets -->
  <circle cx="48" cy="38" r="1" fill="#fde047" />
  <circle cx="80" cy="38" r="1" fill="#fde047" />
  <circle cx="42" cy="66" r="1" fill="#fde047" />
  <circle cx="86" cy="66" r="1" fill="#fde047" />
</svg>`;

// 6. SCHOLAR'S CIRCLET (Common Helmet)
assets['scholars_circlet.svg'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <filter id="sapphireGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <linearGradient id="circletBrass" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#a16207" />
      <stop offset="30%" stop-color="#facc15" />
      <stop offset="70%" stop-color="#fef08a" />
      <stop offset="100%" stop-color="#854d0e" />
    </linearGradient>
    <radialGradient id="sapphireGem" cx="40%" cy="35%" r="60%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="30%" stop-color="#38bdf8" />
      <stop offset="75%" stop-color="#0284c7" />
      <stop offset="100%" stop-color="#0c4a6e" />
    </radialGradient>
  </defs>

  <!-- Ambient forehead shadow -->
  <ellipse cx="64" cy="74" rx="42" ry="14" fill="#0f172a" opacity="0.3" />

  <!-- Rear Arc of Crown -->
  <path d="M 28 62 C 40 50 88 50 100 62" fill="none" stroke="#713f12" stroke-width="3" stroke-linecap="round" />

  <!-- Main Front Diadem Band -->
  <path d="M 22 64 C 44 80 84 80 106 64 C 98 72 82 78 64 78 C 46 78 30 72 22 64 Z" fill="url(#circletBrass)" stroke="#713f12" stroke-width="0.8" />

  <!-- Upper Crown Crest & Filigree Leaves -->
  <path d="M 64 42 C 60 52 52 64 42 66 C 54 66 60 56 64 50 C 68 56 74 66 86 66 C 76 64 68 52 64 42 Z" fill="url(#circletBrass)" stroke="#854d0e" stroke-width="0.8" />
  
  <!-- Left Leaf Crest -->
  <path d="M 42 64 C 36 56 30 54 24 56 C 28 62 34 64 42 64 Z" fill="url(#circletBrass)" />
  <!-- Right Leaf Crest -->
  <path d="M 86 64 C 92 56 98 54 104 56 C 100 62 94 64 86 64 Z" fill="url(#circletBrass)" />

  <!-- Center Sapphire Setting (Teardrop) -->
  <polygon points="64,52 70,60 64,68 58,60" fill="url(#circletBrass)" stroke="#713f12" stroke-width="0.8" />
  
  <!-- Sapphire Gem -->
  <ellipse cx="64" cy="60" rx="5" ry="6.5" fill="url(#sapphireGem)" filter="url(#sapphireGlow)" />
  <ellipse cx="62.5" cy="58" rx="1.5" ry="2" fill="#ffffff" opacity="0.85" />

  <!-- Accent Temple Pearls -->
  <circle cx="38" cy="68" r="2.2" fill="url(#sapphireGem)" />
  <circle cx="90" cy="68" r="2.2" fill="url(#sapphireGem)" />

  <!-- Magic Sparkles -->
  <path d="M 64 36 L 65.5 39 L 68 40 L 65.5 41 L 64 44 L 62.5 41 L 60 40 L 62.5 39 Z" fill="#e0f2fe" filter="url(#sapphireGlow)" />
</svg>`;

// 7. CROWN OF THE ARCHMAGE (Epic Helmet)
assets['crown_of_clarity.svg'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <filter id="arcaneHalo" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="4.5" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <linearGradient id="platinumGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="30%" stop-color="#fef08a" />
      <stop offset="70%" stop-color="#eab308" />
      <stop offset="100%" stop-color="#713f12" />
    </linearGradient>
    <linearGradient id="voidCrystal" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="30%" stop-color="#d8b4fe" />
      <stop offset="70%" stop-color="#9333ea" />
      <stop offset="100%" stop-color="#3b0764" />
    </linearGradient>
    <radialGradient id="haloViolet" cx="50%" cy="40%" r="55%">
      <stop offset="0%" stop-color="#c084fc" stop-opacity="0.45" />
      <stop offset="60%" stop-color="#7e22ce" stop-opacity="0.15" />
      <stop offset="100%" stop-color="#1e1b4b" stop-opacity="0" />
    </radialGradient>
  </defs>

  <!-- Ambient Arcane Mana Halo -->
  <circle cx="64" cy="52" r="50" fill="url(#haloViolet)" filter="url(#arcaneHalo)" />

  <!-- Royal Velvet Cap Inset -->
  <path d="M 32 74 C 32 50 96 50 96 74 Z" fill="#3b0764" stroke="#581c87" stroke-width="1" />

  <!-- Base Crown Circlet -->
  <path d="M 22 72 C 44 86 84 86 106 72 L 108 80 C 84 94 44 94 20 80 Z" fill="url(#platinumGold)" stroke="#451a03" stroke-width="1.2" />

  <!-- Soaring Crown Spires -->
  <!-- Center Spire -->
  <path d="M 64 22 L 71 58 L 57 58 Z" fill="url(#platinumGold)" stroke="#713f12" stroke-width="0.8" />
  <!-- Mid Left Spire -->
  <path d="M 44 32 L 53 66 L 39 64 Z" fill="url(#platinumGold)" stroke="#713f12" stroke-width="0.8" />
  <!-- Mid Right Spire -->
  <path d="M 84 32 L 89 64 L 75 66 Z" fill="url(#platinumGold)" stroke="#713f12" stroke-width="0.8" />
  <!-- Outer Left Spire -->
  <path d="M 26 46 L 37 68 L 24 70 Z" fill="url(#platinumGold)" stroke="#713f12" stroke-width="0.8" />
  <!-- Outer Right Spire -->
  <path d="M 102 46 L 104 70 L 91 68 Z" fill="url(#platinumGold)" stroke="#713f12" stroke-width="0.8" />

  <!-- Interlocking Gothic Arches -->
  <path d="M 22 74 Q 44 60 64 72 Q 84 60 106 74" fill="none" stroke="url(#platinumGold)" stroke-width="2.5" />

  <!-- Floating Levitating Amethyst Crystals -->
  <polygon points="64,14 67,20 64,26 61,20" fill="url(#voidCrystal)" filter="url(#arcaneHalo)" />
  <polygon points="44,24 46.5,29 44,34 41.5,29" fill="url(#voidCrystal)" filter="url(#arcaneHalo)" />
  <polygon points="84,24 86.5,29 84,34 81.5,29" fill="url(#voidCrystal)" filter="url(#arcaneHalo)" />
  <polygon points="26,38 28.5,43 26,48 23.5,43" fill="url(#voidCrystal)" filter="url(#arcaneHalo)" />
  <polygon points="102,38 104.5,43 102,48 99.5,43" fill="url(#voidCrystal)" filter="url(#arcaneHalo)" />

  <!-- Crown Brow Huge Center Gem -->
  <polygon points="64,68 72,76 64,84 56,76" fill="url(#voidCrystal)" stroke="url(#platinumGold)" stroke-width="1.2" filter="url(#arcaneHalo)" />
  <circle cx="64" cy="76" r="2" fill="#ffffff" />

  <!-- Star chart lines on brow -->
  <line x1="42" y1="78" x2="54" y2="76" stroke="#e9d5ff" stroke-width="1" />
  <line x1="74" y1="76" x2="86" y2="78" stroke="#e9d5ff" stroke-width="1" />
  <circle cx="48" cy="77" r="1.5" fill="#fef08a" />
  <circle cx="80" cy="77" r="1.5" fill="#fef08a" />
</svg>`;

// 8. TRAVELER'S BOOTS (Common Boots)
assets['travelers_boots.svg'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <linearGradient id="leatherBrown" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#b45309" />
      <stop offset="40%" stop-color="#78350f" />
      <stop offset="85%" stop-color="#451a03" />
      <stop offset="100%" stop-color="#1c0b02" />
    </linearGradient>
    <linearGradient id="toeSteel" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#cbd5e1" />
      <stop offset="60%" stop-color="#475569" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
    <linearGradient id="soleIron" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#334155" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
  </defs>

  <!-- Left Boot (Behind) -->
  <g opacity="0.85" transform="translate(-10, -6)">
    <path d="M 48 36 L 68 36 L 66 70 L 80 84 L 84 96 L 44 96 L 46 70 Z" fill="#451a03" />
    <path d="M 44 96 L 86 96 L 86 102 L 44 102 Z" fill="url(#soleIron)" />
  </g>

  <!-- Right Boot (Front Prominent) -->
  <!-- Boot Leg Shaft -->
  <path d="M 52 32 C 54 28 76 28 80 32 L 80 72 C 86 76 96 82 104 88 C 108 92 108 98 104 102 L 54 102 C 50 94 50 82 50 72 Z" fill="url(#leatherBrown)" stroke="#1c0b02" stroke-width="1.2" />

  <!-- Turn-down Cuff at top -->
  <path d="M 48 30 C 56 26 78 26 84 30 L 82 42 C 76 38 56 38 50 42 Z" fill="#92400e" stroke="#451a03" stroke-width="1" />

  <!-- Reinforced Curved Shin Guard Plate -->
  <path d="M 56 46 C 64 44 72 44 78 46 L 76 68 C 70 70 62 70 56 68 Z" fill="url(#toeSteel)" stroke="#0f172a" stroke-width="0.8" />
  <line x1="66" y1="46" x2="66" y2="68" stroke="#f8fafc" stroke-width="1" opacity="0.6" />

  <!-- Buckles & Straps -->
  <rect x="52" y="52" width="28" height="4" rx="1" fill="#451a03" />
  <rect x="76" y="50" width="5" height="8" rx="1" fill="#eab308" stroke="#713f12" stroke-width="0.6" />
  <rect x="52" y="62" width="28" height="4" rx="1" fill="#451a03" />
  <rect x="76" y="60" width="5" height="8" rx="1" fill="#eab308" stroke="#713f12" stroke-width="0.6" />

  <!-- Steel Toe Cap -->
  <path d="M 88 84 C 98 84 108 90 106 100 L 82 100 C 82 92 84 86 88 84 Z" fill="url(#toeSteel)" stroke="#0f172a" stroke-width="1" />
  <circle cx="98" cy="92" r="1.2" fill="#ffffff" opacity="0.7" />

  <!-- Sturdy Lugged Sole with Tread Cleats -->
  <path d="M 50 102 L 108 102 L 108 110 L 50 110 Z" fill="url(#soleIron)" stroke="#0f172a" stroke-width="1" />
  <rect x="56" y="110" width="6" height="3" fill="#020617" />
  <rect x="70" y="110" width="6" height="3" fill="#020617" />
  <rect x="84" y="110" width="6" height="3" fill="#020617" />
  <rect x="98" y="110" width="6" height="3" fill="#020617" />
</svg>`;

// 9. STRIDERS OF THE WIND (Rare Boots)
assets['boots_of_the_wind.svg'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <filter id="windGlow" x="-25%" y="-25%" width="150%" height="150%">
      <feGaussianBlur stdDeviation="3.5" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <linearGradient id="mithrilSilver" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="40%" stop-color="#99f6e4" />
      <stop offset="80%" stop-color="#0f766e" />
      <stop offset="100%" stop-color="#134e4a" />
    </linearGradient>
    <linearGradient id="featherCyan" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="35%" stop-color="#5eead4" />
      <stop offset="85%" stop-color="#0d9488" />
      <stop offset="100%" stop-color="#115e59" />
    </linearGradient>
    <radialGradient id="cycloneAura" cx="60%" cy="50%" r="55%">
      <stop offset="0%" stop-color="#2dd4bf" stop-opacity="0.35" />
      <stop offset="70%" stop-color="#0f766e" stop-opacity="0.1" />
      <stop offset="100%" stop-color="#042f2e" stop-opacity="0" />
    </radialGradient>
  </defs>

  <!-- Ambient Zephyr Wind Swirls -->
  <circle cx="64" cy="64" r="48" fill="url(#cycloneAura)" filter="url(#windGlow)" />
  <path d="M 24 96 Q 44 80 80 84 Q 106 88 116 70" fill="none" stroke="#5eead4" stroke-width="1.4" opacity="0.5" stroke-linecap="round" />
  <path d="M 32 108 Q 60 98 94 104" fill="none" stroke="#99f6e4" stroke-width="1" opacity="0.4" stroke-linecap="round" />

  <!-- Left Boot (Back) -->
  <g opacity="0.8" transform="translate(-8, -6)">
    <path d="M 52 34 L 72 34 L 70 70 L 86 86 L 86 98 L 48 98 L 48 70 Z" fill="#134e4a" />
  </g>

  <!-- Hermes Feathered Wings on Heel -->
  <!-- Top Feather -->
  <path d="M 44 68 C 30 58 18 64 12 50 C 24 50 36 58 44 68 Z" fill="url(#featherCyan)" stroke="#0f766e" stroke-width="0.8" filter="url(#windGlow)" />
  <!-- Mid Feather -->
  <path d="M 42 74 C 26 68 16 76 10 64 C 22 66 34 72 42 74 Z" fill="url(#featherCyan)" stroke="#0f766e" stroke-width="0.8" filter="url(#windGlow)" />
  <!-- Lower Feather -->
  <path d="M 42 82 C 28 80 18 90 14 80 C 26 80 36 82 42 82 Z" fill="url(#featherCyan)" stroke="#0f766e" stroke-width="0.8" />

  <!-- Main Boot Chassis (Mithril Metal Plate) -->
  <path d="M 54 28 C 58 24 76 24 82 28 L 80 70 C 88 74 98 80 106 86 C 110 90 110 96 106 100 L 50 100 C 46 92 46 80 48 70 Z" fill="url(#mithrilSilver)" stroke="#042f2e" stroke-width="1.2" />

  <!-- Emerald Zephyr Speed Inscriptions -->
  <path d="M 66 38 L 72 46 L 64 54 L 70 62" fill="none" stroke="#2dd4bf" stroke-width="2" stroke-linecap="round" filter="url(#windGlow)" />
  <circle cx="68" cy="46" r="1.5" fill="#ffffff" />

  <!-- Streamlined Aerodynamic Shin Flutes -->
  <path d="M 58 34 L 56 68" stroke="#ffffff" stroke-width="1.2" opacity="0.6" />
  <path d="M 76 34 L 74 68" stroke="#ffffff" stroke-width="1.2" opacity="0.6" />

  <!-- Toe Bevel -->
  <path d="M 88 84 C 98 84 108 90 106 98 L 82 98 C 82 90 84 84 88 84 Z" fill="#99f6e4" stroke="#0f766e" stroke-width="1" />

  <!-- Glowing Soles -->
  <path d="M 48 100 L 108 100 L 108 106 L 48 106 Z" fill="#042f2e" stroke="#2dd4bf" stroke-width="1" />
  <line x1="52" y1="106" x2="104" y2="106" stroke="#5eead4" stroke-width="1.5" filter="url(#windGlow)" />
</svg>`;

// 10. RING OF CELESTIAL FOCUS (Rare Relic)
assets['ring_of_focus.svg'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <filter id="gemFlare" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="4" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <linearGradient id="ringGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="35%" stop-color="#fde047" />
      <stop offset="70%" stop-color="#ca8a04" />
      <stop offset="100%" stop-color="#713f12" />
    </linearGradient>
    <linearGradient id="ringSilver" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="40%" stop-color="#93c5fd" />
      <stop offset="85%" stop-color="#1e3a8a" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
    <radialGradient id="centerCrystal" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="25%" stop-color="#67e8f9" />
      <stop offset="65%" stop-color="#0284c7" />
      <stop offset="100%" stop-color="#1e1b4b" />
    </radialGradient>
    <radialGradient id="auraGold" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fde047" stop-opacity="0.35" />
      <stop offset="70%" stop-color="#ca8a04" stop-opacity="0.08" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>
  </defs>

  <!-- Ambient Glow -->
  <circle cx="64" cy="64" r="46" fill="url(#auraGold)" filter="url(#gemFlare)" />

  <!-- Rear Band Shadow -->
  <ellipse cx="64" cy="74" rx="34" ry="22" fill="none" stroke="#451a03" stroke-width="8" opacity="0.6" />

  <!-- Inner Band Hollow -->
  <ellipse cx="64" cy="76" rx="28" ry="18" fill="#090514" />

  <!-- Outer Intertwined Dual Band -->
  <!-- Platinum / Silver Moon Strand -->
  <path d="M 30 74 C 30 92 98 92 98 74" fill="none" stroke="url(#ringSilver)" stroke-width="6" stroke-linecap="round" />
  <!-- Solar Gold Strand -->
  <path d="M 32 70 C 32 94 96 94 96 70" fill="none" stroke="url(#ringGold)" stroke-width="5" stroke-linecap="round" />

  <!-- Crown Setting / Prongs -->
  <path d="M 44 48 L 52 56 L 64 52 L 76 56 L 84 48 L 78 62 L 50 62 Z" fill="url(#ringGold)" stroke="#451a03" stroke-width="1" />

  <!-- Faceted Oval Celestial Gemstone -->
  <ellipse cx="64" cy="46" rx="18" ry="14" fill="url(#centerCrystal)" stroke="#ffffff" stroke-width="0.8" filter="url(#gemFlare)" />

  <!-- Gem Facet Reflections -->
  <polygon points="64,36 76,46 64,56 52,46" fill="#a5f3fc" opacity="0.75" />
  <polygon points="64,36 72,40 64,46 56,40" fill="#ffffff" opacity="0.9" />
  <polygon points="52,46 64,46 58,54" fill="#0284c7" opacity="0.6" />
  <polygon points="76,46 64,46 70,54" fill="#0369a1" opacity="0.6" />

  <!-- Prongs Claws -->
  <circle cx="48" cy="40" r="2.5" fill="url(#ringGold)" />
  <circle cx="80" cy="40" r="2.5" fill="url(#ringGold)" />
  <circle cx="50" cy="54" r="2.5" fill="url(#ringGold)" />
  <circle cx="78" cy="54" r="2.5" fill="url(#ringGold)" />

  <!-- Four Orbiting Micro-Moons / Sparkles -->
  <circle cx="36" cy="40" r="2" fill="#fde047" filter="url(#gemFlare)" />
  <circle cx="92" cy="40" r="2" fill="#67e8f9" filter="url(#gemFlare)" />
  <circle cx="64" cy="24" r="2.5" fill="#ffffff" filter="url(#gemFlare)" />
  
  <path d="M 64 18 L 66 22 L 70 24 L 66 26 L 64 30 L 62 26 L 58 24 L 62 22 Z" fill="#ffffff" filter="url(#gemFlare)" />
</svg>`;

// 11. ELIXIR OF INSIGHT (Rare Consumable)
assets['minor_xp_elixir.svg'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <filter id="potionGlow" x="-25%" y="-25%" width="150%" height="150%">
      <feGaussianBlur stdDeviation="4" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <linearGradient id="azurePotion" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#bae6fd" />
      <stop offset="35%" stop-color="#38bdf8" />
      <stop offset="75%" stop-color="#0284c7" />
      <stop offset="100%" stop-color="#082f49" />
    </linearGradient>
    <linearGradient id="glassSpecular" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.8" />
      <stop offset="40%" stop-color="#ffffff" stop-opacity="0.1" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
    </linearGradient>
    <linearGradient id="brassFiligree" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fde047" />
      <stop offset="50%" stop-color="#ca8a04" />
      <stop offset="100%" stop-color="#713f12" />
    </linearGradient>
  </defs>

  <!-- Ambient Bioluminescent Blue Radiance -->
  <circle cx="64" cy="74" r="44" fill="#38bdf8" opacity="0.3" filter="url(#potionGlow)" />

  <!-- Flask Neck & Lip -->
  <ellipse cx="64" cy="34" rx="14" ry="4" fill="url(#brassFiligree)" stroke="#451a03" stroke-width="0.8" />
  <rect x="54" y="34" width="20" height="16" fill="url(#brassFiligree)" stroke="#451a03" stroke-width="0.8" />
  <ellipse cx="64" cy="50" rx="12" ry="3.5" fill="#1e293b" />

  <!-- Wood/Cork Stopper -->
  <path d="M 56 34 L 58 20 C 58 18 70 18 70 20 L 72 34 Z" fill="#92400e" stroke="#451a03" stroke-width="0.8" />
  <!-- Purple Wax Seal & Ribbon -->
  <circle cx="64" cy="22" r="5" fill="#a855f7" stroke="#581c87" stroke-width="0.6" />
  <path d="M 64 27 L 68 40 L 64 38 L 60 40 Z" fill="#a855f7" />

  <!-- Spherical Glass Body Silhouette -->
  <circle cx="64" cy="78" r="34" fill="#0c4a6e" stroke="url(#brassFiligree)" stroke-width="1.8" />

  <!-- Swirling Glowing Azure Liquid Mass -->
  <path d="M 32 82 C 32 102 96 102 96 82 C 86 86 76 78 64 80 C 52 82 42 78 32 82 Z" fill="url(#azurePotion)" filter="url(#potionGlow)" />
  <ellipse cx="64" cy="80" rx="32" ry="8" fill="url(#azurePotion)" opacity="0.8" />

  <!-- Bioluminescent Bubbles & Arcane Swirls -->
  <circle cx="52" cy="90" r="3" fill="#ffffff" filter="url(#potionGlow)" />
  <circle cx="72" cy="88" r="4.5" fill="#e0f2fe" filter="url(#potionGlow)" />
  <circle cx="62" cy="98" r="2.5" fill="#bae6fd" />
  <circle cx="80" cy="94" r="2" fill="#ffffff" />
  <circle cx="48" cy="82" r="1.8" fill="#ffffff" />

  <!-- Arcane Eye of Insight Sigil floating in potion -->
  <path d="M 52 78 Q 64 68 76 78 Q 64 88 52 78 Z" fill="none" stroke="#ffffff" stroke-width="1.2" filter="url(#potionGlow)" />
  <circle cx="64" cy="78" r="3" fill="#ffffff" />

  <!-- Glass Specular Reflection Curves -->
  <path d="M 38 62 C 34 70 34 82 40 92" fill="none" stroke="url(#glassSpecular)" stroke-width="4.5" stroke-linecap="round" />
  <circle cx="42" cy="56" r="2" fill="#ffffff" opacity="0.8" />
  <circle cx="88" cy="90" r="1.5" fill="#ffffff" opacity="0.4" />
</svg>`;

// 12. POUCH OF ANCIENT COINS (Common Consumable)
assets['pouch_of_gold.svg'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <filter id="goldGlint" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2.5" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <linearGradient id="velvetCrimson" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#be185d" />
      <stop offset="40%" stop-color="#881337" />
      <stop offset="85%" stop-color="#4c0519" />
      <stop offset="100%" stop-color="#1f0209" />
    </linearGradient>
    <linearGradient id="coinGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="25%" stop-color="#fef08a" />
      <stop offset="60%" stop-color="#eab308" />
      <stop offset="85%" stop-color="#a16207" />
      <stop offset="100%" stop-color="#451a03" />
    </linearGradient>
    <linearGradient id="goldCord" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="50%" stop-color="#eab308" />
      <stop offset="100%" stop-color="#713f12" />
    </linearGradient>
  </defs>

  <!-- Pouch Body (Plump heavy sack) -->
  <path d="M 44 48 C 30 54 22 72 22 88 C 22 106 38 116 64 116 C 90 116 106 106 106 88 C 106 72 98 54 84 48 Z" fill="url(#velvetCrimson)" stroke="#3f0713" stroke-width="1.4" />

  <!-- Velvet Folds & Shading -->
  <path d="M 46 54 Q 64 68 82 54 Q 64 78 46 54 Z" fill="#4c0519" opacity="0.6" />
  <path d="M 32 86 Q 44 104 64 106" fill="none" stroke="#be185d" stroke-width="2" opacity="0.4" />

  <!-- Ruffled Collar at Neck of Pouch -->
  <path d="M 40 48 C 36 36 44 32 48 44 C 54 32 62 32 64 44 C 68 32 76 32 80 44 C 84 32 92 36 88 48 Z" fill="url(#velvetCrimson)" stroke="#3f0713" stroke-width="1" />

  <!-- Spilling Ancient Gold Coins at Neck -->
  <ellipse cx="64" cy="40" rx="9" ry="6" fill="url(#coinGold)" stroke="#713f12" stroke-width="0.8" />
  <circle cx="64" cy="40" r="3" fill="none" stroke="#713f12" stroke-width="0.6" />

  <ellipse cx="54" cy="44" rx="8" ry="5.5" fill="url(#coinGold)" stroke="#713f12" stroke-width="0.8" transform="rotate(-15, 54, 44)" />
  <ellipse cx="74" cy="44" rx="8" ry="5.5" fill="url(#coinGold)" stroke="#713f12" stroke-width="0.8" transform="rotate(15, 74, 44)" />

  <!-- Twisted Golden Drawstring Cord -->
  <rect x="42" y="48" width="44" height="4.5" rx="2" fill="url(#goldCord)" stroke="#713f12" stroke-width="0.8" />
  
  <!-- Hanging Cord Ends & Tassels -->
  <path d="M 48 52 Q 44 64 42 74" fill="none" stroke="url(#goldCord)" stroke-width="2" />
  <polygon points="39,74 45,74 42,82" fill="url(#goldCord)" />

  <path d="M 52 52 Q 52 66 56 76" fill="none" stroke="url(#goldCord)" stroke-width="2" />
  <polygon points="53,76 59,76 56,84" fill="url(#goldCord)" />

  <!-- Coins Spilled at Base -->
  <ellipse cx="88" cy="104" rx="10" ry="6" fill="url(#coinGold)" stroke="#713f12" stroke-width="0.8" transform="rotate(20, 88, 104)" />
  <ellipse cx="98" cy="108" rx="8" ry="5" fill="url(#coinGold)" stroke="#713f12" stroke-width="0.8" transform="rotate(-10, 98, 108)" />

  <!-- Specular Sparkle Stars -->
  <path d="M 64 30 L 65.5 33 L 69 34 L 65.5 35 L 64 38 L 62.5 35 L 59 34 L 62.5 33 Z" fill="#ffffff" filter="url(#goldGlint)" />
  <path d="M 94 98 L 95 101 L 98 102 L 95 103 L 94 106 L 93 103 L 90 102 L 93 101 Z" fill="#ffffff" filter="url(#goldGlint)" />
</svg>`;

// 13. SHADOW IRON ORE (Common Material)
assets['iron_ore.svg'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <filter id="oreGlint" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2.5" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <linearGradient id="ironFacetLit" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="30%" stop-color="#94a3b8" />
      <stop offset="80%" stop-color="#475569" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
    <linearGradient id="ironFacetMid" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#64748b" />
      <stop offset="60%" stop-color="#334155" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
    <linearGradient id="ironFacetDark" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#334155" />
      <stop offset="70%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
    <linearGradient id="rawSilverVein" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc" />
      <stop offset="50%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
  </defs>

  <!-- Ambient Rock Base Shadow -->
  <polygon points="20,96 46,112 88,114 112,96 98,72 34,70" fill="#020617" opacity="0.7" />

  <!-- Primary Foreground Ore Cluster -->
  <!-- Top Main Crystal Face (Lit) -->
  <polygon points="56,22 84,34 76,64 42,54" fill="url(#ironFacetLit)" stroke="#0f172a" stroke-width="1" />
  
  <!-- Left Face (Mid Tone) -->
  <polygon points="56,22 42,54 24,68 34,40" fill="url(#ironFacetMid)" stroke="#0f172a" stroke-width="1" />

  <!-- Right Face (Shadow) -->
  <polygon points="84,34 104,50 94,80 76,64" fill="url(#ironFacetDark)" stroke="#0f172a" stroke-width="1" />

  <!-- Center Lower Front Facet -->
  <polygon points="42,54 76,64 68,98 32,88" fill="url(#ironFacetMid)" stroke="#0f172a" stroke-width="1" />

  <!-- Bottom Right Facet -->
  <polygon points="76,64 94,80 86,106 68,98" fill="url(#ironFacetDark)" stroke="#0f172a" stroke-width="1" />

  <!-- Bottom Left Outcropping -->
  <polygon points="34,40 24,68 18,92 32,88" fill="url(#ironFacetDark)" stroke="#0f172a" stroke-width="1" />

  <!-- Striated Raw Mithril/Silver Metallic Veins -->
  <path d="M 48 38 L 56 46 L 50 52 L 62 60 L 58 72" fill="none" stroke="url(#rawSilverVein)" stroke-width="2" stroke-linecap="round" />
  <path d="M 68 42 L 74 48 L 70 56" fill="none" stroke="#f1f5f9" stroke-width="1.5" stroke-linecap="round" />
  <path d="M 44 70 L 52 76 L 48 84" fill="none" stroke="url(#rawSilverVein)" stroke-width="1.8" />

  <!-- Specular Ridge Highlights -->
  <line x1="56" y1="22" x2="84" y2="34" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" />
  <line x1="56" y1="22" x2="42" y2="54" stroke="#ffffff" stroke-width="1.4" stroke-linecap="round" />
  <line x1="42" y1="54" x2="76" y2="64" stroke="#ffffff" stroke-width="1.2" stroke-linecap="round" />

  <!-- Glistening Star -->
  <path d="M 58 20 L 59.5 24 L 63 25 L 59.5 26 L 58 30 L 56.5 26 L 53 25 L 56.5 24 Z" fill="#ffffff" filter="url(#oreGlint)" />
  <circle cx="80" cy="32" r="1.5" fill="#ffffff" />
</svg>`;

// 14. ARCANE STAR DUST (Rare Material)
assets['arcane_dust.svg'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <filter id="dustNova" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="4.5" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <linearGradient id="cosmicDust" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="25%" stop-color="#a5f3fc" />
      <stop offset="55%" stop-color="#c084fc" />
      <stop offset="85%" stop-color="#ec4899" />
      <stop offset="100%" stop-color="#3b0764" />
    </linearGradient>
    <radialGradient id="nebulaCore" cx="50%" cy="55%" r="50%">
      <stop offset="0%" stop-color="#e879f9" stop-opacity="0.6" />
      <stop offset="50%" stop-color="#818cf8" stop-opacity="0.3" />
      <stop offset="80%" stop-color="#06b6d4" stop-opacity="0.1" />
      <stop offset="100%" stop-color="#020617" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="glassBowl" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.7" />
      <stop offset="60%" stop-color="#93c5fd" stop-opacity="0.2" />
      <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.5" />
    </linearGradient>
  </defs>

  <!-- Swirling Nebula Cloud -->
  <circle cx="64" cy="62" r="48" fill="url(#nebulaCore)" filter="url(#dustNova)" />

  <!-- Crystal Glass Offering Bowl -->
  <ellipse cx="64" cy="88" rx="36" ry="14" fill="#090d16" stroke="url(#glassBowl)" stroke-width="1.8" />
  <path d="M 28 88 C 28 106 100 106 100 88" fill="none" stroke="url(#glassBowl)" stroke-width="1.8" />

  <!-- Heaped Shimmering Stardust Powder inside Bowl -->
  <ellipse cx="64" cy="84" rx="32" ry="11" fill="url(#cosmicDust)" filter="url(#dustNova)" />

  <!-- Rising Orbiting Star Particles and Constellation Lines -->
  <line x1="38" y1="62" x2="52" y2="44" stroke="#c084fc" stroke-width="0.8" stroke-dasharray="2,2" opacity="0.6" />
  <line x1="52" y1="44" x2="74" y2="38" stroke="#38bdf8" stroke-width="0.8" stroke-dasharray="2,2" opacity="0.6" />
  <line x1="74" y1="38" x2="90" y2="56" stroke="#f472b6" stroke-width="0.8" stroke-dasharray="2,2" opacity="0.6" />

  <!-- Starburst 1 (Center Large) -->
  <path d="M 64 24 L 67 36 L 79 39 L 67 42 L 64 54 L 61 42 L 49 39 L 61 36 Z" fill="#ffffff" filter="url(#dustNova)" />
  <circle cx="64" cy="39" r="2.5" fill="#fbcfe8" />

  <!-- Starburst 2 (Left Medium) -->
  <path d="M 40 48 L 42 54 L 48 56 L 42 58 L 40 64 L 38 58 L 32 56 L 38 54 Z" fill="#a5f3fc" filter="url(#dustNova)" />

  <!-- Starburst 3 (Right Medium) -->
  <path d="M 88 44 L 90 50 L 96 52 L 90 54 L 88 60 L 86 54 L 80 52 L 86 50 Z" fill="#f472b6" filter="url(#dustNova)" />

  <!-- Scattered Glowing Glitter Points -->
  <circle cx="48" cy="74" r="2" fill="#ffffff" filter="url(#dustNova)" />
  <circle cx="60" cy="68" r="2.5" fill="#67e8f9" filter="url(#dustNova)" />
  <circle cx="76" cy="72" r="2" fill="#e879f9" filter="url(#dustNova)" />
  <circle cx="82" cy="64" r="1.5" fill="#ffffff" />
  <circle cx="54" cy="32" r="1.8" fill="#fde047" />
  <circle cx="76" cy="28" r="1.5" fill="#ffffff" />
  <circle cx="32" cy="72" r="1.2" fill="#bae6fd" />
  <circle cx="98" cy="72" r="1.4" fill="#fbcfe8" />
</svg>`;

// ============================================
// SLOT SILHOUETTES (Empty Equipment Placeholders)
// ============================================

assets['slot_weapon.svg'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <path d="M 38 90 L 92 36 M 34 94 L 26 102 M 28 86 L 42 100 M 92 36 L 96 32 L 102 38 L 98 42 Z" fill="none" stroke="#64748b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.45" />
  <circle cx="64" cy="64" r="42" fill="none" stroke="#334155" stroke-width="1.2" stroke-dasharray="4,4" opacity="0.3" />
</svg>`;

assets['slot_armor.svg'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <path d="M 44 32 L 84 32 L 94 62 C 94 82 80 96 64 102 C 48 96 34 82 34 62 Z" fill="none" stroke="#64748b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.45" />
  <line x1="64" y1="32" x2="64" y2="102" stroke="#64748b" stroke-width="1.5" opacity="0.3" />
  <circle cx="64" cy="64" r="42" fill="none" stroke="#334155" stroke-width="1.2" stroke-dasharray="4,4" opacity="0.3" />
</svg>`;

assets['slot_helmet.svg'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <path d="M 36 76 C 34 50 44 34 64 34 C 84 34 94 50 92 76 C 88 88 78 94 64 94 C 50 94 40 88 36 76 Z" fill="none" stroke="#64748b" stroke-width="2.5" stroke-linecap="round" opacity="0.45" />
  <path d="M 44 64 L 84 64 M 64 42 L 64 64" fill="none" stroke="#64748b" stroke-width="2" opacity="0.4" />
  <circle cx="64" cy="64" r="42" fill="none" stroke="#334155" stroke-width="1.2" stroke-dasharray="4,4" opacity="0.3" />
</svg>`;

assets['slot_boots.svg'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <path d="M 48 38 L 74 38 L 74 68 C 80 72 90 78 98 84 C 100 88 98 94 94 96 L 48 96 Z" fill="none" stroke="#64748b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.45" />
  <line x1="46" y1="96" x2="98" y2="96" stroke="#64748b" stroke-width="3" opacity="0.4" />
  <circle cx="64" cy="64" r="42" fill="none" stroke="#334155" stroke-width="1.2" stroke-dasharray="4,4" opacity="0.3" />
</svg>`;

assets['slot_relic.svg'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <ellipse cx="64" cy="70" rx="30" ry="18" fill="none" stroke="#64748b" stroke-width="2.5" opacity="0.45" />
  <polygon points="64,36 74,48 64,60 54,48" fill="none" stroke="#64748b" stroke-width="2" opacity="0.45" />
  <circle cx="64" cy="64" r="42" fill="none" stroke="#334155" stroke-width="1.2" stroke-dasharray="4,4" opacity="0.3" />
</svg>`;

// ============================================
// CURRENCIES
// ============================================

assets['currency_gold.svg'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <radialGradient id="coinFace" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="25%" stop-color="#fef08a" />
      <stop offset="65%" stop-color="#eab308" />
      <stop offset="90%" stop-color="#a16207" />
      <stop offset="100%" stop-color="#713f12" />
    </radialGradient>
    <filter id="goldGlintCoin" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2.5" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  <!-- Outer Rim with Dentils -->
  <circle cx="64" cy="64" r="54" fill="#713f12" />
  <circle cx="64" cy="64" r="50" fill="url(#coinFace)" stroke="#fef08a" stroke-width="2" />
  <circle cx="64" cy="64" r="43" fill="none" stroke="#a16207" stroke-width="1.5" stroke-dasharray="3,3" />

  <!-- Shield Crest Emblazoned in High Relief -->
  <path d="M 48 44 L 80 44 L 80 62 C 80 76 70 86 64 90 C 58 86 48 76 48 62 Z" fill="#ca8a04" stroke="#fef08a" stroke-width="1.6" />
  
  <!-- Crossed Broadswords on Shield -->
  <line x1="52" y1="48" x2="76" y2="76" stroke="#fef08a" stroke-width="2" stroke-linecap="round" />
  <line x1="76" y1="48" x2="52" y2="76" stroke="#fef08a" stroke-width="2" stroke-linecap="round" />
  <circle cx="64" cy="62" r="3" fill="#ffffff" />

  <!-- Specular Star Sparkle -->
  <path d="M 38 32 L 40 37 L 45 38 L 40 39 L 38 44 L 36 39 L 31 38 L 36 37 Z" fill="#ffffff" filter="url(#goldGlintCoin)" />
</svg>`;

assets['currency_shard.svg'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <filter id="shardNova" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="4.5" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <linearGradient id="crystalFacetA" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="40%" stop-color="#67e8f9" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>
    <linearGradient id="crystalFacetB" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#c084fc" />
      <stop offset="60%" stop-color="#7c3aed" />
      <stop offset="100%" stop-color="#3b0764" />
    </linearGradient>
    <radialGradient id="shardHalo" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#22d3ee" stop-opacity="0.5" />
      <stop offset="60%" stop-color="#a855f7" stop-opacity="0.2" />
      <stop offset="100%" stop-color="#020617" stop-opacity="0" />
    </radialGradient>
  </defs>

  <!-- Ambient Glow Halo -->
  <circle cx="64" cy="64" r="50" fill="url(#shardHalo)" filter="url(#shardNova)" />

  <!-- Main Shard Crystals Cluster -->
  <!-- Left Facet -->
  <polygon points="64,18 42,48 48,94 64,112 64,18" fill="url(#crystalFacetA)" stroke="#e0f2fe" stroke-width="1" />
  
  <!-- Right Facet (Darker Violet/Amethyst) -->
  <polygon points="64,18 86,44 80,94 64,112 64,18" fill="url(#crystalFacetB)" stroke="#f3e8ff" stroke-width="1" />

  <!-- Center Ridge Highlight -->
  <line x1="64" y1="18" x2="64" y2="112" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" />

  <!-- Diagonal Facet Cut Lines -->
  <line x1="64" y1="18" x2="48" y2="94" stroke="#ffffff" stroke-width="0.8" opacity="0.6" />
  <line x1="64" y1="18" x2="80" y2="94" stroke="#ffffff" stroke-width="0.8" opacity="0.6" />
  <line x1="42" y1="48" x2="64" y2="68" stroke="#ffffff" stroke-width="1.2" opacity="0.8" />
  <line x1="86" y1="44" x2="64" y2="68" stroke="#ffffff" stroke-width="1.2" opacity="0.8" />

  <!-- Floating Sparkles -->
  <path d="M 64 12 L 66 16 L 70 17 L 66 18 L 64 22 L 62 18 L 58 17 L 62 16 Z" fill="#ffffff" filter="url(#shardNova)" />
  <circle cx="38" cy="40" r="2" fill="#67e8f9" filter="url(#shardNova)" />
  <circle cx="88" cy="78" r="2.2" fill="#c084fc" filter="url(#shardNova)" />
</svg>`;

let count = 0;
for (const [filename, content] of Object.entries(assets)) {
  const filePath = path.join(outDir, filename);
  fs.writeFileSync(filePath, content.trim(), 'utf8');
  count++;
}

console.log(`Successfully generated ${count} RPG item assets in ${outDir}`);
