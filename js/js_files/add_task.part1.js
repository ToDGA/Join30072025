/**
 * Task categories configuration
 * @type {Array<{name: string, color: string}>}
 */
const categories = [
  { name: "Technical Task", color: "#6c8cff" },
  { name: "User Story", color: "#8fd58a" },
];


/**
 * Selected items state
 * @type {Object}
 */
const selected = {
  contacts: new Set(),
  category: null
};


/**
 * Initializes flatpickr date picker
 */
function initializeDatePicker() {
  if (window.flatpickr) {
    flatpickr('#due-date', { dateFormat: 'd/m/Y' });
  }
}


/**
 * Sets up priority button selection
 */
function setupPriorityButtons() {
  document.querySelectorAll('.priority').forEach((btn) => {
    btn.addEventListener('click', () => selectPriorityButton(btn));
  });
}


/**
 * Selects specific priority button
 * @param {HTMLElement} btn - Button to select
 */
function selectPriorityButton(btn) {
  document.querySelectorAll('.priority').forEach((b) => {
    b.classList.remove('selected');
  });
  btn.classList.add('selected');
}


/**
 * Renders contact options in dropdown
 */
async function renderContacts() {
  const menu = document.querySelector('.dropdown.assigned-to .dropdown-menu');
  if (!menu) return;

  menu.innerHTML = '';
  const contactsData = await getData('contacts');
  const contactsArr = contactsData ? Object.values(contactsData) : [];
  
  contactsArr.forEach((contact, idx) => {
    const row = createContactOption(contact, idx);
    menu.appendChild(row);
  });
}


/**
 * Creates single contact option element
 * @param {Object} contact - Contact data
 * @param {number} idx - Contact index
 * @returns {HTMLElement}
 */
function createContactOption(contact, idx) {
  const row = document.createElement('label');
  row.className = 'contact-option';

  const avatar = createContactAvatar(contact);
  const name = createContactName(contact);
  const checkbox = createContactCheckbox(idx);

  row.appendChild(avatar);
  row.appendChild(name);
  row.appendChild(checkbox);
  
  return row;
}


/**
 * Creates contact avatar element
 * @param {Object} contact - Contact data
 * @returns {HTMLElement}
 */
function createContactAvatar(contact) {
  const avatar = document.createElement('div');
  avatar.className = 'avatar';
  avatar.style.backgroundColor = contact.color;
  avatar.textContent = contact.initials;
  return avatar;
}


/**
 * Creates contact name element
 * @param {Object} contact - Contact data
 * @returns {HTMLElement}
 */
function createContactName(contact) {
  const name = document.createElement('span');
  name.className = 'name';
  name.textContent = contact.name;
  return name;
}


/**
 * Creates contact checkbox
 * @param {number} idx - Contact index
 * @returns {HTMLInputElement}
 */
function createContactCheckbox(idx) {
  const cb = document.createElement('input');
  cb.type = 'checkbox';
  cb.addEventListener('change', () => handleContactChange(cb, idx));
  return cb;
}


/**
 * Handles contact checkbox change
 * @param {HTMLInputElement} cb - Checkbox element
 * @param {number} idx - Contact index
 */
function handleContactChange(cb, idx) {
  if (cb.checked) {
    selected.contacts.add(idx);
  } else {
    selected.contacts.delete(idx);
  }
  updateAssignedChips();
}


/**
 * Renders category options in dropdown
 */
function renderCategories() {
  const menu = document.querySelector('.dropdown.category-select .dropdown-menu');
  if (!menu) return;

  menu.innerHTML = '';
  categories.forEach((cat, idx) => {
    const row = createCategoryOption(cat, idx, menu);
    menu.appendChild(row);
  });
}


/**
 * Creates single category option element
 * @param {Object} cat - Category data
 * @param {number} idx - Category index
 * @param {HTMLElement} menu - Parent menu element
 * @returns {HTMLElement}
 */
function createCategoryOption(cat, idx, menu) {
  const row = document.createElement('label');
  row.className = 'category-option';

  const dot = createCategoryDot(cat);
  const name = createCategoryName(cat);
  const checkbox = createCategoryCheckbox(idx, menu);

  row.appendChild(dot);
  row.appendChild(name);
  row.appendChild(checkbox);
  
  return row;
}


/**
 * Creates category color dot
 * @param {Object} cat - Category data
 * @returns {HTMLElement}
 */
function createCategoryDot(cat) {
  const dot = document.createElement('div');
  dot.className = 'dot';
  dot.style.backgroundColor = cat.color;
  return dot;
}


/**
 * Creates category name element
 * @param {Object} cat - Category data
 * @returns {HTMLElement}
 */
function createCategoryName(cat) {
  const name = document.createElement('span');
  name.className = 'name';
  name.textContent = cat.name;
  return name;
}


/**
 * Creates category checkbox
 * @param {number} idx - Category index
 * @param {HTMLElement} menu - Parent menu element
 * @returns {HTMLInputElement}
 */
function createCategoryCheckbox(idx, menu) {
  const cb = document.createElement('input');
  cb.type = 'checkbox';
  cb.addEventListener('change', () => handleCategoryChange(cb, idx, menu));
  return cb;
}


/**
 * Handles category checkbox change
 * @param {HTMLInputElement} cb - Checkbox element
 * @param {number} idx - Category index
 * @param {HTMLElement} menu - Parent menu element
 */
function handleCategoryChange(cb, idx, menu) {
  if (cb.checked) {
    selected.category = idx;
    deselectOtherCategories(cb, menu);
  } else {
    selected.category = null;
  }
  updateCategoryChip();
}


/**
 * Deselects other category checkboxes
 * @param {HTMLInputElement} currentCb - Current checkbox
 * @param {HTMLElement} menu - Parent menu element
 */
function deselectOtherCategories(currentCb, menu) {
  menu.querySelectorAll('input[type="checkbox"]').forEach((other) => {
    if (other !== currentCb) other.checked = false;
  });
}


/**
 * Sets up dropdown toggle listeners
 */
function setupDropdownToggles() {
  document.querySelectorAll('.dropdown.full-expandable').forEach((dd) => {
    const toggle = dd.querySelector('.dropdown-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', (e) => handleDropdownToggle(e, dd));
  });
}


/**
 * Handles dropdown toggle click
 * @param {Event} e - Click event
 * @param {HTMLElement} dd - Dropdown element
 */
function handleDropdownToggle(e, dd) {
  e.stopPropagation();
  dd.classList.toggle('open');
}


/**
 * Ensures chip containers exist
 */
function ensureChipsContainers() {
  ensureAssignedChipsContainer();
  ensureCategoryChipsContainer();
}


/**
 * Ensures assigned chips container exists
 */
function ensureAssignedChipsContainer() {
  const assignedDD = document.querySelector('.dropdown.assigned-to');
  if (assignedDD && !document.querySelector('.assigned-chips')) {
    const wrap = createChipsContainer('assigned-chips');
    assignedDD.insertAdjacentElement('afterend', wrap);
  }
}


/**
 * Ensures category chips container exists
 */
function ensureCategoryChipsContainer() {
  const categoryDD = document.querySelector('.dropdown.category-select');
  if (categoryDD && !document.querySelector('.category-chips')) {
    const wrap = createChipsContainer('category-chips');
    categoryDD.insertAdjacentElement('afterend', wrap);
  }
}


/**
 * Creates chips container element
 * @param {string} className - Container class name
 * @returns {HTMLElement}
 */
function createChipsContainer(className) {
  const wrap = document.createElement('div');
  wrap.className = `chips ${className}`;
  wrap.style.display = 'flex';
  return wrap;
}


/**
 * Updates assigned contact chips display
 */
async function updateAssignedChips() {
  const box = document.querySelector('.assigned-chips');
  if (!box) return;
  
  box.innerHTML = '';
  const contactsData = await getData('contacts');
  const contactsArr = contactsData ? Object.values(contactsData) : [];
  
  contactsArr.forEach((contact, idx) => {
    if (selected.contacts.has(idx)) {
      const chip = createAssignedChip(contact);
      box.appendChild(chip);
    }
  });
}


/**
 * Creates assigned contact chip
 * @param {Object} contact - Contact data
 * @returns {HTMLElement}
 */
function createAssignedChip(contact) {
  const chip = document.createElement('div');
  chip.className = 'avatar-chip';
  chip.style.backgroundColor = contact.color;
  chip.textContent = contact.initials;
  return chip;
}


/**
 * Updates category chip display
 */
function updateCategoryChip() {
  const box = document.querySelector('.category-chips');
  if (!box) return;
  
  box.innerHTML = '';
  if (selected.category === null) return;

  const cat = categories[selected.category];
  const chip = createCategoryChip(cat);
  box.appendChild(chip);
}


/**
 * Creates category chip element
 * @param {Object} cat - Category data
 * @returns {HTMLElement}
 */
function createCategoryChip(cat) {
  const chip = document.createElement('div');
  chip.className = 'category-chip';

  const dot = document.createElement('span');
  dot.className = 'dot';
  dot.style.backgroundColor = cat.color;

  const label = document.createElement('span');
  label.textContent = cat.name;

  chip.appendChild(dot);
  chip.appendChild(label);
  
  return chip;
}


/**
 * Closes dropdown on outside click
 */
function closeDropdownOnOutsideClick(event) {
  const openDropdown = document.querySelector('.dropdown.open');
  if (!openDropdown) return;
  if (openDropdown.contains(event.target)) return;
  openDropdown.classList.remove('open');
}


document.addEventListener('click', closeDropdownOnOutsideClick);