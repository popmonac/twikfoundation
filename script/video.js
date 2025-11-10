document.addEventListener('DOMContentLoaded', function() {
    const youtubeModal = document.querySelector('.youtube-modal');
    const youtubeContainer = youtubeModal.querySelector('.youtube-iframe-container');
    const closeYoutubeModal = youtubeModal.querySelector('.close-youtube-modal');
    
    // Open YouTube video in modal
    const youtubeItems = document.querySelectorAll('.youtube-item');
    youtubeItems.forEach(item => {
        item.addEventListener('click', function() {
            const videoId = this.getAttribute('data-youtube-id');
            youtubeContainer.innerHTML = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
            youtubeModal.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
    });
    
    // Close YouTube modal
    function closeModal() {
        youtubeModal.style.display = 'none';
        youtubeContainer.innerHTML = '';
        document.body.style.overflow = 'auto'; // Re-enable background scrolling
    }
    
    closeYoutubeModal.addEventListener('click', closeModal);
    
    // Close modal when clicking outside of content
    youtubeModal.addEventListener('click', function(e) {
        if (e.target === youtubeModal) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && youtubeModal.style.display === 'flex') {
            closeModal();
        }
    });
    
    // Add smooth scrolling for video section
    const videoLinks = document.querySelectorAll('a[href="#video-showcase"]');
    videoLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('video-showcase').scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});