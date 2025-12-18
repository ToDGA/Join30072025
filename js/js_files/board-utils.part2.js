/**
 * Checks if has high priority
 * @param {DOMTokenList} classes - Class list
 * @returns {boolean}
 */
function hasHighPriority(classes) {
  return classes.contains("kb-prio--high") ||
    classes.contains("kb-priority--high");
}


/**
 * Gets priority from card element
 * @param {HTMLElement} card - Card element
 * @returns {string}
 */
function getPriorityFromCard(card) {
  const el = card.querySelector(".kb-prio,.kb-priority");
  if (!el) return "medium";
  
  const classes = getPriorityClasses(el);
  
  if (hasLowPriority(classes)) return "low";
  if (hasHighPriority(classes)) return "high";
  
  return "medium";
}


/**
 * Gets card type from chip
 * @param {HTMLElement} chip - Chip element
 * @returns {string}
 */
function getCardType(chip) {
  return chip?.classList.contains("kb-chip--technical") ?
    "technical" : "story";
}


/**
 * Gets text content safely
 * @param {HTMLElement} element - Element
 * @returns {string}
 */
function getTextContent(element) {
  return (element?.textContent || "").trim();
}


/**
 * Parses subtasks from dataset
 * @param {string} subtasksData - Subtasks data
 * @returns {string[]}
 */
function parseSubtasks(subtasksData) {
  try {
    return JSON.parse(subtasksData);
  } catch {
    return subtasksData.split(",").map(s => s.trim()).filter(Boolean);
  }
}


/**
 * Gets subtasks from card
 * @param {HTMLElement} card - Card element
 * @returns {string[]}
 */
function getCardSubtasks(card) {
  if (!card.dataset.subtasks) return [];
  return parseSubtasks(card.dataset.subtasks);
}


/**
 * Collects all data from card
 * @param {HTMLElement} card - Card element
 * @returns {Object}
 */
function collectCardData(card) {
  const chip = card.querySelector(".kb-chip");
  const type = getCardType(chip);
  const title = getTextContent(card.querySelector(".kb-card-title"));
  const desc = getTextContent(card.querySelector(".kb-card-desc"));
  const priority = getPriorityFromCard(card);
  const assignees = getAssigneesList(card.querySelector(".kb-avatars"));
  
  return {
    type,
    title,
    desc,
    priority,
    assignees,
    dueDate: card.dataset.due || "",
    subtasks: getCardSubtasks(card),
    cardEl: card
  };
}


/**
 * Creates circle element
 * @param {string} initials - Contact initials
 * @returns {HTMLElement}
 */
function createCircleElement(initials) {
  const circle = document.createElement("span");
  circle.className = "td-person__circle td-person__circle--" + initials;
  circle.textContent = initials;
  return circle;
}


/**
 * Creates name element
 * @param {string} name - Contact name
 * @returns {HTMLElement}
 */
function createNameElement(name) {
  const nameEl = document.createElement("span");
  nameEl.className = "td-person__name";
  nameEl.textContent = name;
  return nameEl;
}


/**
 * Creates person circle element
 * @param {string} initials - Initials
 * @param {string} name - Full name
 * @returns {HTMLElement}
 */
function personCircle(initials, name) {
  const root = document.createElement("div");
  root.className = "td-person";
  
  const circle = createCircleElement(initials);
  const nameEl = createNameElement(name);
  
  root.append(circle, nameEl);
  return root;
}


/**
 * Gets overlay element
 * @returns {HTMLElement|null}
 */
function getOverlay() {
  return document.getElementById("at-overlay");
}


/**
 * Sets body overflow
 * @param {string} value - Overflow value
 */
function setBodyOverflow(value) {
  document.body.style.overflow = value;
}


/**
 * Shows overlay
 */
function showOverlay() {
  const overlay = getOverlay();
  if (!overlay) return;
  
  overlay.classList.add("is-open");
  setBodyOverflow("hidden");
}


/**
 * Hides overlay
 */
function hideOverlay() {
  const overlay = getOverlay();
  if (!overlay) return;
  
  overlay.classList.remove("is-open");
  setBodyOverflow("");
}


/**
 * Closes all open modals
 */
function closeAllOpenModals() {
  document.querySelectorAll(".td-modal.is-open,.at-modal.is-open")
    .forEach(modal => modal.classList.remove("is-open"));
  hideOverlay();
}


/**
 * Sets search icon source
 * @param {HTMLElement} icon - Icon element
 */
function setSearchIcon(icon) {
  icon.src = "./assets/img/board_input_search_icon.svg";
  icon.alt = "Search";
}


/**
 * Clears add button content
 * @param {HTMLElement} button - Button element
 */
function clearAddButton(button) {
  button.textContent = "";
}


/**
 * Initializes search icon
 */
function initializeSearchIcon() {
  const searchIcon = document.querySelector(".kb-search .kb-icon");
  if (searchIcon) {
    setSearchIcon(searchIcon);
  }
}


/**
 * Initializes add buttons
 */
function initializeAddButtons() {
  document.querySelectorAll(".kb-col-add").forEach(button => {
    clearAddButton(button);
  });
}


/**
 * Initializes static icons
 */
function initStaticIcons() {
  initializeSearchIcon();
  initializeAddButtons();
}