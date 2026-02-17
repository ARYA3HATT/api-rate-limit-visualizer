import React, { useState } from 'react';

function TestForm({ onStart, isRunning }) {
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('GET');
  const [requestCount, setRequestCount] = useState(50);
  const [concurrency, setConcurrency] = useState(10);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url === '') { alert("Please enter a valid API URL."); return; }
    onStart({ url, method, request_count: parseInt(requestCount), concurrency: parseInt(concurrency) });
  };

  return (
    <div style={{ backgroundColor: "#f4f4f9", padding: "2rem", borderRadius: "8px", border: "1px solid #ddd" }}>
      <h2>Configure Load Test</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>Target API URL:</label>
          <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://api.example.com/data" style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }} required />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>HTTP Method:</label>
          <select value={method} onChange={(e) => setMethod(e.target.value)} style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}>
            <option value="GET">GET</option>
            <option value="POST">POST</option>
          </select>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>Total Requests (Max 1000):</label>
          <input type="number" min="1" max="1000" value={requestCount} onChange={(e) => setRequestCount(e.target.value)} style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>Concurrency (Max 50):</label>
          <input type="number" min="1" max="50" value={concurrency} onChange={(e) => setConcurrency(e.target.value)} style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }} />
        </div>
        <button type="submit" disabled={isRunning} style={{ padding: "1rem", backgroundColor: isRunning ? "#aaa" : "#007bff", color: "white", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: isRunning ? "not-allowed" : "pointer", marginTop: "1rem" }}>
          {isRunning ? "Test in Progress..." : "Run Load Test"}
        </button>
      </form>
    </div>
  );
}
export default TestForm;
