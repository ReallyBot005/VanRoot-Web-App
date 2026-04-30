import React from 'react';
import { motion } from 'framer-motion';

const ListingCard = ({ item, active, onClick, activeTab }) => {
  const priceUnit = activeTab === 'stays' ? '/ night' : '/ package';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      whileHover={{ y: -6, boxShadow: '0 20px 50px rgba(0,0,0,0.11)' }}
      onClick={onClick}
      style={{
        ...s.card,
        border: active ? '2px solid #18C2A4' : '2px solid transparent',
        boxShadow: active
          ? '0 16px 44px rgba(24,194,164,0.18)'
          : '0 6px 24px rgba(0,0,0,0.06)',
      }}
    >
      {/* Image */}
      <div style={{ ...s.imgBox, backgroundImage: `url(${item.image})` }}>
        <div style={s.imgGrad} />

        {/* Tags overlay */}
        <div style={s.imgTags}>
          {item.tags?.slice(0, 2).map(t => (
            <span key={t} style={s.imgTag}>{t}</span>
          ))}
        </div>

        {/* Fav button */}
        <button
          style={s.favBtn}
          onClick={e => e.stopPropagation()}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="#FF4D6D" stroke="none">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </button>
      </div>

      {/* Content */}
      <div style={s.content}>
        <h4 style={s.name}>{item.title}</h4>
        {item.name && <p style={{...s.sub, color: '#111', fontWeight: 600, marginBottom: 4}}>{item.name}</p>}
        <p style={s.sub}>{item.description?.slice(0, 75)}…</p>

        <div style={s.metaRow}>
          <div style={s.ratingPill}>
            <span style={{ color: '#F5A623', fontSize: '0.8rem' }}>★</span>
            <span style={s.ratingNum}>{item.rating}</span>
            <span style={s.reviewCount}>({item.reviews})</span>
          </div>
          <div style={s.pricePill}>
            <span style={s.priceVal}>₹{item.price?.toLocaleString()}</span>
            <span style={s.priceUnit}>{priceUnit}</span>
          </div>
        </div>

        {/* Active indicator */}
        {active && (
          <motion.div
            layoutId="activeBar"
            style={s.activeBar}
            transition={{ type: 'spring', damping: 20 }}
          />
        )}
      </div>
    </motion.div>
  );
};

const s = {
  card: {
    background: '#fff', borderRadius: 22,
    overflow: 'hidden', cursor: 'pointer',
    transition: 'border 0.25s ease',
    flexShrink: 0,
    position: 'relative',
  },
  imgBox: {
    height: 180, backgroundSize: 'cover', backgroundPosition: 'center',
    position: 'relative',
  },
  imgGrad: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.45) 100%)',
  },
  imgTags: {
    position: 'absolute', bottom: 10, left: 10,
    display: 'flex', gap: 5,
  },
  imgTag: {
    fontFamily: "'Inter', sans-serif", fontSize: '0.68rem', fontWeight: 700,
    background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)',
    color: '#fff', padding: '3px 9px', borderRadius: 8,
    letterSpacing: '0.3px',
  },
  favBtn: {
    position: 'absolute', top: 10, right: 10,
    width: 30, height: 30, borderRadius: '50%',
    background: '#fff', border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(255,77,109,0.2)',
  },
  content: { padding: '14px 16px 16px', position: 'relative' },
  name: {
    fontFamily: "'Inter', sans-serif", fontSize: '0.98rem',
    fontWeight: 700, color: '#111', margin: '0 0 4px',
  },
  sub: {
    fontFamily: "'Inter', sans-serif", fontSize: '0.8rem',
    color: '#888', margin: '0 0 12px', lineHeight: 1.5,
  },
  metaRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  ratingPill: {
    display: 'flex', alignItems: 'center', gap: 4,
    background: '#F8F5F2', borderRadius: 10, padding: '4px 8px',
  },
  ratingNum: {
    fontFamily: "'Inter', sans-serif", fontSize: '0.82rem',
    fontWeight: 700, color: '#111',
  },
  reviewCount: {
    fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', color: '#aaa',
  },
  pricePill: { display: 'flex', alignItems: 'baseline', gap: 3 },
  priceVal: {
    fontFamily: "'Inter', sans-serif", fontSize: '1rem',
    fontWeight: 800, color: '#111',
  },
  priceUnit: {
    fontFamily: "'Inter', sans-serif", fontSize: '0.72rem',
    color: '#888',
  },
  activeBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: 3, background: '#18C2A4', borderRadius: '0 0 2px 2px',
  },
};

export default ListingCard;
