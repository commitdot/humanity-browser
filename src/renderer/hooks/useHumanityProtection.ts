import { create } from 'zustand';
import {
  SiteAuthenticity,
  ProtectionStats,
  HumanityConfig,
  BlockedItem,
  AIDetectionResult,
} from '@shared/humanityTypes';
import { aiDetector } from '../utils/aiDetector';
import { contentBlocker, defaultHumanityConfig } from '../utils/contentBlocker';

interface HumanityProtectionStore {
  // Configuration
  config: HumanityConfig;
  
  // Current site analysis
  currentSite: SiteAuthenticity | null;
  isAnalyzing: boolean;
  
  // Statistics
  stats: ProtectionStats;
  blockedItems: BlockedItem[];
  
  // Actions
  updateConfig: (config: Partial<HumanityConfig>) => void;
  analyzeSite: (url: string, html: string, text: string) => Promise<void>;
  blockURL: (url: string) => boolean;
  getBlockedItems: (limit?: number) => BlockedItem[];
  clearHistory: () => void;
  resetStats: () => void;
  addToWhitelist: (domain: string) => void;
  removeFromWhitelist: (domain: string) => void;
  addToBlacklist: (domain: string) => void;
  removeFromBlacklist: (domain: string) => void;
}

export const useHumanityProtection = create<HumanityProtectionStore>((set, get) => ({
  // Initial state
  config: defaultHumanityConfig,
  currentSite: null,
  isAnalyzing: false,
  stats: contentBlocker.getStats(),
  blockedItems: [],

  // Update configuration
  updateConfig: (newConfig) => {
    const config = { ...get().config, ...newConfig };
    contentBlocker.updateConfig(config);
    set({ config });
    
    // Save to localStorage
    localStorage.setItem('humanity-config', JSON.stringify(config));
  },

  // Analyze current site
  analyzeSite: async (url, html, text) => {
    set({ isAnalyzing: true });
    
    try {
      // Run AI detection
      const detection: AIDetectionResult = await aiDetector.analyzePage(url, html, text);
      
      // Update statistics
      contentBlocker.incrementPageScanned();
      if (detection.isAI) {
        contentBlocker.incrementAIContent();
      } else {
        contentBlocker.incrementHumanContent();
      }
      
      // Create site authenticity report
      const siteAuthenticity: SiteAuthenticity = {
        url,
        level: detection.level,
        score: 100 - detection.confidence, // Invert: higher score = more human
        aiDetected: detection.isAI,
        trackersFound: 0, // Will be updated by tracker detection
        lastChecked: new Date(),
        details: {
          hasAIServices: detection.detectedServices.length > 0,
          hasAIContent: detection.isAI,
          hasTrackers: false,
          hasScrapers: false,
        },
      };
      
      set({
        currentSite: siteAuthenticity,
        isAnalyzing: false,
        stats: contentBlocker.getStats(),
      });
    } catch (error) {
      console.error('Site analysis failed:', error);
      set({ isAnalyzing: false });
    }
  },

  // Block URL
  blockURL: (url) => {
    const { block, reason } = contentBlocker.shouldBlockURL(url);
    
    if (block) {
      contentBlocker.blockAIService(url);
      set({
        stats: contentBlocker.getStats(),
        blockedItems: contentBlocker.getBlockedItems(100),
      });
    }
    
    return block;
  },

  // Get blocked items
  getBlockedItems: (limit) => {
    return contentBlocker.getBlockedItems(limit);
  },

  // Clear history
  clearHistory: () => {
    contentBlocker.clearHistory();
    set({ blockedItems: [] });
  },

  // Reset statistics
  resetStats: () => {
    contentBlocker.resetStats();
    set({ stats: contentBlocker.getStats() });
  },

  // Whitelist management
  addToWhitelist: (domain) => {
    const config = get().config;
    if (!config.whitelist.includes(domain)) {
      const whitelist = [...config.whitelist, domain];
      get().updateConfig({ whitelist });
    }
  },

  removeFromWhitelist: (domain) => {
    const config = get().config;
    const whitelist = config.whitelist.filter(d => d !== domain);
    get().updateConfig({ whitelist });
  },

  // Blacklist management
  addToBlacklist: (domain) => {
    const config = get().config;
    if (!config.blacklist.includes(domain)) {
      const blacklist = [...config.blacklist, domain];
      get().updateConfig({ blacklist });
    }
  },

  removeFromBlacklist: (domain) => {
    const config = get().config;
    const blacklist = config.blacklist.filter(d => d !== domain);
    get().updateConfig({ blacklist });
  },
}));

// Load saved configuration on init
const savedConfig = localStorage.getItem('humanity-config');
if (savedConfig) {
  try {
    const config = JSON.parse(savedConfig);
    useHumanityProtection.getState().updateConfig(config);
  } catch (error) {
    console.error('Failed to load saved config:', error);
  }
}
