/**
 * Patches openDetails function
 * @returns {Promise<void>}
 */
function bePatchOpenDetails() {
  if (!window.openDetails || window.openDetails.__bePatched) return;
  
  const original = window.openDetails;
  
  window.openDetails = function (type, data) {
    if (data?.cardEl) {
      beEnsureId(data.cardEl);
      window.__beCurrentDetailsCardId = data.cardEl.dataset.id;
    }
    return original(type, data);
  };
  
  window.openDetails.__bePatched = true;
}


/**
 * Gets current details card
 * @returns {HTMLElement|null}
 */
function beGetCurrentDetailsCard() {
  const id = window.__beCurrentDetailsCardId;
  return id ? document.querySelector(`.kb-card[data-id="${id}"]`) : null;
}


/**
 * Gets card title text
 * @param {HTMLElement} card - Card element
 * @returns {string}
 */
function beGetCardTitle(card) {
  return (card.querySelector(".kb-card-title")?.textContent || "").trim();
}


/**
 * Shows delete confirmation
 * @param {string} title - Task title
 * @returns {boolean}
 */
function beConfirmDelete(title) {
  return confirm(`Delete task${title ? ` "${title}"` : ""}?`);
}


/**
 * Removes card from DOM
 * @param {HTMLElement} card - Card element
 */
function beRemoveCard(card) {
  const col = beGetColumn(card);
  card.remove();
  if (col) beUpdateColumnState(col);
}


/**
 * Dispatches task deleted event
 * @param {string} id - Task ID
 */
function beDispatchTaskDeleted(id) {
  document.dispatchEvent(new CustomEvent("task:deleted", {
    detail: { id: id || "" }
  }));
}


/**
 * Deletes card with confirmation
 * @param {HTMLElement} card - Card element
 */
function beDelete(card) {
  const title = beGetCardTitle(card);
  if (!beConfirmDelete(title)) return;
  
  beRemoveCard(card);
  beDispatchTaskDeleted(card.dataset.id || "");
}


/**
 * Handles edit button click
 * @param {HTMLElement} card - Card element
 */
function beHandleEditClick(card) {
  if (!beOpenEditModal()) return;
  
  bePreloadForm(card);
  const form = beGetForm();
  if (form) beInterceptSave(form);
}


/**
 * Handles card action (edit or delete)
 * @param {HTMLElement} card - Card element
 * @param {boolean} isDelete - Is delete action
 */
function beHandleCardAction(card, isDelete) {
  if (isDelete) {
    beDelete(card);
  } else {
    beHandleEditClick(card);
  }
}


/**
 * Handles board click events
 * @param {MouseEvent} e - Click event
 */
function beOnBoardClick(e) {
  const target = e.target instanceof Element ? e.target : null;
  if (!target) return;
  
  const editBtn = target.closest(".kb-card-edit, [data-action='edit'], #td-edit");
  const delBtn = target.closest(".kb-card-delete, [data-action='delete'], #td-delete");
  
  if (!editBtn && !delBtn) return;
  e.preventDefault();
  
  const card = (editBtn || delBtn)?.closest(".kb-card");
  if (!card) return;
  
  beHandleCardAction(card, !!delBtn);
}


/**
 * Closes details modal with overlay
 */
function beCloseDetailsModalWithOverlay() {
  document.getElementById("td-modal")?.classList.remove("is-open");
  const hideOverlay = window.hideOverlay || (() => { });
  hideOverlay();
}


/**
 * Handles details edit click
 * @param {HTMLElement} card - Card element
 */
function beHandleDetailsEditClick(card) {
  if (!beOpenEditModal()) return;
  
  bePreloadForm(card);
  const form = beGetForm();
  if (form) beInterceptSave(form);
}


/**
 * Handles details delete click
 * @param {HTMLElement} card - Card element
 */
function beHandleDetailsDeleteClick(card) {
  beDelete(card);
  beCloseDetailsModalWithOverlay();
}


/**
 * Handles details action (edit or delete)
 * @param {HTMLElement} card - Card element
 * @param {boolean} isDelete - Is delete action
 */
function beHandleDetailsAction(card, isDelete) {
  if (isDelete) {
    beHandleDetailsDeleteClick(card);
  } else {
    beHandleDetailsEditClick(card);
  }
}


/**
 * Handles details modal click events
 * @param {MouseEvent} e - Click event
 */
function beOnDetailsClick(e) {
  const target = e.target instanceof Element ? e.target : null;
  if (!target) return;
  
  const editBtn = target.closest("#td-modal [data-td-edit], #td-modal .td-edit, #td-modal [data-action='edit'], #td-modal #td-edit");
  const delBtn = target.closest("#td-modal [data-td-delete], #td-modal .td-delete, #td-modal [data-action='delete'], #td-modal #td-delete");
  
  if (!editBtn && !delBtn) return;
  e.preventDefault();
  
  const card = beGetCurrentDetailsCard();
  if (!card) return;
  
  beHandleDetailsAction(card, !!delBtn);
}


/**
 * Finds task in storage by title and date
 * @param {Array} tasks - Tasks array
 * @param {string} title - Task title
 * @param {string} dueDate - Due date
 * @returns {Object|null}
 */
function beFindTaskByTitleAndDate(tasks, title, dueDate) {
  return tasks.find(t =>
    (t.title || '') === title &&
    (t.dueDate || '') === dueDate
  );
}


/**
 * Gets fallback task ID from modal
 * @param {Array} tasks - Tasks array
 * @returns {string}
 */
function beGetFallbackTaskId(tasks) {
  const modalTitle = document.getElementById('td-title')?.textContent?.trim() || '';
  const modalDue = document.getElementById('td-due')?.textContent?.trim() || '';
  
  const hit = beFindTaskByTitleAndDate(tasks, modalTitle, modalDue);
  return hit ? String(hit.id) : '';
}


/**
 * Removes task from storage
 * @param {string} id - Task ID
 */
function beRemoveTaskFromStorage(id) {
  let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  tasks = tasks.filter(t => String(t.id) !== id);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}


/**
 * Handles task deleted event
 * @param {CustomEvent} e - Custom event
 */
function beOnTaskDeleted(e) {
  let id = String(e.detail?.id || '');
  let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  
  if (!tasks.some(t => String(t.id) === id)) {
    id = beGetFallbackTaskId(tasks);
  }
  
  if (!id) return;
  
  beRemoveTaskFromStorage(id);
}


/**
 * Binds board event listeners
 * @param {HTMLElement} board - Board element
 */
function beBindBoardListeners(board) {
  board.addEventListener("click", beOnBoardClick, true);
}


/**
 * Binds details modal listeners
 */
function beBindDetailsListeners() {
  document.addEventListener("click", beOnDetailsClick, true);
  document.addEventListener("task:deleted", beOnTaskDeleted);
}


/**
 * Initializes openDetails patch
 */
function beInitializeOpenDetailsPatch() {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bePatchOpenDetails, { once: true });
  } else {
    bePatchOpenDetails();
  }
}


/**
 * Main edit initialization
 */
function beInitEdit() {
  if (window.__kbEnhancementsEditInit) return;
  window.__kbEnhancementsEditInit = true;
  
  const board = beGetBoard();
  if (!board) return;
  
  beBindBoardListeners(board);
  beBindDetailsListeners();
  beInitializeOpenDetailsPatch();
}


if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", beInitEdit, { once: true });
} else {
  beInitEdit();
}