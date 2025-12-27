/**
 * FIREBASE-ONLY Integration Module - FIXED
 * NO localStorage - everything works directly with Firebase
 * Uses FIREBASE_CONFIG from board_firebase_subtasks.part1.js
 */


/**
 * Creates task directly in Firebase and renders on board
 * @param {Object} taskData - Task data from form
 * @returns {Promise<string|null>} Firebase ID
 */
async function createTaskDirectlyInFirebase(taskData) {
  try {
    console.log("🚀 Creating task in Firebase:", taskData.title);
    
    // Prepare task for Firebase
    const firebaseTask = {
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
    
    // Use Firebase config from existing module
    const BASE_URL = "https://join-1314-default-rtdb.europe-west1.firebasedatabase.app";
    const url = BASE_URL + "/task.json";
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(firebaseTask)
    });
    
    const data = await response.json();
    const firebaseId = data.name;
    
    if (firebaseId) {
      console.log(`✅ Task created in Firebase: ${firebaseId}`);
      
      // Render immediately on board
      const taskWithId = {
        ...firebaseTask,
        firebaseId: firebaseId
      };
      
      renderTaskOnBoard(taskWithId);
      
      return firebaseId;
    }
    
    return null;
  } catch (error) {
    console.error("❌ Error creating task in Firebase:", error);
    return null;
  }
}


/**
 * Renders task on board immediately
 * @param {Object} task - Task with firebaseId
 */
function renderTaskOnBoard(task) {
  console.log("🎨 Rendering task on board:", task.title);
  
  // Use existing renderSingleTask function if available
  if (typeof renderSingleTask === 'function') {
    renderSingleTask(task);
  } else {
    // Fallback: manual render
    manualRenderTask(task);
  }
  
  // Render avatars
  if (typeof renderAvatars === 'function') {
    renderAvatars();
  }
  
  // Update column states
  if (typeof beSyncAllColumns === 'function') {
    beSyncAllColumns();
  }
  
  console.log("✅ Task rendered successfully");
}


/**
 * Manual task render (fallback)
 * @param {Object} task - Task object
 */
function manualRenderTask(task) {
  const column = document.querySelector(`[data-status="${task.status}"] [data-cards]`);
  if (!column) {
    console.error("❌ Column not found for status:", task.status);
    return;
  }
  
  const card = createCardElement(task);
  column.appendChild(card);
}


/**
 * Creates card HTML element
 * @param {Object} task - Task object
 * @returns {HTMLElement}
 */
function createCardElement(task) {
  const card = document.createElement('article');
  card.className = 'kb-card';
  card.dataset.id = task.firebaseId;
  card.dataset.status = task.status;
  card.dataset.due = task.dueDate || '';
  
  // Store subtasks if any
  if (task.subtasks && task.subtasks.length > 0) {
    card.dataset.subtasks = JSON.stringify(task.subtasks);
  }
  
  // Generate card HTML
  card.innerHTML = generateCardHTML(task);
  
  return card;
}


/**
 * Generates card HTML content
 * @param {Object} task - Task object
 * @returns {string} HTML string
 */
function generateCardHTML(task) {
  const categoryColor = getCategoryColor(task.category);
  const categoryClass = getCategoryClass(task.category);
  const priorityIcon = getPriorityIcon(task.priority);
  const assigneesStr = getAssigneesString(task.assigned);
  const subtasksHTML = createSubtasksProgressHTML(task.subtasks);
  
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
      <div class="kb-prio kb-prio--${task.priority || 'medium'}">
        <img src="${priorityIcon}" alt="${task.priority || 'medium'}" />
      </div>
    </div>
  `;
}


/**
 * Helper functions
 */
function getCategoryColor(category) {
  if (!category) return "#999";
  const colors = {
    "User Story": "#0038FF",
    "Technical Task": "#6c8cff"
  };
  return colors[category.name] || category.color || "#999";
}

function getCategoryClass(category) {
  return category?.name === 'Technical Task' ? 'technical' : 'story';
}

function getPriorityIcon(priority) {
  const icons = {
    'urgent': "./assets/img/red_high_urgent.svg",
    'medium': './assets/img/Prio media.svg',
    'low': './assets/img/green_low_urgent.svg'
  };
  return icons[priority] || icons.medium;
}

function getAssigneesString(assigned) {
  if (!assigned || assigned.length === 0) return "";
  return assigned.map(a => a.initials).join(",");
}

function createSubtasksProgressHTML(subtasks) {
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
 * Extracts form data
 * @param {HTMLFormElement} form - Form element
 * @returns {Object} Task data
 */
function extractFormDataForFirebase(form) {
  const formData = new FormData(form);
  
  // Get basic fields
  const title = formData.get('title')?.toString().trim() || '';
  const description = formData.get('description')?.toString().trim() || '';
  const dueISO = formData.get('due')?.toString() || '';
  const categoryName = formData.get('category')?.toString() || '';
  const priority = formData.get('priority')?.toString() || 'medium';
  
  // Convert date from YYYY-MM-DD to DD/MM/YYYY
  const dueDate = convertISOToDisplay(dueISO);
  
  // Get category
  const category = {
    name: categoryName,
    color: categoryName === 'Technical Task' ? '#6c8cff' : 
           categoryName === 'User Story' ? '#0038FF' : '#999'
  };
  
  // Get assignees
  const assigneesSelect = form.querySelector('[name="assignees"]');
  const assigned = [];
  if (assigneesSelect) {
    Array.from(assigneesSelect.selectedOptions).forEach(option => {
      const initials = nameToInitials(option.textContent.trim());
      if (initials) {
        assigned.push({ initials: initials });
      }
    });
  }
  
  // Get subtasks from list
  const subtasks = [];
  const subtasksList = form.querySelector('.subtasks__list');
  if (subtasksList) {
    subtasksList.querySelectorAll('li').forEach(li => {
      const text = li.textContent.trim();
      if (text) {
        subtasks.push({
          name: text,
          completed: false
        });
      }
    });
  }
  
  return {
    title,
    description,
    dueDate,
    category,
    priority,
    assigned,
    subtasks,
    status: 'todo'
  };
}


/**
 * Converts ISO date to display format
 * @param {string} isoDate - ISO date string (YYYY-MM-DD)
 * @returns {string} Display format (DD/MM/YYYY)
 */
function convertISOToDisplay(isoDate) {
  if (!isoDate) return '';
  const match = isoDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return isoDate;
  return `${match[3]}/${match[2]}/${match[1]}`;
}


/**
 * Converts name to initials (using global contacts)
 * @param {string} fullName - Full name
 * @returns {string|null} Initials
 */
function nameToInitials(fullName) {
  if (typeof window.contacts === 'undefined' && typeof contacts === 'undefined') return null;
  const contactsList = window.contacts || contacts;
  const contact = contactsList.find(c => 
    c.name === fullName || fullName.startsWith(c.name.split(' (')[0])
  );
  return contact ? contact.initials : null;
}


/**
 * Validates form data
 * @param {Object} data - Form data
 * @returns {boolean} Is valid
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
 * Main form submit handler - Firebase only
 * @param {Event} e - Submit event
 */
async function handleFormSubmitFirebaseOnly(e) {
  e.preventDefault();
  
  const form = e.target;
  
  // Skip if editing existing task
  if (form.dataset.editingId) {
    console.log("Editing mode - skipping new task creation");
    return;
  }
  
  console.log("📝 Processing new task form...");
  
  // Extract data
  const taskData = extractFormDataForFirebase(form);
  
  // Validate
  if (!validateTaskData(taskData)) {
    return;
  }
  
  // Close modal first (better UX)
  closeAddTaskModal();
  
  // Create in Firebase and render
  const firebaseId = await createTaskDirectlyInFirebase(taskData);
  
  if (firebaseId) {
    console.log("✅ Task creation complete!");
    
    // Reset form
    form.reset();
  } else {
    console.error("❌ Failed to create task");
    alert("Failed to create task. Please try again.");
  }
}


/**
 * Closes add task modal
 */
function closeAddTaskModal() {
  const modal = document.getElementById('at-modal');
  if (modal) {
    modal.classList.remove('is-open');
  }
  
  const overlay = document.getElementById('at-overlay');
  if (overlay) {
    overlay.classList.remove('is-open');
  }
  
  if (typeof hideOverlay === 'function') {
    hideOverlay();
  }
  
  document.body.style.overflow = '';
}


/**
 * Initializes Firebase-only integration
 */
function initFirebaseOnlyIntegration() {
  if (window.__firebaseOnlyInit) {
    console.log("Firebase-only integration already initialized");
    return;
  }
  
  window.__firebaseOnlyInit = true;
  console.log("🚀 Initializing Firebase-Only Integration (NO localStorage)...");
  
  // Find and override form submit
  const form = document.getElementById('taskForm');
  if (form) {
    // Remove all existing submit listeners by cloning
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    
    // Add new submit listener
    newForm.addEventListener('submit', handleFormSubmitFirebaseOnly);
    console.log("✅ Form submit handler attached (Firebase-only)");
  } else {
    console.warn("⚠️ Task form not found, will retry...");
    // Retry after a short delay
    setTimeout(initFirebaseOnlyIntegration, 500);
    return;
  }
  
  // Also override create button click
  const createBtn = document.getElementById('at-create');
  if (createBtn) {
    createBtn.addEventListener('click', (e) => {
      const taskForm = document.getElementById('taskForm');
      if (taskForm && !taskForm.dataset.editingId) {
        e.preventDefault();
        taskForm.requestSubmit();
      }
    });
    console.log("✅ Create button handler attached");
  }
  
  console.log("✅ Firebase-Only Integration initialized!");
  console.log("💡 All tasks will be stored ONLY in Firebase");
}


/**
 * Initialize on DOM ready
 */
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initFirebaseOnlyIntegration, { once: true });
} else {
  setTimeout(initFirebaseOnlyIntegration, 100);
}


/**
 * Export for debugging
 */
window.createTaskDirectlyInFirebase = createTaskDirectlyInFirebase;
window.firebaseOnlyMode = true;