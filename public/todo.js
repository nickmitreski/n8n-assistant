class TodoManager {
    constructor() {
        this.API_BASE_URL = window.location.origin;
        this.todos = [];
        this.init();
    }

    async init() {
        try {
            console.log('Initializing TodoManager with API Base URL:', this.API_BASE_URL);
            await this.fetchTodos();
            this.renderTodos();
        } catch (error) {
            console.error('Error initializing todos:', error);
            // Show empty state instead of error
            this.todos = [];
            this.renderTodos();
        }
    }

    async fetchTodos() {
        try {
            console.log('Fetching todos from:', `${this.API_BASE_URL}/api/n8n/todos`);
            const response = await fetch(`${this.API_BASE_URL}/api/n8n/todos`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Fetched todos data:', data);
            this.todos = data.data || [];
        } catch (error) {
            console.error('Error fetching todos:', error);
            // Return empty array instead of throwing
            this.todos = [];
        }
    }

    renderTodos() {
        // Implementation for rendering todos
        console.log('Rendering todos:', this.todos);
    }

    // Add other methods as needed
}

// Initialize the TodoManager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.todoManager = new TodoManager();
}); 