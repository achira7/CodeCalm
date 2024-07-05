import React from 'react';
import { Color } from '../../theme/Colors';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);



function LineChart({ data, period }) {
  const labels = period === 'weekly' 
    ? ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    : Object.keys(data).map(day => `Day ${day}`);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Breathing Exercise Duration',
        data: Object.values(data),
        fill: false,
        backgroundColor: '#38bdf8',
        borderColor: '#38bdf8',
      },
      
    ]
  };

  const options = {
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: Color.chartText // Legend font color
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
          text: 'Day',
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
          text: 'Duration (seconds)',
          color: Color.chartText,
        },
        grid: {
          color: Color.chartGrids,  // Change the color of the x-axis grid lines
        },
        ticks: {
          color: Color.chartText,  // Change the color of the x-axis labels
        },
        beginAtZero: true
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
