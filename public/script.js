// Get environment variables from window object with fallbacks
const N8N_WEBHOOK_URL = window.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook-test';
const ELEVENLABS_API_KEY = window.ELEVENLABS_API_KEY || '';
const ELEVENLABS_VOICE_ID = window.ELEVENLABS_VOICE_ID || '';

// Check if required environment variables are set
if (!ELEVENLABS_API_KEY) {
    console.warn('ELEVENLABS_API_KEY is not set');
}

if (!ELEVENLABS_VOICE_ID) {
    console.warn('ELEVENLABS_VOICE_ID is not set');
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    console.log('Application initialized');
    // Add your initialization code here
});

// ... existing code ... 