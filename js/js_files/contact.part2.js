/**
 * Contact Module Part 2 - FIXED
 * Uses putData from db.js
 */

/**
 * Validates phone input
 */
function validatePhoneInput(inputElement) {
  const error = validatePhone(inputElement.value);
  const validationElement = document.getElementById("add-phone-validation");
  setValidationMessage(validationElement, error);
}

/**
 * Validates a name string
 */
function validateName(value, showRequired = false) {
  const nameRegex = /^[a-zA-ZäöüßÄÖÜ.'\- ]{5,}$/;
  const trimmedValue = value.trim();
  if (trimmedValue === "") {
      return showRequired ? "Name is required." : true;
  }
  if (!nameRegex.test(trimmedValue)) {
      return "Name can only contain letters, spaces, apostrophes, and hyphens.";
  }
  return true;
}

/**
 * Validates an email address
 */
function validateEmail(value, showRequired = false) {
  const trimmedValue = value.trim();
  if (trimmedValue === "") {
      return showRequired ? "Email is required." : true;
  }
  const emailRegex = /^[a-zA-Z0-9]([a-zA-Z0-9._-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmedValue)) {
      return "Please enter a valid email address";
  }
  return true;
}

/**
 * Validates a phone number
 */
function validatePhone(value, showRequired = false) {
  const trimmedValue = value.trim();
  const phoneRegex = /^[0-9+\-() ]{5,20}$/;
  if (trimmedValue === "") {
      return showRequired ? "Phone is required." : true;
  }
  if (!phoneRegex.test(trimmedValue)) {
      return "Phone number can only contain numbers, +, -, spaces, and parentheses.";
  }
  if (trimmedValue.length < 5) {
      return "Phone number must be at least 5 characters long.";
  }
  return true;
}

/**
 * Sets validation message
 */
function setValidationMessage(element, message) {
  if (element) {
      if (message === true) {
          element.textContent = "";
      } else {
          element.textContent = message;
          if (message) {
              element.style.color = "var(--required-color)";
          }
      }
  }
}

/**
 * Opens edit contact overlay
 */
function openEditContactOverlay() {
  if (!selectedContactKey) {
      console.error("No contact selected for editing.");
      return;
  }
  const selectedContact = findContactByKey(selectedContactKey);
  if (!selectedContact) {
      console.error("Selected contact not found.");
      return;
  }
  const contactOverlay = document.getElementById("contact-overlay");
  contactOverlay.innerHTML = editContactTemplate(selectedContact);
}

/**
 * Finds contact by key
 */
function findContactByKey(firebaseKey) {
  return currentData.find(contact => contact.firebaseKey === firebaseKey);
}

/**
 * Validates edit name input
 */
function validateEditNameInput(inputElement) {
  const error = validateName(inputElement.value);
  const validationElement = document.getElementById("edit-name-validation");
  setValidationMessage(validationElement, error);
}

/**
 * Validates edit email input
 */
function validateEditEmailInput(inputElement) {
  const error = validateEmail(inputElement.value);
  const validationElement = document.getElementById("edit-email-validation");
  setValidationMessage(validationElement, error);
}

/**
 * Validates edit phone input
 */
function validateEditPhoneInput(inputElement) {
  const error = validatePhone(inputElement.value);
  const validationElement = document.getElementById("edit-phone-validation");
  setValidationMessage(validationElement, error);
}

/**
 * Validates edit contact input
 */
function validationEditContactInput() {
  const editName = document.getElementById("edit-name");
  const editEmail = document.getElementById("edit-email");
  const editPhone = document.getElementById("edit-phone");
  const editNameValidation = document.getElementById("edit-name-validation");
  const editEmailValidation = document.getElementById("edit-email-validation");
  const editPhoneValidation = document.getElementById("edit-phone-validation");
  const nameError = validateName(editName.value, true);
  const emailError = validateEmail(editEmail.value, true);
  const phoneError = validatePhone(editPhone.value, true);
  setValidationMessage(editNameValidation, nameError);
  setValidationMessage(editEmailValidation, emailError);
  setValidationMessage(editPhoneValidation, phoneError);
  return nameError === true && emailError === true && phoneError === true;
}

/**
 * Gets values from form
 */
function getValues() {
  const oldName = document.getElementById("contact-display-name").textContent;
  const oldEmail = document.getElementById("contact-email-link").textContent;
  const oldPhone = document.getElementById("contact-phone-link").textContent;
  const editName = document.getElementById("edit-name").value;
  const editEmail = document.getElementById("edit-email").value;
  const editPhone = document.getElementById("edit-phone").value;
  return { oldName, oldEmail, oldPhone, editName, editEmail, editPhone };
}

/**
 * Checks if contact has changes
 */
function hasChanges(oldName, oldEmail, oldPhone, editName, editEmail, editPhone) {
  return editName !== oldName || editEmail !== oldEmail || editPhone !== oldPhone;
}

/**
 * Updates contact in database and UI
 * FIXED: Uses putData from db.js
 */
async function updateContact(editName, editEmail, editPhone) {
  const updatedContact = {
      name: editName,
      email: editEmail,
      phone: editPhone
  };
  const success = await putData("/contacts/" + selectedContactKey, updatedContact);
  if (success) {
      await loadContactList();
      const randomColor = getRandomColorClass();
      showContactDetails(updatedContact.name, updatedContact.email, updatedContact.phone, selectedContactKey, randomColor);
  }
}

/**
 * Saves edited contact
 */
async function saveEditedContact() {
  if (!validationEditContactInput()) {
      console.error("Validation failed.");
      return;
  }
  if (!selectedContactKey) {
      console.error("No contact selected for editing.");
      return;
  }
  const { oldName, oldEmail, oldPhone, editName, editEmail, editPhone } = getValues();
  try {
      if (hasChanges(oldName, oldEmail, oldPhone, editName, editEmail, editPhone)) {
          await updateContact(editName, editEmail, editPhone);
      }
      closeEditContactOverlay();
  } catch (error) {
      console.error("Error updating contact:", error);
  }
}

/**
 * REMOVED: updateContactInDatabase - now uses putData from db.js
 */

/**
 * Closes edit contact overlay
 */
function closeEditContactOverlay() {
  let contactOverlay = document.getElementById("contact-overlay");
  contactOverlay.innerHTML = "";
}