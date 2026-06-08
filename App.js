import { useState, useEffect, useRef } from "react";

// ── Palette ────────────────────────────────────────────────────────────────
const C = {
  ivory: "#F8F5F0",
  gold: "#D4AF37",
  goldLight: "#E8CC6A",
  black: "#111111",
  white: "#FFFFFF",
  grey: "#888880",
  greyLight: "#CCCAC5",
};

// ── Global Styles Injected Once ───────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ivory:  ${C.ivory};
    --gold:   ${C.gold};
    --black:  ${C.black};
    --white:  ${C.white};
    --grey:   ${C.grey};
    scroll-behavior: smooth;
  }

  body {
    background: var(--black);
    color: var(--ivory);
    font-family: 'Jost', sans-serif;
    font-weight: 300;
    letter-spacing: .04em;
    overflow-x: hidden;
  }

  ::selection { background: var(--gold); color: var(--black); }

  /* scrollbar */
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: var(--black); }
  ::-webkit-scrollbar-thumb { background: var(--gold); }

  .serif { font-family: 'Cormorant Garamond', serif; }

  /* fade-up on scroll */
  .reveal { opacity: 0; transform: translateY(40px); transition: opacity .9s ease, transform .9s ease; }
  .reveal.visible { opacity: 1; transform: translateY(0); }
  .reveal-delay-1 { transition-delay: .15s; }
  .reveal-delay-2 { transition-delay: .30s; }
  .reveal-delay-3 { transition-delay: .45s; }
  .reveal-delay-4 { transition-delay: .60s; }

  /* gold underline link */
  .gold-link {
    color: var(--gold);
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: border-color .3s;
  }
  .gold-link:hover { border-color: var(--gold); }

  /* btn primary */
  .btn-primary {
    display: inline-block;
    padding: 14px 38px;
    background: var(--gold);
    color: var(--black);
    font-family: 'Jost', sans-serif;
    font-weight: 500;
    font-size: .75rem;
    letter-spacing: .18em;
    text-transform: uppercase;
    text-decoration: none;
    border: none;
    cursor: pointer;
    transition: background .3s, transform .2s;
  }
  .btn-primary:hover { background: #c9a22e; transform: translateY(-2px); }

  /* btn ghost */
  .btn-ghost {
    display: inline-block;
    padding: 13px 37px;
    background: transparent;
    color: var(--ivory);
    font-family: 'Jost', sans-serif;
    font-weight: 400;
    font-size: .75rem;
    letter-spacing: .18em;
    text-transform: uppercase;
    text-decoration: none;
    border: 1px solid rgba(248,245,240,.45);
    cursor: pointer;
    transition: border-color .3s, color .3s, transform .2s;
  }
  .btn-ghost:hover { border-color: var(--gold); color: var(--gold); transform: translateY(-2px); }

  /* divider */
  .gold-divider {
    width: 48px; height: 1px; background: var(--gold); margin: 0 auto 32px;
  }

  /* section wrapper */
  .section-wrap { max-width: 1280px; margin: 0 auto; padding: 0 40px; }
  @media(max-width:768px){ .section-wrap { padding: 0 20px; } }

  /* input */
  .lea-input {
    width: 100%;
    background: rgba(248,245,240,.05);
    border: 1px solid rgba(212,175,55,.3);
    color: var(--ivory);
    font-family: 'Jost', sans-serif;
    font-size: .85rem;
    letter-spacing: .06em;
    padding: 14px 18px;
    outline: none;
    transition: border-color .3s;
    -webkit-appearance: none;
  }
  .lea-input:focus { border-color: var(--gold); }
  .lea-input::placeholder { color: rgba(248,245,240,.35); }
  .lea-input option { background: #1a1a1a; }

  /* textarea */
  .lea-textarea {
    width: 100%; min-height: 120px; resize: vertical;
    background: rgba(248,245,240,.05);
    border: 1px solid rgba(212,175,55,.3);
    color: var(--ivory);
    font-family: 'Jost', sans-serif;
    font-size: .85rem;
    letter-spacing: .06em;
    padding: 14px 18px;
    outline: none;
    transition: border-color .3s;
  }
  .lea-textarea:focus { border-color: var(--gold); }
  .lea-textarea::placeholder { color: rgba(248,245,240,.35); }

  /* label */
  .lea-label {
    display: block;
    font-size: .7rem;
    letter-spacing: .16em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 8px;
  }

  /* form group */
  .form-group { margin-bottom: 24px; }

  /* checkbox custom */
  .check-label {
    display: flex; align-items: center; gap: 10px; cursor: pointer;
    font-size: .8rem; letter-spacing: .06em; color: var(--ivory);
  }
  .check-label input { display: none; }
  .check-box {
    width: 18px; height: 18px; flex-shrink: 0;
    border: 1px solid rgba(212,175,55,.5);
    display: flex; align-items: center; justify-content: center;
    transition: background .2s;
  }
  .check-label input:checked + .check-box { background: var(--gold); }
  .check-box::after { content:'✓'; font-size:11px; color:var(--black); opacity:0; }
  .check-label input:checked + .check-box::after { opacity:1; }

  /* upload card */
  .upload-card {
    border: 1px dashed rgba(212,175,55,.4);
    padding: 32px 24px; text-align: center;
    cursor: pointer; transition: border-color .3s, background .3s;
  }
  .upload-card:hover { border-color: var(--gold); background: rgba(212,175,55,.04); }

  /* nav */
  .nav-link {
    font-size: .72rem; letter-spacing: .18em; text-transform: uppercase;
    color: var(--ivory); text-decoration: none;
    opacity: .75; transition: opacity .3s, color .3s;
  }
  .nav-link:hover { opacity: 1; color: var(--gold); }

  /* card hover lift */
  .card-lift { transition: transform .4s ease, box-shadow .4s ease; }
  .card-lift:hover { transform: translateY(-6px); box-shadow: 0 24px 60px rgba(212,175,55,.12); }

  /* hero video overlay */
  .hero-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to bottom,
      rgba(17,17,17,.25) 0%,
      rgba(17,17,17,.55) 60%,
      rgba(17,17,17,.92) 100%);
  }

  /* section titles */
  .section-eyebrow {
    font-size: .68rem; letter-spacing: .3em; text-transform: uppercase;
    color: var(--gold); margin-bottom: 16px;
  }
  .section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2.2rem,5vw,4rem);
    font-weight: 300; line-height: 1.1; color: var(--ivory);
  }
  .section-title em { font-style: italic; color: var(--gold); }
  .section-body {
    font-size: .9rem; line-height: 1.9; color: rgba(248,245,240,.7);
    max-width: 600px;
  }

  /* accordion */
  .acc-item { border-bottom: 1px solid rgba(212,175,55,.2); }
  .acc-trigger {
    width: 100%; background: none; border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: space-between;
    padding: 22px 0; color: var(--ivory);
    font-family: 'Jost', sans-serif; font-size: .9rem; letter-spacing: .06em;
    text-align: left;
  }
  .acc-trigger:hover { color: var(--gold); }
  .acc-content {
    max-height: 0; overflow: hidden; transition: max-height .4s ease;
  }
  .acc-content.open { max-height: 400px; }
  .acc-content p {
    padding-bottom: 20px; font-size: .85rem; line-height: 1.85;
    color: rgba(248,245,240,.65);
  }

  /* testimonial */
  .testimonial-card {
    padding: 40px 36px;
    border: 1px solid rgba(212,175,55,.18);
    position: relative;
  }
  .testimonial-card::before {
    content: '"'; font-family: 'Cormorant Garamond', serif;
    font-size: 6rem; line-height: 1; color: rgba(212,175,55,.15);
    position: absolute; top: 12px; left: 24px;
  }

  /* tag pill */
  .tag-pill {
    display: inline-block; padding: 6px 16px;
    border: 1px solid rgba(212,175,55,.35); font-size: .68rem;
    letter-spacing: .16em; text-transform: uppercase; color: var(--gold);
    margin: 4px;
  }

  /* admin modal */
  .modal-backdrop {
    position: fixed; inset: 0; background: rgba(0,0,0,.85);
    display: flex; align-items: center; justify-content: center;
    z-index: 9999; padding: 20px;
  }
  .modal-box {
    background: #161616; border: 1px solid rgba(212,175,55,.3);
    max-width: 440px; width: 100%; padding: 48px 40px;
  }

  @media(max-width:768px){
    .hide-mobile { display: none !important; }
    .mobile-full { grid-column: 1/-1 !important; }
  }
`;

// ── Inject CSS ────────────────────────────────────────────────────────────
function StyleTag() {
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = GLOBAL_CSS;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);
  return null;
}

// ── Scroll Reveal Hook ────────────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
}

// ── Navbar ────────────────────────────────────────────────────────────────
function Navbar({ onApply, onAdmin }) {
  const [scrolled, setScrolled] = useState(false);
  const [mOpen, setMOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = ["About", "Program", "Apply", "FAQ", "Contact"];

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: scrolled ? "rgba(17,17,17,.96)" : "transparent",
        borderBottom: scrolled ? "1px solid rgba(212,175,55,.12)" : "none",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        transition: "all .4s ease",
        padding: "0 40px",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 72,
        }}
      >
        {/* Logo */}
        <a href="#hero" style={{ textDecoration: "none" }}>
          <div
            className="serif"
            style={{
              fontSize: "1.6rem",
              fontWeight: 300,
              letterSpacing: ".22em",
              color: C.gold,
            }}
          >
            LEA{" "}
            <span style={{ color: C.ivory, fontStyle: "italic" }}>Models</span>
          </div>
        </a>

        {/* Desktop nav */}
        <div className="hide-mobile" style={{ display: "flex", gap: 36 }}>
          {links.map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} className="nav-link">
              {l}
            </a>
          ))}
        </div>

        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <button
            className="btn-primary hide-mobile"
            onClick={onApply}
            style={{ padding: "10px 24px", fontSize: ".68rem" }}
          >
            Apply Now
          </button>
          <button
            onClick={() => setMOpen(!mOpen)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: C.ivory,
              fontSize: "1.4rem",
            }}
          >
            {mOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mOpen && (
        <div
          style={{
            background: "rgba(17,17,17,.98)",
            padding: "24px 40px 32px",
            borderTop: "1px solid rgba(212,175,55,.15)",
          }}
        >
          {links.map((l) => (
            <div
              key={l}
              style={{
                padding: "12px 0",
                borderBottom: "1px solid rgba(255,255,255,.06)",
              }}
            >
              <a
                href={`#${l.toLowerCase()}`}
                className="nav-link"
                onClick={() => setMOpen(false)}
              >
                {l}
              </a>
            </div>
          ))}
          <button
            className="btn-primary"
            style={{ marginTop: 20, width: "100%" }}
            onClick={() => {
              onApply();
              setMOpen(false);
            }}
          >
            Apply Now
          </button>
          <button
            onClick={onAdmin}
            style={{
              background: "none",
              border: "none",
              color: "rgba(248,245,240,.3)",
              fontSize: ".65rem",
              letterSpacing: ".12em",
              cursor: "pointer",
              marginTop: 16,
            }}
          >
            Admin
          </button>
        </div>
      )}
    </nav>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────
function Hero({ onApply }) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
  }, []);

  return (
    <section
      id="hero"
      style={{
        position: "relative",
        height: "100vh",
        minHeight: 600,
        overflow: "hidden",
        display: "flex",
        alignItems: "flex-end",
        paddingBottom: 80,
      }}
    >
      {/* Gradient background (placeholder for video) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(135deg, #0a0a0a 0%, #1a1408 40%, #0d0d0d 100%)`,
        }}
      />
      {/* Decorative editorial lines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${10 + i * 12}%`,
              top: 0,
              bottom: 0,
              width: "1px",
              background: "rgba(212,175,55,.04)",
            }}
          />
        ))}
        {/* Large serif watermark */}
        <div
          className="serif"
          style={{
            position: "absolute",
            right: "-2%",
            top: "8%",
            fontSize: "clamp(8rem,18vw,22rem)",
            fontWeight: 300,
            fontStyle: "italic",
            color: "rgba(212,175,55,.04)",
            lineHeight: 1,
            letterSpacing: ".05em",
            userSelect: "none",
            whiteSpace: "nowrap",
          }}
        >
          LEA
        </div>
        {/* Corner accents */}
        <div
          style={{
            position: "absolute",
            top: 100,
            left: 40,
            width: 60,
            height: 60,
            borderTop: `1px solid rgba(212,175,55,.3)`,
            borderLeft: `1px solid rgba(212,175,55,.3)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 100,
            right: 40,
            width: 60,
            height: 60,
            borderTop: `1px solid rgba(212,175,55,.3)`,
            borderRight: `1px solid rgba(212,175,55,.3)`,
          }}
        />
      </div>

      <div className="hero-overlay" />

      {/* Content */}
      <div
        className="section-wrap"
        style={{ position: "relative", zIndex: 2, width: "100%" }}
      >
        <div
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "none" : "translateY(30px)",
            transition: "all 1.2s ease .3s",
          }}
        >
          <p
            style={{
              fontSize: ".72rem",
              letterSpacing: ".35em",
              textTransform: "uppercase",
              color: C.gold,
              marginBottom: 20,
            }}
          >
            International · Paris · Milan · New York
          </p>
          <h1
            className="serif"
            style={{
              fontSize: "clamp(2.8rem,7vw,6.5rem)",
              fontWeight: 300,
              lineHeight: 1.05,
              color: C.ivory,
              maxWidth: 820,
              marginBottom: 20,
            }}
          >
            Discover Your Potential.
            <br />
            <em style={{ fontStyle: "italic", color: C.gold }}>
              Become Extraordinary.
            </em>
          </h1>
          <p
            style={{
              fontSize: ".88rem",
              letterSpacing: ".12em",
              textTransform: "uppercase",
              color: "rgba(248,245,240,.6)",
              marginBottom: 44,
              maxWidth: 480,
            }}
          >
            International Model Development &amp; Talent Management
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <button className="btn-primary" onClick={onApply}>
              Apply Now
            </button>
            <a href="#about" className="btn-ghost">
              Learn More
            </a>
          </div>
        </div>

        {/* Scroll hint */}
        <div
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            opacity: loaded ? 0.6 : 0,
            transition: "opacity 1s ease 1.5s",
          }}
        >
          <span
            style={{
              fontSize: ".6rem",
              letterSpacing: ".25em",
              textTransform: "uppercase",
              writingMode: "vertical-rl",
            }}
          >
            Scroll
          </span>
          <div
            style={{
              width: 1,
              height: 48,
              background: `linear-gradient(${C.gold},transparent)`,
            }}
          />
        </div>
      </div>
    </section>
  );
}

// ── About ─────────────────────────────────────────────────────────────────
function About() {
  useReveal();
  return (
    <section id="about" style={{ background: C.black, padding: "120px 0" }}>
      <div className="section-wrap">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 80,
            alignItems: "center",
          }}
        >
          <div>
            <p className="section-eyebrow reveal">About LEA Models</p>
            <h2 className="section-title reveal reveal-delay-1">
              Where Talent Meets <em>Opportunity</em>
            </h2>
            <div
              className="gold-divider reveal reveal-delay-1"
              style={{ margin: "28px 0" }}
            />
            <p className="section-body reveal reveal-delay-2">
              LEA Models is an international model development and talent
              management agency dedicated to discovering, developing, and
              preparing aspiring models for professional opportunities across
              the globe.
            </p>
            <p
              className="section-body reveal reveal-delay-2"
              style={{ marginTop: 20 }}
            >
              Founded by Leila El Azar, LEA Models combines world-class
              training, confidence building, industry preparation and
              comprehensive career development into one transformative
              programme.
            </p>
            <div
              style={{ display: "flex", gap: 16, marginTop: 40 }}
              className="reveal reveal-delay-3"
            >
              <button
                className="btn-primary"
                onClick={() =>
                  document
                    .getElementById("apply")
                    .scrollIntoView({ behavior: "smooth" })
                }
              >
                Apply Now
              </button>
            </div>
          </div>

          {/* Visual panel */}
          <div className="reveal reveal-delay-2">
            <div style={{ position: "relative" }}>
              <div
                style={{
                  width: "100%",
                  paddingBottom: "130%",
                  background: `linear-gradient(145deg, #1a1612 0%, #0d0b08 100%)`,
                  border: "1px solid rgba(212,175,55,.15)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  className="serif"
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 16,
                  }}
                >
                  <div
                    style={{
                      fontSize: "4rem",
                      color: "rgba(212,175,55,.15)",
                      letterSpacing: ".4em",
                    }}
                  >
                    LEA
                  </div>
                  <div
                    style={{
                      width: 40,
                      height: 1,
                      background: `rgba(212,175,55,.3)`,
                    }}
                  />
                  <div
                    style={{
                      fontSize: ".7rem",
                      letterSpacing: ".3em",
                      textTransform: "uppercase",
                      color: "rgba(212,175,55,.4)",
                    }}
                  >
                    Est. 2024
                  </div>
                </div>
                {/* Grid lines decorative */}
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      left: `${20 + i * 20}%`,
                      top: 0,
                      bottom: 0,
                      width: "1px",
                      background: "rgba(212,175,55,.04)",
                    }}
                  />
                ))}
              </div>
              {/* Offset border accent */}
              <div
                style={{
                  position: "absolute",
                  top: 16,
                  left: 16,
                  right: -16,
                  bottom: -16,
                  border: "1px solid rgba(212,175,55,.12)",
                  zIndex: -1,
                }}
              />
            </div>
          </div>
        </div>

        {/* Values */}
        <div
          style={{
            marginTop: 100,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
            gap: 1,
            background: "rgba(212,175,55,.1)",
          }}
        >
          {[
            "Excellence",
            "Confidence",
            "Professionalism",
            "Discipline",
            "Growth",
            "Opportunity",
          ].map((v, i) => (
            <div
              key={v}
              className={`reveal reveal-delay-${(i % 4) + 1}`}
              style={{
                background: C.black,
                padding: "36px 24px",
                textAlign: "center",
                borderBottom: "2px solid transparent",
                transition: "border-color .3s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.gold)}
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "transparent")
              }
            >
              <div
                style={{ fontSize: "1.6rem", color: C.gold, marginBottom: 12 }}
              >
                {["✦", "◇", "❋", "◈", "✿", "⬡"][i]}
              </div>
              <div
                className="serif"
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 300,
                  letterSpacing: ".08em",
                  color: C.ivory,
                }}
              >
                {v}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Founder ───────────────────────────────────────────────────────────────
function Founder() {
  useReveal();
  return (
    <section
      style={{
        background: "#0d0d0d",
        padding: "120px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Watermark */}
      <div
        className="serif"
        style={{
          position: "absolute",
          right: "-5%",
          top: "50%",
          transform: "translateY(-50%)",
          fontSize: "clamp(6rem,15vw,18rem)",
          fontWeight: 300,
          fontStyle: "italic",
          color: "rgba(212,175,55,.03)",
          userSelect: "none",
        }}
      >
        Founder
      </div>

      <div className="section-wrap">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 80,
            alignItems: "center",
          }}
        >
          <div className="reveal">
            <div
              style={{
                width: "100%",
                paddingBottom: "120%",
                background: `linear-gradient(160deg, #1e1a14 0%, #0e0c09 100%)`,
                border: "1px solid rgba(212,175,55,.15)",
                position: "relative",
              }}
            >
              <div
                className="serif"
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <div
                  style={{ fontSize: "5rem", color: "rgba(212,175,55,.12)" }}
                >
                  LE
                </div>
                <div
                  style={{
                    width: 30,
                    height: 1,
                    background: "rgba(212,175,55,.25)",
                  }}
                />
                <div
                  style={{
                    fontSize: ".65rem",
                    letterSpacing: ".3em",
                    color: "rgba(212,175,55,.3)",
                    textTransform: "uppercase",
                  }}
                >
                  Leila El Azar
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className="section-eyebrow reveal">Founder &amp; Director</p>
            <h2 className="section-title reveal reveal-delay-1">
              <em>Leila</em> El Azar
            </h2>
            <div
              className="gold-divider reveal reveal-delay-1"
              style={{ margin: "24px 0", marginLeft: 0 }}
            />
            <p className="section-body reveal reveal-delay-2">
              Leila El Azar is the visionary founder behind LEA Models — an
              international talent development agency built on the belief that
              every extraordinary model begins with preparation, confidence, and
              the right guidance.
            </p>
            <p
              className="section-body reveal reveal-delay-2"
              style={{ marginTop: 16 }}
            >
              With a passion for fashion, beauty, and empowering women
              worldwide, Leila created LEA Models as a bridge between raw talent
              and professional opportunity — combining world-class mentorship
              with a comprehensive development programme that transforms
              aspiring models into industry-ready professionals.
            </p>
            <p
              className="section-body reveal reveal-delay-3"
              style={{ marginTop: 16 }}
            >
              Her mission is clear: discover exceptional talent, develop it with
              excellence, and connect it to the global fashion and commercial
              industry.
            </p>
            <a
              href="https://instagram.com/Leilaelazar"
              target="_blank"
              className="gold-link reveal reveal-delay-3"
              style={{
                display: "inline-block",
                marginTop: 28,
                fontSize: ".8rem",
                letterSpacing: ".12em",
              }}
            >
              @Leilaelazar ↗
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Why Choose ────────────────────────────────────────────────────────────
function WhyChoose() {
  useReveal();
  const items = [
    {
      icon: "◎",
      title: "International Programme",
      body: "Our curriculum is designed with global industry standards, preparing you for international markets from day one.",
    },
    {
      icon: "◈",
      title: "100% Online Training",
      body: "Access world-class model development from anywhere in the world. Fully flexible, fully professional.",
    },
    {
      icon: "✦",
      title: "Expert Mentorship",
      body: "Learn from industry professionals with real experience in fashion, beauty, commercial and editorial modelling.",
    },
    {
      icon: "◇",
      title: "Complete Skill Development",
      body: "From posing and camera presence to personal branding and social media — a truly holistic development journey.",
    },
    {
      icon: "❋",
      title: "Brand Opportunities",
      body: "LEA Models actively connects developed talent with professional brand campaigns, shoots and collaborations.",
    },
    {
      icon: "⬡",
      title: "Open to All Levels",
      body: "No prior experience required. We welcome aspiring models at every stage of their journey.",
    },
  ];
  return (
    <section style={{ background: C.black, padding: "120px 0" }}>
      <div className="section-wrap">
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <p className="section-eyebrow reveal">Why LEA Models</p>
          <h2
            className="section-title reveal reveal-delay-1"
            style={{ margin: "0 auto", textAlign: "center" }}
          >
            The <em>Difference</em> Is Everything
          </h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
            gap: 2,
            background: "rgba(212,175,55,.08)",
          }}
        >
          {items.map((it, i) => (
            <div
              key={it.title}
              className={`card-lift reveal reveal-delay-${(i % 4) + 1}`}
              style={{
                background: "#0f0f0f",
                padding: "44px 36px",
                borderBottom: "2px solid transparent",
                transition: "border-color .3s, background .3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = C.gold;
                e.currentTarget.style.background = "#161410";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "transparent";
                e.currentTarget.style.background = "#0f0f0f";
              }}
            >
              <div
                style={{ fontSize: "1.8rem", color: C.gold, marginBottom: 20 }}
              >
                {it.icon}
              </div>
              <h3
                className="serif"
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 400,
                  color: C.ivory,
                  marginBottom: 14,
                }}
              >
                {it.title}
              </h3>
              <p
                style={{
                  fontSize: ".84rem",
                  lineHeight: 1.85,
                  color: "rgba(248,245,240,.6)",
                }}
              >
                {it.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Program ───────────────────────────────────────────────────────────────
function Program() {
  useReveal();
  const modules = [
    {
      cat: "Foundation",
      items: [
        "Confidence Building",
        "Camera Presence",
        "Posing Techniques",
        "Facial Expressions",
        "Movement Training",
      ],
    },
    {
      cat: "Modelling Disciplines",
      items: [
        "Fashion Modelling",
        "Beauty Modelling",
        "Commercial Modelling",
        "Editorial Modelling",
        "Lifestyle Modelling",
        "Lingerie Modelling",
        "Artistic Photography",
      ],
    },
    {
      cat: "Performance",
      items: [
        "Dance Performance Training",
        "Commercial Performance",
        "Video Performance",
      ],
    },
    {
      cat: "Industry & Career",
      items: [
        "Personal Branding",
        "Social Media Development",
        "Professional Conduct",
        "Industry Standards",
        "Working With Brands",
        "Photoshoot Preparation",
      ],
    },
  ];
  return (
    <section id="program" style={{ background: "#0a0a0a", padding: "120px 0" }}>
      <div className="section-wrap">
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <p className="section-eyebrow reveal">Model Development Programme</p>
          <h2
            className="section-title reveal reveal-delay-1"
            style={{ textAlign: "center" }}
          >
            A Complete <em>Transformation</em>
          </h2>
          <div
            className="gold-divider reveal reveal-delay-2"
            style={{ marginTop: 24 }}
          />
          <p
            className="section-body reveal reveal-delay-2"
            style={{ margin: "0 auto", textAlign: "center", marginTop: 24 }}
          >
            Our comprehensive online programme covers every dimension of
            professional model development — from raw talent to industry-ready
            professional.
          </p>
          <div style={{ marginTop: 20 }} className="reveal reveal-delay-3">
            <span className="tag-pill">100% Online</span>
            <span className="tag-pill">International</span>
            <span className="tag-pill">All Levels Welcome</span>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
            gap: 24,
          }}
        >
          {modules.map((mod, i) => (
            <div
              key={mod.cat}
              className={`reveal reveal-delay-${(i % 4) + 1}`}
              style={{
                border: "1px solid rgba(212,175,55,.15)",
                padding: "36px 28px",
                background: "rgba(212,175,55,.02)",
              }}
            >
              <p
                style={{
                  fontSize: ".65rem",
                  letterSpacing: ".3em",
                  textTransform: "uppercase",
                  color: C.gold,
                  marginBottom: 20,
                }}
              >
                {mod.cat}
              </p>
              <ul style={{ listStyle: "none" }}>
                {mod.items.map((item) => (
                  <li
                    key={item}
                    style={{
                      fontSize: ".84rem",
                      lineHeight: 1,
                      padding: "10px 0",
                      borderBottom: "1px solid rgba(248,245,240,.06)",
                      color: "rgba(248,245,240,.8)",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <span style={{ color: C.gold, fontSize: ".6rem" }}>▸</span>{" "}
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Opportunities ─────────────────────────────────────────────────────────
function Opportunities() {
  useReveal();
  const types = [
    {
      title: "Fashion",
      desc: "Runway, lookbooks, designer collaborations and fashion week opportunities.",
      icon: "👗",
    },
    {
      title: "Beauty",
      desc: "Cosmetic campaigns, skincare, hair and luxury beauty brand work.",
      icon: "✨",
    },
    {
      title: "Editorial",
      desc: "Magazine shoots, creative editorial campaigns and conceptual projects.",
      icon: "📷",
    },
    {
      title: "Commercial",
      desc: "Brand campaigns, advertising, lifestyle and product modelling.",
      icon: "🎬",
    },
    {
      title: "Digital & Social",
      desc: "Influencer collaborations, brand ambassador roles and digital content.",
      icon: "📱",
    },
    {
      title: "Artistic",
      desc: "Fine art photography, dance performance and creative artistic projects.",
      icon: "🎭",
    },
  ];
  return (
    <section style={{ background: C.black, padding: "120px 0" }}>
      <div className="section-wrap">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 80,
            alignItems: "start",
            marginBottom: 72,
          }}
        >
          <div>
            <p className="section-eyebrow reveal">Professional Opportunities</p>
            <h2 className="section-title reveal reveal-delay-1">
              Open Doors to <em>Every</em> Industry
            </h2>
          </div>
          <div>
            <p
              className="section-body reveal reveal-delay-2"
              style={{ marginTop: 48 }}
            >
              LEA Models connects developed talent with professional
              opportunities across the full spectrum of the modelling and
              entertainment industry — locally and internationally.
            </p>
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: 16,
          }}
        >
          {types.map((t, i) => (
            <div
              key={t.title}
              className={`card-lift reveal reveal-delay-${(i % 4) + 1}`}
              style={{
                padding: "36px 28px",
                border: "1px solid rgba(212,175,55,.12)",
                background: "rgba(212,175,55,.02)",
              }}
            >
              <div style={{ fontSize: "1.8rem", marginBottom: 16 }}>
                {t.icon}
              </div>
              <h3
                className="serif"
                style={{ fontSize: "1.2rem", color: C.ivory, marginBottom: 10 }}
              >
                {t.title}
              </h3>
              <p
                style={{
                  fontSize: ".82rem",
                  lineHeight: 1.8,
                  color: "rgba(248,245,240,.6)",
                }}
              >
                {t.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Testimonials ──────────────────────────────────────────────────────────
function Testimonials() {
  useReveal();
  const tms = [
    {
      name: "Sofia M.",
      origin: "Italy",
      quote:
        "LEA Models transformed my confidence completely. Within three months I had my first professional shoot and brand collaboration. Leila's guidance is exceptional.",
      role: "Fashion & Editorial",
    },
    {
      name: "Amara K.",
      origin: "Ghana",
      quote:
        "I had zero experience when I applied. The programme was thorough, professional and truly international. I now work with beauty brands across Europe.",
      role: "Beauty & Commercial",
    },
    {
      name: "Isabella R.",
      origin: "Brazil",
      quote:
        "The personal branding and social media training was a game-changer. LEA Models gave me the tools to build my career from scratch. Worth every moment.",
      role: "Lifestyle & Digital",
    },
  ];
  return (
    <section style={{ background: "#080808", padding: "120px 0" }}>
      <div className="section-wrap">
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <p className="section-eyebrow reveal">Testimonials</p>
          <h2
            className="section-title reveal reveal-delay-1"
            style={{ textAlign: "center" }}
          >
            Stories of <em>Transformation</em>
          </h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
            gap: 24,
          }}
        >
          {tms.map((t, i) => (
            <div
              key={t.name}
              className={`testimonial-card reveal reveal-delay-${i + 1}`}
            >
              <p
                style={{
                  fontSize: ".9rem",
                  lineHeight: 1.9,
                  color: "rgba(248,245,240,.75)",
                  position: "relative",
                  zIndex: 1,
                  marginBottom: 28,
                }}
              >
                {t.quote}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    background: "rgba(212,175,55,.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: ".8rem",
                    color: C.gold,
                  }}
                >
                  {t.name[0]}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: ".82rem",
                      fontWeight: 500,
                      color: C.ivory,
                    }}
                  >
                    {t.name}
                  </div>
                  <div
                    style={{
                      fontSize: ".7rem",
                      color: C.grey,
                      letterSpacing: ".08em",
                    }}
                  >
                    {t.role} · {t.origin}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── FAQ ───────────────────────────────────────────────────────────────────
function FAQ() {
  useReveal();
  const [open, setOpen] = useState(null);
  const faqs = [
    {
      q: "Is the programme international?",
      a: "Yes. LEA Models is a fully international agency and accepts applications from candidates worldwide. Our programme is designed to prepare talent for global markets.",
    },
    {
      q: "Is the training online?",
      a: "Yes, our complete model development programme is delivered 100% online, giving you the flexibility to train from anywhere in the world at your own pace.",
    },
    {
      q: "Do I need previous experience?",
      a: "No previous experience is required. LEA Models welcomes complete beginners and develops talent from the very foundation of their career.",
    },
    {
      q: "How are candidates selected?",
      a: "Candidates are selected based on their submitted application, photos, motivation and potential. Our team reviews every application personally and contacts suitable candidates directly.",
    },
    {
      q: "Can beginners apply?",
      a: "Absolutely. Some of our most successful talents began with no experience at all. We believe in potential above all else.",
    },
    {
      q: "What opportunities are available?",
      a: "Graduates of the LEA Models programme have access to fashion, beauty, editorial, commercial, lifestyle, digital and artistic modelling opportunities, as well as brand collaborations and campaigns.",
    },
    {
      q: "How long does the training last?",
      a: "The programme duration is tailored to each individual's development and goals. Our team will guide you through the timeline once your application is reviewed and accepted.",
    },
  ];
  return (
    <section id="faq" style={{ background: C.black, padding: "120px 0" }}>
      <div className="section-wrap">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 80,
            alignItems: "start",
          }}
        >
          <div style={{ position: "sticky", top: 120 }}>
            <p className="section-eyebrow reveal">FAQ</p>
            <h2 className="section-title reveal reveal-delay-1">
              Frequently Asked <em>Questions</em>
            </h2>
            <p
              className="section-body reveal reveal-delay-2"
              style={{ marginTop: 24 }}
            >
              Everything you need to know about LEA Models, the programme and
              the application process.
            </p>
          </div>
          <div className="reveal reveal-delay-1">
            {faqs.map((f, i) => (
              <div key={i} className="acc-item">
                <button
                  className="acc-trigger"
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <span>{f.q}</span>
                  <span
                    style={{
                      color: C.gold,
                      fontSize: "1.2rem",
                      transition: "transform .3s",
                      transform: open === i ? "rotate(45deg)" : "none",
                    }}
                  >
                    +
                  </span>
                </button>
                <div className={`acc-content ${open === i ? "open" : ""}`}>
                  <p>{f.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Application Form ──────────────────────────────────────────────────────
function ApplySection({ onSubmitSuccess }) {
  useReveal();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    fullName: "",
    dob: "",
    age: "",
    nationality: "",
    country: "",
    city: "",
    email: "",
    phone: "",
    instagram: "",
    tiktok: "",
    youtube: "",
    portfolio: "",
    height: "",
    weight: "",
    bust: "",
    waist: "",
    hips: "",
    dressSize: "",
    shoeSize: "",
    hairColor: "",
    eyeColor: "",
    experience: "",
    danceExp: "",
    brands: "",
    runway: "",
    commercial: "",
    interests: [],
    whyModel: "",
    goals: "",
    standOut: "",
    fiveYears: "",
    termsAccepted: false,
    privacyAccepted: false,
    mediaConsent: false,
  });
  const [files, setFiles] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const toggleInterest = (i) => {
    const arr = form.interests.includes(i)
      ? form.interests.filter((x) => x !== i)
      : [...form.interests, i];
    set("interests", arr);
  };
  const setFile = (k, f) => setFiles((prev) => ({ ...prev, [k]: f }));

  const handleSubmit = async () => {
    if (!form.termsAccepted || !form.privacyAccepted) {
      alert("Please accept the Terms and Privacy Policy to continue.");
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 2000));
    setSubmitting(false);
    setSubmitted(true);
    onSubmitSuccess && onSubmitSuccess();
  };

  const STEPS = [
    "Personal Info",
    "Social Media",
    "Physical Profile",
    "Experience",
    "Interests",
    "Media",
    "Motivation",
    "Consent",
  ];
  const totalSteps = 8;
  const progress = (step / totalSteps) * 100;

  if (submitted)
    return (
      <section
        id="apply"
        style={{
          background: "#080808",
          padding: "120px 0",
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="section-wrap" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", color: C.gold, marginBottom: 24 }}>
            ✦
          </div>
          <h2
            className="serif"
            style={{
              fontSize: "clamp(2rem,4vw,3rem)",
              fontWeight: 300,
              color: C.ivory,
              marginBottom: 20,
            }}
          >
            Application{" "}
            <em style={{ fontStyle: "italic", color: C.gold }}>Submitted</em>
          </h2>
          <div className="gold-divider" />
          <p
            style={{
              marginTop: 24,
              fontSize: ".9rem",
              color: "rgba(248,245,240,.65)",
              maxWidth: 560,
              margin: "24px auto 0",
              lineHeight: 1.9,
            }}
          >
            Thank you for your application. Our team will review your profile
            and contact you if selected. We wish you the very best.
          </p>
          <div style={{ marginTop: 8 }}>
            <p
              style={{
                fontSize: ".75rem",
                letterSpacing: ".12em",
                color: C.grey,
              }}
            >
              — LEA Models
            </p>
          </div>
        </div>
      </section>
    );

  return (
    <section id="apply" style={{ background: "#080808", padding: "120px 0" }}>
      <div className="section-wrap">
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <p className="section-eyebrow reveal">Join LEA Models</p>
          <h2
            className="section-title reveal reveal-delay-1"
            style={{ textAlign: "center" }}
          >
            Begin Your <em>Application</em>
          </h2>
          <p
            className="section-body reveal reveal-delay-2"
            style={{ margin: "20px auto 0", textAlign: "center" }}
          >
            Complete all sections carefully. Our team reviews every application
            personally.
          </p>
        </div>

        {/* Progress */}
        <div style={{ marginBottom: 48 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <span
              style={{
                fontSize: ".7rem",
                letterSpacing: ".15em",
                textTransform: "uppercase",
                color: C.grey,
              }}
            >
              Step {step} of {totalSteps} — {STEPS[step - 1]}
            </span>
            <span style={{ fontSize: ".7rem", color: C.gold }}>
              {Math.round(progress)}%
            </span>
          </div>
          <div
            style={{
              height: 2,
              background: "rgba(248,245,240,.08)",
              borderRadius: 2,
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: C.gold,
                transition: "width .4s ease",
                borderRadius: 2,
              }}
            />
          </div>
          <div
            style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap" }}
          >
            {STEPS.map((s, i) => (
              <div
                key={s}
                onClick={() => i + 1 < step && setStep(i + 1)}
                style={{
                  padding: "5px 12px",
                  fontSize: ".64rem",
                  letterSpacing: ".12em",
                  textTransform: "uppercase",
                  border: `1px solid ${
                    step === i + 1 ? C.gold : "rgba(248,245,240,.12)"
                  }`,
                  color:
                    step === i + 1
                      ? C.gold
                      : step > i + 1
                      ? "rgba(212,175,55,.5)"
                      : "rgba(248,245,240,.3)",
                  cursor: i + 1 < step ? "pointer" : "default",
                  background:
                    step === i + 1 ? "rgba(212,175,55,.06)" : "transparent",
                }}
              >
                {i + 1 < step ? "✓ " : ""}
                {s}
              </div>
            ))}
          </div>
        </div>

        <div style={{ maxWidth: 740, margin: "0 auto" }}>
          {/* Step 1 — Personal Info */}
          {step === 1 && (
            <div>
              <SectionHeader number="01" title="Personal Information" />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 20,
                }}
              >
                <div className="form-group" style={{ gridColumn: "1/-1" }}>
                  <label className="lea-label">Full Name *</label>
                  <input
                    className="lea-input"
                    placeholder="Your full legal name"
                    value={form.fullName}
                    onChange={(e) => set("fullName", e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="lea-label">Date of Birth *</label>
                  <input
                    className="lea-input"
                    type="date"
                    value={form.dob}
                    onChange={(e) => set("dob", e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="lea-label">Age *</label>
                  <input
                    className="lea-input"
                    type="number"
                    placeholder="Your age"
                    value={form.age}
                    onChange={(e) => set("age", e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="lea-label">Nationality *</label>
                  <input
                    className="lea-input"
                    placeholder="Your nationality"
                    value={form.nationality}
                    onChange={(e) => set("nationality", e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="lea-label">Country *</label>
                  <input
                    className="lea-input"
                    placeholder="Country of residence"
                    value={form.country}
                    onChange={(e) => set("country", e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="lea-label">City *</label>
                  <input
                    className="lea-input"
                    placeholder="City"
                    value={form.city}
                    onChange={(e) => set("city", e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="lea-label">Email Address *</label>
                  <input
                    className="lea-input"
                    type="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="lea-label">Phone Number *</label>
                  <input
                    className="lea-input"
                    placeholder="+1 234 567 8900"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2 — Social Media */}
          {step === 2 && (
            <div>
              <SectionHeader number="02" title="Social Media" />
              {[
                {
                  label: "Instagram",
                  key: "instagram",
                  placeholder: "@yourhandle",
                },
                { label: "TikTok", key: "tiktok", placeholder: "@yourhandle" },
                {
                  label: "YouTube",
                  key: "youtube",
                  placeholder: "youtube.com/yourchannel",
                },
                {
                  label: "Portfolio Website",
                  key: "portfolio",
                  placeholder: "yourwebsite.com",
                },
              ].map((f) => (
                <div className="form-group" key={f.key}>
                  <label className="lea-label">{f.label}</label>
                  <input
                    className="lea-input"
                    placeholder={f.placeholder}
                    value={form[f.key]}
                    onChange={(e) => set(f.key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Step 3 — Physical Profile */}
          {step === 3 && (
            <div>
              <SectionHeader number="03" title="Physical Profile" />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 20,
                }}
              >
                {[
                  { label: "Height (cm)", key: "height", ph: "170" },
                  { label: "Weight (kg)", key: "weight", ph: "58" },
                  { label: "Bust (cm)", key: "bust", ph: "86" },
                  { label: "Waist (cm)", key: "waist", ph: "62" },
                  { label: "Hips (cm)", key: "hips", ph: "90" },
                  { label: "Dress Size", key: "dressSize", ph: "S / 36 / 6" },
                  {
                    label: "Shoe Size",
                    key: "shoeSize",
                    ph: "38 / UK 5 / US 7.5",
                  },
                  {
                    label: "Hair Color",
                    key: "hairColor",
                    ph: "e.g. Dark Brown",
                  },
                  { label: "Eye Color", key: "eyeColor", ph: "e.g. Hazel" },
                ].map((f) => (
                  <div className="form-group" key={f.key}>
                    <label className="lea-label">{f.label}</label>
                    <input
                      className="lea-input"
                      placeholder={f.ph}
                      value={form[f.key]}
                      onChange={(e) => set(f.key, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4 — Experience */}
          {step === 4 && (
            <div>
              <SectionHeader number="04" title="Experience" />
              {[
                {
                  label: "Modelling Experience",
                  key: "experience",
                  ph: "Describe any modelling experience you have, or enter 'None'",
                },
                {
                  label: "Dance Experience",
                  key: "danceExp",
                  ph: "Any dance training or experience, or enter 'None'",
                },
                {
                  label: "Previous Brand Collaborations",
                  key: "brands",
                  ph: "Any brand work or collaborations, or enter 'None'",
                },
                {
                  label: "Runway Experience",
                  key: "runway",
                  ph: "Runway shows or catwalk experience, or enter 'None'",
                },
                {
                  label: "Commercial Experience",
                  key: "commercial",
                  ph: "Any commercial, advertising or TV work, or enter 'None'",
                },
              ].map((f) => (
                <div className="form-group" key={f.key}>
                  <label className="lea-label">{f.label}</label>
                  <textarea
                    className="lea-textarea"
                    placeholder={f.ph}
                    value={form[f.key]}
                    onChange={(e) => set(f.key, e.target.value)}
                    style={{ minHeight: 90 }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Step 5 — Interests */}
          {step === 5 && (
            <div>
              <SectionHeader number="05" title="Interests & Modelling Types" />
              <p
                style={{
                  fontSize: ".82rem",
                  color: "rgba(248,245,240,.55)",
                  marginBottom: 28,
                  lineHeight: 1.7,
                }}
              >
                Select all areas you are interested in. This helps us tailor
                your development programme.
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                {[
                  "Fashion",
                  "Beauty",
                  "Editorial",
                  "Lifestyle",
                  "Commercial",
                  "Fitness",
                  "Dance",
                  "Lingerie",
                  "Nude Art",
                  "Music Videos",
                  "Brand Campaigns",
                ].map((interest) => (
                  <label
                    key={interest}
                    className="check-label"
                    style={{
                      padding: "14px 16px",
                      border: `1px solid ${
                        form.interests.includes(interest)
                          ? C.gold
                          : "rgba(248,245,240,.1)"
                      }`,
                      transition: "border-color .2s",
                      background: form.interests.includes(interest)
                        ? "rgba(212,175,55,.05)"
                        : "transparent",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={form.interests.includes(interest)}
                      onChange={() => toggleInterest(interest)}
                    />
                    <span className="check-box" />
                    {interest}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 6 — Media */}
          {step === 6 && (
            <div>
              <SectionHeader number="06" title="Media Submission" />
              <p
                style={{
                  fontSize: ".82rem",
                  color: "rgba(248,245,240,.55)",
                  marginBottom: 36,
                  lineHeight: 1.7,
                }}
              >
                Please follow the guidelines carefully. All photos must be
                recent, unfiltered and shot in good natural light.
              </p>
              {[
                {
                  key: "face",
                  label: "Step 1 — Natural Face Photo",
                  desc: "Front-facing portrait, neutral expression, no filters, natural lighting. Hair back is preferred.",
                  icon: "👤",
                  required: true,
                },
                {
                  key: "bodyFront",
                  label: "Step 2 — Full Body Front Photo",
                  desc: "Standing naturally. Full body visible. Wearing only panties without bra, suitable for professional evaluation. No filter.",
                  icon: "⬜",
                  required: true,
                },
                {
                  key: "bodySide",
                  label: "Step 3 — Full Body Side Profile",
                  desc: "Full body side profile, standing straight. Natural lighting, no filter.",
                  icon: "◧",
                  required: true,
                },
                {
                  key: "bodyBack",
                  label: "Step 4 — Full Body Back View",
                  desc: "Full body back view, standing straight. Natural lighting.",
                  icon: "◨",
                  required: true,
                },
                {
                  key: "headSide",
                  label: "Step 5 — Head Side Profile",
                  desc: "Clear side profile of the face. Hair back preferred. Natural lighting.",
                  icon: "◑",
                  required: true,
                },
                {
                  key: "portfolio",
                  label: "Step 6 — Portfolio Photos (Optional)",
                  desc: "Any professional or creative work: editorial, beauty, commercial, fashion, lifestyle, dance, artistic. Maximum 6 photos.",
                  icon: "🖼",
                  required: false,
                },
                {
                  key: "video",
                  label: "Step 7 — Walking Video",
                  desc: "10–20 second natural walk towards the camera and back. Natural setting, no filters. MP4 preferred.",
                  icon: "🎬",
                  required: true,
                },
              ].map((f) => (
                <UploadCard
                  key={f.key}
                  {...f}
                  files={files}
                  setFile={setFile}
                />
              ))}
            </div>
          )}

          {/* Step 7 — Motivation */}
          {step === 7 && (
            <div>
              <SectionHeader number="07" title="Motivation" />
              <p
                style={{
                  fontSize: ".82rem",
                  color: "rgba(248,245,240,.55)",
                  marginBottom: 28,
                  lineHeight: 1.7,
                }}
              >
                Please answer all questions thoughtfully. This is your
                opportunity to show our team who you are.
              </p>
              {[
                {
                  label: "Why do you want to become a model?",
                  key: "whyModel",
                },
                { label: "What are your modelling goals?", key: "goals" },
                {
                  label: "What makes you stand out from other applicants?",
                  key: "standOut",
                },
                {
                  label: "Where do you see yourself in 5 years?",
                  key: "fiveYears",
                },
              ].map((f) => (
                <div className="form-group" key={f.key}>
                  <label className="lea-label">{f.label}</label>
                  <textarea
                    className="lea-textarea"
                    placeholder="Write your answer here..."
                    value={form[f.key]}
                    onChange={(e) => set(f.key, e.target.value)}
                    style={{ minHeight: 110 }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Step 8 — Consent */}
          {step === 8 && (
            <div>
              <SectionHeader number="08" title="Consent & Declaration" />
              <p
                style={{
                  fontSize: ".82rem",
                  color: "rgba(248,245,240,.55)",
                  marginBottom: 32,
                  lineHeight: 1.7,
                }}
              >
                Please read and confirm the following before submitting your
                application to LEA Models.
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                  marginBottom: 40,
                }}
              >
                {[
                  {
                    key: "termsAccepted",
                    text: "I have read and agree to the Terms & Conditions of LEA Models.",
                  },
                  {
                    key: "privacyAccepted",
                    text: "I have read and agree to the Privacy Policy and understand how my data is processed.",
                  },
                  {
                    key: "mediaConsent",
                    text: "I consent to LEA Models using my submitted photos and videos for the purpose of internal application review.",
                  },
                ].map((c) => (
                  <label
                    key={c.key}
                    className="check-label"
                    style={{
                      padding: "16px 18px",
                      border: `1px solid ${
                        form[c.key] ? C.gold : "rgba(248,245,240,.1)"
                      }`,
                      transition: "border-color .2s",
                      alignItems: "flex-start",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={form[c.key]}
                      onChange={(e) => set(c.key, e.target.checked)}
                    />
                    <span className="check-box" style={{ marginTop: 2 }} />
                    <span
                      style={{ flex: 1, fontSize: ".83rem", lineHeight: 1.6 }}
                    >
                      {c.text}
                    </span>
                  </label>
                ))}
              </div>
              <div
                style={{
                  padding: "28px 24px",
                  border: "1px solid rgba(212,175,55,.2)",
                  background: "rgba(212,175,55,.03)",
                  marginBottom: 32,
                }}
              >
                <p
                  style={{
                    fontSize: ".82rem",
                    color: "rgba(248,245,240,.6)",
                    lineHeight: 1.8,
                    textAlign: "center",
                    fontStyle: "italic",
                  }}
                >
                  By submitting this application, I confirm that all information
                  and media provided is accurate, truthful and my own. I
                  understand that LEA Models will review my profile and contact
                  me only if selected.
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 40,
              paddingTop: 32,
              borderTop: "1px solid rgba(248,245,240,.08)",
            }}
          >
            {step > 1 ? (
              <button
                className="btn-ghost"
                onClick={() => setStep((s) => s - 1)}
              >
                ← Previous
              </button>
            ) : (
              <div />
            )}
            {step < totalSteps ? (
              <button
                className="btn-primary"
                onClick={() => {
                  setStep((s) => s + 1);
                  window.scrollTo({
                    top: document.getElementById("apply").offsetTop - 80,
                    behavior: "smooth",
                  });
                }}
              >
                Continue →
              </button>
            ) : (
              <button
                className="btn-primary"
                onClick={handleSubmit}
                disabled={submitting}
                style={{
                  opacity: submitting ? 0.6 : 1,
                  cursor: submitting ? "wait" : "pointer",
                }}
              >
                {submitting ? "Submitting..." : "Submit Application"}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHeader({ number, title }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 8,
        }}
      >
        <span
          style={{ fontSize: ".65rem", letterSpacing: ".3em", color: C.gold }}
        >
          SECTION {number}
        </span>
        <div
          style={{ flex: 1, height: "1px", background: "rgba(212,175,55,.2)" }}
        />
      </div>
      <h3
        className="serif"
        style={{ fontSize: "1.8rem", fontWeight: 300, color: C.ivory }}
      >
        {title}
      </h3>
    </div>
  );
}

function UploadCard({
  key: _k,
  label,
  desc,
  icon,
  required,
  fileKey,
  files,
  setFile,
}) {
  const [preview, setPreview] = useState(null);
  const handleChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(label, f);
    if (f.type.startsWith("image/")) {
      const r = new FileReader();
      r.onload = (ev) => setPreview(ev.target.result);
      r.readAsDataURL(f);
    } else {
      setPreview("video");
    }
  };
  return (
    <div style={{ marginBottom: 32 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 6,
        }}
      >
        <span
          style={{
            fontSize: ".65rem",
            letterSpacing: ".25em",
            textTransform: "uppercase",
            color: C.gold,
          }}
        >
          {label}
        </span>
        {required && (
          <span
            style={{
              fontSize: ".6rem",
              color: "rgba(212,175,55,.5)",
              letterSpacing: ".1em",
            }}
          >
            REQUIRED
          </span>
        )}
      </div>
      <p
        style={{
          fontSize: ".8rem",
          color: "rgba(248,245,240,.5)",
          marginBottom: 16,
          lineHeight: 1.7,
        }}
      >
        {desc}
      </p>
      <label style={{ cursor: "pointer" }}>
        <input
          type="file"
          accept={label.includes("Video") ? "video/*" : "image/*"}
          onChange={handleChange}
          style={{ display: "none" }}
          multiple={label.includes("Portfolio")}
        />
        <div className="upload-card">
          {preview ? (
            preview === "video" ? (
              <div style={{ color: C.gold, fontSize: "2rem" }}>
                🎬
                <br />
                <span
                  style={{
                    fontSize: ".75rem",
                    color: "rgba(248,245,240,.6)",
                    marginTop: 8,
                    display: "block",
                  }}
                >
                  Video selected ✓
                </span>
              </div>
            ) : (
              <img
                src={preview}
                alt="preview"
                style={{
                  maxHeight: 180,
                  maxWidth: "100%",
                  objectFit: "contain",
                }}
              />
            )
          ) : (
            <>
              <div
                style={{
                  fontSize: "2.4rem",
                  marginBottom: 14,
                  color: "rgba(212,175,55,.4)",
                }}
              >
                {icon}
              </div>
              <p
                style={{
                  fontSize: ".75rem",
                  letterSpacing: ".14em",
                  textTransform: "uppercase",
                  color: "rgba(212,175,55,.7)",
                  marginBottom: 6,
                }}
              >
                Click to Upload
              </p>
              <p style={{ fontSize: ".72rem", color: "rgba(248,245,240,.3)" }}>
                {label.includes("Video")
                  ? "MP4, MOV · max 200MB"
                  : "JPG, PNG · max 10MB"}
              </p>
            </>
          )}
        </div>
      </label>
    </div>
  );
}

// ── Contact ───────────────────────────────────────────────────────────────
function Contact() {
  useReveal();
  const [msg, setMsg] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const set = (k, v) => setMsg((m) => ({ ...m, [k]: v }));
  const submit = () => {
    setSent(true);
  };

  return (
    <section id="contact" style={{ background: "#0a0a0a", padding: "120px 0" }}>
      <div className="section-wrap">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 80,
            alignItems: "start",
          }}
        >
          <div>
            <p className="section-eyebrow reveal">Contact</p>
            <h2 className="section-title reveal reveal-delay-1">
              Get in <em>Touch</em>
            </h2>
            <div
              className="gold-divider reveal reveal-delay-1"
              style={{ margin: "24px 0", marginLeft: 0 }}
            />
            <p className="section-body reveal reveal-delay-2">
              Have a question before applying? We'd love to hear from you.
            </p>
            <div className="reveal reveal-delay-3" style={{ marginTop: 40 }}>
              <a
                href="https://instagram.com/Leilaelazar"
                target="_blank"
                className="gold-link"
                style={{
                  display: "block",
                  marginBottom: 16,
                  fontSize: ".85rem",
                }}
              >
                Instagram: @Leilaelazar
              </a>
            </div>
          </div>
          <div className="reveal reveal-delay-2">
            {sent ? (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <div
                  style={{ fontSize: "2rem", color: C.gold, marginBottom: 16 }}
                >
                  ✦
                </div>
                <p
                  className="serif"
                  style={{ fontSize: "1.4rem", color: C.ivory }}
                >
                  Message <em>Sent</em>
                </p>
                <p
                  style={{
                    fontSize: ".82rem",
                    color: "rgba(248,245,240,.55)",
                    marginTop: 12,
                  }}
                >
                  We'll be in touch shortly.
                </p>
              </div>
            ) : (
              <>
                {[
                  { label: "Name", key: "name", ph: "Your Name", type: "text" },
                  {
                    label: "Email",
                    key: "email",
                    ph: "your@email.com",
                    type: "email",
                  },
                  {
                    label: "Subject",
                    key: "subject",
                    ph: "Subject",
                    type: "text",
                  },
                ].map((f) => (
                  <div className="form-group" key={f.key}>
                    <label className="lea-label">{f.label}</label>
                    <input
                      className="lea-input"
                      type={f.type}
                      placeholder={f.ph}
                      value={msg[f.key]}
                      onChange={(e) => set(f.key, e.target.value)}
                    />
                  </div>
                ))}
                <div className="form-group">
                  <label className="lea-label">Message</label>
                  <textarea
                    className="lea-textarea"
                    placeholder="Write your message..."
                    value={msg.message}
                    onChange={(e) => set("message", e.target.value)}
                  />
                </div>
                <button
                  className="btn-primary"
                  onClick={submit}
                  style={{ width: "100%" }}
                >
                  Send Message
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────
function Footer({ onAdmin }) {
  return (
    <footer
      style={{
        background: "#060606",
        borderTop: "1px solid rgba(212,175,55,.1)",
        padding: "64px 0 40px",
      }}
    >
      <div className="section-wrap">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: 48,
            marginBottom: 56,
          }}
        >
          <div>
            <div
              className="serif"
              style={{
                fontSize: "1.8rem",
                fontWeight: 300,
                letterSpacing: ".22em",
                color: C.gold,
                marginBottom: 16,
              }}
            >
              LEA{" "}
              <span style={{ color: C.ivory, fontStyle: "italic" }}>
                Models
              </span>
            </div>
            <p
              style={{
                fontSize: ".82rem",
                lineHeight: 1.8,
                color: "rgba(248,245,240,.45)",
                maxWidth: 280,
              }}
            >
              International Model Development &amp; Talent Management. Discover
              your potential. Become extraordinary.
            </p>
            <a
              href="https://instagram.com/Leilaelazar"
              target="_blank"
              className="gold-link"
              style={{
                display: "inline-block",
                marginTop: 20,
                fontSize: ".78rem",
              }}
            >
              @Leilaelazar
            </a>
          </div>
          <div>
            <p
              style={{
                fontSize: ".65rem",
                letterSpacing: ".25em",
                textTransform: "uppercase",
                color: C.gold,
                marginBottom: 20,
              }}
            >
              Navigation
            </p>
            {["About", "Program", "Apply", "FAQ", "Contact"].map((l) => (
              <div key={l} style={{ marginBottom: 10 }}>
                <a
                  href={`#${l.toLowerCase()}`}
                  className="nav-link"
                  style={{ fontSize: ".8rem" }}
                >
                  {l}
                </a>
              </div>
            ))}
          </div>
          <div>
            <p
              style={{
                fontSize: ".65rem",
                letterSpacing: ".25em",
                textTransform: "uppercase",
                color: C.gold,
                marginBottom: 20,
              }}
            >
              Legal
            </p>
            {["Privacy Policy", "Terms & Conditions", "Cookies Policy"].map(
              (l) => (
                <div key={l} style={{ marginBottom: 10 }}>
                  <a
                    href="#"
                    className="nav-link"
                    style={{ fontSize: ".8rem" }}
                  >
                    {l}
                  </a>
                </div>
              )
            )}
          </div>
          <div>
            <p
              style={{
                fontSize: ".65rem",
                letterSpacing: ".25em",
                textTransform: "uppercase",
                color: C.gold,
                marginBottom: 20,
              }}
            >
              Agency
            </p>
            <p
              style={{
                fontSize: ".8rem",
                color: "rgba(248,245,240,.4)",
                lineHeight: 1.8,
              }}
            >
              Founder
              <br />
              <span style={{ color: "rgba(248,245,240,.65)" }}>
                Leila El Azar
              </span>
            </p>
            <p
              style={{
                fontSize: ".8rem",
                color: "rgba(248,245,240,.4)",
                lineHeight: 1.8,
                marginTop: 12,
              }}
            >
              Training
              <br />
              <span style={{ color: "rgba(248,245,240,.65)" }}>
                100% Online
              </span>
            </p>
            <p
              style={{
                fontSize: ".8rem",
                color: "rgba(248,245,240,.4)",
                lineHeight: 1.8,
                marginTop: 12,
              }}
            >
              Reach
              <br />
              <span style={{ color: "rgba(248,245,240,.65)" }}>
                International
              </span>
            </p>
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid rgba(248,245,240,.07)",
            paddingTop: 32,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <p
            style={{
              fontSize: ".72rem",
              letterSpacing: ".1em",
              color: "rgba(248,245,240,.3)",
            }}
          >
            © 2024 LEA Models. All rights reserved. Founded by Leila El Azar.
          </p>
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <p style={{ fontSize: ".7rem", color: "rgba(248,245,240,.25)" }}>
              GDPR Compliant · Secure Platform
            </p>
            <button
              onClick={onAdmin}
              style={{
                background: "none",
                border: "none",
                color: "rgba(248,245,240,.2)",
                fontSize: ".65rem",
                letterSpacing: ".12em",
                cursor: "pointer",
                textTransform: "uppercase",
              }}
            >
              Admin
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── Admin Login Modal ─────────────────────────────────────────────────────
function AdminLogin({ onSuccess, onClose }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const submit = () => {
    if (email === "admin@leamodels.com" && pass === "LEA2024!") {
      onSuccess();
    } else {
      setErr("Invalid credentials. Please try again.");
    }
  };
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div
            className="serif"
            style={{
              fontSize: "1.6rem",
              fontWeight: 300,
              color: C.gold,
              letterSpacing: ".2em",
            }}
          >
            LEA Models
          </div>
          <p
            style={{
              fontSize: ".7rem",
              letterSpacing: ".2em",
              textTransform: "uppercase",
              color: "rgba(248,245,240,.4)",
              marginTop: 8,
            }}
          >
            Administrator Access
          </p>
        </div>
        <div className="form-group">
          <label className="lea-label">Email</label>
          <input
            className="lea-input"
            type="email"
            placeholder="admin@leamodels.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="lea-label">Password</label>
          <input
            className="lea-input"
            type="password"
            placeholder="••••••••"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
        </div>
        {err && (
          <p style={{ fontSize: ".78rem", color: "#d94f4f", marginBottom: 16 }}>
            {err}
          </p>
        )}
        <button
          className="btn-primary"
          onClick={submit}
          style={{ width: "100%", marginBottom: 16 }}
        >
          Sign In
        </button>
        <p
          style={{
            fontSize: ".7rem",
            textAlign: "center",
            color: "rgba(248,245,240,.25)",
            letterSpacing: ".08em",
          }}
        >
          Demo: admin@leamodels.com / LEA2024!
        </p>
      </div>
    </div>
  );
}

// ── Admin Dashboard ───────────────────────────────────────────────────────
const MOCK_APPS = [
  {
    id: 1,
    name: "Sofia Martinez",
    age: 22,
    country: "Italy",
    email: "sofia@example.com",
    status: "Approved",
    date: "2024-11-12",
    interests: ["Fashion", "Editorial"],
    notes: "Exceptional natural elegance.",
    phone: "+39 347 000 001",
  },
  {
    id: 2,
    name: "Amara Kofi",
    age: 24,
    country: "Ghana",
    email: "amara@example.com",
    status: "Contacted",
    date: "2024-11-14",
    interests: ["Beauty", "Commercial"],
    notes: "Great energy on camera.",
    phone: "+233 24 000 002",
  },
  {
    id: 3,
    name: "Isabella Rodrigues",
    age: 21,
    country: "Brazil",
    email: "isabella@example.com",
    status: "Pending",
    date: "2024-11-15",
    interests: ["Lifestyle", "Dance"],
    notes: "",
    phone: "+55 11 90000003",
  },
  {
    id: 4,
    name: "Chloe Dubois",
    age: 23,
    country: "France",
    email: "chloe@example.com",
    status: "Pending",
    date: "2024-11-16",
    interests: ["Fashion", "Lingerie"],
    notes: "",
    phone: "+33 6 00 00 00 04",
  },
  {
    id: 5,
    name: "Yuki Tanaka",
    age: 25,
    country: "Japan",
    email: "yuki@example.com",
    status: "Rejected",
    date: "2024-11-10",
    interests: ["Commercial", "Brand Campaigns"],
    notes: "Not a match this cycle.",
    phone: "+81 90 0000 0005",
  },
];

const STATUS_COLORS = {
  Pending: "#D4AF37",
  Approved: "#4CAF50",
  Rejected: "#d94f4f",
  Contacted: "#64B5F6",
};

function AdminDashboard({ onLogout }) {
  const [apps, setApps] = useState(MOCK_APPS);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [noteInput, setNoteInput] = useState("");
  const [view, setView] = useState("applications"); // applications | cms

  const filtered = apps.filter((a) => {
    const matchSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || a.status === filter;
    return matchSearch && matchFilter;
  });

  const setStatus = (id, status) =>
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  const saveNote = (id) => {
    setApps((prev) =>
      prev.map((a) => (a.id === id ? { ...a, notes: noteInput } : a))
    );
  };
  const deleteApp = (id) => {
    setApps((prev) => prev.filter((a) => a.id !== id));
    setSelected(null);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: C.ivory,
        fontFamily: "'Jost', sans-serif",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          width: 240,
          background: "#0e0e0e",
          borderRight: "1px solid rgba(212,175,55,.12)",
          display: "flex",
          flexDirection: "column",
          zIndex: 100,
        }}
      >
        <div style={{ padding: "32px 24px 24px" }}>
          <div
            className="serif"
            style={{
              fontSize: "1.2rem",
              color: C.gold,
              letterSpacing: ".22em",
            }}
          >
            LEA Models
          </div>
          <p
            style={{
              fontSize: ".62rem",
              letterSpacing: ".2em",
              color: "rgba(248,245,240,.35)",
              marginTop: 4,
            }}
          >
            Admin Dashboard
          </p>
        </div>
        <nav style={{ flex: 1, padding: "0 16px" }}>
          {[
            { icon: "📋", label: "Applications", key: "applications" },
            { icon: "🎨", label: "Content CMS", key: "cms" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setView(item.key)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 16px",
                background:
                  view === item.key ? "rgba(212,175,55,.08)" : "transparent",
                border: "none",
                borderLeft:
                  view === item.key
                    ? `2px solid ${C.gold}`
                    : "2px solid transparent",
                color: view === item.key ? C.gold : "rgba(248,245,240,.55)",
                fontSize: ".8rem",
                letterSpacing: ".08em",
                cursor: "pointer",
                marginBottom: 4,
                textAlign: "left",
              }}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
        <div
          style={{
            padding: "24px 20px",
            borderTop: "1px solid rgba(248,245,240,.07)",
          }}
        >
          <div
            style={{
              fontSize: ".72rem",
              color: "rgba(248,245,240,.4)",
              marginBottom: 8,
            }}
          >
            Logged in as
          </div>
          <div style={{ fontSize: ".8rem", color: C.ivory, marginBottom: 12 }}>
            admin@leamodels.com
          </div>
          <button
            onClick={onLogout}
            style={{
              width: "100%",
              padding: "8px 0",
              background: "none",
              border: "1px solid rgba(248,245,240,.15)",
              color: "rgba(248,245,240,.5)",
              fontSize: ".72rem",
              letterSpacing: ".12em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ marginLeft: 240, padding: "40px 40px" }}>
        {view === "applications" && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 36,
              }}
            >
              <div>
                <h1
                  className="serif"
                  style={{ fontSize: "2rem", fontWeight: 300, color: C.ivory }}
                >
                  Applications
                </h1>
                <p
                  style={{
                    fontSize: ".78rem",
                    color: "rgba(248,245,240,.4)",
                    marginTop: 4,
                  }}
                >
                  {apps.length} total applications
                </p>
              </div>
              <button
                className="btn-primary"
                style={{ padding: "10px 20px", fontSize: ".7rem" }}
                onClick={() => {
                  const csv = ["Name,Email,Age,Country,Status,Date"]
                    .concat(
                      apps.map(
                        (a) =>
                          `${a.name},${a.email},${a.age},${a.country},${a.status},${a.date}`
                      )
                    )
                    .join("\n");
                  const b = new Blob([csv], { type: "text/csv" });
                  const u = URL.createObjectURL(b);
                  const a = document.createElement("a");
                  a.href = u;
                  a.download = "lea-applications.csv";
                  a.click();
                }}
              >
                Export CSV
              </button>
            </div>

            {/* Stats */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gap: 16,
                marginBottom: 32,
              }}
            >
              {["Pending", "Approved", "Contacted", "Rejected"].map((s) => (
                <div
                  key={s}
                  style={{
                    background: "#131313",
                    border: "1px solid rgba(212,175,55,.12)",
                    padding: "20px 20px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "1.8rem",
                      fontWeight: 200,
                      color: STATUS_COLORS[s],
                    }}
                  >
                    {apps.filter((a) => a.status === s).length}
                  </div>
                  <div
                    style={{
                      fontSize: ".72rem",
                      letterSpacing: ".12em",
                      textTransform: "uppercase",
                      color: "rgba(248,245,240,.4)",
                      marginTop: 4,
                    }}
                  >
                    {s}
                  </div>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div
              style={{
                display: "flex",
                gap: 12,
                marginBottom: 20,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email..."
                className="lea-input"
                style={{
                  maxWidth: 280,
                  padding: "10px 14px",
                  fontSize: ".82rem",
                }}
              />
              <div style={{ display: "flex", gap: 8 }}>
                {["All", "Pending", "Approved", "Contacted", "Rejected"].map(
                  (f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      style={{
                        padding: "8px 16px",
                        background: filter === f ? C.gold : "transparent",
                        border: `1px solid ${
                          filter === f ? C.gold : "rgba(248,245,240,.15)"
                        }`,
                        color: filter === f ? C.black : "rgba(248,245,240,.5)",
                        fontSize: ".7rem",
                        letterSpacing: ".1em",
                        cursor: "pointer",
                      }}
                    >
                      {f}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Table */}
            <div
              style={{
                border: "1px solid rgba(212,175,55,.1)",
                overflow: "auto",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: 700,
                }}
              >
                <thead>
                  <tr
                    style={{
                      borderBottom: "1px solid rgba(212,175,55,.15)",
                      background: "rgba(212,175,55,.04)",
                    }}
                  >
                    {[
                      "Name",
                      "Email",
                      "Age",
                      "Country",
                      "Status",
                      "Date",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "14px 16px",
                          textAlign: "left",
                          fontSize: ".68rem",
                          letterSpacing: ".2em",
                          textTransform: "uppercase",
                          color: "rgba(212,175,55,.7)",
                          fontWeight: 400,
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((a, i) => (
                    <tr
                      key={a.id}
                      style={{
                        borderBottom: "1px solid rgba(248,245,240,.05)",
                        background:
                          i % 2 === 0 ? "transparent" : "rgba(255,255,255,.01)",
                        cursor: "pointer",
                        transition: "background .2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(212,175,55,.04)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background =
                          i % 2 === 0 ? "transparent" : "rgba(255,255,255,.01)")
                      }
                    >
                      <td
                        style={{
                          padding: "14px 16px",
                          fontSize: ".84rem",
                          color: C.ivory,
                          fontWeight: 400,
                        }}
                        onClick={() => {
                          setSelected(a);
                          setNoteInput(a.notes);
                        }}
                      >
                        {a.name}
                      </td>
                      <td
                        style={{
                          padding: "14px 16px",
                          fontSize: ".78rem",
                          color: "rgba(248,245,240,.55)",
                        }}
                      >
                        {a.email}
                      </td>
                      <td
                        style={{
                          padding: "14px 16px",
                          fontSize: ".78rem",
                          color: "rgba(248,245,240,.55)",
                        }}
                      >
                        {a.age}
                      </td>
                      <td
                        style={{
                          padding: "14px 16px",
                          fontSize: ".78rem",
                          color: "rgba(248,245,240,.55)",
                        }}
                      >
                        {a.country}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <select
                          value={a.status}
                          onChange={(e) => setStatus(a.id, e.target.value)}
                          className="lea-input"
                          style={{
                            padding: "5px 10px",
                            fontSize: ".72rem",
                            color: STATUS_COLORS[a.status],
                            width: 120,
                            border: `1px solid ${STATUS_COLORS[a.status]}40`,
                          }}
                        >
                          {["Pending", "Approved", "Contacted", "Rejected"].map(
                            (s) => (
                              <option key={s}>{s}</option>
                            )
                          )}
                        </select>
                      </td>
                      <td
                        style={{
                          padding: "14px 16px",
                          fontSize: ".75rem",
                          color: "rgba(248,245,240,.4)",
                        }}
                      >
                        {a.date}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <button
                          onClick={() => {
                            setSelected(a);
                            setNoteInput(a.notes);
                          }}
                          style={{
                            background: "none",
                            border: "1px solid rgba(212,175,55,.3)",
                            color: C.gold,
                            padding: "5px 12px",
                            fontSize: ".68rem",
                            letterSpacing: ".1em",
                            cursor: "pointer",
                            marginRight: 6,
                          }}
                        >
                          View
                        </button>
                        <button
                          onClick={() => deleteApp(a.id)}
                          style={{
                            background: "none",
                            border: "1px solid rgba(217,79,79,.3)",
                            color: "#d94f4f",
                            padding: "5px 12px",
                            fontSize: ".68rem",
                            letterSpacing: ".1em",
                            cursor: "pointer",
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    color: "rgba(248,245,240,.3)",
                    fontSize: ".85rem",
                  }}
                >
                  No applications found.
                </div>
              )}
            </div>
          </>
        )}

        {view === "cms" && <CMSPanel />}
      </div>

      {/* Candidate Profile Modal */}
      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#161616",
              border: "1px solid rgba(212,175,55,.2)",
              width: "100%",
              maxWidth: 680,
              maxHeight: "90vh",
              overflow: "auto",
              padding: "40px",
              position: "relative",
            }}
          >
            <button
              onClick={() => setSelected(null)}
              style={{
                position: "absolute",
                top: 20,
                right: 20,
                background: "none",
                border: "none",
                color: "rgba(248,245,240,.5)",
                cursor: "pointer",
                fontSize: "1.2rem",
              }}
            >
              ✕
            </button>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 24,
              }}
            >
              <div>
                <h2
                  className="serif"
                  style={{
                    fontSize: "1.8rem",
                    fontWeight: 300,
                    color: C.ivory,
                  }}
                >
                  {selected.name}
                </h2>
                <p style={{ fontSize: ".75rem", color: C.grey, marginTop: 4 }}>
                  {selected.email} · {selected.phone}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <span
                  style={{
                    padding: "6px 14px",
                    fontSize: ".68rem",
                    letterSpacing: ".12em",
                    textTransform: "uppercase",
                    border: `1px solid ${STATUS_COLORS[selected.status]}`,
                    color: STATUS_COLORS[selected.status],
                  }}
                >
                  {selected.status}
                </span>
                <p
                  style={{
                    fontSize: ".7rem",
                    color: "rgba(248,245,240,.3)",
                    marginTop: 8,
                  }}
                >
                  Submitted {selected.date}
                </p>
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 24,
                marginBottom: 24,
              }}
            >
              {[
                { label: "Age", val: selected.age },
                { label: "Country", val: selected.country },
                {
                  label: "Interests",
                  val: selected.interests?.join(", ") || "—",
                },
              ].map((f) => (
                <div
                  key={f.label}
                  style={{
                    background: "rgba(212,175,55,.04)",
                    padding: "16px 18px",
                    border: "1px solid rgba(212,175,55,.12)",
                  }}
                >
                  <p
                    style={{
                      fontSize: ".62rem",
                      letterSpacing: ".2em",
                      textTransform: "uppercase",
                      color: C.gold,
                      marginBottom: 6,
                    }}
                  >
                    {f.label}
                  </p>
                  <p style={{ fontSize: ".84rem", color: C.ivory }}>{f.val}</p>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 24 }}>
              <p
                style={{
                  fontSize: ".65rem",
                  letterSpacing: ".2em",
                  textTransform: "uppercase",
                  color: C.gold,
                  marginBottom: 10,
                }}
              >
                Internal Notes
              </p>
              <textarea
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                className="lea-textarea"
                placeholder="Add internal notes about this candidate..."
                style={{ minHeight: 90 }}
              />
              <button
                className="btn-primary"
                style={{
                  marginTop: 10,
                  padding: "10px 20px",
                  fontSize: ".7rem",
                }}
                onClick={() => saveNote(selected.id)}
              >
                Save Notes
              </button>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              {["Approved", "Contacted", "Rejected"].map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setStatus(selected.id, s);
                    setSelected((prev) => ({ ...prev, status: s }));
                  }}
                  style={{
                    padding: "10px 16px",
                    fontSize: ".7rem",
                    letterSpacing: ".1em",
                    background:
                      selected.status === s ? STATUS_COLORS[s] : "transparent",
                    border: `1px solid ${STATUS_COLORS[s]}`,
                    color: selected.status === s ? C.black : STATUS_COLORS[s],
                    cursor: "pointer",
                    transition: "all .2s",
                  }}
                >
                  {s}
                </button>
              ))}
              <button
                onClick={() => deleteApp(selected.id)}
                style={{
                  padding: "10px 16px",
                  fontSize: ".7rem",
                  letterSpacing: ".1em",
                  background: "transparent",
                  border: "1px solid rgba(217,79,79,.4)",
                  color: "#d94f4f",
                  cursor: "pointer",
                  marginLeft: "auto",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── CMS Panel ─────────────────────────────────────────────────────────────
function CMSPanel() {
  const [content, setContent] = useState({
    tagline: "Discover Your Potential. Become Extraordinary.",
    subtagline: "International Model Development & Talent Management",
    aboutText:
      "LEA Models discovers, develops and prepares aspiring models for professional opportunities through training, confidence building, industry preparation and career development.",
    founderBio: "Leila El Azar is the visionary founder behind LEA Models...",
    contactEmail: "contact@leamodels.com",
    instagram: "@Leilaelazar",
    faq: [
      {
        q: "Is the programme international?",
        a: "Yes. LEA Models is a fully international agency.",
      },
      { q: "Is the training online?", a: "Yes, 100% online." },
    ],
  });
  const [saved, setSaved] = useState(false);
  const set = (k, v) => setContent((c) => ({ ...c, [k]: v }));
  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 36,
        }}
      >
        <div>
          <h1
            className="serif"
            style={{ fontSize: "2rem", fontWeight: 300, color: C.ivory }}
          >
            Content CMS
          </h1>
          <p
            style={{
              fontSize: ".78rem",
              color: "rgba(248,245,240,.4)",
              marginTop: 4,
            }}
          >
            Edit website content and publish instantly
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={save}
          style={{ padding: "10px 24px", fontSize: ".7rem" }}
        >
          {saved ? "✓ Published" : "Publish Changes"}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {[
          { label: "Hero Tagline", key: "tagline" },
          { label: "Hero Subtagline", key: "subtagline" },
          { label: "Instagram Handle", key: "instagram" },
          { label: "Contact Email", key: "contactEmail" },
        ].map((f) => (
          <div
            key={f.key}
            style={{
              background: "#131313",
              border: "1px solid rgba(212,175,55,.1)",
              padding: "24px",
            }}
          >
            <label className="lea-label" style={{ marginBottom: 10 }}>
              {f.label}
            </label>
            <input
              className="lea-input"
              value={content[f.key]}
              onChange={(e) => set(f.key, e.target.value)}
            />
          </div>
        ))}
        <div
          style={{
            gridColumn: "1/-1",
            background: "#131313",
            border: "1px solid rgba(212,175,55,.1)",
            padding: "24px",
          }}
        >
          <label className="lea-label" style={{ marginBottom: 10 }}>
            About Section Text
          </label>
          <textarea
            className="lea-textarea"
            value={content.aboutText}
            onChange={(e) => set("aboutText", e.target.value)}
          />
        </div>
        <div
          style={{
            gridColumn: "1/-1",
            background: "#131313",
            border: "1px solid rgba(212,175,55,.1)",
            padding: "24px",
          }}
        >
          <label className="lea-label" style={{ marginBottom: 10 }}>
            Founder Biography
          </label>
          <textarea
            className="lea-textarea"
            value={content.founderBio}
            onChange={(e) => set("founderBio", e.target.value)}
            style={{ minHeight: 140 }}
          />
        </div>
        <div style={{ gridColumn: "1/-1" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <p className="lea-label" style={{ marginBottom: 0 }}>
              FAQ Items
            </p>
            <button
              className="btn-ghost"
              style={{ padding: "6px 14px", fontSize: ".7rem" }}
              onClick={() =>
                set("faq", [
                  ...content.faq,
                  { q: "New Question", a: "Answer..." },
                ])
              }
            >
              + Add FAQ
            </button>
          </div>
          {content.faq.map((f, i) => (
            <div
              key={i}
              style={{
                background: "#131313",
                border: "1px solid rgba(212,175,55,.1)",
                padding: "20px",
                marginBottom: 12,
              }}
            >
              <input
                className="lea-input"
                value={f.q}
                onChange={(e) => {
                  const faq = [...content.faq];
                  faq[i] = { ...faq[i], q: e.target.value };
                  set("faq", faq);
                }}
                style={{ marginBottom: 10 }}
              />
              <textarea
                className="lea-textarea"
                value={f.a}
                onChange={(e) => {
                  const faq = [...content.faq];
                  faq[i] = { ...faq[i], a: e.target.value };
                  set("faq", faq);
                }}
                style={{ minHeight: 70 }}
              />
              <button
                onClick={() =>
                  set(
                    "faq",
                    content.faq.filter((_, j) => j !== i)
                  )
                }
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(217,79,79,.6)",
                  fontSize: ".72rem",
                  cursor: "pointer",
                  marginTop: 8,
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {saved && (
        <div
          style={{
            position: "fixed",
            bottom: 32,
            right: 32,
            background: "#1a3a1a",
            border: "1px solid #4CAF50",
            padding: "14px 24px",
            fontSize: ".8rem",
            color: "#4CAF50",
            letterSpacing: ".08em",
          }}
        >
          ✓ Changes published successfully
        </div>
      )}
    </div>
  );
}

// ── CTA Strip ─────────────────────────────────────────────────────────────
function CTAStrip({ onApply }) {
  useReveal();
  return (
    <section
      style={{
        background: `linear-gradient(135deg, #1a1408 0%, #0d0b06 100%)`,
        padding: "100px 0",
        borderTop: "1px solid rgba(212,175,55,.15)",
        borderBottom: "1px solid rgba(212,175,55,.15)",
      }}
    >
      <div className="section-wrap" style={{ textAlign: "center" }}>
        <p className="section-eyebrow reveal">Begin Today</p>
        <h2
          className="section-title reveal reveal-delay-1"
          style={{ textAlign: "center" }}
        >
          Ready to Become <em>Extraordinary?</em>
        </h2>
        <div
          className="gold-divider reveal reveal-delay-2"
          style={{ marginTop: 24 }}
        />
        <p
          className="section-body reveal reveal-delay-2"
          style={{ margin: "24px auto 0", textAlign: "center" }}
        >
          Applications are open worldwide. Submit yours today and take the first
          step towards your modelling career.
        </p>
        <div
          className="reveal reveal-delay-3"
          style={{
            marginTop: 40,
            display: "flex",
            gap: 16,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button className="btn-primary" onClick={onApply}>
            Apply Now — It's Free
          </button>
          <a href="#contact" className="btn-ghost">
            Ask a Question
          </a>
        </div>
      </div>
    </section>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────
export default function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const scrollToApply = () => {
    document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" });
  };

  if (isAdmin) return <AdminDashboard onLogout={() => setIsAdmin(false)} />;

  return (
    <>
      <StyleTag />
      <Navbar onApply={scrollToApply} onAdmin={() => setShowLogin(true)} />
      <Hero onApply={scrollToApply} />
      <About />
      <Founder />
      <WhyChoose />
      <Program />
      <Opportunities />
      <CTAStrip onApply={scrollToApply} />
      <Testimonials />
      <FAQ />
      <ApplySection />
      <Contact />
      <Footer onAdmin={() => setShowLogin(true)} />
      {showLogin && (
        <AdminLogin
          onSuccess={() => {
            setIsAdmin(true);
            setShowLogin(false);
          }}
          onClose={() => setShowLogin(false)}
        />
      )}
    </>
  );
}
