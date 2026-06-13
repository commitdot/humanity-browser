/**
 * Typography Analysis Tool
 * Formula-based readability analysis - NO AI
 * Based on typography principles and readability formulas
 */

import type {
  TypographyReport,
  FontInfo,
  TypographyHierarchy,
  HierarchyLevel,
  ReadabilityMetrics,
  TypographyIssue,
  TypographySuggestion,
} from '../../shared/designAnalysisTypes';

export class TypographyAnalyzer {
  /**
   * Analyze typography in a page
   */
  async analyzePage(html: string): Promise<TypographyReport> {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Extract font information
    const fonts = this.extractFonts(doc);
    
    // Analyze hierarchy
    const hierarchy = this.analyzeHierarchy(doc);
    
    // Calculate readability metrics
    const readability = this.calculateReadability(doc);
    
    // Identify issues
    const issues = this.identifyIssues(doc, hierarchy, readability);
    
    // Generate suggestions
    const suggestions = this.generateSuggestions(fonts, hierarchy, readability, issues);
    
    return {
      fonts,
      hierarchy,
      readability,
      issues,
      suggestions,
    };
  }
  
  /**
   * Extract font information from document
   */
  private extractFonts(doc: Document): FontInfo[] {
    const fontMap = new Map<string, FontInfo>();
    const elements = doc.querySelectorAll('*');
    
    elements.forEach((element) => {
      const styles = window.getComputedStyle(element as Element);
      const fontFamily = styles.fontFamily.split(',')[0].trim().replace(/['"]/g, '');
      const fontWeight = parseInt(styles.fontWeight);
      const fontStyle = styles.fontStyle;
      
      if (fontFamily && this.isVisible(element as HTMLElement)) {
        const existing = fontMap.get(fontFamily);
        if (existing) {
          existing.usage++;
          if (!existing.weights.includes(fontWeight)) {
            existing.weights.push(fontWeight);
          }
          if (!existing.styles.includes(fontStyle)) {
            existing.styles.push(fontStyle);
          }
          existing.elements.push(this.getSelector(element as HTMLElement));
        } else {
          fontMap.set(fontFamily, {
            family: fontFamily,
            weights: [fontWeight],
            styles: [fontStyle],
            usage: 1,
            elements: [this.getSelector(element as HTMLElement)],
          });
        }
      }
    });
    
    return Array.from(fontMap.values()).sort((a, b) => b.usage - a.usage);
  }
  
  /**
   * Analyze typography hierarchy
   */
  private analyzeHierarchy(doc: Document): TypographyHierarchy {
    const levels: HierarchyLevel[] = [];
    const headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    
    headings.forEach((tag, index) => {
      const elements = doc.querySelectorAll(tag);
      if (elements.length > 0) {
        const sizes: number[] = [];
        const weights: number[] = [];
        const lineHeights: number[] = [];
        
        elements.forEach((element) => {
          const styles = window.getComputedStyle(element as Element);
          sizes.push(parseFloat(styles.fontSize));
          weights.push(parseInt(styles.fontWeight));
          lineHeights.push(parseFloat(styles.lineHeight) / parseFloat(styles.fontSize));
        });
        
        levels.push({
          level: index + 1,
          fontSize: this.average(sizes),
          fontWeight: this.average(weights),
          lineHeight: this.average(lineHeights),
          usage: elements.length,
        });
      }
    });
    
    // Check consistency
    const isConsistent = this.checkHierarchyConsistency(levels);
    
    // Detect modular scale
    const scale = this.detectModularScale(levels);
    
    // Identify issues
    const issues = this.identifyHierarchyIssues(levels);
    
    return {
      levels,
      isConsistent,
      scale,
      issues,
    };
  }
  
  /**
   * Check if hierarchy is consistent
   */
  private checkHierarchyConsistency(levels: HierarchyLevel[]): boolean {
    if (levels.length < 2) return true;
    
    // Check if font sizes decrease consistently
    for (let i = 0; i < levels.length - 1; i++) {
      if (levels[i].fontSize <= levels[i + 1].fontSize) {
        return false;
      }
    }
    
    return true;
  }
  
  /**
   * Detect modular scale ratio
   */
  private detectModularScale(levels: HierarchyLevel[]): number {
    if (levels.length < 2) return 1.5; // Default golden ratio
    
    const ratios: number[] = [];
    for (let i = 0; i < levels.length - 1; i++) {
      const ratio = levels[i].fontSize / levels[i + 1].fontSize;
      ratios.push(ratio);
    }
    
    return this.average(ratios);
  }
  
  /**
   * Identify hierarchy issues
   */
  private identifyHierarchyIssues(levels: HierarchyLevel[]): string[] {
    const issues: string[] = [];
    
    if (levels.length === 0) {
      issues.push('No heading hierarchy detected');
      return issues;
    }
    
    // Check for missing levels
    for (let i = 0; i < levels.length - 1; i++) {
      if (levels[i + 1].level - levels[i].level > 1) {
        issues.push(`Heading level skipped from h${levels[i].level} to h${levels[i + 1].level}`);
      }
    }
    
    // Check for inconsistent sizing
    if (!this.checkHierarchyConsistency(levels)) {
      issues.push('Heading sizes are not consistently decreasing');
    }
    
    // Check for too many font weights
    const weights = new Set(levels.map(l => l.fontWeight));
    if (weights.size > 3) {
      issues.push('Too many font weights used in headings');
    }
    
    return issues;
  }
  
  /**
   * Calculate readability metrics
   */
  private calculateReadability(doc: Document): ReadabilityMetrics {
    const textElements = doc.querySelectorAll('p, li, td, div');
    const lineLengths: number[] = [];
    const lineHeights: number[] = [];
    let totalText = '';
    
    textElements.forEach((element) => {
      const text = element.textContent?.trim() || '';
      if (text.length > 20) { // Only consider substantial text
        const styles = window.getComputedStyle(element as Element);
        const fontSize = parseFloat(styles.fontSize);
        const lineHeight = parseFloat(styles.lineHeight);
        const width = (element as HTMLElement).offsetWidth;
        
        // Estimate characters per line
        const charsPerLine = Math.floor(width / (fontSize * 0.6));
        lineLengths.push(charsPerLine);
        lineHeights.push(lineHeight / fontSize);
        
        totalText += text + ' ';
      }
    });
    
    const averageLineLength = this.average(lineLengths);
    const averageLineHeight = this.average(lineHeights);
    
    // Calculate Flesch Reading Ease
    const fleschReadingEase = this.calculateFleschReadingEase(totalText);
    
    // Calculate Flesch-Kincaid Grade Level
    const fleschKincaidGrade = this.calculateFleschKincaidGrade(totalText);
    
    // Determine readability level
    let readabilityLevel: 'excellent' | 'good' | 'fair' | 'poor';
    if (fleschReadingEase >= 80) readabilityLevel = 'excellent';
    else if (fleschReadingEase >= 60) readabilityLevel = 'good';
    else if (fleschReadingEase >= 40) readabilityLevel = 'fair';
    else readabilityLevel = 'poor';
    
    return {
      averageLineLength,
      optimalLineLength: averageLineLength >= 45 && averageLineLength <= 75,
      averageLineHeight,
      optimalLineHeight: averageLineHeight >= 1.4 && averageLineHeight <= 1.6,
      fleschReadingEase,
      fleschKincaidGrade,
      readabilityLevel,
    };
  }
  
  /**
   * Calculate Flesch Reading Ease score
   * Formula: 206.835 - 1.015 * (words/sentences) - 84.6 * (syllables/words)
   */
  private calculateFleschReadingEase(text: string): number {
    const words = this.countWords(text);
    const sentences = this.countSentences(text);
    const syllables = this.countSyllables(text);
    
    if (words === 0 || sentences === 0) return 0;
    
    const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
    return Math.max(0, Math.min(100, score));
  }
  
  /**
   * Calculate Flesch-Kincaid Grade Level
   * Formula: 0.39 * (words/sentences) + 11.8 * (syllables/words) - 15.59
   */
  private calculateFleschKincaidGrade(text: string): number {
    const words = this.countWords(text);
    const sentences = this.countSentences(text);
    const syllables = this.countSyllables(text);
    
    if (words === 0 || sentences === 0) return 0;
    
    const grade = 0.39 * (words / sentences) + 11.8 * (syllables / words) - 15.59;
    return Math.max(0, grade);
  }
  
  /**
   * Count words in text
   */
  private countWords(text: string): number {
    return text.split(/\s+/).filter(word => word.length > 0).length;
  }
  
  /**
   * Count sentences in text
   */
  private countSentences(text: string): number {
    return text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0).length;
  }
  
  /**
   * Count syllables in text (approximation)
   */
  private countSyllables(text: string): number {
    const words = text.toLowerCase().split(/\s+/);
    let totalSyllables = 0;
    
    words.forEach(word => {
      // Remove non-alphabetic characters
      word = word.replace(/[^a-z]/g, '');
      if (word.length === 0) return;
      
      // Count vowel groups
      const vowelGroups = word.match(/[aeiouy]+/g);
      let syllables = vowelGroups ? vowelGroups.length : 0;
      
      // Adjust for silent e
      if (word.endsWith('e')) syllables--;
      
      // Ensure at least one syllable
      if (syllables === 0) syllables = 1;
      
      totalSyllables += syllables;
    });
    
    return totalSyllables;
  }
  
  /**
   * Identify typography issues
   */
  private identifyIssues(
    doc: Document,
    hierarchy: TypographyHierarchy,
    readability: ReadabilityMetrics
  ): TypographyIssue[] {
    const issues: TypographyIssue[] = [];
    
    // Check line length
    if (!readability.optimalLineLength) {
      issues.push({
        type: 'line-length',
        severity: 'moderate',
        description: `Average line length is ${Math.round(readability.averageLineLength)} characters (optimal: 45-75)`,
        element: 'p, div',
        recommendation: 'Adjust container width or font size to achieve 45-75 characters per line',
      });
    }
    
    // Check line height
    if (!readability.optimalLineHeight) {
      issues.push({
        type: 'line-height',
        severity: 'moderate',
        description: `Average line height is ${readability.averageLineHeight.toFixed(2)} (optimal: 1.4-1.6)`,
        element: 'p, div',
        recommendation: 'Set line-height to 1.5 for better readability',
      });
    }
    
    // Check readability
    if (readability.readabilityLevel === 'poor') {
      issues.push({
        type: 'font-size',
        severity: 'moderate',
        description: `Text readability is poor (Flesch score: ${Math.round(readability.fleschReadingEase)})`,
        element: 'body',
        recommendation: 'Simplify language or increase font size for better readability',
      });
    }
    
    // Check hierarchy
    if (!hierarchy.isConsistent) {
      issues.push({
        type: 'hierarchy',
        severity: 'moderate',
        description: 'Heading hierarchy is inconsistent',
        element: 'h1, h2, h3, h4, h5, h6',
        recommendation: 'Ensure heading sizes decrease consistently from h1 to h6',
      });
    }
    
    // Check for small text
    const smallText = doc.querySelectorAll('*');
    smallText.forEach((element) => {
      const styles = window.getComputedStyle(element as Element);
      const fontSize = parseFloat(styles.fontSize);
      
      if (fontSize < 14 && this.isVisible(element as HTMLElement)) {
        issues.push({
          type: 'font-size',
          severity: 'critical',
          description: `Text is too small: ${fontSize}px (minimum: 14px)`,
          element: this.getSelector(element as HTMLElement),
          recommendation: 'Increase font size to at least 14px for body text',
        });
      }
    });
    
    return issues;
  }
  
  /**
   * Generate typography suggestions
   */
  private generateSuggestions(
    fonts: FontInfo[],
    hierarchy: TypographyHierarchy,
    readability: ReadabilityMetrics,
    issues: TypographyIssue[]
  ): TypographySuggestion[] {
    const suggestions: TypographySuggestion[] = [];
    
    // Suggest line height improvement
    if (!readability.optimalLineHeight) {
      suggestions.push({
        type: 'line-height',
        current: `${readability.averageLineHeight.toFixed(2)}`,
        suggested: '1.5',
        reason: 'Optimal line height improves readability',
      });
    }
    
    // Suggest line length improvement
    if (!readability.optimalLineLength) {
      const targetWidth = readability.averageLineLength > 75 ? 'narrower' : 'wider';
      suggestions.push({
        type: 'line-length',
        current: `${Math.round(readability.averageLineLength)} characters`,
        suggested: '60 characters (45-75 range)',
        reason: `Make containers ${targetWidth} for optimal reading`,
      });
    }
    
    // Suggest font size improvements
    if (readability.readabilityLevel === 'poor' || readability.readabilityLevel === 'fair') {
      suggestions.push({
        type: 'font-size',
        current: 'Current size',
        suggested: 'Increase by 2-4px',
        reason: 'Larger text improves readability',
      });
    }
    
    // Suggest font pairing if too many fonts
    if (fonts.length > 3) {
      suggestions.push({
        type: 'font-pairing',
        current: `${fonts.length} different fonts`,
        suggested: '2-3 fonts maximum',
        reason: 'Too many fonts create visual chaos',
      });
    }
    
    // Suggest hierarchy improvements
    if (!hierarchy.isConsistent) {
      suggestions.push({
        type: 'font-size',
        current: 'Inconsistent hierarchy',
        suggested: `Use modular scale (ratio: ${hierarchy.scale.toFixed(2)})`,
        reason: 'Consistent scale creates visual harmony',
      });
    }
    
    return suggestions;
  }
  
  /**
   * Calculate average of numbers
   */
  private average(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
  }
  
  /**
   * Check if element is visible
   */
  private isVisible(element: HTMLElement): boolean {
    const styles = window.getComputedStyle(element);
    return styles.display !== 'none' && 
           styles.visibility !== 'hidden' && 
           styles.opacity !== '0';
  }
  
  /**
   * Get CSS selector for element
   */
  private getSelector(element: HTMLElement): string {
    if (element.id) return `#${element.id}`;
    if (element.className) {
      const classes = element.className.split(' ').filter(c => c).join('.');
      return `${element.tagName.toLowerCase()}.${classes}`;
    }
    return element.tagName.toLowerCase();
  }
}

// Export singleton instance
export const typographyAnalyzer = new TypographyAnalyzer();

// Made with Bob
