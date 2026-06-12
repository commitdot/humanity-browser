import {
  AIDetectionResult,
  ContentAuthenticityLevel,
  AI_SERVICE_DOMAINS,
  AI_TEXT_PATTERNS,
  AI_API_PATTERNS,
} from '@shared/humanityTypes';

export class AIDetector {
  /**
   * Detect if a URL is an AI service
   */
  detectAIService(url: string): boolean {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname.toLowerCase();
      
      return AI_SERVICE_DOMAINS.some(aiDomain => 
        domain === aiDomain || domain.endsWith(`.${aiDomain}`)
      );
    } catch {
      return false;
    }
  }

  /**
   * Detect AI-generated text content
   */
  detectAIText(text: string): { isAI: boolean; confidence: number; matches: string[] } {
    if (!text || text.length < 50) {
      return { isAI: false, confidence: 0, matches: [] };
    }

    const matches: string[] = [];
    let matchCount = 0;

    // Check for AI signature patterns
    for (const pattern of AI_TEXT_PATTERNS) {
      if (pattern.test(text)) {
        matchCount++;
        matches.push(pattern.source);
      }
    }

    // Check for repetitive patterns (AI tends to be repetitive)
    const repetitiveness = this.calculateRepetitiveness(text);
    if (repetitiveness > 0.7) {
      matchCount++;
      matches.push('High repetitiveness detected');
    }

    // Check for unnatural perfection (no typos, perfect grammar)
    const perfection = this.calculatePerfection(text);
    if (perfection > 0.9) {
      matchCount++;
      matches.push('Unnaturally perfect text');
    }

    const confidence = Math.min(matchCount * 25, 100);
    const isAI = confidence >= 50;

    return { isAI, confidence, matches };
  }

  /**
   * Detect AI API calls in page
   */
  detectAIAPICalls(html: string): string[] {
    const detectedAPIs: string[] = [];

    for (const pattern of AI_API_PATTERNS) {
      if (html.includes(pattern)) {
        detectedAPIs.push(pattern);
      }
    }

    // Check for common AI SDK imports
    const aiSDKPatterns = [
      'openai',
      'anthropic',
      '@anthropic-ai',
      'google-generativeai',
      'cohere-ai',
    ];

    for (const sdk of aiSDKPatterns) {
      if (html.includes(sdk)) {
        detectedAPIs.push(`SDK: ${sdk}`);
      }
    }

    return detectedAPIs;
  }

  /**
   * Analyze entire page for AI content
   */
  async analyzePage(url: string, html: string, text: string): Promise<AIDetectionResult> {
    const detectedServices: string[] = [];
    const reasons: string[] = [];
    let totalConfidence = 0;
    let confidenceFactors = 0;

    // Check if URL is AI service
    if (this.detectAIService(url)) {
      detectedServices.push(new URL(url).hostname);
      reasons.push('AI service domain detected');
      totalConfidence += 100;
      confidenceFactors++;
    }

    // Check for AI text patterns
    const textAnalysis = this.detectAIText(text);
    if (textAnalysis.isAI) {
      reasons.push(...textAnalysis.matches);
      totalConfidence += textAnalysis.confidence;
      confidenceFactors++;
    }

    // Check for AI API calls
    const apiCalls = this.detectAIAPICalls(html);
    if (apiCalls.length > 0) {
      detectedServices.push(...apiCalls);
      reasons.push(`${apiCalls.length} AI API call(s) detected`);
      totalConfidence += Math.min(apiCalls.length * 30, 100);
      confidenceFactors++;
    }

    // Check for AI-related meta tags
    const hasAIMeta = this.checkAIMetaTags(html);
    if (hasAIMeta) {
      reasons.push('AI-related meta tags found');
      totalConfidence += 50;
      confidenceFactors++;
    }

    // Calculate final confidence
    const confidence = confidenceFactors > 0 
      ? Math.min(totalConfidence / confidenceFactors, 100)
      : 0;

    // Determine authenticity level
    const level = this.determineAuthenticityLevel(confidence, detectedServices.length);
    const isAI = confidence >= 50 || detectedServices.length > 0;

    return {
      isAI,
      confidence: Math.round(confidence),
      level,
      reasons,
      detectedServices,
      timestamp: new Date(),
    };
  }

  /**
   * Calculate text repetitiveness
   */
  private calculateRepetitiveness(text: string): number {
    const words = text.toLowerCase().split(/\s+/);
    if (words.length < 10) return 0;

    const wordFreq = new Map<string, number>();
    for (const word of words) {
      if (word.length > 3) { // Ignore short words
        wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
      }
    }

    let repetitiveWords = 0;
    for (const count of wordFreq.values()) {
      if (count > 3) repetitiveWords++;
    }

    return repetitiveWords / wordFreq.size;
  }

  /**
   * Calculate text perfection (lack of human errors)
   */
  private calculatePerfection(text: string): number {
    let perfectionScore = 0;
    let checks = 0;

    // Check for typos (humans make typos)
    const hasTypos = /\b(teh|recieve|occured|seperate|definately)\b/i.test(text);
    if (!hasTypos) perfectionScore++;
    checks++;

    // Check for informal language (humans use it)
    const hasInformal = /\b(gonna|wanna|kinda|sorta|yeah|nope)\b/i.test(text);
    if (!hasInformal) perfectionScore++;
    checks++;

    // Check for contractions (humans use them)
    const hasContractions = /\b(don't|can't|won't|shouldn't|wouldn't)\b/i.test(text);
    if (!hasContractions && text.length > 100) perfectionScore++;
    checks++;

    // Check for personal pronouns (humans use "I", "we", "my")
    const hasPersonal = /\b(I|we|my|our|me)\b/i.test(text);
    if (!hasPersonal && text.length > 100) perfectionScore++;
    checks++;

    return perfectionScore / checks;
  }

  /**
   * Check for AI-related meta tags
   */
  private checkAIMetaTags(html: string): boolean {
    const aiMetaPatterns = [
      'ai-generated',
      'generated-by-ai',
      'chatgpt',
      'claude',
      'gpt-',
      'artificial-intelligence',
    ];

    const lowerHTML = html.toLowerCase();
    return aiMetaPatterns.some(pattern => lowerHTML.includes(pattern));
  }

  /**
   * Determine content authenticity level
   */
  private determineAuthenticityLevel(
    confidence: number,
    servicesCount: number
  ): ContentAuthenticityLevel {
    if (servicesCount > 0 || confidence >= 80) {
      return 'ai-generated';
    }
    if (confidence >= 60) {
      return 'mixed-content';
    }
    if (confidence >= 30) {
      return 'likely-human';
    }
    if (confidence < 30 && confidence > 0) {
      return 'likely-human';
    }
    if (confidence === 0) {
      return 'verified-human';
    }
    return 'unknown';
  }

  /**
   * Quick check if URL should be blocked
   */
  shouldBlockURL(url: string): boolean {
    return this.detectAIService(url);
  }

  /**
   * Extract text content from HTML
   */
  extractTextFromHTML(html: string): string {
    // Remove script and style tags
    let text = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
    
    // Remove HTML tags
    text = text.replace(/<[^>]+>/g, ' ');
    
    // Decode HTML entities
    text = text.replace(/&nbsp;/g, ' ');
    text = text.replace(/&/g, '&');
    text = text.replace(/</g, '<');
    text = text.replace(/>/g, '>');
    text = text.replace(/"/g, '"');
    
    // Clean up whitespace
    text = text.replace(/\s+/g, ' ').trim();
    
    return text;
  }
}

// Export singleton instance
export const aiDetector = new AIDetector();
