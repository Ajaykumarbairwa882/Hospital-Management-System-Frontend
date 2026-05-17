import { useCallback, useEffect, useState } from "react";
import DashboardControls from "../common/DashboardControls";
import Navbar from "../common/Navbar";
import UserProfile from "../profile/UserProfile";
import { getUserAppointments } from "../../api/appointmentApi";
import { getVisibleRecords } from "../../utils/dashboardList";

const pageSize = 6;
const sortOptions = [
  { value: "date", label: "Date" },
  { value: "status", label: "Status" },
  { value: "doctor", label: "Doctor" },
];
const sortMap = {
  date: { getValue: (item) => item.date, direction: -1 },
  status: { getValue: (item) => item.status, direction: 1 },
  doctor: { getValue: (item) => item.doctorId?.doctorName, direction: 1 },
};

function UserDashboard({ user, onUserUpdate, onLogout }) {
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
      const data = await getUserAppointments(user._id);
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

  const appointmentList = getVisibleRecords({
    records: appointments,
    search,
    fields: [
      (item) => item.patientName,
      (item) => item.email,
      (item) => item.phone,
      (item) => item.status,
      (item) => item.date,
      (item) => item.doctorId?.doctorName,
      (item) => item.hospitalId?.hospitalName,
    ],
    sortBy,
    sortMap,
    visibleCount,
  });

  return (
    <div className="userDashboard">
      <Navbar
        title="User Dashboard"
        subtitle="Appointment history and profile"
        user={user}
        onLogout={onLogout}
        onOpenProfile={() => setShowProfilePopup(true)}
      />

      <main className="userContent">
        <section className="locationArea">
          <div className="sectionTitle">
            <div>
              <h2>Appointment History</h2>
              <p className="mutedText">Your bookings and current status.</p>
            </div>
            <button onClick={() => setShowProfilePopup(true)}>
              Profile Edit / Password Reset
            </button>
          </div>

          {message && <p className="pageMessage">{message}</p>}

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
            <div className="emptyBox">Loading appointments...</div>
          ) : appointmentList.totalCount === 0 ? (
            <div className="emptyBox">No appointment history found.</div>
          ) : (
            <div className="recordGrid compactGrid">
              {appointmentList.visibleRecords.map((appointment) => (
                <div className="recordCard" key={appointment._id}>
                  <div className="recordTop">
                    <span>{appointment.status}</span>
                    <small>{appointment.date} at {appointment.time}</small>
                  </div>
                  <h3>Dr. {appointment.doctorId?.doctorName || "Doctor"}</h3>
                  <p>{appointment.hospitalId?.hospitalName || "Hospital"}</p>
                  <p>Patient: {appointment.patientName}</p>
                  <p>Email: {appointment.email}</p>
                  <p>Phone: {appointment.phone}</p>
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
              title="User Profile"
              onUserUpdate={onUserUpdate}
              onClose={() => setShowProfilePopup(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDashboard;
