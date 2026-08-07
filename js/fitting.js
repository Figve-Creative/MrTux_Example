// Mr. Tux — Pre-Visit Fitting Profile wizard
// Vanilla JS, no dependencies. Progressive: works step-to-step even if a
// user has JS-disabled fallback content removed (steps degrade to visible
// stacked sections, still readable/fillable, just without single-step focus).

(function () {
  const steps = document.querySelectorAll('.wizard-step');
  if (!steps.length) return; // not on the fitting page

  const backBtn = document.getElementById('flowBack');
  const progressBar = document.getElementById('flowProgressBar');
  const progressWrap = document.getElementById('flowProgressWrap');
  const liveRegion = document.getElementById('live-region');

  const progressMap = { intro: 0, method: 25, measurements: 55, brand: 55, contact: 80, done: 100 };
  const stepLabels = {
    intro: 'Welcome',
    method: 'Choose your sizing method',
    measurements: 'Enter measurements',
    brand: 'Enter brand sizes',
    contact: 'Your contact details',
    done: 'Profile complete'
  };

  let historyStack = ['intro'];

  function showStep(name, { pushHistory = true } = {}) {
    const target = document.querySelector(`.wizard-step[data-step="${name}"]`);
    if (!target) return;

    steps.forEach((s) => s.classList.toggle('active', s === target));

    if (pushHistory) historyStack.push(name);
    if (backBtn) backBtn.hidden = name === 'intro';

    const pct = progressMap[name] ?? 0;
    if (progressBar) progressBar.style.width = pct + '%';
    if (progressWrap) progressWrap.setAttribute('aria-valuenow', String(pct));

    if (liveRegion) liveRegion.textContent = stepLabels[name] || name;

    const heading = target.querySelector('h1, h2');
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Forward navigation via [data-next]
  document.querySelectorAll('[data-next]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      showStep(el.getAttribute('data-next'));
    });
  });

  // Method choice: enable Continue once a card is picked, route dynamically
  const methodRadios = document.querySelectorAll('input[name="method"]');
  const methodContinue = document.getElementById('methodContinue');
  methodRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
      if (methodContinue) {
        methodContinue.disabled = false;
        methodContinue.removeAttribute('aria-disabled');
      }
    });
  });
  if (methodContinue) {
    methodContinue.addEventListener('click', () => {
      const chosen = document.querySelector('input[name="method"]:checked');
      if (!chosen) return;
      showStep(chosen.value === 'brand' ? 'brand' : 'measurements');
    });
  }

  // Back button pops the real navigation history (not just the previous step number)
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      if (historyStack.length > 1) {
        historyStack.pop(); // discard current
        const prev = historyStack[historyStack.length - 1];
        showStep(prev, { pushHistory: false });
      }
    });
  }

  // Complete profile: light validation, build a readable summary, persist locally
  const completeBtn = document.getElementById('completeProfile');
  const errorEl = document.getElementById('contactError');

  function val(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (m) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[m]));
  }

  function buildSummary() {
    const summary = document.getElementById('confirmSummary');
    if (!summary) return;

    const name = val('c-name') || '—';
    const email = val('c-email') || '—';
    const occasion = val('c-occasion') || '—';

    let sizingLine = 'Sizing: not provided — our fit specialists will size you on arrival';
    if (val('m-chest')) {
      sizingLine = `Measurements on file — Chest ${val('m-chest')}", Waist ${val('m-waist') || '—'}"`;
    } else if (val('bf-tomford-jacket') || val('bf-brioni-jacket') || val('bf-hugoboss-jacket') ||
               val('bf-ralphlauren-jacket') || val('bf-canali-jacket') || val('bf-zegna-jacket')) {
      sizingLine = 'Brand sizes on file';
    }

    summary.innerHTML =
      `<strong>Name</strong> &nbsp; ${escapeHtml(name)}<br>` +
      `<strong>Email</strong> &nbsp; ${escapeHtml(email)}<br>` +
      `<strong>Occasion</strong> &nbsp; ${escapeHtml(occasion)}<br>` +
      `${escapeHtml(sizingLine)}`;
  }

  function persistProfile() {
    try {
      const profile = {
        name: val('c-name'),
        email: val('c-email'),
        phone: val('c-phone'),
        occasion: val('c-occasion'),
        date: val('c-date'),
        measurements: {
          chest: val('m-chest'), waist: val('m-waist'), hips: val('m-hips'),
          inseam: val('m-inseam'), neck: val('m-neck'), sleeve: val('m-sleeve'),
          shoulder: val('m-shoulder'), shoe: val('m-shoe'), belt: val('m-belt')
        },
        savedAt: new Date().toISOString()
      };
      window.localStorage.setItem('mrtux_fitting_profile', JSON.stringify(profile));
    } catch (err) {
      // localStorage unavailable (private browsing, etc.) — non-fatal, form still works
    }
  }

  if (completeBtn) {
    completeBtn.addEventListener('click', () => {
      const nameEl = document.getElementById('c-name');
      const emailEl = document.getElementById('c-email');
      const hasName = nameEl && nameEl.value.trim();
      const hasEmail = emailEl && emailEl.value.trim();

      if (!hasName || !hasEmail) {
        if (errorEl) errorEl.style.display = 'block';
        (hasName ? emailEl : nameEl).focus();
        return;
      }
      if (errorEl) errorEl.style.display = 'none';

      persistProfile();
      buildSummary();
      showStep('done');
    });
  }
})();
