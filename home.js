/* =========================================================
   SRI QA Academy — homepage script (index.html only).
   ========================================================= */

/* ----------  EDIT THESE  ---------- */
const CONFIG = {
  whatsapp: '918247564178',                     // country code + number, no "+" or spaces
  // Next batch start, in IST. When this date passes, the countdown hides
  // automatically and the strip says "new batch announced soon".
  batchStart: '2026-10-05T07:30:00+05:30',
  batchLengthMinutes: 60,
};
/* ---------------------------------- */

const COURSE_NAMES = {
  ts: 'AI Powered Playwright with JS/TypeScript',
  py: 'AI Powered Playwright with Python & ChatBot',
  manual: 'AI Powered Manual Testing',
};

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

function safe(name, fn) { try { fn(); } catch (e) { console.error(name + ' failed:', e); } }

safe('theme', initTheme);
safe('menu', initMenu);
safe('batch', initBatch);
safe('picker', initPicker);
safe('stories', initStories);
safe('contact', initContact);
safe('reveal', initReveal);
safe('year', () => { $('#year').textContent = new Date().getFullYear(); });

/* ---------- theme (remembers choice, defaults to system) ---------- */
function initTheme() {
  const btn = $('#themeToggle');
  btn.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('sriqa-theme', next); } catch (e) {}
  });
}

/* ---------- mobile menu ---------- */
function initMenu() {
  const btn = $('#menuBtn'), nav = $('#mainNav');
  const set = (open) => { nav.classList.toggle('open', open); btn.setAttribute('aria-expanded', open); };
  btn.addEventListener('click', () => set(!nav.classList.contains('open')));
  $$('a', nav).forEach(a => a.addEventListener('click', () => set(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
}

/* ---------- next batch: date in IST + visitor's local time + countdown ---------- */
function initBatch() {
  const card = $('#batchCard'), dateEl = $('#batchDate'), localEl = $('#batchLocal');
  const start = new Date(CONFIG.batchStart);
  const end = new Date(start.getTime() + CONFIG.batchLengthMinutes * 60000);

  const fmt = (d, tz, opts = {}, loc = 'en-IN') => new Intl.DateTimeFormat(loc, {
    timeZone: tz, weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit', ...opts,
  }).format(d);
  const timeOnly = (d, tz) => new Intl.DateTimeFormat('en-IN', { timeZone: tz, hour: 'numeric', minute: '2-digit', timeZoneName: 'short' }).format(d);

  if (Date.now() >= start.getTime()) {
    card.classList.add('expired');
    dateEl.textContent = 'New batch dates announced soon';
    localEl.textContent = 'Message us to get notified and reserve an early seat.';
    return;
  }

  dateEl.textContent = `${fmt(start, 'Asia/Kolkata')} – ${timeOnly(end, 'Asia/Kolkata')}`.replace('GMT+5:30', 'IST');
  const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (userTz && userTz !== 'Asia/Kolkata' && userTz !== 'Asia/Calcutta') {
    localEl.textContent = `Your time: ${fmt(start, userTz, { timeZoneName: 'short' }, undefined)}`;
  } else {
    localEl.textContent = 'Live online · Weekday batch · Sessions recorded';
  }

  const els = ['#cdD', '#cdH', '#cdM', '#cdS'].map(s => $(s));
  const pad = n => String(n).padStart(2, '0');
  const tick = () => {
    const diff = start.getTime() - Date.now();
    if (diff <= 0) { clearInterval(timer); initBatch(); return; }
    const s = Math.floor(diff / 1000);
    [Math.floor(s / 86400), Math.floor(s / 3600) % 24, Math.floor(s / 60) % 60, s % 60]
      .forEach((v, i) => { els[i].textContent = pad(v); });
  };
  const timer = setInterval(tick, 1000);
  tick();
}

/* ---------- "I am…" course picker ---------- */
function initPicker() {
  const grid = $('.course-grid');
  const chips = $$('.chip[data-pick]');
  chips.forEach(chip => chip.addEventListener('click', () => {
    const already = chip.getAttribute('aria-pressed') === 'true';
    chips.forEach(c => c.setAttribute('aria-pressed', 'false'));
    $$('.course-card').forEach(c => c.classList.remove('match'));
    grid.classList.toggle('picking', !already);
    if (already) return;
    chip.setAttribute('aria-pressed', 'true');
    const card = $(`.course-card[data-course-id="${chip.dataset.pick}"]`);
    card.classList.add('match');
    if (window.innerWidth < 980) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }));
}

/* ---------- stories slider (native scroll-snap, arrows just scroll) ---------- */
function initStories() {
  const track = $('#stories-track');
  const step = () => { const c = $('.story', track); return c ? c.offsetWidth + 24 : 300; };
  $('#storyPrev').addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
  $('#storyNext').addEventListener('click', () => {
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    atEnd ? track.scrollTo({ left: 0, behavior: 'smooth' }) : track.scrollBy({ left: step(), behavior: 'smooth' });
  });
}

/* ---------- contact dialog → WhatsApp ---------- */
function initContact() {
  const dlg = $('#contactModal'), form = $('#leadForm'), f = form.elements;
  const formView = $('#contactForm'), doneView = $('#contactDone');

  const open = (course) => {
    formView.hidden = false; doneView.hidden = true;
    f.course.value = course || '';
    dlg.showModal();
    setTimeout(() => f.name.focus(), 50);
  };
  $$('.js-contact').forEach(b => b.addEventListener('click', () => open(b.dataset.course)));
  $$('[data-close]', dlg).forEach(b => b.addEventListener('click', () => dlg.close()));
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); }); // click on backdrop

  const setErr = (input, msg) => {
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    input.parentElement.querySelector('.err').textContent = msg || '';
    return !msg;
  };

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = f.name.value.trim();
    const mobile = f.mobile.value.trim();
    const email = f.email.value.trim();
    const digits = mobile.replace(/\D/g, '');

    const ok = [
      setErr(f.name, name.length < 2 ? 'Please enter your full name' : ''),
      setErr(f.mobile, digits.length < 10 || digits.length > 15 ? 'Enter a valid mobile number (10–15 digits)' : ''),
      setErr(f.email, /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ? '' : 'Enter a valid email address'),
    ].every(Boolean);
    if (!ok) { $('[aria-invalid="true"]', form).focus(); return; }

    const course = COURSE_NAMES[f.course.value];
    const intro = course
      ? `Hi! I'm interested in the "${course}" course.`
      : "Hi! I have some questions about your courses and would like help choosing one.";
    const msg = `${intro}\n\nName: ${name}\nMobile: ${mobile}\nEmail: ${email}`;
    const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;

    if (typeof gtag === 'function') gtag('event', 'generate_lead', { course: f.course.value || 'undecided' });

    $('#waFallback').href = url;
    window.open(url, '_blank', 'noopener');
    formView.hidden = true; doneView.hidden = false;
  });
}

/* ---------- reveal on scroll ---------- */
function initReveal() {
  const els = $$('.section-head, .course-card, .steps li, .feat, .story, .faq details, .cta-inner');
  if (!('IntersectionObserver' in window)) return;
  els.forEach(el => el.classList.add('reveal'));
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
  }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => io.observe(el));
}
