/**
 * ========================================
 * TASK/BOARD TEMPLATES
 * ========================================
 */

/**
 * Generates card HTML for board (from board-enhancements-core_part1.js)
 * Used for creating task cards on the Kanban board
 * @param {Object} task - Task data object
 * @param {Array} task.assigned - Array of assigned contacts
 * @param {string} task.priority - Task priority level
 * @param {Object} task.category - Task category object
 * @param {string} task.category.name - Category name
 * @param {string} task.title - Task title
 * @param {string} task.description - Task description
 * @returns {string} HTML template string for task card
 */
function beGenerateCardHTML(task) {
  const assignees = beGetAssigneesString(task.assigned);
  const priority = beGetPriorityClass(task.priority);
  const type = beGetTaskTypeClass(task.category?.name);
  const categoryName = task.category?.name || 'User Story';
  
  return `<div class="kb-card-top">
  <span class="kb-chip kb-chip--${type}">${categoryName}</span>
</div>
<h3 class="kb-card-title">${task.title}</h3>
<p class="kb-card-desc">${task.description || ''}</p>
<footer class="kb-card-foot">
  <div class="kb-avatars" data-assignees="${assignees}"></div>
  <div class="kb-prio kb-prio--${priority}">
    <span class="kb-prio__icon" aria-hidden="true"></span>
  </div>
</footer>`;
}

/**
* Creates simple task card HTML (from board-modals_part2.js and board-main.js)
* Used for displaying tasks in simple list format
* @param {Object} task - Task data object
* @param {Object} task.category - Task category object
* @param {string} task.category.color - Category color
* @param {string} task.category.name - Category name
* @param {string} task.title - Task title
* @param {string} task.description - Task description
* @param {string} task.dueDate - Task due date
* @param {string} task.priority - Task priority level
* @returns {string} HTML template string for simple task card
*/
function createTaskCardHTML(task) {
  return `
  <div class="task-category" style="background:${task.category.color}">
    ${task.category.name}
  </div>
  <h3>${task.title}</h3>
  <p>${task.description}</p>
  <p><b>Due:</b> ${task.dueDate}</p>
  <p><b>Priority:</b> ${task.priority}</p>
`;
}


/**
 * Board Templates
 * ONLY HTML generation - no logic!
 */


/**
 * Generates card HTML template
 */
function generateCardHTML(task) {
  const color = getCategoryColor(task.category);
  const cls = getCategoryClass(task.category);
  const icon = getPriorityIcon(task.priority);
  const assignees = getAssigneesString(task.assigned);
  const progress = createSubtasksProgressHTML(task.subtasks);
  return `
    <div class="kb-chip kb-chip--${cls}" style="background-color: ${color}">
      ${task.category?.name || 'Task'}
    </div>
    <h3 class="kb-card-title">${task.title || ''}</h3>
    <p class="kb-card-desc">${task.description || ''}</p>
    ${progress}
    <div class="kb-card-footer">
      <div class="kb-avatars" data-assignees="${assignees}"></div>
      <div class="kb-prio kb-prio--${task.priority || 'medium'}">
        <img src="${icon}" alt="${task.priority || 'medium'}" />
      </div>
    </div>
  `;
}


/**
 * Creates subtasks progress HTML
 */
function createSubtasksProgressHTML(subtasks) {
  if (!subtasks || subtasks.length === 0) return "";
  const completed = subtasks.filter(st => st.completed).length;
  const progress = Math.round((completed / subtasks.length) * 100);
  return `
    <div class="kb-subtasks-progress">
      <div class="kb-progress-bar">
        <div class="kb-progress-fill" style="width: ${progress}%"></div>
      </div>
      <span class="kb-progress-text">${completed}/${subtasks.length} Subtasks</span>
    </div>
  `;
}