import { useEffect, useState } from "react";
import { loginUser, signupUser } from "../api/authApi";
import { createHospital, getAllHospitals } from "../api/hospitalApi";
import { getCities, getDistricts, getStates } from "../api/locationApi";
import AddHospital from "./AddHospital";
import Login from "./Login";
import Navbar from "./Navbar";
import Signup from "./Signup";

function HomePage({ onLogin }) {
  const [screen, setScreen] = useState("home");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [hospitals, setHospitals] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);

  const getLocationName = (city) => {
    if (!city) {
      return "Location not added";
    }

    return `${city.cityName}, ${city.district?.districtName}, ${city.district?.state?.stateName}, India`;
  };

  const loadHospitals = async () => {
    try {
      const data = await getAllHospitals();
      setHospitals((data.hospitals || []).filter((item) => item.status === "approved"));
    } catch {
      setHospitals([]);
    }
  };

  const loadLocations = async () => {
    try {
      const [stateData, districtData, cityData] = await Promise.all([
        getStates(),
        getDistricts(),
        getCities(),
      ]);

      setStates(stateData.states || []);
      setDistricts(districtData.districts || []);
      setCities(cityData.cities || []);
    } catch {
      setStates([]);
      setDistricts([]);
      setCities([]);
    }
  };

  useEffect(() => {
    loadHospitals();
    loadLocations();
  }, []);

  const saveSession = (data) => {
    if (data.token) {
      localStorage.setItem("hmsToken", data.token);
    }

    localStorage.setItem("hmsUser", JSON.stringify(data.user));
    onLogin(data.user);
  };

  const handleLogin = async (email, password) => {
    try {
      setLoading(true);
      setMessage("");
      const data = await loginUser(email, password);
      saveSession(data);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (formData) => {
    try {
      setLoading(true);
      setMessage("");
      const data = await signupUser(formData);
      saveSession(data);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleHospital = async (formData) => {
    try {
      setLoading(true);
      setMessage("");
      const data = await createHospital(formData);
      setMessage(data.message);
      setScreen("home");
      await loadHospitals();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const title =
    screen === "login" ? "Login to continue" : screen === "signup" ? "Create your account" : "Add Hospital";

  return (
    <div className="publicPage">
      <Navbar
        title="Hospital Management System"
        onTitleClick={() => setScreen("home")}
        actions={[
          { label: "Signup", onClick: () => setScreen("signup") },
          { label: "Login", onClick: () => setScreen("login") },
          { label: "Add Hospital", onClick: () => setScreen("hospital") },
        ]}
      />

      {screen === "home" ? (
        <main className="homeContent">
          {message && <p className="smallMessage">{message}</p>}
          <section className="homeHero">
            <h1>Find trusted hospitals in one simple place</h1>
            <p>Hospitals approved by super admin are shown here for visitors.</p>
            <button onClick={() => setScreen("hospital")}>Add Hospital</button>
          </section>

          <section className="hospitalGrid">
            {hospitals.length === 0 ? (
              <div className="emptyBox">No approved hospital available right now.</div>
            ) : (
              hospitals.map((hospital) => (
                <div className="hospitalCard" key={hospital._id}>
                  <div className="hospitalCardTop">
                    <span>{hospital.status}</span>
                    <strong>{hospital.phone}</strong>
                  </div>
                  <h3>{hospital.hospitalName}</h3>
                  <p>{hospital.address}</p>
                  <div className="locationLine">{getLocationName(hospital.city)}</div>
                </div>
              ))
            )}
          </section>
        </main>
      ) : (
        <div className="authPage publicAuth">
          <div className="authBox">
            <div className="authHead">
              <h1>{title}</h1>
              <p>Hospital Management System</p>
            </div>

            {message && <p className="errorText">{message}</p>}

            {screen === "login" && <Login loading={loading} onLogin={handleLogin} />}
            {screen === "signup" && <Signup loading={loading} onSignup={handleSignup} />}
            {screen === "hospital" && (
              <AddHospital
                states={states}
                districts={districts}
                cities={cities}
                loading={loading}
                onSubmit={handleHospital}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
