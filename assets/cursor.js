/**
 * VISION SH — INTERACTIVE CUSTOM CURSOR
 * Desktop Only, Context-Aware, Magnetic Feedback
 */

class VisionCustomCursor {
  constructor() {
    // Disable on touch / mobile devices
    if (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 1024) {
      return;
    }

    this.cursor = document.querySelector('.custom-cursor');
    this.follower = document.querySelector('.custom-cursor-follower');
    this.label = document.querySelector('.custom-cursor-label');

    if (!this.cursor || !this.follower) return;

    this.posX = 0;
    this.posY = 0;
    this.mouseX = 0;
    this.mouseY = 0;

    this.initEvents();
    this.render();
  }

  initEvents() {
    window.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;

      this.cursor.style.transform = `translate3d(${this.mouseX}px, ${this.mouseY}px, 0)`;
      this.cursor.classList.remove('is-hidden');
      this.follower.classList.remove('is-hidden');
    });

    document.addEventListener('mouseleave', () => {
      this.cursor.classList.add('is-hidden');
      this.follower.classList.add('is-hidden');
    });

    // Hover states for links & cards
    document.addEventListener('mouseover', (e) => {
      const viewEl = e.target.closest('.product-card__media-wrapper, .editorial-img-link, .showcase-media');
      const dragEl = e.target.closest('.horizontal-rail-track, .before-after-slider');
      const btnEl = e.target.closest('.btn, .header__icon-btn, .header__menu-link');

      if (viewEl) {
        this.follower.classList.add('is-view');
        if (this.label) this.label.textContent = 'VIEW';
      } else if (dragEl) {
        this.follower.classList.add('is-drag');
        if (this.label) this.label.textContent = 'DRAG';
      } else if (btnEl) {
        this.follower.classList.add('is-active');
      }
    });

    document.addEventListener('mouseout', (e) => {
      const viewEl = e.target.closest('.product-card__media-wrapper, .editorial-img-link, .showcase-media');
      const dragEl = e.target.closest('.horizontal-rail-track, .before-after-slider');
      const btnEl = e.target.closest('.btn, .header__icon-btn, .header__menu-link');

      if (viewEl) {
        this.follower.classList.remove('is-view');
        if (this.label) this.label.textContent = '';
      }
      if (dragEl) {
        this.follower.classList.remove('is-drag');
        if (this.label) this.label.textContent = '';
      }
      if (btnEl) {
        this.follower.classList.remove('is-active');
      }
    });
  }

  render() {
    // Smooth lerp follower movement
    this.posX += (this.mouseX - this.posX) * 0.15;
    this.posY += (this.mouseY - this.posY) * 0.15;

    this.follower.style.transform = `translate3d(${this.posX}px, ${this.posY}px, 0)`;

    requestAnimationFrame(() => this.render());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.visionCursor = new VisionCustomCursor();
});
