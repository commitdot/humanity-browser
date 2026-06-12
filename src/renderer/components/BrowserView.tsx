import React, { useEffect, useRef } from 'react';
import { useBrowserStore } from '../hooks/useBrowser';
import './BrowserView.css';

const BrowserView: React.FC = () => {
  const { tabs, currentTab, updateTab } = useBrowserStore();
  const webviewRef = useRef<HTMLIFrameElement>(null);
  
  const currentTabData = tabs.find(tab => tab.id === currentTab);

  useEffect(() => {
    if (webviewRef.current && currentTabData) {
      // In a real implementation, this would use Electron's webview
      // For now, we'll use an iframe as a placeholder
      try {
        webviewRef.current.src = currentTabData.url;
      } catch (error) {
        console.error('Error loading URL:', error);
      }
    }
  }, [currentTabData?.url]);

  const handleLoad = () => {
    if (currentTab && webviewRef.current) {
      updateTab(currentTab, {
        loading: false,
        title: webviewRef.current.contentDocument?.title || 'Untitled',
      });
    }
  };

  const handleLoadStart = () => {
    if (currentTab) {
      updateTab(currentTab, { loading: true });
    }
  };

  if (!currentTabData) {
    return (
      <div className="browser-view empty">
        <div className="empty-state">
          <h2>No tab selected</h2>
          <p>Create a new tab to start browsing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="browser-view">
      {currentTabData.loading && (
        <div className="loading-bar">
          <div className="loading-progress"></div>
        </div>
      )}
      
      <iframe
        ref={webviewRef}
        className="webview"
        title={currentTabData.title}
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
        onLoad={handleLoad}
        onLoadStart={handleLoadStart}
      />
      
      <div className="browser-overlay">
        {/* This overlay will be used for AI analysis and redesign preview */}
      </div>
    </div>
  );
};

export default BrowserView;
