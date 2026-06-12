import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { Ollama } from 'ollama';
import { DesignAnalysis } from '@shared/types';
import { AIProvider, LocalModel, AIConfig } from '@shared/aiTypes';

export interface PageData {
  url: string;
  html: string;
  css: string;
  colors: string[];
  fonts: string[];
  images: number;
  links: number;
}

export class HybridAIService {
  private config: AIConfig;
  private openai?: OpenAI;
  private anthropic?: Anthropic;
  private ollama?: Ollama;

  constructor(config: AIConfig) {
    this.config = config;
    this.initializeProviders();
  }

  /**
   * Initialize AI providers based on configuration
   */
  private initializeProviders() {
    if (this.config.provider === 'openai' && this.config.openaiKey) {
      this.openai = new OpenAI({
        apiKey: this.config.openaiKey,
        dangerouslyAllowBrowser: true,
      });
    }

    if (this.config.provider === 'anthropic' && this.config.anthropicKey) {
      this.anthropic = new Anthropic({
        apiKey: this.config.anthropicKey,
        dangerouslyAllowBrowser: true,
      });
    }

    if (this.config.provider === 'local') {
      this.ollama = new Ollama({
        host: this.config.ollamaHost || 'http://localhost:11434',
      });
    }
  }

  /**
   * Update configuration and reinitialize providers
   */
  updateConfig(config: Partial<AIConfig>) {
    this.config = { ...this.config, ...config };
    this.initializeProviders();
  }

  /**
   * Check if Ollama is running and accessible
   */
  async checkOllamaStatus(): Promise<boolean> {
    try {
      if (!this.ollama) return false;
      const response = await fetch(this.config.ollamaHost || 'http://localhost:11434/api/tags');
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * List available local models
   */
  async listLocalModels(): Promise<string[]> {
    try {
      if (!this.ollama) return [];
      const response = await this.ollama.list();
      return response.models.map((m: any) => m.name);
    } catch (error) {
      console.error('Failed to list models:', error);
      return [];
    }
  }

  /**
   * Analyze design using configured AI provider
   */
  async analyzeDesign(pageData: PageData): Promise<DesignAnalysis> {
    try {
      switch (this.config.provider) {
        case 'local':
          return await this.analyzeWithLocal(pageData);
        case 'openai':
          return await this.analyzeWithOpenAI(pageData);
        case 'anthropic':
          return await this.analyzeWithAnthropic(pageData);
        default:
          throw new Error('No AI provider configured');
      }
    } catch (error) {
      console.error('AI Analysis Error:', error);
      throw error;
    }
  }

  /**
   * Analyze with local Ollama model
   */
  private async analyzeWithLocal(pageData: PageData): Promise<DesignAnalysis> {
    if (!this.ollama) {
      throw new Error('Ollama not initialized');
    }

    const prompt = this.buildAnalysisPrompt(pageData);
    const model = this.config.localModel || 'gemma2:9b';

    const response = await this.ollama.chat({
      model,
      messages: [
        {
          role: 'system',
          content: 'You are an expert web designer. Analyze websites and return ONLY valid JSON responses.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      stream: false,
      options: {
        temperature: 0.7,
        num_predict: 2000,
      }
    });

    const content = response.message.content;
    return this.parseAIResponse(content, pageData);
  }

  /**
   * Analyze with OpenAI
   */
  private async analyzeWithOpenAI(pageData: PageData): Promise<DesignAnalysis> {
    if (!this.openai) {
      throw new Error('OpenAI not initialized');
    }

    const prompt = this.buildAnalysisPrompt(pageData);

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert web designer and UX specialist. Analyze websites and provide detailed feedback in JSON format.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    return this.parseAIResponse(content, pageData);
  }

  /**
   * Analyze with Anthropic Claude
   */
  private async analyzeWithAnthropic(pageData: PageData): Promise<DesignAnalysis> {
    if (!this.anthropic) {
      throw new Error('Anthropic not initialized');
    }

    const prompt = this.buildAnalysisPrompt(pageData);

    const response = await this.anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
    });

    const content = response.content[0].type === 'text' ? response.content[0].text : '';
    if (!content) {
      throw new Error('No response from Anthropic');
    }

    return this.parseAIResponse(content, pageData);
  }

  /**
   * Build analysis prompt
   */
  private buildAnalysisPrompt(pageData: PageData): string {
    return `Analyze this webpage design and provide a comprehensive evaluation.

URL: ${pageData.url}

Design Elements:
- Colors: ${pageData.colors.slice(0, 10).join(', ')}
- Fonts: ${pageData.fonts.slice(0, 5).join(', ')}
- Images: ${pageData.images}
- Links: ${pageData.links}

HTML Structure (sample):
${pageData.html.substring(0, 800)}

CSS Styles (sample):
${pageData.css.substring(0, 800)}

Return ONLY a valid JSON object with this exact structure:
{
  "score": <number 0-100>,
  "issues": [
    {
      "id": "issue-1",
      "severity": "low|medium|high|critical",
      "category": "color|typography|layout|accessibility|spacing",
      "title": "Issue title",
      "description": "Detailed description",
      "fix": "How to fix it"
    }
  ],
  "suggestions": [
    {
      "id": "suggestion-1",
      "category": "category",
      "title": "Suggestion title",
      "description": "Detailed description",
      "impact": "low|medium|high"
    }
  ],
  "accessibilityScore": <number 0-100>,
  "readabilityScore": <number 0-100>,
  "layoutConsistency": <number 0-100>
}

Focus on: color harmony, typography, layout, accessibility (WCAG 2.1), and user experience.`;
  }

  /**
   * Parse AI response into DesignAnalysis
   */
  private parseAIResponse(content: string, pageData: PageData): DesignAnalysis {
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || 
                       content.match(/```\n([\s\S]*?)\n```/) ||
                       [null, content];
      
      const jsonStr = jsonMatch[1] || content;
      const parsed = JSON.parse(jsonStr);

      // Build complete analysis object
      const analysis: DesignAnalysis = {
        score: parsed.score || 70,
        timestamp: new Date(),
        issues: parsed.issues || [],
        suggestions: parsed.suggestions || [],
        accessibility: {
          score: parsed.accessibilityScore || 70,
          wcagLevel: this.calculateWCAGLevel(parsed.accessibilityScore || 70),
          issues: [],
          passedChecks: 0,
          totalChecks: 0,
        },
        colors: {
          primary: [],
          secondary: [],
          accent: [],
          neutral: [],
          all: pageData.colors.map(hex => ({
            hex,
            rgb: this.hexToRgb(hex),
            hsl: this.hexToHsl(hex),
            usage: 0,
          })),
        },
        typography: {
          fonts: pageData.fonts.map(family => ({
            family,
            weights: [400],
            usage: 0,
            fallback: ['sans-serif'],
          })),
          hierarchy: [],
          readability: {
            score: parsed.readabilityScore || 75,
            lineLength: { min: 0, max: 0, avg: 0 },
            lineHeight: { min: 0, max: 0, avg: 0 },
            fontSize: { min: 0, max: 0, avg: 0 },
          },
          issues: [],
        },
        layout: {
          type: 'mixed',
          consistency: parsed.layoutConsistency || 70,
          spacing: {
            consistent: true,
            values: [],
            issues: [],
          },
          alignment: {
            score: 75,
            issues: [],
          },
          responsive: {
            hasMediaQueries: false,
            breakpoints: [],
            mobileOptimized: false,
          },
        },
      };

      return analysis;
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      // Return default analysis on parse error
      return this.getDefaultAnalysis(pageData);
    }
  }

  /**
   * Get default analysis when AI fails
   */
  private getDefaultAnalysis(pageData: PageData): DesignAnalysis {
    return {
      score: 70,
      timestamp: new Date(),
      issues: [],
      suggestions: [],
      accessibility: {
        score: 70,
        wcagLevel: 'AA',
        issues: [],
        passedChecks: 0,
        totalChecks: 0,
      },
      colors: {
        primary: [],
        secondary: [],
        accent: [],
        neutral: [],
        all: pageData.colors.map(hex => ({
          hex,
          rgb: this.hexToRgb(hex),
          hsl: this.hexToHsl(hex),
          usage: 0,
        })),
      },
      typography: {
        fonts: pageData.fonts.map(family => ({
          family,
          weights: [400],
          usage: 0,
          fallback: ['sans-serif'],
        })),
        hierarchy: [],
        readability: {
          score: 75,
          lineLength: { min: 0, max: 0, avg: 0 },
          lineHeight: { min: 0, max: 0, avg: 0 },
          fontSize: { min: 0, max: 0, avg: 0 },
        },
        issues: [],
      },
      layout: {
        type: 'mixed',
        consistency: 70,
        spacing: {
          consistent: true,
          values: [],
          issues: [],
        },
        alignment: {
          score: 75,
          issues: [],
        },
        responsive: {
          hasMediaQueries: false,
          breakpoints: [],
          mobileOptimized: false,
        },
      },
    };
  }

  private calculateWCAGLevel(score: number): 'A' | 'AA' | 'AAA' | 'fail' {
    if (score >= 90) return 'AAA';
    if (score >= 75) return 'AA';
    if (score >= 60) return 'A';
    return 'fail';
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  }

  private hexToHsl(hex: string): { h: number; s: number; l: number } {
    const rgb = this.hexToRgb(hex);
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  }
}
