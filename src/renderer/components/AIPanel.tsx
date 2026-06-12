import React, { useState } from 'react';
import './AIPanel.css';

interface AIPanelProps {
  onClose: () => void;
}

const AIPanel: React.FC<AIPanelProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'analysis' | 'redesign' | 'colors' | 'accessibility'>('analysis');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    // Simulate analysis
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="ai-panel">
      <div className="panel-header">
        <h2>🤖 AI Design Assistant</h2>
        <button className="close-btn" onClick={onClose} title="Close panel">
          ×
        </button>
      </div>

      <div className="panel-tabs">
        <button
          className={`tab-btn ${activeTab === 'analysis' ? 'active' : ''}`}
          onClick={() => setActiveTab('analysis')}
        >
          📊 Analysis
        </button>
        <button
          className={`tab-btn ${activeTab === 'redesign' ? 'active' : ''}`}
          onClick={() => setActiveTab('redesign')}
        >
          🎨 Redesign
        </button>
        <button
          className={`tab-btn ${activeTab === 'colors' ? 'active' : ''}`}
          onClick={() => setActiveTab('colors')}
        >
          🌈 Colors
        </button>
        <button
          className={`tab-btn ${activeTab === 'accessibility' ? 'active' : ''}`}
          onClick={() => setActiveTab('accessibility')}
        >
          ♿ A11y
        </button>
      </div>

      <div className="panel-content">
        {activeTab === 'analysis' && (
          <div className="analysis-view">
            <div className="score-card">
              <div className="score-circle">
                <span className="score-value">--</span>
                <span className="score-label">/100</span>
              </div>
              <p className="score-description">Design Score</p>
            </div>

            <button
              className="analyze-btn"
              onClick={handleAnalyze}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? '⏳ Analyzing...' : '🔍 Analyze Page'}
            </button>

            <div className="issues-section">
              <h3>Issues Found</h3>
              <div className="empty-state">
                <p>Click "Analyze Page" to start</p>
              </div>
            </div>

            <div className="suggestions-section">
              <h3>AI Suggestions</h3>
              <div className="empty-state">
                <p>No suggestions yet</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'redesign' && (
          <div className="redesign-view">
            <h3>Auto Redesign</h3>
            <p className="section-description">
              Choose a design style and let AI redesign the page
            </p>

            <div className="style-presets">
              <button className="preset-btn">
                <span className="preset-icon">✨</span>
                <span className="preset-name">Modern</span>
              </button>
              <button className="preset-btn">
                <span className="preset-icon">💎</span>
                <span className="preset-name">Elegant</span>
              </button>
              <button className="preset-btn">
                <span className="preset-icon">🎯</span>
                <span className="preset-name">Bold</span>
              </button>
              <button className="preset-btn">
                <span className="preset-icon">♿</span>
                <span className="preset-name">Accessible</span>
              </button>
            </div>

            <button className="action-btn primary">
              🎨 Apply Redesign
            </button>
          </div>
        )}

        {activeTab === 'colors' && (
          <div className="colors-view">
            <h3>Color Analysis</h3>
            <p className="section-description">
              AI-powered color palette optimization
            </p>

            <div className="color-palette">
              <div className="empty-state">
                <p>Analyze page to see colors</p>
              </div>
            </div>

            <button className="action-btn">
              🎨 Generate Better Palette
            </button>
          </div>
        )}

        {activeTab === 'accessibility' && (
          <div className="accessibility-view">
            <h3>Accessibility Check</h3>
            <p className="section-description">
              WCAG 2.1 compliance analysis
            </p>

            <div className="a11y-score">
              <div className="score-badge">
                <span className="badge-label">WCAG Level</span>
                <span className="badge-value">--</span>
              </div>
            </div>

            <button className="action-btn">
              ♿ Check Accessibility
            </button>

            <div className="a11y-issues">
              <div className="empty-state">
                <p>No issues found yet</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIPanel;
