import { useState } from "react";
import DashboardControls from "../common/DashboardControls";
import { getVisibleRecords } from "../../utils/dashboardList";

const pageSize = 5;
const sortOptions = [
  { value: "name", label: "Name A-Z" },
  { value: "nameDesc", label: "Name Z-A" },
  { value: "status", label: "Status" },
];
const getSortMap = (nameField) => ({
  name: { getValue: (item) => item[nameField], direction: 1 },
  nameDesc: { getValue: (item) => item[nameField], direction: -1 },
  status: { getValue: (item) => item.status, direction: 1 },
});

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
  const [stateSearch, setStateSearch] = useState("");
  const [stateSort, setStateSort] = useState("name");
  const [stateVisible, setStateVisible] = useState(pageSize);
  const [districtSearch, setDistrictSearch] = useState("");
  const [districtSort, setDistrictSort] = useState("name");
  const [districtVisible, setDistrictVisible] = useState(pageSize);
  const [citySearch, setCitySearch] = useState("");
  const [citySort, setCitySort] = useState("name");
  const [cityVisible, setCityVisible] = useState(pageSize);
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

  const stateList = getVisibleRecords({
    records: states,
    search: stateSearch,
    fields: [(item) => item.stateName, (item) => item.country, (item) => item.status],
    sortBy: stateSort,
    sortMap: getSortMap("stateName"),
    visibleCount: stateVisible,
  });
  const districtList = getVisibleRecords({
    records: districts,
    search: districtSearch,
    fields: [(item) => item.districtName, getStateName, (item) => item.status],
    sortBy: districtSort,
    sortMap: getSortMap("districtName"),
    visibleCount: districtVisible,
  });
  const cityList = getVisibleRecords({
    records: cities,
    search: citySearch,
    fields: [
      (item) => item.cityName,
      getCityDistrictName,
      getCityStateName,
      (item) => item.status,
    ],
    sortBy: citySort,
    sortMap: getSortMap("cityName"),
    visibleCount: cityVisible,
  });

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
            <DashboardControls
              search={stateSearch}
              onSearch={(value) => {
                setStateSearch(value);
                setStateVisible(pageSize);
              }}
              sortBy={stateSort}
              onSortBy={setStateSort}
              sortOptions={sortOptions}
              visibleCount={stateVisible}
              totalCount={stateList.totalCount}
              onShowMore={() => setStateVisible((oldCount) => oldCount + pageSize)}
            />
            {stateList.totalCount === 0 ? (
              <p className="mutedText">No states added</p>
            ) : (
              stateList.visibleRecords.map((state) => (
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
            <DashboardControls
              search={districtSearch}
              onSearch={(value) => {
                setDistrictSearch(value);
                setDistrictVisible(pageSize);
              }}
              sortBy={districtSort}
              onSortBy={setDistrictSort}
              sortOptions={sortOptions}
              visibleCount={districtVisible}
              totalCount={districtList.totalCount}
              onShowMore={() =>
                setDistrictVisible((oldCount) => oldCount + pageSize)
              }
            />
            {districtList.totalCount === 0 ? (
              <p className="mutedText">No districts added</p>
            ) : (
              districtList.visibleRecords.map((district) => (
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
            <DashboardControls
              search={citySearch}
              onSearch={(value) => {
                setCitySearch(value);
                setCityVisible(pageSize);
              }}
              sortBy={citySort}
              onSortBy={setCitySort}
              sortOptions={sortOptions}
              visibleCount={cityVisible}
              totalCount={cityList.totalCount}
              onShowMore={() => setCityVisible((oldCount) => oldCount + pageSize)}
            />
            {cityList.totalCount === 0 ? (
              <p className="mutedText">No cities added</p>
            ) : (
              cityList.visibleRecords.map((city) => (
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
