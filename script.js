const menuButton = document.querySelector('.menu-button');
const mobileNav = document.querySelector('.mobile-nav');

if (menuButton && mobileNav) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    mobileNav.classList.toggle('is-open', !isOpen);
  });

  mobileNav.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      menuButton.setAttribute('aria-expanded', 'false');
      mobileNav.classList.remove('is-open');
    }
  });
}

const track = document.querySelector('[data-slider-track]');
const viewport = document.querySelector('[data-slider-viewport]');
const previousButton = document.querySelector('[data-slider-prev]');
const nextButton = document.querySelector('[data-slider-next]');

if (track && viewport && previousButton && nextButton) {
  let offset = 0;

  const getStep = () => {
    const card = track.querySelector('.value-card');
    return card ? card.getBoundingClientRect().width + 24 : 336;
  };

  const render = () => {
    const maxOffset = Math.max(0, track.scrollWidth - viewport.clientWidth);
    offset = Math.min(Math.max(offset, 0), maxOffset);
    track.style.transform = `translate3d(${-offset}px, 0, 0)`;
    previousButton.disabled = offset <= 0;
    nextButton.disabled = offset >= maxOffset - 1;
  };

  previousButton.addEventListener('click', () => {
    offset -= getStep();
    render();
  });

  nextButton.addEventListener('click', () => {
    offset += getStep();
    render();
  });

  window.addEventListener('resize', render);
  render();
}
