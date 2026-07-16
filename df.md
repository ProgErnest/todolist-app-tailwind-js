```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>FlowDo · ToDoList App</title>
  <meta name="description" content="Une application ToDoList moderne, intuitive et minimaliste." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="./src/output.css" />
</head>
<body>

  <div class="app-container" id="app">

    <!-- ─── Header ─── -->
    <header class="app-header">
      <h1 class="app-title">
        <span class="app-title-highlight">Flow</span>Do
      </h1>
      <p class="app-subtitle">
        Organisez vos tâches avec simplicité et élégance
      </p>
    </header>

    <!-- ─── Main Card ─── -->
    <main class="card">

      <!-- ─── Add Task Form ─── -->
      <form id="taskForm" class="input-group" autocomplete="off">
        <div class="relative flex-1">
          <input
            type="text"
            id="taskInput"
            class="task-input"
            placeholder="Écrivez une nouvelle tâche…"
            aria-label="Nouvelle tâche"
            maxlength="200"
            autofocus
          />
          <span id="charCount" class="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-text-muted font-medium pointer-events-none">
            0/200
          </span>
        </div>
        <button type="submit" id="addBtn" class="btn btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          <span class="hidden sm:inline">Ajouter</span>
        </button>
      </form>

      <!-- ─── Filter Bar ─── -->
      <div class="filter-bar">
        <div class="filter-group" role="group" aria-label="Filtres des tâches">
          <button type="button" class="filter-btn filter-btn-active" data-filter="all">Toutes</button>
          <button type="button" class="filter-btn" data-filter="active">Actives</button>
          <button type="button" class="filter-btn" data-filter="completed">Terminées</button>
        </div>
        <span class="task-counter" id="taskCounter">
          <strong id="countValue">0</strong> tâche(s)
        </span>
      </div>

      <!-- ─── Task List ─── -->
      <section aria-label="Liste des tâches">
        <ul id="taskList" class="task-list">
          <!-- Rendu dynamique via JS -->
          <li class="task-list-empty">
            <svg class="task-list-empty-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
              <rect x="9" y="3" width="6" height="4" rx="1"/>
              <path d="M9 14l2 2 4-4"/>
            </svg>
            <p class="task-list-empty-text">Aucune tâche pour le moment</p>
            <p class="task-list-empty-hint">Ajoutez-en une via le champ ci-dessus ✨</p>
          </li>
        </ul>
      </section>

      <!-- ─── Footer ─── -->
      <footer class="app-footer" id="appFooter">
        <span class="task-counter" id="remainingCounter">
          <strong id="remainingValue">0</strong> restante(s)
        </span>
        <button type="button" id="clearCompletedBtn" class="btn btn-ghost btn-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
          Effacer terminées
        </button>
      </footer>

    </main>

    <!-- ─── Toast Notification ─── -->
    <div id="toast" class="fixed bottom-6 right-6 z-50 transition-all duration-500 translate-y-4 opacity-0 pointer-events-none">
      <div class="bg-gray-900 text-white text-sm font-medium px-5 py-3 rounded-2xl shadow-float flex items-center gap-2.5">
        <span id="toastIcon" class="flex-shrink-0"></span>
        <span id="toastMessage"></span>
      </div>
    </div>

  </div>

  <script src="script.js"></script>
</body>
</html>
```

```css
@import "tailwindcss";

/* ─── Design System (Theme Tokens) ─── */
@theme {
  /* Palette principale */
  --color-primary-50: #f0fdf4;
  --color-primary-100: #dcfce7;
  --color-primary-200: #bbf7d0;
  --color-primary-300: #86efac;
  --color-primary-400: #4ade80;
  --color-primary-500: #22c55e;
  --color-primary-600: #16a34a;
  --color-primary-700: #15803d;
  --color-primary-800: #166534;
  --color-primary-900: #14532d;

  /* Palette accent (violet doux) */
  --color-accent-50: #faf5ff;
  --color-accent-100: #f3e8ff;
  --color-accent-200: #e9d5ff;
  --color-accent-300: #d8b4fe;
  --color-accent-400: #c084fc;
  --color-accent-500: #a855f7;
  --color-accent-600: #9333ea;
  --color-accent-700: #7e22ce;

  /* Palette neutre personnalisée */
  --color-surface: #f8fafc;
  --color-surface-alt: #f1f5f9;
  --color-border: #e2e8f0;
  --color-text-primary: #0f172a;
  --color-text-secondary: #475569;
  --color-text-muted: #94a3b8;

  /* Ombres */
  --shadow-card: 0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.06);
  --shadow-card-hover: 0 10px 15px -3px rgb(0 0 0 / 0.06), 0 4px 6px -4px rgb(0 0 0 / 0.08);
  --shadow-float: 0 20px 25px -5px rgb(0 0 0 / 0.08), 0 8px 10px -6px rgb(0 0 0 / 0.06);

  /* Typographie */
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;

  /* Animations */
  --animate-slide-up: slide-up 0.3s ease-out;
  --animate-fade-in: fade-in 0.2s ease-out;
  --animate-slide-in-right: slide-in-right 0.3s ease-out;
  --animate-scale-in: scale-in 0.2s ease-out;

  @keyframes slide-up {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slide-in-right {
    from {
      opacity: 0;
      transform: translateX(16px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes scale-in {
    from {
      opacity: 0;
      transform: scale(0.92);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
}

/* ─── Base Layer ─── */
@layer base {
  * {
    @apply m-0 p-0 box-border;
  }

  html {
    @apply scroll-smooth;
  }

  body {
    @apply font-sans bg-surface text-text-primary antialiased min-h-dvh;
  }

  ::selection {
    @apply bg-primary-200 text-primary-900;
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    @apply w-1.5;
  }

  ::-webkit-scrollbar-track {
    @apply bg-transparent;
  }

  ::-webkit-scrollbar-thumb {
    @apply bg-border rounded-full hover:bg-text-muted transition-colors duration-200;
  }
}

/* ─── Components Layer ─── */
@layer components {
  /* App Container */
  .app-container {
    @apply max-w-2xl mx-auto px-4 py-8 md:py-12;
  }

  /* Header */
  .app-header {
    @apply text-center mb-10;
  }

  .app-title {
    @apply text-4xl md:text-5xl font-bold tracking-tight text-text-primary;
  }

  .app-title-highlight {
    @apply bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent;
  }

  .app-subtitle {
    @apply mt-2 text-text-secondary text-sm md:text-base;
  }

  /* Card */
  .card {
    @apply bg-white rounded-2xl shadow-card border border-border p-6 md:p-8 transition-all duration-300;
  }

  .card:hover {
    @apply shadow-card-hover;
  }

  /* Input Group */
  .input-group {
    @apply flex flex-col sm:flex-row gap-3 mb-6;
  }

  .task-input {
    @apply flex-1 px-4 py-3 bg-surface-alt border-2 border-border rounded-xl
           text-text-primary placeholder:text-text-muted
           focus:outline-none focus:border-primary-400 focus:bg-white
           focus:ring-4 focus:ring-primary-100
           transition-all duration-200 text-sm;
  }

  .task-input-error {
    @apply border-red-300 focus:border-red-400 focus:ring-red-100;
  }

  /* Buttons */
  .btn {
    @apply inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl
           font-medium text-sm tracking-wide
           transition-all duration-200
           focus:outline-none focus:ring-4 focus:ring-offset-0
           cursor-pointer select-none;
  }

  .btn-primary {
    @apply bg-primary-500 text-white
           hover:bg-primary-600 active:bg-primary-700
           focus:ring-primary-200
           disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary-500;
  }

  .btn-secondary {
    @apply bg-surface-alt text-text-secondary border-2 border-border
           hover:bg-white hover:border-primary-300 hover:text-primary-700
           focus:ring-primary-100;
  }

  .btn-ghost {
    @apply text-text-secondary bg-transparent
           hover:bg-surface-alt hover:text-text-primary
           focus:ring-border;
  }

  .btn-danger {
    @apply text-red-500 bg-transparent
           hover:bg-red-50 hover:text-red-600
           focus:ring-red-100;
  }

  .btn-sm {
    @apply px-3 py-2 text-xs rounded-lg;
  }

  .btn-icon {
    @apply p-2 rounded-lg;
  }

  /* Filter Bar */
  .filter-bar {
    @apply flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-border;
  }

  .filter-group {
    @apply flex items-center gap-1 bg-surface-alt rounded-xl p-1;
  }

  .filter-btn {
    @apply px-3.5 py-2 text-xs font-medium rounded-lg
           text-text-secondary transition-all duration-200
           hover:text-text-primary cursor-pointer;
  }

  .filter-btn-active {
    @apply bg-white text-text-primary shadow-sm;
  }

  /* Task Counter */
  .task-counter {
    @apply text-xs text-text-muted font-medium;
  }

  .task-counter strong {
    @apply text-text-secondary;
  }

  /* Task List */
  .task-list {
    @apply space-y-2 min-h-[120px];
  }

  .task-list-empty {
    @apply flex flex-col items-center justify-center py-12 text-center;
  }

  .task-list-empty-icon {
    @apply w-16 h-16 mx-auto mb-4 text-border;
  }

  .task-list-empty-text {
    @apply text-text-muted text-sm font-medium;
  }

  .task-list-empty-hint {
    @apply text-text-muted text-xs mt-1;
  }

  /* Task Item */
  .task-item {
    @apply flex items-center gap-3 px-4 py-3.5 bg-white rounded-xl border border-border
           transition-all duration-300 cursor-default;
  }

  .task-item:hover {
    @apply border-primary-200 shadow-card-hover;
  }

  .task-item-enter {
    @apply animate-slide-up;
  }

  .task-item-exit {
    @apply opacity-0 scale-95 transition-all duration-300;
  }

  .task-item-completed {
    @apply bg-primary-50/50 border-primary-100;
  }

  /* Custom Checkbox */
  .task-checkbox {
    @apply relative flex-shrink-0;
  }

  .task-checkbox input[type="checkbox"] {
    @apply appearance-none w-5 h-5 rounded-lg border-2 border-border
           bg-white cursor-pointer
           checked:bg-primary-500 checked:border-primary-500
           checked:hover:bg-primary-600
           focus:outline-none focus:ring-4 focus:ring-primary-100
           transition-all duration-200;
  }

  .task-checkbox input[type="checkbox"]:checked::after {
    content: "✓";
    @apply absolute inset-0 flex items-center justify-center text-white text-xs font-bold;
  }

  /* Task Content */
  .task-content {
    @apply flex-1 min-w-0;
  }

  .task-text {
    @apply text-sm text-text-primary font-medium leading-snug break-words transition-all duration-200;
  }

  .task-text-done {
    @apply line-through text-text-muted;
  }

  .task-date {
    @apply block text-[10px] text-text-muted mt-0.5 font-medium tracking-wide uppercase;
  }

  /* Task Actions */
  .task-actions {
    @apply flex items-center gap-0.5 opacity-0 transition-all duration-200;
  }

  .task-item:hover .task-actions {
    @apply opacity-100;
  }

  /* Edit Mode */
  .task-edit-input {
    @apply w-full px-3 py-1.5 bg-surface-alt border-2 border-primary-400 rounded-lg
           text-sm text-text-primary
           focus:outline-none focus:ring-4 focus:ring-primary-100
           transition-all duration-200;
  }

  /* Footer Actions */
  .app-footer {
    @apply mt-6 pt-4 border-t border-border flex items-center justify-between;
  }

  /* Empty State */
  .empty-state {
    @apply flex flex-col items-center justify-center py-16 text-center;
  }

  .empty-state-icon {
    @apply w-20 h-20 mx-auto mb-6 text-border;
  }

  .empty-state-title {
    @apply text-lg font-semibold text-text-primary mb-1;
  }

  .empty-state-desc {
    @apply text-sm text-text-muted max-w-xs mx-auto;
  }
}

/* ─── Utilities Layer ─── */
@layer utilities {
  .transition-smooth {
    @apply transition-all duration-300 ease-out;
  }

  .truncate-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}
```


```js
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
```