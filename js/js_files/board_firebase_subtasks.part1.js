/**
 * Firebase + Subtasks Integration Module - Part 1
 * Handles Firebase operations, card rendering, and progress bars
 */


/**
 * Firebase configuration object
 */
const FIREBASE_CONFIG = {
  BASE_URL: "https://join-1314-default-rtdb.europe-west1.firebasedatabase.app/",
  PATHS: {
    TASKS: "/task",
    CONTACTS: "/contacts"
  }
};


/**
 * Category colors with User Story fix
 */
const CATEGORY_COLORS = {
  "User Story": "#0038FF",
  "Technical Task": "#6c8cff"
};


/**
 * Fetches all tasks from Firebase
 * @returns {Promise<Array>} Array of tasks with firebaseId
 */
async function fbGetAllTasks() {
  try {
    const url = FIREBASE_CONFIG.BASE_URL + FIREBASE_CONFIG.PATHS.TASKS + ".json";
    const response = await fetch(url);
    const data = await response.json();
    return fbProcessTasksData(data);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
}


/**
 * Processes raw Firebase tasks data
 * @param {Object} data - Raw Firebase data
 * @returns {Array} Processed tasks array
 */
function fbProcessTasksData(data) {
  if (!data) return [];
  
  return Object.entries(data).map(([firebaseId, task]) => ({
    ...task,
    firebaseId,
    subtasks: task.subtasks || []
  }));
}


/**
 * Updates task status in Firebase
 * @param {string} firebaseId - Firebase task ID
 * @param {string} status - New status
 * @returns {Promise<void>}
 */
async function fbUpdateTaskStatus(firebaseId, status) {
  try {
    const url = `${FIREBASE_CONFIG.BASE_URL}${FIREBASE_CONFIG.PATHS.TASKS}/${firebaseId}/status.json`;
    await fetch(url, {
      method: "PUT",
      body: JSON.stringify(status)
    });
  } catch (error) {
    console.error("Error updating task status:", error);
  }
}


/**
 * Updates subtasks in Firebase
 * @param {string} firebaseId - Firebase task ID
 * @param {Array} subtasks - Updated subtasks array
 * @returns {Promise<void>}
 */
async function fbUpdateSubtasks(firebaseId, subtasks) {
  try {
    const url = `${FIREBASE_CONFIG.BASE_URL}${FIREBASE_CONFIG.PATHS.TASKS}/${firebaseId}/subtasks.json`;
    await fetch(url, {
      method: "PUT",
      body: JSON.stringify(subtasks)
    });
  } catch (error) {
    console.error("Error updating subtasks:", error);
  }
}


/**
 * Creates new task in Firebase
 * @param {Object} taskData - Task data to create
 * @returns {Promise<string|null>} Firebase ID or null
 */
async function fbCreateTask(taskData) {
  try {
    const url = FIREBASE_CONFIG.BASE_URL + FIREBASE_CONFIG.PATHS.TASKS + ".json";
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(taskData)
    });
    const data = await response.json();
    return data.name;
  } catch (error) {
    console.error("Error creating task:", error);
    return null;
  }
}


/**
 * Calculates subtasks completion percentage
 * @param {Array} subtasks - Array of subtasks
 * @returns {number} Percentage (0-100)
 */
function calculateProgress(subtasks) {
  if (!subtasks || subtasks.length === 0) return 0;
  
  const completed = subtasks.filter(st => st.completed).length;
  return Math.round((completed / subtasks.length) * 100);
}


/**
 * Gets subtasks count text
 * @param {Array} subtasks - Array of subtasks
 * @returns {string} Count text like "1/2 Subtasks"
 */
function getCountText(subtasks) {
  if (!subtasks || subtasks.length === 0) return "";
  
  const completed = subtasks.filter(st => st.completed).length;
  return `${completed}/${subtasks.length} Subtasks`;
}


/**
 * Creates progress bar HTML
 * @param {Array} subtasks - Array of subtasks
 * @returns {string} Progress bar HTML
 */
function createProgressHTML(subtasks) {
  if (!subtasks || subtasks.length === 0) return "";
  
  const progress = calculateProgress(subtasks);
  const countText = getCountText(subtasks);
  
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
 * Injects CSS styles for progress bar
 */
function injectProgressStyles() {
  if (document.getElementById("subtasks-progress-styles")) return;
  
  const style = document.createElement("style");
  style.id = "subtasks-progress-styles";
  style.textContent = getProgressStylesCSS();
  document.head.appendChild(style);
}


/**
 * Returns CSS for progress bar
 * @returns {string} CSS string
 */
function getProgressStylesCSS() {
  return `.kb-subtasks-progress{
  display:flex;
  align-items:center;
  gap:8px;margin-top:12px;
  padding:0 16px
  }
  .kb-progress-bar{
  flex:1;
  height:8px;
  background:#F4F4F4;
  border-radius:4px;
  overflow:hidden
  }
  .kb-progress-fill{
  height:100%;
  background:#4589FF;
  transition:width .3s ease
  }
  .kb-progress-text{
  font-size:12px;
  color:#000;
  white-space:nowrap;
  font-weight:400
  }
  .td-subtask-item{
  display:flex;
  align-items:center;
  gap:8px;
  padding:8px 0
  }
  .td-subtask-checkbox{
  width:18px;
  height:18px;
  border:2px solid #D1D1D1;
  border-radius:4px;
  cursor:pointer;
  transition:all .2s;
  background:white;
  flex-shrink:0
  }
  .td-subtask-checkbox.checked{
  background:#4589FF;
  border-color:#4589FF;
  position:relative
  }
  .td-subtask-checkbox.checked::after{
  content:'✓';
  position:absolute;
  color:white;
  font-size:12px;
  top:50%;
  left:50%;
  transform:translate(-50%,-50%)
  }
  .td-subtask-label{
  flex:1;
  font-size:14px;
  color:#000
  }
  .td-subtask-item.completed .td-subtask-label{
  text-decoration:line-through;
  color:#999
  }`;
}


/**
 * Gets category color
 * @param {Object} category - Category object
 * @returns {string} Color hex code
 */
function getCategoryColor(category) {
  if (!category) return "#999";
  return CATEGORY_COLORS[category.name] || category.color || "#999";
}


/**
 * Gets category chip class
 * @param {Object} category - Category object
 * @returns {string} CSS class name
 */
function getCategoryClass(category) {
  const isTechnical = category?.name === 'Technical Task';
  return isTechnical ? 'technical' : 'story';
}


/**
 * Gets assignees string for data attribute
 * @param {Array} assigned - Array of assigned contacts
 * @returns {string} Comma-separated initials
 */
function getAssigneesString(assigned) {
  if (!assigned) return "";
  return assigned.map(a => a.initials).join(",");
}

function getPriority(priority) {
  switch (priority) {
    case 'urgent':
      return "./assets/img/red_high_urgent.svg";
    case 'medium':
      return './assets/img/Prio media.svg';
    case 'low':
      return './assets/img/green_low_urgent.svg';
    default:
      return "./assets/img/red_high_urgent.svg";
  }
}


/**
 * Generates card HTML
 * @param {Object} task - Task object
 * @returns {string} Card HTML
 */
function beGenerateCardHTML(task) {
  const categoryColor = getCategoryColor(task.category);
  const categoryClass = getCategoryClass(task.category);
  const priorityClass = getPriority(task.priority);
  const assigneesStr = getAssigneesString(task.assigned);
  const subtasksHTML = createProgressHTML(task.subtasks);
  
  return `
    <div class="kb-chip kb-chip--${categoryClass}"
         style="background-color: ${categoryColor}">
      ${task.category?.name || 'Task'}
    </div>
    <h3 class="kb-card-title">${task.title || ''}</h3>
    <p class="kb-card-desc">${task.description || ''}</p>
    ${subtasksHTML}
    <div class="kb-card-footer">
      <div class="kb-avatars" data-assignees="${assigneesStr}"></div>
      <div class="kb-prio kb-prio--${priorityClass}">
        <img src="${priorityClass}" alt="${priorityClass}" />
      </div>
    </div>
  `;
}


/**
 * Maps status to column name
 * @param {string} status - Task status
 * @returns {string} Column status
 */
function getColumnStatus(status) {
  const statusMap = {
    'todo': 'todo',
    'inprogress': 'inprogress',
    'feedback': 'feedback',
    'done': 'done'
  };
  return statusMap[status] || 'todo';
}


/**
 * Clears all cards from columns
 */
function clearAllColumns() {
  const containers = document.querySelectorAll('[data-status] [data-cards]');
  containers.forEach(container => {
    container.innerHTML = '';
  });
}


/**
 * Creates card element
 * @param {Object} task - Task data
 * @returns {HTMLElement} Card element
 */
function createCardElement(task) {
  const card = document.createElement('article');
  card.className = 'kb-card';
  card.dataset.id = task.firebaseId;
  card.dataset.status = task.status;
  card.dataset.due = task.dueDate || '';
  
  storeSubtasksInCard(card, task.subtasks);
  card.innerHTML = beGenerateCardHTML(task);
  
  return card;
}


/**
 * Stores subtasks in card dataset
 * @param {HTMLElement} card - Card element
 * @param {Array} subtasks - Subtasks array
 */
function storeSubtasksInCard(card, subtasks) {
  if (subtasks && subtasks.length > 0) {
    card.dataset.subtasks = JSON.stringify(subtasks);
  }
}


/**
 * Gets container for status
 * @param {string} status - Task status
 * @returns {HTMLElement|null} Container element
 */
function getContainerForStatus(status) {
  const columnStatus = getColumnStatus(status);
  return document.querySelector(`[data-status="${columnStatus}"] [data-cards]`);
}


/**
 * Appends card to container
 * @param {HTMLElement} card - Card element
 * @param {string} status - Task status
 */
function appendCardToBoard(card, status) {
  const container = getContainerForStatus(status);
  if (container) {
    container.appendChild(card);
  }
}


/**
 * Renders single task on board
 * @param {Object} task - Task object
 */
function renderSingleTask(task) {
  const card = createCardElement(task);
  appendCardToBoard(card, task.status);
}


/**
 * Triggers avatar rendering
 */
function triggerAvatarRendering() {
  if (typeof renderAvatars === 'function') {
    renderAvatars();
  }
}


/**
 * Updates column empty states
 */
function updateColumnStates() {
  if (typeof beSyncAllColumns === 'function') {
    beSyncAllColumns();
  }
}

function sortTaskByStatus(tasks, status, id) {
  let column = document.getElementById(id);
  let sortedTasks = tasks.filter(task => task.status === status);
  column.innerHTML = '';
  sortedTasks.forEach(task => {
    renderSingleTask(task);
  });
}


/**
 * Renders all tasks on board
 * @param {Array} tasks - Array of tasks
 */
function renderTasksOnBoard(tasks) {
  clearAllColumns();
  sortTaskByStatus(tasks, 'todo', 'todo');
  sortTaskByStatus(tasks, 'inprogress', 'inprogress');
  sortTaskByStatus(tasks, 'feedback', 'feedback');
  sortTaskByStatus(tasks, 'done', 'done');
  // tasks.forEach(task => renderSingleTask(task));
  triggerAvatarRendering();
  updateColumnStates();
}


/**
 * Loads and displays all tasks from Firebase
 * @returns {Promise<void>}
 */
async function loadTasksFromFirebase() {
  const tasks = await fbGetAllTasks();
  renderTasksOnBoard(tasks);
}