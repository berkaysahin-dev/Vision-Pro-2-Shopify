/**
 * VISION SH — MASTER MOTION & SCROLL REVEAL ENGINE
 * High-Performance Hardware-Accelerated Animation Orchestrator (60fps)
 */

class VisionMotionEngine {
  constructor() {
    this.initScrollProgress();
    this.initScrollReveals();
    this.initHeroEntrance();
    this.initStickyStorytelling();
    this.initParallax();
    this.initTextSplits();
  }

  /**
   * Top Subtle Scroll Progress Line
   */
  initScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress-bar');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      progressBar.style.width = `${scrolled}%`;
    }, { passive: true });
  }

  /**
   * Universal IntersectionObserver for Scroll Reveals
   */
  initScrollReveals() {
    const revealElements = document.querySelectorAll('[data-reveal]');
    if (!revealElements.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -80px 0px',
      threshold: 0.15
    });

    revealElements.forEach(el => observer.observe(el));
  }

  /**
   * Cinematic Hero Entrance Animation Sequence
   */
  initHeroEntrance() {
    const hero = document.querySelector('.hero-banner');
    if (!hero) return;

    window.addEventListener('load', () => {
      hero.classList.add('is-animated');
    });
    // Fallback if already loaded
    if (document.readyState === 'complete') {
      hero.classList.add('is-animated');
    }
  }

  /**
   * Pinned Sticky Storytelling Chapter Tracker
   */
  initStickyStorytelling() {
    const stickySection = document.querySelector('.sticky-story-section');
    if (!stickySection) return;

    const steps = stickySection.querySelectorAll('.sticky-story-step');
    const images = stickySection.querySelectorAll('.sticky-story-media-img');
    const stepIndicators = stickySection.querySelectorAll('.sticky-story-counter-item');

    const stepObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const stepIndex = entry.target.dataset.stepIndex;

          // Switch active image
          images.forEach(img => {
            if (img.dataset.stepIndex === stepIndex) {
              img.classList.add('is-active');
            } else {
              img.classList.remove('is-active');
            }
          });

          // Switch active indicator
          stepIndicators.forEach(ind => {
            if (ind.dataset.stepIndex === stepIndex) {
              ind.classList.add('is-active');
            } else {
              ind.classList.remove('is-active');
            }
          });
        }
      });
    }, {
      rootMargin: '-30% 0px -30% 0px',
      threshold: 0.2
    });

    steps.forEach(step => stepObserver.observe(step));
  }

  /**
   * Parallax Depth on Background Visuals
   */
  initParallax() {
    const parallaxImages = document.querySelectorAll('[data-parallax]');
    if (!parallaxImages.length || window.innerWidth < 990) return;

    window.addEventListener('scroll', () => {
      const scrollY = window.pageYOffset;
      parallaxImages.forEach(img => {
        const speed = parseFloat(img.dataset.parallaxSpeed || 0.12);
        const rect = img.parentElement.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          const offset = (rect.top - window.innerHeight / 2) * speed;
          img.style.transform = `translateY(${offset}px) scale(1.08)`;
        }
      });
    }, { passive: true });
  }

  /**
   * Split Text Line Reveal Animation
   */
  initTextSplits() {
    document.querySelectorAll('[data-split-reveal]').forEach(heading => {
      const text = heading.textContent.trim();
      const lines = text.split('\n').filter(l => l.trim().length > 0);
      
      if (lines.length > 1) {
        heading.innerHTML = lines.map((line, idx) => `
          <span class="reveal-line-wrap">
            <span class="reveal-line-inner" style="transition-delay: ${idx * 120}ms;">${line.trim()}</span>
          </span>
        `).join('');
      } else {
        heading.innerHTML = `
          <span class="reveal-line-wrap">
            <span class="reveal-line-inner">${text}</span>
          </span>
        `;
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.visionMotion = new VisionMotionEngine();
});
