document.addEventListener('DOMContentLoaded', function() {
    const downloadWindows = document.getElementById('downloadWindows');
    const downloadAndroid = document.getElementById('downloadAndroid');

    if (downloadWindows) {
        downloadWindows.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'https://archive.org/download/holosec-setup/Holosec_Setup.exe';
        });
        downloadWindows.addEventListener('touchstart', function(e) {
            e.stopPropagation();
        }, { passive: true });
    }

    if (downloadAndroid) {
        downloadAndroid.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'https://archive.org/download/holosec-1.0.0-arm64-v8a_armeabi-v7a-debug_202607/holosec-1.0.0-arm64-v8a_armeabi-v7a-debug.apk';
        });
        downloadAndroid.addEventListener('touchstart', function(e) {
            e.stopPropagation();
        }, { passive: true });
    }
});