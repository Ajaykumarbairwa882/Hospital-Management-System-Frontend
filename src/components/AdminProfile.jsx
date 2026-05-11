import { useEffect, useState } from "react";
import { getAdmins, updateAdminInfo } from "../api/adminApi";

function AdminProfile({ user, onUserUpdate, onClose }) {
  const [adminId, setAdminId] = useState(user?.superAdmin || "");
  const [profile, setProfile] = useState({
    name: user?.name || "",
    phone: "",
    gender: "Male",
    bg_description: "",
  });
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const data = await getAdmins();
        const admin = data.admins?.find((item) => item._id === user?.superAdmin);

        if (admin) {
          setAdminId(admin._id);
          setProfile({
            name: admin.name || "",
            phone: admin.phone || "",
            gender: admin.gender || "Male",
            bg_description: admin.bg_description || "",
          });
        }
      } catch (error) {
        setMessage(error.message);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [user?.superAdmin]);

  const updateField = (field, value) => {
    setProfile((oldProfile) => ({
      ...oldProfile,
      [field]: value,
    }));
  };

  const submitProfile = async (event) => {
    event.preventDefault();

    if (!adminId) {
      setMessage("Admin profile id not found");
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      const data = await updateAdminInfo(adminId, profile);
      const updatedUser = data.user || { ...user, name: data.admin.name };

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
        <h2>Super Admin Profile</h2>
        <button onClick={onClose}>Close</button>
      </div>

      <form className="profileForm" onSubmit={submitProfile}>
        <div>
          <label>Name</label>
          <input value={profile.name} onChange={(event) => updateField("name", event.target.value)} />
        </div>

        <div>
          <label>Phone</label>
          <input value={profile.phone} onChange={(event) => updateField("phone", event.target.value)} />
        </div>

        <div>
          <label>Gender</label>
          <select value={profile.gender} onChange={(event) => updateField("gender", event.target.value)}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label>Background</label>
          <input
            value={profile.bg_description}
            onChange={(event) => updateField("bg_description", event.target.value)}
          />
        </div>

        <button className="saveBtn profileSaveBtn" disabled={saving}>
          {saving ? "Updating..." : "Update Profile"}
        </button>
      </form>

      {message && <p className="smallMessage">{message}</p>}
    </section>
  );
}

export default AdminProfile;
