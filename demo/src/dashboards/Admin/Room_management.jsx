import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Room_management.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Room_management() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newRoom, setNewRoom] = useState({
    title: "",
    description: "",
    type: "",
    price: "",
    amenities: [],
    isAvailable: true,
    capacity: "",
    image_url: [],
  });
  const [editingRoom, setEditingRoom] = useState(null);
  const [newEditImageUrl, setNewEditImageUrl] = useState("");

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await axios.get("/api/rooms/");
      setRooms(res.data);
    } catch (err) {
      console.error("Failed to fetch rooms", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRoom = async () => {
    try {
      // Frontend validation for ALL required fields
      if (!newRoom.capacity || !newRoom.price || !newRoom.type) {
        alert("Please fill all required fields");
        return;
      }

      if (newRoom.amenities.length === 0) {
        alert("Please add at least one amenity");
        return;
      }

      if (newRoom.image_url.length === 0) {
        alert("Please add at least one image");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        alert("User not logged in");
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const res = await axios.post("/api/rooms/admin", newRoom, config);

      setRooms([...rooms, res.data]);
      setNewRoom({
        title: "",
        description: "",
        type: "",
        price: "",
        amenities: [],
        isAvailable: true,
        capacity: "",
        image_url: [],
      });

      toast.success("Room added successfully!");
    } catch (err) {
      console.error("Failed to add room", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to add room.");
    }
  };

  const handleDeleteRoom = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("User not logged in");
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      await axios.delete(`/api/rooms/admin/${id}`, config);
      setRooms(rooms.filter((room) => room._id !== id));
      toast.success("Room deleted.");
    } catch (err) {
      console.error("Failed to delete room", err);
      toast.error("Failed to delete room.");
    }
  };

  const handleUpdateRoom = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("User not logged in");
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const res = await axios.put(
        `/api/rooms/admin/${editingRoom._id}`,
        editingRoom,
        config
      );

      setEditingRoom(res.data);
      setRooms((prev) =>
        prev.map((room) => (room._id === res.data._id ? res.data : room))
      );
      toast.success("Room updated.");
    } catch (err) {
      console.error("Failed to update room", err);
      toast.error("Failed to update room.");
    }
  };

  const handleEditClick = (room) => {
    setEditingRoom({ ...room });
    setNewEditImageUrl("");
  };

  const toggleAmenity = (amenity, room, setRoomFn) => {
    const current = room.amenities || [];
    const updated = current.includes(amenity)
      ? current.filter((a) => a !== amenity)
      : [...current, amenity];
    setRoomFn({ ...room, amenities: updated });
  };

  const handleAddImage = async () => {
    if (editingRoom) {
      if (!newEditImageUrl.trim()) return;

      const updatedImages = [...(editingRoom.image_url || []), newEditImageUrl];
      const updatedRoom = { ...editingRoom, image_url: updatedImages };

      setEditingRoom(updatedRoom);
      setNewEditImageUrl("");

      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const res = await axios.put(
          `/api/rooms/admin/${editingRoom._id}`,
          updatedRoom,
          config
        );

        setEditingRoom(res.data);
        setRooms((prev) =>
          prev.map((room) => (room._id === res.data._id ? res.data : room))
        );
        toast.success("Image added and saved!");
      } catch (err) {
        console.error("Failed to add image", err);
        toast.error("Failed to add image.");
      }
    } else {
      if (!newImageUrl.trim()) return;
      setNewRoom({
        ...newRoom,
        image_url: [...newRoom.image_url, newImageUrl],
      });
      setNewImageUrl("");
      toast.success("Image added to new room.");
    }
  };

  return (
    <div className="rooms-page">
      <ToastContainer position="top-center" autoClose={3000} />
      <h2>Room Management</h2>

      <div className="add-room-form">
        <h3>{editingRoom ? "Edit Room" : "Add New Room"}</h3>

        <input
          type="text"
          placeholder="Room No."
          value={editingRoom ? editingRoom.title : newRoom.title}
          onChange={(e) =>
            editingRoom
              ? setEditingRoom({ ...editingRoom, title: e.target.value })
              : setNewRoom({ ...newRoom, title: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="Room Description."
          value={editingRoom ? editingRoom.description : newRoom.description}
          onChange={(e) =>
            editingRoom
              ? setEditingRoom({ ...editingRoom, description: e.target.value })
              : setNewRoom({ ...newRoom, description: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="Room Type"
          value={editingRoom ? editingRoom.type : newRoom.type}
          onChange={(e) =>
            editingRoom
              ? setEditingRoom({ ...editingRoom, type: e.target.value })
              : setNewRoom({ ...newRoom, type: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Price"
          value={editingRoom ? editingRoom.price : newRoom.price}
          onChange={(e) =>
            editingRoom
              ? setEditingRoom({ ...editingRoom, price: e.target.value })
              : setNewRoom({ ...newRoom, price: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Capacity"
          value={editingRoom ? editingRoom.capacity : newRoom.capacity}
          onChange={(e) =>
            editingRoom
              ? setEditingRoom({ ...editingRoom, capacity: e.target.value })
              : setNewRoom({ ...newRoom, capacity: e.target.value })
          }
        />

        <div className="amenities-section">
          {["WiFi", "TV", "Minibar"].map((amenity) => (
            <label key={amenity}>
              <input
                type="checkbox"
                checked={
                  editingRoom
                    ? editingRoom.amenities?.includes(amenity)
                    : newRoom.amenities.includes(amenity)
                }
                onChange={() =>
                  editingRoom
                    ? toggleAmenity(amenity, editingRoom, setEditingRoom)
                    : toggleAmenity(amenity, newRoom, setNewRoom)
                }
              />
              {amenity}
            </label>
          ))}
        </div>

        <div className="image-section">
          <input
            type="text"
            placeholder="Image URL"
            value={editingRoom ? newEditImageUrl : newImageUrl}
            onChange={(e) =>
              editingRoom
                ? setNewEditImageUrl(e.target.value)
                : setNewImageUrl(e.target.value)
            }
          />
          <button type="button" onClick={handleAddImage}>
            Add Image
          </button>
        </div>

        <button onClick={editingRoom ? handleUpdateRoom : handleAddRoom}>
          {editingRoom ? "Update Room" : "Add Room"}
        </button>
      </div>

      {loading ? (
        <p>Loading rooms...</p>
      ) : rooms.length === 0 ? (
        <p>No rooms found</p>
      ) : (
        <div className="rooms-list">
          {rooms.map((room) => (
            <div className="room-card" key={room._id}>
              <div className="room-info">
                <h3>{room.type}</h3>
                <p>Price: ₹{room.price}</p>
                <p>Capacity: {room.capacity}</p>
                <p>Amenities: {room.amenities?.join(", ")}</p>
              </div>

              <div className="image-preview">
                {room.image_url?.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt={`room-${i}`}
                    className="room-image"
                  />
                ))}
              </div>

              <div className="room-actions">
                <button
                  className="edit-btn"
                  onClick={() => handleEditClick(room)}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteRoom(room._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Room_management;
