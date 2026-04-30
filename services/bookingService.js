const STORAGE_KEY = "vanroots_bookings";

export const bookingService = {
  getAll: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Booking parse error:", e);
      return [];
    }
  },

  create: (data) => {
    const bookings = bookingService.getAll();
    const newBooking = {
      id: Date.now().toString(),
      ...data,
      status: "confirmed",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newBooking, ...bookings];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    return newBooking;
  },

  update: (id, updates) => {
    const bookings = bookingService.getAll().map(b =>
      b.id === id
        ? { ...b, ...updates, updatedAt: new Date().toISOString() }
        : b
    );

    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    return bookings;
  },

  delete: (id) => {
    const bookings = bookingService.getAll().filter(b => b.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    return bookings;
  }
};
