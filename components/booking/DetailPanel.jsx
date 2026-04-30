import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FACILITIES = {
  stays: [
    { icon: '📶', label: 'WiFi' },
    { icon: '🍽️', label: 'Food' },
    { icon: '🅿️', label: 'Parking' },
    { icon: '🚿', label: 'Hot Water' },
    { icon: '🚐', label: 'Pickup' },
    { icon: '⛰️', label: 'Mountain View' },
  ],
  cabs: [
    { icon: '✅', label: 'Verified' },
    { icon: '⛽', label: 'Fuel Incl.' },
    { icon: '❄️', label: 'AC' },
    { icon: '🧭', label: 'Local Guide' },
  ],
  guides: [
    { icon: '🗣️', label: 'Multilingual' },
    { icon: '🏔️', label: 'Trekking' },
    { icon: '📸', label: 'Photography' },
    { icon: '🎯', label: 'Certified' },
  ],
  experiences: [
    { icon: '🎟️', label: 'Tickets Incl.' },
    { icon: '🚐', label: 'Transport' },
    { icon: '🥗', label: 'Meals' },
    { icon: '🦺', label: 'Safety Gear' },
  ],
};

const DetailPanel = ({ item, activeTab, onClose, guests, setGuests, maxGuests, checkIn, setCheckIn, checkOut, setCheckOut, pricing }) => {
  const [isFav, setIsFav] = useState(false);
  const [readMore, setReadMore] = useState(false);

  const facilities = FACILITIES[activeTab] || FACILITIES.stays;

  const priceUnit =
    activeTab === 'stays' ? '/ night' :
    activeTab === 'cabs'  ? '/ day'   :
    activeTab === 'guides'? '/ day'   : '/ person';

  if (!item) {
    return (
      <motion.div
        key="empty"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={s.emptyWrap}
      >
        <div style={s.emptyInner}>
          <div style={s.emptyIcon}>🗺️</div>
          <p style={s.emptyTitle}>Select a listing</p>
          <p style={s.emptySubtitle}>Pick any card to see details and book</p>
        </div>
      </motion.div>
    );
  }

  const desc = item.description || '';
  const shortDesc = desc.length > 110 ? desc.slice(0, 110) + '…' : desc;

  return (
    <motion.div
      key={item.id}
      initial={{ x: 60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 60, opacity: 0 }}
      transition={{ type: 'spring', damping: 26, stiffness: 300 }}
      style={s.panel}
    >
      {/* Image */}
      <div style={{ ...s.imgWrap, backgroundImage: `url(${item.image})` }}>
        <div style={s.imgOverlay} />

        {/* Top Controls */}
        <div style={s.imgTop}>
          <button onClick={onClose} style={s.iconBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button onClick={() => setIsFav(f => !f)} style={s.iconBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill={isFav ? '#FF4D6D' : 'none'} stroke={isFav ? '#FF4D6D' : '#333'} strokeWidth="2" strokeLinecap="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </div>

        {/* Badge */}
        {item.tags?.[0] && (
          <div style={s.imgBadge}>{item.tags[0]}</div>
        )}
      </div>

      {/* Scrollable Content */}
      <div style={s.scrollBody}>
        {/* Title + Map */}
        <div style={s.titleRow}>
          <h2 style={s.title}>{item.title}</h2>
          <button style={s.mapBtn}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#18C2A4" strokeWidth="2.5" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            Map
          </button>
        </div>

        {/* Rating */}
        <div style={s.ratingRow}>
          <span style={s.star}>★</span>
          <span style={s.ratingNum}>{item.rating}</span>
          <span style={s.ratingReviews}>({item.reviews?.toLocaleString()} reviews)</span>
        </div>

        {/* Tags */}
        {item.tags && (
          <div style={s.tagRow}>
            {item.tags.map(t => (
              <span key={t} style={s.tag}>{t}</span>
            ))}
          </div>
        )}

        {/* Description */}
        <p style={s.desc}>
          {readMore ? desc : shortDesc}
          {desc.length > 110 && (
            <button onClick={() => setReadMore(r => !r)} style={s.readMoreBtn}>
              {readMore ? ' Show less' : ' Read more'}
            </button>
          )}
        </p>

        {/* Facilities */}
        <h4 style={s.sectionLabel}>Facilities</h4>
        <div style={s.facilGrid}>
          {facilities.map((f, i) => (
            <div key={i} style={s.facilItem}>
              <div style={s.facilIconWrap}>{f.icon}</div>
              <span style={s.facilLabel}>{f.label}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const s = {
  emptyWrap: {
    width: '100%', height: '100%', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    background: '#F8F5F2', borderRadius: 28,
    border: '2px dashed rgba(24,194,164,0.2)',
  },
  emptyInner: { textAlign: 'center' },
  emptyIcon: { fontSize: '2.8rem', marginBottom: 12 },
  emptyTitle: {
    fontFamily: "'Inter', sans-serif", fontSize: '1.05rem',
    fontWeight: 700, color: '#111', margin: '0 0 6px',
  },
  emptySubtitle: {
    fontFamily: "'Inter', sans-serif", fontSize: '0.85rem', color: '#888', margin: 0,
  },
  panel: {
    width: '100%',
    height: '100%',
    minHeight: 0, /* critical: allow flex parent to bound the height */
    background: '#fff',
    borderRadius: 28,
    overflow: 'hidden', /* clips rounded corners on image */
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
  },
  imgWrap: {
    height: 240, flexShrink: 0,
    backgroundSize: 'cover', backgroundPosition: 'center',
    position: 'relative',
  },
  imgOverlay: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, transparent 60%)',
  },
  imgTop: {
    position: 'absolute', top: 16, left: 16, right: 16,
    display: 'flex', justifyContent: 'space-between', zIndex: 2,
  },
  iconBtn: {
    width: 38, height: 38, borderRadius: '50%',
    background: '#fff', border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
  },
  imgBadge: {
    position: 'absolute', bottom: 14, left: 16,
    background: '#18C2A4', color: '#fff',
    fontFamily: "'Inter', sans-serif", fontSize: '0.72rem',
    fontWeight: 700, letterSpacing: '0.5px',
    padding: '5px 12px', borderRadius: 10,
    boxShadow: '0 4px 12px rgba(24,194,164,0.4)',
  },
  scrollBody: {
    flex: 1, overflowY: 'auto', padding: '20px 22px 120px',
    scrollbarWidth: 'thin',
    scrollbarColor: 'rgba(24,194,164,0.35) transparent',
    WebkitOverflowScrolling: 'touch',
    overscrollBehavior: 'contain',
  },
  titleRow: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 6,
  },
  title: {
    fontFamily: "'Inter', sans-serif", fontSize: '1.25rem',
    fontWeight: 700, color: '#111', margin: 0, flex: 1, marginRight: 10,
  },
  mapBtn: {
    display: 'flex', alignItems: 'center', gap: 5,
    background: '#DDE9E6', border: 'none', borderRadius: 10, cursor: 'pointer',
    fontFamily: "'Inter', sans-serif", fontSize: '0.82rem',
    fontWeight: 600, color: '#18C2A4', padding: '8px 12px', whiteSpace: 'nowrap',
  },
  ratingRow: { display: 'flex', alignItems: 'center', gap: 5, marginBottom: 10 },
  star: { color: '#F5A623', fontSize: '1rem' },
  ratingNum: { fontFamily: "'Inter', sans-serif", fontSize: '0.9rem', fontWeight: 700, color: '#111' },
  ratingReviews: { fontFamily: "'Inter', sans-serif", fontSize: '0.82rem', color: '#888' },
  tagRow: { display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 14 },
  tag: {
    fontFamily: "'Inter', sans-serif", fontSize: '0.72rem', fontWeight: 600,
    background: '#DDE9E6', color: '#18C2A4', padding: '4px 10px', borderRadius: 10,
  },
  desc: {
    fontFamily: "'Inter', sans-serif", fontSize: '0.9rem',
    lineHeight: 1.65, color: '#555', margin: '0 0 22px',
  },
  readMoreBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    fontFamily: "'Inter', sans-serif", fontSize: '0.9rem',
    fontWeight: 700, color: '#18C2A4', padding: 0, marginLeft: 4,
  },
  sectionLabel: {
    fontFamily: "'Inter', sans-serif", fontSize: '0.95rem',
    fontWeight: 700, color: '#111', margin: '0 0 14px',
  },
  facilGrid: { display: 'flex', flexWrap: 'wrap', gap: 12 },
  facilItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, width: 56 },
  facilIconWrap: {
    width: 48, height: 48, borderRadius: 16,
    background: '#F8F5F2', display: 'flex',
    alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem',
  },
  facilLabel: {
    fontFamily: "'Inter', sans-serif", fontSize: '0.7rem',
    color: '#666', fontWeight: 500, textAlign: 'center',
  },
};

export default DetailPanel;
