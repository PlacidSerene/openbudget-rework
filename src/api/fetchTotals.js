import axios from "axios";
import { descending } from "d3-array";
const url =
  "https://api.openbudgetsac.org/?rest_route=/obo/v1/fiscal-years-expenses";
export const fetchTotals = async () => {
  try {
    const response = await axios.get(url);
    const data = await response.data;
    if (data) {
      data.sort((a, b) => {
        // sort in reverse chronological order,
        // then adjusted,adopted,proposed within each year
        const [indexA, indexB] = [a, b].map((record) => {
          const year = record.fiscal_year_range.slice(2, 4);
          // type numbers don't really correspond to the order we want;
          // this rearranges them
          const type = 6 / record.budget_type;
          // construct numbers that will sort in descending order;
          // 2 digit year before the decimal, transformed type number after
          return +`${year}.${type}`;
        });
        return descending(indexA, indexB);
      });
    }
    return data;
  } catch (err) {
    console.log(err);
  }
};
