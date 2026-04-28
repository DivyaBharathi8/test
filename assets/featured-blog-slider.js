/**
 * Featured blog slider — counter + native <progress> (matches kbb-editorial pattern).
 * Fill value 0–100: last slide => 100; else ((index + 1) / total) * 100.
 * Prev/next are linear (no wrap); disabled at first/last slide.
 */
(function () {
  function pad2(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function progressValue(index, total) {
    if (total < 1) return 0;
    if (index === total - 1) return 100;
    return Math.round(((index + 1) / total) * 100 * 10) / 10;
  }

  function getTotalSlides(root, slidesHost) {
    var slides = slidesHost.querySelectorAll(".featured-blog-slider__slide");
    var n = slides.length;
    if (n > 0) return n;
    var fromAttr = parseInt(root.getAttribute("data-slide-total"), 10);
    return isNaN(fromAttr) ? 0 : fromAttr;
  }

  function setProgress(progressEl, index, total) {
    if (!progressEl) return;
    var pct = progressValue(index, total);
    progressEl.value = pct;
    progressEl.textContent = String(Math.round(pct)) + "%";
    progressEl.setAttribute("aria-label", "Slide " + (index + 1) + " of " + total);
  }

  function initSlider(root) {
    var slidesHost = root.querySelector("[data-slider-slides]");
    if (!slidesHost) return;

    var slides = slidesHost.querySelectorAll(".featured-blog-slider__slide");
    var total = getTotalSlides(root, slidesHost);
    var counterEl = root.querySelector("[data-slider-counter]");
    var progressEl = root.querySelector("[data-slider-progress]");
    var btnPrev = root.querySelector("[data-slider-prev]");
    var btnNext = root.querySelector("[data-slider-next]");

    var index = 0;
    for (var s = 0; s < slides.length; s++) {
      if (slides[s].classList.contains("is-active")) {
        index = s;
        break;
      }
    }

    function updateUI() {
      slides.forEach(function (el, i) {
        var on = i === index;
        el.classList.toggle("is-active", on);
        el.setAttribute("aria-hidden", on ? "false" : "true");
      });
      if (counterEl) {
        counterEl.textContent = pad2(index + 1) + "/" + pad2(total);
      }
      setProgress(progressEl, index, total);
      if (btnPrev) btnPrev.disabled = total <= 1 || index === 0;
      if (btnNext) btnNext.disabled = total <= 1 || index === total - 1;
    }

    function go(delta) {
      if (total < 1) return;
      var nextIndex = index + delta;
      if (nextIndex < 0 || nextIndex > total - 1) return;
      index = nextIndex;
      updateUI();
    }

    if (btnPrev) {
      btnPrev.addEventListener("click", function () {
        go(-1);
      });
    }
    if (btnNext) {
      btnNext.addEventListener("click", function () {
        go(1);
      });
    }

    updateUI();
  }

  function initAll() {
    document.querySelectorAll("[data-featured-blog-slider]").forEach(initSlider);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }

  document.addEventListener("shopify:section:load", function (event) {
    var root = event.target.querySelector("[data-featured-blog-slider]");
    if (root) initSlider(root);
  });
})();
