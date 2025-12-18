/**
 * Gets text content from element
 */
function getElementText(id) {
  return (document.getElementById(id)?.textContent || '').trim();
}

/**
 * Sets form field value
 */
function setFormFieldValue(name, value) {
  const el = document.querySelector(`[name="${name}"]`);
  if (el) el.value = value;
}

/**
 * Closes details modal
 */
function closeDetailsModal() {
  document.getElementById('td-modal')?.classList.remove('is-open');
}

/**
 * Opens add task modal
 */
function openAddTaskModal() {
  document.getElementById('at-modal')?.classList.add('is-open');
  document.getElementById('at-overlay')?.classList.add('is-open');
}

/**
 * Fills form with details data
 */
function fillFormWithDetails() {
  setFormFieldValue('title', getElementText('td-title'));
  setFormFieldValue('description', getElementText('td-desc'));
  setFormFieldValue('due', getElementText('td-due'));
  const cat = document.querySelector('#category .placeholder');
  if (cat) cat.textContent = getElementText('td-chip');
}

/**
 * Opens edit modal with prefilled data
 */
function openEditModal() {
  closeDetailsModal();
  openAddTaskModal();
  fillFormWithDetails();
}

/**
 * Gets add task modal root element
 */
function getModalRoot() {
  return document.getElementById('at-modal');
}

/**
 * Closes all open dropdowns
 */
function closeAllDropdowns() {
  const root = getModalRoot();
  if (!root) return;
  root.querySelectorAll('.dropdown.full-expandable.open')
    .forEach(x => x.classList.remove('open'));
}

/**
 * Opens specific dropdown
 */
function openDropdown(dropdown) {
  if (!dropdown) return;
  closeAllDropdowns();
  dropdown.classList.add('open');
}

/**
 * Toggles dropdown open/close state
 */
function toggleDropdownState(dropdown) {
  const isOpen = dropdown.classList.contains('open');
  if (isOpen) {
    closeAllDropdowns();
  } else {
    openDropdown(dropdown);
  }
}

/**
 * Handles dropdown toggle click
 */
function handleDropdownToggle(e) {
  const toggle = e.target.closest('.dropdown.full-expandable .dropdown-toggle');
  const root = getModalRoot();
  if (!toggle || !root || !root.contains(toggle)) return;
  e.stopPropagation();
  e.preventDefault();
  const dropdown = toggle.closest('.dropdown.full-expandable');
  toggleDropdownState(dropdown);
}

/**
 * Handles click outside dropdowns
 */
function handleClickOutside(e) {
  const root = getModalRoot();
  if (!root) return;
  if (!e.target.closest('.dropdown.full-expandable')) {
    closeAllDropdowns();
  }
}

/**
 * Handles keyboard events for dropdowns
 */
function handleDropdownKeys(e) {
  if (e.key === 'Escape') {
    closeAllDropdowns();
  }
  const toggle = e.target.closest('.dropdown.full-expandable .dropdown-toggle');
  if (toggle && (e.key === ' ' || e.key === 'Enter')) {
    e.preventDefault();
    toggle.click();
  }
}

/**
 * Adds hover effect to priority button
 */
function addHoverEffect(btn) {
  btn.addEventListener('mouseenter', () => {
    btn.style.transform = 'translateY(-2px)';
    btn.style.boxShadow = '0 6px 14px rgba(0,0,0,.16)';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
    btn.style.boxShadow = '';
  });
}

/**
 * Adds 3D hover effect to priority buttons
 */
function add3DHoverEffect() {
  document.querySelectorAll('.td-modal .priority__btn').forEach(btn => {
    addHoverEffect(btn);
  });
}

/**
 * Binds form submit listener
 */
function bindFormSubmit() {
  const form = document.getElementById('taskForm');
  if (form) form.addEventListener('submit', handleFormSubmit);
}

/**
 * Binds add task button clicks
 */
function bindAddTaskButtons() {
  document.addEventListener('click', (e) => {
    const isAddBtn = e.target.closest('.kb-add-btn, .kb-col-add, #at-open, [data-open-addtask]');
    if (isAddBtn) {
      setTimeout(() => {
        const dialog = document.querySelector('#at-modal .at-dialog') || document;
        initAddTaskModal(dialog);
      }, 0);
    }
  });
}

/**
 * Binds card detail clicks
 */
function bindCardDetailClicks() {
  document.addEventListener('click', e => {
    if (e.target.closest('.kb-card,[data-open-task-details]')) {
      setTimeout(setChipColor, 0);
    }
  });
}

/**
 * Binds edit button clicks
 */
function bindEditButton() {
  document.addEventListener('click', (e) => {
    if (e.target.closest('#td-edit')) {
      e.preventDefault();
      openEditModal();
    }
  });
}

/**
 * Binds all dropdown events
 */
function bindDropdownEvents() {
  document.addEventListener('click', handleDropdownToggle, true);
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('keydown', handleDropdownKeys);
}

/**
 * Initializes modal dialog
 */
function initializeModalDialog() {
  const dialog = document.querySelector('#at-modal .at-dialog');
  if (dialog) initAddTaskModal(dialog);
}

/**
 * Initializes due date flatpickr
 */
function initializeDueDatePicker() {
  if (window.flatpickr) {
    const dueDateInput = document.querySelector('#due-date');
    if (dueDateInput) {
      flatpickr(dueDateInput, { dateFormat: 'd/m/Y' });
    }
  }
}

/**
 * Binds all bridge events
 */
function bindAllBridgeEvents() {
  bindFormSubmit();
  bindAddTaskButtons();
  bindCardDetailClicks();
  bindEditButton();
  bindDropdownEvents();
}

/**
 * Initializes bridge components
 */
function initializeBridgeComponents() {
  initializeModalDialog();
  initializeDueDatePicker();
  add3DHoverEffect();
}

/**
 * Main bridge initialization
 */
function initBridge() {
  if (window.__bridgeInit) return;
  window.__bridgeInit = true;
  bindAllBridgeEvents();
  initializeBridgeComponents();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initBridge, { once: true });
} else {
  initBridge();
}