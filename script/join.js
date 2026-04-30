
    /* Tab switching */
  (function () {
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('panel-' + btn.dataset.tab).classList.add('active');
      });
    });

    /* Donor selection */
    function selectDonor(el) {
      document.querySelectorAll('.donor-card').forEach(c => c.classList.remove('selected'));
      el.classList.add('selected');
    }

    /* Mobile nav toggle */
    const toggle = document.getElementById('mobileToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });

    /* Counter animation */
    function animateStat(el) {
      const target = parseInt(el.dataset.target);
      const suffix = el.dataset.suffix;
      let current = 0;
      const increment = target / 45;
      const tick = setInterval(() => {
        current += increment;
        if (current >= target) { current = target; clearInterval(tick); }
        el.textContent = Math.floor(current) + suffix;
      }, 30);
    }

    const io = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        document.querySelectorAll('[data-target]').forEach(animateStat);
        io.disconnect();
      }
    }, { threshold: 0.3 });

    const sidebar = document.querySelector('.sidebar');
    if (sidebar) io.observe(sidebar);

  })();