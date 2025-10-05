// Tasks-specific JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeTasks();
});

function initializeTasks() {
    // Add task form enhancement
    enhanceTaskForm();
    
    // Add due date validation
    validateDueDates();
    
    // Add search functionality
    addSearchFunctionality();
}

function enhanceTaskForm() {
    const taskForm = document.querySelector('.task-form form');
    if (taskForm) {
        const titleInput = taskForm.querySelector('input[name="title"]');
        const charCount = document.createElement('div');
        charCount.className = 'char-count';
        charCount.style.fontSize = '12px';
        charCount.style.color = '#666';
        charCount.style.marginTop = '5px';
        titleInput.parentNode.appendChild(charCount);
        
        titleInput.addEventListener('input', function() {
            const remaining = 100 - this.value.length;
            charCount.textContent = `${remaining} characters remaining`;
            
            if (remaining < 20) {
                charCount.style.color = '#e74c3c';
            } else if (remaining < 50) {
                charCount.style.color = '#f39c12';
            } else {
                charCount.style.color = '#666';
            }
        });
    }
}

function validateDueDates() {
    const dueDateInputs = document.querySelectorAll('input[type="datetime-local"]');
    dueDateInputs.forEach(input => {
        input.addEventListener('change', function() {
            const selectedDate = new Date(this.value);
            const now = new Date();
            
            if (selectedDate < now) {
                this.setCustomValidity('Due date cannot be in the past');
            } else {
                this.setCustomValidity('');
            }
        });
    });
}

function addSearchFunctionality() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search tasks...';
    searchInput.style.marginBottom = '20px';
    searchInput.style.padding = '10px';
    searchInput.style.width = '100%';
    searchInput.style.border = '2px solid #ddd';
    searchInput.style.borderRadius = '5px';
    
    const filters = document.querySelector('.filters');
    if (filters) {
        filters.parentNode.insertBefore(searchInput, filters);
        
        searchInput.addEventListener('input', TodoApp.debounce(function() {
            const searchTerm = this.value.toLowerCase();
            const taskItems = document.querySelectorAll('.task-item');
            
            taskItems.forEach(item => {
                const title = item.querySelector('h3').textContent.toLowerCase();
                const description = item.querySelector('p') ? item.querySelector('p').textContent.toLowerCase() : '';
                
                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        }, 300));
    }
}

// Task status update with enhanced UI
async function updateTaskStatus(taskId, status) {
    const taskItem = document.querySelector(`[onclick*="${taskId}"]`).closest('.task-item');
    
    try {
        // Show loading state
        const button = taskItem.querySelector(`[onclick*="${taskId}"]`);
        const originalText = button.textContent;
        button.disabled = true;
        button.textContent = 'Updating...';
        
        const response = await fetch(`/tasks/${taskId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status })
        });
        
        if (response.ok) {
            // Update UI immediately for better UX
            taskItem.classList.remove('pending', 'completed');
            taskItem.classList.add(status);
            
            // Update button text and functionality
            if (status === 'completed') {
                button.textContent = 'Mark Pending';
                button.setAttribute('onclick', `updateTaskStatus('${taskId}', 'pending')`);
                button.className = 'btn-pending';
            } else {
                button.textContent = 'Complete';
                button.setAttribute('onclick', `updateTaskStatus('${taskId}', 'completed')`);
                button.className = 'btn-complete';
            }
            
            TodoApp.showNotification('Task updated successfully!', 'success');
        } else {
            throw new Error('Failed to update task');
        }
    } catch (error) {
        console.error('Error updating task:', error);
        TodoApp.showNotification('Error updating task. Please try again.', 'error');
        
        // Reset button state
        const button = taskItem.querySelector(`[onclick*="${taskId}"]`);
        button.disabled = false;
        button.textContent = status === 'completed' ? 'Complete' : 'Mark Pending';
    }
}

// Enhanced delete task with confirmation
async function deleteTask(taskId) {
    const taskItem = document.querySelector(`[onclick*="deleteTask('${taskId}')"]`).closest('.task-item');
    const taskTitle = taskItem.querySelector('h3').textContent;
    
    if (confirm(`Are you sure you want to delete "${taskTitle}"? This action cannot be undone.`)) {
        try {
            // Show loading state
            const button = taskItem.querySelector(`[onclick*="deleteTask('${taskId}')"]`);
            const originalText = button.textContent;
            button.disabled = true;
            button.textContent = 'Deleting...';
            
            const response = await fetch(`/tasks/${taskId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                // Smooth removal animation
                taskItem.style.opacity = '0';
                taskItem.style.transform = 'translateX(-100px)';
                taskItem.style.transition = 'all 0.3s ease';
                
                setTimeout(() => {
                    taskItem.remove();
                    TodoApp.showNotification('Task deleted successfully!', 'success');
                    
                    // Show no tasks message if all tasks are gone
                    const remainingTasks = document.querySelectorAll('.task-item').length;
                    if (remainingTasks === 0) {
                        const tasksList = document.querySelector('.tasks-list');
                        const noTasksMessage = document.createElement('p');
                        noTasksMessage.className = 'no-tasks';
                        noTasksMessage.textContent = 'No tasks found. Add a new task above!';
                        tasksList.appendChild(noTasksMessage);
                    }
                }, 300);
            } else {
                throw new Error('Failed to delete task');
            }
        } catch (error) {
            console.error('Error deleting task:', error);
            TodoApp.showNotification('Error deleting task. Please try again.', 'error');
            
            // Reset button state
            const button = taskItem.querySelector(`[onclick*="deleteTask('${taskId}')"]`);
            button.disabled = false;
            button.textContent = originalText;
        }
    }
}