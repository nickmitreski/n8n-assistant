class NotesManager {
    constructor() {
        this.API_BASE_URL = window.API_BASE_URL || window.location.origin;
        this.notes = [];
        this.notesContainer = document.getElementById('notes-container');
        this.toast = document.getElementById('toast');
        this.init();
    }

    async init() {
        try {
            await this.loadNotes();
            this.renderNotes();
            this.setupEventListeners();
        } catch (error) {
            this.showToast('Error initializing notes: ' + error.message);
            this.notes = [];
            this.renderNotes();
        }
    }

    async loadNotes() {
        try {
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
            this.notes = data.data || [];
        } catch (error) {
            this.showToast('Error loading notes: ' + error.message);
            this.notes = [];
        }
    }

    renderNotes() {
        if (!this.notesContainer) return;

        // Sort notes by pinned status and updated date
        const sortedNotes = [...this.notes].sort((a, b) => {
            if (a.pinned !== b.pinned) return b.pinned - a.pinned;
            return new Date(b.updated_at) - new Date(a.updated_at);
        });

        this.notesContainer.innerHTML = '';
        sortedNotes.forEach((note, index) => {
            const noteElement = this.createNoteElement(note);
            noteElement.style.animationDelay = `${index * 0.1}s`;
            this.notesContainer.appendChild(noteElement);
        });
    }

    createNoteElement(note) {
        const noteElement = document.createElement('div');
        noteElement.className = `note ${note.pinned ? 'pinned' : ''}`;
        noteElement.innerHTML = `
            <div class="note-header">
                <h3>${this.escapeHtml(note.title)}</h3>
                <div class="note-actions">
                    <button class="pin-btn" title="${note.pinned ? 'Unpin' : 'Pin'}">
                        ${note.pinned ? '📌' : '📍'}
                    </button>
                    <button class="edit-btn" title="Edit">✏️</button>
                    <button class="delete-btn" title="Delete">🗑️</button>
                </div>
            </div>
            <p>${this.escapeHtml(note.content)}</p>
            <div class="note-footer">
                <small>Last updated: ${new Date(note.updated_at).toLocaleString()}</small>
            </div>
        `;

        // Add event listeners
        noteElement.querySelector('.pin-btn').addEventListener('click', () => this.togglePin(note.id));
        noteElement.querySelector('.edit-btn').addEventListener('click', () => this.editNote(note));
        noteElement.querySelector('.delete-btn').addEventListener('click', () => this.deleteNote(note.id));

        return noteElement;
    }

    async togglePin(noteId) {
        try {
            const note = this.notes.find(n => n.id === noteId);
            if (!note) throw new Error('Note not found');

            const response = await fetch(`${this.API_BASE_URL}/api/notes/${noteId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pinned: !note.pinned })
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            await this.loadNotes();
            this.renderNotes();
        } catch (error) {
            this.showToast('Error toggling pin: ' + error.message);
        }
    }

    async editNote(note) {
        const title = prompt('Edit title:', note.title);
        if (title === null) return;

        const content = prompt('Edit content:', note.content);
        if (content === null) return;

        try {
            const response = await fetch(`${this.API_BASE_URL}/api/notes/${note.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content })
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            await this.loadNotes();
            this.renderNotes();
        } catch (error) {
            this.showToast('Error updating note: ' + error.message);
        }
    }

    async deleteNote(noteId) {
        if (!confirm('Are you sure you want to delete this note?')) return;

        try {
            const response = await fetch(`${this.API_BASE_URL}/api/notes/${noteId}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            await this.loadNotes();
            this.renderNotes();
        } catch (error) {
            this.showToast('Error deleting note: ' + error.message);
        }
    }

    setupEventListeners() {
        const addNoteBtn = document.createElement('button');
        addNoteBtn.className = 'add-note-btn';
        addNoteBtn.innerHTML = '➕ Add Note';
        addNoteBtn.addEventListener('click', () => this.showAddNoteModal());
        this.notesContainer.insertBefore(addNoteBtn, this.notesContainer.firstChild);
    }

    showAddNoteModal() {
        const title = prompt('Enter note title:');
        if (title === null) return;

        const content = prompt('Enter note content:');
        if (content === null) return;

        this.createNote(title, content);
    }

    async createNote(title, content) {
        try {
            const response = await fetch(`${this.API_BASE_URL}/api/notes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content, pinned: false })
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            await this.loadNotes();
            this.renderNotes();
        } catch (error) {
            this.showToast('Error creating note: ' + error.message);
        }
    }

    async updateNote(noteId, updates) {
        try {
            const response = await fetch(`${this.API_BASE_URL}/api/notes/${noteId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            await this.loadNotes();
            this.renderNotes();
        } catch (error) {
            this.showToast('Error updating note: ' + error.message);
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

// Initialize the notes manager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const notesManager = new NotesManager();
    notesManager.init();
}); 