---
layout: default
title: Certification
permalink: /certification/
---

<!-- ===================== Certification ===================== -->
<section id="Certification" class="section" data-aos="fade-up">
  <div class="section-header">
    <h2>📜 Certification</h2>
    <a class="view-all" href="https://www.linkedin.com/in/benson-mugure/details/certifications/" target="_blank" rel="noopener">All certificates →</a>
  </div>
  {% assign certificates_count = site.data.certificates | size %}
  {% if certificates_count > 4 %}
    <div class="carousel-wrapper">
      <button class="scroll-btn left" data-target="#certificates-track" aria-label="Scroll certificates left">‹</button>
      <div id="certificates-track" class="carousel-track" role="region" aria-label="certificates list">
        {% for item in site.data.certificates %}
        <article class="card" data-aos="zoom-in" data-aos-delay="100">
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
