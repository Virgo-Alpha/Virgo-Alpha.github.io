import { create, insert, search } from 'https://cdn.jsdelivr.net/npm/@orama/orama@2.0.16/+esm';

const BENSONBOT_ENDPOINT = "/.netlify/functions/chat";

const state = {
  isOpen: false,
  db: null,
  isReady: false
};

// HTML Template
const CHAT_UI_HTML = `
  <button id="bensonbot-fab" aria-label="Chat with Bensonbot">
    <i class="fa-solid fa-comment-dots"></i>
  </button>

  <div id="bensonbot-panel">
    <div class="bb-header">
      <div class="bb-title">
        <i class="fa-solid fa-robot"></i> Bensonbot
      </div>
      <button class="bb-close" aria-label="Close chat">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
    
    <div class="bb-messages" id="bb-messages">
      <div class="bb-msg bot">
        Hello! I'm Benson's AI assistant. Ask me about his projects, skills, or experience!
      </div>
      <div class="bb-starters" id="bb-starters">
        <button class="bb-prompt-btn">Summarize Benson's experience</button>
        <button class="bb-prompt-btn">What are his top skills?</button>
        <button class="bb-prompt-btn">Tell me about his recent projects</button>
      </div>
    </div>

    <form class="bb-input-area" id="bb-form">
      <input type="text" class="bb-input" id="bb-input" placeholder="Ask a question..." autocomplete="off">
      <button type="submit" class="bb-send" aria-label="Send">
        <i class="fa-solid fa-paper-plane"></i>
      </button>
    </form>
  </div>
`;

async function initBensonbot() {
  // Inject UI
  const div = document.createElement('div');
  div.innerHTML = CHAT_UI_HTML;
  document.body.appendChild(div);

  // References
  const fab = document.getElementById('bensonbot-fab');
  const panel = document.getElementById('bensonbot-panel');
  const closeBtn = panel.querySelector('.bb-close');
  const form = document.getElementById('bb-form');
  const input = document.getElementById('bb-input');
  const messages = document.getElementById('bb-messages');
  const starters = document.getElementById('bb-starters');

  // Event Listeners
  fab.addEventListener('click', toggleChat);
  closeBtn.addEventListener('click', toggleChat);
  
  starters.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      input.value = btn.innerText;
      handleSubmit();
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handleSubmit();
  });

  function toggleChat() {
    state.isOpen = !state.isOpen;
    panel.classList.toggle('open', state.isOpen);
    if (state.isOpen) {
      input.focus();
    }
  }

  async function handleSubmit() {
    const query = input.value.trim();
    if (!query) return;

    // Add User Message
    addMessage(query, 'user');
    input.value = '';
    
    // Hide starters
    if (starters) starters.style.display = 'none';

    // Show loading
    const loadingId = addLoading();

    try {
      // 1. Local Search (Retrieval)
      let context = "";
      if (state.db) {
        const searchResult = await search(state.db, {
          term: query,
          properties: '*',
          limit: 3
        });
        
        if (searchResult.hits.length > 0) {
          context = searchResult.hits.map(hit => hit.document.content).join('\n\n');
          console.log("Retrieved context:", context.substring(0, 100) + "...");
        } else {
          console.log("No relevant context found locally.");
        }
      }

      // 2. Call LLM (Generation)
      const response = await fetch(BENSONBOT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, context }),
      });

      if (!response.ok) throw new Error("Network response was not ok");
      
      const data = await response.json();
      
      // Remove loading
      removeMessage(loadingId);
      
      // Add Bot Message
      addMessage(data.answer, 'bot');

    } catch (error) {
      console.error("Chat error:", error);
      removeMessage(loadingId);
      addMessage("I'm sorry, I'm having trouble connecting right now. Please try again later.", 'bot');
    }
  }

  function addMessage(text, sender) {
    const div = document.createElement('div');
    div.className = `bb-msg ${sender}`;
    // Simple markdown-like parsing for bold/links could go here
    div.innerText = text; 
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
  }

  function addLoading() {
    const id = 'loading-' + Date.now();
    const div = document.createElement('div');
    div.className = `bb-msg bot typing-dots`;
    div.id = id;
    div.innerHTML = '<span></span><span></span><span></span>';
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return id;
  }

  function removeMessage(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  // Initialize Search Index
  try {
    const res = await fetch('/assets/kb.json');
    if (!res.ok) throw new Error("Failed to load knowledge base");
    const docs = await res.json();

    state.db = await create({
      schema: {
        id: 'string',
        title: 'string',
        content: 'string',
        source: 'string'
      }
    });

    await insert(state.db, docs);
    state.isReady = true;
    console.log("Bensonbot: Knowledge base loaded.");
  } catch (err) {
    console.error("Bensonbot: Failed to initialize search.", err);
  }
}

// Start
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBensonbot);
} else {
  initBensonbot();
}
