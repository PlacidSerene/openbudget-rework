import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { entries, keys, set } from "d3-collection";
import { ascending, descending } from "d3-array";

import {
  asTick,
  asDiff,
  DiffStyled,
  compareChartOptions,
} from "../utils/utils";

const DiffTable2 = ({ data, usePct, years, colors, diffColors }) => {
  const [sortBy, setSortBy] = useState("diff");

  const updateSort = (e) => {
    sortBy(e.target.value);
  };

  const sortFunc = sortBy === "diff" ? descending : ascending;
  const allKeys = set();
  keys(data[0]).forEach((key) => {
    allKeys.add(key);
  });
  keys(data[1]).forEach((key) => {
    allKeys.add(key);
  });
  const diffList = allKeys
    .values()
    .map((key) => {
      // check for key in both years; if one is missing,
      // set some special value that indicates that
      const res = {
        key,
        value: data[0][key],
        prev: data[1][key],
      };
      // if key exists in previous, we can calculate a diff;
      // missing values (removed entities) cast to zero for -100% diff
      if (res.prev) {
        res.diff = (res.value || 0) - res.prev;
        if (usePct) {
          res.diff = res.diff / Math.abs(res.prev);
        }
      } else {
        // sentinel value: indicates there was no previous budget,
        // so this is a newly created entity. UI can handle these differently
        // if desired, and they will sort to the top of the list.
        res.diff = Infinity;
      }
      return res;
    })
    .sort((a, b) => {
      return sortFunc(a[sortBy], b[sortBy]);
    })
    .map((entry) => {
      const data = {
        labels: [""],
        datasets: [
          {
            data: [entry.value],
            label: this.props.years[0].fiscal_year_range,
            backgroundColor: this.props.colors[0],
          },
          {
            data: [entry.prev],
            label: years[1].fiscal_year_range,
            backgroundColor: this.props.colors[1],
          },
        ],
      };
      return (
        <tr key={entry.key}>
          <td>
            <h4>
              {entry.key}
              <Bar data={data} options={compareChartOptions} height={40}></Bar>
            </h4>
          </td>
          <td>
            <DiffStyled
              diff={entry.diff}
              colors={diffColors}
              usePct={usePct}
            ></DiffStyled>
          </td>
        </tr>
      );
    });

  return (
    <table className="table">
      <thead>
        <tr>
          <th colSpan="2" className="form-horizontal">
            <div className="form-group">
              <label
                className="col-sm-3 col-sm-offset-6 control-label"
                htmlFor="sortControl"
              >
                sort by:{" "}
              </label>
              <div className="col-sm-3">
                <select
                  className="form-control"
                  id="sortControl"
                  value={sortBy}
                  onChange={updateSort}
                >
                  <option value="diff">amount</option>
                  <option value="key">name</option>
                </select>
              </div>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>{diffList}</tbody>
    </table>
  );
};

export default class DiffTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sortBy: "diff",
    };
    this.updateSort = this.updateSort.bind(this);
  }

  updateSort(event) {
    const target = event.target;
    this.setState({ sortBy: target.value });
  }

  render() {
    const sortFunc = this.state.sortBy === "diff" ? descending : ascending;

    // get list of all possible keys from both budgets
    const allKeys = set();
    keys(this.props.data[0]).forEach((key) => {
      allKeys.add(key);
    });
    keys(this.props.data[1]).forEach((key) => {
      allKeys.add(key);
    });
    const diffList = allKeys
      .values()
      .map((key) => {
        // check for key in both years; if one is missing,
        // set some special value that indicates that
        const res = {
          key,
          value: this.props.data[0][key],
          prev: this.props.data[1][key],
        };
        // if key exists in previous, we can calculate a diff;
        // missing values (removed entities) cast to zero for -100% diff
        if (res.prev) {
          res.diff = (res.value || 0) - res.prev;
          if (this.props.usePct) {
            res.diff = res.diff / Math.abs(res.prev);
          }
        } else {
          // sentinel value: indicates there was no previous budget,
          // so this is a newly created entity. UI can handle these differently
          // if desired, and they will sort to the top of the list.
          res.diff = Infinity;
        }
        return res;
      })
      .sort((a, b) => {
        return sortFunc(a[this.state.sortBy], b[this.state.sortBy]);
      })
      .map((entry) => {
        const data = {
          labels: [""],
          datasets: [
            {
              data: [entry.value],
              label: this.props.years[0].fiscal_year_range,
              backgroundColor: this.props.colors[0],
            },
            {
              data: [entry.prev],
              label: this.props.years[1].fiscal_year_range,
              backgroundColor: this.props.colors[1],
            },
          ],
        };

        return (
          <tr key={entry.key}>
            <td>
              <h4>
                {entry.key}
                <Bar
                  data={data}
                  options={compareChartOptions}
                  height={40}
                ></Bar>
              </h4>
            </td>
            <td>
              <DiffStyled
                diff={entry.diff}
                colors={this.props.diffColors}
                usePct={this.props.usePct}
              ></DiffStyled>
            </td>
          </tr>
        );
      });

    return (
      <table className="table">
        <thead>
          <tr>
            <th colSpan="2" className="form-horizontal">
              <div className="form-group">
                <label
                  className="col-sm-3 col-sm-offset-6 control-label"
                  htmlFor="sortControl"
                >
                  sort by:{" "}
                </label>
                <div className="col-sm-3">
                  <select
                    className="form-control"
                    id="sortControl"
                    value={this.state.sortBy}
                    onChange={this.updateSort}
                  >
                    <option value="diff">amount</option>
                    <option value="key">name</option>
                  </select>
                </div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>{diffList}</tbody>
      </table>
    );
  }
}
