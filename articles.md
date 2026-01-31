---
layout: default
title: Articles
permalink: /articles/
---

<!-- ===================== Articles ===================== -->
<section id="articles" class="section" data-aos="fade-up">
  <div class="section-header">
    <h2>✍️ Articles</h2>
    <a class="view-all" href="https://dev.to/virgoalpha" target="_blank" rel="noopener">dev.to →</a>
  </div>

  {% assign articles_count = site.data.articles | size %}
  {% if articles_count > 4 %}
    <div class="carousel-wrapper">
      <button class="scroll-btn left" data-target="#articles-track" aria-label="Scroll articles left">‹</button>
      <div id="articles-track" class="carousel-track" role="region" aria-label="Articles list">
        {% for item in site.data.articles %}
        <article class="card" data-aos="zoom-in" data-aos-delay="100">
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
