/**
 * Firebase Task Creation & Rendering
 * All logic functions
 */


/**
 * Creates task in Firebase
 */
async function createTaskDirectlyInFirebase(taskData) {
  try {
    const firebaseTask = buildFirebaseTask(taskData);
    const firebaseId = await postData("/task", firebaseTask);
    if (firebaseId) {
      const taskWithId = { ...firebaseTask, firebaseId };
      renderTaskOnBoard(taskWithId);
      return firebaseId;
    }
    return null;
  } catch (error) {
    console.error("Error creating task:", error);
    return null;
  }
}


/**
 * Builds Firebase task object
 */
function buildFirebaseTask(taskData) {
  return {
    title: taskData.title,
    description: taskData.description,
    dueDate: taskData.dueDate,
    category: taskData.category,
    priority: taskData.priority,
    status: taskData.status || 'todo',
    assigned: taskData.assigned || [],
    subtasks: taskData.subtasks || [],
    createdAt: new Date().toISOString()
  };
}


/**
 * Renders task on board
 */
function renderTaskOnBoard(task) {
  if (typeof renderSingleTask === 'function') {
    renderSingleTask(task);
  } else {
    manualRenderTask(task);
  }
  if (typeof renderAvatars === 'function') renderAvatars();
  if (typeof beSyncAllColumns === 'function') beSyncAllColumns();
}


/**
 * Manually renders task
 */
function manualRenderTask(task) {
  const column = document.querySelector(`[data-status="${task.status}"] [data-cards]`);
  if (!column) return;
  column.appendChild(createCardElement(task));
}


/**
 * Creates card element
 */
function createCardElement(task) {
  const card = document.createElement('article');
  card.className = 'kb-card';
  card.dataset.id = task.firebaseId;
  card.dataset.status = task.status;
  card.dataset.due = task.dueDate || '';
  if (task.subtasks && task.subtasks.length > 0) {
    card.dataset.subtasks = JSON.stringify(task.subtasks);
  }
  card.innerHTML = generateCardHTML(task);
  return card;
}


/**
 * Gets category color
 */
function getCategoryColor(category) {
  if (!category) return "#999";
  const colors = { "User Story": "#0038FF", "Technical Task": "#6c8cff" };
  return colors[category.name] || category.color || "#999";
}


/**
 * Gets category class
 */
function getCategoryClass(category) {
  return category?.name === 'Technical Task' ? 'technical' : 'story';
}


/**
 * Gets priority icon
 */
function getPriorityIcon(priority) {
  const icons = {
    'urgent': "./assets/img/red_high_urgent.svg",
    'medium': './assets/img/Prio media.svg',
    'low': './assets/img/green_low_urgent.svg'
  };
  return icons[priority] || icons.medium;
}


/**
 * Gets assignees string
 */
function getAssigneesString(assigned) {
  if (!assigned || assigned.length === 0) return "";
  return assigned.map(a => a.initials).join(",");
}


/**
 * Extracts form data
 */
function extractFormDataForFirebase(form) {
  const formData = new FormData(form);
  const basic = extractBasicFormData(formData);
  return {
    ...basic,
    category: buildCategoryObject(basic.categoryName),
    assigned: extractAssignedContacts(form),
    subtasks: extractSubtasks(form),
    status: 'todo'
  };
}


/**
 * Extracts basic data
 */
function extractBasicFormData(formData) {
  return {
    title: formData.get('title')?.toString().trim() || '',
    description: formData.get('description')?.toString().trim() || '',
    dueDate: convertISOToDisplay(formData.get('due')?.toString() || ''),
    categoryName: formData.get('category')?.toString() || '',
    priority: formData.get('priority')?.toString() || 'medium'
  };
}


/**
 * Builds category object
 */
function buildCategoryObject(categoryName) {
  return {
    name: categoryName,
    color: categoryName === 'Technical Task' ? '#6c8cff' : 
           categoryName === 'User Story' ? '#0038FF' : '#999'
  };
}


/**
 * Extracts assigned contacts
 */
function extractAssignedContacts(form) {
  const select = form.querySelector('[name="assignees"]');
  const assigned = [];
  if (select) {
    Array.from(select.selectedOptions).forEach(opt => {
      const initials = nameToInitials(opt.textContent.trim());
      if (initials) assigned.push({ initials });
    });
  }
  return assigned;
}


/**
 * Extracts subtasks
 */
function extractSubtasks(form) {
  const subtasks = [];
  const list = form.querySelector('.subtasks__list');
  if (list) {
    list.querySelectorAll('li').forEach(li => {
      const text = li.textContent.trim();
      if (text) subtasks.push({ name: text, completed: false });
    });
  }
  return subtasks;
}


/**
 * Converts ISO to display date
 */
function convertISOToDisplay(isoDate) {
  if (!isoDate) return '';
  const match = isoDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return match ? `${match[3]}/${match[2]}/${match[1]}` : isoDate;
}


/**
 * Converts name to initials
 */
function nameToInitials(fullName) {
  const list = window.contacts || contacts;
  if (!list) return null;
  const contact = list.find(c => 
    c.name === fullName || fullName.startsWith(c.name.split(' (')[0])
  );
  return contact ? contact.initials : null;
}


/**
 * Validates task data
 */
function validateTaskData(data) {
  if (!data.title || data.title.length < 1) {
    alert('Please enter a title');
    return false;
  }
  if (!data.dueDate) {
    alert('Please select a due date');
    return false;
  }
  if (!data.category || !data.category.name) {
    alert('Please select a category');
    return false;
  }
  return true;
}


/**
 * Handles form submit
 */
async function handleFormSubmitFirebaseOnly(e) {
  e.preventDefault();
  const form = e.target;
  if (form.dataset.editingId) return;
  const taskData = extractFormDataForFirebase(form);
  if (!validateTaskData(taskData)) return;
  closeAddTaskModal();
  const firebaseId = await createTaskDirectlyInFirebase(taskData);
  if (firebaseId) {
    form.reset();
  } else {
    alert("Failed to create task.");
  }
}


/**
 * Closes modal
 */
function closeAddTaskModal() {
  const modal = document.getElementById('at-modal');
  if (modal) modal.classList.remove('is-open');
  const overlay = document.getElementById('at-overlay');
  if (overlay) overlay.classList.remove('is-open');
  if (typeof hideOverlay === 'function') hideOverlay();
  document.body.style.overflow = '';
}


/**
 * Checks initialization
 */
function isFirebaseOnlyInitialized() {
  return !!window.__firebaseOnlyInit;
}


/**
 * Marks initialized
 */
function markAsInitialized() {
  window.__firebaseOnlyInit = true;
}


/**
 * Clones and replaces form
 */
function cloneAndReplaceForm(form) {
  const newForm = form.cloneNode(true);
  form.parentNode.replaceChild(newForm, form);
  return newForm;
}


/**
 * Sets up form handler
 */
function setupFormHandler() {
  const form = document.getElementById('taskForm');
  if (!form) {
    setTimeout(initFirebaseOnlyIntegration, 500);
    return false;
  }
  const newForm = cloneAndReplaceForm(form);
  newForm.addEventListener('submit', handleFormSubmitFirebaseOnly);
  return true;
}


/**
 * Handles create button click
 */
function handleCreateClick(e) {
  const form = document.getElementById('taskForm');
  if (form && !form.dataset.editingId) {
    e.preventDefault();
    form.requestSubmit();
  }
}


/**
 * Sets up create button handler
 */
function setupCreateButton() {
  const btn = document.getElementById('at-create');
  if (btn) {
    btn.addEventListener('click', handleCreateClick);
  }
}


/**
 * Initializes Firebase-only integration
 */
function initFirebaseOnlyIntegration() {
  if (isFirebaseOnlyInitialized()) return;
  markAsInitialized();
  if (!setupFormHandler()) return;
  setupCreateButton();
}


if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initFirebaseOnlyIntegration, { once: true });
} else {
  setTimeout(initFirebaseOnlyIntegration, 100);
}

window.createTaskDirectlyInFirebase = createTaskDirectlyInFirebase;
window.firebaseOnlyMode = true;