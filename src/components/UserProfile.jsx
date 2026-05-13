import { useState } from "react";
import { updateUser } from "../api/userApi";

function UserProfile({ user, title = "Profile", onUserUpdate, onClose }) {
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    status: user?.status || "active",
  });
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const updateField = (field, value) => {
    setProfile((oldProfile) => ({
      ...oldProfile,
      [field]: value,
    }));
  };

  const submitProfile = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      const data = await updateUser(user._id, profile);
      const updatedUser = data.user || { ...user, ...profile };

      localStorage.setItem("hmsUser", JSON.stringify(updatedUser));
      onUserUpdate(updatedUser);
      setMessage("Profile updated successfully");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="profilePanel profilePanelInPopup">
      <div className="sectionTitle profileTitle">
        <h2>{title}</h2>
        <button onClick={onClose}>Close</button>
      </div>

      <form className="profileForm" onSubmit={submitProfile}>
        <div>
          <label>Name</label>
          <input value={profile.name} onChange={(event) => updateField("name", event.target.value)} />
        </div>

        <div>
          <label>Email</label>
          <input value={profile.email} onChange={(event) => updateField("email", event.target.value)} />
        </div>

        <div>
          <label>Phone</label>
          <input value={profile.phone} onChange={(event) => updateField("phone", event.target.value)} />
        </div>

        <div>
          <label>Status</label>
          <select value={profile.status} onChange={(event) => updateField("status", event.target.value)}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <button className="saveBtn profileSaveBtn" disabled={saving}>
          {saving ? "Updating..." : "Update Profile"}
        </button>
      </form>

      {message && <p className="smallMessage">{message}</p>}
    </section>
  );
}

export default UserProfile;
