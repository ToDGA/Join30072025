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

const selected = {
  contacts: new Set(),
  category: null
};

document.addEventListener('DOMContentLoaded', () => {
  if (window.flatpickr) flatpickr('#due-date', { dateFormat: 'd/m/Y' });
  document.querySelectorAll('.priority').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.priority').forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });
  renderContacts();
  renderCategories();
  setupDropdownToggles();
  ensureChipsContainers();
  setupSubtasks();
});

document.addEventListener('DOMContentLoaded', function () {
  function checkMobile() {
    const mobile = window.innerWidth <= 945;
    const helpEls = document.querySelectorAll(
      '.header .help, .header .help-icon, .header [aria-label="Help"], .header button[title="Help"], .header .question-mark'
    );
    for (let i = 0; i < helpEls.length; i++) {
      helpEls[i].style.display = mobile ? 'none' : '';
    }

    const header = document.querySelector('.header');
    if (!header) return;
    let brand = header.querySelector('.brand');
    if (mobile) {
      if (!brand) {
        brand = document.createElement('div');
        brand.className = 'brand';
        const img = document.createElement('img');
        img.className = 'brand-logo';
        img.alt = 'Logo';
        img.src = 'assets/img/Capa 2.svg';
        img.style.width = '45px';
        brand.appendChild(img);
        header.insertBefore(brand, header.firstChild);
      }
    } else {
      if (brand) header.removeChild(brand);
    }
  }
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

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
    });

    row.appendChild(avatar);
    row.appendChild(name);
    row.appendChild(cb);
    menu.appendChild(row);
  });
}

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
      if (cb.checked) {
        selected.category = idx;
        menu.querySelectorAll('input[type="checkbox"]').forEach((other) => {
          if (other !== cb) other.checked = false;
        });
      } else {
        selected.category = null;
      }
      updateCategoryChip();
    });

    row.appendChild(dot);
    row.appendChild(name);
    row.appendChild(cb);
    menu.appendChild(row);
  });
}

function setupDropdownToggles() {
  document.querySelectorAll('.dropdown.full-expandable').forEach((dd) => {
    const toggle = dd.querySelector('.dropdown-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      dd.classList.toggle('open');
    });
  });
}

function ensureChipsContainers() {
  const assignedDD = document.querySelector('.dropdown.assigned-to');
  const categoryDD = document.querySelector('.dropdown.category-select');

  if (assignedDD && !document.querySelector('.assigned-chips')) {
    const wrap = document.createElement('div');
    wrap.className = 'chips assigned-chips';
    wrap.style.display = 'flex';
    assignedDD.insertAdjacentElement('afterend', wrap);
  }

  if (categoryDD && !document.querySelector('.category-chips')) {
    const wrap = document.createElement('div');
    wrap.className = 'chips category-chips';
    wrap.style.display = 'flex';
    categoryDD.insertAdjacentElement('afterend', wrap);
  }
}

function updateAssignedChips() {
  const box = document.querySelector('.assigned-chips');
  if (!box) return;
  box.innerHTML = '';
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
