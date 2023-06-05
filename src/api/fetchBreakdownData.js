export function fetchBreakdownData(years, yearTypes, type, dimension) {
  // start two concurrent requests, one per year;
  // wait for them both to return before ending the fetch
  const urls = years.map((year) => {
    // return API_BASE + typePaths[type] + dimensionPaths[dimension] + `/${year}.json`;
    return API_BASE + typePaths[type] + dimensionPaths[dimension] + "/" + year;
  });
  return axios.all(urls.map((url) => axios.get(url))).then(
    axios.spread((...budgets) => {
      // put the data in the thing
      // TODO: filter by budget type, API returns records from all
      return budgets.map((b, i) =>
        b.data.reduce((acc, row) => {
          // filter rows that don't match the desired budget type;
          // double-equals because it might be an integer in string form
          if (row.budget_type == yearTypes[i]) {
            // convert to object and cast totals to numbers
            acc[row[dimensionKeys[dimension]]] = +row.total;
          }
          return acc;
        }, {})
      );
    })
  );
}
