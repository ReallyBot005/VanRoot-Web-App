import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Mock Data for future API
const initialProviderServices = [
  { id: 'cab1', type: 'cab', location: 'shillong', name: 'Premium SUV', price: 1500, available: true },
  { id: 'stay1', type: 'stay', location: 'shillong', name: 'Pine View Homestay', price: 2200, available: true },
  { id: 'guide1', type: 'guide', location: 'cherrapunji', name: 'Local Waterfall Tour', price: 1200, available: false },
];

const ProviderDashboard = () => {
  const [services, setServices] = useState(initialProviderServices);
  const [isAdding, setIsAdding] = useState(false);
  const [newService, setNewService] = useState({ type: 'cab', location: 'shillong', name: '', price: 0, available: true });

  const handleToggleAvailability = (id) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, available: !s.available } : s));
    // FUTURE: await api.updateService(id, { available: !s.available })
  };

  const handleUpdatePrice = (id, newPrice) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, price: Number(newPrice) } : s));
    // FUTURE: await api.updateService(id, { price: newPrice })
  };

  const handleAddService = () => {
    if (!newService.name || newService.price <= 0) return;
    const servicePayload = { ...newService, id: `srv-${Date.now()}` };
    setServices(prev => [...prev, servicePayload]);
    setIsAdding(false);
    setNewService({ type: 'cab', location: 'shillong', name: '', price: 0, available: true });
    // FUTURE: await api.createService(servicePayload)
  };

  return (
    <div style={s.container}>
      <header style={s.header}>
        <h1 style={s.title}>Provider Dashboard</h1>
        <button onClick={() => setIsAdding(true)} style={s.addBtn}>+ Add Service</button>
      </header>

      {isAdding && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={s.addForm}>
          <h3>Add New Service</h3>
          <div style={s.formGrid}>
            <select value={newService.type} onChange={e => setNewService(p => ({ ...p, type: e.target.value }))} style={s.input}>
              <option value="stay">Homestay</option>
              <option value="cab">Cab</option>
              <option value="guide">Guide</option>
            </select>
            <select value={newService.location} onChange={e => setNewService(p => ({ ...p, location: e.target.value }))} style={s.input}>
              <option value="shillong">Shillong</option>
              <option value="cherrapunji">Cherrapunji</option>
              <option value="dawki">Dawki</option>
            </select>
            <input type="text" placeholder="Service Name" value={newService.name} onChange={e => setNewService(p => ({ ...p, name: e.target.value }))} style={s.input} />
            <input type="number" placeholder="Price" value={newService.price} onChange={e => setNewService(p => ({ ...p, price: Number(e.target.value) }))} style={s.input} />
          </div>
          <div style={s.formActions}>
            <button onClick={handleAddService} style={s.saveBtn}>Save Service</button>
            <button onClick={() => setIsAdding(false)} style={s.cancelBtn}>Cancel</button>
          </div>
        </motion.div>
      )}

      <div style={s.list}>
        {services.map(srv => (
          <motion.div layout key={srv.id} style={{ ...s.card, opacity: srv.available ? 1 : 0.6 }}>
            <div>
              <p style={s.cardType}>{srv.type.toUpperCase()} • {srv.location}</p>
              <h3 style={s.cardName}>{srv.name}</h3>
            </div>
            
            <div style={s.cardActions}>
              <div style={s.priceBox}>
                <span style={s.currency}>₹</span>
                <input
                  type="number"
                  value={srv.price}
                  onChange={(e) => handleUpdatePrice(srv.id, e.target.value)}
                  style={s.priceInput}
                />
              </div>
              
              <button
                onClick={() => handleToggleAvailability(srv.id)}
                style={{ ...s.toggleBtn, background: srv.available ? '#D1FAE5' : '#FFE4E6', color: srv.available ? '#065F46' : '#9F1239' }}
              >
                {srv.available ? 'Available' : 'Unavailable'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const s = {
  container: { padding: 40, maxWidth: 800, margin: '0 auto', fontFamily: "'Inter', sans-serif" },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  title: { fontSize: '2rem', fontWeight: 800, color: '#111', margin: 0 },
  addBtn: { background: '#111', color: '#fff', padding: '10px 20px', borderRadius: 12, border: 'none', fontWeight: 600, cursor: 'pointer' },
  addForm: { background: '#F8F5F2', padding: 24, borderRadius: 16, marginBottom: 24, border: '1px solid rgba(0,0,0,0.05)' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 },
  input: { padding: '12px', borderRadius: 8, border: '1px solid #ddd', fontFamily: "'Inter', sans-serif" },
  formActions: { display: 'flex', gap: 10 },
  saveBtn: { background: '#18C2A4', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 },
  cancelBtn: { background: 'transparent', color: '#666', border: 'none', padding: '10px 20px', cursor: 'pointer', fontWeight: 600 },
  list: { display: 'flex', flexDirection: 'column', gap: 16 },
  card: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: 20, borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
  cardType: { fontSize: '0.75rem', fontWeight: 700, color: '#18C2A4', margin: '0 0 4px' },
  cardName: { fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#111' },
  cardActions: { display: 'flex', alignItems: 'center', gap: 16 },
  priceBox: { display: 'flex', alignItems: 'center', gap: 4, background: '#F8F5F2', padding: '6px 12px', borderRadius: 8 },
  currency: { fontWeight: 600, color: '#666' },
  priceInput: { width: 80, border: 'none', background: 'transparent', fontSize: '1rem', fontWeight: 700, outline: 'none', fontFamily: "'Inter', sans-serif" },
  toggleBtn: { padding: '8px 16px', borderRadius: 8, border: 'none', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' },
};

export default ProviderDashboard;
