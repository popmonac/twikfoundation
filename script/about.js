

  // ── OUTREACH CAROUSEL — manual + auto-scroll ──────────────────────────────
  (function () {
    const track   = document.getElementById('outreachTrack');
    const prevBtn = document.getElementById('outreachPrev');
    const nextBtn = document.getElementById('outreachNext');
    const dotsEl  = document.getElementById('outreachDots');
    const cards   = track.querySelectorAll('.outreach-card');
    const total   = cards.length;

    let current  = 0;
    let perView  = 3;
    let autoTimer = null;
    const AUTO_DELAY = 3500; // ms between auto-advances

    function getPerView() {
      const w = window.innerWidth;
      if (w < 640) return 1;
      if (w < 960) return 2;
      return 3;
    }

    function maxIndex() { return Math.max(0, total - perView); }


    function goTo(idx) {
      perView  = getPerView();
      current  = Math.min(Math.max(idx, 0), maxIndex());
      const gap = 28;
      const containerW = track.parentElement.offsetWidth;
      const totalGap   = gap * (perView - 1);
      const cardW      = (containerW - totalGap) / perView;
      const offset     = current * (cardW + gap);
      track.style.transform = `translateX(-${offset}px)`;
      prevBtn.disabled = current === 0;
      nextBtn.disabled = current >= maxIndex();
      updateDots();
    }

    function setCardWidths() {
      perView = getPerView();
      const gap = 28;
      const containerW = track.parentElement.offsetWidth;
      const totalGap   = gap * (perView - 1);
      const cardW      = (containerW - totalGap) / perView;
      cards.forEach(c => {
        c.style.flex     = `0 0 ${cardW}px`;
        c.style.maxWidth = `${cardW}px`;
      });
    }

    // Auto-advance: loops back to 0 when it reaches the end
    function autoAdvance() {
      const next = current >= maxIndex() ? 0 : current + 1;
      goTo(next);
    }

    function startAuto() {
      stopAuto();
      autoTimer = setInterval(autoAdvance, AUTO_DELAY);
    }

    function stopAuto() {
      if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
    }

    // Resume after user interaction
    function resetAuto() {
      stopAuto();
      startAuto();
    }

    // Pause on hover, resume on leave
    const wrapper = track.parentElement;
    wrapper.addEventListener('mouseenter', stopAuto);
    wrapper.addEventListener('mouseleave', startAuto);
    wrapper.addEventListener('focusin',    stopAuto);
    wrapper.addEventListener('focusout',   startAuto);

    prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
    nextBtn.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

    function init() {
      setCardWidths();
      buildDots();
      goTo(0);
      startAuto();
    }

    window.addEventListener('resize', init);
    init();
  })();