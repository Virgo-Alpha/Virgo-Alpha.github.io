# Personal Portfolio page

This is my personal GitHub Pages site. It is built with **Jekyll** and hosted by GitHub Pages at  
👉 [https://virgo-alpha.github.io](https://virgo-alpha.github.io)

## 🚀 Getting Started (Local Development)

```bash
For any updates to the UI, update the index.md at the root of the folder and assets/css/styles.css for styling.
```

Follow these steps to run the site locally.

### 1. Install Ruby and Bundler

On Ubuntu/Debian:

```bash
# Install Ruby and build tools
sudo apt update
sudo apt install -y ruby-full build-essential zlib1g-dev

# Add Ruby gems to your PATH (optional convenience)
echo '# Install Ruby Gems to ~/.gem' >> ~/.bashrc
echo 'export GEM_HOME="$HOME/.gem"' >> ~/.bashrc
echo 'export PATH="$HOME/.gem/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
````

Check versions:

```bash
ruby -v
gem -v
```

Install Bundler:

```bash
sudo gem install bundler
```

### 2. Clone this repo

```bash
git clone https://github.com/Virgo-Alpha/Virgo-Alpha.github.io.git
cd Virgo-Alpha.github.io
```

### 3. Install dependencies

#### Option A (system-wide with `sudo`)

This will install gems into the system Ruby directories (requires root):

```bash
sudo bundle install
```
<!-- 
#### Option B (recommended: local install, no sudo)

This installs gems under `vendor/bundle/` in your project:

```bash
bundle install --path vendor/bundle
``` -->

<!-- > If you use Option B, make sure `vendor/` is listed in `.gitignore` (already set up). -->

### 4. Serve the site locally

Run:

```bash
bundle exec jekyll serve
```

This will:

* Build the site into the `_site/` folder
* Serve it at [http://localhost:4000](http://localhost:4000)

### 5. Clean builds (if needed)

If you change gems or config, clean old files:

```bash
bundle exec jekyll clean
```

---

## 🛠 Project Structure

* `_config.yml` — Site configuration
* `index.md` / `index.html` — Homepage
* `_posts/` — Blog posts (filenames must be `YYYY-MM-DD-title.md`)
* `assets/` — Images, CSS, JS
* `_site/` — **Generated output** (ignored by git)
* `vendor/` — Local gems if installed with Option B (ignored by git)

---

## 🌐 Deployment

Pushing changes to the `main` branch automatically rebuilds the site with GitHub Pages.

If you add a **custom domain**, set it in GitHub → Settings → Pages and update DNS accordingly.

---

## ⚠️ Notes

* GitHub Pages uses its own pinned Jekyll toolchain (currently `github-pages` gem).
* Do **not** commit `_site/` or `vendor/` to the repo.
* If you get `PermissionError` with Bundler, try the safer Option B (`bundle install --path vendor/bundle`).
