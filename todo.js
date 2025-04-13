// Todo functionality
document.addEventListener('DOMContentLoaded', () => {
    // Check if todo container exists
    const todoContainer = document.getElementById('todo-container');
    if (!todoContainer) return;
    
    // Initialize todos
    fetchTodos();
    
    // Add event listener for the new task form
    const todoForm = document.getElementById('todo-form');
    if (todoForm) {
        todoForm.addEventListener('submit', handleNewTodo);
    }
});

// API base URL
const API_BASE_URL = window.location.origin;

// Fetch todos from the API
async function fetchTodos() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/n8n/todos`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch todos');
        }
        
        const result = await response.json();
        if (result.success) {
            renderTodos(result.data);
        } else {
            throw new Error(result.error || 'Failed to fetch todos');
        }
    } catch (error) {
        console.error('Error fetching todos:', error);
        showTodoError('Failed to load todo items');
    }
}

// Render todos in the list
function renderTodos(todos) {
    const todoList = document.getElementById('todo-list');
    if (!todoList) return;
    
    todoList.innerHTML = '';
    
    if (todos.length === 0) {
        todoList.innerHTML = '<div class="text-center text-muted py-3">No tasks yet. Add one above!</div>';
        return;
    }
    
    todos.forEach(todo => {
        const todoItem = document.createElement('div');
        todoItem.className = 'todo-item d-flex align-items-center p-2 border-bottom';
        todoItem.dataset.id = todo.id;
        
        // Create checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'form-check-input me-3';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('change', () => toggleTodoStatus(todo.id, checkbox.checked));
        
        // Create text element
        const todoText = document.createElement('div');
        todoText.className = 'flex-grow-1 todo-text';
        if (todo.completed) {
            todoText.classList.add('text-decoration-line-through', 'text-muted');
        }
        todoText.textContent = todo.task;
        
        // Create edit button
        const editBtn = document.createElement('button');
        editBtn.className = 'btn btn-sm btn-outline-secondary me-1';
        editBtn.innerHTML = '<i class="bi bi-pencil"></i>';
        editBtn.addEventListener('click', () => startEditingTodo(todo));
        
        // Create delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-sm btn-outline-danger ms-1';
        deleteBtn.innerHTML = '<i class="bi bi-trash"></i>';
        deleteBtn.addEventListener('click', () => deleteTodo(todo.id));
        
        // Append all elements
        todoItem.appendChild(checkbox);
        todoItem.appendChild(todoText);
        todoItem.appendChild(editBtn);
        todoItem.appendChild(deleteBtn);
        todoList.appendChild(todoItem);
    });
    
    // Update the counter
    updateTodoCount(todos);
}

// Handle form submission for new todo
async function handleNewTodo(event) {
    event.preventDefault();
    
    const taskInput = document.getElementById('new-task');
    const task = taskInput.value.trim();
    
    if (!task) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/n8n/todos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'create',
                todo: { task }
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to create todo');
        }
        
        const result = await response.json();
        if (result.success) {
            // Clear input
            taskInput.value = '';
            
            // Refresh todos
            fetchTodos();
            
            // Show success message
            showTodoSuccess('Task added successfully');
        } else {
            throw new Error(result.error || 'Failed to create todo');
        }
    } catch (error) {
        console.error('Error creating todo:', error);
        showTodoError('Failed to add task');
    }
}

// Toggle the completed status of a todo
async function toggleTodoStatus(id, completed) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/n8n/todos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'update',
                todo: { id, completed }
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to update todo status');
        }
        
        const result = await response.json();
        if (result.success) {
            // Refresh todos
            fetchTodos();
        } else {
            throw new Error(result.error || 'Failed to update todo status');
        }
    } catch (error) {
        console.error('Error updating todo status:', error);
        showTodoError('Failed to update task status');
    }
}

// Start editing a todo
function startEditingTodo(todo) {
    const todoItem = document.querySelector(`.todo-item[data-id="${todo.id}"]`);
    if (!todoItem) return;
    
    const todoText = todoItem.querySelector('.todo-text');
    const currentText = todo.task;
    
    // Create edit input
    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.className = 'form-control form-control-sm edit-todo-input';
    editInput.value = currentText;
    
    // Replace text with input
    todoText.innerHTML = '';
    todoText.appendChild(editInput);
    editInput.focus();
    
    // Handle save on enter
    editInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            saveTodoEdit(todo.id, editInput.value);
        } else if (e.key === 'Escape') {
            // Cancel edit
            todoText.innerHTML = currentText;
        }
    });
    
    // Handle save on blur
    editInput.addEventListener('blur', () => {
        saveTodoEdit(todo.id, editInput.value);
    });
}

// Save edited todo
async function saveTodoEdit(id, task) {
    if (!task.trim()) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/n8n/todos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'update',
                todo: { id, task }
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to update todo');
        }
        
        const result = await response.json();
        if (result.success) {
            // Refresh todos
            fetchTodos();
            
            // Show success message
            showTodoSuccess('Task updated successfully');
        } else {
            throw new Error(result.error || 'Failed to update todo');
        }
    } catch (error) {
        console.error('Error updating todo:', error);
        showTodoError('Failed to update task');
    }
}

// Delete a todo
async function deleteTodo(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/n8n/todos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'delete',
                todo: { id }
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete todo');
        }
        
        const result = await response.json();
        if (result.success) {
            // Refresh todos
            fetchTodos();
            
            // Show success message
            showTodoSuccess('Task deleted successfully');
        } else {
            throw new Error(result.error || 'Failed to delete todo');
        }
    } catch (error) {
        console.error('Error deleting todo:', error);
        showTodoError('Failed to delete task');
    }
}

// Update the todo count display
function updateTodoCount(todos) {
    const countElement = document.getElementById('todo-count');
    if (!countElement) return;
    
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    
    countElement.textContent = `${completed}/${total} completed`;
}

// Show success message
function showTodoSuccess(message) {
    showTodoMessage(message, 'success');
}

// Show error message
function showTodoError(message) {
    showTodoMessage(message, 'danger');
}

// Show message helper
function showTodoMessage(message, type) {
    const alertsContainer = document.getElementById('todo-alerts');
    if (!alertsContainer) return;
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    alertsContainer.appendChild(alert);
    
    // Auto dismiss after 3 seconds
    setTimeout(() => {
        alert.classList.remove('show');
        setTimeout(() => {
            alertsContainer.removeChild(alert);
        }, 150);
    }, 3000);
} 