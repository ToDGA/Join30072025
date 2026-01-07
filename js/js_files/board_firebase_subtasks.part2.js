/**
 * Firebase + Subtasks Integration Module - Part 2 - FIXED
 * NO localStorage - fully Firebase-based
 * Handles modal interactions, checkbox toggles, and initialization
 */

/**
 * Syncs task status to Firebase on move
 */
function syncTaskStatusToFirebase() {
  document.addEventListener("task:moved", handleTaskMoved);
}

/**
 * Handles task moved event
 * @param {CustomEvent} e - Task moved event
 */
async function handleTaskMoved(e) {
  const { id, status } = e.detail || {};
  if (!id || !status) return;
  
  await fbUpdateTaskStatus(id, status);
  console.log(`✅ Task ${id} status updated to ${status}`);
}

/**
 * Hides or shows subtasks block
 * @param {HTMLElement} block - Subtasks block element
 * @param {boolean} show - True to show, false to hide
 */
function toggleSubtasksBlock(block, show) {
  if (block) block.hidden = !show;
}

/**
 * Creates subtask checkbox element
 * @param {number} index - Subtask index
 * @param {string} firebaseId - Firebase task ID
 * @param {boolean} completed - Is completed
 * @returns {HTMLElement} Checkbox element
 */
function createSubtaskCheckbox(index, firebaseId, completed) {
  const checkbox = document.createElement("div");
  checkbox.className = `td-subtask-checkbox ${completed ? 'checked' : ''}`;
  checkbox.dataset.index = index;
  checkbox.dataset.firebaseId = firebaseId;
  return checkbox;
}

/**
 * Creates subtask label element
 * @param {Object} subtask - Subtask object
 * @returns {HTMLElement} Label element
 */
function createSubtaskLabel(subtask) {
  const label = document.createElement("span");
  label.className = "td-subtask-label";
  label.textContent = subtask.name || subtask;
  return label;
}

/**
 * Creates subtask list item
 * @param {Object} subtask - Subtask object
 * @param {number} index - Index
 * @param {string} firebaseId - Firebase ID
 * @returns {HTMLElement} List item element
 */
function createSubtaskItem(subtask, index, firebaseId) {
  const li = document.createElement("li");
  li.className = `td-subtask-item ${subtask.completed ? 'completed' : ''}`;
  
  const checkbox = createSubtaskCheckbox(index, firebaseId, subtask.completed);
  const label = createSubtaskLabel(subtask);
  
  li.appendChild(checkbox);
  li.appendChild(label);
  
  return li;
}

/**
 * Renders subtasks in modal list
 * @param {Array} subtasks - Subtasks array
 * @param {string} firebaseId - Firebase task ID
 */
function renderSubtasksInModal(subtasks, firebaseId) {
  const container = document.getElementById("td-subtasks-list");
  if (!container) return;
  
  container.innerHTML = "";
  const block = document.getElementById("td-subtasks");
  
  if (!subtasks || subtasks.length === 0) {
    toggleSubtasksBlock(block, false);
    return;
  }
  
  toggleSubtasksBlock(block, true);
  
  subtasks.forEach((subtask, index) => {
    const item = createSubtaskItem(subtask, index, firebaseId);
    container.appendChild(item);
  });
}

/**
 * Gets subtasks from card
 * @param {HTMLElement} card - Card element
 * @returns {Array} Subtasks array
 */
function getSubtasksFromCard(card) {
  try {
    return JSON.parse(card.dataset.subtasks || "[]");
  } catch (e) {
    console.error("Error parsing subtasks:", e);
    return [];
  }
}

/**
 * Updates card dataset with subtasks
 * @param {HTMLElement} card - Card element
 * @param {Array} subtasks - Subtasks array
 */
function updateCardSubtasks(card, subtasks) {
  card.dataset.subtasks = JSON.stringify(subtasks);
}

/**
 * Toggles subtask completed status
 * @param {Array} subtasks - Subtasks array
 * @param {number} index - Subtask index
 * @returns {Array} Updated subtasks
 */
function toggleSubtaskStatus(subtasks, index) {
  if (subtasks[index]) {
    subtasks[index].completed = !subtasks[index].completed;
  }
  return subtasks;
}

/**
 * Updates checkbox UI
 * @param {HTMLElement} checkbox - Checkbox element
 */
function updateCheckboxUI(checkbox) {
  checkbox.classList.toggle("checked");
  checkbox.parentElement.classList.toggle("completed");
}

/**
 * Updates progress bar in card
 * @param {HTMLElement} card - Card element
 * @param {Array} subtasks - Subtasks array
 */
function updateProgressBar(card, subtasks) {
  const container = card.querySelector(".kb-subtasks-progress");
  if (!container) return;
  
  const progress = calculateProgress(subtasks);
  const countText = getCountText(subtasks);
  
  const fill = container.querySelector(".kb-progress-fill");
  const text = container.querySelector(".kb-progress-text");
  
  if (fill) fill.style.width = `${progress}%`;
  if (text) text.textContent = countText;
}

/**
 * Handles subtask checkbox toggle
 * @param {Event} e - Click event
 */
async function handleSubtaskToggle(e) {
  const checkbox = e.target.closest(".td-subtask-checkbox");
  if (!checkbox) return;
  
  const firebaseId = checkbox.dataset.firebaseId;
  const index = parseInt(checkbox.dataset.index);
  const card = document.querySelector(`[data-id="${firebaseId}"]`);
  
  if (!card) return;
  
  let subtasks = getSubtasksFromCard(card);
  subtasks = toggleSubtaskStatus(subtasks, index);
  
  updateCardSubtasks(card, subtasks);
  await fbUpdateSubtasks(firebaseId, subtasks);
  
  updateCheckboxUI(checkbox);
  updateProgressBar(card, subtasks);
  
  console.log(`✅ Subtask toggled`);
}

/**
 * Binds subtask checkbox events
 */
function bindSubtaskCheckboxes() {
  document.addEventListener("click", handleSubtaskToggle);
}

/**
 * Enhances openDetails to show subtasks
 */
function enhanceOpenDetails() {
  const original = window.openDetails;
  
  window.openDetails = function(type, data) {
    if (original) original(type, data);
    handleOpenDetailsSubtasks(data);
  };
}

/**
 * Handles subtasks in openDetails
 * @param {Object} data - Card data
 */
function handleOpenDetailsSubtasks(data) {
  if (!data.cardEl) return;
  
  const firebaseId = data.cardEl.dataset.id;
  const subtasks = getSubtasksFromCard(data.cardEl);
  
  renderSubtasksInModal(subtasks, firebaseId);
}

/**
 * REMOVED: getLatestTask - no longer uses localStorage
 * REMOVED: updateTaskWithFirebaseId - no longer uses localStorage
 * Task creation now handled directly in Firebase via board-firebase-only.js
 */

/**
 * Handles task creation in Firebase
 * This is now fully handled by board-firebase-only.js
 * @param {Object} task - Created task
 */
async function handleTaskCreation(task) {
  // Firebase creation is now handled by board-firebase-only.js
  console.log("Task creation handled by board-firebase-only.js");
}

/**
 * Checks if form is in edit mode
 * @param {HTMLFormElement} form - Form element
 * @returns {boolean} True if editing
 */
function isFormEditing(form) {
  return form && form.dataset.editingId;
}

/**
 * Handles create button click
 * No longer needed - board-firebase-only.js handles this
 */
async function handleCreateClick() {
  // Handled by board-firebase-only.js
  console.log("Create handled by board-firebase-only.js");
}

/**
 * Enhances add task form
 * No longer needed - board-firebase-only.js handles this
 */
function enhanceAddTaskForm() {
  // Handled by board-firebase-only.js
  console.log("Form enhancement handled by board-firebase-only.js");
}

/**
 * Checks if already initialized
 * @returns {boolean} True if initialized
 */
function isAlreadyInitialized() {
  if (window.__firebaseSubtasksInit === true) return true;
  window.__firebaseSubtasksInit = true;
  return false;
}

/**
 * Runs all initializations
 */
async function runInitializations() {
  console.log("🚀 Initializing Firebase + Subtasks module...");
  
  injectProgressStyles();
  await loadTasksFromFirebase();
  syncTaskStatusToFirebase();
  bindSubtaskCheckboxes();
  enhanceOpenDetails();
  // REMOVED: enhanceAddTaskForm - handled by board-firebase-only.js
  
  console.log("✅ Firebase + Subtasks module initialized!");
}

/**
 * Main initialization function
 */
async function initFirebaseSubtasks() {
  if (isAlreadyInitialized()) return;
  await runInitializations();
}

/**
 * Initializes on DOM ready
 */
function initOnDOMReady() {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initFirebaseSubtasks, { once: true });
  } else {
    initFirebaseSubtasks();
  }
}

initOnDOMReady();