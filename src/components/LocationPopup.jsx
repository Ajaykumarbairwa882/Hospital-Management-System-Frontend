function LocationPopup({
  formType,
  isEdit,
  setFormType,
  states,
  districts,
  stateName,
  setStateName,
  districtName,
  setDistrictName,
  cityName,
  setCityName,
  selectedState,
  setSelectedState,
  selectedDistrict,
  setSelectedDistrict,
  message,
  saving,
  onSave,
  onClose,
  clearMessage,
}) {
  const changeFormType = (type) => {
    if (isEdit) {
      return;
    }

    setFormType(type);
    clearMessage();
  };

  return (
    <div className="popupBg">
      <div className="popup">
        <div className="popupHead">
          <h2>{isEdit ? "Edit" : "Add"} {formType}</h2>
          <button onClick={onClose}>Close</button>
        </div>

        <div className={isEdit ? "tabs disabledTabs" : "tabs"}>
          <button className={formType === "state" ? "selected" : ""} disabled={isEdit} onClick={() => changeFormType("state")}>
            State
          </button>
          <button
            className={formType === "district" ? "selected" : ""}
            disabled={isEdit}
            onClick={() => changeFormType("district")}
          >
            District
          </button>
          <button className={formType === "city" ? "selected" : ""} disabled={isEdit} onClick={() => changeFormType("city")}>
            City
          </button>
        </div>

        {formType === "state" && (
          <div className="form">
            <label>Country</label>
            <input value="India" readOnly />

            <label>State Name</label>
            <input
              value={stateName}
              onChange={(event) => setStateName(event.target.value)}
              placeholder="Enter state name"
            />
          </div>
        )}

        {formType === "district" && (
          <div className="form">
            <label>Select State</label>
            <select value={selectedState} onChange={(event) => setSelectedState(event.target.value)}>
              <option value="">Choose state</option>
              {states.map((state) => (
                <option key={state._id} value={state._id}>
                  {state.stateName}
                </option>
              ))}
            </select>

            <label>District Name</label>
            <input
              value={districtName}
              onChange={(event) => setDistrictName(event.target.value)}
              placeholder="Enter district name"
            />
          </div>
        )}

        {formType === "city" && (
          <div className="form">
            <label>Select District</label>
            <select value={selectedDistrict} onChange={(event) => setSelectedDistrict(event.target.value)}>
              <option value="">Choose district</option>
              {districts.map((district) => (
                <option key={district._id} value={district._id}>
                  {district.districtName}
                </option>
              ))}
            </select>

            <label>City Name</label>
            <input
              value={cityName}
              onChange={(event) => setCityName(event.target.value)}
              placeholder="Enter city name"
            />
          </div>
        )}

        {message && <p className="errorText">{message}</p>}

        <button className="saveBtn" onClick={onSave} disabled={saving}>
          {saving ? "Saving..." : isEdit ? "Update" : "Save"}
        </button>
      </div>
    </div>
  );
}

export default LocationPopup;
