function DashboardControls({
  search,
  onSearch,
  sortBy,
  onSortBy,
  sortOptions,
  visibleCount,
  totalCount,
  onShowMore,
}) {
  return (
    <div className="dashboardControls">
      <input
        value={search}
        onChange={(event) => onSearch(event.target.value)}
        placeholder="Search records"
      />
      <select value={sortBy} onChange={(event) => onSortBy(event.target.value)}>
        {sortOptions.map((option) => (
          <option value={option.value} key={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <span>
        Showing {Math.min(visibleCount, totalCount)} of {totalCount}
      </span>
      {visibleCount < totalCount && (
        <button type="button" onClick={onShowMore}>
          Load More
        </button>
      )}
    </div>
  );
}

export default DashboardControls;
