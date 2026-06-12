import React, { useState } from 'react';
import { useHumanityProtection } from '../hooks/useHumanityProtection';
import { AUTHENTICITY_BADGES } from '@shared/humanityTypes';
import './HumanityPanel.css';

interface HumanityPanelProps {
  onClose: () => void;
}

const HumanityPanel: React.FC<HumanityPanelProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'protection' | 'detection' | 'stats' | 'settings'>('protection');
  
  const {
    currentSite,
    isAnalyzing,
    stats,
    config,
    updateConfig,
    getBlockedItems,
    clearHistory,
    resetStats,
  } = useHumanityProtection();

  const blockedItems = getBlockedItems(10);
  const totalBlocks = stats.aiServicesBlocked + stats.trackersBlocked + stats.scrapersBlocked + stats.apiCallsBlocked;

  return (
    <div className="humanity-panel">
      <div className="panel-header">
        <h2>🛡️ Humanity Shield</h2>
        <button className="close-btn" onClick={onClose} title="Close panel">
          ×
        </button>
      </div>

      <div className="panel-tabs">
        <button
          className={`tab-btn ${activeTab === 'protection' ? 'active' : ''}`}
          onClick={() => setActiveTab('protection')}
        >
          🛡️ Protection
        </button>
        <button
          className={`tab-btn ${activeTab === 'detection' ? 'active' : ''}`}
          onClick={() => setActiveTab('detection')}
        >
          🔍 Detection
        </button>
        <button
          className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          📊 Stats
        </button>
        <button
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ Settings
        </button>
      </div>

      <div className="panel-content">
        {activeTab === 'protection' && (
          <div className="protection-view">
            <div className="protection-status">
              <div className="status-badge active">
                <span className="status-icon">✓</span>
                <span className="status-text">Protection Active</span>
              </div>
              <div className="protection-level">
                Level: <strong>{config.protectionLevel.toUpperCase()}</strong>
              </div>
            </div>

            <div className="current-site-card">
              <h3>Current Site</h3>
              {currentSite ? (
                <>
                  <div className="authenticity-badge" style={{ 
                    backgroundColor: AUTHENTICITY_BADGES[currentSite.level].color + '20',
                    borderColor: AUTHENTICITY_BADGES[currentSite.level].color 
                  }}>
                    <span className="badge-icon">
                      {AUTHENTICITY_BADGES[currentSite.level].icon}
                    </span>
                    <span className="badge-label">
                      {AUTHENTICITY_BADGES[currentSite.level].label}
                    </span>
                  </div>
                  <div className="site-score">
                    <div className="score-label">Human Score</div>
                    <div className="score-value">{currentSite.score}/100</div>
                  </div>
                  <p className="site-description">
                    {AUTHENTICITY_BADGES[currentSite.level].description}
                  </p>
                </>
              ) : (
                <div className="empty-state">
                  <p>Navigate to a website to see protection status</p>
                </div>
              )}
            </div>

            <div className="quick-stats">
              <div className="stat-item">
                <div className="stat-value">{totalBlocks}</div>
                <div className="stat-label">Blocked Today</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{stats.pagesScanned}</div>
                <div className="stat-label">Pages Scanned</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'detection' && (
          <div className="detection-view">
            <h3>AI Detection Results</h3>
            
            {currentSite && currentSite.aiDetected ? (
              <div className="detection-alert warning">
                <span className="alert-icon">⚠️</span>
                <div className="alert-content">
                  <strong>AI Content Detected</strong>
                  <p>This page contains AI-generated content or uses AI services.</p>
                </div>
              </div>
            ) : currentSite ? (
              <div className="detection-alert success">
                <span className="alert-icon">✓</span>
                <div className="alert-content">
                  <strong>Human Content</strong>
                  <p>No AI content detected on this page.</p>
                </div>
              </div>
            ) : null}

            <div className="blocked-items-section">
              <h4>Recently Blocked</h4>
              {blockedItems.length > 0 ? (
                <div className="blocked-items-list">
                  {blockedItems.map((item) => (
                    <div key={item.id} className="blocked-item">
                      <div className="item-icon">
                        {item.type === 'ai-service' && '🚫'}
                        {item.type === 'tracker' && '🕵️'}
                        {item.type === 'scraper' && '🤖'}
                        {item.type === 'api-call' && '📡'}
                      </div>
                      <div className="item-details">
                        <div className="item-domain">{item.domain}</div>
                        <div className="item-reason">{item.reason}</div>
                        <div className="item-time">
                          {new Date(item.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>No items blocked yet</p>
                </div>
              )}
              {blockedItems.length > 0 && (
                <button className="action-btn secondary" onClick={clearHistory}>
                  Clear History
                </button>
              )}
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="stats-view">
            <h3>Protection Statistics</h3>
            
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">🚫</div>
                <div className="stat-number">{stats.aiServicesBlocked}</div>
                <div className="stat-title">AI Services Blocked</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">🕵️</div>
                <div className="stat-number">{stats.trackersBlocked}</div>
                <div className="stat-title">Trackers Blocked</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">🤖</div>
                <div className="stat-number">{stats.scrapersBlocked}</div>
                <div className="stat-title">Scrapers Blocked</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">📡</div>
                <div className="stat-number">{stats.apiCallsBlocked}</div>
                <div className="stat-title">API Calls Blocked</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">📄</div>
                <div className="stat-number">{stats.pagesScanned}</div>
                <div className="stat-title">Pages Scanned</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">👤</div>
                <div className="stat-number">{stats.humanContentFound}</div>
                <div className="stat-title">Human Content</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">🤖</div>
                <div className="stat-number">{stats.aiContentFound}</div>
                <div className="stat-title">AI Content</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">🛡️</div>
                <div className="stat-number">{totalBlocks}</div>
                <div className="stat-title">Total Blocks</div>
              </div>
            </div>

            <button className="action-btn secondary" onClick={resetStats}>
              Reset Statistics
            </button>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-view">
            <h3>Protection Settings</h3>
            
            <div className="setting-group">
              <label className="setting-label">Protection Level</label>
              <select 
                className="setting-select"
                value={config.protectionLevel}
                onChange={(e) => updateConfig({ 
                  protectionLevel: e.target.value as any 
                })}
              >
                <option value="basic">Basic</option>
                <option value="standard">Standard (Recommended)</option>
                <option value="maximum">Maximum</option>
              </select>
              <p className="setting-description">
                {config.protectionLevel === 'basic' && 'Block known AI services only'}
                {config.protectionLevel === 'standard' && 'Balanced protection with AI detection'}
                {config.protectionLevel === 'maximum' && 'Aggressive blocking and strict filtering'}
              </p>
            </div>

            <div className="setting-group">
              <label className="setting-checkbox">
                <input
                  type="checkbox"
                  checked={config.blockAIServices}
                  onChange={(e) => updateConfig({ blockAIServices: e.target.checked })}
                />
                <span>Block AI Services</span>
              </label>
              <p className="setting-description">
                Block access to AI chatbots and services (ChatGPT, Claude, etc.)
              </p>
            </div>

            <div className="setting-group">
              <label className="setting-checkbox">
                <input
                  type="checkbox"
                  checked={config.blockTrackers}
                  onChange={(e) => updateConfig({ blockTrackers: e.target.checked })}
                />
                <span>Block AI Trackers</span>
              </label>
              <p className="setting-description">
                Prevent AI-powered tracking and profiling
              </p>
            </div>

            <div className="setting-group">
              <label className="setting-checkbox">
                <input
                  type="checkbox"
                  checked={config.blockScrapers}
                  onChange={(e) => updateConfig({ blockScrapers: e.target.checked })}
                />
                <span>Block AI Scrapers</span>
              </label>
              <p className="setting-description">
                Block AI bots from scraping content
              </p>
            </div>

            <div className="setting-group">
              <label className="setting-checkbox">
                <input
                  type="checkbox"
                  checked={config.showWarnings}
                  onChange={(e) => updateConfig({ showWarnings: e.target.checked })}
                />
                <span>Show Warnings</span>
              </label>
              <p className="setting-description">
                Display warnings when AI content is detected
              </p>
            </div>

            <div className="setting-group">
              <label className="setting-checkbox">
                <input
                  type="checkbox"
                  checked={config.allowWhitelist}
                  onChange={(e) => updateConfig({ allowWhitelist: e.target.checked })}
                />
                <span>Enable Whitelist</span>
              </label>
              <p className="setting-description">
                Allow specific sites even if they use AI
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HumanityPanel;
