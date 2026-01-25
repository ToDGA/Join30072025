/**
 * Firebase Task Loader
 * Loads all tasks from Firebase on page load
 * Uses shared functions from board-firebase-only.js
 */


/**
 * Loads all tasks from Firebase
 */
async function loadAllTasksFromFirebase() {
  try {
    const data = await getData("/tasks");
    if (!data) {
      updateAllColumnStates();
      return;
    }
    const tasks = Object.entries(data).map(([firebaseId, task]) => ({
      ...task,
      firebaseId: firebaseId
    }));
    clearAllColumnContainers();
    tasks.forEach(task => {
      renderTaskInColumn(task);
    });
    if (typeof renderAvatars === 'function') {
      renderAvatars();
    }
    updateAllColumnStates();
  } catch (error) {
    console.error("Error loading tasks:", error);
  }
}


/**
 * Clears all column containers
 */
function clearAllColumnContainers() {
  const containers = document.querySelectorAll('[data-status] [data-cards]');
  containers.forEach(container => {
    container.innerHTML = '';
  });
}


/**
 * Renders task in column
 */
function renderTaskInColumn(task) {
  const status = task.status || 'todo';
  const container = document.querySelector(`[data-status="${status}"] [data-cards]`);
  if (!container) return;
  if (typeof renderSingleTask === 'function') {
    renderSingleTask(task);
  } else {
    const card = createCardElement(task);
    container.appendChild(card);
  }
}


/**
 * Updates column states
 */
function updateAllColumnStates() {
  if (typeof beSyncAllColumns === 'function') {
    beSyncAllColumns();
  } else {
    document.querySelectorAll('[data-status]').forEach(col => {
      const container = col.querySelector('[data-cards]');
      const emptyBox = col.querySelector('[data-empty], .kb-empty');
      const hasCards = container && container.querySelector('.kb-card');
      if (emptyBox) {
        emptyBox.hidden = hasCards;
      }
    });
  }
}


/**
 * Initialize Firebase loader
 */
async function initFirebaseLoader() {
  if (window.__firebaseLoaderInit) return;
  window.__firebaseLoaderInit = true;
  await loadAllTasksFromFirebase();
}


if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initFirebaseLoader, { once: true });
} else {
  initFirebaseLoader();
}

window.reloadTasksFromFirebase = loadAllTasksFromFirebase;