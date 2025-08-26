function addContactTemplate() {
    return `  
    <div class="overlay">
        <div class="add-contact-container d-flex-c">
        <!-- Add Container Left -->
        <div class="edit-add-contact-container d-flex-c-c-fs">
            <div class="add-contact-close-container-mobile">
            <img
                class="close-contact-img c-pointer"
                src="./assets/img/contact-close-white.svg"
                alt="Close"
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
            />
            </div>

            <!-- Form for Adding Contact -->
            <div class="w100">
            <form action="">
                <div class="input-contact-container">
                <input id="add-name" type="text" placeholder="Name" />
                <img
                    class="contact-input-icon"
                    src="./assets/img/contact-person.svg"
                    alt="Person"
                />
                </div>
                <div class="input-contact-container">
                <input id="add-email" type="email" placeholder="Email" />
                <img
                    class="contact-input-icon"
                    src="./assets/img/contact-mail.svg"
                    alt="Email"
                />
                </div>
                <div class="input-contact-container">
                <input id="add-phone" type="number" placeholder="Phone" />
                <img
                    class="contact-input-icon"
                    src="./assets/img/contact-call.svg"
                    alt="Phone"
                />
                </div>
            </form>

            <!-- Button Container -->
            <div class="edit-contact-buttons">
                <button class="contact-delete add-contact-delete d-flex-c">
                Cancel
                <img
                    class="fill-hover"
                    src="./assets/img/contact-close.svg"
                    alt="Close"
                />
                </button>
                <button onclick="postNewContact()" class="contact-save add-contact-save">
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

function editContactTemplate(data) {
    return `
    <div class="overlay">
        <div class="add-contact-container d-flex-c">

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
                <div class="contact-circle d-flex-c">
                    <span class="contact-circle-text">AM</span>
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
                            <input id="edit-name" value="${data.name}" type="text" placeholder="Name">
                            <img class="contact-input-icon" src="./assets/img/contact-person.svg" alt="Person">
                        </div>
                        <div class="input-contact-container">
                            <input id="edit-email" value="${data.email}" type="email" placeholder="Email">
                            <img class="contact-input-icon" src="./assets/img/contact-mail.svg" alt="Email">
                        </div>
                        <div class="input-contact-container">
                            <input id="edit-phone" value="${data.phone}" type="mobile" placeholder="Phone">
                            <img class="contact-input-icon" src="./assets/img/contact-call.svg" alt="Phone">
                        </div>
                    </form>
                
                    <!-- Button Container -->
                    <div class="edit-contact-buttons">
                        <button class="contact-delete">Delete</button>
                        <button onclick="saveContact()" class="contact-save d-flex-c">Save
                            <img class="contact-save-icon" src="./assets/img/add_task_check.svg" alt="done">
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
}

function getFirstLetter() {
    return `
    <div class="first-letter-container">A</div>
    `
}

function getContact() {
    return `
        <div class="personal-ad">
            <div class="person-circle d-flex-c">
              AS
            </div>
            <div class="personal-data">
              <span>Anja Schulz</span>
              <a href="mailto:anja.schulz@example.com">schulz@example.com</a>
            </div>
        </div>
    `
}