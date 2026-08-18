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

  // Start Your Order: top-level fork between "For Myself" and
  // "For a Wedding Party." Each reveals its own fields, fee, and terms
  // checkbox; the submit button label follows whichever is chosen.
  const orderRadios = document.querySelectorAll('input[name="order-type"]');
  const orderPanels = {
    myself: document.getElementById('orderMyself'),
    wedding: document.getElementById('orderWedding')
  };
  const orderSubmit = document.getElementById('orderSubmit');
  const submitLabels = {
    myself: 'Confirm & Pay $100 Deposit',
    wedding: 'Confirm & Pay $50 Admin Fee'
  };
  const updateOrderTypeVisibility = () => {
    const checked = document.querySelector('input[name="order-type"]:checked');
    const value = checked ? checked.value : '';
    Object.keys(orderPanels).forEach((key) => {
      const panel = orderPanels[key];
      if (!panel) return;
      panel.hidden = key !== value;
    });
    if (orderSubmit) {
      if (value && submitLabels[value]) {
        orderSubmit.disabled = false;
        orderSubmit.textContent = submitLabels[value];
      } else {
        orderSubmit.disabled = true;
        orderSubmit.textContent = 'Continue';
      }
    }
  };
  if (orderRadios.length) {
    orderRadios.forEach((radio) => radio.addEventListener('change', () => {
      updateOrderTypeVisibility();
      // Scroll the newly revealed fields into view so it's obvious
      // something appeared, rather than leaving it below the fold.
      const visiblePanel = Object.values(orderPanels).find((p) => p && !p.hidden);
      if (visiblePanel) {
        visiblePanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }));
  }

  // Within "For Myself," a second inline toggle reveals measurement or
  // brand-size fields in place, no page navigation required.
  const sizingRadios = document.querySelectorAll('input[name="sizing-method"]');
  const sizingPanels = {
    measurements: document.getElementById('sizingMeasurements'),
    brand: document.getElementById('sizingBrand')
  };
  const updateSizingVisibility = () => {
    const checked = document.querySelector('input[name="sizing-method"]:checked');
    const value = checked ? checked.value : '';
    Object.keys(sizingPanels).forEach((key) => {
      const panel = sizingPanels[key];
      if (panel) panel.hidden = key !== value;
    });
  };
  if (sizingRadios.length) {
    sizingRadios.forEach((radio) => radio.addEventListener('change', updateSizingVisibility));
  }

  // Mock payment step. This is a placeholder UI only, standing in for a
  // real payment gateway (Stripe or similar) once that's connected, no
  // card data is collected or sent anywhere.
  const form = document.querySelector('form.rsvp');
  const paymentMock = document.getElementById('paymentMock');
  const orderConfirmation = document.getElementById('orderConfirmation');
  const paymentDescription = document.getElementById('paymentDescription');
  const paymentAmount = document.getElementById('paymentAmount');
  const payButton = document.getElementById('payButton');
  const paymentBack = document.getElementById('paymentBack');

  const paymentCopy = {
    myself: { description: 'Deposit to confirm your order', amount: '$100' },
    wedding: { description: 'Wedding party admin fee', amount: '$50' }
  };

  if (form && paymentMock) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const checked = document.querySelector('input[name="order-type"]:checked');
      const value = checked ? checked.value : 'myself';
      const copy = paymentCopy[value] || paymentCopy.myself;

      if (paymentDescription) paymentDescription.textContent = copy.description;
      if (paymentAmount) paymentAmount.textContent = copy.amount;
      if (payButton) payButton.textContent = `Pay ${copy.amount}`;

      form.hidden = true;
      paymentMock.hidden = false;
      paymentMock.classList.add('in');
      paymentMock.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  if (paymentBack && form && paymentMock) {
    paymentBack.addEventListener('click', () => {
      paymentMock.hidden = true;
      form.hidden = false;
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  if (payButton && paymentMock && orderConfirmation) {
    payButton.addEventListener('click', () => {
      payButton.disabled = true;
      payButton.textContent = 'Processing…';
      setTimeout(() => {
        paymentMock.hidden = true;
        orderConfirmation.hidden = false;
        orderConfirmation.classList.add('in');
        orderConfirmation.scrollIntoView({ behavior: 'smooth', block: 'start' });
        payButton.disabled = false;
      }, 1100);
    });
  }
});
