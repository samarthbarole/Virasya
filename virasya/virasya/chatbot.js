// =======================================================
// VIRASYA AI GUIDE — Frontend Cultural Chatbot Controller
// =======================================================

(function () {
  'use strict';

  // 1. Detect Current State from Page
  function detectCurrentPageState() {
    if (window.VIRASYA_CURRENT_STATE) {
      return window.VIRASYA_CURRENT_STATE;
    }
    const path = window.location.pathname.toLowerCase();
    if (path.includes('uttarakhand')) return 'Uttarakhand';
    if (path.includes('maharashtra')) return 'Maharashtra';
    if (path.includes('jharkhand')) return 'Jharkhand';
    if (path.includes('rajasthan')) return 'Rajasthan';
    if (path.includes('punjab')) return 'Punjab';

    const stateSelect = document.getElementById('stateSelect');
    if (stateSelect && stateSelect.value && stateSelect.value !== 'All') {
      return stateSelect.value;
    }
    return null;
  }

  let currentStateContext = detectCurrentPageState();
  let conversationHistory = [];
  let isAwaitingResponse = false;

  // 2. Inject Chatbot HTML Structure
  function mountChatbotUI() {
    if (document.getElementById('virasyaChatFloat')) return;

    // Floating Trigger Button
    const floatBtn = document.createElement('button');
    floatBtn.id = 'virasyaChatFloat';
    floatBtn.className = 'virasya-chat-float';
    floatBtn.setAttribute('aria-label', 'Open VIRASYA AI Guide');
    floatBtn.innerHTML = `
      <div class="chat-badge-pulse"></div>
      <span>🪷</span>
    `;
    floatBtn.onclick = toggleChatPanel;
    document.body.appendChild(floatBtn);

    // Chat Panel
    const chatPanel = document.createElement('div');
    chatPanel.id = 'virasyaChatPanel';
    chatPanel.className = 'virasya-chat-panel';
    chatPanel.innerHTML = `
      <div class="vir-chat-header">
        <div class="vir-header-title">
          <div class="vir-header-icon">🪷</div>
          <div class="vir-header-text">
            <h3>VIRASYA AI GUIDE</h3>
            <span>Your guide to India's culture & heritage</span>
          </div>
        </div>
        <div class="vir-header-actions">
          <button class="vir-icon-btn" onclick="window.virasyaChat.resetChat()" title="New Chat">🔄</button>
          <button class="vir-icon-btn" onclick="window.virasyaChat.toggleMinimize()" title="Minimize">─</button>
          <button class="vir-icon-btn" onclick="window.virasyaChat.closeChat()" title="Close">✕</button>
        </div>
      </div>

      <div class="vir-state-banner" id="virStateBanner">
        <div>Context: <span id="virActiveStateLabel">${currentStateContext || 'All India'}</span></div>
        <div style="font-size: 9px; opacity: 0.8;">Cultural AI Online</div>
      </div>

      <div class="vir-chat-body" id="virChatBody">
        <!-- Initial Welcome Message -->
        <div class="vir-msg bot">
          <div class="vir-bubble">
            <p><strong>Namaste! 🙏</strong><br>I'm the <strong>VIRASYA AI Guide</strong>.</p>
            <p>Ask me anything about India's culture, heritage, history, festivals, traditional arts, crafts, and regional artisans.</p>
          </div>
          <div class="vir-suggestions-wrap">
            <button class="vir-chip" onclick="window.virasyaChat.sendChip('Tell me about the culture of India')">🪷 Discover Culture</button>
            <button class="vir-chip" onclick="window.virasyaChat.sendChip('What are famous Indian heritage sites?')">🏛 Explore Heritage</button>
            <button class="vir-chip" onclick="window.virasyaChat.sendChip('Which major festivals are celebrated in India?')">🎉 Explore Festivals</button>
            <button class="vir-chip" onclick="window.virasyaChat.sendChip('Tell me about traditional arts and crafts')">🎨 Arts & Crafts</button>
            <button class="vir-chip" onclick="window.virasyaChat.sendChip('What crafts are famous in Uttarakhand?')">🗺 Explore a State</button>
            <button class="vir-chip" onclick="window.virasyaChat.sendChip('Tell me about Warli painting')">🖼 Warli Painting</button>
          </div>
        </div>
      </div>

      <form class="vir-chat-footer" id="virChatForm" onsubmit="window.virasyaChat.handleSubmit(event)">
        <input type="text" id="virChatInput" class="vir-input-box" placeholder="Ask about India's culture, crafts, heritage..." autocomplete="off">
        <button type="submit" class="vir-send-btn" title="Send Question" aria-label="Send">
          ➤
        </button>
      </form>
    `;

    document.body.appendChild(chatPanel);
  }

  // 3. UI Actions
  function toggleChatPanel() {
    const panel = document.getElementById('virasyaChatPanel');
    if (!panel) return;
    panel.classList.toggle('active');
    panel.classList.remove('minimized');
    if (panel.classList.contains('active')) {
      const input = document.getElementById('virChatInput');
      if (input) setTimeout(() => input.focus(), 300);
      scrollToBottom();
    }
  }

  function closeChat() {
    const panel = document.getElementById('virasyaChatPanel');
    if (panel) panel.classList.remove('active');
  }

  function toggleMinimize() {
    const panel = document.getElementById('virasyaChatPanel');
    if (panel) panel.classList.toggle('minimized');
  }

  function scrollToBottom() {
    const body = document.getElementById('virChatBody');
    if (body) {
      body.scrollTop = body.scrollHeight;
    }
  }

  function renderMarkdown(text) {
    if (!text) return '';
    let parsed = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Bold headers
    parsed = parsed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    parsed = parsed.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Bullet points
    const lines = parsed.split('\n');
    let inList = false;
    let result = [];

    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('• ') || trimmed.startsWith('- ')) {
        if (!inList) {
          result.push('<ul style="margin: 6px 0; padding-left: 18px;">');
          inList = true;
        }
        result.push(`<li style="margin-bottom: 4px;">${trimmed.substring(2)}</li>`);
      } else {
        if (inList) {
          result.push('</ul>');
          inList = false;
        }
        if (trimmed) {
          result.push(`<p>${trimmed}</p>`);
        }
      }
    });

    if (inList) result.push('</ul>');
    return result.join('');
  }

  function appendUserMessage(text) {
    const body = document.getElementById('virChatBody');
    if (!body) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = 'vir-msg user';
    msgDiv.innerHTML = `
      <div class="vir-bubble">
        ${text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
      </div>
    `;
    body.appendChild(msgDiv);
    scrollToBottom();
  }

  function appendBotMessage(replyText, actions = []) {
    const body = document.getElementById('virChatBody');
    if (!body) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = 'vir-msg bot';

    let actionsHtml = '';
    if (actions && actions.length > 0) {
      actionsHtml = `<div class="vir-action-cards">`;
      actions.forEach(act => {
        actionsHtml += `
          <a href="${act.target}" class="vir-action-btn" onclick="window.virasyaChat.handleActionClick('${act.target}')">
            <span>${act.label}</span>
          </a>
        `;
      });
      actionsHtml += `</div>`;
    }

    msgDiv.innerHTML = `
      <div class="vir-bubble">
        ${renderMarkdown(replyText)}
        ${actionsHtml}
      </div>
    `;

    body.appendChild(msgDiv);
    scrollToBottom();
  }

  function showTypingIndicator() {
    const body = document.getElementById('virChatBody');
    if (!body) return;

    const typingDiv = document.createElement('div');
    typingDiv.id = 'virTypingIndicator';
    typingDiv.className = 'vir-typing';
    typingDiv.innerHTML = `
      <span>VIRASYA AI is exploring India's heritage</span>
      <div class="vir-dots">
        <span></span><span></span><span></span>
      </div>
    `;
    body.appendChild(typingDiv);
    scrollToBottom();
  }

  function hideTypingIndicator() {
    const typing = document.getElementById('virTypingIndicator');
    if (typing) typing.remove();
  }

  // 4. Send Message to Backend API
  async function sendMessage(text) {
    const cleanText = (text || '').trim();
    if (!cleanText || isAwaitingResponse) return;

    appendUserMessage(cleanText);
    isAwaitingResponse = true;
    showTypingIndicator();

    // Context check
    currentStateContext = detectCurrentPageState() || currentStateContext;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: cleanText,
          state: currentStateContext || null,
          history: conversationHistory.slice(-6)
        })
      });

      const data = await response.json();
      hideTypingIndicator();
      isAwaitingResponse = false;

      if (data && data.reply) {
        if (data.state) {
          currentStateContext = data.state;
          const label = document.getElementById('virActiveStateLabel');
          if (label) label.innerText = data.state;
        }

        conversationHistory.push({
          role: 'user',
          text: cleanText
        });
        conversationHistory.push({
          role: 'bot',
          text: data.reply,
          state: data.state || null
        });

        appendBotMessage(data.reply, data.actions || []);
      } else {
        appendBotMessage("Sorry, the VIRASYA AI Guide is temporarily unavailable. Please try again.", [
          { label: "🔄 Try Again", target: "javascript:window.virasyaChat.retryLast()", type: "retry" }
        ]);
      }
    } catch (err) {
      hideTypingIndicator();
      isAwaitingResponse = false;
      console.error('Chat API error:', err);
      appendBotMessage("Sorry, the VIRASYA AI Guide is temporarily unavailable. Please check your connection and try again.", [
        { label: "🔄 Try Again", target: "javascript:window.virasyaChat.retryLast()", type: "retry" }
      ]);
    }
  }

  let lastUserQuery = '';

  function handleSubmit(e) {
    if (e) e.preventDefault();
    const input = document.getElementById('virChatInput');
    if (!input) return;
    const val = input.value;
    input.value = '';
    lastUserQuery = val;
    sendMessage(val);
  }

  function sendChip(promptText) {
    lastUserQuery = promptText;
    sendMessage(promptText);
  }

  function retryLast() {
    if (lastUserQuery) {
      sendMessage(lastUserQuery);
    }
  }

  function resetChat() {
    conversationHistory = [];
    currentStateContext = detectCurrentPageState();
    const label = document.getElementById('virActiveStateLabel');
    if (label) label.innerText = currentStateContext || 'All India';

    const body = document.getElementById('virChatBody');
    if (body) {
      body.innerHTML = `
        <div class="vir-msg bot">
          <div class="vir-bubble">
            <p><strong>Namaste! 🙏</strong><br>New conversation started. How may I assist your cultural journey across India today?</p>
          </div>
          <div class="vir-suggestions-wrap">
            <button class="vir-chip" onclick="window.virasyaChat.sendChip('Tell me about the culture of India')">🪷 Discover Culture</button>
            <button class="vir-chip" onclick="window.virasyaChat.sendChip('What are famous Indian heritage sites?')">🏛 Explore Heritage</button>
            <button class="vir-chip" onclick="window.virasyaChat.sendChip('What crafts are famous in Rajasthan?')">🎨 Rajasthan Crafts</button>
            <button class="vir-chip" onclick="window.virasyaChat.sendChip('Tell me about Dokra metal art')">🔔 Dokra Art</button>
          </div>
        </div>
      `;
    }
  }

  function handleActionClick(target) {
    if (target.startsWith('#')) {
      closeChat();
      const el = document.querySelector(target);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Expose methods globally on window.virasyaChat
  window.virasyaChat = {
    toggle: toggleChatPanel,
    closeChat,
    toggleMinimize,
    handleSubmit,
    sendChip,
    retryLast,
    resetChat,
    handleActionClick,
    setStateContext: function (stateName) {
      currentStateContext = stateName;
      const label = document.getElementById('virActiveStateLabel');
      if (label) label.innerText = stateName;
    }
  };

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountChatbotUI);
  } else {
    mountChatbotUI();
  }
})();
