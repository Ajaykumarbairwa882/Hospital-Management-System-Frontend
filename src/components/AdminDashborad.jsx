import { useEffect, useState } from "react";
import {
  addCity,
  addDistrict,
  addState,
  deleteCity,
  deleteDistrict,
  deleteState,
  getCities,
  getDistricts,
  getStates,
  updateCity,
  updateCityStatus,
  updateDistrict,
  updateDistrictStatus,
  updateState,
  updateStateStatus,
} from "../api/locationApi";
import AdminNavbar from "./AdminNavbar";
import AdminProfile from "./AdminProfile";
import AdminSidebar from "./AdminSidebar";
import LocationCards from "./LocationCards";
import LocationPopup from "./LocationPopup";
import LocationSummary from "./LocationSummary";

function AdminDashborad({ user, onUserUpdate, onLogout }) {
  const [darkMode, setDarkMode] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [formType, setFormType] = useState("state");
  const [stateName, setStateName] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [cityName, setCityName] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState(null);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);

  const loadLocations = async () => {
    try {
      setLoading(true);

      const [stateData, districtData, cityData] = await Promise.all([
        getStates(),
        getDistricts(),
        getCities(),
      ]);

      setStates(stateData.states || []);
      setDistricts(districtData.districts || []);
      setCities(cityData.cities || []);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadLocations();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const openPopup = (type = "state") => {
    setFormType(type);
    setEditItem(null);
    setStateName("");
    setDistrictName("");
    setCityName("");
    setSelectedState("");
    setSelectedDistrict("");
    setMessage("");
    setShowPopup(true);
  };

  const openEditPopup = (type, item) => {
    setFormType(type);
    setEditItem(item);
    setMessage("");

    if (type === "state") {
      setStateName(item.stateName || "");
    }

    if (type === "district") {
      setDistrictName(item.districtName || "");
      setSelectedState(item.state?._id || item.state || "");
    }

    if (type === "city") {
      setCityName(item.cityName || "");
      setSelectedDistrict(item.district?._id || item.district || "");
    }

    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setStateName("");
    setDistrictName("");
    setCityName("");
    setSelectedState("");
    setSelectedDistrict("");
    setEditItem(null);
    setMessage("");
  };

  const saveState = async () => {
    if (stateName.trim() === "") {
      throw new Error("Please enter state name");
    }

    if (editItem) {
      await updateState(editItem._id, stateName.trim());
      return;
    }

    await addState(stateName.trim());
  };

  const saveDistrict = async () => {
    if (selectedState === "" || districtName.trim() === "") {
      throw new Error("Please select state and enter district name");
    }

    if (editItem) {
      await updateDistrict(editItem._id, districtName.trim(), selectedState);
      return;
    }

    await addDistrict(districtName.trim(), selectedState);
  };

  const saveCity = async () => {
    if (selectedDistrict === "" || cityName.trim() === "") {
      throw new Error("Please select district and enter city name");
    }

    if (editItem) {
      await updateCity(editItem._id, cityName.trim(), selectedDistrict);
      return;
    }

    await addCity(cityName.trim(), selectedDistrict);
  };

  const deleteLocation = async (type, id) => {
    const ok = window.confirm(`Delete this ${type}?`);

    if (!ok) {
      return;
    }

    try {
      if (type === "state") {
        await deleteState(id);
      }

      if (type === "district") {
        await deleteDistrict(id);
      }

      if (type === "city") {
        await deleteCity(id);
      }

      await loadLocations();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const toggleStatus = async (type, item) => {
    const nextStatus = item.status === "active" ? "inactive" : "active";

    try {
      if (type === "state") {
        await updateStateStatus(item._id, nextStatus);
      }

      if (type === "district") {
        await updateDistrictStatus(item._id, nextStatus);
      }

      if (type === "city") {
        await updateCityStatus(item._id, nextStatus);
      }

      await loadLocations();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const saveLocation = async () => {
    try {
      setSaving(true);

      if (formType === "state") {
        await saveState();
      }

      if (formType === "district") {
        await saveDistrict();
      }

      if (formType === "city") {
        await saveCity();
      }

      await loadLocations();
      closePopup();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <AdminNavbar
        user={user}
        darkMode={darkMode}
        onToggleMode={() => setDarkMode(!darkMode)}
        onLogout={onLogout}
        onOpenProfile={() => setShowProfilePopup(true)}
      />

      <div className="dashboard">
        <AdminSidebar onOpenPopup={openPopup} />

        <main className="content">
          {message && !showPopup && <p className="pageMessage">{message}</p>}
          {loading ? (
            <div className="emptyBox">Loading locations...</div>
          ) : (
            <>
              <LocationSummary states={states} districts={districts} cities={cities} />
              <LocationCards
                states={states}
                districts={districts}
                cities={cities}
                onOpenPopup={openPopup}
                onEdit={openEditPopup}
                onDelete={deleteLocation}
                onToggleStatus={toggleStatus}
                onRefresh={loadLocations}
              />
            </>
          )}
        </main>
      </div>

      {showPopup && (
        <LocationPopup
          formType={formType}
          isEdit={Boolean(editItem)}
          setFormType={setFormType}
          states={states}
          districts={districts}
          stateName={stateName}
          setStateName={setStateName}
          districtName={districtName}
          setDistrictName={setDistrictName}
          cityName={cityName}
          setCityName={setCityName}
          selectedState={selectedState}
          setSelectedState={setSelectedState}
          selectedDistrict={selectedDistrict}
          setSelectedDistrict={setSelectedDistrict}
          message={message}
          saving={saving}
          onSave={saveLocation}
          onClose={closePopup}
          clearMessage={() => setMessage("")}
        />
      )}

      {showProfilePopup && (
        <div className="popupBg">
          <div className="popup profilePopup">
            <AdminProfile
              user={user}
              onUserUpdate={onUserUpdate}
              onClose={() => setShowProfilePopup(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashborad;
