import { openDB } from 'idb';

const DB_NAME = 'hotel-booking-db';
const DB_VERSION = 1;
const STORE_NAME = 'pendingBookings';

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
    }
  },
});

export const saveBookingOffline = async (booking) => {
  const db = await dbPromise;
  await db.add(STORE_NAME, booking);
};