import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
  { id: 'cabs', label: 'Cabs', icon: '🚕' },
  { id: 'stays', label: 'Homestays', icon: '🏡' },
  { id: 'guides', label: 'Guides', icon: '🧭' },
];

const MOCK_DATA = {
  stays: [
    {
      id: 'h1',
      name: 'Cloud Nest Homestay',
      location: 'Shillong',
      rating: 4.9,
      vibe: 'Mountain sunrise retreat',
      price: 2400,
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800',
      badge: 'Top Rated'
    },
    {
      id: 'h2',
      name: 'Pine Ridge Cabin',
      location: 'Cherrapunji',
      rating: 4.7,
      vibe: 'Cozy forest getaway',
      price: 3200,
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800',
      badge: 'Eco Stay'
    },
    {
      id: 'h3',
      name: 'Mist Valley Inn',
      location: 'Mawlynnong',
      rating: 4.8,
      vibe: 'Cleanest village experience',
      price: 1800,
      image: 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&q=80&w=800',
      badge: 'Popular'
    }
  ],
  cabs: [
    {
      id: 'c1',
      name: 'Shillong Explorer SUV',
      driverStatus: 'Verified Driver',
      seats: 6,
      type: 'AC',
      price: 3200,
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800',
      badge: 'Verified'
    },
    {
      id: 'c2',
      name: 'Hills Cruiser Sedan',
      driverStatus: 'Local Expert',
      seats: 4,
      type: 'Non AC',
      price: 2500,
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800',
      badge: 'Popular'
    }
  ],
  guides: [
    {
      id: 'g1',
      name: 'Banjop Kharshiing',
      languages: 'English / Khasi / Hindi',
      specialty: 'Waterfall & Trek Expert',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800',
      badge: 'Best for Families'
    },
    {
      id: 'g2',
      name: 'Iada Nongrum',
      languages: 'English / Khasi',
      specialty: 'Cultural & Food Guide',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800',
      badge: 'Top Rated'
    }
  ]
};

const HomestayCard = ({ item }) => (
  <motion.div
    whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.12)' }}
    style={styles.card}
  >
    <div style={styles.imageContainer}>
      <img src={item.image} alt={item.name} style={styles.cardImage} />
      {item.badge && <div style={styles.badge}>{item.badge}</div>}
    </div>
    <div style={styles.cardContent}>
      <h3 style={styles.cardName}>{item.name}</h3>
      <p style={styles.cardSubtext}>{item.location}</p>
      <div style={styles.ratingRow}>
        <span style={styles.ratingText}>{item.rating} ★</span>
        <span style={styles.vibeText}>{item.vibe}</span>
      </div>
      <div style={styles.priceRow}>
        <span style={styles.priceText}>₹{item.price.toLocaleString()} <span style={styles.perUnit}>/ night</span></span>
        <button style={styles.bookBtn}>Book Now</button>
      </div>
    </div>
  </motion.div>
);

const CabCard = ({ item }) => (
  <motion.div
    whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.12)' }}
    style={styles.card}
  >
    <div style={styles.imageContainer}>
      <img src={item.image} alt={item.name} style={styles.cardImage} />
      {item.badge && <div style={styles.badge}>{item.badge}</div>}
    </div>
    <div style={styles.cardContent}>
      <h3 style={styles.cardName}>{item.name}</h3>
      <div style={styles.driverBadge}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3F5E45" strokeWidth="3">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span>{item.driverStatus}</span>
      </div>
      <div style={styles.infoRow}>
        <span style={styles.infoTag}>{item.seats} Seats</span>
        <span style={styles.infoTag}>{item.type}</span>
      </div>
      <div style={styles.priceRow}>
        <span style={styles.priceText}>₹{item.price.toLocaleString()} <span style={styles.perUnit}>/ day</span></span>
        <button style={styles.bookBtn}>Book Ride</button>
      </div>
    </div>
  </motion.div>
);

const GuideCard = ({ item }) => (
  <motion.div
    whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.12)' }}
    style={styles.card}
  >
    <div style={styles.imageContainer}>
      <img src={item.image} alt={item.name} style={styles.cardImage} />
      {item.badge && <div style={styles.badge}>{item.badge}</div>}
    </div>
    <div style={styles.cardContent}>
      <h3 style={styles.cardName}>{item.name}</h3>
      <p style={styles.cardSubtext}>{item.languages}</p>
      <p style={styles.specialtyText}>{item.specialty}</p>
      <div style={styles.ratingRow}>
        <span style={styles.ratingText}>{item.rating} ★</span>
      </div>
      <div style={styles.priceRow}>
        <button style={{ ...styles.bookBtn, width: '100%' }}>Hire Guide</button>
      </div>
    </div>
  </motion.div>
);

const BookingMarketplace = ({ location }) => {
  const [activeTab, setActiveTab] = useState('stays');
  const scrollRef = useRef(null);

  // Map internal tab IDs to location data categories
  const data = location?.categories?.[activeTab] || [];

  const renderCards = () => {
    return data.map(item => {
      if (activeTab === 'stays') return <HomestayCard key={item.id} item={item} />;
      if (activeTab === 'cabs') return <CabCard key={item.id} item={item} />;
      if (activeTab === 'guides') return <GuideCard key={item.id} item={item} />;
      return null;
    });
  };

  return (
    <section style={styles.section}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.heading}>Book Your Journey Essentials</h2>
          <p style={styles.subtext}>Trusted local stays, transport, and guides curated for {location?.name} experiences.</p>
        </div>

        <div style={styles.tabRow}>
          {CATEGORIES.map(tab => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                ...styles.tab,
                background: activeTab === tab.id ? '#3F5E45' : '#fff',
                color: activeTab === tab.id ? '#fff' : '#111',
                boxShadow: activeTab === tab.id ? '0 10px 20px rgba(63, 94, 69, 0.2)' : '0 4px 12px rgba(0,0,0,0.05)',
              }}
            >
              <span style={styles.tabIcon}>{tab.icon}</span>
              <span style={styles.tabLabel}>{tab.label}</span>
            </motion.button>
          ))}
        </div>

        <div style={styles.scrollWrapper}>
          <div style={styles.dragHint}>← Drag to Explore →</div>
          <motion.div
            ref={scrollRef}
            drag="x"
            dragConstraints={{ left: -1000, right: 0 }}
            style={styles.horizontalScroll}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                style={styles.cardGrid}
              >
                {renderCards()}
                {data.length === 0 && (
                  <div style={styles.emptyState}>No items available in this category yet.</div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        <div style={styles.footer}>
          <button style={styles.cta}>
            Need a custom itinerary for {location?.name}? Plan with VANROOTS AI →
          </button>
        </div>
      </div>
    </section>
  );
};

const styles = {
  section: {
    background: '#F6F1E8',
    padding: '80px 0',
    fontFamily: "'Inter', sans-serif",
  },
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 40px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '48px',
  },
  heading: {
    fontSize: '2.5rem',
    fontWeight: 800,
    color: '#111',
    margin: '0 0 12px',
    letterSpacing: '-0.02em',
  },
  subtext: {
    fontSize: '1.1rem',
    color: '#6A665F',
    maxWidth: '600px',
    margin: '0 auto',
  },
  tabRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    marginBottom: '60px',
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '14px 28px',
    borderRadius: '20px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '1rem',
    transition: 'all 0.3s ease',
  },
  tabIcon: {
    fontSize: '1.2rem',
  },
  scrollWrapper: {
    position: 'relative',
    margin: '0 -40px',
    padding: '0 40px',
    overflow: 'hidden',
    cursor: 'grab',
  },
  dragHint: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.75rem',
    color: '#3F5E45',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '2px',
    textAlign: 'center',
    marginBottom: '20px',
    opacity: 0.6,
  },
  emptyState: {
    width: '100%',
    padding: '60px 0',
    textAlign: 'center',
    color: '#6A665F',
    fontStyle: 'italic',
    fontSize: '1rem',
  },
  horizontalScroll: {
    display: 'flex',
    paddingBottom: '40px',
  },
  cardGrid: {
    display: 'flex',
    gap: '24px',
  },
  card: {
    width: '320px',
    background: '#fff',
    borderRadius: '24px',
    overflow: 'hidden',
    boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
    flexShrink: 0,
    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  imageContainer: {
    height: '220px',
    position: 'relative',
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.6s ease',
  },
  badge: {
    position: 'absolute',
    top: '16px',
    left: '16px',
    background: '#3F5E45',
    color: '#fff',
    fontSize: '0.7rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    padding: '6px 12px',
    borderRadius: '12px',
    letterSpacing: '0.5px',
    boxShadow: '0 4px 12px rgba(63, 94, 69, 0.3)',
  },
  cardContent: {
    padding: '24px',
  },
  cardName: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#111',
    margin: '0 0 4px',
  },
  cardSubtext: {
    fontSize: '0.9rem',
    color: '#6A665F',
    margin: '0 0 12px',
  },
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
  },
  ratingText: {
    color: '#C98A3D',
    fontWeight: 700,
    fontSize: '0.95rem',
  },
  vibeText: {
    fontSize: '0.85rem',
    color: '#6A665F',
    fontStyle: 'italic',
  },
  specialtyText: {
    fontSize: '0.9rem',
    color: '#3F5E45',
    fontWeight: 600,
    marginBottom: '12px',
  },
  driverBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: '#3F5E45',
    fontSize: '0.85rem',
    fontWeight: 600,
    marginBottom: '12px',
  },
  infoRow: {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px',
  },
  infoTag: {
    background: '#F1F5F9',
    padding: '4px 10px',
    borderRadius: '8px',
    fontSize: '0.75rem',
    color: '#475569',
    fontWeight: 600,
  },
  priceRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  priceText: {
    fontSize: '1.1rem',
    fontWeight: 800,
    color: '#111',
  },
  perUnit: {
    fontSize: '0.8rem',
    fontWeight: 500,
    color: '#6A665F',
  },
  bookBtn: {
    background: '#3F5E45',
    color: '#fff',
    border: 'none',
    borderRadius: '14px',
    padding: '10px 20px',
    fontSize: '0.9rem',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(63, 94, 69, 0.2)',
  },
  footer: {
    textAlign: 'center',
    marginTop: '40px',
  },
  cta: {
    background: 'none',
    border: 'none',
    color: '#3F5E45',
    fontSize: '1rem',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
    padding: '10px',
  },
};

export default BookingMarketplace;
