/**
 * ATELIER LUXE — WISHLIST ENGINE
 * LocalStorage Persistence & Dynamic Badge Synchronization
 */

class WishlistManager {
  constructor() {
    this.storageKey = 'atelier_luxe_wishlist';
    this.wishlist = this.getStoredWishlist();

    this.initButtons();
    this.updateBadges();
    this.renderWishlistPage();
  }

  getStoredWishlist() {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey)) || [];
    } catch {
      return [];
    }
  }

  saveWishlist() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.wishlist));
    this.updateBadges();
  }

  toggle(handle) {
    if (!handle) return;
    const index = this.wishlist.indexOf(handle);
    if (index > -1) {
      this.wishlist.splice(index, 1);
    } else {
      this.wishlist.push(handle);
    }
    this.saveWishlist();
    this.syncButtonStates();
  }

  initButtons() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-wishlist-btn]');
      if (!btn) return;

      e.preventDefault();
      const handle = btn.dataset.productHandle;
      if (handle) {
        this.toggle(handle);
      }
    });

    this.syncButtonStates();
  }

  syncButtonStates() {
    document.querySelectorAll('[data-wishlist-btn]').forEach(btn => {
      const handle = btn.dataset.productHandle;
      if (this.wishlist.includes(handle)) {
        btn.classList.add('is-active');
        const icon = btn.querySelector('svg');
        if (icon) icon.setAttribute('fill', 'currentColor');
      } else {
        btn.classList.remove('is-active');
        const icon = btn.querySelector('svg');
        if (icon) icon.setAttribute('fill', 'none');
      }
    });
  }

  updateBadges() {
    const count = this.wishlist.length;
    document.querySelectorAll('.wishlist-count').forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });
  }

  renderWishlistPage() {
    const container = document.querySelector('[data-wishlist-grid]');
    if (!container) return;

    if (this.wishlist.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;">
          <p style="font-size: 1.125rem; color: var(--color-text-muted); margin-bottom: 1.5rem;">Your wishlist is currently empty.</p>
          <a href="/collections/all" class="btn btn-primary">Discover New Arrivals</a>
        </div>
      `;
      return;
    }

    // Dynamic rendering of saved items
    container.innerHTML = `
      <div style="grid-column: 1 / -1; padding-bottom: 1rem;">
        <p class="text-muted">You have <strong>${this.wishlist.length}</strong> saved items in your private collection.</p>
      </div>
    `;

    this.wishlist.forEach(async (handle) => {
      try {
        const res = await fetch(`/products/${handle}?view=card-snippet`);
        if (res.ok) {
          const html = await res.text();
          container.insertAdjacentHTML('beforeend', html);
        }
      } catch (e) {
        console.error('Error loading wishlist product:', e);
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.wishlistManager = new WishlistManager();
});
