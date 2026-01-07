/**
 * Board Enhancements Core Part 2 - FIXED
 * NO localStorage - uses Firebase through db.js
 */

/**
 * Creates card element
 * @param {Object} task - Task data
 * @returns {HTMLElement}
 */
function beCreateCardElement(task) {
  const el = document.createElement('article');
  el.className = 'kb-card';
  el.dataset.due = task.dueDate || '';
  
  // Use firebaseId if available, otherwise fallback to id
  if (task.firebaseId) {
    el.dataset.id = task.firebaseId;
  } else if (task.id != null) {
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
 * REMOVED: beLoadTasks - no longer uses localStorage
 * Tasks are now loaded from Firebase in board-firebase-loader.js
 */

/**
 * Finds task in Firebase data by ID
 * @param {Array} tasks - Tasks array from Firebase
 * @param {string} id - Firebase task ID
 * @returns {number}
 */
function beFindTaskIndex(tasks, id) {
  return tasks.findIndex(t => t.firebaseId === id || String(t.id) === String(id));
}

/**
 * REMOVED: beUpdateTaskStatusInStorage - no longer uses localStorage
 * Status updates now handled by Firebase sync in board-firebase-sync.js
 */

/**
 * Handles task moved event
 * @param {CustomEvent} e - Custom event
 */
function beOnTaskMoved(e) {
  const { id, status } = e.detail || {};
  if (!id || !status) return;
  
  // Firebase sync is handled automatically by board-firebase-sync.js
  console.log(`Task ${id} moved to ${status}`);
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
  // REMOVED: beLoadTasks() - Firebase loader handles this
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