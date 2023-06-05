import { useState, useEffect } from "react";
import {
  Nav,
  NavItem,
  TabContent,
  TabContainer,
  TabPane,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { schemeSet2 as colors } from "d3-scale-chromatic";
import Select from "react-select";
import { fetchTotals } from "./api/fetchTotals";
import { getBudgetDefaults } from "./getBudgetDefaults";
import { getBudgetOption } from "./getBudgetOption";
import Total from "./components/Total";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { set } from "d3-collection";
import Breakdown from "./components/Breakdown";
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
  const [budget1Choice, setBudget1Choice] = useState({});
  const [budget2Choice, setBudget2Choice] = useState({});
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

  const selectedYears = [budget1Choice, budget2Choice];

  useEffect(() => {
    fetchTotals()
      .then((data) => {
        const selectOptions = data.map((option) => {
          return {
            value: option.fiscal_year_range,
            label: `${option.fiscal_year_range} Adopted`,
            total: option.total,
          };
        });

        //default budget 1 and 2
        const defaultBudget1Choice = {
          value: data[0].fiscal_year_range,
          label: `${data[0].fiscal_year_range} Adopted`,
          total: data[0].total,
        };
        const defaultBudget2Choice = {
          value: data[1].fiscal_year_range,
          label: `${data[1].fiscal_year_range} Adopted`,
          total: data[1].total,
        };
        setBudget1Choice(defaultBudget1Choice);
        setBudget2Choice(defaultBudget2Choice);
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
          barData={selectedYears}
          colors={colors}
          diffColors={diffColors}
          usePct={changeType.value === "pct"}
        ></Total>
        <h2>Budget breakdowns</h2>
        <p>Get more detail on where money came from and how it was spent.</p>
      </div>

      <TabContainer id="selectBreakdown" defaultActiveKey="spendDept">
        <div className="row">
          <div className="col-sm-3">
            <Nav bsStyle="pills" stacked>
              <Nav.Item eventKey="spendDept">Spending by Department</Nav.Item>
              <Nav.Item eventKey="spendCat">Spending by Category</Nav.Item>
              <Nav.Item eventKey="revDept">Revenue by Department</Nav.Item>
              <Nav.Item eventKey="revCat">Revenue by Category</Nav.Item>
            </Nav>
          </div>
          <div className="col-sm-9">
            <TabContent mountOnEnter>
              <TabPane eventKey="spendDept">
                {/* <Breakdown
                  colors={colors}
                  diffColors={diffColors}
                  usePct={usePct}
                  years={selectedYears}
                  type="spending"
                  dimension="department"
                ></Breakdown> */}
              </TabPane>
              <TabPane eventKey="spendCat">
                {/* <Breakdown
                  colors={colors}
                  diffColors={diffColors}
                  usePct={usePct}
                  years={selectedYears}
                  type="spending"
                  dimension="category"
                ></Breakdown> */}
              </TabPane>
              <TabPane eventKey="revDept">
                {/* <Breakdown
                  colors={colors}
                  diffColors={diffColors}
                  usePct={usePct}
                  years={selectedYears}
                  type="revenue"
                  dimension="department"
                ></Breakdown> */}
              </TabPane>
              <TabPane eventKey="revCat">
                {/* <Breakdown
                  colors={colors}
                  diffColors={diffColors}
                  usePct={usePct}
                  years={selectedYears}
                  type="revenue"
                  dimension="category"
                ></Breakdown> */}
              </TabPane>
            </TabContent>
          </div>
        </div>
      </TabContainer>
    </div>
  );
}

export default App;
