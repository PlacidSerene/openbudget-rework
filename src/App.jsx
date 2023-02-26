import { useState, useEffect } from "react";
import { Nav, NavItem, Tab } from "react-bootstrap";
import { schemeSet2 as colors } from "d3-scale-chromatic";
import Select from "react-select";
import { fetchTotals } from "./api/fetchTotals";
import { getBudgetDefaults } from "./getBudgetDefaults";
import { getBudgetOption } from "./getBudgetOption";
import Total from "./components/Total";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const styles = [{ color: colors[0] }, { color: colors[1] }];
const diffColors = {
  neg: "#e41a1c",
  pos: "#4daf4a",
};

const changesOptions = [
  { value: "pct", label: "percentage" },
  { value: "usd", label: "dollars" },
];

function App() {

  const [budgets, setBudgets] = useState([]);

  const [budget1Choice, setBudget1Choice] = useState({
    value: "FY18",
    label: "FY18 Adopted",
  });
  const [budget2Choice, setBudget2Choice] = useState({
    value: "FY17",
    label: "FY17 Adopted",
  });
  const [changeType, setChangeType] = useState({
    value: "pct",
    label: "percentage",
  });
  const [selectOptions, setSelectOptions] = useState([]);



  const budget1Options = selectOptions.filter(
    (option) => option.value !== budget2Choice.value
  );

  const budget2Options = selectOptions.filter(
    (option) => option.value !== budget1Choice.value
  );

  const selectedYears = budgets.filter(
    (budget) =>
      budget.year === budget1Choice.value || budget.year === budget2Choice.value
  );

  const totals = selectedYears.map((record) => {
    if (record) {
      return {
        key: record.fiscal_year_range,
        total: record.total,
      };
    }
  });

  useEffect(() => {
    fetchTotals()
      .then((data) => {
        const selectOptions = data.map((option) => {
          return {
            value: option.fiscal_year_range,
            label: `${option.fiscal_year_range} Adopted`,
          };
        });
        setSelectOptions(selectOptions);
        const budgets = data.map((option) => {
          return {
            total: option.total,
            year: option.fiscal_year_range,
          };
        });
        setBudgets(budgets);
      })
      .catch((err) => console.log(err));
  }, [fetchTotals]);

  const customStyles1 = {
    singleValue: (provided) => ({
      ...provided,
      height: "100%",
      color: "#66c2a5",
      paddingTop: "3px",
      fontWeight: "bold",
    }),
  };
  const customStyles2 = {
    singleValue: (provided) => ({
      ...provided,
      height: "100%",
      color: "#fc8d62",
      paddingTop: "3px",
      fontWeight: "bold",
      border: "none",
    }),
  };
  return (
    <div className="mx-auto max-w-[1280px] p-6">
      <div className="flex flex-col gap-5 sm:flex-row md:items-center">
        <h1 className="text-4xl font-bold">Compare</h1>
        <div>
          <Select
            options={budget1Options}
            value={budget1Choice}
            onChange={setBudget1Choice}
            searchable={false}
            clearable={false}
            styles={customStyles1}
          />
        </div>
        <h1 className="hidden text-4xl font-bold md:block">With</h1>
        <div>
          <Select
            options={budget2Options}
            value={budget2Choice}
            onChange={setBudget2Choice}
            searchable={false}
            clearable={false}
            styles={customStyles2}
          />
        </div>

        {/* <div className="">
          <div className="form-group">
            <label>Show changes as:</label>
            <select
              className="form-control"
              id="sortControl"
              value={state.changeType}
              onChange={updateChangeType}
            >
              <option value="pct">percentage</option>
              <option value="usd">dollars</option>
            </select>
          </div>
        </div> */}
        <div>
          <Select
            options={changesOptions}
            searchable={false}
            clearable={false}
            value={changeType}
            onChange={setChangeType}
          />
        </div>
      </div>

      <div className="mt-5">
        <Total
          barData={totals}
          colors={colors}
          diffColors={diffColors}
          usePct={changeType.value === "pct"}
        ></Total>
        <h2>Budget breakdowns</h2>
        <p>Get more detail on where money came from and how it was spent.</p>

        <div className="flex">
          <div>Hello</div>
          <div>Hello</div>
          <div>Hello</div>
        </div>
      </div>

      {/* <Tab.Container id="selectBreakdown" defaultActiveKey="spendDept">
        <div className="row">
          <div className="col-sm-3">
            <Nav bsStyle="pills" stacked>
              <NavItem eventKey="spendDept">Spending by Department</NavItem>
              <NavItem eventKey="spendCat">Spending by Category</NavItem>
              <NavItem eventKey="revDept">Revenue by Department</NavItem>
              <NavItem eventKey="revCat">Revenue by Category</NavItem>
            </Nav>
          </div>
          <div className="col-sm-9">
            <Tab.Content mountOnEnter>
              <Tab.Pane eventKey="spendDept">
                <Breakdown
                  colors={colors}
                  diffColors={diffColors}
                  usePct={usePct}
                  years={selectedYears}
                  type="spending"
                  dimension="department"
                ></Breakdown>
              </Tab.Pane>
              <Tab.Pane eventKey="spendCat">
                <Breakdown
                  colors={colors}
                  diffColors={diffColors}
                  usePct={usePct}
                  years={selectedYears}
                  type="spending"
                  dimension="category"
                ></Breakdown>
              </Tab.Pane>
              <Tab.Pane eventKey="revDept">
                <Breakdown
                  colors={colors}
                  diffColors={diffColors}
                  usePct={usePct}
                  years={selectedYears}
                  type="revenue"
                  dimension="department"
                ></Breakdown>
              </Tab.Pane>
              <Tab.Pane eventKey="revCat">
                <Breakdown
                  colors={colors}
                  diffColors={diffColors}
                  usePct={usePct}
                  years={selectedYears}
                  type="revenue"
                  dimension="category"
                ></Breakdown>
              </Tab.Pane>
            </Tab.Content>
          </div>
        </div>
      </Tab.Container> */}
    </div>
  );
}

export default App;
