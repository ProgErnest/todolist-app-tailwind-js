// FlowDo — logique de la todo list (version simplifiée)

const STORAGE_KEY = "flowdo_tasks";
let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let filter = "all"; // "all" | "active" | "completed"

const form = document.getElementById("taskForm");
const input = document.getElementById("taskInput");
const list = document.getElementById("taskList");
const counter = document.getElementById("counter");
const clearBtn = document.getElementById("clearBtn");
const filterBtns = document.querySelectorAll("[data-filter]");

// Sauvegarde les tâches dans le navigateur
function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Évite d'injecter du HTML si l'utilisateur tape "<script>" dans une tâche
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// Redessine la liste à partir de l'état actuel (tasks + filter)
function render() {
  const visible = tasks.filter((t) => {
    if (filter === "active") return !t.done;
    if (filter === "completed") return t.done;
    return true;
  });

  list.innerHTML = visible.length
    ? visible
        .map(
          (t) => `
        <li class="task-item" data-id="${t.id}">
          <input type="checkbox" ${t.done ? "checked" : ""} data-toggle />
          <span class="task-text ${t.done ? "task-done" : ""}" data-edit>${escapeHtml(t.text)}</span>
          <button type="button" class="task-del" data-delete>&times;</button>
        </li>`
        )
        .join("")
    : `<li class="text-center text-sm text-slate-400 py-8">Aucune tâche</li>`;

  counter.textContent = `${tasks.filter((t) => !t.done).length} restante(s)`;
}

// --- Ajouter une tâche ---
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  tasks.unshift({ id: Date.now(), text, done: false });
  input.value = "";
  save();
  render();
});

// --- Cocher / supprimer (délégation d'événements sur la liste) ---
list.addEventListener("click", (e) => {
  const li = e.target.closest("li[data-id]");
  if (!li) return;
  const id = Number(li.dataset.id);

  if (e.target.matches("[data-toggle]")) {
    const task = tasks.find((t) => t.id === id);
    task.done = !task.done;
    save();
    render();
  }

  if (e.target.matches("[data-delete]")) {
    tasks = tasks.filter((t) => t.id !== id);
    save();
    render();
  }
});

// --- Modifier une tâche (double-clic sur le texte) ---
list.addEventListener("dblclick", (e) => {
  const span = e.target.closest("[data-edit]");
  if (!span) return;

  const li = span.closest("li");
  const task = tasks.find((t) => t.id === Number(li.dataset.id));

  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.value = task.text;
  editInput.className = "task-input";
  span.replaceWith(editInput);
  editInput.focus();

  const confirmEdit = () => {
    task.text = editInput.value.trim() || task.text;
    save();
    render();
  };

  editInput.addEventListener("blur", confirmEdit);
  editInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") editInput.blur();
    if (e.key === "Escape") render();
  });
});

// --- Filtres (Toutes / Actives / Terminées) ---
filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filter = btn.dataset.filter;
    filterBtns.forEach((b) => b.classList.toggle("filter-active", b === btn));
    render();
  });
});

// --- Effacer les tâches terminées ---
clearBtn.addEventListener("click", () => {
  tasks = tasks.filter((t) => !t.done);
  save();
  render();
});

render();