import React from 'react';

const LocationHeader = ({ location, onBack }) => {
  return (
    <div style={styles.card}>
      <div style={{ ...styles.image, backgroundImage: `url(${location.heroImage})` }}>
        <div style={styles.overlay} />
        
        <div style={styles.topBar}>
          <button onClick={onBack} style={styles.backBtn} title="Go back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
        </div>

        <div style={styles.content}>
          <p style={styles.eyebrow}>Let's make wonderful</p>
          <h1 style={styles.title}>
            {location.name} <br />
            <span style={styles.subtitle}>Vacation</span>
          </h1>
          
          <button style={styles.exploreBtn} onClick={onBack}>
            Explore
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    height: '100%',
    width: '100%',
    borderRadius: '30px',
    overflow: 'hidden',
    boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
  },
  image: {
    height: '100%',
    width: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, transparent 40%, rgba(0,0,0,0.6) 100%)',
    zIndex: 1,
  },
  topBar: {
    position: 'relative',
    zIndex: 2,
    padding: '24px',
  },
  backBtn: {
    width: '44px',
    height: '44px',
    borderRadius: '14px',
    background: 'rgba(255,255,255,0.2)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#fff',
  },
  content: {
    position: 'relative',
    zIndex: 2,
    padding: '40px 30px',
  },
  eyebrow: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '1rem',
    color: 'rgba(255,255,255,0.9)',
    margin: '0 0 8px',
    fontWeight: 500,
  },
  title: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '2.8rem',
    fontWeight: 700,
    color: '#fff',
    margin: '0 0 32px',
    lineHeight: 1.1,
  },
  subtitle: {
    fontWeight: 400,
    opacity: 0.9,
  },
  exploreBtn: {
    background: '#13B8A6',
    color: '#fff',
    border: 'none',
    borderRadius: '18px',
    padding: '16px 40px',
    fontFamily: "'Inter', sans-serif",
    fontSize: '1.1rem',
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: '0 10px 25px rgba(19, 184, 166, 0.4)',
    transition: 'transform 0.2s',
  },
};

export default LocationHeader;
