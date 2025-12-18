/**
 * Creates card element
 * @param {Object} task - Task data
 * @returns {HTMLElement}
 */
function beCreateCardElement(task) {
  const el = document.createElement('article');
  el.className = 'kb-card';
  el.dataset.due = task.dueDate || '';
  
  if (task.id != null) {
    el.dataset.id = String(task.id);
  }
  
  el.innerHTML = beGenerateCardHTML(task);
  
  return el;
}


/**
 * Appends card to list
 * @param {HTMLElement} list - List element
 * @param {Object} task - Task data
 */
function beAppendCardToList(list, task) {
  const card = beCreateCardElement(task);
  list.appendChild(card);
}


/**
 * Renders avatars after loading
 */
function beRenderAvatarsIfAvailable() {
  if (typeof renderAvatars === 'function') {
    renderAvatars();
  }
}


/**
 * Loads tasks from localStorage
 */
function beLoadTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  const list = document.querySelector('.kb-col[data-status="todo"] [data-cards]');
  
  if (!list || !tasks.length) return;
  
  tasks.forEach(task => beAppendCardToList(list, task));
  
  beRenderAvatarsIfAvailable();
}


/**
 * Finds task in storage by ID
 * @param {Array} tasks - Tasks array
 * @param {string} id - Task ID
 * @returns {number}
 */
function beFindTaskIndex(tasks, id) {
  return tasks.findIndex(t => String(t.id) === String(id));
}


/**
 * Updates task status in storage
 * @param {string} id - Task ID
 * @param {string} status - New status
 */
function beUpdateTaskStatusInStorage(id, status) {
  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  const index = beFindTaskIndex(tasks, id);
  
  if (index > -1) {
    tasks[index].status = status;
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
}


/**
 * Handles task moved event
 * @param {CustomEvent} e - Custom event
 */
function beOnTaskMoved(e) {
  const { id, status } = e.detail || {};
  if (!id || !status) return;
  
  beUpdateTaskStatusInStorage(id, status);
}


/**
 * Ensures all cards have IDs
 * @param {HTMLElement} board - Board element
 */
function beEnsureAllCardsHaveIds(board) {
  board.querySelectorAll(".kb-card").forEach(card => beEnsureId(card));
}


/**
 * Binds all event listeners
 */
function beBindEventListeners() {
  document.addEventListener("task:moved", beEnsureEmptyVisible);
  document.addEventListener("task:deleted", beEnsureEmptyVisible);
  document.addEventListener("task:updated", beEnsureEmptyVisible);
  document.addEventListener("task:moved", beOnTaskMoved);
}


/**
 * Sets up board functionality
 * @param {HTMLElement} board - Board element
 */
function beSetupBoard(board) {
  beEnsureAllCardsHaveIds(board);
  beInitDnd(board);
  beWatchNewCards(board);
  beSyncAllColumns();
  beWireFeedback();
  beLoadTasks();
  beBindEventListeners();
}


/**
 * Main core initialization
 */
function beInitCore() {
  if (window.__kbEnhancementsCoreInit) return;
  window.__kbEnhancementsCoreInit = true;
  
  const board = beGetBoard();
  if (!board) return;
  
  beSetupBoard(board);
}


if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", beInitCore, { once: true });
} else {
  beInitCore();
}