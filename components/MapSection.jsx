import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LOCATIONS = [
  { id: 'shillong',    name: 'Shillong',     emoji: '🏔️', tagline: 'Clouds, Culture & Calm',      top: '38%', left: '62%', color: '#3F5E45' },
  { id: 'cherrapunji', name: 'Cherrapunji',  emoji: '🌧️', tagline: 'Where Rain Meets Wonder',     top: '56%', left: '54%', color: '#4E7C8A' },
  { id: 'mawlynnong',  name: 'Mawlynnong',   emoji: '🌿', tagline: "Asia's Cleanest Village",     top: '66%', left: '70%', color: '#6B8E3F' },
  { id: 'dawki',       name: 'Dawki',        emoji: '💧', tagline: 'Crystal Waters & Serenity',   top: '72%', left: '63%', color: '#2C7A7B' },
];

const MapSection = () => {
  const navigate = useNavigate();
  const [hoveredPin, setHoveredPin] = useState(null);

  const handleLocationClick = (locationId) => {
    // Save current scroll position so homepage can restore it on return
    sessionStorage.setItem('vanroots_scroll_pos', String(window.scrollY));
    sessionStorage.setItem('vanroots_hero_played', 'true');
    navigate(`/booking/${locationId}`);
  };

  return (
    <section style={styles.section} id="react-map">
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <p style={styles.eyebrow}>EXPLORE MEGHALAYA</p>
          <h2 style={styles.title}>4 Destinations.<br />Infinite Stories.</h2>
          <p style={styles.subtitle}>Click a destination to explore stays, guides & experiences.</p>
        </div>

        {/* Map Area */}
        <div style={styles.mapArea}>
          {/* Decorative terrain lines */}
          <svg style={styles.svgBg} viewBox="0 0 900 520" preserveAspectRatio="xMidYMid slice">
            <defs>
              <radialGradient id="mapGlow" cx="50%" cy="50%" r="60%">
                <stop offset="0%" stopColor="#C8D5B9" stopOpacity="0.3"/>
                <stop offset="100%" stopColor="transparent" stopOpacity="0"/>
              </radialGradient>
            </defs>
            {/* Background terrain feel */}
            <ellipse cx="450" cy="260" rx="380" ry="210" fill="url(#mapGlow)"/>
            {/* Terrain contour lines */}
            {[0,1,2,3,4].map(i => (
              <ellipse key={i} cx="450" cy="260"
                rx={120 + i*55} ry={70 + i*32}
                fill="none" stroke="#A8B89A" strokeWidth="0.8" strokeOpacity={0.25 - i*0.03}
                strokeDasharray="6 4"
              />
            ))}
            {/* River lines */}
            <path d="M 280 380 Q 380 340 480 380 Q 560 410 640 370" fill="none" stroke="#4E7C8A" strokeWidth="2" strokeOpacity="0.3"/>
            <path d="M 350 420 Q 430 400 520 420" fill="none" stroke="#4E7C8A" strokeWidth="1.5" strokeOpacity="0.2"/>
          </svg>

          {/* Location Pins */}
          {LOCATIONS.map(loc => {
            const isHovered = hoveredPin === loc.id;
            return (
              <div
                key={loc.id}
                style={{ ...styles.pinWrapper, top: loc.top, left: loc.left }}
                onMouseEnter={() => setHoveredPin(loc.id)}
                onMouseLeave={() => setHoveredPin(null)}
                onClick={() => handleLocationClick(loc.id)}
              >
                {/* Pulse rings */}
                <div style={{
                  ...styles.pulseRing,
                  borderColor: loc.color,
                  transform: isHovered ? 'scale(2.4)' : 'scale(1.8)',
                  opacity: isHovered ? 0.5 : 0.3,
                }}/>
                <div style={{
                  ...styles.pulseRing,
                  borderColor: loc.color,
                  animationDelay: '0.4s',
                  transform: isHovered ? 'scale(3.2)' : 'scale(2.5)',
                  opacity: isHovered ? 0.25 : 0.15,
                }}/>

                {/* Pin dot */}
                <div style={{
                  ...styles.pinDot,
                  background: loc.color,
                  transform: isHovered ? 'scale(1.3)' : 'scale(1)',
                  boxShadow: isHovered
                    ? `0 0 0 4px rgba(255,255,255,0.9), 0 8px 24px ${loc.color}88`
                    : `0 0 0 3px rgba(255,255,255,0.8), 0 4px 12px ${loc.color}55`,
                }}>
                  <span style={{ fontSize: '0.75rem' }}>{loc.emoji}</span>
                </div>

                {/* Tooltip Card */}
                <div style={{
                  ...styles.tooltip,
                  opacity: isHovered ? 1 : 0,
                  transform: isHovered ? 'translateX(-50%) translateY(-8px)' : 'translateX(-50%) translateY(0px)',
                  pointerEvents: isHovered ? 'auto' : 'none',
                }}>
                  <div style={{ ...styles.tooltipDot, background: loc.color }}/>
                  <div>
                    <div style={styles.tooltipName}>{loc.name}</div>
                    <div style={styles.tooltipTag}>{loc.tagline}</div>
                  </div>
                  <div style={{ ...styles.tooltipArrow, background: loc.color }}>→</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Location Cards Row */}
        <div style={styles.cardsRow}>
          {LOCATIONS.map((loc, idx) => (
            <button
              key={loc.id}
              id={`location-card-${loc.id}`}
              onClick={() => handleLocationClick(loc.id)}
              style={{
                ...styles.locationCard,
                borderColor: hoveredPin === loc.id ? loc.color : 'rgba(0,0,0,0.08)',
                background: hoveredPin === loc.id ? `${loc.color}0A` : '#fff',
                transform: hoveredPin === loc.id ? 'translateY(-4px)' : 'translateY(0)',
              }}
              onMouseEnter={() => setHoveredPin(loc.id)}
              onMouseLeave={() => setHoveredPin(null)}
            >
              <span style={{ fontSize: '1.6rem', marginBottom: '8px', display: 'block' }}>{loc.emoji}</span>
              <div style={{ ...styles.cardName, color: loc.color }}>{loc.name}</div>
              <div style={styles.cardTagline}>{loc.tagline}</div>
              <div style={{ ...styles.exploreLink, color: loc.color }}>Explore →</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

const styles = {
  section: {
    minHeight: '100vh',
    backgroundColor: '#D8D6D1',
    background: 'linear-gradient(160deg, #E5E2DB 0%, #D0CEC8 50%, #C8C5BC 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 100,
    padding: '80px 0 60px',
    fontFamily: "'Hind', sans-serif",
  },
  container: {
    width: '100%',
    maxWidth: '1100px',
    padding: '0 32px',
    margin: '0 auto',
    boxSizing: 'border-box',
  },
  header: {
    textAlign: 'center',
    marginBottom: '50px',
  },
  eyebrow: {
    fontFamily: "'Hind', sans-serif",
    fontSize: '0.72rem',
    letterSpacing: '6px',
    color: '#4E7C8A',
    textTransform: 'uppercase',
    marginBottom: '12px',
  },
  title: {
    fontFamily: "'Cinzel', serif",
    fontSize: 'clamp(2rem, 5vw, 3.8rem)',
    color: '#111',
    fontWeight: 400,
    letterSpacing: '2px',
    lineHeight: 1.2,
    marginBottom: '14px',
  },
  subtitle: {
    fontFamily: "'Hind', sans-serif",
    fontSize: '1rem',
    color: '#666',
    fontWeight: 300,
  },
  mapArea: {
    position: 'relative',
    width: '100%',
    height: '420px',
    background: 'rgba(255,255,255,0.12)',
    backdropFilter: 'blur(6px)',
    borderRadius: '24px',
    border: '1px solid rgba(255,255,255,0.3)',
    overflow: 'hidden',
    marginBottom: '40px',
    boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
  },
  svgBg: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
  },
  pinWrapper: {
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    cursor: 'pointer',
    zIndex: 10,
  },
  pulseRing: {
    position: 'absolute',
    top: '50%', left: '50%',
    width: '40px', height: '40px',
    borderRadius: '50%',
    border: '2px solid',
    transform: 'translate(-50%, -50%)',
    transition: 'transform 0.4s ease, opacity 0.4s ease',
    pointerEvents: 'none',
  },
  pinDot: {
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease',
    position: 'relative',
    zIndex: 5,
  },
  tooltip: {
    position: 'absolute',
    bottom: '52px',
    left: '50%',
    background: 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(16px)',
    borderRadius: '16px',
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    boxShadow: '0 12px 40px rgba(0,0,0,0.14)',
    border: '1px solid rgba(255,255,255,0.6)',
    whiteSpace: 'nowrap',
    transition: 'opacity 0.25s ease, transform 0.25s ease',
    zIndex: 20,
  },
  tooltipDot: {
    width: '8px', height: '8px',
    borderRadius: '50%',
    flexShrink: 0,
  },
  tooltipName: {
    fontFamily: "'Cinzel', serif",
    fontSize: '0.88rem',
    fontWeight: 500,
    color: '#111',
    letterSpacing: '0.5px',
  },
  tooltipTag: {
    fontFamily: "'Hind', sans-serif",
    fontSize: '0.72rem',
    color: '#888',
    marginTop: '2px',
  },
  tooltipArrow: {
    width: '26px', height: '26px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '0.8rem',
    fontWeight: 600,
  },
  cardsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
  },
  locationCard: {
    background: '#fff',
    border: '1.5px solid rgba(0,0,0,0.08)',
    borderRadius: '18px',
    padding: '22px 16px 18px',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), border-color 0.3s, background 0.3s, box-shadow 0.3s',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  cardName: {
    fontFamily: "'Cinzel', serif",
    fontSize: '0.95rem',
    fontWeight: 400,
    letterSpacing: '0.5px',
    marginBottom: '5px',
  },
  cardTagline: {
    fontFamily: "'Hind', sans-serif",
    fontSize: '0.75rem',
    color: '#888',
    lineHeight: 1.4,
    marginBottom: '10px',
  },
  exploreLink: {
    fontFamily: "'Hind', sans-serif",
    fontSize: '0.78rem',
    fontWeight: 600,
    letterSpacing: '0.5px',
  },
};

export default MapSection;
