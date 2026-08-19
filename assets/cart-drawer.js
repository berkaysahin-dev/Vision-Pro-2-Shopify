/**
 * VISION SH — AJAX CART DRAWER ENGINE
 * Fly-to-Bag Animation, Free Shipping Threshold Meter & In-Drawer Upsells
 */

class CartDrawer {
  constructor() {
    this.drawer = document.querySelector('.cart-drawer-container');
    this.backdrop = document.querySelector('.backdrop-overlay');
    this.threshold = parseFloat(window.themeSettings?.freeShippingThreshold || 150) * 100; // in cents

    this.initTriggers();
    this.initFormInterception();
    this.initQuantitySteppers();
    this.initUpsells();
  }

  initTriggers() {
    document.querySelectorAll('[data-open-cart]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.open();
      });
    });

    const closeBtn = document.querySelector('.cart-drawer__close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }
  }

  open() {
    if (!this.drawer) return;
    this.refresh();
    this.drawer.classList.add('is-active');
    if (this.backdrop) this.backdrop.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  close() {
    if (!this.drawer) return;
    this.drawer.classList.remove('is-active');
    if (this.backdrop) this.backdrop.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  /**
   * Fly-to-Bag Micro-Animation
   */
  flyToCart(imgSource) {
    if (!imgSource) return;

    const cartIcon = document.querySelector('[data-open-cart]');
    if (!cartIcon) return;

    const imgRect = imgSource.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();

    const flyingClone = document.createElement('div');
    flyingClone.style.position = 'fixed';
    flyingClone.style.top = `${imgRect.top}px`;
    flyingClone.style.left = `${imgRect.left}px`;
    flyingClone.style.width = `${imgRect.width}px`;
    flyingClone.style.height = `${imgRect.height}px`;
    flyingClone.style.borderRadius = '8px';
    flyingClone.style.overflow = 'hidden';
    flyingClone.style.zIndex = '9999';
    flyingClone.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
    flyingClone.style.transition = 'all 700ms cubic-bezier(0.16, 1, 0.3, 1)';
    flyingClone.style.pointerEvents = 'none';

    const innerImg = document.createElement('img');
    innerImg.src = imgSource.src;
    innerImg.style.width = '100%';
    innerImg.style.height = '100%';
    innerImg.style.objectFit = 'cover';
    flyingClone.appendChild(innerImg);

    document.body.appendChild(flyingClone);

    requestAnimationFrame(() => {
      flyingClone.style.top = `${cartRect.top + 10}px`;
      flyingClone.style.left = `${cartRect.left + 10}px`;
      flyingClone.style.width = '24px';
      flyingClone.style.height = '24px';
      flyingClone.style.opacity = '0.4';
      flyingClone.style.transform = 'scale(0.3) rotate(15deg)';
    });

    setTimeout(() => {
      flyingClone.remove();
      cartIcon.classList.add('is-pulsing');
      setTimeout(() => cartIcon.classList.remove('is-pulsing'), 300);
    }, 700);
  }

  /**
   * Intercept AJAX Add to Cart
   */
  initFormInterception() {
    document.addEventListener('submit', async (e) => {
      const form = e.target.closest('form[action*="/cart/add"]');
      if (!form) return;

      e.preventDefault();
      const submitBtn = form.querySelector('[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `Adding to Bag...`;
      }

      // Trigger fly-to-cart
      const card = form.closest('.product-card, .product-section, .modal-dialog');
      const cardImg = card?.querySelector('.product-card__image--primary, .product-gallery__main-image, img');
      if (cardImg) {
        this.flyToCart(cardImg);
      }

      try {
        const formData = new FormData(form);
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) throw new Error('Cart add failed');

        await this.refresh();
        setTimeout(() => this.open(), 400);
      } catch (err) {
        console.error('Error adding to cart:', err);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      }
    });
  }

  /**
   * Quantity Steppers & Item Removal
   */
  initQuantitySteppers() {
    if (!this.drawer) return;

    this.drawer.addEventListener('click', async (e) => {
      const btn = e.target.closest('.cart-qty-btn');
      const removeBtn = e.target.closest('.cart-drawer-item__remove');

      if (btn) {
        const key = btn.dataset.key;
        const currentQty = parseInt(btn.dataset.qty, 10);
        const delta = parseInt(btn.dataset.delta, 10);
        const newQty = Math.max(0, currentQty + delta);
        await this.updateItem(key, newQty);
      }

      if (removeBtn) {
        e.preventDefault();
        const key = removeBtn.dataset.key;
        const itemEl = removeBtn.closest('.cart-drawer-item');
        if (itemEl) itemEl.classList.add('is-removing');
        setTimeout(() => this.updateItem(key, 0), 200);
      }
    });
  }

  /**
   * 1-Click In-Drawer Upsells
   */
  initUpsells() {
    if (!this.drawer) return;

    this.drawer.addEventListener('click', async (e) => {
      const addUpsellBtn = e.target.closest('.cart-upsell-btn');
      if (!addUpsellBtn) return;

      const variantId = addUpsellBtn.dataset.variantId;
      addUpsellBtn.disabled = true;
      addUpsellBtn.textContent = 'Adding...';

      try {
        await fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ id: variantId, quantity: 1 })
        });
        await this.refresh();
      } catch (err) {
        console.error('Upsell add error:', err);
      }
    });
  }

  async updateItem(key, quantity) {
    try {
      const response = await fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ id: key, quantity })
      });

      if (!response.ok) throw new Error('Update failed');
      const cart = await response.json();
      this.renderCart(cart);
    } catch (err) {
      console.error('Cart update error:', err);
    }
  }

  async refresh() {
    try {
      const res = await fetch('/cart.js', { headers: { 'Accept': 'application/json' } });
      const cart = await res.json();
      this.renderCart(cart);
    } catch (err) {
      console.error('Cart fetch error:', err);
    }
  }

  renderCart(cart) {
    // Update badge counts
    document.querySelectorAll('.header__badge-count, .cart-count').forEach(el => {
      el.textContent = cart.item_count;
      el.style.display = cart.item_count > 0 ? 'flex' : 'none';
    });

    const drawerCount = this.drawer.querySelector('.cart-drawer__count-badge');
    if (drawerCount) drawerCount.textContent = `${cart.item_count} items`;

    // Free Shipping Progress
    const shippingBar = this.drawer.querySelector('.cart-drawer__shipping-bar');
    const shippingMsg = this.drawer.querySelector('.cart-drawer__shipping-message');
    const shippingFill = this.drawer.querySelector('.cart-drawer__shipping-progress-fill');

    if (shippingBar && shippingMsg && shippingFill) {
      const remaining = this.threshold - cart.total_price;
      const progressPercent = Math.min(100, Math.max(0, (cart.total_price / this.threshold) * 100));
      shippingFill.style.width = `${progressPercent}%`;

      if (remaining <= 0) {
        shippingBar.classList.add('is-unlocked');
        shippingMsg.innerHTML = window.themeSettings?.freeShippingUnlockedMsg || `✨ You qualify for Free Worldwide Express Shipping!`;
      } else {
        shippingBar.classList.remove('is-unlocked');
        const formattedAmount = AtelierTheme.formatMoney(remaining);
        shippingMsg.innerHTML = `Add <strong>${formattedAmount}</strong> more for Free Express Shipping`;
      }
    }

    // Line Items Container
    const itemsContainer = this.drawer.querySelector('.cart-drawer__items');
    const subtotalEl = this.drawer.querySelector('.cart-drawer__subtotal-price');
    const emptyState = this.drawer.querySelector('.cart-drawer__empty');
    const footerEl = this.drawer.querySelector('.cart-drawer__footer');

    if (subtotalEl) {
      subtotalEl.textContent = AtelierTheme.formatMoney(cart.total_price);
    }

    if (cart.item_count === 0) {
      if (itemsContainer) itemsContainer.style.display = 'none';
      if (footerEl) footerEl.style.display = 'none';
      if (emptyState) emptyState.style.display = 'flex';
      return;
    }

    if (itemsContainer) itemsContainer.style.display = 'flex';
    if (footerEl) footerEl.style.display = 'flex';
    if (emptyState) emptyState.style.display = 'none';

    if (itemsContainer) {
      itemsContainer.innerHTML = cart.items.map(item => `
        <div class="cart-drawer-item" data-key="${item.key}">
          <div class="cart-drawer-item__image">
            <img src="${item.image || ''}" alt="${item.title}" loading="lazy" width="80" height="100">
          </div>
          <div class="cart-drawer-item__details">
            <a href="${item.url}" class="cart-drawer-item__title">${item.product_title}</a>
            ${item.variant_title ? `<span class="cart-drawer-item__variant">${item.variant_title}</span>` : ''}
            <div class="cart-drawer-item__price">${AtelierTheme.formatMoney(item.final_line_price)}</div>
            <div class="cart-drawer-item__actions">
              <div class="quantity-stepper" style="height: 32px;">
                <button type="button" class="quantity-stepper__btn cart-qty-btn" data-key="${item.key}" data-qty="${item.quantity}" data-delta="-1">-</button>
                <input type="text" class="quantity-stepper__input" value="${item.quantity}" readonly style="width: 32px; font-size: 12px;">
                <button type="button" class="quantity-stepper__btn cart-qty-btn" data-key="${item.key}" data-qty="${item.quantity}" data-delta="1">+</button>
              </div>
              <button type="button" class="cart-drawer-item__remove" data-key="${item.key}">Remove</button>
            </div>
          </div>
        </div>
      `).join('');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.cartDrawer = new CartDrawer();
});
