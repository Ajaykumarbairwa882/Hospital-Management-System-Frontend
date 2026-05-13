function AdminHospitals({
  hospitals,
  selectedHospital,
  onRefresh,
  onGetOne,
  onUpdateStatus,
}) {
  const getLocationName = (city) => {
    if (!city) {
      return "Location not added";
    }

    return `${city.cityName}, ${city.district?.districtName}, ${city.district?.state?.stateName}, India`;
  };

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

      {hospitals.length === 0 ? (
        <div className="emptyBox">No hospital request found.</div>
      ) : (
        <div className="adminHospitalGrid">
          {hospitals.map((hospital) => (
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
