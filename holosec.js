document.addEventListener('DOMContentLoaded', function() {
    const downloadWindows = document.getElementById('downloadWindows');
    const downloadAndroid = document.getElementById('downloadAndroid');
    const comingSoonOverlay = document.getElementById('comingSoonOverlay');
    const closeComingSoon = document.getElementById('closeComingSoon');

    function showComingSoon() {
        comingSoonOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function hideComingSoon() {
        comingSoonOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    if (downloadWindows) {
        downloadWindows.addEventListener('click', function(e) {
            e.preventDefault();
            showComingSoon();
        });
        downloadWindows.addEventListener('touchstart', function(e) {
            e.stopPropagation();
        }, { passive: true });
    }

    if (downloadAndroid) {
        downloadAndroid.addEventListener('click', function(e) {
            e.preventDefault();
            showComingSoon();
        });
        downloadAndroid.addEventListener('touchstart', function(e) {
            e.stopPropagation();
        }, { passive: true });
    }

    if (closeComingSoon) {
        closeComingSoon.addEventListener('click', function() {
            hideComingSoon();
        });
    }

    comingSoonOverlay.addEventListener('click', function(e) {
        if (e.target === comingSoonOverlay) {
            hideComingSoon();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && comingSoonOverlay.classList.contains('active')) {
            hideComingSoon();
        }
    });
});