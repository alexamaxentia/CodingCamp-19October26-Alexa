/* ═══════════════════════════════════════════════════════
   Dashboard — app.js
   ═══════════════════════════════════════════════════════ */

'use strict';

/* ── Storage keys ──────────────────────────────────────── */
const KEYS = {
  TODOS:  'dashboard_todos',
  LINKS:  'dashboard_links',
  NAME:   'dashboard_name',
  THEME:  'dashboard_theme',
};

/* ══════════════════════════════════════════════════════════
   1. GREETING & DATE/TIME
   ══════════════════════════════════════════════════════════ */

const datetimeEl = document.getElementById('datetime');
const greetingEl = document.getElementById('greeting');

/**
 * Returns a greeting string based on current hour.
 * @param {number} hour - 0–23
 * @returns {string}
 */
function getGreeting(hour) {
  if (hour < 12) return 'Good morning ☀️';
  if (hour < 17) return 'Good afternoon 🌤️';
  if (hour < 21) return 'Good evening 🌆';
  return 'Good night 🌙';
}

/** Format the current date/time nicely. */
function formatDatetime(now) {
  return now.toLocaleDateString('en-US', {
    weekday: 'long',
    year:    'numeric',
    month:   'long',
    day:     'numeric',
  }) + '  •  ' + now.toLocaleTimeString('en-US', {
    hour:   '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function updateGreeting() {
  const now = new Date();
  datetimeEl.textContent = formatDatetime(now);
  greetingEl.textContent = getGreeting(now.getHours());
}

// Update every second
updateGreeting();
setInterval(updateGreeting, 1000);


/* ----------------------------------------------------------
   1b. CUSTOM NAME IN GREETING
   ---------------------------------------------------------- */

const nameEditorEl  = document.getElementById('name-editor');
const nameInputEl   = document.getElementById('name-input');
const nameSaveBtn   = document.getElementById('name-save');
const nameCancelBtn = document.getElementById('name-cancel');
const nameEditBtn   = document.getElementById('name-edit-btn');

/** Read stored name and inject it into the greeting text. */
function applyName() {
  const saved = localStorage.getItem(KEYS.NAME) || '';
  const now   = new Date();
  const base  = getGreeting(now.getHours());
  greetingEl.textContent = saved ? `${base}, ${saved}!` : `${base}!`;
}

function openNameEditor() {
  nameInputEl.value = localStorage.getItem(KEYS.NAME) || '';
  nameEditorEl.classList.add('open');
  nameEditBtn.hidden = true;
  nameInputEl.focus();
}

function closeNameEditor() {
  nameEditorEl.classList.remove('open');
  nameEditBtn.hidden = false;
}

function saveName() {
  const trimmed = nameInputEl.value.trim();
  if (trimmed) {
    localStorage.setItem(KEYS.NAME, trimmed);
  } else {
    localStorage.removeItem(KEYS.NAME);
  }
  closeNameEditor();
  applyName();
}

nameEditBtn.addEventListener('click', openNameEditor);
nameSaveBtn.addEventListener('click', saveName);
nameCancelBtn.addEventListener('click', closeNameEditor);
nameInputEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter')  saveName();
  if (e.key === 'Escape') closeNameEditor();
});

// Patch updateGreeting to include the name on every clock tick
const _updateGreetingOriginal = updateGreeting;
function updateGreeting() {
  const now = new Date();
  datetimeEl.textContent = formatDatetime(now);
  applyName();             // uses name-aware version
}

// Apply immediately on load
applyName();


/* ----------------------------------------------------------
   1c. LIGHT / DARK MODE
   ---------------------------------------------------------- */

const themeToggleBtn = document.getElementById('theme-toggle');

/** Apply theme class and update toggle icon. */
function applyTheme(theme) {
  if (theme === 'light') {
    document.body.classList.add('light');
    themeToggleBtn.textContent = '☀';   // sun (light mode)
    themeToggleBtn.setAttribute('aria-label', 'Switch to dark mode');
  } else {
    document.body.classList.remove('light');
    themeToggleBtn.textContent = '☽';   // crescent (dark mode)
    themeToggleBtn.setAttribute('aria-label', 'Switch to light mode');
  }
}

themeToggleBtn.addEventListener('click', () => {
  const current = document.body.classList.contains('light') ? 'light' : 'dark';
  const next    = current === 'light' ? 'dark' : 'light';
  localStorage.setItem(KEYS.THEME, next);
  applyTheme(next);
});

// Apply saved theme on load (default: dark)
applyTheme(localStorage.getItem(KEYS.THEME) || 'dark');



/* ══════════════════════════════════════════════════════════
   2. FOCUS TIMER
   ══════════════════════════════════════════════════════════ */

let FOCUS_DURATION = 25 * 60; // seconds � updated when user changes the select

const timerDisplayEl = document.getElementById('timer-display');
const timerStatusEl  = document.getElementById('timer-status');
const btnStart = document.getElementById('btn-start');
const btnStop  = document.getElementById('btn-stop');
const btnReset = document.getElementById('btn-reset');

let timerInterval  = null;
let secondsLeft    = FOCUS_DURATION;
let timerRunning   = false;

/** Format seconds as MM:SS */
function formatTime(secs) {
  const m = String(Math.floor(secs / 60)).padStart(2, '0');
  const s = String(secs % 60).padStart(2, '0');
  return `${m}:${s}`;
}

/** Update the visual display and colour cues. */
function renderTimer() {
  timerDisplayEl.textContent = formatTime(secondsLeft);

  // Colour feedback: warning < 5 min, danger < 1 min
  timerDisplayEl.classList.toggle('warning', secondsLeft <= 300 && secondsLeft > 60);
  timerDisplayEl.classList.toggle('danger',  secondsLeft <= 60  && secondsLeft > 0);
}

function startTimer() {
  if (timerRunning) return;
  timerRunning = true;

  btnStart.disabled = true;
  btnStop.disabled  = false;
  timerStatusEl.textContent = 'Stay focused 🎯';

  timerInterval = setInterval(() => {
    secondsLeft--;
    renderTimer();

    if (secondsLeft <= 0) {
      clearInterval(timerInterval);
      timerRunning = false;
      btnStart.disabled = false;
      btnStop.disabled  = true;
      timerStatusEl.textContent = 'Session complete! Great work 🎉';
      timerDisplayEl.classList.remove('warning', 'danger');
    }
  }, 1000);
}

function stopTimer() {
  if (!timerRunning) return;
  clearInterval(timerInterval);
  timerRunning = false;
  btnStart.disabled = false;
  btnStop.disabled  = true;
  timerStatusEl.textContent = 'Paused. Click Start to resume.';
}

function resetTimer() {
  clearInterval(timerInterval);
  timerRunning   = false;
  secondsLeft    = FOCUS_DURATION;
  btnStart.disabled = false;
  btnStop.disabled  = true;
  timerDisplayEl.classList.remove('warning', 'danger');
  timerStatusEl.textContent = 'Ready to focus!';
  renderTimer();
}

btnStart.addEventListener('click', startTimer);
btnStop.addEventListener('click',  stopTimer);
btnReset.addEventListener('click', resetTimer);
// Duration picker � resets timer to the selected duration
const durationSelect = document.getElementById('duration-select');
durationSelect.addEventListener('change', () => {
  FOCUS_DURATION = parseInt(durationSelect.value, 10) * 60;
  // Reset so the new time is shown immediately
  clearInterval(timerInterval);
  timerInterval  = null;
  timerRunning   = false;
  secondsLeft    = FOCUS_DURATION;
  btnStart.disabled = false;
  btnStop.disabled  = true;
  timerDisplayEl.classList.remove('warning', 'danger');
  timerStatusEl.textContent = 'Ready to focus!';
  renderTimer();
});

renderTimer(); // initial render


/* ══════════════════════════════════════════════════════════
   3. TO-DO LIST
   ══════════════════════════════════════════════════════════ */

const todoForm    = document.getElementById('todo-form');
const todoInput   = document.getElementById('todo-input');
const todoListEl  = document.getElementById('todo-list');
const todoEmptyEl = document.getElementById('todo-empty');

// Modal elements
const editModal   = document.getElementById('edit-modal');
const editInput   = document.getElementById('edit-input');
const modalSave   = document.getElementById('modal-save');
const modalCancel = document.getElementById('modal-cancel');

let todos = loadTodos();
let editingId = null; // id of the task currently being edited

/* ── Persistence ───────────────────────────────────────── */

function loadTodos() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.TODOS)) || [];
  } catch {
    return [];
  }
}

function saveTodos() {
  localStorage.setItem(KEYS.TODOS, JSON.stringify(todos));
}

/* ── Rendering ─────────────────────────────────────────── */

function renderTodos() {
  todoListEl.innerHTML = '';

  if (todos.length === 0) {
    todoEmptyEl.hidden = false;
    return;
  }
  todoEmptyEl.hidden = true;

  todos.forEach((task) => {
    const li = document.createElement('li');
    li.className = 'todo-item' + (task.done ? ' done' : '');
    li.dataset.id = task.id;

    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type    = 'checkbox';
    checkbox.checked = task.done;
    checkbox.setAttribute('aria-label', `Mark "${task.text}" as ${task.done ? 'incomplete' : 'complete'}`);
    checkbox.addEventListener('change', () => toggleTodo(task.id));

    // Text
    const span = document.createElement('span');
    span.className   = 'task-text';
    span.textContent = task.text;

    // Action buttons
    const actions = document.createElement('div');
    actions.className = 'todo-actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'btn-icon';
    editBtn.textContent = '✏️';
    editBtn.setAttribute('aria-label', `Edit task: ${task.text}`);
    editBtn.addEventListener('click', () => openEditModal(task.id));

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn-icon';
    deleteBtn.textContent = '🗑️';
    deleteBtn.setAttribute('aria-label', `Delete task: ${task.text}`);
    deleteBtn.addEventListener('click', () => deleteTodo(task.id));

    actions.append(editBtn, deleteBtn);
    li.append(checkbox, span, actions);
    todoListEl.appendChild(li);
  });
}

/* ── CRUD operations ───────────────────────────────────── */

function addTodo(text) {
  const trimmed = text.trim();
  if (!trimmed) return;

  todos.push({
    id:   Date.now().toString(),
    text: trimmed,
    done: false,
  });
  saveTodos();
  renderTodos();
}

function toggleTodo(id) {
  const task = todos.find((t) => t.id === id);
  if (!task) return;
  task.done = !task.done;
  saveTodos();
  renderTodos();
}

function deleteTodo(id) {
  todos = todos.filter((t) => t.id !== id);
  saveTodos();
  renderTodos();
}

function saveEdit() {
  const trimmed = editInput.value.trim();
  if (!trimmed || !editingId) return;

  const task = todos.find((t) => t.id === editingId);
  if (task) {
    task.text = trimmed;
    saveTodos();
    renderTodos();
  }
  closeEditModal();
}

/* ── Edit modal ────────────────────────────────────────── */

function openEditModal(id) {
  const task = todos.find((t) => t.id === id);
  if (!task) return;
  editingId         = id;
  editInput.value   = task.text;
  editModal.hidden  = false;
  editInput.focus();
  editInput.select();
}

function closeEditModal() {
  editingId        = null;
  editModal.hidden = true;
  editInput.value  = '';
}

modalSave.addEventListener('click', saveEdit);
modalCancel.addEventListener('click', closeEditModal);

// Close on overlay click
editModal.addEventListener('click', (e) => {
  if (e.target === editModal) closeEditModal();
});

// Save on Enter key inside edit input
editInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') saveEdit();
  if (e.key === 'Escape') closeEditModal();
});

/* ── Form submission ───────────────────────────────────── */

todoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  addTodo(todoInput.value);
  todoInput.value = '';
  todoInput.focus();
});

// Initial render
renderTodos();


/* ══════════════════════════════════════════════════════════
   4. QUICK LINKS
   ══════════════════════════════════════════════════════════ */

const linkForm    = document.getElementById('link-form');
const linkNameEl  = document.getElementById('link-name');
const linkUrlEl   = document.getElementById('link-url');
const linkListEl  = document.getElementById('link-list');
const linkEmptyEl = document.getElementById('link-empty');

let links = loadLinks();

/* ── Persistence ───────────────────────────────────────── */

function loadLinks() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.LINKS)) || [];
  } catch {
    return [];
  }
}

function saveLinks() {
  localStorage.setItem(KEYS.LINKS, JSON.stringify(links));
}

/* ── Helpers ───────────────────────────────────────────── */

/**
 * Ensure URL has a protocol so it actually navigates correctly.
 * @param {string} raw
 * @returns {string}
 */
function normalizeUrl(raw) {
  const trimmed = raw.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return 'https://' + trimmed;
}

/* ── Rendering ─────────────────────────────────────────── */

function renderLinks() {
  linkListEl.innerHTML = '';

  if (links.length === 0) {
    linkEmptyEl.hidden = false;
    return;
  }
  linkEmptyEl.hidden = true;

  links.forEach((link) => {
    const chip = document.createElement('div');
    chip.className = 'link-chip';

    const anchor = document.createElement('a');
    anchor.href   = link.url;
    anchor.target = '_blank';
    anchor.rel    = 'noopener noreferrer';
    anchor.title  = link.url;
    anchor.textContent = link.name;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn-icon';
    deleteBtn.textContent = '×';
    deleteBtn.setAttribute('aria-label', `Remove link: ${link.name}`);
    deleteBtn.addEventListener('click', () => deleteLink(link.id));

    chip.append(anchor, deleteBtn);
    linkListEl.appendChild(chip);
  });
}

/* ── CRUD ──────────────────────────────────────────────── */

function addLink(name, url) {
  const trimName = name.trim();
  const trimUrl  = url.trim();

  if (!trimName || !trimUrl) return false;

  // Basic URL validation
  try {
    new URL(normalizeUrl(trimUrl));
  } catch {
    alert('Please enter a valid URL (e.g. https://example.com)');
    linkUrlEl.focus();
    return false;
  }

  links.push({
    id:   Date.now().toString(),
    name: trimName,
    url:  normalizeUrl(trimUrl),
  });
  saveLinks();
  renderLinks();
  return true;
}

function deleteLink(id) {
  links = links.filter((l) => l.id !== id);
  saveLinks();
  renderLinks();
}

/* ── Form submission ───────────────────────────────────── */

linkForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const success = addLink(linkNameEl.value, linkUrlEl.value);
  if (success) {
    linkNameEl.value = '';
    linkUrlEl.value  = '';
    linkNameEl.focus();
  }
});

// Initial render
renderLinks();
