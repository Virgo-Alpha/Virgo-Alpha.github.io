---
layout: default
title: Projects
permalink: /projects/
---

<!-- ===================== Projects ===================== -->
<section id="projects" class="section" data-aos="fade-up">
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
        <article class="card" data-aos="zoom-in" data-aos-delay="100">
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
