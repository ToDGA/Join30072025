/**
 * Gets form element
 */
function beGetForm() {
  return document.querySelector("#at-modal form") ||
    document.querySelector("#taskForm");
}

/**
 * Shows overlay element
 */
function beShowOverlayElement() {
  const showFn = window.showOverlay || (() => {});
  showFn();
}

/**
 * Opens add task popup via global function
 */
function beTryOpenAddTaskPopup() {
  if (window.openAddTaskPopup) {
    window.openAddTaskPopup();
    return true;
  }
  return false;
}

/**
 * Opens details modal
 */
function beOpenDetailsModal() {
  const modal = document.getElementById("td-modal");
  if (!modal) return false;
  beShowOverlayElement();
  modal.classList.add("is-open");
  return true;
}

/**
 * Opens edit modal
 */
function beOpenEditModal() {
  if (beTryOpenAddTaskPopup()) return true;
  return beOpenDetailsModal();
}

/**
 * Sets form value and dispatches events
 */
function beSetFormVal(form, name, value) {
  const el = form.querySelector(`[name="${name}"]`);
  if (!el) return;
  el.value = value;
  el.dispatchEvent(new Event("input", {bubbles: true}));
  el.dispatchEvent(new Event("change", {bubbles: true}));
}

/**
 * Finds contact by name
 */
function beFindContactByName(fullName) {
  return contacts.find(c =>
    c.name === fullName || fullName.startsWith(c.name.split(' (')[0]));
}

/**
 * Converts name to initials
 */
function nameToInitials(fullName) {
  const contact = beFindContactByName(fullName);
  return contact ? contact.initials : null;
}

/**
 * Finds contact by initials
 */
function beFindContactByInitials(initials) {
  return contacts.find(c => c.initials === initials);
}

/**
 * Converts initials to name
 */
function initialsToName(initials) {
  const contact = beFindContactByInitials(initials);
  return contact ? contact.name : initials;
}

/**
 * Converts date format
 */
function beConvertDateFormat(dateStr) {
  const converter = window.mmddyyyyToISO || ((s) => s);
  return converter(dateStr || "");
}

/**
 * Sets category field value
 */
function beSetCategoryField(form, type) {
  const catSel = form.querySelector('[name="category"]');
  if (catSel) {
    catSel.value = (type === 'technical') ? 'Technical Task' : 'User Story';
  }
}

/**
 * Selects assignees in form
 */
function beSelectAssignees(form, initials) {
  const sel = form.querySelector('[name="assignees"]');
  if (!sel) return;
  Array.from(sel.options).forEach(option => {
    const init = nameToInitials(option.textContent.trim());
    option.selected = init ? initials.includes(init) : false;
  });
}

/**
 * Sets form fields with data
 */
function beSetFormFields(form, data) {
  beSetFormVal(form, "title", data.title);
  beSetFormVal(form, "description", data.desc);
  beSetFormVal(form, "due", beConvertDateFormat(data.dueDate));
  beSetFormVal(form, "priority", data.priority || "medium");
  beSetFormVal(form, "type", data.type || "story");
}

/**
 * Preloads form with card data
 */
function bePreloadForm(card) {
  const form = beGetForm();
  if (!form) return;
  const data = collectCardData(card);
  beSetFormFields(form, data);
  beSetCategoryField(form, data.type);
  beSelectAssignees(form, data.assignees || []);
  form.dataset.editingId = card.dataset.id || "";
}

/**
 * Sets text in element
 */
function beSetText(root, selector, text) {
  const el = root.querySelector(selector);
  if (el) el.textContent = text;
}

/**
 * Removes priority classes
 */
function beRemovePriorityClasses(el) {
  el.classList.remove(
    "kb-prio--low", "kb-prio--medium", "kb-prio--high",
    "kb-priority--low", "kb-priority--medium", "kb-priority--high"
  );
}

/**
 * Adds priority class
 */
function beAddPriorityClass(el, priority) {
  const isKbPriority = el.classList.contains("kb-priority");
  const className = isKbPriority ?
    `kb-priority--${priority}` : `kb-prio--${priority}`;
  el.classList.add(className);
}

/**
 * Sets priority class
 */
function beSetPrio(card, priority) {
  const el = card.querySelector(".kb-prio, .kb-priority");
  if (!el) return;
  beRemovePriorityClasses(el);
  beAddPriorityClass(el, priority);
}

/**
 * Updates chip type class
 */
function beUpdateChipTypeClass(chip, type) {
  chip.classList.toggle("kb-chip--technical", type === "technical");
  chip.classList.toggle("kb-chip--story", type !== "technical");
}

/**
 * Sets chip text
 */
function beSetChipText(chip, type) {
  chip.textContent = type === "technical" ?
    "Technical Task" : "User Story";
}

/**
 * Sets task type class
 */
function beSetType(card, type) {
  const chip = card.querySelector(".kb-chip");
  if (!chip) return;
  beUpdateChipTypeClass(chip, type);
  beSetChipText(chip, type);
}

/**
 * Converts ISO date to display format
 */
function beConvertISOToDisplay(isoDate) {
  const converter = window.isoToMMDDYYYY || ((s) => s);
  return converter(isoDate);
}

/**
 * Updates card due date
 */
function beUpdateCardDueDate(card, dueISO) {
  if (dueISO) {
    const displayDate = beConvertISOToDisplay(dueISO);
    card.dataset.due = displayDate;
  }
}

/**
 * Gets selected assignees from form
 */
function beGetSelectedAssignees(form) {
  const sel = form.querySelector('[name="assignees"]');
  if (!sel) return [];
  return Array.from(sel.selectedOptions)
    .map(o => nameToInitials(o.textContent.trim()))
    .filter(Boolean);
}

/**
 * Updates avatars display
 */
function beUpdateAvatarsDisplay(card, initials) {
  const av = card.querySelector(".kb-avatars");
  if (!av) return;
  av.setAttribute("data-assignees", initials.join(","));
  if (typeof renderAvatars === 'function') {
    renderAvatars();
  }
}

/**
 * Dispatches task updated event
 */
function beDispatchTaskUpdated(id) {
  document.dispatchEvent(new CustomEvent("task:updated", {
    detail: {id: id || ""}
  }));
}

/**
 * Updates card text fields
 */
function beUpdateCardTexts(card, fd) {
  beSetText(card, ".kb-card-title", (fd.get("title") || "").toString());
  beSetText(card, ".kb-card-desc", (fd.get("description") || "").toString());
}

/**
 * Applies form data to card
 */
function beApplyForm(card, form) {
  const fd = new FormData(form);
  beUpdateCardTexts(card, fd);
  beUpdateCardDueDate(card, (fd.get("due") || "").toString());
  const initials = beGetSelectedAssignees(form);
  beUpdateAvatarsDisplay(card, initials);
  beSetPrio(card, (fd.get("priority") || "medium").toString());
  beSetType(card, (fd.get("type") || "story").toString());
  beDispatchTaskUpdated(card.dataset.id || "");
}

/**
 * Closes add task modal
 */
function beCloseAddTaskModal() {
  document.getElementById("at-modal")?.classList.remove("is-open");
  const hideOverlay = window.hideOverlay || (() => {});
  hideOverlay();
}

/**
 * Handles save button click
 */
function beHandleSaveClick(e, form) {
  if (!form.dataset.editingId) return;
  e.preventDefault();
  const card = document.querySelector(
    `.kb-card[data-id="${form.dataset.editingId}"]`
  );
  if (card) beApplyForm(card, form);
  delete form.dataset.editingId;
  beCloseAddTaskModal();
}

/**
 * Intercepts save button
 */
function beInterceptSave(form) {
  const btn = document.getElementById("at-create");
  if (!btn || btn.dataset.beSave) return;
  btn.dataset.beSave = "1";
  btn.addEventListener("click", e => beHandleSaveClick(e, form), true);
}