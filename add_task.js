const contacts = [
  { initials: "SM", name: "Sofia Müller", color: "#00BEE8" },
  { initials: "AM", name: "Anton Mayer", color: "#FF7A00" },
  { initials: "AS", name: "Anja Schulz", color: "#9E00FF" },
  { initials: "BZ", name: "Benedikt Ziegler", color: "#0038FF" },
  { initials: "DE", name: "David Eisenberg", color: "#FF00FF" },
];
const categories = [
  { name: "Frontend", color: "#007bff" },
  { name: "Backend", color: "#28a745" },
  { name: "Design", color: "#ffc107" },
];

fetch('sidebarheader.html')
    .then(response => response.text())
    .then(html => {
      document.getElementById('sidebar-header').innerHTML = html;
    });

document.addEventListener('DOMContentLoaded', () => {
  flatpickr("#due-date", { dateFormat: "d/m/Y" });

document.querySelectorAll('.priority').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.priority').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });

document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      toggle.parentElement.classList.toggle('open');
    });
  });
  
function renderContacts() {
    const menu = document.querySelector('.dropdown.assigned-to .dropdown-menu');
    menu.innerHTML = contacts.map(contact => `
      <div class="contact-option">
        <div class="avatar" style="background-color: ${contact.color}">${contact.initials}</div>
        <span class="name">${contact.name}</span>
        <input type="checkbox"/>
      </div>
    `).join('');
  }
  renderContacts();

function renderCategories() {
    const menu = document.querySelector('.dropdown.category-select .dropdown-menu');
    menu.innerHTML = categories.map(category => `
      <div class="category-option">
        <div class="dot" style="background-color: ${category.color}"></div>
        <span class="name">${category.name}</span>
        <input type="checkbox"/>
      </div>
    `).join('');
  }
  renderCategories();

  const input = document.getElementById('subtask-input');
  const plus = document.getElementById('subtask-add-icon');
  const cancel = document.getElementById('subtask-cancel-icon');
  const confirm = document.getElementById('subtask-confirm-icon');

  input.addEventListener('input', () => {
    const hasText = input.value.trim() !== "";
    plus.style.display = hasText ? "none" : "inline";
    cancel.style.display = hasText ? "inline" : "none";
    confirm.style.display = hasText ? "inline" : "none";
  });

  cancel.addEventListener('click', () => {
    input.value = "";
    plus.style.display = "inline";
    cancel.style.display = "none";
    confirm.style.display = "none";
  });

  confirm.addEventListener('click', () => {
    const value = input.value.trim();
    if (value) {
      console.log("Subtask added:", value);
      input.value = ""; 
      plus.style.display = "inline";
      cancel.style.display = "none";
      confirm.style.display = "none";
    }
  });
});
