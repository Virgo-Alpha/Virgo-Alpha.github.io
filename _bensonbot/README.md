# Bensonbot Configuration & Usage

## 🚀 Setup & Deployment

1.  **Get a Gemini API Key**
    *   Visit [Google AI Studio](https://aistudio.google.com/) and create a free API key.

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
