# ARIA AI UPLINK - Refactored Architecture

## Overview

The ARIA (Adaptive Response Intelligence for Astronauts) system has been refactored using a clean, modular architecture similar to CTFBot, but tailored for the Martian Habitat dashboard.

## Files

- **aria-uplink.js** - New refactored ARIA AI system (recommended approach)
- **script.js** - Original habitat dashboard code (still functional)

## Key Features (CTFBot Pattern)

### 1. **Configuration Management**
```javascript
ARIA_CONFIG = {
  API_URL: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
  SYSTEM_PROMPT: "...",
  TIMEOUT: 30000,
  MAX_RESPONSE_LENGTH: 2048
}
```

### 2. **State Management**
```javascript
ariaState = {
  apiKey: localStorage.getItem('aria_api_key'),
  isProcessing: false,
  chatHistory: [],
  theme: localStorage.getItem('aria_theme')
}
```

### 3. **DOM Element Registry**
```javascript
ariaElements = {
  chatMessages: null,
  chatInput: null,
  sendBtn: null,
  // ... etc
}
```

### 4. **Toast Notification System**
```javascript
ariaToast.show("Message", "success", 3000);
ariaToast.show("Error", "error", 3000);
```

### 5. **Message Display**
```javascript
displayAriaMessage(content, isUser = true, isError = false)
```

### 6. **API Communication** (Similar to CTFBot)
```javascript
async function sendAriaMessage(message) {
  // Validates API key
  // Sends to Gemini API with system prompt
  // Handles responses
  // Updates chat history
}
```

## Usage

### In HTML
```html
<div id="uplink-chat-output">
  <div class="chat-messages"></div>
  <hr class="chat-separator">
  <div class="chat-input-container">
    <span id="chat-prompt">&gt;</span>
    <input type="text" id="uplink-chat-input" placeholder="Type a message..." />
  </div>
</div>

<div id="api-key-setup">
  <h3>🔑 API Key Required</h3>
  <input type="password" id="api-key-input" placeholder="Enter your Gemini API key" />
  <button id="save-api-key">Save API Key</button>
</div>

<button id="clearChatButton">Clear Chat</button>
```

### In JavaScript
```javascript
// Manually send message
window.ariaAPI.send("What is the oxygen level?");

// Get current state
console.log(window.ariaAPI.state);

// Show toast
window.ariaAPI.toast.show("System online", "success");
```

## Differences from CTFBot

| Feature | CTFBot | ARIA |
|---------|--------|------|
| Theme | Customizable (light/dark/system) | Dark (Martian aesthetic) |
| System Prompt | CTF challenges | Martian Habitat assistance |
| Context | Cybersecurity | Space exploration |
| UI | Dedicated app | Part of dashboard |
| Storage | Chat history | Integrated with habitat data |

## API Configuration

**Endpoint**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`

**Model**: `gemini-2.0-flash`

**Authentication**: API key in query parameter

**Request Format**:
```json
{
  "contents": [{
    "parts": [{ "text": "..." }]
  }],
  "generationConfig": {
    "temperature": 0.7,
    "topK": 40,
    "topP": 0.95,
    "maxOutputTokens": 2048
  }
}
```

## Error Handling

The system gracefully handles:
- Missing API keys
- Network timeouts
- Invalid responses
- API rate limits
- Connection errors

All errors are displayed as:
1. Chat message (visible to user)
2. Toast notification (brief alert)
3. Console log (for debugging)

## LocalStorage

- **aria_api_key** - Stored Gemini API key
- **aria_theme** - User theme preference

## Architecture Benefits

✅ **Modular** - Separate concerns (state, DOM, API, UI)
✅ **Testable** - Functions are pure and independently callable
✅ **Maintainable** - Clear code organization
✅ **Extensible** - Easy to add features
✅ **Familiar** - Follows CTFBot pattern
✅ **Themeable** - Spaceship aesthetic

## Integration with Dashboard

The ARIA system runs in parallel with the main habitat dashboard:
- **Dashboard**: Manages system metrics, crew profiles, alerts
- **ARIA**: Handles AI-powered communication and assistance

They don't interfere with each other and can run independently.

---

**Status**: Production Ready ✅
**Tested**: Yes
**Performance**: Optimized
