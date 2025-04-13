const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;

// Supabase configuration
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://ihwsmbgkaqgreytmtbaw.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlod3NtYmdrYXFncmV5dG10YmF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzNjI2NTYsImV4cCI6MjA1OTkzODY1Nn0.UaHKR0ah7B8Xl7kPveexJhfOm8qrIq9uFUhZNxnPF4w';

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'https://n8n-assistant.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html with environment variables
app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, 'public', 'index.html');
  let html = fs.readFileSync(indexPath, 'utf8');
  
  // Replace environment variables
  html = html.replace('window.N8N_WEBHOOK_URL = \'http://localhost:5678/webhook-test\';', `window.N8N_WEBHOOK_URL = '${process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook-test'}';`);
  html = html.replace('window.ELEVENLABS_API_KEY = \'\';', `window.ELEVENLABS_API_KEY = '${process.env.ELEVENLABS_API_KEY || ''}';`);
  html = html.replace('window.ELEVENLABS_VOICE_ID = \'\';', `window.ELEVENLABS_VOICE_ID = '${process.env.ELEVENLABS_VOICE_ID || ''}';`);
  
  res.send(html);
});

// Todo API endpoints
// Get all todos
app.get('/api/todos', async (req, res) => {
  try {
    const response = await axios({
      method: 'GET',
      url: `${SUPABASE_URL}/rest/v1/todos?order=created_at.desc`,
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching todos:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch todos',
      details: error.message
    });
  }
});

// Create a todo
app.post('/api/todos', async (req, res) => {
  try {
    const { task } = req.body;
    
    if (!task) {
      return res.status(400).json({ error: 'Task is required' });
    }
    
    const response = await axios({
      method: 'POST',
      url: `${SUPABASE_URL}/rest/v1/todos`,
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      data: { task }
    });
    
    res.status(201).json(response.data[0]);
  } catch (error) {
    console.error('Error creating todo:', error.message);
    res.status(500).json({ 
      error: 'Failed to create todo',
      details: error.message
    });
  }
});

// Update a todo
app.patch('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const response = await axios({
      method: 'PATCH',
      url: `${SUPABASE_URL}/rest/v1/todos?id=eq.${id}`,
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      data: updates
    });
    
    res.json(response.data[0]);
  } catch (error) {
    console.error('Error updating todo:', error.message);
    res.status(500).json({ 
      error: 'Failed to update todo',
      details: error.message
    });
  }
});

// Delete a todo
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await axios({
      method: 'DELETE',
      url: `${SUPABASE_URL}/rest/v1/todos?id=eq.${id}`,
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting todo:', error.message);
    res.status(500).json({ 
      error: 'Failed to delete todo',
      details: error.message
    });
  }
});

// N8N Todo API endpoints
app.get('/api/n8n/todos', async (req, res) => {
  try {
    // For now, return an empty array
    res.json({ success: true, data: [] });
  } catch (error) {
    console.error('Error fetching todos:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch todos',
      details: error.message
    });
  }
});

app.post('/api/n8n/todos', async (req, res) => {
  try {
    // For now, just acknowledge the request
    res.json({ success: true, message: 'Todo created successfully' });
  } catch (error) {
    console.error('Error creating todo:', error.message);
    res.status(500).json({ 
      error: 'Failed to create todo',
      details: error.message
    });
  }
});

// Notes API endpoints
app.get('/api/notes', async (req, res) => {
  try {
    // For now, return an empty array
    res.json([]);
  } catch (error) {
    console.error('Error fetching notes:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch notes',
      details: error.message
    });
  }
});

app.post('/api/notes', async (req, res) => {
  try {
    // For now, just acknowledge the request
    res.json({ success: true, message: 'Note created successfully' });
  } catch (error) {
    console.error('Error creating note:', error.message);
    res.status(500).json({ 
      error: 'Failed to create note',
      details: error.message
    });
  }
});

app.patch('/api/notes/:id', async (req, res) => {
  try {
    // For now, just acknowledge the request
    res.json({ success: true, message: 'Note updated successfully' });
  } catch (error) {
    console.error('Error updating note:', error.message);
    res.status(500).json({ 
      error: 'Failed to update note',
      details: error.message
    });
  }
});

app.delete('/api/notes/:id', async (req, res) => {
  try {
    // For now, just acknowledge the request
    res.json({ success: true, message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error deleting note:', error.message);
    res.status(500).json({ 
      error: 'Failed to delete note',
      details: error.message
    });
  }
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 