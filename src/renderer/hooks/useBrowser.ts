import { create } from 'zustand';
import { Tab } from '@shared/types';

interface BrowserStore {
  tabs: Tab[];
  currentTab: string | null;
  
  // Actions
  addTab: (url?: string) => void;
  closeTab: (tabId: string) => void;
  switchTab: (tabId: string) => void;
  updateTab: (tabId: string, updates: Partial<Tab>) => void;
  navigateTab: (tabId: string, url: string) => void;
  goBack: (tabId: string) => void;
  goForward: (tabId: string) => void;
  reload: (tabId: string) => void;
}

export const useBrowserStore = create<BrowserStore>((set, get) => ({
  tabs: [
    {
      id: 'tab-1',
      url: 'https://www.example.com',
      title: 'New Tab',
      loading: false,
      canGoBack: false,
      canGoForward: false,
    },
  ],
  currentTab: 'tab-1',

  addTab: (url = 'https://www.example.com') => {
    const newTab: Tab = {
      id: `tab-${Date.now()}`,
      url,
      title: 'New Tab',
      loading: false,
      canGoBack: false,
      canGoForward: false,
    };
    
    set((state) => ({
      tabs: [...state.tabs, newTab],
      currentTab: newTab.id,
    }));
  },

  closeTab: (tabId: string) => {
    set((state) => {
      const tabs = state.tabs.filter((tab) => tab.id !== tabId);
      
      // If closing current tab, switch to another
      let newCurrentTab = state.currentTab;
      if (state.currentTab === tabId) {
        newCurrentTab = tabs.length > 0 ? tabs[tabs.length - 1].id : null;
      }
      
      // If no tabs left, create a new one
      if (tabs.length === 0) {
        const newTab: Tab = {
          id: `tab-${Date.now()}`,
          url: 'https://www.example.com',
          title: 'New Tab',
          loading: false,
          canGoBack: false,
          canGoForward: false,
        };
        return {
          tabs: [newTab],
          currentTab: newTab.id,
        };
      }
      
      return {
        tabs,
        currentTab: newCurrentTab,
      };
    });
  },

  switchTab: (tabId: string) => {
    set({ currentTab: tabId });
  },

  updateTab: (tabId: string, updates: Partial<Tab>) => {
    set((state) => ({
      tabs: state.tabs.map((tab) =>
        tab.id === tabId ? { ...tab, ...updates } : tab
      ),
    }));
  },

  navigateTab: (tabId: string, url: string) => {
    set((state) => ({
      tabs: state.tabs.map((tab) =>
        tab.id === tabId
          ? { ...tab, url, loading: true, title: 'Loading...' }
          : tab
      ),
    }));
  },

  goBack: (tabId: string) => {
    // This will be implemented with webview history
    console.log('Go back:', tabId);
  },

  goForward: (tabId: string) => {
    // This will be implemented with webview history
    console.log('Go forward:', tabId);
  },

  reload: (tabId: string) => {
    set((state) => ({
      tabs: state.tabs.map((tab) =>
        tab.id === tabId ? { ...tab, loading: true } : tab
      ),
    }));
  },
}));
