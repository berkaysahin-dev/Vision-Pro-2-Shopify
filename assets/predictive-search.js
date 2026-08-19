/**
 * ATELIER LUXE — PREDICTIVE SEARCH ENGINE
 * Instant Debounced Live Search, Category Grouping & Keyboard Nav
 */

class PredictiveSearch {
  constructor() {
    this.modal = document.querySelector('.search-modal');
    this.input = document.querySelector('.search-modal__input');
    this.resultsContainer = document.querySelector('.search-modal__results');
    this.emptyState = document.querySelector('.search-modal__empty-state');
    this.backdrop = document.querySelector('.backdrop-overlay');
    this.debounceTimer = null;

    this.initTriggers();
    this.initInput();
  }

  initTriggers() {
    document.querySelectorAll('[data-open-search]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.open();
      });
    });

    const closeBtn = document.querySelector('.search-modal__close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }

    // Trending pills click
    document.querySelectorAll('.search-modal__trending-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const term = pill.textContent.trim();
        if (this.input) {
          this.input.value = term;
          this.performSearch(term);
        }
      });
    });
  }

  open() {
    if (!this.modal) return;
    this.modal.classList.add('is-active');
    if (this.backdrop) this.backdrop.classList.add('is-active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => this.input?.focus(), 100);
  }

  close() {
    if (!this.modal) return;
    this.modal.classList.remove('is-active');
    if (this.backdrop) this.backdrop.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  initInput() {
    if (!this.input) return;

    this.input.addEventListener('input', (e) => {
      const query = e.target.value.trim();
      clearTimeout(this.debounceTimer);

      if (query.length < 2) {
        if (this.emptyState) this.emptyState.style.display = 'block';
        if (this.resultsContainer) this.resultsContainer.innerHTML = '';
        return;
      }

      this.debounceTimer = setTimeout(() => {
        this.performSearch(query);
      }, 250);
    });

    // Keyboard navigation (Arrow keys + Esc)
    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.close();
      }
    });
  }

  async performSearch(query) {
    try {
      const response = await fetch(`/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product,collection,article&resources[limit]=6&resources[options][unavailable_products]=last`);
      if (!response.ok) return;

      const data = await response.json();
      this.renderResults(data.resources.results, query);
    } catch (err) {
      console.error('Predictive search error:', err);
    }
  }

  renderResults(results, query) {
    if (!this.resultsContainer) return;
    if (this.emptyState) this.emptyState.style.display = 'none';

    const products = results.products || [];
    const collections = results.collections || [];
    const articles = results.articles || [];

    if (products.length === 0 && collections.length === 0 && articles.length === 0) {
      this.resultsContainer.innerHTML = `
        <div style="padding: 2rem 0; text-align: center; color: var(--color-text-muted);">
          <p>No results found for "<strong>${query}</strong>".</p>
        </div>
      `;
      return;
    }

    this.resultsContainer.innerHTML = `
      <div class="search-modal__results-grid">
        <div class="search-modal__products-col">
          <h4 class="search-modal__section-title">Matching Products (${products.length})</h4>
          <div class="search-modal__products-list">
            ${products.map(p => `
              <a href="${p.url}" class="search-result-item">
                <img src="${p.image || ''}" alt="${p.title}" class="search-result-item__img" loading="lazy">
                <div class="search-result-item__details">
                  <span class="search-result-item__title">${p.title}</span>
                  <span class="search-result-item__price">${p.price}</span>
                </div>
              </a>
            `).join('')}
          </div>
          <div style="margin-top: 1.5rem;">
            <a href="/search?q=${encodeURIComponent(query)}" class="btn btn-secondary btn-sm">View all results for "${query}" →</a>
          </div>
        </div>

        <div class="search-modal__meta-col">
          ${collections.length > 0 ? `
            <div style="margin-bottom: 2rem;">
              <h4 class="search-modal__section-title">Collections</h4>
              <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.5rem;">
                ${collections.map(c => `
                  <li><a href="${c.url}" style="font-size: 14px; text-decoration: underline;">${c.title}</a></li>
                `).join('')}
              </ul>
            </div>
          ` : ''}

          ${articles.length > 0 ? `
            <div>
              <h4 class="search-modal__section-title">Journal & Articles</h4>
              <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.5rem;">
                ${articles.map(a => `
                  <li><a href="${a.url}" style="font-size: 14px;">${a.title}</a></li>
                `).join('')}
              </ul>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.predictiveSearch = new PredictiveSearch();
});
