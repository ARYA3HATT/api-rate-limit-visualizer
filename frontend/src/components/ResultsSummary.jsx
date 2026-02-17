import React from 'react';

function ResultsSummary({ summary, rateLimitHeaders, onReset }) {
  if (!summary) return null;

  const total = summary.total_requests || 1;
  const successPercent = ((summary.success_count / total) * 100).toFixed(1);
  const errorPercent = ((summary.error_count / total) * 100).toFixed(1);

  const statBox = { backgroundColor: "#f8f9fa", padding: "1rem", borderRadius: "8px", border: "1px solid #e9ecef", textAlign: "center", flex: "1 1 150px" };

  return (
    <div style={{ marginTop: "2rem", padding: "2rem", backgroundColor: "white", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
      <h2 style={{ marginTop: 0, borderBottom: "2px solid #eee", paddingBottom: "0.5rem" }}>Test Complete: Final Summary</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem", marginTop: "1rem" }}>
        <div style={statBox}><h3 style={{ margin: "0 0 0.5rem 0", fontSize: "2rem", color: "#333" }}>{summary.total_requests}</h3><span style={{ color: "#666", fontWeight: "bold" }}>Total Requests</span></div>
        <div style={{ ...statBox, borderBottom: "4px solid #28a745" }}><h3 style={{ margin: "0 0 0.5rem 0", fontSize: "2rem", color: "#28a745" }}>{summary.success_count}</h3><span style={{ color: "#666", fontWeight: "bold" }}>Successes ({successPercent}%)</span></div>
        <div style={{ ...statBox, borderBottom: "4px solid #dc3545" }}><h3 style={{ margin: "0 0 0.5rem 0", fontSize: "2rem", color: "#dc3545" }}>{summary.error_count}</h3><span style={{ color: "#666", fontWeight: "bold" }}>Errors ({errorPercent}%)</span></div>
        <div style={{ ...statBox, borderBottom: "4px solid #ffc107" }}><h3 style={{ margin: "0 0 0.5rem 0", fontSize: "2rem", color: "#ffc107" }}>{summary.rate_limit_hits}</h3><span style={{ color: "#666", fontWeight: "bold" }}>Rate Limit Hits (429)</span></div>
      </div>
      <h3 style={{ borderBottom: "1px solid #eee", paddingBottom: "0.5rem" }}>Latency & Response Times (ms)</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
        <div style={statBox}><strong>Min:</strong> {summary.response_times.min} ms</div>
        <div style={statBox}><strong>Max:</strong> {summary.response_times.max} ms</div>
        <div style={statBox}><strong>Avg:</strong> {summary.response_times.avg} ms</div>
        <div style={statBox}><strong>p50:</strong> {summary.response_times.p50} ms</div>
        <div style={{ ...statBox, backgroundColor: "#e8f4f8" }}><strong>p95:</strong> {summary.response_times.p95} ms</div>
        <div style={{ ...statBox, backgroundColor: "#e8f4f8" }}><strong>p99:</strong> {summary.response_times.p99} ms</div>
      </div>
      {rateLimitHeaders && Object.keys(rateLimitHeaders).length > 0 && (
        <>
          <h3 style={{ borderBottom: "1px solid #eee", paddingBottom: "0.5rem" }}>Detected Rate Limit Headers</h3>
          <ul style={{ backgroundColor: "#fff3cd", padding: "1rem 2rem", borderRadius: "8px", border: "1px solid #ffeeba" }}>
            {Object.entries(rateLimitHeaders).map(([key, value]) => (
              <li key={key} style={{ marginBottom: "0.5rem" }}><strong>{key}:</strong> {value || "N/A"}</li>
            ))}
          </ul>
        </>
      )}
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <button onClick={onReset} style={{ padding: "1rem 2rem", backgroundColor: "#333", color: "white", border: "none", borderRadius: "4px", fontSize: "1.1rem", cursor: "pointer", fontWeight: "bold" }}>
          Run Another Test
        </button>
      </div>
    </div>
  );
}
export default ResultsSummary;
