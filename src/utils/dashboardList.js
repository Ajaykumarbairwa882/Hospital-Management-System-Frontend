export const normalizeText = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).toLowerCase();
};

export const filterRecords = (records, search, fields) => {
  const query = normalizeText(search).trim();

  if (!query) {
    return records;
  }

  return records.filter((record) =>
    fields.some((field) => normalizeText(field(record)).includes(query)),
  );
};

export const sortRecords = (records, sortBy, sortMap) => {
  const sortItem = sortMap[sortBy] || sortMap.name;

  return [...records].sort((first, second) => {
    const firstValue = normalizeText(sortItem.getValue(first));
    const secondValue = normalizeText(sortItem.getValue(second));
    return sortItem.direction * firstValue.localeCompare(secondValue);
  });
};

export const getVisibleRecords = ({
  records,
  search,
  fields,
  sortBy,
  sortMap,
  visibleCount,
}) => {
  const filteredRecords = filterRecords(records, search, fields);
  const sortedRecords = sortRecords(filteredRecords, sortBy, sortMap);

  return {
    totalCount: sortedRecords.length,
    visibleRecords: sortedRecords.slice(0, visibleCount),
  };
};
