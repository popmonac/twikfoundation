    // Modal data
(function () {
    const stories = {
    featured: {
      url: 'https://twikfoundation.org/spotlight-stories/spotlight-favour.html',
      // ... rest of fields
    },
    story1: {
      url: 'https://twikfoundation.org/spotlight-stories/spotlight-post1.html',
      // ...
    },
  
  };
    function openModal(id) {
    const s = stories[id];
    if (!s) return;

    // ... your existing modal population code ...

    // Wire modal share buttons
    const storyUrl = s.url || window.location.href; // add a `url` field to each story object
    const shareText = encodeURIComponent(s.title + ' | TWiK Foundation');
    const shareUrl  = encodeURIComponent(storyUrl);

    const [btnX, btnFB, btnCopy] = document.querySelectorAll('.modal-share .share-btn');

    btnX.onclick = () => window.open(
      `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`, '_blank', 'noopener,width=600,height=500'
    );
    btnFB.onclick = () => window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank', 'noopener,width=600,height=500'
    );
    // Add a LinkedIn button to .modal-share in your HTML too, then:
    // btnLI.onclick = () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`, ...)

    btnCopy.onclick = () => navigator.clipboard.writeText(storyUrl).then(() => {
      btnCopy.title = 'Copied!';
      setTimeout(() => { btnCopy.title = 'Copy link'; }, 2000);
    });

    document.getElementById('modalBackdrop').classList.add('open');
    document.body.style.overflow = 'hidden';
  }

    function closeModalBtn() {
      document.getElementById('modalBackdrop').classList.remove('open');
      document.body.style.overflow = '';
      document.getElementById('modal').scrollTop = 0;
    }

    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModalBtn(); });

    
    // ── SHARE UTILITY // ── SHARE UTILITY ──────────────────────────────────────────
  function getShareData(card) {
    const titleEl = card.querySelector('.story-title, .featured-title');
    const title   = titleEl ? titleEl.textContent.trim() : document.title;
    const tag      = card.querySelector('.story-tag');
    const category = tag ? tag.textContent.trim() : 'TWiK Foundation';

    // Resolve the story URL from the card's onclick or the Read More link
    let url = window.location.href;
    const readLink = card.querySelector('.story-read-link, .btn-read');
    if (readLink && readLink.href) url = readLink.href;
    else if (card.getAttribute('onclick')) {
      const match = card.getAttribute('onclick').match(/window\.location='([^']+)'/);
      if (match) url = new URL(match[1], window.location.origin).href;
    }

    const shareText = `${title} — ${category} | TWiK Foundation`;
    return { title, url, shareText };
  }

  function buildShareRow(card) {
    const row = card.querySelector('.share-row');
    if (!row) return;

    // Clear existing static buttons
    row.innerHTML = `<span class="share-label">Share:</span>`;

    const { url, shareText } = getShareData(card);
    const encoded = {
      url:  encodeURIComponent(url),
      text: encodeURIComponent(shareText),
    };

    const buttons = [
      {
        label: 'X',
        title: 'Post on X',
        href: `https://twitter.com/intent/tweet?text=${encoded.text}&url=${encoded.url}`,
        svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.745l7.736-8.84L1.254 2.25H8.08l4.258 5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
      },
      {
        label: 'Facebook',
        title: 'Share on Facebook',
        href: `https://www.facebook.com/sharer/sharer.php?u=${encoded.url}`,
        svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
      },
      {
        label: 'LinkedIn',
        title: 'Share on LinkedIn',
        href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded.url}`,
        svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
      },
    ];

    // Platform link buttons
    buttons.forEach(({ label, title, href, svg }) => {
      const btn = document.createElement('button');
      btn.className = 'share-btn';
      btn.title = title;
      btn.innerHTML = svg;
      btn.addEventListener('click', e => {
        e.stopPropagation();
        window.open(href, '_blank', 'noopener,width=600,height=500');
      });
      row.appendChild(btn);
    });

    // Copy link button
    const copyBtn = document.createElement('button');
    copyBtn.className = 'share-btn';
    copyBtn.title = 'Copy link';
    copyBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>`;
    copyBtn.addEventListener('click', e => {
      e.stopPropagation();
      navigator.clipboard.writeText(url).then(() => {
        copyBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`;
        copyBtn.title = 'Copied!';
        setTimeout(() => {
          copyBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>`;
          copyBtn.title = 'Copy link';
        }, 2000);
      });
    });
    row.appendChild(copyBtn);
  }

  function initShareButtons() {
    document.querySelectorAll('.story-card, .featured-grid').forEach(buildShareRow);
  }

  // Also wire up the modal share buttons
  function initModalShare() {
    const modalShare = document.querySelector('.modal-share');
    if (!modalShare) return;
    // Modal share is handled per openModal() call — see updated openModal below
  }

  // ── Call on DOM ready ──
  document.addEventListener('DOMContentLoaded', initShareButtons);

    // Leaderboard tab switching
    document.querySelectorAll('.lb-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.lb-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.lb-panel').forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById('panel-' + tab.dataset.panel).classList.add('active');
      });
    });

    // Period toggle buttons (cosmetic — no data change needed for static demo)
    document.querySelectorAll('.lb-period-toggle').forEach(toggle => {
      toggle.querySelectorAll('.lb-period-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          toggle.querySelectorAll('.lb-period-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
        });
      });
    });

})();