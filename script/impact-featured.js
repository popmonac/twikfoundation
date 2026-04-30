
    const PAGE_URL   = window.location.href;
    const PAGE_TITLE = document.querySelector('.story-hero-title')?.textContent.trim() || document.title;
    const SHARE_TEXT = `${PAGE_TITLE} | TWiK Foundation`;

    const PLATFORMS = {
      x:         url => `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}&url=${encodeURIComponent(url)}`,
      facebook:  url => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin:  url => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp:  url => `https://wa.me/?text=${encodeURIComponent(SHARE_TEXT + ' ' + url)}`,
    };

    function openShare(platform) {
      window.open(PLATFORMS[platform](PAGE_URL), '_blank', 'noopener,width=620,height=500');
    }

    // Map each share-bar button to its platform by title
    const platformMap = {
      'Share on X':         'x',
      'Share on Facebook':  'facebook',
      'Share on LinkedIn':  'linkedin',
      'Share via WhatsApp': 'whatsapp',
    };

    document.querySelectorAll('.share-bar .share-btn').forEach(btn => {
      const platform = platformMap[btn.title];
      if (platform) {
        btn.addEventListener('click', () => openShare(platform));
      }
    });

    // Copy link button
    function copyLink() {
      navigator.clipboard.writeText(PAGE_URL).then(() => {
        const textEl  = document.getElementById('copyText');
        const iconEl  = document.querySelector('.share-copy-btn svg');
        const origIcon = iconEl.outerHTML;

        textEl.textContent = 'Copied!';
        iconEl.outerHTML; // keep reference below
        document.querySelector('.share-copy-btn').style.color        = '#16a34a';
        document.querySelector('.share-copy-btn').style.borderColor  = '#16a34a';
        document.querySelector('.share-copy-btn').style.background   = '#f0fdf4';

        setTimeout(() => {
          textEl.textContent = 'Copy link';
          const btn = document.querySelector('.share-copy-btn');
          btn.style.color       = '';
          btn.style.borderColor = '';
          btn.style.background  = '';
        }, 2000);
      });
    }
 