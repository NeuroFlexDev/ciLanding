const menuButton = document.querySelector(".menu-button");
const mobileNav = document.querySelector(".mobile-nav");
if (menuButton && mobileNav) {
  const closeMenu = () => {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.querySelector(".sr-only").textContent = "Открыть меню";
    mobileNav.classList.remove("is-open");
  };
  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.querySelector(".sr-only").textContent = open
      ? "Закрыть меню"
      : "Открыть меню";
    mobileNav.classList.toggle("is-open", open);
  });
  mobileNav.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      menuButton.getAttribute("aria-expanded") === "true"
    ) {
      closeMenu();
      menuButton.focus();
    }
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".header")) closeMenu();
  });
  matchMedia("(min-width: 1001px)").addEventListener("change", closeMenu);
}
const viewport = document.querySelector("[data-slider-viewport]");
const previousButton = document.querySelector("[data-slider-prev]");
const nextButton = document.querySelector("[data-slider-next]");
if (viewport && previousButton && nextButton) {
  const render = () => {
    const left = viewport.scrollLeft;
    const end = viewport.scrollWidth - viewport.clientWidth - 1;
    previousButton.disabled = left <= 1;
    nextButton.disabled = left >= end;
  };
  const move = (direction) => {
    const card = viewport.querySelector(".value-card");
    const step = card ? card.getBoundingClientRect().width + 24 : 336;
    viewport.scrollBy({
      left: direction * step,
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  };
  previousButton.addEventListener("click", () => move(-1));
  nextButton.addEventListener("click", () => move(1));
  viewport.addEventListener("keydown", (event) => {
    if (
      event.target !== viewport ||
      !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)
    )
      return;
    event.preventDefault();
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      move(event.key === "ArrowLeft" ? -1 : 1);
    } else {
      viewport.scrollTo({
        left: event.key === "Home" ? 0 : viewport.scrollWidth,
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
    }
  });
  viewport.addEventListener("scroll", render, { passive: true });
  if ("ResizeObserver" in window) new ResizeObserver(render).observe(viewport);
  else window.addEventListener("resize", render, { passive: true });
  render();
}

// Progressive motion: HTML stays fully visible without JS or an observer. No
// opacity-zero class, scroll handler, continuous loop, or delayed hero heading.
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
if ("IntersectionObserver" in window && "animate" in Element.prototype) {
  const seen = new WeakSet();
  const running = new Map();
  let observer;
  const items = document.querySelectorAll(
    ".problem__copy, .metric, .section-heading, .solution__grid > article, .process__intro, .process__steps > li, .use-card, .value__viewport, .comparison__intro, .comparison__cards > article, .feature-card, .final-cta__panel, .footer__top, .footer__brand",
  );
  const stop = () => {
    observer?.disconnect();
    running.forEach((animation) => animation.cancel());
    running.clear();
  };
  const observe = () => {
    stop();
    if (reducedMotion.matches) return;
    observer = new IntersectionObserver(
      (entries) => {
        const entering = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top - b.boundingClientRect.top ||
              a.boundingClientRect.left - b.boundingClientRect.left,
          );
        entering.forEach(({ target }, index) => {
          observer.unobserve(target);
          if (seen.has(target)) return;
          seen.add(target);
          if (reducedMotion.matches || target.contains(document.activeElement))
            return;
          const animation = target.animate(
            [
              { opacity: 0.2, translate: "0 18px" },
              { opacity: 1, translate: "0 0" },
            ],
            {
              duration: 620,
              delay: Math.min(index * 65, 195),
              easing: "cubic-bezier(.2,.7,.2,1)",
              fill: "backwards",
            },
          );
          running.set(target, animation);
          animation.finished
            .catch(() => {})
            .finally(() => running.delete(target));
        });
      },
      { threshold: 0.06, rootMargin: "0px 0px -24px 0px" },
    );
    items.forEach((item) => {
      if (!seen.has(item)) observer.observe(item);
    });
  };
  // Keyboard navigation never lands on a translucent or displaced control.
  document.addEventListener("focusin", ({ target }) => {
    running.forEach((animation, item) => {
      if (item.contains(target)) {
        animation.cancel();
        running.delete(item);
      }
    });
  });
  reducedMotion.addEventListener("change", observe);
  window.addEventListener("pagehide", stop);
  window.addEventListener("pageshow", observe);
  observe();
}
