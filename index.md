---
title: "Home"
---

<!-- Inline carousel-only styles (kept here so they don't clash with grid) -->
<style>
  .carousel { position: relative; overflow: hidden; }
  .carousel-track {
    display: flex;
    gap: 1rem;
    flex-wrap: nowrap;        /* keep in one row */
    overflow-x: auto;
    scroll-behavior: smooth;
    padding-bottom: .25rem;
    -ms-overflow-style: none; /* IE/Edge */
    scrollbar-width: none;    /* Firefox */
  }
  .carousel-track::-webkit-scrollbar { display: none; } /* WebKit */
  .carousel .card { flex: 0 0 300px; } /* slide width */
</style>

<section id="about" class="section">
  <div class="about-container">
    <img src="{{ '/assets/images/me.jpeg' | relative_url }}"
         alt="Benson Mugure"
         class="profile-pic">

    <div class="about-text">
      <h1>Hello World! I'm Benson Mugure</h1>
      <p>Software Engineer | AWS Certified | Writer</p>
      <p>I build secure, resilient, high-performing, cost-optimized cloud-native solutions.</p>
      <p><strong>Core skills:</strong> AWS · Python · Linux · Celery · Django · Docker · GCP</p>

      <p class="social-links">
        <a href="https://www.linkedin.com/in/benson-mugure-017153196" target="_blank" aria-label="LinkedIn">
          <i class="fa-brands fa-linkedin"></i>
        </a>

        <a href="https://dev.to/virgoalpha" target="_blank" aria-label="Dev.to">
          <i class="fa-brands fa-dev"></i>
        </a>

        <a href="https://github.com/Virgo-Alpha" target="_blank" aria-label="GitHub">
          <i class="fa-brands fa-github"></i>
        </a>

        <a href="https://medium.com/@b.mugure" target="_blank" aria-label="Medium">
          <i class="fa-brands fa-medium" style="color:#12100E;"></i>
        </a>

        <a href="https://www.omprakash.org/citizen/benson-mugure" target="_blank" aria-label="Omprakash">
          <img src="assets/images/omprakash.jpeg" alt="Omprakash" style="width:36px;height:36px;">
        </a>

      </p>
    </div>
  </div>
</section>

<!-- ===================== Projects ===================== -->
<section id="projects" class="section">
  <div class="section-header">
    <h2>🚀 Projects</h2>
    <!-- TODO: Maybe have the below link point to a different page where all the projects are but are subdivided by category -->
    <a class="view-all" href="https://github.com/{{ site.github_username }}" target="_blank" rel="noopener">All repos →</a>
  </div>

  {% assign projects_count = site.data.projects | size %}
  {% if projects_count > 4 %}
    <div class="carousel">
      <button class="scroll-btn left" data-target="#projects-track" aria-label="Scroll projects left">‹</button>
      <div id="projects-track" class="carousel-track" role="region" aria-label="Projects list">
        {% for item in site.data.projects %}
        <article class="card">
          <a class="thumb" href="{{ item.link }}" target="_blank" rel="noopener" aria-label="Open project">
            <img src="{{ item.image | default: '/assets/images/placeholder_project.jpg' | relative_url }}"
                 alt="{{ item.title | escape }} thumbnail"
                 loading="lazy"
                 {% if item.preview_gif %}data-preview="{{ item.preview_gif | relative_url }}"{% endif %}>
          </a>
          <div class="card-body">
            <h3 class="card-title"><a href="{{ item.link }}" target="_blank" rel="noopener">{{ item.title }}</a></h3>
            <p class="card-text">{{ item.description }}</p>
            {% if item.stack %}<p class="card-tags">{{ item.stack }}</p>{% endif %}
            <div class="card-actions">
              {% if item.screenshot %}<a href="#" class="btn ghost" data-lightbox-src="{{ item.screenshot | relative_url }}">Preview</a>{% endif %}
              {% if item.live %}

              <a class="icon-link" href="{{ item.live }}" target="_blank" aria-label="Live site">
                <i class="fa-solid fa-globe"></i>
              </a>
            {% endif %}

            {% if item.github %}
              <a class="icon-link" href="{{ item.github }}" target="_blank" aria-label="GitHub repository">
                <i class="fa-brands fa-github"></i>
              </a>
            {% endif %}

            {% if item.devto %}
              <a class="icon-link" href="{{ item.devto }}" target="_blank" aria-label="Dev.to article">
                <i class="fa-brands fa-dev"></i>
              </a>
            {% endif %}

            {% if item.slides %}
              <a class="icon-link" href="{{ item.slides }}" target="_blank" aria-label="Presentation slides">
                <i class="fa-solid fa-person-chalkboard"></i>
              </a>
            {% endif %}

              <a class="btn" href="{{ item.link }}" target="_blank" rel="noopener">Open</a>
            </div>
          </div>
        </article>
        {% endfor %}
      </div>
      <button class="scroll-btn right" data-target="#projects-track" aria-label="Scroll projects right">›</button>
    </div>
  {% else %}
    <div class="gallery">
      {% for item in site.data.projects %}
      <article class="card">
        <a class="thumb" href="{{ item.link }}" target="_blank" rel="noopener" aria-label="Open project">
          <img src="{{ item.image | default: '/assets/images/placeholder_project.jpg' | relative_url }}"
               alt="{{ item.title | escape }} thumbnail" loading="lazy">
        </a>
        <div class="card-body">
          <h3 class="card-title"><a href="{{ item.link }}" target="_blank" rel="noopener">{{ item.title }}</a></h3>
          <p class="card-text">{{ item.description }}</p>
          {% if item.stack %}<p class="card-tags">{{ item.stack }}</p>{% endif %}
          <div class="card-actions">
            {% if item.screenshot %}<a href="#" class="btn ghost" data-lightbox-src="{{ item.screenshot | relative_url }}">Preview</a>{% endif %}
            {% if item.live %}
            <a class="icon-link" href="{{ item.live }}" target="_blank" aria-label="Live site">
              <i class="fa-solid fa-globe"></i>
            </a>
          {% endif %}

          {% if item.github %}
            <a class="icon-link" href="{{ item.github }}" target="_blank" aria-label="GitHub repository">
              <i class="fa-brands fa-github"></i>
            </a>
          {% endif %}

          {% if item.devto %}
            <a class="icon-link" href="{{ item.devto }}" target="_blank" aria-label="Dev.to article">
              <i class="fa-brands fa-dev"></i>
            </a>
          {% endif %}

          {% if item.slides %}
            <a class="icon-link" href="{{ item.slides }}" target="_blank" aria-label="Presentation slides">
              <i class="fa-solid fa-person-chalkboard"></i>
            </a>
          {% endif %}

            <a class="btn" href="{{ item.link }}" target="_blank" rel="noopener">Open</a>
          </div>
        </div>
      </article>
      {% endfor %}
    </div>
  {% endif %}
</section>

<!-- ===================== Certification ===================== -->
<section id="Certification" class="section">
  <div class="section-header">
    <h2>📜 Certification</h2>
    <a class="view-all" href="https://www.linkedin.com/in/benson-mugure-017153196/details/certifications/" target="_blank" rel="noopener">All certificates →</a>
  </div>
  {% assign certificates_count = site.data.certificates | size %}
  {% if certificates_count > 4 %}
    <div class="carousel">
      <button class="scroll-btn left" data-target="#certificates-track" aria-label="Scroll certificates left">‹</button>
      <div id="certificates-track" class="carousel-track" role="region" aria-label="certificates list">
        {% for item in site.data.certificates %}
        <article class="card">
          <a class="thumb" href="{{ item.link }}" target="_blank" rel="noopener" aria-label="Open video">
            <img src="{{ item.image | default: '/assets/images/placeholder_video.jpg' | relative_url }}"
                 alt="{{ item.title | escape }} thumbnail"
                 loading="lazy"
                 {% if item.preview_gif %}data-preview="{{ item.preview_gif | relative_url }}"{% endif %}>
          </a>
          <div class="card-body">
            <h3 class="card-title"><a href="{{ item.link }}" target="_blank" rel="noopener">{{ item.title }}</a></h3>
            {% if item.note %}<p class="card-text">{{ item.note }}</p>{% endif %}
            <div class="card-actions">
              {% if item.screenshot %}<a href="#" class="btn ghost" data-lightbox-src="{{ item.screenshot | relative_url }}">Preview</a>{% endif %}
              <a class="btn" href="{{ item.link }}" target="_blank" rel="noopener">View</a>
            </div>
          </div>
        </article>
        {% endfor %}
      </div>
      <button class="scroll-btn right" data-target="#certificates-track" aria-label="Scroll certificates right">›</button>
    </div>
  {% else %}
    <div class="gallery">
      {% for item in site.data.certificates %}
      <article class="card">
        <a class="thumb" href="{{ item.link }}" target="_blank" rel="noopener" aria-label="Open video">
          <img src="{{ item.image | default: '/assets/images/placeholder_video.jpg' | relative_url }}"
               alt="{{ item.title | escape }} thumbnail" loading="lazy">
        </a>
        <div class="card-body">
          <h3 class="card-title"><a href="{{ item.link }}" target="_blank" rel="noopener">{{ item.title }}</a></h3>
          {% if item.note %}<p class="card-text">{{ item.note }}</p>{% endif %}
          <div class="card-actions">
            {% if item.screenshot %}<a href="#" class="btn ghost" data-lightbox-src="{{ item.screenshot | relative_url }}">Preview</a>{% endif %}
            <a class="btn" href="{{ item.link }}" target="_blank" rel="noopener">Watch</a>
          </div>
        </div>
      </article>
      {% endfor %}
    </div>
  {% endif %}
</section>

<!-- ===================== Articles ===================== -->
<section id="articles" class="section">
  <div class="section-header">
    <h2>✍️ Articles</h2>
    <a class="view-all" href="https://dev.to/virgoalpha" target="_blank" rel="noopener">dev.to →</a>
  </div>

  {% assign articles_count = site.data.articles | size %}
  {% if articles_count > 4 %}
    <div class="carousel">
      <button class="scroll-btn left" data-target="#articles-track" aria-label="Scroll articles left">‹</button>
      <div id="articles-track" class="carousel-track" role="region" aria-label="Articles list">
        {% for item in site.data.articles %}
        <article class="card">
          <a class="thumb" href="{{ item.link }}" target="_blank" rel="noopener" aria-label="Open article">
            <img src="{{ item.image | default: '/assets/images/placeholder_article.jpg' | relative_url }}"
                 alt="{{ item.title | escape }} thumbnail"
                 loading="lazy"
                 {% if item.preview_gif %}data-preview="{{ item.preview_gif | relative_url }}"{% endif %}>
          </a>
          <div class="card-body">
            <h3 class="card-title"><a href="{{ item.link }}" target="_blank" rel="noopener">{{ item.title }}</a></h3>
            {% if item.subtitle %}<p class="card-text">{{ item.subtitle }}</p>{% endif %}
            <div class="card-actions">
              {% if item.screenshot %}<a href="#" class="btn ghost" data-lightbox-src="{{ item.screenshot | relative_url }}">Preview</a>{% endif %}
              <a class="btn" href="{{ item.link }}" target="_blank" rel="noopener">Read</a>
            </div>
          </div>
        </article>
        {% endfor %}
      </div>
      <button class="scroll-btn right" data-target="#articles-track" aria-label="Scroll articles right">›</button>
    </div>
  {% else %}
    <div class="gallery">
      {% for item in site.data.articles %}
      <article class="card">
        <a class="thumb" href="{{ item.link }}" target="_blank" rel="noopener" aria-label="Open article">
          <img src="{{ item.image | default: '/assets/images/placeholder_article.jpg' | relative_url }}"
               alt="{{ item.title | escape }} thumbnail" loading="lazy">
        </a>
        <div class="card-body">
          <h3 class="card-title"><a href="{{ item.link }}" target="_blank" rel="noopener">{{ item.title }}</a></h3>
          {% if item.subtitle %}<p class="card-text">{{ item.subtitle }}</p>{% endif %}
          <div class="card-actions">
            {% if item.screenshot %}<a href="#" class="btn ghost" data-lightbox-src="{{ item.screenshot | relative_url }}">Preview</a>{% endif %}
            <a class="btn" href="{{ item.link }}" target="_blank" rel="noopener">Read</a>
          </div>
        </div>
      </article>
      {% endfor %}
    </div>
  {% endif %}
</section>

<!-- ===================== Resume ===================== -->
<section id="resume" class="section">
  <div class="section-header">
    <h2><i class="fa-solid fa-file-pdf"></i> Resume</h2>
    <a class="view-all" href="{{ site.baseurl }}/assets/docs/Benson_Mugure_Resume.pdf" target="_blank" rel="noopener">Download PDF →</a>
  </div>

  <div class="gallery">
    {% for item in site.data.resume %}
    <article class="card">
      <a class="thumb" href="{{ item.pdf }}" target="_blank" rel="noopener" aria-label="View Resume">
        <img src="{{ item.image | default: '/assets/images/placeholder_resume.jpg' | relative_url }}"
             alt="{{ item.title | escape }} thumbnail" loading="lazy">
      </a>
      <div class="card-body">
        <h3 class="card-title"><a href="{{ item.pdf }}" target="_blank" rel="noopener">{{ item.title }}</a></h3>
        <p class="card-text">{{ item.description }}</p>
        <div class="card-actions">
          <a class="btn" href="{{ item.pdf }}" target="_blank" rel="noopener">View</a>
          <a class="btn ghost" href="{{ item.pdf }}" download>Download</a>
        </div>
      </div>
    </article>
    {% endfor %}
  </div>
</section>

<!-- ===================== Contact ===================== -->
<section id="contact" class="section">
  <div class="section-header">
    <h2><i class="fa-solid fa-envelope"></i> Contact Me</h2>
    <p>Get in touch with me directly using the form below.</p>
  </div>

  <div class="contact-form-container">
    <form action="https://formsubmit.co/b.mugure@alustudent.com" method="POST" class="contact-form">
      <!-- Disable CAPTCHA -->
      <input type="hidden" name="_captcha" value="false">

      <div class="form-group">
        <input type="text" name="name" placeholder="Your Name" required>
      </div>

      <div class="form-group">
        <input type="email" name="email" placeholder="Your Email" required>
      </div>

      <div class="form-group">
        <textarea name="message" placeholder="Your Message" rows="5" required></textarea>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn">Send</button>
      </div>
    </form>
  </div>
</section>

<!-- Tiny helper script for arrow buttons -->
<script>
(function () {
  function init(btn) {
    var targetSel = btn.getAttribute('data-target');
    var track = document.querySelector(targetSel);
    if (!track) return;
    var step = Math.max(300, Math.floor(track.clientWidth * 0.9));

    btn.addEventListener('click', function () {
      track.scrollBy({ left: btn.classList.contains('left') ? -step : step, behavior: 'smooth' });
    });

    function update() {
      var max = track.scrollWidth - track.clientWidth - 1;
      var x = track.scrollLeft;
      var leftBtn = track.parentElement.querySelector('.scroll-btn.left');
      var rightBtn = track.parentElement.querySelector('.scroll-btn.right');
      if (leftBtn) leftBtn.disabled = x <= 0;
      if (rightBtn) rightBtn.disabled = x >= max;
    }
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }
  document.querySelectorAll('.scroll-btn').forEach(init);
})();
</script>
