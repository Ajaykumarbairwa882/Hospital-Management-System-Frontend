function AdminSidebar({ onOpenPopup }) {
  return (
    <aside className="sidebar">
      <button className="menuBtn active" onClick={() => onOpenPopup("state")}>
        Add Location
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
