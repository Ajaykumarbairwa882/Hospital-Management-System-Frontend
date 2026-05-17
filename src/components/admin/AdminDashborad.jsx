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
} from "../../api/locationApi";
import { getAllHospitals, getSingleHospital, updateHospitalStatus } from "../../api/hospitalApi";
import AdminHospitals from "./AdminHospitals";
import AdminSidebar from "./AdminSidebar";
import LocationCards from "../location/LocationCards";
import LocationPopup from "../location/LocationPopup";
import LocationSummary from "../location/LocationSummary";
import Navbar from "../common/Navbar";
import UserProfile from "../profile/UserProfile";

function AdminDashborad({ user, onUserUpdate, onLogout }) {
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
  const [activePage, setActivePage] = useState("locations");
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);

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

  const loadHospitals = async () => {
    try {
      setLoading(true);
      const data = await getAllHospitals();
      setHospitals(data.hospitals || []);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadLocations();
      loadHospitals();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const openPopup = (type = "state") => {
    setActivePage("locations");
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

  const showHospitals = () => {
    setActivePage("hospitals");
    setMessage("");
    loadHospitals();
  };

  const getOneHospital = async (id) => {
    try {
      const data = await getSingleHospital(id);
      setSelectedHospital(data.hospital);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const changeHospitalStatus = async (id, status) => {
    try {
      await updateHospitalStatus(id, status);
      await loadHospitals();
    } catch (error) {
      setMessage(error.message);
    }
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
    <div className="app">
      <Navbar
        title="Super Admin Dashboard"
        subtitle="Hospital location setup"
        user={user}
        onLogout={onLogout}
        onOpenProfile={() => setShowProfilePopup(true)}
      />

      <div className="dashboard">
        <AdminSidebar activePage={activePage} onOpenPopup={openPopup} onShowHospitals={showHospitals} />

        <main className="content">
          {message && !showPopup && <p className="pageMessage">{message}</p>}
          {loading ? (
            <div className="emptyBox">Loading...</div>
          ) : activePage === "hospitals" ? (
            <AdminHospitals
              hospitals={hospitals}
              selectedHospital={selectedHospital}
              onRefresh={loadHospitals}
              onGetOne={getOneHospital}
              onUpdateStatus={changeHospitalStatus}
            />
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
            <UserProfile
              user={user}
              title="Super Admin Profile"
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
