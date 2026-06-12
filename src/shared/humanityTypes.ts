// Humanity First Browser Types

export type ContentAuthenticityLevel = 
  | 'verified-human'
  | 'likely-human'
  | 'mixed-content'
  | 'ai-generated'
  | 'unknown';

export type ProtectionLevel = 'basic' | 'standard' | 'maximum';

export interface AIDetectionResult {
  isAI: boolean;
  confidence: number; // 0-100
  level: ContentAuthenticityLevel;
  reasons: string[];
  detectedServices: string[];
  timestamp: Date;
}

export interface BlockedItem {
  id: string;
  type: 'ai-service' | 'tracker' | 'scraper' | 'api-call';
  url: string;
  domain: string;
  timestamp: Date;
  reason: string;
}

export interface ProtectionStats {
  aiServicesBlocked: number;
  trackersBlocked: number;
  scrapersBlocked: number;
  apiCallsBlocked: number;
  pagesScanned: number;
  humanContentFound: number;
  aiContentFound: number;
}

export interface SiteAuthenticity {
  url: string;
  level: ContentAuthenticityLevel;
  score: number; // 0-100, higher = more human
  aiDetected: boolean;
  trackersFound: number;
  lastChecked: Date;
  details: {
    hasAIServices: boolean;
    hasAIContent: boolean;
    hasTrackers: boolean;
    hasScrapers: boolean;
  };
}

export interface HumanityConfig {
  protectionLevel: ProtectionLevel;
  blockAIServices: boolean;
  blockTrackers: boolean;
  blockScrapers: boolean;
  showWarnings: boolean;
  allowWhitelist: boolean;
  whitelist: string[];
  blacklist: string[];
}

// AI Service Blocklist
export const AI_SERVICE_DOMAINS = [
  // OpenAI
  'openai.com',
  'api.openai.com',
  'chat.openai.com',
  'chatgpt.com',
  
  // Anthropic
  'anthropic.com',
  'claude.ai',
  'api.anthropic.com',
  
  // Google AI
  'bard.google.com',
  'gemini.google.com',
  'ai.google.com',
  
  // Microsoft
  'copilot.microsoft.com',
  'bing.com/chat',
  
  // Image AI
  'midjourney.com',
  'stable-diffusion.com',
  'stablediffusionweb.com',
  'leonardo.ai',
  'playground.ai',
  
  // AI Platforms
  'huggingface.co',
  'replicate.com',
  'runpod.io',
  'together.ai',
  'perplexity.ai',
  
  // AI Tools
  'jasper.ai',
  'copy.ai',
  'writesonic.com',
  'rytr.me',
  'shortly.ai',
];

// AI Tracker Domains
export const AI_TRACKER_DOMAINS = [
  'analytics.ai',
  'aitracker.com',
  'ml-analytics.com',
  'ai-insights.com',
  'smartlook.com',
  'fullstory.com',
  'hotjar.com',
  'mouseflow.com',
];

// AI Scraper User Agents
export const AI_SCRAPER_AGENTS = [
  'GPTBot',
  'ChatGPT-User',
  'Claude-Web',
  'Google-Extended',
  'CCBot',
  'anthropic-ai',
  'Bytespider',
  'Diffbot',
  'FacebookBot',
  'ImagesiftBot',
];

// AI API Endpoints
export const AI_API_PATTERNS = [
  '/v1/chat/completions',
  '/v1/completions',
  '/v1/embeddings',
  '/v1/images/generations',
  '/api/chat',
  '/api/completion',
  '/api/generate',
  '/inference',
  '/predict',
];

// AI Content Patterns (for text detection)
export const AI_TEXT_PATTERNS = [
  /as an ai (language model|assistant)/i,
  /i (don't|do not) have personal (opinions|experiences|feelings)/i,
  /i (can't|cannot) (browse|access) the internet/i,
  /my knowledge (cutoff|was last updated)/i,
  /i'm (an ai|a language model|claude|chatgpt)/i,
  /as of my last (update|training)/i,
];

// Protection Badges
export const AUTHENTICITY_BADGES = {
  'verified-human': {
    icon: '🟢',
    label: 'Verified Human',
    color: '#10b981',
    description: 'This content is verified to be human-created'
  },
  'likely-human': {
    icon: '🟡',
    label: 'Likely Human',
    color: '#f59e0b',
    description: 'This content appears to be human-created'
  },
  'mixed-content': {
    icon: '🟠',
    label: 'Mixed Content',
    color: '#f97316',
    description: 'This page contains both human and AI content'
  },
  'ai-generated': {
    icon: '🔴',
    label: 'AI Generated',
    color: '#ef4444',
    description: 'This content is AI-generated or uses AI services'
  },
  'unknown': {
    icon: '⚫',
    label: 'Unknown',
    color: '#6b7280',
    description: 'Unable to determine content authenticity'
  }
};
