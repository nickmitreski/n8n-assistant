# AI Chat with Voice Interface

This is a simple web application that provides a chat interface to interact with an n8n workflow using both text and voice. It features:

- Text-based chat interface
- Voice input using your microphone (transcribed via OpenAI Whisper)
- Voice output using ElevenLabs text-to-speech
- Local conversation history storage

## Important Note on CORS

**The current implementation uses a simulation mode due to CORS restrictions.**

When making direct requests from a browser to the n8n webhook, you'll likely encounter CORS errors like:
```
If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.
Failed to load resource: net::ERR_FAILED
```

## Setup Options

### Option 1: Simple Static Files (Simulation Mode)
1. Clone the repository to your local machine or server
2. Open the `index.html` file in a web browser
3. The application will run in simulation mode (n8n webhook calls are simulated)

### Option 2: Using the Backend Proxy Server (Real n8n Integration)
1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the server:
   ```
   npm start
   ```
4. Open your browser and navigate to `http://localhost:3000`
5. To switch from simulation mode to real n8n integration, edit `script.js`:
   - Find the `sendToN8n` function
   - Comment out the call to `simulateAIResponse(message)`
   - Uncomment the call to `callN8nWithProxy(message)`

## Production Implementation Options

### Option 1: Deploy the Included Express Server
1. Deploy the application to a hosting service (Heroku, Railway, Render, etc.)
2. Make sure to set any required environment variables

### Option 2: Configure CORS on the n8n Server
If you have control over the n8n server, you can configure it to allow cross-origin requests.

## How to Use

### Text Chat
1. Type your message in the input box
2. Press "Enter" or click the "Send" button
3. Wait for the AI response to appear in the chat

### Voice Input
1. Click the microphone button to start recording
2. Speak your message
3. Click the microphone button again to stop recording (it will turn red while recording)
4. Your message will be transcribed and sent automatically

### Voice Output
- Toggle the "Voice Output" switch to enable/disable AI responses being spoken aloud
- When enabled, all AI responses will be converted to speech using ElevenLabs

### Clearing Chat History
- Click the "Clear Chat" button in the top right corner of the chat box to clear your conversation history

## Security Note

This application includes API keys directly in the source code. For a production environment, you should:

1. Move API keys to server-side code or environment variables
2. Implement proper authentication
3. Add rate limiting

## Technology Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js (optional proxy server)
- APIs:
  - n8n webhook for AI processing
  - OpenAI Whisper API for speech-to-text
  - ElevenLabs API for text-to-speech

## Customization

To customize the application:
- Edit `config` object in script.js to update API keys or endpoints
- Modify the CSS in style.css to change appearance
- Update the HTML structure in index.html for layout changes 