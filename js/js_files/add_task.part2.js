/**
 * Sets up subtask input functionality
 */
function setupSubtasks() {
  const input = document.getElementById('subtask-input');
  const plus = document.getElementById('subtask-add-icon');
  const cancel = document.getElementById('subtask-cancel-icon');
  const confirm = document.getElementById('subtask-confirm-icon');
  
  if (!input || !plus || !cancel || !confirm) return;

  input.addEventListener('input', () => handleSubtaskInput(input, plus, cancel, confirm));
  cancel.addEventListener('click', () => handleSubtaskCancel(input, plus, cancel, confirm));
  confirm.addEventListener('click', () => handleSubtaskConfirm(input, plus, cancel, confirm));
}


/**
 * Handles subtask input change
 * @param {HTMLInputElement} input - Input element
 * @param {HTMLElement} plus - Plus icon
 * @param {HTMLElement} cancel - Cancel icon
 * @param {HTMLElement} confirm - Confirm icon
 */
function handleSubtaskInput(input, plus, cancel, confirm) {
  const hasText = input.value.trim() !== '';
  plus.style.display = hasText ? 'none' : 'inline';
  cancel.style.display = hasText ? 'inline' : 'none';
  confirm.style.display = hasText ? 'inline' : 'none';
}


/**
 * Handles subtask cancel click
 * @param {HTMLInputElement} input - Input element
 * @param {HTMLElement} plus - Plus icon
 * @param {HTMLElement} cancel - Cancel icon
 * @param {HTMLElement} confirm - Confirm icon
 */
function handleSubtaskCancel(input, plus, cancel, confirm) {
  input.value = '';
  plus.style.display = 'inline';
  cancel.style.display = 'none';
  confirm.style.display = 'none';
}


/**
 * Handles subtask confirm click
 * @param {HTMLInputElement} input - Input element
 * @param {HTMLElement} plus - Plus icon
 * @param {HTMLElement} cancel - Cancel icon
 * @param {HTMLElement} confirm - Confirm icon
 */
function handleSubtaskConfirm(input, plus, cancel, confirm) {
  const value = input.value.trim();
  if (!value) return;
  
  console.log('Subtask added:', value);
  input.value = '';
  plus.style.display = 'inline';
  cancel.style.display = 'none';
  confirm.style.display = 'none';
}


/**
 * Gets input value by ID
 * @param {string} id - Element ID
 * @returns {string}
 */
function getInputValue(id) {
  return document.getElementById(id)?.value.trim() || '';
}


/**
 * Gets selected priority
 * @returns {string}
 */
function getSelectedPriority() {
  return document.querySelector('.priority.selected')?.classList[1] || '';
}


/**
 * Validates required fields
 * @returns {boolean}
 */
function validateRequiredFields() {
  const title = getInputValue('title');
  const dueDate = getInputValue('due-date');
  
  if (!title || !dueDate || selected.category === null) {
    alert('Fill all required fields');
    return false;
  }
  return true;
}


/**
 * Creates task object from form data
 * @returns {Object}
 */
async function createTaskObject() {
  const contactsData = await getData('contacts');
  const contactsArr = contactsData ? Object.values(contactsData) : [];
  
  return {
    id: Date.now(),
    title: getInputValue('title'),
    description: getInputValue('description'),
    dueDate: getInputValue('due-date'),
    priority: getSelectedPriority(),
    category: categories[selected.category],
    assigned: [...selected.contacts].map(i => contactsArr[i]),
    status: 'todo'
  };
}


/**
 * Saves task to localStorage
 * @param {Object} task - Task object
 */
function saveTaskToStorage(task) {
  postData((path = "task"), task);
}


/**
 * Handles create button click
 * @param {Event} e - Click event
 */
async function handleCreateTask(e) {
  e.preventDefault();
  
  if (!validateRequiredFields()) return;
  
  const task = await createTaskObject();
  saveTaskToStorage(task);
  location.href = 'board.html';
}


/**
 * Sets up create button listener
 */
function setupCreateButton() {
  const createBtn = document.querySelector('.create-btn');
  if (createBtn) {
    createBtn.addEventListener('click', handleCreateTask);
  }
}


/**
 * Checks if viewport is mobile
 * @returns {boolean}
 */
function isMobile() {
  return window.innerWidth <= 945;
}


/**
 * Toggles help elements visibility
 * @param {boolean} mobile - Is mobile viewport
 */
function toggleHelpElements(mobile) {
  const helpEls = document.querySelectorAll(
    '.header .help, .header .help-icon, .header [aria-label="Help"], .header button[title="Help"], .header .question-mark'
  );
  
  helpEls.forEach(el => {
    el.style.display = mobile ? 'none' : '';
  });
}


/**
 * Toggles brand logo visibility
 * @param {boolean} mobile - Is mobile viewport
 */
function toggleBrandLogo(mobile) {
  const header = document.querySelector('.header');
  if (!header) return;
  
  let brand = header.querySelector('.brand');
  
  if (mobile && !brand) {
    brand = createBrandElement();
    header.insertBefore(brand, header.firstChild);
  } else if (!mobile && brand) {
    header.removeChild(brand);
  }
}


/**
 * Creates brand logo element
 * @returns {HTMLElement}
 */
function createBrandElement() {
  const brand = document.createElement('div');
  brand.className = 'brand';
  
  const img = document.createElement('img');
  img.className = 'brand-logo';
  img.alt = 'Logo';
  img.src = 'assets/img/Capa 2.svg';
  img.style.width = '45px';
  
  brand.appendChild(img);
  return brand;
}


/**
 * Checks and updates mobile layout
 */
function checkMobileLayout() {
  const mobile = isMobile();
  toggleHelpElements(mobile);
  toggleBrandLogo(mobile);
}


/**
 * Initializes mobile layout handler
 */
function initializeMobileLayout() {
  checkMobileLayout();
  window.addEventListener('resize', checkMobileLayout);
}


/**
 * Main initialization function
 */
async function initializeAddTask() {
  initializeDatePicker();
  setupPriorityButtons();
  await renderContacts();
  renderCategories();
  setupDropdownToggles();
  ensureChipsContainers();
  setupSubtasks();
  setupCreateButton();
  initializeMobileLayout();
}


/**
 * Closes assignees dropdown on outside click
 */
function closeAssigneesOnOutsideClick(event) {
  const dropdown = document.getElementById('assignees');
  if (!dropdown) return;
  if (dropdown.contains(event.target)) return;
  const menu = dropdown.querySelector('.dropdown-menu');
  if (menu) {
    menu.style.display = 'none';
    dropdown.classList.remove('open', 'active', 'show', 'expanded');
  }
}


/**
 * Initializes outside click for assignees
 */
function initAssigneesOutsideClick() {
  document.addEventListener('click', closeAssigneesOnOutsideClick);
}


initAssigneesOutsideClick();