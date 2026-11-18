const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'assets', 'characters');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// 1. HERO ADVENTURER (Dark Knight / Mystic Wanderer) - 400x480
const heroSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 480" width="100%" height="100%">
  <defs>
    <!-- Background Aura -->
    <radialGradient id="heroAura" cx="50%" cy="45%" r="55%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.35"/>
      <stop offset="50%" stop-color="#6366f1" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#0b0f19" stop-opacity="0"/>
    </radialGradient>

    <!-- Obsidian Plate Armor Gradients -->
    <linearGradient id="plateSteel" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#475569"/>
      <stop offset="35%" stop-color="#1e293b"/>
      <stop offset="70%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>

    <linearGradient id="plateHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#94a3b8"/>
      <stop offset="25%" stop-color="#475569"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </linearGradient>

    <!-- Gold Trims -->
    <linearGradient id="goldTrim" x1="0%" y1="0%" x2="100%" y2="80%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="30%" stop-color="#f59e0b"/>
      <stop offset="70%" stop-color="#b45309"/>
      <stop offset="100%" stop-color="#78350f"/>
    </linearGradient>

    <!-- Arcane Cyan Glow -->
    <linearGradient id="arcaneCyan" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#a5f3fc"/>
      <stop offset="50%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#0284c7"/>
    </linearGradient>

    <!-- Cape Royal Fabric -->
    <linearGradient id="capeFabric" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#312e81"/>
      <stop offset="40%" stop-color="#1e1b4b"/>
      <stop offset="85%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>

    <!-- Glow Filter -->
    <filter id="runeGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
    <filter id="eyeGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Ambient Backdrop Halo -->
  <circle cx="200" cy="220" r="170" fill="url(#heroAura)"/>

  <!-- Mystic Rune Ring Behind Shoulders -->
  <g opacity="0.45" stroke="#38bdf8" stroke-width="1.5" fill="none">
    <circle cx="200" cy="210" r="145" stroke-dasharray="12 8 4 8"/>
    <circle cx="200" cy="210" r="132" stroke-width="0.8" stroke-dasharray="4 6"/>
    <!-- Cardinal Runes -->
    <polygon points="200,68 204,78 196,78" fill="#38bdf8"/>
    <polygon points="200,352 204,342 196,342" fill="#38bdf8"/>
    <polygon points="58,210 68,214 68,206" fill="#38bdf8"/>
    <polygon points="342,210 332,214 332,206" fill="#38bdf8"/>
  </g>

  <!-- Flowing Royal Cape (Back Layer) -->
  <path d="M120 180 Q80 260 70 430 Q130 420 200 425 Q270 420 330 430 Q320 260 280 180 Z" fill="url(#capeFabric)"/>
  <path d="M110 220 Q75 320 70 430 Q120 415 150 422 Q115 310 135 220 Z" fill="#1e1b4b" opacity="0.6"/>
  <path d="M290 220 Q325 320 330 430 Q280 415 250 422 Q285 310 265 220 Z" fill="#0f172a" opacity="0.7"/>

  <!-- Body Torso / Chain Underlay -->
  <path d="M150 200 L250 200 L240 370 L160 370 Z" fill="#1e293b"/>
  <!-- Chainmail links hint -->
  <line x1="165" y1="210" x2="235" y2="210" stroke="#334155" stroke-width="1.5" stroke-dasharray="2 3"/>
  <line x1="163" y1="220" x2="237" y2="220" stroke="#334155" stroke-width="1.5" stroke-dasharray="2 3"/>

  <!-- Main Gothic Breastplate -->
  <path d="M155 190 L200 215 L245 190 L235 320 L200 355 L165 320 Z" fill="url(#plateSteel)" stroke="url(#goldTrim)" stroke-width="2"/>
  <!-- Beveled Center Ridge -->
  <path d="M200 215 L200 355" stroke="#94a3b8" stroke-width="2.5" opacity="0.8"/>
  <path d="M155 190 L200 215 L200 355 L165 320 Z" fill="#ffffff" opacity="0.06"/>
  <!-- Engraved Arcane Sigil on Chest -->
  <g filter="url(#runeGlow)" stroke="#38bdf8" stroke-width="1.5" fill="none">
    <polygon points="200,240 215,260 200,280 185,260" stroke="#38bdf8"/>
    <circle cx="200" cy="260" r="4" fill="#a5f3fc"/>
    <line x1="200" y1="232" x2="200" y2="288"/>
    <line x1="180" y1="260" x2="220" y2="260"/>
  </g>

  <!-- Heavy Armored Belt & Faulds -->
  <path d="M160 325 L240 325 L235 365 L200 380 L165 365 Z" fill="#0f172a" stroke="url(#goldTrim)" stroke-width="1.5"/>
  <!-- Golden Belt Buckle -->
  <rect x="188" y="322" width="24" height="20" rx="3" fill="url(#goldTrim)" stroke="#fef08a" stroke-width="1"/>
  <circle cx="200" cy="332" r="4" fill="#38bdf8" filter="url(#runeGlow)"/>

  <!-- Left Pauldron (Viewer's Left - Massive Tiered Shoulder Plate) -->
  <g>
    <path d="M165 180 Q110 170 95 215 Q135 250 170 230 Z" fill="url(#plateSteel)" stroke="url(#goldTrim)" stroke-width="2"/>
    <path d="M160 190 Q120 185 105 220 Q135 245 165 230 Z" fill="url(#plateHighlight)" opacity="0.3"/>
    <!-- Outer spike / blade plate -->
    <path d="M135 170 Q85 160 70 205 Q105 235 140 210 Z" fill="url(#plateSteel)" stroke="#38bdf8" stroke-width="1.2"/>
    <!-- Glowing Runes on Pauldron -->
    <path d="M98 200 L115 208 L128 198" fill="none" stroke="#38bdf8" stroke-width="1.8" filter="url(#runeGlow)"/>
  </g>

  <!-- Right Pauldron (Viewer's Right) -->
  <g>
    <path d="M235 180 Q290 170 305 215 Q265 250 230 230 Z" fill="url(#plateSteel)" stroke="url(#goldTrim)" stroke-width="2"/>
    <path d="M240 190 Q280 185 295 220 Q265 245 235 230 Z" fill="url(#plateHighlight)" opacity="0.3"/>
    <path d="M265 170 Q315 160 330 205 Q295 235 260 210 Z" fill="url(#plateSteel)" stroke="#38bdf8" stroke-width="1.2"/>
    <path d="M302 200 L285 208 L272 198" fill="none" stroke="#38bdf8" stroke-width="1.8" filter="url(#runeGlow)"/>
  </g>

  <!-- Right Arm & Glowing Spellblade (Sheathed / Held at Ready) -->
  <g>
    <!-- Forearm Vambrace -->
    <path d="M255 240 L285 255 L305 340 L275 330 Z" fill="url(#plateSteel)" stroke="url(#goldTrim)" stroke-width="1.5"/>
    <!-- Gauntlet Hand -->
    <path d="M295 330 Q315 345 305 365 Q285 360 280 340 Z" fill="#334155" stroke="url(#goldTrim)" stroke-width="1.2"/>
    <!-- Spellblade Crossguard & Blade extending upward -->
    <g transform="translate(300, 320) rotate(-18)">
      <!-- Blade Glow Aura -->
      <path d="M-6 -180 L6 -180 L14 10 L-14 10 Z" fill="#38bdf8" opacity="0.3" filter="url(#eyeGlow)"/>
      <!-- Blade Core -->
      <path d="M0 -185 L8 0 L-8 0 Z" fill="url(#arcaneCyan)"/>
      <line x1="0" y1="-180" x2="0" y2="0" stroke="#ffffff" stroke-width="2"/>
      <!-- Crossguard -->
      <path d="M-22 5 L22 5 L16 16 L-16 16 Z" fill="url(#goldTrim)" stroke="#fef08a" stroke-width="1"/>
      <circle cx="0" cy="10" r="3.5" fill="#a5f3fc" filter="url(#runeGlow)"/>
      <!-- Grip & Pommel -->
      <rect x="-4" y="16" width="8" height="24" rx="2" fill="#1e1b4b" stroke="url(#goldTrim)" stroke-width="1"/>
      <polygon points="0,48 -7,40 7,40" fill="url(#goldTrim)"/>
    </g>
  </g>

  <!-- Left Arm (Armored Guard Pose) -->
  <g>
    <path d="M145 240 L115 255 L95 340 L125 330 Z" fill="url(#plateSteel)" stroke="url(#goldTrim)" stroke-width="1.5"/>
    <path d="M105 330 Q85 345 95 365 Q115 360 120 340 Z" fill="#334155" stroke="url(#goldTrim)" stroke-width="1.2"/>
  </g>

  <!-- Gorget & Neck Guard -->
  <path d="M175 165 L225 165 L215 195 L185 195 Z" fill="#1e293b" stroke="url(#goldTrim)" stroke-width="1.5"/>

  <!-- Mystical Hood & Helmet Visor -->
  <g id="heroHead">
    <!-- Dark Hood Base -->
    <path d="M150 160 Q130 95 200 70 Q270 95 250 160 Q215 175 200 175 Q185 175 150 160 Z" fill="#0f172a" stroke="url(#goldTrim)" stroke-width="1.5"/>
    <!-- Hood Inner Shadow -->
    <path d="M158 150 Q145 105 200 85 Q255 105 242 150 Q210 162 200 162 Q190 162 158 150 Z" fill="#020617"/>

    <!-- Armored Faceplate / Visor -->
    <path d="M170 120 L200 108 L230 120 L225 155 L200 168 L175 155 Z" fill="url(#plateSteel)" stroke="url(#goldTrim)" stroke-width="1.5"/>
    <!-- Visor Bevel Highlight -->
    <line x1="200" y1="108" x2="200" y2="168" stroke="#94a3b8" stroke-width="1.5"/>

    <!-- Glowing Cyan Arcane Eyes / Slits -->
    <g filter="url(#eyeGlow)">
      <!-- Left Eye -->
      <polygon points="180,132 194,134 192,137 178,135" fill="#a5f3fc"/>
      <!-- Right Eye -->
      <polygon points="220,132 206,134 208,137 222,135" fill="#a5f3fc"/>
      <!-- Center Forehead Rune Gem -->
      <circle cx="200" cy="116" r="3" fill="#38bdf8"/>
    </g>
  </g>

  <!-- Ambient Shimmer / Sparkle Accents -->
  <circle cx="110" cy="140" r="1.5" fill="#a5f3fc" opacity="0.8"/>
  <circle cx="310" cy="120" r="2" fill="#a5f3fc" opacity="0.9"/>
  <circle cx="290" cy="80" r="1.2" fill="#fef08a" opacity="0.8"/>
  <circle cx="90" cy="270" r="1.5" fill="#38bdf8" opacity="0.7"/>
  <circle cx="330" cy="280" r="2" fill="#38bdf8" opacity="0.7"/>
</svg>`;

// 2. BLACKSMITH MASTER (Grimar the Forge-Master) - 400x400
const blacksmithSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <!-- Forge Heat Radial Glow -->
    <radialGradient id="forgeHeat" cx="50%" cy="50%" r="55%">
      <stop offset="0%" stop-color="#ff7a00" stop-opacity="0.38"/>
      <stop offset="45%" stop-color="#dc2626" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#0a0a0a" stop-opacity="0"/>
    </radialGradient>

    <!-- Bronze & Heated Iron Gradients -->
    <linearGradient id="heatedIron" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="25%" stop-color="#f97316"/>
      <stop offset="65%" stop-color="#b91c1c"/>
      <stop offset="100%" stop-color="#450a0a"/>
    </linearGradient>

    <linearGradient id="leatherApron" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#78350f"/>
      <stop offset="50%" stop-color="#451a03"/>
      <stop offset="100%" stop-color="#1c1917"/>
    </linearGradient>

    <linearGradient id="dwarfBeard" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ea580c"/>
      <stop offset="35%" stop-color="#c2410c"/>
      <stop offset="70%" stop-color="#9a3412"/>
      <stop offset="100%" stop-color="#7c2d12"/>
    </linearGradient>

    <linearGradient id="darkAnvil" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#64748b"/>
      <stop offset="40%" stop-color="#334155"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>

    <filter id="emberGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="3.5" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Ambient Forge Glow -->
  <circle cx="200" cy="200" r="180" fill="url(#forgeHeat)"/>

  <!-- Anvil Base Silhouette in Foreground -->
  <path d="M120 320 L280 320 L290 350 L270 380 L130 380 L110 350 Z" fill="url(#darkAnvil)" stroke="#ff7a00" stroke-width="1.5" opacity="0.9"/>
  <!-- Glowing Ingot on Anvil -->
  <rect x="170" y="312" width="60" height="14" rx="3" fill="url(#heatedIron)" filter="url(#emberGlow)"/>

  <!-- Broad Muscular Shoulders & Leather Smithing Apron -->
  <path d="M90 220 Q120 180 200 180 Q280 180 310 220 L325 350 L75 350 Z" fill="url(#leatherApron)" stroke="#292524" stroke-width="2"/>
  <!-- Apron Cross Straps & Brass Rivets -->
  <line x1="145" y1="185" x2="175" y2="280" stroke="#92400e" stroke-width="6"/>
  <line x1="255" y1="185" x2="225" y2="280" stroke="#92400e" stroke-width="6"/>
  <circle cx="150" cy="200" r="4" fill="#fbbf24"/>
  <circle cx="250" cy="200" r="4" fill="#fbbf24"/>
  <circle cx="200" cy="275" r="5" fill="#f59e0b"/>

  <!-- Left Arm Holding Molten Smithing Tongs -->
  <g>
    <!-- Bicep / Arm -->
    <path d="M80 220 Q60 270 95 310 L120 290 Q95 250 110 220 Z" fill="#b45309" stroke="#78350f" stroke-width="1.5"/>
    <!-- Iron Tongs -->
    <path d="M100 300 L160 315 L175 318 L160 325 L95 310 Z" fill="#475569" stroke="#94a3b8" stroke-width="1.5"/>
  </g>

  <!-- Right Arm Holding Spiked Forge Hammer -->
  <g>
    <path d="M320 220 Q340 270 305 310 L280 290 Q305 250 290 220 Z" fill="#b45309" stroke="#78350f" stroke-width="1.5"/>
    <!-- Heavy Warhammer Handle -->
    <line x1="315" y1="150" x2="285" y2="330" stroke="#78350f" stroke-width="7" stroke-linecap="round"/>
    <!-- Spiked Anvil Hammer Head -->
    <rect x="290" y="140" width="48" height="30" rx="3" fill="url(#darkAnvil)" stroke="#ff7a00" stroke-width="1.5" transform="rotate(-15 314 155)"/>
    <polygon points="335,142 348,150 335,158" fill="#f97316" filter="url(#emberGlow)"/>
  </g>

  <!-- Braided Fiery Dwarven Beard -->
  <g id="blacksmithBeard">
    <!-- Main beard body -->
    <path d="M140 150 Q110 240 170 310 Q200 325 230 310 Q290 240 260 150 Q200 170 140 150 Z" fill="url(#dwarfBeard)"/>
    <!-- Mustache -->
    <path d="M150 145 Q200 165 250 145 Q235 175 200 170 Q165 175 150 145 Z" fill="#ea580c"/>
    <!-- Braided Golden Rings on Beard Ends -->
    <rect x="188" y="275" width="24" height="8" rx="2" fill="#fbbf24" stroke="#78350f" stroke-width="1"/>
    <rect x="192" y="295" width="16" height="6" rx="2" fill="#fbbf24" stroke="#78350f" stroke-width="1"/>
    <!-- Ember sparks in beard -->
    <circle cx="165" cy="240" r="2" fill="#fef08a" filter="url(#emberGlow)"/>
    <circle cx="235" cy="250" r="1.5" fill="#fef08a" filter="url(#emberGlow)"/>
    <circle cx="180" cy="270" r="1.8" fill="#ff7a00" filter="url(#emberGlow)"/>
  </g>

  <!-- Face & Head -->
  <g id="blacksmithHead">
    <!-- Weathered Head / Face -->
    <path d="M155 125 Q150 70 200 65 Q250 70 245 125 Q200 140 155 125 Z" fill="#c2410c"/>
    <!-- Fierce Bushy Eyebrows -->
    <polygon points="160,98 190,92 188,103 165,103" fill="#ea580c"/>
    <polygon points="240,98 210,92 212,103 235,103" fill="#ea580c"/>
    <!-- Intense Golden Eyes -->
    <circle cx="178" cy="107" r="3.5" fill="#fef08a" filter="url(#emberGlow)"/>
    <circle cx="222" cy="107" r="3.5" fill="#fef08a" filter="url(#emberGlow)"/>
    <!-- Smithing Brow Goggles (Pushed onto forehead) -->
    <rect x="150" y="70" width="100" height="16" rx="4" fill="#292524" stroke="#78350f" stroke-width="2"/>
    <circle cx="175" cy="78" r="10" fill="#38bdf8" opacity="0.75" stroke="#fbbf24" stroke-width="2"/>
    <circle cx="225" cy="78" r="10" fill="#38bdf8" opacity="0.75" stroke="#fbbf24" stroke-width="2"/>
  </g>

  <!-- Rising Cinder Sparks -->
  <g filter="url(#emberGlow)">
    <circle cx="120" cy="120" r="2.5" fill="#ff7a00"/>
    <circle cx="105" cy="80" r="1.8" fill="#fef08a"/>
    <circle cx="290" cy="100" r="2.2" fill="#ff7a00"/>
    <circle cx="310" cy="65" r="1.5" fill="#fef08a"/>
    <circle cx="200" cy="40" r="2" fill="#ffedd5"/>
  </g>
</svg>`;

// 3. GUILD MERCHANT (Lady Vivienne the Quartermaster) - 400x400
const merchantSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <!-- Mystical Violet / Velvet Aura -->
    <radialGradient id="merchantAura" cx="50%" cy="50%" r="55%">
      <stop offset="0%" stop-color="#c084fc" stop-opacity="0.35"/>
      <stop offset="45%" stop-color="#7e22ce" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#020617" stop-opacity="0"/>
    </radialGradient>

    <!-- Velvet Hood & Robes -->
    <linearGradient id="royalVelvet" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#581c87"/>
      <stop offset="40%" stop-color="#3b0764"/>
      <stop offset="85%" stop-color="#1e1b4b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>

    <!-- Ornate Gold Embroidery -->
    <linearGradient id="merchantGold" x1="0%" y1="0%" x2="100%" y2="80%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="40%" stop-color="#f59e0b"/>
      <stop offset="80%" stop-color="#d97706"/>
      <stop offset="100%" stop-color="#78350f"/>
    </linearGradient>

    <!-- Shimmer Filter -->
    <filter id="goldShimmer" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Ambient Mystical Aura -->
  <circle cx="200" cy="200" r="180" fill="url(#merchantAura)"/>

  <!-- Ornate Golden Scale of Trade (Floating behind merchant) -->
  <g opacity="0.45" stroke="url(#merchantGold)" stroke-width="1.8" fill="none">
    <circle cx="200" cy="180" r="150" stroke-dasharray="8 6"/>
    <line x1="200" y1="50" x2="200" y2="310"/>
    <line x1="120" y1="120" x2="280" y2="120"/>
    <!-- Scale Pans -->
    <path d="M100 150 Q120 170 140 150 Z" fill="#7e22ce" opacity="0.6"/>
    <line x1="120" y1="120" x2="105" y2="150"/>
    <line x1="120" y1="120" x2="135" y2="150"/>
    <path d="M260 150 Q280 170 300 150 Z" fill="#7e22ce" opacity="0.6"/>
    <line x1="280" y1="120" x2="265" y2="150"/>
    <line x1="280" y1="120" x2="295" y2="150"/>
  </g>

  <!-- Flowing Velvet Mantle / Robe Body -->
  <path d="M110 200 L200 230 L290 200 L320 370 L80 370 Z" fill="url(#royalVelvet)" stroke="url(#merchantGold)" stroke-width="2"/>
  <!-- Gold filigree borders on robe lapels -->
  <path d="M150 215 L200 280 L250 215" fill="none" stroke="url(#merchantGold)" stroke-width="3"/>

  <!-- Left Arm Holding Parchment Trade Ledger -->
  <g>
    <path d="M110 220 Q80 270 115 320 L150 300 Q125 260 140 220 Z" fill="#3b0764"/>
    <!-- Parchment Roll -->
    <rect x="95" y="300" width="45" height="18" rx="4" fill="#fef3c7" stroke="#92400e" stroke-width="1.5" transform="rotate(-20 117 309)"/>
    <!-- Wax Seal Ribbon -->
    <circle cx="120" cy="312" r="5" fill="#dc2626" stroke="#991b1b" stroke-width="1"/>
  </g>

  <!-- Right Arm Holding Glowing Exotic Relic / Potion Vial -->
  <g>
    <path d="M290 220 Q320 270 285 320 L250 300 Q275 260 260 220 Z" fill="#3b0764"/>
    <!-- Arcane Elixir Bottle -->
    <path d="M275 295 L295 295 L305 325 Q305 335 285 335 Q265 335 265 325 Z" fill="#a855f7" stroke="url(#merchantGold)" stroke-width="1.5" filter="url(#goldShimmer)"/>
    <rect x="281" y="287" width="8" height="8" rx="1" fill="#78350f"/>
    <!-- Sparkling Liquid Glow -->
    <ellipse cx="285" cy="320" rx="12" ry="7" fill="#f5d0fe" opacity="0.8"/>
  </g>

  <!-- Ornate Jeweled Brooch at Neck -->
  <polygon points="200,215 212,228 200,240 188,228" fill="url(#merchantGold)" stroke="#fef08a" stroke-width="1"/>
  <circle cx="200" cy="228" r="5" fill="#38bdf8" filter="url(#goldShimmer)"/>

  <!-- Enigmatic Hooded Head -->
  <g id="merchantHead">
    <!-- Deep Hood -->
    <path d="M140 160 Q125 80 200 60 Q275 80 260 160 Q225 180 200 180 Q175 180 140 160 Z" fill="url(#royalVelvet)" stroke="url(#merchantGold)" stroke-width="2"/>
    <!-- Hood Shadow / Visage -->
    <path d="M150 150 Q138 95 200 78 Q262 95 250 150 Q215 168 200 168 Q185 168 150 150 Z" fill="#090514"/>

    <!-- Elegant Mystical Eyes & Smile Emerging from Shadow -->
    <g filter="url(#goldShimmer)">
      <!-- Left Eye -->
      <path d="M172 124 Q182 120 192 126 Q182 130 172 124 Z" fill="#f59e0b"/>
      <circle cx="182" cy="125" r="2.2" fill="#fef08a"/>
      <!-- Right Eye -->
      <path d="M208 126 Q218 120 228 124 Q218 130 208 126 Z" fill="#f59e0b"/>
      <circle cx="218" cy="125" r="2.2" fill="#fef08a"/>
    </g>
    <!-- Delicate Lips -->
    <path d="M192 146 Q200 150 208 146" fill="none" stroke="#e879f9" stroke-width="1.5" stroke-linecap="round"/>
  </g>

  <!-- Shimmering Golden Coin Motes & Stars -->
  <g filter="url(#goldShimmer)">
    <circle cx="90" cy="160" r="2" fill="#fef08a"/>
    <circle cx="310" cy="140" r="2.5" fill="#fef08a"/>
    <circle cx="130" cy="90" r="1.5" fill="#c084fc"/>
    <circle cx="270" cy="80" r="1.8" fill="#fef08a"/>
    <circle cx="200" cy="30" r="2.2" fill="#fef08a"/>
  </g>
</svg>`;

fs.writeFileSync(path.join(outDir, 'hero_adventurer.svg'), heroSvg, 'utf8');
fs.writeFileSync(path.join(outDir, 'npc_blacksmith.svg'), blacksmithSvg, 'utf8');
fs.writeFileSync(path.join(outDir, 'npc_merchant.svg'), merchantSvg, 'utf8');

console.log('Character SVGs generated successfully in assets/characters/:');
console.log(' - hero_adventurer.svg');
console.log(' - npc_blacksmith.svg');
console.log(' - npc_merchant.svg');
