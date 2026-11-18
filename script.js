// ============================================
// Questforge - JavaScript
// The Dark Knight's Journal
// ============================================

// 1. Load saved information from the browser
let quests = JSON.parse(localStorage.getItem("quests")) || [];
let xp = Number(localStorage.getItem("xp")) || 0;
let level = Number(localStorage.getItem("level")) || 1;

// Economy: Gold & Arcane Shards
let savedGold = localStorage.getItem("quest_gold");
let gold = savedGold !== null ? Number(savedGold) : 50;

let savedShards = localStorage.getItem("quest_shards");
let shards = savedShards !== null ? Number(savedShards) : 2;

// RPG Attributes: STR, INT, END, LCK, and unallocated points
const DEFAULT_STATS = { str: 5, int: 5, end: 5, lck: 5, unallocated: 0 };
let stats = Object.assign({}, DEFAULT_STATS);
try {
  const parsedStats = JSON.parse(localStorage.getItem("quest_stats"));
  if (parsedStats && typeof parsedStats === "object") {
    stats = Object.assign({}, DEFAULT_STATS, parsedStats);
  }
} catch (e) {
  stats = Object.assign({}, DEFAULT_STATS);
}

// Last level-up spoils for modal presentation
let lastLevelRewards = { gold: 50, shards: 1, stats: 3 };

// Valid independent navigation pages
const VALID_PAGES = [
  "profile",
  "quests",
  "inventory",
  "companions",
  "forge",
  "refine",
  "shop",
  "soundtrack",
  "themes",
  "streak",
  "board",
  "attributes"
];
let currentPage = "profile";

// ============================================
// QUESTFORGE COMPANION SYSTEM ARCHITECTURE
// ============================================

const ELEMENT_AFFINITIES = {
  fire: { id: "fire", name: "Fire", symbol: "🔥", badgeClass: "elem-fire", title: "Pyre & Flare", desc: "Passionate, fiery, bursts with incandescent power." },
  water: { id: "water", name: "Water", symbol: "💧", badgeClass: "elem-water", title: "Frost & Tide", desc: "Serene, adaptive, flowing with tranquil currents and ice." },
  earth: { id: "earth", name: "Earth", symbol: "🌱", badgeClass: "elem-earth", title: "Flora & Stone", desc: "Grounded, resilient, deeply attuned to nature's harmony." },
  wind: { id: "wind", name: "Wind", symbol: "💨", badgeClass: "elem-wind", title: "Breeze & Gale", desc: "Swift, nimble, playful wanderer of the open skies." },
  light: { id: "light", name: "Light", symbol: "✨", badgeClass: "elem-light", title: "Solar & Dawn", desc: "Radiant, illuminating, channel of celestial warmth and vision." },
  shadow: { id: "shadow", name: "Shadow", symbol: "🌑", badgeClass: "elem-shadow", title: "Void & Twilight", desc: "Mysterious, elusive, dwelling comfortably in twilight realms." },
  arcane: { id: "arcane", name: "Arcane", symbol: "🔮", badgeClass: "elem-arcane", title: "Aether & Mana", desc: "Enigmatic, pure magical energy and leyline resonances." }
};

const RARITY_TIERS = {
  common: { id: "common", name: "Common", label: "Common Familiar", color: "#94a3b8" },
  uncommon: { id: "uncommon", name: "Uncommon", label: "Uncommon Familiar", color: "#22c55e" },
  rare: { id: "rare", name: "Rare", label: "Rare Familiar", color: "#38bdf8" },
  epic: { id: "epic", name: "Epic", label: "Epic Familiar", color: "#a855f7" },
  legendary: { id: "legendary", name: "Legendary", label: "Legendary Familiar", color: "#f59e0b" },
  mythical: { id: "mythical", name: "Mythical", label: "Mythical Familiar", color: "#ec4899" }
};

const COMPANION_CATALOG = {
  fennie: {
    id: "fennie",
    name: "Fennie",
    species: "Magical Fox",
    element: "arcane",
    rarity: "rare",
    personality: "Playful, curious, adventurous",
    description: "An energetic little wanderer who is always curious about the world. Fennie loves discovering new things and accompanying adventurers on their journeys.",
    asset: "assets/companions/fennie.svg",
    modelAsset: "assets/models/fennie.glb",
    perk: "+5% Quest Gold Bounty",
    unlockType: "starter",
    unlockCondition: "Bonds with every new adventurer as their loyal starter companion.",
    dialogue: {
      clicks: [
        "Yip! Ready for our next expedition?",
        "*Sniffs the air curiously* A great trial awaits us!",
        "*Wags fluffy tail happily* Let's venture forth!",
        "The realm is vast and full of sparkling wonders!",
        "*Nuzzles warmly against your armor*"
      ],
      questComplete: "Yip yip hooray! That quest didn't stand a chance!",
      levelUp: "*Dancing with joy* You've reached greater power, Adventurer!",
      craftSuccess: "*Gives an admiring bark* That craft turned out beautifully!",
      refineSuccess: "*Tail swishes with arcane sparks* Look at that divine glow!"
    }
  },
  zephyr: {
    id: "zephyr",
    name: "Zephyr",
    species: "Wind Sprite",
    element: "wind",
    rarity: "common",
    personality: "Breezy, cheerful, swift",
    description: "A playful sprite born from high mountain updrafts. Zephyr flutters effortlessly alongside adventurers, carrying rumors of faraway quests on the wind.",
    asset: "assets/companions/zephyr.svg",
    modelAsset: "assets/models/zephyr.glb",
    perk: "+5% Swift Agility Bounty",
    unlockType: "quest_milestone",
    unlockCondition: "Befriended after completing your 1st Realm Quest.",
    dialogue: {
      clicks: [
        "*Flutters wings in a playful gust* Whoosh! What trail shall we blaze?",
        "The mountain winds whisper stories of ancient glory!",
        "*Rides a tiny whirlwind in circles happily*",
        "Light as a feather, swift as the summer gale!",
        "*Spins a tiny breeze around your hair playfully*"
      ],
      questComplete: "*Whirlwind of joy!* We sped through that trial like a gale!",
      levelUp: "*Soars high above* Your spirit rises like the morning breeze!",
      craftSuccess: "*Cools the fresh forge work with a gentle breath* Pure breeze-tempered craft!",
      refineSuccess: "*Air wisps sparkle around the anvil* The leylines dance on the gale!"
    }
  },
  mossy: {
    id: "mossy",
    name: "Mossy",
    species: "Forest Spirit",
    element: "earth",
    rarity: "uncommon",
    personality: "Gentle, peaceful, friendly",
    description: "A peaceful spirit born from the heart of an enchanted forest. Mossy brings tranquility and perseverance wherever it travels.",
    asset: "assets/companions/mossy.svg",
    modelAsset: "assets/models/mossy.glb",
    perk: "+10% Streak Resilience",
    unlockType: "quest_milestone",
    unlockCondition: "Befriended after completing 3 total Quests.",
    dialogue: {
      clicks: [
        "*Giggles softly as tiny petals flutter* Hello, friend!",
        "Take a deep breath... Nature is watching over us.",
        "*Gentle botanical spores drift around happily*",
        "Even the mightiest oak began as a tiny seed.",
        "*Rests gently upon your shoulder*"
      ],
      questComplete: "*Blooms a tiny fragrant flower* Your hard work made the forest smile!",
      levelUp: "*Gentle green glow radiates* You are flourishing like spring!",
      craftSuccess: "*Rubs leafy hands together* Created with natural grace.",
      refineSuccess: "*Sprouts dance with joy* Pure harmony achieved!"
    }
  },
  ollie: {
    id: "ollie",
    name: "Ollie",
    species: "Magical Owl",
    element: "light",
    rarity: "rare",
    personality: "Wise, calm, observant",
    description: "A thoughtful little familiar who enjoys observing the world and discovering celestial knowledge under the starlight.",
    asset: "assets/companions/ollie.svg",
    modelAsset: "assets/models/ollie.glb",
    perk: "+5% Arcane Quest XP",
    unlockType: "level_milestone",
    unlockCondition: "Attuned upon reaching Adventurer Level 3.",
    dialogue: {
      clicks: [
        "Hoo-hoo... The stars foretell great triumph today.",
        "*Tilts head with quiet contemplation* Knowledge is the keenest blade.",
        "Observe carefully, Adventurer. Every trial teaches a lesson.",
        "*Blinks glowing celestial eyes serenely*",
        "The arcane leylines hum with possibility."
      ],
      questComplete: "Hoo! A trial completed with scholarly precision.",
      levelUp: "*Spreads starry wings* Your mind and spirit have expanded.",
      craftSuccess: "Fascinating alchemy. The runes have balanced perfectly.",
      refineSuccess: "Hoo! Celestial harmonics reached an apex tier."
    }
  },
  ember: {
    id: "ember",
    name: "Ember",
    species: "Baby Dragon",
    element: "fire",
    rarity: "epic",
    personality: "Mischievous, brave, energetic",
    description: "A tiny dragon with an enormous personality. Ember may still be small, but its adventurous spirit is impossible to ignore.",
    asset: "assets/companions/ember.svg",
    modelAsset: "assets/models/ember.glb",
    perk: "+5% Critical Bounty Luck",
    unlockType: "shop",
    shopPrice: { gold: 180, shards: 2 },
    unlockCondition: "Adoptable from Lady Vivienne's Emporium for 180 Gold & 2 Arcane Shards.",
    dialogue: {
      clicks: [
        "*Puffs a tiny cute flame ring* Rrr-rawr! Fear me!",
        "*Flaps tiny wings proudly* I'm going to breathe huge fire one day!",
        "Got any shiny gold coins for my hoard?",
        "*Curled up like a warm ruby ember*",
        "*Nibbles playfully on your gauntlet*"
      ],
      questComplete: "*Joyful tiny flame burst* We burned right through that trial!",
      levelUp: "*Flaps wings vigorously* Rawrr! Power surges in our blood!",
      craftSuccess: "*Inspects the heat of the forge* A masterwork of fire and steel!",
      refineSuccess: "*Sparks shower from tiny horns* The anvil sang with dragonfire!"
    }
  },
  boo: {
    id: "boo",
    name: "Boo",
    species: "Little Ghost Spirit",
    element: "shadow",
    rarity: "epic",
    personality: "Shy, playful, mysterious",
    description: "A mysterious little twilight spirit who prefers quietly following its adventurer. Boo is shy at first but surprisingly playful.",
    asset: "assets/companions/boo.svg",
    modelAsset: "assets/models/boo.glb",
    perk: "+5% Arcane Shard Drop Rate",
    unlockType: "shop",
    shopPrice: { gold: 140, shards: 1 },
    unlockCondition: "Adoptable from Lady Vivienne's Emporium for 140 Gold & 1 Arcane Shard.",
    dialogue: {
      clicks: [
        "B-boo! ...Did I startle you? *Giggles shyly*",
        "*Floats upside down and peeks curiously*",
        "I'm not scary, I promise! Just a little wisp.",
        "*Temporarily vanishes with a soft pop, then reappears*",
        "*Hovering right behind you like a protective halo*"
      ],
      questComplete: "Eek! Yay! We did it, we really did it!",
      levelUp: "*Halo spins with starlight* Ooh! You're shining so brightly!",
      craftSuccess: "*Peeks into the furnace* It didn't burn! It looks magical!",
      refineSuccess: "*Phases through the anvil in delight* The magic held together!"
    }
  },
  lumi: {
    id: "lumi",
    name: "Lumi",
    species: "Frost Wolf",
    element: "water",
    rarity: "legendary",
    personality: "Loyal, protective, affectionate",
    description: "A loyal little frost wolf who enjoys accompanying adventurers and watching over their journeys with diamond-frost paws.",
    asset: "assets/companions/lumi.svg",
    modelAsset: "assets/models/lumi.glb",
    perk: "+5% All Attributes Aura",
    unlockType: "shop",
    shopPrice: { gold: 260, shards: 3 },
    unlockCondition: "Adoptable from Lady Vivienne's Emporium for 260 Gold & 3 Arcane Shards.",
    dialogue: {
      clicks: [
        "*Soft cheerful puppy howl* Awoo! I stand with you always!",
        "*Wags tail excitedly, shaking loose diamond snow*",
        "*Nudges hand with cold, wet little wolf nose*",
        "I'll guard your flank in every blizzard and trial!",
        "*Paws the ground playfully with icy claws*"
      ],
      questComplete: "Awoo-ooh! Another triumph for the pack!",
      levelUp: "*Stands tall on hind legs* The frost spirits celebrate your ascension!",
      craftSuccess: "*Sniffs the cooled metal* Tempered to absolute perfection.",
      refineSuccess: "*Howls joyfully at the sky* An icy relic of legendary glory!"
    }
  },
  solas: {
    id: "solas",
    name: "Solas",
    species: "Solar Phoenix",
    element: "light",
    rarity: "mythical",
    personality: "Noble, radiant, inspiring",
    description: "A radiant solar phoenix chick hatched from a fallen star fragment. Solas bathes its chosen companion in celestial dawnlight and eternal inspiration.",
    asset: "assets/companions/solas.svg",
    modelAsset: "assets/models/solas.glb",
    perk: "+10% Quest XP & +10% Gold Bounty",
    unlockType: "shop",
    shopPrice: { gold: 380, shards: 5 },
    unlockCondition: "Adoptable from Lady Vivienne's Emporium for 380 Gold & 5 Arcane Shards.",
    dialogue: {
      clicks: [
        "*Puffs golden solar embers* The dawn rises with our righteous cause!",
        "*Spreads radiant sunlit wings proudly* Fear no darkness while my flame burns!",
        "A star falls only to ignite a hundred new horizons.",
        "*Crests gleam with brilliant solar warmth*",
        "*Sits upon your shoulder, glowing like an incandescent jewel*"
      ],
      questComplete: "*Ascends in a burst of golden dawn* A glorious triumph written in the constellations!",
      levelUp: "*Solar corona blazes triumphantly* The heavens acknowledge your transcendent ascent!",
      craftSuccess: "*Blesses the metal with solar rays* Infused with the purity of eternal dawn!",
      refineSuccess: "*Flames sing in celestial harmony* The relic radiates solar majesty!"
    }
  }
};

// ============================================
// COMPANION EVOLUTION CATALOG & PROGRESSION PATHS
// ============================================
const COMPANION_EVOLUTION_PATHS = {
  fennie: {
    id: "fennie",
    stages: [
      {
        stage: 1,
        title: "Base Familiar",
        formName: "Fennie",
        species: "Magical Fox",
        rarity: "rare",
        minPlayerLevel: 1,
        modelAsset: "assets/models/fennie.glb",
        asset: "assets/companions/fennie.svg",
        perk: "+5% Quest Gold Bounty",
        perkShort: "+5% Gold",
        lore: "An energetic little wanderer who is always curious about the world. Fennie loves discovering new things and accompanying adventurers on their journeys.",
        visualTraits: "Soft golden-amber fur, single fluffy tail, curious ears."
      },
      {
        stage: 2,
        title: "Ascended Familiar",
        formName: "Gale Fennie",
        species: "Breeze Kitsune",
        rarity: "epic",
        minPlayerLevel: 2,
        modelAsset: "assets/models/fennie_stage2.glb",
        asset: "assets/companions/fennie.svg",
        perk: "+10% Quest Gold Bounty & +5% Swift Step",
        perkShort: "+10% Gold",
        lore: "Awakened by early journeys, Gale Fennie sprouts dual wind-tails and feathered ear crests adorned with an enchanted gold torc.",
        visualTraits: "Dual curved wind tails, feathered celestial ears, golden talisman collar."
      },
      {
        stage: 3,
        title: "Apex Mythic",
        formName: "Tempest Fennie",
        species: "Celestial Kyubi",
        rarity: "mythical",
        minPlayerLevel: 4,
        modelAsset: "assets/models/fennie_stage3.glb",
        asset: "assets/companions/fennie.svg",
        perk: "+15% Quest Gold Bounty & +10% Starlight Fortune",
        perkShort: "+15% Gold",
        lore: "Having attained cosmic attunement, Tempest Fennie commands celestial wind currents with triple kitsune tails, an astral mantle, and a star crown.",
        visualTraits: "Triple glowing celestial tails, floating star crown, vortex storm mantle."
      }
    ]
  },
  ember: {
    id: "ember",
    stages: [
      {
        stage: 1,
        title: "Base Familiar",
        formName: "Ember",
        species: "Baby Dragon",
        rarity: "epic",
        minPlayerLevel: 1,
        modelAsset: "assets/models/ember.glb",
        asset: "assets/companions/ember.svg",
        perk: "+5% Critical Bounty Luck",
        perkShort: "+5% Crit",
        lore: "A tiny dragon with an enormous personality. Ember's fiery loyalty grants critical luck.",
        visualTraits: "Crimson whelp scales, small stubby wings, ember tail flare."
      },
      {
        stage: 2,
        title: "Ascended Familiar",
        formName: "Pyre Drake",
        species: "Flame Drake",
        rarity: "legendary",
        minPlayerLevel: 3,
        modelAsset: "assets/models/ember_stage2.glb",
        asset: "assets/companions/ember.svg",
        perk: "+10% Critical Bounty Luck & Fiery Focus",
        perkShort: "+10% Crit",
        lore: "Its wings have grown broad and flame-veined, while twin obsidian horns crown its brow as it breathes vibrant pyre motes.",
        visualTraits: "Broad jagged bat-wings, swept horns, chest magma glow."
      },
      {
        stage: 3,
        title: "Apex Mythic",
        formName: "Solar Wyrm",
        species: "Solar Sovereign Dragon",
        rarity: "mythical",
        minPlayerLevel: 5,
        modelAsset: "assets/models/ember_stage3.glb",
        asset: "assets/companions/ember.svg",
        perk: "+15% Critical Bounty Luck & Infernal Aura",
        perkShort: "+15% Crit",
        lore: "A legendary wyrm enveloped in solar magma flares. Its roar echoes through volcanic peaks, radiating ancient draconic dominion.",
        visualTraits: "Quad flame horns, solar plasma halo, sprawling spiked wings."
      }
    ]
  },
  lumi: {
    id: "lumi",
    stages: [
      {
        stage: 1,
        title: "Base Familiar",
        formName: "Lumi",
        species: "Frost Wolf Pup",
        rarity: "rare",
        minPlayerLevel: 1,
        modelAsset: "assets/models/lumi.glb",
        asset: "assets/companions/lumi.svg",
        perk: "+10% Quest XP Boost",
        perkShort: "+10% XP",
        lore: "A gentle arctic pup born beneath the northern aurora. Lumi's serene presence keeps minds calm and clear.",
        visualTraits: "Soft cyan winter coat, playful floppy ears, snowy paw pads."
      },
      {
        stage: 2,
        title: "Ascended Familiar",
        formName: "Glacial Howler",
        species: "Northern Direwolf",
        rarity: "epic",
        minPlayerLevel: 3,
        modelAsset: "assets/models/lumi_stage2.glb",
        asset: "assets/companions/lumi.svg",
        perk: "+15% Quest XP Boost & Frost Barrier",
        perkShort: "+15% XP",
        lore: "Grown into a sleek direwolf of the tundras, Glacial Howler's mane forms crystalline ice shards that chime in arctic winds.",
        visualTraits: "Spiked ice crystal ruff, piercing sapphire gaze, frost vapor aura."
      },
      {
        stage: 3,
        title: "Apex Mythic",
        formName: "Fenrir Frostlord",
        species: "Primordial Frost Titan",
        rarity: "mythical",
        minPlayerLevel: 5,
        modelAsset: "assets/models/lumi_stage3.glb",
        asset: "assets/companions/lumi.svg",
        perk: "+20% Quest XP Boost & Glacial Wisdom",
        perkShort: "+20% XP",
        lore: "An ancient winter behemoth carrying the chill of the primordial ice age. Frost crowns its brow and blizzards follow in its stride.",
        visualTraits: "Giant frost antler crowns, deep glacier blue armor plates, drifting aurora wisps."
      }
    ]
  },
  solas: {
    id: "solas",
    stages: [
      {
        stage: 1,
        title: "Base Familiar",
        formName: "Solas",
        species: "Solar Phoenix",
        rarity: "mythical",
        minPlayerLevel: 1,
        modelAsset: "assets/models/solas.glb",
        asset: "assets/companions/solas.svg",
        perk: "+10% Quest XP & +10% Gold Bounty",
        perkShort: "+10% XP & Gold",
        lore: "A mythical solar phoenix chick hatched from a fallen star fragment.",
        visualTraits: "Golden chick down, glowing crown crest, tiny sun motes."
      },
      {
        stage: 2,
        title: "Ascended Familiar",
        formName: "Dawn Ascendant",
        species: "Solar Roc",
        rarity: "mythical",
        minPlayerLevel: 3,
        modelAsset: "assets/models/solas_stage2.glb",
        asset: "assets/companions/solas.svg",
        perk: "+15% Quest XP & +15% Gold Bounty",
        perkShort: "+15% XP & Gold",
        lore: "Unfurling brilliant wings of morning light, Dawn Ascendant blazes with the purity of eternal sunrise.",
        visualTraits: "Sweeping radiant wing feathers, twin sun streamer ribbons."
      },
      {
        stage: 3,
        title: "Apex Mythic",
        formName: "Solar Sovereign",
        species: "Eternal Solar Deity",
        rarity: "mythical",
        minPlayerLevel: 5,
        modelAsset: "assets/models/solas_stage3.glb",
        asset: "assets/companions/solas.svg",
        perk: "+20% Quest XP & +20% Gold Bounty",
        perkShort: "+20% XP & Gold",
        lore: "The full manifestation of the golden sun deity, radiating blinding warmth and crowned in divine coronal rays.",
        visualTraits: "Coronal sun halo, celestial plumage, divine solar halo."
      }
    ]
  },
  mossy: {
    id: "mossy",
    stages: [
      {
        stage: 1,
        title: "Base Familiar",
        formName: "Mossy",
        species: "Forest Sprite",
        rarity: "uncommon",
        minPlayerLevel: 1,
        modelAsset: "assets/models/mossy.glb",
        asset: "assets/companions/mossy.svg",
        perk: "+15% Shard Crafting Yield",
        perkShort: "+15% Shards",
        lore: "A cheerful creature of moss, twigs, and blooming buds born in ancient glades.",
        visualTraits: "Petite moss bulb body, sprouting forehead leaf, dewdrop eyes."
      },
      {
        stage: 2,
        title: "Ascended Familiar",
        formName: "Elder Bloom",
        species: "Glade Dryad",
        rarity: "rare",
        minPlayerLevel: 3,
        modelAsset: "assets/models/mossy_stage2.glb",
        asset: "assets/companions/mossy.svg",
        perk: "+25% Shard Crafting Yield",
        perkShort: "+25% Shards",
        lore: "Its body flourishes into vibrant cherry blossom petals and ancient living barks attuned to the heartbeat of the forest.",
        visualTraits: "Lush petal collar, bark-armored limbs, glowing spore halo."
      },
      {
        stage: 3,
        title: "Apex Mythic",
        formName: "Gaia Arborist",
        species: "Ancient Grove Colossus",
        rarity: "epic",
        minPlayerLevel: 5,
        modelAsset: "assets/models/mossy_stage3.glb",
        asset: "assets/companions/mossy.svg",
        perk: "+35% Shard Crafting Yield",
        perkShort: "+35% Shards",
        lore: "A revered guardian of deep forest sanctums crowned in ancient flowering branches and stone rune moss.",
        visualTraits: "Great antler branch crown, vibrant flowering overgrowth, deep earth aura."
      }
    ]
  },
  boo: {
    id: "boo",
    stages: [
      {
        stage: 1,
        title: "Base Familiar",
        formName: "Boo",
        species: "Spectral Wisp",
        rarity: "epic",
        minPlayerLevel: 1,
        modelAsset: "assets/models/boo.glb",
        asset: "assets/companions/boo.svg",
        perk: "+10% Refinement Success Rate",
        perkShort: "+10% Refine",
        lore: "A mysterious phantom wisp found haunting ancient forge ruins.",
        visualTraits: "Floating lavender spectral shroud, glowing soul eyes."
      },
      {
        stage: 2,
        title: "Ascended Familiar",
        formName: "Twilight Phantasm",
        species: "Nether Phantom",
        rarity: "legendary",
        minPlayerLevel: 3,
        modelAsset: "assets/models/boo_stage2.glb",
        asset: "assets/companions/boo.svg",
        perk: "+15% Refinement Success Rate",
        perkShort: "+15% Refine",
        lore: "Draped in wisps of twilight velvet and phantom chains, Twilight Phantasm commands the ethereal flow of lost spirits.",
        visualTraits: "Hovering phantom chains, elongated spectral cowl, ethereal mist."
      },
      {
        stage: 3,
        title: "Apex Mythic",
        formName: "Void Wraith",
        species: "Astral Shadowlord",
        rarity: "mythical",
        minPlayerLevel: 5,
        modelAsset: "assets/models/boo_stage3.glb",
        asset: "assets/companions/boo.svg",
        perk: "+20% Refinement Success Rate",
        perkShort: "+20% Refine",
        lore: "A terrifyingly majestic lord of shadowy depths crowned in void fire and midnight eclipse energies.",
        visualTraits: "Void crown of floating dark shards, swirling vortex mantle."
      }
    ]
  },
  ollie: {
    id: "ollie",
    stages: [
      {
        stage: 1,
        title: "Base Familiar",
        formName: "Ollie",
        species: "Astral Owlet",
        rarity: "rare",
        minPlayerLevel: 1,
        modelAsset: "assets/models/ollie.glb",
        asset: "assets/companions/ollie.svg",
        perk: "+10% Quest Board Refresh Luck",
        perkShort: "+10% Luck",
        lore: "A scholarly astral owlet that perches on spellbooks and gazes through constellations.",
        visualTraits: "Star-speckled feathers, oversized curious round eyes, scholar crest."
      },
      {
        stage: 2,
        title: "Ascended Familiar",
        formName: "Starlight Sage",
        species: "Constellation Strix",
        rarity: "epic",
        minPlayerLevel: 3,
        modelAsset: "assets/models/ollie_stage2.glb",
        asset: "assets/companions/ollie.svg",
        perk: "+15% Quest Board Refresh Luck",
        perkShort: "+15% Luck",
        lore: "Spreading wings laced with constellation lines, Starlight Sage reads fate in the alignment of distant planets.",
        visualTraits: "Gilded starlight horns, celestial constellation wings, glowing third eye."
      },
      {
        stage: 3,
        title: "Apex Mythic",
        formName: "Astral Archon",
        species: "Cosmic Celestial Strix",
        rarity: "mythical",
        minPlayerLevel: 5,
        modelAsset: "assets/models/ollie_stage3.glb",
        asset: "assets/companions/ollie.svg",
        perk: "+20% Quest Board Refresh Luck",
        perkShort: "+20% Luck",
        lore: "An omnipresent cosmic sage capable of deciphering the threads of reality itself across the starlit void.",
        visualTraits: "Triple halo astral rings, starry cosmic shroud, orbiting celestial spheres."
      }
    ]
  },
  zephyr: {
    id: "zephyr",
    stages: [
      {
        stage: 1,
        title: "Base Familiar",
        formName: "Zephyr",
        species: "Cloud Griffin",
        rarity: "legendary",
        minPlayerLevel: 1,
        modelAsset: "assets/models/zephyr.glb",
        asset: "assets/companions/zephyr.svg",
        perk: "+20% Daily Streak Shield",
        perkShort: "+20% Shield",
        lore: "A noble griffin hatchling carried on northern squalls.",
        visualTraits: "Downy white flight wings, eagle beak, fluffy sky-blue lion tail."
      },
      {
        stage: 2,
        title: "Ascended Familiar",
        formName: "Gale Weaver",
        species: "Sky Sovereign Griffin",
        rarity: "legendary",
        minPlayerLevel: 3,
        modelAsset: "assets/models/zephyr_stage2.glb",
        asset: "assets/companions/zephyr.svg",
        perk: "+30% Daily Streak Shield",
        perkShort: "+30% Shield",
        lore: "Master of crosswinds and tempest drafts, Gale Weaver's wings carve trails of silver vapor across mountain peaks.",
        visualTraits: "Armored talons, sweeping razor wings, silver feather crest."
      },
      {
        stage: 3,
        title: "Apex Mythic",
        formName: "Storm Tempest",
        species: "Apex Tempest Griffin",
        rarity: "mythical",
        minPlayerLevel: 5,
        modelAsset: "assets/models/zephyr_stage3.glb",
        asset: "assets/companions/zephyr.svg",
        perk: "+40% Daily Streak Shield",
        perkShort: "+40% Shield",
        lore: "An ancient sovereign of hurricane eye walls, wreathed in crackling storm lightning and gale crowns.",
        visualTraits: "Lightning-charged feather tips, storm cloud crown, thunderous golden plumage."
      }
    ]
  }
};

let companionState = {
  owned: ["fennie"],
  active: "fennie",
  customNames: {},
  evolutions: {
    fennie: 1,
    ember: 1,
    lumi: 1,
    solas: 1,
    mossy: 1,
    boo: 1,
    ollie: 1,
    zephyr: 1
  }
};

function getCompanionEvolutionStage(id) {
  if (companionState && companionState.evolutions && typeof companionState.evolutions[id] === "number") {
    return Math.max(1, Math.min(3, companionState.evolutions[id]));
  }
  return 1;
}

function getCompanionStageData(id, stage) {
  const path = COMPANION_EVOLUTION_PATHS[id];
  if (!path || !Array.isArray(path.stages)) return null;
  const targetStage = Math.max(1, Math.min(3, stage || 1));
  return path.stages[targetStage - 1] || path.stages[0];
}

function canEvolveCompanion(id) {
  const curStage = getCompanionEvolutionStage(id);
  if (curStage >= 3) return false;
  const nextData = getCompanionStageData(id, curStage + 1);
  if (!nextData) return false;
  return typeof level === "number" && level >= nextData.minPlayerLevel;
}

function loadCompanionState() {
  try {
    const raw = localStorage.getItem("quest_companions");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.owned)) {
        companionState = {
          owned: parsed.owned.length > 0 ? parsed.owned : ["fennie"],
          active: parsed.active && COMPANION_CATALOG[parsed.active] ? parsed.active : "fennie",
          customNames: parsed.customNames || {},
          evolutions: Object.assign({
            fennie: 1,
            ember: 1,
            lumi: 1,
            solas: 1,
            mossy: 1,
            boo: 1,
            ollie: 1,
            zephyr: 1
          }, parsed.evolutions || {})
        };
      }
    }
  } catch (e) {
    console.warn("Could not load companion state:", e);
  }

  // Ensure starter companion Fennie is always present
  if (!companionState.owned.includes("fennie")) {
    companionState.owned.unshift("fennie");
  }
  if (!companionState.active || !COMPANION_CATALOG[companionState.active]) {
    companionState.active = "fennie";
  }
  if (!companionState.evolutions) {
    companionState.evolutions = { fennie: 1, ember: 1, lumi: 1, solas: 1, mossy: 1, boo: 1, ollie: 1, zephyr: 1 };
  }
}

// Initial load of companion state
loadCompanionState();

function saveCompanionState() {
  try {
    localStorage.setItem("quest_companions", JSON.stringify(companionState));
  } catch (e) {
    console.warn("Could not save companion state:", e);
  }
}

function getCompanion(id) {
  const base = COMPANION_CATALOG[id];
  if (!base) return null;
  const custom = companionState.customNames ? companionState.customNames[id] : null;
  const stage = getCompanionEvolutionStage(id);
  const evoData = getCompanionStageData(id, stage);

  const formName = evoData ? evoData.formName : base.name;
  const stageTitle = evoData ? evoData.title : "Base Familiar";
  const species = evoData ? evoData.species : base.species;
  const rarity = evoData ? evoData.rarity : base.rarity;
  const modelAsset = evoData ? evoData.modelAsset : base.modelAsset;
  const perk = evoData ? evoData.perk : base.perk;
  const description = evoData ? evoData.lore : base.description;
  const visualTraits = evoData ? evoData.visualTraits : "";

  return Object.assign({}, base, {
    stage: stage,
    stageTitle: stageTitle,
    formName: formName,
    species: species,
    rarity: rarity,
    modelAsset: modelAsset,
    perk: perk,
    description: description,
    visualTraits: visualTraits,
    displayName: custom ? custom : formName,
    hasCustomName: Boolean(custom && custom !== formName)
  });
}

function getActiveCompanion() {
  return getCompanion(companionState.active) || getCompanion("fennie");
}

function isCompanionOwned(id) {
  return companionState.owned.includes(id);
}

let activeCompanionPreviewStage = null;

function setActiveCompanion(id) {
  if (!isCompanionOwned(id)) {
    showToast("This companion is not yet attuned to you!", "ember");
    return;
  }
  companionState.active = id;
  activeCompanionPreviewStage = null;
  saveCompanionState();

  const comp = getCompanion(id);
  renderProfileCompanion();
  renderCompanionsPage();
  renderCompanionCodex();

  triggerCompanionReaction("quest", comp.displayName + " is now journeying by your side! 🐾");
  showToast(comp.displayName + " equipped as your active companion!", "milestone");
}

function unlockCompanion(id, reason) {
  if (!COMPANION_CATALOG[id]) return false;
  if (!companionState.owned.includes(id)) {
    companionState.owned.push(id);
    saveCompanionState();

    const comp = getCompanion(id);
    renderCompanionsPage();
    renderCompanionCodex();

    showToast("New Companion Unlocked: " + comp.name + "! (" + (reason || "Milestone") + ")", "milestone");
    return true;
  }
  return false;
}

function checkCompanionMilestones() {
  const completedCount = quests.filter(function(q) { return q.completed; }).length;

  // 1. Fennie (Starter Familiar)
  if (!isCompanionOwned("fennie")) {
    unlockCompanion("fennie", "Starter Familiar");
  }

  // 2. Zephyr (Complete 1 Quest)
  if (completedCount >= 1 && !isCompanionOwned("zephyr")) {
    unlockCompanion("zephyr", "Completed 1st Realm Quest!");
  }

  // 3. Mossy (Complete 3 Quests)
  if (completedCount >= 3 && !isCompanionOwned("mossy")) {
    unlockCompanion("mossy", "Completed 3 Realm Quests!");
  }

  // 4. Ollie (Reach Level 3)
  if (level >= 3 && !isCompanionOwned("ollie")) {
    unlockCompanion("ollie", "Attained Adventurer Level 3!");
  }

  // Update evolution card state if level changed
  if (typeof renderCompanionsPage === "function") {
    renderCompanionsPage();
  }
}

let companionSpeechTimer = null;
let companionInteractionCooldown = false;

function interactWithCompanion(source) {
  if (companionInteractionCooldown) return;
  companionInteractionCooldown = true;
  setTimeout(function() { companionInteractionCooldown = false; }, 900);

  const comp = getActiveCompanion();
  if (!comp) return;

  const quotes = comp.dialogue.clicks || ["Hello!"];
  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  // Audio / Sound feedback
  playCoinSound();

  // Avatar wobble / bounce
  const wrap = document.getElementById("activeCompanionAvatarWrap");
  if (wrap) {
    wrap.classList.add("pet-bounce");
    setTimeout(function() { wrap.classList.remove("pet-bounce"); }, 550);
  }

  const pod = document.getElementById("profileCompanionPod");
  if (pod) {
    pod.classList.add("pet-bounce");
    setTimeout(function() { pod.classList.remove("pet-bounce"); }, 550);
  }

  showCompanionSpeech(quote);
}

function triggerCompanionReaction(type, customText) {
  const comp = getActiveCompanion();
  if (!comp) return;

  let text = customText;
  if (!text) {
    if (type === "quest") text = comp.dialogue.questComplete;
    else if (type === "levelUp") text = comp.dialogue.levelUp;
    else if (type === "craft") text = comp.dialogue.craftSuccess;
    else if (type === "refine") text = comp.dialogue.refineSuccess;
  }
  if (!text) return;

  showCompanionSpeech(text);
}

function showCompanionSpeech(text) {
  const activeBubble = document.getElementById("activeCompanionBubble");
  const profileBubble = document.getElementById("profileCompanionBubble");

  [activeBubble, profileBubble].forEach(function(b) {
    if (b) {
      b.textContent = text;
      b.hidden = false;
    }
  });

  if (companionSpeechTimer) {
    clearTimeout(companionSpeechTimer);
  }
  companionSpeechTimer = setTimeout(function() {
    [activeBubble, profileBubble].forEach(function(b) {
      if (b) b.hidden = true;
    });
    companionSpeechTimer = null;
  }, 4500);
}

function renderProfileCompanion() {
  const comp = getActiveCompanion();
  if (!comp) return;

  const img = document.getElementById("profileCompanionImg");
  if (img) {
    img.src = comp.asset;
    img.alt = comp.displayName + " (" + comp.species + ")";
  }

  const nameTag = document.getElementById("profileCompanionNameTag");
  if (nameTag) {
    nameTag.textContent = comp.displayName + " 🐾";
  }

  const detailChip = document.getElementById("profileCompanionDetailChip");
  if (detailChip) {
    detailChip.textContent = "🐾 " + comp.displayName + " (" + comp.species + ") • " + comp.perk;
  }
}

// Subview state: "sanctuary" vs "codex"
let currentCompanionSubView = "sanctuary";
let currentCompanionFilter = "all";


// ============================================
// QUESTFORGE 3D COMPANION ENGINE (THREE.JS)
// ============================================

let companionRenderMode = "3d"; // "3d" or "2d"

const Companion3DManager = {
  isSupported: true,
  isInitialized: false,
  mode: "3d",
  renderer: null,
  scene: null,
  camera: null,
  controls: null,
  mixer: null,
  actions: {},
  clock: null,
  currentModel: null,
  currentModelAsset: null,
  activeCompanionId: null,
  animFrameId: null,
  isPaused: false,
  containerEl: null,
  canvasHostEl: null,
  spinnerEl: null,
  avatar2dWrap: null,

  checkWebGL: function() {
    try {
      const canvas = document.createElement("canvas");
      return !!(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
    } catch (e) {
      return false;
    }
  },

  init: function() {
    if (this.isInitialized) return true;
    if (typeof THREE === "undefined") {
      console.warn("Three.js not loaded, falling back to 2D companion mode.");
      this.isSupported = false;
      this.fallbackTo2D("Engine not loaded");
      return false;
    }

    if (!this.checkWebGL()) {
      console.warn("WebGL not supported, falling back to 2D companion mode.");
      this.isSupported = false;
      this.fallbackTo2D("WebGL unsupported");
      return false;
    }

    this.containerEl = document.getElementById("activeCompanion3DContainer");
    this.canvasHostEl = document.getElementById("companion3DCanvasHost");
    this.spinnerEl = document.getElementById("companion3DLoadingSpinner");
    this.avatar2dWrap = document.getElementById("activeCompanionAvatarWrap");

    if (!this.canvasHostEl) return false;

    try {
      const width = this.canvasHostEl.clientWidth || 360;
      const height = this.canvasHostEl.clientHeight || 290;

      // 1. Scene
      this.scene = new THREE.Scene();

      // 2. Camera
      this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
      this.camera.position.set(0, 0.85, 2.3);

      // 3. Renderer
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
      });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      if (THREE.sRGBEncoding) {
        this.renderer.outputEncoding = THREE.sRGBEncoding;
      }

      // Clear host and append WebGL Canvas
      this.canvasHostEl.innerHTML = "";
      this.canvasHostEl.appendChild(this.renderer.domElement);

      // 4. Lighting System
      const ambientLight = new THREE.AmbientLight(0xfff6ea, 0.85);
      this.scene.add(ambientLight);

      const keyLight = new THREE.DirectionalLight(0xfffaed, 0.95);
      keyLight.position.set(1.8, 3.2, 2.2);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.001;
      this.scene.add(keyLight);

      const fillLight = new THREE.DirectionalLight(0x818cf8, 0.45);
      fillLight.position.set(-2.2, 1.5, -1.2);
      this.scene.add(fillLight);

      const rimLight = new THREE.PointLight(0x38bdf8, 0.7, 8);
      rimLight.position.set(0, 1.9, -1.8);
      this.scene.add(rimLight);

      // 5. Stylized 3D Pedestal
      const groundGeo = new THREE.CylinderGeometry(0.85, 0.92, 0.08, 32);
      const groundMat = new THREE.MeshStandardMaterial({
        color: 0x1e1b4b,
        roughness: 0.8,
        metalness: 0.2
      });
      const ground = new THREE.Mesh(groundGeo, groundMat);
      ground.position.set(0, -0.04, 0);
      ground.receiveShadow = true;
      this.scene.add(ground);

      const runeRingGeo = new THREE.RingGeometry(0.65, 0.78, 32);
      runeRingGeo.rotateX(-Math.PI / 2);
      const runeRingMat = new THREE.MeshBasicMaterial({
        color: 0xa855f7,
        transparent: true,
        opacity: 0.65,
        side: THREE.DoubleSide
      });
      const runeRing = new THREE.Mesh(runeRingGeo, runeRingMat);
      runeRing.position.set(0, 0.005, 0);
      this.scene.add(runeRing);

      // 6. Orbit Controls
      if (typeof THREE.OrbitControls !== "undefined") {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.08;
        this.controls.enablePan = false;
        this.controls.target.set(0, 0.45, 0);
        this.controls.minDistance = 1.3;
        this.controls.maxDistance = 3.6;
        this.controls.maxPolarAngle = Math.PI / 2 + 0.05;
        this.controls.minPolarAngle = Math.PI / 6;
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 1.4;
      }

      this.clock = new THREE.Clock();
      this.isInitialized = true;

      const self = this;
      window.addEventListener("resize", function() {
        self.onResize();
      });

      return true;
    } catch (err) {
      console.error("Error initializing Companion 3D Engine:", err);
      this.fallbackTo2D("Init failed");
      return false;
    }
  },

  onResize: function() {
    if (!this.isInitialized || !this.canvasHostEl || !this.renderer || !this.camera) return;
    const width = this.canvasHostEl.clientWidth;
    const height = this.canvasHostEl.clientHeight;
    if (width > 0 && height > 0) {
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    }
  },

  loadCompanion: function(companionId, overrideModelAsset) {
    if (!this.init()) return;

    const comp = getCompanion(companionId) || COMPANION_CATALOG[companionId];
    if (!comp) {
      this.fallbackTo2D("No 3D data for " + companionId);
      return;
    }

    const modelAsset = overrideModelAsset || comp.modelAsset;
    if (!modelAsset) {
      this.fallbackTo2D("No 3D asset for " + companionId);
      return;
    }

    if (this.mode !== "3d") {
      this.show2D();
      return;
    }

    if (this.currentModel && this.activeCompanionId === companionId && this.currentModelAsset === modelAsset) {
      this.show3D();
      this.resume();
      return;
    }

    this.show3D();
    if (this.spinnerEl) this.spinnerEl.classList.remove("hidden");

    const self = this;
    const loader = new THREE.GLTFLoader();

    loader.load(
      modelAsset,
      function(gltf) {
        if (self.spinnerEl) self.spinnerEl.classList.add("hidden");

        if (self.currentModel) {
          self.scene.remove(self.currentModel);
        }

        self.currentModel = gltf.scene;
        self.currentModel.position.set(0, 0, 0);
        self.currentModelAsset = modelAsset;
        self.currentModel.traverse(function(child) {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        self.scene.add(self.currentModel);
        self.activeCompanionId = companionId;

        // Animations
        self.mixer = null;
        self.actions = {};
        if (gltf.animations && gltf.animations.length > 0) {
          self.mixer = new THREE.AnimationMixer(self.currentModel);

          const idleClip = THREE.AnimationClip.findByName(gltf.animations, "idle") || gltf.animations[0];
          if (idleClip) {
            const idleAction = self.mixer.clipAction(idleClip);
            idleAction.play();
            self.actions.idle = idleAction;
          }

          const reactClip = THREE.AnimationClip.findByName(gltf.animations, "react") || THREE.AnimationClip.findByName(gltf.animations, "jump");
          if (reactClip) {
            const reactAction = self.mixer.clipAction(reactClip);
            reactAction.setLoop(THREE.LoopOnce);
            reactAction.clampWhenFinished = true;
            self.actions.react = reactAction;
          }
        }

        self.resetCamera();
        self.resume();
      },
      undefined,
      function(error) {
        console.warn("Could not load 3D model for " + companionId + ":", error);
        if (self.spinnerEl) self.spinnerEl.classList.add("hidden");
        self.fallbackTo2D("Model failed to load");
      }
    );
  },

  animate: function() {
    if (this.isPaused || !this.renderer || !this.scene || !this.camera) return;

    const self = this;
    this.animFrameId = requestAnimationFrame(function() {
      self.animate();
    });

    const delta = this.clock ? this.clock.getDelta() : 0.016;

    if (this.controls) {
      this.controls.update();
    }

    if (this.mixer) {
      this.mixer.update(delta);
    }

    this.renderer.render(this.scene, this.camera);
  },

  resume: function() {
    if (!this.isInitialized || this.mode !== "3d") return;
    this.isPaused = false;
    if (!this.animFrameId) {
      if (this.clock) this.clock.start();
      this.animate();
    }
  },

  pause: function() {
    this.isPaused = true;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  },

  playReaction: function() {
    if (this.actions && this.actions.react) {
      this.actions.react.reset();
      this.actions.react.fadeIn(0.12).play();
      if (this.actions.idle) {
        this.actions.idle.fadeOut(0.12);
      }
      const self = this;
      setTimeout(function() {
        if (self.actions.idle) {
          self.actions.idle.reset().fadeIn(0.2).play();
        }
      }, 1200);
    } else if (this.currentModel) {
      const m = this.currentModel;
      const startY = m.position.y;
      const startTime = performance.now();
      function bounce() {
        const elapsed = (performance.now() - startTime) / 1000;
        if (elapsed < 0.6) {
          m.position.y = startY + Math.sin((elapsed / 0.6) * Math.PI) * 0.25;
          m.rotation.y += 0.08;
          requestAnimationFrame(bounce);
        } else {
          m.position.y = startY;
        }
      }
      bounce();
    }

    interactWithCompanion("sanctuary");
  },

  resetCamera: function() {
    if (!this.camera || !this.controls) return;
    this.camera.position.set(0, 0.85, 2.3);
    this.controls.target.set(0, 0.45, 0);
    this.controls.update();
  },

  toggleAutoRotate: function() {
    if (!this.controls) return;
    this.controls.autoRotate = !this.controls.autoRotate;
    const btn = document.getElementById("btnToggle3DAutoRotate");
    const icon = document.getElementById("icon3DAutoRotate");
    if (btn) {
      btn.classList.toggle("active", this.controls.autoRotate);
    }
    if (icon) {
      icon.textContent = this.controls.autoRotate ? "🔄" : "⏸️";
    }
  },

  toggleMode: function() {
    if (this.mode === "3d") {
      this.mode = "2d";
      companionRenderMode = "2d";
      this.show2D();
    } else {
      this.mode = "3d";
      companionRenderMode = "3d";
      const activeId = companionState.active;
      this.loadCompanion(activeId);
    }
    this.updateModeButton();
  },

  show3D: function() {
    this.mode = "3d";
    companionRenderMode = "3d";
    if (this.containerEl) {
      this.containerEl.hidden = false;
      this.containerEl.style.display = "flex";
    }
    if (this.avatar2dWrap) {
      this.avatar2dWrap.hidden = true;
      this.avatar2dWrap.style.display = "none";
    }
    this.updateModeButton();
  },

  show2D: function() {
    this.pause();
    this.mode = "2d";
    companionRenderMode = "2d";
    if (this.containerEl) {
      this.containerEl.hidden = true;
      this.containerEl.style.display = "none";
    }
    if (this.avatar2dWrap) {
      this.avatar2dWrap.hidden = false;
      this.avatar2dWrap.style.display = "flex";
    }
    this.updateModeButton();
  },

  fallbackTo2D: function(reason) {
    console.info("Using 2D fallback for Companion viewer (" + reason + ")");
    this.show2D();
    const label = document.getElementById("labelCompanionMode");
    if (label) label.textContent = "🎨 2D (Active)";
  },

  updateModeButton: function() {
    const label = document.getElementById("labelCompanionMode");
    if (label) {
      label.textContent = this.mode === "3d" ? "🎨 2D Art" : "🦊 3D View";
    }
  }
};

// Global Bridge Callbacks for HTML onclick attributes
window.onCompanion3DClick = function(event) {
  if (Companion3DManager) Companion3DManager.playReaction();
};

window.toggleCompanion3DAutoRotate = function() {
  if (Companion3DManager) Companion3DManager.toggleAutoRotate();
};

window.resetCompanion3DCamera = function() {
  if (Companion3DManager) Companion3DManager.resetCamera();
};

window.toggleCompanionRenderMode = function() {
  if (Companion3DManager) Companion3DManager.toggleMode();
};

// Visibility Change: pause when tab hidden, resume when active
document.addEventListener("visibilitychange", function() {
  if (document.hidden) {
    if (typeof Companion3DManager !== "undefined") Companion3DManager.pause();
  } else if (currentPage === "companions") {
    if (typeof Companion3DManager !== "undefined") Companion3DManager.resume();
  }
});

function switchCompanionSubView(subView) {
  currentCompanionSubView = subView;
  const tabSanctuary = document.getElementById("tabBtnSanctuary");
  const tabCodex = document.getElementById("tabBtnCodex");
  const viewSanctuary = document.getElementById("viewCompanionSanctuary");
  const viewCodex = document.getElementById("viewCompanionCodex");

  const isSanctuary = subView === "sanctuary";

  if (tabSanctuary) {
    tabSanctuary.classList.toggle("active", isSanctuary);
    tabSanctuary.setAttribute("aria-selected", isSanctuary ? "true" : "false");
  }
  if (tabCodex) {
    tabCodex.classList.toggle("active", !isSanctuary);
    tabCodex.setAttribute("aria-selected", !isSanctuary ? "true" : "false");
  }

  if (viewSanctuary) viewSanctuary.hidden = !isSanctuary;
  if (viewCodex) viewCodex.hidden = isSanctuary;

  if (isSanctuary) {
    renderCompanionsPage();
  } else {
    renderCompanionCodex();
  }
}

function filterCompanionGrid(filter) {
  currentCompanionFilter = filter;
  const chips = document.querySelectorAll(".collection-filter-chips .chip-filter");
  chips.forEach(function(chip) {
    const isAct = chip.getAttribute("data-filter") === filter;
    chip.classList.toggle("active", isAct);
  });
  renderCompanionGrid();
}

function renderCompanionsPage() {
  const comp = getActiveCompanion();
  if (!comp) return;

  // 1. Update Showcase
  const showcaseImg = document.getElementById("activeCompanionImg");
  if (showcaseImg) {
    showcaseImg.src = comp.asset;
    showcaseImg.alt = comp.displayName;
  }

  const displayNameEl = document.getElementById("activeCompanionDisplayName");
  if (displayNameEl) {
    displayNameEl.textContent = comp.displayName + (comp.hasCustomName ? ' ("' + comp.name + '")' : "");
  }

  const speciesEl = document.getElementById("activeCompanionSpeciesBadge");
  if (speciesEl) speciesEl.textContent = comp.species;

  const rarityEl = document.getElementById("activeCompanionRarityBadge");
  if (rarityEl) {
    rarityEl.className = "companion-rarity-pill rarity-" + comp.rarity;
    const tier = RARITY_TIERS[comp.rarity];
    rarityEl.textContent = (tier ? tier.name : comp.rarity) + " Familiar";
  }

  const elementEl = document.getElementById("activeCompanionElementBadge");
  if (elementEl && comp.element && ELEMENT_AFFINITIES[comp.element]) {
    const aff = ELEMENT_AFFINITIES[comp.element];
    elementEl.className = "companion-element-pill " + aff.badgeClass;
    elementEl.textContent = aff.symbol + " " + aff.name;
  }

  const personalityEl = document.getElementById("activeCompanionPersonality");
  if (personalityEl) personalityEl.textContent = comp.personality;

  const loreEl = document.getElementById("activeCompanionLore");
  if (loreEl) loreEl.textContent = '“' + comp.description + '”';

  const perkEl = document.getElementById("activeCompanionPerk");
  if (perkEl) perkEl.textContent = comp.perk;

  // 1b. Update Evolution Progression Card
  const evoCard = document.getElementById("activeCompanionEvolutionCard");
  if (evoCard) {
    const curStage = comp.stage || getCompanionEvolutionStage(comp.id);
    const stageBadge = document.getElementById("activeEvolutionStageBadge");
    if (stageBadge) {
      stageBadge.textContent = "Stage " + curStage + " of 3 (" + comp.stageTitle + ")";
    }

    const formTitle = document.getElementById("activeEvolutionFormTitle");
    if (formTitle) {
      formTitle.textContent = comp.formName;
    }

    // Update pips
    const pips = document.querySelectorAll("#activeEvolutionPips .pip");
    pips.forEach(function(pip) {
      const pStage = Number(pip.getAttribute("data-stage"));
      if (pStage < curStage) {
        pip.className = "pip completed";
      } else if (pStage === curStage) {
        pip.className = "pip active";
      } else {
        pip.className = "pip";
      }
    });

    const nextTitle = document.getElementById("activeEvolutionNextTitle");
    const nextReq = document.getElementById("activeEvolutionNextReq");
    const previewBtn = document.getElementById("btnPreviewEvolution");
    const previewIcon = document.getElementById("previewEvolutionIcon");
    const previewLabel = document.getElementById("previewEvolutionLabel");
    const evolveBtn = document.getElementById("btnEvolveActiveCompanion");

    if (curStage >= 3) {
      if (nextTitle) nextTitle.textContent = "Apex Form Reached ✨";
      if (nextReq) {
        nextReq.textContent = "✦ Maximum evolution stage achieved!";
        nextReq.className = "evolution-next-req maxed";
      }
      if (previewBtn) previewBtn.style.display = "none";
      if (evolveBtn) {
        evolveBtn.disabled = true;
        evolveBtn.textContent = "Max Stage ✦";
        evolveBtn.classList.remove("pulse-glow");
      }
    } else {
      const nextStage = curStage + 1;
      const nextData = getCompanionStageData(comp.id, nextStage);
      if (previewBtn) {
        previewBtn.style.display = "";
        const isPreviewing = Boolean(activeCompanionPreviewStage === nextStage);
        previewBtn.classList.toggle("active", isPreviewing);
        if (previewIcon) previewIcon.textContent = isPreviewing ? "✕" : "🔍";
        if (previewLabel) previewLabel.textContent = isPreviewing ? "Exit Preview" : "Preview Next";
      }

      if (nextTitle && nextData) {
        nextTitle.textContent = nextData.formName + " (" + nextData.title + ")";
      }

      const isEligible = nextData && typeof level === "number" && level >= nextData.minPlayerLevel;
      if (nextReq && nextData) {
        if (isEligible) {
          nextReq.textContent = "✦ Ready to Evolve! (Req. Level " + nextData.minPlayerLevel + " • You are Level " + level + ")";
          nextReq.className = "evolution-next-req eligible";
        } else {
          nextReq.textContent = "Req. Player Level " + nextData.minPlayerLevel + " (You are Level " + level + ")";
          nextReq.className = "evolution-next-req";
        }
      }

      if (evolveBtn) {
        evolveBtn.textContent = "Evolve ✨";
        evolveBtn.disabled = !isEligible;
        evolveBtn.classList.toggle("pulse-glow", isEligible);
      }
    }
  }

  const totalCompanions = Object.keys(COMPANION_CATALOG).length;
  const ownedBadge = document.getElementById("companionsOwnedBadge");
  if (ownedBadge) {
    ownedBadge.textContent = "🐾 Owned: " + companionState.owned.length + " / " + totalCompanions;
  }

  const sanctuaryRosterCount = document.getElementById("sanctuaryRosterCount");
  if (sanctuaryRosterCount) {
    sanctuaryRosterCount.textContent = totalCompanions + " Familiars Cataloged";
  }

  // 2. Render Collection Grid
  renderCompanionGrid();

  // 3. Keep Codex dashboard & subview pill numbers in sync
  updateCodexDashboardStats();
  if (currentCompanionSubView === "codex") {
    renderCompanionCodex();
  }

  // 4. Update 3D Companion View
  if (typeof Companion3DManager !== "undefined") {
    if (companionRenderMode === "3d" && comp.modelAsset) {
      Companion3DManager.loadCompanion(comp.id);
    } else {
      Companion3DManager.show2D();
    }
  }
}

function renderCompanionGrid() {
  const grid = document.getElementById("companionCollectionGrid");
  if (!grid) return;

  grid.innerHTML = "";

  const allIds = Object.keys(COMPANION_CATALOG);

  const filteredIds = allIds.filter(function(id) {
    const isOwned = isCompanionOwned(id);
    if (currentCompanionFilter === "owned") return isOwned;
    if (currentCompanionFilter === "locked") return !isOwned;
    return true;
  });

  filteredIds.forEach(function(id) {
    const comp = getCompanion(id);
    const isOwned = isCompanionOwned(id);
    const isActive = companionState.active === id;
    const aff = ELEMENT_AFFINITIES[comp.element] || { symbol: "✨", name: "Arcane", badgeClass: "elem-arcane" };

    const card = document.createElement("div");
    card.className = "companion-card rarity-" + comp.rarity + (isActive ? " is-active" : "") + (!isOwned ? " is-locked" : "");

    let statusChipHtml = "";
    if (isActive) {
      statusChipHtml = '<span class="companion-status-chip status-active">Active</span>';
    } else if (isOwned) {
      statusChipHtml = '<span class="companion-status-chip status-owned">Owned</span>';
    } else if (comp.unlockType === "shop") {
      const priceText = comp.shopPrice.gold + " 🪙" + (comp.shopPrice.shards ? " + " + comp.shopPrice.shards + " 💎" : "");
      statusChipHtml = '<span class="companion-status-chip status-shop">Shop: ' + priceText + '</span>';
    } else {
      statusChipHtml = '<span class="companion-status-chip status-locked">Locked 🔒</span>';
    }

    let actionBtnHtml = "";
    if (isActive) {
      actionBtnHtml = '<button type="button" class="btn-equip-companion" disabled>Equipped 🐾</button>';
    } else if (isOwned) {
      actionBtnHtml = '<button type="button" class="btn-equip-companion" onclick="setActiveCompanion(\x27' + id + '\x27)">Equip Familiar</button>';
    } else if (comp.unlockType === "shop") {
      actionBtnHtml = '<button type="button" class="btn-primary" onclick="switchPage(\x27shop\x27); filterShop(\x27companion\x27);">Adopt in Shop 🪙</button>';
    } else {
      actionBtnHtml = '<button type="button" class="btn-ghost" onclick="openCompanionDetailModal(\x27' + id + '\x27)">Attunement 📜</button>';
    }

    card.innerHTML =
      '<div class="companion-card-head">' +
        '<div style="display:flex;align-items:center;gap:6px;">' +
          '<span class="companion-element-pill ' + aff.badgeClass + '" style="font-size:0.68rem;padding:2px 6px;">' + aff.symbol + ' ' + aff.name + '</span>' +
          '<span class="companion-card-species">' + comp.species + '</span>' +
        '</div>' +
        statusChipHtml +
      '</div>' +
      '<div class="companion-card-thumb" onclick="openCompanionDetailModal(\x27' + id + '\x27)">' +
        '<img src="' + comp.asset + '" alt="' + comp.displayName + '">' +
      '</div>' +
      '<div class="companion-card-meta">' +
        '<div class="companion-card-title">' +
          '<h4>' + comp.displayName + '</h4>' +
        '</div>' +
        '<p class="companion-card-lore">' + comp.description + '</p>' +
        '<div class="companion-card-perk">✨ ' + comp.perk + '</div>' +
      '</div>' +
      '<div class="companion-card-actions">' +
        actionBtnHtml +
        '<button type="button" class="btn-inspect-companion" onclick="openCompanionDetailModal(\x27' + id + '\x27)" title="Inspect details">Info ℹ️</button>' +
      '</div>';

    grid.appendChild(card);
  });
}

// ============================================
// COMPANION CODEX / PET INDEX ENGINE
// ============================================

let codexSearchQuery = "";
let codexStatusFilter = "all";
let codexElementFilter = "all";
let codexRarityFilter = "all";

function updateCodexDashboardStats() {
  const allIds = Object.keys(COMPANION_CATALOG);
  const total = allIds.length;
  const ownedCount = allIds.filter(isCompanionOwned).length;
  const pct = Math.round((ownedCount / total) * 100);

  const headerBadge = document.getElementById("codexCompletionHeaderBadge");
  if (headerBadge) {
    headerBadge.textContent = "📖 Codex: " + pct + "%";
  }

  const subviewPill = document.getElementById("subviewCodexProgress");
  if (subviewPill) {
    subviewPill.textContent = ownedCount + "/" + total + " (" + pct + "%)";
  }

  const ratioEl = document.getElementById("codexCollectionRatio");
  if (ratioEl) {
    ratioEl.textContent = ownedCount + " / " + total + " Unlocked";
  }

  const headlineEl = document.getElementById("codexPercentHeadline");
  if (headlineEl) {
    headlineEl.textContent = pct + "% Discovered";
  }

  const barFill = document.getElementById("codexProgressBarFill");
  if (barFill) {
    barFill.style.width = pct + "%";
  }

  const container = document.getElementById("codexProgressBarContainer");
  if (container) {
    container.setAttribute("aria-valuenow", pct);
  }

  const unlockedCountEl = document.getElementById("codexUnlockedCount");
  if (unlockedCountEl) {
    unlockedCountEl.textContent = "✦ " + ownedCount + " Discovered";
  }

  const undiscoveredCountEl = document.getElementById("codexUndiscoveredCount");
  if (undiscoveredCountEl) {
    undiscoveredCountEl.textContent = "🔒 " + (total - ownedCount) + " Undiscovered";
  }
}

function renderCompanionCodex() {
  updateCodexDashboardStats();

  const allIds = Object.keys(COMPANION_CATALOG);

  // 1. Render Elemental Breakdown
  const elemGrid = document.getElementById("elementalBreakdownGrid");
  if (elemGrid) {
    elemGrid.innerHTML = "";
    Object.keys(ELEMENT_AFFINITIES).forEach(function(elemKey) {
      const aff = ELEMENT_AFFINITIES[elemKey];
      const itemsInElem = allIds.filter(function(id) {
        return COMPANION_CATALOG[id].element === elemKey;
      });
      const ownedInElem = itemsInElem.filter(isCompanionOwned);
      const isComplete = itemsInElem.length > 0 && ownedInElem.length === itemsInElem.length;
      const isActiveFilter = codexElementFilter === elemKey;

      const chip = document.createElement("div");
      chip.className = "element-breakdown-chip " + aff.badgeClass + (isComplete ? " is-complete" : "") + (isActiveFilter ? " is-filtered" : "");
      chip.role = "button";
      chip.tabIndex = 0;
      chip.setAttribute("aria-label", aff.name + ": " + ownedInElem.length + " of " + itemsInElem.length + " unlocked");
      chip.onclick = function() {
        setCodexFilter("element", codexElementFilter === elemKey ? "all" : elemKey);
      };
      chip.innerHTML =
        '<span class="elem-chip-icon">' + aff.symbol + '</span>' +
        '<span class="elem-chip-name">' + aff.name + '</span>' +
        '<span class="elem-chip-count">' + ownedInElem.length + '/' + itemsInElem.length + '</span>';
      elemGrid.appendChild(chip);
    });
  }

  // 2. Render Rarity Spectrum Breakdown
  const rarityGrid = document.getElementById("rarityBreakdownGrid");
  if (rarityGrid) {
    rarityGrid.innerHTML = "";
    Object.keys(RARITY_TIERS).forEach(function(tierKey) {
      const tier = RARITY_TIERS[tierKey];
      const itemsInTier = allIds.filter(function(id) {
        return COMPANION_CATALOG[id].rarity === tierKey;
      });
      const ownedInTier = itemsInTier.filter(isCompanionOwned);
      const isComplete = itemsInTier.length > 0 && ownedInTier.length === itemsInTier.length;
      const isActiveFilter = codexRarityFilter === tierKey;

      const chip = document.createElement("div");
      chip.className = "rarity-breakdown-chip rarity-" + tierKey + (isComplete ? " is-complete" : "") + (isActiveFilter ? " is-filtered" : "");
      chip.role = "button";
      chip.tabIndex = 0;
      chip.setAttribute("aria-label", tier.name + ": " + ownedInTier.length + " of " + itemsInTier.length + " unlocked");
      chip.onclick = function() {
        setCodexFilter("rarity", codexRarityFilter === tierKey ? "all" : tierKey);
      };
      chip.innerHTML =
        '<span class="rarity-chip-dot"></span>' +
        '<span class="rarity-chip-name">' + tier.name + '</span>' +
        '<span class="rarity-chip-count">' + ownedInTier.length + '/' + itemsInTier.length + '</span>';
      rarityGrid.appendChild(chip);
    });
  }

  // 3. Filter and render Codex Bestiary Cards
  const codexGrid = document.getElementById("codexGrid");
  if (!codexGrid) return;

  const query = (codexSearchQuery || "").trim().toLowerCase();

  const filtered = allIds.filter(function(id) {
    const comp = COMPANION_CATALOG[id];
    const isOwned = isCompanionOwned(id);

    // Status filter
    if (codexStatusFilter === "owned" && !isOwned) return false;
    if (codexStatusFilter === "locked" && isOwned) return false;

    // Element filter
    if (codexElementFilter !== "all" && comp.element !== codexElementFilter) return false;

    // Rarity filter
    if (codexRarityFilter !== "all" && comp.rarity !== codexRarityFilter) return false;

    // Search query matching
    if (query) {
      const custom = companionState.customNames[id] || "";
      const aff = ELEMENT_AFFINITIES[comp.element] || { name: "" };
      const tier = RARITY_TIERS[comp.rarity] || { name: "" };
      const haystack = (
        comp.name + " " +
        custom + " " +
        comp.species + " " +
        comp.personality + " " +
        comp.description + " " +
        comp.perk + " " +
        comp.element + " " +
        aff.name + " " +
        comp.rarity + " " +
        tier.name
      ).toLowerCase();
      if (!haystack.includes(query)) return false;
    }

    return true;
  });

  const countBadge = document.getElementById("codexFilteredCount");
  if (countBadge) {
    countBadge.textContent = "Showing " + filtered.length + " of " + allIds.length;
  }

  codexGrid.innerHTML = "";

  if (filtered.length === 0) {
    const empty = document.createElement("div");
    empty.className = "codex-empty-state";
    empty.style.gridColumn = "1 / -1";
    empty.style.textAlign = "center";
    empty.style.padding = "48px 16px";
    empty.style.color = "var(--text-dim, #94a3b8)";
    empty.innerHTML =
      '<div style="font-size: 2.8rem; margin-bottom: 12px;">🔍</div>' +
      '<h4 style="color: var(--text-bright, #f8fafc); margin-bottom: 8px;">No Familiars Found</h4>' +
      '<p style="max-width: 360px; margin: 0 auto 16px;">No companion entries match the current search or filter parameters in the Codex.</p>' +
      '<button type="button" class="btn-ghost btn-small" onclick="resetCodexFilters()">Clear All Filters</button>';
    codexGrid.appendChild(empty);
    return;
  }

  filtered.forEach(function(id) {
    const comp = getCompanion(id);
    const isOwned = isCompanionOwned(id);
    const isActive = companionState.active === id;
    const aff = ELEMENT_AFFINITIES[comp.element] || { symbol: "✨", name: "Arcane", badgeClass: "elem-arcane" };
    const tier = RARITY_TIERS[comp.rarity] || { name: comp.rarity };

    const card = document.createElement("div");
    card.className = "codex-card rarity-" + comp.rarity + (isActive ? " is-active" : "") + (!isOwned ? " is-locked" : "");

    // Status pill
    let statusPillHtml = "";
    if (isActive) {
      statusPillHtml = '<span class="codex-card-status status-active">Equipped</span>';
    } else if (isOwned) {
      statusPillHtml = '<span class="codex-card-status status-owned">Discovered</span>';
    } else if (comp.unlockType === "shop") {
      const priceText = comp.shopPrice.gold + " 🪙" + (comp.shopPrice.shards ? " + " + comp.shopPrice.shards + " 💎" : "");
      statusPillHtml = '<span class="codex-card-status status-shop">Shop: ' + priceText + '</span>';
    } else {
      statusPillHtml = '<span class="codex-card-status status-locked">Locked 🔒</span>';
    }

    // Action button
    let actionBtnHtml = "";
    if (isActive) {
      actionBtnHtml = '<button type="button" class="btn-equip-companion" disabled>Equipped 🐾</button>';
    } else if (isOwned) {
      actionBtnHtml = '<button type="button" class="btn-equip-companion" onclick="setActiveCompanion(\x27' + id + '\x27)">Equip Familiar</button>';
    } else if (comp.unlockType === "shop") {
      actionBtnHtml = '<button type="button" class="btn-primary" onclick="switchPage(\x27shop\x27); filterShop(\x27companion\x27);">Adopt in Shop 🪙</button>';
    } else {
      actionBtnHtml = '<button type="button" class="btn-ghost" onclick="openCompanionDetailModal(\x27' + id + '\x27)">Attunement 📜</button>';
    }

    card.innerHTML =
      '<div class="codex-card-head">' +
        '<span class="companion-element-pill ' + aff.badgeClass + '">' + aff.symbol + ' ' + aff.name + '</span>' +
        statusPillHtml +
      '</div>' +
      '<div class="codex-card-thumb" onclick="openCompanionDetailModal(\x27' + id + '\x27)" role="button" tabindex="0" aria-label="Inspect ' + comp.displayName + '">' +
        (!isOwned ? '<span class="codex-lock-icon" aria-label="Locked">🔒</span>' : '') +
        '<img src="' + comp.asset + '" alt="' + comp.displayName + '">' +
      '</div>' +
      '<div class="codex-card-meta">' +
        '<div class="codex-card-title-row">' +
          '<h4 class="codex-card-name">' + comp.displayName + '</h4>' +
          '<span class="companion-rarity-pill rarity-' + comp.rarity + '">' + tier.name + '</span>' +
        '</div>' +
        '<div class="codex-card-sub"><span class="codex-card-species">' + comp.species + '</span> &bull; <span class="codex-card-personality">' + comp.personality + '</span></div>' +
        '<div class="codex-card-perk">✨ ' + comp.perk + '</div>' +
        (isOwned
          ? '<p class="codex-card-lore">“' + comp.description + '”</p>'
          : '<div class="codex-card-unlock"><strong>Attunement:</strong> ' + comp.unlockCondition + '</div>'
        ) +
      '</div>' +
      '<div class="codex-card-actions">' +
        actionBtnHtml +
        '<button type="button" class="btn-inspect-companion" onclick="openCompanionDetailModal(\x27' + id + '\x27)" title="Inspect entry in Codex">Codex Entry 📖</button>' +
      '</div>';

    codexGrid.appendChild(card);
  });
}

function setCodexFilter(type, value) {
  if (type === "status") {
    codexStatusFilter = value;
    const pills = document.querySelectorAll("#codexStatusPills .codex-pill");
    pills.forEach(function(p) {
      p.classList.toggle("active", p.getAttribute("data-status") === value);
    });
  } else if (type === "element") {
    codexElementFilter = value;
    const pills = document.querySelectorAll("#codexElementPills .codex-pill");
    pills.forEach(function(p) {
      p.classList.toggle("active", p.getAttribute("data-element") === value);
    });
  } else if (type === "rarity") {
    codexRarityFilter = value;
    const pills = document.querySelectorAll("#codexRarityPills .codex-pill");
    pills.forEach(function(p) {
      p.classList.toggle("active", p.getAttribute("data-rarity") === value);
    });
  }
  renderCompanionCodex();
}

function onCodexSearchInput(event) {
  codexSearchQuery = event && event.target ? event.target.value : "";
  renderCompanionCodex();
}

function resetCodexFilters() {
  codexSearchQuery = "";
  codexStatusFilter = "all";
  codexElementFilter = "all";
  codexRarityFilter = "all";

  const searchInput = document.getElementById("codexSearchInput");
  if (searchInput) searchInput.value = "";

  const statusPills = document.querySelectorAll("#codexStatusPills .codex-pill");
  statusPills.forEach(function(p) {
    p.classList.toggle("active", p.getAttribute("data-status") === "all");
  });

  const elemPills = document.querySelectorAll("#codexElementPills .codex-pill");
  elemPills.forEach(function(p) {
    p.classList.toggle("active", p.getAttribute("data-element") === "all");
  });

  const rarityPills = document.querySelectorAll("#codexRarityPills .codex-pill");
  rarityPills.forEach(function(p) {
    p.classList.toggle("active", p.getAttribute("data-rarity") === "all");
  });

  renderCompanionCodex();
}

// Rename Companion Modal Logic
function openCompanionRenameModal() {
  const comp = getActiveCompanion();
  if (!comp) return;

  const modal = document.getElementById("companionRenameModal");
  const input = document.getElementById("companionNameInput");
  const count = document.getElementById("companionNameCount");
  const err = document.getElementById("companionRenameError");

  if (!modal || !input) return;

  input.value = comp.hasCustomName ? comp.displayName : comp.name;
  if (count) count.textContent = input.value.length + " / 20";
  if (err) {
    err.textContent = "";
    err.hidden = true;
  }

  input.oninput = function() {
    if (count) count.textContent = input.value.length + " / 20";
  };

  modal.classList.remove("hidden");
  input.focus();
}

function closeCompanionRenameModal() {
  const modal = document.getElementById("companionRenameModal");
  if (modal) modal.classList.add("hidden");
}

function saveCompanionName() {
  const input = document.getElementById("companionNameInput");
  const err = document.getElementById("companionRenameError");
  if (!input) return;

  const raw = input.value.trim();
  if (!raw) {
    if (err) {
      err.textContent = "Please enter a valid companion name.";
      err.hidden = false;
    }
    return;
  }

  if (raw.length > 20) {
    if (err) {
      err.textContent = "Name must not exceed 20 characters.";
      err.hidden = false;
    }
    return;
  }

  // Sanitize
  const clean = raw.replace(/[<>"'&]/g, "");
  const activeId = companionState.active;

  companionState.customNames[activeId] = clean;
  saveCompanionState();

  renderProfileCompanion();
  renderCompanionsPage();
  renderCompanionCodex();
  closeCompanionRenameModal();
  showToast("Renamed companion to " + clean + "! 🐾", "ember");
}

function resetActiveCompanionName() {
  const activeId = companionState.active;
  if (companionState.customNames[activeId]) {
    delete companionState.customNames[activeId];
    saveCompanionState();
  }
  renderProfileCompanion();
  renderCompanionsPage();
  renderCompanionCodex();
  closeCompanionRenameModal();
  showToast("Companion name reset to default.", "ember");
}

// ============================================
// COMPANION EVOLUTION & METAMORPHOSIS INTERACTIONS
// ============================================

function togglePreviewActiveEvolution() {
  const activeId = companionState.active;
  const curStage = getCompanionEvolutionStage(activeId);
  if (curStage >= 3) return;

  const btn = document.getElementById("btnPreviewEvolution");
  const icon = document.getElementById("previewEvolutionIcon");
  const label = document.getElementById("previewEvolutionLabel");

  if (activeCompanionPreviewStage) {
    // Exit preview: return to current stage
    activeCompanionPreviewStage = null;
    if (btn) btn.classList.remove("active");
    if (icon) icon.textContent = "🔍";
    if (label) label.textContent = "Preview Next";
    if (typeof Companion3DManager !== "undefined") {
      Companion3DManager.loadCompanion(activeId);
    }
    showToast("Returned to current form.", "neutral");
  } else {
    // Enter preview: load next stage model
    const nextStage = curStage + 1;
    const nextData = getCompanionStageData(activeId, nextStage);
    if (!nextData) return;

    activeCompanionPreviewStage = nextStage;
    if (btn) btn.classList.add("active");
    if (icon) icon.textContent = "✕";
    if (label) label.textContent = "Exit Preview";
    if (typeof Companion3DManager !== "undefined") {
      Companion3DManager.loadCompanion(activeId, nextData.modelAsset);
    }
    showToast("Previewing " + nextData.formName + " (" + nextData.title + ")! 🔍", "solas");
  }
}

function promptEvolveActiveCompanion() {
  const activeId = companionState.active;
  const curStage = getCompanionEvolutionStage(activeId);
  if (curStage >= 3) {
    showToast("This companion has already reached its Apex form!", "solas");
    return;
  }

  const nextStage = curStage + 1;
  const curData = getCompanionStageData(activeId, curStage);
  const nextData = getCompanionStageData(activeId, nextStage);
  if (!curData || !nextData) return;

  const isEligible = typeof level === "number" && level >= nextData.minPlayerLevel;
  const modal = document.getElementById("companionEvolutionModal");
  const body = document.getElementById("evolutionModalBody");
  const confirmBtn = document.getElementById("btnConfirmMetamorphosis");

  if (!modal || !body) return;

  body.innerHTML =
    '<div class="evolution-comparison-grid">' +
      '<div class="evolution-compare-card">' +
        '<span class="evolution-compare-badge">Current (Stage ' + curStage + ')</span>' +
        '<h4 class="evolution-compare-name">' + curData.formName + '</h4>' +
        '<span class="evolution-compare-species">' + curData.species + '</span>' +
        '<span class="companion-rarity-pill rarity-' + curData.rarity + '" style="font-size:0.68rem;padding:2px 8px;">' + curData.rarity.toUpperCase() + '</span>' +
      '</div>' +
      '<div class="evolution-compare-arrow">➔</div>' +
      '<div class="evolution-compare-card target-form">' +
        '<span class="evolution-compare-badge">Metamorphosis (Stage ' + nextStage + ')</span>' +
        '<h4 class="evolution-compare-name">' + nextData.formName + '</h4>' +
        '<span class="evolution-compare-species">' + nextData.species + '</span>' +
        '<span class="companion-rarity-pill rarity-' + nextData.rarity + '" style="font-size:0.68rem;padding:2px 8px;">' + nextData.rarity.toUpperCase() + '</span>' +
      '</div>' +
    '</div>' +
    '<div class="evolution-details-box">' +
      '<div class="evolution-trait-item">' +
        '<span class="trait-bullet">✦</span>' +
        '<div><strong>Visual Awakening:</strong> ' + nextData.visualTraits + '</div>' +
      '</div>' +
      '<div class="evolution-trait-item">' +
        '<span class="trait-bullet">✨</span>' +
        '<div><strong>Enhanced Blessing:</strong> <span style="color:#fbbf24;">' + nextData.perk + '</span></div>' +
      '</div>' +
      '<div class="evolution-trait-item">' +
        '<span class="trait-bullet">📜</span>' +
        '<div><strong>Ancient Lore:</strong> “' + nextData.lore + '”</div>' +
      '</div>' +
    '</div>' +
    '<div class="evolution-eligibility-banner ' + (isEligible ? "eligible" : "locked") + '">' +
      (isEligible
        ? '<span>✅ <strong>Eligible:</strong> You have reached Level ' + level + ' (Requires Level ' + nextData.minPlayerLevel + '). Ready for Metamorphosis!</span>'
        : '<span>🔒 <strong>Locked:</strong> Requires Player Level ' + nextData.minPlayerLevel + ' (You are Level ' + level + '). Complete more quests to evolve!</span>'
      ) +
    '</div>';

  if (confirmBtn) {
    confirmBtn.disabled = !isEligible;
    confirmBtn.style.opacity = isEligible ? "1" : "0.5";
    confirmBtn.style.pointerEvents = isEligible ? "auto" : "none";
  }

  modal.classList.remove("hidden");
}

function closeCompanionEvolutionModal() {
  const modal = document.getElementById("companionEvolutionModal");
  if (modal) modal.classList.add("hidden");
}

function confirmActiveCompanionEvolution() {
  const activeId = companionState.active;
  const curStage = getCompanionEvolutionStage(activeId);
  if (curStage >= 3) return;

  const nextStage = curStage + 1;
  const nextData = getCompanionStageData(activeId, nextStage);
  if (!nextData) return;

  if (typeof level === "number" && level < nextData.minPlayerLevel) {
    showToast("Player level requirement not yet met!", "ember");
    return;
  }

  closeCompanionEvolutionModal();
  activeCompanionPreviewStage = null;

  // 1. Advance state
  if (!companionState.evolutions) companionState.evolutions = {};
  companionState.evolutions[activeId] = nextStage;
  saveCompanionState();

  // 2. Metamorphosis Visual Glow on Pedestal
  const stageEl = document.getElementById("activeCompanionStage");
  if (stageEl) {
    stageEl.classList.remove("metamorphosis-active");
    void stageEl.offsetWidth; // Force reflow
    stageEl.classList.add("metamorphosis-active");
    setTimeout(function() {
      if (stageEl) stageEl.classList.remove("metamorphosis-active");
    }, 1800);
  }

  // 3. Audio & Particle FX
  if (typeof playLevelUpSound === "function") {
    playLevelUpSound();
  } else if (typeof playCoinSound === "function") {
    playCoinSound();
  }
  spawnEvolutionBurstParticles();

  // 4. Load evolved 3D model
  if (typeof Companion3DManager !== "undefined") {
    Companion3DManager.loadCompanion(activeId, nextData.modelAsset);
    Companion3DManager.playReaction();
  }

  // 5. Toast & Dialogue
  showToast("🌟 METAMORPHOSIS COMPLETE! " + nextData.formName + " awakened! 🌟", "solas");
  triggerCompanionReaction("levelUp", "Behold my true awakened form, Adventurer! Our bond grows ever stronger!");

  // 6. Refresh UI
  renderCompanionsPage();
  renderProfileCompanion();
  renderCompanionCodex();
}

function spawnEvolutionBurstParticles() {
  const animLayer = document.getElementById("rpgAnimationLayer");
  const stage = document.getElementById("activeCompanionStage");
  if (!animLayer) return;

  const rect = stage ? stage.getBoundingClientRect() : {
    left: window.innerWidth / 2 - 100,
    top: window.innerHeight / 2 - 100,
    width: 200,
    height: 200
  };

  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const sparkSymbols = ["✦", "✧", "✨", "★", "🌟", "⚡", "ᛟ"];

  for (let i = 0; i < 28; i++) {
    const p = document.createElement("div");
    p.className = "evolution-spark-particle";
    const symbol = sparkSymbols[i % sparkSymbols.length];
    p.textContent = symbol;
    p.style.position = "fixed";
    p.style.left = centerX + "px";
    p.style.top = centerY + "px";
    p.style.fontSize = (14 + Math.random() * 16) + "px";
    p.style.color = (i % 2 === 0) ? "#fbbf24" : "#c084fc";
    p.style.textShadow = "0 0 10px " + (i % 2 === 0 ? "#f59e0b" : "#a855f7");
    p.style.pointerEvents = "none";
    p.style.zIndex = "9999";
    p.style.transition = "transform 1.2s cubic-bezier(0.1, 0.8, 0.3, 1), opacity 1.2s ease-out";
    animLayer.appendChild(p);

    const angle = (i / 28) * Math.PI * 2 + (Math.random() * 0.3);
    const dist = 90 + Math.random() * 160;
    const destX = Math.cos(angle) * dist;
    const destY = Math.sin(angle) * dist - 30;

    requestAnimationFrame(function() {
      p.style.transform = "translate(" + destX + "px, " + destY + "px) scale(" + (0.5 + Math.random() * 1.2) + ") rotate(" + (Math.random() * 360) + "deg)";
      p.style.opacity = "0";
    });

    setTimeout(function() {
      if (p.parentNode) p.parentNode.removeChild(p);
    }, 1300);
  }
}

// Companion Detail Inspector Modal

// ============================================
// MODAL 3D COMPANION INSPECTOR VIEWER
// ============================================

const Modal3DViewer = {
  isInitialized: false,
  renderer: null,
  scene: null,
  camera: null,
  controls: null,
  mixer: null,
  actions: {},
  clock: null,
  currentModel: null,
  animFrameId: null,
  activeCompanionId: null,
  hostEl: null,
  pedestalRune: null,
  keyLight: null,
  rimLight: null,
  runeMat: null,

  init: function(hostEl) {
    if (typeof THREE === "undefined") return false;
    this.hostEl = hostEl;
    if (!this.hostEl) return false;

    const width = this.hostEl.clientWidth || 380;
    const height = this.hostEl.clientHeight || 230;

    if (!this.renderer) {
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
      this.camera.position.set(0, 0.82, 2.2);

      const ambient = new THREE.AmbientLight(0xfff8ee, 0.85);
      this.scene.add(ambient);

      this.keyLight = new THREE.DirectionalLight(0xfffaed, 0.95);
      this.keyLight.position.set(1.6, 3.0, 2.0);
      this.keyLight.castShadow = true;
      this.scene.add(this.keyLight);

      this.rimLight = new THREE.PointLight(0xa855f7, 0.8, 8);
      this.rimLight.position.set(0, 1.8, -1.8);
      this.scene.add(this.rimLight);

      const pGeo = new THREE.CylinderGeometry(0.82, 0.88, 0.08, 32);
      const pMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.8 });
      const ped = new THREE.Mesh(pGeo, pMat);
      ped.position.set(0, -0.04, 0);
      ped.receiveShadow = true;
      this.scene.add(ped);

      const rGeo = new THREE.RingGeometry(0.62, 0.76, 32);
      rGeo.rotateX(-Math.PI / 2);
      this.runeMat = new THREE.MeshBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.7, side: THREE.DoubleSide });
      this.pedestalRune = new THREE.Mesh(rGeo, this.runeMat);
      this.pedestalRune.position.set(0, 0.005, 0);
      this.scene.add(this.pedestalRune);

      if (typeof THREE.OrbitControls !== "undefined") {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.08;
        this.controls.enablePan = false;
        this.controls.target.set(0, 0.42, 0);
        this.controls.minDistance = 1.2;
        this.controls.maxDistance = 3.5;
        this.controls.maxPolarAngle = Math.PI / 2 + 0.05;
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 1.4;
      }

      this.clock = new THREE.Clock();
      this.isInitialized = true;
    }

    this.hostEl.innerHTML = "";
    this.hostEl.appendChild(this.renderer.domElement);
    this.onResize();

    const self = this;
    this.hostEl.onclick = function() {
      self.playReaction();
    };

    return true;
  },

  onResize: function() {
    if (!this.hostEl || !this.renderer || !this.camera) return;
    const width = this.hostEl.clientWidth;
    const height = this.hostEl.clientHeight;
    if (width > 0 && height > 0) {
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    }
  },

  load: function(companionId, modelAsset, elementKey) {
    const host = document.getElementById("companionModal3DHost");
    if (!host || !this.init(host)) return;

    this.stop();

    const elemColors = {
      fire: 0xef4444,
      water: 0x06b6d4,
      earth: 0x10b981,
      wind: 0x14b8a6,
      light: 0xf59e0b,
      shadow: 0x8b5cf6,
      arcane: 0xd946ef
    };
    const c = elemColors[elementKey] || 0xa855f7;
    if (this.rimLight) this.rimLight.color.setHex(c);
    if (this.runeMat) this.runeMat.color.setHex(c);

    if (this.currentModel) {
      this.scene.remove(this.currentModel);
      this.currentModel = null;
    }

    const self = this;
    const loader = new THREE.GLTFLoader();

    loader.load(
      modelAsset,
      function(gltf) {
        self.currentModel = gltf.scene;
        self.currentModel.position.set(0, 0, 0);
        self.currentModel.traverse(function(child) {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        self.scene.add(self.currentModel);
        self.activeCompanionId = companionId;

        self.mixer = null;
        self.actions = {};
        if (gltf.animations && gltf.animations.length > 0) {
          self.mixer = new THREE.AnimationMixer(self.currentModel);
          const idleClip = THREE.AnimationClip.findByName(gltf.animations, "idle") || gltf.animations[0];
          if (idleClip) {
            const idleAction = self.mixer.clipAction(idleClip);
            idleAction.play();
            self.actions.idle = idleAction;
          }
          const reactClip = THREE.AnimationClip.findByName(gltf.animations, "react") || THREE.AnimationClip.findByName(gltf.animations, "jump");
          if (reactClip) {
            const reactAction = self.mixer.clipAction(reactClip);
            reactAction.setLoop(THREE.LoopOnce);
            reactAction.clampWhenFinished = true;
            self.actions.react = reactAction;
          }
        }

        self.resetCamera();
        self.start();
      },
      undefined,
      function(err) {
        console.warn("Could not load model for modal:", err);
      }
    );
  },

  animate: function() {
    const self = this;
    this.animFrameId = requestAnimationFrame(function() {
      self.animate();
    });

    const delta = this.clock ? this.clock.getDelta() : 0.016;
    if (this.controls) this.controls.update();
    if (this.mixer) this.mixer.update(delta);
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  },

  start: function() {
    if (!this.animFrameId) {
      if (this.clock) this.clock.start();
      this.animate();
    }
  },

  stop: function() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.currentModel && this.scene) {
      this.scene.remove(this.currentModel);
      this.currentModel = null;
    }
  },

  playReaction: function() {
    if (this.actions && this.actions.react) {
      this.actions.react.reset();
      this.actions.react.fadeIn(0.12).play();
      if (this.actions.idle) this.actions.idle.fadeOut(0.12);
      const self = this;
      setTimeout(function() {
        if (self.actions.idle) self.actions.idle.reset().fadeIn(0.2).play();
      }, 1200);
    }
    playCoinSound();
  },

  resetCamera: function() {
    if (!this.camera || !this.controls) return;
    this.camera.position.set(0, 0.82, 2.2);
    this.controls.target.set(0, 0.42, 0);
    this.controls.update();
  }
};

window.resetModalCompanion3DCamera = function() {
  if (Modal3DViewer) Modal3DViewer.resetCamera();
};

let currentCodexModalCompanionId = null;
let currentCodexModalStage = 1;

function switchCodexPreviewStage(id, stage) {
  currentCodexModalStage = stage;
  const comp = COMPANION_CATALOG[id];
  const stageData = getCompanionStageData(id, stage);
  if (!comp || !stageData) return;

  const tabs = document.querySelectorAll(".evolution-stage-tab");
  tabs.forEach(function(tab) {
    tab.classList.toggle("active", Number(tab.getAttribute("data-stage")) === stage);
  });

  const stageBadgeEl = document.getElementById("codexModalStageBadge");
  if (stageBadgeEl) {
    stageBadgeEl.textContent = "Stage " + stage + " (" + stageData.title + ") • Req. Lv " + stageData.minPlayerLevel;
  }

  const nameEl = document.getElementById("codexModalName");
  if (nameEl) nameEl.textContent = stageData.formName;

  const speciesEl = document.getElementById("codexModalSpecies");
  if (speciesEl) speciesEl.textContent = stageData.species;

  const perkEl = document.getElementById("codexModalPerk");
  if (perkEl) perkEl.textContent = stageData.perk;

  const loreEl = document.getElementById("codexModalLore");
  if (loreEl) loreEl.textContent = "“" + stageData.lore + "”";

  const traitsEl = document.getElementById("codexModalTraits");
  if (traitsEl) traitsEl.textContent = stageData.visualTraits;

  if (typeof Modal3DViewer !== "undefined" && stageData.modelAsset) {
    Modal3DViewer.load(id, stageData.modelAsset, comp.element);
  }
}

function openCompanionDetailModal(id) {
  const comp = getCompanion(id);
  if (!comp) return;

  currentCodexModalCompanionId = id;
  const curUnlockedStage = getCompanionEvolutionStage(id);
  currentCodexModalStage = curUnlockedStage;

  const modal = document.getElementById("companionDetailModal");
  const title = document.getElementById("companionDetailTitle");
  const body = document.getElementById("companionDetailBody");
  const foot = document.getElementById("companionDetailFoot");

  if (!modal || !body || !foot) return;

  const aff = ELEMENT_AFFINITIES[comp.element] || { symbol: "✨", name: "Arcane", badgeClass: "elem-arcane", title: "Aether" };
  const tier = RARITY_TIERS[comp.rarity] || { name: comp.rarity };

  if (title) title.textContent = comp.displayName + " — Codex Bestiary";

  const isOwned = isCompanionOwned(id);
  const isActive = companionState.active === id;

  const has3D = Boolean(comp.modelAsset && typeof THREE !== "undefined" && Companion3DManager && Companion3DManager.isSupported);

  let avatarMarkup = "";
  if (has3D) {
    avatarMarkup =
      '<div class="companion-modal-3d-wrapper">' +
        '<div id="companionModal3DHost" class="companion-modal-3d-host"></div>' +
        '<div class="companion-modal-3d-controls">' +
          '<span class="modal-3d-hint">👆 Drag to inspect 360° &bull; Click to pet</span>' +
          '<button type="button" class="btn-3d-tool btn-modal-reset" onclick="resetModalCompanion3DCamera()" title="Reset view">🎯 Reset</button>' +
        '</div>' +
      '</div>';
  } else {
    avatarMarkup =
      '<div class="companion-detail-avatar-wrap ' + aff.badgeClass + ' rarity-' + comp.rarity + '">' +
        '<img src="' + comp.asset + '" alt="' + comp.displayName + '" class="companion-detail-avatar-img">' +
      '</div>';
  }

  // 3-Stage Evolution Tree Selector
  const evoStages = (COMPANION_EVOLUTION_PATHS[id] && COMPANION_EVOLUTION_PATHS[id].stages) || [];
  let evoTreeMarkup = "";
  if (evoStages.length > 0) {
    evoTreeMarkup =
      '<div class="codex-evolution-tree">' +
        '<div class="evolution-tree-head">' +
          '<span class="evolution-tree-label">Evolution Metamorphosis Tree</span>' +
          '<span id="codexModalStageBadge" style="font-size:0.72rem;color:#d8b4fe;font-weight:600;">Stage ' + curUnlockedStage + ' (' + comp.stageTitle + ')</span>' +
        '</div>' +
        '<div class="evolution-tree-tabs" id="codexEvolutionTabs">';

    evoStages.forEach(function(stg) {
      const isSelected = stg.stage === curUnlockedStage;
      const isUnlocked = stg.stage <= curUnlockedStage;
      evoTreeMarkup +=
        '<button type="button" class="evolution-stage-tab' + (isSelected ? ' active' : '') + '" data-stage="' + stg.stage + '" onclick="switchCodexPreviewStage(\x27' + id + '\x27, ' + stg.stage + ')">' +
          '<span class="tab-stage-num">Stage ' + stg.stage + (isUnlocked ? ' ✦' : ' 🔒') + '</span>' +
          '<span>' + stg.formName + '</span>' +
        '</button>';
    });

    evoTreeMarkup +=
        '</div>' +
      '</div>';
  }

  body.innerHTML =
    avatarMarkup +
    evoTreeMarkup +
    '<div class="companion-detail-header-block">' +
      '<h4><span id="codexModalName">' + comp.displayName + '</span> <span id="codexModalSpecies" class="companion-species-pill">' + comp.species + '</span></h4>' +
      '<div class="companion-detail-tags" style="display:flex;gap:8px;justify-content:center;margin-top:6px;">' +
        '<span class="companion-element-pill ' + aff.badgeClass + '">' + aff.symbol + ' ' + aff.name + ' (' + aff.title + ')</span>' +
        '<span class="companion-rarity-pill rarity-' + comp.rarity + '">' + tier.name + ' Familiar</span>' +
      '</div>' +
    '</div>' +
    '<div class="companion-traits-row" style="margin-top:10px;"><span class="trait-label">Visual Awakening:</span> <span id="codexModalTraits" class="trait-value">' + (comp.visualTraits || "Base familiar aesthetics") + '</span></div>' +
    '<div class="companion-traits-row" style="margin-top:6px;"><span class="trait-label">Temperament:</span> <span class="trait-value">' + comp.personality + '</span></div>' +
    '<p class="companion-detail-lore" id="codexModalLore">“' + comp.description + '”</p>' +
    '<div class="companion-aura-card" style="width: 100%;">' +
      '<span class="aura-icon" aria-hidden="true">✨</span>' +
      '<div class="aura-content">' +
        '<span class="aura-title">Companion Blessing</span>' +
        '<span class="aura-desc" id="codexModalPerk">' + comp.perk + '</span>' +
      '</div>' +
    '</div>' +
    '<div class="companion-detail-unlock">' +
      '<strong>Attunement &amp; Origin:</strong> ' + comp.unlockCondition +
      (!isOwned ? '<div style="margin-top:4px;color:var(--text-amber, #f59e0b);font-size:0.82rem;">🔒 Status: Undiscovered &bull; Complete the attunement condition to befriend this familiar.</div>' : '<div style="margin-top:4px;color:var(--text-green, #22c55e);font-size:0.82rem;">✦ Status: Attuned &bull; Available in your sanctuary roster.</div>') +
    '</div>';

  let footHtml = '<button type="button" class="btn-ghost" onclick="closeCompanionDetailModal()">Close</button>';
  if (isActive) {
    footHtml += '<button type="button" class="btn-equip-companion" disabled>Currently Journeying With You 🐾</button>';
  } else if (isOwned) {
    footHtml += '<button type="button" class="btn-equip-companion" onclick="setActiveCompanion(\x27' + id + '\x27); closeCompanionDetailModal();">Equip Familiar 🐾</button>';
  } else if (comp.unlockType === "shop") {
    footHtml += '<button type="button" class="btn-primary" onclick="closeCompanionDetailModal(); switchPage(\x27shop\x27); filterShop(\x27companion\x27);">Adopt in Shop 🪙</button>';
  }

  foot.innerHTML = footHtml;
  modal.classList.remove("hidden");
  if (has3D) {
    setTimeout(function() {
      Modal3DViewer.load(comp.id, comp.modelAsset, comp.element);
    }, 60);
  }
}

function closeCompanionDetailModal() {
  if (typeof Modal3DViewer !== "undefined") {
    Modal3DViewer.stop();
  }
  const modal = document.getElementById("companionDetailModal");
  if (modal) modal.classList.add("hidden");
}


// ============================================
// GEARS & INVENTORY CATALOG
// ============================================
const ITEM_CATALOG = {
  // COMPANION ADOPTIONS
  companion_solas: {
    key: "companion_solas",
    companionId: "solas",
    name: "Solas (Solar Phoenix)",
    type: "companion",
    rarity: "mythical",
    asset: "assets/companions/solas.svg",
    icon: "☀️",
    lore: "A mythical solar phoenix chick hatched from a fallen star fragment. Solas grants +10% Quest XP & +10% Gold Bounty.",
    sellValue: 0
  },
  // COMPANION ADOPTIONS
  companion_ember: {
    key: "companion_ember",
    companionId: "ember",
    name: "Ember (Baby Dragon)",
    type: "companion",
    rarity: "epic",
    asset: "assets/companions/ember.svg",
    icon: "🐉",
    lore: "A tiny dragon with an enormous personality. Ember's fiery loyalty grants +5% Critical Bounty Luck.",
    sellValue: 0
  },
  companion_boo: {
    key: "companion_boo",
    companionId: "boo",
    name: "Boo (Little Ghost)",
    type: "companion",
    rarity: "epic",
    asset: "assets/companions/boo.svg",
    icon: "👻",
    lore: "A mysterious little wisp who quietly floats along. Boo grants +5% Arcane Shard Drop Rate.",
    sellValue: 0
  },
  companion_lumi: {
    key: "companion_lumi",
    companionId: "lumi",
    name: "Lumi (Frost Wolf)",
    type: "companion",
    rarity: "legendary",
    asset: "assets/companions/lumi.svg",
    icon: "🐺",
    lore: "A loyal little frost wolf puppy with icy sapphire eyes. Lumi grants a +5% All Attributes Aura.",
    sellValue: 0
  },

  // WEAPONS
  apprentice_spellblade: {
    key: "apprentice_spellblade",
    name: "Apprentice Spellblade",
    type: "weapon",
    rarity: "common",
    icon: "⚔️",
    stats: { str: 2 },
    goldPercent: 5,
    lore: "A balanced steel blade forged with attuned conduits that focus arcane energy into physical strikes.",
    sellValue: 20
  },
  shadow_dagger: {
    key: "shadow_dagger",
    name: "Shadowfang Dagger",
    type: "weapon",
    rarity: "rare",
    icon: "🗡️",
    stats: { str: 5, lck: 3 },
    goldPercent: 12,
    critPercent: 6,
    lore: "Coated in dark night essence, slipping between the seams of armor to reap bounty.",
    sellValue: 65
  },
  void_slayer: {
    key: "void_slayer",
    name: "Void Reaver Blade",
    type: "weapon",
    rarity: "epic",
    icon: "⚡",
    stats: { str: 10, int: 5, lck: 5 },
    goldPercent: 25,
    critPercent: 12,
    lore: "A legendary greatsword carved from a fallen celestial meteorite.",
    sellValue: 180
  },

  // ARMOR
  initiate_robes: {
    key: "initiate_robes",
    name: "Initiate Robes",
    type: "armor",
    rarity: "common",
    icon: "🛡️",
    stats: { end: 2 },
    shields: 1,
    lore: "Woven from thick enchanted linen, protecting the bearer from exhaustion.",
    sellValue: 20
  },
  runic_mail: {
    key: "runic_mail",
    name: "Runic Battleplate",
    type: "armor",
    rarity: "rare",
    icon: "🥋",
    stats: { end: 6, int: 3 },
    shields: 2,
    lore: "Heavy iron interlaced with glowing runes that absorb harsh shocks.",
    sellValue: 70
  },

  // HELMET
  scholars_circlet: {
    key: "scholars_circlet",
    name: "Scholar's Circlet",
    type: "helmet",
    rarity: "common",
    icon: "👑",
    stats: { int: 2 },
    xpPercent: 5,
    lore: "A brass diadem holding a minor gem of clarity, sharpening adventurer concentration.",
    sellValue: 20
  },
  crown_of_clarity: {
    key: "crown_of_clarity",
    name: "Crown of the Archmage",
    type: "helmet",
    rarity: "epic",
    icon: "🔮",
    stats: { int: 8, end: 4 },
    xpPercent: 20,
    lore: "A regal helm pulsing with arcane mana that expands intellectual horizons.",
    sellValue: 150
  },

  // BOOTS
  travelers_boots: {
    key: "travelers_boots",
    name: "Traveler's Boots",
    type: "boots",
    rarity: "common",
    icon: "👢",
    stats: { lck: 2 },
    critPercent: 5,
    lore: "Hardened leather greaves that tread lightly on dangerous trails.",
    sellValue: 20
  },
  boots_of_the_wind: {
    key: "boots_of_the_wind",
    name: "Striders of the Wind",
    type: "boots",
    rarity: "rare",
    icon: "🥾",
    stats: { lck: 6, str: 3 },
    critPercent: 12,
    lore: "Whispers of wind follow every stride, carrying the wearer towards hidden treasures.",
    sellValue: 75
  },

  // RELICS
  ring_of_focus: {
    key: "ring_of_focus",
    name: "Ring of Celestial Focus",
    type: "relic",
    rarity: "rare",
    icon: "💍",
    stats: { str: 2, int: 2, end: 2, lck: 2 },
    goldPercent: 5,
    xpPercent: 5,
    lore: "Forged under alignment of twin moons, imbuing all faculties with balance.",
    sellValue: 90
  },

  // CONSUMABLES
  minor_xp_elixir: {
    key: "minor_xp_elixir",
    name: "Elixir of Insight",
    type: "consumable",
    rarity: "rare",
    icon: "🧪",
    effect: "xp",
    value: 35,
    lore: "A luminous azure draught that immediately infuses your mind with +35 XP.",
    sellValue: 15
  },
  pouch_of_gold: {
    key: "pouch_of_gold",
    name: "Pouch of Ancient Coins",
    type: "consumable",
    rarity: "common",
    icon: "💰",
    effect: "gold",
    value: 75,
    lore: "A velvet pouch clinking with 75 gold coins from a forgotten empire.",
    sellValue: 75
  },

  // MATERIALS
  iron_ore: {
    key: "iron_ore",
    name: "Shadow Iron Ore",
    type: "material",
    rarity: "common",
    icon: "⛏️",
    lore: "High-grade dense iron ore, primed for blacksmith forging and gear refinement.",
    sellValue: 12
  },
  arcane_dust: {
    key: "arcane_dust",
    name: "Arcane Star Dust",
    type: "material",
    rarity: "rare",
    icon: "✨",
    lore: "Finely ground crystalline starlight, required for enchanting powerful equipment.",
    sellValue: 25
  }
};

function makeItemInstance(key) {
  const template = ITEM_CATALOG[key];
  if (!template) return null;
  return Object.assign({}, template, {
    id: "item_" + Date.now() + "_" + Math.floor(Math.random() * 100000)
  });
}

// ============================================
// RPG ITEM VISUALIZATION SYSTEM (Asset Architecture)
// ============================================

const ITEM_ASSETS = {
  apprentice_spellblade: {
    src: "assets/items/apprentice_spellblade.svg",
    fallbackSrc: "assets/items/apprentice_spellblade.png",
    alt: "Apprentice Spellblade"
  },
  shadow_dagger: {
    src: "assets/items/shadow_dagger.svg",
    fallbackSrc: "assets/items/shadow_dagger.png",
    alt: "Shadowfang Dagger"
  },
  void_slayer: {
    src: "assets/items/void_slayer.svg",
    fallbackSrc: "assets/items/void_slayer.png",
    alt: "Void Reaver Blade"
  },
  initiate_robes: {
    src: "assets/items/initiate_robes.svg",
    fallbackSrc: "assets/items/initiate_robes.png",
    alt: "Initiate Robes"
  },
  runic_mail: {
    src: "assets/items/runic_mail.svg",
    fallbackSrc: "assets/items/runic_mail.png",
    alt: "Runic Battleplate"
  },
  scholars_circlet: {
    src: "assets/items/scholars_circlet.svg",
    fallbackSrc: "assets/items/scholars_circlet.png",
    alt: "Scholar's Circlet"
  },
  crown_of_clarity: {
    src: "assets/items/crown_of_clarity.svg",
    fallbackSrc: "assets/items/crown_of_clarity.png",
    alt: "Crown of the Archmage"
  },
  travelers_boots: {
    src: "assets/items/travelers_boots.svg",
    fallbackSrc: "assets/items/travelers_boots.png",
    alt: "Traveler's Boots"
  },
  boots_of_the_wind: {
    src: "assets/items/boots_of_the_wind.svg",
    fallbackSrc: "assets/items/boots_of_the_wind.png",
    alt: "Striders of the Wind"
  },
  ring_of_focus: {
    src: "assets/items/ring_of_focus.svg",
    fallbackSrc: "assets/items/ring_of_focus.png",
    alt: "Ring of Celestial Focus"
  },
  minor_xp_elixir: {
    src: "assets/items/minor_xp_elixir.svg",
    fallbackSrc: "assets/items/minor_xp_elixir.png",
    alt: "Elixir of Insight"
  },
  pouch_of_gold: {
    src: "assets/items/pouch_of_gold.svg",
    fallbackSrc: "assets/items/pouch_of_gold.png",
    alt: "Pouch of Ancient Coins"
  },
  iron_ore: {
    src: "assets/items/iron_ore.svg",
    fallbackSrc: "assets/items/iron_ore.png",
    alt: "Shadow Iron Ore"
  },
  arcane_dust: {
    src: "assets/items/arcane_dust.svg",
    fallbackSrc: "assets/items/arcane_dust.png",
    alt: "Arcane Star Dust"
  }
};

const SLOT_ASSETS = {
  weapon: { src: "assets/items/slot_weapon.svg", fallbackSrc: "assets/items/slot_weapon.png", alt: "Weapon Slot" },
  armor: { src: "assets/items/slot_armor.svg", fallbackSrc: "assets/items/slot_armor.png", alt: "Armor Slot" },
  helmet: { src: "assets/items/slot_helmet.svg", fallbackSrc: "assets/items/slot_helmet.png", alt: "Headgear Slot" },
  boots: { src: "assets/items/slot_boots.svg", fallbackSrc: "assets/items/slot_boots.png", alt: "Boots Slot" },
  relic: { src: "assets/items/slot_relic.svg", fallbackSrc: "assets/items/slot_relic.png", alt: "Relic Slot" }
};

const CURRENCY_ASSETS = {
  gold: { src: "assets/items/currency_gold.svg", fallbackSrc: "assets/items/currency_gold.png", alt: "Gold Coins" },
  shard: { src: "assets/items/currency_shard.svg", fallbackSrc: "assets/items/currency_shard.png", alt: "Arcane Shards" }
};

function getItemAsset(itemOrKey) {
  const key = typeof itemOrKey === "string" ? itemOrKey : (itemOrKey && itemOrKey.key ? itemOrKey.key : null);
  return (key && ITEM_ASSETS[key]) ? ITEM_ASSETS[key] : null;
}

function renderItemVisual(itemOrKey, options) {
  options = options || {};
  const size = options.size || "md";
  const showRarityFrame = options.frame !== false;
  const showTier = options.showTier !== false;
  const extraClass = options.className || "";

  const item = typeof itemOrKey === "string" ? ITEM_CATALOG[itemOrKey] : itemOrKey;
  if (!item) {
    return '<div class="rpg-item-art is-empty ' + extraClass + '"></div>';
  }

  const asset = getItemAsset(item.key);
  const rarity = item.rarity || "common";
  const tier = (item.refineLevel && item.refineLevel > 0) ? "+" + item.refineLevel : null;
  const altText = item.name || "RPG Item";

  let html = '<div class="rpg-item-art size-' + size + ' rarity-' + rarity + (showRarityFrame ? ' has-frame' : '') + ' ' + extraClass + '" data-rarity="' + rarity + '" data-item-key="' + (item.key || '') + '">';
  html += '<div class="rpg-item-glow" aria-hidden="true"></div>';

  if (asset && asset.src) {
    html += '<img class="rpg-item-img" src="' + asset.src + '" alt="' + escapeHtml(altText) + '" loading="lazy" onerror="this.onerror=null; if(this.dataset.fallback){this.src=this.dataset.fallback;}" data-fallback="' + (asset.fallbackSrc || '') + '" />';
  } else {
    html += '<div class="rpg-item-fallback-icon" aria-hidden="true">' + (item.icon || '⚔️') + '</div>';
  }

  if (showTier && tier) {
    html += '<span class="rpg-item-tier-badge">' + tier + '</span>';
  }

  html += '</div>';
  return html;
}

function renderSlotPlaceholder(slotKey) {
  const asset = SLOT_ASSETS[slotKey] || SLOT_ASSETS.weapon;
  return '<div class="rpg-slot-empty-art"><img class="rpg-slot-silhouette" src="' + asset.src + '" alt="' + asset.alt + '" aria-hidden="true" onerror="this.onerror=null; if(this.dataset.fallback){this.src=this.dataset.fallback;}" data-fallback="' + asset.fallbackSrc + '" /></div>';
}

function renderItemThumbnail(key, label) {
  const asset = ITEM_ASSETS[key];
  if (!asset) return '';
  return '<img class="cost-chip-thumb" src="' + asset.src + '" alt="' + (label || key) + '" aria-hidden="true" onerror="this.onerror=null; if(this.dataset.fallback){this.src=this.dataset.fallback;}" data-fallback="' + asset.fallbackSrc + '" />';
}

function renderCurrencyIcon(type) {
  const asset = CURRENCY_ASSETS[type] || CURRENCY_ASSETS.gold;
  return '<img class="cost-chip-currency" src="' + asset.src + '" alt="' + asset.alt + '" aria-hidden="true" onerror="this.onerror=null; if(this.dataset.fallback){this.src=this.dataset.fallback;}" data-fallback="' + asset.fallbackSrc + '" />';
}

// Equipped Gear state
let equipped = {
  weapon: null,
  armor: null,
  helmet: null,
  boots: null,
  relic: null
};

// Bag Inventory state (max 20)
let inventory = [];

try {
  const savedEquipped = JSON.parse(localStorage.getItem("quest_equipped"));
  if (savedEquipped && typeof savedEquipped === "object") {
    equipped = Object.assign(equipped, savedEquipped);
  } else {
    equipped.weapon = makeItemInstance("apprentice_spellblade");
    equipped.armor = makeItemInstance("initiate_robes");
    equipped.helmet = makeItemInstance("scholars_circlet");
    equipped.boots = makeItemInstance("travelers_boots");
    equipped.relic = null;
  }
} catch (e) {
  equipped.weapon = makeItemInstance("apprentice_spellblade");
  equipped.armor = makeItemInstance("initiate_robes");
  equipped.helmet = makeItemInstance("scholars_circlet");
  equipped.boots = makeItemInstance("travelers_boots");
}

try {
  const savedInventory = JSON.parse(localStorage.getItem("quest_inventory"));
  if (Array.isArray(savedInventory)) {
    inventory = savedInventory;
  } else {
    inventory = [
      makeItemInstance("minor_xp_elixir"),
      makeItemInstance("pouch_of_gold"),
      makeItemInstance("iron_ore"),
      makeItemInstance("arcane_dust")
    ].filter(Boolean);
  }
} catch (e) {
  inventory = [
    makeItemInstance("minor_xp_elixir"),
    makeItemInstance("pouch_of_gold"),
    makeItemInstance("iron_ore"),
    makeItemInstance("arcane_dust")
  ].filter(Boolean);
}

// Inspection context for #itemModal
let activeInspectedItem = null;
let activeInspectSource = null; // "equipped" or "bag"
let activeInspectSlot = null;
let activeInspectIndex = null;

// Difficulty catalogue: XP rewards, Gold bounties, and pips
const DIFFICULTY = {
  easy:   { label: "Easy",   xp: 10, gold: 15, pips: 1 },
  medium: { label: "Medium", xp: 20, gold: 35, pips: 2 },
  hard:   { label: "Hard",   xp: 50, gold: 80, pips: 3 }
};
const DIFFICULTY_ORDER = ["easy", "medium", "hard"];

// Fall back to medium for older quests that were saved without a difficulty
function getDifficulty(key) {
  return DIFFICULTY[key] || DIFFICULTY.medium;
}

// Rank ladder, shared by the title helper and the Chronicles panel
const RANKS = [
  { level: 1, title: "Beginner Adventurer" },
  { level: 5, title: "Skilled Adventurer" },
  { level: 10, title: "Elite Adventurer" },
  { level: 20, title: "Master Adventurer" },
  { level: 30, title: "Legendary Adventurer" }
];

// Achievements are derived at render time from saved progress only
const ACHIEVEMENTS = [
  { name: "First Victory", glyph: "✦", requirement: "Complete 1 quest", test: function(s) { return s.completed >= 1; } },
  { name: "Ten Trials", glyph: "◆", requirement: "Complete 10 quests", test: function(s) { return s.completed >= 10; } },
  { name: "Ascendant", glyph: "✧", requirement: "Reach level 5", test: function(s) { return s.level >= 5; } },
  { name: "Living Legend", glyph: "✷", requirement: "Reach level 30", test: function(s) { return s.level >= 30; } }
];

// 2. Save the current progress
function saveProgress() {
  localStorage.setItem("quests", JSON.stringify(quests));
  localStorage.setItem("xp", xp);
  localStorage.setItem("level", level);
  localStorage.setItem("quest_gold", gold);
  localStorage.setItem("quest_shards", shards);
  localStorage.setItem("quest_stats", JSON.stringify(stats));
  localStorage.setItem("quest_equipped", JSON.stringify(equipped));
  localStorage.setItem("quest_inventory", JSON.stringify(inventory));
  if (typeof syncActiveAccountRecord === "function") {
    syncActiveAccountRecord();
  }
}

// ============================================
// 2b. Daily streak system
// One credit per local calendar day; a missed
// day breaks the run without any penalty.
// ============================================

const STREAK_STORAGE_KEY = "streak";
const STREAK_HISTORY_LIMIT = 400;
const DAY_MS = 86400000;

const STREAK_MILESTONES = [
  { days: 3, xp: 20 },
  { days: 7, xp: 50 },
  { days: 14, xp: 100 },
  { days: 30, xp: 250 }
];

// --- Local calendar dates (never UTC) ---

function isValidDateKey(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parts = value.split("-");
  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

function dateKeyFromDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

function todayKey() {
  return dateKeyFromDate(new Date());
}

// Compare calendar days through UTC midnight so daylight saving never shifts a day
function dateKeyToTime(key) {
  const parts = key.split("-");
  return Date.UTC(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
}

function daysBetween(fromKey, toKey) {
  return Math.round((dateKeyToTime(toKey) - dateKeyToTime(fromKey)) / DAY_MS);
}

function startOfWeek(date) {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const offset = (start.getDay() + 6) % 7; // Monday = 0
  start.setDate(start.getDate() - offset);
  return start;
}

// --- Due dates (optional, "YYYY-MM-DD", local calendar days) ---

function formatDueDate(key) {
  const parts = key.split("-");
  const date = new Date(Date.UTC(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2])));
  const sameYear = new Date().getUTCFullYear() === date.getUTCFullYear();

  return date.toLocaleDateString(undefined, sameYear
    ? { month: "short", day: "numeric", timeZone: "UTC" }
    : { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}

function isQuestDueNow(quest) {
  return !quest.completed && isValidDateKey(quest.due) && daysBetween(todayKey(), quest.due) <= 0;
}

function isQuestOverdue(quest) {
  return !quest.completed && isValidDateKey(quest.due) && daysBetween(todayKey(), quest.due) < 0;
}

function getDueInfo(quest) {
  if (!isValidDateKey(quest.due)) return null;

  const offset = daysBetween(todayKey(), quest.due);

  if (quest.completed) {
    return { state: "done", label: formatDueDate(quest.due) };
  }

  if (offset < 0) {
    const late = Math.abs(offset);
    return { state: "overdue", label: late === 1 ? "1 day overdue" : late + " days overdue" };
  }

  if (offset === 0) {
    return { state: "today", label: "Due today" };
  }

  return { state: "upcoming", label: "Due " + formatDueDate(quest.due) };
}

// Soonest due date first; quests without a due date keep their order at the end
function sortQuestsByDue(list) {
  return list.slice().sort(function(a, b) {
    const aDue = isValidDateKey(a.due);
    const bDue = isValidDateKey(b.due);

    if (aDue && bDue) return daysBetween(b.due, a.due);
    if (aDue) return -1;
    if (bDue) return 1;
    return 0;
  });
}

// --- Persistence ---

function emptyStreak() {
  return { current: 0, best: 0, lastActivity: null, days: [], claimed: [], version: 1 };
}

function loadStreak() {
  let raw = null;

  try {
    raw = JSON.parse(localStorage.getItem(STREAK_STORAGE_KEY));
  } catch (error) {
    return emptyStreak();
  }

  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return emptyStreak();

  const days = Array.isArray(raw.days) ? raw.days.filter(isValidDateKey) : [];
  const claimed = Array.isArray(raw.claimed) ? raw.claimed.filter(function (value) {
    return typeof value === "number" && isFinite(value);
  }) : [];

  const streak = {
    current: Math.max(0, Math.floor(Number(raw.current) || 0)),
    best: Math.max(0, Math.floor(Number(raw.best) || 0)),
    lastActivity: isValidDateKey(raw.lastActivity) ? raw.lastActivity : (days.length ? days[days.length - 1] : null),
    days: days,
    claimed: claimed,
    version: 1
  };

  // A saved run only survives while the last activity is today or yesterday
  if (!streak.lastActivity || daysBetween(streak.lastActivity, todayKey()) > 1) {
    streak.current = 0;
  }

  if (streak.best < streak.current) {
    streak.best = streak.current;
  }

  return streak;
}

let streak = loadStreak();

function saveStreak() {
  try {
    localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(streak));
  } catch (error) {
    console.warn("Could not save streak progress:", error);
  }
}

// --- Recording a day ---

function recordStreakDay() {
  const today = todayKey();
  const result = {
    recorded: false,
    started: false,
    streak: streak.current,
    best: streak.best,
    rewards: [],
    milestone: null
  };

  // One credit per calendar day, no matter how many quests are completed
  if (streak.days.indexOf(today) !== -1 || streak.lastActivity === today) {
    return result;
  }

  const previous = streak.lastActivity;
  const isConsecutive = Boolean(previous) && daysBetween(previous, today) === 1;

  streak.current = isConsecutive ? Math.max(1, streak.current) + 1 : 1;
  streak.days.push(today);
  if (streak.days.length > STREAK_HISTORY_LIMIT) {
    streak.days = streak.days.slice(-STREAK_HISTORY_LIMIT);
  }
  streak.lastActivity = today;
  streak.best = Math.max(streak.best, streak.current);

  // Milestones are claimed once and never awarded twice
  STREAK_MILESTONES.forEach(function (milestone) {
    if (streak.current >= milestone.days && streak.claimed.indexOf(milestone.days) === -1) {
      streak.claimed.push(milestone.days);
      result.rewards.push(milestone);
    }
  });

  saveStreak();

  result.recorded = true;
  result.started = !isConsecutive;
  result.streak = streak.current;
  result.best = streak.best;
  result.milestone = result.rewards.length ? result.rewards[result.rewards.length - 1] : null;

  return result;
}

function sumMilestoneXP(rewards) {
  return rewards.reduce(function (total, milestone) {
    return total + milestone.xp;
  }, 0);
}

// --- Rendering ---

function renderStreak() {
  const today = todayKey();
  const recordedToday = Array.isArray(streak.days) && streak.days.indexOf(today) !== -1;

  const flame = document.getElementById("streakFlame");
  if (flame) {
    flame.dataset.state = recordedToday ? "lit" : (streak.current > 0 ? "warm" : "cold");
  }

  const currentEl = document.getElementById("streakCurrent");
  if (currentEl) {
    currentEl.textContent = streak.current;
  }

  const bestEl = document.getElementById("streakBest");
  if (bestEl) {
    bestEl.textContent = streak.best;
  }

  const bestUnitEl = document.getElementById("streakBestUnit");
  if (bestUnitEl) {
    bestUnitEl.textContent = streak.best === 1 ? "day" : "days";
  }

  const statusEl = document.getElementById("streakStatus");
  if (statusEl) {
    if (recordedToday) {
      statusEl.textContent = "Today's quest is logged — your streak is safe until midnight.";
    } else if (streak.current > 0) {
      statusEl.textContent = "Complete one quest today to keep your " + streak.current + "-day streak alive.";
    } else {
      statusEl.textContent = "Complete a quest to start a new streak.";
    }
  }

  renderStreakWeek(today);
  renderStreakMilestones();
}

function renderStreakWeek(today) {
  const list = document.getElementById("streakDays");
  if (!list) return;

  const monday = startOfWeek(new Date());
  const active = {};
  (Array.isArray(streak.days) ? streak.days : []).forEach(function (key) {
    active[key] = true;
  });

  list.innerHTML = "";

  for (let index = 0; index < 7; index++) {
    const day = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + index);
    const key = dateKeyFromDate(day);
    const isToday = key === today;
    const isActive = Boolean(active[key]);
    const isFuture = daysBetween(today, key) > 0;

    const item = document.createElement("li");
    item.className = "streak-day";
    if (isActive) item.classList.add("is-active");
    if (isToday) item.classList.add("is-today");
    if (isFuture) item.classList.add("is-future");

    const dayName = day.toLocaleDateString(undefined, { weekday: "short" });
    const state = isActive ? "quest completed" : (isFuture ? "upcoming" : "no quest completed");
    item.setAttribute("aria-label", dayName + " " + day.getDate() + ": " + state + (isToday ? ", today" : ""));

    const nameEl = document.createElement("span");
    nameEl.className = "day-name";
    nameEl.setAttribute("aria-hidden", "true");
    nameEl.textContent = dayName;

    const markEl = document.createElement("span");
    markEl.className = "day-mark";
    markEl.setAttribute("aria-hidden", "true");
    markEl.textContent = isActive ? "✓" : "";

    const numEl = document.createElement("span");
    numEl.className = "day-num";
    numEl.setAttribute("aria-hidden", "true");
    numEl.textContent = day.getDate();

    item.appendChild(nameEl);
    item.appendChild(markEl);
    item.appendChild(numEl);
    list.appendChild(item);
  }
}

function renderStreakMilestones() {
  const track = document.getElementById("milestoneTrack");
  const nextMilestone = STREAK_MILESTONES.find(function (milestone) {
    return streak.claimed.indexOf(milestone.days) === -1;
  });

  if (track) {
    track.innerHTML = "";

    STREAK_MILESTONES.forEach(function (milestone) {
      const claimed = streak.claimed.indexOf(milestone.days) !== -1;
      const chip = document.createElement("div");
      chip.className = "milestone";
      chip.setAttribute("role", "listitem");
      if (claimed) chip.classList.add("is-claimed");
      if (!claimed && nextMilestone && nextMilestone.days === milestone.days) chip.classList.add("is-next");
      chip.setAttribute("aria-label", milestone.days + "-day streak reward: " + milestone.xp + " XP, " + (claimed ? "claimed" : "not claimed yet"));

      const days = document.createElement("span");
      days.className = "milestone-days";
      days.setAttribute("aria-hidden", "true");
      days.textContent = milestone.days + "d";

      const xp = document.createElement("span");
      xp.className = "milestone-xp";
      xp.setAttribute("aria-hidden", "true");
      xp.textContent = "+" + milestone.xp + " XP";

      chip.appendChild(days);
      chip.appendChild(xp);
      track.appendChild(chip);
    });
  }

  const previousMilestone = STREAK_MILESTONES.filter(function (milestone) {
    return nextMilestone && milestone.days < nextMilestone.days;
  }).pop();

  const from = previousMilestone ? previousMilestone.days : 0;
  const to = nextMilestone ? nextMilestone.days : Math.max(from, 1);
  const span = Math.max(1, to - from);
  const done = Math.max(0, Math.min(span, streak.current - from));

  const meter = document.getElementById("streakMeter");
  const fill = document.getElementById("streakMeterFill");
  if (meter && fill) {
    fill.style.width = Math.round((nextMilestone ? done / span : 1) * 100) + "%";
    meter.setAttribute("aria-valuemin", "0");
    meter.setAttribute("aria-valuemax", String(span));
    meter.setAttribute("aria-valuenow", String(done));
  }

  const nextEl = document.getElementById("milestoneNext");
  if (nextEl) {
    if (nextMilestone) {
      const remaining = Math.max(0, nextMilestone.days - streak.current);
      nextEl.textContent = "Next reward: +" + nextMilestone.xp + " XP at a " + nextMilestone.days + "-day streak" +
        (remaining > 0 ? " (" + remaining + (remaining === 1 ? " day to go)." : " days to go).") : ".");
    } else {
      nextEl.textContent = "Every milestone claimed — the flame burns eternal.";
    }
  }
}

// --- Toast notifications ---

function showToast(message, variant) {
  const region = document.getElementById("toastRegion");
  if (!region) return;

  const toast = document.createElement("div");
  toast.className = "toast" + (variant ? " is-" + variant : "");

  const glyph = document.createElement("span");
  glyph.className = "toast-glyph";
  glyph.setAttribute("aria-hidden", "true");
  glyph.textContent = variant === "milestone" ? "🏆" : "🔥";

  const text = document.createElement("span");
  text.textContent = message;

  toast.appendChild(glyph);
  toast.appendChild(text);
  region.appendChild(toast);

  setTimeout(function () {
    toast.classList.add("is-leaving");
    setTimeout(function () {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 320);
  }, 4200);
}

// Helper: Determine title based on current level
function getPlayerTitle(currentLevel) {
  let title = RANKS[0].title;

  RANKS.forEach(function(rank) {
    if (currentLevel >= rank.level) {
      title = rank.title;
    }
  });

  return title;
}

// --- Adventurer name ---
// Stored on its own key so a rename never touches quests, XP or the streak.

const DEFAULT_PLAYER_NAME = "Dark Knight";
const PLAYER_NAME_MAX = 24;

function cleanPlayerName(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, PLAYER_NAME_MAX);
}

function loadPlayerName() {
  const stored = localStorage.getItem("playerName");
  if (typeof stored !== "string") return DEFAULT_PLAYER_NAME;
  return cleanPlayerName(stored) || DEFAULT_PLAYER_NAME;
}

let playerName = loadPlayerName();

function renderPlayerName() {
  const nameEl = document.getElementById("playerName");
  if (nameEl) nameEl.textContent = playerName;
  const sidebarName = document.getElementById("sidebarPlayerName");
  if (sidebarName) sidebarName.textContent = playerName;
}

function setRenameError(message) {
  const error = document.getElementById("renameError");
  const input = document.getElementById("renameInput");

  if (error) {
    error.textContent = message || "";
    error.hidden = !message;
  }

  if (input) {
    if (message) {
      input.classList.add("invalid");
      input.setAttribute("aria-invalid", "true");
    } else {
      input.classList.remove("invalid");
      input.removeAttribute("aria-invalid");
    }
  }
}

function startRename() {
  const form = document.getElementById("renameForm");
  const input = document.getElementById("renameInput");
  const button = document.getElementById("renameBtn");
  if (!form || !input) return;

  setRenameError("");
  input.value = playerName;
  form.hidden = false;
  if (button) button.hidden = true;

  input.focus();
  input.select();
}

function cancelRename() {
  const form = document.getElementById("renameForm");
  const button = document.getElementById("renameBtn");
  if (!form) return;

  form.hidden = true;
  setRenameError("");

  if (button) {
    button.hidden = false;
    button.focus();
  }
}

function saveName() {
  const form = document.getElementById("renameForm");
  const input = document.getElementById("renameInput");
  const button = document.getElementById("renameBtn");
  if (!form || !input) return;

  const cleaned = cleanPlayerName(input.value);

  if (cleaned === "") {
    setRenameError("Give your knight a name before saving.");
    input.focus();
    return;
  }

  playerName = cleaned;
  localStorage.setItem("playerName", playerName);

  form.hidden = true;
  setRenameError("");
  renderPlayerName();
  if (typeof syncActiveAccountRecord === "function") {
    syncActiveAccountRecord();
  }
  if (typeof renderAuthUI === "function") {
    renderAuthUI();
  }

  if (button) {
    button.hidden = false;
    button.focus();
  }
}

// Enter saves, Escape cancels, and a click outside behaves like Escape
function initRenameInput() {
  const input = document.getElementById("renameInput");
  if (!input) return;

  input.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      saveName();
    } else if (event.key === "Escape") {
      event.preventDefault();
      cancelRename();
    }
  });
}

// Theme state (persisted in localStorage)
const THEMES = ["midnight-arcane", "dark-knight", "obsidian-gold", "nordic-frost"];
let currentTheme = localStorage.getItem("quest_theme") || "midnight-arcane";
if (!THEMES.includes(currentTheme)) currentTheme = "midnight-arcane";

function applyTheme(theme) {
  if (!THEMES.includes(theme)) theme = "dark-knight";
  currentTheme = theme;
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("quest_theme", theme);

  const themeSelect = document.getElementById("themeSelect");
  if (themeSelect && themeSelect.value !== theme) {
    themeSelect.value = theme;
  }
  if (typeof updateThemesPageUI === "function") {
    updateThemesPageUI();
  }
}

function setTheme(theme) {
  applyTheme(theme);
}

// ============================================
// BACKGROUND FANTASY THEME SOUNDTRACK ENGINE
// Procedural Web Audio Ambient Soundscapes
// ============================================

let musicPlaying = false;
let musicVolume = Number(localStorage.getItem("quest_music_vol")) || 0.35;
let musicMood = localStorage.getItem("quest_music_mood") || "arcane";
let musicCtx = null;
let musicMasterGain = null;
let musicSchedulerTimer = null;
let currentChordStep = 0;

const MOOD_PROFILES = {
  arcane: {
    name: "Arcane Sanctuary",
    filterFreq: 800,
    chords: [
      { bass: 73.42, notes: [146.83, 174.61, 220.00, 261.63, 329.63] }, // Dm9
      { bass: 58.27, notes: [116.54, 174.61, 220.00, 293.66] },          // Bbmaj7
      { bass: 98.00, notes: [196.00, 233.08, 293.66, 349.23, 440.00] }, // Gm9
      { bass: 55.00, notes: [110.00, 164.81, 220.00, 293.66] }           // Asus4
    ],
    sparkles: [587.33, 659.25, 698.46, 880.00, 1046.50, 1174.66]
  },
  tavern: {
    name: "Campfire Forge",
    filterFreq: 950,
    chords: [
      { bass: 55.00, notes: [110.00, 164.81, 196.00, 261.63, 329.63] }, // Am7
      { bass: 43.65, notes: [87.31, 130.81, 174.61, 220.00, 261.63] },  // Fmaj7
      { bass: 65.41, notes: [130.81, 196.00, 246.94, 293.66, 329.63] }, // Cmaj9
      { bass: 41.20, notes: [82.41, 123.47, 164.81, 196.00, 246.94] }   // Em7
    ],
    sparkles: [659.25, 783.99, 880.00, 987.77, 1046.50, 1318.51]
  },
  frost: {
    name: "Nordic Glacier",
    filterFreq: 700,
    chords: [
      { bass: 41.20, notes: [82.41, 123.47, 196.00, 293.66, 369.99] },  // Em9
      { bass: 32.70, notes: [65.41, 130.81, 164.81, 246.94, 369.99] },  // Cmaj7#11
      { bass: 55.00, notes: [110.00, 164.81, 261.63, 392.00, 493.88] }, // Am9
      { bass: 61.74, notes: [123.47, 185.00, 293.66, 440.00] }          // Bm7
    ],
    sparkles: [739.99, 783.99, 987.77, 1174.66, 1318.51, 1479.98]
  }
};

function initMusicContext() {
  if (musicCtx) return true;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return false;
    musicCtx = new AudioCtx();
    musicMasterGain = musicCtx.createGain();
    musicMasterGain.gain.setValueAtTime(0, musicCtx.currentTime);
    musicMasterGain.connect(musicCtx.destination);
    return true;
  } catch (e) {
    return false;
  }
}

function playChordBar() {
  if (!musicPlaying || !musicCtx) return;
  const mood = MOOD_PROFILES[musicMood] || MOOD_PROFILES.arcane;
  const chordData = mood.chords[currentChordStep % mood.chords.length];
  const now = musicCtx.currentTime;
  const duration = 4.2;

  // Filter for lush low-passed warm pads
  const filter = musicCtx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(mood.filterFreq, now);

  const chordGain = musicCtx.createGain();
  // Smooth swell envelope
  chordGain.gain.setValueAtTime(0.001, now);
  chordGain.gain.exponentialRampToValueAtTime(0.12, now + 1.2);
  chordGain.gain.setValueAtTime(0.12, now + duration - 1.2);
  chordGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  chordGain.connect(filter);
  filter.connect(musicMasterGain);

  // Bass root note (triangle)
  const bassOsc = musicCtx.createOscillator();
  bassOsc.type = "triangle";
  bassOsc.frequency.setValueAtTime(chordData.bass, now);
  bassOsc.connect(chordGain);
  bassOsc.start(now);
  bassOsc.stop(now + duration);

  // Polyphonic chord pad notes (warm detuned sines)
  chordData.notes.forEach(function(freq) {
    [-3, 3].forEach(function(detuneCents) {
      const osc = musicCtx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);
      osc.detune.setValueAtTime(detuneCents, now);
      osc.connect(chordGain);
      osc.start(now);
      osc.stop(now + duration);
    });
  });

  // Schedule 2-3 randomized gentle bell sparkles during the bar
  const numSparkles = 2 + Math.floor(Math.random() * 2);
  for (let s = 0; s < numSparkles; s++) {
    const delay = 0.8 + (Math.random() * (duration - 1.6));
    const sparkleTime = now + delay;
    const sparkleFreq = mood.sparkles[Math.floor(Math.random() * mood.sparkles.length)];

    const sparkOsc = musicCtx.createOscillator();
    const sparkGain = musicCtx.createGain();

    sparkOsc.type = "triangle";
    sparkOsc.frequency.setValueAtTime(sparkleFreq, sparkleTime);

    sparkGain.gain.setValueAtTime(0.0001, sparkleTime);
    sparkGain.gain.exponentialRampToValueAtTime(0.045, sparkleTime + 0.05);
    sparkGain.gain.exponentialRampToValueAtTime(0.0001, sparkleTime + 1.2);

    sparkOsc.connect(sparkGain);
    sparkGain.connect(musicMasterGain);

    sparkOsc.start(sparkleTime);
    sparkOsc.stop(sparkleTime + 1.3);
  }

  currentChordStep = (currentChordStep + 1) % mood.chords.length;
}

function startMusic() {
  if (!initMusicContext()) return;
  if (musicCtx.state === "suspended") {
    musicCtx.resume();
  }

  musicPlaying = true;
  musicMasterGain.gain.cancelScheduledValues(musicCtx.currentTime);
  musicMasterGain.gain.setValueAtTime(musicMasterGain.gain.value, musicCtx.currentTime);
  musicMasterGain.gain.linearRampToValueAtTime(musicVolume, musicCtx.currentTime + 1.2);

  playChordBar();
  musicSchedulerTimer = setInterval(playChordBar, 3800);
  updateMusicUI();
}

function stopMusic() {
  musicPlaying = false;
  if (musicSchedulerTimer) {
    clearInterval(musicSchedulerTimer);
    musicSchedulerTimer = null;
  }
  if (musicCtx && musicMasterGain) {
    musicMasterGain.gain.cancelScheduledValues(musicCtx.currentTime);
    musicMasterGain.gain.setValueAtTime(musicMasterGain.gain.value, musicCtx.currentTime);
    musicMasterGain.gain.linearRampToValueAtTime(0.0001, musicCtx.currentTime + 0.8);
  }
  updateMusicUI();
}

function toggleMusic() {
  if (musicPlaying) {
    stopMusic();
    showToast("Theme soundtrack paused.", "ember");
  } else {
    startMusic();
    const moodName = (MOOD_PROFILES[musicMood] || MOOD_PROFILES.arcane).name;
    showToast("🎵 Playing " + moodName, "milestone");
  }
}

function changeMusicMood(newMood) {
  if (!MOOD_PROFILES[newMood]) return;
  musicMood = newMood;
  localStorage.setItem("quest_music_mood", newMood);
  currentChordStep = 0;
  if (musicPlaying) {
    playChordBar();
    showToast("Switched to " + MOOD_PROFILES[newMood].name, "milestone");
  }
  updateMusicUI();
}

function setMusicVolume(val) {
  musicVolume = Math.max(0, Math.min(1, Number(val)));
  localStorage.setItem("quest_music_vol", musicVolume);
  if (musicPlaying && musicCtx && musicMasterGain) {
    musicMasterGain.gain.cancelScheduledValues(musicCtx.currentTime);
    musicMasterGain.gain.setValueAtTime(musicVolume, musicCtx.currentTime);
  }
}

function updateMusicUI() {
  const btn = document.getElementById("musicToggleBtn");
  const textEl = document.getElementById("musicBtnText");
  const moodSelect = document.getElementById("musicMoodSelect");
  const volSlider = document.getElementById("musicVolumeSlider");

  if (btn) {
    if (musicPlaying) {
      btn.classList.add("is-playing");
    } else {
      btn.classList.remove("is-playing");
    }
  }

  if (textEl) {
    textEl.textContent = musicPlaying ? "Soundtrack ON" : "Soundtrack OFF";
  }

  if (moodSelect && moodSelect.value !== musicMood) {
    moodSelect.value = musicMood;
  }

  if (volSlider && Math.abs(Number(volSlider.value) - musicVolume) > 0.01) {
    volSlider.value = musicVolume;
  }

  if (typeof updateSoundtrackPageUI === "function") {
    updateSoundtrackPageUI();
  }
}

// Sound state (persisted in localStorage)
let soundEnabled = localStorage.getItem("soundEnabled") !== "false";
let audioCtx = null;

// Update the sound toggle button text and label
function updateSoundButton() {
  const soundBtn = document.getElementById("soundToggleBtn");
  if (soundBtn) {
    soundBtn.textContent = soundEnabled ? "🔊 Sound ON" : "🔇 Sound OFF";
    soundBtn.setAttribute("aria-label", soundEnabled ? "Disable sound effects" : "Enable sound effects");
  }
}

// Toggle sound on/off
function toggleSound() {
  soundEnabled = !soundEnabled;
  localStorage.setItem("soundEnabled", soundEnabled);
  updateSoundButton();
}

// Generate an original 8-bit retro arcade level-up fanfare using Web Audio API
function playLevelUpSound() {
  if (!soundEnabled) return;

  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    // Melodic notes for classic RPG level up: C5, E5, G5, high C6
    const notes = [523.25, 659.25, 783.99, 1046.50];
    const noteDuration = 0.09;
    const now = audioCtx.currentTime;

    notes.forEach(function(freq, index) {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = "triangle"; // Gives a pleasant, warm 8-bit chiptune sound
      osc.frequency.setValueAtTime(freq, now + index * noteDuration);

      const startTime = now + index * noteDuration;
      const isLast = index === notes.length - 1;
      const duration = isLast ? 0.35 : noteDuration;

      // Volume envelope: quickly ramp up, then fade out smoothly
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.18, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  } catch (e) {
    console.warn("Audio playback error:", e);
  }
}

// Confetti animation state
let confettiAnimationId = null;

// Trigger full-screen confetti cannon on the canvas
function triggerConfetti() {
  // Respect user preference for reduced motion
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const canvas = document.getElementById("confettiCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Set canvas resolution to match window
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Cancel any currently running confetti loop
  if (confettiAnimationId) {
    cancelAnimationFrame(confettiAnimationId);
  }

  // Theme-aware celebratory palette
  let colors = ["#D9B56D", "#EFD9A6", "#8054B8", "#E8E2F0", "#A9A6B2"];
  const activeTheme = document.documentElement.getAttribute("data-theme") || currentTheme;
  if (activeTheme === "obsidian-gold") {
    colors = ["#f5c542", "#ffea9f", "#f59e0b", "#faf8f2", "#ffffff"];
  } else if (activeTheme === "midnight-arcane") {
    colors = ["#38bdf8", "#7dd3fc", "#a855f7", "#c084fc", "#f0f6ff"];
  } else if (activeTheme === "nordic-frost") {
    colors = ["#67e8f9", "#cffafe", "#2dd4bf", "#93c5fd", "#f1f5f9"];
  }
  const particles = [];
  const particleCount = 80;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: canvas.width / 2 + (Math.random() - 0.5) * 220,
      y: canvas.height * 0.45 + (Math.random() - 0.5) * 60,
      vx: (Math.random() - 0.5) * 14,
      vy: Math.random() * -11 - 4, // Shoot upwards
      size: Math.random() * 8 + 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      opacity: 1
    });
  }

  let frames = 0;
  const maxFrames = 180; // ~3 seconds at 60fps

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let activeParticles = 0;

    particles.forEach(function(p) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.28; // Gravity
      p.vx *= 0.98; // Air resistance
      p.rotation += p.rotationSpeed;

      // Gradually fade out particles in the final second
      if (frames > 120) {
        p.opacity = Math.max(0, (maxFrames - frames) / 60);
      }

      if (p.y < canvas.height + 20 && p.opacity > 0) {
        activeParticles++;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      }
    });

    frames++;

    if (activeParticles > 0 && frames < maxFrames) {
      confettiAnimationId = requestAnimationFrame(animate);
    } else {
      // Clean up completely when finished
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      confettiAnimationId = null;
    }
  }

  animate();
}

// Show level-up celebration modal
function showLevelUpModal(newLevel) {
  const modal = document.getElementById("levelUpModal");
  const modalLevel = document.getElementById("modalLevel");
  const modalTitle = document.getElementById("modalTitle");

  if (modalLevel) modalLevel.textContent = "Level " + newLevel;
  if (modalTitle) modalTitle.textContent = "Title: " + getPlayerTitle(newLevel);

  const goldRewardEl = document.getElementById("modalGoldReward");
  if (goldRewardEl) goldRewardEl.textContent = "+" + (lastLevelRewards.gold || 50) + " Gold";

  const shardsRewardEl = document.getElementById("modalShardsReward");
  if (shardsRewardEl) shardsRewardEl.textContent = "+" + (lastLevelRewards.shards || 1) + " Shard";

  const statsRewardEl = document.getElementById("modalStatsReward");
  if (statsRewardEl) statsRewardEl.textContent = "+" + (lastLevelRewards.stats || 3) + " Stat Pts";

  if (modal) modal.classList.remove("hidden");

  // Trigger celebration audio and confetti
  playLevelUpSound();
  triggerConfetti();
}

// Close level-up celebration modal
function closeLevelUpModal() {
  const modal = document.getElementById("levelUpModal");
  if (modal) modal.classList.add("hidden");
  renderAttributes();
}

// Active quest filter state ('all', 'active', 'completed')
let currentFilter = "all";

// Current search text in the quest board
let searchTerm = "";

// Quest currently open in the inline editor (object reference, not an index)
let editingQuest = null;

// Quest index to re-focus after the editor closes
let focusQuestIndex = null;

// Change active filter and re-render quest list
function setFilter(filter) {
  currentFilter = filter;
  editingQuest = null;
  renderTasks();
}

// Filter the board by quest name (called from the search input)
function setSearch(value) {
  searchTerm = String(value || "").trim();
  editingQuest = null;
  renderTasks();
}

// Build the inline name + difficulty editor for a quest
function buildQuestEditor(quest, diffKey) {
  const form = document.createElement("div");
  form.className = "quest-edit";

  // Name field
  const nameField = document.createElement("div");
  nameField.className = "edit-field edit-field-name";

  const nameLabel = document.createElement("label");
  nameLabel.className = "edit-label";
  nameLabel.htmlFor = "questEditName";
  nameLabel.textContent = "Quest name";

  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.id = "questEditName";
  nameInput.className = "edit-name";
  nameInput.value = quest.name;
  nameInput.autocomplete = "off";
  nameInput.setAttribute("aria-describedby", "questEditError");

  const error = document.createElement("p");
  error.className = "edit-error";
  error.id = "questEditError";
  error.setAttribute("role", "alert");
  error.hidden = true;

  nameField.appendChild(nameLabel);
  nameField.appendChild(nameInput);
  nameField.appendChild(error);

  // Difficulty field
  const diffField = document.createElement("div");
  diffField.className = "edit-field edit-field-difficulty";

  const diffLabel = document.createElement("label");
  diffLabel.className = "edit-label";
  diffLabel.htmlFor = "questEditDifficulty";
  diffLabel.textContent = "Difficulty";

  const diffSelect = document.createElement("select");
  diffSelect.id = "questEditDifficulty";
  diffSelect.className = "edit-difficulty";

  DIFFICULTY_ORDER.forEach(function(key) {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = DIFFICULTY[key].label + " — +" + DIFFICULTY[key].xp + " XP";
    if (key === diffKey) {
      option.selected = true;
    }
    diffSelect.appendChild(option);
  });

  const hint = document.createElement("p");
  hint.className = "edit-hint";
  hint.id = "questEditHint";

  diffField.appendChild(diffLabel);
  diffField.appendChild(diffSelect);
  diffField.appendChild(hint);

  // Due date field (optional)
  const dueField = document.createElement("div");
  dueField.className = "edit-field edit-field-due";

  const dueLabel = document.createElement("label");
  dueLabel.className = "edit-label";
  dueLabel.htmlFor = "questEditDue";
  dueLabel.textContent = "Due date";

  const dueInput = document.createElement("input");
  dueInput.type = "date";
  dueInput.id = "questEditDue";
  dueInput.className = "edit-due";
  dueInput.value = isValidDateKey(quest.due) ? quest.due : "";
  dueInput.setAttribute("aria-label", "Due date, optional");

  dueField.appendChild(dueLabel);
  dueField.appendChild(dueInput);

  // Guards against a second save while the first one is being applied
  let isSaving = false;

  function currentDifficulty() {
    return DIFFICULTY[diffSelect.value] ? diffSelect.value : diffKey;
  }

  // Keep the card's difficulty colour and reward hint in step with the select
  function updateHint() {
    const key = currentDifficulty();
    const card = form.closest(".quest-card");

    if (card) {
      card.dataset.difficulty = key;
    }

    hint.textContent = quest.completed
      ? "Already completed — its XP and status stay as they are. Worth +" + DIFFICULTY[key].xp + " XP."
      : "Worth +" + DIFFICULTY[key].xp + " XP when completed. Editing awards no XP.";
  }

  function closeEditor() {
    focusQuestIndex = quests.indexOf(quest);
    editingQuest = null;
    renderTasks();
  }

  function showError(message) {
    error.textContent = message;
    error.hidden = false;
    nameInput.classList.add("invalid");
    nameInput.setAttribute("aria-invalid", "true");
    nameInput.focus();
  }

  function clearError() {
    error.hidden = true;
    error.textContent = "";
    nameInput.classList.remove("invalid");
    nameInput.removeAttribute("aria-invalid");
  }

  function commitEdit() {
    if (isSaving) return;

    const name = nameInput.value.trim();

    if (name === "") {
      showError("A quest needs a name before it can be saved.");
      return;
    }

    isSaving = true;
    nameInput.value = name;
    saveButton.disabled = true;

    quest.name = name;
    quest.difficulty = currentDifficulty();

    if (isValidDateKey(dueInput.value)) {
      quest.due = dueInput.value;
    } else {
      delete quest.due;
    }

    saveProgress();
    closeEditor();
  }

  nameInput.addEventListener("input", clearError);

  nameInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      commitEdit();
    } else if (event.key === "Escape") {
      event.preventDefault();
      closeEditor();
    }
  });

  diffSelect.addEventListener("change", updateHint);

  // Escape cancels from anywhere inside the editor
  form.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeEditor();
    }
  });

  const actions = document.createElement("div");
  actions.className = "edit-actions";

  const saveButton = document.createElement("button");
  saveButton.type = "button";
  saveButton.className = "btn-save";
  saveButton.textContent = "Save changes";
  saveButton.onclick = commitEdit;

  const cancelButton = document.createElement("button");
  cancelButton.type = "button";
  cancelButton.className = "btn-cancel";
  cancelButton.textContent = "Cancel";
  cancelButton.onclick = closeEditor;

  actions.appendChild(saveButton);
  actions.appendChild(cancelButton);

  form.appendChild(nameField);
  form.appendChild(diffField);
  form.appendChild(dueField);
  form.appendChild(actions);

  updateHint();

  return form;
}

// Build one quest row (read view or inline editor)
function buildQuestCard(quest) {
  const diffKey = DIFFICULTY[quest.difficulty] ? quest.difficulty : "medium";
  const meta = getDifficulty(diffKey);

  const item = document.createElement("li");
  item.className = "quest-card";
  item.dataset.difficulty = diffKey;
  item.dataset.questIndex = String(quests.indexOf(quest));

  if (quest.completed) {
    item.classList.add("done");
  }

  if (editingQuest === quest) {
    item.classList.add("editing");
    item.appendChild(buildQuestEditor(quest, diffKey));
    return item;
  }

  // Quest title and difficulty badge container
  const taskInfo = document.createElement("div");
  taskInfo.className = "task-info";

  const taskName = document.createElement("span");
  taskName.className = "quest-name";
  taskName.textContent = quest.name;
  taskInfo.appendChild(taskName);

  const badge = document.createElement("span");
  badge.className = "badge badge-" + diffKey;
  badge.title = meta.label + " difficulty — " + meta.xp + " XP reward";

  const pips = document.createElement("span");
  pips.className = "pips";
  pips.setAttribute("aria-hidden", "true");
  for (let i = 0; i < 3; i++) {
    const pip = document.createElement("i");
    pip.className = i < meta.pips ? "pip on" : "pip";
    pips.appendChild(pip);
  }

  const badgeLabel = document.createElement("span");
  badgeLabel.className = "badge-label";
  badgeLabel.textContent = meta.label;

  const badgeXP = document.createElement("span");
  badgeXP.className = "badge-xp";
  badgeXP.textContent = "+" + meta.xp + " XP";

  const badgeGold = document.createElement("span");
  badgeGold.className = "badge-gold";
  badgeGold.textContent = "+" + (meta.gold || 20) + " 🪙";

  badge.appendChild(pips);
  badge.appendChild(badgeLabel);
  badge.appendChild(badgeXP);
  badge.appendChild(badgeGold);
  taskInfo.appendChild(badge);

  const due = getDueInfo(quest);
  if (due) {
    const dueChip = document.createElement("span");
    dueChip.className = "due-chip due-" + due.state;
    dueChip.textContent = due.label;
    dueChip.title = quest.completed ? "Was due " + formatDueDate(quest.due) : due.label;
    taskInfo.appendChild(dueChip);
  }

  item.appendChild(taskInfo);

  // Complete button
  const completeButton = document.createElement("button");
  completeButton.type = "button";
  completeButton.className = "btn-complete";
  completeButton.textContent = quest.completed ? "Completed" : "Complete";
  completeButton.disabled = quest.completed;

  completeButton.onclick = function() {
    if (quest.completed) return;

    quest.completed = true;

    // Calculate reward bonuses based on TOTAL player stats (Base + Gear)
    const totals = getTotalStats();
    const strBonus = 1 + (totals.goldPercent / 100);
    const intBonus = 1 + (totals.xpPercent / 100);
    const lckCritChance = Math.min(0.6, totals.critPercent / 100);

    const isCrit = Math.random() < lckCritChance;
    const earnedXP = Math.round(meta.xp * intBonus * (isCrit ? 1.5 : 1.0));
    const earnedGold = Math.round((meta.gold || 20) * strBonus * (isCrit ? 1.5 : 1.0));
    let earnedShard = 0;

    // Hard quests have a chance to drop an Arcane Shard
    if (quest.difficulty === "hard") {
      const shardDropChance = 0.20 + (totals.lck * 0.01);
      if (Math.random() < shardDropChance) {
        earnedShard = 1;
        shards += 1;
      }
    }

    // Quest loot item drop chance (base 15% + luck bonus)
    let droppedItem = null;
    if (inventory.length < 20) {
      const dropChance = 0.15 + (totals.lck * 0.015);
      if (Math.random() < dropChance) {
        const pool = ["minor_xp_elixir", "pouch_of_gold", "iron_ore", "arcane_dust", "shadow_dagger", "runic_mail", "boots_of_the_wind", "ring_of_focus"];
        const chosenKey = pool[Math.floor(Math.random() * pool.length)];
        droppedItem = makeItemInstance(chosenKey);
        if (droppedItem) {
          inventory.push(droppedItem);
        }
      }
    }

    xp += earnedXP;
    gold += earnedGold;

    // One streak credit per calendar day, plus any milestone rewards it unlocks
    const streakResult = recordStreakDay();
    xp += sumMilestoneXP(streakResult.rewards);

    // Track level before checking for a level up
    const previousLevel = level;

    if (xp >= 100) {
      const levelsGained = Math.floor(xp / 100);
      level += levelsGained;
      xp = xp % 100;

      const levelGold = 50 * levelsGained;
      const levelShard = 1 * levelsGained;
      const levelStatPts = 3 * levelsGained;

      gold += levelGold;
      shards += levelShard;
      stats.unallocated += levelStatPts;

      lastLevelRewards = { gold: levelGold, shards: levelShard, stats: levelStatPts };
    }

    saveProgress();
    renderTasks();

    const lootMsg = droppedItem ? " • Discovered: " + droppedItem.name + " (" + droppedItem.rarity.toUpperCase() + ")" : "";
    if (isCrit) {
      showToast("⚡ Critical Bounty! +" + earnedXP + " XP & +" + earnedGold + " 🪙 Gold" + (earnedShard ? " & +1 💎 Shard" : "") + lootMsg, "milestone");
    } else {
      showToast("Quest Completed: +" + earnedXP + " XP & +" + earnedGold + " 🪙 Gold" + (earnedShard ? " & +1 💎 Shard" : "") + lootMsg, "ember");
    }

    if (typeof triggerCompanionReaction === "function") {
      triggerCompanionReaction("quest");
    }
    if (typeof checkCompanionMilestones === "function") {
      checkCompanionMilestones();
    }

    if (streakResult.recorded) {
      if (streakResult.started) {
        showToast("Streak started — day 1. Return tomorrow to keep the flame alive.", "ember");
      } else {
        showToast("Day " + streakResult.streak + " recorded. Streak safe until midnight.", "ember");
      }

      streakResult.rewards.forEach(function (reward) {
        showToast(reward.days + "-day milestone reached — +" + reward.xp + " XP!", "milestone");
      });
    }

    // Trigger celebration if the player leveled up or hit a crit/milestone
    if (level > previousLevel) {
      showLevelUpModal(level);
      if (typeof triggerCompanionReaction === "function") {
        triggerCompanionReaction("levelUp");
      }
      if (typeof checkCompanionMilestones === "function") {
        checkCompanionMilestones();
      }
    } else if (streakResult.milestone || isCrit) {
      playLevelUpSound();
      triggerConfetti();
    }
  };

  // Edit button — opens the inline editor in place of this row
  const editButton = document.createElement("button");
  editButton.type = "button";
  editButton.className = "btn-edit";
  editButton.textContent = "Edit";
  editButton.setAttribute("aria-label", "Edit quest: " + quest.name);

  editButton.onclick = function() {
    editingQuest = quest;
    renderTasks();
  };

  // Delete button
  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "btn-delete";
  deleteButton.textContent = "Delete";
  deleteButton.setAttribute("aria-label", "Delete quest: " + quest.name);

  deleteButton.onclick = function() {
    // Find index in master quests array to avoid deleting wrong quest when filtered
    const originalIndex = quests.indexOf(quest);
    if (originalIndex !== -1) {
      quests.splice(originalIndex, 1);
      if (editingQuest === quest) {
        editingQuest = null;
      }
      saveProgress();
      renderTasks();
    }
  };

  // Button container
  const actions = document.createElement("div");
  actions.className = "task-actions";
  actions.appendChild(completeButton);
  actions.appendChild(editButton);
  actions.appendChild(deleteButton);

  item.appendChild(actions);

  return item;
}

// 3. Display quests on the website
function renderTasks() {
  const taskList = document.getElementById("taskList");

  taskList.innerHTML = "";

  // Update active state on filter tab buttons
  const filterButtons = document.querySelectorAll(".filter-btn");
  filterButtons.forEach(function(btn) {
    const isActive = btn.getAttribute("data-filter") === currentFilter;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-pressed", isActive ? "true" : "false");
  });

  // Counts on the filter tabs always describe the whole journal, not the search
  const completedCount = quests.filter(function(quest) {
    return quest.completed;
  }).length;
  const remainingCount = quests.length - completedCount;

  const countAllEl = document.getElementById("countAll");
  const countActiveEl = document.getElementById("countActive");
  const countCompletedEl = document.getElementById("countCompleted");

  const countTodayEl = document.getElementById("countToday");
  const dueNowCount = quests.filter(isQuestDueNow).length;

  if (countAllEl) countAllEl.textContent = quests.length;
  if (countActiveEl) countActiveEl.textContent = remainingCount;
  if (countCompletedEl) countCompletedEl.textContent = completedCount;
  if (countTodayEl) countTodayEl.textContent = dueNowCount;

  // Filter quests based on selected tab
  let filteredQuests = quests;
  if (currentFilter === "active") {
    filteredQuests = quests.filter(function(quest) {
      return !quest.completed;
    });
  } else if (currentFilter === "completed") {
    filteredQuests = quests.filter(function(quest) {
      return quest.completed;
    });
  } else if (currentFilter === "today") {
    filteredQuests = quests.filter(isQuestDueNow);
  }

  if (searchTerm !== "") {
    const needle = searchTerm.toLowerCase();
    filteredQuests = filteredQuests.filter(function(quest) {
      return quest.name.toLowerCase().indexOf(needle) !== -1;
    });
  }

  filteredQuests = sortQuestsByDue(filteredQuests);

  // Display empty state if no quests match the current filter
  if (filteredQuests.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "empty-state";

    const emptyIcon = document.createElement("span");
    emptyIcon.className = "empty-icon";
    emptyIcon.setAttribute("aria-hidden", "true");

    const emptyText = document.createElement("p");

    if (quests.length === 0) {
      emptyIcon.textContent = "🗡️";
      emptyText.textContent = "No quests yet — add one above to begin your adventure!";
    } else if (searchTerm !== "") {
      emptyIcon.textContent = "🔍";
      emptyText.textContent = "No quests match \"" + searchTerm + "\". Try another word or clear the search.";
    } else if (currentFilter === "today") {
      emptyIcon.textContent = "🌙";
      emptyText.textContent = "Nothing is due today. Add a due date or enjoy the clear road.";
    } else if (currentFilter === "active") {
      emptyIcon.textContent = "🎉";
      emptyText.textContent = "All quests completed! Take a break or add a new mission.";
    } else if (currentFilter === "completed") {
      emptyIcon.textContent = "📜";
      emptyText.textContent = "No completed quests yet. Finish a quest to see it here!";
    }

    emptyItem.appendChild(emptyIcon);
    emptyItem.appendChild(emptyText);
    taskList.appendChild(emptyItem);
  } else {
    filteredQuests.forEach(function(quest) {
      taskList.appendChild(buildQuestCard(quest));
    });
  }

  // Update XP, level, title and progress bar
  const xpEl = document.getElementById("xp");
  if (xpEl) xpEl.textContent = xp;
  const lvlEl = document.getElementById("level");
  if (lvlEl) lvlEl.textContent = level;
  const currentTitle = getPlayerTitle(level);
  const titleEl = document.getElementById("playerTitle");
  if (titleEl) titleEl.textContent = currentTitle;
  const barEl = document.getElementById("progressBar");
  if (barEl) barEl.style.width = xp + "%";

  const profileHeaderLvl = document.getElementById("profileHeaderLevel");
  if (profileHeaderLvl) profileHeaderLvl.textContent = level;
  const sidebarLvl = document.getElementById("sidebarPlayerLevel");
  if (sidebarLvl) sidebarLvl.textContent = level;
  const sidebarTitle = document.getElementById("sidebarPlayerTitle");
  if (sidebarTitle) sidebarTitle.textContent = currentTitle;

  const progressContainer = document.getElementById("progressContainer");
  if (progressContainer) {
    progressContainer.setAttribute("aria-valuenow", String(xp));
  }

  // Update dashboard
  const totalQuestsEl = document.getElementById("totalQuests");
  if (totalQuestsEl) totalQuestsEl.textContent = quests.length;
  const completedQuestsEl = document.getElementById("completedQuests");
  if (completedQuestsEl) completedQuestsEl.textContent = completedCount;
  const remainingQuestsEl = document.getElementById("remainingQuests");
  if (remainingQuestsEl) remainingQuestsEl.textContent = remainingCount;

  // Update Wallet
  const goldEl = document.getElementById("playerGold");
  if (goldEl) goldEl.textContent = Number(gold).toLocaleString();

  const shardsEl = document.getElementById("playerShards");
  if (shardsEl) shardsEl.textContent = Number(shards).toLocaleString();

  const topGold = document.getElementById("topbarGold");
  if (topGold) topGold.textContent = Number(gold).toLocaleString();

  const topShards = document.getElementById("topbarShards");
  if (topShards) topShards.textContent = Number(shards).toLocaleString();

  // Update Nav Badges
  if (typeof updateNavBadges === "function") {
    updateNavBadges();
  }

  // Update RPG Attributes
  renderAttributes();

  // Update Armory & Inventory
  renderArmoryAndInventory();

  // Update Profile Companion
  renderProfileCompanion();

  // Update Shop & Blacksmith Forge
  const shopGoldEl = document.getElementById("shopPlayerGold");
  if (shopGoldEl) shopGoldEl.textContent = Number(gold).toLocaleString();
  renderShop();
  updateRefineItemOptions();
  renderRecipes();

  // Update Clear Completed button state (styling lives in the stylesheet)
  const clearBtn = document.getElementById("clearCompletedBtn");
  if (clearBtn) {
    clearBtn.disabled = completedCount === 0;
  }

  // The reschedule action only makes sense while something is overdue
  const rescheduleBtn = document.getElementById("rescheduleOverdueBtn");
  if (rescheduleBtn) {
    const overdueCount = quests.filter(isQuestOverdue).length;
    rescheduleBtn.disabled = overdueCount === 0;
    rescheduleBtn.textContent = overdueCount > 0
      ? "Move " + overdueCount + " Overdue to Today"
      : "Move Overdue to Today";
  }

  // Refresh rank progression and achievements
  renderChronicles({
    level: level,
    xp: xp,
    total: quests.length,
    completed: completedCount
  });

  // Refresh the daily streak panel
  renderStreak();

  // Keep keyboard focus sensible while editing
  if (editingQuest) {
    const editor = document.getElementById("questEditName");
    if (editor) {
      editor.focus();
      editor.select();
    }
  } else if (focusQuestIndex !== null) {
    const target = taskList.querySelector('.quest-card[data-quest-index="' + focusQuestIndex + '"] .btn-edit');
    if (target) {
      target.focus();
    }
    focusQuestIndex = null;
  }
}

function getEquippedBonuses() {
  const bonus = {
    str: 0,
    int: 0,
    end: 0,
    lck: 0,
    goldPercent: 0,
    xpPercent: 0,
    critPercent: 0,
    shields: 0
  };

  const slots = ["weapon", "armor", "helmet", "boots", "relic"];
  slots.forEach(function(slot) {
    const it = equipped[slot];
    if (!it) return;
    if (it.stats) {
      if (it.stats.str) bonus.str += it.stats.str;
      if (it.stats.int) bonus.int += it.stats.int;
      if (it.stats.end) bonus.end += it.stats.end;
      if (it.stats.lck) bonus.lck += it.stats.lck;
    }
    if (it.goldPercent) bonus.goldPercent += it.goldPercent;
    if (it.xpPercent) bonus.xpPercent += it.xpPercent;
    if (it.critPercent) bonus.critPercent += it.critPercent;
    if (it.shields) bonus.shields += it.shields;
  });

  return bonus;
}

function getTotalStats() {
  const eq = getEquippedBonuses();
  return {
    str: stats.str + eq.str,
    int: stats.int + eq.int,
    end: stats.end + eq.end,
    lck: stats.lck + eq.lck,
    goldPercent: (stats.str * 2) + eq.goldPercent,
    xpPercent: (stats.int * 2) + eq.xpPercent,
    critPercent: (stats.lck * 3) + eq.critPercent,
    shields: Math.max(1, Math.floor(stats.end / 5)) + eq.shields,
    eq: eq
  };
}

// Render RPG Attributes & Point Allocation
function renderAttributes() {
  const totals = getTotalStats();

  const strEl = document.getElementById("valSTR");
  if (strEl) {
    strEl.textContent = totals.eq.str > 0 ? totals.str + " (" + stats.str + "+" + totals.eq.str + ")" : totals.str;
  }
  const perkSTREl = document.getElementById("perkSTR");
  if (perkSTREl) perkSTREl.textContent = "+" + totals.goldPercent + "% Quest Gold";

  const intEl = document.getElementById("valINT");
  if (intEl) {
    intEl.textContent = totals.eq.int > 0 ? totals.int + " (" + stats.int + "+" + totals.eq.int + ")" : totals.int;
  }
  const perkINTEl = document.getElementById("perkINT");
  if (perkINTEl) perkINTEl.textContent = "+" + totals.xpPercent + "% Quest XP";

  const endEl = document.getElementById("valEND");
  if (endEl) {
    endEl.textContent = totals.eq.end > 0 ? totals.end + " (" + stats.end + "+" + totals.eq.end + ")" : totals.end;
  }
  const perkENDEl = document.getElementById("perkEND");
  if (perkENDEl) {
    perkENDEl.textContent = "Streak Shield (" + totals.shields + " charge" + (totals.shields === 1 ? "" : "s") + ")";
  }

  const lckEl = document.getElementById("valLCK");
  if (lckEl) {
    lckEl.textContent = totals.eq.lck > 0 ? totals.lck + " (" + stats.lck + "+" + totals.eq.lck + ")" : totals.lck;
  }
  const perkLCKEl = document.getElementById("perkLCK");
  if (perkLCKEl) perkLCKEl.textContent = "+" + totals.critPercent + "% Crit Bounty / Drops";

  // Stat point allocation badge and buttons
  const hasPoints = stats.unallocated > 0;
  const badge = document.getElementById("statPointsBadge");
  const countEl = document.getElementById("statPointsCount");
  if (badge && countEl) {
    badge.hidden = !hasPoints;
    countEl.textContent = stats.unallocated;
  }

  ["STR", "INT", "END", "LCK"].forEach(function(code) {
    const btn = document.getElementById("btnStat" + code);
    if (btn) {
      btn.disabled = !hasPoints;
    }
  });
}

function allocateStat(statKey) {
  if (stats.unallocated <= 0) return;
  if (stats[statKey] === undefined) return;

  stats.unallocated--;
  stats[statKey]++;

  saveProgress();
  renderAttributes();

  const statNames = { str: "Strength", int: "Intellect", end: "Endurance", lck: "Luck" };
  showToast((statNames[statKey] || statKey.toUpperCase()) + " increased to " + stats[statKey] + "!", "milestone");
}

// Render Armory Paperdoll and 20-slot Bag
function renderArmoryAndInventory() {
  const bagCountEl = document.getElementById("bagCount");
  if (bagCountEl) bagCountEl.textContent = inventory.length;

  const slots = ["weapon", "armor", "helmet", "boots", "relic"];
  slots.forEach(function(slotKey) {
    const item = equipped[slotKey];
    const frame = document.getElementById("slot-" + slotKey);
    const nameEl = document.getElementById("name-" + slotKey);
    if (!frame || !nameEl) return;

    frame.className = "slot-frame";
    if (item) {
      frame.classList.add("has-item", "rarity-" + item.rarity);
      frame.innerHTML = renderItemVisual(item, { size: "lg", showTier: true });
      nameEl.textContent = item.name + (item.refineLevel ? " +" + item.refineLevel : "");
      nameEl.title = item.name + " (" + item.rarity + ")";
    } else {
      frame.innerHTML = renderSlotPlaceholder(slotKey);
      nameEl.textContent = "Empty";
      nameEl.title = "Empty " + slotKey + " slot";
    }
  });

  // Update Living Paperdoll Adventurer Stage visual glows
  const glowWeapon = document.getElementById("glowWeapon");
  const glowArmor = document.getElementById("glowArmor");
  const glowHelmet = document.getElementById("glowHelmet");
  if (glowWeapon) glowWeapon.hidden = !equipped.weapon;
  if (glowArmor) glowArmor.hidden = !equipped.armor;
  if (glowHelmet) glowHelmet.hidden = !equipped.helmet;

  // Gear power summary
  const powerStatsRow = document.getElementById("gearPowerStats");
  if (powerStatsRow) {
    const eq = getEquippedBonuses();
    const pills = [];
    if (eq.str > 0) pills.push('<span class="stat-pill">+' + eq.str + ' STR</span>');
    if (eq.int > 0) pills.push('<span class="stat-pill">+' + eq.int + ' INT</span>');
    if (eq.end > 0) pills.push('<span class="stat-pill">+' + eq.end + ' END</span>');
    if (eq.lck > 0) pills.push('<span class="stat-pill">+' + eq.lck + ' LCK</span>');
    if (eq.goldPercent > 0) pills.push('<span class="stat-pill">+' + eq.goldPercent + '% Gold</span>');
    if (eq.xpPercent > 0) pills.push('<span class="stat-pill">+' + eq.xpPercent + '% XP</span>');
    if (eq.critPercent > 0) pills.push('<span class="stat-pill">+' + eq.critPercent + '% Crit</span>');
    if (eq.shields > 0) pills.push('<span class="stat-pill">+' + eq.shields + ' Shield</span>');

    if (pills.length === 0) {
      powerStatsRow.innerHTML = '<span class="power-empty" style="font-size: 11px; color: var(--silver);">No gear equipped</span>';
    } else {
      powerStatsRow.innerHTML = pills.join("");
    }
  }

  // 20-slot bag
  const grid = document.getElementById("inventoryGrid");
  if (grid) {
    grid.innerHTML = "";
    for (let i = 0; i < 20; i++) {
      const slotDiv = document.createElement("div");
      slotDiv.setAttribute("role", "gridcell");

      if (i < inventory.length) {
        const it = inventory[i];
        slotDiv.className = "bag-slot is-filled rarity-" + it.rarity;
        slotDiv.innerHTML = renderItemVisual(it, { size: "md", showTier: true, frame: false });
        slotDiv.title = it.name + (it.refineLevel ? " +" + it.refineLevel : "") + " (" + it.rarity + ")";
        slotDiv.tabIndex = 0;
        slotDiv.setAttribute("aria-label", it.name + ", " + it.type);
        slotDiv.onclick = (function(idx) {
          return function() { inspectBagItem(idx); };
        })(i);
        slotDiv.onkeydown = (function(idx) {
          return function(e) {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              inspectBagItem(idx);
            }
          };
        })(i);
      } else {
        slotDiv.className = "bag-slot is-empty";
        slotDiv.title = "Empty bag slot";
        slotDiv.setAttribute("aria-label", "Empty slot");
      }
      grid.appendChild(slotDiv);
    }
  }
}

// Item Inspection Modal Logic
function openItemModal(item, source, slot, index) {
  activeInspectedItem = item;
  activeInspectSource = source;
  activeInspectSlot = slot;
  activeInspectIndex = index;

  const modal = document.getElementById("itemModal");
  const rarityBadge = document.getElementById("itemModalRarity");
  const typeBadge = document.getElementById("itemModalType");
  const iconWrap = document.getElementById("itemModalIconWrap");
  const iconEl = document.getElementById("itemModalIcon");
  const nameEl = document.getElementById("itemModalName");
  const loreEl = document.getElementById("itemModalLore");
  const statsWrap = document.getElementById("itemModalStats");
  const btnPrimary = document.getElementById("itemActionPrimary");
  const btnSecondary = document.getElementById("itemActionSecondary");

  if (!modal || !item) return;

  // Header badges
  if (rarityBadge) {
    rarityBadge.textContent = item.rarity;
    rarityBadge.className = "item-rarity-badge rarity-" + item.rarity;
  }
  if (typeBadge) {
    typeBadge.textContent = item.type;
  }

  // Icon
  if (iconWrap) {
    iconWrap.className = "item-modal-icon-wrap rarity-" + item.rarity;
  }
  if (iconEl) {
    iconEl.innerHTML = renderItemVisual(item, { size: "xl", showTier: true, frame: false });
  }

  // Title & lore
  if (nameEl) nameEl.textContent = item.name;
  if (loreEl) loreEl.textContent = item.lore || "";

  // Stat rows
  if (statsWrap) {
    const rows = [];
    if (item.stats) {
      if (item.stats.str) rows.push('<div class="item-stat-row"><span>Strength Bonus</span><span class="stat-highlight">+' + item.stats.str + ' STR</span></div>');
      if (item.stats.int) rows.push('<div class="item-stat-row"><span>Intellect Bonus</span><span class="stat-highlight">+' + item.stats.int + ' INT</span></div>');
      if (item.stats.end) rows.push('<div class="item-stat-row"><span>Endurance Bonus</span><span class="stat-highlight">+' + item.stats.end + ' END</span></div>');
      if (item.stats.lck) rows.push('<div class="item-stat-row"><span>Luck Bonus</span><span class="stat-highlight">+' + item.stats.lck + ' LCK</span></div>');
    }
    if (item.goldPercent) rows.push('<div class="item-stat-row"><span>Quest Gold Bounty</span><span class="stat-highlight">+' + item.goldPercent + '%</span></div>');
    if (item.xpPercent) rows.push('<div class="item-stat-row"><span>Quest XP Gain</span><span class="stat-highlight">+' + item.xpPercent + '%</span></div>');
    if (item.critPercent) rows.push('<div class="item-stat-row"><span>Critical Bounty Chance</span><span class="stat-highlight">+' + item.critPercent + '%</span></div>');
    if (item.shields) rows.push('<div class="item-stat-row"><span>Streak Shield Extra</span><span class="stat-highlight">+' + item.shields + ' Charge</span></div>');
    if (item.effect === "xp") rows.push('<div class="item-stat-row"><span>Instantly Grants</span><span class="stat-highlight">+' + item.value + ' XP</span></div>');
    if (item.effect === "gold") rows.push('<div class="item-stat-row"><span>Instantly Grants</span><span class="stat-highlight">+' + item.value + ' Gold</span></div>');

    rows.push('<div class="item-stat-row"><span>Merchant Value</span><span class="stat-highlight">' + (item.sellValue || 10) + ' 🪙</span></div>');
    statsWrap.innerHTML = rows.join("");
  }

  // Buttons configuration
  if (source === "equipped") {
    if (btnPrimary) {
      btnPrimary.hidden = false;
      btnPrimary.textContent = "Unequip to Bag";
      btnPrimary.onclick = function() { unequipItem(slot); };
    }
    if (btnSecondary) btnSecondary.hidden = true;
  } else if (source === "bag") {
    if (["weapon", "armor", "helmet", "boots", "relic"].includes(item.type)) {
      if (btnPrimary) {
        btnPrimary.hidden = false;
        btnPrimary.textContent = "Equip Gear";
        btnPrimary.onclick = function() { equipItem(index); };
      }
      if (btnSecondary) {
        btnSecondary.hidden = false;
        btnSecondary.textContent = "Sell for " + (item.sellValue || 10) + " 🪙";
        btnSecondary.onclick = function() { sellItem(index); };
      }
    } else if (item.type === "consumable") {
      if (btnPrimary) {
        btnPrimary.hidden = false;
        btnPrimary.textContent = "Consume Item";
        btnPrimary.onclick = function() { useItem(index); };
      }
      if (btnSecondary) {
        btnSecondary.hidden = false;
        btnSecondary.textContent = "Sell for " + (item.sellValue || 10) + " 🪙";
        btnSecondary.onclick = function() { sellItem(index); };
      }
    } else {
      if (btnPrimary) btnPrimary.hidden = true;
      if (btnSecondary) {
        btnSecondary.hidden = false;
        btnSecondary.textContent = "Sell for " + (item.sellValue || 10) + " 🪙";
        btnSecondary.onclick = function() { sellItem(index); };
      }
    }
  }

  modal.classList.remove("hidden");
}

function closeItemModal() {
  const modal = document.getElementById("itemModal");
  if (modal) modal.classList.add("hidden");
  activeInspectedItem = null;
  activeInspectSource = null;
  activeInspectSlot = null;
  activeInspectIndex = null;
}

function inspectEquipped(slot) {
  const item = equipped[slot];
  if (!item) return;
  openItemModal(item, "equipped", slot, null);
}

function inspectBagItem(index) {
  const item = inventory[index];
  if (!item) return;
  openItemModal(item, "bag", null, index);
}

function equipItem(bagIndex) {
  const item = inventory[bagIndex];
  if (!item || !["weapon", "armor", "helmet", "boots", "relic"].includes(item.type)) return;

  const slot = item.type;
  const currentEquipped = equipped[slot];

  inventory.splice(bagIndex, 1);
  if (currentEquipped) {
    inventory.push(currentEquipped);
  }
  equipped[slot] = item;

  saveProgress();
  closeItemModal();
  renderTasks();
  playLevelUpSound();
  showToast("Equipped " + item.name + "!", "milestone");
}

function unequipItem(slot) {
  const item = equipped[slot];
  if (!item) return;
  if (inventory.length >= 20) {
    showToast("Bag is full (20/20)! Sell an item first.", "ember");
    return;
  }
  inventory.push(item);
  equipped[slot] = null;

  saveProgress();
  closeItemModal();
  renderTasks();
  showToast("Unequipped " + item.name + ".", "ember");
}

function useItem(bagIndex) {
  const item = inventory[bagIndex];
  if (!item || item.type !== "consumable") return;

  inventory.splice(bagIndex, 1);

  if (item.effect === "xp") {
    xp += item.value;
    showToast("✨ Used " + item.name + "! +" + item.value + " XP gained!", "milestone");
    if (xp >= 100) {
      const levelsGained = Math.floor(xp / 100);
      level += levelsGained;
      xp = xp % 100;
      gold += 50 * levelsGained;
      shards += 1 * levelsGained;
      stats.unallocated += 3 * levelsGained;
      lastLevelRewards = { gold: 50 * levelsGained, shards: 1 * levelsGained, stats: 3 * levelsGained };
      showLevelUpModal(level);
    }
  } else if (item.effect === "gold") {
    gold += item.value;
    showToast("🪙 Opened " + item.name + "! +" + item.value + " Gold added!", "milestone");
  }

  saveProgress();
  closeItemModal();
  renderTasks();
  playLevelUpSound();
}

function sellItem(bagIndex) {
  const item = inventory[bagIndex];
  if (!item) return;

  const value = item.sellValue || 10;
  inventory.splice(bagIndex, 1);
  gold += value;

  saveProgress();
  closeItemModal();
  renderTasks();
  showToast("Sold " + item.name + " for +" + value + " 🪙 Gold.", "ember");
}

function sortInventory() {
  const rarityRank = { legendary: 4, epic: 3, rare: 2, common: 1 };
  inventory.sort(function(a, b) {
    const rA = rarityRank[a.rarity] || 0;
    const rB = rarityRank[b.rarity] || 0;
    if (rB !== rA) return rB - rA;
    return (a.type || "").localeCompare(b.type || "");
  });
  saveProgress();
  renderArmoryAndInventory();
  showToast("Bag organized by rarity and type.", "ember");
}

// ============================================
// GUILD MERCHANT SHOP SYSTEM
// ============================================

const SHOP_ITEMS = [
  // Familiars & Companions
  { key: "companion_ember", companionId: "ember", price: 180, shards: 2, category: "companion" },
  { key: "companion_boo", companionId: "boo", price: 140, shards: 1, category: "companion" },
  { key: "companion_lumi", companionId: "lumi", price: 260, shards: 3, category: "companion" },
  { key: "companion_solas", companionId: "solas", price: 380, shards: 5, category: "companion" },

  // Equipment
  { key: "shadow_dagger", price: 110, category: "equipment" },
  { key: "void_slayer", price: 450, category: "equipment" },
  { key: "runic_mail", price: 120, category: "equipment" },
  { key: "crown_of_clarity", price: 260, category: "equipment" },
  { key: "boots_of_the_wind", price: 130, category: "equipment" },
  { key: "ring_of_focus", price: 160, category: "equipment" },

  // Consumables
  { key: "minor_xp_elixir", price: 30, category: "consumable" },
  { key: "pouch_of_gold", price: 75, category: "consumable" },

  // Materials
  { key: "iron_ore", price: 25, category: "material" },
  { key: "arcane_dust", price: 45, category: "material" }
];

let currentShopFilter = "all";

function filterShop(category) {
  currentShopFilter = category;
  const tabs = document.querySelectorAll(".shop-tab");
  tabs.forEach(function(tab) {
    const isAct = tab.getAttribute("data-category") === category;
    tab.classList.toggle("active", isAct);
    tab.setAttribute("aria-pressed", isAct ? "true" : "false");
  });
  renderShop();
}

function renderShop() {
  const grid = document.getElementById("shopGrid");
  if (!grid) return;

  const filtered = SHOP_ITEMS.filter(function(entry) {
    if (currentShopFilter === "all") return true;
    return entry.category === currentShopFilter;
  });

  grid.innerHTML = "";

  filtered.forEach(function(entry) {
    const template = ITEM_CATALOG[entry.key];
    if (!template) return;

    const canAfford = gold >= entry.price;
    const bagFull = inventory.length >= 20;

    const card = document.createElement("div");
    card.className = "shop-card rarity-" + template.rarity;

    const perks = [];
    if (template.stats) {
      if (template.stats.str) perks.push("+" + template.stats.str + " STR");
      if (template.stats.int) perks.push("+" + template.stats.int + " INT");
      if (template.stats.end) perks.push("+" + template.stats.end + " END");
      if (template.stats.lck) perks.push("+" + template.stats.lck + " LCK");
    }
    if (template.goldPercent) perks.push("+" + template.goldPercent + "% Gold");
    if (template.xpPercent) perks.push("+" + template.xpPercent + "% XP");
    if (template.critPercent) perks.push("+" + template.critPercent + "% Crit");
    if (template.effect === "xp") perks.push("+" + template.value + " Instant XP");
    if (template.effect === "gold") perks.push("+" + template.value + " Instant Gold");
    if (template.type === "material") perks.push("Refining Reagent");

    const isCompanion = entry.category === "companion";
    const isOwnedCompanion = isCompanion && typeof isCompanionOwned === "function" && isCompanionOwned(entry.companionId);
    const neededShards = entry.shards || 0;
    const canAffordCompanion = gold >= entry.price && shards >= neededShards;

    let visualHtml = renderItemVisual(template, { size: "md", showTier: false });
    if (isCompanion && template.asset) {
      visualHtml = '<div class="item-visual-wrap size-md rarity-' + template.rarity + '"><div class="item-art-frame"><img class="item-asset-img" src="' + template.asset + '" alt="' + template.name + '"></div></div>';
    }

    let priceHtml = renderCurrencyIcon("gold") + ' ' + entry.price + ' Gold';
    if (neededShards > 0) {
      priceHtml += ' + ' + renderCurrencyIcon("shards") + ' ' + neededShards + ' Shards';
    }

    let btnDisabled = false;
    let btnText = "Purchase";
    if (isCompanion) {
      if (isOwnedCompanion) {
        btnDisabled = true;
        btnText = "Adopted 🐾";
      } else if (!canAffordCompanion) {
        btnDisabled = true;
        btnText = "Need Funds";
      } else {
        btnDisabled = false;
        btnText = "Adopt Companion 🐾";
      }
    } else {
      btnDisabled = !canAfford || bagFull;
      btnText = bagFull ? "Bag Full" : (canAfford ? "Purchase" : "Need Gold");
    }

    card.innerHTML =
      '<div class="shop-card-head">' +
        visualHtml +
        '<span class="shop-card-type">' + template.type + '</span>' +
      '</div>' +
      '<h3 class="shop-card-name">' + template.name + '</h3>' +
      '<p class="shop-card-lore">' + (template.lore || "") + '</p>' +
      '<div class="shop-card-perks">' +
        perks.map(function(p) { return '<span class="shop-perk-pill">' + p + '</span>'; }).join("") +
      '</div>' +
      '<div class="shop-card-foot">' +
        '<span class="shop-price">' + priceHtml + '</span>' +
        '<button type="button" class="btn-buy" ' + (btnDisabled ? "disabled" : "") + ' onclick="buyShopItem(\'' + entry.key + '\', this)">' +
          btnText +
        '</button>' +
      '</div>';

    grid.appendChild(card);
  });
}

let isPurchasing = false;

function buyShopItem(itemKey, btnEl) {
  if (isPurchasing) return;
  const shopItem = SHOP_ITEMS.find(function(it) { return it.key === itemKey; });
  const template = ITEM_CATALOG[itemKey];
  if (!shopItem || !template) return;

  // Handle Companion Adoptions (Does not consume inventory bag slot)
  if (shopItem.category === "companion") {
    if (isCompanionOwned(shopItem.companionId)) {
      showToast("You have already adopted this familiar!", "ember");
      return;
    }
    const neededShards = shopItem.shards || 0;
    if (gold < shopItem.price || shards < neededShards) {
      showToast("Not enough currency! Requires " + shopItem.price + " Gold & " + neededShards + " Shards.", "ember");
      return;
    }
    isPurchasing = true;
    gold -= shopItem.price;
    shards -= neededShards;
    unlockCompanion(shopItem.companionId, "Adopted from Lady Vivienne's Emporium");
    saveProgress();
    const button = btnEl || (window.event && window.event.target ? window.event.target.closest("button") : null);
    triggerPurchaseAnimation(button, itemKey, shopItem.price, function() {
      renderTasks();
      renderShop();
      renderCompanionsPage();
      showToast("Adopted " + template.name + "! Visit Companions Sanctuary to equip it.", "milestone");
      isPurchasing = false;
    });
    return;
  }

  if (inventory.length >= 20) {
    showToast("Your inventory bag is full (20/20)! Sell an item first.", "ember");
    return;
  }

  if (gold < shopItem.price) {
    showToast("Not enough Gold! You need " + (shopItem.price - gold) + " more 🪙.", "ember");
    return;
  }

  isPurchasing = true;

  // Execute purchase
  gold -= shopItem.price;
  const instance = makeItemInstance(itemKey);
  inventory.push(instance);
  saveProgress();

  const button = btnEl || (window.event && window.event.target ? window.event.target.closest("button") : null);
  triggerPurchaseAnimation(button, itemKey, shopItem.price, function() {
    renderTasks();
    showToast("Purchased " + template.name + " for " + shopItem.price + " Gold!", "milestone");
    isPurchasing = false;
  });
}

function triggerPurchaseAnimation(btnEl, itemKey, goldSpent, onComplete) {
  playCoinSound();
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced || !btnEl) {
    onComplete();
    return;
  }

  const rect = btnEl.getBoundingClientRect();
  const animLayer = document.getElementById("rpgAnimationLayer");
  const targetGold = document.getElementById("shopPlayerGold") || document.querySelector(".badge-merchant-gold");
  const targetInventory = document.querySelector('a[href="#panel-inventory"]');

  // 1. Flying gold coin towards the gold counter
  if (animLayer && targetGold) {
    const goldRect = targetGold.getBoundingClientRect();
    const flyingCoin = document.createElement("div");
    flyingCoin.className = "flying-rpg-particle flying-coin";
    flyingCoin.innerHTML = '<img src="assets/items/currency_gold.svg" alt="" style="width: 22px; height: 22px;">';
    flyingCoin.style.left = (rect.left + rect.width / 2 - 11) + "px";
    flyingCoin.style.top = (rect.top - 10) + "px";
    animLayer.appendChild(flyingCoin);

    requestAnimationFrame(function() {
      flyingCoin.style.transform = 'translate(' + (goldRect.left - rect.left) + 'px, ' + (goldRect.top - rect.top) + 'px) scale(0.6)';
      flyingCoin.style.opacity = '0';
    });

    setTimeout(function() {
      if (flyingCoin.parentNode) flyingCoin.parentNode.removeChild(flyingCoin);
      if (targetGold) {
        targetGold.classList.add("gold-counter-pulse");
        setTimeout(function() { targetGold.classList.remove("gold-counter-pulse"); }, 400);
      }
    }, 450);
  }

  // 2. Flying item icon towards Armory jump link
  if (animLayer && targetInventory) {
    const invRect = targetInventory.getBoundingClientRect();
    const flyingItem = document.createElement("div");
    flyingItem.className = "flying-rpg-particle flying-item-icon";
    flyingItem.innerHTML = renderItemThumbnail(itemKey, "", "md");
    flyingItem.style.left = (rect.left + rect.width / 2 - 16) + "px";
    flyingItem.style.top = (rect.top - 16) + "px";
    animLayer.appendChild(flyingItem);

    requestAnimationFrame(function() {
      flyingItem.style.transform = 'translate(' + (invRect.left - rect.left) + 'px, ' + (invRect.top - rect.top) + 'px) scale(0.4)';
      flyingItem.style.opacity = '0';
    });

    setTimeout(function() {
      if (flyingItem.parentNode) flyingItem.parentNode.removeChild(flyingItem);
      targetInventory.classList.add("nav-item-receive");
      setTimeout(function() { targetInventory.classList.remove("nav-item-receive"); }, 500);
    }, 550);
  }

  setTimeout(onComplete, 550);
}

// ============================================
// THE BLACKSMITH FORGE (Refining & Crafting)
// ============================================

let currentForgeMode = "refine";
let selectedRefineItemRef = null;

function switchForgeMode(mode) {
  currentForgeMode = mode;
  const tabRefine = document.getElementById("tabRefine");
  const tabCraft = document.getElementById("tabCraft");
  const viewRefine = document.getElementById("forgeRefineView");
  const viewCraft = document.getElementById("forgeCraftView");

  if (tabRefine) {
    tabRefine.classList.toggle("active", mode === "refine");
    tabRefine.setAttribute("aria-selected", mode === "refine" ? "true" : "false");
  }
  if (tabCraft) {
    tabCraft.classList.toggle("active", mode === "craft");
    tabCraft.setAttribute("aria-selected", mode === "craft" ? "true" : "false");
  }
  if (viewRefine) viewRefine.hidden = mode !== "refine";
  if (viewCraft) viewCraft.hidden = mode !== "craft";
}

function playCoinSound() {
  if (!soundEnabled) return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    if (!audioCtx) audioCtx = new AudioCtx();
    if (audioCtx.state === "suspended") audioCtx.resume();
    const now = audioCtx.currentTime;

    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(1800, now);
    osc1.frequency.exponentialRampToValueAtTime(2400, now + 0.08);
    gain1.gain.setValueAtTime(0.25, now);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);
    osc1.start(now);
    osc1.stop(now + 0.2);

    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(2800, now + 0.07);
    osc2.frequency.exponentialRampToValueAtTime(3200, now + 0.22);
    gain2.gain.setValueAtTime(0.2, now + 0.07);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);
    osc2.start(now + 0.07);
    osc2.stop(now + 0.32);
  } catch (e) {}
}

function playRefineGatherSound() {
  if (!soundEnabled) return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    if (!audioCtx) audioCtx = new AudioCtx();
    if (audioCtx.state === "suspended") audioCtx.resume();
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(520, now + 1.6);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.linearRampToValueAtTime(0.28, now + 1.5);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 1.85);
  } catch (e) {}
}

function playRefineSuccessSound() {
  if (!soundEnabled) return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    if (!audioCtx) audioCtx = new AudioCtx();
    if (audioCtx.state === "suspended") audioCtx.resume();
    const now = audioCtx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach(function(freq, i) {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + i * 0.08);
      gain.gain.setValueAtTime(0.2, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 0.45);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.5);
    });
  } catch (e) {}
}

function playRefineFailSound() {
  if (!soundEnabled) return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    if (!audioCtx) audioCtx = new AudioCtx();
    if (audioCtx.state === "suspended") audioCtx.resume();
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(95, now + 0.35);
    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.5);
  } catch (e) {}
}

function playCraftingSound() {
  if (!soundEnabled) return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    if (!audioCtx) audioCtx = new AudioCtx();
    if (audioCtx.state === "suspended") audioCtx.resume();
    const now = audioCtx.currentTime;
    [330, 440, 554, 660, 880].forEach(function(freq, i) {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now + i * 0.12);
      gain.gain.setValueAtTime(0.18, now + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.12 + 0.4);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now + i * 0.12);
      osc.stop(now + i * 0.12 + 0.45);
    });
  } catch (e) {}
}

function playAnvilSound() {
  if (!soundEnabled) return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    if (!audioCtx) audioCtx = new AudioCtx();
    if (audioCtx.state === "suspended") audioCtx.resume();

    const now = audioCtx.currentTime;
    // High metallic chime
    const pingOsc = audioCtx.createOscillator();
    const pingGain = audioCtx.createGain();
    pingOsc.type = "sine";
    pingOsc.frequency.setValueAtTime(2200, now);
    pingOsc.frequency.exponentialRampToValueAtTime(700, now + 0.18);

    pingGain.gain.setValueAtTime(0.35, now);
    pingGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

    pingOsc.connect(pingGain);
    pingGain.connect(audioCtx.destination);
    pingOsc.start(now);
    pingOsc.stop(now + 0.4);

    // Warm strike body
    const ringOsc = audioCtx.createOscillator();
    const ringGain = audioCtx.createGain();
    ringOsc.type = "triangle";
    ringOsc.frequency.setValueAtTime(420, now);
    ringOsc.frequency.exponentialRampToValueAtTime(260, now + 0.28);

    ringGain.gain.setValueAtTime(0.25, now);
    ringGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

    ringOsc.connect(ringGain);
    ringGain.connect(audioCtx.destination);
    ringOsc.start(now);
    ringOsc.stop(now + 0.5);
  } catch (e) {}
}

function countMaterialInBag(matKey) {
  return inventory.filter(function(it) { return it && it.key === matKey; }).length;
}

function removeMaterialsFromBag(matKey, count) {
  let removed = 0;
  for (let i = inventory.length - 1; i >= 0; i--) {
    if (inventory[i] && inventory[i].key === matKey) {
      inventory.splice(i, 1);
      removed++;
      if (removed >= count) break;
    }
  }
}

// Find all refineable gear in equipped slots and bag
function getRefineableGear() {
  const list = [];
  const slots = ["weapon", "armor", "helmet", "boots", "relic"];
  slots.forEach(function(s) {
    if (equipped[s]) {
      list.push({ item: equipped[s], location: "Equipped (" + s.toUpperCase() + ")", source: "equipped", slot: s });
    }
  });

  inventory.forEach(function(it, idx) {
    if (["weapon", "armor", "helmet", "boots", "relic"].includes(it.type)) {
      list.push({ item: it, location: "Bag (Slot " + (idx + 1) + ")", source: "bag", index: idx });
    }
  });

  return list;
}

function updateRefineItemOptions() {
  const select = document.getElementById("refineItemSelect");
  if (!select) return;

  const gearList = getRefineableGear();
  const prevVal = select.value;
  select.innerHTML = '<option value="">-- Choose Gear to Refine --</option>';

  gearList.forEach(function(entry) {
    const it = entry.item;
    const tier = it.refineLevel ? " +" + it.refineLevel : " +0";
    const opt = document.createElement("option");
    opt.value = it.id;
    opt.textContent = it.name + tier + " — " + entry.location;
    select.appendChild(opt);
  });

  if (prevVal && select.querySelector('option[value="' + prevVal + '"]')) {
    select.value = prevVal;
    onSelectRefineItem(prevVal);
  } else if (gearList.length > 0) {
    select.value = gearList[0].item.id;
    onSelectRefineItem(gearList[0].item.id);
  } else {
    onSelectRefineItem("");
  }
}

function onSelectRefineItem(itemId) {
  const gearList = getRefineableGear();
  const entry = gearList.find(function(g) { return g.item.id === itemId; });

  const nameEl = document.getElementById("refineItemName");
  const baseIcon = document.getElementById("anvilBaseIcon");
  const curTierEl = document.getElementById("refineCurrentTier");
  const nextTierEl = document.getElementById("refineNextTier");
  const statsPreview = document.getElementById("refineStatsPreview");
  const costItems = document.getElementById("refineCostItems");
  const successVal = document.getElementById("successRateVal");
  const luckHint = document.getElementById("luckBonusHint");
  const btnStrike = document.getElementById("btnStrikeAnvil");

  if (!entry) {
    selectedRefineItemRef = null;
    if (nameEl) nameEl.textContent = "Select an item above";
    if (baseIcon) baseIcon.innerHTML = renderSlotPlaceholder("weapon");
    if (curTierEl) curTierEl.textContent = "+0";
    if (nextTierEl) nextTierEl.textContent = "+1";
    if (statsPreview) statsPreview.textContent = "Refining improves base stats, gold bounties, and critical fortunes.";
    if (costItems) costItems.innerHTML = '<span style="font-size: 11px; color: var(--silver);">No gear selected</span>';
    if (btnStrike) btnStrike.disabled = true;
    return;
  }

  selectedRefineItemRef = entry;
  const item = entry.item;
  const currentTier = item.refineLevel || 0;
  const isMaxTier = currentTier >= 5;

  if (nameEl) nameEl.textContent = item.name + (currentTier > 0 ? " +" + currentTier : "");
  if (baseIcon) baseIcon.innerHTML = renderItemVisual(item, { size: "xl", showTier: false, frame: false });
  if (curTierEl) curTierEl.textContent = "+" + currentTier;
  if (nextTierEl) nextTierEl.textContent = isMaxTier ? "MAX" : "+" + (currentTier + 1);

  if (isMaxTier) {
    if (statsPreview) statsPreview.textContent = "Masterwork Level! This artifact has reached maximum forged perfection.";
    if (costItems) costItems.innerHTML = '<span class="cost-chip is-met">⭐ Fully Refined</span>';
    if (btnStrike) {
      btnStrike.disabled = true;
      btnStrike.textContent = "Masterwork Limit Reached";
    }
    return;
  }

  // Refinement Cost Formula
  const nextTier = currentTier + 1;
  const requiredGold = 35 * nextTier;
  const requiredOre = Math.min(4, nextTier);
  const requiredDust = nextTier >= 3 ? Math.min(3, nextTier - 2) : 0;
  const requiredShard = nextTier >= 4 ? 1 : 0;

  const playerOre = countMaterialInBag("iron_ore");
  const playerDust = countMaterialInBag("arcane_dust");

  const hasGold = gold >= requiredGold;
  const hasOre = playerOre >= requiredOre;
  const hasDust = playerDust >= requiredDust;
  const hasShard = shards >= requiredShard;

  const canRefine = hasGold && hasOre && hasDust && hasShard;

  // Stat preview
  if (statsPreview) {
    statsPreview.textContent =
      "Refining to +" + nextTier + " grants +2 to Primary Stats, +4% Quest Gold, and strengthens armor resilience.";
  }

  // Cost chips
  const chips = [];
  chips.push('<span class="cost-chip ' + (hasGold ? "is-met" : "is-missing") + '">' + renderCurrencyIcon("gold") + requiredGold + ' Gold (' + gold + ')</span>');
  chips.push('<span class="cost-chip ' + (hasOre ? "is-met" : "is-missing") + '">' + renderItemThumbnail("iron_ore") + requiredOre + ' Iron Ore (' + playerOre + ')</span>');
  if (requiredDust > 0) {
    chips.push('<span class="cost-chip ' + (hasDust ? "is-met" : "is-missing") + '">' + renderItemThumbnail("arcane_dust") + requiredDust + ' Star Dust (' + playerDust + ')</span>');
  }
  if (requiredShard > 0) {
    chips.push('<span class="cost-chip ' + (hasShard ? "is-met" : "is-missing") + '">' + renderCurrencyIcon("shard") + requiredShard + ' Arcane Shard (' + shards + ')</span>');
  }
  if (costItems) costItems.innerHTML = chips.join("");

  // Success rate with Luck bonus
  const baseSuccess = Math.max(50, 100 - (currentTier * 12));
  const luckBonus = Math.min(25, Math.floor(stats.lck * 0.8));
  const finalSuccess = Math.min(100, baseSuccess + luckBonus);

  if (successVal) successVal.textContent = finalSuccess + "%";
  if (luckHint) luckHint.textContent = "(🍀 +" + luckBonus + "% Luck Bonus)";

  if (btnStrike) {
    btnStrike.disabled = !canRefine;
    btnStrike.textContent = canRefine ? "🔨 Strike the Anvil" : "Missing Reagents";
  }
}

let isRefining = false;
let refineAnimationTimer = null;
let currentRefineOutcome = null;

function strikeAnvil() {
  if (isRefining) return;
  if (!selectedRefineItemRef) return;
  const item = selectedRefineItemRef.item;
  const currentTier = item.refineLevel || 0;
  if (currentTier >= 5) return;

  const nextTier = currentTier + 1;
  const requiredGold = 35 * nextTier;
  const requiredOre = Math.min(4, nextTier);
  const requiredDust = nextTier >= 3 ? Math.min(3, nextTier - 2) : 0;
  const requiredShard = nextTier >= 4 ? 1 : 0;

  if (gold < requiredGold || countMaterialInBag("iron_ore") < requiredOre ||
      countMaterialInBag("arcane_dust") < requiredDust || shards < requiredShard) {
    showToast("Missing required forge reagents!", "ember");
    return;
  }

  // Deduct costs
  gold -= requiredGold;
  if (requiredShard > 0) shards -= requiredShard;
  removeMaterialsFromBag("iron_ore", requiredOre);
  if (requiredDust > 0) removeMaterialsFromBag("arcane_dust", requiredDust);

  // Roll success
  const baseSuccess = Math.max(50, 100 - (currentTier * 12));
  const luckBonus = Math.min(25, Math.floor(stats.lck * 0.8));
  const finalSuccess = Math.min(100, baseSuccess + luckBonus);
  const roll = Math.random() * 100;
  const isSuccess = roll <= finalSuccess;

  currentRefineOutcome = {
    item: item,
    nextTier: nextTier,
    isSuccess: isSuccess
  };

  isRefining = true;
  const btnStrike = document.getElementById("btnStrikeAnvil");
  const btnSkip = document.getElementById("btnSkipRefine");
  const anvilStage = document.getElementById("anvilStage");

  if (btnStrike) {
    btnStrike.disabled = true;
    btnStrike.textContent = "⚡ Attuning Runes...";
  }
  if (btnSkip) btnSkip.hidden = false;
  if (anvilStage) {
    anvilStage.classList.add("is-gathering");
  }

  playRefineGatherSound();

  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const delay = prefersReduced ? 60 : 1800;

  refineAnimationTimer = setTimeout(function() {
    finalizeRefineStrike();
  }, delay);
}

function skipRefineAnimation() {
  if (!isRefining || !currentRefineOutcome) return;
  if (refineAnimationTimer) {
    clearTimeout(refineAnimationTimer);
    refineAnimationTimer = null;
  }
  finalizeRefineStrike();
}

function finalizeRefineStrike() {
  if (!currentRefineOutcome) return;
  const outcome = currentRefineOutcome;
  const item = outcome.item;
  const nextTier = outcome.nextTier;
  const isSuccess = outcome.isSuccess;
  currentRefineOutcome = null;

  const anvilStage = document.getElementById("anvilStage");
  const btnStrike = document.getElementById("btnStrikeAnvil");
  const btnSkip = document.getElementById("btnSkipRefine");

  if (anvilStage) {
    anvilStage.classList.remove("is-gathering");
    anvilStage.classList.add("is-striking");
    setTimeout(function() {
      anvilStage.classList.remove("is-striking");
    }, 600);
  }

  playAnvilSound();

  if (isSuccess) {
    item.refineLevel = nextTier;
    if (!item.stats) item.stats = {};
    if (item.type === "weapon") {
      item.stats.str = (item.stats.str || 0) + 2;
      item.goldPercent = (item.goldPercent || 0) + 4;
    } else if (item.type === "armor") {
      item.stats.end = (item.stats.end || 0) + 2;
      item.shields = (item.shields || 0) + 1;
    } else if (item.type === "helmet") {
      item.stats.int = (item.stats.int || 0) + 2;
      item.xpPercent = (item.xpPercent || 0) + 4;
    } else if (item.type === "boots") {
      item.stats.lck = (item.stats.lck || 0) + 2;
      item.critPercent = (item.critPercent || 0) + 4;
    } else if (item.type === "relic") {
      item.stats.str = (item.stats.str || 0) + 1;
      item.stats.int = (item.stats.int || 0) + 1;
      item.stats.end = (item.stats.end || 0) + 1;
      item.stats.lck = (item.stats.lck || 0) + 1;
    }

    if (anvilStage) {
      anvilStage.classList.add("strike-success-glow");
      setTimeout(function() { anvilStage.classList.remove("strike-success-glow"); }, 900);
    }

    playRefineSuccessSound();
    triggerConfetti();
    showToast("✨ FORGE SUCCESS! " + item.name + " upgraded to +" + nextTier + "!", "milestone");
    if (typeof triggerCompanionReaction === "function") {
      triggerCompanionReaction("refine");
    }
  } else {
    // Failure
    if (anvilStage) {
      anvilStage.classList.add("strike-fail-smoke");
      setTimeout(function() { anvilStage.classList.remove("strike-fail-smoke"); }, 900);
    }
    playRefineFailSound();
    showToast("The metal cooled too quickly — refinement failed. Reagents consumed.", "ember");
  }

  saveProgress();
  renderTasks();
  onSelectRefineItem(item.id);

  if (btnSkip) btnSkip.hidden = true;
  isRefining = false;
}

// Crafting Workshop Recipes
const CRAFTING_RECIPES = [
  {
    key: "recipe_runic_mail",
    resultKey: "runic_mail",
    goldCost: 70,
    materials: [
      { key: "iron_ore", count: 3, name: "Shadow Iron Ore" },
      { key: "arcane_dust", count: 2, name: "Arcane Star Dust" }
    ]
  },
  {
    key: "recipe_shadow_dagger",
    resultKey: "shadow_dagger",
    goldCost: 65,
    materials: [
      { key: "iron_ore", count: 3, name: "Shadow Iron Ore" },
      { key: "arcane_dust", count: 1, name: "Arcane Star Dust" }
    ]
  },
  {
    key: "recipe_boots_of_the_wind",
    resultKey: "boots_of_the_wind",
    goldCost: 75,
    materials: [
      { key: "iron_ore", count: 2, name: "Shadow Iron Ore" },
      { key: "arcane_dust", count: 2, name: "Arcane Star Dust" }
    ]
  },
  {
    key: "recipe_ring_of_focus",
    resultKey: "ring_of_focus",
    goldCost: 100,
    materials: [
      { key: "arcane_dust", count: 3, name: "Arcane Star Dust" }
    ],
    shardCost: 1
  },
  {
    key: "recipe_minor_xp_elixir",
    resultKey: "minor_xp_elixir",
    goldCost: 25,
    materials: [
      { key: "arcane_dust", count: 2, name: "Arcane Star Dust" }
    ]
  }
];

function renderRecipes() {
  const grid = document.getElementById("recipesGrid");
  if (!grid) return;

  grid.innerHTML = "";

  CRAFTING_RECIPES.forEach(function(recipe) {
    const template = ITEM_CATALOG[recipe.resultKey];
    if (!template) return;

    const hasGold = gold >= recipe.goldCost;
    const hasShard = !recipe.shardCost || shards >= recipe.shardCost;
    const bagFull = inventory.length >= 20;

    let allMatsMet = hasGold && hasShard;

    const matChips = [];
    matChips.push('<span class="cost-chip ' + (hasGold ? "is-met" : "is-missing") + '">' + renderCurrencyIcon("gold") + recipe.goldCost + ' Gold</span>');
    if (recipe.shardCost) {
      matChips.push('<span class="cost-chip ' + (hasShard ? "is-met" : "is-missing") + '">' + renderCurrencyIcon("shard") + recipe.shardCost + ' Shard</span>');
    }

    recipe.materials.forEach(function(req) {
      const playerHas = countMaterialInBag(req.key);
      const isMet = playerHas >= req.count;
      if (!isMet) allMatsMet = false;
      matChips.push('<span class="cost-chip ' + (isMet ? "is-met" : "is-missing") + '">' + renderItemThumbnail(req.key) + req.count + 'x ' + req.name + ' (' + playerHas + ')</span>');
    });

    const card = document.createElement("div");
    card.className = "recipe-card rarity-" + template.rarity;

    card.innerHTML =
      '<div class="recipe-head">' +
        renderItemVisual(template, { size: "lg", showTier: false }) +
        '<div>' +
          '<h3 class="recipe-name">' + template.name + '</h3>' +
          '<span class="recipe-type">' + template.rarity + ' ' + template.type + '</span>' +
        '</div>' +
      '</div>' +
      '<p class="recipe-perk">' + (template.lore || "") + '</p>' +
      '<span class="recipe-mats-title">Required Materials</span>' +
      '<div class="recipe-mats-list">' + matChips.join("") + '</div>' +
      '<button type="button" class="btn-primary btn-craft" ' + (!allMatsMet || bagFull ? "disabled" : "") + ' onclick="craftItem(\'' + recipe.key + '\')">' +
        (bagFull ? "Bag Full" : (allMatsMet ? "🔨 Craft Item" : "Missing Reagents")) +
      '</button>';

    grid.appendChild(card);
  });
}

let isCrafting = false;
let craftAnimationTimer = null;
let currentCraftOutcome = null;

function craftItem(recipeKey) {
  if (isCrafting) return;
  const recipe = CRAFTING_RECIPES.find(function(r) { return r.key === recipeKey; });
  const template = recipe ? ITEM_CATALOG[recipe.resultKey] : null;
  if (!recipe || !template) return;

  if (inventory.length >= 20) {
    showToast("Inventory bag is full (20/20)! Sell an item first.", "ember");
    return;
  }

  // Check costs
  if (gold < recipe.goldCost) {
    showToast("Not enough Gold coins to craft this artifact!", "ember");
    return;
  }
  if (recipe.shardCost && shards < recipe.shardCost) {
    showToast("Missing required Arcane Shards!", "ember");
    return;
  }
  for (let i = 0; i < recipe.materials.length; i++) {
    const req = recipe.materials[i];
    if (countMaterialInBag(req.key) < req.count) {
      showToast("Missing " + req.name + "!", "ember");
      return;
    }
  }

  // Deduct
  gold -= recipe.goldCost;
  if (recipe.shardCost) shards -= recipe.shardCost;
  recipe.materials.forEach(function(req) {
    removeMaterialsFromBag(req.key, req.count);
  });

  // Create instance
  const instance = makeItemInstance(recipe.resultKey);
  inventory.push(instance);
  saveProgress();

  currentCraftOutcome = {
    recipe: recipe,
    template: template,
    instance: instance
  };

  isCrafting = true;
  openCraftingAnimationModal(recipe, template, instance);
}

function openCraftingAnimationModal(recipe, template, instance) {
  const modal = document.getElementById("craftingModal");
  const swirl = document.getElementById("craftingReagentsSwirl");
  const resultPreview = document.getElementById("craftingResultPreview");
  const title = document.getElementById("craftingModalTitle");
  const status = document.getElementById("craftingModalStatus");
  const btnSkip = document.getElementById("btnSkipCrafting");
  const btnClose = document.getElementById("btnCloseCrafting");

  if (!modal) {
    finalizeCraft();
    return;
  }

  modal.hidden = false;
  modal.classList.add("is-active", "is-forging");
  modal.classList.remove("is-completed");

  if (btnSkip) btnSkip.hidden = false;
  if (btnClose) btnClose.hidden = true;
  if (title) title.textContent = "Forging " + template.name + "...";
  if (status) status.textContent = "Transmuting reagents and infusing arcane runes...";

  // Populate swirling reagents
  if (swirl) {
    let swirlHtml = "";
    recipe.materials.forEach(function(m, idx) {
      for (let k = 0; k < Math.min(3, m.count); k++) {
        swirlHtml += '<div class="swirl-reagent reagent-m' + idx + ' item-' + k + '">' + renderItemThumbnail(m.key, m.name, "md") + '</div>';
      }
    });
    if (recipe.shardCost) {
      swirlHtml += '<div class="swirl-reagent reagent-shard">' + renderCurrencyIcon("shard", "md") + '</div>';
    }
    swirlHtml += '<div class="swirl-reagent reagent-gold">' + renderCurrencyIcon("gold", "md") + '</div>';
    swirl.innerHTML = swirlHtml;
  }

  if (resultPreview) {
    resultPreview.innerHTML = renderItemVisual(instance, { size: "xl", frame: true });
    resultPreview.style.opacity = "0";
    resultPreview.style.transform = "scale(0.3)";
  }

  playCraftingSound();

  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const delay = prefersReduced ? 80 : 2200;

  craftAnimationTimer = setTimeout(function() {
    finalizeCraft();
  }, delay);
}

function skipCraftingAnimation() {
  if (!isCrafting) return;
  if (craftAnimationTimer) {
    clearTimeout(craftAnimationTimer);
    craftAnimationTimer = null;
  }
  finalizeCraft();
}

function finalizeCraft() {
  if (!currentCraftOutcome) return;
  const outcome = currentCraftOutcome;
  const template = outcome.template;
  const modal = document.getElementById("craftingModal");
  const resultPreview = document.getElementById("craftingResultPreview");
  const title = document.getElementById("craftingModalTitle");
  const status = document.getElementById("craftingModalStatus");
  const btnSkip = document.getElementById("btnSkipCrafting");
  const btnClose = document.getElementById("btnCloseCrafting");

  if (modal) {
    modal.classList.remove("is-forging");
    modal.classList.add("is-completed");
  }

  if (resultPreview) {
    resultPreview.style.opacity = "1";
    resultPreview.style.transform = "scale(1)";
    resultPreview.classList.add("reveal-burst");
  }

  if (title) title.textContent = "✨ Forged: " + template.name + "!";
  if (status) status.textContent = "The masterwork is complete! Crafted artifact has been placed in your inventory bag.";
  if (btnSkip) btnSkip.hidden = true;
  if (btnClose) btnClose.hidden = false;

  playAnvilSound();
  playRefineSuccessSound();
  triggerConfetti();
  renderTasks();
  showToast("🔨 Forged " + template.name + " with legendary craft!", "milestone");
  if (typeof triggerCompanionReaction === "function") {
    triggerCompanionReaction("craft");
  }
}

function closeCraftingModal() {
  const modal = document.getElementById("craftingModal");
  if (modal) {
    modal.classList.remove("is-active", "is-forging", "is-completed");
    modal.hidden = true;
  }
  isCrafting = false;
  currentCraftOutcome = null;
}

// Render rank ladder and achievements from current progress
function renderChronicles(stats) {
  const ladder = document.getElementById("rankLadder");
  const grid = document.getElementById("achievementGrid");
  if (!ladder || !grid) return;

  const currentTitle = getPlayerTitle(stats.level);

  ladder.innerHTML = "";

  RANKS.forEach(function(rank) {
    const unlocked = stats.level >= rank.level;
    const row = document.createElement("div");
    row.className = "rank-row";
    if (unlocked) row.classList.add("unlocked");
    if (unlocked && rank.title === currentTitle) row.classList.add("current");

    const mark = document.createElement("span");
    mark.className = "rank-mark";
    mark.setAttribute("aria-hidden", "true");
    mark.textContent = unlocked ? "◆" : "◇";

    const name = document.createElement("span");
    name.className = "rank-name";
    name.textContent = rank.title;

    const req = document.createElement("span");
    req.className = "rank-req";
    req.textContent = "Lv " + rank.level;

    row.appendChild(mark);
    row.appendChild(name);
    row.appendChild(req);
    ladder.appendChild(row);
  });

  const nextRank = RANKS.find(function(rank) {
    return rank.level > stats.level;
  });

  const note = document.createElement("p");
  note.className = "rank-next";
  note.textContent = nextRank
    ? "Next rank: " + nextRank.title + " at level " + nextRank.level
    : "Highest rank attained — the chronicles remember.";

  ladder.appendChild(note);

  grid.innerHTML = "";

  ACHIEVEMENTS.forEach(function(achievement) {
    const unlocked = achievement.test(stats);
    const item = document.createElement("div");
    item.className = "achievement" + (unlocked ? " unlocked" : "");
    item.title = achievement.requirement;
    item.setAttribute("aria-label", achievement.name + " — " + (unlocked ? "unlocked" : "locked: " + achievement.requirement));

    const icon = document.createElement("span");
    icon.className = "ach-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = achievement.glyph;

    const name = document.createElement("span");
    name.className = "ach-name";
    name.textContent = achievement.name;

    const state = document.createElement("span");
    state.className = "ach-state";
    state.textContent = unlocked ? "Unlocked" : "Locked";

    item.appendChild(icon);
    item.appendChild(name);
    item.appendChild(state);
    grid.appendChild(item);
  });
}

// 4. Add a new quest
function addTask() {
  const input = document.getElementById("taskInput");
  const difficultySelect = document.getElementById("difficultySelect");
  const task = input.value.trim();

  if (task === "") return;

  const difficulty = difficultySelect ? difficultySelect.value : "medium";
  const dueInput = document.getElementById("dueInput");
  const dueValue = dueInput ? dueInput.value : "";

  const quest = {
    name: task,
    difficulty: difficulty,
    completed: false
  };

  if (isValidDateKey(dueValue)) {
    quest.due = dueValue;
  }

  quests.push(quest);

  input.value = "";

  if (dueInput) {
    dueInput.value = "";
  }

  // Stay on "Today" only if the new quest belongs there
  if (currentFilter === "today" && !isQuestDueNow(quest)) {
    currentFilter = "all";
  }

  // Clear a search that would hide the quest that was just added
  if (searchTerm !== "") {
    const searchInput = document.getElementById("questSearch");
    if (searchInput) searchInput.value = "";
    searchTerm = "";
  }

  // Switch to 'all' if user was viewing only completed quests so they see the new quest
  if (currentFilter === "completed") {
    currentFilter = "all";
  }

  saveProgress();
  renderTasks();
}

// 5. Clear all completed quests
// Move every overdue quest's due date to today; completed and future quests are left alone
function rescheduleOverdue() {
  const key = todayKey();
  const overdue = quests.filter(isQuestOverdue);

  if (overdue.length === 0) {
    showToast("Nothing is overdue — the road is clear.");
    return;
  }

  overdue.forEach(function(quest) {
    quest.due = key;
  });

  saveProgress();
  renderTasks();

  showToast(overdue.length === 1
    ? "Moved 1 overdue quest to today."
    : "Moved " + overdue.length + " overdue quests to today.");
}

function clearCompleted() {
  const completedCount = quests.filter(function(quest) {
    return quest.completed;
  }).length;

  if (completedCount === 0) {
    alert("You have no completed quests to clear!");
    return;
  }

  const confirmed = confirm("Are you sure you want to remove " + completedCount + " completed quest(s)?");

  if (confirmed) {
    // Use Array.filter() to keep only incomplete quests
    quests = quests.filter(function(quest) {
      return !quest.completed;
    });

    if (editingQuest && quests.indexOf(editingQuest) === -1) {
      editingQuest = null;
    }

    saveProgress();
    renderTasks();
  }
}

// 6. Display saved quests, the adventurer's name and sound state when the page opens
renderTasks();
renderPlayerName();
initRenameInput();
updateSoundButton();

// 7. Listen for the Enter key on the input field
const taskInput = document.getElementById("taskInput");
if (taskInput) {
  taskInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
      addTask();
    }
  });
}

// 8. Re-read the streak when the tab regains focus, so a page left open
//    overnight never shows yesterday's credit as today's
function refreshStreakFromStorage() {
  streak = loadStreak();
  renderStreak();
}

document.addEventListener("visibilitychange", function() {
  if (document.visibilityState === "visible") {
    refreshStreakFromStorage();
  }
});

window.addEventListener("focus", refreshStreakFromStorage);

// ============================================
// 9. Adventurer feedback portal
// Posts to Netlify Forms through the form named
// in the markup, so submissions land in the
// Netlify dashboard. No keys in the browser.
// ============================================

const FEEDBACK_FORM_NAME = "adventurer-feedback";

function initFeedbackForm() {
  const form = document.getElementById("feedbackForm");
  if (!form) return;

  const categoryInput = document.getElementById("feedbackCategory");
  const emailInput = document.getElementById("feedbackEmail");
  const messageInput = document.getElementById("feedbackMessage");
  const countEl = document.getElementById("feedbackCount");
  const submitButton = document.getElementById("feedbackSubmit");
  const statusEl = document.getElementById("feedbackStatus");
  const messageError = document.getElementById("feedbackMessageError");
  const emailError = document.getElementById("feedbackEmailError");
  const formError = document.getElementById("feedbackError");
  const successEl = document.getElementById("feedbackSuccess");
  const againButton = document.getElementById("feedbackAgain");
  const honeypot = document.getElementById("feedbackBot");

  let isSubmitting = false;

  function updateCount() {
    countEl.textContent = messageInput.value.length + " / " + messageInput.maxLength;
  }

  function setFieldError(input, target, text) {
    target.textContent = text;
    target.hidden = false;
    input.classList.add("invalid");
    input.setAttribute("aria-invalid", "true");
  }

  function clearFieldError(input, target) {
    target.textContent = "";
    target.hidden = true;
    input.classList.remove("invalid");
    input.removeAttribute("aria-invalid");
  }

  function clearAllFeedback() {
    clearFieldError(messageInput, messageError);
    clearFieldError(emailInput, emailError);
    formError.textContent = "";
    formError.hidden = true;
    statusEl.textContent = "";
  }

  function validate() {
    clearAllFeedback();

    const message = messageInput.value.trim();
    const email = emailInput.value.trim();
    let firstInvalid = null;

    if (message === "") {
      setFieldError(messageInput, messageError, "Please write a message before sending.");
      firstInvalid = messageInput;
    }

    if (email !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFieldError(emailInput, emailError, "That address does not look right — correct it, or leave the field empty.");
      if (!firstInvalid) firstInvalid = emailInput;
    }

    if (firstInvalid) {
      firstInvalid.focus();
      return null;
    }

    return { category: categoryInput.value, email: email, message: message };
  }

  function showSuccess() {
    form.hidden = true;
    successEl.hidden = false;
    successEl.focus();
  }

  function resetToForm() {
    form.reset();
    updateCount();
    clearAllFeedback();
    successEl.hidden = true;
    form.hidden = false;
    messageInput.focus();
  }

  function send(payload) {
    const body = new URLSearchParams();
    body.set("form-name", FEEDBACK_FORM_NAME);
    body.set("category", payload.category);
    body.set("message", payload.message);
    body.set("email", payload.email);
    body.set("bot-field", honeypot ? honeypot.value : "");

    return fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString()
    }).then(function (response) {
      if (!response.ok) {
        throw new Error("Feedback request failed with status " + response.status);
      }
      return response;
    });
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (isSubmitting) return;

    const payload = validate();
    if (!payload) return;

    isSubmitting = true;
    submitButton.disabled = true;
    submitButton.textContent = "Sending…";
    form.setAttribute("aria-busy", "true");
    statusEl.textContent = "Sending your message…";

    send(payload).then(function () {
      statusEl.textContent = "";
      showSuccess();
    }).catch(function (error) {
      console.warn("Feedback submission failed:", error);
      statusEl.textContent = "";
      formError.textContent = "The message could not be sent. Check your connection and try again — your text is still here.";
      formError.hidden = false;
      formError.focus();
    }).finally(function () {
      isSubmitting = false;
      submitButton.disabled = false;
      submitButton.textContent = "Send feedback";
      form.removeAttribute("aria-busy");
    });
  });

  messageInput.addEventListener("input", function () {
    updateCount();
    if (!messageError.hidden) {
      clearFieldError(messageInput, messageError);
    }
  });

  emailInput.addEventListener("input", function () {
    if (!emailError.hidden) {
      clearFieldError(emailInput, emailError);
    }
  });

  againButton.addEventListener("click", resetToForm);

  updateCount();
}

initFeedbackForm();

// ============================================



// 10. Independent Page Navigation Architecture
// ============================================

function switchPage(pageId, updateHash) {
  if (updateHash === undefined) updateHash = true;
  if (!VALID_PAGES.includes(pageId)) {
    pageId = "profile";
  }
  currentPage = pageId;

  // Manage 3D companion rendering lifecycle
  if (typeof Companion3DManager !== "undefined") {
    if (pageId === "companions") {
      Companion3DManager.resume();
    } else {
      Companion3DManager.pause();
    }
  }

  // 1. Toggle visibility of independent pages
  VALID_PAGES.forEach(function(pid) {
    const pageEl = document.getElementById("page-" + pid);
    if (pageEl) {
      if (pid === pageId) {
        pageEl.hidden = false;
        pageEl.classList.add("is-active");
      } else {
        pageEl.hidden = true;
        pageEl.classList.remove("is-active");
      }
    }
  });

  // 2. Update navigation item active states
  const navButtons = document.querySelectorAll(".nav-item");
  navButtons.forEach(function(btn) {
    const targetPage = btn.getAttribute("data-page");
    const isActive = targetPage === pageId;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-selected", isActive ? "true" : "false");
  });

  // 3. Update hash in browser URL
  if (updateHash && window.location.hash !== "#" + pageId) {
    try {
      history.pushState(null, "", "#" + pageId);
    } catch (e) {
      window.location.hash = pageId;
    }
  }

  // 4. Reset scroll of viewport
  const viewport = document.getElementById("appViewport");
  if (viewport) {
    viewport.scrollTop = 0;
  }
  window.scrollTo(0, 0);

  // 5. Close mobile navigation if open
  closeMobileNav();

  // 6. Refresh active page content
  refreshActivePageContent(pageId);
}

function refreshActivePageContent(pageId) {
  updateNavBadges();
  if (pageId === "profile" || pageId === "inventory") {
    renderArmoryAndInventory();
  }
  if (pageId === "profile" && typeof renderProfileCompanion === "function") {
    renderProfileCompanion();
  }
  if (pageId === "companions" && typeof renderCompanionsPage === "function") {
    renderCompanionsPage();
  }
  if (pageId === "shop") {
    renderShop();
  }
  if (pageId === "forge") {
    renderRecipes();
  }
  if (pageId === "refine") {
    updateRefineItemOptions();
  }
  if (pageId === "attributes") {
    renderAttributes();
  }
  if (pageId === "board") {
    renderChronicles(stats);
  }
  if (pageId === "soundtrack") {
    updateSoundtrackPageUI();
  }
  if (pageId === "themes") {
    updateThemesPageUI();
  }
}

function updateNavBadges() {
  // Quests Badge
  const questBadge = document.getElementById("navQuestBadge");
  if (questBadge) {
    const activeCount = quests.filter(function(q) { return !q.completed; }).length;
    questBadge.textContent = activeCount;
    questBadge.hidden = activeCount === 0;
  }

  // Bag Badge
  const bagBadge = document.getElementById("navBagBadge");
  if (bagBadge) {
    bagBadge.textContent = inventory.length + "/20";
  }

  // Attributes Badge
  const attrBadge = document.getElementById("navAttrBadge");
  if (attrBadge) {
    const statPoints = (typeof stats !== "undefined" && stats && typeof stats.unallocated === "number") ? stats.unallocated : 0;
    attrBadge.textContent = statPoints > 0 ? "+" + statPoints : "";
    attrBadge.hidden = statPoints <= 0;
  }

  // Streak Badge
  const streakBadge = document.getElementById("navStreakBadge");
  if (streakBadge) {
    const count = streak && typeof streak.count === "number" ? streak.count : 0;
    streakBadge.textContent = count + "d";
  }

  // Companions Badge
  const compBadge = document.getElementById("navCompanionBadge");
  if (compBadge) {
    const ownedCount = typeof companionState !== "undefined" && companionState.owned ? companionState.owned.length : 1;
    compBadge.textContent = ownedCount + "/6";
  }

  // Header balances
  const topGold = document.getElementById("topbarGold");
  if (topGold) topGold.textContent = Number(gold).toLocaleString();
  const topShards = document.getElementById("topbarShards");
  if (topShards) topShards.textContent = Number(shards).toLocaleString();
}

function toggleMobileNav() {
  const sidebar = document.getElementById("appSidebar");
  const backdrop = document.getElementById("sidebarBackdrop");
  if (!sidebar) return;
  const isOpen = sidebar.classList.contains("mobile-open");
  if (isOpen) {
    closeMobileNav();
  } else {
    sidebar.classList.add("mobile-open");
    if (backdrop) backdrop.classList.add("is-visible");
  }
}

function closeMobileNav() {
  const sidebar = document.getElementById("appSidebar");
  const backdrop = document.getElementById("sidebarBackdrop");
  if (sidebar) sidebar.classList.remove("mobile-open");
  if (backdrop) backdrop.classList.remove("is-visible");
}

function selectSoundtrackMood(mood) {
  changeMusicMood(mood);
  if (!musicPlaying) {
    toggleMusic();
  }
  updateSoundtrackPageUI();
}

function updateSoundtrackPageUI() {
  const playIcon = document.getElementById("soundtrackPagePlayIcon");
  const playLabel = document.getElementById("soundtrackPagePlayLabel");
  const volSlider = document.getElementById("soundtrackPageVol");
  const volVal = document.getElementById("soundtrackPageVolVal");

  if (playIcon) playIcon.textContent = musicPlaying ? "⏸" : "▶";
  if (playLabel) playLabel.textContent = musicPlaying ? "Pause Soundtrack" : "Play Soundtrack";
  if (volSlider) volSlider.value = musicVolume;
  if (volVal) volVal.textContent = Math.round(musicVolume * 100) + "%";

  const cards = document.querySelectorAll(".soundtrack-mood-card");
  cards.forEach(function(card) {
    const cardMood = card.getAttribute("data-mood");
    const isAttuned = cardMood === musicMood;
    card.classList.toggle("active", isAttuned);
    const badge = card.querySelector(".mood-badge");
    if (badge) badge.textContent = isAttuned ? "Attuned" : "Select";
  });
}

function updateThemesPageUI() {
  const cards = document.querySelectorAll(".theme-card");
  cards.forEach(function(card) {
    const cardTheme = card.getAttribute("data-theme");
    const isCurrent = cardTheme === currentTheme;
    card.classList.toggle("active", isCurrent);
    const tag = card.querySelector(".theme-active-tag");
    if (tag) tag.textContent = isCurrent ? "Active" : "Select";
  });
}

// Audio visualizer on Soundtrack Page
let visualizerRunning = false;
function initSoundtrackVisualizer() {
  const canvas = document.getElementById("soundtrackVisualizer");
  if (!canvas || visualizerRunning) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  visualizerRunning = true;

  let phase = 0;
  function renderFrame() {
    requestAnimationFrame(renderFrame);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const bars = 32;
    const barWidth = canvas.width / bars;
    phase += 0.04;

    for (let i = 0; i < bars; i++) {
      let height = 8;
      if (musicPlaying) {
        const sinVal = Math.sin(phase + i * 0.28) * 0.5 + 0.5;
        const cosVal = Math.cos(phase * 1.5 + i * 0.15) * 0.5 + 0.5;
        height = Math.max(8, (sinVal * 0.6 + cosVal * 0.4) * (canvas.height - 20));
      }

      const x = i * barWidth;
      const y = canvas.height - height;

      const grad = ctx.createLinearGradient(0, y, 0, canvas.height);
      grad.addColorStop(0, "#38bdf8");
      grad.addColorStop(0.6, "#818cf8");
      grad.addColorStop(1, "#f5c542");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x + 2, y, barWidth - 4, height, [3, 3, 0, 0]);
      ctx.fill();
    }
  }
  renderFrame();
}

function initTabNavigation() {
  // Read hash on load
  let initialPage = "profile";
  const hash = window.location.hash ? window.location.hash.replace("#", "") : "";
  if (VALID_PAGES.includes(hash)) {
    initialPage = hash;
  }
  switchPage(initialPage, false);

  window.addEventListener("hashchange", function() {
    const newHash = window.location.hash ? window.location.hash.replace("#", "") : "";
    if (VALID_PAGES.includes(newHash) && newHash !== currentPage) {
      switchPage(newHash, false);
    }
  });

  initSoundtrackVisualizer();
}

// Show a back-to-top control once the journal is scrolled
function initBackToTop() {
  const button = document.getElementById("backToTop");
  if (!button) return;

  const reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");

  function update() {
    button.hidden = window.scrollY < 600;
  }

  button.addEventListener("click", function() {
    const behavior = reducedMotion && reducedMotion.matches ? "auto" : "smooth";
    window.scrollTo({ top: 0, behavior: behavior });

    const heading = document.querySelector(".brand-text h1");
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
    }
  });

  window.addEventListener("scroll", update, { passive: true });
  update();
}

// "/" focuses the board search, Escape inside it clears and releases it
function initSearchShortcut() {
  const searchInput = document.getElementById("questSearch");
  if (!searchInput) return;

  document.addEventListener("keydown", function(event) {
    const target = event.target;
    const isTyping = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT" || target.isContentEditable);

    if (event.key === "/" && !isTyping) {
      event.preventDefault();
      searchInput.focus();
      searchInput.select();
    }
  });

  searchInput.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      searchInput.value = "";
      setSearch("");
      searchInput.blur();
    }
  });
}

loadCompanionState();
checkCompanionMilestones();
renderProfileCompanion();
initTabNavigation();
initBackToTop();
initSearchShortcut();
applyTheme(currentTheme);
updateMusicUI();

// ============================================
// PHASE 5: ADVENTURER VAULT & AUTHENTICATION
// Multi-Character Slots, Sign-in, Register, Portability
// ============================================

const STORAGE_KEY_ACCOUNTS = "quest_accounts";
const STORAGE_KEY_ACTIVE_ACCOUNT = "quest_active_account_id";

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str || "";
  return div.innerHTML;
}

function hashPasscode(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return "sig_" + (h >>> 0).toString(16);
}

function getAccounts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ACCOUNTS);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function saveAccounts(accounts) {
  try {
    localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(accounts));
  } catch (e) {}
}

function getActiveAccountId() {
  return localStorage.getItem(STORAGE_KEY_ACTIVE_ACCOUNT) || "guest";
}

function setActiveAccountId(id) {
  localStorage.setItem(STORAGE_KEY_ACTIVE_ACCOUNT, id || "guest");
}

function getActiveAccount() {
  const activeId = getActiveAccountId();
  if (activeId === "guest") return null;
  const accounts = getAccounts();
  return accounts.find(function(a) { return a.id === activeId; }) || null;
}

function syncActiveAccountRecord() {
  const activeId = getActiveAccountId();
  if (activeId === "guest") return;
  const accounts = getAccounts();
  const acc = accounts.find(function(a) { return a.id === activeId; });
  if (!acc) return;

  acc.data = {
    playerName: playerName,
    level: level,
    xp: xp,
    gold: gold,
    shards: shards,
    stats: stats,
    equipped: equipped,
    inventory: inventory,
    quests: quests,
    streak: streak,
    theme: currentTheme,
    soundMood: musicMood,
    soundEnabled: soundEnabled
  };
  acc.lastPlayedAt = Date.now();
  saveAccounts(accounts);
}

function loadHeroState(data, accName, archetype) {
  if (data.playerName) playerName = data.playerName;
  else if (accName) playerName = accName;
  localStorage.setItem("playerName", playerName);

  level = typeof data.level === "number" ? data.level : 1;
  xp = typeof data.xp === "number" ? data.xp : 0;
  gold = typeof data.gold === "number" ? data.gold : 50;
  shards = typeof data.shards === "number" ? data.shards : 0;

  if (data.stats && typeof data.stats === "object") {
    stats = Object.assign({ str: 8, int: 8, end: 8, lck: 8, unallocated: 0 }, data.stats);
  }

  if (data.equipped && typeof data.equipped === "object") {
    equipped = Object.assign({ weapon: null, armor: null, helmet: null, boots: null, relic: null }, data.equipped);
  }

  if (Array.isArray(data.inventory)) {
    inventory = data.inventory.slice();
  }

  if (Array.isArray(data.quests)) {
    quests = data.quests.slice();
  }

  if (data.streak && typeof data.streak === "object") {
    localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(data.streak));
    streak = loadStreak();
  } else {
    streak = emptyStreak();
  }

  if (data.theme) {
    currentTheme = data.theme;
    localStorage.setItem("quest_theme", currentTheme);
    applyTheme(currentTheme);
    const themeSelect = document.getElementById("themeSelect");
    if (themeSelect) themeSelect.value = currentTheme;
  }

  saveProgress();
  renderPlayerName();
  renderTasks();
  renderAuthUI();
}

function renderAuthUI() {
  const topbarName = document.getElementById("topbarAccountName");
  const topbarAvatar = document.getElementById("topbarAvatar");
  const topbarTag = document.getElementById("topbarVaultTag");
  const profileBadge = document.getElementById("profileAccountBadge");

  const acc = getActiveAccount();

  if (acc) {
    if (topbarName) topbarName.textContent = acc.username;
    if (topbarAvatar) topbarAvatar.textContent = acc.avatar || "🛡️";
    if (topbarTag) topbarTag.textContent = acc.archetype || "Hero";
    if (profileBadge) {
      profileBadge.innerHTML = (acc.avatar || "🛡️") + " <strong>" + escapeHtml(acc.username) + "</strong> &bull; " + (acc.archetype || "Adventurer");
    }
  } else {
    if (topbarName) topbarName.textContent = "Guest Knight";
    if (topbarAvatar) topbarAvatar.textContent = "👤";
    if (topbarTag) topbarTag.textContent = "Guest";
    if (profileBadge) {
      profileBadge.innerHTML = "👤 <strong>Guest Session</strong> (Local)";
    }
  }
}

function renderAuthSlots() {
  const bannerAvatar = document.getElementById("authBannerAvatar");
  const bannerName = document.getElementById("authBannerName");
  const bannerDesc = document.getElementById("authBannerDesc");
  const slotsList = document.getElementById("authSlotsList");

  const acc = getActiveAccount();
  if (acc) {
    if (bannerAvatar) bannerAvatar.textContent = acc.avatar || "🛡️";
    if (bannerName) bannerName.textContent = acc.username;
    if (bannerDesc) {
      const accLvl = acc.data ? (acc.data.level || 1) : 1;
      const accGld = acc.data ? (acc.data.gold || 0) : 0;
      bannerDesc.textContent = "Level " + accLvl + " " + (acc.archetype || "Adventurer") + " • 🪙 " + accGld + " Gold";
    }
  } else {
    if (bannerAvatar) bannerAvatar.textContent = "👤";
    if (bannerName) bannerName.textContent = playerName || "Dark Knight";
    if (bannerDesc) bannerDesc.textContent = "Level " + level + " • Guest Session (Unbound)";
  }

  if (!slotsList) return;
  slotsList.innerHTML = "";

  const accounts = getAccounts();
  if (accounts.length === 0) {
    slotsList.innerHTML = '<div style="text-align:center; padding:16px; color:var(--silver); font-size:12px;">No adventurer accounts sworn on this device yet.<br><span style="font-size:11px; color:var(--gold-bright);">Click &quot;Create Hero&quot; to bind your legend.</span></div>';
    return;
  }

  accounts.forEach(function(account) {
    const isActive = acc && acc.id === account.id;
    const card = document.createElement("div");
    card.className = "auth-slot-card" + (isActive ? " is-active-slot" : "");

    const accLevel = account.data ? (account.data.level || 1) : 1;
    const accGold = account.data ? (account.data.gold || 0) : 0;
    const accQuests = account.data && Array.isArray(account.data.quests) ? account.data.quests.length : 0;

    card.innerHTML =
      '<div class="slot-avatar" aria-hidden="true">' + (account.avatar || "🛡️") + '</div>' +
      '<div class="slot-info">' +
        '<h4 class="slot-name">' + escapeHtml(account.username) + (isActive ? ' <span style="font-size:10px; color:var(--gold-bright);">(Current)</span>' : '') + '</h4>' +
        '<span class="slot-sub">Lv.' + accLevel + ' ' + (account.archetype || "Hero") + ' &bull; 🪙 ' + accGold + ' &bull; ' + accQuests + ' Quests</span>' +
      '</div>' +
      '<div class="slot-actions">' +
        (isActive ?
          '<button type="button" class="btn-play-slot" disabled style="opacity:0.6;">Active</button>' :
          '<button type="button" class="btn-play-slot" onclick="switchAccountTo(\'' + account.id + '\')">Play</button>'
        ) +
        '<button type="button" class="btn-del-slot" onclick="deleteAccountSlot(\'' + account.id + '\')" title="Dissolve hero record" aria-label="Delete ' + escapeHtml(account.username) + '">🗑️</button>' +
      '</div>';

    slotsList.appendChild(card);
  });
}

function handleAuthLogin(event) {
  if (event) event.preventDefault();
  const nameInput = document.getElementById("loginHeroName");
  const passInput = document.getElementById("loginPasscode");
  if (!nameInput || !passInput) return;

  const username = nameInput.value.trim();
  const passcode = passInput.value;

  if (!username || !passcode) {
    showToast("Please provide both name and secret passcode.", "ember");
    return;
  }

  const accounts = getAccounts();
  const targetAcc = accounts.find(function(a) {
    return a.username.toLowerCase() === username.toLowerCase();
  });

  if (!targetAcc || targetAcc.passwordHash !== hashPasscode(passcode)) {
    showToast("Invalid adventurer name or secret passcode sigil.", "ember");
    return;
  }

  // Save current progress before switching
  syncActiveAccountRecord();
  saveProgress();

  setActiveAccountId(targetAcc.id);
  loadHeroState(targetAcc.data || {}, targetAcc.username, targetAcc.archetype);

  closeAuthModal();
  nameInput.value = "";
  passInput.value = "";
  showToast("⚔️ Sworn sigil verified. Welcome back, " + targetAcc.username + "!", "milestone");
}

function handleAuthRegister(event) {
  if (event) event.preventDefault();
  const nameInput = document.getElementById("regHeroName");
  const passInput = document.getElementById("regPasscode");
  const passConfirmInput = document.getElementById("regPasscodeConfirm");
  if (!nameInput || !passInput || !passConfirmInput) return;

  const username = nameInput.value.trim();
  const passcode = passInput.value;
  const passConfirm = passConfirmInput.value;

  if (!username) {
    showToast("Please enter your adventurer name.", "ember");
    return;
  }
  if (passcode.length < 4) {
    showToast("Secret passcode must be at least 4 characters.", "ember");
    return;
  }
  if (passcode !== passConfirm) {
    showToast("Passcodes do not match! Verify both entries.", "ember");
    return;
  }

  const accounts = getAccounts();
  const exists = accounts.some(function(a) {
    return a.username.toLowerCase() === username.toLowerCase();
  });

  if (exists) {
    showToast("An adventurer named '" + username + "' is already recorded in the guild archives.", "ember");
    return;
  }

  const chosenRadio = document.querySelector('input[name="heroArchetype"]:checked');
  const archetype = chosenRadio ? chosenRadio.value : "Knight";

  let avatar = "🛡️";
  let starterStats = { str: 10, int: 5, end: 8, lck: 5, unallocated: 0 };
  let starterEquip = {
    weapon: makeItemInstance("apprentice_spellblade"),
    armor: makeItemInstance("initiate_robes"),
    helmet: null,
    boots: null,
    relic: null
  };
  let starterBag = [
    makeItemInstance("iron_ore"),
    makeItemInstance("iron_ore"),
    makeItemInstance("arcane_dust")
  ];

  if (archetype === "Mage") {
    avatar = "🔮";
    starterStats = { str: 5, int: 11, end: 5, lck: 7, unallocated: 0 };
    starterEquip = {
      weapon: makeItemInstance("apprentice_spellblade"),
      armor: null,
      helmet: makeItemInstance("scholars_circlet"),
      boots: null,
      relic: null
    };
    starterBag = [
      makeItemInstance("arcane_dust"),
      makeItemInstance("arcane_dust"),
      makeItemInstance("iron_ore")
    ];
  } else if (archetype === "Rogue") {
    avatar = "🗡️";
    starterStats = { str: 7, int: 5, end: 5, lck: 11, unallocated: 0 };
    starterEquip = {
      weapon: makeItemInstance("shadow_dagger"),
      armor: null,
      helmet: null,
      boots: makeItemInstance("travelers_boots"),
      relic: null
    };
    starterBag = [
      makeItemInstance("ancient_coins"),
      makeItemInstance("iron_ore"),
      makeItemInstance("iron_ore")
    ];
  } else if (archetype === "Paladin") {
    avatar = "✨";
    starterStats = { str: 8, int: 7, end: 10, lck: 5, unallocated: 0 };
    starterEquip = {
      weapon: makeItemInstance("apprentice_spellblade"),
      armor: makeItemInstance("runic_mail"),
      helmet: null,
      boots: null,
      relic: null
    };
    starterBag = [
      makeItemInstance("iron_ore"),
      makeItemInstance("arcane_dust"),
      makeItemInstance("iron_ore")
    ];
  }

  const starterQuests = [
    {
      id: "quest_init_1",
      task: "Swear the Guild Oath and explore the sanctuary",
      difficulty: "easy",
      createdDate: new Date().toISOString(),
      dueDate: null,
      completed: false,
      completedDate: null
    },
    {
      id: "quest_init_2",
      task: "Visit the Blacksmith Forge to inspect equipment refinement",
      difficulty: "medium",
      createdDate: new Date().toISOString(),
      dueDate: null,
      completed: false,
      completedDate: null
    }
  ];

  // Save current progress before switching
  syncActiveAccountRecord();
  saveProgress();

  const newAccount = {
    id: "acc_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
    username: username,
    archetype: archetype,
    avatar: avatar,
    passwordHash: hashPasscode(passcode),
    createdAt: Date.now(),
    lastPlayedAt: Date.now(),
    data: {
      playerName: username,
      level: 1,
      xp: 0,
      gold: 60,
      shards: 1,
      stats: starterStats,
      equipped: starterEquip,
      inventory: starterBag,
      quests: starterQuests,
      streak: { current: 1, best: 1, lastActivity: todayKey(), days: [todayKey()], claimed: [], version: 1 },
      theme: currentTheme,
      soundMood: musicMood,
      soundEnabled: soundEnabled
    }
  };

  accounts.push(newAccount);
  saveAccounts(accounts);
  setActiveAccountId(newAccount.id);

  loadHeroState(newAccount.data, newAccount.username, newAccount.archetype);

  closeAuthModal();
  nameInput.value = "";
  passInput.value = "";
  passConfirmInput.value = "";
  triggerConfetti();
  showToast("✨ Oath sworn! Welcome to the realm, " + username + "!", "milestone");
}

function switchAccountTo(accountId) {
  const accounts = getAccounts();
  const target = accounts.find(function(a) { return a.id === accountId; });
  if (!target) return;

  syncActiveAccountRecord();
  saveProgress();

  setActiveAccountId(target.id);
  loadHeroState(target.data || {}, target.username, target.archetype);

  renderAuthSlots();
  renderAuthUI();
  closeAuthModal();
  showToast("Switched to adventurer: " + target.username, "milestone");
}

function continueAsGuest() {
  syncActiveAccountRecord();
  saveProgress();
  setActiveAccountId("guest");

  playerName = localStorage.getItem("playerName") || "Dark Knight";
  try {
    quests = JSON.parse(localStorage.getItem("quests")) || [];
  } catch (e) {
    quests = [];
  }
  xp = Number(localStorage.getItem("xp")) || 0;
  level = Number(localStorage.getItem("level")) || 1;
  gold = localStorage.getItem("quest_gold") !== null ? Number(localStorage.getItem("quest_gold")) : 50;
  shards = localStorage.getItem("quest_shards") !== null ? Number(localStorage.getItem("quest_shards")) : 2;
  try {
    const s = JSON.parse(localStorage.getItem("quest_stats"));
    stats = Object.assign({}, DEFAULT_STATS, s || {});
  } catch (e) {
    stats = Object.assign({}, DEFAULT_STATS);
  }
  try {
    const eq = JSON.parse(localStorage.getItem("quest_equipped"));
    equipped = eq && typeof eq === "object" ? eq : { weapon: null, armor: null, helmet: null, boots: null, relic: null };
  } catch (e) {
    equipped = { weapon: null, armor: null, helmet: null, boots: null, relic: null };
  }
  try {
    const inv = JSON.parse(localStorage.getItem("quest_inventory"));
    inventory = Array.isArray(inv) ? inv : [];
  } catch (e) {
    inventory = [];
  }
  streak = loadStreak();

  renderPlayerName();
  renderTasks();
  renderAuthUI();
  closeAuthModal();
  showToast("Switched to Guest Session.", "milestone");
}

function deleteAccountSlot(accountId) {
  const accounts = getAccounts();
  const target = accounts.find(function(a) { return a.id === accountId; });
  if (!target) return;

  if (!confirm("Are you certain you wish to dissolve " + target.username + "'s journal record forever? This cannot be undone.")) {
    return;
  }

  const updated = accounts.filter(function(a) { return a.id !== accountId; });
  saveAccounts(updated);

  if (getActiveAccountId() === accountId) {
    continueAsGuest();
  } else {
    renderAuthSlots();
  }
  showToast("Adventurer record dissolved.", "ember");
}

function exportActiveSaveFile() {
  syncActiveAccountRecord();
  const acc = getActiveAccount();
  const heroName = acc ? acc.username : playerName;
  const payload = {
    app: "Questforge",
    version: "2.0",
    exportedAt: new Date().toISOString(),
    account: acc ? {
      username: acc.username,
      archetype: acc.archetype,
      avatar: acc.avatar
    } : null,
    hero: {
      name: playerName,
      level: level,
      xp: xp,
      gold: gold,
      shards: shards,
      stats: stats,
      equipped: equipped,
      inventory: inventory,
      quests: quests,
      streak: streak,
      theme: currentTheme
    }
  };

  const str = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
  const dlAnchor = document.createElement("a");
  const safeName = heroName.toLowerCase().replace(/[^a-z0-9]/g, "-");
  dlAnchor.setAttribute("href", str);
  dlAnchor.setAttribute("download", "questforge-" + safeName + "-save.json");
  document.body.appendChild(dlAnchor);
  dlAnchor.click();
  dlAnchor.remove();

  showToast("Hero save scroll exported to file! 📜", "milestone");
}

function importSaveFile(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const parsed = JSON.parse(e.target.result);
      if (!parsed.hero || typeof parsed.hero.level !== "number") {
        throw new Error("Invalid save file structure");
      }

      const h = parsed.hero;
      const accInfo = parsed.account || {};
      const newAccName = accInfo.username || h.name || "Restored Hero";
      const archetype = accInfo.archetype || "Knight";
      const avatar = accInfo.avatar || "🛡️";

      const accounts = getAccounts();
      const newAcc = {
        id: "acc_imp_" + Date.now(),
        username: newAccName,
        archetype: archetype,
        avatar: avatar,
        passwordHash: hashPasscode("guest123"),
        createdAt: Date.now(),
        lastPlayedAt: Date.now(),
        data: {
          playerName: h.name || newAccName,
          level: h.level || 1,
          xp: h.xp || 0,
          gold: typeof h.gold === "number" ? h.gold : 50,
          shards: typeof h.shards === "number" ? h.shards : 0,
          stats: h.stats || { str: 8, int: 8, end: 8, lck: 8, unallocated: 0 },
          equipped: h.equipped || { weapon: null, armor: null, helmet: null, boots: null, relic: null },
          inventory: Array.isArray(h.inventory) ? h.inventory : [],
          quests: Array.isArray(h.quests) ? h.quests : [],
          streak: h.streak || { current: 1, best: 1, lastActivity: todayKey(), days: [todayKey()], claimed: [], version: 1 },
          theme: h.theme || currentTheme
        }
      };

      accounts.push(newAcc);
      saveAccounts(accounts);
      setActiveAccountId(newAcc.id);
      loadHeroState(newAcc.data, newAcc.username, newAcc.archetype);

      renderAuthSlots();
      renderAuthUI();
      closeAuthModal();
      triggerConfetti();
      showToast("✨ Hero scroll imported and bound into the Vault!", "milestone");
    } catch (err) {
      showToast("Could not read save file — invalid parchment sigil.", "ember");
    }
  };
  reader.readAsText(file);
  event.target.value = "";
}

function togglePasswordVisibility(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const isPw = input.type === "password";
  input.type = isPw ? "text" : "password";
  if (btn) btn.textContent = isPw ? "🔒" : "👁️";
}

function selectArchetype(val) {
  const cards = document.querySelectorAll(".archetype-card");
  cards.forEach(function(card) {
    const radio = card.querySelector('input[type="radio"]');
    card.classList.toggle("active", radio && radio.value === val);
  });
}

function openAuthModal(defaultTab) {
  const modal = document.getElementById("authModal");
  if (!modal) return;
  modal.classList.remove("hidden");
  switchAuthTab(defaultTab || "slots");
  renderAuthSlots();
}

function closeAuthModal() {
  const modal = document.getElementById("authModal");
  if (modal) modal.classList.add("hidden");
}

function switchAuthTab(tab) {
  const tabSlots = document.getElementById("authTabSlots");
  const tabLogin = document.getElementById("authTabLogin");
  const tabRegister = document.getElementById("authTabRegister");

  const viewSlots = document.getElementById("authViewSlots");
  const viewLogin = document.getElementById("authViewLogin");
  const viewRegister = document.getElementById("authViewRegister");

  if (tabSlots) {
    tabSlots.classList.toggle("active", tab === "slots");
    tabSlots.setAttribute("aria-selected", tab === "slots" ? "true" : "false");
  }
  if (tabLogin) {
    tabLogin.classList.toggle("active", tab === "login");
    tabLogin.setAttribute("aria-selected", tab === "login" ? "true" : "false");
  }
  if (tabRegister) {
    tabRegister.classList.toggle("active", tab === "register");
    tabRegister.setAttribute("aria-selected", tab === "register" ? "true" : "false");
  }

  if (viewSlots) viewSlots.hidden = tab !== "slots";
  if (viewLogin) viewLogin.hidden = tab !== "login";
  if (viewRegister) viewRegister.hidden = tab !== "register";

  if (tab === "slots") {
    renderAuthSlots();
  }
}

// Modal backdrop click
const authOverlay = document.getElementById("authModal");
if (authOverlay) {
  authOverlay.addEventListener("click", function(e) {
    if (e.target === authOverlay) {
      closeAuthModal();
    }
  });
}

// Crafting modal backdrop click & Escape listener
const craftingModalEl = document.getElementById("craftingModal");
if (craftingModalEl) {
  craftingModalEl.addEventListener("click", function(e) {
    if (e.target === craftingModalEl && !craftingModalEl.classList.contains("is-forging")) {
      closeCraftingModal();
    }
  });
}
document.addEventListener("keydown", function(e) {
  if (e.key === "Escape") {
    const cModal = document.getElementById("craftingModal");
    if (cModal && !cModal.hidden && !cModal.classList.contains("is-forging")) {
      closeCraftingModal();
    }
  }
});

// Initialize Auth Vault state on load
(function initAuthVault() {
  const activeAcc = getActiveAccount();
  if (activeAcc && activeAcc.data) {
    loadHeroState(activeAcc.data, activeAcc.username, activeAcc.archetype);
  } else {
    renderAuthUI();
  }
})();
