
  /* ── Mobile nav ─────────────────────────── */
  document.getElementById('mobileToggle').addEventListener('click', function () {
    this.classList.toggle('open');
    document.getElementById('mobileMenu').classList.toggle('open');
  });

  /* ── SVG icon strings ───────────────────── */
  const ICON_COPY = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>`;
  const ICON_CHECK = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;

  /* ── Toast ──────────────────────────────── */
  function showToast(msg) {
    const t = document.getElementById('toast');
    document.getElementById('toastMsg').textContent = msg;
    t.classList.add('show');
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove('show'), 2800);
  }

  /* ── Wire copy buttons ──────────────────── */
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const text   = this.dataset.copy;
      const iconEl = this.querySelector('.btn-icon');
      const lblEl  = this.querySelector('.btn-label');

      const apply = () => {
        iconEl.innerHTML = ICON_CHECK;
        lblEl.textContent = 'Copied!';
        this.classList.add('copied');

        /* spring pop */
        this.animate([
          { transform: 'scale(1)'    },
          { transform: 'scale(1.12)' },
          { transform: 'scale(1)'    },
        ], { duration: 220, easing: 'cubic-bezier(0.34,1.56,0.64,1)' });

        showToast('Copied to clipboard');

        setTimeout(() => {
          this.classList.remove('copied');
          iconEl.innerHTML  = ICON_COPY;
          lblEl.textContent = 'Copy';
        }, 2400);
      };

      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(apply).catch(() => fallback(text, apply));
      } else {
        fallback(text, apply);
      }
    });
  });

  function fallback(text, cb) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); cb(); } catch(e) {}
    document.body.removeChild(ta);
  }
