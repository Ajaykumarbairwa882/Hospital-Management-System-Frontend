import { useCallback, useEffect, useState } from "react";
import {
  approveAppointment,
  getDoctorAppointments,
} from "../../api/appointmentApi";
import DashboardControls from "../common/DashboardControls";
import Navbar from "../common/Navbar";
import UserProfile from "../profile/UserProfile";
import { getVisibleRecords } from "../../utils/dashboardList";

const pageSize = 6;
const sortOptions = [
  { value: "date", label: "Date" },
  { value: "status", label: "Status" },
  { value: "patient", label: "Patient" },
];
const sortMap = {
  date: { getValue: (item) => item.date, direction: -1 },
  status: { getValue: (item) => item.status, direction: 1 },
  patient: { getValue: (item) => item.patientName, direction: 1 },
};

function DoctorDashboard({ user, onUserUpdate, onLogout }) {
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [visibleCount, setVisibleCount] = useState(pageSize);

  const loadAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getDoctorAppointments(user._id);
      setAppointments(data.appointments || []);
    } catch (error) {
      setMessage(error.message);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, [user._id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadAppointments();
    }, 0);

    return () => clearTimeout(timer);
  }, [loadAppointments]);

  const handleApprove = async (appointmentId) => {
    try {
      setMessage("");
      const data = await approveAppointment(appointmentId);
      setMessage(data.message);
      await loadAppointments();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const appointmentList = getVisibleRecords({
    records: appointments,
    search,
    fields: [
      (item) => item.patientName,
      (item) => item.email,
      (item) => item.phone,
      (item) => item.status,
      (item) => item.date,
      (item) => item.hospitalId?.hospitalName,
    ],
    sortBy,
    sortMap,
    visibleCount,
  });

  return (
    <div className="userDashboard">
      <Navbar
        title="Doctor Dashboard"
        subtitle="Appointment approval workspace"
        user={user}
        onLogout={onLogout}
        onOpenProfile={() => setShowProfilePopup(true)}
      />

      <main className="userContent">
        <section className="locationArea">
          <div className="sectionTitle">
            <div>
              <h2>Appointment Requests</h2>
              <p className="mutedText">
                Approve appointment and patient ko mail automatically chali jayegi.
              </p>
            </div>
            <button onClick={() => setShowProfilePopup(true)}>Profile</button>
          </div>

          {message && <p className="smallMessage">{message}</p>}

          <DashboardControls
            search={search}
            onSearch={(value) => {
              setSearch(value);
              setVisibleCount(pageSize);
            }}
            sortBy={sortBy}
            onSortBy={setSortBy}
            sortOptions={sortOptions}
            visibleCount={visibleCount}
            totalCount={appointmentList.totalCount}
            onShowMore={() => setVisibleCount((oldCount) => oldCount + pageSize)}
          />

          {loading ? (
            <div className="emptyBox">Loading appointment requests...</div>
          ) : appointmentList.totalCount === 0 ? (
            <div className="emptyBox">No appointment request found.</div>
          ) : (
            <div className="recordGrid compactGrid">
              {appointmentList.visibleRecords.map((appointment) => (
                <div className="recordCard" key={appointment._id}>
                  <div className="recordTop">
                    <span>{appointment.status}</span>
                    <small>{appointment.date} at {appointment.time}</small>
                  </div>
                  <h3>{appointment.patientName}</h3>
                  <p>{appointment.hospitalId?.hospitalName || "Hospital"}</p>
                  <p>Email: {appointment.email}</p>
                  <p>Phone: {appointment.phone}</p>
                  <p>Age: {appointment.age || "N/A"}</p>
                  <div className="recordActions">
                    <button
                      className="softBtn"
                      disabled={appointment.status === "approved"}
                      onClick={() => handleApprove(appointment._id)}
                    >
                      {appointment.status === "approved" ? "Approved" : "Approve"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {showProfilePopup && (
        <div className="popupBg">
          <div className="popup profilePopup">
            <UserProfile
              user={user}
              title="Doctor Profile"
              onUserUpdate={onUserUpdate}
              onClose={() => setShowProfilePopup(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorDashboard;
