const Room = require("../models/room");

exports.getRooms = async (req, res) => {
    const rooms = await Room.find();
    res.json(rooms);
};


exports.getRoomById = async (req, res) => {
  const room = await Room.findById(req.params.roomId);
  res.json(room);
};


exports.createRoom = async (req, res) => {
  const newRoom = await Room.create(req.body);
  // await newRoom.save();
  //   newRoom.roomURL = `https://localhost:5173/specific/${newRoom._id}`;
  //   await newRoom.save(); // Save again with roomURL
  res.status(201).json(newRoom);
};
