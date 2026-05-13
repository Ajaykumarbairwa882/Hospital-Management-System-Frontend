function AdminSidebar({ activePage, onOpenPopup, onShowHospitals }) {
  return (
    <aside className="sidebar">
      <button className={activePage === "locations" ? "menuBtn active" : "menuBtn"} onClick={() => onOpenPopup("state")}>
        Add Location
      </button>
      <button className={activePage === "hospitals" ? "menuBtn active" : "menuBtn"} onClick={onShowHospitals}>
        Hospital
      </button>
      <button className="menuBtn" onClick={() => onOpenPopup("state")}>
        Add State
      </button>
      <button className="menuBtn" onClick={() => onOpenPopup("district")}>
        Add District
      </button>
      <button className="menuBtn" onClick={() => onOpenPopup("city")}>
        Add City
      </button>
    </aside>
  );
}

export default AdminSidebar;
