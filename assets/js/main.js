(function () {
  "use strict";

  var WEDDING_ISO = "2026-07-18T18:00:00-03:00";
  var STORAGE_AUDIO_PLAYING = "lm-wedding-audio-playing";

  /* --- Countdown --- */
  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function updateCountdown() {
    var target = new Date(WEDDING_ISO).getTime();
    var now = Date.now();
    var diff = target - now;

    var elDays = document.getElementById("cd-days");
    var elHours = document.getElementById("cd-hours");
    var elMins = document.getElementById("cd-mins");
    var elSecs = document.getElementById("cd-secs");
    if (!elDays || !elHours || !elMins || !elSecs) return;

    if (diff <= 0) {
      elDays.textContent = "0";
      elHours.textContent = "0";
      elMins.textContent = "0";
      elSecs.textContent = "0";
      return;
    }

    var s = Math.floor(diff / 1000);
    var days = Math.floor(s / 86400);
    s -= days * 86400;
    var hours = Math.floor(s / 3600);
    s -= hours * 3600;
    var mins = Math.floor(s / 60);
    var secs = s % 60;

    elDays.textContent = String(days);
    elHours.textContent = pad(hours);
    elMins.textContent = pad(mins);
    elSecs.textContent = pad(secs);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* --- Reveal on scroll --- */
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reduceMotion) {
    var reveals = document.querySelectorAll(".reveal");
    if (reveals.length && "IntersectionObserver" in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          });
        },
        { root: null, rootMargin: "0px 0px -40px 0px", threshold: 0.08 }
      );
      reveals.forEach(function (el) {
        io.observe(el);
      });
    } else {
      reveals.forEach(function (el) {
        el.classList.add("is-visible");
      });
    }
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* --- Lightbox --- */
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightbox-img");
  var lightboxClose = document.getElementById("lightbox-close");
  var gallery = document.getElementById("gallery");
  var lightboxReturnFocus = null;

  function openLightbox(src, alt, trigger) {
    if (!lightbox || !lightboxImg) return;
    lightboxReturnFocus = trigger && typeof trigger.focus === "function" ? trigger : null;
    lightboxImg.src = src;
    lightboxImg.alt = alt || "";
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    if (lightboxClose) lightboxClose.focus();
  }

  function closeLightbox() {
    if (!lightbox || !lightboxImg) return;
    lightbox.hidden = true;
    lightboxImg.src = "";
    lightboxImg.alt = "";
    document.body.style.overflow = "";
    if (lightboxReturnFocus) {
      lightboxReturnFocus.focus();
      lightboxReturnFocus = null;
    }
  }

  if (gallery) {
    gallery.addEventListener("click", function (e) {
      var btn = e.target.closest(".gallery__thumb");
      if (!btn) return;
      var src = btn.getAttribute("data-lightbox-src");
      var alt = btn.getAttribute("data-lightbox-alt") || "";
      if (src) openLightbox(src, alt, btn);
    });
  }

  /* Lightbox também para imagens dentro das seções */
  document.querySelectorAll(".section__mediaBtn[data-lightbox-src]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      var target = e.currentTarget;
      if (!(target instanceof HTMLElement)) return;
      var src = target.getAttribute("data-lightbox-src");
      var alt = target.getAttribute("data-lightbox-alt") || "";
      if (src) openLightbox(src, alt, target);
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && lightbox && !lightbox.hidden) {
      closeLightbox();
    }
  });

  /* --- Audio --- */
  var audio = document.getElementById("bg-audio");
  var audioBtn = document.getElementById("audio-toggle");
  var audioToast = document.getElementById("audio-toast");
  var audioToastBtn = document.getElementById("audio-toast-btn");

  function setAudioUi(playing) {
    if (!audioBtn) return;
    audioBtn.classList.toggle("is-playing", playing);
    audioBtn.setAttribute("aria-pressed", playing ? "true" : "false");
    audioBtn.setAttribute(
      "aria-label",
      playing ? "Pausar música de fundo" : "Tocar música de fundo: Jesus meu esposo"
    );
  }

  function setToastVisible(visible) {
    if (!audioToast) return;
    audioToast.hidden = !visible;
  }

  function tryPlay() {
    if (!audio) return Promise.resolve(false);
    return audio
      .play()
      .then(function () {
        setAudioUi(true);
        try {
          localStorage.setItem(STORAGE_AUDIO_PLAYING, "1");
        } catch (err) {}
        return true;
      })
      .catch(function () {
        setAudioUi(false);
        return false;
      });
  }

  function pauseAudio() {
    if (!audio) return;
    audio.pause();
    setAudioUi(false);
    try {
      localStorage.setItem(STORAGE_AUDIO_PLAYING, "0");
    } catch (err) {}
  }

  if (audioBtn && audio) {
    /* tentativa de autoplay ao entrar:
       1) tenta tocar com som (provável bloqueio)
       2) se bloquear, toca em mudo e pede “Ativar som” */
    (function initAutoplay() {
      audio.muted = false;
      tryPlay().then(function (okWithSound) {
        if (okWithSound) {
          setToastVisible(false);
          return;
        }

        audio.muted = true;
        tryPlay().then(function (okMuted) {
          if (okMuted) {
            setToastVisible(true);
          } else {
            setToastVisible(true);
          }
        });
      });
    })();

    audioBtn.addEventListener("click", function () {
      if (audio.paused) {
        audio.muted = false;
        setToastVisible(false);
        tryPlay();
      } else {
        pauseAudio();
      }
    });

    if (audioToastBtn) {
      audioToastBtn.addEventListener("click", function () {
        audio.muted = false;
        setToastVisible(false);
        tryPlay();
      });
    }

    audio.addEventListener("play", function () {
      setAudioUi(true);
    });
    audio.addEventListener("pause", function () {
      if (!audio.ended) setAudioUi(false);
    });

    /* localStorage: guarda se estava tocando (útil se no futuro houver mais páginas; autoplay continua exigindo clique no botão) */
    try {
      if (localStorage.getItem(STORAGE_AUDIO_PLAYING) === "1") {
        setAudioUi(false);
      }
    } catch (err) {}
  }

  /* --- Hero: foto principal ausente? --- */
  (function checkHeroCover() {
    var heroEl = document.querySelector(".hero");
    var preload = document.querySelector('link[rel="preload"][as="image"]');
    var probeUrl =
      preload && preload.getAttribute("href") ? preload.getAttribute("href") : "assets/img/46-2.jpg";
    var probe = new Image();
    probe.onerror = function () {
      if (heroEl) heroEl.classList.add("hero--no-photo");
    };
    probe.src = probeUrl;
  })();

  /* --- Miniaturas: se arquivo sumir da pasta assets/img/, não quebra layout --- */
  document.querySelectorAll('main img[src^="assets/img/"]').forEach(function (thumbImg) {
    thumbImg.addEventListener("error", function () {
      var parent = thumbImg.closest(".gallery__thumb, .section__mediaBtn");
      if (!parent) return;
      parent.classList.add("is-missing-img");
      parent.setAttribute("tabindex", "-1");
      parent.setAttribute("aria-hidden", "true");
      thumbImg.remove();
    });
  });
})();
