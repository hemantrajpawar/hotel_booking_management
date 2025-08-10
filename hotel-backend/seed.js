const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Room = require('./models/rooms'); // Make sure this path is correct

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const seedRooms = async () => {
  await connectDB();

  await Room.deleteMany(); // Clear existing
  await Room.insertMany([
    {
      "room_no": 101,
      "title": "Deluxe Room with Sea View",
      "description": "Spacious room with ocean-facing balcony and king-size bed.",
      "type": "deluxe",
      "price": 2200,
      "capacity": 2,
      "amenities": ["WiFi", "AC", "TV", "Mini Fridge", "Balcony"],
      "isAvailable": true,
      "image_url": [
        "https://example.com/deluxe1.jpg",
        "https://example.com/deluxe2.jpg"
      ]
    },
    {
      "room_no": 102,
      "title": "Single Budget Room",
      "description": "Compact room ideal for solo travelers.",
      "type": "single",
      "price": 700,
      "capacity": 1,
      "amenities": ["Fan", "WiFi"],
      "isAvailable": true,
      "image_url": [
        "https://example.com/single1.jpg"
      ]
    },
    {
      "room_no": 103,
      "title": "Double Room",
      "description": "Comfortable room for two with all basic facilities.",
      "type": "double",
      "price": 1200,
      "capacity": 2,
      "amenities": ["WiFi", "TV", "AC"],
      "isAvailable": false,
      "image_url": [
        "https://example.com/double1.jpg"
      ]
    },
    {
      "room_no": 104,
      "title": "Luxury Suite",
      "description": "Premium suite with living area and private jacuzzi.",
      "type": "suite",
      "price": 3500,
      "capacity": 4,
      "amenities": ["WiFi", "TV", "AC", "Bathtub", "Private Dining"],
      "isAvailable": true,
      "image_url": [
        "https://example.com/suite1.jpg",
        "https://example.com/suite2.jpg"
      ]
    }
  ]
  );

  console.log('✅ Room data inserted!');
  process.exit();
};

seedRooms();
