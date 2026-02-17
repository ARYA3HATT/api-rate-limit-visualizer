import React from 'react';
// 1. Import all the individual pieces Chart.js needs to draw on the canvas
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
// Import the React wrapper components
import { Line, Bar } from 'react-chartjs-2';

// 2. Register the pieces globally so Chart.js knows how to use them
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function LiveChart({ data }) {
  // 3. Handle the Empty State gracefully using a simple if statement
  if (data.timestamps.length === 0) {
    return (
      <div style={{ padding: "3rem", textAlign: "center", border: "2px dashed #ccc", borderRadius: "8px", color: "#666" }}>
        <h3>Waiting for test to start...</h3>
        <p>Enter an API URL above and click "Run Load Test" to see live metrics.</p>
      </div>
    );
  }

  // 4. Prepare data for the Line Chart (Response Times)
  // We convert UNIX timestamps (seconds) into readable local time strings
  const timeLabels = [];
  for (let i = 0; i < data.timestamps.length; i++) {
    const dateObj = new Date(data.timestamps[i] * 1000);
    timeLabels.push(dateObj.toLocaleTimeString());
  }

  const lineChartConfig = {
    labels: timeLabels,
    datasets: [
      {
        label: 'Response Time (ms)',
        data: data.responseTimes,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.2, // Adds a slight curve to the line
        pointRadius: 2, // Makes the dots smaller so the chart isn't crowded
      }
    ]
  };

  // 5. Prepare data for the Bar Chart (Status Codes)
  // Extract keys (e.g., "200", "404") and values (e.g., 45, 5) from our statusCodes object
  const statusCodeLabels = Object.keys(data.statusCodes);
  const statusCodeCounts = Object.values(data.statusCodes);

  const barChartConfig = {
    labels: statusCodeLabels,
    datasets: [
      {
        label: 'Number of Requests',
        data: statusCodeCounts,
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
      }
    ]
  };

  // 6. Render the charts side-by-side or stacked depending on screen size
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      
      {/* Line Chart Container */}
      <div style={{ height: "400px", width: "100%", backgroundColor: "white", padding: "1rem", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
        <Line 
          data={lineChartConfig} 
          options={{ maintainAspectRatio: false, animation: { duration: 0 } }} 
        />
      </div>

      {/* Bar Chart Container */}
      <div style={{ height: "300px", width: "100%", backgroundColor: "white", padding: "1rem", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
        <Bar 
          data={barChartConfig} 
          options={{ maintainAspectRatio: false, animation: { duration: 500 } }} 
        />
      </div>

    </div>
  );
}

export default LiveChart;