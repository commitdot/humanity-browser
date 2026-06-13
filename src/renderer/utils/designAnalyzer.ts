/**
 * Complete Design Analyzer
 * Combines all rule-based analysis tools - NO AI
 * Provides comprehensive design analysis using web standards
 */

import type {
  DesignAnalysis,
  OverallScore,
  AnalysisSummary,
  AnalysisConfig,
} from '../../shared/designAnalysisTypes';

import { accessibilityChecker } from './accessibilityChecker';
import { colorAnalyzer } from './colorAnalyzer';
import { typographyAnalyzer } from './typographyAnalyzer';
import { layoutAnalyzer } from './layoutAnalyzer';

export class DesignAnalyzer {
  /**
   * Analyze complete page design
   */
  async analyzePage(
    url: string,
    html: string,
    config: AnalysisConfig
  ): Promise<DesignAnalysis> {
    const timestamp = new Date();
    
    // Run all enabled analyses in parallel
    const [accessibility, colors, typography, layout] = await Promise.all([
      config.accessibility.enabled 
        ? accessibilityChecker.analyzePage(html, url)
        : this.getEmptyAccessibilityReport(),
      config.colors.enabled
        ? colorAnalyzer.analyzePage(html)
        : this.getEmptyColorReport(),
      config.typography.enabled
        ? typographyAnalyzer.analyzePage(html)
        : this.getEmptyTypographyReport(),
      config.layout.enabled
        ? layoutAnalyzer.analyzePage(html)
        : this.getEmptyLayoutReport(),
    ]);
    
    // Calculate overall score
    const overall = this.calculateOverallScore(
      accessibility,
      colors,
      typography,
      layout,
      config
    );
    
    // Generate summary
    const summary = this.generateSummary(
      accessibility,
      colors,
      typography,
      layout
    );
    
    return {
      url,
      timestamp,
      overall,
      accessibility,
      colors,
      typography,
      layout,
      summary,
    };
  }
  
  /**
   * Calculate overall score
   */
  private calculateOverallScore(
    accessibility: any,
    colors: any,
    typography: any,
    layout: any,
    config: AnalysisConfig
  ): OverallScore {
    const scores = {
      accessibility: config.accessibility.enabled ? accessibility.score : 100,
      colors: config.colors.enabled ? this.calculateColorScore(colors) : 100,
      typography: config.typography.enabled ? this.calculateTypographyScore(typography) : 100,
      layout: config.layout.enabled ? this.calculateLayoutScore(layout) : 100,
    };
    
    // Calculate weighted average
    const enabledCount = Object.values(config).filter(c => c.enabled).length;
    const total = enabledCount > 0
      ? Object.values(scores).reduce((sum, score) => sum + score, 0) / enabledCount
      : 100;
    
    // Determine grade
    let grade: 'A' | 'B' | 'C' | 'D' | 'F';
    if (total >= 90) grade = 'A';
    else if (total >= 80) grade = 'B';
    else if (total >= 70) grade = 'C';
    else if (total >= 60) grade = 'D';
    else grade = 'F';
    
    // Determine level
    let level: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
    if (total >= 90) level = 'excellent';
    else if (total >= 75) level = 'good';
    else if (total >= 60) level = 'fair';
    else if (total >= 40) level = 'poor';
    else level = 'critical';
    
    return {
      total: Math.round(total),
      breakdown: scores,
      grade,
      level,
    };
  }
  
  /**
   * Calculate color score
   */
  private calculateColorScore(colors: any): number {
    let score = 100;
    
    // Deduct for contrast issues
    if (colors.accessibility) {
      const passRate = colors.accessibility.passingAA / colors.accessibility.totalPairs;
      score -= (1 - passRate) * 30;
    }
    
    // Deduct for poor harmony
    if (colors.harmony && !colors.harmony.isHarmonious) {
      score -= 20;
    }
    
    return Math.max(0, Math.round(score));
  }
  
  /**
   * Calculate typography score
   */
  private calculateTypographyScore(typography: any): number {
    let score = 100;
    
    // Deduct for readability issues
    if (typography.readability) {
      if (typography.readability.readabilityLevel === 'poor') score -= 30;
      else if (typography.readability.readabilityLevel === 'fair') score -= 15;
      
      if (!typography.readability.optimalLineLength) score -= 10;
      if (!typography.readability.optimalLineHeight) score -= 10;
    }
    
    // Deduct for hierarchy issues
    if (typography.hierarchy && !typography.hierarchy.isConsistent) {
      score -= 15;
    }
    
    // Deduct for issues
    if (typography.issues) {
      score -= typography.issues.filter((i: any) => i.severity === 'critical').length * 10;
      score -= typography.issues.filter((i: any) => i.severity === 'moderate').length * 5;
    }
    
    return Math.max(0, Math.round(score));
  }
  
  /**
   * Calculate layout score
   */
  private calculateLayoutScore(layout: any): number {
    let score = 100;
    
    // Deduct for complexity
    if (layout.structure && layout.structure.complexity > 70) {
      score -= 20;
    }
    
    // Deduct for spacing issues
    if (layout.spacing && layout.spacing.consistency < 50) {
      score -= 20;
    }
    
    // Deduct for no grid
    if (layout.grid && !layout.grid.hasGrid) {
      score -= 10;
    }
    
    // Deduct for not responsive
    if (layout.responsive && !layout.responsive.isResponsive) {
      score -= 30;
    }
    
    return Math.max(0, Math.round(score));
  }
  
  /**
   * Generate analysis summary
   */
  private generateSummary(
    accessibility: any,
    colors: any,
    typography: any,
    layout: any
  ): AnalysisSummary {
    // Count total issues
    const totalIssues = 
      (accessibility.issues?.length || 0) +
      (colors.suggestions?.length || 0) +
      (typography.issues?.length || 0) +
      (layout.issues?.length || 0);
    
    // Count critical issues
    const criticalIssues = 
      (accessibility.summary?.critical || 0) +
      (typography.issues?.filter((i: any) => i.severity === 'critical').length || 0) +
      (layout.issues?.filter((i: any) => i.severity === 'critical').length || 0);
    
    // Get top issues
    const topIssues: string[] = [];
    
    if (accessibility.summary?.critical > 0) {
      topIssues.push(`${accessibility.summary.critical} critical accessibility issues`);
    }
    if (colors.accessibility?.criticalIssues.length > 0) {
      topIssues.push(`${colors.accessibility.criticalIssues.length} severe contrast issues`);
    }
    if (typography.readability?.readabilityLevel === 'poor') {
      topIssues.push('Poor text readability');
    }
    if (layout.responsive && !layout.responsive.isResponsive) {
      topIssues.push('Not mobile responsive');
    }
    
    // Get quick wins
    const quickWins: string[] = [];
    
    if (accessibility.recommendations) {
      quickWins.push(...accessibility.recommendations.slice(0, 2));
    }
    if (colors.suggestions && colors.suggestions.length > 0) {
      quickWins.push('Fix color contrast issues');
    }
    if (typography.suggestions && typography.suggestions.length > 0) {
      quickWins.push(typography.suggestions[0].reason);
    }
    
    // Estimate time to fix
    const estimatedTime = this.estimateFixTime(totalIssues, criticalIssues);
    
    return {
      totalIssues,
      criticalIssues,
      topIssues: topIssues.slice(0, 5),
      quickWins: quickWins.slice(0, 5),
      estimatedTime,
    };
  }
  
  /**
   * Estimate time to fix issues
   */
  private estimateFixTime(totalIssues: number, criticalIssues: number): string {
    const hours = Math.ceil((criticalIssues * 0.5) + (totalIssues * 0.1));
    
    if (hours < 1) return '< 1 hour';
    if (hours === 1) return '1 hour';
    if (hours < 8) return `${hours} hours`;
    
    const days = Math.ceil(hours / 8);
    return `${days} day${days > 1 ? 's' : ''}`;
  }
  
  /**
   * Get empty reports for disabled analyses
   */
  private getEmptyAccessibilityReport(): any {
    return {
      score: 100,
      wcagLevel: 'AAA' as const,
      issues: [],
      summary: { totalIssues: 0, critical: 0, serious: 0, moderate: 0, minor: 0 },
      recommendations: [],
    };
  }
  
  private getEmptyColorReport(): any {
    return {
      palette: { primary: [], secondary: [], accent: [], neutral: [], all: [] },
      harmony: { type: 'none' as const, score: 100, isHarmonious: true, explanation: '' },
      contrast: { pairs: [], passRate: 100, failingPairs: 0 },
      accessibility: { totalPairs: 0, passingAA: 0, passingAAA: 0, criticalIssues: [], colorBlindSafe: true },
      suggestions: [],
    };
  }
  
  private getEmptyTypographyReport(): any {
    return {
      fonts: [],
      hierarchy: { levels: [], isConsistent: true, scale: 1.5, issues: [] },
      readability: {
        averageLineLength: 60,
        optimalLineLength: true,
        averageLineHeight: 1.5,
        optimalLineHeight: true,
        fleschReadingEase: 80,
        fleschKincaidGrade: 8,
        readabilityLevel: 'excellent' as const,
      },
      issues: [],
      suggestions: [],
    };
  }
  
  private getEmptyLayoutReport(): any {
    return {
      structure: { type: 'mixed' as const, complexity: 0, nesting: 0, landmarks: [] },
      spacing: {
        margins: { values: [], mostCommon: [], variance: 0, isConsistent: true },
        paddings: { values: [], mostCommon: [], variance: 0, isConsistent: true },
        consistency: 100,
        scale: [],
        issues: [],
      },
      grid: { hasGrid: false, columns: 0, gutter: 0, alignment: 100, issues: [] },
      responsive: { breakpoints: [], isResponsive: true, mobileOptimized: true, issues: [] },
      issues: [],
      suggestions: [],
    };
  }
}

// Export singleton instance
export const designAnalyzer = new DesignAnalyzer();

// Export default configuration
export const defaultAnalysisConfig: AnalysisConfig = {
  accessibility: {
    enabled: true,
    wcagLevel: 'AA',
    includeWarnings: true,
  },
  colors: {
    enabled: true,
    checkContrast: true,
    checkHarmony: true,
    checkAccessibility: true,
  },
  typography: {
    enabled: true,
    checkReadability: true,
    checkHierarchy: true,
    checkLineLength: true,
  },
  layout: {
    enabled: true,
    checkSpacing: true,
    checkGrid: true,
    checkResponsive: true,
  },
};

// Made with Bob
