/**
 * Generates the HTML template for adding a new contact
 * @returns {string} HTML template string for the add contact overlay
 */
function addContactTemplate() {
    return `  
    <div class="overlay" onclick="closeAddContactOverlay()">
        <div class="add-contact-container d-flex-c" onclick="event.stopPropagation()">
        <!-- Add Container Left -->
        <div class="edit-add-contact-container d-flex-c-c-fs">
            <div class="add-contact-close-container-mobile">
            <img
                class="close-contact-img c-pointer"
                src="./assets/img/contact-close-white.svg"
                alt="Close"
                onclick="closeAddContactOverlay()"
            />
            </div>
            <img
            class="contact-logo"
            src="./assets/icons/Join_logo 2.svg"
            alt="Join Logo"
            />
            <span class="edit-headline">Add contact</span>
            <span class="add-contact-description"
            >Tasks are better with a team!</span
            >
            <div class="contact-progress-bar"></div>
        </div>

        <!-- Contact icon -->
        <div class="contact-circle-container d-flex-c">
            <div class="add-contact-person-container d-flex-c">
            <img
                class="add-contact-person-img"
                src="./assets/img/add-contact-person.svg"
                alt="Person"
            />
            </div>
        </div>

        <!-- Input Content -->
        <div class="input-add-contact-container">
            <!-- Close Button -->
            <div class="contact-close-container">
            <img
                class="close-contact-img c-pointer"
                src="./assets/img/contact-close.svg"
                alt="Close"
                onclick="closeAddContactOverlay()"
            />
            </div>

            <!-- Form for Adding Contact -->
            <div class="w100">
            <form action="">
                <div class="input-contact-container">
                <input id="add-name" type="text" placeholder="Name" oninput="validateNameInput(this)" required />
                <img
                    class="contact-input-icon"
                    src="./assets/img/contact-person.svg"
                    alt="Person"
                />
                </div>
                <div id="add-name-validation" class="error-message"></div>
                <div class="input-contact-container">
                <input id="add-email" type="email" placeholder="Email" oninput="validateEmailInput(this)" required />
                <img
                    class="contact-input-icon"
                    src="./assets/img/contact-mail.svg"
                    alt="Email"
                />
                </div>
                <div id="add-email-validation" class="error-message"></div>
                <div class="input-contact-container">
                <input id="add-phone" type="tel" placeholder="Phone" oninput="validatePhoneInput(this)" required />
                <img
                    class="contact-input-icon"
                    src="./assets/img/contact-call.svg"
                    alt="Phone"
                />
                </div>
                <div id="add-phone-validation" class="error-message"></div>
            </form>

            <!-- Button Container -->
            <div class="edit-contact-buttons">
                <button class="contact-delete add-contact-delete d-flex-c" onclick="closeAddContactOverlay()">
                Cancel
                <img
                    class="fill-hover"
                    src="./assets/img/contact-close.svg"
                    alt="Close"
                />
                </button>
                <button id="add-contact-save" onclick="postNewContact()" class="contact-save add-contact-save">
                Create contact
                <img
                    class="contact-save-icon"
                    src="./assets/img/add_task_check.svg"
                    alt="done"
                />
                </button>
            </div>
            </div>
        </div>
        </div>
    </div>
  `;
}

/**
 * Generates the HTML template for editing an existing contact
 * @param {Object} data - The contact data object containing name, email, and phone
 * @returns {string} HTML template string for the edit contact overlay
 */
function editContactTemplate(data) {
    const nameWords = data.name.split(' ');
    const initials = nameWords.map(word => word.charAt(0).toUpperCase()).join('').substring(0, 2);
    const randomColor = getRandomColorClass();

    return `
    <div class="overlay" onclick="closeEditContactOverlay()">
        <div class="add-contact-container d-flex-c" onclick="event.stopPropagation()">

            <!-- Edit Container Left -->
            <div class="edit-add-contact-container d-flex-c-c-fs">
                <div onclick="closeEditContactOverlay()" class="edit-contact-close-container-mobile">
                    <img class="close-contact-img c-pointer" src="./assets/img/contact-close-white.svg" alt="Close">
                </div>
                <img class="contact-logo" src="./assets/icons/Join_logo 2.svg" alt="Join Logo">
                <span class="edit-headline">Edit contact</span>
                <div class="contact-progress-bar"></div>
            </div>

            <!-- Contact Circle -->
            <div class="contact-circle-container d-flex-c">
                <div class="contact-circle d-flex-c ${randomColor}">
                    <span class="contact-circle-text">${initials}</span>
                </div>
            </div>

            <!-- Input Content -->
            <div class="input-add-contact-container">
                <!-- Close Button -->
                <div onclick="closeEditContactOverlay()" class="contact-close-container">
                    <img class="close-contact-img c-pointer" src="./assets/img/contact-close.svg" alt="Close">
                </div>

                <!-- Form for Editing Contact -->
                <div class="w100">
                    <form action="">
                        <div class="input-contact-container">
                            <input id="edit-name" value="${data.name}" type="text" placeholder="Name" oninput="validateEditNameInput(this)" required />
                            <img class="contact-input-icon" src="./assets/img/contact-person.svg" alt="Person">
                        </div>
                        <div id="edit-name-validation" class="error-message"></div>
                        <div class="input-contact-container">
                            <input id="edit-email" value="${data.email}" type="email" placeholder="Email" oninput="validateEditEmailInput(this)" required />
                            <img class="contact-input-icon" src="./assets/img/contact-mail.svg" alt="Email">
                        </div>
                        <div id="edit-email-validation" class="error-message"></div>
                        <div class="input-contact-container">
                            <input id="edit-phone" value="${data.phone}" type="tel" placeholder="Phone" oninput="validateEditPhoneInput(this)" required />
                            <img class="contact-input-icon" src="./assets/img/contact-call.svg" alt="Phone">
                        </div>
                        <div id="edit-phone-validation" class="error-message"></div>
                    </form>
                
                    <!-- Button Container -->
                    <div class="edit-contact-buttons">
                        <button class="contact-delete" onclick="deleteSelectedContact()">Delete</button>
                        <button onclick="saveEditedContact()" class="contact-save d-flex-c">Save
                            <img class="contact-save-icon" src="./assets/img/add_task_check.svg" alt="done">
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
}

/**
 * Generates the HTML template for a letter header in the contact list
 * @param {string} letter - The letter to display as a section header
 * @returns {string} HTML template string for the letter header
 */
function getFirstLetter(letter) {
    return `
    <div class="first-letter-container">${letter}</div>
    `
}

/**
 * Generates the HTML template for a contact card in the contact list
 * And asks if the name is over 20 characters long
 * @param {Object} data - The contact data object containing name, email, phone, and firebaseKey
 * @returns {string} HTML template string for the contact card
 */
function getContact(data) {
    const nameWords = data.name.split(' ');
    const initials = nameWords.map(word => word.charAt(0).toUpperCase()).join('').substring(0, 2);
    const randomColor = getRandomColorClass();

    return `
        <div class="personal-ad" onclick="showContactDetails('${data.name}', '${data.email}', '${data.phone}', '${data.firebaseKey}', '${randomColor}')">
            <div class="person-circle d-flex-c ${randomColor}">
              ${initials}
            </div>
            <div class="personal-data">
              <span>${data.name}</span>
              <a href="mailto:${data.email}" onclick="event.stopPropagation()">${data.email}</a>
            </div>
        </div>
    `
}

/**
 * Generates the HTML template for the success notification message
 * Returns a div with animation class that displays for 3 seconds and then disappears
 * @returns {string} HTML template string for the success notification
 */
function getMessageSuccessfullyAdded() {
    return `
    <div class="succesfully-creat">
        Contact succesfully created
    </div>
    `
}

/**
 * Generates the HTML template for the mobile edit/delete menu
 * @returns {string} HTML template string for the mobile menu
 */
function getMobileEditDeleteMenu() {
    return `
    <div id="mobile-menu-overlay" class="mobile-menu-overlay" onclick="closeMobileEditMenu()">
        <div class="mobile-edit-delete" onclick="event.stopPropagation()">
            <div class="d-flex-c g-8 c-pointer" onclick="openEditContactOverlay(); closeMobileEditMenu();">
                <img src="./assets/img/contact-edit-mobile.svg" alt="pen">
                <span class="fs-400-16">Edit</span>
            </div>
            <div class="d-flex-c g-8 c-pointer" onclick="deleteSelectedContact(); closeMobileEditMenu();">
                <img src="./assets/img/contact-delete-mobile.svg" alt="trash can">
                <span class="fs-400-16">Delete</span>
            </div>
        </div>
    </div>
    `
}