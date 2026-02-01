# Bensonbot Configuration & Usage

## 🚀 Setup & Deployment

1.  **Get a Gemini API Key**
    *   Visit [Google AI Studio](https://aistudio.google.com/) and create a free API key.

3.  **Deployment Summary**: You should deploy the **entire repository** (all files) to a single Netlify project. Netlify will automatically:
    *   Build and serve your Jekyll frontend.
    *   Deploy the chatbot backend as a Netlify Function.
    *   This ensures both parts share the same domain and can communicate without CORS issues.

2.  **Deploy to Netlify**
    *   **Create account**: Sign up or log in to [Netlify](https://app.netlify.com/).
    *   **Import Project**:
        1. Click **Add new site** > **Import an existing project**.
        2. Choose **GitHub** as your Git provider.
        3. Authorize Netlify and select your repository: `Virgo-Alpha.github.io`.
    *   **Site Configuration**:
        *   **Build command**: `npm run build:kb && jekyll build`
        *   **Publish directory**: `_site`
    *   **Environment Variables**:
        1. Before clicking deploy (or after in Site Settings), go to **Site configuration > Environment variables**.
        2. Add a new variable:
           *   **Key**: `GEMINI_API_KEY`
           *   **Value**: `your_api_key_here`
    *   **Deploy**: Click **Deploy site**. Netlify will build your site and deploy the chat function.

> [!NOTE]
> **Deployment Scope**: You should deploy your **entire repository** to Netlify. Netlify will host your Jekyll frontend and the chatbot function together, allowing them to communicate seamlessly.

3.  **Update Frontend (If needed)**
    *   Once deployed, Netlify gives you a URL (e.g., `https://your-site.netlify.app`). 
    *   Bensonbot is configured to use `/.netlify/functions/chat` which works automatically on that domain.

---

## 📚 Managing the Knowledge Base

Bensonbot answers questions based on the text files located in `_bensonbot/source/`. To make the bot "smarter" or add new content, follow these steps:

### How to Add New Content
1.  **Create a Markdown File**: Go to `_bensonbot/source/` and create a new file, e.g., `new-article.md`.
2.  **Add Metadata (Frontmatter)**: At the top of the file, add a title between triple dashes:
    ```markdown
    ---
    title: "My New Article Title"
    ---
    ```
3.  **Paste Content**: Paste the text you want the bot to know below the dashes.
    *   **Plain Text works best**: You don't need complex formatting.
    *   **Structure**: Use headers (`#`, `##`) to separate sections if it's long.
    *   **Context**: Ensure the text clearly describes *what* it is (e.g., "In this project, I built a...").

### Example: Adding a Resume Update
Open `_bensonbot/source/resume.md` and simply paste your updated resume text.

### Example: Adding a Blog Post
Create `_bensonbot/source/blog-post-1.md`:
```markdown
---
title: "How I Built Bensonbot"
---
In this article, I discuss how I built a serverless AI chatbot using Netlify Functions and Gemini...
[Paste the rest of the article here]
```

---

## 🔄 Rebuilding the Knowledge Base

After adding or modifying files in `_bensonbot/source/`, you must rebuild the JSON database (`assets/kb.json`) so the bot can access the new information.

### Local Method (Recommended)
1.  Open your terminal in the project root.
2.  Run the build command:
    ```bash
    npm run build:kb
    ```
3.  You should see "Knowledge base built with X chunks."
4.  Commit and push the updated `assets/kb.json` to GitHub.

### Automatic Method (Optional)
You can configure Netlify to run this script every time you deploy.
Change your **Build command** in Netlify to:
```bash
npm run build:kb && jekyll build
```
This ensures the bot always has the latest data from your source folder.

---

## ☁️ Deployment to Google Cloud Run (Option 2)

If you decide to migrate from Netlify/GitHub Pages to a single Cloud Run service:

### 1. Prepare your files
A standalone Node.js server and Dockerfile are provided in `_bensonbot/cloudrun/`.

1.  **Build your site**: Run `bundle exec jekyll build` locally.
2.  **Prepare the folder**:
    *   Create a folder `cloudrun-app/`.
    *   Copy `_bensonbot/cloudrun/*` into it.
    *   Copy your Jekyll build output (`_site/*`) into `cloudrun-app/public/`.
    *   Copy your knowledge base (`assets/kb.json`) into `cloudrun-app/public/assets/kb.json`.

### 2. Update the Frontend
In `assets/js/bensonbot.js`, change the `BENSONBOT_ENDPOINT` to use a relative path since the server will host both the site and the API:
```js
const BENSONBOT_ENDPOINT = "/chat";
```

### 3. Deploy to Cloud Run
Run the following command from within your `cloudrun-app/` folder:
```bash
gcloud run deploy bensonbot-portfolio \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=your_key_here
```

### 4. Why Cloud Run?
*   **Single Service**: Hosts both your portfolio and the chatbot API.
*   **Scalability**: Scales to zero when not in use (cost-effective).
*   **No exposed keys**: Environment variables are kept secure on Google Cloud.

---

## 🛠️ Troubleshooting

### 1. Bot icon is not appearing locally
If you open `index.html` directly in your browser (`file://` protocol), the bot will not load due to security restrictions on ES modules and `fetch` requests.
**Fix**: Use a local web server:
```bash
bundle exec jekyll serve
```
Then visit `http://localhost:4000`.

### 2. Netlify Build Fails (CSV gem error)
If the Netlify build fails with a "Liquid syntax error" or "missing csv" message:
- Ensure your `Gemfile` includes `gem "csv"`.
- Ensure your Ruby version is pinned to `3.1.2` in `Gemfile` and `.ruby-version`.
*(Note: I have already applied these fixes to your repository).*

### 3. Checking Logs
Open your browser's **Developer Tools (F12)** and look at the **Console** tab. The script logs its progress with the prefix `Bensonbot:`.
*   If you see "Failed to load kb.json", ensure you've run `npm run build:kb`.
*   If you see "UI injected", the HTML exists but might be hidden by CSS.

### 3. Knowledge Base
If the bot gives generic answers, ensure `assets/kb.json` contains your content.
```bash
npm run build:kb
```

### 4. Local Search Fallback
The bot uses **Orama** for local search. Even if you don't have an AI backend running (using `jekyll serve`), the bot will still find relevant information and show it to you as "Local Search Results". This proves that your knowledge base is correctly indexed.

### 5. Advanced Local Testing (AI Mode)
If you want to test the full AI experience locally (without 404s and with actual AI summaries):

1.  **Install Netlify CLI**: `npm install -g netlify-cli`
2.  **Create a `.env` file** in the root directory:
    ```env
    GEMINI_API_KEY=your_actual_key_here
    ```
3.  **Run with Netlify**: 
    ```bash
    netlify dev
    ```
    This will start Jekyll **and** the Netlify Functions on a new port (usually 8888). Visit the Netlify port to see the full AI in action.
