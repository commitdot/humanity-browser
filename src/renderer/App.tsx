import React, { useState } from 'react';
import BrowserView from './components/BrowserView';
import AddressBar from './components/AddressBar';
import TabBar from './components/TabBar';
import HumanityPanel from './components/HumanityPanel';
import { useBrowserStore } from './hooks/useBrowser';
import { useHumanityProtection } from './hooks/useHumanityProtection';
import './App.css';

function App() {
  const { currentTab, tabs } = useBrowserStore();
  const { stats } = useHumanityProtection();
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  const totalBlocks = stats.aiServicesBlocked + stats.trackersBlocked +
                     stats.scrapersBlocked + stats.apiCallsBlocked;

  return (
    <div className="app">
      <div className="title-bar">
        <div className="title-bar-content">
          <div className="app-logo">
            <span className="logo-icon">🛡️</span>
            <span className="logo-text">Humanity Browser</span>
          </div>
          <div className="window-controls">
            {/* Window controls will be handled by Electron */}
          </div>
        </div>
      </div>

      <TabBar />
      
      <AddressBar />

      <div className="main-content">
        <div className={`browser-container ${isPanelOpen ? 'with-panel' : 'full-width'}`}>
          <BrowserView />
        </div>

        {isPanelOpen && (
          <div className="ai-panel-container">
            <HumanityPanel onClose={() => setIsPanelOpen(false)} />
          </div>
        )}

        {!isPanelOpen && (
          <button
            className="panel-toggle-btn"
            onClick={() => setIsPanelOpen(true)}
            title="Open Humanity Shield"
          >
            <span>🛡️</span>
          </button>
        )}
      </div>

      <div className="status-bar">
        <div className="status-info">
          {currentTab && (
            <>
              <span className="status-item">
                {tabs.find((t) => t.id === currentTab)?.loading ? '⏳ Loading...' : '✓ Ready'}
              </span>
              <span className="status-item">
                Tab {tabs.findIndex((t) => t.id === currentTab) + 1} of {tabs.length}
              </span>
              <span className="status-item">
                🛡️ {totalBlocks} blocked
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

// Humanity First Browser - Protecting Human Creativity
