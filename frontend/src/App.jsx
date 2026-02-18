import React, { useState, useRef } from 'react';
import TestForm from './components/TestForm';
import LiveChart from './components/LiveChart';
import ResultsSummary from './components/ResultsSummary';

const BACKEND_URL = "https://api-rate-limit-visualizer-production.up.railway.app";

export default function App() {
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [summary, setSummary] = useState(null);
  const [rateLimitHeaders, setRateLimitHeaders] = useState({});
  const [requestCount, setRequestCount] = useState(0);
  const [chartData, setChartData] = useState({
    timestamps: [], responseTimes: [], statusCodes: {}, errors: []
  });
  const wsRef = useRef(null);

  const fetchSummary = async (id) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/test/${id}/summary`);
      setSummary(await res.json());
    } catch (e) { console.error(e); }
  };

  const startTest = async (config) => {
    setChartData({ timestamps: [], responseTimes: [], statusCodes: {}, errors: [] });
    setIsComplete(false); setSummary(null); setRateLimitHeaders({}); setRequestCount(0);
    try {
      const res = await fetch(`${BACKEND_URL}/api/run-test`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config)
      });
      const data = await res.json();
      const testId = data.test_id;
      const ws = new WebSocket(`wss://${BACKEND_URL.replace("https://", "")}/ws/${testId}`);
      wsRef.current = ws;
      ws.onopen = () => setIsRunning(true);
      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.type === "TEST_COMPLETE") {
          setIsRunning(false); setIsComplete(true);
          fetchSummary(testId); ws.close(); return;
        }
        if (msg.results) {
          setRequestCount(c => c + msg.results.length);
          setChartData(prev => {
            const t = [...prev.timestamps], r = [...prev.responseTimes],
                  s = { ...prev.statusCodes }, e = [...prev.errors];
            msg.results.forEach(req => {
              t.push(req.timestamp); r.push(req.response_time_ms);
              const code = req.status_code || "ERR";
              s[code] = (s[code] || 0) + 1;
              if (req.error) e.push(req.error);
              if (req.rate_limit_headers && Object.keys(req.rate_limit_headers).length > 0)
                setRateLimitHeaders(req.rate_limit_headers);
            });
            return { timestamps: t, responseTimes: r, statusCodes: s, errors: e };
          });
        }
      };
      ws.onerror = () => {};
      ws.onclose = () => {};
      setIsRunning(true);
    } catch {
      alert("Could not connect to the backend server.");
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <header style={{
        borderBottom: '1px solid var(--border)',
        padding: '0 2rem',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        background: 'rgba(8,11,15,0.95)',
        backdropFilter: 'blur(12px)',
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '28px', height: '28px', background: 'var(--accent-dim)',
            border: '1px solid var(--accent-mid)', borderRadius: '6px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '14px'
          }}>⚡</div>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '0.05em' }}>
            RATE<span style={{ color: 'var(--accent)' }}>LIMIT</span>.VIZ
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {isRunning && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '6px', height: '6px', borderRadius: '50%',
                background: 'var(--accent)',
                boxShadow: '0 0 8px var(--accent)',
                animation: 'pulse 1s infinite'
              }} />
              <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--accent)' }}>
                LIVE — {requestCount} req
              </span>
            </div>
          )}
          <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-dim)' }}>v1.0.0</span>
        </div>
      </header>

      <style>{`
        @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.3 } }
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }
      `}</style>

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 2rem' }}>
        {!isRunning && !isComplete && <TestForm onStart={startTest} isRunning={isRunning} />}
        {(isRunning || isComplete) && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <LiveChart data={chartData} isRunning={isRunning} />
            {isComplete && summary && (
              <ResultsSummary
                summary={summary}
                rateLimitHeaders={rateLimitHeaders}
                onReset={() => { setIsComplete(false); setIsRunning(false); if (wsRef.current) wsRef.current.close(); }}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}