// /**
//  * Opens add task modal based on viewport
//  */
// function openAddTaskView(){
//   if(isDesktop() && window.openAddTaskPopup) openAddTaskPopup();
//   else triggerAddTaskPopup();
// }


// /**
//  * Binds click events to add task buttons
//  */
// function bindAddTaskTriggers(){
//   document.querySelectorAll(".kb-add-btn,.kb-col-add")
//     .forEach(btn=>btn.addEventListener("click",e=>{
//       e.preventDefault();
//       openAddTaskView();
//     }));
// }


// /**
//  * Triggers navigation to add task page
//  */
// function triggerAddTaskPopup(){
//   document.dispatchEvent(new CustomEvent("open-add-task"));
//   setTimeout(()=>location.href="add_task.html",0);
// }


// /**
//  * Binds card click events for details modal
//  */
// function bindCardPopups(){
//   const wrap=document.querySelector(".kb-columns"); 
//   if(!wrap) return;
//   wrap.addEventListener("click",e=>{
//     const t=e.target; 
//     if(isInteractive(t)) return;
//     const card=t instanceof Element?t.closest(".kb-card"):null;
//     if(!card||!wrap.contains(card)) return;
//     if(!card.dataset.id) card.dataset.id="kb_"+Math.random().toString(36).slice(2,9);
//     window.__beCurrentDetailsCardId=card.dataset.id;
//     const d=collectCardData(card); 
//     openDetails(d.type,d);
//   });
// }


// /**
//  * Wires add task modal events
//  */
// function wireAddTaskModal(){
//   const m=document.getElementById("at-modal"); 
//   if(!m) return;
//   window.openAddTaskPopup=()=>{ 
//     showOverlay(); 
//     m.classList.add("is-open"); 
//   };
//   document.getElementById("at-close")?.addEventListener("click",()=>{
//     m.classList.remove("is-open"); 
//     hideOverlay();
//   });
// }


// /**
//  * Sets chip type in details modal
//  * @param {string} type - Task type
//  */
// function setChip(type){
//   const el=document.getElementById("td-chip"); 
//   if(!el) return;
//   el.className="td-chip "+(type==="technical"?"td-chip--technical":"td-chip--story");
//   el.textContent=type==="technical"?"Technical Task":"User Story";
// }


// /**
//  * Sets priority display
//  * @param {string} prio - Priority level
//  */
// function setPriority(prio){
//   const txt=document.getElementById("td-prio-text");
//   const box=document.getElementById("td-prio-icon");
//   if(txt) txt.textContent=prio[0].toUpperCase()+prio.slice(1);
//   if(!box) return; 
//   box.innerHTML="";
//   const img=document.createElement("img");
//   img.className="td-prio-img"; 
//   img.alt="Priority";
//   setIconWithFallback(img, ICONS.prio[prio]||ICONS.prio.medium);
//   box.appendChild(img);
// }


// /**
//  * Sets assignees in details modal
//  * @param {string[]} list - Array of initials
//  */
// function setAssignees(list){
//   const box=document.getElementById("td-assignees"); 
//   if(!box) return;
//   box.innerHTML=""; 
//   (list||[]).forEach(i=>{ 
//     const p=contacts.find(c=>c.initials===i); 
//     if(p) box.appendChild(personCircle(i,p.name)); 
//   });
// }


// /**
//  * Sets subtasks list
//  * @param {string[]} list - Array of subtasks
//  */
// function setSubtasks(list){
//   const block=document.getElementById("td-subtasks"); 
//   const ul=document.getElementById("td-subtasks-list");
//   if(!block||!ul) return; 
//   ul.innerHTML="";
//   if(!list?.length){ 
//     block.hidden=true; 
//     return; 
//   }
//   list.forEach(t=>{ 
//     const li=document.createElement("li"); 
//     li.className="td-task";
//     const b=document.createElement("button"); 
//     b.type="button"; 
//     b.className="td-checkbox";
//     const s=document.createElement("span"); 
//     s.className="td-task__label"; 
//     s.textContent=t;
//     li.append(b,s); 
//     ul.appendChild(li);
//   }); 
//   block.hidden=false;
// }


// /**
//  * Binds subtask checkbox toggles
//  */
// function bindSubtaskToggles(){
//   const ul=document.getElementById("td-subtasks-list"); 
//   if(!ul) return;
//   ul.addEventListener("click",e=>{ 
//     const b=e.target.closest(".td-checkbox"); 
//     if(!b)return;
//     b.classList.toggle("is-checked"); 
//     b.parentElement?.classList.toggle("is-done");
//   });
// }


// /**
//  * Fills task details modal with data
//  * @param {Object} d - Task data
//  * @param {string} t - Task type
//  */
// function fillTaskDetails(d,t){
//   setChip(t);
//   document.getElementById("td-title").textContent=d.title||"";
//   document.getElementById("td-desc").textContent=d.desc||"";
//   document.getElementById("td-due").textContent=d.dueDate||"—";
//   setPriority(d.priority||"medium"); 
//   setAssignees(d.assignees||[]); 
//   setSubtasks(d.subtasks||[]);
// }


// /**
//  * Traps focus within modal
//  * @param {HTMLElement} m - Modal element
//  */
// function trapFocus(m){
//   const fs=m.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])');
//   const a=fs[0],z=fs[fs.length-1];
//   function onKey(e){ 
//     if(e.key!=="Tab"||!fs.length)return;
//     if(e.shiftKey&&document.activeElement===a){
//       e.preventDefault();
//       z.focus();
//     } else if(!e.shiftKey&&document.activeElement===z){
//       e.preventDefault();
//       a.focus();
//     }
//   } 
//   m.__trap=onKey; 
//   document.addEventListener("keydown",onKey); 
//   (a||m).focus();
// }


// /**
//  * Wires task details modal
//  */
// function wireTaskDetailsModal(){
//   const m=document.getElementById("td-modal"); 
//   if(!m) return;
//   let lastF=null;
//   document.querySelector("[data-td-close]")?.addEventListener("click",()=>{
//     m.classList.remove("is-open"); 
//     hideOverlay(); 
//     if(m.__trap) document.removeEventListener("keydown",m.__trap); 
//     lastF?.focus?.();
//   });
//   window.openDetails=(type,data)=>{
//     lastF=document.activeElement; 
//     fillTaskDetails(data,type);
//     showOverlay(); 
//     m.classList.add("is-open"); 
//     trapFocus(m);
//   };
// }


// /**
//  * Binds priority button events
//  */
// function bindPriorityButtons(){
//   document.querySelectorAll(".priority__btn").forEach(b=>{
//     b.addEventListener("click",()=>{
//       document.querySelectorAll(".priority__btn")
//         .forEach(x=>x.classList.remove("priority__btn--active"));
//       b.classList.add("priority__btn--active");
//       b.closest(".priority")?.querySelector("input[name='priority']")
//         ?.setAttribute("value",b.dataset.value||"medium");
//     });
//   });
// }


// /**
//  * Binds subtask input Enter key
//  */
// function bindSubtaskInput(){
//   const i=document.querySelector("[data-subtasks] input"); 
//   const ul=document.querySelector(".subtasks__list");
//   if(!i||!ul) return;
//   i.addEventListener("keydown",e=>{
//     if(e.key!=="Enter") return;
//     const v=i.value.trim(); 
//     if(!v) return e.preventDefault();
//     e.preventDefault(); 
//     const li=document.createElement("li"); 
//     li.textContent=v; 
//     ul.appendChild(li); 
//     i.value="";
//   });
// }


// /**
//  * Validates form fields
//  * @param {HTMLFormElement} f - Form element
//  * @returns {boolean}
//  */
// function validateForm(f){
//   const title = f.querySelector('[name="title"]')?.value.trim();
//   const due = f.querySelector('[name="due"]')?.value.trim();
//   const category = f.querySelector('[name="category"]')?.value;
  
//   if(!title){
//     alert('Please enter a title');
//     return false;
//   }
//   if(!due){
//     alert('Please select a due date');
//     return false;
//   }
//   if(!category){
//     alert('Please select a category');
//     return false;
//   }
//   return true;
// }


// /**
//  * Binds add task form buttons
//  */
// function bindAddTaskButtons(){
//   document.getElementById("at-cancel")?.addEventListener("click",()=>{ 
//     document.getElementById("at-modal")?.classList.remove("is-open"); 
//     hideOverlay(); 
//   });
//   document.getElementById("at-create")?.addEventListener("click",e=>{
//     const f = beGetForm();
//     if(!f || f.dataset.editingId) return;
//     if(!validateForm(f)){
//       e.preventDefault();
//     }
//   });
// }


// /**
//  * Wires add task form
//  */
// function wireAddTaskForm(){
//   bindPriorityButtons(); 
//   bindSubtaskInput(); 
//   bindAddTaskButtons();
//   const f = beGetForm();
//   if(f){
//     const cat = f.querySelector('[name="category"]');
//     let typeHidden = f.querySelector('[name="type"]');
//     if(!typeHidden){
//       typeHidden = document.createElement('input');
//       typeHidden.type = 'hidden'; 
//       typeHidden.name = 'type'; 
//       typeHidden.value = 'story';
//       f.appendChild(typeHidden);
//     }
//     cat?.addEventListener('change', () => {
//       typeHidden.value = cat.value === 'Technical Task' ? 'technical' : 'story';
//     });
//   }
// }


// /**
//  * Main initialization function
//  */
// function initBoard(){
//   initStaticIcons();
//   renderAvatars();
//   bindAddTaskTriggers();
//   bindCardPopups();
//   wireAddTaskModal();
//   wireTaskDetailsModal();
//   wireAddTaskForm();
//   bindSubtaskToggles();
  
//   document.addEventListener("click",e=>{ 
//     if(e.target?.id==="at-overlay") closeAllOpenModals(); 
//   });
//   document.addEventListener("keydown",e=>{ 
//     if(e.key==="Escape") closeAllOpenModals(); 
//   });
  
//   const container = document.getElementById('task-board');
//   const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
//   if (container) {
//     tasks.forEach(task => {
//       const card = document.createElement('div');
//       card.className = 'task-card';
//       card.innerHTML = `
//         <div class="task-category" style="background:${task.category.color}">
//           ${task.category.name}
//         </div>
//         <h3>${task.title}</h3>
//         <p>${task.description}</p>
//         <p><b>Due:</b> ${task.dueDate}</p>
//         <p><b>Priority:</b> ${task.priority}</p>
//       `;
//       container.appendChild(card);
//     });
//   }
// }


// window.addEventListener("DOMContentLoaded", initBoard);


/**
 * Opens add task modal based on viewport
 */
function openAddTaskView(){
  if(isDesktop() && window.openAddTaskPopup) openAddTaskPopup();
  else triggerAddTaskPopup();
}


/**
 * Binds click events to add task buttons
 */
function bindAddTaskTriggers(){
  document.querySelectorAll(".kb-add-btn,.kb-col-add")
    .forEach(btn=>btn.addEventListener("click",e=>{
      e.preventDefault();
      openAddTaskView();
    }));
}


/**
 * Triggers navigation to add task page
 */
function triggerAddTaskPopup(){
  document.dispatchEvent(new CustomEvent("open-add-task"));
  setTimeout(()=>location.href="add_task.html",0);
}


/**
 * Binds card click events for details modal
 */
function bindCardPopups(){
  const wrap=document.querySelector(".kb-columns"); 
  if(!wrap) return;
  wrap.addEventListener("click",e=>{
    const t=e.target; 
    if(isInteractive(t)) return;
    const card=t instanceof Element?t.closest(".kb-card"):null;
    if(!card||!wrap.contains(card)) return;
    if(!card.dataset.id) card.dataset.id="kb_"+Math.random().toString(36).slice(2,9);
    window.__beCurrentDetailsCardId=card.dataset.id;
    const d=collectCardData(card); 
    openDetails(d.type,d);
  });
}


/**
 * Wires add task modal events
 */
function wireAddTaskModal(){
  const m=document.getElementById("at-modal"); 
  if(!m) return;
  window.openAddTaskPopup=()=>{ 
    showOverlay(); 
    m.classList.add("is-open"); 
  };
  document.getElementById("at-close")?.addEventListener("click",()=>{
    m.classList.remove("is-open"); 
    hideOverlay();
  });
}


/**
 * Sets chip type in details modal
 * @param {string} type - Task type
 */
function setChip(type){
  const el=document.getElementById("td-chip"); 
  if(!el) return;
  el.className="td-chip "+(type==="technical"?"td-chip--technical":"td-chip--story");
  el.textContent=type==="technical"?"Technical Task":"User Story";
}


/**
 * Sets priority display
 * @param {string} prio - Priority level
 */
function setPriority(prio){
  const txt=document.getElementById("td-prio-text");
  const box=document.getElementById("td-prio-icon");
  if(txt) txt.textContent=prio[0].toUpperCase()+prio.slice(1);
  if(!box) return; 
  box.innerHTML="";
  const img=document.createElement("img");
  img.className="td-prio-img"; 
  img.alt="Priority";
  setIconWithFallback(img, ICONS.prio[prio]||ICONS.prio.medium);
  box.appendChild(img);
}


/**
 * Sets assignees in details modal
 * @param {string[]} list - Array of initials
 */
function setAssignees(list){
  const box=document.getElementById("td-assignees"); 
  if(!box) return;
  box.innerHTML=""; 
  (list||[]).forEach(i=>{ 
    const p=contacts.find(c=>c.initials===i); 
    if(p) box.appendChild(personCircle(i,p.name)); 
  });
}


/**
 * Sets subtasks list
 * @param {string[]} list - Array of subtasks
 */
function setSubtasks(list){
  const block=document.getElementById("td-subtasks"); 
  const ul=document.getElementById("td-subtasks-list");
  if(!block||!ul) return; 
  ul.innerHTML="";
  if(!list?.length){ 
    block.hidden=true; 
    return; 
  }
  list.forEach(t=>{ 
    const li=document.createElement("li"); 
    li.className="td-task";
    const b=document.createElement("button"); 
    b.type="button"; 
    b.className="td-checkbox";
    const s=document.createElement("span"); 
    s.className="td-task__label"; 
    s.textContent=t;
    li.append(b,s); 
    ul.appendChild(li);
  }); 
  block.hidden=false;
}


/**
 * Binds subtask checkbox toggles
 */
function bindSubtaskToggles(){
  const ul=document.getElementById("td-subtasks-list"); 
  if(!ul) return;
  ul.addEventListener("click",e=>{ 
    const b=e.target.closest(".td-checkbox"); 
    if(!b)return;
    b.classList.toggle("is-checked"); 
    b.parentElement?.classList.toggle("is-done");
  });
}


/**
 * Fills task details modal with data
 * @param {Object} d - Task data
 * @param {string} t - Task type
 */
function fillTaskDetails(d,t){
  setChip(t);
  document.getElementById("td-title").textContent=d.title||"";
  document.getElementById("td-desc").textContent=d.desc||"";
  document.getElementById("td-due").textContent=d.dueDate||"—";
  setPriority(d.priority||"medium"); 
  setAssignees(d.assignees||[]); 
  setSubtasks(d.subtasks||[]);
}


/**
 * Traps focus within modal
 * @param {HTMLElement} m - Modal element
 */
function trapFocus(m){
  const fs=m.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])');
  const a=fs[0],z=fs[fs.length-1];
  function onKey(e){ 
    if(e.key!=="Tab"||!fs.length)return;
    if(e.shiftKey&&document.activeElement===a){
      e.preventDefault();
      z.focus();
    } else if(!e.shiftKey&&document.activeElement===z){
      e.preventDefault();
      a.focus();
    }
  } 
  m.__trap=onKey; 
  document.addEventListener("keydown",onKey); 
  (a||m).focus();
}


/**
 * Wires task details modal
 */
function wireTaskDetailsModal(){
  const m=document.getElementById("td-modal"); 
  if(!m) return;
  let lastF=null;
  document.querySelector("[data-td-close]")?.addEventListener("click",()=>{
    m.classList.remove("is-open"); 
    hideOverlay(); 
    if(m.__trap) document.removeEventListener("keydown",m.__trap); 
    lastF?.focus?.();
  });
  window.openDetails=(type,data)=>{
    lastF=document.activeElement; 
    fillTaskDetails(data,type);
    showOverlay(); 
    m.classList.add("is-open"); 
    trapFocus(m);
  };
}


/**
 * Binds priority button events
 */
function bindPriorityButtons(){
  document.querySelectorAll(".priority__btn").forEach(b=>{
    b.addEventListener("click",()=>{
      document.querySelectorAll(".priority__btn")
        .forEach(x=>x.classList.remove("priority__btn--active"));
      b.classList.add("priority__btn--active");
      b.closest(".priority")?.querySelector("input[name='priority']")
        ?.setAttribute("value",b.dataset.value||"medium");
    });
  });
}


/**
 * Binds subtask input Enter key
 */
function bindSubtaskInput(){
  const i=document.querySelector("[data-subtasks] input"); 
  const ul=document.querySelector(".subtasks__list");
  if(!i||!ul) return;
  i.addEventListener("keydown",e=>{
    if(e.key!=="Enter") return;
    const v=i.value.trim(); 
    if(!v) return e.preventDefault();
    e.preventDefault(); 
    const li=document.createElement("li"); 
    li.textContent=v; 
    ul.appendChild(li); 
    i.value="";
  });
}


/**
 * Validates form fields
 * @param {HTMLFormElement} f - Form element
 * @returns {boolean}
 */
function validateForm(f){
  const title = f.querySelector('[name="title"]')?.value.trim();
  const due = f.querySelector('[name="due"]')?.value.trim();
  const category = f.querySelector('[name="category"]')?.value;
  
  if(!title){
    alert('Please enter a title');
    return false;
  }
  if(!due){
    alert('Please select a due date');
    return false;
  }
  if(!category){
    alert('Please select a category');
    return false;
  }
  return true;
}


/**
 * Binds add task form buttons
 */
function bindAddTaskButtons(){
  document.getElementById("at-cancel")?.addEventListener("click",()=>{ 
    document.getElementById("at-modal")?.classList.remove("is-open"); 
    hideOverlay(); 
  });
  document.getElementById("at-create")?.addEventListener("click",e=>{
    const f = beGetForm();
    if(!f || f.dataset.editingId) return;
    if(!validateForm(f)){
      e.preventDefault();
    }
  });
}


/**
 * Wires add task form
 */
function wireAddTaskForm(){
  bindPriorityButtons(); 
  bindSubtaskInput(); 
  bindAddTaskButtons();
  const f = beGetForm();
  if(f){
    const cat = f.querySelector('[name="category"]');
    let typeHidden = f.querySelector('[name="type"]');
    if(!typeHidden){
      typeHidden = document.createElement('input');
      typeHidden.type = 'hidden'; 
      typeHidden.name = 'type'; 
      typeHidden.value = 'story';
      f.appendChild(typeHidden);
    }
    cat?.addEventListener('change', () => {
      typeHidden.value = cat.value === 'Technical Task' ? 'technical' : 'story';
    });
  }
}

/**
 * Main initialization function
 */
function initBoard(){
  initStaticIcons();
  renderAvatars();
  bindAddTaskTriggers();
  bindCardPopups();
  wireAddTaskModal();
  wireTaskDetailsModal();
  wireAddTaskForm();
  bindSubtaskToggles();

  document.addEventListener("click",e=>{ 
    if(e.target?.id==="at-overlay") closeAllOpenModals(); 
  });
  document.addEventListener("keydown",e=>{ 
    if(e.key==="Escape") closeAllOpenModals(); 
  });
}

window.addEventListener("DOMContentLoaded", initBoard);