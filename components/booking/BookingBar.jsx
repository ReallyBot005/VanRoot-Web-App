import React, { useState } from 'react';

const BookingBar = ({ selectedItems, totalPrice }) => {
  const [confirmed, setConfirmed] = useState(false);
  const count = selectedItems.length;

  const handleBook = () => {
    if (count === 0) return;
    setConfirmed(true);
    setTimeout(() => setConfirmed(false), 3000);
  };

  return (
    <div style={styles.bar}>
      <div style={styles.inner}>
        <div style={styles.priceInfo}>
          <div style={styles.priceRow}>
            <span style={styles.totalPrice}>₹{totalPrice.toLocaleString()}</span>
            <span style={styles.taxLabel}>Incl. all taxes</span>
          </div>
          <span style={styles.itemCount}>
            {count} item{count !== 1 ? 's' : ''} selected
          </span>
        </div>

        <button
          onClick={handleBook}
          disabled={count === 0 || confirmed}
          style={{
            ...styles.bookBtn,
            background: count === 0 ? '#CBD5E1' : (confirmed ? '#22C55E' : '#13B8A6'),
            cursor: count === 0 ? 'default' : 'pointer',
          }}
        >
          {confirmed ? 'Confirmed!' : 'Book Now'}
          {!confirmed && count > 0 && (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

const styles = {
  bar: {
    position: 'absolute',
    bottom: '24px',
    left: '24px',
    right: '24px',
    zIndex: 100,
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    borderRadius: '24px',
    padding: '16px 24px',
    boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
  },
  inner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '20px',
  },
  priceInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  priceRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '6px',
  },
  totalPrice: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '1.4rem',
    color: '#1A1A1A',
    fontWeight: 700,
  },
  taxLabel: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.7rem',
    color: '#888',
    fontWeight: 500,
  },
  itemCount: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.8rem',
    color: '#13B8A6',
    fontWeight: 600,
  },
  bookBtn: {
    padding: '14px 28px',
    borderRadius: '16px',
    border: 'none',
    color: '#fff',
    fontFamily: "'Inter', sans-serif",
    fontSize: '1rem',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    whiteSpace: 'nowrap',
    boxShadow: '0 8px 20px rgba(19, 184, 166, 0.2)',
  },
};

export default BookingBar;
