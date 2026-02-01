import { create, insert, insertMultiple, search } from 'https://cdn.jsdelivr.net/npm/@orama/orama@2.0.16/+esm';

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
  console.log("Bensonbot: Initializing UI...");

  // Inject UI
  try {
    if (!document.getElementById('bensonbot-container')) {
      const div = document.createElement('div');
      div.id = 'bensonbot-container';
      div.innerHTML = CHAT_UI_HTML;
      document.body.appendChild(div);
    }
  } catch (err) {
    console.error("Bensonbot: Failed to inject UI.", err);
    return;
  }

  // References
  const fab = document.getElementById('bensonbot-fab');
  const panel = document.getElementById('bensonbot-panel');
  
  if (!fab || !panel) return;

  const closeBtn = panel.querySelector('.bb-close');
  const form = document.getElementById('bb-form');
  const input = document.getElementById('bb-input');
  const messages = document.getElementById('bb-messages');
  const starters = document.getElementById('bb-starters');

  // Event Listeners
  fab.addEventListener('click', toggleChat);
  closeBtn.addEventListener('click', toggleChat);
  
  if (starters) {
    starters.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        input.value = btn.innerText;
        handleSubmit();
      });
    });
  }

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

    addMessage(query, 'user');
    input.value = '';
    if (starters) starters.style.display = 'none';

    const loadingId = addLoading();

    // 1. Clean query for better Orama matching (remove stop words/question phrases)
    const cleanTerm = query.toLowerCase()
      .replace(/what are his/g, '')
      .replace(/what is his/g, '')
      .replace(/tell me about/g, '')
      .replace(/summarize/g, '')
      .replace(/his top/g, 'top')
      .replace(/his best/g, 'best')
      .replace(/[?!.]/g, '')
      .trim();

    let context = "";
    let hits = [];

    try {
      // 2. Local Search (Orama) always run to provide context
      if (state.db) {
        const searchResult = await search(state.db, {
          term: cleanTerm || query,
          properties: '*',
          limit: 3,
          tolerance: 1,
          boost: {
            title: 2,
            content: 1
          }
        });
        
        if (searchResult && searchResult.hits && searchResult.hits.length > 0) {
          hits = searchResult.hits;
          context = hits.map(hit => hit.document.content).join('\n\n');
        }
      }

      // 2. Platform Detection
      const isNetlify = window.location.hostname.includes('netlify.app') || 
                        window.location.hostname === 'bensonmugure.com'; // Adjust if custom domain
      const isLocalJekyll = window.location.port === "4000";
      const isGitHubPages = window.location.hostname.includes('github.io');

      // 3. Conditional AI call
      if (isNetlify) {
        try {
          const response = await fetch(BENSONBOT_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query, context }),
          });

          if (!response.ok) throw new Error(`${response.status}`);
          
          const data = await response.json();
          removeMessage(loadingId);
          addMessage(data.answer, 'bot');
          return; // Success
        } catch (aiErr) {
          console.warn("Bensonbot: Netlify backend failed. Falling back to local data.", aiErr);
        }
      } else {
        const platform = isLocalJekyll ? "Local Jekyll" : (isGitHubPages ? "GitHub Pages" : "Unknown Environment");
        console.log(`Bensonbot: ${platform} detected. Using local search mode.`);
      }

      // 4. Fallback (for local, GH Pages, or Netlify error)
      removeMessage(loadingId);
      if (context) {
        let fallbackMsg = isLocalJekyll || isGitHubPages 
          ? "In this environment, I'm using local search. Here's what I found in Benson's files:\n\n"
          : "I'm having trouble reaching my AI brain, but here's what I found locally:\n\n";

        hits.forEach((h, i) => {
          const title = h.document.title || h.document.source;
          fallbackMsg += `**${title}**:\n${h.document.content.substring(0, 300)}...\n\n`;
        });
        
        if (isGitHubPages) {
          fallbackMsg += "*(Note: Full AI summaries are available on the Netlify deployment.)*";
        }
        addMessage(fallbackMsg, 'bot');
      } else {
        addMessage("I couldn't find a direct match in the knowledge base. Try asking about 'skills', 'experience', or 'projects'.", 'bot');
      }

    } catch (error) {
      console.error("Bensonbot: Execution error:", error);
      removeMessage(loadingId);
      addMessage("An unexpected error occurred. Please try again later.", 'bot');
    }
  }

  function addMessage(text, sender) {
    const div = document.createElement('div');
    div.className = `bb-msg ${sender}`;
    div.innerHTML = text.replace(/\n/g, '<br>'); 
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

  // Load KB
  try {
    const res = await fetch('/assets/kb.json');
    if (!res.ok) throw new Error(`${res.status}`);
    const docs = await res.json();

    state.db = await create({
      schema: { id: 'string', title: 'string', content: 'string', source: 'string' }
    });
    await insertMultiple(state.db, docs);
    state.isReady = true;
    console.log(`Bensonbot: Ready with ${docs.length} knowledge segments.`);
  } catch (err) {
    console.warn("Bensonbot: Local knowledge base failed to load.", err);
  }
}

// Start
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBensonbot);
} else {
  initBensonbot();
}
