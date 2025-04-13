// Notes functionality
class NotesManager {
    constructor() {
        this.notes = [];
        this.baseUrl = window.location.origin;
        this.init();
    }

    async init() {
        this.addNoteBtn = document.getElementById('add-note');
        this.notesList = document.getElementById('notes-list');
        
        this.addNoteBtn.addEventListener('click', () => this.showNoteModal());
        await this.loadNotes();
    }

    async loadNotes() {
        try {
            const response = await fetch(`${this.baseUrl}/api/notes`);
            if (!response.ok) throw new Error('Failed to fetch notes');
            
            this.notes = await response.json();
            this.renderNotes();
        } catch (error) {
            console.error('Error loading notes:', error);
            this.showError('Failed to load notes');
        }
    }

    renderNotes() {
        this.notesList.innerHTML = '';
        
        // Sort notes: pinned first, then by updated_at
        const sortedNotes = [...this.notes].sort((a, b) => {
            if (a.is_pinned !== b.is_pinned) return b.is_pinned - a.is_pinned;
            return new Date(b.updated_at) - new Date(a.updated_at);
        });
        
        sortedNotes.forEach((note, index) => {
            const noteElement = this.createNoteElement(note);
            noteElement.style.animationDelay = `${index * 0.1}s`;
            this.notesList.appendChild(noteElement);
        });
    }

    createNoteElement(note) {
        const col = document.createElement('div');
        col.className = 'col-md-4 fade-in';
        
        col.innerHTML = `
            <div class="card h-100 ${note.is_pinned ? 'border-primary' : ''}">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="card-title mb-0">${this.escapeHtml(note.title)}</h5>
                    <div class="btn-group">
                        <button class="btn btn-sm btn-outline-secondary pin-note ${note.is_pinned ? 'active' : ''}" data-id="${note.id}" title="${note.is_pinned ? 'Unpin note' : 'Pin note'}">
                            <i class="bi bi-pin${note.is_pinned ? '-fill' : ''}"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-primary edit-note" data-id="${note.id}" title="Edit note">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-note" data-id="${note.id}" title="Delete note">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    <p class="card-text">${this.escapeHtml(note.content || '')}</p>
                    ${note.tags && note.tags.length > 0 ? `
                        <div class="tags">
                            ${note.tags.map(tag => `<span class="badge">${this.escapeHtml(tag)}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
                <div class="card-footer text-muted">
                    <small>Last updated: ${new Date(note.updated_at).toLocaleString()}</small>
                </div>
            </div>
        `;

        // Add event listeners
        col.querySelector('.pin-note').addEventListener('click', () => this.togglePin(note.id));
        col.querySelector('.edit-note').addEventListener('click', () => this.editNote(note.id));
        col.querySelector('.delete-note').addEventListener('click', () => this.deleteNote(note.id));

        return col;
    }

    showNoteModal(note = null) {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.id = 'noteModal';
        
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${note ? 'Edit Note' : 'New Note'}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="noteForm">
                            <div class="mb-3">
                                <label for="noteTitle" class="form-label">Title</label>
                                <input type="text" class="form-control" id="noteTitle" required value="${note?.title || ''}" placeholder="Enter note title">
                            </div>
                            <div class="mb-3">
                                <label for="noteContent" class="form-label">Content</label>
                                <textarea class="form-control" id="noteContent" rows="5" placeholder="Enter note content">${note?.content || ''}</textarea>
                            </div>
                            <div class="mb-3">
                                <label for="noteTags" class="form-label">Tags (comma-separated)</label>
                                <input type="text" class="form-control" id="noteTags" value="${note?.tags?.join(', ') || ''}" placeholder="Enter tags separated by commas">
                            </div>
                            <div class="mb-3 form-check">
                                <input type="checkbox" class="form-check-input" id="notePinned" ${note?.is_pinned ? 'checked' : ''}>
                                <label class="form-check-label" for="notePinned">Pin note</label>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" id="saveNote">Save</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        const modalInstance = new bootstrap.Modal(modal);
        
        // Focus on title input
        setTimeout(() => {
            modal.querySelector('#noteTitle').focus();
        }, 500);
        
        modal.querySelector('#saveNote').addEventListener('click', async () => {
            const formData = {
                title: modal.querySelector('#noteTitle').value.trim(),
                content: modal.querySelector('#noteContent').value.trim(),
                tags: modal.querySelector('#noteTags').value.split(',').map(tag => tag.trim()).filter(tag => tag),
                is_pinned: modal.querySelector('#notePinned').checked
            };

            try {
                if (note) {
                    await this.updateNote(note.id, formData);
                } else {
                    await this.createNote(formData);
                }
                modalInstance.hide();
                modal.remove();
                await this.loadNotes();
            } catch (error) {
                console.error('Error saving note:', error);
                this.showError('Failed to save note');
            }
        });

        modalInstance.show();
        modal.addEventListener('hidden.bs.modal', () => modal.remove());
    }

    async createNote(noteData) {
        const response = await fetch(`${this.baseUrl}/api/notes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(noteData)
        });

        if (!response.ok) throw new Error('Failed to create note');
        return response.json();
    }

    async updateNote(id, noteData) {
        const response = await fetch(`${this.baseUrl}/api/notes/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(noteData)
        });

        if (!response.ok) throw new Error('Failed to update note');
        return response.json();
    }

    async deleteNote(id) {
        if (!confirm('Are you sure you want to delete this note?')) return;

        try {
            const response = await fetch(`${this.baseUrl}/api/notes/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete note');
            await this.loadNotes();
        } catch (error) {
            console.error('Error deleting note:', error);
            this.showError('Failed to delete note');
        }
    }

    async togglePin(id) {
        const note = this.notes.find(n => n.id === id);
        if (!note) return;

        try {
            await this.updateNote(id, { is_pinned: !note.is_pinned });
            await this.loadNotes();
        } catch (error) {
            console.error('Error toggling pin:', error);
            this.showError('Failed to update note');
        }
    }

    editNote(id) {
        const note = this.notes.find(n => n.id === id);
        if (note) {
            this.showNoteModal(note);
        }
    }

    showError(message) {
        const toast = document.createElement('div');
        toast.className = 'toast align-items-center text-white bg-danger border-0 position-fixed bottom-0 end-0 m-3';
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.setAttribute('aria-atomic', 'true');
        
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;
        
        document.body.appendChild(toast);
        const toastInstance = new bootstrap.Toast(toast, { delay: 3000 });
        toastInstance.show();
        
        toast.addEventListener('hidden.bs.toast', () => toast.remove());
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

// Initialize notes manager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.notesManager = new NotesManager();
}); 