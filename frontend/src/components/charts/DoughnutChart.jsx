import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function DoughnutChart({angry, disgust, fear, happy, sad, surprise, neutral}) {
  const data = {
    labels: ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral'],
    datasets: [{
      label: 'Emotion',
      data: [angry, disgust, fear, happy, sad, surprise, neutral],
      backgroundColor: ['#fb7185', '#fbbf24', '#a78bfa', '#4ade80', '#3b82f6', '#f472b6', '#38bdf8'],
      borderColor: ['#fb7185', '#fbbf24', '#a78bfa', '#4ade80', '#3b82f6', '#f472b6', '#38bdf8']
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
            const label = data.labels[tooltipItem.dataIndex] || '';
            const value = data.datasets[0].data[tooltipItem.dataIndex];
            return `${label}: ${value}%`;
          }
        }
      }
    },
    responsive: true
  };

  return (
    <div>
      <Doughnut data={data} options={options} />
    </div>
  );
}

export default DoughnutChart;
