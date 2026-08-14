document.addEventListener('DOMContentLoaded', function(){

  // Each feature runs in its own try/catch. If one feature has a problem,
  // it's logged to the console but does NOT stop the other features below
  // it from running. This is the key fix: before, one failure anywhere
  // would silently kill everything after it in the file.

  try { initThemeToggle(); } catch(err){ console.error('Theme toggle failed to start:', err); }
  try { initCarousel(); } catch(err){ console.error('Carousel failed to start:', err); }
  try { initScrollReveal(); } catch(err){ console.error('Scroll reveal failed to start:', err); }
  try { initEnrollModal(); } catch(err){ console.error('Enroll modal failed to start:', err); }
  try { initDirectWhatsAppButtons(); } catch(err){ console.error('Direct WhatsApp buttons failed to start:', err); }

  // ---------- theme toggle (light / dark) ----------
  function initThemeToggle(){
    const themeToggle = document.getElementById('themeToggle');
    if(!themeToggle) return;
    themeToggle.addEventListener('click', ()=>{
      const isLight = themeToggle.getAttribute('aria-pressed') === 'true';
      const next = isLight ? 'signal' : 'daylight';
      document.documentElement.setAttribute('data-theme', next);
      themeToggle.setAttribute('aria-pressed', isLight ? 'false' : 'true');
      themeToggle.setAttribute('aria-label', isLight ? 'Switch to light theme' : 'Switch to dark theme');
    });
  }

  // ---------- success story carousel ----------
  function initCarousel(){
    const track = document.getElementById('carouselTrack');
    const dotsWrap = document.getElementById('carouselDots');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    if(!(track && dotsWrap && prevBtn && nextBtn)) return;

    const slides = track.querySelectorAll('.carousel-slide');
    let current = 0;
    let autoplayTimer = null;

    slides.forEach((_, i)=>{
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to story ' + (i + 1));
      dot.addEventListener('click', ()=>goToSlide(i));
      dotsWrap.appendChild(dot);
    });
    const dots = dotsWrap.querySelectorAll('.carousel-dot');

    function goToSlide(index){
      current = (index + slides.length) % slides.length;
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      dots.forEach((d, i)=>d.classList.toggle('active', i === current));
    }
    function startAutoplay(){
      stopAutoplay();
      autoplayTimer = setInterval(()=>goToSlide(current + 1), 5000);
    }
    function stopAutoplay(){
      if(autoplayTimer) clearInterval(autoplayTimer);
    }

    prevBtn.addEventListener('click', ()=>{ goToSlide(current - 1); startAutoplay(); });
    nextBtn.addEventListener('click', ()=>{ goToSlide(current + 1); startAutoplay(); });

    const carouselEl = track.closest('.carousel');
    if(carouselEl){
      carouselEl.addEventListener('mouseenter', stopAutoplay);
      carouselEl.addEventListener('mouseleave', startAutoplay);
    }

    goToSlide(0);
    startAutoplay();
  }

  // ---------- scroll reveal ----------
  function initScrollReveal(){
    const revealEls = document.querySelectorAll('.reveal');
    if(!revealEls.length) return;

    // Fallback for browsers/webviews that don't support IntersectionObserver:
    // just show everything immediately instead of crashing.
    if(typeof IntersectionObserver === 'undefined'){
      revealEls.forEach(el=>el.classList.add('show'));
      return;
    }

    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('show'); io.unobserve(e.target); } });
    }, {threshold:0.12});
    revealEls.forEach(el=>io.observe(el));
  }

  // ---------- Enroll modal: opened ONLY by buttons with class "js-enroll-btn" ----------
  function initEnrollModal(){
    const overlay = document.getElementById('enrollModal');
    const openBtns = document.querySelectorAll('.js-enroll-btn');
    const closeBtn = document.getElementById('modalClose');
    const successClose = document.getElementById('successClose');
    const formState = document.getElementById('formState');
    const successState = document.getElementById('successState');
    const form = document.getElementById('enrollForm');

    if(!(overlay && openBtns.length && closeBtn && successClose && formState && successState && form)){
      console.warn('Enroll modal not initialized — missing element(s) on the page.');
      return;
    }

    const WHATSAPP_NUMBER = '918247564178';

    function openModal(){
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      formState.classList.remove('hide');
      successState.classList.remove('show');
      const nameField = document.getElementById('f-name');
      if(nameField) setTimeout(()=>nameField.focus(), 250);
    }
    function closeModal(){
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    openBtns.forEach(b=>b.addEventListener('click', openModal));
    closeBtn.addEventListener('click', closeModal);
    successClose.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e)=>{ if(e.target === overlay) closeModal(); });
    document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape' && overlay.classList.contains('open')) closeModal(); });

    function setError(fieldId, msg){
      const input = document.getElementById(fieldId);
      const err = document.getElementById('err-' + fieldId.split('-')[1]);
      if(!input || !err) return;
      if(msg){ input.classList.add('err'); err.textContent = msg; }
      else{ input.classList.remove('err'); err.textContent = ''; }
    }

    form.addEventListener('submit', function(e){
      e.preventDefault();

      const nameEl = document.getElementById('f-name');
      const mobileEl = document.getElementById('f-mobile');
      const emailEl = document.getElementById('f-email');
      if(!(nameEl && mobileEl && emailEl)) return;

      const name = nameEl.value.trim();
      const mobile = mobileEl.value.trim();
      const email = emailEl.value.trim();

      let valid = true;

      if(name.length < 2){ setError('f-name', 'Please enter your full name'); valid = false; }
      else setError('f-name', '');

      const mobileDigits = mobile.replace(/\D/g,'');
      if(mobileDigits.length < 10){ setError('f-mobile', 'Enter a valid 10-digit mobile number'); valid = false; }
      else setError('f-mobile', '');

      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if(!emailOk){ setError('f-email', 'Enter a valid email address'); valid = false; }
      else setError('f-email', '');

      if(!valid) return;

      const message =
        "Hi! I'd like to enroll in the Playwright Automation with TypeScript course.\n\n" +
        "Name: " + name + "\n" +
        "Mobile: " + mobile + "\n" +
        "Email: " + email;

      const waUrl = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
      window.open(waUrl, '_blank');

      formState.classList.add('hide');
      successState.classList.add('show');
    });
  }

  // ---------- Direct-to-WhatsApp buttons: "Message on WhatsApp" and "Reserve your seat" ----------
  function initDirectWhatsAppButtons(){
    const WHATSAPP_NUMBER = '918247564178';
    const directBtns = document.querySelectorAll('.js-whatsapp-direct');
    if(!directBtns.length) return;

    directBtns.forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const message = "Hi! I'm interested in the Playwright Automation with TypeScript course. Please share more details.";
        const waUrl = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
        window.open(waUrl, '_blank');
      });
    });
  }

});
