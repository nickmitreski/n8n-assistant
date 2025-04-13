class TodoManager {
    constructor() {
        this.API_BASE_URL = window.API_BASE_URL || window.location.origin;
        this.todos = [];
        this.todosContainer = document.getElementById('todos-container');
        this.toast = document.getElementById('toast');
        this.init();
    }

    async init() {
        try {
            await this.fetchTodos();
            this.renderTodos();
            this.setupEventListeners();
        } catch (error) {
            this.showToast('Error initializing todos: ' + error.message);
            this.todos = [];
            this.renderTodos();
        }
    }

    async fetchTodos() {
        try {
            const response = await fetch(`${this.API_BASE_URL}/api/todos`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            this.todos = data || [];
        } catch (error) {
            this.showToast('Error fetching todos: ' + error.message);
            this.todos = [];
        }
    }

    renderTodos() {
        if (!this.todosContainer) return;

        this.todosContainer.innerHTML = '';
        this.todos.forEach((todo, index) => {
            const todoElement = this.createTodoElement(todo);
            todoElement.style.animationDelay = `${index * 0.1}s`;
            this.todosContainer.appendChild(todoElement);
        });
    }

    createTodoElement(todo) {
        const todoElement = document.createElement('div');
        todoElement.className = `todo ${todo.completed ? 'completed' : ''}`;
        todoElement.innerHTML = `
            <div class="todo-content">
                <input type="checkbox" ${todo.completed ? 'checked' : ''}>
                <span class="todo-text">${this.escapeHtml(todo.text)}</span>
            </div>
            <div class="todo-actions">
                <button class="edit-btn" title="Edit">✏️</button>
                <button class="delete-btn" title="Delete">🗑️</button>
            </div>
        `;

        // Add event listeners
        const checkbox = todoElement.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', () => this.toggleTodo(todo.id));

        const editBtn = todoElement.querySelector('.edit-btn');
        editBtn.addEventListener('click', () => this.editTodo(todo));

        const deleteBtn = todoElement.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => this.deleteTodo(todo.id));

        return todoElement;
    }

    setupEventListeners() {
        const addTodoBtn = document.createElement('button');
        addTodoBtn.className = 'add-todo-btn';
        addTodoBtn.innerHTML = '➕ Add Todo';
        addTodoBtn.addEventListener('click', () => this.showAddTodoModal());
        this.todosContainer.insertBefore(addTodoBtn, this.todosContainer.firstChild);
    }

    showAddTodoModal() {
        const text = prompt('Enter todo text:');
        if (text === null) return;

        this.createTodo(text);
    }

    async createTodo(text) {
        try {
            const response = await fetch(`${this.API_BASE_URL}/api/todos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, completed: false })
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            await this.fetchTodos();
            this.renderTodos();
        } catch (error) {
            this.showToast('Error creating todo: ' + error.message);
        }
    }

    async toggleTodo(todoId) {
        try {
            const todo = this.todos.find(t => t.id === todoId);
            if (!todo) throw new Error('Todo not found');

            const response = await fetch(`${this.API_BASE_URL}/api/todos/${todoId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed: !todo.completed })
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            await this.fetchTodos();
            this.renderTodos();
        } catch (error) {
            this.showToast('Error updating todo: ' + error.message);
        }
    }

    async editTodo(todo) {
        const text = prompt('Edit todo:', todo.text);
        if (text === null) return;

        try {
            const response = await fetch(`${this.API_BASE_URL}/api/todos/${todo.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text })
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            await this.fetchTodos();
            this.renderTodos();
        } catch (error) {
            this.showToast('Error updating todo: ' + error.message);
        }
    }

    async deleteTodo(todoId) {
        if (!confirm('Are you sure you want to delete this todo?')) return;

        try {
            const response = await fetch(`${this.API_BASE_URL}/api/todos/${todoId}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            await this.fetchTodos();
            this.renderTodos();
        } catch (error) {
            this.showToast('Error deleting todo: ' + error.message);
        }
    }

    showToast(message) {
        if (!this.toast) return;
        this.toast.textContent = message;
        this.toast.classList.add('show');
        setTimeout(() => this.toast.classList.remove('show'), 3000);
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

// Initialize the TodoManager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.todoManager = new TodoManager();
}); 