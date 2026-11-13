// ============================================
// Questforge - JavaScript
// The Dark Knight's Journal
// ============================================

// 1. Load saved information from the browser
let quests = JSON.parse(localStorage.getItem("quests")) || [];
let xp = Number(localStorage.getItem("xp")) || 0;
let level = Number(localStorage.getItem("level")) || 1;

// Difficulty catalogue: the single source of truth for labels and XP rewards
const DIFFICULTY = {
  easy:   { label: "Easy",   xp: 10, pips: 1 },
  medium: { label: "Medium", xp: 20, pips: 2 },
  hard:   { label: "Hard",   xp: 50, pips: 3 }
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
  const recordedToday = streak.days.indexOf(today) !== -1;

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
  streak.days.forEach(function (key) {
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

  // Journal palette: ancient gold, arcane purple, moonlight, muted silver
  const colors = ["#D9B56D", "#EFD9A6", "#8054B8", "#E8E2F0", "#A9A6B2"];
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

  modalLevel.textContent = "Level " + newLevel;
  modalTitle.textContent = "Title: " + getPlayerTitle(newLevel);

  modal.classList.remove("hidden");

  // Trigger celebration audio and confetti
  playLevelUpSound();
  triggerConfetti();
}

// Close level-up celebration modal
function closeLevelUpModal() {
  const modal = document.getElementById("levelUpModal");
  modal.classList.add("hidden");
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

  badge.appendChild(pips);
  badge.appendChild(badgeLabel);
  badge.appendChild(badgeXP);
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

    // Award XP based on quest difficulty (defaults to 20 for older quests)
    xp += getDifficulty(quest.difficulty).xp;

    // One streak credit per calendar day, plus any milestone rewards it unlocks
    const streakResult = recordStreakDay();
    xp += sumMilestoneXP(streakResult.rewards);

    // Track level before checking for a level up
    const previousLevel = level;

    if (xp >= 100) {
      level += Math.floor(xp / 100);
      xp = xp % 100;
    }

    saveProgress();
    renderTasks();

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

    // Trigger the celebration only if the player leveled up
    if (level > previousLevel) {
      showLevelUpModal(level);
    } else if (streakResult.milestone) {
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
  document.getElementById("xp").textContent = xp;
  document.getElementById("level").textContent = level;
  document.getElementById("playerTitle").textContent = getPlayerTitle(level);
  document.getElementById("progressBar").style.width = xp + "%";

  const progressContainer = document.getElementById("progressContainer");
  if (progressContainer) {
    progressContainer.setAttribute("aria-valuenow", String(xp));
  }

  // Update dashboard
  document.getElementById("totalQuests").textContent = quests.length;
  document.getElementById("completedQuests").textContent = completedCount;
  document.getElementById("remainingQuests").textContent = remainingCount;

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

// 6. Display saved quests and sound state when the page opens
renderTasks();
updateSoundButton();

// 7. Listen for the Enter key on the input field
const taskInput = document.getElementById("taskInput");

taskInput.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    addTask();
  }
});

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
// 10. Navigation helpers
// ============================================

// Highlight the jump-bar link for the section currently under the reading line
function initJumpBar() {
  const links = Array.prototype.slice.call(document.querySelectorAll(".jump-link"));
  if (links.length === 0) return;

  const items = links.map(function(link) {
    return { link: link, section: document.querySelector(link.getAttribute("href")) };
  }).filter(function(item) {
    return Boolean(item.section);
  });

  if (items.length === 0) return;

  let ticking = false;

  function update() {
    ticking = false;

    const readingLine = window.innerHeight * 0.35;
    let current = items[0];

    items.forEach(function(item) {
      if (item.section.getBoundingClientRect().top <= readingLine) {
        current = item;
      }
    });

    // At the very bottom of the journal the last section counts as reached
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
      current = items[items.length - 1];
    }

    items.forEach(function(item) {
      const isActive = item === current;
      item.link.classList.toggle("is-active", isActive);
      if (isActive) {
        item.link.setAttribute("aria-current", "true");
      } else {
        item.link.removeAttribute("aria-current");
      }
    });
  }

  function requestUpdate() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  }

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  update();
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

initJumpBar();
initBackToTop();
initSearchShortcut();
