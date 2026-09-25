/**
 * ATELIER LUXE — PRODUCT FORM CONTROLLER
 * Variant Selection, Image Synchronization, Stock Scarcity & Sticky ATC
 */

class ProductFormController {
  constructor() {
    this.productSection = document.querySelector('.product-section');
    if (!this.productSection) return;

    this.initVariantSelectors();
    this.initGallery();
    this.initStickyATC();
    this.initSizeGuide();
  }

  /**
   * Variant Selection & Price/Stock Updating
   */
  initVariantSelectors() {
    this.productSection.addEventListener('click', (e) => {
      const optionBtn = e.target.closest('.product-option-btn, .product-pdp-swatch');
      if (!optionBtn) return;

      const group = optionBtn.closest('.product-option-group');
      if (!group) return;

      group.querySelectorAll('.product-option-btn, .product-pdp-swatch').forEach(btn => {
        btn.classList.remove('is-selected');
      });
      optionBtn.classList.add('is-selected');

      // Update label value text
      const selectedValue = optionBtn.dataset.value;
      const labelValue = group.querySelector('.product-option-selected-val');
      if (labelValue && selectedValue) {
        labelValue.textContent = selectedValue;
      }

      this.onVariantChange();
    });
  }

  onVariantChange() {
    // Gather selected values across all option groups
    const selectedOptions = Array.from(this.productSection.querySelectorAll('.product-option-group .is-selected'))
      .map(el => el.dataset.value);

    // If product JSON is provided in window or DOM
    if (window.productVariants) {
      const matchedVariant = window.productVariants.find(v => {
        return v.options.every((opt, idx) => opt === selectedOptions[idx]);
      });

      if (matchedVariant) {
        this.updateVariantDetails(matchedVariant);
      }
    }
  }

  updateVariantDetails(variant) {
    // Update hidden input for cart form
    const hiddenIdInput = this.productSection.querySelector('input[name="id"]');
    if (hiddenIdInput) hiddenIdInput.value = variant.id;

    // Update Price
    const priceEl = this.productSection.querySelector('.product-info__price');
    if (priceEl) priceEl.textContent = AtelierTheme.formatMoney(variant.price);

    const comparePriceEl = this.productSection.querySelector('.product-info__price--compare');
    if (comparePriceEl) {
      if (variant.compare_at_price && variant.compare_at_price > variant.price) {
        comparePriceEl.textContent = AtelierTheme.formatMoney(variant.compare_at_price);
        comparePriceEl.style.display = 'inline';
      } else {
        comparePriceEl.style.display = 'none';
      }
    }

    // Update ATC button availability
    const atcBtn = this.productSection.querySelector('.product-atc-btn');
    if (atcBtn) {
      if (variant.available) {
        atcBtn.disabled = false;
        atcBtn.textContent = 'Add to Bag';
      } else {
        atcBtn.disabled = true;
        atcBtn.textContent = 'Sold Out';
      }
    }

    // Update Sticky ATC values
    const stickyPrice = document.querySelector('.sticky-atc-bar__price');
    if (stickyPrice) stickyPrice.textContent = AtelierTheme.formatMoney(variant.price);

    // Switch Gallery Image if variant has featured_image
    if (variant.featured_image && variant.featured_image.src) {
      const mainImg = this.productSection.querySelector('.product-gallery__main-image');
      if (mainImg) mainImg.src = variant.featured_image.src;
    }
  }

  /**
   * Media Gallery Thumbnail Clicks
   */
  initGallery() {
    const thumbnails = this.productSection.querySelectorAll('.product-gallery__thumb-item');
    const mainImg = this.productSection.querySelector('.product-gallery__main-image');

    thumbnails.forEach(thumb => {
      thumb.addEventListener('click', () => {
        thumbnails.forEach(t => t.classList.remove('is-active'));
        thumb.classList.add('is-active');

        const highResUrl = thumb.dataset.mediaSrc;
        if (mainImg && highResUrl) {
          mainImg.src = highResUrl;
        }
      });
    });
  }

  /**
   * Sticky Add to Cart Observer
   */
  initStickyATC() {
    const mainATC = this.productSection.querySelector('.product-actions-row');
    const stickyBar = document.querySelector('.sticky-atc-bar');
    if (!mainATC || !stickyBar) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
          stickyBar.classList.add('is-visible');
        } else {
          stickyBar.classList.remove('is-visible');
        }
      });
    }, { threshold: 0 });

    observer.observe(mainATC);

    // Sync sticky ATC button click with main form submit
    const stickyBtn = stickyBar.querySelector('.sticky-atc-btn');
    if (stickyBtn) {
      stickyBtn.addEventListener('click', () => {
        const mainSubmit = this.productSection.querySelector('.product-atc-btn');
        if (mainSubmit) mainSubmit.click();
      });
    }
  }

  /**
   * Size Guide Modal Handler
   */
  initSizeGuide() {
    const trigger = this.productSection.querySelector('[data-open-size-guide]');
    const modal = document.querySelector('.size-guide-modal');
    const closeBtn = modal?.querySelector('.modal-dialog__close');
    const backdrop = document.querySelector('.backdrop-overlay');

    if (trigger && modal) {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.add('is-active');
        if (backdrop) backdrop.classList.add('is-active');
      });
    }

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('is-active');
        if (backdrop) backdrop.classList.remove('is-active');
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.productForm = new ProductFormController();
});
