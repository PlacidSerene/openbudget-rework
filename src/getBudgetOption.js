const BUDGET_TYPES = {
  1: "Adopted",
  2: "Adjusted",
  3: "Proposed",
};

export function getBudgetOption(record, index) {
  return {
    value: index,
    label: `${record.fiscal_year_range} ${BUDGET_TYPES[record.budget_type]}`,
  };
}
