import React from 'react';

export default function ResultsSummary({ summary, rateLimitHeaders, onReset }) {
  if (!summary) return null;

  const total = summary.total_requests || 1;
  const successPct = ((summary.success_count / total) * 100).toFixed(1);

  const Stat = ({ label, value, color = 'var(--text-primary)', large = false }) => (
    <div style={{
      background: 'var(--bg)', border: '1px solid var(--border)',
      borderRadius: '8px', padding: '1rem 1.25rem',
    }}>
      <div style={{
        fontFamily: 'var(--mono)', fontSize: large ? '1.75rem' : '1.4rem',
        fontWeight: 700, color, marginBottom: '0.25rem', lineHeight: 1
      }}>{value}</div>
      <div style={{
        fontFamily: 'var(--mono)', fontSize: '10px',
        color: 'var(--text-dim)', letterSpacing: '0.1em', textTransform: 'uppercase'
      }}>{label}</div>
    </div>
  );

  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: '12px', padding: '1.5rem',
      animation: 'fadeIn 0.4s ease'
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)'
      }}>
        <div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--accent)', letterSpacing: '0.15em', marginBottom: '0.25rem' }}>// TEST COMPLETE</div>
          <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>Final Summary</div>
        </div>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: '13px', fontWeight: 700,
          color: parseFloat(successPct) === 100 ? 'var(--accent)' : 'var(--yellow)'
        }}>{successPct}% SUCCESS</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <Stat label="Total Requests" value={summary.total_requests} large />
        <Stat label="Successes" value={summary.success_count} color="var(--accent)" large />
        <Stat label="Errors" value={summary.error_count} color={summary.error_count > 0 ? 'var(--red)' : 'var(--text-dim)'} large />
        <Stat label="Rate Limited" value={summary.rate_limit_hits} color={summary.rate_limit_hits > 0 ? 'var(--yellow)' : 'var(--text-dim)'} large />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-dim)', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>LATENCY (ms)</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.5rem' }}>
          {[
            ['MIN', summary.response_times.min],
            ['AVG', summary.response_times.avg],
            ['MAX', summary.response_times.max],
            ['p50', summary.response_times.p50],
            ['p95', summary.response_times.p95],
            ['p99', summary.response_times.p99],
          ].map(([label, val]) => (
            <div key={label} style={{
              background: label === 'p95' || label === 'p99' ? 'rgba(255,187,0,0.05)' : 'var(--bg)',
              border: `1px solid ${label === 'p95' || label === 'p99' ? 'rgba(255,187,0,0.2)' : 'var(--border)'}`,
              borderRadius: '6px', padding: '0.75rem', textAlign: 'center'
            }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '14px', fontWeight: 600, color: label === 'p95' || label === 'p99' ? 'var(--yellow)' : 'var(--text-primary)' }}>{val}</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--text-dim)', marginTop: '0.2rem', letterSpacing: '0.1em' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={onReset} style={{
        width: '100%', padding: '0.75rem',
        background: 'transparent', border: '1px solid var(--border)',
        borderRadius: '8px', color: 'var(--text-secondary)',
        fontFamily: 'var(--mono)', fontSize: '12px', fontWeight: 600,
        letterSpacing: '0.08em', textTransform: 'uppercase',
        cursor: 'pointer', transition: 'all 0.2s'
      }}
        onMouseEnter={e => { e.target.style.borderColor = 'var(--accent-mid)'; e.target.style.color = 'var(--accent)'; }}
        onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text-secondary)'; }}
      >
        ↩ Run Another Test
      </button>
    </div>
  );
}
