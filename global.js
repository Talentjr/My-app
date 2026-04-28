// Dark mode, sounds, vibration, network detection, skeleton helpers
(function() {
  // Dark mode init
  const darkModePref = localStorage.getItem('darkMode');
  if (darkModePref === 'false') document.body.classList.add('light');
  else document.body.classList.remove('light');
  // Sound (Web Audio)
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
  }
  window.playSound = function(type) {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      if (type === 'click') {
        osc.frequency.value = 880;
        gain.gain.value = 0.1;
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.1);
        osc.stop(ctx.currentTime + 0.1);
      } else if (type === 'success') {
        osc.frequency.value = 1318.52;
        gain.gain.value = 0.2;
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.5);
        osc.stop(ctx.currentTime + 0.5);
      } else if (type === 'error') {
        osc.frequency.value = 440;
        gain.gain.value = 0.2;
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.3);
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch(e) { console.log('Audio error', e); }
  };
  window.vibrate = function(ms) { if (navigator.vibrate) navigator.vibrate(ms); };
  document.addEventListener('click', (e) => {
    if (e.target.closest('button, .clickable, .nav-item, .back-btn, .shortcut-item')) {
      playSound('click');
      vibrate(20);
    }
  });
  // offline banner
  function showOffline() {
    if (!document.querySelector('.offline-banner')) {
      const banner = document.createElement('div');
      banner.className = 'offline-banner';
      banner.innerText = '⚠️ You are offline. Please check your connection.';
      document.body.prepend(banner);
    }
  }
  function hideOffline() {
    const b = document.querySelector('.offline-banner');
    if (b) b.remove();
  }
  window.addEventListener('online', hideOffline);
  window.addEventListener('offline', showOffline);
  if (!navigator.onLine) showOffline();
  // skeleton helper
  window.showSkeleton = function(containerId, count = 5, height = '60px') {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const div = document.createElement('div');
      div.className = 'skeleton';
      div.style.height = height;
      div.style.margin = '8px 0';
      div.style.borderRadius = '16px';
      container.appendChild(div);
    }
  };
})();