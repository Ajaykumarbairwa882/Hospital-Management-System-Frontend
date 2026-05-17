function HospitalSidebar({ activePage, onOpenDepartment, onOpenSubDepartment, onOpenDoctor }) {
  return (
    <aside className="sidebar">
      <button
        className={activePage === "departments" ? "menuBtn active" : "menuBtn"}
        onClick={onOpenDepartment}
      >
        Depart
      </button>
      <button
        className={activePage === "subDepartments" ? "menuBtn active" : "menuBtn"}
        onClick={onOpenSubDepartment}
      >
        Sub Depart
      </button>
      <button
        className={activePage === "doctors" ? "menuBtn active" : "menuBtn"}
        onClick={onOpenDoctor}
      >
        Doctor
      </button>
    </aside>
  );
}

export default HospitalSidebar;
