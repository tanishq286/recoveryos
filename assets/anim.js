/* RecoveryOS - premium animation layer (GSAP + ScrollTrigger + Three.js + Lottie)
   Progressive enhancement only: if any CDN fails or reduced-motion is set,
   the static site from app.js remains fully functional. */

(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGSAP = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  var hasLottie = typeof window.lottie !== 'undefined';
  var hasThree = typeof window.THREE !== 'undefined';

  if (hasGSAP && !reduced) {
    document.documentElement.classList.add('gsap-on');
    gsap.registerPlugin(ScrollTrigger);
  }

  /* ---------- GSAP: hero entrance + scroll reveals ---------- */
  if (hasGSAP && !reduced) {
    // neutralize CSS reveal transitions; GSAP owns motion now
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });

    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.hero-copy .eyebrow', { y: 18, autoAlpha: 0, duration: 0.5 })
      .from('.hero-copy h1', { y: 34, autoAlpha: 0, duration: 0.7 }, '-=0.25')
      .from('.hero-copy .lede', { y: 24, autoAlpha: 0, duration: 0.6 }, '-=0.4')
      .from('.hero-copy .cta-row .btn', { y: 18, autoAlpha: 0, stagger: 0.1, duration: 0.45 }, '-=0.35')
      .from('.hero-copy .trust-line span', { y: 12, autoAlpha: 0, stagger: 0.08, duration: 0.4 }, '-=0.25')
      .from('.card-stack .proof-card', {
        y: 46, autoAlpha: 0, rotation: 0, stagger: 0.14, duration: 0.7, ease: 'back.out(1.4)',
        clearProps: 'opacity,visibility'
      }, '-=0.5');

    // scroll reveals
    gsap.utils.toArray('.reveal').forEach(function (el) {
      gsap.fromTo(el,
        { y: 28, autoAlpha: 0 },
        {
          y: 0, autoAlpha: 1, duration: 0.65, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 86%', once: true }
        });
    });

    // milestone rail draws left to right
    var railTrack = document.querySelector('.rail-track');
    if (railTrack) {
      gsap.fromTo(railTrack, { '--rail-p': 0 }, {
        '--rail-p': 1, duration: 1.1, ease: 'power2.inOut',
        scrollTrigger: { trigger: railTrack, start: 'top 82%', once: true }
      });
      gsap.from('.rail-item', {
        scale: 0.6, autoAlpha: 0, stagger: 0.16, duration: 0.4, ease: 'back.out(2)',
        scrollTrigger: { trigger: railTrack, start: 'top 82%', once: true },
        clearProps: 'scale,opacity,visibility'
      });
    }

    // pricing cards settle in
    gsap.utils.toArray('.price-card').forEach(function (card, i) {
      gsap.fromTo(card, { y: 34, autoAlpha: 0 }, {
        y: 0, autoAlpha: 1, duration: 0.6, delay: i * 0.08, ease: 'power2.out',
        scrollTrigger: { trigger: card, start: 'top 88%', once: true }
      });
    });

    // gentle parallax on the hero card stack
    var stack = document.querySelector('.card-stack');
    if (stack && window.matchMedia('(pointer: fine)').matches) {
      var hero = document.querySelector('.hero');
      hero.addEventListener('mousemove', function (ev) {
        var r = hero.getBoundingClientRect();
        var dx = (ev.clientX - r.left) / r.width - 0.5;
        var dy = (ev.clientY - r.top) / r.height - 0.5;
        gsap.to(stack, { x: dx * 10, y: dy * 8, duration: 0.6, ease: 'power2.out' });
      });
    }
  }

  /* ---------- Lottie: radar + result check ---------- */
  if (hasLottie && !reduced) {
    var radarEl = document.getElementById('lottie-radar');
    if (radarEl) {
      try {
        var radarAnim = window.lottie.loadAnimation({
          container: radarEl, renderer: 'svg', loop: true, autoplay: false,
          path: 'assets/lottie/radar.json'
        });
        if ('IntersectionObserver' in window) {
          var rio = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) { en.isIntersecting ? radarAnim.play() : radarAnim.pause(); });
          }, { threshold: 0.1 });
          rio.observe(radarEl);
        } else { radarAnim.play(); }
      } catch (e) { /* static site still fine */ }
    }
  }

  // hook for app.js after the triage result renders
  window.__rosAnimateResult = function (resultEl) {
    if (hasGSAP && !reduced) {
      gsap.fromTo(resultEl.querySelectorAll('.result-status, .result-title, .result-why'),
        { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.06, duration: 0.4, ease: 'power2.out' });
      gsap.fromTo(resultEl.querySelectorAll('.result-steps li'),
        { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.07, duration: 0.4, ease: 'power2.out', delay: 0.15 });
      gsap.fromTo(resultEl.querySelectorAll('.receipt, .result-cta'),
        { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.08, duration: 0.4, ease: 'power2.out', delay: 0.3 });
    }
    if (hasLottie && !reduced) {
      var checkEl = resultEl.querySelector('.result-check');
      if (checkEl) {
        checkEl.innerHTML = '';
        try {
          window.lottie.loadAnimation({
            container: checkEl, renderer: 'svg', loop: false, autoplay: true,
            path: 'assets/lottie/check.json'
          });
        } catch (e) { /* ignore */ }
      }
    }
  };

  /* ---------- Three.js: quiet particle field in the hero ---------- */
  if (hasThree && !reduced) {
    var canvas = document.getElementById('hero-3d');
    if (canvas) {
      try {
        var holder = canvas.parentElement;
        var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(42, 1, 1, 1000);
        camera.position.set(0, 0, 210);

        var N = 720;
        var pos = new Float32Array(N * 3);
        var col = new Float32Array(N * 3);
        var palette = [
          [0.647, 0.514, 0.329], // brass
          [0.647, 0.514, 0.329],
          [0.149, 0.498, 0.467], // teal
          [0.078, 0.137, 0.169]  // ink
        ];
        var weights = [0.42, 0.18, 0.25, 0.15];
        for (var i = 0; i < N; i++) {
          var ang = Math.random() * Math.PI * 2;
          var rad = 52 + Math.pow(Math.random(), 0.7) * 82;
          pos[i * 3] = Math.cos(ang) * rad;
          pos[i * 3 + 1] = (Math.random() - 0.5) * 34;
          pos[i * 3 + 2] = Math.sin(ang) * rad;
          var r = Math.random(), acc = 0, ci = 0;
          for (var w = 0; w < weights.length; w++) { acc += weights[w]; if (r <= acc) { ci = w; break; } }
          col[i * 3] = palette[ci][0];
          col[i * 3 + 1] = palette[ci][1];
          col[i * 3 + 2] = palette[ci][2];
        }
        var geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
        var mat = new THREE.PointsMaterial({
          size: 2.1, vertexColors: true, transparent: true, opacity: 0.5,
          sizeAttenuation: true, depthWrite: false
        });
        var points = new THREE.Points(geo, mat);
        var group = new THREE.Group();
        group.add(points);
        group.rotation.x = 0.42;
        scene.add(group);

        var mouseX = 0, mouseY = 0, targetRX = 0.42, targetRY = 0;
        var heroEl = document.querySelector('.hero');
        if (heroEl && window.matchMedia('(pointer: fine)').matches) {
          heroEl.addEventListener('mousemove', function (ev) {
            var r = heroEl.getBoundingClientRect();
            mouseX = (ev.clientX - r.left) / r.width - 0.5;
            mouseY = (ev.clientY - r.top) / r.height - 0.5;
          });
        }

        function resize() {
          var w = holder.clientWidth, h = holder.clientHeight;
          if (!w || !h) return;
          renderer.setSize(w, h, false);
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
        }
        resize();
        if ('ResizeObserver' in window) new ResizeObserver(resize).observe(holder);
        else window.addEventListener('resize', resize);

        var visible = true, raf = null;
        function frame() {
          raf = null;
          group.rotation.y += 0.0016;
          targetRX = 0.42 + mouseY * 0.12;
          targetRY = mouseX * 0.2;
          group.rotation.x += (targetRX - group.rotation.x) * 0.04;
          group.rotation.z += (targetRY - group.rotation.z) * 0.04;
          renderer.render(scene, camera);
          if (visible) raf = requestAnimationFrame(frame);
        }
        function start() { if (!raf && visible) raf = requestAnimationFrame(frame); }
        if ('IntersectionObserver' in window) {
          new IntersectionObserver(function (entries) {
            visible = entries[0].isIntersecting;
            if (visible) start();
          }, { threshold: 0.02 }).observe(canvas);
        }
        start();
      } catch (e) { /* canvas stays hidden, static site fine */ }
    }
  }
})();
