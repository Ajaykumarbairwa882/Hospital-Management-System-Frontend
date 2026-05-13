import { useEffect, useState } from "react";
import {
  addDepartment,
  getHospitalDepartments,
  getSingleDepartment,
  hardDeleteDepartment,
  softDeleteDepartment,
  updateDepartment,
  restoreDepartment,
} from "../api/departmentApi";
import {
  addDoctor,
  getHospitalDoctors,
  getSingleDoctor,
  hardDeleteDoctor,
  softDeleteDoctor,
  updateDoctor,
} from "../api/doctorApi";
import {
  addSubDepartment,
  getHospitalSubDepartments,
  getSingleSubDepartment,
  hardDeleteSubDepartment,
  softDeleteSubDepartment,
  updateSubDepartment,
} from "../api/subDepartmentApi";
import HospitalSidebar from "./HospitalSidebar";
import Navbar from "./Navbar";
import UserProfile from "./UserProfile";

const emptyDepartment = {
  departmentName: "",
  description: "",
  status: "active",
};

const emptyDoctor = {
  doctorName: "",
  email: "",
  phone: "",
  qualification: "",
  specialization: "",
  department: "",
  subDepartment: "",
  status: "active",
};

const emptySubDepartment = {
  subDepartmentName: "",
  description: "",
  department: "",
  status: "active",
};

function HospitalDashboard({ user, onUserUpdate, onLogout }) {
  const [activePage, setActivePage] = useState("");
  const [departments, setDepartments] = useState([]);
  const [subDepartments, setSubDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [detailPopup, setDetailPopup] = useState(null);
  const [popupType, setPopupType] = useState("");
  const [editId, setEditId] = useState("");
  const [departmentForm, setDepartmentForm] = useState(emptyDepartment);
  const [subDepartmentForm, setSubDepartmentForm] =
    useState(emptySubDepartment);
  const [doctorForm, setDoctorForm] = useState(emptyDoctor);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadDepartments = async () => {
    try {
      setLoading(true);
      const data = await getHospitalDepartments(user._id);
      setDepartments(data.departments || []);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const data = await getHospitalDoctors(user._id);
      setDoctors(data.doctors || []);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadSubDepartments = async () => {
    try {
      setLoading(true);
      const data = await getHospitalSubDepartments(user._id);
      setSubDepartments(data.subDepartments || []);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
    loadSubDepartments();
    loadDoctors();
  }, []);

  const openDepartmentPanel = async () => {
    setActivePage("departments");
    setDetailPopup(null);
    setMessage("");
    await loadDepartments();
  };

  const openSubDepartmentPanel = async () => {
    setActivePage("subDepartments");
    setDetailPopup(null);
    setMessage("");
    await loadSubDepartments();
  };

  const openDoctorPanel = async () => {
    setActivePage("doctors");
    setDetailPopup(null);
    setMessage("");
    await loadDoctors();
  };

  const closePanel = () => {
    setActivePage("");
    setDetailPopup(null);
    setMessage("");
  };

  const openAddPopup = (type) => {
    setPopupType(type);
    setEditId("");
    setMessage("");

    if (type === "department") {
      setDepartmentForm(emptyDepartment);
    }

    if (type === "subDepartment") {
      setSubDepartmentForm(emptySubDepartment);
    }

    if (type === "doctor") {
      setDoctorForm(emptyDoctor);
    }
  };

  const openEditDepartment = (department) => {
    setPopupType("department");
    setEditId(department._id);
    setDepartmentForm({
      departmentName: department.departmentName || "",
      description: department.description || "",
      status: department.status || "active",
    });
  };

  const openEditDoctor = (doctor) => {
    setPopupType("doctor");
    setEditId(doctor._id);
    setDoctorForm({
      doctorName: doctor.doctorName || "",
      email: doctor.email || "",
      phone: doctor.phone || "",
      qualification: doctor.qualification || "",
      specialization: doctor.specialization || "",
      department: doctor.department?._id || "",
      subDepartment: doctor.subDepartment?._id || "",
      status: doctor.status || "active",
    });
  };

  const openEditSubDepartment = (subDepartment) => {
    setPopupType("subDepartment");
    setEditId(subDepartment._id);
    setSubDepartmentForm({
      subDepartmentName: subDepartment.subDepartmentName || "",
      description: subDepartment.description || "",
      department: subDepartment.department?._id || "",
      status: subDepartment.status || "active",
    });
  };

  const closePopup = () => {
    setPopupType("");
    setEditId("");
    setDepartmentForm(emptyDepartment);
    setSubDepartmentForm(emptySubDepartment);
    setDoctorForm(emptyDoctor);
    setMessage("");
  };

  const saveDepartment = async () => {
    try {
      if (departmentForm.departmentName.trim() === "") {
        throw new Error("Please enter department name");
      }

      setSaving(true);
      const payload = {
        ...departmentForm,
        departmentName: departmentForm.departmentName.trim(),
        description: departmentForm.description.trim(),
        hospitalUser: user._id,
      };

      if (editId) {
        await updateDepartment(editId, payload);
      } else {
        await addDepartment(payload);
      }

      await loadDepartments();
      closePopup();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  };
  const restoreDepartmentData = async (id) => {
    try {
      await restoreDepartment(id);

      await loadDepartments();
    } catch (error) {
      setMessage(error.message);
    }
  };
  const saveSubDepartment = async () => {
    try {
      if (
        subDepartmentForm.subDepartmentName.trim() === "" ||
        subDepartmentForm.department === ""
      ) {
        throw new Error(
          "Please select department and enter sub department name",
        );
      }

      setSaving(true);
      const payload = {
        ...subDepartmentForm,
        subDepartmentName: subDepartmentForm.subDepartmentName.trim(),
        description: subDepartmentForm.description.trim(),
        hospitalUser: user._id,
      };

      if (editId) {
        await updateSubDepartment(editId, payload);
      } else {
        await addSubDepartment(payload);
      }

      await loadSubDepartments();
      closePopup();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  const saveDoctor = async () => {
    try {
      if (doctorForm.doctorName.trim() === "") {
        throw new Error("Please enter doctor name");
      }

      setSaving(true);
      const payload = {
        ...doctorForm,
        doctorName: doctorForm.doctorName.trim(),
        email: doctorForm.email.trim(),
        phone: doctorForm.phone.trim(),
        qualification: doctorForm.qualification.trim(),
        specialization: doctorForm.specialization.trim(),
        hospitalUser: user._id,
      };

      if (editId) {
        await updateDoctor(editId, payload);
      } else {
        await addDoctor(payload);
      }

      await loadDoctors();
      closePopup();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  const getOneDepartment = async (id) => {
    try {
      const data = await getSingleDepartment(id);
      setDetailPopup({ type: "Department", data: data.department });
    } catch (error) {
      setMessage(error.message);
    }
  };

  const getOneSubDepartment = async (id) => {
    try {
      const data = await getSingleSubDepartment(id);
      setDetailPopup({ type: "Sub Department", data: data.subDepartment });
    } catch (error) {
      setMessage(error.message);
    }
  };

  const getOneDoctor = async (id) => {
    try {
      const data = await getSingleDoctor(id);
      setDetailPopup({ type: "Doctor", data: data.doctor });
    } catch (error) {
      setMessage(error.message);
    }
  };

  const deleteDepartment = async (id, type) => {
    try {
      if (type === "soft") {
        await softDeleteDepartment(id);
      } else {
        await hardDeleteDepartment(id);
      }

      setDetailPopup(null);

      await loadDepartments();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const restoreSubDepartmentData = async (id) => {
    try {
      await restoreSubDepartment(id);

      await loadSubDepartments();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const deleteSubDepartment = async (id, type) => {
    try {
      if (type === "soft") {
        await softDeleteSubDepartment(id);
      } else {
        await hardDeleteSubDepartment(id);
      }

      setDetailPopup(null);
      await loadSubDepartments();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const deleteDoctor = async (id, type) => {
    try {
      if (type === "soft") {
        await softDeleteDoctor(id);
      } else {
        await hardDeleteDoctor(id);
      }

      setDetailPopup(null);
      await loadDoctors();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const renderEmptyDashboard = () => {
    return (
      <section className="hospitalWelcome">
        <span>Hospital Workspace</span>
        <h2>Choose a module from sidebar</h2>
        <p>
          Open Depart or Doctor to manage records with add, get, update and
          delete actions.
        </p>
      </section>
    );
  };

  const renderDepartmentPanel = () => {
    return (
      <section className="hospitalPanel">
        <div className="panelHeader">
          <div>
            <span>Department CRUD</span>
            <h2>Departments</h2>
          </div>
          <div className="panelActions">
            <button onClick={() => openAddPopup("department")}>
              Add Department
            </button>
            <button onClick={loadDepartments}>Get All</button>
            <button className="softBtn" onClick={closePanel}>
              Close
            </button>
          </div>
        </div>

        {loading ? (
          <div className="emptyBox">Loading...</div>
        ) : departments.length === 0 ? (
          <div className="emptyBox">No department added yet.</div>
        ) : (
          <div className="recordGrid">
            {departments.map((department) => (
              <div
                className={`recordCard ${
                  department.isDeleted ? "deletedCard" : ""
                }`}
                key={department._id}
              >
                <div className="recordTop">
                  <span>{department.status}</span>
                  <small>Department</small>
                </div>

                <h3>{department.departmentName}</h3>

                <p>{department.description || "No description added"}</p>

                {department.isDeleted && (
                  <p className="deletedText">Soft Deleted</p>
                )}

                <div className="recordActions">
                  <button onClick={() => getOneDepartment(department._id)}>
                    Get One
                  </button>

                  {!department.isDeleted && (
                    <>
                      <button onClick={() => openEditDepartment(department)}>
                        Update
                      </button>

                      <button
                        className="softBtn"
                        onClick={() => deleteDepartment(department._id, "soft")}
                      >
                        Soft Delete
                      </button>
                    </>
                  )}

                  {department.isDeleted && (
                    <button
                      className="restoreBtn"
                      onClick={() => restoreDepartmentData(department._id)}
                    >
                      Restore
                    </button>
                  )}

                  <button
                    className="dangerBtn"
                    onClick={() => deleteDepartment(department._id, "hard")}
                  >
                    Hard Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    );
  };

  const renderSubDepartmentPanel = () => {
    return (
      <section className="hospitalPanel">
        <div className="panelHeader">
          <div>
            <span>Sub Department CRUD</span>
            <h2>Sub Departments</h2>
          </div>
          <div className="panelActions">
            <button onClick={() => openAddPopup("subDepartment")}>
              Add Sub Department
            </button>
            <button onClick={loadSubDepartments}>Get All</button>
            <button className="softBtn" onClick={closePanel}>
              Close
            </button>
          </div>
        </div>

        {loading ? (
          <div className="emptyBox">Loading...</div>
        ) : subDepartments.length === 0 ? (
          <div className="emptyBox">No sub department added yet.</div>
        ) : (

          <div className="recordGrid">
            {subDepartments.map((subDepartment) => (
              <div
                className={`recordCard ${
                  subDepartment.isDeleted ? "deletedCard" : ""
                }`}
                key={subDepartment._id}
              >
                <div className="recordTop">
                  <span>{subDepartment.status}</span>

                  <small>
                    {subDepartment.department?.departmentName ||
                      "Sub Department"}
                  </small>
                </div>

                <h3>{subDepartment.subDepartmentName}</h3>

                <p>{subDepartment.description || "No description added"}</p>

                {subDepartment.isDeleted && (
                  <p className="deletedText">Soft Deleted</p>
                )}

                <div className="recordActions">
                  <button
                    onClick={() => getOneSubDepartment(subDepartment._id)}
                  >
                    Get One
                  </button>

                  {!subDepartment.isDeleted && (
                    <>
                      <button
                        onClick={() => openEditSubDepartment(subDepartment)}
                      >
                        Update
                      </button>

                      <button
                        className="softBtn"
                        onClick={() =>
                          deleteSubDepartment(subDepartment._id, "soft")
                        }
                      >
                        Soft Delete
                      </button>
                    </>
                  )}

                  {subDepartment.isDeleted && (
                    <button
                      className="restoreBtn"
                      onClick={() =>
                        restoreSubDepartmentData(subDepartment._id)
                      }
                    >
                      Restore
                    </button>
                  )}

                  <button
                    className="dangerBtn"
                    onClick={() =>
                      deleteSubDepartment(subDepartment._id, "hard")
                    }
                  >
                    Hard Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    );
  };

  const renderDoctorPanel = () => {
    return (
      <section className="hospitalPanel">
        <div className="panelHeader">
          <div>
            <span>Doctor CRUD</span>
            <h2>Doctors</h2>
          </div>
          <div className="panelActions">
            <button onClick={() => openAddPopup("doctor")}>Add Doctor</button>
            <button onClick={loadDoctors}>Get All</button>
            <button className="softBtn" onClick={closePanel}>
              Close
            </button>
          </div>
        </div>

        {loading ? (
          <div className="emptyBox">Loading...</div>
        ) : doctors.length === 0 ? (
          <div className="emptyBox">No doctor added yet.</div>
        ) : (
          <div className="recordGrid">
            {doctors.map((doctor) => (
              <div className="recordCard" key={doctor._id}>
                <div className="recordTop">
                  <span>{doctor.status}</span>
                  <small>
                    {doctor.subDepartment?.subDepartmentName ||
                      doctor.department?.departmentName ||
                      "Doctor"}
                  </small>
                </div>
                <h3>{doctor.doctorName}</h3>
                <p>{doctor.specialization || "No specialization added"}</p>
                <p>{doctor.phone || "No phone added"}</p>
                <div className="recordActions">
                  <button onClick={() => getOneDoctor(doctor._id)}>
                    Get One
                  </button>
                  <button onClick={() => openEditDoctor(doctor)}>Update</button>
                  <button
                    className="softBtn"
                    onClick={() => deleteDoctor(doctor._id, "soft")}
                  >
                    Soft Delete
                  </button>
                  <button
                    className="dangerBtn"
                    onClick={() => deleteDoctor(doctor._id, "hard")}
                  >
                    Hard Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    );
  };

  const getDetailRows = () => {
    const item = detailPopup?.data || {};

    if (detailPopup?.type === "Department") {
      return [
        ["Name", item.departmentName],
        ["Description", item.description || "No description added"],
        ["Hospital", item.hospital?.hospitalName],
        ["Status", item.status],
      ];
    }

    if (detailPopup?.type === "Sub Department") {
      return [
        ["Name", item.subDepartmentName],
        ["Department", item.department?.departmentName],
        ["Description", item.description || "No description added"],
        ["Hospital", item.hospital?.hospitalName],
        ["Status", item.status],
      ];
    }

    return [
      ["Name", item.doctorName],
      ["Email", item.email || "No email added"],
      ["Phone", item.phone || "No phone added"],
      ["Qualification", item.qualification || "No qualification added"],
      ["Specialization", item.specialization || "No specialization added"],
      ["Department", item.department?.departmentName || "No department"],
      [
        "Sub Department",
        item.subDepartment?.subDepartmentName || "No sub department",
      ],
      ["Hospital", item.hospital?.hospitalName],
      ["Status", item.status],
    ];
  };

  return (
    <div className="app">
      <Navbar
        title="Hospital Dashboard"
        subtitle="Manage departments and doctors"
        user={user}
        onLogout={onLogout}
        onOpenProfile={() => setShowProfilePopup(true)}
      />

      <div className="dashboard">
        <HospitalSidebar
          activePage={activePage}
          onOpenDepartment={openDepartmentPanel}
          onOpenSubDepartment={openSubDepartmentPanel}
          onOpenDoctor={openDoctorPanel}
        />

        <main className="content">
          {message && !popupType && <p className="pageMessage">{message}</p>}
          {!activePage && renderEmptyDashboard()}
          {activePage === "departments" && renderDepartmentPanel()}
          {activePage === "subDepartments" && renderSubDepartmentPanel()}
          {activePage === "doctors" && renderDoctorPanel()}
        </main>
      </div>

      {popupType && (
        <div className="popupBg">
          <div className="popup largePopup">
            <div className="popupHead">
              <h2>
                {editId ? "Update" : "Add"}{" "}
                {popupType === "doctor"
                  ? "Doctor"
                  : popupType === "subDepartment"
                    ? "Sub Department"
                    : "Department"}
              </h2>
              <button onClick={closePopup}>Close</button>
            </div>

            {popupType === "department" && (
              <div className="form">
                <label>Department Name</label>
                <input
                  value={departmentForm.departmentName}
                  onChange={(event) =>
                    setDepartmentForm({
                      ...departmentForm,
                      departmentName: event.target.value,
                    })
                  }
                  placeholder="Enter department name"
                />

                <label>Description</label>
                <textarea
                  value={departmentForm.description}
                  onChange={(event) =>
                    setDepartmentForm({
                      ...departmentForm,
                      description: event.target.value,
                    })
                  }
                  placeholder="Enter short description"
                />

                <label>Status</label>
                <select
                  value={departmentForm.status}
                  onChange={(event) =>
                    setDepartmentForm({
                      ...departmentForm,
                      status: event.target.value,
                    })
                  }
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            )}

            {popupType === "subDepartment" && (
              <div className="form">
                <label>Department</label>
                <select
                  value={subDepartmentForm.department}
                  onChange={(event) =>
                    setSubDepartmentForm({
                      ...subDepartmentForm,
                      department: event.target.value,
                    })
                  }
                >
                  <option value="">Select department</option>
                  {departments.map((department) => (
                    <option value={department._id} key={department._id}>
                      {department.departmentName}
                    </option>
                  ))}
                </select>

                <label>Sub Department Name</label>
                <input
                  value={subDepartmentForm.subDepartmentName}
                  onChange={(event) =>
                    setSubDepartmentForm({
                      ...subDepartmentForm,
                      subDepartmentName: event.target.value,
                    })
                  }
                  placeholder="Enter sub department name"
                />

                <label>Description</label>
                <textarea
                  value={subDepartmentForm.description}
                  onChange={(event) =>
                    setSubDepartmentForm({
                      ...subDepartmentForm,
                      description: event.target.value,
                    })
                  }
                  placeholder="Enter short description"
                />

                <label>Status</label>
                <select
                  value={subDepartmentForm.status}
                  onChange={(event) =>
                    setSubDepartmentForm({
                      ...subDepartmentForm,
                      status: event.target.value,
                    })
                  }
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            )}

            {popupType === "doctor" && (
              <div className="form twoColumnForm">
                <div>
                  <label>Doctor Name</label>
                  <input
                    value={doctorForm.doctorName}
                    onChange={(event) =>
                      setDoctorForm({
                        ...doctorForm,
                        doctorName: event.target.value,
                      })
                    }
                    placeholder="Enter doctor name"
                  />
                </div>

                <div>
                  <label>Email</label>
                  <input
                    value={doctorForm.email}
                    onChange={(event) =>
                      setDoctorForm({
                        ...doctorForm,
                        email: event.target.value,
                      })
                    }
                    placeholder="Enter email"
                  />
                </div>

                <div>
                  <label>Phone</label>
                  <input
                    value={doctorForm.phone}
                    onChange={(event) =>
                      setDoctorForm({
                        ...doctorForm,
                        phone: event.target.value,
                      })
                    }
                    placeholder="Enter phone"
                  />
                </div>

                <div>
                  <label>Qualification</label>
                  <input
                    value={doctorForm.qualification}
                    onChange={(event) =>
                      setDoctorForm({
                        ...doctorForm,
                        qualification: event.target.value,
                      })
                    }
                    placeholder="Enter qualification"
                  />
                </div>

                <div>
                  <label>Specialization</label>
                  <input
                    value={doctorForm.specialization}
                    onChange={(event) =>
                      setDoctorForm({
                        ...doctorForm,
                        specialization: event.target.value,
                      })
                    }
                    placeholder="Enter specialization"
                  />
                </div>

                <div>
                  <label>Department</label>
                  <select
                    value={doctorForm.department}
                    onChange={(event) =>
                      setDoctorForm({
                        ...doctorForm,
                        department: event.target.value,
                        subDepartment: "",
                      })
                    }
                  >
                    <option value="">Select department</option>
                    {departments.map((department) => (
                      <option value={department._id} key={department._id}>
                        {department.departmentName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label>Sub Department</label>
                  <select
                    value={doctorForm.subDepartment}
                    onChange={(event) =>
                      setDoctorForm({
                        ...doctorForm,
                        subDepartment: event.target.value,
                      })
                    }
                  >
                    <option value="">Select sub department</option>
                    {subDepartments
                      .filter(
                        (subDepartment) =>
                          subDepartment.department?._id ===
                          doctorForm.department,
                      )
                      .map((subDepartment) => (
                        <option
                          value={subDepartment._id}
                          key={subDepartment._id}
                        >
                          {subDepartment.subDepartmentName}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label>Status</label>
                  <select
                    value={doctorForm.status}
                    onChange={(event) =>
                      setDoctorForm({
                        ...doctorForm,
                        status: event.target.value,
                      })
                    }
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            )}

            {message && <p className="errorText">{message}</p>}

            <button
              className="saveBtn"
              onClick={
                popupType === "doctor"
                  ? saveDoctor
                  : popupType === "subDepartment"
                    ? saveSubDepartment
                    : saveDepartment
              }
              disabled={saving}
            >
              {saving ? "Saving..." : editId ? "Update" : "Save"}
            </button>
          </div>
        </div>
      )}

      {detailPopup && (
        <div className="popupBg">
          <div className="popup detailPopup">
            <div className="popupHead">
              <h2>{detailPopup.type} Details</h2>
              <button onClick={() => setDetailPopup(null)}>Close</button>
            </div>

            <div className="detailList">
              {getDetailRows().map(([label, value]) => (
                <div key={label}>
                  <span>{label}</span>
                  <strong>{value || "Not added"}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showProfilePopup && (
        <div className="popupBg">
          <div className="popup profilePopup">
            <UserProfile
              user={user}
              title="Hospital Profile"
              onUserUpdate={onUserUpdate}
              onClose={() => setShowProfilePopup(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default HospitalDashboard;
