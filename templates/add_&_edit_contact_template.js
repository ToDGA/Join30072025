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
                <input type="text" placeholder="Name" />
                <img
                    class="contact-input-icon"
                    src="./assets/img/contact-person.svg"
                    alt="Person"
                />
                </div>
                <div class="input-contact-container">
                <input type="email" placeholder="Email" />
                <img
                    class="contact-input-icon"
                    src="./assets/img/contact-mail.svg"
                    alt="Email"
                />
                </div>
                <div class="input-contact-container">
                <input type="number" placeholder="Phone" />
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
                <button class="contact-save add-contact-save">
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

function editContactTemplate() {
    return
}