// ============================================
// ARIA AI UPLINK - Martian Habitat System
// Refactored using CTFBot Architecture Pattern
// ============================================

// Configuration Constants
const ARIA_CONFIG = {
  API_URL: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
  SYSTEM_PROMPT: `You are "ARIA" (Adaptive Response Intelligence for Astronauts), the advanced AI system aboard the Martian Habitat Life Craft.
You are communicating with Mission Control at the Base on Mars.
Your role is to assist crew with:
- System diagnostics and maintenance guidance
- Scientific analysis and research support
- Emergency protocols and contingency planning
- Educational explanations of Martian geology and conditions
- Psychological support and crew wellness monitoring
- Navigation and mission planning assistance

Respond with professionalism, technical accuracy, and immersive sci-fi realism.
Keep answers concise and formatted like uplink transmissions.
Example: [ARIA UPLINK 07:42 UTC] Oxygen systems nominal. All life support parameters within acceptable ranges.`,
  TIMEOUT: 30000,
  MAX_RESPONSE_LENGTH: 2048
};

// State Management (similar to CTFBot)
const ariaState = {
  apiKey: localStorage.getItem('aria_api_key') || '',
  isProcessing: false,
  chatHistory: [],
  theme: localStorage.getItem('aria_theme') || 'dark'
};

// DOM Element References
const ariaElements = {
  chatMessages: null,
  chatInput: null,
  sendBtn: null,
  clearBtn: null,
  apiKeyInput: null,
  apiKeySetup: null,
  settingsModal: null,
  typingIndicator: null
};

// Initialize DOM references
function initializeAriaElements() {
  ariaElements.chatMessages = document.querySelector('.chat-messages');
  ariaElements.chatInput = document.getElementById('uplink-chat-input');
  ariaElements.sendBtn = document.getElementById('send-btn') || createSendButton();
  ariaElements.clearBtn = document.getElementById('clearChatButton');
  ariaElements.apiKeyInput = document.getElementById('api-key-input');
  ariaElements.apiKeySetup = document.getElementById('api-key-setup');
  ariaElements.settingsModal = document.getElementById('settings-modal');
  ariaElements.typingIndicator = document.getElementById('typing-indicator');
}

// Create send button if it doesn't exist
function createSendButton() {
  const btn = document.createElement('button');
  btn.id = 'send-btn';
  btn.textContent = 'Send';
  btn.className = 'send-btn';
  const container = document.querySelector('.chat-input-container');
  if (container) {
    container.appendChild(btn);
  }
  return btn;
}

// Toast Notification System (from CTFBot)
const ariaToast = {
  container: null,
  
  show(message, type = 'info', duration = 3000) {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'aria-toast-container';
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
    
    const toastElement = document.createElement('div');
    toastElement.className = `toast ${type}`;
    toastElement.textContent = message;
    
    this.container.appendChild(toastElement);
    
    requestAnimationFrame(() => {
      toastElement.classList.add('show');
    });
    
    setTimeout(() => {
      toastElement.classList.remove('show');
      setTimeout(() => toastElement.remove(), 300);
    }, duration);
  }
};

// Display message in chat (from CTFBot pattern)
function displayAriaMessage(content, isUser = true, isError = false) {
  if (!ariaElements.chatMessages) return;
  
  const messageElement = document.createElement('div');
  messageElement.className = `message ${isUser ? 'message-user' : 'message-assistant'} ${isError ? 'error' : ''}`;
  
  const contentDiv = document.createElement('div');
  contentDiv.className = 'message-content';
  
  if (isUser) {
    contentDiv.textContent = content;
  } else {
    // Format bot response with basic markdown
    contentDiv.innerHTML = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>')
      .replace(/`(.*?)`/g, '<code>$1</code>');
  }
  
  messageElement.appendChild(contentDiv);
  ariaElements.chatMessages.appendChild(messageElement);
  ariaElements.chatMessages.scrollTop = ariaElements.chatMessages.scrollHeight;
}

// Send message to Gemini API (from CTFBot pattern)
async function sendAriaMessage(message) {
  if (!message.trim()) return;
  
  if (!ariaState.apiKey) {
    ariaToast.show('API key required - please configure', 'error');
    if (ariaElements.apiKeySetup) {
      ariaElements.apiKeySetup.style.display = 'block';
    }
    return;
  }
  
  // Clear input
  if (ariaElements.chatInput) {
    ariaElements.chatInput.value = '';
    adjustAriaTextareaHeight();
  }
  
  // Display user message
  displayAriaMessage(message, true);
  
  // Show typing indicator
  setAriaProcessingState(true);
  
  try {
    const response = await fetch(`${ARIA_CONFIG.API_URL}?key=${ariaState.apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(ARIA_CONFIG.TIMEOUT),
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${ARIA_CONFIG.SYSTEM_PROMPT}\n\nMission Control: ${message}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: ARIA_CONFIG.MAX_RESPONSE_LENGTH
        }
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = errorData.error?.message || `API Error: ${response.status}`;
      throw new Error(errorMsg);
    }
    
    const data = await response.json();
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response from ARIA system');
    }
    
    const botResponse = data.candidates[0].content.parts[0].text;
    displayAriaMessage(botResponse, false);
    ariaState.chatHistory.push({ user: message, bot: botResponse });
    
  } catch (error) {
    console.error('ARIA Error:', error);
    displayAriaMessage(`Error: ${error.message}`, false, true);
    ariaToast.show(`ARIA Connection Error: ${error.message}`, 'error');
  } finally {
    setAriaProcessingState(false);
  }
}

// Set processing state (from CTFBot)
function setAriaProcessingState(isProcessing) {
  ariaState.isProcessing = isProcessing;
  
  if (ariaElements.typingIndicator) {
    ariaElements.typingIndicator.style.display = isProcessing ? 'flex' : 'none';
  }
  
  if (ariaElements.sendBtn) {
    ariaElements.sendBtn.disabled = isProcessing;
  }
  
  if (ariaElements.chatInput) {
    ariaElements.chatInput.disabled = isProcessing;
  }
}

// Setup message input handlers
function setupAriaMessageInput() {
  if (!ariaElements.chatInput) return;
  
  // Send button click
  if (ariaElements.sendBtn) {
    ariaElements.sendBtn.addEventListener('click', () => {
      const message = ariaElements.chatInput.value.trim();
      if (message) {
        sendAriaMessage(message);
      }
    });
  }
  
  // Enter key (Shift+Enter for new line)
  ariaElements.chatInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      const message = ariaElements.chatInput.value.trim();
      if (message) {
        sendAriaMessage(message);
      }
    }
  });
  
  // Auto-resize
  ariaElements.chatInput.addEventListener('input', adjustAriaTextareaHeight);
}

// Adjust textarea height
function adjustAriaTextareaHeight() {
  if (!ariaElements.chatInput) return;
  
  ariaElements.chatInput.style.height = 'auto';
  const newHeight = Math.min(ariaElements.chatInput.scrollHeight + 2, 200);
  ariaElements.chatInput.style.height = `${newHeight}px`;
}

// Save API key (from CTFBot pattern)
function saveAriaApiKey() {
  const apiKey = ariaElements.apiKeyInput.value.trim();
  
  if (!apiKey) {
    ariaToast.show('Please enter a valid API key', 'warning');
    return;
  }
  
  localStorage.setItem('aria_api_key', apiKey);
  ariaState.apiKey = apiKey;
  
  if (ariaElements.apiKeySetup) {
    ariaElements.apiKeySetup.style.display = 'none';
  }
  
  ariaToast.show('✅ ARIA AI System Online', 'success');
}

// Initialize ARIA system
function initializeAria() {
  console.log('🚀 Initializing ARIA AI System...');
  
  initializeAriaElements();
  setupAriaMessageInput();
  
  // Set up API key save button
  const saveKeyBtn = document.getElementById('save-api-key');
  if (saveKeyBtn) {
    saveKeyBtn.addEventListener('click', saveAriaApiKey);
  }
  
  // Set up API key input Enter key
  if (ariaElements.apiKeyInput) {
    ariaElements.apiKeyInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        saveAriaApiKey();
      }
    });
  }
  
  // Set up clear button
  if (ariaElements.clearBtn) {
    ariaElements.clearBtn.addEventListener('click', () => {
      if (ariaElements.chatMessages) {
        ariaElements.chatMessages.innerHTML = '<div>[System] Chat cleared.</div>';
      }
      ariaState.chatHistory = [];
      ariaToast.show('Chat history cleared', 'info');
    });
  }
  
  // Check if API key is already saved
  if (ariaState.apiKey) {
    if (ariaElements.apiKeySetup) {
      ariaElements.apiKeySetup.style.display = 'none';
    }
    ariaElements.apiKeyInput.value = ariaState.apiKey;
  } else {
    if (ariaElements.apiKeySetup) {
      ariaElements.apiKeySetup.style.display = 'block';
    }
  }
  
  console.log('✅ ARIA AI System initialized');
}

// Export functions for use in other parts of the application
window.ariaAPI = {
  send: sendAriaMessage,
  initialize: initializeAria,
  toast: ariaToast,
  state: ariaState
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAria);
} else {
  initializeAria();
}
