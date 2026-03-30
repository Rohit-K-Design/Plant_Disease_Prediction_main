import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { API_URL } from '../config';
import './ImageUpload.css'; // Make sure this file exists

function ImageUpload() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/predict`, formData);
      setResult(response.data);
    } catch (err) {
      alert('Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setFile(null);
    setResult(null);
  };

  return (
    <div className="container py-4">
      <div className="card shadow-lg p-4">
        <h3 className="text-center mb-3">🌿 Plant Disease Prediction</h3>

        {!file && (
          <div className="mb-3">
            <label htmlFor="fileInput" className="form-label">Upload Plant Leaf Image</label>
            <input
              type="file"
              id="fileInput"
              className="form-control"
              accept="image/*"
              onChange={e => setFile(e.target.files[0])}
            />
          </div>
        )}

        {file && (
          <div className="mb-3 text-center">
            <img
              src={URL.createObjectURL(file)}
              alt="Preview"
              className="img-thumbnail mb-2"
              style={{ maxHeight: '300px' }}
            />
            <div>
              <button className="btn btn-warning me-2" onClick={clearAll}>Clear</button>
            </div>
          </div>
        )}

        {file && !result && (
          <div className="text-center">
            <button
              className="btn btn-success"
              onClick={handleUpload}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" />
                  Predicting...
                </>
              ) : 'Predict'}
            </button>
          </div>
        )}

        {result && (
          <div className="mt-4">
            <h5 className="text-success">
              ✅ Prediction: <strong>{result.class}</strong>
            </h5>
            <p>Confidence: {(result.confidence * 100).toFixed(2)}%</p>

            <div className="mt-4">
              <h6>📋 Expert Advice</h6>
              <div className="chat-box mt-2">
                <div className="chat-message bot">
                  <ReactMarkdown>{result.advice}</ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageUpload;
