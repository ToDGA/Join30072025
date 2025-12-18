const BASE_URL =
    "https://join-1314-default-rtdb.europe-west1.firebasedatabase.app/";
let currentData = [];
let selectedContactKey = null;

// Available color classes from color.css
const colorClasses = [
    'color-orange', 'color-pink', 'color-purple', 'color-violet',
    'color-cyan', 'color-turquoise', 'color-coral', 'color-peach',
    'color-light-pink', 'color-yellow', 'color-blue', 'color-lime-green',
    'color-light-yellow', 'color-red', 'color-goldenrod'
];

/**
 * Gets a random color class
 */
function getRandomColorClass() {
    const randomIndex = Math.floor(Math.random() * colorClasses.length);
    return colorClasses[randomIndex];
}

/**
 * Loads and displays the complete contact list
 */
async function loadContactList() {
    const contacts = await fetchContactsFromDatabase();
    const validContacts = filterValidContacts(contacts);
    const sortedContacts = sortContactsAlphabetically(validContacts);
    const groupedByLetter = groupContactsByFirstLetter(sortedContacts);
    displayContactsGroupedByLetter(groupedByLetter);
}

/**
 * Fetches all contacts from Firebase
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
 * Filters out invalid contacts
 */
function filterValidContacts(contacts) {
    return contacts.filter(contact => contact && contact.name && contact.name.trim() !== "");
}

/**
 * Sorts contacts alphabetically
 */
function sortContactsAlphabetically(contacts) {
    return contacts.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Groups contacts by first letter
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
 * Extracts first letter from name
 */
function getFirstLetterFromName(name) {
    return name.charAt(0).toUpperCase();
}

/**
 * Displays contacts grouped by letter
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
 * Adds letter header to DOM
 */
function addLetterHeaderToDOM(container, letter) {
    container.innerHTML += getFirstLetter(letter);
}

/**
 * Adds contacts for letter to DOM
 */
function addContactsForLetterToDOM(container, contacts) {
    contacts.forEach(contact => {
        container.innerHTML += getContact(contact);
    });
}

/**
 * Displays detailed contact information
 */
function showContactDetails(name, email, phone, firebaseKey, randomColor) {
    selectedContactKey = firebaseKey;
    showContactDetailsSection();
    updateContactDisplayName(name);
    updateContactInitials(name, randomColor);
    updateContactEmail(email);
    updateContactPhone(phone);
}

/**
 * Shows contact details section
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
 * Updates display name
 */
function updateContactDisplayName(name) {
    const nameElement = document.getElementById('contact-display-name');
    if (nameElement) {
        nameElement.textContent = name;
    }
}

/**
 * Updates contact initials
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
 * Updates email link
 */
function updateContactEmail(email) {
    const emailLink = document.getElementById('contact-email-link');
    if (emailLink) {
        emailLink.textContent = email;
        emailLink.href = `mailto:${email}`;
    }
}

/**
 * Updates phone link
 */
function updateContactPhone(phone) {
    const phoneLink = document.getElementById('contact-phone-link');
    if (phoneLink) {
        phoneLink.textContent = phone;
        phoneLink.href = `tel:${phone}`;
    }
}

/**
 * Cleans up after contact deletion
 */
async function cleanupAfterDelete() {
    closeEditContactOverlay();
    hideContactDetailsSection();
    selectedContactKey = null;
    await loadContactList();
}

/**
 * Deletes selected contact
 */
async function deleteSelectedContact() {
    if (!selectedContactKey) {
        console.error("No contact selected for deletion.");
        return;
    }
    try {
        await deleteContactFromDatabase(selectedContactKey);
        await cleanupAfterDelete();
    } catch (error) {
        console.error("Error deleting contact:", error);
    }
}

/**
 * Deletes contact from database
 */
async function deleteContactFromDatabase(firebaseKey) {
    await fetch(BASE_URL + "contacts/" + firebaseKey + ".json", {
        method: "DELETE"
    });
}

/**
 * Hides contact details section
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
}

/**
 * Opens add contact overlay
 */
function openAddContactOverlay() {
    const contactOverlay = document.getElementById("contact-overlay");
    contactOverlay.innerHTML = addContactTemplate();
}

/**
 * Closes add contact overlay
 */
async function closeAddContactOverlay() {
    const contactOverlay = document.getElementById("contact-overlay");
    contactOverlay.innerHTML = "";
    await loadContactList();
}

/**
 * Posts data to Firebase
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
        console.error(`POST request failed: ${response.status} ${response.statusText}`);
    }
}

/**
 * Fetches data from Firebase
 */
async function getData(path = "") {
    let response = await fetch(BASE_URL + path + ".json");
    if (!response.ok) {
        console.error(`GET request failed: ${response.status} ${response.statusText}`);
    }
    let responseData = await response.json();
    return responseData;
}

/**
 * Validates add contact input
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
 * Builds contact from form
 */
function buildContactFromForm() {
    const addName = document.getElementById("add-name");
    const addEmail = document.getElementById("add-email");
    const addPhone = document.getElementById("add-phone");
    return {
        name: addName.value,
        email: addEmail.value,
        phone: addPhone.value
    };
}

/**
 * Posts new contact
 */
async function postNewContact() {
    if (!validationAddContactInput()) {
        console.error("Validation failed.");
        return;
    }
    const newContact = buildContactFromForm();
    try {
        await postData("contacts", newContact);
        showSuccesfullyContactCreated();
        closeAddContactOverlay();
    } catch (error) {
        console.error("Error posting new contact:", error);
    }
}

/**
 * Validates name input
 */
function validateNameInput(inputElement) {
    const error = validateName(inputElement.value);
    const validationElement = document.getElementById("add-name-validation");
    setValidationMessage(validationElement, error);
}

/**
 * Validates email input
 */
function validateEmailInput(inputElement) {
    const error = validateEmail(inputElement.value);
    const validationElement = document.getElementById("add-email-validation");
    setValidationMessage(validationElement, error);
}