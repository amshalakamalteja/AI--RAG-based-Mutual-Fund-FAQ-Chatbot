// API endpoint
const API_URL = '/api/ask';

// DOM elements
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');
const quickButtons = document.querySelectorAll('.quick-btn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Focus input on load
    userInput.focus();
    
    // Send on Enter key
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Send button click
    sendButton.addEventListener('click', sendMessage);
    
    // Quick question buttons
    quickButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const question = btn.getAttribute('data-question');
            userInput.value = question;
            sendMessage();
        });
    });
    
    // Auto-resize input (optional enhancement)
    userInput.addEventListener('input', () => {
        sendButton.disabled = !userInput.value.trim();
    });
});

// Send message
async function sendMessage() {
    const question = userInput.value.trim();
    
    if (!question) return;
    
    // Clear input
    userInput.value = '';
    sendButton.disabled = true;
    
    // Add user message
    addMessage('user', question);
    
    // Show loading
    const loadingId = showLoading();
    
    try {
        // Call API
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question }),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Remove loading
        removeLoading(loadingId);
        
        // Add assistant response
        addMessage('assistant', data.answer, data.source_url);
        
    } catch (error) {
        console.error('Error:', error);
        removeLoading(loadingId);
        addMessage('assistant', 'Sorry, I encountered an error. Please try again.', null, true);
    } finally {
        sendButton.disabled = false;
        userInput.focus();
    }
}

// Add message to chat
function addMessage(type, text, sourceUrl = null, isError = false) {
    // Remove welcome message if it exists
    const welcomeMsg = chatMessages.querySelector('.welcome-message');
    if (welcomeMsg) {
        welcomeMsg.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = type === 'user' ? '👤' : '🤖';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    
    if (isError) {
        content.classList.add('error-message');
    }
    
    const textDiv = document.createElement('div');
    textDiv.className = 'message-text';
    textDiv.textContent = text;
    content.appendChild(textDiv);
    
    // Add source URL if available
    if (sourceUrl && !isError) {
        const sourceDiv = document.createElement('div');
        sourceDiv.className = 'message-source';
        const link = document.createElement('a');
        link.href = sourceUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = 'View Source';
        link.innerHTML = '🔗 View Source';
        sourceDiv.appendChild(link);
        content.appendChild(sourceDiv);
    }
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Show loading indicator
function showLoading() {
    const loadingId = 'loading-' + Date.now();
    const messageDiv = document.createElement('div');
    messageDiv.id = loadingId;
    messageDiv.className = 'message assistant';
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = '🤖';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    
    const loading = document.createElement('div');
    loading.className = 'loading';
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.className = 'loading-dot';
        loading.appendChild(dot);
    }
    
    content.appendChild(loading);
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    return loadingId;
}

// Remove loading indicator
function removeLoading(loadingId) {
    const loadingElement = document.getElementById(loadingId);
    if (loadingElement) {
        loadingElement.remove();
    }
}

