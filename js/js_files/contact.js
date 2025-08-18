function openAddContactOverlay() {
    let contactOverlay = document.getElementById("contact-overlay");
    contactOverlay.innerHTML = addContactTemplate();
}

function openEditContactOverlay() {
    let contactOverlay = document.getElementById("contact-overlay");
    contactOverlay.innerHTML = editContactTemplate();
}