import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight, Building2, Clock, MapPinned, Radio,
  Shield, ShieldCheck, Siren, Users
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { roleLinks } from '../../siteConfig';

/* ─── Venue scenes ────────────────────────────────────────────────────── */
const venues = [
  {
    id: 'hotel',
    image: '/hotel.png',
    eyebrow: 'Hotels & Hospitality',
    eyebrowColor: 'eyebrow--coral',
    isFirst: true,
  },
  {
    id: 'mall',
    image: '/mall.png',
    eyebrow: 'Retail & Shopping Centres',
    eyebrowColor: 'eyebrow--teal',
    headline: 'Zone-based SOS triage',
    lead: 'Guests scan a QR code, choose their emergency type, and confirm details. CrisisSync routes the report to the right zone warden instantly — with context, not just noise.',
    tag: 'SOS Triage',
  },
  {
    id: 'restaurant',
    image: '/restaurant.png',
    eyebrow: 'Restaurants & Dining',
    eyebrowColor: 'eyebrow--amber',
    headline: 'Staff tasking & warden coordination',
    lead: 'Each staff member sees only their zone. Assignments arrive as tasks with priority, type, and guest-reported details. Acknowledgment closes the loop for command.',
    tag: 'Staff Ops',
  },
  {
    id: 'corporate',
    image: '/corporate.png',
    eyebrow: 'Corporate & Office',
    eyebrowColor: 'eyebrow--indigo',
    headline: 'Admin command & broadcast',
    lead: 'Set severity, broadcast instructions to all zones, monitor live warden status, and export a full audit-ready incident report when the event is resolved.',
    tag: 'Admin Command',
  },
];

const capabilities = [
  {
    icon: Radio,
    title: 'Real-time incident command',
    body: 'Zone statuses, SOS feeds, warden acknowledgments, and AI suggestions stream live through Firestore listeners. No polling, no refresh.',
  },
  {
    icon: Users,
    title: 'Role-separated operations',
    body: 'Admins configure and command. Staff coordinate zones. Guests receive zone-specific safety guidance. Each role has its own app, its own surface, its own data boundary.',
  },
  {
    icon: Shield,
    title: 'Validated-anonymous SOS',
    body: 'Guests submit SOS through signed sessions validated by zone QR tokens. Rate-limited, zone-bound, and spam-resistant. No open write paths.',
  },
];

/* ─── Component ──────────────────────────────────────────────────────── */
export function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(null);
  const [transitioning, setTransitioning] = useState(false);
  const sectionRefs = useRef([]);
  const morphRef = useRef(null);

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 900px)');
    if (mobileQuery.matches) {
      setActiveIndex(0);
      setPrevIndex(null);
      setTransitioning(false);
      return undefined;
    }

    const observers = sectionRefs.current.map((el, i) => {
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            if (i !== activeIndex) {
              setPrevIndex(activeIndex);
              setTransitioning(true);
              setActiveIndex(i);
              setTimeout(() => setTransitioning(false), 700);
            }
          }
        },
        { threshold: 0.5 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o && o.disconnect());
  }, [activeIndex]);

  const current = venues[activeIndex];
  const prev = prevIndex !== null ? venues[prevIndex] : null;

  return (
    <>
      {/* ── SCROLLING HERO ───────────────────────────────────────────── */}
      <section className="venue-hero">
        {/* LEFT */}
        <div className="venue-hero__left">
          <div className="venue-content-track">
            {/* FIRST PANEL — fixed content about the app */}
            <div
              ref={(el) => (sectionRefs.current[0] = el)}
              className={`venue-panel ${activeIndex === 0 ? 'is-active' : ''}`}
            >
              <span className="eyebrow eyebrow--coral">
                <Siren size={14} /> Emergency Response Platform
              </span>
              <h1 className="brand-name">CrisisSync</h1>
              <p className="venue-panel__lead">
                A zone-based emergency operating layer for venues — guest SOS triage, staff tasking, admin command, QR access, broadcasts, and post-incident records in one linked response chain.
              </p>

              <div className="venue-panel__actions">
                <a
                  className="btn btn-primary"
                  href="https://crisis-sync-jovf.vercel.app/login"
                  target="_blank"
                  rel="noreferrer"
                >
                  Create Admin Account <ArrowRight size={16} />
                </a>
                <a
                  className="btn btn-outline"
                  href="https://crisis-sync-one.vercel.app/demo"
                  target="_blank"
                  rel="noreferrer"
                >
                  Open Live Demo
                </a>
              </div>

              <div className="hero__metrics" aria-label="Platform highlights">
                <div className="metric-tile">
                  <strong>42s</strong>
                  <span>avg warden ack time</span>
                </div>
                <div className="metric-tile">
                  <strong>8</strong>
                  <span>live hotel zones</span>
                </div>
                <div className="metric-tile">
                  <strong>6</strong>
                  <span>SOS context types</span>
                </div>
              </div>
            </div>

            {/* SUBSEQUENT PANELS — app feature details */}
            {venues.slice(1).map((venue, i) => {
              const idx = i + 1;
              return (
                <div
                  key={venue.id}
                  ref={(el) => (sectionRefs.current[idx] = el)}
                  className={`venue-panel ${idx === activeIndex ? 'is-active' : ''}`}
                >
                  <span className={`eyebrow ${venue.eyebrowColor}`}>
                    <Siren size={14} /> {venue.tag}
                  </span>
                  <h1>{venue.headline}</h1>
                  <p className="venue-panel__lead">{venue.lead}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT — sticky morphing image */}
        <div className="venue-hero__right" ref={morphRef}>
          <div className="morph-stage">
            {/* Dot nav */}
            <div className="morph-dots">
              {venues.map((v, i) => (
                <button
                  key={v.id}
                  className={`morph-dot ${i === activeIndex ? 'is-active' : ''}`}
                  aria-label={v.tag || 'Intro'}
                  onClick={() => {
                    sectionRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                />
              ))}
            </div>

            {/* Tag pill */}
            <div className={`morph-tag morph-tag--${current.id}`}>
              {current.tag || 'CrisisSync'}
            </div>

            {/* Images */}
            {prev && (
              <img
                key={`prev-${prev.id}`}
                src={prev.image}
                alt={prev.tag || 'CrisisSync'}
                className="morph-img morph-img--out"
              />
            )}
            <img
              key={`active-${current.id}`}
              src={current.image}
              alt={current.tag || 'CrisisSync'}
              className={`morph-img morph-img--in ${transitioning ? 'is-entering' : 'is-settled'}`}
            />
          </div>
        </div>
      </section>

      {/* ── FLOATING CTA ─────────────────────────────────────────────── */}
      <a
        className="floating-demo-cta"
        href="https://crisis-sync-one.vercel.app/demo"
        target="_blank"
        rel="noreferrer"
      >
        Open Live Demo <ArrowRight size={15} />
      </a>

      {/* ── ACCESS PATHS ─────────────────────────────────────────────── */}
      <section className="section section--surface">
        <div className="container split">
          <div>
            <span className="eyebrow eyebrow--teal">Connected role surfaces</span>
            <h2>Admin, staff, and guests see different screens, but work the same incident.</h2>
            <p>
              Each role operates in its own application with appropriate data boundaries. The admin configures,
              staff respond, and guests receive guidance — all through separate, purpose-built surfaces.
            </p>
          </div>
          <div className="access-grid">
            <AccessLink icon={Building2} title="Admin command" text="Create venue, print QR cards, broadcast instructions, and control severity." href="https://crisis-sync-jovf.vercel.app/login" />
            <AccessLink icon={ShieldCheck} title="Staff response" text="Open assigned-zone tasks, update status, and acknowledge command messages." href={roleLinks.staff.production} />
            <AccessLink icon={MapPinned} title="Guest QR safety" text="Scan QR, choose emergency type, confirm details, and receive route guidance." href={roleLinks.guest.production} />
          </div>
        </div>
      </section>

      {/* ── CAPABILITIES ─────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Core capabilities</span>
            <h2>Built around the actual incident response chain.</h2>
            <p>Every role has a narrower surface than the one above it. This keeps the system fast under pressure and reduces cognitive load during emergencies.</p>
          </div>
          <div className="card-grid card-grid--three">
            {capabilities.map((card) => {
              const Icon = card.icon;
              return (
                <article className="info-card" key={card.title}>
                  <Icon size={24} />
                  <h3>{card.title}</h3>
                  <p>{card.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SOS FLOW ─────────────────────────────────────────────────── */}
      <section className="section section--warm">
        <div className="container response-flow">
          <div>
            <span className="eyebrow eyebrow--coral">SOS without false alarms</span>
            <h2>Emergency reports collect context before alerting command.</h2>
            <p>Guests choose the crisis type, whether they are in immediate danger, and how many people are affected. CrisisSync turns that into severity, playbook routing, staff notifications, and a clean audit trail.</p>
          </div>
          <div className="flow-stack">
            {[
              'Fire, medical, security, flooding, power, or other',
              'Immediate danger or reporting only',
              'Just me, a few people, or many people',
              'Final confirmation before sending',
            ].map((item, index) => (
              <div className="flow-step" key={item}>
                <strong>0{index + 1}</strong>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="section section--compact">
        <div className="container callout-band">
          <div>
            <Clock size={20} style={{ color: 'var(--accent-indigo)' }} />
            <h2>Test the full system without setup.</h2>
            <p>Demo environments for Admin, Staff, and Guest roles are preloaded with realistic venue data — Grand Orchid Hotel with 5 zones, 7 staff, and configurable incident scenarios.</p>
          </div>
          <a
            className="btn btn-primary"
            href="https://crisis-sync-one.vercel.app/demo"
            target="_blank"
            rel="noreferrer"
          >
            Open Demo Environment <ArrowRight size={16} />
          </a>
        </div>
      </section>

      {/* ── STYLES ───────────────────────────────────────────────────── */}
      <style>{`
        /* ── Layout ───────────────────────────────────────────────────── */
        .venue-hero {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 100vh;
          position: relative;
        }

        /* ── Left scrolling column ────────────────────────────────────── */
        .venue-hero__left {
          padding: 0;
          position: relative;
          z-index: 2;
        }

        .venue-content-track {
          display: flex;
          flex-direction: column;
        }

        .venue-panel {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 92px 72px 92px 56px;
          opacity: 0.3;
          transition: opacity 0.5s ease;
        }

        .venue-panel.is-active {
          opacity: 1;
        }

        /* Brand name — large, bold, no gradient */
        .brand-name {
          font-size: clamp(4rem, 7.5vw, 8rem) !important;
          line-height: 1.0 !important;
          font-weight: 400 !important;
          letter-spacing: -0.01em;
          color: var(--text-primary) !important;
          margin: 16px 0 20px !important;
          font-family: var(--font-brand) !important;
        }

        .venue-panel h1:not(.brand-name) {
          font-size: clamp(2.4rem, 4.2vw, 4.5rem);
          line-height: 1.15;
          margin: 16px 0 20px;
          color: var(--text-primary);
          font-family: var(--font-display);
          font-weight: 400;
        }

        .venue-panel__lead {
          font-size: clamp(1.1rem, 1.5vw, 1.35rem);
          line-height: 1.65;
          color: var(--text-secondary);
          max-width: 620px;
          margin-bottom: 32px;
        }

        .venue-panel__actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 36px;
        }

        /* ── Right sticky column ──────────────────────────────────────── */
        .venue-hero__right {
          position: sticky;
          top: 0;
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 40px 40px 16px;
          overflow: hidden;
        }

        /* ── Morph stage — larger ─────────────────────────────────────── */
        .morph-stage {
          position: relative;
          width: 100%;
          max-width: 760px;
          aspect-ratio: 4/3;
          flex-shrink: 0;
        }

        .morph-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: 16px;
          will-change: opacity, filter, transform;
        }

        .morph-img--out {
          animation: morphOut 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .morph-img--in.is-entering {
          animation: morphIn 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .morph-img--in.is-settled {
          opacity: 1;
          filter: none;
          transform: scale(1);
        }

        @keyframes morphOut {
          from { opacity: 1; filter: blur(0px) saturate(1); transform: scale(1); }
          to   { opacity: 0; filter: blur(12px) saturate(0.2); transform: scale(0.94); }
        }

        @keyframes morphIn {
          from { opacity: 0; filter: blur(16px) saturate(0.1); transform: scale(1.04); }
          to   { opacity: 1; filter: blur(0px) saturate(1); transform: scale(1); }
        }

        /* ── Tag pill — no glow, solid colour ────────────────────────── */
        .morph-tag {
          position: absolute;
          top: 16px;
          left: 16px;
          z-index: 10;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 4px 12px;
          border-radius: 99px;
          transition: background 0.4s;
        }
        .morph-tag--hotel      { background: #ff6b4a; color: #fff; }
        .morph-tag--mall       { background: #2dd4bf; color: #0f1923; }
        .morph-tag--restaurant { background: #f59e0b; color: #0f1923; }
        .morph-tag--corporate  { background: #818cf8; color: #fff; }

        /* ── Dot nav ──────────────────────────────────────────────────── */
        .morph-dots {
          position: absolute;
          right: -28px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          gap: 8px;
          z-index: 20;
        }

        .morph-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(0,0,0,0.1);
          border: none;
          cursor: pointer;
          padding: 0;
          transition: background 0.3s, transform 0.3s;
        }

        .morph-dot.is-active {
          background: var(--text-primary);
          transform: scale(1.4);
        }

        /* ── Floating demo CTA capsule ────────────────────────────────── */
        .floating-demo-cta {
          position: fixed;
          bottom: 28px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 999;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 99px;
          background: #ff6b4a;
          color: #fff;
          font-size: 0.9rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          text-decoration: none;
          white-space: nowrap;
          box-shadow: 0 4px 24px rgba(255, 107, 74, 0.35);
          transition: background 0.2s, transform 0.2s;
        }

        .floating-demo-cta:hover {
          background: #e85a38;
          transform: translateX(-50%) translateY(-2px);
        }

        /* ── Responsive ───────────────────────────────────────────────── */
        @media (max-width: 900px) {
          .venue-hero {
            grid-template-columns: 1fr;
            min-height: auto;
          }

          .venue-hero__right {
            display: none;
          }

          .venue-panel {
            min-height: unset;
            padding: 108px 24px 64px;
            opacity: 1 !important;
          }

          .venue-panel:not(:first-child) {
            display: none;
          }

          .brand-name {
            font-size: clamp(4.2rem, 18vw, 6.5rem) !important;
          }

          .venue-panel__lead {
            font-size: 1.2rem;
            line-height: 1.6;
          }

          .venue-panel__actions .btn {
            min-height: 52px;
            font-size: 1rem;
          }

          .morph-stage {
            max-width: 100%;
          }
        }

        @media (max-width: 560px) {
          .venue-panel {
            padding: 132px 18px 56px;
          }

          .brand-name {
            font-size: clamp(3.7rem, 18vw, 5.4rem) !important;
          }

          .venue-panel__lead {
            font-size: 1.08rem;
          }

          .venue-panel__actions,
          .venue-panel__actions .btn {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}

function AccessLink({ icon: Icon, title, text, href }) {
  return (
    <a className="access-link" href={href} target="_blank" rel="noreferrer">
      <Icon size={20} />
      <span>
        <strong>{title}</strong>
        <small>{text}</small>
      </span>
      <ArrowRight size={16} />
    </a>
  );
}
