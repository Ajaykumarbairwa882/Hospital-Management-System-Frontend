import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, signupUser } from "../../api/authApi";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import {
  createHospital,
  getAllHospitals,
  getAllHospitalImages,
} from "../../api/hospitalApi";
import { getAllDoctors, getHospitalDoctors } from "../../api/doctorApi";
import { getCities, getDistricts, getStates } from "../../api/locationApi";
import AddHospital from "./AddHospital";
import AppointmentForm from "../appointment/AppointmentForm";
import Login from "../auth/Login";
import Navbar from "../common/Navbar";
import Signup from "../auth/Signup";
import "../../styles/publicHome.css";

const heroImage =
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=80";

function getLocationName(city) {
  if (!city) return "Location not added";
  return `${city.cityName}, ${city.district?.districtName || ""}, ${
    city.district?.state?.stateName || ""
  }`;
}

function HomePage({ user, onLogin, onLogout }) {
  const navigate = useNavigate();
  const [screen, setScreen] = useState("home");
  const [publicPage, setPublicPage] = useState("home");
  const [view, setView] = useState("hospitals");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [hospitals, setHospitals] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [hospitalDoctors, setHospitalDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const approvedHospitals = useMemo(() => {
    return hospitals.filter((hospital) => hospital.status === "approved");
  }, [hospitals]);

  const approvedHospitalIds = useMemo(() => {
    return new Set(approvedHospitals.map((hospital) => hospital._id));
  }, [approvedHospitals]);

  const visibleDoctors = useMemo(() => {
    return allDoctors.filter((doctor) => {
      const hospitalId = doctor.hospital?._id || doctor.hospital;
      return doctor.status === "active" && approvedHospitalIds.has(hospitalId);
    });
  }, [allDoctors, approvedHospitalIds]);

  const searchText = search.trim().toLowerCase();

  const filteredHospitals = useMemo(() => {
    const list = approvedHospitals.filter((hospital) => {
      const fields = [
        hospital.hospitalName,
        hospital.name,
        hospital.email,
        hospital.phone,
        hospital.address,
        getLocationName(hospital.city),
        hospital.status,
      ];

      return fields
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(searchText);
    });

    return list.sort((first, second) => {
      if (sortBy === "status") {
        return (first.status || "").localeCompare(second.status || "");
      }

      if (sortBy === "city") {
        return getLocationName(first.city).localeCompare(
          getLocationName(second.city),
        );
      }

      return (first.hospitalName || "").localeCompare(
        second.hospitalName || "",
      );
    });
  }, [approvedHospitals, searchText, sortBy]);

  const filteredDoctors = useMemo(() => {
    const list = visibleDoctors.filter((doctor) => {
      const fields = [
        doctor.doctorName,
        doctor.email,
        doctor.phone,
        doctor.qualification,
        doctor.specialization,
        doctor.department?.departmentName,
        doctor.subDepartment?.subDepartmentName,
        doctor.hospital?.hospitalName,
        doctor.status,
      ];

      return fields
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(searchText);
    });

    return list.sort((first, second) => {
      if (sortBy === "status") {
        return (first.status || "").localeCompare(second.status || "");
      }

      if (sortBy === "city") {
        return (first.hospital?.hospitalName || "").localeCompare(
          second.hospital?.hospitalName || "",
        );
      }

      return (first.doctorName || "").localeCompare(second.doctorName || "");
    });
  }, [visibleDoctors, searchText, sortBy]);

  const loadPublicData = async () => {
    try {
      const [hospitalRes, imageRes, doctorRes] = await Promise.all([
        getAllHospitals(),
        getAllHospitalImages(),
        getAllDoctors(),
      ]);

      const imageList = imageRes.images || [];
      const mergedHospitals = (hospitalRes.hospitals || []).map((hospital) => ({
        ...hospital,
        images: imageList.filter((image) => image.hospitalId === hospital._id),
      }));

      setHospitals(mergedHospitals);
      setAllDoctors(doctorRes.doctors || []);
    } catch (error) {
      setHospitals([]);
      setAllDoctors([]);
      setMessage(error.message);
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
    const timer = setTimeout(() => {
      loadPublicData();
      loadLocations();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const saveSession = (data) => {
    localStorage.setItem("hmsToken", data.token);
    localStorage.setItem("hmsUser", JSON.stringify(data.user));
    onLogin(data, { stayHome: data.user?.role === "user" });
    setScreen("home");
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
      await loadPublicData();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const openHospitalDetails = async (hospital) => {
    setSelectedHospital(hospital);
    setHospitalDoctors([]);

    try {
      setLoadingDoctors(true);
      const res = await getHospitalDoctors(hospital._id);
      setHospitalDoctors(res.doctors || []);
    } catch {
      setHospitalDoctors([]);
    } finally {
      setLoadingDoctors(false);
    }
  };

  const openAppointmentForm = (doctor) => {
    const loggedUser = user || JSON.parse(localStorage.getItem("hmsUser"));

    if (!loggedUser) {
      setMessage("Please login first to book appointment");
      setScreen("login");
      return;
    }

    setSelectedDoctor(doctor);
  };

  const openPublicPage = (page) => {
    setScreen("home");
    setPublicPage(page);
    setMessage("");

    if (page === "hospitals") {
      setView("hospitals");
    }

    if (page === "doctors") {
      setView("doctors");
    }
  };

  const submitContact = (event) => {
    event.preventDefault();
    setMessage("Thank you. HMS team will contact you soon.");
    setContactForm({ name: "", email: "", message: "" });
  };

  const pageActions = [
    { label: "Home", onClick: () => openPublicPage("home") },
    { label: "Hospitals", onClick: () => openPublicPage("hospitals") },
    { label: "Doctors", onClick: () => openPublicPage("doctors") },
    { label: "Contact", onClick: () => openPublicPage("contact") },
  ];

  const navActions = user
    ? [
        ...pageActions,
        { label: "Add Hospital", onClick: () => setScreen("hospital") },
      ]
    : [
        ...pageActions,
        { label: "Signup", onClick: () => setScreen("signup") },
        { label: "Login", onClick: () => setScreen("login") },
        { label: "Add Hospital", onClick: () => setScreen("hospital") },
      ];

  const title =
    screen === "login"
      ? "Login to continue"
      : screen === "signup"
        ? "Create your account"
        : "Add Hospital";

  return (
    <div className="publicPage">
      <Navbar
        title="Hospital Management System"
        user={user}
        actions={navActions}
        onLogout={user ? onLogout : undefined}
        onOpenProfile={user ? () => navigate("/user") : undefined}
        onTitleClick={() => openPublicPage("home")}
      />

      {screen !== "home" ? (
        <div className="authPage publicAuth">
          <div className="authBox">
            <div className="authHead">
              <h1>{title}</h1>
              <p>Hospital Management System</p>
            </div>

            {message && <p className="errorText">{message}</p>}

            {screen === "login" && (
              <Login loading={loading} onLogin={handleLogin} />
            )}
            {screen === "signup" && (
              <Signup loading={loading} onSignup={handleSignup} />
            )}
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
      ) : (
        <main className="homeContent publicHome">
          {message && <p className="smallMessage">{message}</p>}

          {publicPage === "home" && (
            <>
              <section className="publicHero">
                <div className="heroCopy">
                  <span>Trusted Medical Network</span>
                  <h1>Make your health appointment simple</h1>
                  <p>
                    Search approved hospitals, view available doctors and book
                    your appointment request in a clean medical workspace.
                  </p>
                  <div className="heroActions">
                    <button onClick={() => openPublicPage("hospitals")}>
                      Find Hospital
                    </button>
                    <button
                      className="ghostHeroBtn"
                      onClick={() => openPublicPage("doctors")}
                    >
                      View Doctors
                    </button>
                    <button
                      className="ghostHeroBtn"
                      onClick={() => setScreen("hospital")}
                    >
                      Add Hospital
                    </button>
                  </div>
                  <div className="heroBadges" aria-label="Medical services">
                    <span>Care</span>
                    <span>Heart</span>
                    <span>Lab</span>
                    <span>Emergency</span>
                  </div>
                </div>
                <div className="heroMedia">
                  <img src={heroImage} alt="Doctor consultation" />
                </div>
              </section>

              <section className="homeIntro">
                <p>
                  HMS brings approved hospitals and verified doctors into one
                  place so patients can find care faster.
                </p>
                <div className="introCards">
                  <button onClick={() => openPublicPage("hospitals")}>
                    <strong>{approvedHospitals.length}</strong>
                    <span>Approved Hospitals</span>
                  </button>
                  <button onClick={() => openPublicPage("doctors")}>
                    <strong>{visibleDoctors.length}</strong>
                    <span>Active Doctors</span>
                  </button>
                  <button onClick={() => openPublicPage("contact")}>
                    <strong>24/7</strong>
                    <span>Request Access</span>
                  </button>
                </div>
              </section>

              <section className="medicalInfoSection">
                <div className="sectionMark">+</div>
                <h2>Our Vision</h2>
                <p>
                  A simple hospital network where patients can discover approved
                  hospitals, compare doctors and send appointment requests from
                  one trusted screen.
                </p>
                <button onClick={() => openPublicPage("contact")}>
                  Contact HMS
                </button>
              </section>

              <section className="operationSection">
                <div className="sectionMark">+</div>
                <h2>Care Departments</h2>
                <div className="operationGrid">
                  {["Internal Care", "Surgery", "Anesthesia", "Gynecology"].map(
                    (item) => (
                      <button
                        key={item}
                        onClick={() => openPublicPage("doctors")}
                      >
                        <span>{item}</span>
                        <small>View doctors</small>
                      </button>
                    ),
                  )}
                </div>
              </section>

              <section className="testimonialSection">
                <h2>Client Testimonials</h2>
                <p>
                  Patients can track request status, doctors can approve
                  bookings, and hospitals can manage their own departments.
                </p>
                <button onClick={() => openPublicPage("hospitals")}>
                  Browse Network
                </button>
              </section>
            </>
          )}

          {(publicPage === "hospitals" || publicPage === "doctors") && (
            <>
              <div className="viewSwitch">
                <div>
                  <span>Browse</span>
                  <strong>
                    {view === "hospitals" ? "Hospitals" : "Doctors"}
                  </strong>
                </div>
                <button
                  className={view === "hospitals" ? "active" : ""}
                  onClick={() => openPublicPage("hospitals")}
                >
                  See Hospital
                </button>
                <button
                  className={view === "doctors" ? "active" : ""}
                  onClick={() => openPublicPage("doctors")}
                >
                  See Doctors
                </button>
              </div>

              <section className="publicSearchBar">
                <input
                  value={search}
                  placeholder={
                    view === "hospitals"
                      ? "Search hospital by name, city, phone..."
                      : "Search doctor by name, hospital, specialization..."
                  }
                  onChange={(event) => setSearch(event.target.value)}
                />
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                >
                  <option value="name">Sort by name</option>
                  <option value="city">
                    {view === "hospitals" ? "Sort by city" : "Sort by hospital"}
                  </option>
                  <option value="status">Sort by status</option>
                </select>
              </section>

              {view === "doctors" ? (
                <section className="publicGrid">
                  {filteredDoctors.length === 0 ? (
                    <div className="emptyBox">
                      No approved doctor available.
                    </div>
                  ) : (
                    filteredDoctors.map((doctor) => (
                      <DoctorCard
                        key={doctor._id}
                        doctor={doctor}
                        onBook={() => openAppointmentForm(doctor)}
                      />
                    ))
                  )}
                </section>
              ) : (
                <section className="publicGrid">
                  {filteredHospitals.length === 0 ? (
                    <div className="emptyBox">
                      No approved hospital available right now.
                    </div>
                  ) : (
                    filteredHospitals.map((hospital) => (
                      <HospitalCard
                        key={hospital._id}
                        hospital={hospital}
                        getLocationName={getLocationName}
                        onDetails={() => openHospitalDetails(hospital)}
                      />
                    ))
                  )}
                </section>
              )}
            </>
          )}

          {publicPage === "contact" && (
            <section className="contactPage">
              <div>
                <span>Contact</span>
                <h2>Need help with hospitals, doctors or appointments?</h2>
                <p>
                  Send a message from here. This form keeps the UI working and
                  gives instant confirmation.
                </p>
                <button onClick={() => openPublicPage("hospitals")}>
                  Browse Hospitals
                </button>
              </div>
              <form onSubmit={submitContact}>
                <input
                  required
                  placeholder="Your name"
                  value={contactForm.name}
                  onChange={(event) =>
                    setContactForm({ ...contactForm, name: event.target.value })
                  }
                />
                <input
                  required
                  type="email"
                  placeholder="Email address"
                  value={contactForm.email}
                  onChange={(event) =>
                    setContactForm({
                      ...contactForm,
                      email: event.target.value,
                    })
                  }
                />
                <textarea
                  required
                  placeholder="How can we help?"
                  value={contactForm.message}
                  onChange={(event) =>
                    setContactForm({
                      ...contactForm,
                      message: event.target.value,
                    })
                  }
                />
                <button type="submit">Send Message</button>
              </form>
            </section>
          )}

          <footer className="publicFooter">
            <div>
              <strong>Hospital Management System</strong>
              <p>
                Approved hospitals, verified doctors and smart appointments.
              </p>
            </div>
            <div>
              <button onClick={() => openPublicPage("home")}>Home</button>
              <button onClick={() => openPublicPage("hospitals")}>
                Hospitals
              </button>
              <button onClick={() => openPublicPage("doctors")}>Doctors</button>
              <button onClick={() => openPublicPage("contact")}>Contact</button>
            </div>
          </footer>
        </main>
      )}

      {selectedHospital && (
        <div className="popupBg">
          <section className="hospitalDoctorPanel">
            <div className="popupHead">
              <div>
                <h2>{selectedHospital.hospitalName}</h2>
                <p>{selectedHospital.address}</p>
              </div>
              <button onClick={() => setSelectedHospital(null)}>Close</button>
            </div>

            {loadingDoctors ? (
              <p className="mutedText">Loading doctors...</p>
            ) : hospitalDoctors.length === 0 ? (
              <div className="emptyBox">No doctors found in this hospital.</div>
            ) : (
              <div className="doctorPanelGrid">
                {hospitalDoctors.map((doctor) => (
                  <DoctorCard
                    key={doctor._id}
                    doctor={doctor}
                    onBook={() => openAppointmentForm(doctor)}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {selectedDoctor && (
        <AppointmentForm
          user={user || JSON.parse(localStorage.getItem("hmsUser"))}
          doctor={selectedDoctor}
          selectedHospital={selectedHospital}
          onClose={() => setSelectedDoctor(null)}
          onSuccess={setMessage}
          onError={setMessage}
        />
      )}
    </div>
  );
}

function DoctorCard({ doctor, onBook }) {
  return (
    <article className="publicCard doctorPublicCard">
      <LazyLoadImage
        alt={doctor.doctorName}
        effect="blur"
        wrapperProps={{
          // If you need to, you can tweak the effect transition using the wrapper style.
          style: { transitionDelay: "1s" },
        }}
        src={
          doctor.images?.[0]?.image ||
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxb7wRL9uKik3-LOHuFXHqEMLLiBSOlC0lXw&s"
        }
      />

      <div className="cardBody">
        <div className="hospitalCardTop">
          <span>{doctor.department?.departmentName || "Doctor"}</span>
          <strong>{doctor.status}</strong>
        </div>
        <h3>Dr. {doctor.doctorName}</h3>
        <p>{doctor.qualification || "Qualified medical professional"}</p>
        <p>{doctor.specialization || "General care"}</p>
        <div className="locationLine">
          {doctor.hospital?.hospitalName || "Hospital not assigned"}
        </div>
        <button onClick={onBook}>Book Appointment</button>
      </div>
    </article>
  );
}

function HospitalCard({ hospital, getLocationName, onDetails }) {
  return (
    <article className="publicCard hospitalPublicCard">
      <LazyLoadImage
        alt={hospital.hospitalName}
        effect="blur"
        wrapperProps={{
          // If you need to, you can tweak the effect transition using the wrapper style.
          style: { transitionDelay: "1s" },
        }}
        src={
          hospital.images?.[0]?.image ||
          "https://via.placeholder.com/600x360?text=Hospital"
        }
      />
      <div className="cardBody">
        <div className="hospitalCardTop">
          <span>{hospital.status}</span>
          <strong>{hospital.phone}</strong>
        </div>
        <h3>{hospital.hospitalName}</h3>
        <p>{hospital.address}</p>
        <div className="locationLine">{getLocationName(hospital.city)}</div>
        <button onClick={onDetails}>Details</button>
      </div>
    </article>
  );
}

export default HomePage;
