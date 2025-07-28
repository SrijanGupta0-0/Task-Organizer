document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded. Initializing...");

    // Form Toggle
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskFormContainer = document.getElementById('task-form-container');
    const cancelTaskBtn = document.getElementById('cancel-task');

    if (addTaskBtn && taskFormContainer) {
        addTaskBtn.addEventListener('click', function() {
            console.log("Add task button clicked");
            taskFormContainer.classList.toggle('d-none');
            addTaskBtn.innerHTML = taskFormContainer.classList.contains('d-none') 
                ? '<i class="fas fa-plus me-2"></i> Add Task' 
                : '<i class="fas fa-minus me-2"></i> Hide Form';
        });
    }

    if (cancelTaskBtn && taskFormContainer) {
        cancelTaskBtn.addEventListener('click', function() {
            console.log("Cancel button clicked");
            taskFormContainer.classList.add('d-none');
            addTaskBtn.innerHTML = '<i class="fas fa-plus me-2"></i> Add Task';
            document.getElementById('task-form').reset();
        });
    }

    // Event Delegation for Task Actions
    document.getElementById('task-list')?.addEventListener('click', function(e) {
        const taskRow = e.target.closest('tr[data-task-id]');
        if (!taskRow) return;

        const taskId = taskRow.dataset.taskId;
        console.log("Action on task:", taskId);

        // Complete Toggle
        if (e.target.classList.contains('task-checkbox')) {
            console.log("Toggle complete for task:", taskId);
            toggleTaskComplete(taskId, e.target.checked);
        }

        // Edit Task
        if (e.target.closest('.edit-task')) {
            console.log("Edit task:", taskId);
            openEditModal(taskId);
        }

        // Delete Task
        if (e.target.closest('.delete-task')) {
            console.log("Delete task:", taskId);
            if (confirm('Are you sure you want to delete this task?')) {
                deleteTask(taskId);
            }
        }
    });

    // Save Changes in Edit Modal
    document.getElementById('save-task-changes')?.addEventListener('click', function() {
        const taskId = document.getElementById('edit-task-id').value;
        console.log("Saving changes for task:", taskId);
        updateTask(taskId);
    });
});

// Task Completion Toggle
function toggleTaskComplete(taskId, isComplete) {
    console.log(`Toggling task ${taskId} to ${isComplete ? 'complete' : 'incomplete'}`);
    fetch(`/toggle/${taskId}/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken'),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ complete: isComplete })
    })
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    })
    .then(data => {
        if (data.success) {
            console.log("Toggle successful for task:", taskId);
            const taskRow = document.querySelector(`tr[data-task-id="${taskId}"]`);
            if (taskRow) {
                taskRow.classList.toggle('table-light', data.complete);
                const titleSpan = taskRow.querySelector('td:nth-child(2) span');
                if (titleSpan) {
                    titleSpan.classList.toggle('text-decoration-line-through', data.complete);
                }
            }
        }
    })
    .catch(error => {
        console.error('Toggle error:', error);
        alert('Failed to update task status');
    });
}

// Edit Task Modal
function openEditModal(taskId) {
    console.log(`Fetching task data for: ${taskId}`);
    fetch(`/update/${taskId}/`)
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    })
    .then(data => {
        console.log("Received task data:", data);
        document.getElementById('edit-task-id').value = taskId;
        document.getElementById('id_title').value = data.title;
        document.getElementById('id_description').value = data.description || '';
        document.getElementById('id_priority').value = data.priority || 'M';
        document.getElementById('id_due_date').value = data.due_date || '';
        document.getElementById('id_complete').checked = data.complete || false;

        const modal = new bootstrap.Modal(document.getElementById('editTaskModal'));
        modal.show();
    })
    .catch(error => {
        console.error('Edit modal error:', error);
        alert('Failed to load task data');
    });
}

// Update Task
function updateTask(taskId) {
    console.log(`Updating task: ${taskId}`);
    const formData = new FormData(document.getElementById('edit-task-form'));
    
    fetch(`/update/${taskId}/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: formData
    })
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    })
    .then(data => {
        if (data.success) {
            console.log("Task updated successfully");
            location.reload();
        } else if (data.errors) {
            console.error("Form errors:", data.errors);
            alert('Please fix the errors: ' + Object.values(data.errors).join(', '));
        }
    })
    .catch(error => {
        console.error('Update error:', error);
        alert('Failed to update task');
    });
}

// Delete Task
function deleteTask(taskId) {
    console.log(`Deleting task: ${taskId}`);
    fetch(`/delete/${taskId}/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken'),
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    })
    .then(data => {
        if (data.success) {
            console.log("Task deleted successfully");
            const taskRow = document.querySelector(`tr[data-task-id="${taskId}"]`);
            if (taskRow) {
                taskRow.remove();
                
                // Show empty message if no tasks left
                if (!document.querySelector('#task-list tr:not([style*="display"])')) {
                    document.querySelector('#task-list').innerHTML = `
                        <tr>
                            <td colspan="5" class="text-center py-4 text-muted">
                                No tasks found. Click "Add Task" to create one.
                            </td>
                        </tr>
                    `;
                }
            }
        }
    })
    .catch(error => {
        console.error('Delete error:', error);
        alert('Failed to delete task');
    });
}

// Get CSRF Token
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}