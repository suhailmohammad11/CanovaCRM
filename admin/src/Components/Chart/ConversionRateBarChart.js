import "./ChartStyles.css";

import { Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { useAdmin } from "../../Hooks/useAdmin";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const getLast14DaysLabels = () => {
  const labels = [];
  const today = new Date();

  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    labels.push(DAYS[d.getDay()]);
  }

  return labels;
};

const mapDataTo14Days = (backendData) => {
  const today = new Date();
  const map = {};

  backendData.forEach((item) => {
    map[new Date(item.date).toDateString()] = item.conversionRate;
  });

  const values = [];

  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    values.push(map[d.toDateString()] ?? 0);
  }

  return values;
};

const ConversionRateBarChart = () => {
  const { getConversionRate } = useAdmin();
  const [backendData, setBackendData] = useState([]);

  useEffect(() => {
    getConversionRate().then(setBackendData);
  }, [getConversionRate]);

  const labels = getLast14DaysLabels();
  const values = mapDataTo14Days(backendData);

  const data = {
    labels,
    datasets: [
      {
        label: "Conversion Rate (%)",
        data: values,
        backgroundColor: "#00181B",
        borderRadius: 6,
        barThickness: 18,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: {
          callback: (v) => `${v}%`,
        },
      },
    },
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <div className="chart-styles">
      <Bar data={data} options={options} />
    </div>
  );
};

export default ConversionRateBarChart;
