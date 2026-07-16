/* =========================================================
   FlowDo · ToDoList App
   Gestion des tâches avec localStorage et manipulation du DOM
   ========================================================= */

(function () {
  "use strict";

  // ─── State ──────────────────────────────────────────────

  const STORAGE_KEY = "flowdo_tasks";

  /** @type {Array<{id: string, text: string, completed: boolean}>} */
  let tasks = [];

  /** @type {'all' | 'active' | 'completed'} */
  let currentFilter = "all";

  /** @type {string|null} */
  let editingTaskId = null;

  // ─── DOM References ─────────────────────────────────────

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  const els = {
    taskForm: $("#taskForm"),
    taskInput: $("#taskInput"),
    addBtn: $("#addBtn"),
    charCount: $("#charCount"),
    taskList: $("#taskList"),
    taskCounter: $("#taskCounter"),
    countValue: $("#countValue"),
    remainingCounter: $("#remainingCounter"),
    remainingValue: $("#remainingValue"),
    clearCompletedBtn: $("#clearCompletedBtn"),
    filterBtns: $$("[data-filter]"),
    toast: $("#toast"),
    toastMessage: $("#toastMessage"),
    toastIcon: $("#toastIcon"),
    appFooter: $("#appFooter"),
  };

  // ─── Utils ──────────────────────────────────────────────

  /** Génère un ID unique */
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  /** Formate une date ISO en format lisible */
  const formatDate = (iso) => {
    const d = new Date(iso);
    const now = new Date();
    const diff = now - d;
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 1) return "À l'instant";
    if (mins < 60) return `Il y a ${mins} min`;
    if (hrs < 24) return `Il y a ${hrs}h`;
    if (days === 1) return "Hier";
    if (days < 7) return `Il y a ${days} jours`;
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  };

  /** Échappe les caractères HTML pour la sécurité */
  const escapeHtml = (str) => {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  };

  // ─── Toast System ───────────────────────────────────────

  let toastTimeout = null;

  const showToast = (message, type = "success") => {
    const iconMap = {
      success:
        '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
      error:
        '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
      info:
        '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
    };

    if (toastTimeout) clearTimeout(toastTimeout);

    els.toastIcon.innerHTML = iconMap[type] || iconMap.info;
    els.toastMessage.textContent = message;
    els.toast.classList.remove("opacity-0", "translate-y-4", "pointer-events-none");
    els.toast.classList.add("opacity-100", "translate-y-0", "pointer-events-auto");

    toastTimeout = setTimeout(() => {
      els.toast.classList.remove("opacity-100", "translate-y-0", "pointer-events-auto");
      els.toast.classList.add("opacity-0", "translate-y-4", "pointer-events-none");
    }, 2500);
  };

  // ─── Storage ────────────────────────────────────────────

  const saveTasks = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.warn("localStorage indisponible:", e);
    }
  };

  const loadTasks = () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.warn("Impossible de charger les tâches:", e);
      return [];
    }
  };

  // ─── CRUD Operations ────────────────────────────────────

  const addTask = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return false;

    const task = {
      id: uid(),
      text: trimmed,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    tasks.unshift(task);
    saveTasks();
    render();
    showToast("Tâche ajoutée ✨", "success");
    return true;
  };

  const deleteTask = (id) => {
    const task = tasks.find((t) => t.id === id);
    tasks = tasks.filter((t) => t.id !== id);
    saveTasks();
    render();
    if (editingTaskId === id) editingTaskId = null;
    showToast(`« ${task?.text || "Tâche"} » supprimée 🗑️`, "info");
  };

  const toggleTask = (id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    task.completed = !task.completed;
    saveTasks();

    // Si on est sur le filtre "active" ou "completed", ré-ordonner
    // On déplace la tâche terminée en bas et la tâche active en haut
    if (currentFilter === "all") {
      // Réordonnancement intelligent : actives en haut, terminées en bas
      const activeTasks = tasks.filter((t) => !t.completed);
      const completedTasks = tasks.filter((t) => t.completed);
      tasks = [...activeTasks, ...completedTasks];
      saveTasks();
    }

    render();
    showToast(
      task.completed ? `« ${task.text} » terminée ` : `« ${task.text} » réouverte `,
      task.completed ? "success" : "info"
    );
  };

  const editTask = (id, newText) => {
    const trimmed = newText.trim();
    if (!trimmed) {
      deleteTask(id);
      return;
    }

    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    if (task.text === trimmed) {
      editingTaskId = null;
      render();
      return;
    }

    task.text = trimmed;
    saveTasks();
    editingTaskId = null;
    render();
    showToast("Tâche modifiée ✏️", "success");
  };

  const clearCompleted = () => {
    const completedCount = tasks.filter((t) => t.completed).length;
    if (completedCount === 0) {
      showToast("Aucune tâche terminée à effacer", "info");
      return;
    }

    tasks = tasks.filter((t) => !t.completed);
    saveTasks();
    render();
    showToast(`${completedCount} tâche(s) effacée(s) 🧹`, "success");
  };

  const getFilteredTasks = () => {
    switch (currentFilter) {
      case "active":
        return tasks.filter((t) => !t.completed);
      case "completed":
        return tasks.filter((t) => t.completed);
      default:
        return [...tasks];
    }
  };

  // ─── Rendering ──────────────────────────────────────────

  const render = () => {
    const filtered = getFilteredTasks();
    const activeCount = tasks.filter((t) => !t.completed).length;
    const completedCount = tasks.filter((t) => t.completed).length;
    const totalCount = tasks.length;

    // Mise à jour des compteurs
    els.countValue.textContent = filtered.length;
    els.remainingValue.textContent = activeCount;

    // Visibilité du footer
    els.appFooter.classList.toggle("hidden", totalCount === 0);

    // Rendu de la liste
    if (filtered.length === 0) {
      els.taskList.innerHTML = renderEmptyState();
      return;
    }

    els.taskList.innerHTML = filtered
      .map((task) => renderTaskItem(task))
      .join("");
  };

  const renderEmptyState = () => {
    const messages = {
      all: {
        icon: "📋",
        title: "Aucune tâche pour le moment",
        desc: "Ajoutez votre première tâche via le champ ci-dessus ✨",
      },
      active: {
        icon: "🎯",
        title: "Tout est fait !",
        desc: "Vous n'avez aucune tâche active. Profitez-en ☀️",
      },
      completed: {
        icon: "🏁",
        title: "Aucune tâche terminée",
        desc: "Les tâches que vous compléterez apparaîtront ici",
      },
    };

    const msg = messages[currentFilter] || messages.all;

    return `
      <li class="empty-state">
        <div class="empty-state-icon">${msg.icon}</div>
        <p class="empty-state-title">${msg.title}</p>
        <p class="empty-state-desc">${msg.desc}</p>
      </li>
    `;
  };

  const renderTaskItem = (task) => {
    const isEditing = editingTaskId === task.id;
    const isCompleted = task.completed;

    return `
      <li class="task-item ${isCompleted ? "task-item-completed" : ""}" data-id="${task.id}">
        <!-- Checkbox -->
        <label class="task-checkbox">
          <input type="checkbox" ${isCompleted ? "checked" : ""} aria-label="Marquer « ${escapeHtml(task.text)} » comme ${isCompleted ? "active" : "terminée"}" />
        </label>

        <!-- Contenu -->
        <div class="task-content">
          ${
            isEditing
              ? `<input
                   type="text"
                   class="task-edit-input"
                   value="${escapeHtml(task.text)}"
                   maxlength="200"
                   aria-label="Modifier la tâche"
                   data-edit-input
                 />`
              : ``
          }
          ${
            !isEditing
              ? `<span class="task-text ${isCompleted ? "task-text-done" : ""}">
                   ${escapeHtml(task.text)}
                 </span>
                 <span class="task-date">${formatDate(task.createdAt)}</span>`
              : ``
          }
        </div>

        <!-- Actions -->
        ${
          !isEditing
            ? `<div class="task-actions">
                 <button type="button" class="btn btn-icon btn-ghost btn-sm" data-edit aria-label="Modifier">
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                     <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                     <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                   </svg>
                 </button>
                 <button type="button" class="btn btn-icon btn-danger btn-sm" data-delete aria-label="Supprimer">
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                     <polyline points="3 6 5 6 21 6"/>
                     <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                   </svg>
                 </button>
               </div>`
            : ``
        }
      </li>
    `;
  };

  // ─── Event Handling ─────────────────────────────────────

  // --- Ajout de tâche ---
  els.taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = els.taskInput.value.trim();
    if (!value) {
      els.taskInput.classList.add("task-input-error");
      showToast("Veuillez entrer une tâche", "error");
      return;
    }
    addTask(value);
    els.taskInput.value = "";
    els.taskInput.classList.remove("task-input-error");
    updateCharCount();
    els.taskInput.focus();
  });

  // --- Compteur de caractères ---
  const updateCharCount = () => {
    const len = els.taskInput.value.length;
    els.charCount.textContent = `${len}/200`;
  };

  els.taskInput.addEventListener("input", () => {
    updateCharCount();
    els.taskInput.classList.remove("task-input-error");
  });

  // --- Gestion des clics sur la liste (délégation) ---
  els.taskList.addEventListener("click", (e) => {
    const li = e.target.closest(".task-item");
    if (!li) return;
    const id = li.dataset.id;

    // Checkbox toggle
    if (e.target.matches('input[type="checkbox"]')) {
      toggleTask(id);
      return;
    }

    // Bouton delete
    if (e.target.closest("[data-delete]")) {
      deleteTask(id);
      return;
    }

    // Bouton edit
    if (e.target.closest("[data-edit]")) {
      startEditing(id);
      return;
    }
  });

  // --- Édition inline ---
  const startEditing = (id) => {
    editingTaskId = id;
    render();

    // Focus et sélection automatique
    const input = els.taskList.querySelector(`[data-id="${id}"] [data-edit-input]`);
    if (input) {
      input.focus();
      input.select();

      const confirmEdit = () => {
        editTask(id, input.value);
      };

      const cancelEdit = () => {
        editingTaskId = null;
        render();
      };

      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          input.blur();
          confirmEdit();
        }
        if (e.key === "Escape") {
          e.preventDefault();
          cancelEdit();
        }
      });

      input.addEventListener("blur", () => {
        // Petit délai pour permettre aux clics de se propager
        setTimeout(() => {
          if (editingTaskId === id) {
            confirmEdit();
          }
        }, 150);
      });
    }
  };

  // --- Filtres ---
  els.filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;
      if (filter === currentFilter) return;

      currentFilter = filter;
      els.filterBtns.forEach((b) => {
        b.className = b.dataset.filter === filter ? "filter-btn filter-btn-active" : "filter-btn";
      });

      render();
    });
  });

  // --- Effacer terminées ---
  els.clearCompletedBtn.addEventListener("click", clearCompleted);

  // --- Raccourcis clavier ---
  document.addEventListener("keydown", (e) => {
    // Ctrl/Cmd + K : focus sur l'input
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      els.taskInput.focus();
    }
  });

  // ─── Initialisation ─────────────────────────────────────

  const init = () => {
    tasks = loadTasks();
    render();
    updateCharCount();
    showToast("Bienvenue sur FlowDo 🚀", "info");
  };

  init();
})();
