const on = (el, evt, fn) => el && el.addEventListener(evt, fn);

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, m => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
  }[m]));
}

function createSubtaskItem(text) {
  const li = document.createElement('li');
  const cb = document.createElement('input');
  cb.type = 'checkbox';
  const span = document.createElement('span');
  span.textContent = text;
  li.append(cb, span);
  return li;
}

function createPrioritySelector(btns, group, root) {
  return (btn) => {
    btns.forEach(b => b.classList.remove('selected','priority__btn--active'));
    btn.classList.add('selected','priority__btn--active');
    const hidden = group.querySelector('input[name="priority"]');
    if (hidden) hidden.value = btn.dataset.value || 'medium';
    const out = root.querySelector('#td-prio-text');
    if (out) out.textContent = btn.dataset.value || '—';
  };
}

function ensureDefaultPriority(btns, select) {
  if (!btns.some(b => b.classList.contains('selected') ||
      b.classList.contains('priority__btn--active'))) {
    const mediumBtn = btns.find(b => b.dataset.value === 'medium') || btns[1];
    if (mediumBtn) select(mediumBtn);
  }
}

function initPriority(root) {
  const group = root.querySelector('[data-priority]');
  if (!group) return;
  const btns = Array.from(group.querySelectorAll('.priority__btn'));
  const select = createPrioritySelector(btns, group, root);
  btns.forEach(b => on(b, 'click', () => select(b)));
  ensureDefaultPriority(btns, select);
}

function initSubtasks(root) {
  const box = root.querySelector('[data-subtasks]');
  if (!box) return;
  const input = box.querySelector('input.input, input[type="text"]');
  const list = box.querySelector('.subtasks__list');
  if (!input || !list) return;
  on(input, 'keydown', (e) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const v = input.value.trim();
    if (!v) return;
    list.appendChild(createSubtaskItem(escapeHtml(v)));
    input.value = '';
  });
}

function initDate(root) {
  const input = root.querySelector('input[type="date"], #due-date');
  if (!input) return;
  if (window.flatpickr && !input.dataset.fp) {
    input.type = 'text';
    input.placeholder = 'dd/mm/yyyy';
    input.dataset.fp = '1';
    window.flatpickr(input, {dateFormat: 'd/m/Y'});
  }
}

function initPreviewBindings(root) {
  const t = root.querySelector('input[name="title"], #title');
  const d = root.querySelector('textarea[name="description"], #description');
  const due = root.querySelector('input[name="due"], #due-date');
  const outT = document.querySelector('#td-title');
  const outD = document.querySelector('#td-desc');
  const outDue = document.querySelector('#td-due');
  if (t && outT) on(t, 'input', () => (outT.textContent = t.value));
  if (d && outD) on(d, 'input', () => (outD.textContent = d.value));
  if (due && outDue) on(due, 'input', () => {
    const m = due.value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    outDue.textContent = m ? `${m[3]}/${m[2]}/${m[1]}` : (due.value || '—');
  });
}

function initAddTaskModal(root) {
  initPriority(root);
  initSubtasks(root);
  initDate(root);
  initPreviewBindings(root);
}

function extractFormData(f) {
  const q = (n) => f.querySelector(`[name="${n}"]`);
  return {
    title: q('title')?.value.trim() || '',
    description: q('description')?.value.trim() || '',
    due: q('due')?.value || '',
    category: q('category')?.value || '',
    priority: q('priority')?.value || 'medium'
  };
}

function validateFormData(data) {
  if (!data.title || !data.due || !data.category) {
    alert('Please fill in all required fields');
    return false;
  }
  return true;
}

function createTaskFromFormData(data) {
  const [Y, M, D] = data.due.split('-');
  return {
    id: Date.now(), title: data.title, description: data.description,
    dueDate: `${D}/${M}/${Y}`, priority: data.priority,
    category: {
      name: data.category,
      color: data.category==='Technical Task'?'#6c8cff':
             data.category==='User Story'?'#8fd58a':'#999'
    },
    assigned: [], status: 'todo'
  };
}

function saveTaskAndClose(task) {
  const arr = JSON.parse(localStorage.getItem('tasks') || '[]');
  arr.push(task);
  localStorage.setItem('tasks', JSON.stringify(arr));
  document.getElementById('at-close')?.click();
}

function handleFormSubmit(e) {
  e.preventDefault();
  const f = document.getElementById('taskForm');
  if (!f) return;
  const data = extractFormData(f);
  if (!validateFormData(data)) return;
  const task = createTaskFromFormData(data);
  saveTaskAndClose(task);
}

function setChipColor() {
  const chip = document.getElementById('td-chip');
  if (!chip) return;
  const t = chip.textContent.trim().toLowerCase();
  chip.classList.remove('td-chip--story', 'td-chip--technical');
  if (t.includes('user')) chip.classList.add('td-chip--story');
  if (t.includes('technical')) chip.classList.add('td-chip--technical');
}

function closeDetailsAndOpenAddTask() {
  document.getElementById('td-modal')?.classList.remove('is-open');
  document.getElementById('at-modal')?.classList.add('is-open');
  document.getElementById('at-overlay')?.classList.add('is-open');
}

function fillEditForm() {
  const take = (id) => (document.getElementById(id)?.textContent || '').trim();
  const fill = (n, v) => {
    const el = document.querySelector(`[name="${n}"]`);
    if (el) el.value = v;
  };
  fill('title', take('td-title'));
  fill('description', take('td-desc'));
  fill('due', take('td-due'));
}

function updateCategoryPlaceholder() {
  const take = (id) => (document.getElementById(id)?.textContent || '').trim();
  const cat = document.querySelector('#category .placeholder');
  if (cat) cat.textContent = take('td-chip');
}

function openEditModal() {
  closeDetailsAndOpenAddTask();
  fillEditForm();
  updateCategoryPlaceholder();
}

function ddr() { return document.getElementById('at-modal'); }

function ddClsAll() {
  const r = ddr();
  if (!r) return;
  r.querySelectorAll('.dropdown.full-expandable.open')
   .forEach(x => x.classList.remove('open'));
}

function ddOpen(drop) {
  if (!drop) return;
  ddClsAll();
  drop.classList.add('open');
}

function ddOnToggle(e) {
  const t = e.target.closest('.dropdown.full-expandable .dropdown-toggle');
  const r = ddr();
  if (!t || !r || !r.contains(t)) return;
  e.stopPropagation();
  e.preventDefault();
  const d = t.closest('.dropdown.full-expandable');
  d.classList.contains('open') ? ddClsAll() : ddOpen(d);
}

function ddOnClickOutside(e) {
  const r = ddr();
  if (!r) return;
  if (!e.target.closest('.dropdown.full-expandable')) ddClsAll();
}

function ddOnKeys(e) {
  if (e.key === 'Escape') ddClsAll();
  const t = e.target.closest('.dropdown.full-expandable .dropdown-toggle');
  if (t && (e.key === ' ' || e.key === 'Enter')) {
    e.preventDefault();
    t.click();
  }
}

function add3DHoverEffect() {
  document.querySelectorAll('.td-modal .priority__btn').forEach(b => {
    b.addEventListener('mouseenter', () => {
      b.style.transform = 'translateY(-2px)';
      b.style.boxShadow = '0 6px 14px rgba(0,0,0,.16)';
    });
    b.addEventListener('mouseleave', () => {
      b.style.transform = '';
      b.style.boxShadow = '';
    });
  });
}

function setupFormListener() {
  const f = document.getElementById('taskForm');
  if (f) f.addEventListener('submit', handleFormSubmit);
}

function setupAddTaskClicks() {
  document.addEventListener('click', (e) => {
    const open = e.target.closest('.kb-add-btn, .kb-col-add, #at-open, [data-open-addtask]');
    if (open) {
      setTimeout(() => {
        const dlg = document.querySelector('#at-modal .at-dialog') || document;
        initAddTaskModal(dlg);
      }, 0);
    }
  });
}

function setupCardClicks() {
  document.addEventListener('click', e => {
    if (e.target.closest('.kb-card,[data-open-task-details]')) {
      setTimeout(setChipColor, 0);
    }
  });
}

function setupEditClicks() {
  document.addEventListener('click', (e) => {
    if (e.target.closest('#td-edit')) {
      e.preventDefault();
      openEditModal();
    }
  });
}

function setupDropdownListeners() {
  document.addEventListener('click', ddOnToggle, true);
  document.addEventListener('click', ddOnClickOutside);
  document.addEventListener('keydown', ddOnKeys);
}

function setupModalDialog() {
  const dlg = document.querySelector('#at-modal .at-dialog');
  if (dlg) initAddTaskModal(dlg);
}

function setupFlatpickr() {
  if (window.flatpickr) {
    const dueDateInput = document.querySelector('#due-date');
    if (dueDateInput) flatpickr(dueDateInput, {dateFormat: 'd/m/Y'});
  }
}

function setupAllComponents() {
  setupModalDialog();
  setupFlatpickr();
  add3DHoverEffect();
}

function initBridge() {
  if (window.__bridgeInit) return;
  window.__bridgeInit = true;
  setupFormListener();
  setupAddTaskClicks();
  setupCardClicks();
  setupEditClicks();
  setupDropdownListeners();
  setupAllComponents();
}

if (document.readyState==="loading") {
  document.addEventListener("DOMContentLoaded", initBridge, {once:true});
} else {
  initBridge();
}