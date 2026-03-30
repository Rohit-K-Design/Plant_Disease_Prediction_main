import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import './MitigationSteps.css';

function MitigationSteps() {
  const [prompt, setPrompt] = useState('');
  const [steps, setSteps] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setSteps('');
    try {
      const res = await axios.post(`${API_URL}/gpt`, { prompt });
      setSteps(res.data.steps);
    } catch (err) {
      setSteps('❌ Error fetching advice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mitigation-container">
      <div className="chat-card shadow-lg">
        <h4 className="chat-title">🌱 Plant Doctor Bot</h4>

        <div className="chat-box">
          {steps && (
            <div className="chat-response-bubble">
              <div className="bot-label">🧠 GPT Advice:</div>
              <div className="bot-response">
                  {steps.split('\n').map((line, index) => (
                    line.trim().startsWith('-') || line.trim().match(/^\d+\./)
                      ? <li key={index}>{line.replace(/^[-\d. ]*/, '')}</li>
                      : <p key={index}>{line}</p>
                  ))}
                </div>

            </div>
          )}
        </div>

        <div className="chat-input-area mt-3">
          <input
            type="text"
            className="form-control chat-input"
            placeholder="Type your question (e.g., mitigation for early blight)..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleFetch()}
          />
          <button
            className="btn btn-success mt-2 w-100"
            onClick={handleFetch}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" />
                Generating...
              </>
            ) : 'Ask GPT'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MitigationSteps;
