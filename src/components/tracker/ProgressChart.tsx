// ProgressChart.tsx
import React from "react";
import { Line } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js";

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

interface ProgressChartProps {
  activities: any[];
}

const ProgressChart: React.FC<ProgressChartProps> = ({ activities }) => {
  // Group activities by date
  const dataByDate: Record<string, number> = {};
  activities.forEach((a) => {
    const date = new Date(a.date).toLocaleDateString();
    dataByDate[date] = (dataByDate[date] || 0) + a.points_earned;
  });

  const labels = Object.keys(dataByDate).slice(-7); // last 7 days
  const dataPoints = labels.map((date) => dataByDate[date]);

  const data = {
    labels,
    datasets: [
      {
        label: "Points Earned",
        data: dataPoints,
        fill: false,
        borderColor: "#22c55e",
        tension: 0.2,
      },
    ],
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow">
      <h3 className="font-semibold text-gray-900 mb-2">Progress (Last 7 Days)</h3>
      <Line data={data} />
    </div>
  );
};

export default ProgressChart;
