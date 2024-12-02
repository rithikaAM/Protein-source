import React from "react";
import { Bar } from "react-chartjs-2";

const Charts = ({ data }) => {
  if (!data) {
    return null;
  }

  const chartData = {
    labels: data.labels, // Food item names
    datasets: [
      {
        label: "Nutritional Value",
        data: data.values, // Corresponding values
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  return (
    <div className="charts">
      <h2>Analysis Results</h2>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default Charts;
