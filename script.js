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

// Build the inline name + difficulty editor for a quest
function buildQuestEditor(quest, diffKey) {
  const form = document.createElement("div");
  form.className = "quest-edit";

  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.id = "questEditName";
  nameInput.className = "edit-name";
  nameInput.value = quest.name;
  nameInput.autocomplete = "off";
  nameInput.setAttribute("aria-label", "Quest name");

  const diffSelect = document.createElement("select");
  diffSelect.id = "questEditDifficulty";
  diffSelect.className = "edit-difficulty";
  diffSelect.setAttribute("aria-label", "Quest difficulty");

  DIFFICULTY_ORDER.forEach(function(key) {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = DIFFICULTY[key].label + " — +" + DIFFICULTY[key].xp + " XP";
    if (key === diffKey) {
      option.selected = true;
    }
    diffSelect.appendChild(option);
  });

  function closeEditor() {
    focusQuestIndex = quests.indexOf(quest);
    editingQuest = null;
    renderTasks();
  }

  function commitEdit() {
    const name = nameInput.value.trim();

    if (name === "") {
      nameInput.classList.add("invalid");
      nameInput.focus();
      return;
    }

    quest.name = name;
    quest.difficulty = diffSelect.value;
    saveProgress();
    closeEditor();
  }

  nameInput.addEventListener("input", function() {
    nameInput.classList.remove("invalid");
  });

  nameInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      commitEdit();
    } else if (event.key === "Escape") {
      event.preventDefault();
      closeEditor();
    }
  });

  const actions = document.createElement("div");
  actions.className = "edit-actions";

  const saveButton = document.createElement("button");
  saveButton.type = "button";
  saveButton.className = "btn-save";
  saveButton.textContent = "Save";
  saveButton.onclick = commitEdit;

  const cancelButton = document.createElement("button");
  cancelButton.type = "button";
  cancelButton.className = "btn-cancel";
  cancelButton.textContent = "Cancel";
  cancelButton.onclick = closeEditor;

  actions.appendChild(saveButton);
  actions.appendChild(cancelButton);

  form.appendChild(nameInput);
  form.appendChild(diffSelect);
  form.appendChild(actions);

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

    // Track level before checking for a level up
    const previousLevel = level;

    if (xp >= 100) {
      level += Math.floor(xp / 100);
      xp = xp % 100;
    }

    saveProgress();
    renderTasks();

    // Trigger the celebration only if the player leveled up
    if (level > previousLevel) {
      showLevelUpModal(level);
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
  }

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

  // Count completed quests
  const completedCount = quests.filter(function(quest) {
    return quest.completed;
  }).length;

  // Count remaining quests
  const remainingCount = quests.length - completedCount;

  // Update dashboard
  document.getElementById("totalQuests").textContent = quests.length;
  document.getElementById("completedQuests").textContent = completedCount;
  document.getElementById("remainingQuests").textContent = remainingCount;

  // Update Clear Completed button state (styling lives in the stylesheet)
  const clearBtn = document.getElementById("clearCompletedBtn");
  if (clearBtn) {
    clearBtn.disabled = completedCount === 0;
  }

  // Refresh rank progression and achievements
  renderChronicles({
    level: level,
    xp: xp,
    total: quests.length,
    completed: completedCount
  });

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

  quests.push({
    name: task,
    difficulty: difficulty,
    completed: false
  });

  input.value = "";

  // Switch to 'all' if user was viewing only completed quests so they see the new quest
  if (currentFilter === "completed") {
    currentFilter = "all";
  }

  saveProgress();
  renderTasks();
}

// 5. Clear all completed quests
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
