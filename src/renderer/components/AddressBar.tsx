import React, { useState, useEffect } from 'react';
import { useBrowserStore } from '../hooks/useBrowser';
import './AddressBar.css';

const AddressBar: React.FC = () => {
  const { tabs, currentTab, navigateTab, goBack, goForward, reload } = useBrowserStore();
  const [inputValue, setInputValue] = useState('');
  
  const currentTabData = tabs.find(tab => tab.id === currentTab);

  useEffect(() => {
    if (currentTabData) {
      setInputValue(currentTabData.url);
    }
  }, [currentTabData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTab) return;

    let url = inputValue.trim();
    
    // Add protocol if missing
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      // Check if it looks like a URL
      if (url.includes('.') && !url.includes(' ')) {
        url = 'https://' + url;
      } else {
        // Treat as search query
        url = `https://www.google.com/search?q=${encodeURIComponent(url)}`;
      }
    }

    navigateTab(currentTab, url);
    setInputValue(url);
  };

  const handleBack = () => {
    if (currentTab && currentTabData?.canGoBack) {
      goBack(currentTab);
    }
  };

  const handleForward = () => {
    if (currentTab && currentTabData?.canGoForward) {
      goForward(currentTab);
    }
  };

  const handleReload = () => {
    if (currentTab) {
      reload(currentTab);
    }
  };

  return (
    <div className="address-bar">
      <div className="navigation-buttons">
        <button
          className="nav-btn"
          onClick={handleBack}
          disabled={!currentTabData?.canGoBack}
          title="Go back"
        >
          ←
        </button>
        <button
          className="nav-btn"
          onClick={handleForward}
          disabled={!currentTabData?.canGoForward}
          title="Go forward"
        >
          →
        </button>
        <button
          className="nav-btn"
          onClick={handleReload}
          title="Reload"
        >
          {currentTabData?.loading ? '⏹' : '⟳'}
        </button>
      </div>

      <form className="url-form" onSubmit={handleSubmit}>
        <div className="url-input-container">
          <span className="url-icon">
            {currentTabData?.url.startsWith('https://') ? '🔒' : '🌐'}
          </span>
          <input
            type="text"
            className="url-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter URL or search..."
            spellCheck={false}
          />
        </div>
      </form>

      <div className="address-bar-actions">
        <button className="action-btn" title="Bookmark this page">
          ⭐
        </button>
        <button className="action-btn" title="Settings">
          ⚙️
        </button>
      </div>
    </div>
  );
};

export default AddressBar;
