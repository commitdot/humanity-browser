import React from 'react';
import { useBrowserStore } from '../hooks/useBrowser';
import './TabBar.css';

const TabBar: React.FC = () => {
  const { tabs, currentTab, switchTab, closeTab, addTab } = useBrowserStore();

  const handleTabClick = (tabId: string) => {
    switchTab(tabId);
  };

  const handleCloseTab = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    closeTab(tabId);
  };

  const handleNewTab = () => {
    addTab();
  };

  return (
    <div className="tab-bar">
      <div className="tabs-container">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`tab ${currentTab === tab.id ? 'active' : ''}`}
            onClick={() => handleTabClick(tab.id)}
          >
            <span className="tab-favicon">
              {tab.favicon ? (
                <img src={tab.favicon} alt="" />
              ) : (
                <span>🌐</span>
              )}
            </span>
            <span className="tab-title">
              {tab.loading ? 'Loading...' : tab.title}
            </span>
            <button
              className="tab-close"
              onClick={(e) => handleCloseTab(e, tab.id)}
              title="Close tab"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <button
        className="new-tab-btn"
        onClick={handleNewTab}
        title="New tab"
      >
        +
      </button>
    </div>
  );
};

export default TabBar;
