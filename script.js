  // theme toggle (light / dark)
  const themeToggle = document.getElementById('themeToggle');
  themeToggle.addEventListener('click', ()=>{
    const isLight = themeToggle.getAttribute('aria-pressed') === 'true';
    const next = isLight ? 'signal' : 'daylight';
    document.documentElement.setAttribute('data-theme', next);
    themeToggle.setAttribute('aria-pressed', isLight ? 'false' : 'true');
    themeToggle.setAttribute('aria-label', isLight ? 'Switch to light theme' : 'Switch to dark theme');
  });

  // scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('show'); io.unobserve(e.target); } });
  }, {threshold:0.12});
  revealEls.forEach(el=>io.observe(el));

  // modal logic
  const overlay = document.getElementById('enrollModal');
  const openBtns = document.querySelectorAll('.js-enroll-btn');
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
