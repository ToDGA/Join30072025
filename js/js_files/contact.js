const BASE_URL = "https://join-f5b75-default-rtdb.europe-west1.firebasedatabase.app/";
let currentData = [];
let selectedContactKey = null;

// Available color classes from color.css
const colorClasses = [
    'color-orange',
    'color-pink',
    'color-purple',
    'color-violet',
    'color-cyan',
    'color-turquoise',
    'color-coral',
    'color-peach',
    'color-light-pink',
    'color-yellow',
    'color-blue',
    'color-lime-green',
    'color-light-yellow',
    'color-red',
    'color-goldenrod'
];

/**
 * Gets a random color class from the available color classes
 * @returns {string} A random color class name
 */
function getRandomColorClass() {
    const randomIndex = Math.floor(Math.random() * colorClasses.length);
    return colorClasses[randomIndex];
}

/**
 * Loads and displays the complete contact list with alphabetical grouping
 * @async
 * @returns {Promise<void>}
 */
async function loadContactList() {
    const contacts = await fetchContactsFromDatabase();
    const validContacts = filterValidContacts(contacts);
    const sortedContacts = sortContactsAlphabetically(validContacts);
    const groupedByLetter = groupContactsByFirstLetter(sortedContacts);
    displayContactsGroupedByLetter(groupedByLetter);

    // Initialize mobile resize handler
    initializeMobileHandler();
}

/**
 * Initializes mobile view handler for window resize
 */
function initializeMobileHandler() {
    // Only add listener once
    if (!window.mobileHandlerInitialized) {
        window.addEventListener('resize', handleWindowResize);
        window.mobileHandlerInitialized = true;
    }
}

/**
 * Handles window resize events for mobile view
 */
function handleWindowResize() {
    // If switching from mobile to desktop and details are shown
    if (window.innerWidth > 1250) {
        const mainContent = document.querySelector('.main-content');
        const backArrow = document.querySelector('.mobile-back-arrow');

        if (mainContent) {
            mainContent.classList.remove('mobile-showing-details');
        }
        if (backArrow) {
            backArrow.classList.add('hidden');
        }
        
        // Reset buttons when switching to desktop
        toggleMobileButtons(false);
    }
}

/**
 * Fetches all contacts from Firebase database and stores them in currentData
 * @async
 * @returns {Promise<Array>} Array of contact objects with Firebase keys
 */
async function fetchContactsFromDatabase() {
    const data = await getData("/contacts");
    currentData = [];
    if (data) {
        for (let firebaseKey in data) {
            const contact = data[firebaseKey];
            contact.firebaseKey = firebaseKey;
            currentData.push(contact);
        }
    }
    return currentData;
}

/**
 * Filters out invalid contacts (null, undefined, or empty names)
 * @param {Array} contacts - Array of contact objects to filter
 * @returns {Array} Array of valid contact objects
 */
function filterValidContacts(contacts) {
    return contacts.filter(contact => contact && contact.name && contact.name.trim() !== "");
}
/**
 * Sorts contacts alphabetically by name
 * @param {Array} contacts - Array of contact objects to sort
 * @returns {Array} Alphabetically sorted array of contacts
 */
function sortContactsAlphabetically(contacts) {
    return contacts.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Groups contacts by their first letter for alphabetical display
 * @param {Array} contacts - Array of contact objects to group
 * @returns {Object} Object with letters as keys and contact arrays as values
 */
function groupContactsByFirstLetter(contacts) {
    const groupedContacts = {};
    contacts.forEach(contact => {
        const firstLetter = getFirstLetterFromName(contact.name);
        if (!groupedContacts[firstLetter]) {
            groupedContacts[firstLetter] = [];
        }
        groupedContacts[firstLetter].push(contact);
    });
    return groupedContacts;
}

/**
 * Extracts and returns the first letter from a name in uppercase
 * @param {string} name - The name to extract the first letter from
 * @returns {string} First letter in uppercase
 */
function getFirstLetterFromName(name) {
    return name.charAt(0).toUpperCase();
}

/**
 * Displays contacts grouped by letter in the DOM
 * @param {Object} groupedContacts - Object with letters as keys and contact arrays as values
 */
function displayContactsGroupedByLetter(groupedContacts) {
    const contactList = document.getElementById("contact-list");
    contactList.innerHTML = "";
    const alphabeticalLetters = Object.keys(groupedContacts).sort();
    alphabeticalLetters.forEach(letter => {
        addLetterHeaderToDOM(contactList, letter);
        addContactsForLetterToDOM(contactList, groupedContacts[letter]);
    });
}

/**
 * Adds a letter header to the contact list container
 * @param {HTMLElement} container - The DOM container to add the header to
 * @param {string} letter - The letter to display as header
 */
function addLetterHeaderToDOM(container, letter) {
    container.innerHTML += getFirstLetter(letter);
}

/**
 * Adds contact cards for a specific letter to the DOM container
 * @param {HTMLElement} container - The DOM container to add contacts to
 * @param {Array} contacts - Array of contact objects to display
 */
function addContactsForLetterToDOM(container, contacts) {
    contacts.forEach(contact => {
        container.innerHTML += getContact(contact);
    });
}

/**
 * Displays detailed contact information in the contact details section
 * @param {string} name - Contact's full name
 * @param {string} email - Contact's email address
 * @param {string} phone - Contact's phone number
 * @param {string} firebaseKey - Firebase database key for the contact
 * @param {string} randomColor - CSS color class for the contact initials circle
 */
function showContactDetails(name, email, phone, firebaseKey, randomColor) {
    selectedContactKey = firebaseKey;
    showContactDetailsSection();
    updateContactDisplayName(name);
    updateContactInitials(name, randomColor);
    updateContactEmail(email);
    updateContactPhone(phone);

    // Mobile: Show details view and hide contact list
    if (window.innerWidth <= 1250) {
        showMobileContactDetails();
    }
}

/**
 * Shows contact details in mobile view
 */
function showMobileContactDetails() {
    const mainContent = document.querySelector('.main-content');
    const showContactContainer = document.querySelector('.show-contact-container');

    if (mainContent && showContactContainer) {
        mainContent.classList.add('mobile-showing-details');

        // Add back arrow to contact details
        addMobileBackArrow();
        
        // Show edit button and hide add button in mobile
        toggleMobileButtons(true);
    }
}

/**
 * Adds a back arrow to mobile contact details view
 */
function addMobileBackArrow() {
    const backArrow = document.querySelector('.mobile-back-arrow');
    if (backArrow) {
        backArrow.classList.remove('hidden');
    }
}

/**
 * Hides contact details in mobile view and shows contact list
 */
function hideMobileContactDetails() {
    const mainContent = document.querySelector('.main-content');
    const backArrow = document.querySelector('.mobile-back-arrow');

    if (mainContent) {
        mainContent.classList.remove('mobile-showing-details');
    }

    if (backArrow) {
        backArrow.classList.add('hidden');
    }
    
    // Hide edit button and show add button
    toggleMobileButtons(false);
}

/**
 * Toggles between add and edit buttons in mobile view
 * @param {boolean} showEdit - If true, shows edit button and hides add button
 */
function toggleMobileButtons(showEdit) {
    const addButton = document.querySelector('.add-contact-mobile');
    const editButton = document.getElementById('edit-contact-mobile');
    
    if (showEdit) {
        if (addButton) addButton.classList.add('hidden');
        if (editButton) editButton.classList.remove('hidden');
    } else {
        if (addButton) addButton.classList.remove('hidden');
        if (editButton) editButton.classList.add('hidden');
    }
}

/**
 * Opens the mobile edit/delete menu
 */
function openMobileEditMenu() {
    const menuHTML = getMobileEditDeleteMenu();
    document.body.insertAdjacentHTML('beforeend', menuHTML);
}

/**
 * Closes the mobile edit/delete menu
 */
function closeMobileEditMenu() {
    const overlay = document.getElementById('mobile-menu-overlay');
    if (overlay) {
        overlay.remove();
    }
}

/**
 * Shows the contact details section by removing hidden class from elements
 */
function showContactDetailsSection() {
    const contactDetailsSection = document.getElementById('contact-details-section');
    const contactInfoLabel = document.getElementById('contact-info-label');
    const contactEmailSection = document.getElementById('contact-email-section');
    const contactPhoneSection = document.getElementById('contact-phone-section');
    if (contactDetailsSection) contactDetailsSection.classList.remove('hidden');
    if (contactInfoLabel) contactInfoLabel.classList.remove('hidden');
    if (contactEmailSection) contactEmailSection.classList.remove('hidden');
    if (contactPhoneSection) contactPhoneSection.classList.remove('hidden');
}

/**
 * Updates the display name in the contact details section
 * @param {string} name - The contact's full name to display
 */
function updateContactDisplayName(name) {
    const nameElement = document.getElementById('contact-display-name');
    if (nameElement) {
        nameElement.textContent = name;
    }
}

/**
 * Updates the contact initials circle with the contact's initials
 * @param {string} name - The contact's full name to generate initials from
 * @param {string} randomColor - CSS color class to apply to the contact initials circle
 */
function updateContactInitials(name, randomColor) {
    const nameWords = name.split(' ');
    const initials = nameWords.map(word => word.charAt(0).toUpperCase()).join('').substring(0, 2);
    const circleElement = document.getElementById('contact-initials-circle');
    if (circleElement) {
        circleElement.textContent = initials;
        colorClasses.forEach(colorClass => {
            circleElement.classList.remove(colorClass);
        });
        circleElement.classList.add(randomColor);
    }
}

/**
 * Updates the email link in the contact details section
 * @param {string} email - The contact's email address
 */
function updateContactEmail(email) {
    const emailLink = document.getElementById('contact-email-link');
    if (emailLink) {
        emailLink.textContent = email;
        emailLink.href = `mailto:${email}`;
    }
}

/**
 * Updates the phone link in the contact details section
 * @param {string} phone - The contact's phone number
 */
function updateContactPhone(phone) {
    const phoneLink = document.getElementById('contact-phone-link');
    if (phoneLink) {
        phoneLink.textContent = phone;
        phoneLink.href = `tel:${phone}`;
    }
}

/**
 * Deletes the currently selected contact from the database and updates UI
 * @async
 * @returns {Promise<void>}
 */
async function deleteSelectedContact() {
    if (!selectedContactKey) {
        console.error("No contact selected for deletion.");
        return;
    }
    try {
        await deleteContactFromDatabase(selectedContactKey);
        closeEditContactOverlay();
        hideContactDetailsSection();
        selectedContactKey = null;
        await loadContactList();
    } catch (error) {
        console.error("Error deleting contact:", error);
    }
}

/**
 * Deletes a contact from Firebase database by its key
 * @async
 * @param {string} firebaseKey - The Firebase database key of the contact to delete
 * @returns {Promise<void>}
 */
async function deleteContactFromDatabase(firebaseKey) {
    await fetch(BASE_URL + "contacts/" + firebaseKey + ".json", {
        method: "DELETE"
    });
}

/**
 * Hides the contact details section by adding hidden class to elements
 */
function hideContactDetailsSection() {
    const contactDetailsSection = document.getElementById('contact-details-section');
    const contactInfoLabel = document.getElementById('contact-info-label');
    const contactEmailSection = document.getElementById('contact-email-section');
    const contactPhoneSection = document.getElementById('contact-phone-section');

    if (contactDetailsSection) contactDetailsSection.classList.add('hidden');
    if (contactInfoLabel) contactInfoLabel.classList.add('hidden');
    if (contactEmailSection) contactEmailSection.classList.add('hidden');
    if (contactPhoneSection) contactPhoneSection.classList.add('hidden');

    // Mobile: Also hide mobile details view
    if (window.innerWidth <= 1250) {
        hideMobileContactDetails();
    }
}

/**
 * Opens the add contact overlay with the contact form template
 */
function openAddContactOverlay() {
    const contactOverlay = document.getElementById("contact-overlay");
    contactOverlay.innerHTML = addContactTemplate();
}

/**
 * Closes the add contact overlay and reloads the contact list
 * @async
 * @returns {Promise<void>}
 */
async function closeAddContactOverlay() {
    const contactOverlay = document.getElementById("contact-overlay");
    contactOverlay.innerHTML = "";
    await loadContactList();
}

/**
 * Posts data to Firebase database at specified path
 * @async
 * @param {string} path - The database path to post to (default: "")
 * @param {Object} data - The data object to post
 * @returns {Promise<void>}
 */
async function postData(path = "", data) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        console.error(error);
    };
}

/**
 * Fetches data from Firebase database at specified path
 * @async
 * @param {string} path - The database path to fetch from (default: "")
 * @returns {Promise<Object>} The fetched data object
 */
async function getData(path = "") {
    let response = await fetch(BASE_URL + path + ".json");
    if (!response.ok) {
        console.error(error);
    }
    let responseData = await response.json();
    return responseData;
}

/**
 * Validates all input fields in the add contact form
 * @returns {boolean} True if all validations pass, false otherwise
 */
function validationAddContactInput() {
    const addName = document.getElementById("add-name");
    const addEmail = document.getElementById("add-email");
    const addPhone = document.getElementById("add-phone");
    const addNameValidation = document.getElementById("add-name-validation");
    const addEmailValidation = document.getElementById("add-email-validation");
    const addPhoneValidation = document.getElementById("add-phone-validation");
    const nameError = validateName(addName.value, true);
    const emailError = validateEmail(addEmail.value, true);
    const phoneError = validatePhone(addPhone.value, true);
    setValidationMessage(addNameValidation, nameError);
    setValidationMessage(addEmailValidation, emailError);
    setValidationMessage(addPhoneValidation, phoneError);
    return nameError === true && emailError === true && phoneError === true;
}

/**
 * Creates and posts a new contact to the database after validation
 * @async
 * @returns {Promise<void>}
 */
async function postNewContact() {
    if (!validationAddContactInput()) {
        console.error("Validation failed.");
        return;
    }
    const addName = document.getElementById("add-name");
    const addEmail = document.getElementById("add-email");
    const addPhone = document.getElementById("add-phone");
    const newContact = {
        name: addName.value,
        email: addEmail.value,
        phone: addPhone.value
    };
    try {
        await postData("contacts", newContact);
        await closeAddContactOverlay();
        getSuccessfullyContactCreated();
    } catch (error) {
        console.error("Error posting new contact:", error);
    }
}

/**
 * Validates name input field and displays validation message
 * @param {HTMLInputElement} inputElement - The name input element to validate
 */
function validateNameInput(inputElement) {
    const error = validateName(inputElement.value);
    const validationElement = document.getElementById("add-name-validation");
    setValidationMessage(validationElement, error);
}

/**
 * Validates email input field and displays validation message
 * @param {HTMLInputElement} inputElement - The email input element to validate
 */
function validateEmailInput(inputElement) {
    const error = validateEmail(inputElement.value);
    const validationElement = document.getElementById("add-email-validation");
    setValidationMessage(validationElement, error);
}

/**
 * Validates phone input field and displays validation message
 * @param {HTMLInputElement} inputElement - The phone input element to validate
 */
function validatePhoneInput(inputElement) {
    const error = validatePhone(inputElement.value);
    const validationElement = document.getElementById("add-phone-validation");
    setValidationMessage(validationElement, error);
}

/**
 * Validates a name string according to business rules
 * @param {string} value - The name value to validate
 * @param {boolean} showRequired - Whether to show required message for empty values
 * @returns {boolean|string} True if valid, error message string if invalid
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
 * Validates an email address using comprehensive regex pattern
 * @param {string} value - The email value to validate
 * @param {boolean} showRequired - Whether to show required message for empty values
 * @returns {boolean|string} True if valid, error message string if invalid
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
 * Validates a phone number using allowed characters and length rules
 * @param {string} value - The phone value to validate
 * @param {boolean} showRequired - Whether to show required message for empty values
 * @returns {boolean|string} True if valid, error message string if invalid
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
 * Sets validation message on a DOM element
 * @param {HTMLElement} element - The element to display the message on
 * @param {boolean|string} message - True for valid (clears message), string for error message
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
 * Opens the edit contact overlay for the currently selected contact
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
 * Finds a contact in currentData by its Firebase key
 * @param {string} firebaseKey - The Firebase key to search for
 * @returns {Object|undefined} The contact object or undefined if not found
 */
function findContactByKey(firebaseKey) {
    return currentData.find(contact => contact.firebaseKey === firebaseKey);
}

/**
 * Validates name input field in edit form and displays validation message
 * @param {HTMLInputElement} inputElement - The name input element to validate
 */
function validateEditNameInput(inputElement) {
    const error = validateName(inputElement.value);
    const validationElement = document.getElementById("edit-name-validation");
    setValidationMessage(validationElement, error);
}

/**
 * Validates email input field in edit form and displays validation message
 * @param {HTMLInputElement} inputElement - The email input element to validate
 */
function validateEditEmailInput(inputElement) {
    const error = validateEmail(inputElement.value);
    const validationElement = document.getElementById("edit-email-validation");
    setValidationMessage(validationElement, error);
}

/**
 * Validates phone input field in edit form and displays validation message
 * @param {HTMLInputElement} inputElement - The phone input element to validate
 */
function validateEditPhoneInput(inputElement) {
    const error = validatePhone(inputElement.value);
    const validationElement = document.getElementById("edit-phone-validation");
    setValidationMessage(validationElement, error);
}

/**
 * Validates all input fields in the edit contact form
 * @returns {boolean} True if all validations pass, false otherwise
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
 * Gets the current values from display and edit form elements
 * @returns {Object} Object containing old and new contact values
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
 * Saves the edited contact data to the database after validation
 * @async
 * @returns {Promise<void>}
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
        if (editName !== oldName || editEmail !== oldEmail || editPhone !== oldPhone) {
            const updatedContact = {
                name: editName,
                email: editEmail,
                phone: editPhone
            };
            await updateContactInDatabase(selectedContactKey, updatedContact);
            await loadContactList();
            const randomColor = getRandomColorClass();
            showContactDetails(updatedContact.name, updatedContact.email, updatedContact.phone, selectedContactKey, randomColor);
        }
        closeEditContactOverlay();
    } catch (error) {
        console.error("Error updating contact:", error);
    }
}

/**
 * Updates a contact in Firebase database by its key
 * @async
 * @param {string} firebaseKey - The Firebase database key of the contact to update
 * @param {Object} contactData - The updated contact data object
 * @returns {Promise<void>}
 */
async function updateContactInDatabase(firebaseKey, contactData) {
    let response = await fetch(BASE_URL + "contacts/" + firebaseKey + ".json", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(contactData)
    });

    if (!response.ok) {
        console.error(error);
    }
}

/**
 * Closes the edit contact overlay by clearing its content
 */
function closeEditContactOverlay() {
    let contactOverlay = document.getElementById("contact-overlay");
    contactOverlay.innerHTML = "";
}

/**
 * Displays a success notification message when a contact is successfully created
 * Uses insertAdjacentHTML('beforeend') to add the notification HTML at the end of the body element
 * The CSS animation handles the display duration and automatic removal after 3 seconds
 */
function getSuccessfullyContactCreated() {
    let body = document.querySelector("body");
    body.insertAdjacentHTML('beforeend', getMessageSuccessfullyAdded());
}