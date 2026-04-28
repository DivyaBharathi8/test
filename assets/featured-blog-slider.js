/**
 * Featured blog slider — counter + progressive bar fill (Shopify theme asset).
 * Fill width = (current slide index + 1) / total × 100%.
 */
(function () {
  function pad2(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function getTotalSlides(root, slidesHost) {
    var slides = slidesHost.querySelectorAll(".featured-blog-slider__slide");
    var n = slides.length;
    if (n > 0) return n;
    var fromAttr = parseInt(root.getAttribute("data-slide-total"), 10);
    return isNaN(fromAttr) ? 0 : fromAttr;
  }

  function setProgress(progressEl, root, index, total) {
    if (!progressEl || !root) return;
    var pct = total > 0 ? ((index + 1) / total) * 100 : 0;
    /* Inline width on fill; root --fbs-progress-pct is separate from yellow fill color in CSS */
    progressEl.style.width = pct + "%";
    root.style.setProperty("--fbs-progress-pct", pct + "%");
    progressEl.setAttribute("aria-valuenow", String(index + 1));
    progressEl.setAttribute("aria-valuemax", String(Math.max(total, 1)));
  }

  function initSlider(root) {
    var slidesHost = root.querySelector("[data-slider-slides]");
    if (!slidesHost) return;

    var slides = slidesHost.querySelectorAll(".featured-blog-slider__slide");
    var total = getTotalSlides(root, slidesHost);
    var counterEl = root.querySelector("[data-slider-counter]");
    var progressEl =
      root.querySelector("[data-slider-progress]") ||
      root.querySelector(".featured-blog-slider__progress-fill");
    var progressTrack = root.querySelector(".featured-blog-slider__progress");
    var btnPrev = root.querySelector("[data-slider-prev]");
    var btnNext = root.querySelector("[data-slider-next]");

    if (progressTrack && total > 0) {
      progressTrack.setAttribute("role", "progressbar");
      progressTrack.setAttribute("aria-valuemin", "1");
      progressTrack.setAttribute("aria-valuemax", String(total));
    }

    if (progressEl) {
      progressEl.setAttribute("role", "presentation");
    }

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
      setProgress(progressEl, root, index, total);
      if (progressTrack && total > 0) {
        progressTrack.setAttribute("aria-valuenow", String(index + 1));
        progressTrack.setAttribute("aria-valuetext", "Slide " + (index + 1) + " of " + total);
      }
      if (btnPrev) btnPrev.disabled = total <= 1;
      if (btnNext) btnNext.disabled = total <= 1;
    }

    function go(delta) {
      if (total < 1) return;
      index = (index + delta + total) % total;
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
