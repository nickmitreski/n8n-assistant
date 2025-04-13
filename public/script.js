// Get environment variables from window object
const API_BASE_URL = window.API_BASE_URL || window.location.origin;
const SUPABASE_URL = window.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || '';

// Check if required environment variables are set
if (!SUPABASE_URL) {
    console.warn('SUPABASE_URL is not set');
}

if (!SUPABASE_ANON_KEY) {
    console.warn('SUPABASE_ANON_KEY is not set');
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    console.log('Application initialized');
    console.log('API Base URL:', API_BASE_URL);
    // Add your initialization code here
});

// ... existing code ... 