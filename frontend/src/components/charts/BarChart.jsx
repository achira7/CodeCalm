import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Color } from '../../theme/Colors';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function BarChart({ data, period }) {
  const labels = period === 'weekly'
    ? ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    : Object.keys(data).map(day => period === 'daily' ? day : `Day ${day}`);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Stress Levels',
        data: Object.values(data),
        backgroundColor: Object.values(data).map(value => value < 0 ? '#4ade80' : '#f87171'),
        borderColor: Object.values(data).map(value => value < 0 ? '#4ade80' : '#f87171'),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
        position: 'bottom',
        labels: {
          color: Color.chartText // Legend font color
      }
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const label = chartData.labels[tooltipItem.dataIndex] || '';
            const value = chartData.datasets[0].data[tooltipItem.dataIndex];
            return `${label}: ${value} stress units`;
          },
        },
      },
    },
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Day/Hour',
          color: Color.chartText
        },
        ticks: {
          color: Color.chartText,  // Change the color of the x-axis labels
        },
        grid: {
          color: Color.chartGrids,  // Change the color of the x-axis grid lines
        },
      },
      y: {
        title: {
          display: true,
          text: 'Stress Level',
          color: Color.chartText
        },
        ticks: {
          color: Color.chartText,  
        },
        grid: {
          color: Color.chartGrids,  
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <Bar data={chartData} options={options} />
    </div>
  );
}

export default BarChart;