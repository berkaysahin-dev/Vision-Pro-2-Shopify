/**
 * ATELIER LUXE — QUICK VIEW MODAL ENGINE
 * On-Demand Product Preview & Instant Purchase
 */

class QuickViewController {
  constructor() {
    this.modal = document.querySelector('.quick-view-modal');
    this.modalBody = this.modal?.querySelector('.quick-view-modal__body');
    this.backdrop = document.querySelector('.backdrop-overlay');

    this.initTriggers();
  }

  initTriggers() {
    document.addEventListener('click', async (e) => {
      const btn = e.target.closest('[data-quick-view-btn]');
      if (!btn) return;

      e.preventDefault();
      const productHandle = btn.dataset.productHandle;
      if (productHandle) {
        await this.open(productHandle);
      }
    });

    const closeBtn = this.modal?.querySelector('.modal-dialog__close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }
  }

  async open(handle) {
    if (!this.modal || !this.modalBody) return;

    this.modalBody.innerHTML = `
      <div style="padding: 4rem 2rem; text-align: center;">
        <div class="spinner"></div>
        <p style="margin-top: 1rem; color: var(--color-text-muted);">Loading details...</p>
      </div>
    `;

    this.modal.classList.add('is-active');
    if (this.backdrop) this.backdrop.classList.add('is-active');
    document.body.style.overflow = 'hidden';

    try {
      const response = await fetch(`/products/${handle}.js`);
      if (!response.ok) throw new Error('Failed to load product');

      const product = await response.json();
      this.renderProduct(product);
    } catch (err) {
      console.error('Quick view error:', err);
      this.modalBody.innerHTML = `<p style="padding: 2rem; text-align: center; color: var(--color-sale);">Unable to load product preview.</p>`;
    }
  }

  close() {
    if (!this.modal) return;
    this.modal.classList.remove('is-active');
    if (this.backdrop) this.backdrop.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  renderProduct(product) {
    const formattedPrice = AtelierTheme.formatMoney(product.price);
    const primaryImg = product.featured_image || (product.images && product.images[0]) || '';

    this.modalBody.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr; gap: 1.5rem; padding: 2rem;">
        <div style="border-radius: var(--border-radius); overflow: hidden; aspect-ratio: 3/4; background: var(--color-surface);">
          <img src="${primaryImg}" alt="${product.title}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <span class="text-uppercase text-muted">${product.vendor || 'Atelier'}</span>
          <h3 style="font-size: 1.5rem;">${product.title}</h3>
          <div style="font-size: 1.25rem; font-weight: 700;">${formattedPrice}</div>
          <p style="font-size: 14px; color: var(--color-text-muted); line-height: 1.6;">${product.description ? product.description.replace(/<[^>]*>/g, '').substring(0, 160) + '...' : ''}</p>
          
          <form action="/cart/add" method="post" enctype="multipart/form-data">
            <input type="hidden" name="id" value="${product.variants[0].id}">
            <button type="submit" class="btn btn-primary btn-full" style="height: 48px; margin-top: 0.5rem;">Add to Bag — ${formattedPrice}</button>
          </form>

          <a href="${product.url}" style="font-size: 13px; text-decoration: underline; text-align: center; margin-top: 0.5rem;">View Full Product Details →</a>
        </div>
      </div>
    `;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.quickViewController = new QuickViewController();
});
