import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { bookingService } from '../../services/bookingService';
import locations from '../../data/locations.js';
import CategoryTabs from './CategoryTabs.jsx';
import ListingCard from './ListingCard.jsx';
import DetailPanel from './DetailPanel.jsx';

import MyAccount from '../account/MyAccount.jsx';
import './BookingLayout.css';

const LocationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState(id || 'shillong');
  const location = locations[selectedLocation];

  useEffect(() => {
    if (id && locations[id]) setSelectedLocation(id);
  }, [id]);

  const [activeTab, setActiveTab] = useState('stays');
  const [selectedItem, setSelectedItem] = useState(null);
  const [days, setDays] = useState(1);
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showStatusPanel, setShowStatusPanel] = useState(false);
  
  // SMART TOUR BOOKING FLOW STATES
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];
  
  const [startDate, setStartDate] = useState(today);
  const [selectedCabType, setSelectedCabType] = useState('sedan');
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [paymentStep, setPaymentStep] = useState('summary'); // 'summary' | 'processing' | 'success'
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('upi');

  useEffect(() => {
    if (activeTab === 'stays') {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      setDays(diff > 0 ? diff : 1);
    } else if (activeTab === 'packages' && selectedItem?.packageDays) {
      setDays(selectedItem.packageDays);
    }
  }, [checkIn, checkOut, activeTab, selectedItem]);
  
  const cabRates = { sedan: 2500, suv: 3500, traveller: 5000 };

  let itemCost = 0;
  let packageCost = 0;
  
  if (selectedItem) {
    if (activeTab === 'stays') {
      itemCost = selectedItem.price * days;
    } else if (activeTab === 'packages') {
      itemCost = selectedItem.price;
      packageCost = cabRates[selectedCabType] * (selectedItem.packageDays || 1);
    }
  }

  const subtotal = itemCost + packageCost;
  const roomCharge = itemCost;
  const cabCharge = packageCost;
  const gst = subtotal * 0.05;
  const platformFee = 99;
  const serviceCharge = activeTab === 'stays' ? 150 : 300;
  const discount = subtotal > 10000 ? 500 : 0;
  const totalPrice = subtotal + gst + platformFee + serviceCharge - discount;

  useEffect(() => {
    if (isBookingConfirmed) {
      const timer = setTimeout(() => {
        setIsBookingConfirmed(false);
        setSelectedItem(null);
        setShowStatusPanel(true); // Auto open My Account after success
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isBookingConfirmed]);

  // Handle Scroll Locking
  useEffect(() => {
    if (showBookingModal || isBookingConfirmed || showStatusPanel) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showBookingModal, isBookingConfirmed, showStatusPanel]);

  // Force Scroll Refresh (crucial for GSAP/Lenis)
  useEffect(() => {
    if (!showBookingModal && !isBookingConfirmed && !showStatusPanel) {
      const timer = setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [showBookingModal, isBookingConfirmed, showStatusPanel]);

  const [exiting, setExiting] = useState(false);

  // Refs for the two inner scroll containers
  const cardsRef = useRef(null);
  const detailsRef = useRef(null);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));

    // Stop Lenis smooth scroll while the booking overlay is active
    // This prevents Lenis from interfering with the fixed-position booking page
    const lenis = window.__vanrootsLenis;
    if (lenis) lenis.stop();

    // Prevent Lenis (or any parent scroll driver) from intercepting
    // wheel events inside these two independently-scrollable columns.
    const stopScroll = (e) => e.stopPropagation();
    const cardsEl = cardsRef.current;
    const detailsEl = detailsRef.current;
    cardsEl?.addEventListener('wheel', stopScroll, { passive: true });
    detailsEl?.addEventListener('wheel', stopScroll, { passive: true });

    return () => {
      // Always restart Lenis when leaving the booking page
      if (lenis) lenis.start();
      // Also ensure body overflow is clean
      document.body.style.overflow = '';
      cardsEl?.removeEventListener('wheel', stopScroll);
      detailsEl?.removeEventListener('wheel', stopScroll);
    };
  }, []);

  // Smooth fade-out then navigate back
  const goBack = () => {
    if (exiting) return;
    setExiting(true);
    setTimeout(() => {
      // Restart Lenis BEFORE navigating so it's ready when homepage mounts
      const lenis = window.__vanrootsLenis;
      if (lenis) lenis.start();
      navigate('/');
    }, 280);
  };

  // Reset selection on tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedItem(null);
  };

  if (!location) {
    return (
      <div style={s.notFound}>
        <h2 style={{ fontFamily: "'Inter', sans-serif", color: '#111' }}>Location not found</h2>
        <button onClick={goBack} style={s.goBackBtn}>← Go Home</button>
      </div>
    );
  }

  const listings = location.categories?.[activeTab] || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: exiting ? 0 : (visible ? 1 : 0) }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      style={s.root}
    >
      {/* ── LEFT: Scenic Destination Card ── */}
      <div style={{ ...s.heroCard, backgroundImage: `url(${location.heroImage})` }}>
        <div style={s.heroOverlay} />

        {/* Back button */}
        <button onClick={goBack} style={s.backBtn}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>

        {/* VANROOTS badge */}
        <div style={s.vanrootsBadge}>VANROOTS</div>

        {/* Bottom overlay content */}
        <div style={s.heroContent}>
          <p style={s.heroBadge}>{location.badge}</p>
          <h1 style={s.heroTitle}>Let's make wonderful journeys</h1>
          <p style={s.heroTagline}>{location.tagline}</p>

          <div style={s.heroMeta}>
            <div style={s.metaStat}>
              <span style={s.metaNum}>{location.rating}</span>
              <span style={s.metaLabel}>⭐ Rating</span>
            </div>
            <div style={s.metaDivider} />
            <div style={s.metaStat}>
              <span style={s.metaNum}>{location.reviews?.toLocaleString()}</span>
              <span style={s.metaLabel}>Reviews</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 16px 40px rgba(24,194,164,0.5)' }}
            whileTap={{ scale: 0.97 }}
            style={s.exploreBtn}
          >
            Explore {location.name}
          </motion.button>
        </div>
      </div>

      {/* ── RIGHT: Booking Panel ── */}
      <div style={s.rightPanel}>
        {/* ── NEW BOOKING HEADER ── */}
        <header className="booking-header" style={s.bookingHeader}>
          <div className="left">
            <select
              value={selectedLocation}
              onChange={(e) => {
                const newLoc = e.target.value;
                setSelectedLocation(newLoc);
                setSelectedItem(null);
                setGuests(1);
                setDays(1);
                navigate(`/booking/${newLoc}`, { replace: true });
              }}
              style={s.locationSelect}
            >
              {Object.keys(locations).map(locId => (
                <option key={locId} value={locId}>
                  📍 {locations[locId].name}, Meghalaya
                </option>
              ))}
            </select>
          </div>
          <div className="right" style={{ display: 'flex', gap: 10 }}>

            <button onClick={() => setShowStatusPanel(true)} style={s.myAccountBtn}>
              My Account
            </button>
          </div>
        </header>

        {/* Top Tabs Header */}
        <CategoryTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          locationName={location.name}
        />

        {/* Main content area */}
        <div className="booking-container" style={s.contentArea}>
          {!selectedItem ? (
            <>
              {/* Listing column */}
              <div className="booking-left" style={s.listingCol}>
                <div style={s.popularHeader}>
                  <h3 style={s.popularTitle}>Popular</h3>
                  <span style={s.popularCount}>{listings.length} found</span>
                </div>

                <div ref={cardsRef} style={s.cardScroll}>
                  <AnimatePresence mode="popLayout">
                    {listings.map((item, idx) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: idx * 0.06, duration: 0.35, ease: 'easeOut' }}
                      >
                        <ListingCard
                          item={item}
                          active={selectedItem?.id === item.id}
                          onClick={() => setSelectedItem(item)}
                          activeTab={activeTab}
                        />
                      </motion.div>
                    ))}
                    {listings.length === 0 && (
                      <div style={s.emptyMsg}>No listings available yet.</div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Detail Panel column (Empty state) */}
              <div ref={detailsRef} className="booking-right" style={s.detailCol}>
                <DetailPanel item={null} />
              </div>
            </>
          ) : (
            <>
              {/* Left Panel: Booking Form */}
              <div className="left-panel">
                <button onClick={() => setSelectedItem(null)} style={s.backToListBtn}>← Back to Listings</button>
                
                <div style={s.bookingForm}>
                  <h2 style={s.formTitle}>Complete your booking</h2>

                  {activeTab === 'stays' && (
                    <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
                      <div style={{ flex: 1 }}>
                        <span style={s.label}>Check-in</span>
                        <input 
                          type="date" 
                          value={checkIn} 
                          min={today}
                          onChange={e => {
                            setCheckIn(e.target.value);
                            if (e.target.value >= checkOut) {
                              const nextDay = new Date(new Date(e.target.value).setDate(new Date(e.target.value).getDate() + 1)).toISOString().split('T')[0];
                              setCheckOut(nextDay);
                            }
                          }} 
                          style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #ccc', fontFamily: "'Inter', sans-serif", fontSize: '0.85rem', outline: 'none', marginTop: 6 }} 
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={s.label}>Check-out</span>
                        <input 
                          type="date" 
                          value={checkOut} 
                          min={new Date(new Date(checkIn).setDate(new Date(checkIn).getDate() + 1)).toISOString().split('T')[0]}
                          onChange={e => setCheckOut(e.target.value)} 
                          style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #ccc', fontFamily: "'Inter', sans-serif", fontSize: '0.85rem', outline: 'none', marginTop: 6 }} 
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === 'packages' && (
                    <div style={{ marginBottom: 24 }}>
                      <span style={s.label}>Start Date</span>
                      <input 
                          type="date" 
                          value={startDate} 
                          min={today}
                          onChange={e => setStartDate(e.target.value)} 
                          style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #ccc', fontFamily: "'Inter', sans-serif", fontSize: '0.85rem', outline: 'none', marginTop: 6 }} 
                        />
                    </div>
                  )}

                  {activeTab === 'packages' && (
                    <div style={{ marginBottom: 24, padding: 16, background: '#f8f8f8', borderRadius: 8 }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                         <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.85rem', fontWeight: 600 }}>Duration</span>
                         <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.85rem', fontWeight: 700, color: '#18C2A4' }}>{selectedItem?.packageDays || days} Days</span>
                       </div>
                       
                       <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                         <span style={{ fontSize: '1rem' }}>✔</span>
                         <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.8rem', fontWeight: 600, color: '#18C2A4' }}>Local Expert Guide Included</span>
                       </div>

                       {selectedItem?.places && (
                         <div>
                           <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', fontWeight: 600, color: '#555' }}>Places Included:</span>
                           <p style={{ margin: '4px 0 0', fontFamily: "'Inter', sans-serif", fontSize: '0.8rem', color: '#888', lineHeight: 1.4 }}>{selectedItem.places}</p>
                         </div>
                       )}
                    </div>
                  )}

                  {activeTab === 'packages' && (
                    <div style={{ marginTop: 24, padding: 16, background: '#fff', borderRadius: 12, border: '1px solid rgba(0,0,0,0.06)' }}>
                      <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.95rem', fontWeight: 700, margin: '0 0 16px' }}>Choose Vehicle</h3>
                      <select
                        value={selectedCabType}
                        onChange={(e) => setSelectedCabType(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #ccc', fontFamily: "'Inter', sans-serif", fontSize: '0.85rem', outline: 'none', cursor: 'pointer', marginBottom: 12 }}
                      >
                        <option value="sedan">Hatchback/Sedan (4 Seats)</option>
                        <option value="suv">SUV (6 Seats)</option>
                        <option value="traveller">Traveller (12 Seats)</option>
                      </select>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', color: '#888', margin: 0 }}>
                        Pricing updates dynamically based on vehicle type.
                      </p>
                    </div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowBookingModal(true)}
                    style={{ ...s.confirmSubmitBtn, marginTop: 32 }}
                  >
                    Confirm Booking • ₹{Math.round(totalPrice).toLocaleString()}
                  </motion.button>
                </div>
              </div>

              {/* Right Panel: Service Preview */}
              <div className="right-panel">
                <div style={s.previewCard}>
                  <div style={{ ...s.previewImg, backgroundImage: `url(${selectedItem.image})` }} />
                  <div style={s.previewContent}>
                    <div style={s.previewLoc}>{location.name}</div>
                    <h3 style={s.previewTitle}>{selectedItem.title}</h3>
                    <div style={{ marginTop: 12, padding: 12, background: '#f8f8f8', borderRadius: 8 }}>
                      {activeTab === 'stays' && (
                        <>
                          <p style={{ margin: '0 0 6px', fontFamily: "'Inter', sans-serif", fontSize: '0.85rem', color: '#555' }}>
                            <strong style={{ color: '#111' }}>Check-in:</strong> {checkIn}
                          </p>
                          <p style={{ margin: 0, fontFamily: "'Inter', sans-serif", fontSize: '0.85rem', color: '#555' }}>
                            <strong style={{ color: '#111' }}>Check-out:</strong> {checkOut}
                          </p>
                        </>
                      )}
                      {activeTab === 'packages' && (
                        <>
                          <p style={{ margin: '0 0 6px', fontFamily: "'Inter', sans-serif", fontSize: '0.85rem', color: '#555' }}>
                            <strong style={{ color: '#111' }}>Start Date:</strong> {startDate}
                          </p>
                          <p style={{ margin: 0, fontFamily: "'Inter', sans-serif", fontSize: '0.85rem', color: '#555' }}>
                            <strong style={{ color: '#111' }}>Duration:</strong> {selectedItem.packageDays || days} Days
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>


      </div>

      {/* ── Success Overlay ── */}
      <AnimatePresence>
        {isBookingConfirmed && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={s.successOverlay}
          >
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={s.successBox}>
              <div style={s.successIcon}>✓</div>
              <h2 style={s.successTitle}>Booking Confirmed</h2>
              <p style={s.successMsg}>Your journey begins 🌿</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Booking Status Panel ── */}
      <AnimatePresence>
        {showStatusPanel && (
          <MyAccount onClose={() => setShowStatusPanel(false)} />
        )}
      </AnimatePresence>

      {/* ── Booking Modal Overlay ── */}
      <AnimatePresence>
        {showBookingModal && selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={s.modalOverlay}
          >
            <motion.div 
               initial={{ scale: 0.9, opacity: 0 }} 
               animate={{ scale: 1, opacity: 1 }} 
               exit={{ scale: 0.9, opacity: 0 }} 
               style={s.modalBox}
            >
              {paymentStep === 'summary' && (
                <>
                  <h3 style={s.modalHeader}>Confirm Booking</h3>
                  
                  <div style={s.modalImgWrap}>
                     <img src={selectedItem.image} style={s.modalImg} alt="" />
                  </div>
                  <h4 style={s.modalTitle}>{selectedItem.title}</h4>

                   <div style={s.modalDetails}>
                     {activeTab === 'stays' ? (
                       <>
                         <p><strong>Check-in:</strong> {checkIn}</p>
                         <p><strong>Check-out:</strong> {checkOut}</p>
                         <p><strong>Total Nights:</strong> {days}</p>
                       </>
                     ) : (
                       <>
                         <p><strong>Start Date:</strong> {startDate}</p>
                         <p><strong>Duration:</strong> {selectedItem.packageDays || days} Days</p>
                       </>
                     )}
                     {activeTab === 'packages' && <p><strong>Vehicle:</strong> Included ({selectedCabType.toUpperCase()})</p>}
                     <p><strong>Pickup:</strong> {(activeTab === 'stays' || activeTab === 'packages') && selectedItem ? `${selectedItem.title}, ${locations[selectedLocation]?.name}` : "Manual Pickup"}</p>
                   </div>

                  <div style={s.priceBreakdown}>
                    <h5 style={s.breakdownTitle}>Price Breakdown</h5>
                    <div style={s.modalPriceRow}>
                      <p>{activeTab === 'stays' ? 'Room Charge' : 'Base Package'}</p>
                      <p>₹{Math.round(itemCost).toLocaleString()}</p>
                    </div>
                    {packageCost > 0 && <div style={s.modalPriceRow}><p>Dedicated Cab</p><p>₹{Math.round(packageCost).toLocaleString()}</p></div>}
                    <div style={s.modalPriceRow}><p>GST (5%)</p><p>₹{Math.round(gst).toLocaleString()}</p></div>
                    <div style={s.modalPriceRow}><p>Platform Fee</p><p>₹{platformFee}</p></div>
                    <div style={s.modalPriceRow}><p>Service Charge</p><p>₹{serviceCharge}</p></div>
                    {discount > 0 && <div style={{ ...s.modalPriceRow, color: '#18C2A4' }}><p>Discount</p><p>- ₹{discount}</p></div>}
                    <div style={{ ...s.modalPriceRow, ...s.modalTotal }}><p>Total Amount</p><p>₹{Math.round(totalPrice).toLocaleString()}</p></div>
                  </div>

                  <div style={s.paymentSection}>
                    <h5 style={s.breakdownTitle}>Select Payment Method</h5>
                    <div style={s.paymentGrid}>
                      {['upi', 'card', 'netbanking', 'wallet'].map(m => (
                        <button 
                          key={m}
                          onClick={() => setSelectedPaymentMethod(m)}
                          style={{
                            ...s.payMethodBtn,
                            borderColor: selectedPaymentMethod === m ? '#18C2A4' : '#eee',
                            background: selectedPaymentMethod === m ? '#18C2A40A' : '#fff'
                          }}
                        >
                          <span style={{ textTransform: 'capitalize' }}>{m}</span>
                        </button>
                      ))}
                    </div>
                    
                    {selectedPaymentMethod === 'upi' && (
                      <div style={s.upiList}>
                        {['Google Pay', 'PhonePe', 'Paytm', 'BHIM'].map(u => (
                          <div key={u} style={s.upiItem}>
                            <div style={s.upiDot} />
                            <span>{u}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={s.trustBadges}>
                     <div style={s.badge}><span style={{ color: '#18C2A4' }}>🛡️</span> Secure Booking</div>
                     <div style={s.badge}><span style={{ color: '#18C2A4' }}>⚡</span> Instant Confirmation</div>
                  </div>

                  <div style={s.modalActions}>
                    <button 
                      onClick={() => {
                        setPaymentStep('processing');
                        setTimeout(() => {
                          const isHomestay = activeTab === 'stays' || activeTab === 'homestays';
                          const finalPickup = (isHomestay && selectedItem)
                            ? `${selectedItem.title}, ${locations[selectedLocation]?.name}`
                            : "Manual Pickup";

                          const payload = {
                            id: Date.now(),
                            location: selectedLocation || "Unknown",
                            title: selectedItem?.title || "Trip",
                            image: selectedItem?.image || "",
                            checkIn: activeTab === 'stays' ? checkIn : null,
                            checkOut: activeTab === 'stays' ? checkOut : null,
                            pickup: finalPickup,
                            days,
                            totalPrice,
                            paymentMethod: selectedPaymentMethod.toUpperCase(),
                            status: "confirmed"
                          };
                          
                          bookingService.create(payload);
                          setPaymentStep('success');
                        }, 2000);
                      }}
                      style={s.modalPayBtn}
                    >
                      Pay Securely • ₹{Math.round(totalPrice).toLocaleString()}
                    </button>
                    <button onClick={() => setShowBookingModal(false)} style={s.modalCancelBtn}>
                      Cancel
                    </button>
                  </div>
                </>
              )}

              {paymentStep === 'processing' && (
                <div style={s.processingContainer}>
                   <motion.div 
                     animate={{ rotate: 360 }}
                     transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                     style={s.spinner}
                   />
                   <h3 style={s.processingTitle}>Processing Payment...</h3>
                   <p style={s.processingSub}>Please do not refresh or close the page.</p>
                </div>
              )}

              {paymentStep === 'success' && (
                <div style={s.successContainer}>
                   <div style={s.successIcon}>✓</div>
                   <h3 style={s.successTitle}>Booking Successful!</h3>
                   <p style={s.successSub}>A confirmation email has been sent to your registered address.</p>
                   <div style={s.successSummary}>
                      <div style={s.summaryRow}><span>Transaction ID</span><span>#VNRT{Date.now().toString().slice(-6)}</span></div>
                      <div style={s.summaryRow}><span>Paid Amount</span><span>₹{Math.round(totalPrice).toLocaleString()}</span></div>
                   </div>
                   <button 
                     onClick={() => {
                       setShowBookingModal(false);
                       setSelectedItem(null);
                       setPaymentStep('summary');
                       setShowStatusPanel(true);
                     }}
                     style={s.modalPayBtn}
                   >
                     View in My Account
                   </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const s = {
  root: {
    position: 'fixed', inset: 0, zIndex: 9999,
    display: 'grid',
    gridTemplateColumns: '38% 62%',
    background: '#DDE9E6',
    overflow: 'hidden',
    fontFamily: "'Inter', sans-serif",
  },

  /* LEFT HERO */
  heroCard: {
    position: 'relative',
    backgroundSize: 'cover', backgroundPosition: 'center',
    display: 'flex', flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 24, margin: 16,
    borderRadius: 28,
    overflow: 'hidden',
    boxShadow: '0 24px 60px rgba(0,0,0,0.18)',
  },
  heroOverlay: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, transparent 35%, rgba(0,0,0,0.65) 100%)',
  },
  backBtn: {
    position: 'relative', zIndex: 10,
    width: 44, height: 44, borderRadius: 14,
    background: 'rgba(255,255,255,0.15)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.25)',
    cursor: 'pointer', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  vanrootsBadge: {
    position: 'absolute', top: 24, right: 24, zIndex: 10,
    background: 'rgba(255,255,255,0.15)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.3)',
    color: '#fff',
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.72rem', fontWeight: 800,
    letterSpacing: '2px', padding: '6px 14px', borderRadius: 10,
  },
  heroContent: {
    position: 'relative', zIndex: 10,
    display: 'flex', flexDirection: 'column', gap: 12,
  },
  heroBadge: {
    display: 'inline-block',
    background: '#18C2A4', color: '#fff',
    fontFamily: "'Inter', sans-serif", fontSize: '0.72rem',
    fontWeight: 700, letterSpacing: '1px',
    padding: '5px 12px', borderRadius: 10, width: 'fit-content',
    boxShadow: '0 4px 16px rgba(24,194,164,0.4)', margin: 0,
  },
  heroTitle: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 'clamp(1.5rem, 2.8vw, 2.4rem)',
    fontWeight: 800, color: '#fff', margin: 0,
    lineHeight: 1.15, letterSpacing: '-0.5px',
  },
  heroTagline: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)', margin: 0,
  },
  heroMeta: { display: 'flex', alignItems: 'center', gap: 14 },
  metaStat: { display: 'flex', flexDirection: 'column', gap: 2 },
  metaNum: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '1.2rem', fontWeight: 800, color: '#fff',
  },
  metaLabel: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)',
  },
  metaDivider: { width: 1, height: 32, background: 'rgba(255,255,255,0.3)' },
  exploreBtn: {
    background: 'linear-gradient(135deg, #18C2A4, #0fa88e)',
    color: '#fff', border: 'none', borderRadius: 18,
    padding: '14px 28px', cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.95rem', fontWeight: 700,
    boxShadow: '0 10px 28px rgba(24,194,164,0.38)',
    width: 'fit-content', transition: 'all 0.3s ease',
  },

  /* RIGHT PANEL */
  rightPanel: {
    display: 'flex', flexDirection: 'column',
    background: '#F8F5F2',
    overflow: 'hidden',
    margin: '16px 16px 16px 0',
    borderRadius: 28,
    boxShadow: '0 8px 40px rgba(0,0,0,0.06)',
    position: 'relative',
  },
  contentArea: {
    flex: 1,
    minHeight: 0, /* CRITICAL: allows flex children to shrink and scroll */
  },

  /* LISTINGS */
  listingCol: {
    borderRight: '1px solid rgba(0,0,0,0.06)',
    background: '#F8F5F2',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0, /* allows cardScroll to own the overflow */
    overflow: 'hidden',
  },
  popularHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '20px 24px 10px',
    flexShrink: 0, /* header must not compress */
  },
  popularTitle: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '1rem', fontWeight: 800, color: '#111', margin: 0,
  },
  popularCount: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.78rem', color: '#18C2A4', fontWeight: 700,
    background: '#DDE9E6', padding: '4px 10px', borderRadius: 10,
  },
  cardScroll: {
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
    overflowX: 'hidden',
    padding: '4px 16px 120px',
    display: 'flex', flexDirection: 'column', gap: 14,
    WebkitOverflowScrolling: 'touch',
    overscrollBehavior: 'contain',
    scrollbarWidth: 'thin',
    scrollbarColor: 'rgba(24,194,164,0.35) transparent',
  },
  emptyMsg: {
    fontFamily: "'Inter', sans-serif", fontSize: '0.95rem',
    color: '#888', textAlign: 'center', marginTop: 40,
  },
  modalOverlay: {
    position: 'fixed', inset: 0, zIndex: 99999,
    background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  modalBox: {
    background: '#fff', padding: '30px', borderRadius: '24px', width: '400px',
    maxWidth: '90%', boxShadow: '0 24px 60px rgba(0,0,0,0.2)'
  },
  modalHeader: {
    fontFamily: "'Inter', sans-serif", fontSize: '1.4rem', fontWeight: 800, margin: '0 0 20px', color: '#111'
  },
  modalImgWrap: {
    width: '100%', height: '180px', borderRadius: '16px', overflow: 'hidden', marginBottom: '16px'
  },
  modalImg: {
    width: '100%', height: '100%', objectFit: 'cover'
  },
  modalTitle: {
    fontFamily: "'Inter', sans-serif", fontSize: '1.2rem', fontWeight: 700, margin: '0 0 16px', color: '#111'
  },
  modalDetails: {
    fontFamily: "'Inter', sans-serif", fontSize: '0.95rem', color: '#555', marginBottom: '20px', lineHeight: 1.6
  },
  modalPriceRow: {
    display: 'flex', justifyContent: 'space-between', fontFamily: "'Inter', sans-serif", fontSize: '0.95rem', color: '#555', marginBottom: '8px'
  },
  modalTotal: {
    fontSize: '1.2rem', fontWeight: 800, color: '#111', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #eee'
  },
  modalActions: {
    display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px'
  },
  modalPayBtn: {
    background: '#18C2A4', color: '#fff', border: 'none', padding: '16px', borderRadius: '12px', fontSize: '1.05rem', fontWeight: 700, cursor: 'pointer', fontFamily: "'Inter', sans-serif", transition: 'transform 0.2s'
  },
  modalCancelBtn: {
    background: 'transparent', color: '#888', border: 'none', padding: '12px', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', sans-serif"
  },
  backToListBtn: {
    background: 'none', border: 'none', color: '#18C2A4', fontFamily: "'Inter', sans-serif", fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', padding: 0, marginBottom: 20
  },
  bookingForm: {
    background: '#F8F5F2', padding: '30px', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)'
  },
  formTitle: {
    fontFamily: "'Inter', sans-serif", fontSize: '1.4rem', fontWeight: 800, color: '#111', margin: '0 0 24px'
  },
  breakdownTitle: {
    fontFamily: "'Inter', sans-serif", fontSize: '1.05rem', fontWeight: 700, color: '#111', margin: '0 0 16px'
  },
  confirmSubmitBtn: {
    background: '#18C2A4', color: '#fff', border: 'none', borderRadius: '12px', padding: '16px 24px', width: '100%', fontFamily: "'Inter', sans-serif", fontSize: '1.05rem', fontWeight: 700, cursor: 'pointer', marginTop: 24, boxShadow: '0 8px 24px rgba(24,194,164,0.3)'
  },
  previewCard: {
    background: '#fff', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.04)'
  },
  previewImg: {
    width: '100%', height: '220px', backgroundSize: 'cover', backgroundPosition: 'center'
  },
  previewContent: {
    padding: '24px'
  },
  previewLoc: {
    fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', fontWeight: 700, color: '#18C2A4', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 8px'
  },
  previewTitle: {
    fontFamily: "'Inter', sans-serif", fontSize: '1.3rem', fontWeight: 800, color: '#111', margin: '0 0 12px'
  },
  previewMeta: {
    fontFamily: "'Inter', sans-serif", fontSize: '0.9rem', color: '#666', display: 'flex', gap: '8px', alignItems: 'center', marginBottom: 16
  },
  previewDesc: {
    fontFamily: "'Inter', sans-serif", fontSize: '0.95rem', color: '#555', lineHeight: 1.6, margin: 0
  },
  successOverlay: {
    position: 'fixed', inset: 0, zIndex: 99999,
    background: 'rgba(17,17,17,0.7)', backdropFilter: 'blur(12px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  successBox: {
    background: '#fff', padding: '40px', borderRadius: '24px',
    textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
    border: '1px solid #18C2A4'
  },
  successIcon: {
    fontSize: '3rem', color: '#18C2A4', marginBottom: 12,
    border: '3px solid #18C2A4', borderRadius: '50%',
    width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
  },
  successTitle: {
    fontFamily: "'Inter', sans-serif", fontSize: '1.5rem', fontWeight: 800, color: '#111', margin: '0 0 8px'
  },
  successMsg: {
    fontFamily: "'Inter', sans-serif", fontSize: '1rem', color: '#555', margin: 0
  },

  /* DETAIL PANEL */
  detailCol: {
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    background: '#F0EDE9',
    minHeight: 0,
    overflowY: 'auto',
    overflowX: 'hidden',
    WebkitOverflowScrolling: 'touch',
    overscrollBehavior: 'contain',
  },

  /* NOT FOUND */
  notFound: {
    position: 'fixed', inset: 0, zIndex: 10000,
    background: '#F8F5F2',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', gap: 20,
  },
  goBackBtn: {
    padding: '12px 28px', background: '#18C2A4', color: '#fff',
    border: 'none', borderRadius: 14, cursor: 'pointer',
    fontFamily: "'Inter', sans-serif", fontSize: '1rem', fontWeight: 600,
  },

  /* FLOATING BOTTOM BAR */
  floatingBar: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    background: 'rgba(255, 255, 255, 0.75)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.4)',
    borderRadius: 24,
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 12px 40px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.6)',
    zIndex: 50,
  },
  priceCol: {
    display: 'flex', alignItems: 'center', overflow: 'hidden'
  },
  floatPriceText: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '1.4rem',
    fontWeight: 800,
    color: '#111111',
    display: 'flex',
    alignItems: 'baseline',
    gap: 6,
  },
  floatUnit: {
    fontSize: '0.9rem',
    fontWeight: 500,
    color: '#6B6B6B',
  },
  floatBookBtn: {
    background: '#18C2A4',
    color: '#fff',
    border: 'none',
    borderRadius: 18,
    padding: '14px 28px',
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
    fontSize: '1rem',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    transition: 'background 0.3s ease',
  },
  bookingHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    gap: '20px',
    position: 'sticky',
    top: 0,
    background: '#F8F5F2',
    zIndex: 50,
    borderBottom: '1px solid rgba(0,0,0,0.05)',
  },
  locationSelect: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#111',
    background: '#fff',
    border: '1px solid rgba(0,0,0,0.1)',
    borderRadius: '12px',
    padding: '8px 12px',
    cursor: 'pointer',
    outline: 'none',
    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
  },
  myAccountBtn: {
    background: '#18C2A4',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    padding: '8px 16px',
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.85rem',
    fontWeight: 700,
    boxShadow: '0 4px 12px rgba(24,194,164,0.3)',
    transition: 'transform 0.2s',
  },
  configSection: {
    marginTop: 30, padding: 24, background: '#F8F5F2', borderRadius: 16, border: '1px solid rgba(0,0,0,0.05)'
  },
  configTitle: {
    fontFamily: "'Inter', sans-serif", fontSize: '1rem', fontWeight: 700, color: '#111', margin: '0 0 20px'
  },
  dateRow: { display: 'flex', gap: 12, marginBottom: 20 },
  dateInputGroup: { flex: 1, display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { padding: '12px', borderRadius: 10, border: '1px solid #ddd', fontFamily: "'Inter', sans-serif", fontSize: '0.9rem', outline: 'none', background: '#fff' },
  guestRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  guestCtrl: { display: 'flex', alignItems: 'center', gap: 16 },
  guestBtn: { width: 36, height: 36, borderRadius: '50%', border: '1px solid #ccc', background: '#fff', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#111', transition: 'all 0.2s' },
  guestCount: { fontFamily: "'Inter', sans-serif", fontSize: '1.1rem', fontWeight: 700, color: '#111', minWidth: 20, textAlign: 'center' },
  priceBreakdown: { borderTop: '1px dashed #ccc', paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 12 },
  priceRow: { display: 'flex', justifyContent: 'space-between', fontFamily: "'Inter', sans-serif", fontSize: '0.9rem', color: '#555' },
  priceTotal: { display: 'flex', justifyContent: 'space-between', fontFamily: "'Inter', sans-serif", fontSize: '1.1rem', fontWeight: 800, color: '#111', marginTop: 8, paddingTop: 12, borderTop: '1px solid #ddd' },
  priceBreakdown: {
    background: '#f9f9f9',
    padding: '16px',
    borderRadius: '16px',
    marginBottom: '24px',
    border: '1px solid rgba(0,0,0,0.05)'
  },
  paymentSection: {
    marginBottom: '24px'
  },
  paymentGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    marginTop: '12px'
  },
  payMethodBtn: {
    padding: '12px',
    borderRadius: '12px',
    border: '2px solid #eee',
    background: '#fff',
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.85rem',
    fontWeight: 600,
    transition: 'all 0.2s'
  },
  upiList: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
    marginTop: '16px',
    padding: '12px',
    background: '#fff',
    borderRadius: '12px',
    border: '1px solid rgba(0,0,0,0.05)'
  },
  upiItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.8rem',
    color: '#555',
    fontFamily: "'Inter', sans-serif"
  },
  upiDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#18C2A4'
  },
  trustBadges: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px'
  },
  badge: {
    flex: 1,
    background: '#fff',
    padding: '8px',
    borderRadius: '10px',
    fontSize: '0.7rem',
    fontWeight: 700,
    color: '#555',
    textAlign: 'center',
    border: '1px solid rgba(0,0,0,0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px'
  },
  processingContainer: {
    textAlign: 'center',
    padding: '40px 20px'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid rgba(24,194,164,0.1)',
    borderTop: '4px solid #18C2A4',
    borderRadius: '50%',
    margin: '0 auto 20px'
  },
  processingTitle: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '1.2rem',
    fontWeight: 800,
    color: '#111',
    marginBottom: '8px'
  },
  processingSub: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.9rem',
    color: '#888'
  },
  successContainer: {
    textAlign: 'center'
  },
  successSub: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.95rem',
    color: '#555',
    marginBottom: '24px',
    lineHeight: 1.5
  },
  successSummary: {
    background: '#f9f9f9',
    padding: '16px',
    borderRadius: '16px',
    marginBottom: '24px',
    border: '1px solid rgba(0,0,0,0.05)'
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
    fontFamily: "'Inter', sans-serif",
    color: '#666',
    marginBottom: '8px'
  },
};

export default LocationPage;
