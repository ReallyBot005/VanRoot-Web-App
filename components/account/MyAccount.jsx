import React, { useEffect, useState } from "react";
import { bookingService } from "../../services/bookingService";

const MyAccount = ({ onClose }) => {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("CONFIRMED");

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("vanroots_bookings")) || [];
      setBookings(data);
    } catch {
      setBookings([]);
    }
  }, []);

  useEffect(() => {
    const updated = bookings.map((b) => {
      if (!b.checkOut) return b;
      
      const today = new Date();
      const outDate = new Date(b.checkOut);

      if ((b.status || "").toLowerCase() === "confirmed" && outDate < today) {
        return { ...b, status: "completed" };
      }

      return b;
    });

    setBookings(updated);
    localStorage.setItem("vanroots_bookings", JSON.stringify(updated));

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
      
      // Force GSAP/Lenis refresh when panel closes
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 100);
    };
  }, []); // Run on mount

  const cancelBooking = (id) => {
    const updated = bookings.map((b) =>
      b.id === id ? { ...b, status: "cancelled" } : b
    );

    setBookings(updated);
    localStorage.setItem("vanroots_bookings", JSON.stringify(updated));
  };

  const filteredBookings = bookings.filter((b) => {
    if (filter === "all") return true;

    const currentStatus = (b.status || "").toLowerCase();

    if (filter === "status") {
      return currentStatus === statusFilter;
    }

    if (filter === "previous") {
      return currentStatus === "completed" || currentStatus === "cancelled";
    }

    return true;
  });

  return (
    <div style={s.overlay}>
      <div style={s.panel}>
        <div style={s.header}>
          <h2 style={{margin: 0, fontFamily: "'Inter', sans-serif", fontSize: '1.2rem', fontWeight: 800}}>My Account</h2>
          <button onClick={onClose} style={s.closeBtn}>✕</button>
        </div>

        <div style={s.filterWrap}>
          <button
            onClick={() => setFilter("all")}
            style={filter === "all" ? s.activeBtn : s.btn}
          >
            All
          </button>

          <select
            value={statusFilter}
            onChange={(e) => {
              setFilter("status");
              setStatusFilter(e.target.value);
            }}
            style={{
              ...s.dropdown,
              border: filter === "status" ? "1px solid #000" : "1px solid #ccc"
            }}
          >
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <button
            onClick={() => setFilter("previous")}
            style={filter === "previous" ? s.activeBtn : s.btn}
          >
            Previous
          </button>
        </div>

        <div style={s.content}>
          {filteredBookings.length === 0 ? (
            <p style={{fontFamily: "'Inter', sans-serif", color: '#888', textAlign: 'center', marginTop: 40}}>No bookings found</p>
          ) : (
            filteredBookings.map((b) => (
              <div key={b.id} style={s.card}>
                <h3 style={s.cardTitle}>{b.location || b.title || "Trip"}</h3>
                <p style={s.cardStatus}>
                  Status: 
                  <span style={{
                    marginLeft: 6,
                    fontWeight: 700,
                    color:
                      (b.status || "").toLowerCase() === "confirmed" ? "green" :
                      (b.status || "").toLowerCase() === "cancelled" ? "red" :
                      "blue"
                  }}>
                    {b.status || "confirmed"}
                  </span>
                </p>
                <p style={s.cardPrice}>₹{b.totalPrice}</p>
                
                {(b.status || "").toLowerCase() === "confirmed" && (
                  <button onClick={() => cancelBooking(b.id)} style={s.cancelBtn}>
                    Cancel
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const s = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "flex-end",
    zIndex: 999999
  },
  panel: {
    width: "420px",
    height: "100vh",
    background: "#F7F4EE",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden"
  },
  header: {
    padding: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid rgba(0,0,0,0.08)"
  },
  closeBtn: {
    background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer'
  },
  content: {
    flex: 1,
    overflowY: "auto",
    padding: "20px"
  },
  card: {
    padding: "16px",
    background: "#fff",
    marginBottom: "12px",
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
  },
  cardTitle: {
    fontFamily: "'Inter', sans-serif", fontSize: '1.05rem', fontWeight: 700, color: '#111', margin: '0 0 8px'
  },
  cardStatus: {
    fontFamily: "'Inter', sans-serif", fontSize: '0.85rem', color: '#666', margin: '0 0 4px'
  },
  cardPrice: {
    fontFamily: "'Inter', sans-serif", fontSize: '0.95rem', fontWeight: 800, color: '#18C2A4', margin: 0
  },
  filterWrap: {
    display: "flex",
    gap: "8px",
    padding: "16px",
    borderBottom: "1px solid rgba(0,0,0,0.08)",
    marginBottom: "16px"
  },
  btn: {
    padding: "8px 14px",
    border: "1px solid #ccc",
    background: "#fff",
    cursor: "pointer",
    marginRight: "8px",
    borderRadius: "8px",
    fontFamily: "'Inter', sans-serif", 
    fontSize: "0.85rem"
  },
  activeBtn: {
    padding: "8px 14px",
    border: "1px solid #000",
    background: "#000",
    color: "#fff",
    cursor: "pointer",
    marginRight: "8px",
    borderRadius: "8px",
    fontFamily: "'Inter', sans-serif", 
    fontSize: "0.85rem"
  },
  dropdown: {
    padding: "8px 12px",
    border: "1px solid #ccc",
    background: "#fff",
    marginRight: "8px",
    cursor: "pointer",
    borderRadius: "8px",
    fontFamily: "'Inter', sans-serif", 
    fontSize: "0.85rem",
    outline: "none"
  },
  cancelBtn: {
    marginTop: "12px", padding: "8px 16px", background: "#FFE4E6", color: "#9F1239",
    border: "none", borderRadius: "8px", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", fontWeight: 700
  }
};

export default MyAccount;
