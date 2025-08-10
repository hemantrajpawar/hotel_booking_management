import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Cropper from "react-easy-crop";
import getCroppedImg from "../utils/crop_util";
import "./User_profile.css";

function User_profile() {
  const [user, setUser] = useState({});
  const [firstname, setfirstName] = useState("");
  const [lastname, setlastName] = useState("");
  const [middlename, setmiddleName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [photo, setPhoto] = useState(null); // base64 string
  const [preview, setPreview] = useState("");
  const [original, setOriginal] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", new: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchProfile = useCallback(async () => {
    try {
      const res = await axios.get("/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { firstname,middlename, lastname, email, phone, profilePhoto, ...rest } = res.data;
      setUser(rest);
      setfirstName(firstname);
      setmiddleName(middlename);
      setlastName(lastname);
      setEmail(email);
      setPhone(phone || "");
      setPreview(profilePhoto || "");
    } catch (err) {
      console.error("Profile fetch error", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginal(reader.result);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleCropSave = async () => {
    try {
      const croppedImage = await getCroppedImg(original, croppedAreaPixels);
      setPreview(croppedImage);
      setPhoto(croppedImage); // save base64 string for backend
      setShowCropper(false);
    } catch (e) {
      console.error("Crop error:", e);
    }
  };

  const updateProfile = async () => {
    try {
      const body = {
        firstname,
        middlename,
        lastname,
        email,
        phone,
        photo, // base64 image
      };

      await axios.put("/api/users/profile", body, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage("✅ Profile updated!");
      fetchProfile();
    } catch (err) {
      console.error("Update error", err);
      setMessage("❌ Failed to update profile.");
    }
  };

  const updatePassword = async () => {
    try {
      await axios.put("/api/users/password", passwords, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("🔐 Password updated!");
      setPasswords({ current: "", new: "" });
    } catch (err) {
      console.error("Password change failed", err);
      setMessage("❌ Password update failed.");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="user-profile">
      <h2>👤 User Profile</h2>
      <p><strong>Role:</strong> {user.role}</p>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        {preview && (
          <div style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            overflow: "hidden",
            margin: "0 auto 10px auto",
            border: "2px solid #ccc",
          }}>
            <img
              src={preview}
              alt="Profile"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        )}

        <div className="form-group">
          <label style={{ display: "block", marginBottom: "8px" }}>Update Photo:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            style={{
              margin: "0 auto",
              display: "block",
              padding: "6px 10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              width: "fit-content",
            }}
          />
        </div>
      </div>

      {showCropper && (
        <div className="cropper-modal" style={{ textAlign: "center", marginTop: 20 }}>
          <div style={{ position: "relative", width: "100%", height: "300px" }}>
            <Cropper
              image={original}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={true}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <div style={{ marginTop: 10 }}>
            <button onClick={handleCropSave} style={{ marginRight: "10px" }}>✅ Save Crop</button>
            <button onClick={() => setShowCropper(false)}>❌ Cancel</button>
          </div>
        </div>
      )}

      <div className="form-group">
        <label>firstName:</label>
        <input value={firstname} onChange={(e) => setfirstName(e.target.value)} />
      </div>

      <div className="form-group">
        <label>MiddleName:</label>
        <input value={middlename} onChange={(e) => setmiddleName(e.target.value)} />
      </div>

      <div className="form-group">
        <label>LastName:</label>
        <input value={lastname} onChange={(e) => setlastName(e.target.value)} />
      </div>

      <div className="form-group">
        <label>Email:</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>

      <div className="form-group">
        <label>Mobile:</label>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>

      <button onClick={updateProfile}>💾 Update Profile</button>
      <hr />

      <div className="form-group">
        <label>Current Password:</label>
        <input
          type="password"
          value={passwords.current}
          onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label>New Password:</label>
        <input
          type="password"
          value={passwords.new}
          onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
        />
      </div>

      <button onClick={updatePassword}>🔁 Change Password</button>
      <hr />
      <button className="logout-btn" onClick={logout}>🚪 Logout</button>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default User_profile;
