/* Shared helpers for every game in 小小遊戲屋: saved settings, sound effects, speech and confetti.
   Load with <script src="../shared/kit.js"></script> before the game's own script; it defines window.Kit. */
window.Kit = (() => {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Settings saved per game under "<prefix>.<key>". Storage can be missing or blocked, so every call is guarded.
  function store(prefix) {
    return {
      get(k, d) { try { const v = localStorage.getItem(prefix + '.' + k); return v === null ? d : JSON.parse(v); } catch { return d; } },
      set(k, v) { try { localStorage.setItem(prefix + '.' + k, JSON.stringify(v)); } catch {} },
    };
  }

  // Sound is generated with Web Audio, so no audio files are needed. Browsers only allow it after a tap.
  let ctx = null;
  function audio() {
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === 'suspended') ctx.resume();
      return ctx;
    } catch { return null; }
  }
  function tone(freq, start, dur, type = 'sine', vol = 0.18, slideTo) {
    const a = audio(); if (!a) return;
    const t = a.currentTime + start, o = a.createOscillator(), g = a.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(a.destination); o.start(t); o.stop(t + dur + 0.05);
  }

  // Inside the Android app (Capacitor) the WebView has no speechSynthesis, so speech goes to the native
  // TextToSpeech plugin through the bridge Capacitor injects; on the web this is null and nothing changes.
  const nativeTTS = window.Capacitor?.isNativePlatform?.() && window.Capacitor.nativePromise
    ? (method, opts = {}) => window.Capacitor.nativePromise('TextToSpeech', method, opts).catch(() => {})
    : null;

  // Speak Traditional Chinese with a Taiwanese voice when the device has one.
  function say(text, { rate = 0.9, pitch = 1.2 } = {}) {
    if (nativeTTS) { nativeTTS('stop').then(() => nativeTTS('speak', { text, lang: 'zh-TW', rate, pitch })); return; }
    if (!('speechSynthesis' in window)) return;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'zh-TW'; u.rate = rate; u.pitch = pitch;
      const v = speechSynthesis.getVoices().find(v => /zh[-_]TW/i.test(v.lang));
      if (v) u.voice = v;
      speechSynthesis.speak(u);
    } catch {}
  }
  function hush() {
    if (nativeTTS) { nativeTTS('stop'); return; }
    try { if ('speechSynthesis' in window) speechSynthesis.cancel(); } catch {}
  }

  const confetti = (() => {
    const DEFAULT = ['#2b59c3', '#ff6b5b', '#2fb36f', '#ffd34e', '#a463f2'];
    let raf = 0, canvas = null;
    function stop() {
      cancelAnimationFrame(raf);
      if (canvas) { canvas.remove(); canvas = null; }
    }
    function start(colors = DEFAULT) {
      if (reduceMotion) return;
      stop();
      const c = canvas = document.createElement('canvas');
      c.className = 'confetti'; document.body.append(c);
      const dpr = window.devicePixelRatio || 1;
      c.width = innerWidth * dpr; c.height = innerHeight * dpr;
      const g = c.getContext('2d'); g.scale(dpr, dpr);
      const bits = Array.from({ length: 140 }, () => ({
        x: Math.random() * innerWidth, y: -20 - Math.random() * innerHeight * 0.6,
        vx: (Math.random() - 0.5) * 2, vy: 2 + Math.random() * 3,
        r: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.2,
        w: 8 + Math.random() * 8, h: 5 + Math.random() * 6, color: colors[Math.floor(Math.random() * colors.length)],
      }));
      const t0 = performance.now();
      (function frame(now) {
        g.clearRect(0, 0, innerWidth, innerHeight);
        for (const b of bits) {
          b.x += b.vx; b.y += b.vy; b.r += b.vr;
          g.save(); g.translate(b.x, b.y); g.rotate(b.r); g.fillStyle = b.color;
          g.fillRect(-b.w / 2, -b.h / 2, b.w, b.h); g.restore();
        }
        if (now - t0 < 4500) raf = requestAnimationFrame(frame); else stop();
      })(t0);
    }
    return { start, stop };
  })();

  // Star row for the win panel: `n` of 3 lit. Games always give at least 2.
  const stars = n => [0, 1, 2].map(i => i < n ? '⭐' : '<span class="dim">⭐</span>').join('');

  return { reduceMotion, store, audio, tone, say, hush, confetti, stars };
})();
