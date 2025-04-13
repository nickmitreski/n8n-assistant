class NotesManager {
    constructor() {
        this.API_BASE_URL = window.location.origin;
        this.notes = [];
        this.init();
    }

    async init() {
        try {
            console.log('Initializing NotesManager with API Base URL:', this.API_BASE_URL);
            await this.loadNotes();
            this.renderNotes();
        } catch (error) {
            console.error('Error initializing notes:', error);
            // Show empty state instead of error
            this.notes = [];
            this.renderNotes();
        }
    }

    async loadNotes() {
        try {
            console.log('Loading notes from:', `${this.API_BASE_URL}/api/notes`);
            const response = await fetch(`${this.API_BASE_URL}/api/notes`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Loaded notes data:', data);
            this.notes = data || [];
        } catch (error) {
            console.error('Error loading notes:', error);
            // Return empty array instead of throwing
            this.notes = [];
        }
    }

    renderNotes() {
        // Implementation for rendering notes
        console.log('Rendering notes:', this.notes);
    }

    // Add other methods as needed
}

// Initialize the NotesManager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.notesManager = new NotesManager();
}); 