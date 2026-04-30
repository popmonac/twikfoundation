    const PAGE_URL  = window.location.href;
    const PAGE_TITLE = document.querySelector('.article-title')?.textContent.trim() || document.title;
    const SHARE_TEXT = `${PAGE_TITLE} | TWiK Foundation`;

    const PLATFORMS = {
      x:        url => `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}&url=${encodeURIComponent(url)}`,
      facebook:  url => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin:  url => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };

    function openShare(platform) {
      window.open(PLATFORMS[platform](PAGE_URL), '_blank', 'noopener,width=620,height=500');
    }

    function copyLink(btn) {
      navigator.clipboard.writeText(PAGE_URL).then(() => {
        const original = btn.innerHTML;
        btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;
        btn.title = 'Copied!';
        setTimeout(() => { btn.innerHTML = original; btn.title = 'Copy link'; }, 2000);
      });
    }

    // ── Wire up meta-bar share dots (top) ──
    const [btnX, btnFB, btnCopy] = document.querySelectorAll('.meta-share .share-dot');
    btnX.addEventListener('click',   () => openShare('x'));
    btnFB.addEventListener('click',  () => openShare('facebook'));
    btnCopy.addEventListener('click', () => copyLink(btnCopy));

    // Add LinkedIn button to meta-bar dynamically
    const liBtn = document.createElement('button');
    liBtn.className = 'share-dot';
    liBtn.title = 'Share on LinkedIn';
    liBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`;
    liBtn.addEventListener('click', () => openShare('linkedin'));
    document.querySelector('.meta-share').insertBefore(liBtn, btnCopy);

    // ── Wire up bottom "Share" reaction button ──
    const shareReactionBtn = [...document.querySelectorAll('.reaction-btn')]
      .find(btn => btn.textContent.trim() === 'Share');

    if (shareReactionBtn) {
      // Replace static button with a dropdown-style mini share panel
      const wrapper = document.createElement('div');
      wrapper.style.cssText = 'position:relative; display:inline-block;';

      const panel = document.createElement('div');
      panel.style.cssText = `
        display:none; position:absolute; bottom:calc(100% + 10px); right:0;
        background:#fff; border:1.5px solid #e8e6e1; border-radius:12px;
        padding:10px 8px; display:flex; gap:6px; flex-direction:row;
        box-shadow:0 4px 20px rgba(0,0,0,0.08); z-index:50;
      `;
      panel.style.display = 'none';

      const platforms = [
        { key: 'x',       label: 'X',        svg: `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.745l7.736-8.84L1.254 2.25H8.08l4.258 5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>` },
        { key: 'facebook', label: 'Facebook', svg: `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>` },
        { key: 'linkedin', label: 'LinkedIn', svg: `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>` },
      ];

      platforms.forEach(({ key, label, svg }) => {
        const b = document.createElement('button');
        b.title = `Share on ${label}`;
        b.style.cssText = 'display:inline-flex;align-items:center;gap:5px;font-size:0.78rem;font-weight:600;padding:7px 12px;border-radius:8px;border:1.5px solid #e8e6e1;background:transparent;cursor:pointer;color:#6b7280;transition:all .2s;white-space:nowrap;';
        b.innerHTML = `${svg} ${label}`;
        b.onmouseenter = () => { b.style.borderColor = '#dc2626'; b.style.color = '#dc2626'; b.style.background = '#fef2f2'; };
        b.onmouseleave = () => { b.style.borderColor = '#e8e6e1'; b.style.color = '#6b7280'; b.style.background = 'transparent'; };
        b.addEventListener('click', () => openShare(key));
        panel.appendChild(b);
      });

      // Copy link inside panel
      const copyInPanel = document.createElement('button');
      copyInPanel.title = 'Copy link';
      copyInPanel.style.cssText = 'display:inline-flex;align-items:center;gap:5px;font-size:0.78rem;font-weight:600;padding:7px 12px;border-radius:8px;border:1.5px solid #e8e6e1;background:transparent;cursor:pointer;color:#6b7280;transition:all .2s;white-space:nowrap;';
      copyInPanel.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg> Copy link`;
      copyInPanel.onmouseenter = () => { copyInPanel.style.borderColor='#dc2626'; copyInPanel.style.color='#dc2626'; copyInPanel.style.background='#fef2f2'; };
      copyInPanel.onmouseleave = () => { copyInPanel.style.borderColor='#e8e6e1'; copyInPanel.style.color='#6b7280'; copyInPanel.style.background='transparent'; };
      copyInPanel.addEventListener('click', () => {
        navigator.clipboard.writeText(PAGE_URL).then(() => {
          copyInPanel.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Copied!`;
          copyInPanel.style.color = '#16a34a';
          copyInPanel.style.borderColor = '#16a34a';
          setTimeout(() => {
            copyInPanel.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg> Copy link`;
            copyInPanel.style.color = '#6b7280';
            copyInPanel.style.borderColor = '#e8e6e1';
          }, 2000);
        });
      });
      panel.appendChild(copyInPanel);

      shareReactionBtn.parentNode.insertBefore(wrapper, shareReactionBtn);
      wrapper.appendChild(shareReactionBtn);
      wrapper.appendChild(panel);

      let isOpen = false;
      shareReactionBtn.addEventListener('click', () => {
        isOpen = !isOpen;
        panel.style.display = isOpen ? 'flex' : 'none';
        shareReactionBtn.classList.toggle('liked', isOpen);
      });

      document.addEventListener('click', e => {
        if (!wrapper.contains(e.target)) {
          isOpen = false;
          panel.style.display = 'none';
          shareReactionBtn.classList.remove('liked');
        }
      });
    }
 ;