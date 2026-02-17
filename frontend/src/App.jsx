import React, { useState, useEffect, useRef } from 'react';
import TestForm from './components/TestForm';
import LiveChart from './components/LiveChart';
import ResultsSummary from './components/ResultsSummary';

function App() {
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [summary, setSummary] = useState(null);
  const [rateLimitHeaders, setRateLimitHeaders] = useState({});
  const [chartData, setChartData] = useState({
    timestamps: [], responseTimes: [], statusCodes: {}, errors: []
  });

  const wsRef = useRef(null);

  const fetchSummary = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/test/${id}/summary`);
      const data = await response.json();
      setSummary(data);
    } catch (error) {
      console.error("Failed to fetch summary:", error);
    }
  };

  const startTest = async (config) => {
    // Reset state
    setChartData({ timestamps: [], responseTimes: [], statusCodes: {}, errors: [] });
    setIsComplete(false);
    setSummary(null);
    setRateLimitHeaders({});

    try {
      // STEP 1: Get a test_id first without starting the test
      const response = await fetch("http://localhost:8000/api/run-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config)
      });

      const data = await response.json();
      const testId = data.test_id;

      // STEP 2: Open WebSocket immediately
      const ws = new WebSocket(`ws://localhost:8000/ws/${testId}`);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected:', testId);
        setIsRunning(true);
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);

        if (message.type === "TEST_COMPLETE") {
          setIsRunning(false);
          setIsComplete(true);
          fetchSummary(testId);
          ws.close();
          return;
        }

        if (message.results) {
          setChartData((prevData) => {
            const newTimestamps = [...prevData.timestamps];
            const newResponseTimes = [...prevData.responseTimes];
            const newStatusCodes = { ...prevData.statusCodes };
            const newErrors = [...prevData.errors];

            message.results.forEach((req) => {
              newTimestamps.push(req.timestamp);
              newResponseTimes.push(req.response_time_ms);
              const code = req.status_code || "Error";
              newStatusCodes[code] = (newStatusCodes[code] || 0) + 1;
              if (req.error) newErrors.push(req.error);
              if (req.rate_limit_headers && Object.keys(req.rate_limit_headers).length > 0) {
                setRateLimitHeaders(req.rate_limit_headers);
              }
            });

            return {
              timestamps: newTimestamps,
              responseTimes: newResponseTimes,
              statusCodes: newStatusCodes,
              errors: newErrors
            };
          });
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('WebSocket closed');
      };

      // Show dashboard immediately
      setIsRunning(true);

    } catch (error) {
      console.error("Failed to start test:", error);
      alert("Could not connect to the backend server.");
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>API Rate Limit Visualizer</h1>

      {!isRunning && !isComplete && (
        <TestForm onStart={startTest} isRunning={isRunning} />
      )}

      {(isRunning || isComplete) && (
        <div style={{ marginTop: "2rem" }}>
          <h2>Live Dashboard {isRunning && <span style={{ fontSize: "1rem", color: "#007bff" }}>● Running...</span>}</h2>
          <LiveChart data={chartData} />
          {isComplete && summary && (
            <ResultsSummary
              summary={summary}
              rateLimitHeaders={rateLimitHeaders}
              onReset={() => {
                setIsComplete(false);
                setIsRunning(false);
                if (wsRef.current) wsRef.current.close();
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default App;