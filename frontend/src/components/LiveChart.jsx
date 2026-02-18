import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

export default function LiveChart({ data, isRunning }) {
  if (data.timestamps.length === 0) {
    return (
      <div style={{
        border: '1px solid var(--border)', borderRadius: '12px',
        padding: '4rem', textAlign: 'center',
        background: 'var(--bg-card)', marginBottom: '1rem'
      }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text-dim)', letterSpacing: '0.1em' }}>
          WAITING FOR DATA...
        </div>
      </div>
    );
  }

  const labels = data.timestamps.map(t => new Date(t * 1000).toLocaleTimeString());

  const lineData = {
    labels,
    datasets: [{
      label: 'Response Time (ms)',
      data: data.responseTimes,
      borderColor: '#00ff88',
      backgroundColor: 'rgba(0,255,136,0.05)',
      borderWidth: 1.5,
      pointRadius: 0,
      tension: 0.3,
      fill: true,
    }]
  };

  const barData = {
    labels: Object.keys(data.statusCodes),
    datasets: [{
      label: 'Requests',
      data: Object.values(data.statusCodes),
      backgroundColor: Object.keys(data.statusCodes).map(k =>
        k.startsWith('2') ? 'rgba(0,255,136,0.7)' :
        k.startsWith('4') ? 'rgba(255,68,68,0.7)' :
        k.startsWith('5') ? 'rgba(255,187,0,0.7)' : 'rgba(68,153,255,0.7)'
      ),
      borderRadius: 4,
    }]
  };

  const chartOptions = (title) => ({
    responsive: true, maintainAspectRatio: false,
    animation: { duration: 0 },
    plugins: {
      legend: { display: false },
      title: {
        display: true, text: title,
        color: '#6b8aaa', font: { family: 'JetBrains Mono', size: 11 },
        padding: { bottom: 16 }
      },
      tooltip: {
        backgroundColor: '#0e1318', borderColor: '#1e2d3d', borderWidth: 1,
        titleColor: '#6b8aaa', bodyColor: '#e8f0f8',
        titleFont: { family: 'JetBrains Mono', size: 11 },
        bodyFont: { family: 'JetBrains Mono', size: 12 },
      }
    },
    scales: {
      x: {
        ticks: { color: '#3d5470', font: { family: 'JetBrains Mono', size: 9 }, maxTicksLimit: 8 },
        grid: { color: '#0e1318' }
      },
      y: {
        ticks: { color: '#3d5470', font: { family: 'JetBrains Mono', size: 10 } },
        grid: { color: '#1e2d3d' }
      }
    }
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>
          LIVE DASHBOARD
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-dim)' }}>
          {data.timestamps.length} samples
        </div>
      </div>
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: '12px', padding: '1.5rem', height: '280px'
      }}>
        <Line data={lineData} options={chartOptions('RESPONSE TIME (ms)')} />
      </div>
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: '12px', padding: '1.5rem', height: '200px'
      }}>
        <Bar data={barData} options={chartOptions('STATUS CODE DISTRIBUTION')} />
      </div>
    </div>
  );
}