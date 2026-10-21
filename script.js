const menuButton = document.querySelector(".menu-button");
const mobileNav = document.querySelector(".mobile-nav");
if (menuButton && mobileNav) {
  const closeMenu = () => {
    menuButton.setAttribute("aria-expanded", "false");
    mobileNav.classList.remove("is-open");
  };
  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(open));
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
  viewport.addEventListener("scroll", render, { passive: true });
  new ResizeObserver(render).observe(viewport);
}
