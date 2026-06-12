import {
  BlockedItem,
  ProtectionStats,
  HumanityConfig,
  AI_SERVICE_DOMAINS,
  AI_TRACKER_DOMAINS,
  AI_SCRAPER_AGENTS,
  AI_API_PATTERNS,
} from '@shared/humanityTypes';
import { aiDetector } from './aiDetector';

export class ContentBlocker {
  private blockedItems: BlockedItem[] = [];
  private stats: ProtectionStats = {
    aiServicesBlocked: 0,
    trackersBlocked: 0,
    scrapersBlocked: 0,
    apiCallsBlocked: 0,
    pagesScanned: 0,
    humanContentFound: 0,
    aiContentFound: 0,
  };
  private config: HumanityConfig;

  constructor(config: HumanityConfig) {
    this.config = config;
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<HumanityConfig>) {
    this.config = { ...this.config, ...config };
  }

  /**
   * Check if URL should be blocked
   */
  shouldBlockURL(url: string): { block: boolean; reason: string } {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname.toLowerCase();

      // Check whitelist first
      if (this.config.allowWhitelist && this.isWhitelisted(domain)) {
        return { block: false, reason: '' };
      }

      // Check blacklist
      if (this.isBlacklisted(domain)) {
        return { block: true, reason: 'Domain in user blacklist' };
      }

      // Check AI services
      if (this.config.blockAIServices && this.isAIService(domain)) {
        return { block: true, reason: 'AI service detected' };
      }

      // Check trackers
      if (this.config.blockTrackers && this.isTracker(domain)) {
        return { block: true, reason: 'AI tracker detected' };
      }

      return { block: false, reason: '' };
    } catch {
      return { block: false, reason: '' };
    }
  }

  /**
   * Block AI service
   */
  blockAIService(url: string): BlockedItem {
    const item: BlockedItem = {
      id: `blocked-${Date.now()}-${Math.random()}`,
      type: 'ai-service',
      url,
      domain: new URL(url).hostname,
      timestamp: new Date(),
      reason: 'AI service blocked by Humanity First protection',
    };

    this.blockedItems.push(item);
    this.stats.aiServicesBlocked++;
    
    return item;
  }

  /**
   * Block tracker
   */
  blockTracker(url: string): BlockedItem {
    const item: BlockedItem = {
      id: `blocked-${Date.now()}-${Math.random()}`,
      type: 'tracker',
      url,
      domain: new URL(url).hostname,
      timestamp: new Date(),
      reason: 'AI tracker blocked',
    };

    this.blockedItems.push(item);
    this.stats.trackersBlocked++;
    
    return item;
  }

  /**
   * Block scraper
   */
  blockScraper(userAgent: string): BlockedItem {
    const item: BlockedItem = {
      id: `blocked-${Date.now()}-${Math.random()}`,
      type: 'scraper',
      url: '',
      domain: userAgent,
      timestamp: new Date(),
      reason: 'AI scraper bot blocked',
    };

    this.blockedItems.push(item);
    this.stats.scrapersBlocked++;
    
    return item;
  }

  /**
   * Block API call
   */
  blockAPICall(url: string, endpoint: string): BlockedItem {
    const item: BlockedItem = {
      id: `blocked-${Date.now()}-${Math.random()}`,
      type: 'api-call',
      url,
      domain: endpoint,
      timestamp: new Date(),
      reason: 'AI API call blocked',
    };

    this.blockedItems.push(item);
    this.stats.apiCallsBlocked++;
    
    return item;
  }

  /**
   * Check if domain is AI service
   */
  private isAIService(domain: string): boolean {
    return AI_SERVICE_DOMAINS.some(aiDomain => 
      domain === aiDomain || domain.endsWith(`.${aiDomain}`)
    );
  }

  /**
   * Check if domain is tracker
   */
  private isTracker(domain: string): boolean {
    return AI_TRACKER_DOMAINS.some(tracker => 
      domain === tracker || domain.endsWith(`.${tracker}`)
    );
  }

  /**
   * Check if user agent is scraper
   */
  isScraper(userAgent: string): boolean {
    return AI_SCRAPER_AGENTS.some(scraper => 
      userAgent.includes(scraper)
    );
  }

  /**
   * Check if URL contains AI API endpoint
   */
  isAIAPICall(url: string): boolean {
    return AI_API_PATTERNS.some(pattern => url.includes(pattern));
  }

  /**
   * Check if domain is whitelisted
   */
  private isWhitelisted(domain: string): boolean {
    return this.config.whitelist.some(allowed => 
      domain === allowed || domain.endsWith(`.${allowed}`)
    );
  }

  /**
   * Check if domain is blacklisted
   */
  private isBlacklisted(domain: string): boolean {
    return this.config.blacklist.some(blocked => 
      domain === blocked || domain.endsWith(`.${blocked}`)
    );
  }

  /**
   * Get blocked items
   */
  getBlockedItems(limit?: number): BlockedItem[] {
    const items = [...this.blockedItems].reverse();
    return limit ? items.slice(0, limit) : items;
  }

  /**
   * Get protection statistics
   */
  getStats(): ProtectionStats {
    return { ...this.stats };
  }

  /**
   * Clear blocked items history
   */
  clearHistory() {
    this.blockedItems = [];
  }

  /**
   * Reset statistics
   */
  resetStats() {
    this.stats = {
      aiServicesBlocked: 0,
      trackersBlocked: 0,
      scrapersBlocked: 0,
      apiCallsBlocked: 0,
      pagesScanned: 0,
      humanContentFound: 0,
      aiContentFound: 0,
    };
  }

  /**
   * Increment page scan counter
   */
  incrementPageScanned() {
    this.stats.pagesScanned++;
  }

  /**
   * Increment human content counter
   */
  incrementHumanContent() {
    this.stats.humanContentFound++;
  }

  /**
   * Increment AI content counter
   */
  incrementAIContent() {
    this.stats.aiContentFound++;
  }

  /**
   * Generate blocking rules for webRequest
   */
  getBlockingRules(): string[] {
    const rules: string[] = [];

    if (this.config.blockAIServices) {
      rules.push(...AI_SERVICE_DOMAINS.map(domain => `*://*.${domain}/*`));
    }

    if (this.config.blockTrackers) {
      rules.push(...AI_TRACKER_DOMAINS.map(domain => `*://*.${domain}/*`));
    }

    rules.push(...this.config.blacklist.map(domain => `*://*.${domain}/*`));

    return rules;
  }

  /**
   * Check if request should be blocked
   */
  shouldBlockRequest(url: string, type: string): boolean {
    const { block } = this.shouldBlockURL(url);
    
    if (block) {
      return true;
    }

    // Block AI API calls
    if (type === 'xhr' || type === 'fetch') {
      if (this.isAIAPICall(url)) {
        this.blockAPICall(url, 'API endpoint');
        return true;
      }
    }

    return false;
  }

  /**
   * Get total blocks count
   */
  getTotalBlocks(): number {
    return this.stats.aiServicesBlocked +
           this.stats.trackersBlocked +
           this.stats.scrapersBlocked +
           this.stats.apiCallsBlocked;
  }

  /**
   * Export blocked items as JSON
   */
  exportBlockedItems(): string {
    return JSON.stringify({
      items: this.blockedItems,
      stats: this.stats,
      exportedAt: new Date().toISOString(),
    }, null, 2);
  }
}

// Default configuration
export const defaultHumanityConfig: HumanityConfig = {
  protectionLevel: 'standard',
  blockAIServices: true,
  blockTrackers: true,
  blockScrapers: true,
  showWarnings: true,
  allowWhitelist: true,
  whitelist: [],
  blacklist: [],
};

// Export singleton instance
export const contentBlocker = new ContentBlocker(defaultHumanityConfig);
