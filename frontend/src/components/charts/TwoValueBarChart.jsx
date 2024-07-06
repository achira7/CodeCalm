import React from "react";
import { Bar } from "react-chartjs-2";

const TwoValueBarChart = ({ data, period }) => {
  const labels = Object.keys(data).map(day => `${day}`);
  let focusedValues, notFocusedValues;

  if (period === "daily") {
    focusedValues = labels.map((key) => data[key].focused);
    notFocusedValues = labels.map((key) => data[key].unfocused);
  } else if (period === "weekly") {
    focusedValues = labels.map((key) => data[key].focused);
    notFocusedValues = labels.map((key) => data[key].unfocused);
  } else if (period === "monthly") {
    focusedValues = labels.map((key) => data[key].focused);
    notFocusedValues = labels.map((key) => data[key].unfocused);
  } else {
    focusedValues = [];
    notFocusedValues = [];
  }

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Focused",
        data: focusedValues,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Not Focused",
        data: notFocusedValues,
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: period === "daily" ? 'Hour' : period === "weekly" ? 'Day of the Week' : 'Day of the Month',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Level',
        },
        beginAtZero: true,
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default TwoValueBarChart;
