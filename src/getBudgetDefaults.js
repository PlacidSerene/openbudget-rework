export function getBudgetDefaults(budgets) {
  // TODO: add a more sophisiticated selection algorithm;
  // e.g. find current year, compare adopted to proposed,
  // or proposed to previous adopted, etc
  let index1 = 0;
  let index2 = 1;
  // 19-20 proposed, if we have it
  const currI = budgets.findIndex((record) => {
    return record.label === "FY19-20 Adopted";
  });
  // 18-19 proposed, if we have it
  const prevI = budgets.findIndex((record) => {
    return record.label === "FY18-19 Adopted";
  });
  // if we have both, use their indexes instead
  if (currI > -1 && prevI > -1) {
    index1 = currI;
    index2 = prevI;
  }
  return [budgets[index1], budgets[index2]];
}
