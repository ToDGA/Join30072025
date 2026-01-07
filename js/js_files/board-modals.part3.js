/**
 * Creates task card element
 * @param {Object} task - Task data
 * @returns {HTMLElement}
 */
function createTaskCard(task) {
  const card = document.createElement('div');
  card.className = 'task-card';
  card.innerHTML = createTaskCardHTML(task);
  return card;
}


/**
 * Renders tasks in container
 * @param {HTMLElement} container - Container element
 * @param {Array} tasks - Tasks array
 */
function renderTasksInContainer(container, tasks) {
  tasks.forEach(task => {
    const card = createTaskCard(task);
    container.appendChild(card);
  });
}


/**
 * Loads tasks into board
 */
function loadTasksIntoBoard() {
  const container = document.getElementById('task-board');
  const tasks = getData(path = "tasks");
  
  
  if (container) {
    renderTasksInContainer(container, tasks);
  }
}


/**
 * Main board initialization
 */
function initBoard() {
  initStaticIcons();
  renderAvatars();
  bindAddTaskTriggers();
  bindCardPopups();
  wireAddTaskModal();
  wireTaskDetailsModal();
  wireAddTaskForm();
  bindSubtaskToggles();
  bindGlobalModalEvents();
  loadTasksIntoBoard();
}


window.addEventListener("DOMContentLoaded", initBoard);