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
app.use(express.static('public'));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

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
    
    if (response.data.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
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
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting todo:', error.message);
    res.status(500).json({ 
      error: 'Failed to delete todo',
      details: error.message
    });
  }
});

// Notes API endpoints
// Get all notes
app.get('/api/notes', async (req, res) => {
  try {
    const response = await axios({
      method: 'GET',
      url: `${SUPABASE_URL}/rest/v1/notes?order=created_at.desc`,
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching notes:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch notes',
      details: error.message
    });
  }
});

// Create a note
app.post('/api/notes', async (req, res) => {
  try {
    const { title, content, tags, is_pinned } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const response = await axios({
      method: 'POST',
      url: `${SUPABASE_URL}/rest/v1/notes`,
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      data: { title, content, tags, is_pinned }
    });
    
    res.status(201).json(response.data[0]);
  } catch (error) {
    console.error('Error creating note:', error.message);
    res.status(500).json({ 
      error: 'Failed to create note',
      details: error.message
    });
  }
});

// Update a note
app.patch('/api/notes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const response = await axios({
      method: 'PATCH',
      url: `${SUPABASE_URL}/rest/v1/notes?id=eq.${id}`,
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      data: updates
    });
    
    if (response.data.length === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    res.json(response.data[0]);
  } catch (error) {
    console.error('Error updating note:', error.message);
    res.status(500).json({ 
      error: 'Failed to update note',
      details: error.message
    });
  }
});

// Delete a note
app.delete('/api/notes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await axios({
      method: 'DELETE',
      url: `${SUPABASE_URL}/rest/v1/notes?id=eq.${id}`,
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting note:', error.message);
    res.status(500).json({ 
      error: 'Failed to delete note',
      details: error.message
    });
  }
});

// Proxy endpoint for n8n webhook
app.post('/api/proxy', async (req, res) => {
  try {
    console.log('Received proxy request:', req.body);
    const { message, webhook } = req.body;
    
    if (!message || !webhook) {
      return res.status(400).json({ error: 'Missing required parameters: message and webhook' });
    }
    
    const webhookUrl = `${webhook}?message=${encodeURIComponent(message)}`;
    console.log(`Forwarding to n8n webhook: ${webhookUrl}`);
    
    // Do a direct axios request with explicit timeout and headers
    try {
      console.log('Sending direct GET request to n8n...');
      const response = await axios.get(webhookUrl, {
        timeout: 10000, // 10 second timeout
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'AI-Chat-App/1.0'
        }
      });
      
      console.log('n8n response status:', response.status);
      console.log('n8n response data:', response.data);
      
      // Return the response data
      return res.json(response.data);
    } catch (webhookError) {
      console.error('Webhook error details:', {
        status: webhookError.response?.status,
        statusText: webhookError.response?.statusText,
        data: webhookError.response?.data,
        message: webhookError.message
      });
      
      // Try a direct fetch from client to n8n to bypass CORS issue
      console.log('Returning fetch instructions to client...');
      return res.json({
        direct_fetch: true,
        webhook_url: webhookUrl,
        error: webhookError.message,
        message: 'The app will try to directly fetch from n8n to bypass any proxy issues.'
      });
    }
  } catch (error) {
    console.error('Proxy error:', error.message);
    
    // Provide a fallback response
    return res.status(500).json({ 
      error: 'Failed to connect to n8n',
      details: error.message,
      simulated: true,
      message: `Could not connect to the n8n webhook. Your message was: "${req.body.message}"`
    });
  }
});

// Production webhook helper for n8n - simulates production-like behavior
app.post('/api/n8n-production', async (req, res) => {
  try {
    console.log('Received n8n-production request:', req.body);
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Missing required parameter: message' });
    }
    
    // Using the production webhook URL
    const webhookUrl = 'https://primary-production-26324.up.railway.app/webhook/55b6bcf5-21f7-4694-af80-ca870c2bbbd4';
    const fullUrl = `${webhookUrl}?message=${encodeURIComponent(message)}`;
    
    console.log(`Making production n8n request to: ${fullUrl}`);
    
    try {
      const response = await axios({
        method: 'get',
        url: fullUrl,
        timeout: 30000, // 30 second timeout
        maxRedirects: 5,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; n8nProductionClient/1.0)',
          'Accept': 'application/json, text/plain, */*',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        validateStatus: function (status) {
          return status < 500; // Resolve only if the status code is less than 500
        }
      });
      
      console.log('Production n8n response:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data
      });
      
      // Check for specific error messages in the response
      if (response.status === 500 && response.data && response.data.message === "Error in workflow") {
        return res.status(500).json({
          error: true,
          message: 'n8n workflow error',
          details: 'The n8n workflow encountered an error. Please check the n8n workflow configuration.',
          n8nError: response.data
        });
      }
      
      if (response.status === 200) {
        return res.json(response.data);
      } else {
        return res.status(response.status).json({
          error: true,
          message: 'n8n workflow error',
          details: response.data
        });
      }
    } catch (webhookError) {
      console.error('Production webhook error:', {
        message: webhookError.message,
        code: webhookError.code,
        response: webhookError.response?.data
      });
      
      // Handle specific error cases
      if (webhookError.code === 'ECONNREFUSED') {
        return res.status(503).json({
          error: true,
          message: 'n8n service is currently unavailable',
          details: 'Could not connect to the n8n server'
        });
      }
      
      if (webhookError.code === 'ETIMEDOUT' || webhookError.code === 'ECONNABORTED') {
        return res.status(504).json({
          error: true,
          message: 'n8n request timed out',
          details: 'The request took too long to complete'
        });
      }
      
      // Check if the error response contains the "Error in workflow" message
      if (webhookError.response && webhookError.response.data && webhookError.response.data.message === "Error in workflow") {
        return res.status(500).json({
          error: true,
          message: 'n8n workflow error',
          details: 'The n8n workflow encountered an error. Please check the n8n workflow configuration.',
          n8nError: webhookError.response.data
        });
      }
      
      return res.status(500).json({
        error: true,
        message: 'Error communicating with n8n',
        details: webhookError.message
      });
    }
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({
      error: true,
      message: 'Internal server error',
      details: error.message
    });
  }
});

// n8n todos endpoint
app.post('/api/n8n/todos', async (req, res) => {
  try {
    const { action, todo } = req.body;
    
    if (!action) {
      return res.status(400).json({ error: 'Action is required' });
    }
    
    let response;
    
    switch (action) {
      case 'read':
        response = await axios({
          method: 'GET',
          url: `${SUPABASE_URL}/rest/v1/todos?order=created_at.desc`,
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json'
          }
        });
        return res.json({ success: true, data: response.data });
        
      case 'create':
        if (!todo || !todo.task) {
          return res.status(400).json({ error: 'Task is required for create action' });
        }
        
        response = await axios({
          method: 'POST',
          url: `${SUPABASE_URL}/rest/v1/todos`,
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          data: { task: todo.task, completed: todo.completed || false }
        });
        
        return res.json({ success: true, todo: response.data[0] });
        
      case 'update':
        if (!todo || !todo.id) {
          return res.status(400).json({ error: 'Todo ID is required for update action' });
        }
        
        const updateData = {};
        if (todo.task !== undefined) updateData.task = todo.task;
        if (todo.completed !== undefined) updateData.completed = todo.completed;
        
        response = await axios({
          method: 'PATCH',
          url: `${SUPABASE_URL}/rest/v1/todos?id=eq.${todo.id}`,
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          data: updateData
        });
        
        return res.json({ success: true, todo: response.data[0] });
        
      case 'delete':
        if (!todo || !todo.id) {
          return res.status(400).json({ error: 'Todo ID is required for delete action' });
        }
        
        await axios({
          method: 'DELETE',
          url: `${SUPABASE_URL}/rest/v1/todos?id=eq.${todo.id}`,
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json'
          }
        });
        
        return res.json({ success: true, id: todo.id });
        
      default:
        return res.status(400).json({ error: `Unknown action: ${action}` });
    }
  } catch (error) {
    console.error('Error handling n8n todo action:', error.message);
    res.status(500).json({ 
      success: false,
      error: 'Failed to process todo action',
      details: error.message
    });
  }
});

// Alternative endpoint using a different approach to call n8n
app.post('/api/direct-n8n', async (req, res) => {
  try {
    console.log('Received direct-n8n request:', req.body);
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Missing required parameter: message' });
    }
    
    // Hard-coded webhook URL - using test webhook that works
    const webhookUrl = 'https://primary-production-26324.up.railway.app/webhook-test/55b6bcf5-21f7-4694-af80-ca870c2bbbd4';
    const fullUrl = `${webhookUrl}?message=${encodeURIComponent(message)}`;
    
    console.log(`Directly calling n8n webhook: ${fullUrl}`);
    
    try {
      // Use axios to make a GET request to the n8n webhook
      const response = await axios({
        method: 'get',
        url: fullUrl,
        timeout: 15000,
        maxRedirects: 5,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; n8n-test/1.0)',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });
      
      console.log('n8n direct response status:', response.status);
      console.log('n8n direct response data:', response.data);
      
      return res.json(response.data);
    } catch (webhookError) {
      console.error('Webhook error details:', {
        status: webhookError.response?.status,
        statusText: webhookError.response?.statusText,
        data: webhookError.response?.data,
        message: webhookError.message
      });
      
      // Handle test webhook expiration specifically
      if (webhookError.response?.status === 404 && 
          webhookError.response?.data?.hint?.includes('Test workflow')) {
        return res.json({
          simulated: true,
          test_expired: true,
          message: "Please click 'Test workflow' in n8n first",
          details: "Remember: test webhooks only work for one message after clicking 'Test workflow'"
        });
      }
      
      throw webhookError; // Let the outer catch handle other errors
    }
  } catch (error) {
    console.error('Direct n8n error:', error.message);
    
    if (error.response) {
      console.error('Error response status:', error.response.status);
      console.error('Error response data:', error.response.data);
      
      // Handle workflow errors
      if (error.response.status === 500) {
        return res.json({
          simulated: true,
          workflow_error: true,
          message: "Your n8n workflow encountered an error.",
          details: error.response.data?.message || "Unknown workflow error"
        });
      }
    }
    
    // Provide a fallback response with clear instructions
    return res.json({
      output: "I'm having trouble connecting to n8n. Please make sure you've clicked 'Test workflow' in your n8n interface before sending a message."
    });
  }
});

// Debug endpoint to test if API is working
app.get('/api/test', (req, res) => {
  res.json({ status: 'Proxy server is working' });
});

// Test endpoint for n8n webhook
app.get('/api/testwebhook', async (req, res) => {
  try {
    const webhookUrl = 'https://primary-production-26324.up.railway.app/webhook-test/55b6bcf5-21f7-4694-af80-ca870c2bbbd4?message=test';
    console.log(`Testing n8n webhook: ${webhookUrl}`);
    
    const response = await axios.get(webhookUrl);
    res.json({
      success: true,
      n8nResponse: response.data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      details: error.response ? {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      } : null
    });
  }
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Catch-all route handler for debugging
app.use((req, res, next) => {
  console.log(`Received request: ${req.method} ${req.url}`);
  next();
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 