function LocationCards({
  states,
  districts,
  cities,
  onOpenPopup,
  onEdit,
  onDelete,
  onToggleStatus,
  onRefresh,
}) {
  const hasLocation = states.length > 0 || districts.length > 0 || cities.length > 0;

  const getStateName = (district) => {
    if (district.state?.stateName) {
      return district.state.stateName;
    }

    const state = states.find((item) => item._id === district.state);
    return state?.stateName || "State not found";
  };

  const getCityDistrictName = (city) => {
    if (city.district?.districtName) {
      return city.district.districtName;
    }

    const district = districts.find((item) => item._id === city.district);
    return district?.districtName || "District not found";
  };

  const getCityStateName = (city) => {
    if (city.district?.state?.stateName) {
      return city.district.state.stateName;
    }

    const district = districts.find((item) => item._id === city.district);

    if (district?.state?.stateName) {
      return district.state.stateName;
    }

    const state = states.find((item) => item._id === district?.state);
    return state?.stateName || "State not found";
  };

  const renderActions = (type, item) => (
    <div className="cardActions">
      <button onClick={() => onEdit(type, item)}>Edit</button>
      <button onClick={() => onToggleStatus(type, item)}>
        {item.status === "active" ? "Inactive" : "Active"}
      </button>
      <button className="dangerBtn" onClick={() => onDelete(type, item._id)}>
        Delete
      </button>
    </div>
  );

  return (
    <section className="locationArea">
      <div className="sectionTitle">
        <h2>Complete Location</h2>
        <div className="titleActions">
          <button onClick={onRefresh}>Refresh</button>
          <button onClick={() => onOpenPopup("state")}>Add New</button>
        </div>
      </div>

      {!hasLocation ? (
        <div className="emptyBox">No location added yet. Click Add Location to start.</div>
      ) : (
        <div className="locationLists">
          <div className="locationList">
            <div className="listHead">
              <h3>States</h3>
              <button onClick={() => onOpenPopup("state")}>Add State</button>
            </div>
            {states.length === 0 ? (
              <p className="mutedText">No states added</p>
            ) : (
              states.map((state) => (
                <div className="locationRow" key={state._id}>
                  <div>
                    <span>State</span>
                    <h3>{state.stateName}</h3>
                    <p>{state.country || "India"}</p>
                    <p className={state.status === "active" ? "status activeStatus" : "status inactiveStatus"}>
                      {state.status}
                    </p>
                  </div>
                  <div className="rowActions">
                    <button onClick={() => onOpenPopup("district")}>Add District</button>
                    {renderActions("state", state)}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="locationList">
            <div className="listHead">
              <h3>Districts</h3>
              <button onClick={() => onOpenPopup("district")}>Add District</button>
            </div>
            {districts.length === 0 ? (
              <p className="mutedText">No districts added</p>
            ) : (
              districts.map((district) => (
                <div className="locationRow" key={district._id}>
                  <div>
                    <span>District</span>
                    <h3>{district.districtName}</h3>
                    <p>India, {getStateName(district)}</p>
                    <p className={district.status === "active" ? "status activeStatus" : "status inactiveStatus"}>
                      {district.status}
                    </p>
                  </div>
                  <div className="rowActions">
                    <button onClick={() => onOpenPopup("city")}>Add City</button>
                    {renderActions("district", district)}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="locationList">
            <div className="listHead">
              <h3>Cities</h3>
              <button onClick={() => onOpenPopup("city")}>Add City</button>
            </div>
            {cities.length === 0 ? (
              <p className="mutedText">No cities added</p>
            ) : (
              cities.map((city) => (
                <div className="locationRow" key={city._id}>
                  <div>
                    <span>City</span>
                    <h3>{city.cityName}</h3>
                    <p>
                      India, {getCityStateName(city)}, {getCityDistrictName(city)}
                    </p>
                    <p className={city.status === "active" ? "status activeStatus" : "status inactiveStatus"}>
                      {city.status}
                    </p>
                  </div>
                  <div className="rowActions">{renderActions("city", city)}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default LocationCards;
