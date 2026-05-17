import { useState } from "react";
import { createAppointment } from "../../api/appointmentApi";
import "../../styles/AppointmentForm.css";

const emptyAppointment = {
  patientName: "",
  email: "",
  phone: "",
  age: "",
  date: "",
  time: "",
};

function AppointmentForm({
  user,
  doctor,
  selectedHospital,
  onClose,
  onSuccess,
  onError,
}) {
  const [appointment, setAppointment] = useState({
    ...emptyAppointment,
    patientName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  if (!user || !user._id) {
    return null;
  }

  const updateAppointment = (field, value) => {
    setAppointment((oldData) => ({ ...oldData, [field]: value }));
  };

  const handleBookAppointment = async (event) => {
    event.preventDefault();

    try {
      const hospital = doctor.hospital || selectedHospital;

      await createAppointment({
        userId: user._id,
        hospitalId: hospital._id || hospital,
        doctorId: doctor._id,
        ...appointment,
      });

      onSuccess("Appointment request doctor ke pass chali gayi hai.");
      onClose();
    } catch (error) {
      onError(error.message);
    }
  };

  return (
    <div className="popupBg">
      <section className="appointmentPanel">
        <div className="popupHead">
          <div>
            <h2>Book Appointment</h2>
            <p>
              Dr. {doctor.doctorName} -{" "}
              {doctor.hospital?.hospitalName || selectedHospital?.hospitalName}
            </p>
          </div>
          <button onClick={onClose}>Close</button>
        </div>

        <div className="appointmentSummary">
          <strong>Department</strong>
          <span>{doctor.department?.departmentName || "N/A"}</span>
          <strong>Specialization</strong>
          <span>{doctor.specialization || "N/A"}</span>
        </div>

        <form className="authForm" onSubmit={handleBookAppointment}>
          <input
            required
            value={appointment.patientName}
            placeholder="Patient Name"
            onChange={(event) =>
              updateAppointment("patientName", event.target.value)
            }
          />
          <input
            required
            type="number"
            min="1"
            value={appointment.age}
            placeholder="Age"
            onChange={(event) => updateAppointment("age", event.target.value)}
          />
          <input
            required
            value={appointment.phone}
            placeholder="Phone Number"
            onChange={(event) => updateAppointment("phone", event.target.value)}
          />
          <input
            required
            type="email"
            value={appointment.email}
            placeholder="Email"
            onChange={(event) => updateAppointment("email", event.target.value)}
          />
          <input
            required
            type="date"
            value={appointment.date}
            onChange={(event) => updateAppointment("date", event.target.value)}
          />
          <input
            required
            type="time"
            value={appointment.time}
            onChange={(event) => updateAppointment("time", event.target.value)}
          />
          <button className="authBtn" type="submit">
            Book Appointment
          </button>
        </form>
      </section>
    </div>
  );
}

export default AppointmentForm;
