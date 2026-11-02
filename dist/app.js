(() => {
  const root = document.documentElement;
  const toggles = [...document.querySelectorAll('[data-theme-toggle]')];
  const syncTheme = () => {
    const dark = root.dataset.theme === 'dark';
    toggles.forEach(button => {
      button.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} theme`);
      button.setAttribute('aria-pressed', String(dark));
      button.title = `Switch to ${dark ? 'light' : 'dark'} theme`;
    });
    document.querySelector('meta[name="theme-color"]').content = dark ? '#191a18' : '#f4f3ee';
  };
  toggles.forEach(button => button.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('akash-theme', root.dataset.theme); } catch {}
    syncTheme();
  }));
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    let saved;
    try { saved = localStorage.getItem('akash-theme'); } catch {}
    if (!saved) { root.dataset.theme = event.matches ? 'dark' : 'light'; syncTheme(); }
  });
  syncTheme();

  const menuButton = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');
  const overlay = document.getElementById('menu-overlay');
  function setMenu(open, restoreFocus = true) {
    menu.hidden = !open;
    overlay.hidden = !open;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('menu-open', open);
    if (open) menu.querySelector('a').focus();
    else if (restoreFocus) menuButton.focus();
  }
  menuButton.addEventListener('click', () => setMenu(menu.hidden));
  overlay.addEventListener('click', () => setMenu(false));
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    setMenu(false, false);
    const url = new URL(link.href);
    if (url.pathname === location.pathname && url.hash) {
      const section = document.querySelector(url.hash);
      if (section) { section.tabIndex = -1; section.focus({preventScroll:true}); }
    }
  }));
  document.addEventListener('keydown', event => {
    if (menu.hidden) return;
    if (event.key === 'Escape') { event.preventDefault(); setMenu(false); }
    if (event.key === 'Tab') {
      const focusables = [menuButton, ...menu.querySelectorAll('a')];
      const current = focusables.indexOf(document.activeElement);
      if (event.shiftKey && current <= 0) { event.preventDefault(); focusables.at(-1).focus(); }
      else if (!event.shiftKey && (current === focusables.length - 1 || current < 0)) { event.preventDefault(); menuButton.focus(); }
    }
  });
  matchMedia('(min-width: 901px)').addEventListener('change', event => {
    if (event.matches && !menu.hidden) setMenu(false, false);
  });

  const sections = [...document.querySelectorAll('main section[id]')];
  if (sections.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        document.querySelectorAll('.nav-links a').forEach(link => {
          if (link.hash === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, {rootMargin:'-15% 0px -65% 0px', threshold:0});
    sections.forEach(section => observer.observe(section));
  }
  const filters = [...document.querySelectorAll('[data-filter]')];
  function filterNotes(category, updateURL = true) {
    const valid = filters.some(button => button.dataset.filter === category) ? category : 'all';
    filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === valid)));
    let count = 0;
    document.querySelectorAll('[data-category]').forEach(row => {
      row.hidden = valid !== 'all' && row.dataset.category !== valid;
      if (!row.hidden) count++;
    });
    document.getElementById('filter-status').textContent = valid === 'all' ? 'Showing all 3 breakdowns' : `Showing ${count} ${valid} breakdown${count === 1 ? '' : 's'}`;
    if (updateURL) history.replaceState(null, '', valid === 'all' ? location.pathname : `?topic=${encodeURIComponent(valid)}`);
  }
  if (filters.length) {
    filters.forEach(button => button.addEventListener('click', () => filterNotes(button.dataset.filter)));
    filterNotes(new URLSearchParams(location.search).get('topic') || 'all', false);
  }

  document.querySelectorAll('[data-contact-link]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      if (location.hash !== '#contact') history.pushState(null, '', '#contact');
      document.getElementById('contact').scrollIntoView({block:'start'});
      const heading = document.getElementById('contact-title');
      heading.tabIndex = -1;
      heading.focus({preventScroll:true});
    });
  });
  const form = document.getElementById('contact-form');
  if (form) {
    const message = form.elements.message;
    const status = document.getElementById('contact-status');
    const draft = document.getElementById('email-draft');
    form.querySelector('[type="submit"]').disabled = false;
    [form.elements.name, message].forEach(field => {
      field.addEventListener('input', () => field.setCustomValidity(field.value.trim() ? '' : 'Please fill out this field.'));
    });
    message.addEventListener('input', () => {
      document.getElementById('message-count').textContent = `${(2500 - message.value.length).toLocaleString('en-US')} characters remaining`;
    });
    form.addEventListener('submit', event => {
      event.preventDefault();
      [form.elements.name, message].forEach(field => field.setCustomValidity(field.value.trim() ? '' : 'Please fill out this field.'));
      if (!form.reportValidity()) return;
      const name = form.elements.name.value.trim();
      const email = form.elements.email.value.trim();
      const body = `Hi Akash,\n\n${message.value.trim()}\n\nFrom: ${name}\nEmail: ${email}`;
      draft.href = `mailto:${form.dataset.recipient}?subject=${encodeURIComponent('Portfolio enquiry from ' + name)}&body=${encodeURIComponent(body)}`;
      draft.hidden = false;
      status.textContent = `Your draft is ready. Open it in your email app, review it and send it there. If no email app is configured, email ${form.dataset.recipient} directly.`;
      draft.focus();
    });
  }
})();
