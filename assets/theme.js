/**
 * ATELIER LUXE — GLOBAL THEME ORCHESTRATOR
 * Lightweight, Vanilla ES6+, High Performance (Zero jQuery)
 */

class AtelierTheme {
  constructor() {
    this.initHeader();
    this.initAccordions();
    this.initBackdrop();
    this.initDeliveryCountdown();
    this.initBeforeAfterSliders();
    this.initMobileMenu();
  }

  /**
   * Header Scroll & Transparency Observer
   */
  initHeader() {
    const header = document.querySelector('.header-wrapper');
    if (!header) return;

    const handleScroll = () => {
      if (window.scrollY > 40) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  /**
   * Universal Accessible Accordions (FAQ, Product Details, Filters)
   */
  initAccordions() {
    document.addEventListener('click', (e) => {
      const header = e.target.closest('.faq-header, .product-accordion-header');
      if (!header) return;

      const item = header.closest('.faq-item, .product-accordion-item');
      if (!item) return;

      const isOpen = item.classList.contains('is-open');
      
      // Optional: Close sibling items
      const parent = item.parentElement;
      if (parent && parent.dataset.accordionType === 'single') {
        parent.querySelectorAll('.faq-item, .product-accordion-item').forEach(sibling => {
          sibling.classList.remove('is-open');
        });
      }

      if (isOpen) {
        item.classList.remove('is-open');
      } else {
        item.classList.add('is-open');
      }
    });
  }

  /**
   * Global Backdrop Click Handler
   */
  initBackdrop() {
    const backdrop = document.querySelector('.backdrop-overlay');
    if (!backdrop) return;

    backdrop.addEventListener('click', () => {
      this.closeAllDrawers();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllDrawers();
      }
    });
  }

  closeAllDrawers() {
    const backdrop = document.querySelector('.backdrop-overlay');
    if (backdrop) backdrop.classList.remove('is-active');

    document.querySelectorAll('.cart-drawer-container, .mobile-menu-drawer, .search-modal, .modal-dialog').forEach(el => {
      el.classList.remove('is-active');
    });
    document.body.style.overflow = '';
  }

  /**
   * Mobile Menu Drawer
   */
  initMobileMenu() {
    const hamburger = document.querySelector('.header__hamburger');
    const drawer = document.querySelector('.mobile-menu-drawer');
    const closeBtn = document.querySelector('.mobile-menu__close');
    const backdrop = document.querySelector('.backdrop-overlay');

    if (hamburger && drawer) {
      hamburger.addEventListener('click', () => {
        drawer.classList.add('is-active');
        if (backdrop) backdrop.classList.add('is-active');
        document.body.style.overflow = 'hidden';
      });
    }

    if (closeBtn && drawer) {
      closeBtn.addEventListener('click', () => {
        drawer.classList.remove('is-active');
        if (backdrop) backdrop.classList.remove('is-active');
        document.body.style.overflow = '';
      });
    }
  }

  /**
   * Real-Time Estimated Delivery Countdown
   */
  initDeliveryCountdown() {
    const timerElements = document.querySelectorAll('[data-delivery-timer]');
    if (!timerElements.length) return;

    const updateTimer = () => {
      const now = new Date();
      const cutoffHour = 17; // 5:00 PM cutoff
      let target = new Date();
      target.setHours(cutoffHour, 0, 0, 0);

      if (now >= target) {
        target.setDate(target.getDate() + 1);
      }

      const diff = target - now;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const formatted = `${hours}h ${minutes}m ${seconds}s`;
      timerElements.forEach(el => {
        const timeSpan = el.querySelector('.countdown-time');
        if (timeSpan) timeSpan.textContent = formatted;
      });
    };

    updateTimer();
    setInterval(updateTimer, 1000);
  }

  /**
   * Interactive Before / After Split Slider
   */
  initBeforeAfterSliders() {
    document.querySelectorAll('.before-after-slider').forEach(slider => {
      const afterWrap = slider.querySelector('.before-after-slider__img--after-wrap');
      const handle = slider.querySelector('.before-after-slider__handle');
      if (!afterWrap || !handle) return;

      let isDown = false;

      const setPosition = (x) => {
        const rect = slider.getBoundingClientRect();
        let posX = x - rect.left;
        posX = Math.max(0, Math.min(posX, rect.width));
        const percent = (posX / rect.width) * 100;

        afterWrap.style.width = `${percent}%`;
        handle.style.left = `${percent}%`;
      };

      const handleMove = (e) => {
        if (!isDown) return;
        const pageX = e.touches ? e.touches[0].pageX : e.pageX;
        setPosition(pageX);
      };

      slider.addEventListener('mousedown', (e) => { isDown = true; setPosition(e.pageX); });
      window.addEventListener('mouseup', () => { isDown = false; });
      slider.addEventListener('mousemove', handleMove);

      slider.addEventListener('touchstart', (e) => { isDown = true; setPosition(e.touches[0].pageX); });
      window.addEventListener('touchend', () => { isDown = false; });
      slider.addEventListener('touchmove', handleMove);
    });
  }

  /**
   * Currency / Price Formatter
   */
  static formatMoney(cents) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: window.Shopify ? window.Shopify.currency.active : 'USD'
    }).format(cents / 100);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.atelierTheme = new AtelierTheme();
});
