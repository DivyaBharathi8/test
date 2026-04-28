(function () {
  function pad2(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function initSlider(root) {
    var slidesHost = root.querySelector("[data-slider-slides]");
    if (!slidesHost) return;

    var slides = slidesHost.querySelectorAll(".featured-blog-slider__slide");
    var counterEl = root.querySelector("[data-slider-counter]");
    var progressEl =
      root.querySelector("[data-slider-progress]") ||
      root.querySelector(".featured-blog-slider__progress-fill");
    var btnPrev = root.querySelector("[data-slider-prev]");
    var btnNext = root.querySelector("[data-slider-next]");

    var total = slides.length;
    var index = 0;

    function updateUI() {
      slides.forEach(function (el, i) {
        var on = i === index;
        el.classList.toggle("is-active", on);
        el.setAttribute("aria-hidden", on ? "false" : "true");
      });
      if (counterEl) {
        counterEl.textContent = pad2(index + 1) + "/" + pad2(total);
      }
      if (progressEl) {
        var pct = total > 0 ? ((index + 1) / total) * 100 : 0;
        progressEl.style.width = pct + "%";
      }
      if (btnPrev) btnPrev.disabled = total <= 1;
      if (btnNext) btnNext.disabled = total <= 1;
    }

    function go(delta) {
      if (total < 1) return;
      index = (index + delta + total) % total;
      updateUI();
    }

    if (btnPrev) btnPrev.addEventListener("click", function () { go(-1); });
    if (btnNext) btnNext.addEventListener("click", function () { go(1); });

    updateUI();
  }

  document.querySelectorAll("[data-featured-blog-slider]").forEach(initSlider);
})();
