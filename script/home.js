
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Scroll reveal animation
        const revealElements = document.querySelectorAll('.reveal');
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });

        // Custom cursor
        const cursor = document.getElementById('cursor');
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });             
      
      
      
      // Mobile menu toggle
        const mobileToggle = document.getElementById('mobileToggle');
        const mobileMenu = document.getElementById('mobileMenu');
        const navbar = document.getElementById('navbar');

        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
            });
        });

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Active link highlighting
        const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
        const sections = document.querySelectorAll('.demo-section');

        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.scrollY >= (sectionTop - 200)) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target)) {
                mobileToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
            }
        });
    
        
        
        
        // Pause animations on hover for better UX
        const imageColumns = document.querySelectorAll('.image-column');
        
        imageColumns.forEach(column => {
            column.addEventListener('mouseenter', () => {
                column.style.animationPlayState = 'paused';
            });
            
            column.addEventListener('mouseleave', () => {
                column.style.animationPlayState = 'running';
            });
        });

        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                }
            });
        }, observerOptions);

        document.addEventListener('DOMContentLoaded', () => {
            const animatedElements = document.querySelectorAll('.hero-content, .stats-reveal');
            animatedElements.forEach(el => observer.observe(el));
        });

        

          // Pause animations on hover for better UX
        const imageRows = document.querySelectorAll('.image-rowl');
        
        imageRows.forEach(row => {
            row.addEventListener('mouseenter', () => {
                row.style.animationPlayState = 'paused';
            });
            
            row.addEventListener('mouseleave', () => {
                row.style.animationPlayState = 'running';
            });
        });

        // Intersection Observer for animations
        const observerOption = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observers = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                }
            });
        }, observerOption);

        document.addEventListener('DOMContentLoaded', () => {
            const animatedElements = document.querySelectorAll('.hero-content, .stats-reveal');
            animatedElements.forEach(el => observers.observe(el));
        });
    

        
        // YouTube Modal functionality
        const modal = document.getElementById('youtubeModal');
        const closeModal = document.getElementById('closeModal');
        const youtubeIframe = document.getElementById('youtubeIframe');
        const youtubeItems = document.querySelectorAll('.youtube-item');

        youtubeItems.forEach(item => {
            item.addEventListener('click', () => {
                const videoId = item.getAttribute('data-youtube-id');
                const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
                
                youtubeIframe.src = embedUrl;
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            });
        });

        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
            youtubeIframe.src = '';
            document.body.style.overflow = 'auto';
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                youtubeIframe.src = '';
                document.body.style.overflow = 'auto';
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                modal.style.display = 'none';
                youtubeIframe.src = '';
                document.body.style.overflow = 'auto';
            }
        });