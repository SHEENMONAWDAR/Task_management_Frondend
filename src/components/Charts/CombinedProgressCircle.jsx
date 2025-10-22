import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CombinedProgressCircle({ completed = 0, inProgress = 0, others = 0 }) {
  const data = {
    labels: ["Completed", "In Progress", "Others"],
    datasets: [
      {
        data: [completed, inProgress, others],
        backgroundColor: ["#22C55E", "#FACC15", "#9CA3AF"], 
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: "80%", 
    rotation: 0, 
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 12,
          color: "#374151",
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.formattedValue}%`,
        },
      },
    },
  };

  const total = Math.round(completed + inProgress + others);

  return (
    <div className="relative w-56 h-56">
      <Doughnut data={data} options={options} />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-2xl font-bold text-gray-800">{total}%</p>
        <p className="text-sm text-gray-500">Total Progress</p>
      </div>
    </div>
  );
}
