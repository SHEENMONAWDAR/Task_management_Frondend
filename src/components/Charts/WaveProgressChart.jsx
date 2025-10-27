import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function WaveProgressChart({ monthlyData = [] }) {
  const months = monthlyData.map((m) => m.month);

  const data = {
    labels: months,
    datasets: [
      {
        label: "Total Tasks",
        data: monthlyData.map((m) => m.total_tasks),
        fill: true,
        backgroundColor: "rgba(59,130,246,0.2)",
        borderColor: "#3B82F6",
        tension: 0.4,
        pointBackgroundColor: "#3B82F6",
        pointHoverRadius: 6,
      },
      {
        label: "Completed",
        data: monthlyData.map((m) => m.completed),
        fill: true,
        backgroundColor: "rgba(34,197,94,0.2)",
        borderColor: "#22C55E",
        tension: 0.4,
        pointBackgroundColor: "#22C55E",
        pointHoverRadius: 6,
      },
      {
        label: "In Progress",
        data: monthlyData.map((m) => m.inProgress),
        fill: true,
        backgroundColor: "rgba(250,204,21,0.2)",
        borderColor: "#FACC15",
        tension: 0.4,
        pointBackgroundColor: "#FACC15",
        pointHoverRadius: 6,
      },
      {
        label: "Others",
        data: monthlyData.map((m) => m.others),
        fill: true,
        backgroundColor: "rgba(156,163,175,0.2)",
        borderColor: "#9CA3AF",
        tension: 0.4,
        pointBackgroundColor: "#9CA3AF",
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "#111827",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 10,
      },
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Task Count",
          color: "#374151",
          font: { size: 14, weight: "700" },
        },
        ticks: { color: "#6B7280", font: { size: 13 } },
        grid: { color: "rgba(0,0,0,0.05)" },
      },
      x: {
        title: {
          display: true,
          text: "Month",
          color: "#374151",
          font: { size: 14, weight: "600" },
        },
        ticks: { color: "#6B7280", font: { size: 12 } },
        grid: { color: "rgba(0,0,0,0.05)" },
      },
    },
  };

  return (
    <div className="space-y-4">
      <div className="p-1 max-w-4xl mx-auto">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Tasks Analytics</h2>
          <p className="text-gray-500 mt-1">Task completion and progress over time</p>
        </div>

        <div className="h-[350px]">
          {monthlyData.length > 0 ? (
            <Line data={data} options={options} />
          ) : (
            <p className="text-center text-gray-400 mt-24 text-lg">No data available</p>
          )}
        </div>
      </div>
    </div>
  );
}
