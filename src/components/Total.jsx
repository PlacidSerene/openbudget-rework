import React from "react";
import { Bar } from "react-chartjs-2";
import { entries } from "d3-collection";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import {
  asTick,
  asDiff,
  DiffStyled,
  compareChartOptions,
} from "../utils/utils";
// import Spinner from "react-spinkit";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  indexAxis: "y",
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  scales: {
    x: {
      ticks: {
        beginAtZero: true,
        callback: (value) => {
          // display as currency in millions
          return `${asTick(value / 1000000)}M`;
        },
      },
    },
  },
  // responsive: true,
  // legend: {
  //   display: false,
  // },
  plugins: {
    legend: {
      display: false,
    },
  },
};
const Total = ({ barData, colors, diffColors, usePct, test }) => {
  if (barData.length === 0 || barData.some((record) => !record)) {
    return <div>Loading...</div>;
  }
  let diff = barData[0].total - barData[1].total;
  if (usePct) {
    diff = diff / barData[1].total;
  }
  const data = {
    labels: ["Total"],
    datasets: barData.map((entry, i) => {
      return {
        data: [entry.total],
        label: entry.key,
        backgroundColor: colors[i],
        // maxBarThickness: 30,
        barPercentage: 1,
        categoryPercentage: 0.4,
      };
    }),
  };

  return (
    <div>
      <h2 className="text-3xl">
        Total Change:
        <DiffStyled
          diff={diff}
          colors={diffColors}
          usePct={usePct}
        ></DiffStyled>
      </h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default Total;
