import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Color } from '../../theme/Colors';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function LineChart({ data, period }) {
  const labels = period === 'weekly' 
    ? ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    : Object.keys(data).map(day => `${day}`);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Breathing Exercise Duration',
        data: Object.values(data),
        fill: false,
        backgroundColor: '#38bdf8',
        borderColor: '#38bdf8',
      }
    ]
  };

  const options = {
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: Color.chartText 
        }
      },
      tooltip: {
        titleColor: 'blue',
        bodyColor: 'green',
        callbacks: {
          label: function (tooltipItem) {
            const label = chartData.labels[tooltipItem.dataIndex] || '';
            const value = chartData.datasets[0].data[tooltipItem.dataIndex];
            return `${label}: ${value} seconds`;
          }
        }
      }
    },
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Days',
          color: Color.chartText
        },
        ticks: {
          color: Color.chartText,  
        },
        grid: {
          color: Color.chartGrids,  
        }
      },
      y: {
        title: {
          display: true,
          text: 'Duration (seconds)',
          color: Color.chartText,
        },
        beginAtZero: true,
        ticks: {
          color: Color.chartText,  
        },
        grid: {
          color: Color.chartGrids,  
        }
      }
    }
  };

  return (
    <div>
      <Line data={chartData} options={options} />
    </div>
  );
}

export default LineChart;
