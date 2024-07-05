import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Color } from '../../theme/Colors';  // Assuming Color.chartText is defined in your theme

ChartJS.register(ArcElement, Tooltip, Legend);

function DoughnutChart({ angry, disgust, fear, happy, sad, surprise, neutral }) {
  const total = angry + disgust + fear + happy + sad + surprise + neutral;
  const data = {
    labels: ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral'],
    datasets: [{
      label: 'Emotion',
      data: [angry, disgust, fear, happy, sad, surprise, neutral],
      backgroundColor: ['#fb7185', '#fbbf24', '#a78bfa', '#4ade80', '#3b82f6', '#f472b6', '#38bdf8'],
      borderColor: ['#f83350', '#cc9200', '#6739f0', '#06bb49', '#0655d3', '#e91c86', '#0085be'],
      borderWidth: 2,  // Border width in pixels
    }]
  };

  const options = {
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: Color.chartText,  // Legend font color
          boxWidth: 40,  // Width of the color boxes
          boxHeight: 13,  
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const label = data.labels[tooltipItem.dataIndex] || '';
            const value = data.datasets[0].data[tooltipItem.dataIndex];
            const percentage = ((value / total) * 100).toFixed(2);
            return `${label}: ${percentage}%`;
          }
        }
      }
    },
    responsive: true,
    cutoutPercentage: 50,
  };

  return (
    <div>
      <Doughnut data={data} options={options} />
    </div>
  );
}

export default DoughnutChart;
