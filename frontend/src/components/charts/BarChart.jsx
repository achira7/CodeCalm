import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, Tooltip, Legend, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(BarElement, Tooltip, Legend, CategoryScale, LinearScale);

const BarChart = ({ data }) => {
  const chartData = {
    labels: Object.keys(data),
    datasets: [{
      label: 'Dominant Emotion',
      data: Object.values(data).map(emotion => ({
        angry: 1,
        disgust: 2,
        fear: 3,
        happy: 4,
        sad: 5,
        surprise: 6,
        neutral: 7
      }[emotion])),
      backgroundColor: ['#fb7185', '#fbbf24', '#a78bfa', '#4ade80', '#3b82f6', '#f472b6', '#38bdf8'],
      borderColor: ['#fb7185', '#fbbf24', '#a78bfa', '#4ade80', '#3b82f6', '#f472b6', '#38bdf8'],
      borderWidth: 1
    }]
  };

  const options = {
    plugins: {
      legend: {
        display: true,
        position: 'bottom'
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const label = chartData.labels[tooltipItem.dataIndex] || '';
            const value = Object.values(data)[tooltipItem.dataIndex];
            return `${label}: ${value}`;
          }
        }
      }
    },
    responsive: true,
    scales: {
      x: {
        beginAtZero: true
      },
      y: {
        beginAtZero: true,
        max: 7,
        ticks: {
          callback: function(value) {
            const emotions = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral'];
            return emotions[value - 1];
          }
        }
      }
    }
  };

  return (
    <div>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BarChart;
