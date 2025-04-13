class TodoManager {
    constructor() {
        this.API_BASE_URL = window.location.origin;
        this.todos = [];
        this.init();
    }

    async init() {
        try {
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
            const response = await fetch(`${this.API_BASE_URL}/api/n8n/todos`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.todos = data.data || [];
        } catch (error) {
            console.error('Error fetching todos:', error);
            // Return empty array instead of throwing
            this.todos = [];
        }
    }

    // ... existing code ...
} 