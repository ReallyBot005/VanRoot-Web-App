import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─────────────────────────────────────────────────────────────────────────────
   Constants
───────────────────────────────────────────────────────────────────────────── */
const LS_KEY = 'vanroots_bookings';

const STATUS_CONFIG = {
  CONFIRMED:  { label: 'Confirmed',  bg: '#D1FAE5', color: '#065F46', dot: '#10B981' },
  PENDING:    { label: 'Pending',    bg: '#FEF3C7', color: '#92400E', dot: '#F59E0B' },
  COMPLETED:  { label: 'Completed',  bg: '#DBEAFE', color: '#1E40AF', dot: '#3B82F6' },
  CANCELLED:  { label: 'Cancelled',  bg: '#FFE4E6', color: '#9F1239', dot: '#F43F5E' },
};

const fmt = (n) => Number(n || 0).toLocaleString('en-IN');

import { bookingService } from '../../services/bookingService';

const readRatings = () => {
  try { return JSON.parse(localStorage.getItem('vanroots_ratings') || '{}'); }
  catch { return {}; }
};

const writeRatings = (obj) =>
  localStorage.setItem('vanroots_ratings', JSON.stringify(obj));

/* ─────────────────────────────────────────────────────────────────────────────
   StatusBadge
───────────────────────────────────────────────────────────────────────────── */
const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.CONFIRMED;
  return (
    <span style={{ ...b.badge, background: cfg.bg, color: cfg.color }}>
      <span style={{ ...b.badgeDot, background: cfg.dot }} />
      {cfg.label}
    </span>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   BookingCard
───────────────────────────────────────────────────────────────────────────── */
const BookingCard = ({ booking, onStatusChange, currentFilter }) => {
  const [loading, setLoading] = useState(false);
  const [ratings, setRatings] = useState(() => readRatings()[booking.id] || { stay: 0, cab: 0, guide: 0, review: '' });
  const [ratingSaved, setRatingSaved] = useState(() => !!readRatings()[booking.id]);

  const update = (newStatus) => {
    setLoading(true);
    setTimeout(() => {
      onStatusChange(booking.id, newStatus);
      setLoading(false);
    }, 320);
  };

  const isCancelled  = booking.status === 'CANCELLED';
  const isCompleted  = booking.status === 'COMPLETED';
  const isConfirmed  = booking.status === 'CONFIRMED';
  const isPending    = booking.status === 'PENDING';

  const handleRatingSubmit = () => {
    const all = readRatings();
    all[booking.id] = ratings;
    writeRatings(all);
    setRatingSaved(true);
  };

  const setRat = (type, val) => setRatings(p => ({ ...p, [type]: val }));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      style={{
        ...b.card,
        opacity: isCancelled ? 0.65 : 1,
      }}
    >
      <div style={b.cardTop}>
        <div>
          <p style={b.cardTitle}>Trip to {(booking?.location || "Unknown").toUpperCase()}</p>
          <p style={b.cardSub}>#{booking?.id}</p>
        </div>
        <StatusBadge status={booking?.status} />
      </div>

      <div style={{ marginBottom: 12 }}>
        {/* Support both flat and nested structure */}
        {(booking?.services?.stay || booking?.serviceType === 'homestay' || booking?.title) && (
          <p style={b.serviceRow}>🏡 {booking?.title || booking?.services?.stay?.item?.title || "Stay"} ({booking?.guests || booking?.services?.stay?.guests || 1} guests)</p>
        )}
        {booking?.services?.cab && (
          <p style={b.serviceRow}>🚕 {booking.services.cab?.item?.title || "Cab"} ({booking.services.cab?.passengers || 1} pax)</p>
        )}
        {booking?.services?.guide && (
          <p style={b.serviceRow}>🧭 {booking.services.guide?.item?.title || "Guide"} ({booking.services.guide?.duration || 1} day)</p>
        )}
      </div>

      <div style={b.metaGrid}>
        <MetaItem icon="💳" label="Payment" value={(booking?.paymentMethod || 'UPI').toUpperCase()} />
        <MetaItem icon="💰" label="Total" value={`₹${fmt(booking?.totalPrice || 0)}`} highlight />
      </div>

      {booking.email && <p style={b.emailRow}>✉️ {booking.email}</p>}

      {/* ── RATING SECTION ── */}
      {isConfirmed && (
        <div style={b.ratingBox}>
          <p style={b.ratingTitle}>Rate your trip services</p>
          
          {booking.services?.stay && (
            <div style={b.rateRow}>
              <span style={b.rateLabel}>Homestay</span>
              <div style={b.stars}>
                {[1, 2, 3, 4, 5].map(star => (
                  <span key={star} onClick={() => !ratingSaved && setRat('stay', star)} style={{ ...b.star, color: star <= ratings.stay ? '#F5A623' : '#E0E0E0', cursor: ratingSaved ? 'default' : 'pointer' }}>★</span>
                ))}
              </div>
            </div>
          )}

          {booking.services?.cab && (
            <div style={b.rateRow}>
              <span style={b.rateLabel}>Cab</span>
              <div style={b.stars}>
                {[1, 2, 3, 4, 5].map(star => (
                  <span key={star} onClick={() => !ratingSaved && setRat('cab', star)} style={{ ...b.star, color: star <= ratings.cab ? '#F5A623' : '#E0E0E0', cursor: ratingSaved ? 'default' : 'pointer' }}>★</span>
                ))}
              </div>
            </div>
          )}

          {booking.services?.guide && (
            <div style={b.rateRow}>
              <span style={b.rateLabel}>Guide</span>
              <div style={b.stars}>
                {[1, 2, 3, 4, 5].map(star => (
                  <span key={star} onClick={() => !ratingSaved && setRat('guide', star)} style={{ ...b.star, color: star <= ratings.guide ? '#F5A623' : '#E0E0E0', cursor: ratingSaved ? 'default' : 'pointer' }}>★</span>
                ))}
              </div>
            </div>
          )}

          {!ratingSaved ? (
            <>
              <textarea placeholder="Optional review..." value={ratings.review} onChange={e => setRat('review', e.target.value)} style={b.reviewInput} rows={2} />
              <button onClick={handleRatingSubmit} style={b.ratingBtn}>Submit Review</button>
            </>
          ) : (
            <p style={b.ratingSavedMsg}>✓ Review submitted</p>
          )}
        </div>
      )}

      {/* Action buttons */}
      {currentFilter === 'all' && isConfirmed && (
        <div style={b.actions}>
          <motion.button 
            whileHover={{ scale: 1.03 }} 
            whileTap={{ scale: 0.97 }} 
            onClick={() => update('CANCELLED')} 
            disabled={loading} 
            style={{ ...b.actionBtn, ...b.cancelBtn }}
          >
            {loading ? '…' : '✕ Cancel Booking'}
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};

const MetaItem = ({ icon, label, value, highlight }) => (
  <div style={b.metaItem}>
    <span style={b.metaIcon}>{icon}</span>
    <div>
      <p style={b.metaLabel}>{label}</p>
      <p style={{ ...b.metaVal, color: highlight ? '#18C2A4' : '#111', fontWeight: highlight ? 800 : 600 }}>
        {value}
      </p>
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────────────────────
   BookingStatusPanel (main export)
───────────────────────────────────────────────────────────────────────────── */
const BookingStatusPanel = ({ onClose }) => {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('CONFIRMED');

  // LOAD BOOKINGS SAFELY
  useEffect(() => {
    const data = bookingService.getAll();
    const safeData = Array.isArray(data) ? data : [];
    
    let changed = false;
    const updated = safeData.map(b => {
      const today = new Date();
      const checkoutDate = b?.services?.stay?.checkOut ? new Date(b.services.stay.checkOut) : null;
      
      if (b?.status === "CONFIRMED" && checkoutDate && checkoutDate < today) {
        changed = true;
        bookingService.update(b.id, { status: "COMPLETED" });
        return { ...b, status: "COMPLETED" };
      }
      return b;
    });

    setBookings(changed ? updated : safeData);
  }, []);

  /* Update status in state + localStorage instantly */
  const handleStatusChange = useCallback((id, newStatus) => {
    bookingService.update(id, { status: newStatus });
    setBookings(bookingService.getAll());
  }, []);

  console.log("Bookings:", bookings);

  const visible = Array.isArray(bookings) ? bookings.filter(b => {
    if (!b) return false;
    if (filter === 'all') return true;
    if (filter === 'status') {
      return b.status === statusFilter;
    }
    if (filter === 'previous') {
      return b.status === 'COMPLETED' || b.status === 'CANCELLED';
    }
    return true;
  }) : [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={b.overlay}
      onClick={e => e.target === e.currentTarget && onClose?.()}
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 260 }}
        style={b.panel}
      >
        {/* Header */}
        <div style={b.header}>
          <div>
            <h2 style={b.heading}>My Account</h2>
            <p style={b.subheading}>{bookings.length} booking{bookings.length !== 1 ? 's' : ''} saved locally</p>
          </div>
          <button onClick={onClose} style={b.closeBtn} aria-label="Close panel">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="#111" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Filter controls */}
        <div style={b.filterRow}>
          <button
            onClick={() => setFilter('all')}
            style={{
              ...b.filterBtn,
              background: filter === 'all' ? '#18C2A4' : '#fff',
              color:      filter === 'all' ? '#fff'   : '#666',
              border:     `1.5px solid ${filter === 'all' ? '#18C2A4' : 'rgba(0,0,0,0.08)'}`,
            }}
          >
            All
          </button>

          <select 
            value={filter === 'status' ? statusFilter : ''}
            onChange={(e) => {
              setFilter('status');
              setStatusFilter(e.target.value);
            }}
            style={{
              ...b.filterBtn,
              background: filter === 'status' ? '#18C2A4' : '#fff',
              color:      filter === 'status' ? '#fff'   : '#666',
              border:     `1.5px solid ${filter === 'status' ? '#18C2A4' : 'rgba(0,0,0,0.08)'}`,
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="" disabled hidden>Status</option>
            <option value="CONFIRMED" style={{color: '#111'}}>Confirmed</option>
            <option value="COMPLETED" style={{color: '#111'}}>Completed</option>
            <option value="CANCELLED" style={{color: '#111'}}>Cancelled</option>
          </select>

          <button
            onClick={() => setFilter('previous')}
            style={{
              ...b.filterBtn,
              background: filter === 'previous' ? '#18C2A4' : '#fff',
              color:      filter === 'previous' ? '#fff'   : '#666',
              border:     `1.5px solid ${filter === 'previous' ? '#18C2A4' : 'rgba(0,0,0,0.08)'}`,
            }}
          >
            Previous Bookings
          </button>
        </div>

        {/* Booking list */}
        <div style={b.list}>
          {(!bookings || bookings.length === 0) ? (
            <div style={b.emptyState}>
              <div style={b.emptyIcon}>🗓️</div>
              <p style={b.emptyTitle}>No bookings yet</p>
              <p style={b.emptySub}>Your confirmed trips will appear here</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {visible.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={b.emptyState}
                >
                  <p style={b.emptyTitle}>No matching bookings found</p>
                </motion.div>
              ) : (
                visible.map(bk => (
                  <BookingCard
                    key={bk.id}
                    booking={bk}
                    onStatusChange={handleStatusChange}
                    currentFilter={filter}
                  />
                ))
              )}
            </AnimatePresence>
          )}
        </div>

        {/* Footer note */}
        <div style={b.footerNote}>
          <p style={b.footerText}>
            🔒 Data stored locally • Backend integration ready
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   Styles
───────────────────────────────────────────────────────────────────────────── */
const b = {
  overlay: {
    position: 'fixed', inset: 0, zIndex: 999999,
    background: 'rgba(0,0,0,0.45)',
    backdropFilter: 'blur(6px)',
    overflowY: 'auto',
  },
  panel: {
    position: 'absolute', top: 0, right: 0, bottom: 0,
    width: '100%', maxWidth: 440,
    background: '#F8F5F2',
    display: 'flex', flexDirection: 'column',
    boxShadow: '-20px 0 60px rgba(0,0,0,0.15)',
    maxHeight: '100vh',
    overflowY: 'auto',
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    padding: '24px 24px 16px',
    borderBottom: '1px solid rgba(0,0,0,0.06)',
    flexShrink: 0,
  },
  heading: {
    fontFamily: "'Inter', sans-serif", fontSize: '1.3rem',
    fontWeight: 800, color: '#111', margin: 0,
  },
  subheading: {
    fontFamily: "'Inter', sans-serif", fontSize: '0.8rem',
    color: '#888', margin: '4px 0 0',
  },
  closeBtn: {
    width: 40, height: 40, borderRadius: '50%',
    background: 'rgba(0,0,0,0.06)', border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  filterRow: {
    display: 'flex', gap: 8, padding: '12px 24px',
    borderBottom: '1px solid rgba(0,0,0,0.05)',
    flexShrink: 0, overflowX: 'auto',
  },
  filterBtn: {
    padding: '6px 14px', borderRadius: 10, cursor: 'pointer',
    fontFamily: "'Inter', sans-serif", fontSize: '0.78rem', fontWeight: 600,
    whiteSpace: 'nowrap', transition: 'all 0.2s ease',
  },
  list: {
    flex: 1, overflowY: 'auto', padding: '16px 24px',
    display: 'flex', flexDirection: 'column', gap: 14,
    WebkitOverflowScrolling: 'touch',
    scrollbarWidth: 'thin',
    scrollbarColor: 'rgba(24,194,164,0.3) transparent',
  },

  /* Card */
  card: {
    background: '#fff', borderRadius: 20,
    padding: '18px 18px 14px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
    border: '1px solid rgba(0,0,0,0.04)',
    transition: 'box-shadow 0.2s ease',
  },
  cardTop: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 14,
  },
  cardTitle: {
    fontFamily: "'Inter', sans-serif", fontSize: '0.98rem',
    fontWeight: 700, color: '#111', margin: 0,
  },
  cardSub: {
    fontFamily: "'Inter', sans-serif", fontSize: '0.72rem',
    color: '#aaa', margin: '2px 0 0',
  },

  /* Badge */
  badge: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '4px 10px', borderRadius: 10,
    fontFamily: "'Inter', sans-serif", fontSize: '0.72rem', fontWeight: 700,
    letterSpacing: '0.3px', whiteSpace: 'nowrap',
  },
  badgeDot: { width: 6, height: 6, borderRadius: '50%' },

  /* Meta grid */
  metaGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr',
    gap: '10px 0', marginBottom: 12,
  },
  metaItem: { display: 'flex', alignItems: 'flex-start', gap: 8 },
  metaIcon: { fontSize: '0.9rem', marginTop: 1, flexShrink: 0 },
  metaLabel: {
    fontFamily: "'Inter', sans-serif", fontSize: '0.7rem',
    color: '#aaa', margin: 0, lineHeight: 1,
  },
  metaVal: {
    fontFamily: "'Inter', sans-serif", fontSize: '0.85rem',
    margin: '2px 0 0',
  },
  emailRow: {
    fontFamily: "'Inter', sans-serif", fontSize: '0.8rem',
    color: '#666', margin: '0 0 12px',
  },
  serviceRow: {
    fontFamily: "'Inter', sans-serif", fontSize: '0.82rem',
    color: '#444', margin: '0 0 4px', fontWeight: 600,
  },

  /* Actions */
  actions: { display: 'flex', gap: 8, marginTop: 4 },
  actionBtn: {
    flex: 1, padding: '10px 0', borderRadius: 12, border: 'none',
    cursor: 'pointer', fontFamily: "'Inter', sans-serif",
    fontSize: '0.82rem', fontWeight: 700,
    transition: 'all 0.2s ease',
  },
  completeBtn: { background: '#DDE9E6', color: '#065F46' },
  cancelBtn:   { background: '#FFE4E6', color: '#9F1239' },

  /* Rating section */
  ratingBox: {
    marginTop: 12, padding: 12, background: '#F8F5F2', borderRadius: 12,
    border: '1px solid rgba(0,0,0,0.04)',
  },
  ratingTitle: {
    fontFamily: "'Inter', sans-serif", fontSize: '0.85rem', fontWeight: 700,
    color: '#111', margin: '0 0 10px',
  },
  rateRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  rateLabel: { fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', color: '#555', fontWeight: 600 },
  stars: { display: 'flex', gap: 4 },
  star: { fontSize: '1.2rem', transition: 'color 0.2s', lineHeight: 1 },
  reviewInput: {
    width: '100%', padding: 8, borderRadius: 8, border: '1px solid rgba(0,0,0,0.1)',
    fontFamily: "'Inter', sans-serif", fontSize: '0.8rem', outline: 'none',
    resize: 'none', marginBottom: 8, boxSizing: 'border-box',
  },
  ratingBtn: {
    width: '100%', padding: '6px 0', background: '#18C2A4', color: '#fff',
    border: 'none', borderRadius: 8, cursor: 'pointer',
    fontFamily: "'Inter', sans-serif", fontSize: '0.8rem', fontWeight: 600,
  },
  ratingSavedMsg: {
    fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', color: '#18C2A4',
    margin: 0, fontWeight: 600,
  },

  /* Empty state */
  emptyState: {
    textAlign: 'center', padding: '60px 20px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
  },
  emptyIcon:  { fontSize: '3rem' },
  emptyTitle: { fontFamily: "'Inter', sans-serif", fontSize: '1rem', fontWeight: 700, color: '#111', margin: 0 },
  emptySub:   { fontFamily: "'Inter', sans-serif", fontSize: '0.85rem', color: '#888', margin: 0 },

  /* Footer */
  footerNote: {
    padding: '12px 24px 20px',
    borderTop: '1px solid rgba(0,0,0,0.05)',
    flexShrink: 0,
  },
  footerText: {
    fontFamily: "'Inter', sans-serif", fontSize: '0.75rem',
    color: '#bbb', margin: 0, textAlign: 'center',
  },
};

export default BookingStatusPanel;
