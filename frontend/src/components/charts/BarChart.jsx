import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Color } from '../../theme/Colors';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function BarChart({ data, period }) {
  const labels = period === 'weekly'
    ? ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    : Object.keys(data).map(day => period === 'daily' ? day : `${day}`);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Positive Stress',
        data: Object.values(data).map(value => (value >= 0 ? value : 0)),
        backgroundColor: '#f87171',
        borderColor: '#f87171',
        borderWidth: 1,
      },
      {
        label: 'Negative Stress',
        data: Object.values(data).map(value => (value < 0 ? value : 0)),
        backgroundColor: '#4ade80',
        borderColor: '#4ade80',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: Color.chartText,
          font: {
            family: 'Arial', 
            size: 14, 
          },
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
          color: Color.chartText,
          font: {
            family: 'Arial', 
            size: 12,
          },
        },
        ticks: {
          color: Color.chartText, 
          font: {
            family: 'Arial', 
            size: 12,
          },
        },
        grid: {
          color: Color.chartGrids,  
        },
      },
      y: {
        title: {
          display: true,
          text: 'Stress Level',
          color: Color.chartText,
          font: {
            family: 'Arial', 
            size: 12,
          },
        },
        ticks: {
          color: Color.chartText, 
          font: {
            family: 'Arial', 
            size: 12,
          }, 
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