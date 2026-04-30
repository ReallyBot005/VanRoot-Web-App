import React from 'react';
import { motion } from 'framer-motion';

const TABS = [
  { id: 'stays',       label: 'Homestays',       icon: '🏡' },
  { id: 'packages',    label: 'Tour Packages',   icon: '🎒' },
];

const CategoryTabs = ({ activeTab, onTabChange, locationName }) => {
  return (
    <div style={s.wrapper}>
      {/* Header */}
      <div style={s.header}>
        <div>
          <p style={s.exploreLabel}>Explore</p>
          <h2 style={s.locationTitle}>{locationName?.toUpperCase()}</h2>
        </div>
      </div>

      {/* Accent Bar */}
      <div style={s.accentBar} />

      {/* Tabs */}
      <div style={s.tabsRow}>
        {TABS.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              style={s.tabBtn}
            >
              {isActive && (
                <motion.div
                  layoutId="tabPill"
                  style={s.tabPill}
                  transition={{ type: 'spring', damping: 22, stiffness: 350 }}
                />
              )}
              <span style={{ ...s.tabIcon, opacity: isActive ? 1 : 0.6 }}>{tab.icon}</span>
              <span style={{
                ...s.tabLabel,
                color: isActive ? '#fff' : '#666',
                fontWeight: isActive ? 700 : 500,
              }}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const s = {
  wrapper: {
    padding: '28px 28px 0',
    background: '#F8F5F2',
    borderBottom: '1px solid rgba(0,0,0,0.05)',
  },
  header: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 16,
  },
  exploreLabel: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.82rem', color: '#888', margin: '0 0 2px',
    textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600,
  },
  locationTitle: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '2rem', fontWeight: 800, color: '#111', margin: 0,
    letterSpacing: '-0.5px',
  },
  accentBar: {
    height: 3, background: 'linear-gradient(90deg, #18C2A4, rgba(24,194,164,0.2))',
    borderRadius: 4, marginBottom: 20, width: 60,
  },
  tabsRow: {
    display: 'flex', gap: 6, paddingBottom: 20,
    overflowX: 'auto', scrollbarWidth: 'none',
  },
  tabBtn: {
    position: 'relative', display: 'flex', alignItems: 'center', gap: 7,
    padding: '10px 18px', borderRadius: 16, border: 'none',
    background: 'transparent', cursor: 'pointer', whiteSpace: 'nowrap',
    zIndex: 0,
  },
  tabPill: {
    position: 'absolute', inset: 0, borderRadius: 16,
    background: '#18C2A4',
    boxShadow: '0 6px 20px rgba(24,194,164,0.35)',
    zIndex: -1,
  },
  tabIcon: { fontSize: '1rem', position: 'relative', zIndex: 1 },
  tabLabel: {
    fontFamily: "'Inter', sans-serif", fontSize: '0.88rem',
    position: 'relative', zIndex: 1,
    transition: 'color 0.25s, font-weight 0.25s',
  },
};

export default CategoryTabs;
