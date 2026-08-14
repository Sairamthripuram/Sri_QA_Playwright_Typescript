// theme toggle (light / dark)
  const themeToggle = document.getElementById('themeToggle');
  themeToggle.addEventListener('click', ()=>{
    const isLight = themeToggle.getAttribute('aria-pressed') === 'true';
    const next = isLight ? 'signal' : 'daylight';
    document.documentElement.setAttribute('data-theme', next);
    themeToggle.setAttribute('aria-pressed', isLight ? 'false' : 'true');
    themeToggle.setAttribute('aria-label', isLight ? 'Switch to light theme' : 'Switch to dark theme');
  });

  // success story carousel
  const track = document.getElementById('carouselTrack');
  const dotsWrap = document.getElementById('carouselDots');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');

  if(track && dotsWrap && prevBtn && nextBtn){
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
    carouselEl.addEventListener('mouseenter', stopAutoplay);
    carouselEl.addEventListener('mouseleave', startAutoplay);

    goToSlide(0);
    startAutoplay();
  }

  // scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('show'); io.unobserve(e.target); } });
  }, {threshold:0.12});
  revealEls.forEach(el=>io.observe(el));

  // modal logic
  const overlay = document.getElementById('enrollModal');
  const directBtns = document.querySelectorAll('.js-whatsapp-direct');
  const closeBtn = document.getElementById('modalClose');
  const successClose = document.getElementById('successClose');
  const formState = document.getElementById('formState');
  const successState = document.getElementById('successState');
  const form = document.getElementById('enrollForm');

  const WHATSAPP_NUMBER = '918247564178';

  function openModal(){
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    formState.classList.remove('hide');
    successState.classList.remove('show');
    setTimeout(()=>document.getElementById('f-name').focus(), 250);
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
    if(msg){ input.classList.add('err'); err.textContent = msg; }
    else{ input.classList.remove('err'); err.textContent = ''; }
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();

    const name = document.getElementById('f-name').value.trim();
    const mobile = document.getElementById('f-mobile').value.trim();
    const email = document.getElementById('f-email').value.trim();

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

   directBtns.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const message = "Hi! I'm interested in the Playwright Automation with TypeScript course. Please share more details.";
    const waUrl = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
    window.open(waUrl, '_blank');
  });
});
