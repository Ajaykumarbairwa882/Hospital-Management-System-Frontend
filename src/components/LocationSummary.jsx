function LocationSummary({ states, districts, cities }) {
  return (
    <section className="summary">
      <div>
        <span>Total States</span>
        <strong>{states.length}</strong>
      </div>
      <div>
        <span>Total Districts</span>
        <strong>{districts.length}</strong>
      </div>
      <div>
        <span>Total Cities</span>
        <strong>{cities.length}</strong>
      </div>
    </section>
  );
}

export default LocationSummary;
