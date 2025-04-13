// Configuration
const config = {
    n8nWebhook: process.env.N8N_WEBHOOK_URL || 'https://primary-production-26324.up.railway.app/webhook/55b6bcf5-21f7-4694-af80-ca870c2bbbd4',
    elevenlabsApiKey: process.env.ELEVENLABS_API_KEY || '',
    elevenlabsVoiceId: process.env.ELEVENLABS_VOICE_ID || '5Q0t7uMcjvnagumLfvZi',
    openaiApiKey: process.env.OPENAI_API_KEY || ''
};

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

// DOM Elements
const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const voiceInputButton = document.getElementById('voice-input-button');
const voiceOutputToggle = document.getElementById('voice-output-toggle');
const statusElement = document.getElementById('status');
const clearChatButton = document.getElementById('clear-chat');

// State
let isRecording = false;
let mediaRecorder = null;
let audioChunks = [];
let isWaitingForResponse = false;
let conversationHistory = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Set up event listeners
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') sendMessage();
    });
    voiceInputButton.addEventListener('click', toggleVoiceInput);
    clearChatButton.addEventListener('click', clearChat);
    
    // Add dark mode toggle functionality
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleDarkMode);
        
        // Check for saved theme preference or respect OS preference
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.documentElement.setAttribute('data-bs-theme', 'dark');
            updateThemeButtonText();
        }
    }
    
    // Display welcome message
    updateStatus('Ready to chat!');
    
    // Add welcome message
    addMessageToChat("Hello! I'm your AI assistant. How can I help you today?", 'ai');
    conversationHistory.push({
        sender: 'ai',
        message: "Hello! I'm your AI assistant. How can I help you today?",
        timestamp: new Date().toISOString()
    });
    
    // Load previous conversation if available
    const savedConversation = localStorage.getItem('chatHistory');
    if (savedConversation) {
        try {
            const parsedConversation = JSON.parse(savedConversation);
            conversationHistory = parsedConversation;
            
            // Clear the welcome message
            chatMessages.innerHTML = '';
            
            // Display previous messages
            conversationHistory.forEach(item => {
                addMessageToChat(item.message, item.sender);
            });
        } catch (e) {
            console.error('Error loading saved conversation:', e);
        }
    }
});

// Functions
function sendMessage() {
    const message = messageInput.value.trim();
    if (message === '' || isWaitingForResponse) return;
    
    // Add user message to chat
    addMessageToChat(message, 'user');
    
    // Store in conversation history
    conversationHistory.push({
        sender: 'user',
        message: message,
        timestamp: new Date().toISOString()
    });
    
    // Save conversation to localStorage
    localStorage.setItem('chatHistory', JSON.stringify(conversationHistory));
    
    // Clear input
    messageInput.value = '';
    
    // Send to n8n webhook
    sendToN8n(message);
}

function addMessageToChat(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', `${sender}-message`);
    
    // Add actual message text
    messageElement.textContent = message;
    
    // Add timestamp
    const timestamp = document.createElement('div');
    timestamp.classList.add('message-time');
    timestamp.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    messageElement.appendChild(timestamp);
    
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function sendToN8n(message) {
    // Add loading indicator
    const loadingEl = document.createElement('div');
    loadingEl.id = 'loading-message';
    loadingEl.className = 'message ai-message';
    loadingEl.innerHTML = `
        <div class="message-content">
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    chatMessages.appendChild(loadingEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Set a timer for long requests
    const longRequestTimer = setTimeout(() => {
        if (loadingEl.parentNode) {
            loadingEl.textContent = 'Still working on this';
            updateStatus('Processing a complex request...');
        }
    }, 5000);
    
    // Use the production endpoint that handles n8n webhook calls reliably
    fetch('/api/n8n-production', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: message
        })
    })
    .then(response => {
        // Clear the long request timer
        clearTimeout(longRequestTimer);
        
        // If the response is not ok, we'll throw an error with details
        if (!response.ok) {
            return response.json().then(errorData => {
                const enhancedError = new Error(errorData.message || 'Unknown error');
                enhancedError.status = response.status;
                enhancedError.data = errorData;
                throw enhancedError;
            });
        }
        return response.json();
    })
    .then(data => {
        // Remove loading indicator
        const loadingElement = document.getElementById('loading-message');
        if (loadingElement) {
            chatMessages.removeChild(loadingElement);
        }
        
        // Process the response
        processN8nResponse(data);
    })
    .catch(error => {
        // Clear the long request timer
        clearTimeout(longRequestTimer);
        
        console.error('Error with production endpoint:', error);
        
        // Remove loading indicator
        const loadingElement = document.getElementById('loading-message');
        if (loadingElement) {
            chatMessages.removeChild(loadingElement);
        }
        
        // Add error message to chat
        const errorMessage = document.createElement('div');
        errorMessage.className = 'message ai-message error-message';
        
        let userFriendlyMessage = 'Sorry, there was an error processing your request.';
        
        if (error.status === 503) {
            userFriendlyMessage = 'Sorry, the AI service is currently unavailable. Please try again later.';
        } else if (error.status === 504) {
            userFriendlyMessage = 'The request took too long to complete. Please try again.';
        } else if (error.data?.message === 'n8n workflow error') {
            userFriendlyMessage = 'The AI workflow encountered an error. This is likely a configuration issue with the n8n workflow. Please try again later or contact the administrator.';
        } else if (error.data?.message) {
            userFriendlyMessage = `Error: ${error.data.message}`;
        }
        
        errorMessage.innerHTML = `
            <div class="message-content">
                <div class="error-icon">⚠️</div>
                <div class="error-text">${userFriendlyMessage}</div>
            </div>
        `;
        
        chatMessages.appendChild(errorMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Update status
        updateStatus('Error occurred');
    });
}

function simulateAIResponse(userMessage) {
    // Simulate network delay
    setTimeout(() => {
        // Remove loading indicator
        const loadingElement = document.getElementById('loading-message');
        if (loadingElement) {
            chatMessages.removeChild(loadingElement);
        }
        
        // Generate a mock response based on the user's message
        let response;
        const lowerMessage = userMessage.toLowerCase();
        
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            response = "Hello! How can I help you today?";
        } else if (lowerMessage.includes('how are you')) {
            response = "I'm just a simulation right now, but I'm working well! How are you?";
        } else if (lowerMessage.includes('weather')) {
            response = "I don't have access to real-time weather data in this simulation. In the full implementation, I could connect to a weather API through n8n.";
        } else if (lowerMessage.includes('help')) {
            response = "I can answer questions and assist with tasks. What do you need help with?";
        } else if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
            response = "Goodbye! Have a great day!";
        } else if (lowerMessage.includes('cors') || lowerMessage.includes('error')) {
            response = "I see you're asking about CORS issues. The direct connection to n8n webhook is blocked by CORS. You'll need to create a backend proxy or configure CORS on your n8n server. Check the README for more information.";
        } else {
            response = "This is a simulated response. In a production environment, this would come from your n8n webhook. To make this work properly, you'll need to create a backend proxy or use a CORS-enabled endpoint.";
        }
        
        // Add AI message to chat
        addMessageToChat(response, 'ai');
        
        // Store in conversation history
        conversationHistory.push({
            sender: 'ai',
            message: response,
            timestamp: new Date().toISOString()
        });
        
        // Save conversation to localStorage
        localStorage.setItem('chatHistory', JSON.stringify(conversationHistory));
        
        // If voice output is enabled, speak the response
        if (voiceOutputToggle.checked) {
            speakWithElevenlabs(response);
        }
        
        updateStatus('Response received');
        isWaitingForResponse = false;
    }, 1500);
}

// For actual implementation using the server.js proxy
function callN8nWithProxy(message) {
    // This function uses the included server.js proxy
    // Make sure the server is running with 'npm start'
    const proxyUrl = '/api/proxy';
    
    fetch(proxyUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: message,
            webhook: config.n8nWebhook
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Handle case where server suggests direct fetching
        if (data.direct_fetch && data.webhook_url) {
            console.log('Server suggested direct fetch, attempting...');
            return directFetchFromN8n(data.webhook_url);
        }
        
        // Remove loading indicator
        const loadingElement = document.getElementById('loading-message');
        if (loadingElement) {
            chatMessages.removeChild(loadingElement);
        }
        
        // Process the response
        processN8nResponse(data);
    })
    .catch(error => {
        console.error('Error:', error);
        
        // Remove loading indicator
        const loadingElement = document.getElementById('loading-message');
        if (loadingElement) {
            chatMessages.removeChild(loadingElement);
        }
        
        addMessageToChat('Sorry, there was an error connecting to the service.', 'ai');
        updateStatus('Error: Failed to get response');
        isWaitingForResponse = false;
    });
}

// Direct fetch to n8n as a fallback when proxy fails
function directFetchFromN8n(webhookUrl) {
    console.log('Attempting direct fetch from n8n:', webhookUrl);
    
    updateStatus('Trying direct connection to n8n...');
    
    // Attempt to fetch directly from n8n (may still fail due to CORS)
    fetch(webhookUrl, {
        method: 'GET',
        mode: 'cors', // Try with CORS enabled
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Direct fetch failed');
        }
        return response.json();
    })
    .then(data => {
        console.log('Direct fetch succeeded:', data);
        
        // Remove loading indicator
        const loadingElement = document.getElementById('loading-message');
        if (loadingElement) {
            chatMessages.removeChild(loadingElement);
        }
        
        // Process the response
        processN8nResponse(data);
    })
    .catch(error => {
        console.error('Direct fetch error:', error);
        
        // Fall back to a hardcoded response since both proxy and direct fetch failed
        let fallbackResponse = {
            output: "I'm having trouble connecting to the n8n service right now. Please check your network connection and n8n configuration, then try again."
        };
        
        // Remove loading indicator
        const loadingElement = document.getElementById('loading-message');
        if (loadingElement) {
            chatMessages.removeChild(loadingElement);
        }
        
        // Process the fallback response
        processN8nResponse(fallbackResponse);
    });
}

function processN8nResponse(data) {
    // Extract the AI response from the n8n webhook response
    console.log('Processing n8n response:', data);
    
    let aiResponse;
    
    // Handle n8n responses with output property (specific to this n8n workflow)
    if (data && data.output) {
        aiResponse = data.output;
    }
    // Handle test webhook expiration
    else if (data && data.test_expired) {
        aiResponse = "⚠️ Please click 'Test workflow' in n8n first";
        
        if (data.details) {
            aiResponse += "\n\n" + data.details;
            aiResponse += "\n\n1. Click 'Open n8n' above";
            aiResponse += "\n2. Navigate to your workflow";
            aiResponse += "\n3. Click the blue 'Test workflow' button";
            aiResponse += "\n4. Return here and send your message";
        }
    }
    // Handle test mode expired case
    else if (data && data.test_mode_expired) {
        aiResponse = data.message;
        
        // Add a more contextual message based on what they were trying to do
        const userQuery = data.original_message?.toLowerCase() || '';
        
        if (userQuery.includes('hello') || userQuery.includes('hi')) {
            aiResponse += "\n\nIf you're trying to say hello, I'd love to respond properly. Please activate the test webhook first.";
        } else if (userQuery.includes('help')) {
            aiResponse += "\n\nI see you're asking for help. Once you activate the test webhook, I'll be able to assist you with your specific request.";
        } else {
            aiResponse += "\n\nOnce the test webhook is activated, I'll be able to process your request properly.";
        }
        
        // Add web view link to n8n
        aiResponse += "\n\nClick the blue 'Open n8n to Activate Test' button below to reactivate the test webhook.";
    }
    // Handle n8n error responses
    else if (data && data.n8n_error) {
        aiResponse = data.message;
        // Add additional details if available
        if (data.original_error && typeof data.original_error === 'object') {
            aiResponse += "\n\nError details: " + (data.original_error.message || JSON.stringify(data.original_error));
        }
        // Add a troubleshooting tip
        aiResponse += "\n\nTroubleshooting tip: Check that your n8n workflow is active and properly configured to handle webhook triggers. The workflow needs to have a Webhook node as the trigger and must be active.";
    }
    // Handle direct n8n responses that indicate an error
    else if (data && data.n8n_response) {
        aiResponse = data.message;
        
        // If this is the specific "Workflow could not be started" error
        if (data.original_error && 
            data.original_error.message && 
            data.original_error.message.includes("Workflow could not be started")) {
            
            aiResponse += "\n\nThis usually happens when there's an issue in the workflow configuration. Here are some things to check:";
            aiResponse += "\n- Make sure all nodes in your workflow are properly configured";
            aiResponse += "\n- Check that any credentials used in the workflow are valid";
            aiResponse += "\n- Look for any error indicators in the n8n workflow editor";
            aiResponse += "\n- Review the execution logs in n8n for more details";
        }
    }
    // Handle workflow inactive case specifically
    else if (data && data.workflow_inactive) {
        aiResponse = data.message;
        
        // Generate a more helpful response based on the user's message
        const userQuery = data.original_message.toLowerCase();
        
        if (userQuery.includes('hello') || userQuery.includes('hi')) {
            aiResponse += "\n\nIn the meantime, hello! How can I help you today? (This is a simulated response)";
        } else if (userQuery.includes('how are you')) {
            aiResponse += "\n\nIn the meantime, I'm doing well! How are you? (This is a simulated response)";
        } else if (userQuery.includes('help')) {
            aiResponse += "\n\nIn the meantime, I'd be happy to help! What do you need assistance with? (This is a simulated response)";
        } else if (userQuery.includes('weather')) {
            aiResponse += "\n\nIn the meantime, I don't have access to real weather data in simulation mode. Once the workflow is active, I should be able to provide weather information if your n8n workflow is configured for it. (This is a simulated response)";
        } else {
            aiResponse += "\n\nIn the meantime, I'll respond with simulated messages until the workflow is activated. (This is a simulated response)";
        }
    }
    // Handle simulation mode responses
    else if (data && data.simulated) {
        aiResponse = data.message;
        // Disable voice output for simulated responses to avoid confusion
        if (voiceOutputToggle.checked) {
            console.log('Disabling voice for simulated response');
            const originalVoiceSetting = voiceOutputToggle.checked;
            voiceOutputToggle.checked = false;
            setTimeout(() => {
                voiceOutputToggle.checked = originalVoiceSetting;
            }, 1000);
        }
    }
    // Handle specific n8n response format where it just confirms workflow started
    else if (data && data.message === "Workflow was started") {
        aiResponse = "Your message was sent to the workflow. Waiting for a response...";
        // Poll for results if needed (advanced feature for future implementation)
    }
    // Try to extract the message from various possible response formats
    else if (typeof data === 'string') {
        aiResponse = data;
    } else if (data && typeof data === 'object') {
        // Check various common response formats
        aiResponse = data.message || data.response || data.text || data.content || 
                   (data.data ? (data.data.message || data.data.response || data.data.text || JSON.stringify(data.data)) : null);
        
        // If none of the above worked, try to stringify the object
        if (!aiResponse) {
            try {
                aiResponse = JSON.stringify(data, null, 2);
            } catch (e) {
                aiResponse = "Received a response from n8n but couldn't parse it.";
            }
        }
    } else {
        aiResponse = "Received a response from n8n but couldn't parse it.";
    }
    
    // Add AI message to chat
    addMessageToChat(aiResponse, 'ai');
    
    // Store in conversation history
    conversationHistory.push({
        sender: 'ai',
        message: aiResponse,
        timestamp: new Date().toISOString()
    });
    
    // Save conversation to localStorage
    localStorage.setItem('chatHistory', JSON.stringify(conversationHistory));
    
    // If voice output is enabled, speak the response
    if (voiceOutputToggle.checked) {
        speakWithElevenlabs(aiResponse);
    }
    
    updateStatus('Response received');
    isWaitingForResponse = false;
}

async function speakWithElevenlabs(text) {
    updateStatus('Generating voice...');
    
    try {
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${config.elevenlabsVoiceId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'xi-api-key': config.elevenlabsApiKey
            },
            body: JSON.stringify({
                text: text,
                model_id: 'eleven_monolingual_v1',
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75
                }
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to generate speech');
        }
        
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        audio.onended = () => {
            URL.revokeObjectURL(audioUrl);
            updateStatus('Ready');
        };
        
        audio.onplay = () => {
            updateStatus('Speaking...');
        };
        
        audio.play();
    } catch (error) {
        console.error('Speech synthesis error:', error);
        updateStatus('Error: Failed to generate speech');
    }
}

function toggleVoiceInput() {
    if (isRecording) {
        stopRecording();
    } else {
        startRecording();
    }
}

async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // Set up MediaRecorder
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];
        
        mediaRecorder.ondataavailable = event => {
            audioChunks.push(event.data);
        };
        
        mediaRecorder.onstop = () => {
            // Process the recorded audio
            processAudio();
            
            // Stop the tracks
            stream.getTracks().forEach(track => track.stop());
        };
        
        // Start recording
        mediaRecorder.start();
        isRecording = true;
        voiceInputButton.classList.add('recording');
        updateStatus('Recording...');
    } catch (error) {
        console.error('Error accessing microphone:', error);
        updateStatus('Error: Could not access microphone');
    }
}

function stopRecording() {
    if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
        isRecording = false;
        voiceInputButton.classList.remove('recording');
        updateStatus('Processing audio...');
    }
}

async function processAudio() {
    try {
        // Create an audio blob from the recorded chunks
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        
        // Create a FormData object to send the audio
        const formData = new FormData();
        formData.append('file', audioBlob, 'recording.webm');
        formData.append('model', 'whisper-1');
        
        // Send to OpenAI's Whisper API
        const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${config.openaiApiKey}`
            },
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('Failed to transcribe audio');
        }
        
        const data = await response.json();
        const transcribedText = data.text;
        
        // If we got text, put it in the input field and send
        if (transcribedText && transcribedText.trim() !== '') {
            messageInput.value = transcribedText;
            sendMessage();
        } else {
            updateStatus('No speech detected');
        }
    } catch (error) {
        console.error('Error processing audio:', error);
        updateStatus('Error: Failed to process audio');
    }
}

function updateStatus(message) {
    statusElement.textContent = message;
}

// Function to clear chat history
function clearChat() {
    chatMessages.innerHTML = '';
    conversationHistory = [];
    localStorage.removeItem('chatHistory');
    
    // Add a welcome message back
    addMessageToChat("Chat history cleared. How can I help you?", 'ai');
    conversationHistory.push({
        sender: 'ai',
        message: "Chat history cleared. How can I help you?",
        timestamp: new Date().toISOString()
    });
    
    updateStatus('Chat history cleared');
}

// Add a way to clear chat history (could be added to the UI later)
window.clearChatHistory = clearChat;

// Function to toggle dark mode
function toggleDarkMode() {
    const htmlElement = document.documentElement;
    const currentTheme = htmlElement.getAttribute('data-bs-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-bs-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    updateThemeButtonText();
}

// Update the theme button text based on current theme
function updateThemeButtonText() {
    const themeButton = document.getElementById('theme-toggle');
    const currentTheme = document.documentElement.getAttribute('data-bs-theme');
    
    if (currentTheme === 'dark') {
        themeButton.innerHTML = '<i class="bi bi-sun"></i> Light Mode';
    } else {
        themeButton.innerHTML = '<i class="bi bi-moon"></i> Dark Mode';
    }
} 