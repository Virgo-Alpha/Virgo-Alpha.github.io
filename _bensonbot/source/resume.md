---
layout: default
title: Resume
permalink: /resume/
---

<!-- ===================== Resume ===================== -->
<section id="resume" class="section" data-aos="fade-up">
  <div class="section-header">
    <h2><i class="fa-solid fa-file-pdf"></i> Resume</h2>
    <a class="view-all" href="{{ site.baseurl }}/assets/docs/Benson_Mugure_Resume.pdf" target="_blank" rel="noopener">Download PDF →</a>
  </div>

  <div class="gallery">
    {% for item in site.data.resume %}
    <article class="card" data-aos="zoom-in" data-aos-delay="100">
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
