// AI Provider Types
export type AIProvider = 'local' | 'openai' | 'anthropic';

export type LocalModel = 
  | 'gemma2:2b'
  | 'gemma2:9b'
  | 'gemma2:27b'
  | 'llama3:8b'
  | 'llama3:70b'
  | 'mistral:7b'
  | 'phi3:3.8b';

export interface AIConfig {
  provider: AIProvider;
  localModel?: LocalModel;
  openaiKey?: string;
  anthropicKey?: string;
  ollamaHost?: string;
}

export interface AIProviderInfo {
  id: AIProvider;
  name: string;
  description: string;
  icon: string;
  requiresSetup: boolean;
  requiresApiKey: boolean;
  pros: string[];
  cons: string[];
}

export interface LocalModelInfo {
  id: LocalModel;
  name: string;
  size: string;
  ram: string;
  speed: 'fast' | 'medium' | 'slow';
  quality: 'good' | 'excellent' | 'outstanding';
  description: string;
}

export const AI_PROVIDERS: AIProviderInfo[] = [
  {
    id: 'local',
    name: 'Local AI (Ollama)',
    description: 'Run AI models locally on your computer',
    icon: '🖥️',
    requiresSetup: true,
    requiresApiKey: false,
    pros: [
      'Complete privacy - data never leaves your computer',
      'No API costs - completely free',
      'Works offline',
      'Fast response times'
    ],
    cons: [
      'Requires Ollama installation',
      'Needs 8GB+ RAM',
      'Initial model download (2-7GB)'
    ]
  },
  {
    id: 'openai',
    name: 'OpenAI (GPT-4)',
    description: 'Use OpenAI\'s powerful cloud AI',
    icon: '☁️',
    requiresSetup: false,
    requiresApiKey: true,
    pros: [
      'No setup required',
      'Works on any hardware',
      'Latest AI technology',
      'Highest quality analysis'
    ],
    cons: [
      'Requires API key',
      'Costs per use (~$0.01-0.10 per analysis)',
      'Requires internet connection',
      'Data sent to OpenAI servers'
    ]
  },
  {
    id: 'anthropic',
    name: 'Anthropic (Claude)',
    description: 'Use Anthropic\'s Claude AI',
    icon: '🤖',
    requiresSetup: false,
    requiresApiKey: true,
    pros: [
      'No setup required',
      'Excellent at detailed analysis',
      'Good at following instructions',
      'Strong reasoning capabilities'
    ],
    cons: [
      'Requires API key',
      'Costs per use',
      'Requires internet connection',
      'Data sent to Anthropic servers'
    ]
  }
];

export const LOCAL_MODELS: LocalModelInfo[] = [
  {
    id: 'phi3:3.8b',
    name: 'Phi-3 Mini',
    size: '2.3GB',
    ram: '4GB',
    speed: 'fast',
    quality: 'good',
    description: 'Lightweight and fast, good for quick analysis'
  },
  {
    id: 'gemma2:2b',
    name: 'Gemma 2 (2B)',
    size: '1.6GB',
    ram: '4GB',
    speed: 'fast',
    quality: 'good',
    description: 'Google\'s efficient model, great for basic analysis'
  },
  {
    id: 'gemma2:9b',
    name: 'Gemma 2 (9B)',
    size: '5.4GB',
    ram: '8GB',
    speed: 'medium',
    quality: 'excellent',
    description: 'Recommended - Best balance of speed and quality'
  },
  {
    id: 'llama3:8b',
    name: 'Llama 3 (8B)',
    size: '4.7GB',
    ram: '8GB',
    speed: 'medium',
    quality: 'excellent',
    description: 'Meta\'s powerful model, excellent for detailed analysis'
  },
  {
    id: 'mistral:7b',
    name: 'Mistral (7B)',
    size: '4.1GB',
    ram: '8GB',
    speed: 'medium',
    quality: 'excellent',
    description: 'Fast and accurate, good all-around choice'
  },
  {
    id: 'gemma2:27b',
    name: 'Gemma 2 (27B)',
    size: '16GB',
    ram: '16GB',
    speed: 'slow',
    quality: 'outstanding',
    description: 'Highest quality, requires powerful hardware'
  },
  {
    id: 'llama3:70b',
    name: 'Llama 3 (70B)',
    size: '40GB',
    ram: '32GB',
    speed: 'slow',
    quality: 'outstanding',
    description: 'Best quality available, requires very powerful hardware'
  }
];
