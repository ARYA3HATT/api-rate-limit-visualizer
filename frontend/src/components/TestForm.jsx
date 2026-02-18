import React, { useState } from 'react';

export default function TestForm({ onStart, isRunning }) {
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('GET');
  const [requestCount, setRequestCount] = useState(50);
  const [concurrency, setConcurrency] = useState(10);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url) return;
    onStart({ url, method, request_count: parseInt(requestCount), concurrency: parseInt(concurrency) });
  };

  const inputStyle = {
    width: '100%', padding: '0.65rem 0.875rem',
    background: 'var(--bg)', border: '1px solid var(--border)',
    borderRadius: '6px', color: 'var(--text-primary)',
    fontFamily: 'var(--mono)', fontSize: '13px',
    outline: 'none', transition: 'border-color 0.2s',
  };
  const labelStyle = {
    display: 'block', marginBottom: '0.4rem',
    fontFamily: 'var(--mono)', fontSize: '10px',
    fontWeight: 600, color: 'var(--text-secondary)',
    letterSpacing: '0.1em', textTransform: 'uppercase'
  };

  return (
    <div style={{ animation: 'fadeIn 0.4s ease' }}>
      {/* Hero */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--accent)',
          letterSpacing: '0.15em', marginBottom: '1rem', textTransform: 'uppercase'
        }}>// API Load Testing Tool</div>
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300,
          color: 'var(--text-primary)', lineHeight: 1.1, marginBottom: '1rem',
          letterSpacing: '-0.02em'
        }}>
          Stress test any<br />
          <span style={{ color: 'var(--accent)', fontWeight: 600 }}>API endpoint.</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', maxWidth: '480px', lineHeight: 1.6 }}>
          Fire concurrent HTTP requests and visualize latency, error rates, and rate limiting in real time.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem'
        }}>
          {/* URL */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={labelStyle}>Target URL</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <select
                value={method}
                onChange={e => setMethod(e.target.value)}
                style={{
                  ...inputStyle, width: 'auto', padding: '0.65rem 0.75rem',
                  color: method === 'GET' ? 'var(--accent)' : 'var(--yellow)',
                  cursor: 'pointer'
                }}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
              </select>
              <input
                type="text" value={url} onChange={e => setUrl(e.target.value)}
                placeholder="https://api.example.com/endpoint"
                required style={{ ...inputStyle, flex: 1 }}
                onFocus={e => e.target.style.borderColor = 'var(--accent-mid)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
          </div>

          {/* Sliders row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label style={labelStyle}>
                Total Requests <span style={{ color: 'var(--accent)', marginLeft: '0.5rem' }}>{requestCount}</span>
              </label>
              <input type="range" min="10" max="1000" step="10" value={requestCount}
                onChange={e => setRequestCount(e.target.value)}
                style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-dim)' }}>10</span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-dim)' }}>1000</span>
              </div>
            </div>
            <div>
              <label style={labelStyle}>
                Concurrency <span style={{ color: 'var(--accent)', marginLeft: '0.5rem' }}>{concurrency}</span>
              </label>
              <input type="range" min="1" max="50" step="1" value={concurrency}
                onChange={e => setConcurrency(e.target.value)}
                style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-dim)' }}>1</span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-dim)' }}>50</span>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit" disabled={isRunning}
          style={{
            width: '100%', padding: '0.875rem',
            background: isRunning ? 'var(--bg-elevated)' : 'var(--accent)',
            color: isRunning ? 'var(--text-dim)' : '#000',
            border: 'none', borderRadius: '8px',
            fontFamily: 'var(--mono)', fontSize: '13px', fontWeight: 700,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            cursor: isRunning ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s'
          }}
        >
          {isRunning ? '● Running...' : '▶ Run Load Test'}
        </button>
      </form>

      {/* Quick test URLs */}
      <div style={{ marginTop: '1.5rem' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-dim)', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>QUICK TEST →</div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['https://httpbin.org/get', 'https://jsonplaceholder.typicode.com/posts', 'https://catfact.ninja/fact'].map(u => (
            <button key={u} onClick={() => setUrl(u)} style={{
              padding: '0.3rem 0.75rem', background: 'transparent',
              border: '1px solid var(--border)', borderRadius: '4px',
              color: 'var(--text-secondary)', fontFamily: 'var(--mono)',
              fontSize: '11px', cursor: 'pointer', transition: 'all 0.15s'
            }}
              onMouseEnter={e => { e.target.style.borderColor = 'var(--accent-mid)'; e.target.style.color = 'var(--accent)'; }}
              onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text-secondary)'; }}
            >{u.replace('https://', '')}</button>
          ))}
        </div>
      </div>
    </div>
  );
}