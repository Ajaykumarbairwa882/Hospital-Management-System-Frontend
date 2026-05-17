import { useState } from "react";
import {
  updateUser,
  resetPassword,
} from "../../api/userApi";

import "../../styles/UserProfile.css";

const fileToDataUrl = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Unable to read image"));
    reader.readAsDataURL(file);
  });
};

function UserProfile({
  user,
  title = "Profile",
  onUserUpdate,
  onClose,
}) {
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    status: user?.status || "active",
    profileImage: user?.profileImage || "",
    backgroundImage: user?.backgroundImage || "",
  });

  const [resetPopup, setResetPopup] =
    useState(false);

  const [passwordData, setPasswordData] =
    useState({
      email: user?.email || "",
      oldpassword: "",
      newpassword: "",
      copassword: "",
    });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // profile fields
  const updateField = (field, value) => {
    setProfile((oldProfile) => ({
      ...oldProfile,
      [field]: value,
    }));
  };

  const updateImageField = async (field, file) => {
    if (!file) {
      return;
    }

    try {
      const image = await fileToDataUrl(file);
      updateField(field, image);
    } catch (error) {
      setError(error.message);
    }
  };

  // password fields
  const updatePasswordField = (
    field,
    value
  ) => {
    setPasswordData((oldData) => ({
      ...oldData,
      [field]: value,
    }));
  };

  // update profile
  const submitProfile = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const data = await updateUser(
        user._id,
        profile
      );

      const updatedUser = data.user || {
        ...user,
        ...profile,
      };

      localStorage.setItem(
        "hmsUser",
        JSON.stringify(updatedUser)
      );

      onUserUpdate(updatedUser);

      setMessage(
        "Profile updated successfully"
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  // reset password
  const submitPassword = async () => {
    try {
      setSaving(true);
      setError("");
      setMessage("");

      if (
        !passwordData.oldpassword ||
        !passwordData.newpassword ||
        !passwordData.copassword
      ) {
        return setError(
          "All password fields are required"
        );
      }

      if (
        passwordData.newpassword !==
        passwordData.copassword
      ) {
        return setError(
          "Confirm password does not match"
        );
      }

      // backend payload
      // {
      //   email,
      //   oldpassword,
      //   newpassword,
      //   copassword
      // }

      const data = await resetPassword(
        passwordData
      );

      setMessage(
        data.message ||
          "Password reset successfully"
      );

      setPasswordData({
        email: user?.email || "",
        oldpassword: "",
        newpassword: "",
        copassword: "",
      });

      setResetPopup(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <section className="profileCard">
        <div
          className="profileCover"
          style={{
            backgroundImage: profile.backgroundImage
              ? `url(${profile.backgroundImage})`
              : undefined,
          }}
        >
          <div className="profilePhoto">
            {profile.profileImage ? (
              <img src={profile.profileImage} alt={profile.name || "Profile"} />
            ) : (
              <span>{(profile.name || "US").slice(0, 2).toUpperCase()}</span>
            )}
          </div>
        </div>

        <div className="profileHeader">
          <h2>{title}</h2>

          <button
            onClick={onClose}
            className="closeBtn"
          >
            Close
          </button>
        </div>

        <form
          className="profileForm"
          onSubmit={submitProfile}
        >
          <div>
            <label>Name</label>

            <input
              type="text"
              value={profile.name}
              onChange={(event) =>
                updateField(
                  "name",
                  event.target.value
                )
              }
            />
          </div>

          <div>
            <label>Email</label>

            <input
              type="email"
              value={profile.email}
              onChange={(event) =>
                updateField(
                  "email",
                  event.target.value
                )
              }
            />
          </div>

          <div>
            <label>Phone</label>

            <input
              type="text"
              value={profile.phone}
              onChange={(event) =>
                updateField(
                  "phone",
                  event.target.value
                )
              }
            />
          </div>

          <div>
            <label>Status</label>

            <select
              value={profile.status}
              onChange={(event) =>
                updateField(
                  "status",
                  event.target.value
                )
              }
            >
              <option value="active">
                Active
              </option>

              <option value="inactive">
                Inactive
              </option>
            </select>
          </div>

          <div>
            <label>Profile Image</label>

            <input
              type="file"
              accept="image/*"
              onChange={(event) =>
                updateImageField("profileImage", event.target.files[0])
              }
            />
          </div>

          <div>
            <label>Background Image</label>

            <input
              type="file"
              accept="image/*"
              onChange={(event) =>
                updateImageField("backgroundImage", event.target.files[0])
              }
            />
          </div>

          <div className="buttonGroup">
            <button
              type="button"
              className="resetBtn"
              onClick={() =>
                setResetPopup(true)
              }
            >
              Reset Password
            </button>

            <button
              type="submit"
              className="updateBtn"
              disabled={saving}
            >
              {saving
                ? "Updating..."
                : "Update Profile"}
            </button>
          </div>
        </form>

        {message && (
          <p className="successMsg">
            {message}
          </p>
        )}

        {error && (
          <p className="errorMsg">
            {error}
          </p>
        )}
      </section>

      {/* popup */}

      {resetPopup && (
        <div className="popupOverlay">
          <div className="popupCard">
            <button
              className="popupClose"
              onClick={() =>
                setResetPopup(false)
              }
            >
              ✕
            </button>

            <h2>Reset Password</h2>

            <input
              type="password"
              placeholder="Old Password"
              value={
                passwordData.oldpassword
              }
              onChange={(event) =>
                updatePasswordField(
                  "oldpassword",
                  event.target.value
                )
              }
            />

            <input
              type="password"
              placeholder="New Password"
              value={
                passwordData.newpassword
              }
              onChange={(event) =>
                updatePasswordField(
                  "newpassword",
                  event.target.value
                )
              }
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={
                passwordData.copassword
              }
              onChange={(event) =>
                updatePasswordField(
                  "copassword",
                  event.target.value
                )
              }
            />

            <div className="popupBtns">
              <button
                onClick={submitPassword}
                className="submitBtn"
                disabled={saving}
              >
                {saving
                  ? "Resetting..."
                  : "Submit"}
              </button>

              <button
                onClick={() =>
                  setResetPopup(false)
                }
                className="cancelBtn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default UserProfile;
