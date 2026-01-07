/**
 * Firebase Task Updates & Deletes - FIXED
 * NO localStorage - NO duplicate BASE_URL
 * Uses db.js functions exclusively
 * Handles drag-drop, edits, and deletions directly with Firebase
 */

/**
 * Updates task status in Firebase when moved
 * FIXED: Uses putData from db.js
 * @param {string} firebaseId - Firebase task ID
 * @param {string} newStatus - New status
 */
async function updateTaskStatusInFirebase(firebaseId, newStatus) {
  try {
    console.log(`🔄 Updating task ${firebaseId} status to: ${newStatus}`);
    
    await putData(`/task/${firebaseId}/status`, newStatus);
    console.log(`✅ Task status updated in Firebase`);
    
  } catch (error) {
    console.error("❌ Error updating task status:", error);
  }
}

/**
 * Deletes task from Firebase
 * FIXED: Uses deleteData from db.js
 * @param {string} firebaseId - Firebase task ID
 */
async function deleteTaskFromFirebase(firebaseId) {
  try {
    console.log(`🗑️ Deleting task ${firebaseId} from Firebase...`);
    
    const success = await deleteData(`/task/${firebaseId}`);
    
    if (success) {
      console.log(`✅ Task deleted from Firebase`);
      return true;
    } else {
      console.error("❌ Failed to delete task from Firebase");
      return false;
    }
    
  } catch (error) {
    console.error("❌ Error deleting task:", error);
    return false;
  }
}

/**
 * Updates entire task in Firebase
 * FIXED: Uses putData from db.js
 * @param {string} firebaseId - Firebase task ID
 * @param {Object} updatedTask - Updated task data
 */
async function updateEntireTaskInFirebase(firebaseId, updatedTask) {
  try {
    console.log(`🔄 Updating entire task ${firebaseId} in Firebase...`);
    
    const result = await putData(`/task/${firebaseId}`, updatedTask);
    
    if (result) {
      console.log(`✅ Task updated in Firebase`);
      return true;
    } else {
      console.error("❌ Failed to update task in Firebase");
      return false;
    }
    
  } catch (error) {
    console.error("❌ Error updating task:", error);
    return false;
  }
}

/**
 * Updates subtasks in Firebase
 * FIXED: Uses putData from db.js
 * @param {string} firebaseId - Firebase task ID
 * @param {Array} subtasks - Updated subtasks array
 */
async function updateSubtasksInFirebase(firebaseId, subtasks) {
  try {
    await putData(`/task/${firebaseId}/subtasks`, subtasks);
    console.log(`✅ Subtasks updated in Firebase`);
  } catch (error) {
    console.error("❌ Error updating subtasks:", error);
  }
}

/**
 * Listens for task:moved events and syncs to Firebase
 */
function setupFirebaseStatusSync() {
  document.addEventListener("task:moved", async (e) => {
    const { id, status } = e.detail || {};
    
    if (!id || !status) {
      console.warn("⚠️ task:moved event missing id or status");
      return;
    }
    
    await updateTaskStatusInFirebase(id, status);
  });
  
  console.log("✅ Firebase status sync enabled (drag & drop)");
}

/**
 * Listens for task:deleted events and syncs to Firebase
 */
function setupFirebaseDeleteSync() {
  document.addEventListener("task:deleted", async (e) => {
    const { id } = e.detail || {};
    
    if (!id) {
      console.warn("⚠️ task:deleted event missing id");
      return;
    }
    
    const success = await deleteTaskFromFirebase(id);
    
    if (success) {
      console.log("✅ Task deleted successfully");
    } else {
      console.error("❌ Failed to delete task");
      // Optionally reload from Firebase to sync state
      if (window.reloadTasksFromFirebase) {
        window.reloadTasksFromFirebase();
      }
    }
  });
  
  console.log("✅ Firebase delete sync enabled");
}

/**
 * Listens for task:updated events and syncs to Firebase
 */
function setupFirebaseUpdateSync() {
  document.addEventListener("task:updated", async (e) => {
    const { id } = e.detail || {};
    
    if (!id) {
      console.warn("⚠️ task:updated event missing id");
      return;
    }
    
    // Get updated card data
    const card = document.querySelector(`.kb-card[data-id="${id}"]`);
    if (!card) {
      console.warn("⚠️ Card not found for update");
      return;
    }
    
    // Extract updated data from card
    const updatedTask = extractTaskDataFromCard(card);
    
    // Update in Firebase
    await updateEntireTaskInFirebase(id, updatedTask);
  });
  
  console.log("✅ Firebase update sync enabled");
}

/**
 * Extracts task data from card element
 * @param {HTMLElement} card - Card element
 * @returns {Object} Task data
 */
function extractTaskDataFromCard(card) {
  const title = card.querySelector('.kb-card-title')?.textContent.trim() || '';
  const description = card.querySelector('.kb-card-desc')?.textContent.trim() || '';
  const dueDate = card.dataset.due || '';
  const status = card.dataset.status || 'todo';
  
  // Get category
  const chip = card.querySelector('.kb-chip');
  const categoryName = chip?.textContent.trim() || 'User Story';
  const category = {
    name: categoryName,
    color: categoryName === 'Technical Task' ? '#6c8cff' : '#0038FF'
  };
  
  // Get priority
  const priorityEl = card.querySelector('.kb-prio, .kb-priority');
  let priority = 'medium';
  if (priorityEl) {
    if (priorityEl.classList.contains('kb-prio--low')) priority = 'low';
    else if (priorityEl.classList.contains('kb-prio--high') || priorityEl.classList.contains('kb-prio--urgent')) priority = 'urgent';
  }
  
  // Get assigned
  const assigneesStr = card.querySelector('.kb-avatars')?.dataset.assignees || '';
  const assigned = assigneesStr.split(',')
    .filter(Boolean)
    .map(initials => ({ initials: initials.trim() }));
  
  // Get subtasks
  let subtasks = [];
  try {
    if (card.dataset.subtasks) {
      subtasks = JSON.parse(card.dataset.subtasks);
    }
  } catch (e) {
    console.warn("Failed to parse subtasks");
  }
  
  return {
    title,
    description,
    dueDate,
    category,
    priority,
    status,
    assigned,
    subtasks
  };
}

/**
 * REMOVED: preventLocalStorageUpdates - no longer needed
 * We're not using localStorage at all
 */

/**
 * Initialize Firebase sync handlers
 */
function initFirebaseSyncHandlers() {
  if (window.__firebaseSyncInit) {
    console.log("Firebase sync handlers already initialized");
    return;
  }
  
  window.__firebaseSyncInit = true;
  console.log("🚀 Initializing Firebase Sync Handlers (NO localStorage)...");
  
  // Setup Firebase sync for all operations
  setupFirebaseStatusSync();
  setupFirebaseDeleteSync();
  setupFirebaseUpdateSync();
  
  console.log("✅ Firebase Sync Handlers initialized!");
}

/**
 * Auto-initialize
 */
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initFirebaseSyncHandlers, { once: true });
} else {
  setTimeout(initFirebaseSyncHandlers, 100);
}

/**
 * Export functions
 */
window.updateTaskStatusInFirebase = updateTaskStatusInFirebase;
window.deleteTaskFromFirebase = deleteTaskFromFirebase;
window.updateEntireTaskInFirebase = updateEntireTaskInFirebase;
window.updateSubtasksInFirebase = updateSubtasksInFirebase;