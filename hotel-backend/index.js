const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./Database/db');
const path = require("path");
const { Server } = require("socket.io");
const http = require('http');

dotenv.config();
connectDB();

const app = express();
app.use(cors({
  origin: "http://localhost:5173" // The address of your React app
}));
app.use(express.json({ limit: '10mb' }));  


app.use('/api/auth', require('./routes/auth')); //
app.use('/api/rooms', require('./routes/Room')); //
app.use('/api/bookings', require('./routes/bookings')); //
app.use("/api/users", require('./routes/user')); //
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); //
app.use('/api/reviews', require('./routes/Reviews')); //
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/admin', require('./routes/Admin'));
app.use('/api/analytics', require('./routes/Analytical'));
app.use('/api/payment', require('./routes/Payment'));
app.use('/api/chatbot',require("./routes/gemini_api"))



const server = http.createServer(app); // Create an HTTP server from your Express app

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Allow connection from your React app
    methods: ["GET", "POST"]
  }
});


io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);

  // Logic for a user to "join" a room to receive specific updates
  socket.on('join-room-view', (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} is now viewing room ${roomId}`);
  });
  
  // Logic for leaving a room view
  socket.on('leave-room-view', (roomId) => {
    socket.leave(roomId);
    console.log(`Socket ${socket.id} left room view ${roomId}`);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

app.use((req, res, next) => {
  req.io = io;
  next();
});


// ✅ Start listening
server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});