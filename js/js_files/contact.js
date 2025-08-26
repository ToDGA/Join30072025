const BASE_URL = "https://join-f5b75-default-rtdb.europe-west1.firebasedatabase.app/";

async function postData(path = "", data) {
    await fetch(BASE_URL + path + ".json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
}

async function getData(path = "") {
    let response = await fetch(BASE_URL + path + ".json");
    let responseData = await response.json();
    return responseData;
}

function testContactLoad() {
    let contactList = document.getElementById("contact-list");
    contactList.innerHTML = "";
    contactList.innerHTML = getFirstLetter();
    contactList.innerHTML += getContact();
}
async function postNewContact() {
    const name = document.getElementById("add-name");
    const email = document.getElementById("add-email");
    const phone = document.getElementById("add-phone");
    const saveButton = document.querySelector(".add-contact-save");
    if (!name.value || !email.value || !phone.value) {
        saveButton.disabled = true;
        alert("Please fill in all fields");
        console.error("Validation failed");
    } else {
        saveButton.disabled = false;
    }
    let contact = {
        name: name.value,
        email: email.value,
        phone: phone.value
    };
    await postData("/contact", contact);
    closeAddContactOverlay();
}


function openAddContactOverlay() {
    let contactOverlay = document.getElementById("contact-overlay");
    contactOverlay.innerHTML = addContactTemplate();
}

function openEditContactOverlay() {
    let contactOverlay = document.getElementById("contact-overlay");
    contactOverlay.innerHTML = editContactTemplate(data[0]);
}

function closeAddContactOverlay() {
    let contactOverlay = document.getElementById("contact-overlay");
    contactOverlay.innerHTML = "";
}

function closeEditContactOverlay() {
    let contactOverlay = document.getElementById("contact-overlay");
    contactOverlay.innerHTML = "";
}

function toggleContactOverlay() {
    return
}

let data1 = [
    {
        "name": "Max Mustermann",
        "email": "max.mustermann@email.com",
        "phone": "+49 173 1234567"
    },
    {
        "name": "Anna Schmidt",
        "email": "anna.schmidt@gmail.com",
        "phone": "+49 160 9876543"
    },
    {
        "name": "Peter Weber",
        "email": "p.weber@web.de",
        "phone": "+49 171 5555123"
    },
    {
        "name": "Lisa Müller",
        "email": "lisa.mueller@outlook.com",
        "phone": "+49 175 7777888"
    },
    {
        "name": "Thomas Fischer",
        "email": "thomas.fischer@yahoo.de",
        "phone": "+49 162 3333999"
    },
    {
        "name": "Sarah Bauer",
        "email": "sarah.bauer@hotmail.com",
        "phone": "+49 178 2222444"
    },
    {
        "name": "Michael Wagner",
        "email": "m.wagner@gmx.de",
        "phone": "+49 174 6666777"
    }
];

data1.sort((a, b) => a.name.localeCompare(b.name));
console.log(data1);
