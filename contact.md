---
layout: default
title: Contact
permalink: /contact/
---

<!-- ===================== Contact ===================== -->
<section id="contact" class="section" data-aos="fade-up">
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
