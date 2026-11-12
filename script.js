// ============================================
// Quest Tracker - JavaScript
// ============================================

// 1. Load saved information from the browser
let quests = JSON.parse(localStorage.getItem("quests")) || [];
let xp = Number(localStorage.getItem("xp")) || 0;
let level = Number(localStorage.getItem("level")) || 1;

// 2. Save the current progress
function saveProgress() {
  localStorage.setItem("quests", JSON.stringify(quests));
  localStorage.setItem("xp", xp);
  localStorage.setItem("level", level);
}

// Helper: Determine title based on current level
function getPlayerTitle(currentLevel) {
  if (currentLevel >= 30) return "Legendary Adventurer";
  if (currentLevel >= 20) return "Master Adventurer";
  if (currentLevel >= 10) return "Elite Adventurer";
  if (currentLevel >= 5) return "Skilled Adventurer";
  return "Beginner Adventurer";
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

  const colors = ["#70e1b5", "#ffd700", "#ff6347", "#a371f7", "#58a6ff", "#ffffff"];
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

// Change active filter and re-render quest list
function setFilter(filter) {
  currentFilter = filter;
  renderTasks();
}

// 3. Display quests on the website
function renderTasks() {
  const taskList = document.getElementById("taskList");

  taskList.innerHTML = "";

  // Update active state on filter tab buttons
  const filterButtons = document.querySelectorAll(".filter-btn");
  filterButtons.forEach(function(btn) {
    if (btn.getAttribute("data-filter") === currentFilter) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
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
      const item = document.createElement("li");

      // Quest title and difficulty badge container
      const taskInfo = document.createElement("div");
      taskInfo.className = "task-info";

      const taskName = document.createElement("span");
      taskName.textContent = "🎯 " + quest.name;
      taskInfo.appendChild(taskName);

      const badge = document.createElement("span");
      const diff = quest.difficulty || "medium";
      badge.className = "badge badge-" + diff;

      if (diff === "easy") {
        badge.textContent = "🟢 Easy (+10 XP)";
      } else if (diff === "hard") {
        badge.textContent = "🔴 Hard (+50 XP)";
      } else {
        badge.textContent = "🟡 Medium (+20 XP)";
      }
      taskInfo.appendChild(badge);

      item.appendChild(taskInfo);

      if (quest.completed) {
        item.classList.add("done");
      }

      // Complete button
      const completeButton = document.createElement("button");
      completeButton.textContent = "Complete";
      completeButton.disabled = quest.completed;

      completeButton.onclick = function() {
        if (quest.completed) return;

        quest.completed = true;

        // Award XP based on quest difficulty (defaults to 20 for older quests)
        let earnedXP = 20;
        if (quest.difficulty === "easy") {
          earnedXP = 10;
        } else if (quest.difficulty === "hard") {
          earnedXP = 50;
        }

        xp += earnedXP;

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

      // Delete button
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";

      deleteButton.onclick = function() {
        // Find index in master quests array to avoid deleting wrong quest when filtered
        const originalIndex = quests.indexOf(quest);
        if (originalIndex !== -1) {
          quests.splice(originalIndex, 1);
          saveProgress();
          renderTasks();
        }
      };

      // Button container
      const actions = document.createElement("div");
      actions.className = "task-actions";
      actions.appendChild(completeButton);
      actions.appendChild(deleteButton);

      item.appendChild(actions);

      taskList.appendChild(item);
    });
  }

  // Update XP, level, title and progress bar
  document.getElementById("xp").textContent = xp;
  document.getElementById("level").textContent = level;
  document.getElementById("playerTitle").textContent = getPlayerTitle(level);
  document.getElementById("progressBar").style.width = xp + "%";

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

  // Update Clear Completed button state
  const clearBtn = document.getElementById("clearCompletedBtn");
  if (clearBtn) {
    clearBtn.disabled = completedCount === 0;
    clearBtn.style.opacity = completedCount === 0 ? "0.4" : "1";
    clearBtn.style.cursor = completedCount === 0 ? "not-allowed" : "pointer";
  }
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
