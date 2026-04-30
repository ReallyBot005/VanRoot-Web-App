import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─────────────────────────────────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────────────────────────────────── */
const calculateNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  const diff = new Date(checkOut) - new Date(checkIn);
  return diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0;
};
const today = () => new Date().toISOString().split('T')[0];
const fmt = (n) => Math.round(n).toLocaleString('en-IN');

/* ─────────────────────────────────────────────────────────────────────────────
   SavedBadge
───────────────────────────────────────────────────────────────────────────── */
const SavedBadge = ({ bookingId, email, total }) => (
  <motion.div
    initial={{ scale: 0.85, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    style={s.successWrap}
  >
    <div style={s.successIcon}>🎉</div>
    <div style={{ flex: 1 }}>
      <p style={s.successTitle}>Booking Confirmed!</p>
      <p style={s.successSub}>
        Reference&nbsp;<span style={s.successId}>#{bookingId}</span>
      </p>
      {email && (
        <p style={s.successEmail}>✉️ Confirmation sent to <strong>{email}</strong></p>
      )}
      <div style={s.successDetails}>
        <span>💰 ₹{fmt(total)} paid</span>
      </div>
      <p style={s.successNote}>Saved locally • backend integration ready</p>
    </div>
  </motion.div>
);

/* ─────────────────────────────────────────────────────────────────────────────
   CheckoutPage
───────────────────────────────────────────────────────────────────────────── */
const CheckoutPage = ({ services, onClose, onConfirm }) => {
  const { stay, cab, guide } = services || {};

  // Form states
  const [stayData, setStayData] = useState({
    checkIn: '', checkOut: '', guests: 2, pricePerNight: stay?.price || 2200
  });
  const [cabData, setCabData] = useState({
    pickup: '', drop: '', date: '', time: '', passengers: 1, type: cab?.cabType || 'Standard', price: cab?.price || 1500
  });
  const [guideData, setGuideData] = useState({
    date: '', duration: 'full', pricePerDay: guide?.price || 1000
  });

  const [email, setEmail] = useState('');
  const [payMethod, setPayMethod] = useState('upi');
  const [confirmed, setConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  
  const [pricing, setPricing] = useState({ total: 0, breakdown: [] });

  // Calculate pricing whenever inputs change
  useEffect(() => {
    let total = 0;
    const breakdown = [];

    if (stay) {
      const nights = calculateNights(stayData.checkIn, stayData.checkOut);
      const base = stayData.pricePerNight * Math.max(1, nights); // Show base even if 0 nights selected
      const tax = base * 0.12;
      const fee = 100 + stayData.guests * 20;
      const stayTotal = base + tax + fee;
      if (nights > 0) total += stayTotal;
      breakdown.push({ label: `Stay (${nights} nights)`, value: stayTotal, active: nights > 0 });
    }

    if (cab) {
      total += cabData.price;
      breakdown.push({ label: `Cab (${cabData.type})`, value: cabData.price, active: true });
    }

    if (guide) {
      const gPrice = guideData.duration === 'half' ? guideData.pricePerDay * 0.6 : guideData.pricePerDay;
      total += gPrice;
      breakdown.push({ label: `Guide (${guideData.duration} day)`, value: gPrice, active: true });
    }

    setPricing({ total, breakdown });
  }, [stay, stayData, cab, cabData, guide, guideData]);

  // Validation
  const emailValid = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  let canBook = emailValid && pricing.total > 0;
  if (stay) {
    if (!stayData.checkIn || !stayData.checkOut || stayData.checkOut <= stayData.checkIn) canBook = false;
  }
  if (cab) {
    if (!cabData.pickup || !cabData.drop || !cabData.date || !cabData.time) canBook = false;
  }
  if (guide) {
    if (!guideData.date) canBook = false;
  }

  const handleConfirm = () => {
    if (!canBook) return;
    const id = Date.now();

    // Final Object Structure (Backend Ready)
    const bookingPayload = {
      id,
      userId: 'temp-user',
      location: stay?.location || cab?.location || guide?.location || 'unknown',
      services: {
        stay: stay ? { ...stayData, item: stay } : null,
        cab: cab ? { ...cabData, item: cab } : null,
        guide: guide ? { ...guideData, item: guide } : null,
      },
      totalPrice: Math.round(pricing.total),
      paymentMethod: payMethod,
      email,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString(),
    };

    // Save to localStorage
    const existing = JSON.parse(localStorage.getItem('vanroots_bookings') || '[]');
    localStorage.setItem('vanroots_bookings', JSON.stringify([...existing, bookingPayload]));

    setBookingId(id);
    setConfirmed(true);
    setTimeout(() => onConfirm?.(), 3200);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={s.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      <motion.div
        initial={{ y: 70, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 70, opacity: 0 }}
        transition={{ type: 'spring', damping: 26, stiffness: 280 }}
        style={s.sheet}
      >
        <div style={s.header}>
          <button onClick={onClose} style={s.closeBtn}>✕</button>
          <h2 style={s.headerTitle}>Checkout Trip</h2>
          <div style={{ width: 40 }} />
        </div>

        <div style={s.body}>
          {!stay && !cab && !guide && (
            <p style={s.hintMsg}>Your trip is empty. Please add a service.</p>
          )}

          {/* ── STAY FORM ── */}
          {stay && (
            <div style={s.section}>
              <h3 style={s.sectionTitle}>🏡 Homestay: {stay.title}</h3>
              <div style={s.grid}>
                <div>
                  <label style={s.label}>Check-in</label>
                  <input type="date" min={today()} value={stayData.checkIn} onChange={e => setStayData(p => ({ ...p, checkIn: e.target.value }))} style={s.input} />
                </div>
                <div>
                  <label style={s.label}>Check-out</label>
                  <input type="date" min={stayData.checkIn || today()} value={stayData.checkOut} onChange={e => setStayData(p => ({ ...p, checkOut: e.target.value }))} style={s.input} />
                </div>
                <div>
                  <label style={s.label}>Guests</label>
                  <input type="number" min="1" max="12" value={stayData.guests} onChange={e => setStayData(p => ({ ...p, guests: parseInt(e.target.value)||1 }))} style={s.input} />
                </div>
              </div>
            </div>
          )}

          {/* ── CAB FORM ── */}
          {cab && (
            <div style={s.section}>
              <h3 style={s.sectionTitle}>🚕 Cab: {cab.title}</h3>
              <div style={s.grid}>
                <div>
                  <label style={s.label}>Pickup Location</label>
                  <input type="text" placeholder="Hotel, Airport..." value={cabData.pickup} onChange={e => setCabData(p => ({ ...p, pickup: e.target.value }))} style={s.input} />
                </div>
                <div>
                  <label style={s.label}>Drop Location</label>
                  <input type="text" placeholder="Destination..." value={cabData.drop} onChange={e => setCabData(p => ({ ...p, drop: e.target.value }))} style={s.input} />
                </div>
                <div>
                  <label style={s.label}>Date</label>
                  <input type="date" min={today()} value={cabData.date} onChange={e => setCabData(p => ({ ...p, date: e.target.value }))} style={s.input} />
                </div>
                <div>
                  <label style={s.label}>Time</label>
                  <input type="time" value={cabData.time} onChange={e => setCabData(p => ({ ...p, time: e.target.value }))} style={s.input} />
                </div>
                <div>
                  <label style={s.label}>Passengers</label>
                  <input type="number" min="1" max="6" value={cabData.passengers} onChange={e => setCabData(p => ({ ...p, passengers: parseInt(e.target.value)||1 }))} style={s.input} />
                </div>
              </div>
            </div>
          )}

          {/* ── GUIDE FORM ── */}
          {guide && (
            <div style={s.section}>
              <h3 style={s.sectionTitle}>🧭 Guide: {guide.title}</h3>
              <div style={s.grid}>
                <div>
                  <label style={s.label}>Date</label>
                  <input type="date" min={today()} value={guideData.date} onChange={e => setGuideData(p => ({ ...p, date: e.target.value }))} style={s.input} />
                </div>
                <div>
                  <label style={s.label}>Duration</label>
                  <select value={guideData.duration} onChange={e => setGuideData(p => ({ ...p, duration: e.target.value }))} style={s.input}>
                    <option value="full">Full Day</option>
                    <option value="half">Half Day</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ── PRICE BREAKDOWN ── */}
          {pricing.total > 0 && (
            <div style={s.breakdown}>
              <h4 style={s.sectionTitle}>Price Breakdown</h4>
              {pricing.breakdown.map((item, idx) => (
                <div key={idx} style={{ ...s.breakdownRow, opacity: item.active ? 1 : 0.4 }}>
                  <span>{item.label}</span>
                  <strong>₹{fmt(item.value)}</strong>
                </div>
              ))}
              <div style={s.totalRow}>
                <span style={s.totalLabel}>Total Amount</span>
                <span style={s.totalVal}>₹{fmt(pricing.total)}</span>
              </div>
            </div>
          )}

          {/* ── EMAIL & PAYMENT ── */}
          <div style={s.section}>
            <label style={s.label}>Email for Confirmation</label>
            <input type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} style={s.input} />
          </div>

          <div style={s.section}>
            <label style={s.label}>Payment Method</label>
            <div style={s.payMethods}>
              {['upi', 'card', 'wallet'].map(m => (
                <button
                  key={m} onClick={() => setPayMethod(m)}
                  style={{ ...s.payBtn, background: payMethod === m ? '#18C2A4' : '#fff', color: payMethod === m ? '#fff' : '#111', border: `1px solid ${payMethod === m ? '#18C2A4' : '#ddd'}` }}
                >
                  {m.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* ── FOOTER ── */}
        <div style={s.footer}>
          {confirmed ? (
            <SavedBadge bookingId={bookingId} email={email} total={pricing.total} />
          ) : (
            <motion.button
              onClick={handleConfirm}
              disabled={!canBook}
              whileHover={canBook ? { scale: 1.02 } : {}}
              whileTap={canBook ? { scale: 0.98 } : {}}
              style={{ ...s.confirmBtn, background: canBook ? '#18C2A4' : '#ccc', cursor: canBook ? 'pointer' : 'not-allowed' }}
            >
              {canBook ? `Pay ₹${fmt(pricing.total)} · Confirm Booking` : 'Fill all required fields'}
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const s = {
  overlay: {
    position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(17,17,17,0.6)',
    backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
  },
  sheet: {
    width: '100%', maxWidth: '600px', background: '#F8F5F2',
    borderRadius: '28px 28px 0 0', maxHeight: '94vh',
    display: 'flex', flexDirection: 'column', overflow: 'hidden',
  },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '20px 24px', borderBottom: '1px solid rgba(0,0,0,0.06)',
  },
  closeBtn: {
    width: 36, height: 36, borderRadius: '50%', background: 'rgba(0,0,0,0.06)',
    border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontFamily: "'Inter', sans-serif", fontSize: '1.2rem', fontWeight: 700, margin: 0, color: '#111' },
  body: {
    flex: 1, overflowY: 'auto', padding: '20px 24px',
    display: 'flex', flexDirection: 'column', gap: 20, minHeight: 0,
    WebkitOverflowScrolling: 'touch', scrollBehavior: 'smooth', touchAction: 'pan-y',
  },
  section: {
    background: '#fff', padding: 16, borderRadius: 16,
    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
  },
  sectionTitle: { fontFamily: "'Inter', sans-serif", fontSize: '1rem', fontWeight: 700, margin: '0 0 12px', color: '#111' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  label: { fontFamily: "'Inter', sans-serif", fontSize: '0.8rem', fontWeight: 600, color: '#888', marginBottom: 4, display: 'block' },
  input: {
    width: '100%', padding: '10px 12px', borderRadius: 12, border: '1px solid rgba(0,0,0,0.1)',
    fontFamily: "'Inter', sans-serif", fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box',
  },
  breakdown: { background: '#fff', padding: 16, borderRadius: 16, border: '1px solid #18C2A4' },
  breakdownRow: { display: 'flex', justifyContent: 'space-between', fontFamily: "'Inter', sans-serif", fontSize: '0.9rem', marginBottom: 8 },
  totalRow: { display: 'flex', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid rgba(0,0,0,0.1)', marginTop: 8 },
  totalLabel: { fontFamily: "'Inter', sans-serif", fontSize: '1.1rem', fontWeight: 700 },
  totalVal: { fontFamily: "'Inter', sans-serif", fontSize: '1.2rem', fontWeight: 800, color: '#18C2A4' },
  payMethods: { display: 'flex', gap: 10 },
  payBtn: { flex: 1, padding: '12px 0', borderRadius: 12, cursor: 'pointer', fontFamily: "'Inter', sans-serif", fontSize: '0.9rem', fontWeight: 600 },
  footer: { padding: '16px 24px 24px', borderTop: '1px solid rgba(0,0,0,0.06)', flexShrink: 0 },
  confirmBtn: {
    width: '100%', padding: '16px', borderRadius: 16, border: 'none', color: '#fff',
    fontFamily: "'Inter', sans-serif", fontSize: '1rem', fontWeight: 700,
  },
  successWrap: { display: 'flex', gap: 16, background: '#DDE9E6', padding: 20, borderRadius: 16, border: '1px solid #18C2A4' },
  successIcon: { fontSize: '2rem' },
  successTitle: { fontFamily: "'Inter', sans-serif", fontSize: '1.1rem', fontWeight: 700, margin: 0 },
  successSub: { fontFamily: "'Inter', sans-serif", fontSize: '0.9rem', color: '#555', margin: '4px 0 0' },
  successEmail: { fontFamily: "'Inter', sans-serif", fontSize: '0.85rem', color: '#444', margin: '6px 0 0' },
  successDetails: { fontFamily: "'Inter', sans-serif", fontSize: '0.85rem', color: '#555', marginTop: 8 },
  successNote: { fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', color: '#888', marginTop: 8 },
};

export default CheckoutPage;
