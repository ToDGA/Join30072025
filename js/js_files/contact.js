const BASE_URL = "https://join-f5b75-default-rtdb.europe-west1.firebasedatabase.app/";

let addName, addEmail, addPhone, saveButton, addNameValidation, addEmailValidation, addPhoneValidation;

function initializeFormElements() {
    addName = document.getElementById("add-name");
    addEmail = document.getElementById("add-email");
    addPhone = document.getElementById("add-phone");
    saveButton = document.getElementById("add-contact-save");
    addNameValidation = document.getElementById("add-name-validation");
    addEmailValidation = document.getElementById("add-email-validation");
    addPhoneValidation = document.getElementById("add-phone-validation");
}


async function postData(path = "", data) {
    await fetch(BASE_URL + path + ".json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
}

function validationAddContactInput() {
    let isValid = true;

    // Validate Name
    if (addName.value.trim() === "") {
        addNameValidation.textContent = "Name is required.";
        addNameValidation.style.color = "#FF8190";
        isValid = false;
    } else {
        addNameValidation.textContent = "";
    }

    // Validate Email
    const emailValue = addEmail.value.trim();
    if (emailValue === "") {
        addEmailValidation.textContent = "Email is required.";
        addEmailValidation.style.color = "#FF8190";
        isValid = false;
    } else if (!emailValue.includes('@') || !emailValue.includes('.') || emailValue.indexOf('@') === 0 || emailValue.indexOf('.') === emailValue.length - 1) {
        addEmailValidation.textContent = "Please enter a valid email address";
        addEmailValidation.style.color = "#FF8190";
        isValid = false;
    } else {
        addEmailValidation.textContent = "";
    }

    // Validate Phone
    const phoneValue = addPhone.value.trim();
    const phoneRegex = /^[0-9+\-\s()]*$/;
    if (phoneValue === "") {
        addPhoneValidation.textContent = "Phone is required.";
        addPhoneValidation.style.color = "#FF8190";
        isValid = false;
    } else if (!phoneRegex.test(phoneValue) || phoneValue.length < 5) {
        addPhoneValidation.textContent = "Please enter a valid phone number (numbers only)";
        addPhoneValidation.style.color = "#FF8190";
        isValid = false;
    } else {
        addPhoneValidation.textContent = "";
    }
    return isValid;


}

async function postNewContact() {
    if (!validationAddContactInput()) {
        console.error("Validation failed.");
        return;
    }

    const newContact = {
        name: addName.value,
        email: addEmail.value,
        phone: addPhone.value
    };
    try {
        await postData("contacts", newContact);
        console.log("New contact added successfully.");
        closeAddContactOverlay();
    } catch (error) {
        console.error("Error posting new contact:", error);
    }
}

async function getData(path = "") {
    let response = await fetch(BASE_URL + path + ".json");
    let responseData = await response.json();
    return responseData;
}

function openAddContactOverlay() {
    const contactOverlay = document.getElementById("contact-overlay");
    contactOverlay.innerHTML = addContactTemplate();

    setTimeout(() => {
        initializeFormElements();
        addInputEventListeners();
    }, 10);
}

function addInputEventListeners() {
    if (addName) {
        addName.addEventListener('input', () => {
            if (addName.value.trim() !== "") {
                addNameValidation.textContent = "";
            }
        });
    }

    if (addEmail) {
        addEmail.addEventListener('input', () => {
            const emailValue = addEmail.value.trim();
            if (emailValue === "") {
                addEmailValidation.textContent = "";
            } else if (emailValue.includes('@') && emailValue.includes('.')) {
                addEmailValidation.textContent = "";
            } else {
                addEmailValidation.textContent = "Please enter a valid email address";
                addEmailValidation.style.color = "#FF8190";
            }
        });
    }

    if (addPhone) {
        addPhone.addEventListener('input', () => {
            const phoneValue = addPhone.value.trim();
            const phoneRegex = /^[0-9+\-\s()]*$/;

            if (phoneValue === "") {
                addPhoneValidation.textContent = "";
            } else if (phoneRegex.test(phoneValue) && phoneValue.length >= 5) {
                addPhoneValidation.textContent = "";
            } else {
                addPhoneValidation.textContent = "Please enter a valid phone number (numbers only)";
                addPhoneValidation.style.color = "#FF8190";
            }
        });
    }
}

// ###################################################
// Test Contact Load
function testContactLoad() {
    const contactList = document.getElementById("contact-list");
    contactList.innerHTML = getFirstLetter() + getContact();
}

function openEditContactOverlay() {
    const contactOverlay = document.getElementById("contact-overlay");
    contactOverlay.innerHTML = editContactTemplate(data[0]);
}

function closeAddContactOverlay() {
    const contactOverlay = document.getElementById("contact-overlay");
    contactOverlay.innerHTML = "";
}

function closeEditContactOverlay() {
    let contactOverlay = document.getElementById("contact-overlay");
    contactOverlay.innerHTML = "";
}

function toggleContactOverlay() {
    return
}

// let data1 = [
//     {
//         "name": "Max Mustermann",
//         "email": "max.mustermann@email.com",
//         "phone": "+49 173 1234567"
//     },
//     {
//         "name": "Anna Schmidt",
//         "email": "anna.schmidt@gmail.com",
//         "phone": "+49 160 9876543"
//     },
//     {
//         "name": "Peter Weber",
//         "email": "p.weber@web.de",
//         "phone": "+49 171 5555123"
//     },
//     {
//         "name": "Lisa Müller",
//         "email": "lisa.mueller@outlook.com",
//         "phone": "+49 175 7777888"
//     },
//     {
//         "name": "Thomas Fischer",
//         "email": "thomas.fischer@yahoo.de",
//         "phone": "+49 162 3333999"
//     },
//     {
//         "name": "Sarah Bauer",
//         "email": "sarah.bauer@hotmail.com",
//         "phone": "+49 178 2222444"
//     },
//     {
//         "name": "Michael Wagner",
//         "email": "m.wagner@gmx.de",
//         "phone": "+49 174 6666777"
//     }
// ];

// data1.sort((a, b) => a.name.localeCompare(b.name));
// console.log(data1);
