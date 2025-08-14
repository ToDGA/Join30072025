'use strict';

// ---- Дані ----
const contacts = [
  { initials: "SM", name: "Sofia Müller (You)", color: "#00BEE8" },
  { initials: "AM", name: "Anton Mayer",        color: "#FF7A00" },
  { initials: "AS", name: "Anja Schulz",        color: "#9E00FF" },
  { initials: "BZ", name: "Benedikt Ziegler",   color: "#0038FF" },
  { initials: "DE", name: "David Eisenberg",    color: "#FF00FF" },
];
const categories = [
  { name: "Technical Task", color: "#6c8cff" },
  { name: "User Story",     color: "#8fd58a" },
];

// Вибрані значення
const selected = {
  contacts: new Set(),      // індекси
  category: null            // індекс або null
};

document.addEventListener('DOMContentLoaded', () => {
  if (window.flatpickr) flatpickr('#due-date', { dateFormat: 'd/m/Y' });

  // Пріоритет
  document.querySelectorAll('.priority').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.priority').forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });

  // Рендер меню
  renderContacts();
  renderCategories();

  // Підвішуємо прості дропдауни (тільки по тригеру)
  setupDropdownToggles();

  // Ініціалізація чипів-плейсхолдерів
  ensureChipsContainers();

  // Сабтаски (іконки)
  setupSubtasks();
});

// ---------- Рендер Assigned to ----------
function renderContacts() {
  const menu = document.querySelector('.dropdown.assigned-to .dropdown-menu');
  if (!menu) return;

  menu.innerHTML = '';
  contacts.forEach((c, idx) => {
    const row = document.createElement('label');
    row.className = 'contact-option';

    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.style.backgroundColor = c.color;
    avatar.textContent = c.initials;

    const name = document.createElement('span');
    name.className = 'name';
    name.textContent = c.name;

    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.addEventListener('change', () => {
      if (cb.checked) selected.contacts.add(idx);
      else selected.contacts.delete(idx);
      updateAssignedChips();
      // не закриваємо меню
    });

    row.appendChild(avatar);
    row.appendChild(name);
    row.appendChild(cb);
    menu.appendChild(row);
  });
}

// ---------- Рендер Category ----------
function renderCategories() {
  const menu = document.querySelector('.dropdown.category-select .dropdown-menu');
  if (!menu) return;

  menu.innerHTML = '';
  categories.forEach((cat, idx) => {
    const row = document.createElement('label');
    row.className = 'category-option';

    const dot = document.createElement('div');
    dot.className = 'dot';
    dot.style.backgroundColor = cat.color;

    const name = document.createElement('span');
    name.className = 'name';
    name.textContent = cat.name;

    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.addEventListener('change', () => {
      // одиночний вибір: знімаємо інші
      if (cb.checked) {
        selected.category = idx;
        menu.querySelectorAll('input[type="checkbox"]').forEach((other) => {
          if (other !== cb) other.checked = false;
        });
      } else {
        selected.category = null;
      }
      updateCategoryChip();
      // не закриваємо меню
    });

    row.appendChild(dot);
    row.appendChild(name);
    row.appendChild(cb);
    menu.appendChild(row);
  });
}

// ---------- Тригер відкриття/закриття (лише по кліку на .dropdown-toggle) ----------
function setupDropdownToggles() {
  document.querySelectorAll('.dropdown.full-expandable').forEach((dd) => {
    const toggle = dd.querySelector('.dropdown-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      dd.classList.toggle('open'); // відкриваємо / закриваємо тільки тут
    });
  });

  // Нічого НЕ закриваємо по кліку поза / Esc — просто не додаємо таких слухачів
}

// ---------- Чипи (відображення вибраного) ----------
function ensureChipsContainers() {
  const assignedDD = document.querySelector('.dropdown.assigned-to');
  const categoryDD = document.querySelector('.dropdown.category-select');

  if (assignedDD && !document.querySelector('.assigned-chips')) {
    const wrap = document.createElement('div');
    wrap.className = 'chips assigned-chips';
    assignedDD.insertAdjacentElement('afterend', wrap);
  }

  if (categoryDD && !document.querySelector('.category-chips')) {
    const wrap = document.createElement('div');
    wrap.className = 'chips category-chips';
    categoryDD.insertAdjacentElement('afterend', wrap);
  }
}

function updateAssignedChips() {
  const box = document.querySelector('.assigned-chips');
  if (!box) return;
  box.innerHTML = '';
  // показуємо кружечки з ініціалами
  contacts.forEach((c, idx) => {
    if (!selected.contacts.has(idx)) return;
    const chip = document.createElement('div');
    chip.className = 'avatar-chip';
    chip.style.backgroundColor = c.color;
    chip.textContent = c.initials;
    box.appendChild(chip);
  });
}

function updateCategoryChip() {
  const box = document.querySelector('.category-chips');
  if (!box) return;
  box.innerHTML = '';
  if (selected.category === null) return;

  const cat = categories[selected.category];
  const chip = document.createElement('div');
  chip.className = 'category-chip';

  const dot = document.createElement('span');
  dot.className = 'dot';
  dot.style.backgroundColor = cat.color;

  const label = document.createElement('span');
  label.textContent = cat.name;

  chip.appendChild(dot);
  chip.appendChild(label);
  box.appendChild(chip);
}

// ---------- Subtasks ----------
function setupSubtasks() {
  const input = document.getElementById('subtask-input');
  const plus = document.getElementById('subtask-add-icon');
  const cancel = document.getElementById('subtask-cancel-icon');
  const confirm = document.getElementById('subtask-confirm-icon');
  if (!input || !plus || !cancel || !confirm) return;

  input.addEventListener('input', () => {
    const hasText = input.value.trim() !== '';
    plus.style.display = hasText ? 'none' : 'inline';
    cancel.style.display = hasText ? 'inline' : 'none';
    confirm.style.display = hasText ? 'inline' : 'none';
  });

  cancel.addEventListener('click', () => {
    input.value = '';
    plus.style.display = 'inline';
    cancel.style.display = 'none';
    confirm.style.display = 'none';
  });

  confirm.addEventListener('click', () => {
    const value = input.value.trim();
    if (!value) return;
    console.log('Subtask added:', value);
    input.value = '';
    plus.style.display = 'inline';
    cancel.style.display = 'none';
    confirm.style.display = 'none';
  });
}
