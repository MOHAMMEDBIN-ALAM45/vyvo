import React, { useEffect, useMemo, useState } from "react";
import logo from "./assets/logo.png";
import bottleFront from "./assets/bottle_front.png";

const baseUrl = "http://localhost:5175";

/** Same-page anchors (works with Vite dev server on any port) */
const navLinks = [
  { label: "Home", href: "#top" },
  { label: "Catalog", href: "#catalog" },
  { label: "Contact", href: "#contact" },
];

/** Hero video from [vyvo.life](https://vyvo.life/) (Shopify CDN) */
const HERO_VIDEO_POSTER =
  "https://vyvo.life/cdn/shop/files/preview_images/97c51a8e95bc422886d51f36d587acd7.thumbnail.0000000000.jpg?v=1762182207&width=1920";
const HERO_VIDEO_MP4 =
  "https://vyvo.life/cdn/shop/videos/c/vp/97c51a8e95bc422886d51f36d587acd7/97c51a8e95bc422886d51f36d587acd7.HD-1080p-7.2Mbps-61546570.mp4?v=0";

const COUNTRIES = [
  { code: "AU", name: "Australia", currency: "AUD", symbol: "$" },
  { code: "AT", name: "Austria", currency: "EUR", symbol: "€" },
  { code: "BE", name: "Belgium", currency: "EUR", symbol: "€" },
  { code: "BR", name: "Brazil", currency: "USD", symbol: "$" },
  { code: "CA", name: "Canada", currency: "CAD", symbol: "$" },
  { code: "CO", name: "Colombia", currency: "USD", symbol: "$" },
  { code: "CR", name: "Costa Rica", currency: "CRC", symbol: "₡" },
  { code: "CZ", name: "Czechia", currency: "CZK", symbol: "Kč" },
  { code: "DK", name: "Denmark", currency: "DKK", symbol: "kr." },
  { code: "FI", name: "Finland", currency: "EUR", symbol: "€" },
  { code: "FR", name: "France", currency: "EUR", symbol: "€" },
  { code: "DE", name: "Germany", currency: "EUR", symbol: "€" },
  { code: "HN", name: "Honduras", currency: "HNL", symbol: "L" },
  { code: "HK", name: "Hong Kong SAR", currency: "HKD", symbol: "$" },
  { code: "IE", name: "Ireland", currency: "EUR", symbol: "€" },
  { code: "IT", name: "Italy", currency: "EUR", symbol: "€" },
  { code: "JP", name: "Japan", currency: "JPY", symbol: "¥" },
  { code: "MY", name: "Malaysia", currency: "MYR", symbol: "RM" },
  { code: "MX", name: "Mexico", currency: "USD", symbol: "$" },
  { code: "NL", name: "Netherlands", currency: "EUR", symbol: "€" },
  { code: "NZ", name: "New Zealand", currency: "NZD", symbol: "$" },
  { code: "NO", name: "Norway", currency: "USD", symbol: "$" },
  { code: "PL", name: "Poland", currency: "PLN", symbol: "zł" },
  { code: "PT", name: "Portugal", currency: "EUR", symbol: "€" },
  { code: "SG", name: "Singapore", currency: "SGD", symbol: "$" },
  { code: "KR", name: "South Korea", currency: "KRW", symbol: "₩" },
  { code: "ES", name: "Spain", currency: "EUR", symbol: "€" },
  { code: "SE", name: "Sweden", currency: "SEK", symbol: "kr" },
  { code: "CH", name: "Switzerland", currency: "CHF", symbol: "CHF" },
  { code: "AE", name: "United Arab Emirates", currency: "AED", symbol: "د.إ" },
  { code: "GB", name: "United Kingdom", currency: "GBP", symbol: "£" },
  { code: "US", name: "United States", currency: "USD", symbol: "$" },
];

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [currencyQuery, setCurrencyQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(
    COUNTRIES.find((c) => c.code === "US") ?? COUNTRIES[0]
  );
  const [rates, setRates] = useState({ USD: 1 });
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      setAtTop(window.scrollY <= 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let mounted = true;
    fetch("https://open.er-api.com/v6/latest/USD")
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        if (data?.rates) {
          setRates(data.rates);
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  const filteredCountries = useMemo(() => {
    const q = currencyQuery.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.currency.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q)
    );
  }, [currencyQuery]);

  const formatPrice = (usd) => {
    const rate = rates[selectedCountry.currency] ?? 1;
    const value = usd * rate;
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: selectedCountry.currency,
        maximumFractionDigits: selectedCountry.currency === "JPY" ? 0 : 2,
      }).format(value);
    } catch {
      return `${selectedCountry.symbol}${value.toFixed(2)}`;
    }
  };

  return (
    <div className="app">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="header header-pill" role="banner">
        <div className="container header-inner header-pill-inner">
           <a className="brand" href="#top" aria-label="VL Perfume home">
            <img className="brand-logo" src={logo} alt="VL logo" />
          </a>

          <nav className="nav" aria-label="Primary">
            <button
              className="nav-toggle"
              aria-expanded={menuOpen}
              aria-controls="nav-menu"
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className="nav-toggle-icon" aria-hidden="true"></span>
              Menu
            </button>
            <ul id="nav-menu" className="nav-menu" data-open={menuOpen}>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} onClick={() => setMenuOpen(false)}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="header-actions" aria-label="Header actions">
            <div className="currency-wrap">
              <button
                className="currency"
                type="button"
                aria-label="Currency selector"
                onClick={() => setCurrencyOpen((open) => !open)}
              >
                {selectedCountry.currency} <span aria-hidden="true">▼</span>
              </button>
              {currencyOpen && (
                <div className="currency-menu" role="dialog" aria-label="Select country">
                  <div className="currency-search">
                    <input
                      className="currency-input"
                      type="search"
                      placeholder="Search"
                      value={currencyQuery}
                      onChange={(e) => setCurrencyQuery(e.target.value)}
                    />
                  </div>
                  <ul className="currency-list" role="listbox">
                    {filteredCountries.map((country) => (
                      <li key={country.code}>
                        <button
                          className="currency-item"
                          type="button"
                          onClick={() => {
                            setSelectedCountry(country);
                            setCurrencyOpen(false);
                          }}
                        >
                          <span className="currency-name">{country.name}</span>
                          <span className="currency-code">
                            {country.currency} {country.symbol}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <button className="icon-btn" type="button" aria-label="Search">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M11 3a8 8 0 1 1-4.9 14.3l-3.2 3.2 1.4 1.4 3.2-3.2A8 8 0 0 1 11 3Zm0 2a6 6 0 1 0 0 12 6 6 0 0 0 0-12Z"
                  fill="currentColor"
                />
              </svg>
            </button>
            <button className="icon-btn" type="button" aria-label="Account">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.4 0-8 2.2-8 5v2h16v-2c0-2.8-3.6-5-8-5Z"
                  fill="currentColor"
                />
              </svg>
            </button>
            <button className="icon-btn" type="button" aria-label="Cart">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M7 6V5a5 5 0 0 1 10 0v1h3v14H4V6Zm2 0h6V5a3 3 0 0 0-6 0Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main id="main">
        <section id="top" className="hero hero--video" aria-label="New arrivals">
          <div className="hero__stack">
            <div className="hero__media" style={{ "--hero-media-aspect-ratio": "1" }}>
              <div
                className="hero__overlay"
                aria-hidden="true"
                style={{
                  "--overlay-color": "rgba(0, 0, 0, 0.36)",
                  "--overlay-color-end": "rgba(0, 0, 0, 0)",
                }}
              />
              <div className="hero__video-wrapper">
                <img
                  className="hero__video-poster"
                  src={HERO_VIDEO_POSTER}
                  alt=""
                  width={1920}
                  height={1080}
                />
                <video
                  className="hero__video"
                  playsInline
                  autoPlay
                  muted
                  loop
                  preload="metadata"
                  poster={HERO_VIDEO_POSTER}
                >
                  <source src={HERO_VIDEO_MP4} type="video/mp4" />
                  <img src={HERO_VIDEO_POSTER} alt="" />
                </video>
              </div>
            </div>

            <div className="hero__content-wrapper">
              <div className="hero__content ">
                <div className="text-block text-block--heading">
                  <h1 className="hero__h1">New Arrivals</h1>
                </div>
                <div className="text-block text-block--rte">
                  <p className="hero__tagline">Better Than Your Ex – A Scent That Stays.</p>
                </div>
                <a className="btn btn-hero" href="#catalog">
                  Shop Now
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="section section-best">
          <div className="container">
            <div className="section-head">
              <div>
                <h2 className="section-title">Best Sellers</h2>
                <p className="section-subtitle">Don&apos;t miss out on the most loved drops.</p>
              </div>
              <button className="btn btn-ghost" type="button">
                View all
              </button>
            </div>

            <div className="product-grid">
              <article className="product-card">
                <div className="product-media">
                  <img className="product-image" src={bottleFront} alt="Better Than Your Ex bottle" />
                </div>
                <div className="product-body">
                  <h3 className="product-title">Better Than Your Ex - Eau de Parfum</h3>
                  <p className="product-desc">Bold and addictive with amberwood, vanilla, and sage.</p>
                  <div className="product-row">
                    <span className="product-price">{formatPrice(65)}</span>
                    <button className="btn btn-primary" type="button">
                      Add
                    </button>
                  </div>
                </div>
              </article>

            </div>
          </div>
        </section>

        <section id="catalog" className="section section-product">
          <div className="container">
            <div className="catalog-layout">
              <div className="catalog-bottle">
                <div className="bottle-card bottle-card--product">
                  <div className="bottle-card-top">
                    <div className="bottle-pill">Signature Eau de Parfum</div>
                    <div className="bottle-price">{formatPrice(65)}</div>
                  </div>

                  <div className="bottle-stage">
                    <img className="bottle-static" src={bottleFront} alt="Better Than Your Ex bottle" />
                    <div className="bottle-stage-glow" aria-hidden="true"></div>
                  </div>

                  <div className="bottle-card-bottom">
                    <button className="btn btn-primary btn-wide bottle-cta" type="button">
                      Add to cart
                    </button>
                    <div className="rating" aria-label="5 out of 5 stars">
                      <span aria-hidden="true">★★★★★</span>
                      <span className="rating-meta">12 reviews</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="catalog-summary glass glass--panel" aria-label="Product details">
                <p className="product-kicker">VL - Perfume</p>
                <h2 className="product-main-title">Better Than Your Ex - Eau de Parfum</h2>

                <div className="product-meta-row">
                  <div className="product-meta-item">
                    <span className="product-meta-strong">12</span> reviews
                  </div>
                  <div className="product-meta-item">
                    <span className="product-meta-strong">{formatPrice(65)}</span>
                  </div>
                  <div className="product-meta-item">3.4 oz / 100 mL</div>
                </div>

                <div className="product-warning" role="note">
                  WARNING: Wearing this perfume might make your ex comeback!
                </div>

                <p className="product-description">
                  Better Than Your Ex is a long-lasting Essence Eau de Parfum made for anyone who wants to stand
                  out without saying a word. It opens fresh and spicy with cardamom, pink pepper, mint, and
                  violet leaf, then settles into a smooth blend of pineapple, melon, lavender, cinnamon, and
                  sage.
                </p>
                <p className="product-description">
                  The finish is warm, rich, and addictive with vanilla, chestnut, amberwood, cedarwood, and guaiac
                  wood. The result is a scent that feels confident, clean, and unforgettable.
                </p>

                <h3 className="product-subtitle">Why you&apos;ll love it:</h3>
                <ul className="product-bullets">
                  <li>Long-lasting scent</li>
                  <li>Smooth, bold, and versatile</li>
                  <li>Unisex and easy to wear day or night</li>
                  <li>Premium packaging with a surprise quote inside</li>
                  <li>Free shipping</li>
                </ul>
                <strong data-start="2051" data-end="2074">Better Than Your Ex</strong>
                - Because the best revenge smells amazing.

                <div className="product-notes">
                  <div className="product-family">
                    <div className="product-note-label">Fragrance Family</div>
                    <div className="product-note-value">Fougère</div>
                  </div>

                  <div className="notes-grid" aria-label="Fragrance notes">
                    <div className="note-card">
                      <div className="note-title">Top</div>
                      <div className="note-text">Cardamom, Pink Pepper, Violet Leaf, Mint</div>
                    </div>
                    <div className="note-card">
                      <div className="note-title">Heart</div>
                      <div className="note-text">Pineapple, Cinnamon, Melon, Sage, Lavender</div>
                    </div>
                    <div className="note-card">
                      <div className="note-title">Base</div>
                      <div className="note-text">Vanilla, Chestnut, Amberwood, Cedarwood, Guaiac Wood</div>
                    </div>
                  </div>
                </div>

                <h3 className="product-subtitle">Customer Reviews</h3>
                <div className="reviews-sample">
                  <div className="review-item">
                    <div className="review-name">Dexter</div>
                    <div className="review-text">Love the smell, would buy again.</div>
                  </div>
                  <div className="review-item">
                    <div className="review-name">Tamim</div>
                    <div className="review-text">Smells amazing... loved it</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section section-xfactor" id="features">
          <div className="container">
            <div className="xfactor-head">
              <h2 className="section-title xfactor-title">The x Factor</h2>
              <p className="section-subtitle xfactor-subtitle">The VL Perfume Difference</p>
            </div>

            <div className="feature-grid feature-grid-x">
              <div className="feature-card feature-card-x">
                <div className="feature-icon-x" aria-hidden="true">
                  🚚
                </div>
                <div className="feature-title">Same Day Free Shipping</div>
                <div className="feature-text">Orders ship on the day you place them and arrive within days.</div>
              </div>
              <div className="feature-card feature-card-x">
                <div className="feature-icon-x" aria-hidden="true">
                  🏅
                </div>
                <div className="feature-title">Trusted Since 2025</div>
                <div className="feature-text">100% authentic fragrances. No knockoffs or imitations here.</div>
              </div>
              <div className="feature-card feature-card-x">
                <div className="feature-icon-x" aria-hidden="true">
                  🛡️
                </div>
                <div className="feature-title">Safe & Secure Checkout</div>
                <div className="feature-text">Your information is protected with secure checkout.</div>
              </div>
              <div className="feature-card feature-card-x">
                <div className="feature-icon-x" aria-hidden="true">
                  👍
                </div>
                <div className="feature-title">5 Star Customer Ratings</div>
                <div className="feature-text">Loved for quality and long-lasting scent.</div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="section section-contact">
          <div className="container">
            <div className="contact-card glass">
              <div className="contact-info">
                <h2 className="section-title">Contact</h2>
                <p className="section-subtitle">
                  Questions, wholesale inquiries, or partnership interest? Send a message.
                </p>

                <div className="contact-pills">
                  <div className="contact-pill">
                    <div className="contact-pill-title">Support</div>
                    <div className="contact-pill-sub">We reply quickly</div>
                  </div>
                  <div className="contact-pill">
                    <div className="contact-pill-title">Email List</div>
                    <div className="contact-pill-sub">Get early deals</div>
                  </div>
                </div>

                <div className="contact-meta">
                  <div className="contact-meta-item">Wholesale & partnership inquiries welcome.</div>
                  <div className="contact-meta-item">We respond within 1–2 business days.</div>
                </div>
              </div>

              <form
                className="form form-compact"
                onSubmit={(event) => event.preventDefault()}
                aria-label="Contact form"
              >
                <div className="form-row">
                  <label className="field">
                    <span className="field-label">Name</span>
                    <input className="field-input" name="name" type="text" autoComplete="name" required />
                  </label>
                  <label className="field">
                    <span className="field-label">Email</span>
                    <input className="field-input" name="email" type="email" autoComplete="email" required />
                  </label>
                </div>
                <label className="field">
                  <span className="field-label">Message</span>
                  <textarea className="field-input field-textarea" name="message" rows="5" required></textarea>
                </label>
                <button className="btn btn-primary" type="submit">
                  Send message
                </button>
                <p className="form-note">This demo form does not submit anywhere yet.</p>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer" role="contentinfo">
        <div className="container footer-inner">
          <div className="footer-brand">
            <img className="footer-logo" src={logo} alt="VL logo" />
            <span>© 2026 VL - Perfume</span>
          </div>
          <div className="footer-links">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
