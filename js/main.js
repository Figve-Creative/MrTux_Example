// Mr. Tux prototype: shared interactions

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header.site');
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('nav.links');

  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    });
  }

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      toggle.textContent = links.classList.contains('open') ? '✕' : '☰';
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.textContent = '☰';
    }));
  }

  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));

  const form = document.querySelector('form.rsvp');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button');
      const original = btn.textContent;
      btn.textContent = 'Request Sent ✓';
      btn.disabled = true;
      setTimeout(() => { btn.textContent = original; btn.disabled = false; form.reset(); }, 2600);
    });
  }

  // Inline "Tell Us About Your Fitting" toggle on the Book a Fitting page:
  // reveals measurements, brand sizes, or wedding-party fields in place,
  // no page navigation required.
  const sizingRadios = document.querySelectorAll('input[name="sizing-method"]');
  const sizingPanels = {
    measurements: document.getElementById('sizingMeasurements'),
    brand: document.getElementById('sizingBrand'),
    party: document.getElementById('sizingParty')
  };
  if (sizingRadios.length) {
    const updateSizingVisibility = () => {
      const checked = document.querySelector('input[name="sizing-method"]:checked');
      const value = checked ? checked.value : '';
      Object.keys(sizingPanels).forEach((key) => {
        const panel = sizingPanels[key];
        if (panel) panel.hidden = key !== value;
      });
    };
    sizingRadios.forEach((radio) => radio.addEventListener('change', updateSizingVisibility));
  }
});
