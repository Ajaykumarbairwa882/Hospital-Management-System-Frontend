import { useState } from "react";
import DashboardControls from "../common/DashboardControls";
import { getVisibleRecords } from "../../utils/dashboardList";

const pageSize = 6;
const sortOptions = [
  { value: "name", label: "Name A-Z" },
  { value: "nameDesc", label: "Name Z-A" },
  { value: "status", label: "Status" },
];
const sortMap = {
  name: { getValue: (item) => item.hospitalName, direction: 1 },
  nameDesc: { getValue: (item) => item.hospitalName, direction: -1 },
  status: { getValue: (item) => item.status, direction: 1 },
};

function AdminHospitals({
  hospitals,
  selectedHospital,
  onRefresh,
  onGetOne,
  onUpdateStatus,
}) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [visibleCount, setVisibleCount] = useState(pageSize);

  const getLocationName = (city) => {
    if (!city) {
      return "Location not added";
    }

    return `${city.cityName}, ${city.district?.districtName}, ${city.district?.state?.stateName}, India`;
  };

  const hospitalList = getVisibleRecords({
    records: hospitals,
    search,
    fields: [
      (item) => item.hospitalName,
      (item) => item.name,
      (item) => item.email,
      (item) => item.phone,
      (item) => item.address,
      (item) => getLocationName(item.city),
      (item) => item.status,
    ],
    sortBy,
    sortMap,
    visibleCount,
  });

  return (
    <section className="locationArea">
      <div className="sectionTitle">
        <h2>Hospitals</h2>
        <button onClick={onRefresh}>Refresh</button>
      </div>

      {selectedHospital && (
        <div className="selectedHospital">
          <h3>{selectedHospital.hospitalName}</h3>
          <p>Owner: {selectedHospital.name}</p>
          <p>Email: {selectedHospital.email}</p>
          <p>Phone: {selectedHospital.phone}</p>
          <p>Address: {selectedHospital.address}</p>
          <p>Location: {getLocationName(selectedHospital.city)}</p>
        </div>
      )}

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
        totalCount={hospitalList.totalCount}
        onShowMore={() => setVisibleCount((oldCount) => oldCount + pageSize)}
      />

      {hospitalList.totalCount === 0 ? (
        <div className="emptyBox">No hospital request found.</div>
      ) : (
        <div className="adminHospitalGrid">
          {hospitalList.visibleRecords.map((hospital) => (
            <div className="adminHospitalCard" key={hospital._id}>
              <div className="adminHospitalInfo">
                <div className="hospitalCardTop">
                  <span>Hospital</span>
                  <strong
                    className={`status ${hospital.status === "approved" ? "activeStatus" : "inactiveStatus"}`}
                  >
                    {hospital.status}
                  </strong>
                </div>
                <h3>{hospital.hospitalName}</h3>
                <p>{hospital.name} | {hospital.email}</p>
                <p>{hospital.phone}</p>
                <div className="locationLine">{getLocationName(hospital.city)}</div>
                <p>{hospital.address}</p>
              </div>
              <div className="rowActions">
                <button onClick={() => onGetOne(hospital._id)}>Get One</button>
                <button
                  onClick={() => onUpdateStatus(hospital._id, "approved")}
                >
                  Approve
                </button>
                <button
                  className="dangerBtn"
                  onClick={() => onUpdateStatus(hospital._id, "rejected")}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default AdminHospitals;
