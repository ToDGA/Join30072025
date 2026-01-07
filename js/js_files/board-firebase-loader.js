/**
 * Firebase Task Loader - FIXED
 * NO localStorage - NO duplicate BASE_URL
 * Uses db.js functions
 * Loads all tasks ONLY from Firebase on page load
 */

/**
 * Loads all tasks from Firebase on page initialization
 * FIXED: Uses getData from db.js
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
 * Renders task in appropriate column
 * @param {Object} task - Task object with firebaseId
 */
function renderTaskInColumn(task) {
  const status = task.status || 'todo';
  const container = document.querySelector(`[data-status="${status}"] [data-cards]`);
  
  if (!container) {
    console.warn(`⚠️ Container not found for status: ${status}`);
    return;
  }
  
  // Use existing renderSingleTask if available
  if (typeof renderSingleTask === 'function') {
    renderSingleTask(task);
  } else {
    // Fallback: create and append card manually
    const card = createTaskCard(task);
    container.appendChild(card);
  }
}

/**
 * Creates task card element
 * @param {Object} task - Task object
 * @returns {HTMLElement}
 */
function createTaskCard(task) {
  const card = document.createElement('article');
  card.className = 'kb-card';
  card.dataset.id = task.firebaseId;
  card.dataset.status = task.status || 'todo';
  card.dataset.due = task.dueDate || '';
  
  if (task.subtasks && task.subtasks.length > 0) {
    card.dataset.subtasks = JSON.stringify(task.subtasks);
  }
  
  card.innerHTML = generateTaskCardHTML(task);
  
  // Make draggable if function exists
  if (typeof beMakeDraggable === 'function') {
    beMakeDraggable(card);
  }
  
  return card;
}

/**
 * Generates card HTML
 * @param {Object} task - Task object
 * @returns {string}
 */
function generateTaskCardHTML(task) {
  const categoryColor = getTaskCategoryColor(task.category);
  const categoryClass = getTaskCategoryClass(task.category);
  const priorityIcon = getTaskPriorityIcon(task.priority);
  const assigneesStr = getTaskAssignees(task.assigned);
  const progressHTML = generateProgressHTML(task.subtasks);
  
  return `
    <div class="kb-chip kb-chip--${categoryClass}"
         style="background-color: ${categoryColor}">
      ${task.category?.name || 'Task'}
    </div>
    <h3 class="kb-card-title">${task.title || ''}</h3>
    <p class="kb-card-desc">${task.description || ''}</p>
    ${progressHTML}
    <div class="kb-card-footer">
      <div class="kb-avatars" data-assignees="${assigneesStr}"></div>
      <div class="kb-prio kb-prio--${task.priority || 'medium'}">
        <img src="${priorityIcon}" alt="${task.priority || 'medium'}" />
      </div>
    </div>
  `;
}

/**
 * Helper functions
 */
function getTaskCategoryColor(category) {
  if (!category) return "#999";
  const colors = {
    "User Story": "#0038FF",
    "Technical Task": "#6c8cff"
  };
  return colors[category.name] || category.color || "#999";
}

function getTaskCategoryClass(category) {
  return category?.name === 'Technical Task' ? 'technical' : 'story';
}

function getTaskPriorityIcon(priority) {
  const icons = {
    'urgent': "./assets/img/red_high_urgent.svg",
    'high': "./assets/img/red_high_urgent.svg",
    'medium': './assets/img/Prio media.svg',
    'low': './assets/img/green_low_urgent.svg'
  };
  return icons[priority] || icons.medium;
}

function getTaskAssignees(assigned) {
  if (!assigned || assigned.length === 0) return "";
  return assigned.map(a => a.initials).join(",");
}

function generateProgressHTML(subtasks) {
  if (!subtasks || subtasks.length === 0) return "";
  
  const completed = subtasks.filter(st => st.completed).length;
  const progress = Math.round((completed / subtasks.length) * 100);
  const countText = `${completed}/${subtasks.length} Subtasks`;
  
  return `
    <div class="kb-subtasks-progress">
      <div class="kb-progress-bar">
        <div class="kb-progress-fill" style="width: ${progress}%"></div>
      </div>
      <span class="kb-progress-text">${countText}</span>
    </div>
  `;
}

/**
 * Updates all column states (empty/not empty)
 */
function updateAllColumnStates() {
  if (typeof beSyncAllColumns === 'function') {
    beSyncAllColumns();
  } else {
    // Fallback
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
 * REMOVED: preventLocalStorageLoading - no longer needed
 * We're not using localStorage at all
 */

/**
 * Initialize Firebase loader
 */
async function initFirebaseLoader() {
  if (window.__firebaseLoaderInit) {
    console.log("Firebase loader already initialized");
    return;
  }
  
  window.__firebaseLoaderInit = true;
  console.log("🚀 Initializing Firebase Loader (NO localStorage)...");
  
  // Load tasks from Firebase using db.js
  await loadAllTasksFromFirebase();
  
  console.log("✅ Firebase Loader initialized!");
}

/**
 * Auto-initialize on DOM ready
 */
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initFirebaseLoader, { once: true });
} else {
  initFirebaseLoader();
}

/**
 * Export for manual reload
 */
window.reloadTasksFromFirebase = loadAllTasksFromFirebase;