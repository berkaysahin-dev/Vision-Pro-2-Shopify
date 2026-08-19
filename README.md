# Vision Pro 2 — Ultra-Luxury Shopify OS 2.0 Theme

<div align="center">

![Vision Pro 2 Banner](https://img.shields.io/badge/Shopify-Online%20Store%202.0-7AB55C?style=for-the-badge&logo=shopify&logoColor=white)
![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![Motion Engine](https://img.shields.io/badge/Motion-Vanilla%20JS%2060fps-black?style=for-the-badge)

<p align="center">
  <strong>An architectural, high-conversion commercial Shopify Online Store 2.0 theme inspired by luxury industrial design, titanium metallurgy, and spatial computing aesthetics.</strong>
</p>

</div>

---

## ✦ Core Design Philosophy

Vision Pro 2 was engineered from scratch to deliver an editorial luxury flagship experience. It breaks away from generic e-commerce templates with:

- **Architectural Minimalism**: Monolithic typography, subtle borders, high-contrast black/white palette, and generous whitespace.
- **Cinematic Motion**: 60fps vanilla JS IntersectionObserver reveal animations, parallax media scrolling, and fluid layout shifts without heavy external dependencies.
- **High-Velocity Conversion Rate Optimization (CRO)**: Slide-out AJAX cart drawer with tiered free-shipping progress tracker, live scarcity inventory meters, dynamic delivery countdowns, sticky add-to-cart bars, and rapid 1-click checkout.
- **True Shopify OS 2.0 Architecture**: 100% modular JSON templates with dynamic section groups (`sections/header-group.json`, `sections/footer-group.json`), native storefront facet filtering, predictive search, and multi-language localization.

---

## ✦ Features & Sections

### 1. Header & Navigation
- Sticky frosted glass header (`backdrop-filter: blur(20px)`) with announcement bar integration.
- Full multi-column mega menus with featured editorial visual cards.
- Real-time predictive search modal, customer login, instant wishlist counter, and AJAX cart badge.

### 2. Homepage & Editorial Sections
- **Cinematic Hero**: Fullscreen viewport with video/image parallax and split text reveal.
- **Marquee Statement Ticker**: Infinite scrolling brand statements with customizable direction, speed, and divider symbols.
- **Horizontal Product Rail**: Smooth track carousel for signature collections with manual arrow controls.
- **Editorial Brand Story**: Asymmetrical dual-image storytelling with pull quotes and CTA routing.
- **Sticky Storytelling**: Multi-chapter pinned visual storytelling with sequential copy reveals.
- **Product Spotlight Showcase**: Technical specification matrix (Grade 5 Titanium, 0.02mm CNC tolerances, lifetime guarantees).
- **Cinematic Magazine Banner**: High-impact editorial hero with dual call-to-actions.
- **Interactive Before / After Slider**: Real-time draggable comparison between raw CNC machined surfaces and hand-buffed satin finishes.
- **Curated Essentials Grid**: Responsive 4-column product grid with quick-buy hover triggers and color swatches.
- **Brand Press Row**: Editorial publication logos (Wallpaper\*, Monocle, Wired, Architectural Digest).
- **FAQ Accordion**: Single and multi-expandable accordion drawers.
- **Newsletter**: High-conversion email capture with privacy disclaimers.

### 3. Product Detail Page (PDP)
- Responsive media gallery with instant thumbnail switching and zoom.
- Live scarcity urgency pill (`⚡ Only 4 units remaining in current batch`).
- Real-time countdown timer estimating delivery timeframes.
- Unlocked complimentary DHL Express shipping alert banner.
- Color swatch selector with dynamic preview switching.
- Sticky Add to Cart bottom bar sliding smoothly into view on scroll.
- Integrated trust security grid (256-Bit SSL, DHL Priority, 30-Day Returns, 2-Year Warranty).
- Multi-tab information accordions for specifications, metallurgy care, and global logistics.

### 4. Conversion Systems
- **AJAX Cart Drawer**: Slide-out drawer with free shipping progress bar, gift notes, and 1-click cross-sell recommendations.
- **Predictive Search**: Live search results with instantaneous keyboard navigation.
- **Client-Side Wishlist**: LocalStorage-persisted wishlist accessible without login.
- **Quick View Modal**: Rapid modal overlay for browsing details and adding to cart without leaving the catalog.

---

## ✦ File Structure

```
├── assets/
│   ├── base.css                      # Design tokens, global utilities, reveal keyframes
│   ├── component-header.css          # Frosted glass header, mega menu & mobile drawer
│   ├── component-product.css         # PDP gallery, purchase matrix, trust signals
│   ├── component-product-card.css    # Card aspect ratios, hover overlays, swatches
│   ├── component-cart-drawer.css     # AJAX drawer & progress bar
│   ├── component-search.css          # Fullscreen predictive search modal
│   ├── component-sections.css        # Hero, sticky storytelling, rail, before/after
│   ├── theme.js                      # Core DOM controllers, accordions, modals
│   ├── motion.js                     # Scroll reveal & parallax engine (60fps)
│   ├── cart-drawer.js                # AJAX cart updates & fly-to-bag animation
│   ├── product-form.js               # Variant switching & stock updates
│   ├── predictive-search.js          # Live search query handler
│   ├── wishlist.js                   # LocalStorage wishlist engine
│   └── quick-view.js                 # AJAX quick view modal injector
├── config/
│   ├── settings_schema.json          # Theme customizer typography, colors, CRO settings
│   └── settings_data.json            # Default & Noir Luxury color presets
├── layout/
│   ├── theme.liquid                  # Primary HTML5 wrapper & meta tags
│   └── password.liquid               # Private pre-launch showroom template
├── locales/
│   ├── en.default.json               # English translations
│   └── tr.json                       # Turkish translations
├── sections/                         # 31 OS 2.0 modular Liquid sections
├── snippets/                         # Reusable atomic Liquid snippets
└── templates/                        # JSON modular templates & customer Liquid templates
```

---

## ✦ Installation & Deployment

### Method 1: Shopify CLI (Recommended for Developers)

1. Clone the repository:
   ```bash
   git clone https://github.com/berkaysahin-dev/Vision-Pro-2-Shopify-Theme.git
   cd Vision-Pro-2-Shopify-Theme
   ```

2. Push to your Shopify Development Store:
   ```bash
   shopify theme push --store your-store.myshopify.com
   ```

3. Preview live:
   ```bash
   shopify theme dev --store your-store.myshopify.com
   ```

### Method 2: Manual ZIP Upload

1. Download the latest release: [`Vision-Pro-2-Theme.zip`](https://github.com/berkaysahin-dev/Vision-Pro-2-Shopify-Theme/releases/latest)
2. In Shopify Admin, navigate to **Online Store → Themes**.
3. Under **Theme Library**, click **Add theme → Upload zip file**.
4. Select `Vision-Pro-2-Theme.zip` and click **Actions → Publish**.

---

## ✦ Localization & Multi-Language Support

Vision Pro 2 fully supports multi-language stores via native Shopify translations.
- **English**: `locales/en.default.json` (Default)
- **Turkish**: `locales/tr.json`

To add a new language (e.g. French, German, Japanese):
1. Duplicate `locales/en.default.json` to `locales/fr.json`.
2. Translate the values.
3. Activate the language in **Shopify Admin → Settings → Languages**.

---

## ✦ License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">
  <sub>Engineered by <strong>Vision SH Studio</strong>. Designed for modern luxury commerce.</sub>
</div>
